import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CubeCoord, ColorTheme, ViewProjection } from '../types';
import { projectCubes3D, Face3D } from '../utils/isometric';
import { sounds } from '../utils/sound';
import {
  RotateCw,
  RotateCcw,
  Eye,
  Layers,
  ZoomIn,
  ZoomOut,
  Grid,
  Sparkles,
  CheckCircle2,
  Compass,
  Play,
  Pause,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowDownCircle,
  Box,
} from 'lucide-react';

interface IsometricCubeCanvasProps {
  cubes: CubeCoord[];
  gridSize?: { rows: number; cols: number; maxZ: number };
  interactiveTapCount?: boolean;
  tappedCubeIds?: string[];
  onCubeTap?: (cubeId: string, countIndex: number) => void;
  colorTheme?: ColorTheme;
  isXRayMode?: boolean;
  onToggleXRay?: () => void;
  highlightLayer?: number | null;
  explodeGap?: number;
  onExplodeGapChange?: (gap: number) => void;
  showNumbers?: boolean;
}

export const IsometricCubeCanvas: React.FC<IsometricCubeCanvasProps> = ({
  cubes,
  gridSize = { rows: 3, cols: 3, maxZ: 3 },
  interactiveTapCount = true,
  tappedCubeIds = [],
  onCubeTap,
  colorTheme = 'sky_blue',
  isXRayMode = false,
  onToggleXRay,
  highlightLayer = null,
  explodeGap = 0,
  onExplodeGapChange,
  showNumbers = true,
}) => {
  // 3D Euler Angles: Yaw (0..360 horizontal) and Pitch (10..89.5 vertical tilt)
  const [yaw, setYaw] = useState<number>(45);
  const [pitch, setPitch] = useState<number>(36);
  const [scale, setScale] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewProjection>('iso');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [hoveredCubeId, setHoveredCubeId] = useState<string | null>(null);

  // Drag-to-rotate interaction state
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; startYaw: number; startPitch: number }>({
    x: 0,
    y: 0,
    startYaw: 45,
    startPitch: 36,
  });
  const hasDraggedFarRef = useRef<boolean>(false);

  // Auto-rotate turntable loop
  useEffect(() => {
    let animId: number;
    if (isAutoRotating) {
      const step = () => {
        setYaw((prev) => (prev + 0.6) % 360);
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isAutoRotating]);

  // Compute bounding box / dimensions
  const maxRows = Math.max(gridSize.rows, ...cubes.map((c) => c.x + 1), 3);
  const maxCols = Math.max(gridSize.cols, ...cubes.map((c) => c.y + 1), 3);
  const maxZ = Math.max(gridSize.maxZ, ...cubes.map((c) => c.z + 1), 2);

  const cubeSize = useMemo(() => {
    const maxDim = Math.max(maxRows, maxCols, maxZ);
    if (maxDim <= 2) return 68;
    if (maxDim <= 3) return 56;
    if (maxDim <= 4) return 46;
    return 38;
  }, [maxRows, maxCols, maxZ]);

  const svgWidth = 620;
  const svgHeight = 440;
  const originX = svgWidth / 2;
  const originY = svgHeight / 2 + 10;

  // Project 3D cubes using current Yaw & Pitch
  const scene = useMemo(() => {
    return projectCubes3D(cubes, cubeSize, originX, originY, yaw, pitch, explodeGap);
  }, [cubes, cubeSize, originX, originY, yaw, pitch, explodeGap]);

  const isTopDownView = pitch >= 78;

  // Color calculation with dynamic light shading
  const getFaceShading = (face: Face3D, isTapped: boolean, isHovered: boolean) => {
    const { cube, lightFactor, faceType } = face;

    if (isTapped) {
      // Golden celebratory amber
      const baseR = 245, baseG = 158, baseB = 11;
      const factor = faceType === 'top' ? 1.05 : lightFactor;
      return {
        fill: `rgb(${Math.round(baseR * factor)}, ${Math.round(baseG * factor)}, ${Math.round(baseB * factor)})`,
        stroke: '#b45309',
        opacity: 0.95,
      };
    }

    if (isXRayMode) {
      // User Image 3 blueprint transparent glass look
      return {
        fill: 'rgba(56, 189, 248, 0.38)',
        stroke: '#0284c7',
        opacity: 0.85,
      };
    }

    if (colorTheme === 'by_layer') {
      const layerPalette = [
        { r: 34, g: 197, b: 94 },  // Tầng 1: Green
        { r: 234, g: 179, b: 8 },  // Tầng 2: Yellow
        { r: 168, g: 85, b: 247 }, // Tầng 3: Purple
        { r: 244, g: 63, b: 94 },  // Tầng 4: Rose
      ];
      const base = layerPalette[cube.z % layerPalette.length];
      const factor = faceType === 'top' ? 1.15 : lightFactor;
      return {
        fill: `rgb(${Math.min(255, Math.round(base.r * factor))}, ${Math.min(255, Math.round(base.g * factor))}, ${Math.min(255, Math.round(base.b * factor))})`,
        stroke: '#1e293b',
        opacity: 0.92,
      };
    }

    if (colorTheme === 'pastel') {
      const base = { r: 250, g: 204, b: 21 };
      const factor = faceType === 'top' ? 1.15 : lightFactor;
      return {
        fill: `rgb(${Math.min(255, Math.round(base.r * factor))}, ${Math.min(255, Math.round(base.g * factor))}, ${Math.min(255, Math.round(base.b * factor))})`,
        stroke: '#ca8a04',
        opacity: 0.95,
      };
    }

    // Default 'sky_blue' / 'classic' (like User Image 1)
    if (faceType === 'top') {
      return {
        fill: isHovered ? '#e0f2fe' : '#f8fafc',
        stroke: '#1e3a8a',
        opacity: 0.96,
      };
    }

    const baseR = 59, baseG = 130, baseB = 246;
    const factor = lightFactor * 0.95;
    return {
      fill: `rgb(${Math.round(baseR * factor)}, ${Math.round(baseG * factor)}, ${Math.round(baseB * factor)})`,
      stroke: '#1e3a8a',
      opacity: 0.95,
    };
  };

  // Drag-to-rotate pointer handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    hasDraggedFarRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startYaw: yaw,
      startPitch: pitch,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasDraggedFarRef.current = true;
      if (isAutoRotating) {
        setIsAutoRotating(false);
      }
    }

    // Horizontal drag changes yaw (0..360)
    const newYaw = (dragStartRef.current.startYaw + dx * 0.6 + 360) % 360;
    // Vertical drag changes pitch: up to 89.5° (direct top-down view)
    const newPitch = Math.max(10, Math.min(89.5, dragStartRef.current.startPitch - dy * 0.45));

    setYaw(newYaw);
    setPitch(newPitch);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const handleCubeClick = (cubeId: string) => {
    if (hasDraggedFarRef.current) return;

    sounds.playClick();
    if (!interactiveTapCount || !onCubeTap) return;

    const currentIdx = tappedCubeIds.indexOf(cubeId);
    const newCount = currentIdx === -1 ? tappedCubeIds.length + 1 : currentIdx + 1;
    sounds.playCountNote(newCount);
    onCubeTap(cubeId, newCount);
  };

  // Preset angle shortcuts
  const applyPreset = (presetYaw: number, presetPitch: number) => {
    sounds.playClick();
    setIsAutoRotating(false);
    setViewMode('iso');
    setYaw(presetYaw);
    setPitch(presetPitch);
  };

  // 2D grid plan matrix
  const gridHeights = useMemo(() => {
    const matrix: number[][] = Array.from({ length: maxRows }, () => Array(maxCols).fill(0));
    cubes.forEach((c) => {
      if (c.x < maxRows && c.y < maxCols) {
        matrix[c.x][c.y] = Math.max(matrix[c.x][c.y], c.z + 1);
      }
    });
    return matrix;
  }, [cubes, maxRows, maxCols]);

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* 3D Canvas Container */}
      <div
        className="relative w-full max-w-[660px] aspect-[4/3] bg-gradient-to-b from-sky-50/70 via-white to-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {viewMode === 'iso' ? (
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full transition-transform duration-75 pointer-events-none"
            style={{ transform: `scale(${scale})` }}
          >
            <defs>
              <radialGradient id="stageFloorShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#64748b" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Base platform shadow */}
            <ellipse
              cx={originX}
              cy={originY + (isTopDownView ? 30 : 70)}
              rx={cubeSize * 3.6}
              ry={cubeSize * (isTopDownView ? 2.8 : 1.8)}
              fill="url(#stageFloorShadow)"
            />

            {/* Render 3D Faces in back-to-front depth order */}
            {scene.faces.map((face) => {
              if (face.isBackface && !isXRayMode) {
                return null;
              }

              const isTapped = tappedCubeIds.includes(face.cubeId);
              const isHovered = hoveredCubeId === face.cubeId;
              const isDimmed = highlightLayer !== null && face.cube.z !== highlightLayer;
              const colors = getFaceShading(face, isTapped, isHovered);

              return (
                <polygon
                  key={face.id}
                  points={face.points}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isXRayMode ? (face.isBackface ? '1.0' : '1.8') : '1.6'}
                  strokeDasharray={isXRayMode && face.isBackface ? '2 2' : undefined}
                  strokeLinejoin="round"
                  className="pointer-events-auto transition-colors duration-100"
                  style={{
                    opacity: isDimmed ? 0.2 : colors.opacity,
                    cursor: interactiveTapCount ? 'pointer' : 'grab',
                  }}
                  onMouseEnter={() => setHoveredCubeId(face.cubeId)}
                  onMouseLeave={() => setHoveredCubeId(null)}
                  onClick={() => handleCubeClick(face.cubeId)}
                />
              );
            })}

            {/* Tapped Numbers Badges (rendered on cube centers) */}
            {Object.entries(scene.cubeCenters).map(([cubeId, center]) => {
              const isTapped = tappedCubeIds.includes(cubeId);
              if (!isTapped) return null;
              const tapIndex = tappedCubeIds.indexOf(cubeId);

              return (
                <g
                  key={`badge_${cubeId}`}
                  transform={`translate(${center.x}, ${center.y})`}
                  className="pointer-events-none"
                >
                  <circle
                    r={cubeSize * 0.28}
                    fill="#b45309"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    fontSize={cubeSize * 0.32}
                    fontWeight="800"
                    className="font-mono"
                  >
                    {tapIndex + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          /* Top-down 2D grid plan view */
          <div className="flex flex-col items-center justify-center p-6 w-full h-full animate-fadeIn pointer-events-auto">
            <div className="text-center mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Mặt bằng số học (Nhìn từ trên xuống)
              </span>
              <p className="text-sm font-medium text-slate-700">
                Mỗi ô vuông ghi số khối lập phương chồng lên nhau (độ cao của cột)
              </p>
            </div>
            <div
              className="grid gap-2 p-3 bg-white border-2 border-dashed border-sky-300 rounded-xl shadow-inner"
              style={{
                gridTemplateColumns: `repeat(${maxCols}, minmax(48px, 64px))`,
                gridTemplateRows: `repeat(${maxRows}, minmax(48px, 64px))`,
              }}
            >
              {gridHeights.map((row, rIdx) =>
                row.map((height, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg border font-mono text-base font-bold transition-all ${
                      height > 0
                        ? 'bg-sky-100 text-sky-800 border-sky-400 shadow-sm'
                        : 'bg-slate-50 text-slate-300 border-slate-200'
                    }`}
                  >
                    {height > 0 ? (
                      <>
                        <span className="text-lg font-black text-sky-900">{height}</span>
                        <span className="text-[10px] font-sans font-medium text-sky-600">khối</span>
                      </>
                    ) : (
                      '·'
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Top-Left Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs pointer-events-none">
          <Compass className="w-4 h-4 text-sky-600 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-xs font-bold text-slate-700">
            {isTopDownView ? '👁️ Đang nhìn từ trên xuống' : 'Kéo chuột/vuốt để xoay 360°'}
          </span>
          {interactiveTapCount && (
            <span className="text-xs font-bold text-amber-700 border-l border-slate-200 pl-2">
              Đã đếm: {tappedCubeIds.length}/{cubes.length}
            </span>
          )}
        </div>

        {/* Top-Right View Controls: Top-Down Shortcut, Auto-Rotate & Zoom */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm p-1.5 rounded-xl border border-slate-200 shadow-xs">
          {/* Prominent Quick Top-Down 3D Button */}
          <button
            onClick={() => applyPreset(0, 89)}
            title="Xem góc nhìn 3D trực tiếp từ trên xuống"
            className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-extrabold shadow-2xs ${
              isTopDownView && viewMode === 'iso'
                ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4 text-current" />
            <span>Từ Trên Xuống</span>
          </button>

          {/* Auto-Rotate Turntable Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsAutoRotating(!isAutoRotating);
            }}
            title={isAutoRotating ? 'Dừng tự động xoay' : 'Bật tự động xoay 360°'}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold ${
              isAutoRotating
                ? 'bg-amber-500 text-white shadow-xs animate-pulse'
                : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50'
            }`}
          >
            {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAutoRotating ? 'Dừng xoay' : 'Tự xoay'}</span>
          </button>

          {/* Toggle 2D Grid Plan */}
          <button
            onClick={() => {
              sounds.playClick();
              setViewMode((prev) => (prev === 'iso' ? 'top' : 'iso'));
            }}
            title="Xem mặt bằng lưới số học"
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold ${
              viewMode === 'top'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span className="hidden sm:inline">{viewMode === 'iso' ? 'Lưới số' : '3D'}</span>
          </button>

          {/* Zoom In / Out */}
          <button
            onClick={() => {
              sounds.playClick();
              setScale((s) => Math.min(s + 0.15, 1.45));
            }}
            title="Phóng to"
            className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setScale((s) => Math.max(s - 0.15, 0.75));
            }}
            title="Thu nhỏ"
            className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Preset Rotation Angles Bar at Bottom of Canvas */}
        <div className="absolute bottom-3 flex flex-wrap items-center justify-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md max-w-[94%]">
          <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">
            Góc nhìn:
          </span>

          {/* Top-down preset button */}
          <button
            onClick={() => applyPreset(0, 89)}
            className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1 ${
              isTopDownView
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
            title="Nhìn thẳng từ trên nóc xuống"
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span>Từ trên xuống</span>
          </button>

          <button
            onClick={() => applyPreset(45, 36)}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
              !isTopDownView && yaw === 45 && pitch === 36
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800'
            }`}
            title="Góc 3D Isometric chuẩn"
          >
            Chuẩn 3D
          </button>

          <button
            onClick={() => applyPreset(0, 22)}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 transition-colors"
            title="Nhìn thẳng phía trước"
          >
            Mặt trước
          </button>

          <button
            onClick={() => applyPreset(180, 36)}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 transition-colors"
            title="Xoay 180° ra sau lưng để tìm các khối bị ẩn"
          >
            Mặt sau (Khối ẩn)
          </button>

          <button
            onClick={() => applyPreset(90, 28)}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 transition-colors hidden sm:inline"
            title="Nhìn từ bên trái"
          >
            Bên trái
          </button>

          <button
            onClick={() => applyPreset(270, 28)}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 transition-colors hidden sm:inline"
            title="Nhìn từ bên phải"
          >
            Bên phải
          </button>
        </div>
      </div>

      {/* Manual Directional Rotation Pad & Features Toolbar */}
      <div className="w-full max-w-[660px] mt-3 flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
        {/* Step Rotation D-Pad */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <span className="text-[11px] font-bold text-slate-500 px-1 hidden sm:inline">
            Xoay:
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              setIsAutoRotating(false);
              setYaw((y) => (y - 30 + 360) % 360);
            }}
            title="Xoay sang trái 30°"
            className="p-1.5 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-lg shadow-2xs font-bold text-xs flex items-center gap-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Trái</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setIsAutoRotating(false);
              setYaw((y) => (y + 30) % 360);
            }}
            title="Xoay sang phải 30°"
            className="p-1.5 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-lg shadow-2xs font-bold text-xs flex items-center gap-0.5"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">Phải</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setPitch((p) => Math.min(89, p + 12));
            }}
            title="Nâng góc nhìn lên cao (hướng từ trên xuống)"
            className="p-1.5 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-lg shadow-2xs font-bold text-xs"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setPitch((p) => Math.max(10, p - 12));
            }}
            title="Hạ góc nhìn xuống thấp"
            className="p-1.5 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-lg shadow-2xs font-bold text-xs"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* X-Ray Button */}
        <button
          onClick={() => {
            sounds.playClick();
            if (onToggleXRay) onToggleXRay();
          }}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
            isXRayMode
              ? 'bg-sky-600 text-white shadow-xs ring-2 ring-sky-300'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{isXRayMode ? 'Đang bật X-Ray' : 'X-Ray (Khối ẩn)'}</span>
        </button>

        {/* Explode Layers Slider */}
        {onExplodeGapChange && (
          <div className="flex items-center gap-2 grow max-w-[220px]">
            <Layers className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="flex flex-col grow">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <span>Bóc tách tầng:</span>
                <span className="font-mono text-sky-600">{explodeGap > 0 ? `${explodeGap}px` : 'Gộp'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={explodeGap}
                onChange={(e) => onExplodeGapChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

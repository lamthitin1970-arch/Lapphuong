import React, { useState } from 'react';
import { CubeCoord } from '../types';
import { IsometricCubeCanvas } from './IsometricCubeCanvas';
import { sounds } from '../utils/sound';
import {
  Plus,
  Trash2,
  Share2,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Eye,
  CheckCircle2,
  Layers,
  Wand2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BuilderMode: React.FC = () => {
  const [gridSize, setGridSize] = useState<number>(3); // 3x3 base
  const [cubes, setCubes] = useState<CubeCoord[]>([
    { x: 0, y: 0, z: 0, id: 'c_0_0_0' },
    { x: 1, y: 0, z: 0, id: 'c_1_0_0' },
    { x: 0, y: 1, z: 0, id: 'c_0_1_0' },
    { x: 0, y: 0, z: 1, id: 'c_0_0_1' },
  ]);
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [isChallengeActive, setIsChallengeActive] = useState<boolean>(false);
  const [challengeGuess, setChallengeGuess] = useState<string>('');
  const [challengeResult, setChallengeResult] = useState<'correct' | 'wrong' | null>(null);
  const [explodeGap, setExplodeGap] = useState<number>(0);
  const [isXRayMode, setIsXRayMode] = useState<boolean>(false);

  // Calculate current heights on grid
  const heightMap: number[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  cubes.forEach((c) => {
    if (c.x < gridSize && c.y < gridSize) {
      heightMap[c.x][c.y] = Math.max(heightMap[c.x][c.y], c.z + 1);
    }
  });

  // Calculate layer breakdown
  const layersCount = () => {
    const counts: { [z: number]: number } = {};
    cubes.forEach((c) => {
      counts[c.z] = (counts[c.z] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([z, count]) => ({ layer: Number(z) + 1, count }))
      .sort((a, b) => a.layer - b.layer);
  };

  const handleAddCubeAt = (x: number, y: number) => {
    sounds.playClick();
    const currentH = heightMap[x][y];
    if (currentH >= 4) {
      // Max height 4
      return;
    }
    const newCube: CubeCoord = {
      x,
      y,
      z: currentH,
      id: `b_${x}_${y}_${currentH}_${Date.now()}`,
    };
    setCubes([...cubes, newCube]);
    sounds.playCountNote(cubes.length + 1);
  };

  const handleRemoveCubeAt = (x: number, y: number) => {
    sounds.playClick();
    const currentH = heightMap[x][y];
    if (currentH <= 0) return;

    // Remove the highest cube at (x, y)
    const targetZ = currentH - 1;
    setCubes(cubes.filter((c) => !(c.x === x && c.y === y && c.z === targetZ)));
  };

  const handleClearAll = () => {
    sounds.playClick();
    setCubes([]);
    setIsChallengeActive(false);
  };

  const loadPreset = (type: 'stairs' | 'pyramid' | 'u_shape') => {
    sounds.playClick();
    let newCubes: CubeCoord[] = [];
    if (type === 'stairs') {
      newCubes = [
        { x: 0, y: 0, z: 0, id: 'st_1' },
        { x: 0, y: 0, z: 1, id: 'st_2' },
        { x: 0, y: 0, z: 2, id: 'st_3' },
        { x: 1, y: 0, z: 0, id: 'st_4' },
        { x: 1, y: 0, z: 1, id: 'st_5' },
        { x: 2, y: 0, z: 0, id: 'st_6' },
      ];
    } else if (type === 'pyramid') {
      newCubes = [
        { x: 0, y: 0, z: 0, id: 'p_1' },
        { x: 1, y: 0, z: 0, id: 'p_2' },
        { x: 0, y: 1, z: 0, id: 'p_3' },
        { x: 2, y: 0, z: 0, id: 'p_4' },
        { x: 1, y: 1, z: 0, id: 'p_5' },
        { x: 0, y: 2, z: 0, id: 'p_6' },
        { x: 0, y: 0, z: 1, id: 'p_7' },
        { x: 1, y: 0, z: 1, id: 'p_8' },
        { x: 0, y: 1, z: 1, id: 'p_9' },
        { x: 0, y: 0, z: 2, id: 'p_10' },
      ];
    } else if (type === 'u_shape') {
      newCubes = [
        { x: 0, y: 0, z: 0, id: 'u_1' },
        { x: 0, y: 0, z: 1, id: 'u_2' },
        { x: 1, y: 0, z: 0, id: 'u_3' },
        { x: 2, y: 0, z: 0, id: 'u_4' },
        { x: 2, y: 0, z: 1, id: 'u_5' },
      ];
    }
    setCubes(newCubes);
    setIsChallengeActive(false);
  };

  const handleCheckChallenge = () => {
    const val = parseInt(challengeGuess);
    if (val === cubes.length) {
      setChallengeResult('correct');
      sounds.playVictory();
      sounds.speakVietnamese(`Đoán đúng rồi! Có tất cả ${cubes.length} khối lập phương!`);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setChallengeResult('wrong');
      sounds.playWrong();
      sounds.speakVietnamese('Chưa đúng rồi, hãy đếm lại cẩn thận nhé!');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Xưởng Xếp Khối Sáng Tạo
          </span>
          <h2 className="text-xl font-extrabold text-slate-900">
            Bé Tự Xếp Khối & Đố Bạn
          </h2>
        </div>

        {/* Preset quick buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Mẫu sẵn:</span>
          <button
            onClick={() => loadPreset('stairs')}
            className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Bậc thang (6)
          </button>
          <button
            onClick={() => loadPreset('pyramid')}
            className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Tháp chóp (10)
          </button>
          <button
            onClick={() => loadPreset('u_shape')}
            className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Chữ U (5)
          </button>
          <button
            onClick={handleClearAll}
            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
            title="Xóa hết để xếp lại"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Builder Grid: Canvas on Left / Control Grid on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Isometric Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <IsometricCubeCanvas
            cubes={cubes}
            gridSize={{ rows: gridSize, cols: gridSize, maxZ: 4 }}
            interactiveTapCount={isChallengeActive}
            colorTheme="by_layer"
            isXRayMode={isXRayMode}
            onToggleXRay={() => setIsXRayMode(!isXRayMode)}
            explodeGap={explodeGap}
            onExplodeGapChange={setExplodeGap}
          />
        </div>

        {/* Right Column: Ground Grid Clicker & Challenge Mode */}
        <div className="lg:col-span-5 space-y-4">
          {!isChallengeActive ? (
            /* Builder Mode: Interactive 2D Grid */
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Plus className="w-5 h-5 text-sky-600" />
                  <span>Bấm vào ô để thêm khối (+ / -)</span>
                </h3>
                <span className="font-mono text-sm font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                  Tổng: {cubes.length} khối
                </span>
              </div>

              <p className="text-xs text-slate-600">
                Nhấp chuột trái hoặc chạm vào ô vuông để xếp thêm khối lập phương chồng lên cao (tối đa 4 tầng):
              </p>

              {/* 2D Clickable Grid */}
              <div
                className="grid gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                }}
              >
                {heightMap.map((row, rIdx) =>
                  row.map((height, cIdx) => (
                    <div
                      key={`grid_${rIdx}_${cIdx}`}
                      className="aspect-square flex flex-col items-center justify-center p-2 rounded-xl border bg-white shadow-xs hover:border-sky-400 transition-all relative group"
                    >
                      <span className="font-mono text-xl font-black text-slate-800">
                        {height}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {height > 0 ? `Tầng ${height}` : 'Trống'}
                      </span>

                      {/* Mini Action Buttons */}
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          onClick={() => handleAddCubeAt(rIdx, cIdx)}
                          className="w-6 h-6 rounded-md bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center font-bold text-xs"
                          title="Thêm 1 khối"
                        >
                          +
                        </button>
                        {height > 0 && (
                          <button
                            onClick={() => handleRemoveCubeAt(rIdx, cIdx)}
                            className="w-6 h-6 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-700 flex items-center justify-center font-bold text-xs"
                            title="Bớt 1 khối"
                          >
                            -
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Live Layer Breakdown */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-700 block mb-1">
                  Phân tích tầng hiện tại:
                </span>
                {layersCount().length === 0 ? (
                  <p className="text-slate-400 italic">Chưa có khối nào.</p>
                ) : (
                  layersCount().map((l) => (
                    <div
                      key={l.layer}
                      className="flex items-center justify-between text-slate-600"
                    >
                      <span>• Tầng {l.layer}:</span>
                      <span className="font-mono font-bold text-sky-700">
                        {l.count} khối
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Challenge Button */}
              {cubes.length > 0 && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsChallengeActive(true);
                    setChallengeGuess('');
                    setChallengeResult(null);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold rounded-xl shadow-xs flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Tạo Câu Đố "Đố Bạn Đếm Được!"</span>
                </button>
              )}
            </div>
          ) : (
            /* Challenge Mode: Count this structure! */
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    🎯
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">
                    Thử Thách: Bạn hãy đếm xem!
                  </h3>
                </div>
                <button
                  onClick={() => setIsChallengeActive(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline"
                >
                  Quay lại sửa khối
                </button>
              </div>

              <p className="text-sm font-semibold text-slate-800">
                Hãy quan sát hình 3D bên trái và nhập số khối lập phương bạn đếm được:
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Nhập số khối..."
                  value={challengeGuess}
                  onChange={(e) => setChallengeGuess(e.target.value)}
                  className="grow px-4 py-3 rounded-xl border border-slate-300 font-mono text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={handleCheckChallenge}
                  disabled={!challengeGuess}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-xs disabled:opacity-50"
                >
                  Kiểm tra
                </button>
              </div>

              {challengeResult === 'correct' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold">
                    Xuất sắc! Bạn đã đếm chính xác {cubes.length} khối lập phương!
                  </span>
                </div>
              )}

              {challengeResult === 'wrong' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Chưa đúng rồi! Hãy bật X-Ray hoặc xoay góc nhìn để đếm lại nhé!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LevelData, DifficultyLevel, ColorTheme } from '../types';
import { LEVELS } from '../data/levels';
import { IsometricCubeCanvas } from './IsometricCubeCanvas';
import { sounds } from '../utils/sound';
import {
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Star,
  Award,
  Layers,
  Lightbulb,
  ArrowRight,
  Check,
  Eye,
} from 'lucide-react';

interface PracticeModeProps {
  onOpenGuide: () => void;
  colorTheme: ColorTheme;
  onChangeColorTheme: (theme: ColorTheme) => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  onOpenGuide,
  colorTheme,
  onChangeColorTheme,
}) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(8); // Default to Level 9 (Pyramid image from prompt)
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [tappedCubeIds, setTappedCubeIds] = useState<string[]>([]);
  const [explodeGap, setExplodeGap] = useState<number>(0);
  const [isXRayMode, setIsXRayMode] = useState<boolean>(false);

  // Store completed levels in localStorage
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('grade2_cubes_completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const level = LEVELS[currentLevelIndex] || LEVELS[0];

  // Filtered levels for easy selection
  const filteredLevels = LEVELS.filter(
    (lvl) => selectedDifficulty === 'all' || lvl.difficulty === selectedDifficulty
  );

  // Reset state when level changes
  useEffect(() => {
    setUserAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);
    setShowExplanation(false);
    setTappedCubeIds([]);
    setExplodeGap(0);
    // If level is reference image 3 or specifically X-Ray, default X-Ray to true
    if (level.id === 14) {
      setIsXRayMode(true);
    } else {
      setIsXRayMode(false);
    }
  }, [currentLevelIndex, level.id]);

  const handleCubeTap = (cubeId: string) => {
    setTappedCubeIds((prev) => {
      if (prev.includes(cubeId)) {
        return prev.filter((id) => id !== cubeId);
      } else {
        return [...prev, cubeId];
      }
    });
  };

  const handleClearTaps = () => {
    sounds.playClick();
    setTappedCubeIds([]);
  };

  const handleCheckAnswer = (answerValue: number) => {
    const isRight = answerValue === level.answer;
    setIsAnswered(true);
    setIsCorrect(isRight);
    setShowExplanation(true);

    if (isRight) {
      sounds.playVictory();
      sounds.speakVietnamese(`Chính xác! Có tất cả ${level.answer} khối lập phương. Bé giỏi lắm!`);

      // Trigger colorful celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'],
      });

      // Update completed levels
      if (!completedLevels.includes(level.id)) {
        const nextCompleted = [...completedLevels, level.id];
        setCompletedLevels(nextCompleted);
        try {
          localStorage.setItem('grade2_cubes_completed', JSON.stringify(nextCompleted));
        } catch {}
      }
    } else {
      sounds.playWrong();
      sounds.speakVietnamese('Chưa chính xác rồi bé ơi, thử lại nhé!');
    }
  };

  const handleNextLevel = () => {
    sounds.playClick();
    if (currentLevelIndex < LEVELS.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    } else {
      setCurrentLevelIndex(0);
    }
  };

  const handlePrevLevel = () => {
    sounds.playClick();
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Level Selection Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedDifficulty('all');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              selectedDifficulty === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({LEVELS.length})
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedDifficulty('de');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              selectedDifficulty === 'de'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            Mức 1: Khởi động (1-6 khối)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedDifficulty('trung_binh');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              selectedDifficulty === 'trung_binh'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            Mức 2: Khối tầng (6-12 khối)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedDifficulty('thu_thach');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              selectedDifficulty === 'thu_thach'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-700 hover:bg-indigo-50'
            }`}
          >
            Mức 3: Thử thách SGK (12-24 khối)
          </button>
        </div>

        {/* Level Pager & Completed Count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>
              Đã hoàn thành:{' '}
              <strong className="text-slate-900 font-bold">{completedLevels.length}</strong>/
              {LEVELS.length} bài
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevLevel}
              disabled={currentLevelIndex === 0}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold px-2 text-slate-800">
              Bài {level.id} / {LEVELS.length}
            </span>
            <button
              onClick={handleNextLevel}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Split: 3D Stage on Left / Question & Answering on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 3D Interactive Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                {level.difficultyLabel}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">{level.title}</h2>
            </div>

            {/* Quick Palette Swatch */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => onChangeColorTheme('sky_blue')}
                title="Màu xanh nguyên bản"
                className={`w-5 h-5 rounded-md bg-blue-500 transition-all ${
                  colorTheme === 'sky_blue' ? 'ring-2 ring-slate-800 scale-110' : 'opacity-70'
                }`}
              />
              <button
                onClick={() => onChangeColorTheme('by_layer')}
                title="Màu phân biệt theo tầng"
                className={`w-5 h-5 rounded-md bg-gradient-to-tr from-green-400 via-amber-400 to-purple-500 transition-all ${
                  colorTheme === 'by_layer' ? 'ring-2 ring-slate-800 scale-110' : 'opacity-70'
                }`}
              />
              <button
                onClick={() => onChangeColorTheme('pastel')}
                title="Màu pastel tươi sáng"
                className={`w-5 h-5 rounded-md bg-amber-300 transition-all ${
                  colorTheme === 'pastel' ? 'ring-2 ring-slate-800 scale-110' : 'opacity-70'
                }`}
              />
            </div>
          </div>

          {/* 3D Canvas */}
          <IsometricCubeCanvas
            cubes={level.cubes}
            gridSize={level.gridSize}
            interactiveTapCount={true}
            tappedCubeIds={tappedCubeIds}
            onCubeTap={handleCubeTap}
            colorTheme={colorTheme}
            isXRayMode={isXRayMode}
            onToggleXRay={() => setIsXRayMode(!isXRayMode)}
            explodeGap={explodeGap}
            onExplodeGapChange={setExplodeGap}
          />

          {/* Tap-to-count controls */}
          <div className="w-full max-w-[660px] mt-2 flex items-center justify-between text-xs text-slate-500 px-2">
            <span>
              💡 <em>Mẹo: Bé có thể bấm trực tiếp vào từng khối lập phương trên hình để đánh số!</em>
            </span>
            {tappedCubeIds.length > 0 && (
              <button
                onClick={handleClearTaps}
                className="text-amber-600 hover:text-amber-800 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa số đã đếm</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Prompt & Answer Console (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Question Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-black text-sm">
                ?
              </span>
              <h3 className="text-base font-bold text-slate-800">Câu hỏi luyện tập:</h3>
            </div>

            <p className="text-lg font-extrabold text-slate-900 leading-snug">
              Hình bên có tất cả bao nhiêu khối lập phương nhỏ?
            </p>

            {/* Answer Options (Multiple Choice) */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-500">
                Chọn đáp án đúng (hoặc bé bấm số):
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {level.options.map((opt) => {
                  const isSelected = userAnswer === opt.toString();
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        sounds.playClick();
                        setUserAnswer(opt.toString());
                        handleCheckAnswer(opt);
                      }}
                      className={`py-3.5 px-4 rounded-xl font-mono text-xl font-black border-2 transition-all flex items-center justify-center gap-2 ${
                        isSelected && isAnswered
                          ? isCorrect
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-102'
                            : 'bg-rose-500 border-rose-600 text-white shadow-md'
                          : isAnswered && opt === level.answer
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-300'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-900 active:scale-98'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className="text-xs font-sans font-normal text-current opacity-80">
                        khối
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Tap-to-submit shortcut if child counted all cubes */}
            {tappedCubeIds.length > 0 && !isAnswered && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setUserAnswer(tappedCubeIds.length.toString());
                    handleCheckAnswer(tappedCubeIds.length);
                  }}
                  className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-amber-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>
                    Nộp kết quả theo số khối bé vừa chạm ({tappedCubeIds.length} khối)
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Feedback & Pedagogical Explanation Box */}
          {isAnswered && (
            <div
              className={`rounded-2xl p-5 border transition-all animate-fadeIn ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="grow space-y-2">
                  <h4 className="font-bold text-base">
                    {isCorrect ? 'Tuyệt vời! Bé trả lời rất chính xác! 🎉' : 'Chưa đúng rồi bé ơi! Đừng nản lòng nhé!'}
                  </h4>
                  <p className="text-xs leading-relaxed opacity-90">
                    Đáp án đúng là: <strong className="text-sm font-black">{level.answer} khối lập phương</strong>.
                  </p>

                  {/* Layer Breakdown Solution (Phương pháp bóc tầng chuẩn Toán Lớp 2) */}
                  <div className="mt-3 bg-white/90 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-800 space-y-2">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                      <Layers className="w-4 h-4 text-sky-600" />
                      <span>Cách đếm bóc tách theo tầng:</span>
                    </p>
                    <div className="space-y-1">
                      {level.explanation.layers.map((layer) => (
                        <div
                          key={layer.layerNum}
                          className="flex items-center justify-between py-0.5 border-b border-slate-100 last:border-none"
                        >
                          <span className="text-slate-600 font-medium">• {layer.name}:</span>
                          <span className="font-mono font-bold text-sky-700">{layer.count} khối</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900">
                      <span>Tổng cộng tất cả:</span>
                      <span className="text-sm text-emerald-700 font-mono">
                        {level.explanation.layers.map((l) => l.count).join(' + ')} = {level.answer} khối
                      </span>
                    </div>

                    {level.explanation.hiddenCount > 0 && (
                      <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                        ⚠️ <strong>Lưu ý:</strong> Có {level.explanation.hiddenCount} khối bị che khuất ở tầng dưới làm chân đỡ!
                      </div>
                    )}
                  </div>

                  {/* Next Question Button */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={handleNextLevel}
                      className="grow py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>Bài tiếp theo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    {!isCorrect && (
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setIsAnswered(false);
                        }}
                        className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                      >
                        Đếm lại
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Guidance Box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Chưa hiểu cách đếm khối ẩn?</span>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenGuide();
              }}
              className="text-sky-600 hover:text-sky-800 font-bold underline cursor-pointer"
            >
              Xem bí quyết Toán lớp 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

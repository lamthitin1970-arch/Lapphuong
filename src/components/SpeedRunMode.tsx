import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LevelData } from '../types';
import { generate5QuestionRubikChallenge } from '../utils/rubikGenerator';
import { IsometricCubeCanvas } from './IsometricCubeCanvas';
import { sounds } from '../utils/sound';
import {
  Trophy,
  Timer,
  Star,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Medal,
  Dices,
  Layers,
  HelpCircle,
  Check,
} from 'lucide-react';

export const SpeedRunMode: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [questions, setQuestions] = useState<LevelData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [explodeGap, setExplodeGap] = useState<number>(0);
  const [isXRayMode, setIsXRayMode] = useState<boolean>(false);
  const [tappedCubeIds, setTappedCubeIds] = useState<string[]>([]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isFinished) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isFinished]);

  const startNewQuiz = () => {
    sounds.playClick();
    // Generate fresh 5 questions strictly bounded in 3x3x3 Rubik
    const new5 = generate5QuestionRubikChallenge();
    setQuestions(new5);
    setCurrentIndex(0);
    setScore(0);
    setTimerSeconds(0);
    setIsFinished(false);
    setIsPlaying(true);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setExplodeGap(0);
    setIsXRayMode(false);
    setTappedCubeIds([]);
  };

  const currentQ = questions[currentIndex];

  const handleCubeTap = (cubeId: string) => {
    setTappedCubeIds((prev) =>
      prev.includes(cubeId) ? prev.filter((id) => id !== cubeId) : [...prev, cubeId]
    );
  };

  const handleSelectAnswer = (ans: number) => {
    if (isSubmitted) return;
    sounds.playClick();
    setSelectedAnswer(ans);
    setIsSubmitted(true);

    if (ans === currentQ.answer) {
      setScore((s) => s + 1);
      sounds.playVictory();
      sounds.speakVietnamese(`Đúng rồi! Có ${currentQ.answer} khối!`);
    } else {
      sounds.playWrong();
      sounds.speakVietnamese(`Chưa đúng rồi! Đáp án là ${currentQ.answer} khối.`);
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((idx) => idx + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
      setExplodeGap(0);
      setIsXRayMode(false);
      setTappedCubeIds([]);
    } else {
      setIsFinished(true);
      sounds.playVictory();
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.5 },
        colors: ['#0284c7', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'],
      });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Welcome Screen
  if (!isPlaying) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-10 text-center space-y-6">
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-amber-200 animate-float">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Giới Hạn Khối Rubik 3×3×3
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Thử Thách 5 Câu Hỏi Ngẫu Nhiên
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Mỗi lần bắt đầu, hệ thống sẽ tự động tạo ngẫu nhiên một đề thi gồm <strong>đúng 5 câu hỏi</strong> mô hình 3D khối lập phương, tất cả đều nằm trong không gian khối Rubik 3×3×3!
          </p>
        </div>

        {/* 3 Highlights */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto py-2 text-center text-xs font-bold text-slate-700">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xl font-black text-sky-600 block">5 Câu</span>
            <span className="text-slate-500 font-semibold">Tự sinh mới</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xl font-black text-amber-600 block">3×3×3</span>
            <span className="text-slate-500 font-semibold">Khung Rubik</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xl font-black text-emerald-600 block">360°</span>
            <span className="text-slate-500 font-semibold">Xoay & Trên xuống</span>
          </div>
        </div>

        <button
          onClick={startNewQuiz}
          className="px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-base rounded-2xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 mx-auto"
        >
          <Dices className="w-5 h-5" />
          <span>Tạo Đề Thử Thách 5 Câu Ngay!</span>
        </button>
      </div>
    );
  }

  // Finished Screen (Result after 5 questions)
  if (isFinished) {
    let medalTitle = 'Nhà Thám Hiểm Rubik 🎖️';
    let medalSub = 'Bé đã rất nỗ lực, hãy thử lại để đạt điểm tuyệt đối nhé!';
    if (score === 5) {
      medalTitle = 'Huy Chương Vàng Rubik 3×3×3 🏆';
      medalSub = 'Tuyệt đỉnh! Bé đã trả lời đúng toàn bộ 5/5 câu hỏi!';
    } else if (score >= 4) {
      medalTitle = 'Huy Chương Bạc Rubik 3×3×3 🌟';
      medalSub = 'Rất xuất sắc! Bé đã làm đúng 4/5 câu hỏi!';
    } else if (score === 3) {
      medalTitle = 'Huy Chương Đồng Rubik 3×3×3 🥉';
      medalSub = 'Làm tốt lắm! Bé đã hoàn thành trên một nửa số câu!';
    }

    return (
      <div className="w-full max-w-md mx-auto px-4 py-10 text-center space-y-6 bg-white rounded-3xl border border-slate-200 shadow-xl animate-fadeIn">
        <div className="w-20 h-20 bg-amber-400 text-white rounded-full mx-auto flex items-center justify-center shadow-lg animate-bounce">
          <Medal className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Kết quả bài thử thách 5 câu
          </span>
          <h2 className="text-2xl font-black text-slate-900">{medalTitle}</h2>
          <p className="text-xs text-slate-600 px-4">{medalSub}</p>
        </div>

        {/* Score & Time Card */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4 text-center">
          <div>
            <span className="text-4xl font-black font-mono text-sky-600 block">
              {score}/5
            </span>
            <span className="text-xs font-bold text-slate-500">Số câu đúng</span>
          </div>
          <div>
            <span className="text-4xl font-black font-mono text-amber-600 block">
              {formatTime(timerSeconds)}
            </span>
            <span className="text-xs font-bold text-slate-500">Thời gian làm bài</span>
          </div>
        </div>

        {/* Star Rating Icons */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          {[1, 2, 3, 4, 5].map((idx) => (
            <Star
              key={idx}
              className={`w-7 h-7 ${
                idx <= score
                  ? 'text-amber-500 fill-amber-400 animate-pulse'
                  : 'text-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={startNewQuiz}
            className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <Dices className="w-4 h-4" />
            <span>Tạo Bộ 5 Câu Ngẫu Nhiên Mới</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Quiz (Question 1 of 5)
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-5 animate-fadeIn">
      {/* Quiz Progress & Timer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-xs gap-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-500 text-white text-xs font-black rounded-lg">
            Câu {currentIndex + 1} / 5
          </span>
          <span className="text-sm font-bold text-slate-800">{currentQ.title}</span>
          <span className="hidden md:inline text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
            Khung Rubik 3×3×3
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* 5-Question Step Indicators */}
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all ${
                  step === currentIndex
                    ? 'bg-amber-500 ring-2 ring-amber-200 scale-110'
                    : step < currentIndex
                    ? 'bg-emerald-500'
                    : 'bg-slate-200'
                }`}
                title={`Câu ${step + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 text-slate-600 text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
            <Timer className="w-4 h-4 text-amber-500" />
            <span>{formatTime(timerSeconds)}</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-emerald-500 text-emerald-600" />
            <span>{score}/5 đúng</span>
          </div>
        </div>
      </div>

      {/* Main question stage */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: 3D Stage with continuous 360 rotation & top-down view */}
        <div className="md:col-span-7">
          <IsometricCubeCanvas
            cubes={currentQ.cubes}
            gridSize={{ rows: 3, cols: 3, maxZ: 3 }}
            interactiveTapCount={true}
            tappedCubeIds={tappedCubeIds}
            onCubeTap={handleCubeTap}
            colorTheme="classic"
            isXRayMode={isXRayMode}
            onToggleXRay={() => setIsXRayMode(!isXRayMode)}
            explodeGap={explodeGap}
            onExplodeGapChange={setExplodeGap}
          />
        </div>

        {/* Right: Question Prompt, Answer Cards, and Pedagogical Solution */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-600">
                {currentQ.difficultyLabel}
              </span>
              <h3 className="font-black text-slate-900 text-lg leading-snug">
                Hình trong khung Rubik 3×3×3 có bao nhiêu khối lập phương?
              </h3>
            </div>

            {/* Answer Options */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500">
                Bé chọn đáp án đúng:
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {currentQ.options.map((opt) => {
                  const isThisSelected = selectedAnswer === opt;
                  const isCorrect = opt === currentQ.answer;

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectAnswer(opt)}
                      disabled={isSubmitted}
                      className={`py-3.5 px-3 rounded-xl font-mono text-xl font-black border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isSubmitted
                          ? isCorrect
                            ? 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-102'
                            : isThisSelected
                            ? 'bg-rose-500 border-rose-600 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50 active:scale-98'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className="text-xs font-sans font-normal opacity-80">khối</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tap-to-count answer suggestion button */}
            {tappedCubeIds.length > 0 && !isSubmitted && (
              <button
                onClick={() => handleSelectAnswer(tappedCubeIds.length)}
                className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-amber-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4 text-amber-600" />
                <span>Nộp số khối bé vừa chạm ({tappedCubeIds.length} khối)</span>
              </button>
            )}

            {/* Pedagogical Explanation & Next Button after answering */}
            {isSubmitted && (
              <div className="pt-2 space-y-3 animate-fadeIn">
                <div
                  className={`p-3.5 rounded-xl border text-xs ${
                    selectedAnswer === currentQ.answer
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <p className="font-extrabold text-sm mb-1">
                    {selectedAnswer === currentQ.answer
                      ? 'Chính xác! Bé đếm rất chuẩn! 🎉'
                      : `Chưa đúng rồi! Đáp án đúng là ${currentQ.answer} khối.`}
                  </p>

                  {/* Layer Breakdown */}
                  <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/60 space-y-1 text-slate-800 font-medium mt-2">
                    <p className="font-bold text-slate-900 flex items-center gap-1 text-[11px]">
                      <Layers className="w-3.5 h-3.5 text-sky-600" />
                      <span>Bóc tách theo 3 tầng Rubik:</span>
                    </p>
                    {currentQ.explanation.layers.map((l) => (
                      <div key={l.layerNum} className="flex justify-between py-0.5 border-b border-slate-100 last:border-none">
                        <span>• {l.name}:</span>
                        <span className="font-mono font-bold text-sky-700">{l.count} khối</span>
                      </div>
                    ))}
                    <div className="pt-1 border-t border-slate-200 font-bold flex justify-between text-slate-900">
                      <span>Tổng:</span>
                      <span className="font-mono text-emerald-700">
                        {currentQ.explanation.layers.map((l) => l.count).join(' + ')} = {currentQ.answer} khối
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>{currentIndex + 1 === 5 ? 'Xem Kết Quả & Cúp Vinh Danh 🏆' : 'Sang Câu Tiếp Theo'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

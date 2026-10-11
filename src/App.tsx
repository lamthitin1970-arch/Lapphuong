import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PracticeMode } from './components/PracticeMode';
import { SpeedRunMode } from './components/SpeedRunMode';
import { BuilderMode } from './components/BuilderMode';
import { TheoryGuideModal } from './components/TheoryGuideModal';
import { ColorTheme } from './types';
import { sounds } from './utils/sound';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'practice' | 'speed_run' | 'builder'>('practice');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('sky_blue');
  const [completedCount, setCompletedCount] = useState<number>(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('grade2_cubes_completed');
      if (saved) {
        const arr = JSON.parse(saved);
        setCompletedCount(Array.isArray(arr) ? arr.length : 0);
      }
    } catch {
      // fallback
    }
  }, [currentTab]);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenGuide={() => setIsGuideOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        starsCount={completedCount}
      />

      {/* Main Tab Content */}
      <main className="grow">
        {currentTab === 'practice' && (
          <PracticeMode
            onOpenGuide={() => setIsGuideOpen(true)}
            colorTheme={colorTheme}
            onChangeColorTheme={setColorTheme}
          />
        )}

        {currentTab === 'speed_run' && <SpeedRunMode />}

        {currentTab === 'builder' && <BuilderMode />}
      </main>

      {/* Clean Pedagogical Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">
              Bé Vui Đếm Khối Lập Phương
            </span>
            <span>·</span>
            <span>Chương trình Toán Lớp 2</span>
            <span>·</span>
            <span>Hình học không gian trực quan</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-sky-600 transition-colors"
            >
              Phương pháp giải
            </button>
            <span>·</span>
            <span>Tương tác 3D Isometric & X-Ray</span>
          </div>
        </div>
      </footer>

      {/* Theory Guide Modal */}
      <TheoryGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}

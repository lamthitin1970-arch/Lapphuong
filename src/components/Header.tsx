import React from 'react';
import { Volume2, VolumeX, BookOpen, Star, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';

interface HeaderProps {
  currentTab: 'practice' | 'speed_run' | 'builder';
  onSelectTab: (tab: 'practice' | 'speed_run' | 'builder') => void;
  onOpenGuide: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  starsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenGuide,
  isMuted,
  onToggleMute,
  starsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('practice');
          }}
          className="text-lg font-black tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black text-base shadow-xs">
            🧊
          </span>
          <span className="hidden sm:inline">Bé Vui Đếm Khối Lập Phương</span>
          <span className="sm:hidden">Đếm Khối Lớp 2</span>
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="flex items-center gap-1 sm:gap-4 text-xs sm:text-sm font-bold text-slate-600">
          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('practice');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'practice'
                ? 'bg-sky-100 text-sky-800'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Luyện Tập
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('speed_run');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'speed_run'
                ? 'bg-amber-100 text-amber-800'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Thử Thách
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('builder');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'builder'
                ? 'bg-purple-100 text-purple-800'
                : 'hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Xưởng Xếp
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onOpenGuide();
            }}
            className="hidden md:flex items-center gap-1 text-slate-600 hover:text-sky-600 whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Bí Quyết Đếm</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action & sound control */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-amber-800 font-mono text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{starsCount} ⭐</span>
          </div>

          <button
            onClick={onToggleMute}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
          </button>

          <button
            onClick={onOpenGuide}
            className="md:hidden p-2 text-sky-600 hover:bg-sky-50 rounded-lg"
            title="Bí quyết đếm"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

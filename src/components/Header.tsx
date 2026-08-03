import React from 'react';
import { Flame, Star, Trophy, Moon, Sun, BookOpenCheck, Sparkles, Lightbulb } from 'lucide-react';
import { UserStats, ActiveTab } from '../types';

interface HeaderProps {
  stats: UserStats;
  onToggleDarkMode: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  onToggleDarkMode,
  onSelectTab,
  onOpenGuide,
}) => {
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md text-white border-b border-indigo-900/50 shadow-lg px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Greeting */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-indigo-500/30 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <img 
              src="/src/assets/images/app_icon_1785759784947.jpg" 
              alt="App Icon" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                Student Routine & AI
              </h1>
              <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-indigo-300/80 font-medium">{todayFormatted}</p>
          </div>
        </div>

        {/* Quick Gamification Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{stats.streak}d Streak</span>
          </div>

          {/* Points */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
            <span>{stats.points} XP</span>
          </div>

          {/* Level */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-purple-400" />
            <span>Lvl {stats.level}</span>
          </div>

          {/* Feature Expansion Ideas Button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-200 text-xs font-medium transition-all shadow-sm"
            title="View Student Feature Ideas & Architecture Guide"
          >
            <Lightbulb className="w-4 h-4 text-amber-300 animate-bounce" />
            <span className="hidden md:inline font-bold">Feature Ideas</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Toggle theme"
          >
            {stats.dark_mode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

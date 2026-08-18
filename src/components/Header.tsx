import React, { useState } from 'react';
import { Moon, Sun, Sparkles, GraduationCap } from 'lucide-react';
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
  const [imgError, setImgError] = useState(false);
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white border-b border-slate-200 dark:border-indigo-900/50 shadow-sm dark:shadow-lg px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Project Title */}
        <div 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 border border-indigo-500/30 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform flex-shrink-0 flex items-center justify-center">
            {!imgError ? (
              <img 
                src="/app_icon.jpg" 
                alt="Student Routine Logo" 
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <GraduationCap className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base md:text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-indigo-100 dark:to-indigo-300 bg-clip-text text-transparent">
                Student Routine
              </h1>
              <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-indigo-700/90 dark:text-indigo-300/80 font-medium">{todayFormatted}</p>
          </div>
        </div>

        {/* Right side: Malik Developer Badge & Theme Toggle */}
        <div className="flex items-center gap-2 justify-end">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-black shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span>Malik Developer</span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-300 dark:border-slate-700 shrink-0"
            title="Toggle dark / light theme"
          >
            {stats.dark_mode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { 
  Home, 
  CheckSquare, 
  Flame, 
  Moon, 
  GraduationCap, 
  Calendar,
  Sparkles, 
  BarChart3,
  BookOpen,
  HeartHandshake
} from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

interface TabItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'timetable', label: 'Routine', icon: Calendar },
    { id: 'islamic', label: 'Namaz', icon: Moon },
    { id: 'habits', label: 'Habits', icon: Flame },
    { id: 'self_reflection', label: 'Muhasaba', icon: HeartHandshake },
    { id: 'reports', label: 'Journal', icon: BarChart3 },
    { id: 'academic', label: 'Projects', icon: GraduationCap },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-indigo-900/40 text-slate-600 dark:text-slate-400 px-2 py-1.5 shadow-xl">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (tab.id === 'self_reflection' && activeTab === 'muhasaba');
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id as ActiveTab)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all rounded-xl relative ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                  : 'hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm" />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                {tab.highlight && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

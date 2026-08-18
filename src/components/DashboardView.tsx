import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  Unlock, 
  Sparkles, 
  Gamepad2, 
  Clock, 
  Plus, 
  Calendar, 
  ChevronRight,
  BookOpen,
  HeartHandshake,
  Flame,
  Moon,
  Heart,
  CheckSquare
} from 'lucide-react';
import { Task, UserStats, ActiveTab, ClassSession } from '../types';

interface DashboardViewProps {
  tasks: Task[];
  stats: UserStats;
  timetable: ClassSession[];
  onToggleTask: (taskId: string) => void;
  onSelectTab: (tab: ActiveTab) => void;
  onToggleEntTimer: () => void;
  namazCount: number;
  quranDone: boolean;
  daroodCount: number;
}

function convertTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const cleaned = timeStr.trim().toUpperCase();
  const isPM = cleaned.includes('PM');
  const isAM = cleaned.includes('AM');
  
  const numbersOnly = cleaned.replace(/[^\d:]/g, '');
  const parts = numbersOnly.split(':');
  let hours = parseInt(parts[0] || '0', 10);
  const minutes = parseInt(parts[1] || '0', 10);

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  stats,
  timetable,
  onToggleTask,
  onSelectTab,
  onToggleEntTimer,
  namazCount,
  quranDone,
  daroodCount,
}) => {
  const jsDay = new Date().getDay();
  const currentDayIndex = jsDay === 0 ? 6 : jsDay - 1;
  const currentDayName = DAY_NAMES[currentDayIndex];
  const todayDateStr = new Date().toISOString().split('T')[0];

  const [completedSessions, setCompletedSessions] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`tt_completed_${todayDateStr}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleToggleSession = (sessionId: string) => {
    setCompletedSessions((prev) => {
      const updated = { ...prev, [sessionId]: !prev[sessionId] };
      localStorage.setItem(`tt_completed_${todayDateStr}`, JSON.stringify(updated));
      return updated;
    });
  };

  const todaySessions = (timetable || [])
    .filter((s) => {
      if (Array.isArray(s.days) && s.days.length > 0) {
        return s.days.includes(currentDayIndex);
      }
      return s.dayOfWeek === currentDayIndex;
    })
    .sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime));

  const todayTasks = tasks.filter((t) => t.dateAdded === todayDateStr || t.recurring);
  const completedTasks = todayTasks.filter((t) => t.doneDates.includes(todayDateStr));
  const tasksAllDone = todayTasks.length > 0 ? completedTasks.length === todayTasks.length : true;

  // Streak condition: 5 Prayers + Quran done + Tasks completed
  const isStreakAchievedToday = namazCount >= 5 && quranDone && tasksAllDone;

  // Break reward unlock
  const isEntertainmentUnlocked = isStreakAchievedToday;

  const formatEntTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5 pb-20">
      
      {/* 1. Header Banner & Streak Tracker */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 text-white shadow-xl border border-indigo-800/40 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Assalam-o-Alaikum, Student</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Today's Routine Dashboard
            </h2>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-800/80 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Malik Abdul Moiz Project</span>
            </div>
          </div>

          {/* Daily Streak Fire Card */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 w-full sm:w-auto shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Flame className="w-7 h-7 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-wider text-amber-300">
                Daily Streak
              </p>
              <p className="text-xl font-black text-white">
                {stats.streak} {stats.streak === 1 ? 'Day' : 'Days'}
              </p>
              <p className="text-[11px] font-bold text-amber-200/80">
                {isStreakAchievedToday ? '✓ Today\'s Streak Active!' : 'Complete targets for today'}
              </p>
            </div>
          </div>
        </div>

        {/* Daily Streak Checklist */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-indigo-900/50 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-black text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>Streak Requirements for Today</span>
            </span>
            <span className="font-bold text-amber-300">
              {isStreakAchievedToday ? '100% Completed' : 'In Progress'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div 
              onClick={() => onSelectTab('islamic')}
              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                namazCount >= 5 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">5 Prayers Logged</span>
              </div>
              <span className="font-black">{namazCount}/5</span>
            </div>

            <div 
              onClick={() => onSelectTab('islamic')}
              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                quranDone 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="font-bold">Quran Recitation</span>
              </div>
              <span className="font-black">{quranDone ? '✓ Done' : 'Pending'}</span>
            </div>

            <div 
              onClick={() => onSelectTab('islamic')}
              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                (daroodCount >= 500 || daroodCount > 0)
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-teal-400" />
                <span className="font-bold">500-1000 Durood</span>
              </div>
              <span className="font-black">{(daroodCount >= 500 || daroodCount > 0) ? '✓ Done' : 'Pending'}</span>
            </div>

            <div 
              onClick={() => onSelectTab('tasks')}
              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                tasksAllDone 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                <span className="font-bold">Study Tasks</span>
              </div>
              <span className="font-black">{completedTasks.length}/{todayTasks.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Timetable Preview */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Today's Routine ({currentDayName})
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('timetable')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
          >
            <span>Manage Routine</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todaySessions.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs text-slate-500">No timetable slots scheduled for {currentDayName}.</p>
            <button
              onClick={() => onSelectTab('timetable')}
              className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Add {currentDayName} Routine Slots
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {todaySessions.map((session) => {
              const isDone = completedSessions[session.id] || false;
              return (
                <div
                  key={session.id}
                  onClick={() => handleToggleSession(session.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/40 opacity-85'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button className="shrink-0 text-indigo-600">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs font-black truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {session.subject}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {session.startTime} - {session.endTime}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 shrink-0">
                    {session.category || 'Study'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. 2-Hour Entertainment Break Section */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-800/40 text-white shadow-md space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Daily 2-Hour Entertainment Break
                </h3>
                {isEntertainmentUnlocked ? (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> UNLOCKED
                  </span>
                ) : (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> LOCKED
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-200/80">
                {isEntertainmentUnlocked 
                  ? 'Congratulations! You completed all daily deen and study targets.' 
                  : 'Requires: 5 Prayers + Quran + Daily Study Tasks'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black font-mono text-purple-300">
                {formatEntTime(stats.entTimeLeft)}
              </span>
              <span className="text-[10px] text-purple-300/70 block">Time Remaining</span>
            </div>

            {isEntertainmentUnlocked && (
              <button
                onClick={onToggleEntTimer}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  stats.entTimerRunning
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
                }`}
              >
                {stats.entTimerRunning ? 'Pause Break' : 'Start Break Timer'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

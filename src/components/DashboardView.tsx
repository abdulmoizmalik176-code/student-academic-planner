import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Play, 
  Pause, 
  RotateCcw, 
  Lock, 
  Unlock, 
  Flame, 
  Trophy,
  Sparkles, 
  Gamepad2, 
  Clock, 
  Plus, 
  GraduationCap, 
  Calendar, 
  ChevronRight,
  BookOpen,
  Droplet,
  Quote,
  RefreshCw
} from 'lucide-react';
import { Task, UserStats, Exam, ActiveTab } from '../types';

interface DashboardViewProps {
  tasks: Task[];
  stats: UserStats;
  exams: Exam[];
  onToggleTask: (taskId: string) => void;
  onSelectTab: (tab: ActiveTab) => void;
  onToggleEntTimer: () => void;
  namazCount: number;
  quranDone: boolean;
  onLogWater?: () => void;
}

const STUDENT_QUOTES = [
  { text: "Consistency beats intensity. Small daily study habits create extraordinary results.", author: "Academic Wisdom" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Study with purpose, pray with sincerity, and rest with gratitude.", author: "Student Philosophy" },
  { text: "Focus on progress, not perfection. Every page read brings you closer to your goals.", author: "Focus Routine" },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  stats,
  exams,
  onToggleTask,
  onSelectTab,
  onToggleEntTimer,
  namazCount,
  quranDone,
  onLogWater,
}) => {
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Calculate overall completion percentage for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.dateAdded === todayStr || t.recurring);
  const completedTasks = todayTasks.filter(t => t.doneDates.includes(todayStr));
  const taskProgress = todayTasks.length > 0 ? Math.round((completedTasks.length / todayTasks.length) * 100) : 0;
  
  // Reward unlock check: Namaz >= 5 + Quran done + Tasks done
  const isEntertainmentUnlocked = namazCount >= 5 && quranDone && (todayTasks.length === 0 || completedTasks.length === todayTasks.length);

  const waterCount = stats.waterGlasses || 0;

  // Format entertainment timer
  const formatEntTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-20"
    >
      {/* 1. Main Banner / Progress Dashboard */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 p-5 text-white shadow-xl border border-indigo-800/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left info */}
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Assalam-o-Alaikum, Student!</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Today's Routine Dashboard
            </h2>
            <p className="text-xs text-indigo-200/80 max-w-sm">
              Stay consistent with your study targets, daily prayers, habits, and exam preparations.
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-indigo-500/40 text-indigo-200 text-xs font-black shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Malik Abdul Moiz Project</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                <span>{stats.streak} Days Streak</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-purple-500/40 text-purple-300 text-xs font-bold shadow-sm">
                <Trophy className="w-3.5 h-3.5 text-purple-400" />
                <span>Level {stats.level} ({stats.points} XP)</span>
              </div>
            </div>
          </div>

          {/* Right Circular Progress Ring */}
          <div className="flex flex-col items-center justify-center bg-slate-900/60 p-4 rounded-2xl border border-indigo-500/20 shadow-inner min-w-[160px]">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-emerald-400 transition-all duration-700 ease-out"
                  fill="transparent"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * Math.min(100, taskProgress)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-2xl font-black text-white">{Math.round(taskProgress)}%</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Progress</span>
              </div>
            </div>
            <p className="text-[11px] text-indigo-300 mt-2 font-medium">
              {completedTasks.length} of {todayTasks.length} tasks done
            </p>
          </div>
        </div>
      </div>

      {/* 2. Gamified Reward Entertainment Unlock Card */}
      <div className={`p-5 rounded-2xl border shadow-lg transition-all ${
        isEntertainmentUnlocked 
          ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-emerald-500/40 text-white' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-xl border ${
              isEntertainmentUnlocked 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
            }`}>
              {isEntertainmentUnlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  2-Hour Entertainment Break Reward
                </h3>
                {isEntertainmentUnlocked ? (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">
                    UNLOCKED
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                    LOCKED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {isEntertainmentUnlocked
                  ? "MashaAllah! You fulfilled 5 prayers, Quran recitation, and today's tasks! Enjoy your break."
                  : "Complete 5 Namaz prayers + Quran + All daily tasks to unlock your gaming & break timer!"}
              </p>
            </div>
          </div>

          <button
            onClick={onToggleEntTimer}
            disabled={!isEntertainmentUnlocked}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
              isEntertainmentUnlocked
                ? stats.entTimerRunning
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>
              {stats.entTimerRunning
                ? `Timer: ${formatEntTime(stats.entTimeLeft)}`
                : 'Start 2h Break Timer'}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Hydration & Motivational Quote Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Water Intake Tracker */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Droplet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Daily Hydration Tracker</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{waterCount} of 8 glasses logged today</p>
              </div>
            </div>

            <button
              onClick={onLogWater}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Water</span>
            </button>
          </div>

          {/* 8 Glass Indicators */}
          <div className="grid grid-cols-8 gap-1.5 pt-1">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-8 rounded-lg flex items-center justify-center transition-all ${
                  idx < waterCount
                    ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/50'
                    : 'bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-700'
                }`}
              >
                <Droplet className={`w-3.5 h-3.5 ${idx < waterCount ? 'fill-white' : ''}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Student Quote Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Quote className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Student Motivation</span>
            </div>
            <button
              onClick={() => setQuoteIdx((prev) => (prev + 1) % STUDENT_QUOTES.length)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Next quote"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-200 italic leading-relaxed">
            "{STUDENT_QUOTES[quoteIdx].text}"
          </p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold self-end">— {STUDENT_QUOTES[quoteIdx].author}</span>
        </div>
      </div>

      {/* 4. Focus Quick Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div 
          onClick={() => onSelectTab('tasks')}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Tasks Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white">{completedTasks.length}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">/ {todayTasks.length}</span>
          </div>
        </div>

        <div 
          onClick={() => onSelectTab('islamic')}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-500/50 cursor-pointer transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Namaz Logged</span>
            <span className="text-xs font-bold text-pink-600 dark:text-pink-400">🕌 Prayer</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white">{namazCount}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">/ 5</span>
          </div>
        </div>

        <div 
          onClick={() => onSelectTab('islamic')}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Quran Recitation</span>
            <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white">{quranDone ? 'Completed' : 'Pending'}</span>
          </div>
        </div>

        <div 
          onClick={() => onSelectTab('focus')}
          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Focus Timer</span>
            <Clock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white">25m</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">session</span>
          </div>
        </div>
      </div>

      {/* 5. Quick Action Row */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => onSelectTab('ai')}
            className="p-3 rounded-xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 hover:from-indigo-800/60 hover:to-purple-800/60 border border-indigo-700/50 text-left flex items-center justify-between group transition-all text-white"
          >
            <div>
              <p className="text-xs font-bold text-white group-hover:text-indigo-300">AI Quiz Generator</p>
              <p className="text-[10px] text-indigo-200">Create subject tests</p>
            </div>
            <Sparkles className="w-4 h-4 text-indigo-300 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => onSelectTab('academic')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-left flex items-center justify-between group transition-all shadow-sm"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300">Exam Countdown</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Track study syllabus</p>
            </div>
            <GraduationCap className="w-4 h-4 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => onSelectTab('academic')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-left flex items-center justify-between group transition-all shadow-sm"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300">Class Timetable</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Schedule & rooms</p>
            </div>
            <Calendar className="w-4 h-4 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => onSelectTab('habits')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-left flex items-center justify-between group transition-all shadow-sm"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300">Habit Heatmap</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Track streaks</p>
            </div>
            <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* 6. Today's Focus Task List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Today's Focus List
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Prioritized tasks for your study & personal targets</p>
          </div>
          <button
            onClick={() => onSelectTab('tasks')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">All tasks complete for today! Great job! 🎉</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayTasks.map((task) => {
              const isDone = task.doneDates.includes(new Date().toISOString().split('T')[0]);
              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-60'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:border-indigo-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        isDone ? 'text-emerald-500' : 'text-slate-400 hover:text-indigo-600'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <p className={`text-sm font-semibold text-slate-900 dark:text-white ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                        {task.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-medium text-indigo-600 dark:text-indigo-300">{task.time}</span>
                        {task.subject && (
                          <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                            {task.subject}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          task.priority === 'High' ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300' :
                          task.priority === 'Medium' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' :
                          'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{task.progress}%</span>
                    <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Upcoming Exams Preview Card */}
      {exams.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-pink-500 dark:text-pink-400" />
              Upcoming Exams Countdown
            </h3>
            <button
              onClick={() => onSelectTab('academic')}
              className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:text-pink-500 dark:hover:text-pink-300 flex items-center gap-1"
            >
              Planner <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {exams.map((exam) => {
              const examDate = new Date(exam.date);
              const today = new Date();
              const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

              return (
                <div key={exam.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{exam.subject}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      daysLeft <= 7 ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Today!'}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Syllabus Prep</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-300">{exam.prep}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                        style={{ width: `${exam.prep}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};


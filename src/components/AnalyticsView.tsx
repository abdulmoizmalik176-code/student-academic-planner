import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Smile, 
  Calendar, 
  Search, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Circle,
  Sparkles,
  Flame,
  Gamepad2,
  Check,
  Plus,
  Trash2,
  Copy,
  Filter,
  ShieldCheck,
  ShieldAlert,
  X,
  AlertCircle,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Edit3,
  HeartHandshake,
  Moon,
  CheckSquare,
  Heart
} from 'lucide-react';
import { 
  DailyMoodNote, 
  Task, 
  MuhasabaEntry, 
  EntertainmentLogEntry, 
  EntertainmentStatus 
} from '../types';

interface AnalyticsViewProps {
  tasks: Task[];
  namazLog: Record<string, string[]>;
  quranLog: string[];
  daroodLog?: Record<string, number>;
  notesHistory: Record<string, DailyMoodNote>;
  muhasabaHistory?: MuhasabaEntry[];
  entertainmentHistory?: EntertainmentLogEntry[];
  onSaveMoodNote: (dateStr: string, mood: DailyMoodNote['mood'], note: string) => void;
  onAddMuhasabaEntry?: (entry: Omit<MuhasabaEntry, 'id'>) => void;
  onDeleteMuhasabaEntry?: (id: string) => void;
  onUpdateMuhasabaEntry?: (entry: MuhasabaEntry) => void;
  onLogEntertainment?: (entry: Omit<EntertainmentLogEntry, 'id'>) => void;
  onDeleteEntertainmentEntry?: (id: string) => void;
}

const PRAYERS_LIST = ['Fajr', 'Zuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks,
  namazLog,
  quranLog,
  daroodLog = {},
  notesHistory,
  muhasabaHistory = [],
  entertainmentHistory = [],
  onSaveMoodNote,
  onAddMuhasabaEntry,
  onDeleteMuhasabaEntry,
  onUpdateMuhasabaEntry,
  onLogEntertainment,
  onDeleteEntertainmentEntry
}) => {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  // Selected date for viewing the complete daily audit
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Active view: 'daily_journal' | 'archive_search' | 'backup'
  const [viewMode, setViewMode] = useState<'daily_journal' | 'archive_search' | 'backup'>('daily_journal');

  // Multi-Year Archive Search
  const [archiveSearch, setArchiveSearch] = useState('');
  const [archiveYearFilter, setArchiveYearFilter] = useState<string>('all');

  // Quick Date Shift Handlers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Queries for Selected Date
  const currentMuhasaba = useMemo(() => {
    return muhasabaHistory.find((m) => m.date === selectedDate);
  }, [muhasabaHistory, selectedDate]);

  const currentEntertainment = useMemo(() => {
    return entertainmentHistory.find((e) => e.date === selectedDate);
  }, [entertainmentHistory, selectedDate]);

  const currentNamaz = useMemo(() => {
    return namazLog[selectedDate] || [];
  }, [namazLog, selectedDate]);

  const currentQuran = useMemo(() => {
    return quranLog.includes(selectedDate);
  }, [quranLog, selectedDate]);

  const currentDarood = useMemo(() => {
    return currentMuhasaba?.daroodCount ?? (daroodLog[selectedDate] || 0);
  }, [currentMuhasaba, daroodLog, selectedDate]);

  const currentDoneTasks = useMemo(() => {
    return tasks.filter((t) => t.doneDates.includes(selectedDate));
  }, [tasks, selectedDate]);

  const currentPendingTasks = useMemo(() => {
    return tasks.filter((t) => (t.dateAdded === selectedDate || t.recurring) && !t.doneDates.includes(selectedDate));
  }, [tasks, selectedDate]);

  const currentDailyMoodNote = useMemo(() => {
    return notesHistory[selectedDate];
  }, [notesHistory, selectedDate]);

  // Overall Statistics
  const totalMuhasabaCount = muhasabaHistory.length;
  const totalBreaksEnjoyed = entertainmentHistory.filter((e) => e.status === 'enjoyed').length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Subnavigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Historical Journal & Date-Wise Audit
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            View complete day-by-day record of Tasks, Namaz, Quran, Durood, Habits, Mood, and Muhasaba
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
          <button
            onClick={() => setViewMode('daily_journal')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'daily_journal'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Daily Date View
          </button>
          <button
            onClick={() => setViewMode('archive_search')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              viewMode === 'archive_search'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All Archives ({totalMuhasabaCount})
          </button>
        </div>
      </div>

      {viewMode === 'daily_journal' && (
        <div className="space-y-5">
          {/* Date Selector Navigation Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={handlePrevDay}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 transition-all"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Previous</span>
              </button>

              <button
                onClick={() => setSelectedDate(todayStr)}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                  selectedDate === todayStr
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Today
              </button>

              <button
                onClick={handleNextDay}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 transition-all"
                title="Next Day"
              >
                <span className="text-xs">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Date Input */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Jump to Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Complete 8-Point Day Detail Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            
            {/* Header of Date Card */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Audit Log: {selectedDate}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedDate === todayStr ? 'Today\'s Active Record' : 'Historical Saved Record'}
                  </p>
                </div>
              </div>

              {/* Mood Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Daily Mood:</span>
                <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-black text-xs">
                  {currentMuhasaba?.mood || currentDailyMoodNote?.mood || 'Not Logged'}
                </span>
              </div>
            </div>

            {/* 1. Tasks Ki Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>1. Tasks Ki Details ({currentDoneTasks.length} Completed)</span>
                </h4>
              </div>

              {currentDoneTasks.length === 0 && currentPendingTasks.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-500 text-center">
                  No tasks were scheduled or logged on this date.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentDoneTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="font-bold text-emerald-950 dark:text-emerald-200">{t.name}</span>
                      </div>
                      {t.subject && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                          {t.subject}
                        </span>
                      )}
                    </div>
                  ))}

                  {currentPendingTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400"
                    >
                      <div className="flex items-center gap-2">
                        <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{t.name}</span>
                      </div>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Pending</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2 & 3 & 4. Namaz, Quran & Durood Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Namaz Details */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>2. Namaz (5 Waqt)</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {currentNamaz.length} / 5
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {PRAYERS_LIST.map((p) => {
                    const done = currentNamaz.includes(p);
                    return (
                      <span
                        key={p}
                        className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${
                          done
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {p} {done ? '✓' : ''}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Quran Recitation */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
                <span className="text-xs font-black text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>3. Quran Recitation</span>
                </span>
                <p className={`text-xs font-black ${currentQuran ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                  {currentQuran ? '✓ Recited Alhamdulillah' : '✗ Not Logged'}
                </p>
              </div>

              {/* Durood Shareef Log */}
              <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 space-y-2">
                <span className="text-xs font-black text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>4. 500–1000 Durood Log</span>
                </span>
                <p className={`text-xs font-black ${currentDarood > 0 ? 'text-teal-700 dark:text-teal-300' : 'text-slate-500'}`}>
                  {currentDarood > 0 ? `✓ Recited (${currentDarood >= 500 ? `${currentDarood} times` : 'Recited'})` : '✗ Not Logged'}
                </p>
              </div>
            </div>

            {/* 5. Entertainment Break Audit */}
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>5. Entertainment & Break Audit</span>
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  {currentEntertainment?.status === 'enjoyed' ? `${currentEntertainment.minutesUsed || 60} Mins Used` : currentEntertainment?.status || 'No Break Taken'}
                </span>
              </div>
              {currentEntertainment?.activityNote && (
                <p className="text-xs text-purple-900 dark:text-purple-300 italic pt-1">
                  "{currentEntertainment.activityNote}"
                </p>
              )}
            </div>

            {/* 6. Habits: Kon si Adat Apnai vs Kon si Adat Chori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300/80 dark:border-emerald-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950 dark:text-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>6a. Kon si Achi Adat Apnai / Irada Kia:</span>
                </div>
                <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">
                  {currentMuhasaba?.goodHabitAdopted || 'No specific good habit recorded for this day.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-300/80 dark:border-rose-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-rose-950 dark:text-rose-200">
                  <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>6b. Kon si Buri Adat Chori / Parhez Kia:</span>
                </div>
                <p className="text-xs font-medium text-rose-900 dark:text-rose-300">
                  {currentMuhasaba?.badHabitAvoided || 'No bad habit resisted recorded for this day.'}
                </p>
              </div>
            </div>

            {/* 7 & 8. Daily Mood & Daily Muhasaba Note */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>7 & 8. Daily Muhasaba & Reflection Note</span>
                </h4>
                {currentMuhasaba?.time && (
                  <span className="text-[10px] text-slate-400 font-bold">
                    Logged at {currentMuhasaba.time}
                  </span>
                )}
              </div>

              {currentMuhasaba?.note ? (
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap pt-1 font-sans">
                  {currentMuhasaba.note}
                </p>
              ) : currentDailyMoodNote?.note ? (
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap pt-1">
                  {currentDailyMoodNote.note}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic pt-1">
                  No handwritten Muhasaba reflection note found for this date. (You can write one in the Muhasaba tab).
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Multi-Year Archives Search Mode */}
      {viewMode === 'archive_search' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={archiveSearch}
                onChange={(e) => setArchiveSearch(e.target.value)}
                placeholder="Search across all historical Muhasaba logs, habits, or notes..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
              />
            </div>
          </div>

          {muhasabaHistory.length === 0 ? (
            <div className="p-10 text-center bg-white dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <BarChart3 className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No historical entries in archive</p>
              <p className="text-[11px] text-slate-500 mt-1">As you save daily Muhasaba reflections, they will automatically be indexed here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {muhasabaHistory
                .filter((m) => {
                  const q = archiveSearch.toLowerCase();
                  return (
                    m.date.includes(q) ||
                    m.note.toLowerCase().includes(q) ||
                    (m.goodHabitAdopted && m.goodHabitAdopted.toLowerCase().includes(q)) ||
                    (m.badHabitAvoided && m.badHabitAvoided.toLowerCase().includes(q))
                  );
                })
                .map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => {
                      setSelectedDate(entry.date);
                      setViewMode('daily_journal');
                    }}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                          📅 {entry.date}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          Mood: {entry.mood}
                        </span>
                        {entry.daroodCount ? (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300">
                            📿 {entry.daroodCount} Durood
                          </span>
                        ) : null}
                      </div>

                      <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                        View Full Details →
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                      {entry.note}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

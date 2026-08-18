import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  CheckCircle2, 
  Circle,
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Clock, 
  BookOpen, 
  Check, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ClassSession, Priority } from '../types';

interface TimetableMasterViewProps {
  sessions: ClassSession[];
  onAddSession: (session: Omit<ClassSession, 'id'>) => void;
  onUpdateSession: (id: string, updated: Partial<ClassSession>) => void;
  onDeleteSession: (id: string) => void;
  onClearAllSessions?: () => void;
}

const DAYS_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CATEGORIES = [
  { label: 'Study & Solving', value: 'Study' },
  { label: 'Revision & Summary', value: 'Revision' },
  { label: 'Namaz & Deen', value: 'Namaz' },
  { label: 'Work & Business', value: 'Business' },
  { label: 'Break & Rest', value: 'Break' },
  { label: 'Personal Routine', value: 'Personal' },
];

const QUICK_METHODS = [
  'Theory study (30m) + practice problems uninterrupted',
  'Watch lecture & write active recall summary notes',
  'Hands-on coding, building project features & testing',
  'Deep focus 45m Pomodoro with phone on Do Not Disturb',
  '15 min quick summary of past formulas and derivations',
  'Flashcards revision & previous exam past papers'
];

function timeToMinutes(timeStr: string): number {
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

export const TimetableMasterView: React.FC<TimetableMasterViewProps> = ({
  sessions = [],
  onAddSession,
  onUpdateSession,
  onDeleteSession,
  onClearAllSessions
}) => {
  const currentDayIndex = useMemo(() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  }, []);

  const todayDateStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter states
  const [selectedDay, setSelectedDay] = useState<number | 'all'>(currentDayIndex);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Active states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);

  // Active in-slot Focus Timer state
  const [activeFocusSession, setActiveFocusSession] = useState<ClassSession | null>(null);
  const [focusSecondsLeft, setFocusSecondsLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Form states
  const [subject, setSubject] = useState('');
  const [startTime, setStartTime] = useState('06:00 AM');
  const [endTime, setEndTime] = useState('08:30 AM');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [category, setCategory] = useState<ClassSession['category']>('Study');
  const [priority, setPriority] = useState<Priority>('High');
  const [studyMethod, setStudyMethod] = useState('');
  const [notes, setNotes] = useState('');

  // Completion toggle per session for today
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`tt_completed_${todayDateStr}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleToggleDone = (id: string) => {
    setCompletedMap((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem(`tt_completed_${todayDateStr}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Open modal for new session
  const handleOpenAddModal = () => {
    setEditingSession(null);
    setSubject('');
    setStartTime('06:00 AM');
    setEndTime('08:30 AM');
    setSelectedDays(selectedDay === 'all' ? [0, 1, 2, 3, 4, 5, 6] : [selectedDay]);
    setCategory('Study');
    setPriority('High');
    setStudyMethod('');
    setNotes('');
    setIsModalOpen(true);
  };

  // Open modal for editing session
  const handleOpenEditModal = (s: ClassSession) => {
    setEditingSession(s);
    setSubject(s.subject);
    setStartTime(s.startTime);
    setEndTime(s.endTime);
    setSelectedDays(Array.isArray(s.days) && s.days.length > 0 ? s.days : (s.dayOfWeek !== undefined ? [s.dayOfWeek] : [0, 1, 2, 3, 4, 5, 6]));
    setCategory(s.category || 'Study');
    setPriority(s.priority || 'Medium');
    setStudyMethod(s.studyMethod || '');
    setNotes(s.notes || '');
    setIsModalOpen(true);
  };

  // Toggle single day in form
  const toggleFormDay = (dayIdx: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayIdx) ? prev.filter((d) => d !== dayIdx) : [...prev, dayIdx].sort((a, b) => a - b)
    );
  };

  // Preset day selections
  const setDaysPreset = (preset: 'all' | 'weekdays' | 'weekend' | 'mwf' | 'tts') => {
    switch (preset) {
      case 'all':
        setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
        break;
      case 'weekdays':
        setSelectedDays([0, 1, 2, 3, 4]);
        break;
      case 'weekend':
        setSelectedDays([5, 6]);
        break;
      case 'mwf':
        setSelectedDays([0, 2, 4]);
        break;
      case 'tts':
        setSelectedDays([1, 3, 5]);
        break;
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    if (selectedDays.length === 0) {
      alert('Please select at least 1 day for this routine block.');
      return;
    }

    if (editingSession) {
      onUpdateSession(editingSession.id, {
        subject: subject.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        days: selectedDays,
        category,
        priority,
        studyMethod: studyMethod.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      onAddSession({
        subject: subject.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        days: selectedDays,
        color: '#4f46e5',
        category,
        priority,
        studyMethod: studyMethod.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return sessions
      .filter((s) => {
        const matchesDay =
          selectedDay === 'all'
            ? true
            : (Array.isArray(s.days) && s.days.includes(selectedDay)) || s.dayOfWeek === selectedDay;

        const matchesSearch =
          s.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.studyMethod && s.studyMethod.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (s.notes && s.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesDay && matchesSearch;
      })
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }, [sessions, selectedDay, searchQuery]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Weekly Routine & Timetable
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Build your personalized study routine with multi-day selection and focus timers
          </p>
        </div>

        <div className="flex items-center gap-2">
          {sessions.length > 0 && onClearAllSessions && (
            <button
              onClick={() => {
                if (window.confirm('Delete ALL timetable slots and start completely clean?')) {
                  onClearAllSessions();
                }
              }}
              className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-800 transition-all flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Routine Slot</span>
          </button>
        </div>
      </div>

      {/* 7-Day Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedDay('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
            selectedDay === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
          }`}
        >
          All Days ({sessions.length})
        </button>

        {DAYS_NAMES.map((dayName, idx) => {
          const isSelected = selectedDay === idx;
          const isRealToday = currentDayIndex === idx;
          const dayCount = sessions.filter((s) => (Array.isArray(s.days) && s.days.includes(idx)) || s.dayOfWeek === idx).length;

          return (
            <button
              key={dayName}
              onClick={() => setSelectedDay(idx)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 font-black'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <span>{dayName.slice(0, 3)}</span>
              {dayCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  {dayCount}
                </span>
              )}
              {isRealToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Routine Slots List */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 shadow-sm">
            <BookOpen className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No routine slots found for {selectedDay === 'all' ? 'any day' : DAYS_NAMES[selectedDay]}
            </p>
            <p className="text-xs text-slate-500 mt-1">Tap "+ Add Routine Slot" to schedule your study and revision periods.</p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isDone = completedMap[session.id] || false;

            return (
              <div
                key={session.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isDone
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/40 opacity-90'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleDone(session.id)}
                      className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 hover:text-indigo-500" />
                      )}
                    </button>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm font-black ${isDone ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                          {session.subject}
                        </h4>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {session.category || 'Study'}
                        </span>

                        {session.priority === 'High' && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                            High Priority
                          </span>
                        )}
                      </div>

                      {/* Time & Days Row */}
                      <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          {session.startTime} - {session.endTime}
                        </span>

                        <div className="flex items-center gap-1">
                          {Array.isArray(session.days) && session.days.length === 7 ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              Everyday
                            </span>
                          ) : Array.isArray(session.days) ? (
                            session.days.map((d) => (
                              <span key={d} className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                {DAYS_SHORT[d]}
                              </span>
                            ))
                          ) : null}
                        </div>
                      </div>

                      {/* Study Strategy / Method */}
                      {session.studyMethod && (
                        <p className="text-xs text-slate-700 dark:text-slate-300 italic pt-0.5">
                          💡 {session.studyMethod}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(session)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit slot"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete routine slot "${session.subject}"?`)) {
                          onDeleteSession(session.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                      title="Delete slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Timetable Modal (Standard Fixed Layout - No Keyboard Scroll Jump) */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex min-h-full items-center justify-center p-4 text-center overscroll-contain"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left shadow-2xl border border-slate-200 dark:border-slate-800 transition-all my-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {editingSession ? 'Edit Routine Slot' : 'Add Routine / Study Slot'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Subject / Routine Title *
                </label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Mathematics Practice, Physics Problem Solving, Web Dev"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Timing Slots */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="06:00 AM"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="08:30 AM"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Flexible Days Multi-Select */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-indigo-950 dark:text-indigo-200">
                    Days of Week (Any combination)
                  </label>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedDays.length} / 7 Active
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {DAYS_SHORT.map((dShort, idx) => {
                    const isChecked = selectedDays.includes(idx);
                    return (
                      <button
                        key={dShort}
                        type="button"
                        onClick={() => toggleFormDay(idx)}
                        className={`py-2 rounded-xl text-xs font-black transition-all ${
                          isChecked
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                            : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {dShort}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-400 font-bold mr-1">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setDaysPreset('all')}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    All 7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setDaysPreset('weekdays')}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    Weekdays
                  </button>
                  <button
                    type="button"
                    onClick={() => setDaysPreset('weekend')}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    Weekend
                  </button>
                  <button
                    type="button"
                    onClick={() => setDaysPreset('mwf')}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    MWF
                  </button>
                </div>
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Study Strategy */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Study Strategy / Method Notes
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  value={studyMethod}
                  onChange={(e) => setStudyMethod(e.target.value)}
                  placeholder="e.g. 30m theory + solve 10 exercises"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/30"
                >
                  Save Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

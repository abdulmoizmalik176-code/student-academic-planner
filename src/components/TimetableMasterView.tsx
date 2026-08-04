import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Clock, 
  User, 
  MapPin, 
  AlertCircle,
  FileText,
  Sparkles,
  RotateCcw,
  Copy,
  Save,
  Check,
  Tag,
  BookOpen
} from 'lucide-react';
import { ClassSession } from '../types';

interface TimetableMasterViewProps {
  sessions: ClassSession[];
  onAddSession: (session: Omit<ClassSession, 'id'>) => void;
  onUpdateSession: (id: string, updated: Partial<ClassSession>) => void;
  onDeleteSession: (id: string) => void;
  onClearAllSessions?: () => void;
}

type ViewMode = 'day' | 'week' | 'notes' | 'teacher' | 'room';

const DAYS_5 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DAYS_7 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CATEGORIES = [
  { label: 'All', value: 'All' },
  { label: 'Study', value: 'Study', color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' },
  { label: 'Namaz / Deen', value: 'Namaz', color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
  { label: 'Business / Work', value: 'Business', color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' },
  { label: 'Break / Meal', value: 'Break', color: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30' },
  { label: 'Revision', value: 'Revision', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30' },
  { label: 'Personal', value: 'Personal', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30' },
];

const COLOR_OPTIONS = [
  { label: 'Indigo', hex: '#4f46e5' },
  { label: 'Purple', hex: '#8b5cf6' },
  { label: 'Emerald', hex: '#10b981' },
  { label: 'Amber', hex: '#f59e0b' },
  { label: 'Pink', hex: '#ec4899' },
  { label: 'Blue', hex: '#2563eb' },
  { label: 'Teal', hex: '#0d9488' },
  { label: 'Cyan', hex: '#06b6d4' },
];

const SAMPLE_ROUTINE_SLOTS: Omit<ClassSession, 'id'>[] = [
  // Monday (0) - MWF
  { subject: 'Subah Namaz (Fajr) & Tilawat', startTime: '05:00 AM', endTime: '06:00 AM', dayOfWeek: 0, color: '#10b981', category: 'Namaz', notes: 'Rozana subah nimaz kay liay uthna, until 6:00 AM' },
  { subject: 'Mathematics Study', startTime: '06:00 AM', endTime: '08:30 AM', dayOfWeek: 0, color: '#4f46e5', category: 'Study', notes: 'Math nashtay tk (8:30 AM)' },
  { subject: 'Nashta & Business Slot 1', startTime: '08:30 AM', endTime: '09:30 AM', dayOfWeek: 0, color: '#f59e0b', category: 'Business', notes: '1h waqfa for nashta and business' },
  { subject: 'Physics Study', startTime: '09:30 AM', endTime: '11:30 AM', dayOfWeek: 0, color: '#8b5cf6', category: 'Study', notes: 'Physics 9:30 say 11:30 tk' },
  { subject: 'Computer Practice', startTime: '11:30 AM', endTime: '01:00 PM', dayOfWeek: 0, color: '#06b6d4', category: 'Study', notes: 'Foran computer start, 1 PM tak' },
  { subject: 'Zuhr Namaz & Lunch Break', startTime: '01:00 PM', endTime: '02:30 PM', dayOfWeek: 0, color: '#ec4899', category: 'Break', notes: 'Waqfa for namaz, business & khana' },
  { subject: 'Islamiat & Study', startTime: '02:30 PM', endTime: '03:30 PM', dayOfWeek: 0, color: '#059669', category: 'Study', notes: 'Islamiat study until Asr time' },
  { subject: 'Asr Namaz & Business Slot 2', startTime: '03:30 PM', endTime: '05:00 PM', dayOfWeek: 0, color: '#d97706', category: 'Business', notes: '2 say Hasar/Asr tak' },
  { subject: 'Maghrib to Isha Revision', startTime: '07:15 PM', endTime: '08:30 PM', dayOfWeek: 0, color: '#2563eb', category: 'Revision', notes: 'Din ki sari revision aur mazmoon ka khulasa (10 mn per subject)' },

  // Wednesday (2) - MWF
  { subject: 'Subah Namaz (Fajr) & Tilawat', startTime: '05:00 AM', endTime: '06:00 AM', dayOfWeek: 2, color: '#10b981', category: 'Namaz', notes: 'Fajr until 6:00 AM' },
  { subject: 'Mathematics Study', startTime: '06:00 AM', endTime: '08:30 AM', dayOfWeek: 2, color: '#4f46e5', category: 'Study', notes: 'Math until nashta' },
  { subject: 'Nashta & Business Slot', startTime: '08:30 AM', endTime: '09:30 AM', dayOfWeek: 2, color: '#f59e0b', category: 'Business', notes: '1h waqfa for nashta and business' },
  { subject: 'Physics Study', startTime: '09:30 AM', endTime: '11:30 AM', dayOfWeek: 2, color: '#8b5cf6', category: 'Study', notes: 'Physics 9:30 - 11:30 AM' },
  { subject: 'Computer Practice', startTime: '11:30 AM', endTime: '01:00 PM', dayOfWeek: 2, color: '#06b6d4', category: 'Study', notes: 'Computer practice until 1 PM' },
  { subject: 'Zuhr Namaz & Lunch Break', startTime: '01:00 PM', endTime: '02:30 PM', dayOfWeek: 2, color: '#ec4899', category: 'Break', notes: 'Namaz, business & khana' },
  { subject: 'Maghrib to Isha Revision', startTime: '07:15 PM', endTime: '08:30 PM', dayOfWeek: 2, color: '#2563eb', category: 'Revision', notes: 'Summary & revision of all subjects' },

  // Friday (4) - MWF
  { subject: 'Subah Namaz & Tilawat Surah Kahf', startTime: '05:00 AM', endTime: '06:00 AM', dayOfWeek: 4, color: '#10b981', category: 'Namaz', notes: 'Friday special spiritual start' },
  { subject: 'Mathematics Study', startTime: '06:00 AM', endTime: '08:30 AM', dayOfWeek: 4, color: '#4f46e5', category: 'Study', notes: 'Math until nashta' },
  { subject: 'Nashta & Business Slot', startTime: '08:30 AM', endTime: '09:30 AM', dayOfWeek: 4, color: '#f59e0b', category: 'Business', notes: 'Business work slot' },
  { subject: 'Physics Study', startTime: '09:30 AM', endTime: '11:30 AM', dayOfWeek: 4, color: '#8b5cf6', category: 'Study', notes: 'Physics study' },
  { subject: 'Jummah Prayer & Break', startTime: '01:00 PM', endTime: '02:30 PM', dayOfWeek: 4, color: '#059669', category: 'Namaz', notes: 'Jummah prayer' },

  // Tuesday (1) - TTS
  { subject: 'Subah Namaz & Physics', startTime: '05:00 AM', endTime: '08:30 AM', dayOfWeek: 1, color: '#8b5cf6', category: 'Study', notes: 'Physics after namaz nashtay tk' },
  { subject: 'Nashta & Business Slot', startTime: '08:30 AM', endTime: '09:30 AM', dayOfWeek: 1, color: '#f59e0b', category: 'Business', notes: 'Business time' },
  { subject: 'Mathematics Study', startTime: '09:30 AM', endTime: '11:30 AM', dayOfWeek: 1, color: '#4f46e5', category: 'Study', notes: 'Math 9:30 to 11:30 AM' },
  { subject: 'Computer Practice', startTime: '11:30 AM', endTime: '01:00 PM', dayOfWeek: 1, color: '#06b6d4', category: 'Study', notes: 'Computer 1 PM tk' },
  { subject: 'Zuhr Namaz & Break', startTime: '01:00 PM', endTime: '02:30 PM', dayOfWeek: 1, color: '#ec4899', category: 'Break', notes: 'Break & Namaz' },
  { subject: 'Urdu Literature', startTime: '02:30 PM', endTime: '03:30 PM', dayOfWeek: 1, color: '#059669', category: 'Study', notes: 'Urdu 2:30 say 3:30 tk' },
  { subject: 'English Study & Asr', startTime: '03:30 PM', endTime: '05:00 PM', dayOfWeek: 1, color: '#d97706', category: 'Study', notes: 'English phir Hasar tk' },

  // Thursday (3) - TTS
  { subject: 'Subah Namaz & Physics', startTime: '05:00 AM', endTime: '08:30 AM', dayOfWeek: 3, color: '#8b5cf6', category: 'Study', notes: 'Physics after namaz nashtay tk' },
  { subject: 'Mathematics Study', startTime: '09:30 AM', endTime: '11:30 AM', dayOfWeek: 3, color: '#4f46e5', category: 'Study', notes: 'Math 9:30 to 11:30 AM' },
  { subject: 'Computer Practice', startTime: '11:30 AM', endTime: '01:00 PM', dayOfWeek: 3, color: '#06b6d4', category: 'Study', notes: 'Computer until 1 PM' },
  { subject: 'Urdu Literature', startTime: '02:30 PM', endTime: '03:30 PM', dayOfWeek: 3, color: '#059669', category: 'Study', notes: 'Urdu literature' },

  // Saturday (5) - TTS
  { subject: 'Subah Namaz & Physics', startTime: '05:00 AM', endTime: '08:30 AM', dayOfWeek: 5, color: '#8b5cf6', category: 'Study', notes: 'Physics after namaz nashtay tk' },
  { subject: 'Mathematics & Computer', startTime: '09:30 AM', endTime: '01:00 PM', dayOfWeek: 5, color: '#4f46e5', category: 'Study', notes: 'Math and Computer practice' },

  // Sunday (6) - Weekend Special
  { subject: 'Subah Namaz & Morning Dhikr', startTime: '05:00 AM', endTime: '06:30 AM', dayOfWeek: 6, color: '#10b981', category: 'Namaz', notes: 'Sunday morning spiritual start' },
  { subject: 'Weekly Science Subjects Revision', startTime: '09:00 AM', endTime: '12:00 PM', dayOfWeek: 6, color: '#2563eb', category: 'Revision', notes: 'Itwar (Sunday) sirf science subjects ki weekly revision krni hai' }
];

const INITIAL_PLAN_NOTES = `📋 TIMETABLE PLAN (2 April to 27 April)

🕌 DAILY SPIRITUAL ROUTINE:
- Subah Namaz kay waqt uthna and Namaz parhna until 6:00 AM
- Maghrib say Isha tak study & revision
- Namaz apnay time par lazmi parhna

📚 MONDAY, WEDNESDAY, FRIDAY SCHEDULE:
- Math nashtay tk yani 8:30 AM tak
- 1 hour waqfa for nashta and business (8:30 AM - 9:30 AM)
- Physics: 9:30 AM say 11:30 AM tak
- Computer: 11:30 AM say 1:00 PM tak
- 1:00 PM say 2:30 PM: Waqfa for Namaz, Business & Khana
- 2:30 PM say 3:30 PM: Islamiat (Hasar tk)
- Maghrib kay bad: Din ki sari revision aur har mazmoon ka khulasa (10 mn per subject)

📚 TUESDAY, THURSDAY, SATURDAY SCHEDULE:
- Physics: After Namaz nashtay tk (8:30 AM)
- Math: 9:30 AM to 11:30 AM
- Computer: 11:30 AM to 1:00 PM
- Urdu: 2:30 PM say 3:30 PM tak
- English: 3:30 PM say Hasar/Asr tak

💼 BUSINESS AUQAT:
- 9:00 AM say 9:30 AM
- 2:00 PM say 2:30 PM
- Raat Isha say sonay tak

📌 IMPORTANT RULES:
1. Padhtay waqt mobile agar kaam kay liay ho to use krna hai warna nahi, ya mobile sim nikal deni hai.
2. 2 April say 27 April tak strictly follow krna hai!
3. Itwar (Sunday) agar na ho skay to theek, otherwise sirf science subjects ki weekly revision krni hai.`;

// Helper to convert time strings for sorting
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

export const TimetableMasterView: React.FC<TimetableMasterViewProps> = ({
  sessions,
  onAddSession,
  onUpdateSession,
  onDeleteSession,
  onClearAllSessions
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [is7DayWeek, setIs7DayWeek] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const today = new Date().getDay(); // 0=Sun, 1=Mon...
    return today === 0 ? 6 : today - 1; // convert to 0=Mon..6=Sun
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [completedSessionsToday, setCompletedSessionsToday] = useState<Record<string, boolean>>({});

  // Notebook state
  const [plannerNotes, setPlannerNotes] = useState(() => {
    return localStorage.getItem('student_routine_notes') || INITIAL_PLAN_NOTES;
  });
  const [copiedNotes, setCopiedNotes] = useState(false);

  useEffect(() => {
    localStorage.setItem('student_routine_notes', plannerNotes);
  }, [plannerNotes]);

  const activeDays = is7DayWeek ? DAYS_7 : DAYS_5;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);

  // Form State
  const [formSubject, setFormSubject] = useState('');
  const [formCategory, setFormCategory] = useState<'Study' | 'Namaz' | 'Business' | 'Break' | 'Personal' | 'Revision'>('Study');
  const [formDayOfWeek, setFormDayOfWeek] = useState(0);
  const [formStartTime, setFormStartTime] = useState('08:30 AM');
  const [formEndTime, setFormEndTime] = useState('09:30 AM');
  const [formNotes, setFormNotes] = useState('');
  const [formInstructor, setFormInstructor] = useState('');
  const [formRoom, setFormRoom] = useState('');
  const [formColor, setFormColor] = useState('#4f46e5');
  const [repeatPattern, setRepeatPattern] = useState<'single' | 'mwf' | 'tts' | 'all'>('single');

  // Sorted sessions for selected day
  const dailySessions = useMemo(() => {
    return sessions
      .filter(s => s.dayOfWeek === selectedDayIndex)
      .filter(s => selectedCategory === 'All' || s.category === selectedCategory || (!s.category && selectedCategory === 'Study'))
      .sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime));
  }, [sessions, selectedDayIndex, selectedCategory]);

  const teacherMap = useMemo(() => {
    const map: Record<string, ClassSession[]> = {};
    sessions.forEach(s => {
      const name = s.instructor || 'Unassigned';
      if (!map[name]) map[name] = [];
      map[name].push(s);
    });
    return map;
  }, [sessions]);

  const roomMap = useMemo(() => {
    const map: Record<string, ClassSession[]> = {};
    sessions.forEach(s => {
      const name = s.room || 'General';
      if (!map[name]) map[name] = [];
      map[name].push(s);
    });
    return map;
  }, [sessions]);

  const handleOpenAddModal = (defaultDay = selectedDayIndex, defaultStart = '08:30 AM', defaultEnd = '09:30 AM') => {
    setEditingSession(null);
    setFormSubject('');
    setFormCategory('Study');
    setFormDayOfWeek(defaultDay);
    setFormStartTime(defaultStart);
    setFormEndTime(defaultEnd);
    setFormNotes('');
    setFormInstructor('');
    setFormRoom('');
    setFormColor('#4f46e5');
    setRepeatPattern('single');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (session: ClassSession) => {
    setEditingSession(session);
    setFormSubject(session.subject);
    setFormCategory(session.category || 'Study');
    setFormDayOfWeek(session.dayOfWeek);
    setFormStartTime(session.startTime);
    setFormEndTime(session.endTime);
    setFormNotes(session.notes || '');
    setFormInstructor(session.instructor || '');
    setFormRoom(session.room || '');
    setFormColor(session.color || '#4f46e5');
    setRepeatPattern('single');
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim()) return;

    if (editingSession) {
      onUpdateSession(editingSession.id, {
        subject: formSubject.trim(),
        category: formCategory,
        dayOfWeek: formDayOfWeek,
        startTime: formStartTime,
        endTime: formEndTime,
        notes: formNotes.trim(),
        instructor: formInstructor.trim(),
        room: formRoom.trim(),
        color: formColor
      });
    } else {
      let daysToAdd = [formDayOfWeek];
      if (repeatPattern === 'mwf') daysToAdd = [0, 2, 4]; // Mon, Wed, Fri
      if (repeatPattern === 'tts') daysToAdd = [1, 3, 5]; // Tue, Thu, Sat
      if (repeatPattern === 'all') daysToAdd = [0, 1, 2, 3, 4, 5, 6];

      daysToAdd.forEach(d => {
        onAddSession({
          subject: formSubject.trim(),
          category: formCategory,
          dayOfWeek: d,
          startTime: formStartTime,
          endTime: formEndTime,
          notes: formNotes.trim(),
          instructor: formInstructor.trim(),
          room: formRoom.trim(),
          color: formColor
        });
      });
    }

    setIsModalOpen(false);
  };

  const handleLoadSampleRoutine = () => {
    if (window.confirm('Load full student routine plan (MWF, TTS & Weekend schedules)?')) {
      SAMPLE_ROUTINE_SLOTS.forEach(s => onAddSession(s));
    }
  };

  const toggleSessionCompletion = (id: string) => {
    setCompletedSessionsToday(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-6 pb-24">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-500" />
              Flex Routine & Timetable
            </h2>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              AM / PM 12-Hour
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Plan your complete day: Namaz, Study, Business slots, Meals & Revision.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {sessions.length === 0 && (
            <button
              onClick={handleLoadSampleRoutine}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Load Sample Plan
            </button>
          )}

          {sessions.length > 0 && onClearAllSessions && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all class sessions?')) {
                  onClearAllSessions();
                }
              }}
              className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/40 flex items-center gap-1 transition-colors"
              title="Clear all classes"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}

          <button
            onClick={() => handleOpenAddModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Routine Item
          </button>

          <button
            onClick={() => setShowSearchModal(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Search Schedule"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VIEW SWITCHER & TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'day', label: '📅 Daily Routine', desc: 'Timeline View' },
            { id: 'week', label: '📊 Weekly Grid', desc: 'Grid View' },
            { id: 'notes', label: '📝 Planner Notes', desc: 'Rules & Plan' },
            { id: 'teacher', label: '👤 Instructors', desc: 'By Teacher' },
            { id: 'room', label: '📍 Rooms', desc: 'By Location' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as ViewMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold capitalize transition-all shrink-0 ${
                viewMode === mode.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIs7DayWeek(!is7DayWeek)}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all self-start sm:self-auto shrink-0"
        >
          {is7DayWeek ? '7 Days (Mon-Sun)' : '5 Days (Mon-Fri)'}
        </button>
      </div>

      {/* VIEW 1: DAILY ROUTINE PLANNER (TIMELINE) */}
      {viewMode === 'day' && (
        <div className="space-y-4">
          {/* Day Selector */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            {activeDays.map((day, idx) => (
              <button
                key={day}
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex-1 min-w-[50px] py-2 px-1 rounded-xl text-xs font-extrabold transition-all text-center ${
                  selectedDayIndex === idx
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {day}
                <span className="block text-[9px] font-normal opacity-80 mt-0.5">
                  {sessions.filter(s => s.dayOfWeek === idx).length} items
                </span>
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Filter:
            </span>
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 ${
                  selectedCategory === cat.value
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Timeline Cards */}
          {dailySessions.length === 0 ? (
            <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              <Clock className="w-10 h-10 text-indigo-400 mx-auto" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">No items planned for {activeDays[selectedDayIndex]}</h3>
                <p className="text-xs text-slate-500 mt-1">Add study sessions, Namaz, business slots or meal breaks.</p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => handleOpenAddModal(selectedDayIndex)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition-all inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
                <button
                  onClick={handleLoadSampleRoutine}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-emerald-500" /> Load Sample Plan
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 before:z-0">
              {dailySessions.map((session) => {
                const isDone = !!completedSessionsToday[session.id];
                return (
                  <div
                    key={session.id}
                    className={`relative z-10 flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all shadow-sm ${
                      isDone
                        ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10 opacity-75'
                        : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/40'
                    }`}
                  >
                    {/* Time Badge */}
                    <div className="flex flex-col items-center justify-center min-w-[75px] py-1 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-center shrink-0 border border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400">
                        {session.startTime}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold">to</span>
                      <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                        {session.endTime}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-extrabold text-sm md:text-base ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                            {session.subject}
                          </h3>
                          {session.category && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {session.category}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => toggleSessionCompletion(session.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-500'
                            }`}
                            title={isDone ? 'Mark Pending' : 'Mark Completed'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(session)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteSession(session.id)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Notes / Rule */}
                      {session.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                          💡 {session.notes}
                        </p>
                      )}

                      {/* Instructor / Room */}
                      {(session.instructor || session.room) && (
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                          {session.instructor && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3 text-indigo-500" />
                              {session.instructor}
                            </span>
                          )}
                          {session.room && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-500" />
                              {session.room}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: WEEKLY GRID */}
      {viewMode === 'week' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 overflow-x-auto shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 min-w-[700px]">
            {activeDays.map((day, dayIdx) => {
              const daySessions = sessions
                .filter(s => s.dayOfWeek === dayIdx)
                .sort((a, b) => convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime));

              return (
                <div key={day} className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase">{day}</h3>
                    <span className="text-[10px] font-bold text-indigo-500 px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950">
                      {daySessions.length}
                    </span>
                  </div>

                  {daySessions.length === 0 ? (
                    <div className="p-4 text-center text-[10px] text-slate-400">No items</div>
                  ) : (
                    <div className="space-y-2">
                      {daySessions.map(s => (
                        <div
                          key={s.id}
                          onClick={() => handleOpenEditModal(s)}
                          className="p-2.5 rounded-xl text-white cursor-pointer shadow-xs hover:scale-102 transition-all space-y-1"
                          style={{ backgroundColor: s.color || '#4f46e5' }}
                        >
                          <div className="text-[10px] font-extrabold opacity-90 flex items-center justify-between">
                            <span>{s.startTime}</span>
                            <span>{s.endTime}</span>
                          </div>
                          <h4 className="font-bold text-xs leading-tight drop-shadow-xs">{s.subject}</h4>
                          {s.notes && <p className="text-[9px] opacity-85 line-clamp-1">{s.notes}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleOpenAddModal(dayIdx)}
                    className="w-full py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-[10px] font-bold text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: PLANNER NOTES & RULES (Notebook matching Screenshot 1) */}
      {viewMode === 'notes' && (
        <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                Custom Routine Rules & Handwritten Plan Notes
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Keep your exact handwritten schedule targets, business hours, and study rules accessible.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(plannerNotes);
                  setCopiedNotes(true);
                  setTimeout(() => setCopiedNotes(false), 2000);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copiedNotes ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedNotes ? 'Copied!' : 'Copy Plan'}
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset plan notes to default template?')) {
                    setPlannerNotes(INITIAL_PLAN_NOTES);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset Default
              </button>
            </div>
          </div>

          <textarea
            value={plannerNotes}
            onChange={(e) => setPlannerNotes(e.target.value)}
            rows={18}
            className="w-full bg-slate-950 text-slate-200 text-xs md:text-sm font-mono p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500/50 leading-relaxed shadow-inner"
            placeholder="Write your custom daily routine rules here..."
          />

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>✨ Automatically saved in browser</span>
            <span>{plannerNotes.length} characters</span>
          </div>
        </div>
      )}

      {/* VIEW 4: TEACHER VIEW */}
      {viewMode === 'teacher' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(teacherMap).map(([teacher, sessionsList]) => {
            const tSessions = sessionsList as ClassSession[];
            return (
              <div key={teacher} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500" />
                    {teacher}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                    {tSessions.length} Item{tSessions.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-2">
                  {tSessions.map(s => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{s.subject}</p>
                        <p className="text-[10px] text-slate-500">{activeDays[s.dayOfWeek] || 'Day ' + s.dayOfWeek}{s.room ? ` • ${s.room}` : ''}</p>
                      </div>
                      <span className="font-bold text-slate-600 dark:text-slate-400 text-[11px] bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        {s.startTime} - {s.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 5: ROOM VIEW */}
      {viewMode === 'room' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(roomMap).map(([room, sessionsList]) => {
            const rSessions = sessionsList as ClassSession[];
            return (
              <div key={room} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    {room}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                    {rSessions.length} Scheduled
                  </span>
                </div>

                <div className="space-y-2">
                  {rSessions.map(s => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{s.subject}</p>
                        <p className="text-[10px] text-slate-500">{activeDays[s.dayOfWeek] || 'Day ' + s.dayOfWeek}{s.instructor ? ` • ${s.instructor}` : ''}</p>
                      </div>
                      <span className="font-bold text-slate-600 dark:text-slate-400 text-[11px] bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        {s.startTime} - {s.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => handleOpenAddModal()}
        className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        title="Add Routine Item"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                {editingSession ? 'Edit Routine Item' : 'Add Routine Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Subject / Activity Title *
                </label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g. Mathematics, Subah Namaz, Business Slot, Physics"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Study">Study</option>
                    <option value="Namaz">Namaz / Spiritual</option>
                    <option value="Business">Business / Work</option>
                    <option value="Break">Break / Meal</option>
                    <option value="Revision">Revision</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Day of Week</label>
                  <select
                    value={formDayOfWeek}
                    onChange={(e) => setFormDayOfWeek(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    {activeDays.map((d, i) => (
                      <option key={d} value={i}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Start Time (e.g. 08:30 AM)</label>
                  <input
                    type="text"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    placeholder="08:30 AM"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">End Time (e.g. 09:30 AM)</label>
                  <input
                    type="text"
                    required
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    placeholder="09:30 AM"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Quick Preset Time Slots */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Quick Time Presets:</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { s: '05:00 AM', e: '06:00 AM', label: 'Fajr/Subah' },
                    { s: '06:00 AM', e: '08:30 AM', label: 'Morning Study' },
                    { s: '08:30 AM', e: '09:30 AM', label: 'Nashta & Work' },
                    { s: '09:30 AM', e: '11:30 AM', label: 'Study 1' },
                    { s: '11:30 AM', e: '01:00 PM', label: 'Study 2' },
                    { s: '01:00 PM', e: '02:30 PM', label: 'Lunch & Zuhr' },
                    { s: '02:30 PM', e: '03:30 PM', label: 'Study 3' },
                    { s: '03:30 PM', e: '05:00 PM', label: 'Asr & Business' },
                    { s: '07:15 PM', e: '08:30 PM', label: 'Maghrib-Isha' }
                  ].map(p => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setFormStartTime(p.s);
                        setFormEndTime(p.e);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      {p.label} ({p.s})
                    </button>
                  ))}
                </div>
              </div>

              {!editingSession && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Repeat Pattern</label>
                  <select
                    value={repeatPattern}
                    onChange={(e) => setRepeatPattern(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="single">Single Selected Day</option>
                    <option value="mwf">Mon, Wed, Fri (MWF Schedule)</option>
                    <option value="tts">Tue, Thu, Sat (TTS Schedule)</option>
                    <option value="all">Everyday (Mon to Sun)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Notes / Instructions (e.g., "Math nashtay tk", "Mobile only for work")
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. 1h waqfa for nashta and business, or summary writing"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Room / Lab (Optional)</label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="e.g. Room 101, Home Study"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Teacher / Mentor (Optional)</label>
                  <input
                    type="text"
                    value={formInstructor}
                    onChange={(e) => setFormInstructor(e.target.value)}
                    placeholder="e.g. Self-Study, Mr. Johnson"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Card Color</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setFormColor(c.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        formColor === c.hex ? 'scale-110 border-white ring-2 ring-indigo-500' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 hover:bg-indigo-700"
                >
                  {editingSession ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEARCH MODAL */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-500" />
                Search Routine & Schedule
              </h3>
              <button onClick={() => setShowSearchModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject, teacher, category, or notes..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />

            <div className="max-h-60 overflow-y-auto space-y-2">
              {sessions
                .filter(s =>
                  s.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (s.notes && s.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (s.instructor && s.instructor.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedDayIndex(s.dayOfWeek);
                      setViewMode('day');
                      setShowSearchModal(false);
                    }}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{s.subject}</h4>
                      <p className="text-slate-500">{activeDays[s.dayOfWeek]} ({s.startTime} - {s.endTime}) {s.notes ? `• ${s.notes}` : ''}</p>
                    </div>
                    <span className="font-bold text-indigo-500">View</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

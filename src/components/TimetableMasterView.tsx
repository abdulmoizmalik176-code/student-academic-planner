import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Bell, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Clock, 
  User, 
  MapPin, 
  AlertCircle,
  Filter,
  Check
} from 'lucide-react';
import { ClassSession } from '../types';

interface TimetableMasterViewProps {
  sessions: ClassSession[];
  onAddSession: (session: Omit<ClassSession, 'id'>) => void;
  onUpdateSession: (id: string, updated: Partial<ClassSession>) => void;
  onDeleteSession: (id: string) => void;
  onClearAllSessions?: () => void;
}

type ViewMode = 'week' | 'day' | 'teacher' | 'room';

const DEFAULT_TIME_SLOTS = [
  { label: '8:00 - 8:45', start: '08:00', end: '08:45' },
  { label: '8:50 - 9:35', start: '08:50', end: '09:35' },
  { label: '9:40 - 10:25', start: '09:40', end: '10:25' },
  { label: '10:30 - 10:45', isBreak: true, breakTitle: 'Break' },
  { label: '10:45 - 11:30', start: '10:45', end: '11:30' },
  { label: '11:35 - 12:20', start: '11:35', end: '12:20' }
];

const DAYS_5 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DAYS_7 = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const COLOR_OPTIONS = [
  { label: 'Indigo', hex: '#4f46e5' },
  { label: 'Purple', hex: '#9333ea' },
  { label: 'Pink', hex: '#ec4899' },
  { label: 'Blue', hex: '#2563eb' },
  { label: 'Emerald', hex: '#059669' },
  { label: 'Amber', hex: '#d97706' },
  { label: 'Teal', hex: '#0d9488' },
  { label: 'Sky', hex: '#0284c7' },
];

export const TimetableMasterView: React.FC<TimetableMasterViewProps> = ({
  sessions,
  onAddSession,
  onUpdateSession,
  onDeleteSession,
  onClearAllSessions
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [is7DayWeek, setIs7DayWeek] = useState(false);
  const [gradeTitle, setGradeTitle] = useState('Grade 10 - Section A');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 0 = Mon
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const activeDays = is7DayWeek ? DAYS_7 : DAYS_5;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassSession | null>(null);

  // Form State
  const [formSubject, setFormSubject] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formInstructor, setFormInstructor] = useState('');
  const [formRoom, setFormRoom] = useState('');
  const [formDayOfWeek, setFormDayOfWeek] = useState(0);
  const [formStartTime, setFormStartTime] = useState('08:00');
  const [formEndTime, setFormEndTime] = useState('08:45');
  const [formColor, setFormColor] = useState('#4f46e5');

  // Compute dynamic time slots so custom times added by user are rendered
  const timeSlots = React.useMemo(() => {
    const slots = [...DEFAULT_TIME_SLOTS];
    sessions.forEach(s => {
      if (s.startTime && s.endTime) {
        const exists = slots.some(slot => !slot.isBreak && slot.start === s.startTime && slot.end === s.endTime);
        if (!exists) {
          slots.push({
            label: `${s.startTime} - ${s.endTime}`,
            start: s.startTime,
            end: s.endTime
          });
        }
      }
    });

    return slots.sort((a, b) => {
      const tA = a.start || a.label.split(' - ')[0];
      const tB = b.start || b.label.split(' - ')[0];
      return tA.localeCompare(tB);
    });
  }, [sessions]);

  // Check conflicts
  const checkConflicts = () => {
    const conflicts: string[] = [];
    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        const s1 = sessions[i];
        const s2 = sessions[j];
        if (s1.dayOfWeek === s2.dayOfWeek) {
          // Compare times
          if (s1.startTime < s2.endTime && s2.startTime < s1.endTime) {
            conflicts.push(`${activeDays[s1.dayOfWeek] || 'Day ' + s1.dayOfWeek}: ${s1.subject} overlaps with ${s2.subject}`);
          }
        }
      }
    }
    return conflicts;
  };

  const conflicts = checkConflicts();

  const handleOpenAddModal = (defaultDay = 0, defaultStart = '08:00', defaultEnd = '08:45') => {
    setEditingSession(null);
    setFormSubject('');
    setFormCode('');
    setFormInstructor('');
    setFormRoom('');
    setFormDayOfWeek(defaultDay);
    setFormStartTime(defaultStart);
    setFormEndTime(defaultEnd);
    setFormColor('#4f46e5');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (session: ClassSession) => {
    setEditingSession(session);
    setFormSubject(session.subject);
    setFormCode(session.code || '');
    setFormInstructor(session.instructor);
    setFormRoom(session.room);
    setFormDayOfWeek(session.dayOfWeek);
    setFormStartTime(session.startTime);
    setFormEndTime(session.endTime);
    setFormColor(session.color || '#4f46e5');
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim()) return;

    if (editingSession) {
      onUpdateSession(editingSession.id, {
        subject: formSubject,
        code: formCode,
        instructor: formInstructor,
        room: formRoom,
        dayOfWeek: formDayOfWeek,
        startTime: formStartTime,
        endTime: formEndTime,
        color: formColor
      });
    } else {
      onAddSession({
        subject: formSubject,
        code: formCode,
        instructor: formInstructor,
        room: formRoom,
        dayOfWeek: formDayOfWeek,
        startTime: formStartTime,
        endTime: formEndTime,
        color: formColor
      });
    }

    setIsModalOpen(false);
  };

  // Helper to get session at specific slot and day
  const getSessionForSlot = (dayIdx: number, slotStart: string) => {
    return sessions.find(s => s.dayOfWeek === dayIdx && s.startTime === slotStart);
  };

  // Group by Teacher
  const teacherMap: Record<string, ClassSession[]> = {};
  sessions.forEach(s => {
    const teacher = s.instructor || 'Unassigned';
    if (!teacherMap[teacher]) teacherMap[teacher] = [];
    teacherMap[teacher].push(s);
  });

  // Group by Room
  const roomMap: Record<string, ClassSession[]> = {};
  sessions.forEach(s => {
    const room = s.room || 'General';
    if (!roomMap[room]) roomMap[room] = [];
    roomMap[room].push(s);
  });

  // Filtered sessions for search
  const filteredSessions = sessions.filter(s => 
    s.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-24 text-slate-900 dark:text-white">
      {/* Top Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              TimetableMaster
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            <Plus className="w-4 h-4" /> Add Class
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

      {/* Class Title & Week Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={gradeTitle}
                onChange={(e) => setGradeTitle(e.target.value)}
                className="text-xl font-extrabold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-indigo-500 focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => setIsEditingTitle(false)}
                className="p-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
              >
                Save
              </button>
            </div>
          ) : (
            <h2 
              onClick={() => setIsEditingTitle(true)}
              className="text-2xl font-black text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 group"
            >
              {gradeTitle}
              <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h2>
          )}
        </div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Week 15 • Dec 9 - Dec 13, 2024
        </p>
      </div>

      {/* View Mode Switcher Pills + 5D/7D Toggle */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {(['week', 'day', 'teacher', 'room'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold capitalize transition-all shrink-0 ${
                viewMode === mode
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-102'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIs7DayWeek(!is7DayWeek)}
          className="px-3 py-2 rounded-xl text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shrink-0"
        >
          {is7DayWeek ? '7 Days (Mon-Sun)' : '5 Days (Mon-Fri)'}
        </button>
      </div>

      {/* Optimization / Conflict Banner */}
      {sessions.length === 0 ? (
        <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/30">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Your Timetable is Clear</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              No pre-loaded classes. You have full control! Add your subjects, time slots, teachers, and room numbers.
            </p>
          </div>
          <button
            onClick={() => handleOpenAddModal()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Your First Class
          </button>
        </div>
      ) : conflicts.length === 0 ? (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shadow-lg shadow-indigo-600/20">
          <div>
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              No conflicts detected!
            </h3>
            <p className="text-xs text-indigo-100 mt-0.5">Your schedule is optimized</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
              {conflicts.length} Schedule Conflict{conflicts.length > 1 ? 's' : ''} Detected
            </h3>
            <p className="text-xs mt-0.5">{conflicts[0]}</p>
          </div>
        </div>
      )}

      {/* VIEW 1: WEEK GRID VIEW */}
      {viewMode === 'week' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-3 px-3 text-[11px] font-extrabold text-slate-400 uppercase text-center w-24">
                    Time
                  </th>
                  {activeDays.map((day, idx) => (
                    <th key={day} className="py-3 px-3 text-[11px] font-extrabold text-slate-700 dark:text-slate-300 text-center uppercase">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs">
                {timeSlots.map((slot, sIdx) => {
                  if (slot.isBreak) {
                    return (
                      <tr key={sIdx} className="bg-slate-50 dark:bg-slate-800/30">
                        <td className="py-2.5 px-3 text-[10px] font-bold text-slate-400 text-center">
                          {slot.label}
                        </td>
                        <td colSpan={activeDays.length} className="py-2.5 text-center text-[11px] font-extrabold text-slate-400 tracking-wider">
                          {slot.breakTitle}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={sIdx} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center whitespace-pre-line leading-tight">
                        {slot.start}
                        <span className="block text-[9px] text-slate-400 font-normal">{slot.end}</span>
                      </td>

                      {activeDays.map((_, dayIdx) => {
                        const session = getSessionForSlot(dayIdx, slot.start || '');
                        return (
                          <td key={dayIdx} className="p-1.5 align-top h-20">
                            {session ? (
                              <div
                                onClick={() => handleOpenEditModal(session)}
                                style={{ backgroundColor: session.color }}
                                className="h-full p-2.5 rounded-xl text-white shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
                              >
                                <div>
                                  <h4 className="font-extrabold text-[12px] leading-tight drop-shadow-sm">
                                    {session.subject}
                                  </h4>
                                  {session.instructor && (
                                    <p className="text-[10px] font-medium opacity-90 mt-0.5 truncate">
                                      {session.instructor}
                                    </p>
                                  )}
                                </div>
                                {session.room && (
                                  <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/20 w-max mt-1 backdrop-blur-xs">
                                    {session.room}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => handleOpenAddModal(dayIdx, slot.start, slot.end)}
                                className="w-full h-full min-h-[64px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-slate-300 dark:text-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center transition-all group"
                              >
                                <Plus className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: DAY VIEW */}
      {viewMode === 'day' && (
        <div className="space-y-4">
          {/* Day Selector Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            {activeDays.map((day, idx) => (
              <button
                key={day}
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedDayIndex === idx
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {sessions
              .filter(s => s.dayOfWeek === selectedDayIndex)
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map(session => (
                <div
                  key={session.id}
                  onClick={() => handleOpenEditModal(session)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-12 rounded-full shrink-0"
                      style={{ backgroundColor: session.color }}
                    />
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {session.subject} {session.code && <span className="text-xs text-slate-400 font-normal">({session.code})</span>}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-indigo-500" />
                          {session.instructor}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {session.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                      <Clock className="w-3 h-3 text-indigo-500" />
                      {session.startTime} - {session.endTime}
                    </span>
                  </div>
                </div>
              ))}

            {sessions.filter(s => s.dayOfWeek === selectedDayIndex).length === 0 && (
              <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-500">No classes scheduled for {activeDays[selectedDayIndex] || 'Day ' + selectedDayIndex}</p>
                <button
                  onClick={() => handleOpenAddModal(selectedDayIndex)}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4" /> Add Class Slot
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: TEACHER VIEW */}
      {viewMode === 'teacher' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(teacherMap).map(([teacher, tSessions]) => (
            <div key={teacher} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500" />
                  {teacher}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                  {tSessions.length} Class{tSessions.length > 1 ? 'es' : ''}
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
          ))}
        </div>
      )}

      {/* VIEW 4: ROOM VIEW */}
      {viewMode === 'room' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(roomMap).map(([room, rSessions]) => (
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
          ))}
        </div>
      )}

      {/* Floating Action Button (FAB) - Edit / Add matching screenshot */}
      <button
        onClick={() => handleOpenAddModal()}
        className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        title="Add or Edit Timetable Session"
      >
        <Edit3 className="w-6 h-6" />
      </button>

      {/* SEARCH MODAL */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Search Timetable</h3>
              <button onClick={() => setShowSearchModal(false)} className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject, teacher, room..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                autoFocus
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pt-2">
              {filteredSessions.map(s => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{s.subject}</h4>
                    <p className="text-xs text-slate-500">
                      {activeDays[s.dayOfWeek] || 'Day ' + s.dayOfWeek} ({s.startTime}-{s.endTime})
                      {s.instructor ? ` • ${s.instructor}` : ''}
                      {s.room ? ` • ${s.room}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowSearchModal(false);
                      handleOpenEditModal(s);
                    }}
                    className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg"
                  >
                    Edit
                  </button>
                </div>
              ))}
              {filteredSessions.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-4">No matching sessions found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-auto text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {editingSession ? 'Edit Class Session' : 'Add New Class Session'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g. Mathematics, Physics..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="e.g. MATH101"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Room / Lab (Optional)</label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="e.g. Room 101, Lab 2"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Teacher / Instructor (Optional)</label>
                <input
                  type="text"
                  value={formInstructor}
                  onChange={(e) => setFormInstructor(e.target.value)}
                  placeholder="e.g. Mr. Johnson, Dr. Smith"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Day</label>
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
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    placeholder="08:00"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                  <input
                    type="text"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    placeholder="08:45"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-2">Card Accent Color</label>
                <div className="flex items-center gap-2">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setFormColor(c.hex)}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                        formColor === c.hex ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-105'
                      }`}
                    >
                      {formColor === c.hex && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-3">
                {editingSession ? (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteSession(editingSession.id);
                      setIsModalOpen(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/30 hover:bg-indigo-700"
                  >
                    {editingSession ? 'Save Changes' : 'Create Session'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

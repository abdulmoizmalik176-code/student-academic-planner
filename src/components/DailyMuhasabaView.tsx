import React, { useState, useMemo } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Smile, 
  CheckCircle2, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  BookOpen, 
  Flame,
  Search,
  Check,
  X
} from 'lucide-react';
import { MuhasabaEntry } from '../types';

interface DailyMuhasabaViewProps {
  muhasabaHistory: MuhasabaEntry[];
  daroodCountToday: number;
  onAddMuhasabaEntry: (entry: Omit<MuhasabaEntry, 'id'>) => void;
  onDeleteMuhasabaEntry: (id: string) => void;
  onUpdateMuhasabaEntry?: (entry: MuhasabaEntry) => void;
}

const MOODS: { label: MuhasabaEntry['mood']; emoji: string; color: string }[] = [
  { label: 'Productive', emoji: '⚡', color: 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' },
  { label: 'Peaceful', emoji: '🕊️', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
  { label: 'Motivated', emoji: '🔥', color: 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300' },
  { label: 'Happy', emoji: '😊', color: 'border-pink-500 bg-pink-500/10 text-pink-700 dark:text-pink-300' },
  { label: 'Normal', emoji: '🙂', color: 'border-slate-500 bg-slate-500/10 text-slate-700 dark:text-slate-300' },
  { label: 'Challenged', emoji: '🧗', color: 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300' },
  { label: 'Tired', emoji: '😴', color: 'border-yellow-600 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300' },
  { label: 'Stressed', emoji: '😰', color: 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-300' },
  { label: 'Regretful', emoji: '😔', color: 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300' },
];

export const DailyMuhasabaView: React.FC<DailyMuhasabaViewProps> = ({
  muhasabaHistory = [],
  daroodCountToday = 0,
  onAddMuhasabaEntry,
  onDeleteMuhasabaEntry,
  onUpdateMuhasabaEntry
}) => {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  // Selected date for entry
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Form State
  const [selectedMood, setSelectedMood] = useState<MuhasabaEntry['mood']>('Productive');
  const [goodHabitAdopted, setGoodHabitAdopted] = useState<string>('');
  const [badHabitAvoided, setBadHabitAvoided] = useState<string>('');
  const [muhasabaNote, setMuhasabaNote] = useState<string>('');
  const [daroodCount, setDaroodCount] = useState<number | ''>(daroodCountToday || '');
  const [searchHistoryQuery, setSearchHistoryQuery] = useState<string>('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Find existing entry for the selected date if available
  const existingForDate = useMemo(() => {
    return muhasabaHistory.find((m) => m.date === selectedDate);
  }, [muhasabaHistory, selectedDate]);

  // Load existing data when selectedDate changes
  const handleSelectDate = (newDate: string) => {
    setSelectedDate(newDate);
    const found = muhasabaHistory.find((m) => m.date === newDate);
    if (found) {
      setSelectedMood(found.mood);
      setGoodHabitAdopted(found.goodHabitAdopted || '');
      setBadHabitAvoided(found.badHabitAvoided || '');
      setMuhasabaNote(found.note || '');
      setDaroodCount(found.daroodCount ?? (newDate === todayStr ? daroodCountToday : ''));
      setEditingId(found.id);
    } else {
      setSelectedMood('Productive');
      setGoodHabitAdopted('');
      setBadHabitAvoided('');
      setMuhasabaNote('');
      setDaroodCount(newDate === todayStr ? daroodCountToday : '');
      setEditingId(null);
    }
  };

  const handleSaveMuhasaba = (e: React.FormEvent) => {
    e.preventDefault();
    if (!muhasabaNote.trim() && !goodHabitAdopted.trim() && !badHabitAvoided.trim()) {
      alert('Kripya aaj ka zaati jaiza (reflection note) ya adat ka irada darj karein.');
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const countNumber = typeof daroodCount === 'number' ? daroodCount : (parseInt(String(daroodCount), 10) || 0);

    if (editingId && onUpdateMuhasabaEntry) {
      onUpdateMuhasabaEntry({
        id: editingId,
        date: selectedDate,
        time: timeStr,
        mood: selectedMood,
        note: muhasabaNote.trim(),
        goodHabitAdopted: goodHabitAdopted.trim() || undefined,
        badHabitAvoided: badHabitAvoided.trim() || undefined,
        daroodCount: countNumber,
        tags: ['Daily Muhasaba', selectedMood]
      });
      alert('✓ Zaati Jaiza & Mood kamyabi se update ho gaya!');
    } else {
      onAddMuhasabaEntry({
        date: selectedDate,
        time: timeStr,
        mood: selectedMood,
        note: muhasabaNote.trim(),
        goodHabitAdopted: goodHabitAdopted.trim() || undefined,
        badHabitAvoided: badHabitAvoided.trim() || undefined,
        daroodCount: countNumber,
        tags: ['Daily Muhasaba', selectedMood]
      });
      alert('✓ Aaj ka Zaati Jaiza & Mood history mein mehfooz ho gaya!');
    }
  };

  const filteredHistory = muhasabaHistory.filter((m) => {
    const q = searchHistoryQuery.toLowerCase();
    return (
      m.date.includes(q) ||
      m.mood.toLowerCase().includes(q) ||
      m.note.toLowerCase().includes(q) ||
      (m.goodHabitAdopted && m.goodHabitAdopted.toLowerCase().includes(q)) ||
      (m.badHabitAvoided && m.badHabitAvoided.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Daily Muhasaba (ذاتی جائزہ) & Mood
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Rozana ka nafsiyatee jaiza, aadaton ka hisab, mood, aur deeni o ilmi tarqqi
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs shadow-sm">
          <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-slate-700 dark:text-slate-400 font-bold">Tareekh:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleSelectDate(e.target.value)}
            className="bg-transparent text-slate-900 dark:text-white font-bold outline-none cursor-pointer text-xs"
          />
        </div>
      </div>

      {/* Main Muhasaba Form Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <form onSubmit={handleSaveMuhasaba} className="space-y-5 text-xs">
          
          {/* 1. Daily Mood Selection */}
          <div>
            <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              1. Aaj Ka Mood & Mindset (کیسا دن گزرا؟) *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {MOODS.map((m) => {
                const isSelected = selectedMood === m.label;
                return (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setSelectedMood(m.label)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? `${m.color} ring-2 ring-indigo-500 shadow-sm scale-102`
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    <span className="text-base">{m.emoji}</span>
                    <span className="truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Good Habit Adopted / Intention */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <label className="text-xs font-black text-emerald-950 dark:text-emerald-200">
                2. Kon si Achi Aadat is din apnanay ka irada kia ya apnai? (Good Habit Adopted)
              </label>
            </div>
            <input
              type="text"
              autoComplete="off"
              value={goodHabitAdopted}
              onChange={(e) => setGoodHabitAdopted(e.target.value)}
              placeholder="e.g. Subah Fajr par uthna, 2 ghante deep focus study, shukarguzari ki aadat..."
              className="w-full bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* 3. Bad Habit Quitted / Intention to Avoid */}
          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <label className="text-xs font-black text-rose-950 dark:text-rose-200">
                3. Kon si Buri Aadat is din chornay ka irada kia ya chori? (Bad Habit Avoided / Quit)
              </label>
            </div>
            <input
              type="text"
              autoComplete="off"
              value={badHabitAvoided}
              onChange={(e) => setBadHabitAvoided(e.target.value)}
              placeholder="e.g. Fuzool mobile phone scrolling se parhez kia, gussa control kia, waqt zaya nai kia..."
              className="w-full bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* 4. Darood Shareef Log Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                4. Darood Shareef Recitation Count (درود شریف تعداد)
              </label>
              <input
                type="number"
                min="0"
                autoComplete="off"
                value={daroodCount}
                onChange={(e) => {
                  const val = e.target.value;
                  setDaroodCount(val === '' ? '' : parseInt(val, 10));
                }}
                placeholder="e.g. 100, 300, 1000"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tareekh / Entry Date
              </label>
              <div className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs">
                📅 {selectedDate} {selectedDate === todayStr ? '(Today)' : ''}
              </div>
            </div>
          </div>

          {/* 5. Daily Muhasaba Reflection Note */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                5. Daily Muhasaba & Reflection Note (آج کا تفصیلی محاسبہ و یادداشت) *
              </label>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                {muhasabaNote.length} characters
              </span>
            </div>
            <textarea
              rows={4}
              autoComplete="off"
              value={muhasabaNote}
              onChange={(e) => setMuhasabaNote(e.target.value)}
              placeholder="Aaj ka din kaisa guzra? Kahan waqt zaya hua aur kahan faida hua? Kal ke liay kia behtari karni hai..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                setMuhasabaNote('');
                setGoodHabitAdopted('');
                setBadHabitAvoided('');
                setEditingId(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold"
            >
              Clear Form
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{editingId ? 'Update Muhasaba' : 'Save Today\'s Muhasaba'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Muhasaba History Log */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Muhasaba History & Reflection Log
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold">
              {muhasabaHistory.length} Entries
            </span>
          </div>

          {/* Search filter for history */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchHistoryQuery}
              onChange={(e) => setSearchHistoryQuery(e.target.value)}
              placeholder="Search past reflections..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <HeartHandshake className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No Muhasaba reflections logged yet</p>
            <p className="text-[11px] text-slate-500 mt-1">Fill the form above to record your daily self-audit and reflections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredHistory.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-xl border border-indigo-200 dark:border-indigo-900/40">
                      📅 {entry.date}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      Mood: {entry.mood}
                    </span>
                    {entry.daroodCount ? (
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20">
                        📿 {entry.daroodCount} Durood
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSelectDate(entry.date)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit this entry"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this Muhasaba entry permanently?')) {
                          onDeleteMuhasabaEntry(entry.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Habit Notes */}
                {(entry.goodHabitAdopted || entry.badHabitAvoided) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {entry.goodHabitAdopted && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200">
                        <span className="font-bold block text-[10px] uppercase text-emerald-700 dark:text-emerald-400">
                          ✓ Achi Aadat Apnai:
                        </span>
                        <span>{entry.goodHabitAdopted}</span>
                      </div>
                    )}
                    {entry.badHabitAvoided && (
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-950 dark:text-rose-200">
                        <span className="font-bold block text-[10px] uppercase text-rose-700 dark:text-rose-400">
                          ✗ Buri Aadat Chori / Parhez:
                        </span>
                        <span>{entry.badHabitAvoided}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Personal Note */}
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  {entry.note}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

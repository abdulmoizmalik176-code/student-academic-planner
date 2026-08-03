import React, { useState } from 'react';
import { 
  BarChart3, 
  Smile, 
  Calendar, 
  Search, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  Flame
} from 'lucide-react';
import { DailyMoodNote, Task } from '../types';

interface AnalyticsViewProps {
  tasks: Task[];
  namazLog: Record<string, string[]>;
  quranLog: string[];
  notesHistory: Record<string, DailyMoodNote>;
  onSaveMoodNote: (dateStr: string, mood: DailyMoodNote['mood'], note: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks,
  namazLog,
  quranLog,
  notesHistory,
  onSaveMoodNote,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = notesHistory[todayStr] || { date: todayStr, mood: 'Normal', note: '' };

  const [mood, setMood] = useState<DailyMoodNote['mood']>(todayEntry.mood);
  const [note, setNote] = useState(todayEntry.note);
  const [searchDate, setSearchDate] = useState(todayStr);

  const handleSaveCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMoodNote(todayStr, mood, note);
    alert('✅ Daily Mood & Note Saved!');
  };

  // Searched historical date data
  const searchedTasks = tasks.filter((t) => t.doneDates.includes(searchDate));
  const searchedNamaz = namazLog[searchDate] || [];
  const searchedQuran = quranLog.includes(searchDate);
  const searchedNote = notesHistory[searchDate];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Analytics & Daily Journal
          </h2>
          <p className="text-xs text-slate-400">Track long-term productivity trends, mood wellness, and historical logs</p>
        </div>
      </div>

      {/* 1. Daily Mood & Wellness Journal Check-In */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Smile className="w-4 h-4 text-amber-400" />
          Today's Mood & Study Reflection ({todayStr})
        </h3>

        <form onSubmit={handleSaveCheckin} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-2">How are you feeling today?</label>
            <div className="flex items-center gap-2 flex-wrap">
              {(['Productive', 'Happy', 'Normal', 'Tired', 'Stressed'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`px-3.5 py-2 rounded-xl font-bold border transition-all ${
                    mood === m
                      ? 'bg-amber-500 text-white border-amber-400 shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {m === 'Productive' && '⚡ '}
                  {m === 'Happy' && '😊 '}
                  {m === 'Normal' && '😐 '}
                  {m === 'Tired' && '😴 '}
                  {m === 'Stressed' && '🤯 '}
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Daily Study Reflection / Journal Notes</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What went well today? What concepts need more practice tomorrow?"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md shadow-amber-500/20"
          >
            Save Daily Check-In
          </button>
        </form>
      </div>

      {/* 2. Work History Viewer by Date */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-400" />
            Historical Date Activity Search
          </h3>

          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Tasks Done on Date */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400">Tasks Completed ({searchedTasks.length})</span>
            {searchedTasks.length === 0 ? (
              <p className="text-xs text-slate-500">No completed tasks on {searchDate}.</p>
            ) : (
              <ul className="space-y-1 text-xs text-slate-300">
                {searchedTasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Prayers Logged on Date */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-pink-400">Prayers Logged ({searchedNamaz.length}/5)</span>
            {searchedNamaz.length === 0 ? (
              <p className="text-xs text-slate-500">No prayers logged on {searchDate}.</p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {searchedNamaz.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[10px] font-bold">
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Saved Journal Note */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-400">Journal & Mood</span>
            {searchedNote ? (
              <div>
                <p className="text-xs font-bold text-white">Mood: {searchedNote.mood}</p>
                <p className="text-xs text-slate-400 line-clamp-2">{searchedNote.note || '(No written note)'}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No journal entry for {searchDate}.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

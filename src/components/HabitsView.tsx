import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  Check, 
  Trash2, 
  Calendar, 
  Sparkles,
  X
} from 'lucide-react';
import { Habit } from '../types';

interface HabitsViewProps {
  habits: Habit[];
  onAddHabit: (newHabit: Omit<Habit, 'id' | 'log'>) => void;
  onToggleHabitDay: (habitId: string, dateStr: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  onAddHabit,
  onToggleHabitDay,
  onDeleteHabit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Study' | 'Health' | 'Spiritual' | 'Personal'>('Study');
  const [color, setColor] = useState('#6366f1');

  // Past 7 days
  const today = new Date();
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      dateNum: d.getDate(),
    };
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddHabit({
      name,
      category,
      color,
      days: [true, true, true, true, true, true, true],
    });

    setName('');
    setIsModalOpen(false);
  };

  const colorOptions = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-400 fill-amber-400" />
            Habit Consistency & Heatmaps
          </h2>
          <p className="text-xs text-slate-400">Build long-term study and personal discipline with daily tracking</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Habit</span>
        </button>
      </div>

      {/* Habit Cards List */}
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="p-10 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No habits added yet</p>
            <p className="text-xs text-slate-500 mt-1">Tap "+ Add Custom Habit" to begin your streak.</p>
          </div>
        ) : (
          habits.map((habit) => {
            const completedCount = past7Days.filter((d) => habit.log.includes(d.dateStr)).length;

            return (
              <div
                key={habit.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-md hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div>
                      <h4 className="font-bold text-white text-base">{habit.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-300">
                          {habit.category || 'Personal'}
                        </span>
                        <span>{completedCount} / 7 Days Done</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs border border-rose-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Past 7 Days Heatmap Buttons */}
                <div className="grid grid-cols-7 gap-2">
                  {past7Days.map((d) => {
                    const isDone = habit.log.includes(d.dateStr);

                    return (
                      <button
                        key={d.dateStr}
                        onClick={() => onToggleHabitDay(habit.id, d.dateStr)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                          isDone
                            ? 'text-white shadow-md scale-105 border-transparent'
                            : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:border-slate-700'
                        }`}
                        style={{
                          backgroundColor: isDone ? habit.color : undefined,
                        }}
                      >
                        <span className="text-[10px] uppercase font-bold opacity-80">{d.dayName}</span>
                        <span className="text-xs font-black">{d.dateNum}</span>
                        {isDone && <Check className="w-3.5 h-3.5 mt-0.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Habit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Create Custom Habit
            </h3>

            <form onSubmit={handleCreateHabit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Habit Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Read 15 Pages of Physics Textbook"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Study">Study & Academics</option>
                  <option value="Health">Health & Wellness</option>
                  <option value="Spiritual">Spiritual & Quran</option>
                  <option value="Personal">Personal Development</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        color === c ? 'scale-125 ring-2 ring-white' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/20"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  Check, 
  Trash2, 
  Calendar, 
  Sparkles,
  X,
  Edit3
} from 'lucide-react';
import { Habit } from '../types';

interface HabitsViewProps {
  habits: Habit[];
  onAddHabit: (newHabit: Omit<Habit, 'id' | 'log'>) => void;
  onToggleHabitDay: (habitId: string, dateStr: string) => void;
  onDeleteHabit: (habitId: string) => void;
  onEditHabit?: (habitId: string, updated: Partial<Habit>) => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  onAddHabit,
  onToggleHabitDay,
  onDeleteHabit,
  onEditHabit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
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

  const handleOpenAddModal = () => {
    setEditingHabit(null);
    setName('');
    setCategory('Study');
    setColor('#6366f1');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setName(habit.name);
    setCategory(habit.category || 'Study');
    setColor(habit.color || '#6366f1');
    setIsModalOpen(true);
  };

  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingHabit && onEditHabit) {
      onEditHabit(editingHabit.id, {
        name: name.trim(),
        category,
        color,
      });
    } else {
      onAddHabit({
        name: name.trim(),
        category,
        color,
        days: [true, true, true, true, true, true, true],
      });
    }

    setEditingHabit(null);
    setName('');
    setCategory('Study');
    setColor('#6366f1');
    setIsModalOpen(false);
  };

  const colorOptions = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500 dark:text-amber-400 fill-amber-500" />
            Habit Consistency & Heatmaps
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Build long-term study and personal discipline with daily tracking
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Habit</span>
        </button>
      </div>

      {/* Habit Cards List */}
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 shadow-sm">
            <Calendar className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No habits added yet</p>
            <p className="text-xs text-slate-500 mt-1">Tap "+ Add Custom Habit" to begin your streak.</p>
          </div>
        ) : (
          habits.map((habit) => {
            const completedCount = past7Days.filter((d) => habit.log.includes(d.dateStr)).length;

            return (
              <div
                key={habit.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{habit.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                          {habit.category || 'Personal'}
                        </span>
                        <span>{completedCount} / 7 Days Done</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(habit)}
                      className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit habit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete habit "${habit.name}"?`)) {
                          onDeleteHabit(habit.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete habit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 7-Day Consistency Grid */}
                <div>
                  <div className="flex items-center justify-between gap-1 sm:gap-2">
                    {past7Days.map((day) => {
                      const isDone = habit.log.includes(day.dateStr);

                      return (
                        <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{day.dayName}</span>
                          <button
                            onClick={() => onToggleHabitDay(habit.id, day.dateStr)}
                            className={`w-full aspect-square max-w-[40px] rounded-xl flex items-center justify-center transition-all ${
                              isDone
                                ? 'text-white shadow-md'
                                : 'bg-slate-100 dark:bg-slate-800 text-transparent border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                            }`}
                            style={{
                              backgroundColor: isDone ? habit.color : undefined,
                            }}
                          >
                            {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                          </button>
                          <span className="text-[10px] text-slate-500">{day.dateNum}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Habit Modal */}
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
                {editingHabit ? 'Edit Habit' : 'Add Custom Habit'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHabit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Habit Name *</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Read 15 Pages of Physics Textbook"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Study">Study & Academics</option>
                  <option value="Health">Health & Wellness</option>
                  <option value="Spiritual">Spiritual & Quran</option>
                  <option value="Personal">Personal Development</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        color === c ? 'scale-125 ring-2 ring-indigo-500 dark:ring-white' : ''
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
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold"
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

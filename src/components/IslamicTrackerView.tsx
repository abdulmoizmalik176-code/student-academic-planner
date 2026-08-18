import React, { useState } from 'react';
import { 
  Moon, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  MapPin, 
  Sparkles, 
  Flame,
  Heart,
  Plus,
  RotateCcw,
  Check,
  Award
} from 'lucide-react';
import { NAMAZ_SCHEDULE } from '../data/initialData';

interface IslamicTrackerViewProps {
  city: string;
  onChangeCity: (newCity: string) => void;
  namazLog: string[];
  quranDone: boolean;
  daroodCount: number;
  daroodDone?: boolean;
  onToggleNamaz: (prayerName: string) => void;
  onToggleQuran: () => void;
  onUpdateDarood: (count: number) => void;
  onToggleDarood?: () => void;
}

export const IslamicTrackerView: React.FC<IslamicTrackerViewProps> = ({
  city,
  onChangeCity,
  namazLog,
  quranDone,
  daroodCount,
  daroodDone,
  onToggleNamaz,
  onToggleQuran,
  onUpdateDarood,
  onToggleDarood,
}) => {
  const schedule = NAMAZ_SCHEDULE[city] || NAMAZ_SCHEDULE['Islamabad'];
  const prayers = ['Fajr', 'Zuhr', 'Asr', 'Maghrib', 'Isha'] as const;

  // Determine if darood is done (either from daroodDone prop or count >= 500 or count > 0)
  const isDaroodCompleted = daroodDone !== undefined 
    ? daroodDone 
    : (daroodCount >= 500 || daroodCount > 0);

  const handleToggle = () => {
    if (onToggleDarood) {
      onToggleDarood();
    } else {
      if (isDaroodCompleted) {
        onUpdateDarood(0);
      } else {
        onUpdateDarood(500);
      }
    }
  };

  const handleSetTarget = (target: number) => {
    onUpdateDarood(target);
  };

  const allPrayersDone = prayers.every((p) => namazLog.includes(p));

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Moon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Namaz, Quran & Durood Tracker
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Log your 5 daily prayers, Quran recitation, and daily 500–1000 Durood Shareef
          </p>
        </div>

        {/* City Selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-3 py-1.5 rounded-xl text-xs shadow-sm">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-slate-700 dark:text-slate-400 font-medium">City:</span>
          <select
            value={city}
            onChange={(e) => onChangeCity(e.target.value)}
            className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
          >
            {Object.keys(NAMAZ_SCHEDULE).map((c) => (
              <option key={c} value={c} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Daily Spiritual Hadith / Quran Reflection */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-800 dark:from-emerald-950 dark:via-slate-900 dark:to-teal-950 border border-emerald-600/30 dark:border-emerald-500/30 text-white space-y-1 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-200 dark:text-emerald-400">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Fazilat of Durood & Prayer</span>
        </div>
        <p className="text-xs italic text-emerald-50 dark:text-emerald-100/90 pt-1">
          "The closest of people to me on the Day of Resurrection will be those who sent the most blessings upon me." (Jami` at-Tirmidhi 484)
        </p>
      </div>

      {/* 5 Daily Prayers Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">
            Today's 5 Daily Prayers
          </h3>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
            allPrayersDone 
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            {namazLog.length} / 5 Prayers Done
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {prayers.map((prayer) => {
            const isDone = namazLog.includes(prayer);
            const prayerTime = schedule[prayer];

            return (
              <div
                key={prayer}
                onClick={() => onToggleNamaz(prayer)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 select-none ${
                  isDone
                    ? 'bg-emerald-100/90 border-emerald-400 dark:bg-emerald-950/60 dark:border-emerald-500/50 shadow-md scale-102'
                    : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold ${isDone ? 'text-emerald-950 dark:text-emerald-300' : 'text-slate-900 dark:text-slate-300'}`}>
                    {prayer}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                  )}
                </div>

                <div>
                  <p className={`text-lg sm:text-xl font-black ${isDone ? 'text-emerald-950 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                    {prayerTime}
                  </p>
                  <p className={`text-[11px] font-bold ${isDone ? 'text-emerald-800 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {isDone ? '✓ Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily 500 to 1000 Durood Shareef Log Card */}
      <div className={`p-5 rounded-3xl border transition-all shadow-sm space-y-4 ${
        isDaroodCompleted
          ? 'bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/30 border-emerald-300 dark:border-emerald-800'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-3.5 rounded-2xl border transition-colors ${
              isDaroodCompleted
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
            }`}>
              <Heart className={`w-6 h-6 ${isDaroodCompleted ? 'fill-emerald-500/40 text-emerald-600 dark:text-emerald-400' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Daily 500 - 1000 Durood Shareef Log
                </h3>
                {isDaroodCompleted ? (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3 h-3" /> COMPLETED
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    Target: 500–1000
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                روزانہ 500 تا 1000 درود شریف پڑھنے کا روزمرہ لاگ
              </p>
            </div>
          </div>

          {/* Big One-Tap Check Toggle Button */}
          <button
            onClick={handleToggle}
            className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-md active:scale-95 ${
              isDaroodCompleted
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25 ring-2 ring-emerald-400/40'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
            }`}
          >
            {isDaroodCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-white fill-emerald-400/40" />
                <span>✓ 500-1000 Darood Recited Today</span>
              </>
            ) : (
              <>
                <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                <span>Mark Recited (500-1000 Darood)</span>
              </>
            )}
          </button>
        </div>

        {/* Durood Shareef Text */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/5 dark:bg-slate-950/60 border border-emerald-500/15 text-center">
          <p className="text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-200 tracking-wide font-serif leading-relaxed">
            اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ
          </p>
        </div>

        {/* Quick Target Options / Status Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold">Daily Target Options:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSetTarget(500)}
              className={`px-3 py-1 rounded-xl font-bold transition-all text-xs ${
                daroodCount === 500 && isDaroodCompleted
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/50'
              }`}
            >
              500 Recited
            </button>
            <button
              onClick={() => handleSetTarget(1000)}
              className={`px-3 py-1 rounded-xl font-bold transition-all text-xs ${
                daroodCount === 1000 && isDaroodCompleted
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/50'
              }`}
            >
              1000 Recited
            </button>
            {isDaroodCompleted && (
              <button
                onClick={() => onUpdateDarood(0)}
                className="px-2.5 py-1 rounded-xl font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px]"
                title="Reset status"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quran Recitation Log Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Daily Quran Recitation (تلاوتِ قرآن)</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Recite at least 1 Ruku or Surah daily to keep your streak</p>
            </div>
          </div>

          <button
            onClick={onToggleQuran}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              quranDone
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
            }`}
          >
            {quranDone ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Quran Recited Today!</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Mark Recited</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

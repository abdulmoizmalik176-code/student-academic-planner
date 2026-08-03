import React from 'react';
import { 
  Moon, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  MapPin, 
  Sparkles, 
  Flame,
  Award
} from 'lucide-react';
import { NAMAZ_SCHEDULE } from '../data/initialData';

interface IslamicTrackerViewProps {
  city: string;
  onChangeCity: (newCity: string) => void;
  namazLog: string[];
  quranDone: boolean;
  onToggleNamaz: (prayerName: string) => void;
  onToggleQuran: () => void;
}

export const IslamicTrackerView: React.FC<IslamicTrackerViewProps> = ({
  city,
  onChangeCity,
  namazLog,
  quranDone,
  onToggleNamaz,
  onToggleQuran,
}) => {
  const schedule = NAMAZ_SCHEDULE[city] || NAMAZ_SCHEDULE['Islamabad'];
  const prayers = ['Fajr', 'Zuhr', 'Asr', 'Maghrib', 'Isha'] as const;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Moon className="w-6 h-6 text-amber-400" />
            Namaz & Quran Routine Tracker
          </h2>
          <p className="text-xs text-slate-400">Log 5 daily prayers and daily Quran recitation to unlock break rewards</p>
        </div>

        {/* City Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400 font-medium">City:</span>
          <select
            value={city}
            onChange={(e) => onChangeCity(e.target.value)}
            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
          >
            {Object.keys(NAMAZ_SCHEDULE).map((c) => (
              <option key={c} value={c} className="bg-slate-900">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Daily Spiritual Quote / Reflection */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 text-white space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Daily Islamic Reflection</span>
        </div>
        <p className="text-xs italic text-emerald-100/90 pt-1">
          "Recite what has been revealed to you of the Book and establish prayer. Indeed, prayer prohibits immorality and wrongdoing." (Quran 29:45)
        </p>
      </div>

      {/* 5 Daily Prayers List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's 5 Prayers</h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {prayers.map((prayer) => {
            const isDone = namazLog.includes(prayer);
            const prayerTime = schedule[prayer];

            return (
              <div
                key={prayer}
                onClick={() => onToggleNamaz(prayer)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isDone
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg scale-102'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">{prayer}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600" />
                  )}
                </div>

                <div>
                  <p className="text-lg font-black text-white">{prayerTime}</p>
                  <p className="text-[10px] text-slate-400">{isDone ? 'Completed (+15 XP)' : 'Pending'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quran Recitation Log Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Daily Quran Recitation</h3>
              <p className="text-xs text-slate-400">Read at least 1 page or Surah daily (+20 XP)</p>
            </div>
          </div>

          <button
            onClick={onToggleQuran}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              quranDone
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {quranDone ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Quran Recited!</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-slate-400" />
                <span>Mark Recited</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

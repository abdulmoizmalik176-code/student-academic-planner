import React from 'react';
import { 
  X, 
  Lightbulb, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  Flame, 
  Gamepad2, 
  Moon, 
  Clock, 
  BookOpen, 
  Layers 
} from 'lucide-react';

interface IdeaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IdeaGuideModal: React.FC<IdeaGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const categories = [
    {
      title: '1. Academic & Exam Mastery (Inspired by Todait & Notion)',
      icon: GraduationCap,
      color: 'text-pink-400',
      features: [
        {
          name: 'Syllabus Coverage & Exam Countdown',
          desc: 'Tracks preparation percentage per subject with weighted exam dates, keeping students aware of high-value tests.'
        },
        {
          name: 'Class Timetable & Room Locator',
          desc: 'Visual weekly timetable mapping courses, instructor names, rooms, and class times so students never miss lectures.'
        },
        {
          name: 'GPA & Course Grade Target Calculator',
          desc: 'Logs assignment scores, midterms, and project weights to calculate current averages and target scores needed for top grades.'
        }
      ]
    },
    {
      title: '2. Focus & Anti-Distraction (Inspired by YPT & Forest)',
      icon: Clock,
      color: 'text-purple-400',
      features: [
        {
          name: 'Subject-Specific Study Timer',
          desc: 'Logs exact focus hours per subject (e.g., 2h Calculus vs 1h Physics) to ensure balanced study distribution across coursework.'
        },
        {
          name: 'Web Audio Ambient Sounds',
          desc: 'Built-in binaural beats, soft rain, and lo-fi synth white noise generators to improve focus without needing external apps.'
        },
        {
          name: 'Conditional Reward Entertainment Unlock',
          desc: 'Unlocks 2 hours of gaming or social media break ONLY after completing daily Namaz, Quran, and tasks, preventing procrastination.'
        }
      ]
    },
    {
      title: '3. AI-Powered Study Assistant (Gemini Flash Integration)',
      icon: Sparkles,
      color: 'text-indigo-400',
      features: [
        {
          name: 'AI Test Quiz & Flashcard Maker',
          desc: 'Instantly generates 3-5 multiple-choice practice questions with instant scoring and explanations from any chapter topic.'
        },
        {
          name: 'AI Goal & Assignment Breakdown',
          desc: 'Converts overwhelming assignments (e.g., "Write Research Paper") into manageable micro-tasks with estimated durations and tips.'
        },
        {
          name: 'Topic Summarizer & Memory Aids',
          desc: 'Simplifies complex lecture notes into key bullet takeaways and catchy mnemonic memory devices for fast revision.'
        }
      ]
    },
    {
      title: '4. Spiritual Routine & Personal Wellness (Inspired by Muslim Pro)',
      icon: Moon,
      color: 'text-amber-400',
      features: [
        {
          name: 'City-Based Namaz Prayer Timings',
          desc: 'Calculates Fajr, Zuhr, Asr, Maghrib, and Isha timings for major cities with completion checkboxes.'
        },
        {
          name: 'Quran Recitation & Reflection Log',
          desc: 'Encourages daily spiritual growth with Quran logging and daily inspirational reflections.'
        },
        {
          name: 'Habit Consistency Heatmaps & Mood Journaling',
          desc: '7-day visual habit completion grids and daily reflection notes for physical and mental wellbeing.'
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto my-auto text-slate-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold">
            <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Essential Student Features Breakdown</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Top Features for the Ultimate Student Routine App
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Based on research of leading productivity apps (YPT, Todait, Habitica, Forest, Muslim Pro), here is how we structured and completed this application to help students succeed:
          </p>
        </div>

        <div className="space-y-5">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className={`font-bold text-sm flex items-center gap-2 ${cat.color}`}>
                  <Icon className="w-4 h-4" />
                  {cat.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {cat.features.map((feat, fIdx) => (
                    <div key={fIdx} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
                      <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                        <span>{feat.name}</span>
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg"
          >
            Got It! Return to App
          </button>
        </div>
      </div>
    </div>
  );
};

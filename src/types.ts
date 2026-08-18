export type Priority = 'High' | 'Medium' | 'Low';

export type TraitType = 'good' | 'bad';

export type GoodTraitStatus = 'adopting' | 'mastered' | 'slipping';
export type BadTraitStatus = 'quitting' | 'controlled' | 'overcome' | 'relapsed';

export type TrendDirection = 'improving' | 'stable' | 'worsening';

export interface CharacterTrait {
  id: string;
  title: string;
  type: TraitType; // 'good' = Achi Aadat / Virtue, 'bad' = Buri Aadat / Flaw
  category?: 'Akhlaq & Morals' | 'Discipline & Study' | 'Spiritual / Deen' | 'Health & Routine' | 'Mindset & Emotions';
  status: GoodTraitStatus | BadTraitStatus;
  trend: TrendDirection;
  daysCleanOrPracticed: number;
  lastUpdatedDate: string; // YYYY-MM-DD
  historyDates?: string[];
  notes?: string;
  replacementHabit?: string; // For bad habits: what good habit replaces it
  triggerOrReason?: string;
  progressPercentage: number;
}

export interface Task {
  id: string;
  name: string;
  time: string;
  priority: Priority;
  recurring: boolean;
  note?: string;
  doneDates: string[]; // YYYY-MM-DD
  progress: number; // 0 - 100
  dateAdded: string;
  subject?: string;
  estimatedMinutes?: number;
}

export interface Habit {
  id: string;
  name: string;
  color: string;
  days: boolean[]; // 7 days (Mon-Sun)
  log: string[]; // YYYY-MM-DD
  category?: 'Study' | 'Health' | 'Spiritual' | 'Personal';
}

export interface Exam {
  id: string;
  subject: string;
  date: string; // YYYY-MM-DD
  prep: number; // 0 - 100
  weight?: number;
  syllabusNotes?: string;
}

export interface Project {
  id: string;
  title: string;
  type?: 'App Development' | 'Online Course' | 'Skill Learning' | 'Exam Prep' | 'Personal Project';
  start: string;
  end: string;
  completed: boolean;
  progress: number;
  subject?: string;
  notes?: string;
  resourceLink?: string;
  subtasks?: { id: string; title: string; done: boolean }[];
}

export interface ClassSession {
  id: string;
  subject: string;
  studyMethod?: string;
  dayOfWeek?: number; // legacy single day
  days: number[]; // Flexible array of days (0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun)
  startTime: string;
  endTime: string;
  durationMinutes?: number;
  priority?: Priority;
  color: string;
  category?: 'Study' | 'Namaz' | 'Business' | 'Break' | 'Personal' | 'Revision';
  notes?: string;
  isCompletedToday?: boolean;
  code?: string;
  instructor?: string;
  room?: string;
}

export interface CourseGrade {
  id: string;
  courseName: string;
  credits: number;
  currentScore: number;
  targetGrade: string;
  assignments: { id: string; name: string; score: number; maxScore: number; weight: number }[];
}

export interface DailyMoodNote {
  date: string;
  mood: 'Productive' | 'Peaceful' | 'Motivated' | 'Happy' | 'Normal' | 'Tired' | 'Stressed' | 'Challenged' | 'Regretful';
  note: string;
  studyHours?: number;
  waterGlasses?: number;
}

export interface MuhasabaEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // e.g. "09:30 PM"
  note: string;
  mood: 'Productive' | 'Peaceful' | 'Motivated' | 'Challenged' | 'Regretful' | 'Happy' | 'Normal' | 'Tired' | 'Stressed';
  tags?: string[];
  goodHabitAdopted?: string; // Kon si adat apnai ya apnanay ka irada kia
  badHabitAvoided?: string; // Kon si adat chori ya chornay ka irada kia
  goodHabitsNoted?: string;
  badHabitsResisted?: string;
  characterScoreAtTime?: number;
  daroodCount?: number; // Darood Shareef count for that day
}

export type EntertainmentStatus = 'enjoyed' | 'unlocked_not_used' | 'locked' | 'skipped_for_study';

export interface EntertainmentLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  status: EntertainmentStatus;
  minutesUsed: number;
  activityNote?: string;
  unlockedTime?: string;
  prayersCount?: number;
  tasksCompletedCount?: number;
}

export interface NamazLog {
  [dateStr: string]: string[]; // Array of prayer names: 'Fajr', 'Zuhr', 'Asr', 'Maghrib', 'Isha'
}

export interface UserStats {
  xp?: number;
  level?: number;
  streak: number;
  dark_mode: boolean;
  city: string;
  entTimerRunning: boolean;
  entTimeLeft: number; // seconds
  waterGlasses?: number;
}

export type ActiveTab = 
  | 'home' 
  | 'tasks' 
  | 'timetable'
  | 'islamic' 
  | 'habits' 
  | 'self_reflection'
  | 'muhasaba' 
  | 'reports' 
  | 'academic' 
  | 'guide';

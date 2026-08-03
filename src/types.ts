export type Priority = 'High' | 'Medium' | 'Low';

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
  weight?: number; // e.g. 30%
  syllabusNotes?: string;
}

export interface Project {
  id: string;
  title: string;
  start: string;
  end: string;
  completed: boolean;
  progress: number;
  subject?: string;
  subtasks?: { id: string; title: string; done: boolean }[];
}

export interface ClassSession {
  id: string;
  subject: string;
  code: string;
  instructor: string;
  room: string;
  dayOfWeek: number; // 0=Mon, 6=Sun
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  color: string;
}

export interface CourseGrade {
  id: string;
  courseName: string;
  credits: number;
  currentScore: number; // 0 - 100
  targetGrade: string; // e.g., 'A', '3.8'
  assignments: { id: string; name: string; score: number; maxScore: number; weight: number }[];
}

export interface DailyMoodNote {
  date: string;
  mood: 'Happy' | 'Normal' | 'Tired' | 'Stressed' | 'Productive';
  note: string;
  studyHours?: number;
  waterGlasses?: number;
}

export interface NamazLog {
  [dateStr: string]: string[]; // Array of prayer names: 'Fajr', 'Zuhr', etc.
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserStats {
  points: number;
  level: number;
  badges: string[];
  streak: number;
  dark_mode: boolean;
  city: string;
  entTimerRunning: boolean;
  entTimeLeft: number; // seconds
  waterGlasses?: number; // glasses drank today (0-8)
}

export type ActiveTab = 
  | 'home' 
  | 'tasks' 
  | 'habits' 
  | 'focus' 
  | 'islamic' 
  | 'academic' 
  | 'ai' 
  | 'reports' 
  | 'guide';

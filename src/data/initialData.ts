import { 
  Task, 
  Habit, 
  Exam, 
  Project, 
  ClassSession, 
  CourseGrade, 
  UserStats, 
  CharacterTrait, 
  MuhasabaEntry, 
  EntertainmentLogEntry 
} from '../types';

export const TODAY_STR = new Date().toISOString().split('T')[0];
export const YESTERDAY_STR = new Date(Date.now() - 86400000).toISOString().split('T')[0];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't_1',
    name: 'Revise Computer Science Algorithms (Recursion & DP)',
    time: '04:00 PM',
    priority: 'High',
    recurring: true,
    note: 'Chapter 4 & LeetCode problems 1 to 5',
    doneDates: [TODAY_STR],
    progress: 100,
    dateAdded: TODAY_STR,
    subject: 'Computer Science',
    estimatedMinutes: 60
  },
  {
    id: 't_2',
    name: 'Physics Numerical Practice (Wave Optics)',
    time: '06:00 PM',
    priority: 'High',
    recurring: false,
    note: 'Solve Exercise 10 problems',
    doneDates: [],
    progress: 40,
    dateAdded: TODAY_STR,
    subject: 'Physics',
    estimatedMinutes: 45
  },
  {
    id: 't_3',
    name: 'English Essay Writing & Grammar Drill',
    time: '08:30 PM',
    priority: 'Medium',
    recurring: true,
    note: 'Write 300 words on AI in Education',
    doneDates: [],
    progress: 0,
    dateAdded: TODAY_STR,
    subject: 'English',
    estimatedMinutes: 30
  }
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'h_1',
    name: 'Daily 1 Hour Deep Study Focus',
    color: '#6366f1',
    days: [true, true, true, true, true, true, true],
    log: [TODAY_STR, YESTERDAY_STR],
    category: 'Study'
  },
  {
    id: 'h_2',
    name: 'Surah Al-Mulk Recitation before Sleep',
    color: '#10b981',
    days: [true, true, true, true, true, true, true],
    log: [TODAY_STR, YESTERDAY_STR],
    category: 'Spiritual'
  },
  {
    id: 'h_3',
    name: 'Drink 2.5L Water & Morning Walk',
    color: '#06b6d4',
    days: [true, true, true, true, true, true, true],
    log: [TODAY_STR],
    category: 'Health'
  }
];

export const INITIAL_CHARACTER_TRAITS: CharacterTrait[] = [
  {
    id: 'trait_1',
    title: 'Subah Fajr ke waqt bedaar hona aur Deen par pabandi',
    type: 'good',
    category: 'Spiritual / Deen',
    status: 'adopting',
    trend: 'improving',
    daysCleanOrPracticed: 14,
    lastUpdatedDate: TODAY_STR,
    historyDates: [TODAY_STR, YESTERDAY_STR],
    progressPercentage: 80,
    notes: 'Alhamdulillah alarm sunte hi uthne ki aadat behtar ho rahi hai.',
    replacementHabit: 'Raat ko jaldi sona'
  },
  {
    id: 'trait_2',
    title: 'Rozana 2 ghantay baghair phone ke concentrated study',
    type: 'good',
    category: 'Discipline & Study',
    status: 'adopting',
    trend: 'improving',
    daysCleanOrPracticed: 9,
    lastUpdatedDate: TODAY_STR,
    progressPercentage: 70,
    notes: 'Pomodoro timer use karna helpful hai.'
  },
  {
    id: 'trait_3',
    title: 'Fuzool phone scrolling aur reel watching',
    type: 'bad',
    category: 'Discipline & Study',
    status: 'quitting',
    trend: 'improving',
    daysCleanOrPracticed: 5,
    lastUpdatedDate: TODAY_STR,
    progressPercentage: 65,
    triggerOrReason: 'Bore hona ya thakan mehsoos karna',
    replacementHabit: 'Book reading ya 10 min walk',
    notes: 'Screen time limit app lagai hui hai.'
  },
  {
    id: 'trait_4',
    title: 'Kaam kal par taalna (Procrastination)',
    type: 'bad',
    category: 'Discipline & Study',
    status: 'controlled',
    trend: 'improving',
    daysCleanOrPracticed: 12,
    lastUpdatedDate: TODAY_STR,
    progressPercentage: 75,
    triggerOrReason: 'Mushkil assignment dekh kar darna',
    replacementHabit: '5-Minute Rule: shuruat karna bas'
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'ex_1',
    subject: 'Computer Science Mid-Term',
    date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    prep: 75,
    weight: 30,
    syllabusNotes: 'Data Structures, OOP Concepts, SQL Queries'
  },
  {
    id: 'ex_2',
    subject: 'Physics Semester Finals',
    date: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    prep: 50,
    weight: 40,
    syllabusNotes: 'Electromagnetism, Modern Physics, Thermodynamics'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    title: 'Full Stack Web App Portfolio',
    type: 'App Development',
    start: TODAY_STR,
    end: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    completed: false,
    progress: 40,
    subject: 'Web Dev',
    notes: 'React, TypeScript and Tailwind frontend project with interactive dashboard',
    subtasks: [
      { id: 'st_1', title: 'UI Design & Wireframe', done: true },
      { id: 'st_2', title: 'Component Architecture', done: true },
      { id: 'st_3', title: 'Database Integration', done: false },
      { id: 'st_4', title: 'Deployment & Testing', done: false }
    ]
  }
];

export const INITIAL_TIMETABLE: ClassSession[] = [
  {
    id: 'tt_1',
    subject: 'Fajr & Morning Quran Recitation',
    startTime: '05:15 AM',
    endTime: '06:00 AM',
    days: [0, 1, 2, 3, 4, 5, 6],
    color: '#10b981',
    category: 'Namaz',
    notes: 'Surah Yaseen / Tilawat'
  },
  {
    id: 'tt_2',
    subject: 'Mathematics & Algorithms Study',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    days: [0, 1, 2, 3, 4],
    color: '#6366f1',
    category: 'Study',
    notes: 'Problem solving block'
  },
  {
    id: 'tt_3',
    subject: 'Zuhr Prayer & Quick Lunch Break',
    startTime: '01:15 PM',
    endTime: '02:00 PM',
    days: [0, 1, 2, 3, 4, 5, 6],
    color: '#06b6d4',
    category: 'Namaz'
  },
  {
    id: 'tt_4',
    subject: 'Computer Science Practical Lab',
    startTime: '02:30 PM',
    endTime: '04:30 PM',
    days: [0, 2, 4],
    color: '#8b5cf6',
    category: 'Study',
    notes: 'Coding and projects'
  },
  {
    id: 'tt_5',
    subject: 'Asr Prayer & Evening Walk',
    startTime: '05:15 PM',
    endTime: '06:00 PM',
    days: [0, 1, 2, 3, 4, 5, 6],
    color: '#f59e0b',
    category: 'Personal'
  },
  {
    id: 'tt_6',
    subject: 'Maghrib, Revision & Homework',
    startTime: '06:45 PM',
    endTime: '08:15 PM',
    days: [0, 1, 2, 3, 4, 5, 6],
    color: '#ec4899',
    category: 'Revision'
  },
  {
    id: 'tt_7',
    subject: 'Isha Prayer, Daily Muhasaba & 2hr Leisure',
    startTime: '08:30 PM',
    endTime: '10:30 PM',
    days: [0, 1, 2, 3, 4, 5, 6],
    color: '#3b82f6',
    category: 'Break'
  }
];

export const INITIAL_COURSES: CourseGrade[] = [
  {
    id: 'c_1',
    courseName: 'Computer Science',
    credits: 4,
    currentScore: 88,
    targetGrade: 'A+',
    assignments: [
      { id: 'a_1', name: 'Assignment 1', score: 95, maxScore: 100, weight: 10 },
      { id: 'a_2', name: 'Mid Term Exam', score: 85, maxScore: 100, weight: 30 }
    ]
  },
  {
    id: 'c_2',
    courseName: 'Applied Physics',
    credits: 3,
    currentScore: 82,
    targetGrade: 'A',
    assignments: [
      { id: 'a_3', name: 'Lab Report', score: 90, maxScore: 100, weight: 15 },
      { id: 'a_4', name: 'Quiz 1 & 2', score: 78, maxScore: 100, weight: 20 }
    ]
  }
];

export const INITIAL_MUHASABA_HISTORY: MuhasabaEntry[] = [
  {
    id: 'muh_1',
    date: TODAY_STR,
    time: '09:30 PM',
    mood: 'Productive',
    note: 'Alhamdulillah aaj ka din bohat mutmaen guzra. Subah waqt par utha aur namaz aur routine follow ki.',
    goodHabitAdopted: 'Subah Fajr ke baad 1 ghanta focus study kia',
    badHabitAvoided: 'Mobile phone reels scrolling par control rakha',
    daroodCount: 100,
    tags: ['Daily Muhasaba', 'Productive']
  }
];

export const INITIAL_ENTERTAINMENT_HISTORY: EntertainmentLogEntry[] = [
  {
    id: 'ent_1',
    date: TODAY_STR,
    status: 'enjoyed',
    minutesUsed: 60,
    activityNote: 'Gaming and tech documentary after completing study targets',
    unlockedTime: '08:30 PM',
    prayersCount: 5,
    tasksCompletedCount: 3
  }
];

export const INITIAL_USER_STATS: UserStats = {
  xp: 350,
  level: 1,
  streak: 3,
  dark_mode: true,
  city: 'Islamabad',
  entTimerRunning: false,
  entTimeLeft: 7200, // 2 hours
  waterGlasses: 4
};

export const NAMAZ_SCHEDULE: Record<string, Record<string, string>> = {
  Islamabad: { Fajr: '05:00 AM', Zuhr: '01:15 PM', Asr: '05:15 PM', Maghrib: '06:45 PM', Isha: '08:15 PM' },
  Lahore: { Fajr: '04:55 AM', Zuhr: '01:10 PM', Asr: '05:10 PM', Maghrib: '06:40 PM', Isha: '08:10 PM' },
  Karachi: { Fajr: '05:25 AM', Zuhr: '01:30 PM', Asr: '05:30 PM', Maghrib: '07:05 PM', Isha: '08:35 PM' },
  Rawalpindi: { Fajr: '05:00 AM', Zuhr: '01:15 PM', Asr: '05:15 PM', Maghrib: '06:45 PM', Isha: '08:15 PM' },
  Peshawar: { Fajr: '05:05 AM', Zuhr: '01:20 PM', Asr: '05:20 PM', Maghrib: '06:50 PM', Isha: '08:20 PM' },
  Quetta: { Fajr: '05:15 AM', Zuhr: '01:25 PM', Asr: '05:25 PM', Maghrib: '06:55 PM', Isha: '08:25 PM' },
  Multan: { Fajr: '05:08 AM', Zuhr: '01:18 PM', Asr: '05:18 PM', Maghrib: '06:48 PM', Isha: '08:18 PM' },
  Faisalabad: { Fajr: '05:02 AM', Zuhr: '01:12 PM', Asr: '05:12 PM', Maghrib: '06:42 PM', Isha: '08:12 PM' },
};


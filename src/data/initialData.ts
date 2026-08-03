import { Task, Habit, Exam, Project, ClassSession, CourseGrade, UserStats } from '../types';

export const TODAY_STR = new Date().toISOString().split('T')[0];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    name: 'Revise Physics Thermodynamics & Solve Ch. 4 Problems',
    time: '10:00 AM',
    priority: 'High',
    recurring: true,
    note: 'Focus on Carnot engine efficiency formulas and past exam questions.',
    doneDates: [],
    progress: 0,
    dateAdded: TODAY_STR,
    subject: 'Physics',
    estimatedMinutes: 60
  },
  {
    id: 't2',
    name: 'Submit Linear Algebra Problem Set #3',
    time: '02:00 PM',
    priority: 'High',
    recurring: false,
    note: 'Double check matrix eigenvalue proofs before submitting to portal.',
    doneDates: [],
    progress: 0,
    dateAdded: TODAY_STR,
    subject: 'Mathematics',
    estimatedMinutes: 45
  },
  {
    id: 't3',
    name: 'Read Quran Surah Al-Kahf & Tafseer Notes',
    time: '05:30 PM',
    priority: 'Medium',
    recurring: true,
    note: 'Recite at least 10 verses with translation.',
    doneDates: [],
    progress: 0,
    dateAdded: TODAY_STR,
    subject: 'Islamic Studies',
    estimatedMinutes: 20
  },
  {
    id: 't4',
    name: 'English Essay Outline: AI Ethics in Healthcare',
    time: '08:00 PM',
    priority: 'Medium',
    recurring: false,
    note: 'Find 3 peer-reviewed journal citations.',
    doneDates: [],
    progress: 0,
    dateAdded: TODAY_STR,
    subject: 'English',
    estimatedMinutes: 50
  }
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'h1',
    name: 'Daily 2-Hour Deep Focus Study',
    color: '#6366f1',
    days: [true, true, true, true, true, true, true],
    log: [],
    category: 'Study'
  },
  {
    id: 'h2',
    name: 'Read Quran Daily',
    color: '#10b981',
    days: [true, true, true, true, true, true, true],
    log: [],
    category: 'Spiritual'
  },
  {
    id: 'h3',
    name: 'Drink 8 Glasses of Water',
    color: '#06b6d4',
    days: [true, true, true, true, true, true, true],
    log: [],
    category: 'Health'
  },
  {
    id: 'h4',
    name: 'Morning Math Problem Warmup',
    color: '#f59e0b',
    days: [true, true, true, true, true, false, false],
    log: [],
    category: 'Study'
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'e1',
    subject: 'Mathematics (Calculus III)',
    date: '2026-08-15',
    prep: 75,
    weight: 35,
    syllabusNotes: 'Integration in 3D, Stokes Theorem, Green Theorem'
  },
  {
    id: 'e2',
    subject: 'Physics II (Electromagnetism)',
    date: '2026-08-20',
    prep: 50,
    weight: 40,
    syllabusNotes: 'Gauss Law, Maxwell Equations, Circuits'
  },
  {
    id: 'e3',
    subject: 'Computer Science (Data Structures)',
    date: '2026-08-28',
    prep: 90,
    weight: 30,
    syllabusNotes: 'Trees, Graphs, Sorting Algorithms, Dynamic Programming'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Science Fair Autonomous Drone Demo',
    start: '2026-08-01',
    end: '2026-08-25',
    completed: false,
    progress: 65,
    subject: 'Robotics',
    subtasks: [
      { id: 'st1', title: 'Assemble quadcopter frame', done: true },
      { id: 'st2', title: 'Calibrate flight controller sensors', done: true },
      { id: 'st3', title: 'Test obstacle avoidance code', done: false },
      { id: 'st4', title: 'Write final poster report', done: false }
    ]
  },
  {
    id: 'p2',
    title: 'Student Routine Mobile Web App',
    start: '2026-08-02',
    end: '2026-08-30',
    completed: false,
    progress: 80,
    subject: 'Web Development',
    subtasks: [
      { id: 'st11', title: 'Design Tailwind UI components', done: true },
      { id: 'st12', title: 'Connect Gemini AI Study Assistant', done: true },
      { id: 'st13', title: 'Integrate Namaz & Quran Loggers', done: true }
    ]
  }
];

export const INITIAL_TIMETABLE: ClassSession[] = [
  {
    id: 'cs1',
    subject: 'Calculus III',
    code: 'MATH301',
    instructor: 'Dr. Ahmad',
    room: 'Hall B-102',
    dayOfWeek: 0, // Monday
    startTime: '09:00',
    endTime: '10:30',
    color: '#6366f1'
  },
  {
    id: 'cs2',
    subject: 'Physics II Lab',
    code: 'PHYS202',
    instructor: 'Prof. Sarah',
    room: 'Physics Lab 3',
    dayOfWeek: 0, // Monday
    startTime: '11:00',
    endTime: '01:00',
    color: '#ec4899'
  },
  {
    id: 'cs3',
    subject: 'Data Structures',
    code: 'CS201',
    instructor: 'Dr. Tariq',
    room: 'Lab C-04',
    dayOfWeek: 1, // Tuesday
    startTime: '10:00',
    endTime: '11:30',
    color: '#10b981'
  },
  {
    id: 'cs4',
    subject: 'Islamic Ethics & Philosophy',
    code: 'ISL101',
    instructor: 'Ustadh Bilal',
    room: 'Auditorium 1',
    dayOfWeek: 2, // Wednesday
    startTime: '02:00',
    endTime: '03:30',
    color: '#f59e0b'
  }
];

export const INITIAL_COURSES: CourseGrade[] = [
  {
    id: 'c1',
    courseName: 'Calculus III',
    credits: 4,
    currentScore: 88,
    targetGrade: 'A',
    assignments: [
      { id: 'a1', name: 'Midterm 1', score: 45, maxScore: 50, weight: 25 },
      { id: 'a2', name: 'Quiz 1', score: 19, maxScore: 20, weight: 10 },
      { id: 'a3', name: 'Homework 1-3', score: 28, maxScore: 30, weight: 15 }
    ]
  },
  {
    id: 'c2',
    courseName: 'Physics II',
    credits: 3,
    currentScore: 82,
    targetGrade: 'A-',
    assignments: [
      { id: 'a4', name: 'Lab Reports', score: 85, maxScore: 100, weight: 20 },
      { id: 'a5', name: 'Midterm Exam', score: 78, maxScore: 100, weight: 30 }
    ]
  },
  {
    id: 'c3',
    courseName: 'Data Structures',
    credits: 4,
    currentScore: 94,
    targetGrade: 'A+',
    assignments: [
      { id: 'a6', name: 'Coding Project 1', score: 100, maxScore: 100, weight: 20 },
      { id: 'a7', name: 'Quiz 1', score: 10, maxScore: 10, weight: 10 }
    ]
  }
];

export const INITIAL_USER_STATS: UserStats = {
  points: 50,
  level: 1,
  badges: ['Level 1 Student'],
  streak: 1,
  dark_mode: true,
  city: 'Islamabad',
  entTimerRunning: false,
  entTimeLeft: 7200,
  waterGlasses: 0
};

export const NAMAZ_SCHEDULE: Record<string, { Fajr: string; Zuhr: string; Asr: string; Maghrib: string; Isha: string }> = {
  Islamabad: { Fajr: "04:15", Zuhr: "12:18", Asr: "04:55", Maghrib: "07:12", Isha: "08:42" },
  Karachi: { Fajr: "04:45", Zuhr: "12:32", Asr: "05:02", Maghrib: "07:18", Isha: "08:38" },
  Lahore: { Fajr: "04:10", Zuhr: "12:14", Asr: "04:50", Maghrib: "07:08", Isha: "08:38" },
  London: { Fajr: "03:45", Zuhr: "01:08", Asr: "05:15", Maghrib: "08:45", Isha: "10:15" },
  NewYork: { Fajr: "04:30", Zuhr: "01:02", Asr: "04:58", Maghrib: "08:12", Isha: "09:40" },
  Riyadh: { Fajr: "03:55", Zuhr: "11:58", Asr: "03:22", Maghrib: "06:38", Isha: "08:08" }
};

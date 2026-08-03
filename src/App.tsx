import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { HabitsView } from './components/HabitsView';
import { StudyFocusView } from './components/StudyFocusView';
import { IslamicTrackerView } from './components/IslamicTrackerView';
import { AcademicPlannerView } from './components/AcademicPlannerView';
import { TimetableMasterView } from './components/TimetableMasterView';
import { AiAssistantView } from './components/AiAssistantView';
import { AnalyticsView } from './components/AnalyticsView';
import { IdeaGuideModal } from './components/IdeaGuideModal';

import { 
  Task, 
  Habit, 
  Exam, 
  Project, 
  ClassSession, 
  CourseGrade, 
  UserStats, 
  ActiveTab, 
  DailyMoodNote 
} from './types';

import { 
  INITIAL_TASKS, 
  INITIAL_HABITS, 
  INITIAL_EXAMS, 
  INITIAL_PROJECTS, 
  INITIAL_TIMETABLE, 
  INITIAL_COURSES, 
  INITIAL_USER_STATS, 
  TODAY_STR 
} from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Persistent States
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('student_routine_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('student_routine_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('student_routine_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('student_routine_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [timetable, setTimetable] = useState<ClassSession[]>(() => {
    const saved = localStorage.getItem('student_routine_timetable');
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });

  const [courses, setCourses] = useState<CourseGrade[]>(() => {
    const saved = localStorage.getItem('student_routine_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('student_routine_stats');
    return saved ? JSON.parse(saved) : INITIAL_USER_STATS;
  });

  const [namazLog, setNamazLog] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('student_routine_namaz');
    return saved ? JSON.parse(saved) : { [TODAY_STR]: ['Fajr', 'Zuhr', 'Asr', 'Maghrib', 'Isha'] };
  });

  const [quranLog, setQuranLog] = useState<string[]>(() => {
    const saved = localStorage.getItem('student_routine_quran');
    return saved ? JSON.parse(saved) : [TODAY_STR];
  });

  const [notesHistory, setNotesHistory] = useState<Record<string, DailyMoodNote>>(() => {
    const saved = localStorage.getItem('student_routine_notes');
    return saved ? JSON.parse(saved) : {
      [TODAY_STR]: { date: TODAY_STR, mood: 'Productive', note: 'Reviewed Physics Ch. 4 and completed Calculus assignment.' }
    };
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('student_routine_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('student_routine_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('student_routine_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('student_routine_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('student_routine_stats', JSON.stringify(stats));
    if (stats.dark_mode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('student_routine_namaz', JSON.stringify(namazLog));
  }, [namazLog]);

  useEffect(() => {
    localStorage.setItem('student_routine_quran', JSON.stringify(quranLog));
  }, [quranLog]);

  useEffect(() => {
    localStorage.setItem('student_routine_notes', JSON.stringify(notesHistory));
  }, [notesHistory]);

  // Entertainment Timer Countdown
  useEffect(() => {
    let interval: any = null;
    if (stats.entTimerRunning && stats.entTimeLeft > 0) {
      interval = setInterval(() => {
        setStats((prev) => ({ ...prev, entTimeLeft: prev.entTimeLeft - 1 }));
      }, 1000);
    } else if (stats.entTimeLeft <= 0 && stats.entTimerRunning) {
      setStats((prev) => ({ ...prev, entTimerRunning: false, entTimeLeft: 7200 }));
      alert('🎮 2-Hour Break Complete! Time to get back to your study goals.');
    }
    return () => clearInterval(interval);
  }, [stats.entTimerRunning, stats.entTimeLeft]);

  // Handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isDone = t.doneDates.includes(TODAY_STR);
          const newDoneDates = isDone
            ? t.doneDates.filter((d) => d !== TODAY_STR)
            : [...t.doneDates, TODAY_STR];

          // Award XP
          if (!isDone) {
            setStats((s) => ({ ...s, points: s.points + 10 }));
          }

          return {
            ...t,
            doneDates: newDoneDates,
            progress: isDone ? 0 : 100,
          };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'doneDates'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task_${Date.now()}`,
      doneDates: [],
    };
    setTasks((prev) => [newTask, ...prev]);
    setStats((s) => ({ ...s, points: s.points + 5 }));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleUpdateTaskProgress = (taskId: string, progress: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isDone = progress === 100;
          const hasToday = t.doneDates.includes(TODAY_STR);
          let newDoneDates = t.doneDates;
          if (isDone && !hasToday) newDoneDates = [...t.doneDates, TODAY_STR];
          if (!isDone && hasToday) newDoneDates = t.doneDates.filter((d) => d !== TODAY_STR);

          return { ...t, progress, doneDates: newDoneDates };
        }
        return t;
      })
    );
  };

  const handleAddHabit = (newHabitData: Omit<Habit, 'id' | 'log'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `habit_${Date.now()}`,
      log: [],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleToggleHabitDay = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const isLogged = h.log.includes(dateStr);
          const newLog = isLogged ? h.log.filter((d) => d !== dateStr) : [...h.log, dateStr];
          if (!isLogged) setStats((s) => ({ ...s, points: s.points + 5 }));
          return { ...h, log: newLog };
        }
        return h;
      })
    );
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  const handleToggleNamaz = (prayerName: string) => {
    setNamazLog((prev) => {
      const todayPrayers = prev[TODAY_STR] || [];
      const isLogged = todayPrayers.includes(prayerName);
      const updated = isLogged
        ? todayPrayers.filter((p) => p !== prayerName)
        : [...todayPrayers, prayerName];

      if (!isLogged) setStats((s) => ({ ...s, points: s.points + 15 }));
      return { ...prev, [TODAY_STR]: updated };
    });
  };

  const handleToggleQuran = () => {
    setQuranLog((prev) => {
      const isLogged = prev.includes(TODAY_STR);
      if (!isLogged) setStats((s) => ({ ...s, points: s.points + 20 }));
      return isLogged ? prev.filter((d) => d !== TODAY_STR) : [...prev, TODAY_STR];
    });
  };

  const handleToggleEntTimer = () => {
    setStats((prev) => ({
      ...prev,
      entTimerRunning: !prev.entTimerRunning,
    }));
  };

  const handleAddExam = (newExamData: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...newExamData,
      id: `exam_${Date.now()}`,
    };
    setExams((prev) => [...prev, newExam]);
  };

  const handleDeleteExam = (examId: string) => {
    setExams((prev) => prev.filter((e) => e.id !== examId));
  };

  const handleEditExam = (updatedExam: Exam) => {
    setExams((prev) => prev.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
  };

  const handleUpdateExamPrep = (examId: string, prep: number) => {
    setExams((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, prep } : e))
    );
  };

  // Timetable Handlers
  const handleAddClassSession = (newSessionData: Omit<ClassSession, 'id'>) => {
    const newSession: ClassSession = {
      ...newSessionData,
      id: `cs_${Date.now()}`,
    };
    setTimetable((prev) => [...prev, newSession]);
  };

  const handleDeleteClassSession = (sessionId: string) => {
    setTimetable((prev) => prev.filter((c) => c.id !== sessionId));
  };

  const handleEditClassSession = (updatedSession: ClassSession) => {
    setTimetable((prev) => prev.map((c) => (c.id === updatedSession.id ? updatedSession : c)));
  };

  const handleClearAllClassSessions = () => {
    setTimetable([]);
  };

  // Project Handlers
  const handleAddProject = (newProjectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...newProjectData,
      id: `proj_${Date.now()}`,
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const handleEditProject = (updatedProject: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  };

  const handleAddProjectSubtask = (projectId: string, subtaskTitle: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const currentSubtasks = p.subtasks || [];
          const newSubtask = {
            id: `st_${Date.now()}`,
            title: subtaskTitle,
            done: false,
          };
          const updatedSubtasks = [...currentSubtasks, newSubtask];
          const doneCount = updatedSubtasks.filter((st) => st.done).length;
          const newProgress = Math.round((doneCount / updatedSubtasks.length) * 100);

          return {
            ...p,
            subtasks: updatedSubtasks,
            progress: newProgress,
            completed: newProgress === 100,
          };
        }
        return p;
      })
    );
  };

  const handleDeleteProjectSubtask = (projectId: string, subtaskId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId && p.subtasks) {
          const updatedSubtasks = p.subtasks.filter((st) => st.id !== subtaskId);
          const doneCount = updatedSubtasks.filter((st) => st.done).length;
          const newProgress = updatedSubtasks.length > 0 ? Math.round((doneCount / updatedSubtasks.length) * 100) : 0;

          return {
            ...p,
            subtasks: updatedSubtasks,
            progress: newProgress,
            completed: newProgress === 100,
          };
        }
        return p;
      })
    );
  };

  const handleToggleProjectSubtask = (projectId: string, subtaskId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId && p.subtasks) {
          const updatedSubtasks = p.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, done: !st.done } : st
          );
          const doneCount = updatedSubtasks.filter((st) => st.done).length;
          const newProgress = Math.round((doneCount / updatedSubtasks.length) * 100);

          return {
            ...p,
            subtasks: updatedSubtasks,
            progress: newProgress,
            completed: newProgress === 100,
          };
        }
        return p;
      })
    );
  };

  const handleSaveMoodNote = (dateStr: string, mood: DailyMoodNote['mood'], note: string) => {
    setNotesHistory((prev) => ({
      ...prev,
      [dateStr]: { date: dateStr, mood, note },
    }));
  };

  const handleLogWater = () => {
    setStats((prev) => {
      const current = prev.waterGlasses || 0;
      const updated = current >= 8 ? 0 : current + 1;
      const pointsBonus = updated === 8 ? 20 : 5;
      return {
        ...prev,
        waterGlasses: updated,
        points: prev.points + pointsBonus,
      };
    });
  };

  const todayNamazCount = (namazLog[TODAY_STR] || []).length;
  const isQuranDone = quranLog.includes(TODAY_STR);

  return (
    <div className={`min-h-screen ${stats.dark_mode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} font-sans antialiased transition-colors duration-200`}>
      {/* Header */}
      <Header
        stats={stats}
        onToggleDarkMode={() => setStats((s) => ({ ...s, dark_mode: !s.dark_mode }))}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main View Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <DashboardView
            tasks={tasks}
            stats={stats}
            exams={exams}
            onToggleTask={handleToggleTask}
            onSelectTab={setActiveTab}
            onToggleEntTimer={handleToggleEntTimer}
            namazCount={todayNamazCount}
            quranDone={isQuranDone}
            onLogWater={handleLogWater}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTaskProgress={handleUpdateTaskProgress}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsView
            habits={habits}
            onAddHabit={handleAddHabit}
            onToggleHabitDay={handleToggleHabitDay}
            onDeleteHabit={handleDeleteHabit}
          />
        )}

        {activeTab === 'focus' && (
          <StudyFocusView
            onAddStudyXP={(mins) => setStats((s) => ({ ...s, points: s.points + mins * 2 }))}
          />
        )}

        {activeTab === 'islamic' && (
          <IslamicTrackerView
            city={stats.city}
            onChangeCity={(newCity) => setStats((s) => ({ ...s, city: newCity }))}
            namazLog={namazLog[TODAY_STR] || []}
            quranDone={isQuranDone}
            onToggleNamaz={handleToggleNamaz}
            onToggleQuran={handleToggleQuran}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableMasterView
            sessions={timetable}
            onAddSession={handleAddClassSession}
            onUpdateSession={handleEditClassSession}
            onDeleteSession={handleDeleteClassSession}
            onClearAllSessions={handleClearAllClassSessions}
          />
        )}

        {activeTab === 'academic' && (
          <AcademicPlannerView
            exams={exams}
            projects={projects}
            timetable={timetable}
            courses={courses}
            onAddExam={handleAddExam}
            onDeleteExam={handleDeleteExam}
            onEditExam={handleEditExam}
            onUpdateExamPrep={handleUpdateExamPrep}
            onAddClassSession={handleAddClassSession}
            onDeleteClassSession={handleDeleteClassSession}
            onEditClassSession={handleEditClassSession}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            onEditProject={handleEditProject}
            onAddProjectSubtask={handleAddProjectSubtask}
            onDeleteProjectSubtask={handleDeleteProjectSubtask}
            onToggleProjectSubtask={handleToggleProjectSubtask}
          />
        )}

        {activeTab === 'ai' && <AiAssistantView />}

        {activeTab === 'reports' && (
          <AnalyticsView
            tasks={tasks}
            namazLog={namazLog}
            quranLog={quranLog}
            notesHistory={notesHistory}
            onSaveMoodNote={handleSaveMoodNote}
          />
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Feature Ideas Expansion Modal */}
      <IdeaGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}

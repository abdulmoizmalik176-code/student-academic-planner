import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { HabitsView } from './components/HabitsView';
import { SelfReflectionView } from './components/SelfReflectionView';
import { IslamicTrackerView } from './components/IslamicTrackerView';
import { AcademicPlannerView } from './components/AcademicPlannerView';
import { TimetableMasterView } from './components/TimetableMasterView';
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
  DailyMoodNote,
  CharacterTrait,
  MuhasabaEntry,
  EntertainmentLogEntry
} from './types';

import { 
  INITIAL_TASKS, 
  INITIAL_HABITS, 
  INITIAL_EXAMS, 
  INITIAL_PROJECTS, 
  INITIAL_TIMETABLE, 
  INITIAL_COURSES, 
  INITIAL_USER_STATS, 
  INITIAL_CHARACTER_TRAITS,
  INITIAL_MUHASABA_HISTORY,
  INITIAL_ENTERTAINMENT_HISTORY,
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

  const [traits, setTraits] = useState<CharacterTrait[]>(() => {
    const saved = localStorage.getItem('student_routine_traits');
    return saved ? JSON.parse(saved) : INITIAL_CHARACTER_TRAITS;
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

  const [daroodLog, setDaroodLog] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('student_routine_darood');
    return saved ? JSON.parse(saved) : { [TODAY_STR]: 100 };
  });

  const [notesHistory, setNotesHistory] = useState<Record<string, DailyMoodNote>>(() => {
    const saved = localStorage.getItem('student_routine_notes');
    return saved ? JSON.parse(saved) : {};
  });

  const [muhasabaHistory, setMuhasabaHistory] = useState<MuhasabaEntry[]>(() => {
    const saved = localStorage.getItem('student_routine_muhasaba_history');
    return saved ? JSON.parse(saved) : INITIAL_MUHASABA_HISTORY;
  });

  const [entertainmentHistory, setEntertainmentHistory] = useState<EntertainmentLogEntry[]>(() => {
    const saved = localStorage.getItem('student_routine_entertainment_history');
    return saved ? JSON.parse(saved) : INITIAL_ENTERTAINMENT_HISTORY;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('student_routine_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('student_routine_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('student_routine_traits', JSON.stringify(traits));
  }, [traits]);

  useEffect(() => {
    localStorage.setItem('student_routine_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('student_routine_timetable', JSON.stringify(timetable));
  }, [timetable]);

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
    localStorage.setItem('student_routine_darood', JSON.stringify(daroodLog));
  }, [daroodLog]);

  useEffect(() => {
    localStorage.setItem('student_routine_notes', JSON.stringify(notesHistory));
  }, [notesHistory]);

  useEffect(() => {
    localStorage.setItem('student_routine_muhasaba_history', JSON.stringify(muhasabaHistory));
  }, [muhasabaHistory]);

  useEffect(() => {
    localStorage.setItem('student_routine_entertainment_history', JSON.stringify(entertainmentHistory));
  }, [entertainmentHistory]);

  // Streak Calculation Logic
  // Streak continues and increments when 5 Namaz, Quran, and Tasks are completed
  useEffect(() => {
    const isDayFullyComplete = (dateStr: string) => {
      const prayersDone = (namazLog[dateStr] || []).length >= 5;
      const quranRecited = quranLog.includes(dateStr);
      
      const dayTasks = tasks.filter((t) => t.dateAdded === dateStr || t.recurring);
      const doneDayTasks = tasks.filter((t) => t.doneDates && t.doneDates.includes(dateStr));
      const tasksCompleted = dayTasks.length > 0 ? doneDayTasks.length === dayTasks.length : true;

      return prayersDone && quranRecited && tasksCompleted;
    };

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayDone = isDayFullyComplete(todayStr);

    let calculatedStreak = 0;
    let checkDate = new Date(today);

    if (todayDone) {
      // Today is complete, count backwards
      while (true) {
        const dStr = checkDate.toISOString().split('T')[0];
        if (isDayFullyComplete(dStr)) {
          calculatedStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      // Check from yesterday to maintain existing streak if today is still in progress
      checkDate.setDate(checkDate.getDate() - 1);
      while (true) {
        const dStr = checkDate.toISOString().split('T')[0];
        if (isDayFullyComplete(dStr)) {
          calculatedStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    if (stats.streak !== calculatedStreak) {
      setStats((prev) => ({ ...prev, streak: calculatedStreak }));
    }
  }, [tasks, namazLog, quranLog, stats.streak]);

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

  // Handlers - Tasks
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isDone = t.doneDates.includes(TODAY_STR);
          const newDoneDates = isDone
            ? t.doneDates.filter((d) => d !== TODAY_STR)
            : [...t.doneDates, TODAY_STR];

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
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
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

  // Habits Handlers
  const handleAddHabit = (newHabitData: Omit<Habit, 'id' | 'log'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `habit_${Date.now()}`,
      log: [],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleEditHabit = (habitId: string, updatedFields: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === habitId ? { ...h, ...updatedFields } : h)));
  };

  const handleToggleHabitDay = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const isLogged = h.log.includes(dateStr);
          const newLog = isLogged ? h.log.filter((d) => d !== dateStr) : [...h.log, dateStr];
          return { ...h, log: newLog };
        }
        return h;
      })
    );
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  // Namaz, Quran & Durood Handlers
  const handleToggleNamaz = (prayerName: string) => {
    setNamazLog((prev) => {
      const todayPrayers = prev[TODAY_STR] || [];
      const isLogged = todayPrayers.includes(prayerName);
      const updated = isLogged
        ? todayPrayers.filter((p) => p !== prayerName)
        : [...todayPrayers, prayerName];

      return { ...prev, [TODAY_STR]: updated };
    });
  };

  const handleToggleQuran = () => {
    setQuranLog((prev) => {
      const isLogged = prev.includes(TODAY_STR);
      return isLogged ? prev.filter((d) => d !== TODAY_STR) : [...prev, TODAY_STR];
    });
  };

  const handleToggleDarood = () => {
    setDaroodLog((prev) => {
      const current = prev[TODAY_STR] || 0;
      const isCurrentlyDone = current > 0;
      const newCount = isCurrentlyDone ? 0 : 500;
      return { ...prev, [TODAY_STR]: newCount };
    });
    setMuhasabaHistory((prev) => {
      const existing = prev.find((m) => m.date === TODAY_STR);
      if (existing) {
        const isCurrentlyDone = (existing.daroodCount || 0) > 0;
        return prev.map((m) => (m.id === existing.id ? { ...m, daroodCount: isCurrentlyDone ? 0 : 500 } : m));
      }
      return prev;
    });
  };

  const handleUpdateDarood = (count: number) => {
    setDaroodLog((prev) => ({ ...prev, [TODAY_STR]: count }));
    // Sync into today's muhasaba record if present
    setMuhasabaHistory((prev) => {
      const existing = prev.find((m) => m.date === TODAY_STR);
      if (existing) {
        return prev.map((m) => (m.id === existing.id ? { ...m, daroodCount: count } : m));
      }
      return prev;
    });
  };

  // Entertainment Log Handlers
  const handleLogEntertainment = (newEntryData: Omit<EntertainmentLogEntry, 'id'>) => {
    const newEntry: EntertainmentLogEntry = {
      ...newEntryData,
      id: `ent_${Date.now()}`,
    };
    setEntertainmentHistory((prev) => [
      newEntry,
      ...prev.filter((e) => e.date !== newEntryData.date),
    ]);
  };

  const handleDeleteEntertainmentEntry = (id: string) => {
    setEntertainmentHistory((prev) => prev.filter((e) => e.id !== id));
  };

  // Character Trait Handlers
  const handleAddTrait = (newTraitData: Omit<CharacterTrait, 'id'>) => {
    const newTrait: CharacterTrait = {
      ...newTraitData,
      id: `trait_${Date.now()}`,
    };
    setTraits((prev) => [newTrait, ...prev]);
  };

  const handleUpdateTrait = (updated: CharacterTrait) => {
    setTraits((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteTrait = (id: string) => {
    setTraits((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogPracticeOrClean = (id: string) => {
    setTraits((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextDays = (t.daysCleanOrPracticed || 0) + 1;
          const nextProgress = Math.min(100, (t.progressPercentage || 50) + 5);
          const history = t.historyDates || [];
          const updatedHistory = history.includes(TODAY_STR) ? history : [...history, TODAY_STR];
          return {
            ...t,
            daysCleanOrPracticed: nextDays,
            progressPercentage: nextProgress,
            trend: 'improving',
            lastUpdatedDate: TODAY_STR,
            historyDates: updatedHistory,
          };
        }
        return t;
      })
    );
  };

  const handleMarkRelapseOrSlip = (id: string) => {
    setTraits((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextProgress = Math.max(0, (t.progressPercentage || 50) - 15);
          return {
            ...t,
            daysCleanOrPracticed: 0,
            progressPercentage: nextProgress,
            trend: 'worsening',
            status: t.type === 'good' ? 'slipping' : 'relapsed',
            lastUpdatedDate: TODAY_STR,
          };
        }
        return t;
      })
    );
  };

  // Muhasaba & Mood Handlers
  const handleAddMuhasabaEntry = (newEntryData: Omit<MuhasabaEntry, 'id'>) => {
    const newEntry: MuhasabaEntry = {
      ...newEntryData,
      id: `muh_${Date.now()}`,
    };
    setMuhasabaHistory((prev) => [
      newEntry,
      ...prev.filter((m) => !(m.date === newEntryData.date && m.time === newEntryData.time)),
    ]);
    if (newEntryData.daroodCount !== undefined) {
      setDaroodLog((prev) => ({ ...prev, [newEntryData.date]: newEntryData.daroodCount || 0 }));
    }
  };

  const handleUpdateMuhasabaEntry = (updated: MuhasabaEntry) => {
    setMuhasabaHistory((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    if (updated.daroodCount !== undefined) {
      setDaroodLog((prev) => ({ ...prev, [updated.date]: updated.daroodCount || 0 }));
    }
  };

  const handleDeleteMuhasabaEntry = (id: string) => {
    setMuhasabaHistory((prev) => prev.filter((m) => m.id !== id));
  };

  const handleToggleEntTimer = () => {
    setStats((prev) => {
      const nextRunning = !prev.entTimerRunning;
      if (nextRunning) {
        handleLogEntertainment({
          date: TODAY_STR,
          status: 'enjoyed',
          minutesUsed: 60,
          activityNote: 'Break timer started from dashboard',
          unlockedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          prayersCount: (namazLog[TODAY_STR] || []).length,
          tasksCompletedCount: tasks.filter((t) => t.doneDates.includes(TODAY_STR)).length
        });
      }
      return {
        ...prev,
        entTimerRunning: nextRunning,
      };
    });
  };

  // Exam & Academic Handlers
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

  const handleEditClassSession = (sessionId: string, updatedFields: Partial<ClassSession>) => {
    setTimetable((prev) => prev.map((c) => (c.id === sessionId ? { ...c, ...updatedFields } : c)));
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

  const todayNamazCount = (namazLog[TODAY_STR] || []).length;
  const isQuranDone = quranLog.includes(TODAY_STR);
  const todayDaroodCount = daroodLog[TODAY_STR] || 0;
  const isDaroodDone = todayDaroodCount > 0;

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
            timetable={timetable}
            onToggleTask={handleToggleTask}
            onSelectTab={setActiveTab}
            onToggleEntTimer={handleToggleEntTimer}
            namazCount={todayNamazCount}
            quranDone={isQuranDone}
            daroodCount={todayDaroodCount}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTaskProgress={handleUpdateTaskProgress}
            onEditTask={handleEditTask}
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

        {activeTab === 'islamic' && (
          <IslamicTrackerView
            city={stats.city}
            onChangeCity={(newCity) => setStats((s) => ({ ...s, city: newCity }))}
            namazLog={namazLog[TODAY_STR] || []}
            quranDone={isQuranDone}
            daroodCount={todayDaroodCount}
            daroodDone={isDaroodDone}
            onToggleNamaz={handleToggleNamaz}
            onToggleQuran={handleToggleQuran}
            onUpdateDarood={handleUpdateDarood}
            onToggleDarood={handleToggleDarood}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsView
            habits={habits}
            onAddHabit={handleAddHabit}
            onToggleHabitDay={handleToggleHabitDay}
            onDeleteHabit={handleDeleteHabit}
            onEditHabit={handleEditHabit}
          />
        )}

        {(activeTab === 'self_reflection' || activeTab === 'muhasaba') && (
          <SelfReflectionView
            traits={traits}
            muhasabaHistory={muhasabaHistory}
            onAddTrait={handleAddTrait}
            onUpdateTrait={handleUpdateTrait}
            onDeleteTrait={handleDeleteTrait}
            onLogPracticeOrClean={handleLogPracticeOrClean}
            onMarkRelapseOrSlip={handleMarkRelapseOrSlip}
            onAddMuhasabaEntry={handleAddMuhasabaEntry}
            onDeleteMuhasabaEntry={handleDeleteMuhasabaEntry}
          />
        )}

        {activeTab === 'reports' && (
          <AnalyticsView
            tasks={tasks}
            namazLog={namazLog}
            quranLog={quranLog}
            daroodLog={daroodLog}
            notesHistory={notesHistory}
            muhasabaHistory={muhasabaHistory}
            entertainmentHistory={entertainmentHistory}
            onSaveMoodNote={handleSaveMoodNote}
            onAddMuhasabaEntry={handleAddMuhasabaEntry}
            onDeleteMuhasabaEntry={handleDeleteMuhasabaEntry}
            onUpdateMuhasabaEntry={handleUpdateMuhasabaEntry}
            onLogEntertainment={handleLogEntertainment}
            onDeleteEntertainmentEntry={handleDeleteEntertainmentEntry}
          />
        )}

        {activeTab === 'academic' && (
          <AcademicPlannerView
            exams={exams}
            projects={projects}
            onAddExam={handleAddExam}
            onDeleteExam={handleDeleteExam}
            onEditExam={handleEditExam}
            onUpdateExamPrep={handleUpdateExamPrep}
            onAddProject={handleAddProject}
            onDeleteProject={handleDeleteProject}
            onEditProject={handleEditProject}
            onAddProjectSubtask={handleAddProjectSubtask}
            onDeleteProjectSubtask={handleDeleteProjectSubtask}
            onToggleProjectSubtask={handleToggleProjectSubtask}
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

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Plus, 
  Trash2,
  Edit3, 
  X, 
  Layers, 
  Clock, 
  BookOpen,
  CheckCircle2,
  Circle,
  Code,
  Sparkles,
  ExternalLink,
  Target,
  FileText,
  Flame,
  Check
} from 'lucide-react';
import { Exam, Project } from '../types';

interface AcademicPlannerViewProps {
  exams: Exam[];
  projects: Project[];
  onAddExam: (newExam: Omit<Exam, 'id'>) => void;
  onDeleteExam: (examId: string) => void;
  onEditExam: (updatedExam: Exam) => void;
  onUpdateExamPrep: (examId: string, prep: number) => void;
  onAddProject: (newProject: Omit<Project, 'id'>) => void;
  onDeleteProject: (projectId: string) => void;
  onEditProject: (updatedProject: Project) => void;
  onAddProjectSubtask: (projectId: string, subtaskTitle: string) => void;
  onDeleteProjectSubtask: (projectId: string, subtaskId: string) => void;
  onToggleProjectSubtask: (projectId: string, subtaskId: string) => void;
}

export const AcademicPlannerView: React.FC<AcademicPlannerViewProps> = ({
  exams,
  projects,
  onAddExam,
  onDeleteExam,
  onEditExam,
  onUpdateExamPrep,
  onAddProject,
  onDeleteProject,
  onEditProject,
  onAddProjectSubtask,
  onDeleteProjectSubtask,
  onToggleProjectSubtask,
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'exams'>('projects');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  // Modal States - Exam
  const [isAddExamModal, setIsAddExamModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState('2026-08-25');
  const [examWeight, setExamWeight] = useState(30);
  const [examSyllabusNotes, setExamSyllabusNotes] = useState('');

  // Modal States - Project / Course
  const [isAddProjectModal, setIsAddProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectType, setProjectType] = useState<'App Development' | 'Online Course' | 'Skill Learning' | 'Exam Prep' | 'Personal Project'>('App Development');
  const [projectSubject, setProjectSubject] = useState('');
  const [projectStart, setProjectStart] = useState(new Date().toISOString().split('T')[0]);
  const [projectEnd, setProjectEnd] = useState('2026-09-15');
  const [projectNotes, setProjectNotes] = useState('');

  // Inline Subtask Input state per project
  const [newSubtaskTexts, setNewSubtaskTexts] = useState<Record<string, string>>({});

  // Countdown Helper
  const getDaysLeft = (targetDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle Exam Submit
  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examSubject.trim()) return;

    if (editingExam) {
      onEditExam({
        ...editingExam,
        subject: examSubject.trim(),
        date: examDate,
        weight: examWeight,
        syllabusNotes: examSyllabusNotes.trim(),
      });
    } else {
      onAddExam({
        subject: examSubject.trim(),
        date: examDate,
        prep: 0,
        weight: examWeight,
        syllabusNotes: examSyllabusNotes.trim(),
      });
    }

    setExamSubject('');
    setExamSyllabusNotes('');
    setEditingExam(null);
    setIsAddExamModal(false);
  };

  const openEditExam = (exam: Exam) => {
    setEditingExam(exam);
    setExamSubject(exam.subject);
    setExamDate(exam.date);
    setExamWeight(exam.weight || 30);
    setExamSyllabusNotes(exam.syllabusNotes || '');
    setIsAddExamModal(true);
  };

  // Handle Project Submit
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    if (editingProject) {
      onEditProject({
        ...editingProject,
        title: projectTitle.trim(),
        type: projectType,
        subject: projectSubject.trim() || 'General',
        start: projectStart,
        end: projectEnd,
        notes: projectNotes.trim(),
      });
    } else {
      onAddProject({
        title: projectTitle.trim(),
        type: projectType,
        subject: projectSubject.trim() || 'General',
        start: projectStart,
        end: projectEnd,
        completed: false,
        progress: 0,
        notes: projectNotes.trim(),
        subtasks: [],
      });
    }

    setProjectTitle('');
    setProjectSubject('');
    setProjectNotes('');
    setEditingProject(null);
    setIsAddProjectModal(false);
  };

  const openEditProject = (p: Project) => {
    setEditingProject(p);
    setProjectTitle(p.title);
    setProjectType(p.type || 'App Development');
    setProjectSubject(p.subject || '');
    setProjectStart(p.start || new Date().toISOString().split('T')[0]);
    setProjectEnd(p.end || '2026-09-15');
    setProjectNotes(p.notes || '');
    setIsAddProjectModal(true);
  };

  const handleAddSubtaskInline = (projectId: string) => {
    const text = newSubtaskTexts[projectId];
    if (!text || !text.trim()) return;
    onAddProjectSubtask(projectId, text.trim());
    setNewSubtaskTexts((prev) => ({ ...prev, [projectId]: '' }));
  };

  // Filtered Projects
  const filteredProjects = projects.filter((p) => {
    if (projectFilter === 'all') return true;
    if (projectFilter === 'completed') return p.completed;
    if (projectFilter === 'in_progress') return !p.completed;
    if (projectFilter === 'apps') return p.type === 'App Development';
    if (projectFilter === 'courses') return p.type === 'Online Course' || p.type === 'Skill Learning';
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Course & App Builder
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-indigo-400" />
              Projects & Exam Countdown
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/80 mt-1 max-w-xl">
              Track your app building milestones, online learning courses, and stay on top of upcoming exams with automatic countdowns.
            </p>
          </div>

          {/* Quick Switch Buttons */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'projects'
                  ? 'bg-white text-indigo-950 shadow-md font-extrabold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Projects & Courses ({projects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'exams'
                  ? 'bg-white text-indigo-950 shadow-md font-extrabold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Exam Countdown ({exams.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================== TAB 1: PROJECTS & COURSES ===================== */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { label: 'All Projects', value: 'all' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'App Development', value: 'apps' },
                { label: 'Courses & Skills', value: 'courses' },
                { label: 'Completed', value: 'completed' },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setProjectFilter(f.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    projectFilter === f.value
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setEditingProject(null);
                setProjectTitle('');
                setProjectType('App Development');
                setProjectSubject('');
                setProjectStart(new Date().toISOString().split('T')[0]);
                setProjectEnd('2026-09-15');
                setProjectNotes('');
                setIsAddProjectModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Project / Course</span>
            </button>
          </div>

          {/* Projects List */}
          {filteredProjects.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Code className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Projects or Courses Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Create a project to track building your next web/mobile app, or organize an online course with milestone chapters.
              </p>
              <button
                onClick={() => setIsAddProjectModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Project</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((project) => {
                const subtasks = project.subtasks || [];
                const doneSubtasks = subtasks.filter((s) => s.done).length;
                const progressPct = subtasks.length > 0
                  ? Math.round((doneSubtasks / subtasks.length) * 100)
                  : project.progress || 0;
                const daysLeft = getDaysLeft(project.end);

                return (
                  <div
                    key={project.id}
                    className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all duration-200 shadow-sm flex flex-col justify-between space-y-4 ${
                      project.completed
                        ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/10 dark:bg-emerald-950/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Header Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold border ${
                            project.type === 'App Development'
                              ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                              : project.type === 'Online Course'
                              ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                              : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                          }`}>
                            {project.type || 'Project'}
                          </span>
                          {project.subject && (
                            <span className="text-[11px] text-slate-500 font-medium">
                              • {project.subject}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditProject(project)}
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProject(project.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Project Title */}
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {project.title}
                      </h4>

                      {/* Notes */}
                      {project.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          {project.notes}
                        </p>
                      )}

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="text-slate-600 dark:text-slate-400">Milestone Progress</span>
                          <span className="text-indigo-600 dark:text-indigo-400">{progressPct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              progressPct === 100
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Subtasks / Milestones list */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                          <span>Milestones & Modules ({doneSubtasks}/{subtasks.length})</span>
                        </div>

                        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                          {subtasks.map((st) => (
                            <div
                              key={st.id}
                              className="flex items-center justify-between gap-2 text-xs p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 group"
                            >
                              <button
                                onClick={() => onToggleProjectSubtask(project.id, st.id)}
                                className="flex items-center gap-2 text-left flex-1"
                              >
                                {st.done ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <span className={st.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200 font-medium'}>
                                  {st.title}
                                </span>
                              </button>
                              <button
                                onClick={() => onDeleteProjectSubtask(project.id, st.id)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add subtask inline input */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <input
                            type="text"
                            placeholder="+ Add module or task..."
                            value={newSubtaskTexts[project.id] || ''}
                            onChange={(e) =>
                              setNewSubtaskTexts((prev) => ({
                                ...prev,
                                [project.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSubtaskInline(project.id);
                              }
                            }}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => handleAddSubtaskInline(project.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Timeline & Done button */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          Target: {project.end} ({daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due Today' : 'Past Due'})
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onEditProject({
                            ...project,
                            completed: !project.completed,
                            progress: !project.completed ? 100 : project.progress,
                          });
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                          project.completed
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                      >
                        {project.completed ? '✓ Completed' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 2: EXAM COUNTDOWN ===================== */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Upcoming Examination Deadlines & Preparedness
              </h3>
              <p className="text-xs text-slate-500">
                Keep track of test dates, syllabus goals, and preparedness levels.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingExam(null);
                setExamSubject('');
                setExamDate('2026-08-25');
                setExamWeight(30);
                setExamSyllabusNotes('');
                setIsAddExamModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Exam</span>
            </button>
          </div>

          {exams.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No Exams Scheduled
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Add your upcoming school or university exams to view automatic countdowns and syllabus prep checklists.
              </p>
              <button
                onClick={() => setIsAddExamModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Exam</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exams.map((exam) => {
                const daysLeft = getDaysLeft(exam.date);
                const isUrgent = daysLeft >= 0 && daysLeft <= 3;
                const isPast = daysLeft < 0;

                return (
                  <div
                    key={exam.id}
                    className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all duration-200 shadow-sm flex flex-col justify-between space-y-4 ${
                      isUrgent
                        ? 'border-amber-400 dark:border-amber-600/80 bg-amber-50/15 dark:bg-amber-950/10'
                        : isPast
                        ? 'border-slate-200 dark:border-slate-800 opacity-70'
                        : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Countdown Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                          isUrgent
                            ? 'bg-amber-500 text-white shadow-sm'
                            : isPast
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        }`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {daysLeft > 0
                              ? `⏳ In ${daysLeft} Day${daysLeft === 1 ? '' : 's'}`
                              : daysLeft === 0
                              ? '🚨 Exam Today!'
                              : `Passed (${Math.abs(daysLeft)}d ago)`}
                          </span>
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditExam(exam)}
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteExam(exam.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Subject Name */}
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {exam.subject}
                      </h4>

                      {/* Exam Date */}
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Date: {exam.date}</span>
                        {exam.weight && (
                          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 ml-1">
                            ({exam.weight}% weight)
                          </span>
                        )}
                      </div>

                      {/* Syllabus notes */}
                      {exam.syllabusNotes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          {exam.syllabusNotes}
                        </p>
                      )}

                      {/* Prep Slider */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-600 dark:text-slate-400">Preparation Level</span>
                          <span className="text-indigo-600 dark:text-indigo-400">{exam.prep}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={exam.prep}
                          onChange={(e) => onUpdateExamPrep(exam.id, Number(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================== MODAL: ADD / EDIT PROJECT ===================== */}
      {isAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Code className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {editingProject ? 'Edit Project / Course' : 'Create New Project or Course'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddProjectModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project or Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build Flutter Mobile App, Python AI Course, Quran Tajweed..."
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="App Development">App Development</option>
                    <option value="Online Course">Online Course</option>
                    <option value="Skill Learning">Skill Learning</option>
                    <option value="Exam Prep">Exam Prep</option>
                    <option value="Personal Project">Personal Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject / Domain
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coding, Math, Deen..."
                    value={projectSubject}
                    onChange={(e) => setProjectSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={projectStart}
                    onChange={(e) => setProjectStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target End Date
                  </label>
                  <input
                    type="date"
                    value={projectEnd}
                    onChange={(e) => setProjectEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notes, Links, or Tech Stack
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. React Native, TypeScript, lecture video links, book chapters..."
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProjectModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
                >
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD / EDIT EXAM ===================== */}
      {isAddExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {editingExam ? 'Edit Exam' : 'Schedule New Exam'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddExamModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject / Exam Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics Final, Physics Chapter 1-5..."
                  value={examSubject}
                  onChange={(e) => setExamSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Weight (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={examWeight}
                    onChange={(e) => setExamWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Syllabus / Focus Chapters
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Chapters 4, 5, 6 formulas and theorem proofs..."
                  value={examSyllabusNotes}
                  onChange={(e) => setExamSyllabusNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddExamModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
                >
                  {editingExam ? 'Save Changes' : 'Schedule Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

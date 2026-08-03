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
  BookOpen
} from 'lucide-react';
import { Exam, Project, ClassSession, CourseGrade } from '../types';

interface AcademicPlannerViewProps {
  exams: Exam[];
  projects: Project[];
  timetable: ClassSession[];
  courses: CourseGrade[];
  onAddExam: (newExam: Omit<Exam, 'id'>) => void;
  onDeleteExam: (examId: string) => void;
  onEditExam: (updatedExam: Exam) => void;
  onUpdateExamPrep: (examId: string, prep: number) => void;
  onAddClassSession: (newSession: Omit<ClassSession, 'id'>) => void;
  onDeleteClassSession: (sessionId: string) => void;
  onEditClassSession: (updatedSession: ClassSession) => void;
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
  timetable,
  courses,
  onAddExam,
  onDeleteExam,
  onEditExam,
  onUpdateExamPrep,
  onAddClassSession,
  onDeleteClassSession,
  onEditClassSession,
  onAddProject,
  onDeleteProject,
  onEditProject,
  onAddProjectSubtask,
  onDeleteProjectSubtask,
  onToggleProjectSubtask,
}) => {
  const [activeTab, setActiveTab] = useState<'exams' | 'timetable' | 'projects' | 'gpa'>('exams');

  // Modal States
  const [isAddExamModal, setIsAddExamModal] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const [isAddClassModal, setIsAddClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSession | null>(null);

  const [isAddProjectModal, setIsAddProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form States - Exam
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState('2026-08-25');
  const [examWeight, setExamWeight] = useState(30);
  const [examSyllabusNotes, setExamSyllabusNotes] = useState('');

  // Form States - Class Session
  const [classSubject, setClassSubject] = useState('');
  const [classCode, setClassCode] = useState('');
  const [classInstructor, setClassInstructor] = useState('');
  const [classRoom, setClassRoom] = useState('');
  const [classDayOfWeek, setClassDayOfWeek] = useState(0); // 0 = Mon
  const [classStartTime, setClassStartTime] = useState('09:00');
  const [classEndTime, setClassEndTime] = useState('10:30');
  const [classColor, setClassColor] = useState('#6366f1');

  // Form States - Project
  const [projectTitle, setProjectTitle] = useState('');
  const [projectSubject, setProjectSubject] = useState('');
  const [projectStart, setProjectStart] = useState(new Date().toISOString().split('T')[0]);
  const [projectEnd, setProjectEnd] = useState('2026-08-30');

  // Subtask Input state per project
  const [newSubtaskTexts, setNewSubtaskTexts] = useState<Record<string, string>>({});

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // Handle Exam Submit
  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examSubject.trim()) return;

    if (editingExam) {
      onEditExam({
        ...editingExam,
        subject: examSubject,
        date: examDate,
        weight: examWeight,
        syllabusNotes: examSyllabusNotes,
      });
      setEditingExam(null);
    } else {
      onAddExam({
        subject: examSubject,
        date: examDate,
        prep: 0,
        weight: examWeight,
        syllabusNotes: examSyllabusNotes,
      });
    }

    setExamSubject('');
    setExamSyllabusNotes('');
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

  // Handle Class Submit
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classSubject.trim()) return;

    if (editingClass) {
      onEditClassSession({
        ...editingClass,
        subject: classSubject,
        code: classCode,
        instructor: classInstructor,
        room: classRoom,
        dayOfWeek: Number(classDayOfWeek),
        startTime: classStartTime,
        endTime: classEndTime,
        color: classColor,
      });
      setEditingClass(null);
    } else {
      onAddClassSession({
        subject: classSubject,
        code: classCode,
        instructor: classInstructor,
        room: classRoom,
        dayOfWeek: Number(classDayOfWeek),
        startTime: classStartTime,
        endTime: classEndTime,
        color: classColor,
      });
    }

    setClassSubject('');
    setClassCode('');
    setClassInstructor('');
    setClassRoom('');
    setIsAddClassModal(false);
  };

  const openEditClass = (cls: ClassSession) => {
    setEditingClass(cls);
    setClassSubject(cls.subject);
    setClassCode(cls.code);
    setClassInstructor(cls.instructor);
    setClassRoom(cls.room);
    setClassDayOfWeek(cls.dayOfWeek);
    setClassStartTime(cls.startTime);
    setClassEndTime(cls.endTime);
    setClassColor(cls.color);
    setIsAddClassModal(true);
  };

  // Handle Project Submit
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    if (editingProject) {
      onEditProject({
        ...editingProject,
        title: projectTitle,
        subject: projectSubject,
        start: projectStart,
        end: projectEnd,
      });
      setEditingProject(null);
    } else {
      onAddProject({
        title: projectTitle,
        subject: projectSubject,
        start: projectStart,
        end: projectEnd,
        completed: false,
        progress: 0,
        subtasks: [],
      });
    }

    setProjectTitle('');
    setProjectSubject('');
    setIsAddProjectModal(false);
  };

  const openEditProject = (proj: Project) => {
    setEditingProject(proj);
    setProjectTitle(proj.title);
    setProjectSubject(proj.subject || '');
    setProjectStart(proj.start);
    setProjectEnd(proj.end);
    setIsAddProjectModal(true);
  };

  const handleAddSubtaskClick = (projectId: string) => {
    const text = newSubtaskTexts[projectId] || '';
    if (!text.trim()) return;
    onAddProjectSubtask(projectId, text.trim());
    setNewSubtaskTexts({ ...newSubtaskTexts, [projectId]: '' });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-pink-400" />
            Academic Planner & Exam Countdown
          </h2>
          <p className="text-xs text-slate-400">Class schedules, exam prep countdowns, projects, and GPA target calculator</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'exams' ? 'bg-pink-600 text-white' : 'text-slate-400'
            }`}
          >
            Exams
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'timetable' ? 'bg-pink-600 text-white' : 'text-slate-400'
            }`}
          >
            Timetable
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'projects' ? 'bg-pink-600 text-white' : 'text-slate-400'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('gpa')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'gpa' ? 'bg-pink-600 text-white' : 'text-slate-400'
            }`}
          >
            GPA
          </button>
        </div>
      </div>

      {/* Tab Content 1: Exams */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Upcoming Examinations</h3>
            <button
              onClick={() => {
                setEditingExam(null);
                setExamSubject('');
                setExamSyllabusNotes('');
                setIsAddExamModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Exam</span>
            </button>
          </div>

          {exams.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
              <p className="text-xs text-slate-400 font-medium">No exams scheduled yet. Click "Add Exam" to start!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map((exam) => {
                const examDate = new Date(exam.date);
                const today = new Date();
                const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

                return (
                  <div key={exam.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md relative group">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-base">{exam.subject}</h4>
                        <p className="text-xs text-slate-400">Weight: {exam.weight || 30}% of total course grade</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                          daysLeft <= 7 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {daysLeft > 0 ? `${daysLeft} Days Left` : 'Exam Today!'}
                        </span>
                        
                        <button
                          onClick={() => openEditExam(exam)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Exam"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteExam(exam.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                          title="Delete Exam"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {exam.syllabusNotes && (
                      <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                        <strong>Syllabus:</strong> {exam.syllabusNotes}
                      </p>
                    )}

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs text-slate-300 font-bold">
                        <span>Syllabus Prepared</span>
                        <span className="text-pink-400">{exam.prep}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={exam.prep}
                        onChange={(e) => onUpdateExamPrep(exam.id, parseInt(e.target.value))}
                        className="w-full accent-pink-500 cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Timetable */}
      {activeTab === 'timetable' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Weekly Class Schedule</h3>
            <button
              onClick={() => {
                setEditingClass(null);
                setClassSubject('');
                setClassCode('');
                setClassInstructor('');
                setClassRoom('');
                setIsAddClassModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Class</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {daysOfWeek.map((dayName, dayIndex) => {
              const dayClasses = timetable.filter((c) => c.dayOfWeek === dayIndex);

              return (
                <div key={dayName} className="bg-slate-900 rounded-2xl p-3.5 border border-slate-800 space-y-2">
                  <div className="pb-2 border-b border-slate-800 font-bold text-xs text-indigo-300 uppercase tracking-wider text-center">
                    {dayName}
                  </div>

                  {dayClasses.length === 0 ? (
                    <p className="text-[11px] text-slate-500 text-center py-4">No classes</p>
                  ) : (
                    dayClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 relative group"
                        style={{ borderLeftColor: cls.color || '#6366f1', borderLeftWidth: '4px' }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold text-white">{cls.subject}</p>
                            <p className="text-[10px] text-slate-400">{cls.code} • {cls.instructor}</p>
                          </div>
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                            <button
                              onClick={() => openEditClass(cls)}
                              className="text-slate-400 hover:text-white"
                              title="Edit Class"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onDeleteClassSession(cls.id)}
                              className="text-rose-400 hover:text-rose-300"
                              title="Delete Class"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between text-[10px] font-semibold text-slate-300 pt-1">
                          <span>📍 {cls.room}</span>
                          <span>⏰ {cls.startTime}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 3: Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Academic Projects & Lab Demos</h3>
            <button
              onClick={() => {
                setEditingProject(null);
                setProjectTitle('');
                setProjectSubject('');
                setIsAddProjectModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
              <p className="text-xs text-slate-400 font-medium">No projects added yet. Click "Add Project" to start tracking!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-base">{proj.title}</h4>
                      <p className="text-xs text-slate-400">Due: {proj.end} {proj.subject ? `• ${proj.subject}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400">{proj.progress}% Done</span>
                      <button
                        onClick={() => openEditProject(proj)}
                        className="p-1 rounded text-slate-400 hover:text-white"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-1 rounded text-rose-400 hover:text-rose-300"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>

                  {/* Subtasks List */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <p className="text-[11px] font-bold text-slate-400">Milestones / Subtasks:</p>
                    {proj.subtasks && proj.subtasks.map((st) => (
                      <div
                        key={st.id}
                        className="flex items-center justify-between text-xs text-slate-300"
                      >
                        <div
                          onClick={() => onToggleProjectSubtask(proj.id, st.id)}
                          className="flex items-center gap-2 cursor-pointer hover:text-white"
                        >
                          <input
                            type="checkbox"
                            checked={st.done}
                            readOnly
                            className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 accent-indigo-600"
                          />
                          <span className={st.done ? 'line-through text-slate-500' : ''}>{st.title}</span>
                        </div>
                        <button
                          onClick={() => onDeleteProjectSubtask(proj.id, st.id)}
                          className="text-slate-500 hover:text-rose-400"
                          title="Delete subtask"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Inline Subtask Adder */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="New milestone..."
                        value={newSubtaskTexts[proj.id] || ''}
                        onChange={(e) => setNewSubtaskTexts({ ...newSubtaskTexts, [proj.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSubtaskClick(proj.id);
                          }
                        }}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleAddSubtaskClick(proj.id)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 4: GPA Calculator */}
      {activeTab === 'gpa' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white">Course Grade Tracker & Expected GPA</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm">{course.courseName}</h4>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Target: {course.targetGrade}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{course.currentScore}%</span>
                  <span className="text-xs text-slate-400">Current Average</span>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-800/80">
                  <p className="text-[11px] font-bold text-slate-400">Assignments Logged:</p>
                  {course.assignments.map((a) => (
                    <div key={a.id} className="flex justify-between text-xs text-slate-300">
                      <span>{a.name}</span>
                      <span className="font-mono text-indigo-300">{a.score}/{a.maxScore} ({a.weight}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal 1: Add / Edit Exam */}
      {isAddExamModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddExamModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-pink-400" />
              {editingExam ? 'Edit Exam' : 'Add Upcoming Exam'}
            </h3>

            <form onSubmit={handleCreateExam} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Course / Subject Name *</label>
                <input
                  type="text"
                  required
                  value={examSubject}
                  onChange={(e) => setExamSubject(e.target.value)}
                  placeholder="e.g. Physics II (Electromagnetism)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Weight (% of Grade)</label>
                  <input
                    type="number"
                    value={examWeight}
                    onChange={(e) => setExamWeight(parseInt(e.target.value) || 30)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Syllabus Topics</label>
                <textarea
                  rows={2}
                  value={examSyllabusNotes}
                  onChange={(e) => setExamSyllabusNotes(e.target.value)}
                  placeholder="e.g. Chapters 4 to 8, Gauss Law, Circuit proofs"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddExamModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold shadow-lg shadow-pink-500/20"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add / Edit Class Session */}
      {isAddClassModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddClassModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              {editingClass ? 'Edit Class Session' : 'Add Timetable Class'}
            </h3>

            <form onSubmit={handleCreateClass} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={classSubject}
                  onChange={(e) => setClassSubject(e.target.value)}
                  placeholder="e.g. Calculus III"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Course Code</label>
                  <input
                    type="text"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    placeholder="e.g. MATH301"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Instructor</label>
                  <input
                    type="text"
                    value={classInstructor}
                    onChange={(e) => setClassInstructor(e.target.value)}
                    placeholder="e.g. Dr. Ahmad"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Room / Hall</label>
                  <input
                    type="text"
                    value={classRoom}
                    onChange={(e) => setClassRoom(e.target.value)}
                    placeholder="e.g. Hall B-102"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Day of Week</label>
                  <select
                    value={classDayOfWeek}
                    onChange={(e) => setClassDayOfWeek(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={0}>Monday</option>
                    <option value={1}>Tuesday</option>
                    <option value={2}>Wednesday</option>
                    <option value={3}>Thursday</option>
                    <option value={4}>Friday</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Start Time</label>
                  <input
                    type="time"
                    value={classStartTime}
                    onChange={(e) => setClassStartTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">End Time</label>
                  <input
                    type="time"
                    value={classEndTime}
                    onChange={(e) => setClassEndTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddClassModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Add / Edit Project */}
      {isAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddProjectModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              {editingProject ? 'Edit Project' : 'Add Academic Project'}
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Autonomous Drone Science Demo"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Subject / Course</label>
                <input
                  type="text"
                  value={projectSubject}
                  onChange={(e) => setProjectSubject(e.target.value)}
                  placeholder="e.g. Robotics"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={projectStart}
                    onChange={(e) => setProjectStart(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={projectEnd}
                    onChange={(e) => setProjectEnd(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

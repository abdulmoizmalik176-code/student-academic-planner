import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Plus, 
  Calculator, 
  Layers, 
  Clock, 
  CheckSquare, 
  ChevronRight,
  X
} from 'lucide-react';
import { Exam, Project, ClassSession, CourseGrade } from '../types';

interface AcademicPlannerViewProps {
  exams: Exam[];
  projects: Project[];
  timetable: ClassSession[];
  courses: CourseGrade[];
  onAddExam: (newExam: Omit<Exam, 'id'>) => void;
  onUpdateExamPrep: (examId: string, prep: number) => void;
  onToggleProjectSubtask: (projectId: string, subtaskId: string) => void;
}

export const AcademicPlannerView: React.FC<AcademicPlannerViewProps> = ({
  exams,
  projects,
  timetable,
  courses,
  onAddExam,
  onUpdateExamPrep,
  onToggleProjectSubtask,
}) => {
  const [activeTab, setActiveTab] = useState<'exams' | 'timetable' | 'projects' | 'gpa'>('exams');
  const [isAddExamModal, setIsAddExamModal] = useState(false);

  // Add exam form
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('2026-08-25');
  const [weight, setWeight] = useState(30);
  const [syllabusNotes, setSyllabusNotes] = useState('');

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    onAddExam({
      subject,
      date,
      prep: 0,
      weight,
      syllabusNotes,
    });

    setSubject('');
    setIsAddExamModal(false);
  };

  // Days of week
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-pink-400" />
            Academic Planner & Exam Countdown
          </h2>
          <p className="text-xs text-slate-400">Class schedules, exam prep countdowns, and GPA target calculator</p>
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
              onClick={() => setIsAddExamModal(true)}
              className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Exam</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map((exam) => {
              const examDate = new Date(exam.date);
              const today = new Date();
              const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

              return (
                <div key={exam.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">{exam.subject}</h4>
                      <p className="text-xs text-slate-400">Weight: {exam.weight || 30}% of total course grade</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                      daysLeft <= 7 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {daysLeft > 0 ? `${daysLeft} Days Left` : 'Exam Today!'}
                    </span>
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
        </div>
      )}

      {/* Tab Content 2: Timetable */}
      {activeTab === 'timetable' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white">Weekly Class Schedule</h3>

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
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
                        style={{ borderLeftColor: cls.color, borderLeftWidth: '4px' }}
                      >
                        <p className="text-xs font-bold text-white">{cls.subject}</p>
                        <p className="text-[10px] text-slate-400">{cls.code} • {cls.instructor}</p>
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
          <h3 className="text-sm font-bold text-white">Academic Projects & Lab Demos</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{proj.title}</h4>
                    <p className="text-xs text-slate-400">Due: {proj.end}</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-400">{proj.progress}% Done</span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>

                {proj.subtasks && proj.subtasks.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <p className="text-[11px] font-bold text-slate-400">Milestones / Subtasks:</p>
                    {proj.subtasks.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => onToggleProjectSubtask(proj.id, st.id)}
                        className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white"
                      >
                        <input
                          type="checkbox"
                          checked={st.done}
                          readOnly
                          className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 accent-indigo-600"
                        />
                        <span className={st.done ? 'line-through text-slate-500' : ''}>{st.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
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

      {/* Add Exam Modal */}
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
              Add Upcoming Exam
            </h3>

            <form onSubmit={handleCreateExam} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Course / Subject Name *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
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
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Weight (% of Grade)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value) || 30)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Syllabus Topics</label>
                <textarea
                  rows={2}
                  value={syllabusNotes}
                  onChange={(e) => setSyllabusNotes(e.target.value)}
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
    </div>
  );
};

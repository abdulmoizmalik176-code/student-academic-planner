import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  ListChecks, 
  BookOpen, 
  Send, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  Lightbulb
} from 'lucide-react';
import { QuizQuestion } from '../types';

export const AiAssistantView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'quiz' | 'breakdown' | 'explain'>('quiz');

  // Quiz state
  const [quizTopic, setQuizTopic] = useState('Physics Thermodynamics');
  const [quizSubject, setQuizSubject] = useState('Physics');
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // Goal Breakdown state
  const [goalText, setGoalText] = useState('Prepare for Chemistry Midterm Exam');
  const [isBreakdownLoading, setIsBreakdownLoading] = useState(false);
  const [breakdownSteps, setBreakdownSteps] = useState<{ step: number; title: string; durationMinutes: number; tip: string }[]>([]);

  // Summarizer state
  const [explainText, setExplainText] = useState('Newton second law of motion states that force equals mass times acceleration (F = ma).');
  const [isExplainLoading, setIsExplainLoading] = useState(false);
  const [explainResult, setExplainResult] = useState<{ summary: string; keyTakeaways: string[]; mnemonic?: string } | null>(null);

  // Call API endpoints
  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim()) return;
    setIsQuizLoading(true);
    setIsQuizSubmitted(false);
    setUserAnswers({});

    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: quizTopic, subject: quizSubject }),
      });
      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        setQuizQuestions(data.questions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleGenerateBreakdown = async () => {
    if (!goalText.trim()) return;
    setIsBreakdownLoading(true);

    try {
      const res = await fetch('/api/ai/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goalText }),
      });
      const data = await res.json();
      if (data.steps && Array.isArray(data.steps)) {
        setBreakdownSteps(data.steps);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBreakdownLoading(false);
    }
  };

  const handleExplainConcept = async () => {
    if (!explainText.trim()) return;
    setIsExplainLoading(true);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: explainText }),
      });
      const data = await res.json();
      setExplainResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExplainLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            Gemini AI Study Assistant
          </h2>
          <p className="text-xs text-slate-400">Generate practice quizzes, step-by-step goal breakdowns, and concept summaries</p>
        </div>

        {/* Tool Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTool('quiz')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTool === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            AI Quiz Maker
          </button>
          <button
            onClick={() => setActiveTool('breakdown')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTool === 'breakdown' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Goal Breakdown
          </button>
          <button
            onClick={() => setActiveTool('explain')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTool === 'explain' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Topic Explainer
          </button>
        </div>
      </div>

      {/* TOOL 1: AI Quiz Maker */}
      {activeTool === 'quiz' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Generate Practice Test Quiz
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-bold mb-1">Topic or Chapter</label>
                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  placeholder="e.g. Thermodynamics, Linear Algebra Eigenvalues..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Subject</label>
                <input
                  type="text"
                  value={quizSubject}
                  onChange={(e) => setQuizSubject(e.target.value)}
                  placeholder="e.g. Physics"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={isQuizLoading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {isQuizLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isQuizLoading ? 'Generating Quiz...' : 'Generate Practice Quiz'}</span>
            </button>
          </div>

          {/* Render Quiz */}
          {quizQuestions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Practice Quiz Questions</h3>

              {quizQuestions.map((q, qIndex) => {
                const selectedOpt = userAnswers[q.id];

                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <p className="font-bold text-white text-sm">
                      {qIndex + 1}. {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = selectedOpt === optIndex;
                        const isCorrect = q.correctAnswer === optIndex;

                        let optStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700';
                        if (isQuizSubmitted) {
                          if (isCorrect) optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                          else if (isSelected) optStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                        } else if (isSelected) {
                          optStyle = 'bg-indigo-600/30 border-indigo-500 text-white';
                        }

                        return (
                          <button
                            key={optIndex}
                            disabled={isQuizSubmitted}
                            onClick={() => setUserAnswers({ ...userAnswers, [q.id]: optIndex })}
                            className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${optStyle}`}
                          >
                            <span>{opt}</span>
                            {isQuizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            {isQuizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400" />}
                          </button>
                        );
                      })}
                    </div>

                    {isQuizSubmitted && (
                      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-indigo-300">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              {!isQuizSubmitted ? (
                <button
                  onClick={() => setIsQuizSubmitted(true)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Submit Quiz Answers
                </button>
              ) : (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold">
                  Quiz Completed! You earned +25 XP for reviewing practice questions.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: Goal Breakdown */}
      {activeTool === 'breakdown' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-indigo-400" />
              Breakdown Complex Study Goals
            </h3>

            <div className="text-xs space-y-2">
              <label className="block text-slate-300 font-bold">Describe your study goal or assignment</label>
              <textarea
                rows={3}
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder="e.g. Write a 5-page Research Essay on Quantum Computing with 4 citations..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleGenerateBreakdown}
              disabled={isBreakdownLoading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {isBreakdownLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isBreakdownLoading ? 'Analyzing Goal...' : 'Break Down Goal'}</span>
            </button>
          </div>

          {breakdownSteps.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Actionable Steps & Time Estimates</h3>

              <div className="space-y-2.5">
                {breakdownSteps.map((s) => (
                  <div key={s.step} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">
                        Step {s.step}: {s.title}
                      </h4>
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {s.durationMinutes} mins
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>{s.tip}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 3: Concept Explainer */}
      {activeTool === 'explain' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Summarize Notes & Simplify Concepts
            </h3>

            <div className="text-xs space-y-2">
              <label className="block text-slate-300 font-bold">Paste lecture notes or difficult concept</label>
              <textarea
                rows={4}
                value={explainText}
                onChange={(e) => setExplainText(e.target.value)}
                placeholder="Paste paragraph or notes here..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleExplainConcept}
              disabled={isExplainLoading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {isExplainLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isExplainLoading ? 'Summarizing...' : 'Explain & Summarize'}</span>
            </button>
          </div>

          {explainResult && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm text-indigo-300">Summary:</h4>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {explainResult.summary}
              </p>

              {explainResult.keyTakeaways && explainResult.keyTakeaways.length > 0 && (
                <div className="space-y-1 pt-2">
                  <h5 className="text-xs font-bold text-slate-300">Key Takeaways:</h5>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                    {explainResult.keyTakeaways.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {explainResult.mnemonic && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 font-semibold">
                  <strong>Memory Aid:</strong> {explainResult.mnemonic}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

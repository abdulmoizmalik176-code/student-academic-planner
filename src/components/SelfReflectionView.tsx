import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Trophy, 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  HelpCircle, 
  Compass, 
  HeartHandshake, 
  Clock, 
  RotateCcw, 
  BookOpen,
  Check,
  X,
  Zap,
  Target,
  Copy
} from 'lucide-react';
import { 
  CharacterTrait, 
  TraitType, 
  GoodTraitStatus, 
  BadTraitStatus, 
  TrendDirection,
  MuhasabaEntry
} from '../types';

interface SelfReflectionViewProps {
  traits: CharacterTrait[];
  muhasabaHistory?: MuhasabaEntry[];
  onAddTrait: (trait: Omit<CharacterTrait, 'id'>) => void;
  onUpdateTrait: (trait: CharacterTrait) => void;
  onDeleteTrait: (id: string) => void;
  onLogPracticeOrClean: (id: string) => void;
  onMarkRelapseOrSlip: (id: string) => void;
  onAddMuhasabaEntry?: (entry: Omit<MuhasabaEntry, 'id'>) => void;
  onDeleteMuhasabaEntry?: (id: string) => void;
}

const CATEGORIES = [
  'Akhlaq & Morals',
  'Discipline & Study',
  'Spiritual / Deen',
  'Health & Routine',
  'Mindset & Emotions'
] as const;

const QUICK_SUGGESTIONS_GOOD = [
  { title: 'Subah Fajr ke waqt uthna', cat: 'Spiritual / Deen' },
  { title: 'Rozana 1 ghanta deep study', cat: 'Discipline & Study' },
  { title: 'Sach bolna aur shafafiyat', cat: 'Akhlaq & Morals' },
  { title: 'Har haal mein shukarguzari aur sabr', cat: 'Mindset & Emotions' },
  { title: 'Waqt ki pabandi (Punctuality)', cat: 'Discipline & Study' }
];

const QUICK_SUGGESTIONS_BAD = [
  { title: 'Fuzool phone scrolling / Social media', cat: 'Discipline & Study' },
  { title: 'Kaam kal par taalna (Procrastination)', cat: 'Discipline & Study' },
  { title: 'Gussa karna aur jazbaat mein aana', cat: 'Akhlaq & Morals' },
  { title: 'Raat ko late sona', cat: 'Health & Routine' },
  { title: 'Manfi sochain (Negative Self-Talk)', cat: 'Mindset & Emotions' }
];

export const SelfReflectionView: React.FC<SelfReflectionViewProps> = ({
  traits,
  muhasabaHistory = [],
  onAddTrait,
  onUpdateTrait,
  onDeleteTrait,
  onLogPracticeOrClean,
  onMarkRelapseOrSlip,
  onAddMuhasabaEntry,
  onDeleteMuhasabaEntry,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'good' | 'bad' | 'overcome' | 'alerts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrait, setEditingTrait] = useState<CharacterTrait | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<TraitType>('good');
  const [formCategory, setFormCategory] = useState<typeof CATEGORIES[number]>('Discipline & Study');
  const [formGoodStatus, setFormGoodStatus] = useState<GoodTraitStatus>('adopting');
  const [formBadStatus, setFormBadStatus] = useState<BadTraitStatus>('quitting');
  const [formTrend, setFormTrend] = useState<TrendDirection>('improving');
  const [formDays, setFormDays] = useState<number | ''>(1);
  const [formProgress, setFormProgress] = useState<number>(50);
  const [formTrigger, setFormTrigger] = useState('');
  const [formReplacement, setFormReplacement] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Daily reflection note state
  const [dailyAuditNote, setDailyAuditNote] = useState(() => {
    return localStorage.getItem('self_audit_daily_note') || '';
  });
  const [dailyMood, setDailyMood] = useState<'Productive' | 'Peaceful' | 'Motivated' | 'Challenged' | 'Regretful'>('Productive');
  const [goodHabitNote, setGoodHabitNote] = useState('');
  const [badHabitResistedNote, setBadHabitResistedNote] = useState('');
  const [auditSaved, setAuditSaved] = useState(false);
  const [showHistorySection, setShowHistorySection] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Calculations
  const goodTraits = traits.filter(t => t.type === 'good');
  const badTraits = traits.filter(t => t.type === 'bad');

  const masteredGood = goodTraits.filter(t => t.status === 'mastered');
  const adoptingGood = goodTraits.filter(t => t.status === 'adopting');
  const slippingGood = goodTraits.filter(t => t.status === 'slipping');

  const overcomeBad = badTraits.filter(t => t.status === 'overcome');
  const controlledBad = badTraits.filter(t => t.status === 'controlled');
  const quittingBad = badTraits.filter(t => t.status === 'quitting');
  const relapsedBad = badTraits.filter(t => t.status === 'relapsed' || t.trend === 'worsening');

  // Character Balance Score (0 - 100)
  const totalItems = traits.length || 1;
  const positivePoints = (masteredGood.length * 100) + (adoptingGood.length * 50) + (overcomeBad.length * 100) + (controlledBad.length * 60);
  const netCharacterScore = Math.min(100, Math.round(positivePoints / (totalItems * 100) * 100));

  const handleSaveAuditToHistory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!dailyAuditNote.trim()) {
      alert('Kripya pehlay aaj ka zaati jaiza / reflection note likhein.');
      return;
    }

    const todayDateStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (onAddMuhasabaEntry) {
      onAddMuhasabaEntry({
        date: todayDateStr,
        time: nowTimeStr,
        note: dailyAuditNote.trim(),
        mood: dailyMood,
        goodHabitsNoted: goodHabitNote.trim() || undefined,
        badHabitsResisted: badHabitResistedNote.trim() || undefined,
        characterScoreAtTime: netCharacterScore,
        tags: ['Daily Muhasaba', dailyMood]
      });
    }

    // Clear active note draft from input and storage
    localStorage.removeItem('self_audit_daily_note');
    setDailyAuditNote('');
    setGoodHabitNote('');
    setBadHabitResistedNote('');
    setAuditSaved(true);
    setTimeout(() => setAuditSaved(false), 3000);
  };

  const handleCopyNote = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAddModal = (defaultType: TraitType = 'good') => {
    setEditingTrait(null);
    setFormTitle('');
    setFormType(defaultType);
    setFormCategory('Discipline & Study');
    setFormGoodStatus('adopting');
    setFormBadStatus('quitting');
    setFormTrend('improving');
    setFormDays('');
    setFormProgress(50);
    setFormTrigger('');
    setFormReplacement('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (trait: CharacterTrait) => {
    setEditingTrait(trait);
    setFormTitle(trait.title);
    setFormType(trait.type);
    setFormCategory(trait.category as any || 'Discipline & Study');
    if (trait.type === 'good') {
      setFormGoodStatus(trait.status as GoodTraitStatus);
    } else {
      setFormBadStatus(trait.status as BadTraitStatus);
    }
    setFormTrend(trait.trend);
    setFormDays(trait.daysCleanOrPracticed);
    setFormProgress(trait.progressPercentage || 50);
    setFormTrigger(trait.triggerOrReason || '');
    setFormReplacement(trait.replacementHabit || '');
    setFormNotes(trait.notes || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const daysCount = typeof formDays === 'number' ? Math.max(0, formDays) : 0;

    if (editingTrait) {
      onUpdateTrait({
        ...editingTrait,
        title: formTitle.trim(),
        type: formType,
        category: formCategory,
        status: formType === 'good' ? formGoodStatus : formBadStatus,
        trend: formTrend,
        daysCleanOrPracticed: daysCount,
        progressPercentage: formProgress,
        triggerOrReason: formTrigger.trim(),
        replacementHabit: formReplacement.trim(),
        notes: formNotes.trim(),
        lastUpdatedDate: todayStr
      });
    } else {
      onAddTrait({
        title: formTitle.trim(),
        type: formType,
        category: formCategory,
        status: formType === 'good' ? formGoodStatus : formBadStatus,
        trend: formTrend,
        daysCleanOrPracticed: daysCount,
        progressPercentage: formProgress,
        triggerOrReason: formTrigger.trim(),
        replacementHabit: formReplacement.trim(),
        notes: formNotes.trim(),
        lastUpdatedDate: todayStr,
        historyDates: [todayStr]
      });
    }

    setIsModalOpen(false);
  };

  // Quick status updates
  const handleQuickStatusChange = (trait: CharacterTrait, newStatus: GoodTraitStatus | BadTraitStatus, newTrend?: TrendDirection) => {
    const todayStr = new Date().toISOString().split('T')[0];
    let newProgress = trait.progressPercentage;
    if (newStatus === 'mastered' || newStatus === 'overcome') newProgress = 100;
    if (newStatus === 'slipping' || newStatus === 'relapsed') newProgress = Math.max(10, trait.progressPercentage - 25);
    if (newStatus === 'controlled') newProgress = Math.max(70, trait.progressPercentage);

    onUpdateTrait({
      ...trait,
      status: newStatus,
      trend: newTrend || trait.trend,
      progressPercentage: newProgress,
      lastUpdatedDate: todayStr
    });
  };

  // Filtered traits
  const filteredTraits = traits.filter(trait => {
    // Tab filter
    if (activeFilter === 'good' && trait.type !== 'good') return false;
    if (activeFilter === 'bad' && trait.type !== 'bad') return false;
    if (activeFilter === 'overcome' && trait.status !== 'overcome') return false;
    if (activeFilter === 'alerts') {
      const isBadAlert = trait.type === 'bad' && (trait.status === 'relapsed' || trait.trend === 'worsening');
      const isGoodAlert = trait.type === 'good' && (trait.status === 'slipping' || trait.trend === 'worsening');
      if (!isBadAlert && !isGoodAlert) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && trait.category !== selectedCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = trait.title.toLowerCase().includes(q);
      const matchNotes = (trait.notes || '').toLowerCase().includes(q);
      const matchCat = (trait.category || '').toLowerCase().includes(q);
      if (!matchTitle && !matchNotes && !matchCat) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header & Hero */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Zaati Islah & Tazkiyah Tracker</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Qualities & Flaws Management System
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            Track achi aadaat (virtues you are adopting or mastered) and buri aadaat (flaws to quit, monitor if increasing or decreasing).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleOpenAddModal('good')}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Achi Aadat</span>
          </button>

          <button
            onClick={() => handleOpenAddModal('bad')}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20 transition-all active:scale-95"
          >
            <Shield className="w-4 h-4" />
            <span>+ Buri Aadat Chhorna</span>
          </button>
        </div>
      </div>

      {/* 2. Muhasaba Scorecard & Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Good Habits Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 text-white space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-emerald-300">Achi Aadaat (Virtues)</h3>
                <p className="text-[10px] text-slate-400">{goodTraits.length} total tracked</p>
              </div>
            </div>
            <span className="text-xl font-black text-emerald-400">{masteredGood.length + adoptingGood.length}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800 text-center">
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-medium block">Pukhta (Mastered)</span>
              <span className="text-sm font-black text-emerald-400">{masteredGood.length}</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-medium block">Nayi Apnayi</span>
              <span className="text-sm font-black text-teal-300">{adoptingGood.length}</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 font-medium block">Kamzor / Left</span>
              <span className="text-sm font-black text-amber-400">{slippingGood.length}</span>
            </div>
          </div>
        </div>

        {/* Bad Habits Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 text-white space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-rose-300">Buri Aadaat (Flaws Control)</h3>
                <p className="text-[10px] text-slate-400">{badTraits.length} total monitored</p>
              </div>
            </div>
            <span className="text-xl font-black text-rose-400">{overcomeBad.length + controlledBad.length}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800 text-center">
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-emerald-400 font-medium block">Chhor Di (Quit)</span>
              <span className="text-sm font-black text-emerald-400">{overcomeBad.length}</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-amber-300 font-medium block">Kam Hui</span>
              <span className="text-sm font-black text-amber-300">{controlledBad.length}</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-rose-400 font-medium block">Zaida Ho Rahi ⚠️</span>
              <span className="text-sm font-black text-rose-400">{relapsedBad.length}</span>
            </div>
          </div>
        </div>

        {/* Character Index & Daily Muhasaba */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/30 text-white flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-indigo-300">Tazkiyah & Growth Score</h3>
              <p className="text-[10px] text-slate-400">Net positive habit ratio</p>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black">
              {netCharacterScore}% Score
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 my-2">
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${netCharacterScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>Under Struggle</span>
              <span className="font-bold text-emerald-400">Progressing & Overcoming</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 flex items-center gap-1.5 pt-1 border-t border-slate-800">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{overcomeBad.length} buri aadaat kamyabi se chhori ja chuki hain!</span>
          </div>
        </div>
      </div>

      {/* 3. Urgent Alert Banner if any bad habit is increasing */}
      {relapsedBad.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 dark:bg-rose-950/40 text-slate-900 dark:text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-rose-700 dark:text-rose-300">
                Tanbih (Alert): {relapsedBad.length} Buri Aadat Zaida Ho Rahi Hai / Slip Hui Hai
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                "{relapsedBad.map(b => b.title).join(', ')}" — Is par foran kabu pain aur replacement habit par amal karein.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveFilter('alerts')}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0 shadow-sm"
          >
            Review Alerts
          </button>
        </motion.div>
      )}

      {/* 4. Daily Muhasaba / Self-Audit Quick Box & History */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  Rozana Muhasaba & Zaati Jaiza (Daily Self-Audit)
                </h4>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  {muhasabaHistory.length} Saved in History
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Aaj ka jaiza likhein aur tareekh (history) mein hamesha ke liay mehfooz karein.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setShowHistorySection(!showHistorySection)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{showHistorySection ? 'Hide History' : `View History (${muhasabaHistory.length})`}</span>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSaveAuditToHistory} className="space-y-3">
          {/* Mood Chips */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs mb-1.5">
              Aaj ki kaifiyat / Mood kaisa raha?
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'Productive', label: '⚡ Productive (Purnateeja)' },
                { id: 'Peaceful', label: '🕊️ Peaceful (Pur-sukoon)' },
                { id: 'Motivated', label: '🔥 Motivated (Poshish)' },
                { id: 'Challenged', label: '🧗 Challenged (Mushkil Din)' },
                { id: 'Regretful', label: '😔 Need Improvement (Tawbah/Islah)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setDailyMood(m.id as any)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    dailyMood === m.id
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick reflection inputs for good and resisted habits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold text-[11px] mb-1">
                🌟 Kaun si achi aadat par khas amal hua? (Optional)
              </label>
              <input
                type="text"
                value={goodHabitNote}
                onChange={(e) => setGoodHabitNote(e.target.value)}
                placeholder="e.g. Fajr ba-jamaat, 2 ghantay reading"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold text-[11px] mb-1">
                🛡️ Kis buri aadat / distraction se bache rahe? (Optional)
              </label>
              <input
                type="text"
                value={badHabitResistedNote}
                onChange={(e) => setBadHabitResistedNote(e.target.value)}
                placeholder="e.g. Phone scrolling rok li, gussa control kiya"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Main Reflection Note */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold text-xs mb-1">
              Rozana Muhasaba Note & Ibrat / Sabaq <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={dailyAuditNote}
              onChange={(e) => setDailyAuditNote(e.target.value)}
              placeholder="Aaj ka mukammal jaiza: Kahan ghalati hui? Kya seekha? Kal ke liay kya azm hai..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              * Note save hotay hi tareekh (History) mein mehfooz ho jaye ga aur input fresh ho jaye ga.
            </p>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all active:scale-95 shrink-0"
            >
              {auditSaved ? <Check className="w-4 h-4 text-white" /> : <BookOpen className="w-4 h-4" />}
              <span>{auditSaved ? 'Saved to History!' : 'Save & Archive to History'}</span>
            </button>
          </div>
        </form>

        {/* 📜 Muhasaba History Archive (Expandable) */}
        {showHistorySection && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Saved Muhasaba / Jaiza History Log</span>
              </h5>

              <div className="relative w-48">
                <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search past notes..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-7 pr-2 py-1 text-[11px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {muhasabaHistory.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500">Abhi tak koyi Muhasaba history mein save nahi kiya gaya.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {muhasabaHistory
                  .filter((entry) => 
                    !historySearch || 
                    entry.note.toLowerCase().includes(historySearch.toLowerCase()) ||
                    entry.date.includes(historySearch) ||
                    entry.mood.toLowerCase().includes(historySearch.toLowerCase())
                  )
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 dark:text-white">
                            📅 {entry.date} {entry.time && <span className="text-slate-400 font-normal">• {entry.time}</span>}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                            {entry.mood === 'Productive' && '⚡ '}
                            {entry.mood === 'Peaceful' && '🕊️ '}
                            {entry.mood === 'Motivated' && '🔥 '}
                            {entry.mood === 'Challenged' && '🧗 '}
                            {entry.mood === 'Regretful' && '😔 '}
                            {entry.mood}
                          </span>
                          {entry.characterScoreAtTime !== undefined && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                              Growth: {entry.characterScoreAtTime}%
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyNote(entry.id, entry.note)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                            title="Copy note"
                          >
                            {copiedId === entry.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          {onDeleteMuhasabaEntry && (
                            <button
                              onClick={() => onDeleteMuhasabaEntry(entry.id)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-500 transition-colors"
                              title="Delete from history"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {entry.note}
                      </p>

                      {(entry.goodHabitsNoted || entry.badHabitsResisted) && (
                        <div className="flex items-center gap-3 pt-1 text-[11px] flex-wrap border-t border-slate-200/60 dark:border-slate-800/60">
                          {entry.goodHabitsNoted && (
                            <span className="text-emerald-700 dark:text-emerald-300">
                              <span className="font-bold">🌟 Good Habit:</span> {entry.goodHabitsNoted}
                            </span>
                          )}
                          {entry.badHabitsResisted && (
                            <span className="text-amber-700 dark:text-amber-300">
                              <span className="font-bold">🛡️ Resisted:</span> {entry.badHabitsResisted}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Navigation Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: `Sab (${traits.length})`, icon: Compass },
            { id: 'good', label: `Achi Aadaat (${goodTraits.length})`, icon: Sparkles },
            { id: 'bad', label: `Buri Aadaat (${badTraits.length})`, icon: Shield },
            { id: 'overcome', label: `Chhor Di (${overcomeBad.length})`, icon: Trophy },
            { id: 'alerts', label: `Alerts / Zaida (${relapsedBad.length + slippingGood.length})`, icon: AlertTriangle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search habits..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 6. List of Habits / Character Traits */}
      {filteredTraits.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <HeartHandshake className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No items found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search filters or click below to record a new good virtue or bad habit to quit.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => handleOpenAddModal('good')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              + Add Achi Aadat
            </button>
            <button
              onClick={() => handleOpenAddModal('bad')}
              className="px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
            >
              + Add Buri Aadat
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredTraits.map((trait) => {
              const isGood = trait.type === 'good';
              const isOvercome = trait.status === 'overcome';
              const isRelapsedOrWorsening = trait.status === 'relapsed' || trait.trend === 'worsening';
              const isMastered = trait.status === 'mastered';
              const isSlipping = trait.status === 'slipping';

              return (
                <motion.div
                  key={trait.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 shadow-sm ${
                    isGood
                      ? isMastered
                        ? 'bg-gradient-to-br from-emerald-500/10 via-white dark:via-slate-900 to-white dark:to-slate-900 border-emerald-500/40 dark:border-emerald-500/30'
                        : isSlipping
                        ? 'bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/30'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      : isOvercome
                      ? 'bg-gradient-to-br from-emerald-500/10 via-white dark:via-slate-900 to-white dark:to-slate-900 border-emerald-500/40 dark:border-emerald-500/30'
                      : isRelapsedOrWorsening
                      ? 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/40'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Top Row: Type Badge + Category + Action Icons */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isGood ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            <Sparkles className="w-3 h-3" />
                            Achi Aadat
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                            <Shield className="w-3 h-3" />
                            Buri Aadat
                          </span>
                        )}

                        {trait.category && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {trait.category}
                          </span>
                        )}
                      </div>

                      {/* Edit / Delete Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditModal(trait)}
                          className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTrait(trait.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-2 leading-snug">
                      {trait.title}
                    </h4>

                    {/* Status & Trend Badges */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {/* Status indicator */}
                      {isGood ? (
                        trait.status === 'mastered' ? (
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 bg-emerald-500/15 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Pukhta Ho Gayi (Mastered)
                          </span>
                        ) : trait.status === 'slipping' ? (
                          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1 bg-amber-500/15 px-2 py-0.5 rounded-lg border border-amber-500/30">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Kamzor / Chhor Di (Slipping)
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1 bg-teal-500/15 px-2 py-0.5 rounded-lg border border-teal-500/30">
                            <Target className="w-3.5 h-3.5" />
                            Nayi Apnayi Ja Rahi (Adopting)
                          </span>
                        )
                      ) : (
                        trait.status === 'overcome' ? (
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 bg-emerald-500/15 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                            <Trophy className="w-3.5 h-3.5 text-amber-500" />
                            Kamyabi Se Chhor Di! (Overcome)
                          </span>
                        ) : trait.status === 'controlled' ? (
                          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1 bg-amber-500/15 px-2 py-0.5 rounded-lg border border-amber-500/30">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Kafi Hadd Tak Kam Ho Gayi
                          </span>
                        ) : trait.status === 'relapsed' ? (
                          <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1 bg-rose-500/15 px-2 py-0.5 rounded-lg border border-rose-500/30">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                            Zaida Ho Rahi Hai! (Relapsed)
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1 bg-indigo-500/15 px-2 py-0.5 rounded-lg border border-indigo-500/30">
                            <Shield className="w-3.5 h-3.5" />
                            Chhorne Ki Koshish (Quitting)
                          </span>
                        )
                      )}

                      {/* Trend indicator */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                        trait.trend === 'improving'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : trait.trend === 'worsening'
                          ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 font-extrabold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {trait.trend === 'improving' ? (
                          <>
                            <ArrowUpRight className="w-3 h-3" />
                            <span>{isGood ? 'Behtar Ho Rahi 📈' : 'Kam Ho Rahi 📉'}</span>
                          </>
                        ) : trait.trend === 'worsening' ? (
                          <>
                            <ArrowDownRight className="w-3 h-3" />
                            <span>{isGood ? 'Gir Rahi Hai 📉' : 'Zaida Ho Rahi 🚨'}</span>
                          </>
                        ) : (
                          <>
                            <Minus className="w-3 h-3" />
                            <span>Qayam Hai ⚖️</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Replacement Habit / Trigger box for bad habits */}
                    {!isGood && trait.replacementHabit && (
                      <div className="mt-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 text-[11px] space-y-1">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block">
                          🔄 Is ki jagah achi aadat:
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 italic">{trait.replacementHabit}</p>
                      </div>
                    )}

                    {/* Trigger or notes */}
                    {trait.notes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        💬 {trait.notes}
                      </p>
                    )}
                  </div>

                  {/* Bottom: Progress Bar + Quick Log Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                    {/* Adoption / Overcome Progress */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        <span>{isGood ? 'Adoption / Consistency' : 'Overcoming / Quit Progress'}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{trait.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            isGood 
                              ? 'bg-gradient-to-r from-teal-500 to-emerald-500' 
                              : isOvercome 
                              ? 'bg-emerald-500' 
                              : isRelapsedOrWorsening 
                              ? 'bg-rose-500' 
                              : 'bg-gradient-to-r from-amber-500 to-rose-500'
                          }`}
                          style={{ width: `${trait.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Streak & Quick Action Controls */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-bold">
                        <Flame className={`w-4 h-4 ${isGood ? 'text-emerald-500' : 'text-amber-500'}`} />
                        <span>
                          {isGood ? `${trait.daysCleanOrPracticed} Days Practiced` : `${trait.daysCleanOrPracticed} Days Clean`}
                        </span>
                      </div>

                      {/* Interactive Buttons */}
                      <div className="flex items-center gap-1.5">
                        {isGood ? (
                          <>
                            <button
                              onClick={() => onLogPracticeOrClean(trait.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
                              title="Log today's practice"
                            >
                              <Check className="w-3 h-3" />
                              <span>+1 Day</span>
                            </button>
                            {trait.status !== 'mastered' && (
                              <button
                                onClick={() => handleQuickStatusChange(trait, 'mastered', 'improving')}
                                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-[10px] font-bold"
                                title="Mark as Mastered"
                              >
                                Mastered
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => onLogPracticeOrClean(trait.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
                              title="Mark clean / resisted today"
                            >
                              <Check className="w-3 h-3" />
                              <span>Clean Today</span>
                            </button>

                            {/* Quick alert / relapse button */}
                            <button
                              onClick={() => onMarkRelapseOrSlip(trait.id)}
                              className="px-2 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/50 hover:bg-rose-200 text-rose-700 dark:text-rose-300 text-[10px] font-bold border border-rose-300 dark:border-rose-800"
                              title="Zaida Hui / Relapse hua"
                            >
                              Zaida Hui 🚨
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* 7. Add / Edit Trait Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {editingTrait ? 'Edit Character Trait' : 'Record New Habit / Trait'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  Habit Type (Achi Aadat Ya Buri Aadat?)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('good')}
                    className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      formType === 'good'
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>🌟 Achi Aadat (Virtue / Good)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormType('bad')}
                    className={`py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      formType === 'bad'
                        ? 'bg-rose-600 border-rose-500 text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>🛡️ Buri Aadat (Flaw to Quit)</span>
                  </button>
                </div>
              </div>

              {/* Title & Quick Suggestions */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Habit / Trait Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={formType === 'good' ? 'e.g. Subah Fajr waqt uthna, Sach bolna' : 'e.g. Mobile scrolling, Kaam taalna'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />

                {/* Quick chip suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[10px] text-slate-400 font-bold">Quick ideas:</span>
                  {(formType === 'good' ? QUICK_SUGGESTIONS_GOOD : QUICK_SUGGESTIONS_BAD).map((sugg, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormTitle(sugg.title);
                        setFormCategory(sugg.cat as any);
                      }}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-950 transition-colors"
                    >
                      {sugg.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Current Status</label>
                  {formType === 'good' ? (
                    <select
                      value={formGoodStatus}
                      onChange={(e) => setFormGoodStatus(e.target.value as GoodTraitStatus)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="adopting">🟢 Nayi Aadat Apnayi Ja Rahi (Adopting)</option>
                      <option value="mastered">💎 Pukhta Ho Gayi (Mastered)</option>
                      <option value="slipping">⚠️ Chhor Di / Kamzor Ho Rahi (Slipping)</option>
                    </select>
                  ) : (
                    <select
                      value={formBadStatus}
                      onChange={(e) => setFormBadStatus(e.target.value as BadTraitStatus)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="quitting">🛡️ Chhorne Ki Koshish (Quitting)</option>
                      <option value="controlled">🟡 Kafi Hadd Tak Kam Ho Gayi</option>
                      <option value="overcome">🏆 Kamyabi Se Chhor Di! (Overcome)</option>
                      <option value="relapsed">🚨 Zaida Ho Rahi Hai! (Alert)</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Trend & Progress Slider */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Evolution Trend</label>
                  <select
                    value={formTrend}
                    onChange={(e) => setFormTrend(e.target.value as TrendDirection)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="improving">📈 Behtar Ho Rahi / Kam Ho Rahi (Improving)</option>
                    <option value="stable">⚖️ Qayam Hai (Stable)</option>
                    <option value="worsening">📉 Zaida Ho Rahi / Gir Rahi (Worsening)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    {formType === 'good' ? 'Days Practiced' : 'Days Clean (Free)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formDays}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormDays(val === '' ? '' : parseInt(val, 10) || 0);
                    }}
                    placeholder="0"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Progress Slider (0-100%) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">
                    {formType === 'good' ? 'Consistency / Adoption Level' : 'Overcoming & Freedom Level'}
                  </label>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{formProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formProgress}
                  onChange={(e) => setFormProgress(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Bad Habit Replacement field */}
              {formType === 'bad' && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    🔄 Replacement Habit (Is ki jagah kaun si achi aadat apnayein?)
                  </label>
                  <input
                    type="text"
                    value={formReplacement}
                    onChange={(e) => setFormReplacement(e.target.value)}
                    placeholder="e.g. Jab phone ka dil kare to 1 page book parhna"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Reason or Root Trigger */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {formType === 'good' ? 'Reason / Why this matters' : 'Trigger / Wajah (Kyun hoti hai?)'}
                </label>
                <input
                  type="text"
                  value={formTrigger}
                  onChange={(e) => setFormTrigger(e.target.value)}
                  placeholder={formType === 'good' ? 'e.g. Character building aur deen' : 'e.g. Boredom, stress, ya late night baithna'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Personal Notes / Strategy</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Koyi khaas strategy ya target jo yaad rakhna ho..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20"
                >
                  {editingTrait ? 'Save Changes' : 'Record Trait'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

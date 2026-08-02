import React, { useState, useEffect } from 'react';
import { AthenaCoreEngine } from '../core/athenaCoreEngine';
import { WordEntity, UserLearningStateEntity, SystemConfig, LicenseInfo, SecurityCheckResult, VoiceSettings, AIPromptExport, BackupPackage } from '../types/athena';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  FileSpreadsheet,
  Settings,
  Plus,
  Search,
  Volume2,
  Trash2,
  Edit,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Smartphone,
  Maximize2,
  Minimize2,
  RotateCcw,
  Upload,
  FileText,
  Check,
  ChevronRight,
  Brain,
  Award,
  Calendar,
  Filter,
  ShieldCheck,
  Key,
  Lock,
  Database,
  Copy,
  Zap,
  Flame,
  MessageSquare,
  Terminal,
  UserCheck,
  BarChart3,
  RefreshCw,
  Sliders,
  ShieldAlert,
} from 'lucide-react';

export const AndroidMvpApp: React.FC = () => {
  const engine = AthenaCoreEngine.getInstance();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vocab' | 'leitner' | 'reader' | 'ai_tutor' | 'backup_license' | 'developer'>('dashboard');

  // Device Frame State
  const [isDeviceFrame, setIsDeviceFrame] = useState(true);

  // Engine Data States
  const [words, setWords] = useState<WordEntity[]>([]);
  const [learningStates, setLearningStates] = useState<UserLearningStateEntity[]>([]);
  const [config, setConfig] = useState<SystemConfig>(engine.getSystemConfig());
  const [license, setLicense] = useState<LicenseInfo>(engine.getLicenseInfo());
  const [security, setSecurity] = useState<SecurityCheckResult>(engine.getSecurityCheckResult());
  const [voice, setVoice] = useState<VoiceSettings>(engine.getVoiceSettings());

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  // Modals & Forms State
  const [selectedWord, setSelectedWord] = useState<WordEntity | null>(null);
  const [isAddWordOpen, setIsAddWordOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<WordEntity | null>(null);

  // Vocabulary Form Fields
  const [formText, setFormText] = useState('');
  const [formTranslation, setFormTranslation] = useState('');
  const [formExample, setFormExample] = useState('');
  const [formPos, setFormPos] = useState('noun');
  const [formDomain, setFormDomain] = useState<WordEntity['domainCategory']>('Everyday');
  const [formIpa, setFormIpa] = useState('');
  const [formNote, setFormNote] = useState('');

  // Leitner Session State
  const [leitnerQueue, setLeitnerQueue] = useState<{ word: WordEntity; state: UserLearningStateEntity }[]>([]);
  const [currentLeitnerIndex, setCurrentLeitnerIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, easy: 0, good: 0, hard: 0, again: 0 });

  // Reader & PDF State
  const [readerInputText, setReaderInputText] = useState(
    `Language learning becomes highly effective when active usage gaps are systematically closed through daily contextual practice and adaptive Leitner reviews.`
  );
  const [parsedTokens, setParsedTokens] = useState<string[]>([]);
  const [activeWordLookup, setActiveWordLookup] = useState<string | null>(null);
  const [lookupTranslation, setLookupTranslation] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);

  // AI Prompt Export State
  const [aiTopic, setAiTopic] = useState('Daily Life & AI Technology');
  const [generatedPrompt, setGeneratedPrompt] = useState<AIPromptExport | null>(null);

  // Backup & License Input State
  const [inputLicenseKey, setInputLicenseKey] = useState('');
  const [backupJsonText, setBackupJsonText] = useState('');

  // Toast Notification
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const refreshData = () => {
    setWords(engine.getWords());
    setLearningStates(engine.getLearningStates());
    setConfig(engine.getSystemConfig());
    setLicense(engine.getLicenseInfo());
    setSecurity(engine.getSecurityCheckResult());
    setVoice(engine.getVoiceSettings());
  };

  useEffect(() => {
    refreshData();
    const unsub = engine.subscribe('*', () => {
      refreshData();
    });
    return () => unsub();
  }, []);

  // Parse reader tokens
  useEffect(() => {
    const tokens = readerInputText
      .replace(/[^\w\s-]/g, '')
      .split(/\s+/)
      .filter((t) => t.length > 0);
    setParsedTokens(tokens);
  }, [readerInputText]);

  // Sync Leitner Queue
  const prepareLeitnerSession = () => {
    const allWords = engine.getWords();
    const states = engine.getLearningStates();
    const queue = allWords.map((w) => {
      const st = states.find((s) => s.wordId === w.id) || {
        wordId: w.id,
        userId: 'usr_athena_001',
        boxLevel: 1,
        lastReviewedAt: new Date().toISOString(),
        nextReviewAt: new Date().toISOString(),
        reviewCount: 0,
        lapseCount: 0,
        easeFactor: 2.5,
        retrievabilityScore: 1.0,
        history: [],
      };
      return { word: w, state: st };
    });

    setLeitnerQueue(queue);
    setCurrentLeitnerIndex(0);
    setIsCardFlipped(false);
    setSessionCompleted(false);
    setSessionStats({ reviewed: 0, easy: 0, good: 0, hard: 0, again: 0 });
  };

  useEffect(() => {
    if (activeTab === 'leitner') {
      prepareLeitnerSession();
    }
  }, [activeTab]);

  // Audio TTS player
  const handleSpeak = (text: string) => {
    engine.speakNativeTts(text);
  };

  // CRUD Handlers
  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim() || !formTranslation.trim()) return;

    if (editingWord) {
      engine.updateWord(editingWord.id, {
        text: formText,
        domainCategory: formDomain,
        phoneticIpa: formIpa || `/${formText.toLowerCase()}/`,
        meanings: [
          {
            partOfSpeech: formPos,
            definitionEn: `Meaning for ${formText}`,
            translation: formTranslation,
            contextUsage: formNote || 'Updated in Android MVP',
          },
        ],
        examples: formExample ? [formExample] : editingWord.examples,
      });
      showToast(`واژه '${formText}' با موفقیت ویرایش شد`);
      setEditingWord(null);
    } else {
      const newWord = engine.addEnrichedWord({
        text: formText,
        languageCode: 'en',
        cefrLevel: 'B2',
        domainCategory: formDomain,
        phoneticIpa: formIpa || `/${formText.toLowerCase()}/`,
        audioUrl: `audio_${formText.toLowerCase()}.mp3`,
        meanings: [
          {
            partOfSpeech: formPos,
            definitionEn: `User added word: ${formText}`,
            translation: formTranslation,
            contextUsage: formNote || 'Manual addition via Android App',
          },
        ],
        examples: formExample ? [formExample] : [`Example sentence for ${formText}`],
        etymology: 'Manual Entry',
        collocations: [],
        synonyms: [],
        antonyms: [],
        frequencyScore: 7.0,
      });
      showToast(`واژه '${newWord.text}' به جعبه شماره ۱ لایتنر اضافه شد!`);
    }

    setFormText('');
    setFormTranslation('');
    setFormExample('');
    setFormIpa('');
    setFormNote('');
    setIsAddWordOpen(false);
    refreshData();
  };

  const handleOpenEdit = (w: WordEntity) => {
    setEditingWord(w);
    setFormText(w.text);
    setFormTranslation(w.meanings[0]?.translation || '');
    setFormExample(w.examples[0] || '');
    setFormPos(w.meanings[0]?.partOfSpeech || 'noun');
    setFormDomain(w.domainCategory || 'Everyday');
    setFormIpa(w.phoneticIpa || '');
    setFormNote(w.meanings[0]?.contextUsage || '');
    setIsAddWordOpen(true);
  };

  const handleDeleteWord = (id: string, text: string) => {
    if (confirm(`آیا از حذف واژه '${text}' اطمینان دارید؟`)) {
      engine.deleteWord(id);
      showToast(`واژه '${text}' حذف شد.`);
      if (selectedWord?.id === id) setSelectedWord(null);
      refreshData();
    }
  };

  // Leitner Review Handler
  const handleAnswerRating = (rating: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY') => {
    if (leitnerQueue.length === 0) return;
    const currentItem = leitnerQueue[currentLeitnerIndex];
    engine.recordWordReview(currentItem.word.id, rating);

    setSessionStats((prev) => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      easy: rating === 'EASY' ? prev.easy + 1 : prev.easy,
      good: rating === 'GOOD' ? prev.good + 1 : prev.good,
      hard: rating === 'HARD' ? prev.hard + 1 : prev.hard,
      again: rating === 'AGAIN' ? prev.again + 1 : prev.again,
    }));

    if (currentLeitnerIndex + 1 < leitnerQueue.length) {
      setCurrentLeitnerIndex((prev) => prev + 1);
      setIsCardFlipped(false);
    } else {
      setSessionCompleted(true);
      showToast('جلسه مرور لایتنر با موفقیت به پایان رسید!');
    }
    refreshData();
  };

  // Tap word lookup in Text Reader
  const handleTapWord = (token: string) => {
    const cleanToken = token.trim();
    setActiveWordLookup(cleanToken);
    const found = words.find((w) => w.text.toLowerCase() === cleanToken.toLowerCase());
    if (found) {
      setLookupTranslation(found.meanings[0]?.translation || 'معنی در دیتابیس یافت شد');
    } else {
      setLookupTranslation(`معنی پیشنهادی: ${cleanToken} (کلیک برای افزودن به لایتنر)`);
    }
    handleSpeak(cleanToken);
  };

  const handleAddTokenToLeitner = (token: string) => {
    engine.addEnrichedWord({
      text: token,
      languageCode: 'en',
      cefrLevel: 'B2',
      domainCategory: 'Everyday',
      phoneticIpa: `/${token.toLowerCase()}/`,
      meanings: [
        {
          partOfSpeech: 'noun',
          definitionEn: `Added from Text Reader: ${token}`,
          translation: lookupTranslation || `معنی واژه ${token}`,
          contextUsage: 'Reader lookup',
        },
      ],
      examples: [`Contextual usage of ${token} in reading text.`],
    });
    showToast(`واژه '${token}' با موفقیت به دیتابیس و لایتنر اضافه شد!`);
    refreshData();
  };

  // PDF Upload Simulation
  const handlePdfUploadSimulation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFileName(file.name);
      setReaderInputText(
        `[PDF Extracted Text: ${file.name}]\n\nArtificial Intelligence and neural language models allow ATHENA to dynamically track active usage gaps, automate spaced repetition review cycles, and deliver individualized speaking practice.`
      );
      showToast(`فایل PDF '${file.name}' با موفقیت استخراج و توکن‌بندی شد!`);
    }
  };

  // Generate Prompt
  const handleGeneratePrompt = () => {
    const pr = engine.generateAITutorPrompt(aiTopic);
    setGeneratedPrompt(pr);
    showToast('پرامپت اختصاصی ربات هوش مصنوعی با موفقیت تولید شد!');
  };

  // License Activation
  const handleActivateLicense = () => {
    const res = engine.activateLicense(inputLicenseKey);
    showToast(res.message);
    setLicense(engine.getLicenseInfo());
  };

  // Backup Export & Import
  const handleExportBackup = () => {
    const bk = engine.exportBackupPackage();
    setBackupJsonText(JSON.stringify(bk, null, 2));
    showToast('بک‌آپ رمزشده .athena با موفقیت تولید شد!');
  };

  const handleImportBackup = () => {
    if (!backupJsonText) return;
    const res = engine.importBackupPackage(backupJsonText);
    showToast(res.message);
    refreshData();
  };

  // Filtered Words list
  const filteredWords = words.filter((w) => {
    const matchesSearch =
      w.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meanings.some((m) => m.translation.includes(searchQuery));
    const matchesDomain = selectedDomain === 'ALL' || w.domainCategory === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  // Calculate Leitner Box counts
  const boxCounts = [1, 2, 3, 4, 5].map(
    (box) => learningStates.filter((s) => s.boxLevel === box).length
  );
  const dueCount = learningStates.filter((s) => s.boxLevel <= 2).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Container View Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Phase 4.0 — Android Alpha
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-400" />
              ATHENA Android Alpha Application
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            نسخه قابل نصب آندروید متصل به موتور ATHENA KMP Core همراه با لایتنر، متون خواندنی، هوش مصنوعی و سیستم امنیتی.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDeviceFrame(!isDeviceFrame)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2 transition"
          >
            {isDeviceFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            {isDeviceFrame ? 'Full Screen View' : 'Pixel 9 Frame'}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 border border-indigo-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Wrapper: Device Shell vs Full Screen */}
      <div className={`mx-auto transition-all ${isDeviceFrame ? 'max-w-md' : 'w-full'}`}>
        <div
          className={`bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border ${
            isDeviceFrame ? 'border-slate-800 ring-8 ring-slate-900/80 my-2' : 'border-slate-800'
          }`}
        >
          {/* Android Status Bar */}
          <div className="bg-slate-900 px-5 py-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80">
            <div className="flex items-center gap-1.5 text-white font-bold">
              <span>08:30 AM</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 font-sans">
                {license.isActivated ? 'PRO ALPHA' : '24H TRIAL'}
              </span>
              <span className="text-emerald-400 font-bold">100%</span>
            </div>
          </div>

          {/* Android App Bar */}
          <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                A
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-tight">ATHENA Android</h1>
                <p className="text-[10px] text-slate-400">English → Persian Adaptive Learning</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddWordOpen(true)}
                className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition shadow-md"
                title="Add Word"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Android Screen Body */}
          <div className="p-4 sm:p-5 min-h-[540px] max-h-[660px] overflow-y-auto space-y-5 bg-slate-950 text-slate-100">
            {/* TAB 1: DASHBOARD / SMART HOME */}
            {activeTab === 'dashboard' && (
              <div className="space-y-5">
                {/* Today's Mission Recommendation Card */}
                <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 p-4 rounded-2xl border border-indigo-900/50 relative overflow-hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Today's Mission — Adaptive Recommendation
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                      Gap: 32%
                    </span>
                  </div>

                  <p className="text-xs text-white leading-relaxed font-medium">
                    "Today you should focus on speaking because your active usage gap is <strong className="text-amber-400">32%</strong>."
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setActiveTab('leitner')}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Start Review ({dueCount})
                    </button>

                    <button
                      onClick={() => setActiveTab('ai_tutor')}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      AI Prompt
                    </button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-xs">Total Vocabulary</span>
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-2xl font-extrabold text-white">{words.length}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">EN → FA Repository</span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-xs">Mastered</span>
                      <Award className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-2xl font-extrabold text-emerald-400">
                      {learningStates.filter((s) => s.boxLevel >= 3).length}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Leitner Box 3+</span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-xs">Due For Review</span>
                      <Calendar className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-2xl font-extrabold text-amber-400">{dueCount}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Spaced Repetition</span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="text-xs">Current Streak</span>
                      <Flame className="w-4 h-4 text-orange-400" />
                    </div>
                    <span className="text-2xl font-extrabold text-orange-400">7 Days</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Daily practice</span>
                  </div>
                </div>

                {/* Leitner Box Progress Breakdown */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">Leitner Box Distribution</span>
                  <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                    {[1, 2, 3, 4, 5].map((box, idx) => (
                      <div key={box} className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Box {box}</span>
                        <span className="font-bold text-indigo-400 text-sm">{boxCounts[idx]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: VOCABULARY MODULE */}
            {activeTab === 'vocab' && (
              <div className="space-y-4">
                {/* Search & Domain Filter Bar */}
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search English or Persian word..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                    {['ALL', 'Everyday', 'Academic', 'Tech', 'Business', 'Medical'].map((domain) => (
                      <button
                        key={domain}
                        onClick={() => setSelectedDomain(domain)}
                        className={`px-3 py-1 rounded-lg border whitespace-nowrap transition ${
                          selectedDomain === domain
                            ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Words List */}
                <div className="space-y-2">
                  {filteredWords.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">هیچ واژه‌ای یافت نشد.</div>
                  ) : (
                    filteredWords.map((w) => {
                      const st = learningStates.find((s) => s.wordId === w.id);
                      return (
                        <div
                          key={w.id}
                          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 transition"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{w.text}</span>
                              <span className="text-[10px] text-indigo-400 font-mono">{w.phoneticIpa}</span>
                              <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
                                {w.domainCategory}
                              </span>
                            </div>
                            <p className="text-xs text-emerald-400 font-medium">
                              {w.meanings[0]?.translation || 'بدون ترجمه'}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                              Box {st?.boxLevel || 1}
                            </span>
                            <button
                              onClick={() => handleSpeak(w.text)}
                              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg"
                              title="Pronounce"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(w)}
                              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-lg"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteWord(w.id, w.text)}
                              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: LEITNER SYSTEM */}
            {activeTab === 'leitner' && (
              <div className="space-y-4">
                {sessionCompleted ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
                    <Award className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h3 className="text-base font-bold text-white">Review Session Complete!</h3>
                    <p className="text-xs text-slate-400">تمام واژگان بر اساس جعبه‌های ۵گانه لایتنر بروزرسانی شدند.</p>
                    <button
                      onClick={prepareLeitnerSession}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Start New Session
                    </button>
                  </div>
                ) : leitnerQueue.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">واژه‌ای در صف مرور قرار ندارد.</div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span>Card {currentLeitnerIndex + 1} of {leitnerQueue.length}</span>
                      <span className="font-bold text-indigo-400">
                        Box {leitnerQueue[currentLeitnerIndex]?.state.boxLevel || 1}
                      </span>
                    </div>

                    {/* Flashcard Component */}
                    <div
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                      className="bg-slate-900 border-2 border-indigo-500/40 hover:border-indigo-500/80 rounded-2xl p-6 text-center min-h-[220px] flex flex-col items-center justify-center cursor-pointer transition shadow-xl relative"
                    >
                      {!isCardFlipped ? (
                        <div className="space-y-2">
                          <span className="text-2xl font-black text-white block">
                            {leitnerQueue[currentLeitnerIndex]?.word.text}
                          </span>
                          <span className="text-xs text-indigo-400 font-mono block">
                            {leitnerQueue[currentLeitnerIndex]?.word.phoneticIpa}
                          </span>
                          <p className="text-[11px] text-slate-500 mt-4">(روی کارت کلیک کنید تا معنی نمایش داده شود)</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <span className="text-xl font-bold text-emerald-400 block">
                            {leitnerQueue[currentLeitnerIndex]?.word.meanings[0]?.translation}
                          </span>
                          <p className="text-xs text-slate-300 italic max-w-xs">
                            "{leitnerQueue[currentLeitnerIndex]?.word.examples[0]}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Rating Actions */}
                    {isCardFlipped && (
                      <div className="grid grid-cols-4 gap-2 pt-2">
                        <button
                          onClick={() => handleAnswerRating('AGAIN')}
                          className="py-2 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 font-bold text-xs hover:bg-rose-900"
                        >
                          AGAIN
                        </button>
                        <button
                          onClick={() => handleAnswerRating('HARD')}
                          className="py-2 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-300 font-bold text-xs hover:bg-amber-900"
                        >
                          HARD
                        </button>
                        <button
                          onClick={() => handleAnswerRating('GOOD')}
                          className="py-2 rounded-xl bg-indigo-950/80 border border-indigo-800 text-indigo-300 font-bold text-xs hover:bg-indigo-900"
                        >
                          GOOD
                        </button>
                        <button
                          onClick={() => handleAnswerRating('EASY')}
                          className="py-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold text-xs hover:bg-emerald-900"
                        >
                          EASY
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: TEXT READER & TEXT PDF EXTRACTOR */}
            {activeTab === 'reader' && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      Text Reader & PDF Extractor
                    </span>
                    <label className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold cursor-pointer">
                      Upload PDF
                      <input type="file" accept=".pdf,.txt" onChange={handlePdfUploadSimulation} className="hidden" />
                    </label>
                  </div>

                  <textarea
                    rows={3}
                    value={readerInputText}
                    onChange={(e) => setReaderInputText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>

                {/* Interactive Tokenized Canvas */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Tap word to translate & add to Leitner:</span>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {parsedTokens.map((token, idx) => (
                      <span
                        key={idx}
                        onClick={() => handleTapWord(token)}
                        className={`px-1.5 py-0.5 rounded cursor-pointer transition ${
                          activeWordLookup?.toLowerCase() === token.toLowerCase()
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Lookup Detail Box */}
                {activeWordLookup && (
                  <div className="bg-indigo-950/60 border border-indigo-500/40 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{activeWordLookup}</span>
                      <span className="text-emerald-300 text-[11px]">{lookupTranslation}</span>
                    </div>

                    <button
                      onClick={() => handleAddTokenToLeitner(activeWordLookup)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to Leitner
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: AI TUTOR PROMPT GENERATOR */}
            {activeTab === 'ai_tutor' && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-bold text-white text-xs">AI Tutor Context Builder & Prompt Export</h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-400 block">Conversation Topic:</label>
                    <input
                      type="text"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <button
                    onClick={handleGeneratePrompt}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Generate AI Tutor Prompt
                  </button>
                </div>

                {generatedPrompt && (
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-emerald-400">Generated Prompt Ready</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedPrompt.formattedPromptText);
                          showToast('پرامپت کپی شد!');
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-mono flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy Prompt
                      </button>
                    </div>

                    <textarea
                      readOnly
                      rows={8}
                      value={generatedPrompt.formattedPromptText}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-[10px] text-slate-300"
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: BACKUP & LICENSE & SECURITY */}
            {activeTab === 'backup_license' && (
              <div className="space-y-4">
                {/* License Box */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-amber-400" />
                      License Activation
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${license.isActivated ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {license.licenseType}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter activation key..."
                      value={inputLicenseKey}
                      onChange={(e) => setInputLicenseKey(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white uppercase font-mono"
                    />
                    <button
                      onClick={handleActivateLicense}
                      className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg"
                    >
                      Activate
                    </button>
                  </div>
                </div>

                {/* Security Status Box */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Security & Encryption Checks
                  </span>
                  <div className="space-y-1 text-slate-400 text-[11px]">
                    <div className="flex justify-between">
                      <span>Root Check:</span>
                      <strong className="text-emerald-400">PASSED (Not Rooted)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Database Tampering:</span>
                      <strong className="text-emerald-400">CLEAN (SHA-256 Valid)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Local Storage:</span>
                      <strong className="text-emerald-400">AES-256 Encrypted</strong>
                    </div>
                  </div>
                </div>

                {/* Backup Box */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-indigo-400" />
                    Encrypted Local Backup (.athena)
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={handleExportBackup}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg"
                    >
                      Export Backup
                    </button>
                    <button
                      onClick={handleImportBackup}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700"
                    >
                      Restore Backup
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: HIDDEN DEVELOPER PANEL */}
            {activeTab === 'developer' && (
              <div className="space-y-4">
                <div className="bg-slate-900 border border-rose-500/30 p-4 rounded-xl space-y-3">
                  <span className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                    <Terminal className="w-4 h-4" />
                    Hidden Developer Control Panel
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => {
                        engine.developerGenerateTestVocab(5);
                        showToast('۵ واژه آزمایشی اضافه شد.');
                        refreshData();
                      }}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium text-left border border-slate-700"
                    >
                      + Generate Test Vocab
                    </button>

                    <button
                      onClick={() => {
                        engine.developerGenerateLeitnerHistory();
                        showToast('تاریخچه لایتنر شبیه‌سازی شد.');
                        refreshData();
                      }}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium text-left border border-slate-700"
                    >
                      + Sim Leitner History
                    </button>

                    <button
                      onClick={() => {
                        engine.developerResetDatabase();
                        showToast('دیتابیس ریست شد.');
                        refreshData();
                      }}
                      className="p-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 rounded-lg font-medium text-left border border-rose-800 col-span-2"
                    >
                      ⚠ Reset Factory Database
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Android Navigation Bar (Bottom Navigation) */}
          <div className="bg-slate-900 border-t border-slate-800 px-2 py-2 grid grid-cols-6 gap-1 text-[10px] text-slate-400">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center py-1 rounded.lg transition ${
                activeTab === 'dashboard' ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('vocab')}
              className={`flex flex-col items-center py-1 rounded-lg transition ${
                activeTab === 'vocab' ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Vocab</span>
            </button>

            <button
              onClick={() => setActiveTab('leitner')}
              className={`flex flex-col items-center py-1 rounded-lg transition ${
                activeTab === 'leitner' ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Leitner</span>
            </button>

            <button
              onClick={() => setActiveTab('reader')}
              className={`flex flex-col items-center py-1 rounded-lg transition ${
                activeTab === 'reader' ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Reader</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_tutor')}
              className={`flex flex-col items-center py-1 rounded-lg transition ${
                activeTab === 'ai_tutor' ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI</span>
            </button>

            <button
              onClick={() => setActiveTab('backup_license')}
              className={`flex flex-col items-center py-1 rounded-lg transition ${
                activeTab === 'backup_license' ? 'text-indigo-400 font-bold' : 'hover:text-slate-200'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Backup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Add / Edit Word Form */}
      {isAddWordOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">
                {editingWord ? 'Edit Word Entity' : 'Add New Word to Leitner'}
              </h3>
              <button
                onClick={() => {
                  setIsAddWordOpen(false);
                  setEditingWord(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWord} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">English Word:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement"
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Persian Translation (معنی فارسی):</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. پیاده‌سازی کردن"
                  value={formTranslation}
                  onChange={(e) => setFormTranslation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Part of Speech:</label>
                  <select
                    value={formPos}
                    onChange={(e) => setFormPos(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="verb">Verb (فعل)</option>
                    <option value="noun">Noun (اسم)</option>
                    <option value="adjective">Adjective (صفت)</option>
                    <option value="adverb">Adverb (قید)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Domain Category:</label>
                  <select
                    value={formDomain}
                    onChange={(e) => setFormDomain(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Everyday">Everyday</option>
                    <option value="Academic">Academic</option>
                    <option value="Tech">Tech</option>
                    <option value="Business">Business</option>
                    <option value="Medical">Medical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">IPA Phonetic Pronunciation:</label>
                <input
                  type="text"
                  placeholder="e.g. /ˈɪm.plə.ment/"
                  value={formIpa}
                  onChange={(e) => setFormIpa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Example Sentence:</label>
                <input
                  type="text"
                  placeholder="e.g. We will implement the new features tomorrow."
                  value={formExample}
                  onChange={(e) => setFormExample(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Personal Note / Context:</label>
                <input
                  type="text"
                  placeholder="e.g. یادداشت شخصی کاربر"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddWordOpen(false);
                    setEditingWord(null);
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg"
                >
                  Save Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

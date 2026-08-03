import React, { useState, useEffect } from 'react';
import { AthenaCoreEngine } from '../core/athenaCoreEngine';
import { WordEntity, UserLearningStateEntity, AthenaUserSettings, FsrsRating, LearningSessionRecord } from '../types/athena';
import {
  Home,
  BookOpen,
  RotateCcw,
  Search,
  Sparkles,
  Settings,
  Plus,
  Upload,
  Flame,
  Bookmark,
  CheckCircle2,
  Zap,
  Copy,
  Check,
  Filter,
  Clock,
  ArrowRight,
  Brain,
  Trash2,
  Edit,
  Volume2,
  Layers,
  FileText,
  Send,
  ShieldCheck,
  Activity,
  Award,
  HelpCircle,
} from 'lucide-react';
import { TappableWordText } from './TappableWordText';
import { DictionaryPopup } from './DictionaryPopup';
import { SettingsScreen } from './SettingsScreen';
import { AiTutorWorkflowModal } from './AiTutorWorkflowModal';
import { ImportEngineModal } from './ImportEngineModal';

export const AndroidMvpApp: React.FC = () => {
  const engine = AthenaCoreEngine.getInstance();

  // Navigation state (Clean end-user production tabs)
  const [activeTab, setActiveTab] = useState<'home' | 'vocab' | 'review' | 'dictionary' | 'ai_practice' | 'settings'>('home');

  // Popup & Universal Tap state
  const [popupWordText, setPopupWordText] = useState<string | null>(null);

  // Core Engine States
  const [words, setWords] = useState<WordEntity[]>([]);
  const [learningStates, setLearningStates] = useState<UserLearningStateEntity[]>([]);
  const [userSettings, setUserSettings] = useState<AthenaUserSettings>(engine.getUserSettings());
  const [sessionHistory, setSessionHistory] = useState<LearningSessionRecord[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('ALL');
  const [selectedCefrFilter, setSelectedCefrFilter] = useState<string>('ALL');

  // Offline Dictionary Tab State
  const [dictQuery, setDictQuery] = useState('');
  const [dictMode, setDictMode] = useState<'exact' | 'prefix' | 'lemma' | 'fuzzy'>('exact');
  const [dictResults, setDictResults] = useState<WordEntity[]>([]);
  const [dictLookupLatency, setDictLookupLatency] = useState<number>(0);

  // Word Management Modal
  const [isAddWordOpen, setIsAddWordOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<WordEntity | null>(null);

  // Vocabulary Form Fields
  const [formText, setFormText] = useState('');
  const [formTranslation, setFormTranslation] = useState('');
  const [formExample, setFormExample] = useState('');
  const [formPos, setFormPos] = useState('noun');
  const [formDomain, setFormDomain] = useState<WordEntity['domainCategory']>('Everyday');

  // FSRS Learning Review Session State
  const [reviewQueue, setReviewQueue] = useState<{ word: WordEntity; state: UserLearningStateEntity }[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Session Stats tracking
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [reviewedWordsCount, setReviewedWordsCount] = useState<number>(0);
  const [sessionCorrectCount, setSessionCorrectCount] = useState<number>(0);
  const [sessionForgottenCount, setSessionForgottenCount] = useState<number>(0);

  // AI Practice Workflow State
  const [aiPracticePrompt, setAiPracticePrompt] = useState<string>('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [aiResponseInput, setAiResponseInput] = useState('');
  const [extractedVocab, setExtractedVocab] = useState<{ word: string; meaning: string; pos: string }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync Engine Data
  const refreshEngineData = () => {
    setWords(engine.getWords());
    setLearningStates(engine.getLearningStates());
    setUserSettings(engine.getUserSettings());
    setSessionHistory(engine.getSessionHistory ? engine.getSessionHistory() : []);
  };

  useEffect(() => {
    refreshEngineData();
  }, []);

  // Universal Word Tap Listener
  useEffect(() => {
    const handleWordTapEvent = (e: CustomEvent<{ word: string }>) => {
      const currentSettings = engine.getUserSettings();
      const action = currentSettings.tapBehavior.defaultAction;
      const word = e.detail.word;

      if (action === 'POPUP') {
        setPopupWordText(word);
      } else if (action === 'FULL_PAGE') {
        setDictQuery(word);
        setActiveTab('dictionary');
        setPopupWordText(word);
      } else if (action === 'SPEAK') {
        engine.speakWord(word, currentSettings.pronunciation.speechSpeed || 1.0);
        showToast(`قرائت کلمه: "${word}"`);
      } else if (action === 'COPY') {
        navigator.clipboard.writeText(word);
        showToast(`کلمه "${word}" کپی شد`);
      } else if (action === 'BOOKMARK') {
        const found = engine.getWords().find((w) => w.text.toLowerCase() === word.toLowerCase());
        if (found) {
          engine.addUserVocabulary(found);
          showToast(`کلمه "${word}" اضافه شد`);
        } else {
          setPopupWordText(word);
        }
      }
    };

    window.addEventListener('athena_word_tap' as any, handleWordTapEvent);
    return () => {
      window.removeEventListener('athena_word_tap' as any, handleWordTapEvent);
    };
  }, []);

  // Offline Dictionary Engine Lookup
  useEffect(() => {
    if (!dictQuery.trim()) {
      setDictResults([]);
      setDictLookupLatency(0);
      return;
    }
    const t0 = performance.now();
    const dictEngine = engine.getDictionaryEngine();
    let results: WordEntity[] = [];

    if (dictMode === 'exact') {
      const exact = dictEngine.searchExact(dictQuery);
      if (exact) results = [exact];
    } else if (dictMode === 'prefix') {
      results = dictEngine.searchPrefix(dictQuery, 12);
    } else if (dictMode === 'lemma') {
      const lem = dictEngine.searchLemma(dictQuery);
      if (lem) results = [lem];
    } else if (dictMode === 'fuzzy') {
      results = dictEngine.searchFuzzy(dictQuery, 2);
    }
    const t1 = performance.now();
    setDictLookupLatency(Math.round((t1 - t0) * 100) / 100);
    setDictResults(results);
  }, [dictQuery, dictMode]);

  // Calculate Daily Stats (Requirement 1)
  const fsrsEngine = engine.getPureFsrsEngine();
  const stateMap = new Map<string, UserLearningStateEntity>(learningStates.map((s) => [s.wordId, s]));

  const dueCards = words.filter((w) => {
    const st = stateMap.get(w.id);
    return !st || fsrsEngine.isCardDue(st.cardMemoryState);
  });

  const newCards = words.filter((w) => {
    const st = stateMap.get(w.id);
    return !st || st.cardMemoryState.reviewCount === 0;
  });

  const forgottenCards = words.filter((w) => {
    const st = stateMap.get(w.id);
    return st && st.cardMemoryState.lapseCount > 0;
  });

  const weakCards = words.filter((w) => {
    const st = stateMap.get(w.id);
    return st && st.cardMemoryState.difficulty >= 6.0;
  });

  const estimatedMinutes = Math.max(5, Math.ceil((dueCards.length * 40) / 60));

  // Prepare FSRS Review Queue (Requirement 2)
  const startReviewSession = () => {
    const queue = dueCards.map((w) => {
      const st = stateMap.get(w.id) || {
        wordId: w.id,
        userId: 'usr_001',
        cardMemoryState: fsrsEngine.createInitialState(w.id),
        history: [],
      };
      return { word: w, state: st };
    });

    setReviewQueue(queue);
    setCurrentReviewIndex(0);
    setIsCardFlipped(false);
    setSessionCompleted(false);
    setSessionStartTime(Date.now());
    setReviewedWordsCount(0);
    setSessionCorrectCount(0);
    setSessionForgottenCount(0);
    setActiveTab('review');
  };

  const handleFsrsRating = (rating: FsrsRating) => {
    if (reviewQueue.length === 0) return;
    const currentItem = reviewQueue[currentReviewIndex];

    engine.processFsrsReview(currentItem.word.id, rating, 1200);

    setReviewedWordsCount((prev) => prev + 1);
    if (rating === 'AGAIN') {
      setSessionForgottenCount((prev) => prev + 1);
    } else {
      setSessionCorrectCount((prev) => prev + 1);
    }

    if (currentReviewIndex + 1 < reviewQueue.length) {
      setCurrentReviewIndex(currentReviewIndex + 1);
      setIsCardFlipped(false);
    } else {
      const durationSeconds = Math.round((Date.now() - sessionStartTime) / 1000);
      engine.recordLearningSession({
        sessionId: `sess_${Date.now()}`,
        date: new Date().toISOString(),
        durationSeconds,
        wordsReviewed: reviewQueue.map((i) => i.word.text),
        correctAnswersCount: sessionCorrectCount + (rating !== 'AGAIN' ? 1 : 0),
        forgottenWordsCount: sessionForgottenCount + (rating === 'AGAIN' ? 1 : 0),
        newWordsAddedCount: 0,
        aiPracticeActivity: 'FSRS 4.5 Memory Review Session',
        userMistakes: [],
      });

      setSessionCompleted(true);
      showToast('جلسه مرور FSRS به پایان رسید!');
    }
    refreshEngineData();
  };

  // Add / Save Word
  const handleSaveWord = () => {
    if (!formText.trim()) return;

    if (editingWord) {
      const updated: WordEntity = {
        ...editingWord,
        text: formText,
        meanings: [
          {
            partOfSpeech: formPos,
            translation: formTranslation,
            definitionEn: formExample || editingWord.meanings[0]?.definitionEn || '',
          },
        ],
        examples: formExample ? [formExample] : editingWord.examples,
        domainCategory: formDomain,
      };
      engine.updateWord(updated);
      showToast(`واژه "${formText}" به‌روزرسانی شد`);
    } else {
      const newWord: WordEntity = {
        id: `w_${Date.now()}`,
        text: formText,
        languageCode: 'en-US',
        phonetic: { ipa: `/${formText.toLowerCase()}/` },
        meanings: [{ partOfSpeech: formPos, translation: formTranslation, definitionEn: formExample }],
        examples: formExample ? [formExample] : [],
        domainTag: formDomain,
        domainCategory: formDomain,
        difficultyLevel: 3,
        createdAt: new Date().toISOString(),
      };
      engine.addWord(newWord);
      showToast(`واژه "${formText}" با موفقیت اضافه شد`);
    }

    setIsAddWordOpen(false);
    setEditingWord(null);
    setFormText('');
    setFormTranslation('');
    setFormExample('');
    refreshEngineData();
  };

  const handleDeleteWord = (id: string, text: string) => {
    engine.deleteWord(id);
    showToast(`واژه "${text}" حذف شد`);
    refreshEngineData();
  };

  // Generate AI Practice Prompt
  const handleGenerateAiPrompt = () => {
    const targetWords = (weakCards.length > 0 ? weakCards : words).slice(0, 5).map((w) => w.text);
    const prompt = `I am practicing my English vocabulary using ATHENA FSRS Smart Dictionary. Please write a natural 3-paragraph context story using these key vocabulary words: [${targetWords.join(
      ', '
    )}]. Make sure each word is highlighted in bold. After the story, list 3 comprehension questions to test my understanding.`;

    setAiPracticePrompt(prompt);
  };

  const handleCopyPrompt = () => {
    if (!aiPracticePrompt) return;
    navigator.clipboard.writeText(aiPracticePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
    showToast('پرامپت تمرین کپی شد');
  };

  const handleAnalyzeAiResponse = () => {
    if (!aiResponseInput.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const aiEngine = engine.getAiTutorEngine();
      const analysis = aiEngine.analyzeResponseText(aiResponseInput);

      const items = analysis.extractedVocab.map((v) => ({
        word: v.word,
        meaning: v.persianTranslation || v.contextDefinition || 'واژه استخراج‌شده از تمرین',
        pos: v.partOfSpeech || 'noun',
      }));

      setExtractedVocab(items);
      setIsAnalyzing(false);
      showToast(`${items.length} واژه کلیدی استخراج گردید`);
    }, 500);
  };

  // Filtered Vocabulary Bank
  const filteredWords = words.filter((w) => {
    const matchesQuery =
      w.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meanings.some((m) => m.translation.includes(searchQuery));

    const matchesDomain = selectedDomain === 'ALL' || w.domainCategory === selectedDomain;

    const matchesCefr = selectedCefrFilter === 'ALL' || w.cefrLevel === selectedCefrFilter;

    let matchesState = true;
    if (selectedStateFilter !== 'ALL') {
      const st = stateMap.get(w.id);
      const vocabState = st ? fsrsEngine.calculateVocabularyState(st.cardMemoryState) : 'New';
      matchesState = vocabState === selectedStateFilter;
    }

    return matchesQuery && matchesDomain && matchesCefr && matchesState;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-start antialiased selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl border border-indigo-400/40 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Main Production Frame */}
      <div className="w-full max-w-2xl bg-slate-950 min-h-screen flex flex-col shadow-2xl border-x border-slate-900">
        {/* Commercial App Bar Header */}
        <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur border-b border-slate-850 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                ATHENA
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-500/30">
                  SMART DICTIONARY v1.0
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>۵ روز زنجیره</span>
            </div>
            <div className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full text-[11px] font-bold text-indigo-300">
              <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
              <span>{words.length} واژه</span>
            </div>
          </div>
        </header>

        {/* Tab Navigation Content */}
        <main className="flex-1 p-4 pb-24 overflow-y-auto">
          {/* TAB 1: HOME - DAILY LEARNING DASHBOARD */}
          {activeTab === 'home' && (
            <div className="space-y-4 dir-rtl">
              {/* Today Review Summary Header Card */}
              <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-indigo-300 block">برنامه یادگیری امروز (ATHENA Today)</span>
                    <h2 className="text-lg font-black text-white mt-0.5">آماده مرور و تقویت حافظه FSRS</h2>
                  </div>
                  <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold rounded-full">
                    ~{estimatedMinutes} دقیقه
                  </span>
                </div>

                {/* Grid Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="bg-slate-950/80 border border-indigo-900/50 p-3 rounded-2xl space-y-1">
                    <span className="text-xl font-black text-indigo-400 block">{dueCards.length}</span>
                    <span className="text-[11px] font-bold text-slate-300">نیازمند مرور</span>
                  </div>

                  <div className="bg-slate-950/80 border border-emerald-900/50 p-3 rounded-2xl space-y-1">
                    <span className="text-xl font-black text-emerald-400 block">{newCards.length}</span>
                    <span className="text-[11px] font-bold text-slate-300">واژگان جدید</span>
                  </div>

                  <div className="bg-slate-950/80 border border-rose-900/50 p-3 rounded-2xl space-y-1">
                    <span className="text-xl font-black text-rose-400 block">{forgottenCards.length}</span>
                    <span className="text-[11px] font-bold text-slate-300">فراموش‌شده</span>
                  </div>

                  <div className="bg-slate-950/80 border border-amber-900/50 p-3 rounded-2xl space-y-1">
                    <span className="text-xl font-black text-amber-400 block">{weakCards.length}</span>
                    <span className="text-[11px] font-bold text-slate-300">واژگان دشوار</span>
                  </div>
                </div>

                {/* Primary CTA */}
                <button
                  onClick={startReviewSession}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>شروع جلسه یادگیری امروز (Start Session)</span>
                </button>
              </div>

              {/* Memory Health Distribution */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  توزیع پایداری حافظه FSRS (Memory Retention Curve)
                </h3>

                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-purple-300">
                    <span className="block text-xs font-black">
                      {words.filter((w) => fsrsEngine.calculateVocabularyState(stateMap.get(w.id)?.cardMemoryState || fsrsEngine.createInitialState(w.id)) === 'Mastered').length}
                    </span>
                    <span>مسلط (90d+)</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-emerald-300">
                    <span className="block text-xs font-black">
                      {words.filter((w) => fsrsEngine.calculateVocabularyState(stateMap.get(w.id)?.cardMemoryState || fsrsEngine.createInitialState(w.id)) === 'Mature').length}
                    </span>
                    <span>تثبیت‌شده</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-indigo-300">
                    <span className="block text-xs font-black">
                      {words.filter((w) => fsrsEngine.calculateVocabularyState(stateMap.get(w.id)?.cardMemoryState || fsrsEngine.createInitialState(w.id)) === 'Young Memory').length}
                    </span>
                    <span>حافظه فعال</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-amber-300">
                    <span className="block text-xs font-black">
                      {words.filter((w) => fsrsEngine.calculateVocabularyState(stateMap.get(w.id)?.cardMemoryState || fsrsEngine.createInitialState(w.id)) === 'Learning').length}
                    </span>
                    <span>در حال یادگیری</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-slate-400">
                    <span className="block text-xs font-black">{newCards.length}</span>
                    <span>جدید</span>
                  </div>
                </div>
              </div>

              {/* Session History Log */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  تاریخچه جلسات یادگیری (Learning Session History)
                </h3>

                {sessionHistory.length === 0 ? (
                  <p className="text-[11px] text-slate-500 text-center py-2">هنوز هیچ جلسه‌ای ثبت نشده است.</p>
                ) : (
                  <div className="space-y-2">
                    {sessionHistory.slice(0, 3).map((sess) => (
                      <div key={sess.sessionId} className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-200 block">{sess.aiPracticeActivity || 'جلسه مرور FSRS'}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(sess.date).toLocaleDateString('fa-IR')} • {Math.round(sess.durationSeconds / 60)} دقیقه
                          </span>
                        </div>
                        <div className="text-left font-mono">
                          <span className="text-emerald-400 font-bold">{sess.correctAnswersCount} صحیح</span>
                          <span className="text-slate-500 mx-1">/</span>
                          <span className="text-rose-400">{sess.forgottenWordsCount} خطا</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VOCABULARY BANK */}
          {activeTab === 'vocab' && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="جستجوی واژه یا ترجمه در دیتابیس..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition dir-rtl"
                />
              </div>

              {/* State & Domain Filters */}
              <div className="flex flex-col gap-2 dir-rtl">
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] text-slate-500 whitespace-nowrap ml-1">وضعیت:</span>
                  {['ALL', 'New', 'Learning', 'Young Memory', 'Mature', 'Mastered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStateFilter(st)}
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition whitespace-nowrap ${
                        selectedStateFilter === st
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {st === 'ALL' ? 'همه وضعیت‌ها' : st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
                  <div className="flex items-center gap-1 text-xs">
                    {['ALL', 'Academic', 'Tech', 'Business', 'Everyday'].map((domain) => (
                      <button
                        key={domain}
                        onClick={() => setSelectedDomain(domain)}
                        className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition whitespace-nowrap ${
                          selectedDomain === domain
                            ? 'bg-purple-600 text-white border-purple-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {domain === 'ALL' ? 'همه دسته‌ها' : domain}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsImportModalOpen(true)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition whitespace-nowrap"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-400" />
                      <span>ایمپورت</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingWord(null);
                        setFormText('');
                        setFormTranslation('');
                        setFormExample('');
                        setIsAddWordOpen(true);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Words List */}
              <div className="space-y-2">
                {filteredWords.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-2 dir-rtl">
                    <Search className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold">هیچ واژه‌ای یافت نشد.</p>
                  </div>
                ) : (
                  filteredWords.map((w) => {
                    const st = stateMap.get(w.id);
                    const vocabState = st ? fsrsEngine.calculateVocabularyState(st.cardMemoryState) : 'New';

                    return (
                      <div
                        key={w.id}
                        onClick={() => setPopupWordText(w.text)}
                        className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-3 rounded-2xl flex items-center justify-between cursor-pointer transition shadow-sm group"
                      >
                        <div className="space-y-1 text-left dir-ltr">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-base group-hover:text-indigo-300 transition">
                              {w.text}
                            </span>
                            {w.phoneticIpa && (
                              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900/40">
                                {w.phoneticIpa}
                              </span>
                            )}
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                vocabState === 'Mastered'
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                  : vocabState === 'Mature'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : vocabState === 'Young Memory'
                                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                  : vocabState === 'Learning'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}
                            >
                              {vocabState}
                            </span>
                          </div>

                          <p className="text-xs font-bold text-emerald-400 dir-rtl text-right">
                            {w.meanings[0]?.translation || 'بدون ترجمه'}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              engine.speakWord(w.text);
                            }}
                            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-xl transition"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingWord(w);
                              setFormText(w.text);
                              setFormTranslation(w.meanings[0]?.translation || '');
                              setFormExample(w.examples[0] || '');
                              setFormPos(w.meanings[0]?.partOfSpeech || 'noun');
                              setIsAddWordOpen(true);
                            }}
                            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-xl transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWord(w.id, w.text);
                            }}
                            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-xl transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REVIEW - FSRS 4.5 SESSION */}
          {activeTab === 'review' && (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between dir-rtl">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h2 className="text-xs font-bold text-white">جلسه مرور الگوریتمی FSRS 4.5</h2>
                    <p className="text-[10px] text-slate-400">محاسبه دقیق فواصل زمانی پایداری حافظه (Stability)</p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {currentReviewIndex + 1} / {reviewQueue.length || 1}
                </span>
              </div>

              {sessionCompleted ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 dir-rtl">
                  <Award className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-base font-black text-white">جلسه مرور FSRS به پایان رسید!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    پایداری حافظه کارت‌ها طبق پارامترهای FSRS به‌روزرسانی شد.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={startReviewSession}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      مرور مجدد
                    </button>
                    <button
                      onClick={() => setActiveTab('ai_practice')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      تمرین با AI Tutor
                    </button>
                  </div>
                </div>
              ) : reviewQueue.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs dir-rtl space-y-3">
                  <p>در حال حاضر هیچ کارتی در صف مرور امروز قرار ندارد.</p>
                  <button
                    onClick={startReviewSession}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    شروع جلسه کلی
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Flashcard Component */}
                  <div
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="bg-slate-900 border-2 border-indigo-500/40 hover:border-indigo-500/80 rounded-3xl p-8 text-center min-h-[260px] flex flex-col items-center justify-center cursor-pointer transition shadow-2xl relative"
                  >
                    {!isCardFlipped ? (
                      <div className="space-y-3">
                        <span className="text-3xl font-black text-white tracking-tight block">
                          {reviewQueue[currentReviewIndex]?.word.text}
                        </span>
                        {reviewQueue[currentReviewIndex]?.word.phoneticIpa && (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-sm font-mono text-indigo-400 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-800/40 inline-block">
                              {reviewQueue[currentReviewIndex]?.word.phoneticIpa}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                engine.speakWord(reviewQueue[currentReviewIndex].word.text);
                              }}
                              className="p-1.5 bg-indigo-600 text-white rounded-full"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        <p className="text-xs text-slate-500 mt-6 font-medium dir-rtl">
                          (برای مشاهده ترجمه و مثال ضربه بزنید)
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 dir-rtl">
                        <span className="text-2xl font-black text-emerald-400 block">
                          {reviewQueue[currentReviewIndex]?.word.meanings[0]?.translation}
                        </span>
                        {reviewQueue[currentReviewIndex]?.word.meanings[0]?.definitionEn && (
                          <p className="text-xs text-slate-300 dir-ltr text-center">
                            <TappableWordText text={reviewQueue[currentReviewIndex].word.meanings[0].definitionEn} />
                          </p>
                        )}
                        {reviewQueue[currentReviewIndex]?.word.examples[0] && (
                          <p className="text-xs text-indigo-200 italic bg-indigo-950/50 p-3 rounded-xl border border-indigo-900/40 dir-ltr text-center">
                            "<TappableWordText text={reviewQueue[currentReviewIndex].word.examples[0]} />"
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Rating Buttons */}
                  {isCardFlipped && (
                    <div className="grid grid-cols-4 gap-2 text-center dir-ltr">
                      <button
                        onClick={() => handleFsrsRating('AGAIN')}
                        className="py-3 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 font-bold text-xs hover:bg-rose-900 transition flex flex-col items-center gap-0.5"
                      >
                        <span className="text-[10px] opacity-75">فراموش شد</span>
                        <span>AGAIN</span>
                      </button>
                      <button
                        onClick={() => handleFsrsRating('HARD')}
                        className="py-3 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-300 font-bold text-xs hover:bg-amber-900 transition flex flex-col items-center gap-0.5"
                      >
                        <span className="text-[10px] opacity-75">دشوار</span>
                        <span>HARD</span>
                      </button>
                      <button
                        onClick={() => handleFsrsRating('GOOD')}
                        className="py-3 rounded-2xl bg-indigo-950/80 border border-indigo-800 text-indigo-300 font-bold text-xs hover:bg-indigo-900 transition flex flex-col items-center gap-0.5"
                      >
                        <span className="text-[10px] opacity-75">مناسب</span>
                        <span>GOOD</span>
                      </button>
                      <button
                        onClick={() => handleFsrsRating('EASY')}
                        className="py-3 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold text-xs hover:bg-emerald-900 transition flex flex-col items-center gap-0.5"
                      >
                        <span className="text-[10px] opacity-75">آسان</span>
                        <span>EASY</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DICTIONARY - OFFLINE INSTANT LOOKUP */}
          {activeTab === 'dictionary' && (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 dir-rtl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-xs font-bold text-white">موتور جستجوی دیکشنری آفلاین (SQLite Engine)</h2>
                  </div>
                  {dictLookupLatency > 0 && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {dictLookupLatency}ms latency
                    </span>
                  )}
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="عبارت انگلیسی یا ریشه کلمه را وارد کنید..."
                  value={dictQuery}
                  onChange={(e) => setDictQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 dir-ltr text-left"
                />

                {/* Search Modes */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] text-slate-500">حالت:</span>
                  {[
                    { id: 'exact', label: 'تطابق دقیق' },
                    { id: 'prefix', label: 'پیشوند (Prefix)' },
                    { id: 'lemma', label: 'ریشه‌یابی (Lemma)' },
                    { id: 'fuzzy', label: 'تطابق تقریبی (Fuzzy)' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setDictMode(m.id as any)}
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition ${
                        dictMode === m.id
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results List */}
              <div className="space-y-2">
                {dictResults.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => setPopupWordText(w.text)}
                    className="bg-slate-900 hover:bg-slate-850 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition"
                  >
                    <div className="space-y-1 text-left dir-ltr">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{w.text}</span>
                        {w.phoneticIpa && <span className="text-xs font-mono text-indigo-400">{w.phoneticIpa}</span>}
                      </div>
                      <p className="text-xs text-emerald-400 dir-rtl text-right">
                        {w.meanings[0]?.translation || 'ترجمه فارسی ثبت نشده'}
                      </p>
                    </div>
                    <span className="text-xs text-indigo-400 font-bold dir-rtl">مشاهده جزئیات ←</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AI PRACTICE & CONVERSATION EXTRACTOR */}
          {activeTab === 'ai_practice' && (
            <div className="space-y-4 dir-rtl">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xs font-bold text-white">تمرین هوشمند با AI Tutor (Manual Prompt & Extract)</h2>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  پرامپت اختصاصی جهت تمرین لغات دشوار خود تولید کنید و پس از گفتگو با ChatGPT یا Gemini، متن پاسخ را جهت استخراج واژگان قرار دهید.
                </p>

                <button
                  onClick={handleGenerateAiPrompt}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>تولید پرامپت بر اساس واژگان هدف امروز</span>
                </button>

                {aiPracticePrompt && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs dir-ltr text-left">
                    <p className="text-slate-300 font-mono text-[11px] leading-relaxed">{aiPracticePrompt}</p>
                    <button
                      onClick={handleCopyPrompt}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPrompt ? 'کپی شد!' : 'کپی پرامپت'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Paste & Analyze AI Response */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold text-white">قرار دادن پاسخ هوش مصنوعی و استخراج واژگان:</h3>
                <textarea
                  rows={4}
                  value={aiResponseInput}
                  onChange={(e) => setAiResponseInput(e.target.value)}
                  placeholder="متن گفتگو با AI را اینجا پیست کنید..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 dir-ltr text-left"
                />

                <button
                  onClick={handleAnalyzeAiResponse}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                >
                  <span>{isAnalyzing ? 'در حال تحلیل...' : 'تحلیل و استخراج واژگان به FSRS'}</span>
                </button>

                {extractedVocab.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-emerald-400 block">واژگان استخراج‌شده:</span>
                    {extractedVocab.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-bold text-white dir-ltr">{item.word}</span>
                        <span className="text-slate-400">{item.meaning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsScreen onSettingsChange={refreshEngineData} showToast={showToast} />
          )}
        </main>

        {/* Commercial Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-slate-950/95 backdrop-blur border-t border-slate-850 px-2 py-2 grid grid-cols-6 gap-1 z-30 dir-rtl text-center text-[10px]">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${
              activeTab === 'home' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>خانه</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${
              activeTab === 'vocab' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>واژگان</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${
              activeTab === 'review' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCcw className="w-4 h-4 mb-0.5" />
            <span>مرور</span>
          </button>

          <button
            onClick={() => setActiveTab('dictionary')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${
              activeTab === 'dictionary' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4 mb-0.5" />
            <span>دیکشنری</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_practice')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${
              activeTab === 'ai_practice' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span>تمرین AI</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${
              activeTab === 'settings' ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 mb-0.5" />
            <span>تنظیمات</span>
          </button>
        </nav>
      </div>

      {/* Universal Dictionary Popup Bottom Sheet Modal */}
      <DictionaryPopup
        wordText={popupWordText}
        onClose={() => setPopupWordText(null)}
        onOpenFullEntry={(w) => {
          setDictQuery(w);
          setActiveTab('dictionary');
        }}
        onWordTapChain={(newWord) => setPopupWordText(newWord)}
      />

      {/* MODAL: Add / Edit Word */}
      {isAddWordOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md w-full space-y-4 dir-rtl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              {editingWord ? 'ویرایش واژه دیکشنری' : 'افزودن واژه جدید'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">کلمه انگلیسی:</label>
                <input
                  type="text"
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white dir-ltr text-left"
                  placeholder="e.g. Resilience"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">ترجمه فارسی:</label>
                <input
                  type="text"
                  value={formTranslation}
                  onChange={(e) => setFormTranslation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  placeholder="مثلا: تاب‌آوری"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">جمله نمونه:</label>
                <input
                  type="text"
                  value={formExample}
                  onChange={(e) => setFormExample(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white dir-ltr text-left"
                  placeholder="e.g. She showed resilience under pressure."
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsAddWordOpen(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveWord}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
              >
                ذخیره واژه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Engine Modal */}
      <ImportEngineModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={(count) => {
          showToast(`${count} واژه با موفقیت به FSRS منتقل شدند`);
          refreshEngineData();
        }}
      />
    </div>
  );
};

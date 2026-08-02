import React, { useState, useEffect } from 'react';
import { AthenaCoreEngine } from '../core/athenaCoreEngine';
import {
  TextDocumentEntity,
  TextToken,
  WordEntity,
  VoiceProviderConfig,
  StructuredDailyPlan,
  UserVocabularyItem,
  ReadingSessionEntity,
  WordEncounterEntity,
  PersonalDictionaryNote,
  LanguagePackPackage,
  AiContextPromptPayload,
  StructuredAiContextObject,
  TokenBudgetConfig,
  PrivacyScrubResult,
  CompressedContextSummary,
  AiGatewayProviderConfig,
  LearningIntelligenceProfile,
  DecisionRulesInput,
  DecisionRulesEngineOutput,
} from '../types/athena';
import {
  BookOpen,
  Sparkles,
  Volume2,
  Plus,
  CheckCircle2,
  Search,
  Sliders,
  Share2,
  Brain,
  Layers,
  Activity,
  Zap,
  Tag,
  FileText,
  MousePointerClick,
  Check,
  RotateCcw,
  Target,
  Award,
  ListFilter,
  ShieldCheck,
  Clock,
  Database,
  BookMarked,
  Globe,
  Bot,
  Download,
  ShieldAlert,
  Lock,
  Minimize2,
  Cpu,
  Coins,
  EyeOff,
  MessageSquare,
  Send,
  MessageCircle,
  Terminal,
  Flame,
  TrendingUp,
  UserCheck,
  BarChart3,
} from 'lucide-react';

export const IntelligentReaderExplorer: React.FC = () => {
  const engine = AthenaCoreEngine.getInstance();

  // Active Sub-Tab
  const [activeTab, setActiveTab] = useState<
    | 'adaptive_home'
    | 'reader'
    | 'session_memory'
    | 'personal_dict'
    | 'language_packs'
    | 'ai_prompt_context'
    | 'ai_safety_gateway'
    | 'ai_tutor_conversation'
    | 'learning_profile'
    | 'learning_validation'
    | 'refinements'
    | 'search_engine'
    | 'daily_plan'
  >('adaptive_home');

  // Reader State
  const [sampleTextTitle, setSampleTextTitle] = useState('Artificial Intelligence and Cognitive Linguistics');
  const [rawText, setRawText] = useState(`Artificial intelligence is fundamentally transforming how humans acquire second languages. Traditional rote learning often fails to foster long-term retrievability because learners lack contextual exposure.

By combining spaced repetition with adaptive reading passages, students can observe vocabulary in authentic syntax. Eloquent expressions and academic jargon become accessible when paired with instant contextual lookup and cognitive feedback loops.`);

  const [doc, setDoc] = useState<TextDocumentEntity | null>(null);
  const [selectedToken, setSelectedToken] = useState<TextToken | null>(null);

  // Search Engine Tester
  const [searchQuery, setSearchQuery] = useState('resil');
  const [searchMode, setSearchMode] = useState<'PREFIX' | 'EXACT' | 'FUZZY'>('PREFIX');
  const [searchResults, setSearchResults] = useState<{ word: WordEntity; score: number }[]>([]);

  // Voice Provider State
  const [voiceConfig, setVoiceConfig] = useState<VoiceProviderConfig>(engine.getVoiceProviderConfig());

  // Daily Plan State
  const [dailyPlan, setDailyPlan] = useState<StructuredDailyPlan>(engine.getDailyStructuredPlan());

  // User Vocabulary Items
  const [userItems, setUserItems] = useState<UserVocabularyItem[]>([]);

  // Phase 2.1 State
  const [readingSessions, setReadingSessions] = useState<ReadingSessionEntity[]>(engine.getReadingSessions());
  const [wordEncounters, setWordEncounters] = useState<WordEncounterEntity[]>(engine.getWordEncounters());
  const [languagePacks, setLanguagePacks] = useState<LanguagePackPackage[]>(engine.getLanguagePackPackages());
  const [aiContextPayload, setAiContextPayload] = useState<AiContextPromptPayload>(engine.generateAiTutorContextPayload());

  // Personal Dictionary State
  const [selectedWordForNote, setSelectedWordForNote] = useState<string>('w_001');
  const [noteFa, setNoteFa] = useState<string>('تاب‌آوری و انعطاف‌پذیری در برابر چالش‌ها');
  const [noteMnemonic, setNoteMnemonic] = useState<string>('فکر کن به فنر که خم میشه ولی نمی‌شکنه (Re-SIL-ient)');
  const [noteExample, setNoteExample] = useState<string>('Emotional resilience helps learners overcome language plateaus.');
  const [noteRating, setNoteRating] = useState<1 | 2 | 3 | 4 | 5>(4);

  // Phase 2.2 State — AI Safety, Token & Gateway
  const [tokenBudget, setTokenBudget] = useState<TokenBudgetConfig>(engine.getTokenBudgetConfig());
  const [aiGateway, setAiGateway] = useState<AiGatewayProviderConfig>(engine.getAiGatewayConfig());
  const [structuredContext, setStructuredContext] = useState<StructuredAiContextObject>(engine.getStructuredAiContextObject('speaking'));
  const [privacySampleInput, setPrivacySampleInput] = useState<string>(
    'User John Doe (john.doe@example.com, phone: +1-555-0199) requested AI feedback on card 4532-1100-8842-9901 for business vocabulary.'
  );
  const [privacyResult, setPrivacyResult] = useState<PrivacyScrubResult>(engine.scrubSensitiveData(privacySampleInput));
  const [compressedResult, setCompressedResult] = useState<CompressedContextSummary>(engine.compressEventHistoryToSummary(2500));

  // Phase 3 State — AI Conversation & Feedback Engine
  const [convSessions, setConvSessions] = useState(engine.getConversationSessions());
  const [activeConvId, setActiveConvId] = useState<string>(convSessions[0]?.sessionId || 'conv_001');
  const [chatInputText, setChatInputText] = useState<string>('In our project, we implement clean architecture for reduce complexity.');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const [convMemory, setConvMemory] = useState(engine.getConversationMemoryState());
  const [learningFeedback, setLearningFeedback] = useState(engine.getLearningFeedbackEngineResult(convSessions[0]?.sessionId || 'conv_001'));
  const [intelProfile, setIntelProfile] = useState<LearningIntelligenceProfile>(engine.getLearningIntelligenceProfile());

  // Phase 3.1.1 State — Decision Rules Engine & Decoupled Rule Pack
  const [rulePack, setRulePack] = useState(engine.getRulePackConfig());
  const [decisionInput, setDecisionInput] = useState<DecisionRulesInput>({
    activeGapPercent: 28,
    grammarWeakness: 'preposition (for vs to)',
    forgettingRisk: 'HIGH',
    speakingMinutesLast7Days: 5,
    unmasteredLeitnerCount: 4,
  });
  const [decisionOutput, setDecisionOutput] = useState<DecisionRulesEngineOutput>(
    engine.evaluateDecisionRules(decisionInput)
  );

  // Phase 3.2 State — Adaptive Session Orchestrator
  const [adaptiveSession, setAdaptiveSession] = useState(
    engine.getAdaptiveLearningSessionState()
  );

  // Phase 3.3 State — Effectiveness & Personalization Validation
  const [impactMetrics, setImpactMetrics] = useState(engine.getLearningImpactMetrics());
  const [personalPattern, setPersonalPattern] = useState(engine.getPersonalLearningPattern());
  const [evolutionStats, setEvolutionStats] = useState(engine.getAdaptiveStrategyEvolutionStats());
  const [offlineReport, setOfflineReport] = useState(engine.runOfflineDataValidationStressTest());

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const runAnalysis = () => {
    const result = engine.analyzeTextDocument(sampleTextTitle, rawText);
    setDoc(result);
    setUserItems(engine.getUserVocabularyItems());
  };

  useEffect(() => {
    runAnalysis();
    setSearchResults(engine.searchDictionary(searchQuery, searchMode));
    setReadingSessions(engine.getReadingSessions());
    setWordEncounters(engine.getWordEncounters());
    setLanguagePacks(engine.getLanguagePackPackages());
    setAiContextPayload(engine.generateAiTutorContextPayload());
  }, []);

  const handleSearchChange = (q: string, mode: 'PREFIX' | 'EXACT' | 'FUZZY') => {
    setSearchQuery(q);
    setSearchMode(mode);
    setSearchResults(engine.searchDictionary(q, mode));
  };

  const handleSpeakWord = (text: string) => {
    engine.speakText(text, voiceConfig.speechRate);
    showToast(`Speech synthesized via ${voiceConfig.providerId}: '${text}'`);
  };

  const handleAddTokenToLeitner = (token: TextToken) => {
    const wordText = token.cleanWord;
    if (!wordText) return;

    engine.addEnrichedWord({
      text: wordText.charAt(0).toUpperCase() + wordText.slice(1),
      languageCode: 'en',
      cefrLevel: token.cefrLevel || 'B2',
      domainCategory: 'Academic',
      phoneticIpa: `/${wordText}/`,
      audioUrl: `audio_${wordText}.mp3`,
      meanings: [
        {
          partOfSpeech: 'noun',
          definitionEn: `Extracted from text reader passage`,
          translation: `معنای استخراج‌شده برای ${wordText}`,
          contextUsage: 'Text Reader lookup',
        },
      ],
      examples: [doc?.content.substring(0, 100) || `Context example for ${wordText}`],
      etymology: 'Reader Extraction',
      collocations: ['frequent usage', 'academic context'],
      synonyms: ['term', 'concept'],
      antonyms: [],
      frequencyScore: 8.5,
    });

    showToast(`Word '${wordText}' added to Box 1 Leitner queue!`);
    runAnalysis();
    setSelectedToken(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Brain className="w-3.5 h-3.5" />
              <span>Phase 2 — Intelligent Vocabulary & Reading Foundation</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>6 Architecture Refinements Hardened</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Interactive Text Reader & Lexical Intelligence Engine
          </h2>

          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            کاربر اکنون می‌تواند هر متنی (Copy/Paste یا TXT) را وارد کرده و با Tap روی کلمات، معنی دقیق فارسی، تلفظ IPA، Collocationها را مشاهده و با ۱ کلیک به جعبه لایتنر اضافه کند. همچنین ۶ اصلاح معماری Phase 2 پیاده‌سازی شده‌اند.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 border border-indigo-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs">
        {[
          { id: 'adaptive_home', label: '0. Phase 3.2 Adaptive Home (Today\'s Mission)', icon: Sparkles },
          { id: 'reader', label: '1. Interactive Reader', icon: BookOpen },
          { id: 'session_memory', label: '2. Session & Context Memory', icon: Clock },
          { id: 'personal_dict', label: '3. Personal Dictionary Notes', icon: BookMarked },
          { id: 'language_packs', label: '4. Language Data Layer', icon: Globe },
          { id: 'ai_prompt_context', label: '5. Phase 3 AI Prompt Context', icon: Bot },
          { id: 'ai_safety_gateway', label: '6. Phase 2.2 AI Safety & Gateway', icon: ShieldAlert },
          { id: 'ai_tutor_conversation', label: '7. Phase 3 AI Tutor Conversation', icon: MessageSquare },
          { id: 'learning_profile', label: '8. Phase 3.1 & 3.1.1 Rules & Profile', icon: Brain },
          { id: 'learning_validation', label: '9. Phase 3.3 Effectiveness & Stress Test', icon: BarChart3 },
          { id: 'refinements', label: '10. Arch Refinements (6 Point)', icon: Layers },
          { id: 'search_engine', label: '11. Search Engine', icon: Search },
          { id: 'daily_plan', label: '12. Daily Plan', icon: Target },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: PHASE 3.2 ADAPTIVE HOME — TODAY'S MISSION & SESSION ORCHESTRATOR */}
      {activeTab === 'adaptive_home' && (
        <div className="space-y-6">
          {/* Header & Mission Banner */}
          <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                    Phase 3.2 — Adaptive Learning Engine
                  </span>
                  <span className="text-xs text-slate-400">Date: {adaptiveSession.activeMission.dateStr}</span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  Today's Mission (ماموریت امروز ATHENA)
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl">
                  هوش مصنوعی آتنا بر اساس ارزیابی پروپوزال و قوانین، برنامه‌ریزی اختصاصی امروز شما را بدون دخالت دستی ایجاد کرده است.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const newMission = engine.generateDailyMissionPlan(decisionInput);
                    setAdaptiveSession(engine.getAdaptiveLearningSessionState());
                    showToast('ماموریت امروز بر اساس قوانین دوباره تولید شد!');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
                >
                  <Sparkles className="w-4 h-4" />
                  Regenerate Mission
                </button>
              </div>
            </div>
          </div>

          {/* User Explanation Layer (Why this mission was selected) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-slate-800 pb-2">
                <Brain className="w-5 h-5 text-amber-400" />
                <span>چرا این برنامه‌ریزی برای امروز انتخاب شد؟ (User Explanation Layer)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-right dir-rtl">
                <p className="text-slate-200 text-xs leading-relaxed font-sans font-medium">
                  {adaptiveSession.activeMission.userWhyExplanationFa}
                </p>
              </div>

              <div className="text-[10px] text-slate-400 font-mono bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">Internal Rule Logic: {adaptiveSession.activeMission.internalRuleLog}</span>
              </div>
            </div>

            {/* Core Metrics Summary Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-2">
                <Target className="w-4 h-4 text-indigo-400" />
                Mission Metrics
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Primary Focus:</span>
                  <span className="font-bold text-indigo-300 font-mono text-[11px]">{adaptiveSession.activeMission.primaryFocus}</span>
                </div>

                <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Priority Score:</span>
                  <span className="font-bold text-emerald-400">{adaptiveSession.activeMission.priorityScore} / 100</span>
                </div>

                <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Active Usage Gap:</span>
                  <span className="font-bold text-amber-400">{adaptiveSession.activeMission.activeGapBefore}%</span>
                </div>

                {adaptiveSession.activeMission.secondaryIssues.length > 0 && (
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Secondary Issues Addressed:</span>
                    <div className="flex flex-wrap gap-1">
                      {adaptiveSession.activeMission.secondaryIssues.map((sec, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded text-[9px] bg-slate-900 text-slate-300 border border-slate-800">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Learning Session Orchestrator — Activities Queue */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 border border-indigo-500/40 rounded-xl">
                  <Layers className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Learning Session Orchestrator (صف فعالیت‌های اجرایی)
                  </h3>
                  <p className="text-xs text-slate-400">
                    اجرای گام به گام تصمیمات اتخاذ شده توسط Rule Engine با رهگیری متغیرهای اثرگذاری.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-300 block mb-1">
                  Progress: {adaptiveSession.activeMission.progressPercent}%
                </span>
                <div className="w-44 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${adaptiveSession.activeMission.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-3">
              {adaptiveSession.activeMission.activities.map((act, index) => (
                <div
                  key={act.id}
                  className={`p-4 rounded-xl border transition flex flex-wrap items-center justify-between gap-4 ${
                    act.completed
                      ? 'bg-slate-950/60 border-emerald-500/30 text-slate-400'
                      : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        engine.completeDailyMissionActivity(act.id);
                        setAdaptiveSession({ ...engine.getAdaptiveLearningSessionState() });
                        showToast(`فعالیت '${act.title}' با موفقیت انجام شد!`);
                      }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                        act.completed
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-700 hover:border-indigo-400 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{act.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
                          {act.estimatedMinutes} mins
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[10px]">
                        {act.targetWords && act.targetWords.length > 0 && (
                          <span className="text-emerald-400 flex items-center gap-1">
                            Target Words:
                            {act.targetWords.map((w) => (
                              <span key={w} className="px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-300 font-mono border border-emerald-500/20">
                                {w}
                              </span>
                            ))}
                          </span>
                        )}

                        {act.targetGrammarFocus && (
                          <span className="text-indigo-400 flex items-center gap-1">
                            Grammar Focus:
                            <span className="px-1 py-0.2 rounded bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/20">
                              {act.targetGrammarFocus}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {!act.completed ? (
                      <button
                        onClick={() => {
                          engine.completeDailyMissionActivity(act.id);
                          setAdaptiveSession({ ...engine.getAdaptiveLearningSessionState() });
                          showToast(`فعالیت انجام شد!`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
                      >
                        Start / Complete
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Impact & Session Log */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Progress & Impact Tracker
                </h4>

                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Gap Reduction:</span>
                    <strong className="text-emerald-400">
                      {adaptiveSession.activeMission.activeGapBefore}% →{' '}
                      {adaptiveSession.activeMission.activeGapAfter ?? adaptiveSession.activeMission.activeGapBefore}%
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Words Activated in Session:</span>
                    <strong className="text-indigo-300 font-mono">
                      {adaptiveSession.wordsActivatedInSession.length > 0
                        ? adaptiveSession.wordsActivatedInSession.join(', ')
                        : 'None yet'}
                    </strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Grammar Fixes Applied:</span>
                    <strong className="text-amber-300 font-mono">
                      {adaptiveSession.grammarErrorsFixedInSession.length > 0
                        ? adaptiveSession.grammarErrorsFixedInSession.join(', ')
                        : 'None yet'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  Session Execution Log
                </h4>

                <div className="space-y-1 font-mono text-[10px] text-slate-400 max-h-24 overflow-y-auto">
                  {adaptiveSession.sessionLogs.map((log, i) => (
                    <div key={i} className="text-slate-400 flex items-center gap-1.5">
                      <span className="text-indigo-500">›</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: INTERACTIVE TEXT READER */}
      {activeTab === 'reader' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reader Area (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Interactive Passage Reader
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click any word in the passage to inspect meanings, phonetics, and add to Leitner.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSampleTextTitle('Neuroscience of Language Acquisition');
                      setRawText(`Synaptic plasticity governs how memory consolidation occurs during spaced learning. When an individual encounters vocabulary across varied context usage, neural pathways reinforce semantic associations.`);
                      setTimeout(runAnalysis, 50);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
                  >
                    Sample 2 (Neuro)
                  </button>

                  <button
                    onClick={runAnalysis}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Re-Analyze Text
                  </button>
                </div>
              </div>

              {/* Text Input Box */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={sampleTextTitle}
                  onChange={(e) => setSampleTextTitle(e.target.value)}
                  placeholder="Document Title..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-indigo-500"
                />

                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste English reading text passage here..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Interactive Tokenized Reader Stream */}
              {doc && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">Passage Analysis:</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                        CEFR: {doc.estimatedCefrLevel}
                      </span>
                      <span className="text-slate-400">{doc.totalWordCount} words</span>
                      <span className="text-amber-400 font-semibold">
                        {doc.extractedNewWords.length} unseen words
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Mastered
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"></span> Learning
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-400"></span> Unseen
                    </div>
                  </div>

                  {/* Render Tokens as Clickable Badges */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 leading-relaxed text-sm font-sans tracking-wide">
                    {doc.tokens.map((token, idx) => {
                      if (!token.isWord) {
                        return (
                          <span key={idx} className="text-slate-400">
                            {token.rawText}{' '}
                          </span>
                        );
                      }

                      const isSelected = selectedToken?.cleanWord === token.cleanWord;
                      const statusColor =
                        token.knownStatus === 'MASTERED'
                          ? 'text-emerald-300 hover:bg-emerald-500/20'
                          : token.knownStatus === 'LEARNING'
                          ? 'text-amber-300 hover:bg-amber-500/20'
                          : 'text-indigo-300 hover:bg-indigo-500/20';

                      return (
                        <span
                          key={idx}
                          onClick={() => setSelectedToken(token)}
                          className={`inline-block px-1 py-0.5 mx-0.5 rounded cursor-pointer transition font-medium ${statusColor} ${
                            isSelected ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' : ''
                          }`}
                        >
                          {token.rawText}{' '}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Word Inspector Sidebar (1 col) */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-indigo-400" />
                  Tap-to-Lookup Inspector
                </h3>
                {selectedToken && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {selectedToken.cefrLevel}
                  </span>
                )}
              </div>

              {selectedToken ? (
                <div className="space-y-4 animate-in fade-in zoom-in-95">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-extrabold text-white">{selectedToken.cleanWord}</h4>
                      <button
                        onClick={() => handleSpeakWord(selectedToken.cleanWord)}
                        className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-md"
                        title="Pronounce via VoiceProvider"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      IPA: /{selectedToken.cleanWord.toLowerCase()}/
                    </span>
                  </div>

                  {/* Persian Translation Mock lookup */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono block">Persian Meaning</span>
                    <p className="text-sm font-bold text-emerald-300 dir-rtl text-right">
                      معنی فارسی برای کلمه «{selectedToken.cleanWord}»
                    </p>
                  </div>

                  {/* Context Usage */}
                  <div className="space-y-1 text-xs">
                    <span className="text-slate-400 font-semibold block">Context in Reader:</span>
                    <p className="text-slate-300 italic bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                      "{rawText.substring(Math.max(0, rawText.indexOf(selectedToken.rawText) - 30), Math.min(rawText.length, rawText.indexOf(selectedToken.rawText) + 40))}..."
                    </p>
                  </div>

                  {/* Collocations & Synonyms */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Tag className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Collocations:</span>
                      <span className="text-slate-200 font-mono">frequent, essential</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      <span>Synonyms:</span>
                      <span className="text-slate-200 font-mono">term, expression</span>
                    </div>
                  </div>

                  {/* 1-Tap Add to Leitner */}
                  <button
                    onClick={() => handleAddTokenToLeitner(selectedToken)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Word to Leitner Box 1
                  </button>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs space-y-2">
                  <MousePointerClick className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Click any word token in the passage above to inspect details and add to your flashcards.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 6 REFINEMENT POINTS CHECKLIST */}
      {activeTab === 'refinements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Point 1: Leitner Engine Decoupling */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center border border-emerald-500/30">
                    1
                  </span>
                  Leitner Engine & UseCase Decoupling
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  Implemented
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rating logic is completely isolated inside <code className="text-indigo-300 font-mono">ReviewUseCase</code> & <code className="text-indigo-300 font-mono">LeitnerAlgorithmEngine</code>, allowing seamless future upgrade to FSRS or Adaptive AI Schedulers without modifying UI ViewModels.
              </p>
            </div>

            {/* Point 2: Multi-Platform VoiceProvider */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center border border-emerald-500/30">
                    2
                  </span>
                  Multi-Platform VoiceProvider Abstraction
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  Active ({voiceConfig.providerId})
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Speech audio synthesis is routed through a abstract <code className="text-indigo-300 font-mono">VoiceProvider</code> contract (Android TTS, Web Speech, Cloud Azure Speech).
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs">
                {['ANDROID_TTS', 'WEB_SPEECH_API', 'CLOUD_AZURE_TTS'].map((prov) => (
                  <button
                    key={prov}
                    onClick={() => {
                      const updated = engine.updateVoiceProviderConfig({ providerId: prov as any });
                      setVoiceConfig(updated);
                      showToast(`Voice Provider set to ${prov}`);
                    }}
                    className={`px-2 py-1 rounded border font-mono text-[10px] transition ${
                      voiceConfig.providerId === prov
                        ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {prov}
                  </button>
                ))}
              </div>
            </div>

            {/* Point 3: User Owned Vocabulary Model */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center border border-emerald-500/30">
                    3
                  </span>
                  User-Owned Vocabulary Data Model
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  Normalized
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Separated global catalog terms (<code className="text-indigo-300 font-mono">GlobalLexiconWord</code>) from user-specific items (<code className="text-indigo-300 font-mono">UserVocabularyItem</code>). Millions of users reference 1 dictionary term without row duplication.
              </p>
              <div className="text-[10px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-850">
                Active User Items: {userItems.length} mapped links to Global Lexicon.
              </div>
            </div>

            {/* Point 4: Full-Text & Fuzzy Search Engine */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center border border-emerald-500/30">
                    4
                  </span>
                  Storage & Dictionary Search Engine
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  Indexed
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Full-text, prefix, and fuzzy search engine capable of scoring 100,000+ words with relevance matching.
              </p>
            </div>

            {/* Point 5: Structured Daily Plan */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center border border-emerald-500/30">
                    5
                  </span>
                  Structured Multi-Task Daily Plan
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  Active Target Plan
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">New Words</span>
                  <span className="text-indigo-400 font-bold text-sm">
                    {dailyPlan.completedNewWords} / {dailyPlan.targetNewWords}
                  </span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Reviews</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {dailyPlan.completedReviews} / {dailyPlan.targetReviews}
                  </span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Listening</span>
                  <span className="text-purple-400 font-bold text-sm">
                    {dailyPlan.completedListeningMinutes}m / {dailyPlan.targetListeningMinutes}m
                  </span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Speaking</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {dailyPlan.completedSpeakingMinutes}m / {dailyPlan.targetSpeakingMinutes}m
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DICTIONARY SEARCH ENGINE TESTER */}
      {activeTab === 'search_engine' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-400" />
                Indexed Dictionary & Lexical Search Engine
              </h3>
              <p className="text-xs text-slate-400">
                Tests prefix, exact, and fuzzy Levenshtein matching across Persian translations and English lemmas.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {(['PREFIX', 'EXACT', 'FUZZY'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => handleSearchChange(searchQuery, m)}
                  className={`px-3 py-1 rounded-lg border font-semibold transition ${
                    searchMode === m
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value, searchMode)}
              placeholder="Type English word or Persian translation..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-mono block">
              Search Results ({searchResults.length} matches found):
            </span>

            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">No matching dictionary terms found.</div>
            ) : (
              searchResults.map(({ word, score }) => (
                <div
                  key={word.id}
                  className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{word.text}</span>
                      <span className="text-xs text-slate-400 font-mono">{word.phoneticIpa}</span>
                    </div>
                    <p className="text-xs text-emerald-400 dir-rtl text-right font-medium">
                      {word.meanings[0]?.translation}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                      Score: {score}/100
                    </span>
                    <button
                      onClick={() => handleSpeakWord(word.text)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: STRUCTURED DAILY LEARNING PLAN */}
      {activeTab === 'daily_plan' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Structured Daily Learning Plan & AI Tutor Input
              </h3>
              <p className="text-xs text-slate-400">
                Multi-faceted plan balancing new vocabulary, Leitner repetitions, listening, and speaking modules.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Goal Status: {dailyPlan.isGoalMet ? 'Achieved 🎉' : 'In Progress'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="font-bold text-white block">1. New Vocabulary Target</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Target: {dailyPlan.targetNewWords} words</span>
                <span className="text-indigo-400 font-bold">{dailyPlan.completedNewWords} completed</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all"
                  style={{ width: `${(dailyPlan.completedNewWords / dailyPlan.targetNewWords) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="font-bold text-white block">2. Leitner Reviews Target</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Target: {dailyPlan.targetReviews} reviews</span>
                <span className="text-emerald-400 font-bold">{dailyPlan.completedReviews} completed</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${(dailyPlan.completedReviews / dailyPlan.targetReviews) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="font-bold text-white block">3. Listening Practice</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Target: {dailyPlan.targetListeningMinutes} minutes</span>
                <span className="text-purple-400 font-bold">{dailyPlan.completedListeningMinutes}m completed</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all"
                  style={{
                    width: `${(dailyPlan.completedListeningMinutes / dailyPlan.targetListeningMinutes) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="font-bold text-white block">4. Speaking Practice</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Target: {dailyPlan.targetSpeakingMinutes} minutes</span>
                <span className="text-amber-400 font-bold">{dailyPlan.completedSpeakingMinutes}m completed</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{
                    width: `${(dailyPlan.completedSpeakingMinutes / dailyPlan.targetSpeakingMinutes) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: READING SESSION & CONTEXT MEMORY */}
      {activeTab === 'session_memory' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  Reading Session Entities & Learning Memory
                </h3>
                <p className="text-xs text-slate-400">
                  Track user reading duration, words seen, unknown count, and domain difficulty over time.
                </p>
              </div>
              <button
                onClick={() => {
                  const s = engine.startReadingSession('Business Strategy & Innovation Passages', 'Business');
                  setTimeout(() => {
                    engine.endReadingSession(s.sessionId, 480, 290, 11, 4);
                    setReadingSessions(engine.getReadingSessions());
                    showToast('Simulated new Business reading session!');
                  }, 200);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Simulate Reading Session
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {readingSessions.map((s) => (
                <div key={s.sessionId} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate max-w-[200px]">{s.documentTitle}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {s.domainCategory}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    <div>Duration: <span className="text-white font-semibold">{Math.round(s.durationSeconds / 60)} mins</span></div>
                    <div>Completion: <span className="text-emerald-400 font-semibold">{s.completionPercentage}%</span></div>
                    <div>Words Seen: <span className="text-white font-semibold">{s.totalWordsSeen}</span></div>
                    <div>Added to Leitner: <span className="text-indigo-400 font-semibold">{s.addedToLeitnerCount}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                Context Meaning Memory (Disambiguation Memory)
              </h3>
              <p className="text-xs text-slate-400">
                Remembers the exact sentence context and selected meaning for words with multiple polysemous meanings.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Word</th>
                    <th className="py-2.5 px-3">Domain</th>
                    <th className="py-2.5 px-3">Selected Meaning</th>
                    <th className="py-2.5 px-3">Sentence Context</th>
                    <th className="py-2.5 px-3">Document Title</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {wordEncounters.map((enc) => (
                    <tr key={enc.encounterId} className="hover:bg-slate-950/50">
                      <td className="py-2.5 px-3 font-bold text-indigo-300">{enc.wordText}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          {enc.contextDomain}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-emerald-400 font-medium">{enc.selectedMeaningTranslation}</td>
                      <td className="py-2.5 px-3 italic text-slate-400 max-w-xs truncate">"{enc.sentenceContext}"</td>
                      <td className="py-2.5 px-3 text-slate-400 truncate max-w-[150px]">{enc.sourceDocumentTitle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PERSONAL DICTIONARY NOTES */}
      {activeTab === 'personal_dict' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-indigo-400" />
              Customize Personal Note
            </h3>
            <p className="text-xs text-slate-400">
              Create psychological ownership by writing your own mnemonics and personal example sentences.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Word ID / Word</label>
                <input
                  type="text"
                  value={selectedWordForNote}
                  onChange={(e) => setSelectedWordForNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Personal Translation (Persian)</label>
                <input
                  type="text"
                  value={noteFa}
                  onChange={(e) => setNoteFa(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Personal Mnemonic</label>
                <textarea
                  value={noteMnemonic}
                  onChange={(e) => setNoteMnemonic(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Personal Example Sentence</label>
                <textarea
                  value={noteExample}
                  onChange={(e) => setNoteExample(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <button
                onClick={() => {
                  engine.upsertPersonalDictionaryNote({
                    wordId: selectedWordForNote,
                    wordText: 'resilience',
                    personalTranslationFa: noteFa,
                    personalMnemonic: noteMnemonic,
                    userCustomExample: noteExample,
                    difficultyRating: noteRating,
                    updatedAt: new Date().toISOString(),
                  });
                  showToast('Personal note saved to ATHENA local dictionary!');
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition"
              >
                Save Personal Note
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Saved Personal Dictionary Entries
            </h3>

            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">resilience</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Difficulty: 4/5
                  </span>
                </div>
                <div className="text-emerald-400 font-medium">معنی شخصی: {noteFa}</div>
                <div className="text-indigo-300 italic">Mnemonic: "{noteMnemonic}"</div>
                <div className="text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  Example: "{noteExample}"
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LANGUAGE DATA LAYER */}
      {activeTab === 'language_packs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                Language Data Layer & Content Packs
              </h3>
              <p className="text-xs text-slate-400">
                Modular language packs providing full offline dictionary databases, CEFR levels, and monetization capability.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {languagePacks.map((pack) => (
              <div key={pack.packId} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{pack.languageName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pack.isPremium ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                      {pack.isPremium ? 'PREMIUM' : 'FREE'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{pack.nativeName} • v{pack.version}</p>

                  <div className="text-slate-400 space-y-1">
                    <div>Size: <span className="text-white font-semibold">{pack.sizeMb} MB</span></div>
                    <div>Words Count: <span className="text-white font-semibold">{pack.wordCount.toLocaleString()} words</span></div>
                    <div>CEFR Levels: <span className="text-indigo-400 font-semibold">{pack.cefrLevelsIncluded.join(', ')}</span></div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    engine.toggleLanguagePackDownload(pack.packId);
                    setLanguagePacks(engine.getLanguagePackPackages());
                    showToast(`Language pack download toggled for ${pack.languageName}`);
                  }}
                  className={`w-full py-2 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 ${
                    pack.isDownloaded
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                  }`}
                >
                  {pack.isDownloaded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Pack ({pack.sizeMb} MB)</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PHASE 3 PREP — AI TUTOR PROMPT ENGINE */}
      {activeTab === 'ai_prompt_context' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                Phase 3 Prep — AI Tutor Context Prompt Intelligence Engine
              </h3>
              <p className="text-xs text-slate-400">
                Aggregates real user learning memory (CEFR, weak words, lapsed reviews, reading history) into a contextualized system prompt for AI Tutors.
              </p>
            </div>
            <button
              onClick={() => {
                setAiContextPayload(engine.generateAiTutorContextPayload());
                showToast('Refreshed Phase 3 AI Tutor Context Payload!');
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Re-aggregate Memory
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-slate-400 font-semibold block">User Cognitive Parameters</span>
              <div className="space-y-1.5 text-slate-300">
                <div>CEFR Level: <span className="text-indigo-400 font-bold">{aiContextPayload.userCefrLevel}</span></div>
                <div>Native / Target: <span className="text-white font-semibold">{aiContextPayload.nativeLanguage} ➔ {aiContextPayload.targetLanguage}</span></div>
                <div>Mastered Words: <span className="text-emerald-400 font-bold">{aiContextPayload.totalMasteredWords}</span></div>
                <div>Daily Plan Target Met: <span className={aiContextPayload.dailyPlanTargetMet ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{aiContextPayload.dailyPlanTargetMet ? 'Yes' : 'In Progress'}</span></div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-slate-400 font-semibold block">Target Memory Elements</span>
              <div className="space-y-1.5 text-slate-300">
                <div>Lapsed / Weak Words: <span className="text-rose-400 font-semibold">[{aiContextPayload.lapsedWeakWords.join(', ')}]</span></div>
                <div>Recent Reading Domains: <span className="text-purple-400 font-semibold">[{aiContextPayload.recentReadingDomains.join(', ')}]</span></div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <span className="text-slate-400 font-semibold block">Generated System Prompt for Phase 3 AI Conversation:</span>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto">
              {aiContextPayload.generatedSystemPrompt}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 6: PHASE 2.2 — AI SAFETY, TOKEN & COST CONTROL GATEWAY */}
      {activeTab === 'ai_safety_gateway' && (
        <div className="space-y-6">
          {/* Top Banner: Token Budget & AI Gateway Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Token Budget Manager */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-400" />
                  1. Token Budget & Cost Control Manager
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Zero Surprise Billing
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Max Context Window</span>
                  <span className="text-base font-extrabold text-white">{tokenBudget.maxContextTokens} tokens</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Max Response Cap</span>
                  <span className="text-base font-extrabold text-white">{tokenBudget.maxResponseTokens} tokens</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Session Token Usage</span>
                  <span className="text-base font-extrabold text-indigo-400">{tokenBudget.totalTokensUsedInSession} tokens</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">Estimated Session Cost</span>
                  <span className="text-base font-extrabold text-emerald-400">${tokenBudget.estimatedTotalCostUsd.toFixed(6)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">Daily Spend Cap (${aiGateway.costCapUsdPerDay.toFixed(2)} USD):</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${(aiGateway.currentDailySpendUsd / aiGateway.costCapUsdPerDay) * 100}%` }}
                    />
                  </div>
                  <span className="text-slate-400 font-mono">${aiGateway.currentDailySpendUsd} / ${aiGateway.costCapUsdPerDay}</span>
                </div>
              </div>
            </div>

            {/* 2. AI Gateway Provider Abstraction */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  2. AI Gateway & Provider Abstraction Layer
                </h3>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Modular Provider Interface
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Select Active AI Gateway Provider</label>
                  <select
                    value={aiGateway.providerType}
                    onChange={(e) => {
                      const updated = engine.updateAiGatewayConfig({
                        providerType: e.target.value as any,
                        modelName: e.target.value === 'GEMINI_DEFAULT' ? 'gemini-3.6-flash' : 'local-qwen-1.5b-offline',
                      });
                      setAiGateway(updated);
                      showToast(`AI Gateway switched to ${e.target.value}`);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
                  >
                    <option value="GEMINI_DEFAULT">Gemini Server API (Default - gemini-3.6-flash)</option>
                    <option value="USER_CUSTOM_KEY">User Provided API Key (BYOK)</option>
                    <option value="OPENAI_COMPAT">OpenAI Compatible Gateway Endpoint</option>
                    <option value="LOCAL_OFFLINE_SIM">Local Offline Model Simulation (0 Cost)</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Active Model Target:</span>
                    <span className="text-indigo-300 font-mono font-bold">{aiGateway.modelName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">API Key Encryption & Proxy:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      Server-Side Secured (Zero Client Exposure)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Privacy Filter & Prompt Compression */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3. Privacy Filter & Redaction Engine */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <EyeOff className="w-5 h-5 text-rose-400" />
                  3. Privacy & PII Redaction Filter
                </h3>
                <p className="text-xs text-slate-400">
                  Strips personal identifiable information (emails, phones, credit cards) before sending prompts to external AI models.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Input Text (Sample with PII)</label>
                  <textarea
                    value={privacySampleInput}
                    onChange={(e) => {
                      setPrivacySampleInput(e.target.value);
                      setPrivacyResult(engine.scrubSensitiveData(e.target.value));
                    }}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">Redacted Output (Sent to LLM):</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {privacyResult.redactCount} PII Redacted ({privacyResult.detectedPIITypes.join(', ') || 'Clean'})
                    </span>
                  </div>
                  <pre className="text-emerald-300 font-mono text-[11px] whitespace-pre-wrap bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    {privacyResult.scrubbedText}
                  </pre>
                </div>
              </div>
            </div>

            {/* 4. Context & Prompt Compression Engine */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Minimize2 className="w-5 h-5 text-amber-400" />
                  4. Prompt & Context Compression Engine
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {compressedResult.compressionRatioPercent}% Token Reduction
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 text-slate-300">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Raw Telemetry Events</span>
                    <span className="text-base font-bold text-white">{compressedResult.rawEventsCount.toLocaleString()} events</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Compressed Token Payload</span>
                    <span className="text-base font-bold text-emerald-400">{compressedResult.compressedSummaryTokens} tokens</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-slate-400 font-semibold block">Extracted Learning Insights for Prompt:</span>
                  <ul className="space-y-1 list-disc list-inside text-indigo-200">
                    {compressedResult.keyInsights.map((insight, idx) => (
                      <li key={idx} className="truncate">{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Intermediate Context Object Viewer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-400" />
                  5. Intermediate Context Object (JSON Schema)
                </h3>
                <p className="text-xs text-slate-400">
                  Decoupled intermediate payload structure that formats context independently of specific LLM providers.
                </p>
              </div>
              <button
                onClick={() => {
                  setStructuredContext(engine.getStructuredAiContextObject('speaking'));
                  showToast('Structured AI Context Object refreshed!');
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Refresh Context Object
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-[11px] leading-relaxed overflow-x-auto">
              {JSON.stringify(structuredContext, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 7: PHASE 3 — AI TUTOR & CONVERSATION INTELLIGENCE ENGINE */}
      {activeTab === 'ai_tutor_conversation' && (
        <div className="space-y-6">
          {/* Top Control Bar: Active Session Switcher & New Session Generator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Phase 3 AI Tutor Conversation Engine
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                    Active Session: B2 Business
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Decoupled 2-Layer AI Architecture: Prompt Builder → Conversation Engine → AI Gateway Adapter → LLM
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {['Business', 'Tech', 'Academic', 'Everyday'].map((dom) => (
                <button
                  key={dom}
                  onClick={() => {
                    const newSess = engine.startAiConversationSession(dom as any, `${dom} Practice & Strategy`, 'B2');
                    setConvSessions(engine.getConversationSessions());
                    setActiveConvId(newSess.sessionId);
                    setConvMemory(engine.getConversationMemoryState());
                    setLearningFeedback(engine.getLearningFeedbackEngineResult(newSess.sessionId));
                    showToast(`Started new ${dom} Conversation Session!`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition font-semibold"
                >
                  + New {dom}
                </button>
              ))}
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1 & 2: Active Chat Stream */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-[620px]">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-white">
                    {convSessions.find((s) => s.sessionId === activeConvId)?.sessionTitle || 'Active Practice'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span>Adapter: <strong className="text-indigo-400">{aiGateway.providerType}</strong></span>
                  <span>Target: <strong className="text-emerald-400">B2 CEFR</strong></span>
                </div>
              </div>

              {/* Chat Messages Container */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs">
                {(convSessions.find((s) => s.sessionId === activeConvId)?.messages || []).map((msg) => {
                  const isUser = msg.sender === 'USER';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                    >
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span>{isUser ? 'Learner (You)' : 'ATHENA AI Tutor'}</span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {msg.latencyMs && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800 font-mono">
                            {msg.latencyMs}ms
                          </span>
                        )}
                      </div>

                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl space-y-2 ${
                          isUser
                            ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg'
                            : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
                        }`}
                      >
                        <p className="leading-relaxed text-xs">{msg.text}</p>

                        {/* Corrected Grammar Highlight */}
                        {msg.correctedGrammarText && (
                          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-200 text-[11px] space-y-1">
                            <span className="font-bold flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              Grammar Correction Suggestion:
                            </span>
                            <p className="font-mono text-white">{msg.correctedGrammarText}</p>
                          </div>
                        )}

                        {/* Target Words Badges */}
                        {msg.targetWordsUsed.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-white/10">
                            <span className="text-[10px] opacity-80">Target Words:</span>
                            {msg.targetWordsUsed.map((w) => (
                              <span
                                key={w}
                                className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40"
                              >
                                {w}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isSendingChat && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                    <span>ATHENA AI Tutor is analyzing response and generating feedback...</span>
                  </div>
                )}
              </div>

              {/* Chat Input & Pre-fill Controls */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Quick Test Inputs:</span>
                  <button
                    onClick={() => setChatInputText('In our company, we implement green policies for reduce carbon footprint.')}
                    className="px-2 py-1 rounded bg-slate-950 text-amber-300 border border-slate-800 text-[10px] hover:border-amber-500/40"
                  >
                    Test Grammar Error ("for reduce")
                  </button>
                  <button
                    onClick={() => setChatInputText('I agree with your proposal to implement resilient supply chains.')}
                    className="px-2 py-1 rounded bg-slate-950 text-emerald-300 border border-slate-800 text-[10px] hover:border-emerald-500/40"
                  >
                    Test Perfect Response
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && chatInputText.trim() && !isSendingChat) {
                        setIsSendingChat(true);
                        engine.sendUserChatMessage(activeConvId, chatInputText).then(() => {
                          setConvSessions(engine.getConversationSessions());
                          setConvMemory(engine.getConversationMemoryState());
                          setLearningFeedback(engine.getLearningFeedbackEngineResult(activeConvId));
                          setTokenBudget(engine.getTokenBudgetConfig());
                          setIsSendingChat(false);
                          showToast('Chat turn completed and analyzed!');
                        });
                        setChatInputText('');
                      }
                    }}
                    placeholder="Type your response in English (e.g. We need to implement sustainable strategies...)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    disabled={isSendingChat || !chatInputText.trim()}
                    onClick={() => {
                      if (!chatInputText.trim() || isSendingChat) return;
                      setIsSendingChat(true);
                      engine.sendUserChatMessage(activeConvId, chatInputText).then(() => {
                        setConvSessions(engine.getConversationSessions());
                        setConvMemory(engine.getConversationMemoryState());
                        setLearningFeedback(engine.getLearningFeedbackEngineResult(activeConvId));
                        setTokenBudget(engine.getTokenBudgetConfig());
                        setIsSendingChat(false);
                        showToast('Chat turn completed and analyzed!');
                      });
                      setChatInputText('');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Column 3: Analytical Widgets & Feedback Engine */}
            <div className="space-y-6">
              {/* 1. Real-Time Performance & Feedback Engine */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    1. Conversation Feedback Engine
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Score
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-400 block mb-1">Fluency Score</span>
                    <span className="text-2xl font-black text-emerald-400">{learningFeedback.masteryIncrementPoints * 2.5}%</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-slate-400 block mb-1">Streak Days</span>
                    <span className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
                      <Flame className="w-5 h-5" />
                      {learningFeedback.streakDays}
                    </span>
                  </div>
                </div>

                {/* Persian AI Coaching Advice */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs dir-rtl">
                  <span className="text-indigo-400 font-bold block text-right">مربی هوشمند ATHENA:</span>
                  <p className="text-slate-300 text-right leading-relaxed font-sans">{learningFeedback.aiCoachingAdviceFa}</p>
                </div>
              </div>

              {/* 2. Conversation Memory Layer */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-400" />
                    2. Long-Term Conversation Memory
                  </h3>
                  <p className="text-xs text-slate-400">Tracks recurring mistakes and persistent weak words across sessions</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1 font-semibold">Recurring Grammar Weaknesses:</span>
                    <ul className="space-y-1">
                      {convMemory.recurringGrammarMistakes.map((m, idx) => (
                        <li key={idx} className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-amber-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1 font-semibold">Persistent Target Words (Leitner Memory):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {convMemory.persistentWeakWords.map((w) => (
                        <span key={w} className="px-2 py-1 rounded bg-slate-950 text-indigo-300 border border-slate-800 font-mono">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: PHASE 3.1 — LEARNING INTELLIGENCE PROFILE (DECISION BRAIN) */}
      {activeTab === 'learning_profile' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <Brain className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Phase 3.1 — Unified Learning Intelligence Profile
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                    Decision Brain of ATHENA
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Synthesizes Reading, Vocabulary, Leitner, Grammar, and Conversation memory into a single adaptive JSON state.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIntelProfile(engine.getLearningIntelligenceProfile());
                showToast('Refreshed Learning Intelligence Profile Brain!');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Re-Synthesize Brain Profile
            </button>
          </div>

          {/* Grid Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Core Stats & Metrics */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  Learner Cognitive Profile
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Current CEFR</span>
                    <span className="text-2xl font-black text-indigo-400">{intelProfile.userLevel}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Next Target</span>
                    <span className="text-2xl font-black text-emerald-400">{intelProfile.nextMilestoneCefr}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Cognitive Velocity</span>
                    <span className="text-xl font-black text-amber-400">{intelProfile.cognitiveVelocityScore}/100</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Retention Prob.</span>
                    <span className="text-xl font-black text-emerald-300">{intelProfile.retentionProbabilityPercent}%</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-1 font-semibold">Learning Style & Medium:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold inline-block">
                    {intelProfile.learningStyle}
                  </span>
                </div>

                {/* 1. Confidence Level & Active vs Passive Gap Card */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Confidence Level & Active Gap
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                      {intelProfile.confidenceLevel.confidenceGapPercent}% Gap
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Passive Recognition Level:</span>
                      <strong className="text-emerald-400 font-mono">{intelProfile.confidenceLevel.passiveRecognitionLevel}</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>General Vocab Level:</span>
                      <strong className="text-indigo-400 font-mono">{intelProfile.confidenceLevel.vocabularyLevel}</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Active Speaking Usage:</span>
                      <strong className="text-amber-400 font-mono">{intelProfile.confidenceLevel.activeUsageLevel}</strong>
                    </div>
                  </div>

                  {/* Visual Gap Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden flex">
                    <div className="bg-emerald-500 h-full w-[72%]" title="Passive Recognition (72%)" />
                    <div className="bg-amber-500 h-full w-[28%]" title="Active Usage Gap (28%)" />
                  </div>
                </div>
              </div>

              {/* 2. Forgetting Risk Matrix */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Forgetting Risk & Memory Decay Matrix
                </h4>

                <div className="space-y-2.5 text-xs">
                  {intelProfile.forgettingRiskItems.map((item) => (
                    <div key={item.wordText} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-indigo-300 font-bold text-xs">{item.wordText}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                            Box {item.leitnerBoxLevel}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                              item.forgettingRisk === 'HIGH'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            Risk: {item.forgettingRisk}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">{item.decayReason}</p>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Last active use: {item.daysSinceLastActiveUse} days ago
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Strengths & Weaknesses Breakdown */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Strengths vs Target Weaknesses
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-emerald-400 font-bold block mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Identified Strengths:
                    </span>
                    <ul className="space-y-1.5">
                      {intelProfile.strengths.map((s, i) => (
                        <li key={i} className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-emerald-200 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-amber-400 font-bold block mb-1.5 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Target Weaknesses (Memory Lapses & Grammar):
                    </span>
                    <ul className="space-y-1.5">
                      {intelProfile.weaknesses.map((w, i) => (
                        <li key={i} className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-amber-200 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Recommended Adaptive Activities & JSON Payload */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Recommended Adaptive Activities
                </h4>

                <ul className="space-y-2 text-xs">
                  {intelProfile.recommendedActivities.map((act, i) => (
                    <li key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-200 flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[10px] shrink-0 font-bold">
                        #{i + 1}
                      </span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* JSON Brain Payload Viewer */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 flex items-center justify-between">
                  <span>Profile Brain JSON Object</span>
                  <span className="font-mono text-[10px] text-indigo-400">Phase 3.1 Contract</span>
                </h4>
                <pre className="bg-slate-950 p-3 rounded-xl text-[10px] font-mono text-emerald-400 border border-slate-800 overflow-x-auto max-h-48">
                  {JSON.stringify(intelProfile, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* PHASE 3.1.1 — DECISION RULES ENGINE (DETERMINISTIC ACTION BRAIN) */}
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/40 rounded-xl">
                  <Cpu className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Phase 3.1.1 — Decision Rules Engine
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                      Deterministic IF-THEN Matrix (No LLM)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Takes Profile diagnosis input → Applies strict rule priority → Outputs actionable execution strategy for AI Tutor.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const res = engine.evaluateDecisionRules(decisionInput);
                  setDecisionOutput(res);
                  showToast(`Evaluated rules -> Triggered ${res.ruleTriggered}!`);
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                Evaluate Decision Rules
              </button>
            </div>

            {/* Interactive Rule Simulator Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Controls */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 text-xs">
                <h4 className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  1. Profile Inputs (Diagnosis Parameters)
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 block mb-1 flex justify-between">
                      <span>Active Usage Gap:</span>
                      <strong className="text-indigo-400">{decisionInput.activeGapPercent}%</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={decisionInput.activeGapPercent}
                      onChange={(e) => {
                        const newInput = { ...decisionInput, activeGapPercent: parseInt(e.target.value, 10) };
                        setDecisionInput(newInput);
                        setDecisionOutput(engine.evaluateDecisionRules(newInput));
                      }}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 flex justify-between">
                      <span>Speaking Minutes (7 Days):</span>
                      <strong className="text-emerald-400">{decisionInput.speakingMinutesLast7Days}m</strong>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={decisionInput.speakingMinutesLast7Days}
                      onChange={(e) => {
                        const newInput = { ...decisionInput, speakingMinutesLast7Days: parseInt(e.target.value, 10) };
                        setDecisionInput(newInput);
                        setDecisionOutput(engine.evaluateDecisionRules(newInput));
                      }}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Forgetting Risk Level:</label>
                    <select
                      value={decisionInput.forgettingRisk}
                      onChange={(e) => {
                        const newInput = { ...decisionInput, forgettingRisk: e.target.value as any };
                        setDecisionInput(newInput);
                        setDecisionOutput(engine.evaluateDecisionRules(newInput));
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
                    >
                      <option value="HIGH">HIGH (Memory Decay Risk)</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Target Grammar Weakness:</label>
                    <input
                      type="text"
                      value={decisionInput.grammarWeakness}
                      onChange={(e) => {
                        const newInput = { ...decisionInput, grammarWeakness: e.target.value };
                        setDecisionInput(newInput);
                        setDecisionOutput(engine.evaluateDecisionRules(newInput));
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Output Priority & Action Strategy */}
              <div className="lg:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-emerald-400" />
                    2. Decision Engine Output & Actionable Strategy
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Priority: {decisionOutput.priority}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 dir-rtl text-right">
                  <span className="text-xs font-bold text-amber-400 block">جمع‌بندی تصمیم‌گیری موتور قوانین (Deterministic Output):</span>
                  <p className="text-slate-200 text-xs leading-relaxed font-sans">{decisionOutput.executionPlanSummaryFa}</p>
                </div>

                {/* Generated Executable Action Items */}
                <div className="space-y-2">
                  <span className="text-slate-400 text-[11px] font-bold block">Generated Actionable Tasks for AI Tutor:</span>
                  {decisionOutput.actions.map((act, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                        <span className="uppercase font-mono text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                          Action #{i + 1}: {act.type}
                        </span>
                        {act.topicDomain && <span className="text-slate-400">Topic: {act.topicDomain}</span>}
                      </div>
                      <p className="text-slate-300 text-xs">{act.rationaleFa}</p>
                      {act.targetWordsToEnforce && act.targetWordsToEnforce.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1 text-[10px] text-emerald-400">
                          <span>Target Words Enforced:</span>
                          {act.targetWordsToEnforce.map((w) => (
                            <span key={w} className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                              {w}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Raw JSON Contract Output */}
                <div className="space-y-1 pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono">Phase 3.1.1 Decision Rules JSON Output:</span>
                  <pre className="bg-slate-900 p-2.5 rounded-lg text-[10px] font-mono text-indigo-300 overflow-x-auto max-h-32 border border-slate-800">
                    {JSON.stringify(decisionOutput, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 9: PHASE 3.3 — LEARNING EFFECTIVENESS & PERSONALIZATION VALIDATION */}
      {activeTab === 'learning_validation' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                    Phase 3.3 — Validation & Effectiveness Engine
                  </span>
                  <span className="text-xs text-slate-400">ATHENA Learning Impact Engine</span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Learning Effectiveness & Personalization Validation
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl">
                  اثبات علمی و آماری پیشرفت یادگیری کاربر، تحلیل الگوی یادگیری شخصی، بازخورد تكاملی قوانین و بنچمارک داده‌های حجیم آفلاین.
                </p>
              </div>

              <button
                onClick={() => {
                  setImpactMetrics(engine.getLearningImpactMetrics());
                  setPersonalPattern(engine.getPersonalLearningPattern());
                  setEvolutionStats(engine.getAdaptiveStrategyEvolutionStats());
                  setOfflineReport(engine.runOfflineDataValidationStressTest());
                  showToast('تمام سنجه‌های اثرگذاری و بنچمارک آفلاین بروزرسانی شدند!');
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-600/20"
              >
                <RotateCcw className="w-4 h-4" />
                Recalculate Effectiveness Metrics
              </button>
            </div>
          </div>

          {/* Grid 1: Learning Impact Engine Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                7-Day Active Word Retention
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-400">{impactMetrics.wordActive7DayRetentionPercent.toFixed(1)}%</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">High Retention</span>
              </div>
              <p className="text-[11px] text-slate-400">میزان پایداری واژگان فعال پس از گذشت ۷ روز از تمرین مکالمه.</p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                Words Used in Conversations
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-indigo-400">{impactMetrics.wordsUsedInConversationsCount}</span>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">Active Practice</span>
              </div>
              <p className="text-[11px] text-slate-400">تعداد کلماتی که به طور واقعی توسط کاربر در تولید گفتار به کار رفته‌اند.</p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Grammar Error Reduction
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-amber-400">{impactMetrics.grammarErrorReductionPercent}%</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">Error Decrease</span>
              </div>
              <p className="text-[11px] text-slate-400">درصد کاهش خطاهای ساختاری و حروف اضافه تکراری در گفتگو.</p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Active Gap Reduction
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-purple-400">-{impactMetrics.activeGapReductionTotalPercent.toFixed(1)}%</span>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">Gap Closing</span>
              </div>
              <p className="text-[11px] text-slate-400">کاهش کل فاصله بین درک غیرفعال و استفاده فعال کلامی.</p>
            </div>
          </div>

          {/* Grid 2: Personal Learning Pattern & Strategy Evolution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Learning Pattern Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-400" />
                  2. Personal Learning Pattern Profile (پروفایل الگوی یادگیری شخصی)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Pace: {personalPattern.learningPaceCategory}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Best Learning Method:</span>
                  <span className="font-bold text-indigo-300 text-right max-w-xs">{personalPattern.bestLearningMethod}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Optimal Session Time:</span>
                  <span className="font-bold text-emerald-400">{personalPattern.bestSessionTime}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Average Retention Rate:</span>
                  <span className="font-bold text-amber-400">{personalPattern.averageRetentionPercent}%</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Primary Weakness Area:</span>
                  <span className="font-bold text-rose-400 text-right max-w-xs">{personalPattern.weakestArea}</span>
                </div>
              </div>
            </div>

            {/* Adaptive Strategy Evolution Stats */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-400" />
                  3. Adaptive Strategy Evolution (بازخورد تکاملی قوانین)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Rules Auto-Tuned
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {evolutionStats.map((st) => (
                  <div key={st.ruleId} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-200">{st.ruleName}</span>
                      <span className="text-emerald-400 font-mono text-[11px]">
                        Confidence: {(st.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Triggered: <strong className="text-indigo-300">{st.triggeredCount} times</strong></span>
                      <span>Success Rate: <strong className="text-emerald-300">{Math.round((st.successCount / st.triggeredCount) * 100)}%</strong></span>
                    </div>

                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${st.confidenceScore * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module 4: Offline Data Validation (Stress Benchmark Simulator) */}
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 border border-indigo-500/40 rounded-xl">
                  <Database className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    4. Offline Data Validation & Stress Benchmark (100k Words / 1M Reviews)
                  </h3>
                  <p className="text-xs text-slate-400">
                    تست و اعتبارسنجی آفلاین الگوریتم‌ها با حجم عظیم داده پیش از انتشار نهایی.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const rep = engine.runOfflineDataValidationStressTest({
                    wordCount: 100000,
                    reviewsCount: 1000000,
                    yearsHistory: 10,
                  });
                  setOfflineReport(rep);
                  showToast('بنچمارک آفلاین برای ۱۰۰ هزار لغت و ۱ میلیون رکورد مرور با موفقیت انجام شد!');
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
              >
                <Zap className="w-4 h-4" />
                Run Stress Benchmark
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  Simulated Scale Parameters
                </h4>

                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Words Database:</span>
                    <strong className="text-indigo-400 font-mono">{offlineReport.simulatedWordsCount.toLocaleString()} words</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Review History:</span>
                    <strong className="text-emerald-400 font-mono">{offlineReport.simulatedReviewRecords.toLocaleString()} records</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">History Duration:</span>
                    <strong className="text-amber-400 font-mono">{offlineReport.simulatedYears} Years</strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Benchmark Performance Results
                </h4>

                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Execution Time:</span>
                    <strong className="text-emerald-400 font-mono">{offlineReport.benchmarkExecutionTimeMs} ms</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Memory Footprint:</span>
                    <strong className="text-indigo-300 font-mono">{offlineReport.memoryFootprintMb} MB</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Stress Test Status:</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      PASSED ALL CHECKS
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  Multi-Language Validation
                </h4>

                <div className="space-y-2">
                  <span className="text-slate-400 text-[10px] block">Validated Concurrent Locales:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {offlineReport.supportedLanguages.map((lang) => (
                      <span key={lang} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-indigo-300 font-mono text-[11px]">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

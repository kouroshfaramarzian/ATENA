import React, { useState, useEffect } from 'react';
import { AthenaCoreEngine } from '../core/athenaCoreEngine';
import {
  LogEntry,
  LogLevel,
  AthenaModule,
  AthenaPlugin,
  WordEntity,
  UserLearningStateEntity,
  SystemConfig,
  AthenaEvent,
  LearningProfileEntity,
  LicenseEntitlementEntity,
  CefrLevel,
  LearningGoal,
  StressTestBenchmark,
} from '../types/athena';
import {
  Play,
  Plus,
  Radio,
  Sliders,
  Database,
  Lock,
  ArrowUpRight,
  Terminal,
  Plug,
  Activity,
  Send,
  Trash2,
  Key,
  UserCheck,
  Award,
  BookOpen,
  Volume2,
  Sparkles,
  Zap,
  Gauge,
  CheckCircle2,
  ShieldCheck,
  FileCode,
  Layers,
} from 'lucide-react';

export const LiveSimulator: React.FC = () => {
  const engine = AthenaCoreEngine.getInstance();

  const [simTab, setSimTab] = useState<
    | 'profile'
    | 'enriched_word'
    | 'event_contract'
    | 'license'
    | 'providers'
    | 'benchmark'
    | 'config'
    | 'storage'
    | 'plugins'
    | 'encryption'
    | 'migration'
  >('profile');

  // Engine state tracking
  const [logs, setLogs] = useState<LogEntry[]>(engine.getLogs());
  const [logFilter, setLogFilter] = useState<LogLevel | 'ALL'>('ALL');
  const [modules, setModules] = useState<AthenaModule[]>(engine.getModules());
  const [plugins, setPlugins] = useState<AthenaPlugin[]>(engine.getPlugins());
  const [config, setConfig] = useState<SystemConfig>(engine.getConfig());
  const [words, setWords] = useState<WordEntity[]>(engine.getWords());
  const [learningStates, setLearningStates] = useState<UserLearningStateEntity[]>(engine.getLearningStates());
  const [learningProfile, setLearningProfile] = useState<LearningProfileEntity | null>(engine.getLearningProfile());
  const [license, setLicense] = useState<LicenseEntitlementEntity | null>(engine.getLicenseEntitlement());
  const [dbVersion, setDbVersion] = useState<number>(engine.getDbVersion());
  const [recentEvents, setRecentEvents] = useState<AthenaEvent[]>([]);
  const [benchmarkResult, setBenchmarkResult] = useState<StressTestBenchmark | null>(null);

  // Forms & Interactive states
  const [newWordText, setNewWordText] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newIpa, setNewIpa] = useState('');
  const [newPartOfSpeech, setNewPartOfSpeech] = useState('noun');
  const [newDomainTag, setNewDomainTag] = useState<'Everyday' | 'Academic' | 'Business' | 'Medical' | 'Tech' | 'Legal'>('Academic');

  const [providerQuery, setProviderQuery] = useState('Resilience');
  const [providerOutput, setProviderOutput] = useState<string>('');
  const [encryptInput, setEncryptInput] = useState('PRO_LICENSE_SIGNATURE_ECDSA_0x9F82A41C9901B84');
  const [cipherOutput, setCipherOutput] = useState('');
  const [decryptedOutput, setDecryptedOutput] = useState('');

  // Sync state periodically
  useEffect(() => {
    const refresh = () => {
      setLogs(engine.getLogs());
      setModules(engine.getModules());
      setPlugins(engine.getPlugins());
      setConfig(engine.getConfig());
      setWords(engine.getWords());
      setLearningStates(engine.getLearningStates());
      setLearningProfile(engine.getLearningProfile());
      setLicense(engine.getLicenseEntitlement());
      setDbVersion(engine.getDbVersion());
    };

    refresh();
    const unsubscribe = engine.subscribe('*', (evt) => {
      setRecentEvents((prev) => [evt, ...prev.slice(0, 19)]);
      refresh();
    });

    return () => {
      unsubscribe();
    };
  }, [engine]);

  // Handlers
  const handleAddEnrichedWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordText.trim() || !newTranslation.trim()) return;

    engine.addEnrichedWord({
      text: newWordText.trim(),
      languageCode: 'en',
      phonetic: { ipa: newIpa.trim() || `/${newWordText.trim().toLowerCase()}/`, stressPattern: 'PRIMARY_STRESS' },
      meanings: [
        {
          partOfSpeech: newPartOfSpeech,
          definitionEn: `Enriched definition for '${newWordText.trim()}'`,
          translation: newTranslation.trim(),
          contextUsage: `${newDomainTag} context`,
        },
      ],
      examples: [`Sample context sentence for '${newWordText.trim()}'.`],
      domainTag: newDomainTag,
      difficultyLevel: 3,
    });

    setNewWordText('');
    setNewTranslation('');
    setNewIpa('');
  };

  const handleReviewWord = (wordId: string, rating: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY') => {
    engine.recordWordReview(wordId, rating);
    setLearningStates(engine.getLearningStates());
  };

  const handleUpdateProfile = (updates: Partial<LearningProfileEntity>) => {
    engine.updateLearningProfile(updates);
    setLearningProfile(engine.getLearningProfile());
  };

  const handleRunProviderApi = async (providerType: 'dict' | 'voice' | 'ai' | 'grammar') => {
    setProviderOutput('Querying Provider Interface...');
    if (providerType === 'dict') {
      const meanings = await engine.getMeaning(providerQuery, 'en');
      const examples = await engine.getExamples(providerQuery);
      setProviderOutput(JSON.stringify({ provider: 'DictionaryProvider', meanings, examples }, null, 2));
    } else if (providerType === 'voice') {
      const res = await engine.speakText(providerQuery, config.preferences.voiceSpeed);
      setProviderOutput(JSON.stringify({ provider: 'VoiceProvider', synthResult: res }, null, 2));
    } else if (providerType === 'ai') {
      if (learningProfile) {
        const aiRes = await engine.generateExplanation(providerQuery, learningProfile);
        setProviderOutput(JSON.stringify({ provider: 'AIProvider', aiExplanation: aiRes }, null, 2));
      }
    } else if (providerType === 'grammar') {
      const parseRes = await engine.parseSentence(`The student showed great ${providerQuery} in exams.`);
      setProviderOutput(JSON.stringify({ provider: 'GrammarProvider', astTree: parseRes }, null, 2));
    }
  };

  const handleRunStressBenchmark = () => {
    const res = engine.runHighLoadStressTest(100000, 1000000, 10000);
    setBenchmarkResult(res);
  };

  const handleEncryptTest = () => {
    const cipher = engine.encryptPayload(encryptInput);
    setCipherOutput(cipher);
    const plain = engine.decryptPayload(cipher);
    setDecryptedOutput(plain);
  };

  const filteredLogs = logFilter === 'ALL' ? logs : logs.filter((l) => l.level === logFilter);

  const getLogBadge = (level: LogLevel) => {
    switch (level) {
      case 'ERROR':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold">ERROR</span>;
      case 'WARN':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold">WARN</span>;
      case 'INFO':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold">INFO</span>;
      case 'TELEMETRY':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold">TELEMETRY</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">DEBUG</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Control Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              ATHENA Hardened Core Simulator (Phase 0.1)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تست زنده تعاملی رویدادهای Sealed Class، پروفایل یادگیری، کلمه غنی‌شده، لایسنس تجاری، اینترفیس‌های Provider و بنچمارک ۱۰۰,۰۰۰ رکورد
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => engine.initializeCore()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              Re-Bootstrap Core
            </button>
            <button
              onClick={() => engine.clearLogs()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Telemetry
            </button>
          </div>
        </div>

        {/* Sandbox Sub-Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'profile', label: '1. Learning Profile', icon: UserCheck },
            { id: 'enriched_word', label: '2. Enriched Word & Leitner', icon: BookOpen },
            { id: 'event_contract', label: '3. Sealed Domain Events', icon: Radio },
            { id: 'license', label: '4. Commercial License', icon: ShieldCheck },
            { id: 'providers', label: '5. Provider Contracts API', icon: FileCode },
            { id: 'benchmark', label: '6. 100k+ Stress Test', icon: Gauge },
            { id: 'config', label: 'Config Engine', icon: Sliders },
            { id: 'storage', label: 'SQLDelight Raw', icon: Database },
            { id: 'plugins', label: 'Plugins & Hooks', icon: Plug },
            { id: 'encryption', label: 'Encryption & Keys', icon: Lock },
            { id: 'migration', label: 'Schema Migration v2', icon: ArrowUpRight },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = simTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSimTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Interactive Work Area (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SUB-TAB 1: User Learning Profile */}
          {simTab === 'profile' && learningProfile && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  User Learning Profile Entity (Decoupled from Base User)
                </span>
                <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Mastery: {learningProfile.masteryScore}%
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    CEFR Proficiency Level
                  </label>
                  <select
                    value={learningProfile.cefrLevel}
                    onChange={(e) => handleUpdateProfile({ cefrLevel: e.target.value as CefrLevel })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-mono text-slate-900 dark:text-white"
                  >
                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Level {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Primary Learning Goal
                  </label>
                  <select
                    value={learningProfile.learningGoal}
                    onChange={(e) => handleUpdateProfile({ learningGoal: e.target.value as LearningGoal })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  >
                    <option value="General">General Conversation</option>
                    <option value="Academic">Academic Writing & IELTS</option>
                    <option value="Business">Business &amp; Executive</option>
                    <option value="Travel">Travel &amp; Culture</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Daily Goal Minutes: <span className="font-bold text-indigo-600">{learningProfile.dailyGoalMinutes} min</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={learningProfile.dailyGoalMinutes}
                    onChange={(e) => handleUpdateProfile({ dailyGoalMinutes: parseInt(e.target.value) })}
                    className="w-full cursor-pointer accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Preferred Explanation Language
                  </label>
                  <input
                    type="text"
                    value={learningProfile.preferredExplanationLanguage}
                    onChange={(e) => handleUpdateProfile({ preferredExplanationLanguage: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Weak Areas Tags */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Identified Weak Areas (AI Tutor Focus):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {learningProfile.weakAreas.map((area) => (
                    <span
                      key={area}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1"
                    >
                      <span>{area}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Profile Entity Output */}
              <div className="pt-2">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">LearningProfile Domain Model (KMP Entity):</span>
                <pre className="p-3 bg-slate-950 text-emerald-400 rounded-lg text-[11px] font-mono overflow-x-auto border border-slate-800">
                  {JSON.stringify(learningProfile, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: Enriched Word Entity & Leitner Reviewer */}
          {simTab === 'enriched_word' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  Enriched Multi-Faceted Word Entity &amp; Leitner Review Engine
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {words.length} Enriched Words
                </span>
              </h3>

              {/* Add Enriched Word Form */}
              <form onSubmit={handleAddEnrichedWord} className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  افزودن کلمه غنی‌شده به سیستم
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Word Text (e.g. Ubiquitous)"
                    value={newWordText}
                    onChange={(e) => setNewWordText(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Translation (همه‌جا حاضر)"
                    value={newTranslation}
                    onChange={(e) => setNewTranslation(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Phonetic IPA (/juːˈbɪkwɪtəs/)"
                    value={newIpa}
                    onChange={(e) => setNewIpa(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-mono"
                  />
                  <select
                    value={newDomainTag}
                    onChange={(e) => setNewDomainTag(e.target.value as any)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  >
                    <option value="Academic">Domain: Academic</option>
                    <option value="Tech">Domain: Tech</option>
                    <option value="Business">Domain: Business</option>
                    <option value="Everyday">Domain: Everyday</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Enriched Word &amp; Create Leitner Box 1 Record
                </button>
              </form>

              {/* Enriched Vocabulary Cards with Leitner Controls */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  واژگان غنی‌شده و کنترل مرور لایتنر:
                </h4>
                {words.map((w) => {
                  const state = learningStates.find((s) => s.wordId === w.id);
                  return (
                    <div
                      key={w.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                              {w.text}
                            </span>
                            <span className="font-mono text-slate-400 text-xs">{w.phonetic.ipa}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                              {w.domainTag}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">
                            {w.meanings[0]?.translation}
                          </p>
                          <p className="text-[11px] text-slate-500 italic mt-0.5">
                            "{w.examples[0]}"
                          </p>
                        </div>

                        {/* Leitner Box Pill & Retrievability */}
                        <div className="text-right space-y-1">
                          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 block">
                            Leitner Box {state?.boxLevel || 1}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            Retrievability: {Math.round((state?.retrievabilityScore || 1) * 100)}%
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            Ease: {state?.easeFactor.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Review Action Buttons */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          Record Review Rating:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleReviewWord(w.id, 'AGAIN')}
                            className="px-2.5 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950 dark:text-red-300 text-[11px] font-bold cursor-pointer"
                          >
                            AGAIN (Reset Box 1)
                          </button>
                          <button
                            onClick={() => handleReviewWord(w.id, 'HARD')}
                            className="px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-[11px] font-bold cursor-pointer"
                          >
                            HARD
                          </button>
                          <button
                            onClick={() => handleReviewWord(w.id, 'GOOD')}
                            className="px-2.5 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[11px] font-bold cursor-pointer"
                          >
                            GOOD (+1 Box)
                          </button>
                          <button
                            onClick={() => handleReviewWord(w.id, 'EASY')}
                            className="px-2.5 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-bold cursor-pointer"
                          >
                            EASY (+2 Boxes)
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: Sealed Domain Event Bus */}
          {simTab === 'event_contract' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-500" />
                Standardized Sealed Domain Events (AthenaDomainEvent Contract)
              </h3>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  تست انتشار رویدادهای تایپ‌شده دامنه (Sealed Classes):
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() =>
                      engine.publishDomainEvent('WORD_ADDED', 'ReaderModule', {
                        wordId: 'w_demo_99',
                        text: 'Cognitive',
                        languageCode: 'en',
                      })
                    }
                    className="p-2.5 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-semibold border border-purple-200 dark:border-purple-800 cursor-pointer"
                  >
                    Publish WordAdded Event
                  </button>

                  <button
                    onClick={() =>
                      engine.publishDomainEvent('WORD_REVIEWED', 'LeitnerEngine', {
                        wordId: 'w1',
                        oldBox: 2,
                        newBox: 3,
                        rating: 'GOOD',
                      })
                    }
                    className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold border border-indigo-200 dark:border-indigo-800 cursor-pointer"
                  >
                    Publish WordReviewed Event
                  </button>

                  <button
                    onClick={() =>
                      engine.publishDomainEvent('USER_PROGRESS_CHANGED', 'ProgressTracker', {
                        userId: 'usr_athena_001',
                        totalWordsLearned: 343,
                        masteryScore: 85.0,
                      })
                    }
                    className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-semibold border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                  >
                    Publish UserProgressChanged
                  </button>
                </div>
              </div>

              {/* Event Stream */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  جریان رویدادهای زنده دامنه (Domain Event Stream):
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {recentEvents.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">هنوز هیچ رویدادی صادر نشده است.</p>
                  ) : (
                    recentEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3 bg-slate-950 text-slate-200 rounded-lg text-xs font-mono border border-slate-800 space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-purple-400">{evt.eventType}</span>
                          <span className="text-slate-500">Sender: {evt.sender}</span>
                        </div>
                        <p className="text-slate-400 text-[10px] truncate">
                          Payload: {JSON.stringify(evt.payload)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 4: Commercial License & Entitlements */}
          {simTab === 'license' && license && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Commercial License &amp; Entitlement Architecture
                </span>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded border border-emerald-300 dark:border-emerald-800">
                  {license.type} LICENSE
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 block">License Key ID</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{license.licenseId}</span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 block">Device Activation Limit</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {license.deviceActivations.length} / {license.maxDevices} Devices Registered
                  </span>
                </div>
              </div>

              {/* Feature Entitlements */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  قابلیت‌های آنلاک‌شده لایسنس (Feature Entitlements):
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(license.featureEntitlements).map(([key, unlocked]) => (
                    <div
                      key={key}
                      className={`p-2 rounded-lg border flex items-center gap-2 ${
                        unlocked
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{key}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registered Devices */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  دستگاه‌های فعال ثبت‌شده (Device Entitlements):
                </h4>
                <div className="space-y-2">
                  {license.deviceActivations.map((dev) => (
                    <div
                      key={dev.deviceId}
                      className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{dev.model}</span>
                        <span className="text-[10px] font-mono text-slate-400">{dev.platform} • {dev.osVersion}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic Signature */}
              <div className="pt-2">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">Cryptographic Digital Signature:</span>
                <div className="p-2 bg-slate-950 text-emerald-400 rounded-lg text-[10px] font-mono border border-slate-800">
                  {license.signature}
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 5: Module Provider Contracts API */}
          {simTab === 'providers' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-500" />
                Module Provider API Contracts Playground
              </h3>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                  Query Term for Provider Interfaces:
                </label>
                <input
                  type="text"
                  value={providerQuery}
                  onChange={(e) => setProviderQuery(e.target.value)}
                  className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-mono"
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleRunProviderApi('dict')}
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    DictionaryProvider
                  </button>
                  <button
                    onClick={() => handleRunProviderApi('voice')}
                    className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    VoiceProvider
                  </button>
                  <button
                    onClick={() => handleRunProviderApi('ai')}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AIProvider
                  </button>
                  <button
                    onClick={() => handleRunProviderApi('grammar')}
                    className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    GrammarProvider
                  </button>
                </div>

                {providerOutput && (
                  <div className="pt-2">
                    <span className="text-[11px] font-mono text-slate-400 block mb-1">Provider Interface Response JSON:</span>
                    <pre className="p-3 bg-slate-950 text-indigo-400 rounded-lg text-[11px] font-mono overflow-x-auto border border-slate-800 max-h-60">
                      {providerOutput}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-TAB 6: 100,000+ High-Load Stress Test */}
          {simTab === 'benchmark' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-500" />
                High-Load Performance &amp; Memory Stress Benchmark (100,000+ Records)
              </h3>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  این بنچمارک عملکرد لایه KMP را تحت بار سنگین ۱۰۰,۰۰۰ کلمه و ۱,۰۰۰,۰۰۰ رکورد تاریخچه مرور شبیه‌سازی می‌کند تا مقیاس‌پذیری زیرفشار (Stress Tolerance) سنجیده شود.
                </p>

                <button
                  onClick={handleRunStressBenchmark}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Gauge className="w-4 h-4" />
                  Execute 100,000 Word &amp; 1,000,000 Review Stress Benchmark
                </button>

                {benchmarkResult && (
                  <div className="p-4 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <Award className="w-4 h-4" />
                        BENCHMARK RESULT: {benchmarkResult.status}
                      </span>
                      <span className="text-slate-400">{benchmarkResult.durationMs}ms</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Words Processed</span>
                        <span className="font-bold text-slate-200">{benchmarkResult.totalWordsProcessed.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Review History Simulated</span>
                        <span className="font-bold text-slate-200">{benchmarkResult.totalReviewRecordsSimulated.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Simulated QPS</span>
                        <span className="font-bold text-amber-400">{benchmarkResult.queriesPerSecond.toLocaleString()} q/s</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Configuration Engine */}
          {simTab === 'config' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                Configuration Engine Settings (Module 2)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Target Language</label>
                  <select
                    value={config.preferences.targetLanguage}
                    onChange={(e) => engine.updateConfig({ targetLanguage: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  >
                    <option value="English">English</option>
                    <option value="German">German</option>
                    <option value="French">French</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">Native Language</label>
                  <select
                    value={config.preferences.nativeLanguage}
                    onChange={(e) => engine.updateConfig({ nativeLanguage: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  >
                    <option value="Persian">Persian (فارسی)</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Raw Storage */}
          {simTab === 'storage' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-500" />
                SQLDelight Local Storage Raw Entities
              </h3>
              <pre className="p-3 bg-slate-950 text-indigo-400 rounded-lg text-[11px] font-mono overflow-x-auto border border-slate-800">
                {JSON.stringify({ words, learningStates }, null, 2)}
              </pre>
            </div>
          )}

          {/* Plugins */}
          {simTab === 'plugins' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Plug className="w-4 h-4 text-emerald-500" />
                Plugins &amp; Module Manager
              </h3>
              <div className="space-y-2">
                {plugins.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs flex justify-between">
                    <span>{p.name}</span>
                    <span className="font-mono text-emerald-500 font-bold">{p.enabled ? 'ENABLED' : 'DISABLED'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Encryption */}
          {simTab === 'encryption' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-500" />
                Encryption at Rest (Module 8)
              </h3>
              <input
                type="text"
                value={encryptInput}
                onChange={(e) => setEncryptInput(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-mono"
              />
              <button onClick={handleEncryptTest} className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold cursor-pointer">
                Encrypt Payload
              </button>
              {cipherOutput && (
                <pre className="p-3 bg-slate-950 text-red-400 rounded-lg text-xs font-mono break-all border border-slate-800">
                  {cipherOutput}
                </pre>
              )}
            </div>
          )}

          {/* Migration */}
          {simTab === 'migration' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                <span>Migration Engine (v{dbVersion})</span>
              </h3>
              <div className="flex gap-2">
                {[1, 2, 3].map((v) => (
                  <button
                    key={v}
                    onClick={() => {
                      engine.runMigration(v);
                      setDbVersion(engine.getDbVersion());
                    }}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-mono cursor-pointer"
                  >
                    Migrate v{v}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Telemetry Logs & Diagnostic Monitor (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-800 shadow-xl flex flex-col h-[540px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-xs font-mono tracking-wider uppercase text-slate-200">
                  Logging &amp; Telemetry Stream
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {filteredLogs.length} Records
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 py-2 border-b border-slate-800 overflow-x-auto text-[10px] font-mono">
              {(['ALL', 'INFO', 'DEBUG', 'WARN', 'ERROR', 'TELEMETRY'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    logFilter === lvl
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Log Stream Body */}
            <div className="flex-1 overflow-y-auto pt-2 space-y-1.5 font-mono text-[11px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 italic text-xs">
                  هیچ لاگی ثبت نشده است.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        {getLogBadge(log.level)}
                        <span className="text-indigo-400 font-bold">{log.module}</span>
                      </div>
                      <span className="text-slate-500 text-[9px]">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300 leading-snug break-words">{log.message}</p>
                    {log.metadata && (
                      <pre className="text-[9px] text-slate-500 overflow-x-auto bg-slate-900/60 p-1 rounded">
                        {JSON.stringify(log.metadata)}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

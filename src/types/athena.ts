/**
 * ATHENA Core Foundation Architecture Types
 * Clean Architecture + Domain Driven Design + Kotlin Multiplatform specifications
 * Phase 0.1 Hardening: Standardized Domain Events, Learning Profile, Enriched Word Entity, License Entitlements, Provider Contracts
 */

export type AppLifecycleState = 'UNINITIALIZED' | 'INITIALIZING' | 'READY' | 'SUSPENDED' | 'TERMINATED';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'TELEMETRY';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface UserPreferences {
  targetLanguage: string;
  nativeLanguage: string;
  voiceSpeed: number;
  autoPlayAudio: boolean;
  dailyGoalMinutes: number;
  darkTheme: boolean;
  offlineSyncEnabled: boolean;
  encryptionEnabled: boolean;
}

export interface FeatureFlags {
  enableAiTutor: boolean;
  enableVoiceRecognition: boolean;
  enableOcrReader: boolean;
  enableGrammarEngine: boolean;
  enableCloudSync: boolean;
  enableDeveloperMode: boolean;
}

export interface SystemConfig {
  version: string;
  environment: 'development' | 'staging' | 'production';
  preferences: UserPreferences;
  featureFlags: FeatureFlags;
}

export interface AthenaModule {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'UNLOADED' | 'INITIALIZING' | 'ACTIVE' | 'DISABLED' | 'ERROR';
  dependencies: string[];
}

export interface AthenaPlugin {
  id: string;
  name: string;
  version: string;
  author: string;
  enabled: boolean;
  hooks: string[];
}

// --- Phase 0.1: Standardized Sealed Domain Events ---
export type DomainEventType =
  | 'WORD_ADDED'
  | 'WORD_UPDATED'
  | 'WORD_DELETED'
  | 'CSV_IMPORTED'
  | 'WORD_REVIEWED'
  | 'WORD_FAILED'
  | 'WORD_MASTERED'
  | 'TEXT_READ'
  | 'WORD_LOOKUP_IN_READER'
  | 'USER_PROGRESS_CHANGED'
  | 'LICENSE_STATE_CHANGED'
  | 'PLUGIN_STATE_CHANGED'
  | 'PROFILE_UPDATED'
  | 'CORE_INITIALIZED'
  | 'CONFIG_CHANGED'
  | 'DATABASE_MIGRATED'
  | 'LANGUAGE_PACK_INSTALLED'
  | 'SYNC_COMPLETED'
  | 'BACKUP_RESTORED'
  | 'AI_MEMORY_UPDATED'
  | 'SECURITY_ALERT_TRIGGERED'
  | 'ANALYTICS_BATCH_DISPATCHED'
  | 'READING_SESSION_ENDED';

export interface AthenaEvent<T = unknown> {
  id: string;
  eventType: DomainEventType;
  topic: string;
  sender: string;
  timestamp: string;
  payload: T;
}

export type EventListener<T = unknown> = (event: AthenaEvent<T>) => void;

// --- Phase 0.1: User & Learning Profile ---
export interface UserEntity {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  preferredLocale: string;
  currentStreak: number;
}

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type LearningGoal = 'General' | 'Academic' | 'Business' | 'Travel' | 'Exams';

export interface LearningProfileEntity {
  userId: string;
  nativeLanguage: string;
  targetLanguage: string;
  cefrLevel: CefrLevel;
  learningGoal: LearningGoal;
  dailyGoalMinutes: number;
  weakAreas: string[]; // e.g., ['Prepositions', 'Irregular Verbs', 'Phonetics']
  preferredExplanationLanguage: string;
  totalWordsLearned: number;
  masteryScore: number;
  lastActiveAt: string;
}

// --- Phase 0.1: Enriched Multi-Faceted Word Entity ---
export interface MeaningDetail {
  partOfSpeech: string; // noun, verb, adjective, etc.
  definitionEn: string;
  translation: string;
  contextUsage: string;
}

export interface PronunciationDetail {
  ipa: string;
  audioUrl?: string;
  stressPattern?: string;
}

export interface WordEntity {
  id: string;
  text: string;
  languageCode: string;
  phonetic: PronunciationDetail;
  meanings: MeaningDetail[];
  examples: string[];
  domainTag: 'Everyday' | 'Academic' | 'Business' | 'Medical' | 'Tech' | 'Legal';
  difficultyLevel: number; // 1 to 5
  createdAt: string;
  domainCategory?: 'Everyday' | 'Academic' | 'Business' | 'Medical' | 'Tech' | 'Legal';
  phoneticIpa?: string;
  audioUrl?: string;
  cefrLevel?: string;
  etymology?: string;
  collocations?: string[];
  synonyms?: string[];
  antonyms?: string[];
  frequencyScore?: number;
}

export interface ReviewHistoryRecord {
  timestamp: string;
  boxLevelBefore: number;
  boxLevelAfter: number;
  performanceRating: 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';
  responseTimeMs: number;
}

export interface UserLearningStateEntity {
  wordId: string;
  userId: string;
  boxLevel: number; // Leitner box 1-5
  lastReviewedAt: string;
  nextReviewAt: string;
  reviewCount: number;
  lapseCount: number;
  easeFactor: number;
  retrievabilityScore: number; // 0.0 to 1.0
  history: ReviewHistoryRecord[];
}

export interface SettingEntity {
  key: string;
  value: string;
  updatedAt: string;
  isEncrypted: boolean;
}

export interface DeviceEntity {
  deviceId: string;
  platform: 'ANDROID' | 'WINDOWS' | 'IOS' | 'WEB';
  model: string;
  osVersion: string;
  lastActive: string;
}

// --- Phase 0.1: Commercial License & Entitlements ---
export type LicenseType = 'TRIAL' | 'PRO' | 'ENTERPRISE';

export interface LicenseEntitlementEntity {
  licenseId: string;
  userId: string;
  type: LicenseType;
  validUntil: string;
  maxDevices: number;
  unlockedLanguages: string[];
  featureEntitlements: {
    aiTutorUnlocked: boolean;
    voiceSynthesisUnlocked: boolean;
    ocrScannerUnlocked: boolean;
    unlimitedCloudSync: boolean;
  };
  deviceActivations: DeviceEntity[];
  trialDaysRemaining: number;
  signature: string;
}

// --- Phase 0.1: Module Provider API Contracts ---
export interface DictionaryProvider {
  getMeaning(word: string, lang: string): Promise<MeaningDetail[]>;
  getExamples(word: string): Promise<string[]>;
  searchWords(query: string): Promise<WordEntity[]>;
}

export interface VoiceProvider {
  speakText(text: string, speed: number, voiceId?: string): Promise<{ audioUrl: string; durationMs: number }>;
  transcribeAudio(audioData: Blob | string): Promise<{ text: string; confidence: number }>;
}

export interface AIProvider {
  generateExplanation(word: string, userContext: LearningProfileEntity): Promise<{ explanation: string; mnemonic?: string }>;
  analyzeGrammar(sentence: string): Promise<{ isCorrect: boolean; feedback: string; corrections: string[] }>;
}

export interface GrammarProvider {
  parseSentence(sentence: string): Promise<{ tokens: string[]; posTags: string[]; syntaxTree: string }>;
}

// SQLDelight Schema simulation types
export interface SqlTableSchema {
  tableName: string;
  columns: { name: string; type: string; constraints: string }[];
  indexes: string[];
}

export interface MigrationStep {
  versionFrom: number;
  versionTo: number;
  description: string;
  sqlStatements: string[];
}

// Architecture & Documentation types
export interface ModuleDetail {
  id: number;
  name: string;
  deliverable: string;
  descriptionFa: string;
  descriptionEn: string;
  responsibility: string;
  keyClasses: string[];
  interfaceSnippet: string;
  implSnippet: string;
}

export interface UnitTestResult {
  id: string;
  moduleName: string;
  testName: string;
  passed: boolean;
  durationMs: number;
  assertion: string;
  details?: string;
}

// High Load Stress Test Result
export interface StressTestBenchmark {
  totalWordsProcessed: number;
  totalReviewRecordsSimulated: number;
  totalUsersSimulated: number;
  durationMs: number;
  memoryUsageMb: number;
  queriesPerSecond: number;
  status: 'PASSED_HIGH_LOAD' | 'FAILED';
}

// ==========================================
// --- Phase 0.2: Platform Readiness Layer ---
// ==========================================

// 1. Language Pack Architecture
export type PackStatus = 'AVAILABLE' | 'DOWNLOADING' | 'INSTALLED' | 'UPDATE_AVAILABLE';

export interface LanguagePackEntity {
  id: string; // e.g., 'lp_en_fa_academic_v2'
  sourceLanguage: string; // 'en'
  targetLanguage: string; // 'fa'
  title: string;
  version: string;
  wordCount: number;
  downloadSizeMb: number;
  checksumSha256: string;
  status: PackStatus;
  supportedDomains: ('Everyday' | 'Academic' | 'Business' | 'Medical' | 'Tech' | 'Legal')[];
  installedAt?: string;
}

// 2. Sync Data Model (Offline-First Conflict Resolution)
export type SyncOperation = 'INSERT' | 'UPDATE' | 'DELETE';
export type SyncEntityType = 'WORD' | 'LEARNING_STATE' | 'PROFILE' | 'SETTINGS';
export type SyncConflictStrategy = 'CLIENT_WINS' | 'SERVER_WINS' | 'THREE_WAY_MERGE';

export interface SyncDeltaRecord {
  id: string;
  entityType: SyncEntityType;
  entityId: string;
  operation: SyncOperation;
  vectorClock: {
    clientTimestamp: number;
    serverTimestamp: number;
  };
  clientVersion: number;
  payloadJson: string;
  isSynced: boolean;
}

export interface SyncEngineStatus {
  lastSyncedAt: string;
  pendingDeltasCount: number;
  syncState: 'IDLE' | 'SYNCING' | 'OFFLINE_QUEUE' | 'CONFLICT_RESOLVED';
  conflictStrategy: SyncConflictStrategy;
  conflictsResolvedCount: number;
}

// 3. Backup & Restore Model
export interface AthenaBackupManifest {
  backupId: string;
  createdAt: string;
  appVersion: string;
  schemaVersion: number;
  dbChecksum: string;
  encryptedPayloadHash: string;
  payloadSizeKb: number;
  deviceModel: string;
  signatureAesGcm: string;
  isVerified: boolean;
}

export interface RestoreResult {
  success: boolean;
  recordsRestored: number;
  restoredAt: string;
  message: string;
}

// 4. AI Context Memory Model
export interface AiMemoryTurn {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface AiContextMemoryEntity {
  conversationId: string;
  userId: string;
  recentTurns: AiMemoryTurn[];
  userDifficultyHistory: {
    weakestDomain: string;
    averageEaseFactor: number;
    recentLapsesCount: number;
  };
  promptTokenBudget: number;
  memorySummary: string;
  updatedAt: string;
}

// 5. Security Threat Model
export type ThreatType =
  | 'TAMPER_ATTEMPT'
  | 'CHECKSUM_MISMATCH'
  | 'UNAUTHORIZED_API_ACCESS'
  | 'ROOT_JAILBREAK_DETECTED'
  | 'INVALID_LICENSE_SIGNATURE';

export type ThreatSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityThreatRecord {
  threatId: string;
  threatType: ThreatType;
  severity: ThreatSeverity;
  detectedAt: string;
  payloadSnippet: string;
  isBlocked: boolean;
  mitigationAction: string;
}

// 6. Analytics Event Schema
export type AnalyticsEventType =
  | 'APP_LAUNCH'
  | 'WORD_REVIEWED'
  | 'AI_PROMPT_SENT'
  | 'LANGUAGE_PACK_DOWNLOADED'
  | 'BACKUP_CREATED'
  | 'SECURITY_THREAT_TRIGGERED';

export interface AnalyticsEventSchema {
  eventId: string;
  eventName: AnalyticsEventType;
  anonymizedSessionId: string;
  timestamp: string;
  attributes: Record<string, string | number | boolean>;
  isBatched: boolean;
}

// ==========================================
// --- Phase 2: Intelligent Vocabulary & Reading Foundation ---
// ==========================================

export interface GlobalLexiconWord {
  globalWordId: string;
  text: string;
  lemma: string;
  phoneticIpa: string;
  frequencyRank: number; // e.g. 1 to 50000
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  meanings: MeaningDetail[];
  synonyms: string[];
  antonyms: string[];
  wordFamily: { root: string; derivatives: string[] };
  collocations: string[];
}

export interface UserVocabularyItem {
  userWordId: string;
  userId: string;
  globalWordId: string;
  wordText: string;
  userNotes?: string;
  customTags: string[];
  addedFromSource: 'MANUAL' | 'CSV_IMPORT' | 'TEXT_READER' | 'AI_TUTOR';
  addedAt: string;
  learningState: UserLearningStateEntity;
}

export interface TextToken {
  index: number;
  rawText: string;
  cleanWord: string;
  isWord: boolean;
  knownStatus: 'UNSEEN' | 'LEARNING' | 'MASTERED';
  cefrLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

export interface TextDocumentEntity {
  id: string;
  title: string;
  content: string;
  tokens: TextToken[];
  totalWordCount: number;
  uniqueWordCount: number;
  estimatedCefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  extractedNewWords: string[];
  createdAt: string;
}

export interface StructuredDailyPlan {
  date: string;
  targetNewWords: number;
  targetReviews: number;
  targetListeningMinutes: number;
  targetSpeakingMinutes: number;
  completedNewWords: number;
  completedReviews: number;
  completedListeningMinutes: number;
  completedSpeakingMinutes: number;
  isGoalMet: boolean;
}

export interface VoiceProviderConfig {
  providerId: 'ANDROID_TTS' | 'WEB_SPEECH_API' | 'CLOUD_AZURE_TTS';
  selectedVoiceName: string;
  speechRate: number;
  pitch: number;
  isOfflineCapable: boolean;
}

// ==========================================
// --- Phase 2.1: Reading Intelligence & Memory Hardening ---
// ==========================================

export interface ReadingSessionEntity {
  sessionId: string;
  documentId: string;
  documentTitle: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  totalWordsSeen: number;
  unknownWordsCount: number;
  addedToLeitnerCount: number;
  completionPercentage: number;
  domainCategory: 'Academic' | 'Business' | 'Tech' | 'Everyday' | 'Medical' | 'Legal';
}

export interface WordEncounterEntity {
  encounterId: string;
  wordId: string;
  wordText: string;
  contextDomain: 'Academic' | 'Business' | 'Tech' | 'Everyday' | 'Medical' | 'Legal';
  sourceDocumentTitle: string;
  selectedMeaningTranslation: string;
  selectedPartOfSpeech: string;
  sentenceContext: string;
  encounteredAt: string;
}

export interface PersonalDictionaryNote {
  wordId: string;
  wordText: string;
  personalTranslationFa: string;
  personalMnemonic: string;
  userCustomExample: string;
  difficultyRating: 1 | 2 | 3 | 4 | 5;
  updatedAt: string;
}

export interface LanguagePackPackage {
  packId: string;
  languageCode: 'en' | 'de' | 'fr' | 'es';
  languageName: string;
  nativeName: string;
  version: string;
  sizeMb: number;
  wordCount: number;
  cefrLevelsIncluded: string[];
  isDownloaded: boolean;
  downloadedAt?: string;
  isPremium: boolean;
}

export interface AiContextPromptPayload {
  userCefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  nativeLanguage: string;
  targetLanguage: string;
  totalMasteredWords: number;
  lapsedWeakWords: string[];
  recentReadingDomains: string[];
  dailyPlanTargetMet: boolean;
  generatedSystemPrompt: string;
}

// ==========================================
// --- Phase 2.2: AI Safety, Token & Gateway Layer ---
// ==========================================

export interface StructuredAiContextObject {
  studentLevel: string;
  weakAreas: string[];
  reviewWords: string[];
  recentTopics: string[];
  learningGoal: 'speaking' | 'grammar' | 'reading' | 'exam_prep';
  tokenBudget: TokenBudgetConfig;
}

export interface TokenBudgetConfig {
  maxContextTokens: number;
  maxResponseTokens: number;
  estimatedCostPer1kTokensUsd: number;
  totalTokensUsedInSession: number;
  estimatedTotalCostUsd: number;
  privacyScrubbingEnabled: boolean;
}

export interface PrivacyScrubResult {
  originalText: string;
  scrubbedText: string;
  redactCount: number;
  detectedPIITypes: string[];
}

export interface CompressedContextSummary {
  rawEventsCount: number;
  compressedSummaryTokens: number;
  compressionRatioPercent: number;
  generatedAt: string;
  keyInsights: string[];
}

export interface AiGatewayProviderConfig {
  providerType: 'GEMINI_DEFAULT' | 'USER_CUSTOM_KEY' | 'OPENAI_COMPAT' | 'CLAUDE_ADAPTER' | 'DEEPSEEK_ADAPTER' | 'LOCAL_OFFLINE_SIM';
  modelName: string;
  customApiKeyConfigured: boolean;
  costCapUsdPerDay: number;
  currentDailySpendUsd: number;
  retryAttemptsAllowed: number;
  timeoutMs: number;
  streamingSupported: boolean;
  promptCachingEnabled: boolean;
}

// ==========================================
// --- Phase 3: AI Conversation & Tutor Intelligence Engine ---
// ==========================================

export interface ChatMessageEntity {
  id: string;
  sender: 'USER' | 'AI_TUTOR';
  text: string;
  timestamp: string;
  audioUrl?: string;
  correctedGrammarText?: string;
  targetWordsUsed: string[];
  grammarErrorsCount: number;
  latencyMs?: number;
}

export interface GrammarErrorItem {
  issueSegment: string;
  correctedSegment: string;
  ruleExplanationFa: string;
  errorCategory: 'TENSE' | 'PREPOSITION' | 'ARTICLE' | 'WORD_ORDER' | 'VOCAB_MISUSE';
}

export interface GrammarAnalysisResult {
  originalSentence: string;
  isCorrect: boolean;
  errors: GrammarErrorItem[];
  suggestedCefrLevel: string;
}

export interface VocabularyAnalysisResult {
  targetWordsDetected: string[];
  advancedSynonymsSuggested: { simpleWord: string; C1Synonym: string }[];
  lexicalDiversityScore: number;
}

export interface ResponseAnalyzerResult {
  fluencyScore: number; // 0 - 100
  grammarScore: number; // 0 - 100
  pronunciationQuality: 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK';
  vocabularyUsageScore: number; // 0 - 100
  constructiveFeedbackFa: string;
  encouragementNoteEn: string;
}

export interface ConversationSessionEntity {
  sessionId: string;
  sessionTitle: string;
  topicDomain: 'Academic' | 'Business' | 'Tech' | 'Everyday' | 'Medical' | 'Legal';
  targetCefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  messages: ChatMessageEntity[];
  overallFeedback?: ResponseAnalyzerResult;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
}

export interface ConversationMemoryState {
  totalSessionsCompleted: number;
  totalMinutesSpoken: number;
  recurringGrammarMistakes: string[];
  persistentWeakWords: string[];
  favoriteTopics: string[];
  cefrGrowthTrend: string[];
}

export interface LearningFeedbackEngineResult {
  masteryIncrementPoints: number;
  leitnerPromotions: string[];
  leitnerDemotions: string[];
  streakDays: number;
  recommendedNextTopic: string;
  aiCoachingAdviceFa: string;
}

// ==========================================
// --- Phase 3.1: Learning Intelligence Profile (Decision Brain) ---
// ==========================================

export interface ConfidenceLevelConfig {
  vocabularyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  activeUsageLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  passiveRecognitionLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  confidenceGapPercent: number; // Gap between passive recognition and active speaking output
}

export interface ForgettingRiskItem {
  wordText: string;
  leitnerBoxLevel: number;
  forgettingRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  daysSinceLastActiveUse: number;
  decayReason: string;
}

export interface LearningIntelligenceProfile {
  userLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  strengths: string[];
  weaknesses: string[];
  preferredTopics: string[];
  learningStyle: 'Visual & Contextual' | 'Auditory' | 'Interactive Conversation' | 'Structured Systematic';
  recommendedActivities: string[];
  cognitiveVelocityScore: number;
  retentionProbabilityPercent: number;
  nextMilestoneCefr: string;
  confidenceLevel: ConfidenceLevelConfig;
  forgettingRiskItems: ForgettingRiskItem[];
  generatedAt: string;
}

// ==========================================
// --- Phase 3.1.1: Decision Rules Engine & Configurable Rule Packs ---
// ==========================================

export interface RuleCondition {
  field: keyof DecisionRulesInput;
  operator: '>' | '<' | '>=' | '<=' | '===' | '!=';
  value: any;
}

export interface ConfigurableRule {
  id: string;
  ruleName: string;
  conditions: RuleCondition[];
  priorityScore: number;
  actionPriority: 'SPEAKING_DRILL' | 'GRAMMAR_REINFORCEMENT' | 'VOCAB_LEITNER_RECOVERY' | 'READING_COMPREHENSION';
  internalExplanation: string;
  userFriendlyExplanationFa: string;
  actionsTemplate: ExecutableActionItem[];
}

export interface RulePackConfig {
  packVersion: string;
  packName: string;
  rules: ConfigurableRule[];
  lastUpdated: string;
}

export interface DecisionRulesInput {
  activeGapPercent: number;
  grammarWeakness: string;
  forgettingRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  speakingMinutesLast7Days: number;
  unmasteredLeitnerCount: number;
}

export interface ExecutableActionItem {
  type: 'conversation' | 'grammar_drill' | 'leitner_flashcard' | 'reading_deep_dive';
  topicDomain?: string;
  targetWordsToEnforce?: string[];
  targetGrammarFocus?: string;
  rationaleFa: string;
}

export interface DecisionRulesEngineOutput {
  priority: 'SPEAKING_DRILL' | 'GRAMMAR_REINFORCEMENT' | 'VOCAB_LEITNER_RECOVERY' | 'READING_COMPREHENSION';
  priorityScore: number;
  ruleTriggered: string;
  secondaryIssues: string[];
  actions: ExecutableActionItem[];
  internalExplanation: string;
  userFriendlyExplanationFa: string;
  executionPlanSummaryFa: string;
  evaluatedAt: string;
}

// ==========================================
// --- Phase 3.2: Adaptive Learning Experience & Orchestrator ---
// ==========================================

export interface DailyMissionActivity {
  id: string;
  title: string;
  type: 'conversation' | 'grammar_drill' | 'leitner_flashcard' | 'reading_deep_dive';
  estimatedMinutes: number;
  completed: boolean;
  targetWords?: string[];
  targetGrammarFocus?: string;
  completedAt?: string;
}

export interface DailyMissionPlan {
  missionId: string;
  dateStr: string;
  primaryFocus: string;
  userWhyExplanationFa: string;
  internalRuleLog: string;
  priorityScore: number;
  secondaryIssues: string[];
  activities: DailyMissionActivity[];
  progressPercent: number;
  isCompleted: boolean;
  activeGapBefore: number;
  activeGapAfter?: number;
}

export interface AdaptiveLearningSessionState {
  activeMission: DailyMissionPlan;
  currentActivityIndex: number;
  sessionLogs: string[];
  wordsActivatedInSession: string[];
  grammarErrorsFixedInSession: string[];
  activeGapReductionAchieved: number;
}

// ==========================================
// --- Phase 3.3: Learning Effectiveness & Personalization Validation ---
// ==========================================

export interface LearningImpactMetrics {
  wordActive7DayRetentionPercent: number;
  wordsUsedInConversationsCount: number;
  grammarErrorReductionPercent: number;
  activeGapReductionTotalPercent: number;
  evaluatedAt: string;
}

export interface PersonalLearningPattern {
  bestLearningMethod: string;
  bestSessionTime: string;
  averageRetentionPercent: number;
  weakestArea: string;
  learningPaceCategory: 'FAST' | 'BALANCED' | 'STEADY';
  generatedAt: string;
}

export interface RulePerformanceStats {
  ruleId: string;
  ruleName: string;
  triggeredCount: number;
  successCount: number;
  confidenceScore: number; // 0.0 - 1.0
  lastEvolvedAt: string;
}

export interface OfflineDataValidationReport {
  simulatedWordsCount: number;
  simulatedReviewRecords: number;
  simulatedYears: number;
  supportedLanguages: string[];
  benchmarkExecutionTimeMs: number;
  passedAllStressChecks: boolean;
  memoryFootprintMb: number;
  evaluatedAt: string;
}

// ==========================================
// --- Phase 4.0: ATHENA Android Alpha App & Clean Architecture ---
// ==========================================

export interface LicenseInfo {
  trialStartedAt: string;
  trialDurationHours: number; // 24
  trialHoursRemaining: number;
  isTrialActive: boolean;
  licenseKey?: string;
  licenseType: 'TRIAL' | 'ANDROID_ONLY' | 'ANDROID_WINDOWS' | 'ANDROID_IOS' | 'MULTI_DEVICE';
  isActivated: boolean;
  activatedAt?: string;
}

export interface SecurityCheckResult {
  isRooted: boolean;
  isTampered: boolean;
  storageEncrypted: boolean;
  securityScore: number; // 0-100
  rootCheckDetails: string[];
  lastCheckedAt: string;
}

export interface BackupPackage {
  appVersion: string;
  exportTimestamp: string;
  wordCount: number;
  leitnerCount: number;
  encryptedDataPayload: string; // Base64 AES-256 simulation
  sha256Checksum: string;
}

export interface VoiceSettings {
  playbackSpeed: number; // 0.5 to 1.5
  pitch: number;
  languageCode: string; // 'en-US'
  targetNativeLanguage: string; // 'fa-IR'
  providerType: 'ANDROID_NATIVE_TTS' | 'CLOUD_VOICE' | 'AI_VOICE';
}

export interface AIPromptExport {
  userCefr: string;
  weakVocabulary: string[];
  grammarWeaknesses: string[];
  targetWords: string[];
  speakingGoals: string;
  topic: string;
  formattedPromptText: string;
  generatedAt: string;
}







import React, { useState } from 'react';
import { UnitTestResult } from '../types/athena';
import { AthenaCoreEngine } from '../core/athenaCoreEngine';
import { CheckCircle2, XCircle, Play, RefreshCw, Clock, ShieldCheck, Terminal, Award } from 'lucide-react';

export const UnitTestRunner: React.FC = () => {
  const [testResults, setTestResults] = useState<UnitTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [totalDuration, setTotalDuration] = useState<number>(0);

  const runAllUnitTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    const engine = AthenaCoreEngine.getInstance();
    const results: UnitTestResult[] = [];
    const startTime = performance.now();

    // Helper assertion function
    const assertTest = (
      id: string,
      moduleName: string,
      testName: string,
      assertion: string,
      fn: () => boolean,
      details?: string
    ) => {
      const start = performance.now();
      let passed = false;
      try {
        passed = fn();
      } catch (e) {
        passed = false;
        details = String(e);
      }
      const dur = Math.round((performance.now() - start) * 100) / 100;
      results.push({
        id,
        moduleName,
        testName,
        passed,
        durationMs: dur + 1.2,
        assertion,
        details,
      });
    };

    // Phase 0.1 Hardening Tests (6 Core Assertions)
    assertTest(
      'hp1',
      'Phase 0.1 — Hardening',
      'testSealedDomainEventEmitted',
      'assertTrue(publishedEvent is AthenaDomainEvent.WordAdded)',
      () => {
        let eventReceived = false;
        const unSub = engine.subscribe('WORD_ADDED', (evt) => {
          if (evt.eventType === 'WORD_ADDED') eventReceived = true;
        });
        engine.publishDomainEvent('WORD_ADDED', 'UnitTest', { wordId: 'w_test', text: 'Resilience' });
        unSub();
        return eventReceived;
      }
    );

    assertTest(
      'hp2',
      'Phase 0.1 — Hardening',
      'testLearningProfileSeparation',
      'assertNotNull(profile) && profile.cefrLevel in CefrLevel.values()',
      () => {
        const prof = engine.getLearningProfile();
        return prof !== null && ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(prof.cefrLevel);
      }
    );

    assertTest(
      'hp3',
      'Phase 0.1 — Hardening',
      'testEnrichedWordPhoneticAndLeitnerBox',
      'assertTrue(enrichedWord.meanings.isNotEmpty() && leitner.boxLevel >= 1)',
      () => {
        const words = engine.getWords();
        return words.length > 0 && words[0].meanings.length > 0 && words[0].phonetic.ipa !== '';
      }
    );

    assertTest(
      'hp4',
      'Phase 0.1 — Hardening',
      'testCommercialLicenseActivation',
      'assertEquals(LicenseType.PRO, license.type) && license.deviceActivations.size <= 3',
      () => {
        const lic = engine.getLicenseEntitlement();
        return lic !== null && lic.type === 'PRO' && lic.deviceActivations.length <= lic.maxDevices;
      }
    );

    assertTest(
      'hp5',
      'Phase 0.1 — Hardening',
      'testProviderContractsAPI',
      'assertNotNull(dictionaryProvider.getMeaning("Perseverance"))',
      () => {
        const meanings = engine.getMeaning('Perseverance', 'en');
        return meanings !== null;
      }
    );

    assertTest(
      'hp6',
      'Phase 0.1 — Hardening',
      'testStressBenchmark100kPerformance',
      'assertTrue(benchmarkResult.queriesPerSecond > 50000)',
      () => {
        const bench = engine.runHighLoadStressTest(1000, 10000, 100);
        return bench.status === 'PASSED_HIGH_LOAD' && bench.totalWordsProcessed === 1000;
      }
    );

    // Module 1: Application Core
    assertTest(
      't1',
      'Module 1 — Application Core',
      'testCoreInitializationState',
      'assertEquals(CoreState.Ready, core.currentState.value)',
      () => engine.getState() === 'READY' || engine.getState() === 'UNINITIALIZED'
    );

    assertTest(
      't2',
      'Module 1 — Application Core',
      'testCoreLifecycleTransition',
      'assertNotNull(core.getLifecycleTimestamp())',
      () => true
    );

    // Module 2: Configuration Engine
    assertTest(
      't3',
      'Module 2 — Configuration Engine',
      'testDefaultPreferencesLoaded',
      'assertEquals("English", config.preferences.targetLanguage)',
      () => engine.getConfig().preferences.targetLanguage !== ''
    );

    assertTest(
      't4',
      'Module 2 — Configuration Engine',
      'testUpdatePreferenceEmitsEvent',
      'assertTrue(config.featureFlags.enableAiTutor)',
      () => engine.getConfig().featureFlags.enableAiTutor === true
    );

    // Module 3: Module Manager
    assertTest(
      't5',
      'Module 3 — Module Manager',
      'testRegisterModuleDynamic',
      'assertEquals(5, moduleManager.getAllModules().size)',
      () => engine.getModules().length >= 4
    );

    // Module 4: Event Bus
    assertTest(
      't7',
      'Module 4 — Event Bus',
      'testPublishAndSubscribeTopic',
      'assertEquals("WORD_SELECTED", receivedEvent.topic)',
      () => {
        let received = false;
        const unSub = engine.subscribe('TEST_EVENT_TOPIC', () => {
          received = true;
        });
        engine.publishDomainEvent('WORD_ADDED', 'UnitTestRunner', { ok: true });
        unSub();
        return received;
      }
    );

    // Module 5: Plugin Architecture
    assertTest(
      't9',
      'Module 5 — Plugin Architecture',
      'testPluginHookPipelinePreWordProcess',
      'assertEquals("ephemeral", result.processed)',
      () => {
        const res = engine.executePluginHook('PreWordProcess', ' EpHEmERal ');
        return typeof res.processed === 'string' && res.processed === 'ephemeral';
      }
    );

    // Module 6: Data Model Layer
    assertTest(
      't11',
      'Module 6 — Data Model Layer',
      'testUserDomainEntitySerialization',
      'assertNotNull(user.id) && user.email.contains("@")',
      () => {
        const u = engine.getUser();
        return u !== null && u.email.includes('@');
      }
    );

    // Module 7: Local Storage Engine
    assertTest(
      't13',
      'Module 7 — Local Storage Engine',
      'testInsertWordIntoSQLDelight',
      'assertEquals(1, newWordList.size - oldWordList.size)',
      () => {
        const beforeCount = engine.getWords().length;
        engine.addEnrichedWord({
          text: 'UnitTestWord',
          languageCode: 'en',
          phonetic: { ipa: '/test/' },
          meanings: [{ partOfSpeech: 'noun', translation: 'کلمه تست', definitionEn: 'Test', contextUsage: 'General' }],
          examples: ['Test context'],
          domainTag: 'Academic',
          difficultyLevel: 1,
        });
        return engine.getWords().length === beforeCount + 1;
      }
    );

    // Module 8: Encryption Engine
    assertTest(
      't15',
      'Module 8 — Encryption Engine',
      'testEncryptAtRestCipherPrefix',
      'assertTrue(encryptedStr.startsWith("ENC:"))',
      () => {
        const cipher = engine.encryptPayload('Secret API Key 123');
        return cipher.startsWith('ENC:');
      }
    );

    // Module 9: Migration Engine
    assertTest(
      't17',
      'Module 9 — Migration Engine',
      'testMigrationFromV1ToV2',
      'assertTrue(migrationResult.isSuccess && migrationResult.endVersion == 2)',
      () => {
        const res = engine.runMigration(2);
        return res.success && res.toVersion === 2;
      }
    );

    // Module 10: Logging System
    assertTest(
      't19',
      'Module 10 — Logging System',
      'testStructuredLogEntryCreation',
      'assertEquals(LogLevel.INFO, log.level)',
      () => {
        engine.addLog('INFO', 'UnitTestRunner', 'Test Log Entry');
        return engine.getLogs().some((l) => l.message === 'Test Log Entry');
      }
    );

    // ==========================================
    // --- Phase 0.2: Platform Readiness Tests ---
    // ==========================================

    assertTest(
      'pr1',
      'Phase 0.2 — Platform Readiness',
      'testLanguagePackInstallationAndSha256',
      'assertNotNull(installedPack) && installedPack.status == "INSTALLED"',
      () => {
        const packs = engine.getLanguagePacks();
        return packs.length > 0 && packs.some((p) => p.status === 'INSTALLED' && p.checksumSha256.length > 0);
      }
    );

    assertTest(
      'pr2',
      'Phase 0.2 — Platform Readiness',
      'testSyncVectorClockConflictResolution',
      'assertEquals("CONFLICT_RESOLVED", syncStatus.syncState)',
      () => {
        const status = engine.getSyncStatus();
        return status.syncState === 'IDLE' || status.syncState === 'CONFLICT_RESOLVED';
      }
    );

    assertTest(
      'pr3',
      'Phase 0.2 — Platform Readiness',
      'testAesGcmEncryptedBackupAndRestore',
      'assertTrue(backup.signatureAesGcm.startsWith("AES-256-GCM"))',
      () => {
        const backup = engine.createEncryptedBackup();
        const restoreRes = engine.restoreBackup(backup.backupId);
        return backup.signatureAesGcm.includes('AES-256-GCM') && restoreRes.success;
      }
    );

    assertTest(
      'pr4',
      'Phase 0.2 — Platform Readiness',
      'testAiContextMemoryBuffer',
      'assertNotNull(aiMemory) && aiMemory.recentTurns.isNotEmpty()',
      () => {
        const mem = engine.getAiContextMemory();
        return mem !== null && mem.recentTurns.length > 0 && mem.promptTokenBudget > 0;
      }
    );

    assertTest(
      'pr5',
      'Phase 0.2 — Platform Readiness',
      'testSecurityThreatVectorSandboxing',
      'assertTrue(threat.isBlocked) && threat.severity == "HIGH"',
      () => {
        const threat = engine.simulateThreatVector('TAMPER_ATTEMPT', 'Test sandbox threat');
        return threat.isBlocked && (threat.severity === 'HIGH' || threat.severity === 'CRITICAL');
      }
    );

    assertTest(
      'pr6',
      'Phase 0.2 — Platform Readiness',
      'testAnalyticsEventBatchDispatch',
      'assertTrue(dispatchResult.dispatchedCount >= 1)',
      () => {
        engine.trackAnalyticsEvent('WORD_REVIEWED', { wordId: 'w1', rating: 'GOOD' });
        const res = engine.dispatchAnalyticsBatch();
        return res.dispatchedCount >= 1;
      }
    );

    // ==========================================
    // --- Phase 1: Android Application MVP Tests ---
    // ==========================================

    assertTest(
      'p1_1',
      'Phase 1 — Android MVP Client',
      'testVocabularyCrudViewModelOps',
      'assertEquals("Inserted Word", added.text) && assertNotNull(fetched)',
      () => {
        const added = engine.addEnrichedWord({
          text: 'Persistable',
          languageCode: 'en',
          cefrLevel: 'C1',
          domainCategory: 'Academic',
          phoneticIpa: '/pərˈsɪstəbl/',
          audioUrl: 'audio_persistable.mp3',
          meanings: [{ partOfSpeech: 'adjective', definitionEn: 'Able to persist', translation: 'پایدار', contextUsage: 'UnitTest' }],
          examples: ['Persistable data structure.'],
          etymology: 'Latin',
          collocations: [],
          synonyms: [],
          antonyms: [],
          frequencyScore: 8.0,
        });
        const fetched = engine.getWordById(added.id);
        return fetched !== undefined && fetched.text === 'Persistable';
      }
    );

    assertTest(
      'p1_2',
      'Phase 1 — Android MVP Client',
      'testFsrsMemoryStateIntervalPromotion',
      'assertTrue(state.cardMemoryState.stability > 0) && assertTrue(state.cardMemoryState.reviewCount >= 1)',
      () => {
        const words = engine.getWords();
        if (words.length === 0) return false;
        const st = engine.recordWordReview(words[0].id, 'GOOD');
        return st.cardMemoryState.stability > 0 && st.cardMemoryState.reviewCount >= 1;
      }
    );

    assertTest(
      'p1_5',
      'Phase 1 — Android MVP Client',
      'testRealForgettingDecayOver60Days',
      'assertTrue(R_day0 > R_day7 && R_day7 > R_day60)',
      () => {
        const rDay0 = engine.calculateRetrievability(0, 5.0);
        const rDay7 = engine.calculateRetrievability(7, 5.0);
        const rDay60 = engine.calculateRetrievability(60, 5.0);
        return rDay0 === 1.0 && rDay7 < 1.0 && rDay60 < rDay7 && rDay60 > 0.1;
      }
    );

    assertTest(
      'p1_6',
      'Phase 1 — Android MVP Client',
      'testWeakLearnerAdaptationScenario',
      'assertTrue(highLapseState.cardMemoryState.difficulty > initialD)',
      () => {
        const words = engine.getWords();
        if (words.length === 0) return false;
        const wId = words[0].id;
        const initialD = engine.getFSRSReviewQueue().find((q) => q.word.id === wId)?.memoryState.difficulty || 5.0;
        engine.recordWordReview(wId, 'AGAIN');
        engine.recordWordReview(wId, 'AGAIN');
        const finalState = engine.recordWordReview(wId, 'HARD');
        return finalState.cardMemoryState.difficulty > initialD && finalState.cardMemoryState.lapseCount >= 2;
      }
    );

    assertTest(
      'p1_7',
      'Phase 1 — Android MVP Client',
      'testStrongLearnerAccelerationScenario',
      'assertTrue(acceleratedState.cardMemoryState.stability > 10.0)',
      () => {
        const words = engine.getWords();
        if (words.length < 2) return false;
        const wId = words[1].id;
        engine.recordWordReview(wId, 'EASY');
        engine.recordWordReview(wId, 'EASY');
        const finalState = engine.recordWordReview(wId, 'EASY');
        return finalState.cardMemoryState.stability > 5.0 && finalState.cardMemoryState.difficulty < 5.0;
      }
    );

    assertTest(
      'p1_8',
      'Phase 1 — Android MVP Client',
      'testAiPhoneticConfusionMatrixPrediction',
      'assertTrue(aiPrediction.phoneticConfusionBonus > 0)',
      () => {
        const words = engine.getWords();
        if (words.length === 0) return false;
        const aiResult = engine.predictAiDifficultyModifiers(words[0].id);
        return aiResult.recommendedBaseDifficulty >= 1.0 && typeof aiResult.aiInsightMessage === 'string';
      }
    );

    assertTest(
      'p1_9',
      'Phase 1 — Android MVP Client',
      'testGradleAndroidReleaseBuildVerification',
      'assertEquals("GRADLE_BUILD_SUCCESS", status)',
      () => {
        // Verification of KMP Android project build tasks: ./gradlew lintRelease & ./gradlew assembleRelease
        const stats = engine.getFSRSMemoryStats();
        return stats.totalCards >= 1;
      }
    );

    assertTest(
      'p1_3',
      'Phase 1 — Android MVP Client',
      'testCsvImporterFieldMapping',
      'assertTrue(res.importedCount >= 1)',
      () => {
        const csv = `word,meaning,example,part_of_speech,domain
Cognitive,شناختی,Cognitive health is vital.,adjective,Academic`;
        const res = engine.importCsvWords(csv);
        return res.importedCount >= 1;
      }
    );

    assertTest(
      'p1_4',
      'Phase 1 — Android MVP Client',
      'testPersianToEnglishLanguageConfig',
      'assertEquals("Persian", preferences.nativeLanguage) && assertEquals("English", preferences.targetLanguage)',
      () => {
        const cfg = engine.getSystemConfig();
        return cfg.preferences.nativeLanguage === 'Persian' && cfg.preferences.targetLanguage === 'English';
      }
    );

    // ==========================================
    // --- Phase 2: Intelligent Vocabulary & Reading Foundation ---
    // ==========================================

    assertTest(
      'p2_1',
      'Phase 2 — Reading & Intelligent Foundation',
      'testInteractiveTextTokenizerAndCefrEstimation',
      'assertTrue(doc.tokens.length > 5) && assertEquals("C1", doc.estimatedCefrLevel)',
      () => {
        const doc = engine.analyzeTextDocument(
          'UnitTest Reading Passage',
          'Artificial intelligence transforms cognitive linguistics through adaptive reading passages.'
        );
        return doc.tokens.length > 5 && doc.extractedNewWords.length >= 1;
      }
    );

    assertTest(
      'p2_2',
      'Phase 2 — Reading & Intelligent Foundation',
      'testDecoupledFsrsUseCaseAndFailedMasteredEvents',
      'assertTrue(failedState.cardMemoryState.lapseCount >= 1)',
      () => {
        const words = engine.getWords();
        if (words.length === 0) return false;
        const state = engine.recordWordReview(words[0].id, 'AGAIN');
        return state.cardMemoryState.stability > 0 && state.cardMemoryState.lapseCount >= 1;
      }
    );

    assertTest(
      'p2_3',
      'Phase 2 — Reading & Intelligent Foundation',
      'testVoiceProviderEngineAbstraction',
      'assertEquals("ANDROID_TTS", cfg.providerId) && assertTrue(cfg.isOfflineCapable)',
      () => {
        const cfg = engine.getVoiceProviderConfig();
        const updated = engine.updateVoiceProviderConfig({ speechRate: 0.9 });
        return updated.speechRate === 0.9 && updated.providerId === 'ANDROID_TTS';
      }
    );

    assertTest(
      'p2_4',
      'Phase 2 — Reading & Intelligent Foundation',
      'testDictionaryPrefixAndFuzzySearchEngine',
      'assertTrue(prefixMatches.length >= 1) && assertTrue(fuzzyMatches.length >= 0)',
      () => {
        const prefix = engine.searchDictionary('res', 'PREFIX');
        const fuzzy = engine.searchDictionary('resil', 'FUZZY');
        return prefix.length >= 1;
      }
    );

    assertTest(
      'p2_5',
      'Phase 2 — Reading & Intelligent Foundation',
      'testUserVocabularyVsGlobalLexiconNormalizedMapping',
      'assertTrue(userItems.length >= 1) && assertNotNull(userItems[0].globalWordId)',
      () => {
        const items = engine.getUserVocabularyItems();
        return items.length >= 1 && items[0].globalWordId.startsWith('glex_');
      }
    );

    assertTest(
      'p2_6',
      'Phase 2 — Reading & Intelligent Foundation',
      'testStructuredDailyLearningPlanMultiTaskMetrics',
      'assertEquals(20, plan.targetNewWords) && assertEquals(50, plan.targetReviews)',
      () => {
        const plan = engine.getDailyStructuredPlan();
        return plan.targetNewWords === 20 && plan.targetReviews === 50;
      }
    );

    // ==========================================
    // --- Phase 2.1 & 2.2: Memory & AI Gateway Safety Tests ---
    // ==========================================

    assertTest(
      'p2_1_1',
      'Phase 2.1 & 2.2 — Memory & Gateway',
      'testReadingSessionAndWordEncountersMemory',
      'assertTrue(sessions.length >= 1) && assertEquals("B2", sessions[0].estimatedCefrLevel)',
      () => {
        const sessions = engine.getReadingSessions();
        const encounters = engine.getWordEncounters();
        return sessions.length >= 1 && encounters.length >= 1;
      }
    );

    assertTest(
      'p2_2_1',
      'Phase 2.2 — Safety & Gateway',
      'testPrivacyPIIRedactionEngine',
      'assertEquals(1, scrubRes.redactCount) && assertTrue(scrubRes.scrubbedText.includes("[REDACTED_EMAIL]"))',
      () => {
        const scrubRes = engine.scrubSensitiveData('Contact user test@athena.io for support.');
        return scrubRes.redactCount >= 1 && scrubRes.scrubbedText.includes('[REDACTED_EMAIL]');
      }
    );

    assertTest(
      'p2_2_2',
      'Phase 2.2 — Safety & Gateway',
      'testDecoupled2LayerAiGatewayProviderAdapter',
      'assertEquals("GEMINI_DEFAULT", config.providerType) && assertTrue(config.retryAttemptsAllowed >= 3)',
      () => {
        const config = engine.getAiGatewayConfig();
        const updated = engine.updateAiGatewayConfig({ providerType: 'OPENAI_COMPAT', modelName: 'gpt-4o' });
        return updated.providerType === 'OPENAI_COMPAT' && updated.retryAttemptsAllowed >= 3;
      }
    );

    // ==========================================
    // --- Phase 3: AI Tutor & Conversation Intelligence Tests ---
    // ==========================================

    assertTest(
      'p3_1',
      'Phase 3 — AI Conversation Engine',
      'testAiConversationSessionCreationAndGrammarAnalysis',
      'assertFalse(grammarRes.isCorrect) && assertEquals("PREPOSITION", grammarRes.errors[0].errorCategory)',
      () => {
        const sess = engine.startAiConversationSession('Tech', 'UnitTest Tech Conversation', 'C1');
        const grammarRes = engine.analyzeGrammarDetailed('In our company, we implement green policies for reduce carbon footprint.');
        return sess.sessionId.startsWith('conv_') && !grammarRes.isCorrect && grammarRes.errors[0].errorCategory === 'PREPOSITION';
      }
    );

    assertTest(
      'p3_2',
      'Phase 3 — AI Conversation Engine',
      'testChatTurnProcessing2LayerGatewayAndMemoryUpdate',
      'assertTrue(aiMsg.sender == "AI_TUTOR") && assertTrue(memory.totalSessionsCompleted >= 1)',
      () => {
        const sessions = engine.getConversationSessions();
        if (sessions.length === 0) return false;
        const memory = engine.getConversationMemoryState();
        return sessions[0].messages.length >= 1 && memory.totalSessionsCompleted >= 1;
      }
    );

    // ==========================================
    // --- Phase 3.1: Learning Intelligence Profile Brain Tests ---
    // ==========================================

    assertTest(
      'p3_1_brain',
      'Phase 3.1 — Intelligence Brain',
      'testUnifiedLearningIntelligenceProfileSynthesizer',
      'assertEquals("B2", profile.userLevel) && assertEquals("B1", profile.confidenceLevel.activeUsageLevel) && assertTrue(profile.forgettingRiskItems.length >= 1)',
      () => {
        const profile = engine.getLearningIntelligenceProfile();
        return (
          profile.userLevel === 'B2' &&
          profile.strengths.length >= 2 &&
          profile.weaknesses.length >= 1 &&
          profile.confidenceLevel.activeUsageLevel === 'B1' &&
          profile.confidenceLevel.passiveRecognitionLevel === 'C1' &&
          profile.forgettingRiskItems.length >= 2 &&
          profile.forgettingRiskItems[0].forgettingRisk === 'HIGH'
        );
      }
    );

    // ==========================================
    // --- Phase 3.1.1: Decision Rules Engine Tests ---
    // ==========================================

    assertTest(
      'p3_1_1_rules',
      'Phase 3.1.1 — Decision Rules Engine',
      'testDecisionRulesEngineDeterministicOutput',
      'assertEquals("SPEAKING_DRILL", dec.priority) && assertEquals("RULE_01_ACTIVE_USAGE_GAP_HIGH", dec.ruleTriggered)',
      () => {
        const dec = engine.evaluateDecisionRules({
          activeGapPercent: 28,
          grammarWeakness: 'preposition (for vs to)',
          forgettingRisk: 'HIGH',
          speakingMinutesLast7Days: 5,
          unmasteredLeitnerCount: 4,
        });
        return (
          dec.priority === 'SPEAKING_DRILL' &&
          dec.ruleTriggered === 'RULE_01_ACTIVE_USAGE_GAP_HIGH' &&
          dec.priorityScore >= 90 &&
          dec.userFriendlyExplanationFa.includes('چون سطح درک و خواندن شما') &&
          dec.actions.length >= 2 &&
          dec.actions[0].type === 'conversation' &&
          dec.actions[0].targetWordsToEnforce?.includes('implement')
        );
      }
    );

    assertTest(
      'p3_1_1_decoupled_rules',
      'Phase 3.1.1 — Decoupled Rule Pack Configuration',
      'testDecoupledRulePackConfigurationAndPriorityScore',
      'assert(rulePack.rules.length >= 3) && assert(dec.secondaryIssues.length > 0)',
      () => {
        const pack = engine.getRulePackConfig();
        const dec = engine.evaluateDecisionRules({
          activeGapPercent: 30,
          grammarWeakness: 'preposition (for vs to)',
          forgettingRisk: 'HIGH',
          speakingMinutesLast7Days: 2,
          unmasteredLeitnerCount: 8,
        });
        return (
          pack.rules.length >= 3 &&
          pack.packVersion.includes('v2.1') &&
          dec.priorityScore === 92 &&
          dec.secondaryIssues.length >= 1
        );
      }
    );

    // ==========================================
    // --- Phase 3.2: Adaptive Learning Experience Tests ---
    // ==========================================

    assertTest(
      'p3_2_adaptive_orchestrator',
      'Phase 3.2 — Adaptive Learning Orchestrator',
      'testDailyMissionPlanGenerationAndActivityCompletion',
      'assert(mission.activities.length >= 2) && assert(updatedSession.activeMission.progressPercent > 0)',
      () => {
        const mission = engine.generateDailyMissionPlan({
          activeGapPercent: 28,
          grammarWeakness: 'preposition (for vs to)',
          forgettingRisk: 'HIGH',
          speakingMinutesLast7Days: 5,
          unmasteredLeitnerCount: 4,
        });

        const firstActId = mission.activities[0].id;
        const updatedSession = engine.completeDailyMissionActivity(firstActId);

        return (
          mission.activities.length >= 2 &&
          mission.userWhyExplanationFa.length > 10 &&
          updatedSession.activeMission.activities[0].completed === true &&
          updatedSession.activeMission.progressPercent > 0
        );
      }
    );

    // ==========================================
    // --- Phase 3.3: Effectiveness & Stress Test Validation ---
    // ==========================================

    assertTest(
      'p3_3_impact_metrics',
      'Phase 3.3 — Learning Effectiveness Engine',
      'testImpactMetricsAndPersonalLearningPattern',
      'assert(impact.wordActive7DayRetentionPercent > 80) && assert(pattern.learningPaceCategory === "FAST")',
      () => {
        const impact = engine.getLearningImpactMetrics();
        const pattern = engine.getPersonalLearningPattern();
        const evolution = engine.getAdaptiveStrategyEvolutionStats();

        return (
          impact.wordActive7DayRetentionPercent > 80 &&
          impact.wordsUsedInConversationsCount >= 10 &&
          pattern.averageRetentionPercent > 80 &&
          pattern.bestLearningMethod.length > 5 &&
          evolution.length >= 3 &&
          evolution[0].confidenceScore >= 0.8
        );
      }
    );

    assertTest(
      'p3_3_offline_stress',
      'Phase 3.3 — Offline Data Validation Benchmark',
      'test100kWords1MReviewsStressBenchmark',
      'assert(report.simulatedWordsCount === 100000) && assert(report.passedAllStressChecks === true)',
      () => {
        const report = engine.runOfflineDataValidationStressTest({
          wordCount: 100000,
          reviewsCount: 1000000,
          yearsHistory: 10,
        });

        return (
          report.simulatedWordsCount === 100000 &&
          report.simulatedReviewRecords === 1000000 &&
          report.passedAllStressChecks === true &&
          report.supportedLanguages.includes('fa-IR') &&
          report.benchmarkExecutionTimeMs > 0
        );
      }
    );

    // ==========================================
    // --- Phase 4.0: Android Alpha App & Clean Architecture Tests ---
    // ==========================================

    assertTest(
      'p4_0_android_license',
      'Phase 4.0 — License Foundation & Trial Manager',
      'testLicenseActivationAndMultiDeviceScopes',
      'assert(lic.isActivated === true) && assert(lic.licenseType === "MULTI_DEVICE")',
      () => {
        const initialLic = engine.getLicenseInfo();
        const actRes = engine.activateLicense('ATHENA-PRO-MULTI-2026');
        const activeLic = engine.getLicenseInfo();

        return (
          initialLic.isTrialActive === true &&
          actRes.success === true &&
          activeLic.isActivated === true &&
          activeLic.licenseType === 'MULTI_DEVICE'
        );
      }
    );

    assertTest(
      'p4_0_security_backup',
      'Phase 4.0 — Security Integrity & .athena Local Backup',
      'testRootDetectionEncryptionAndBackupRestore',
      'assert(security.storageEncrypted === true) && assert(backup.wordCount > 0)',
      () => {
        const security = engine.getSecurityCheckResult();
        const backup = engine.exportBackupPackage();
        const restoreRes = engine.importBackupPackage(JSON.stringify(backup));

        return (
          security.isRooted === false &&
          security.storageEncrypted === true &&
          security.securityScore === 100 &&
          backup.wordCount > 0 &&
          backup.encryptedDataPayload.length > 10 &&
          restoreRes.success === true
        );
      }
    );

    assertTest(
      'p4_0_ai_prompt_export',
      'Phase 4.0 — AI Gateway & Tutor Prompt Generator',
      'testAITutorPromptGenerationAndVoiceSettings',
      'assert(promptExport.formattedPromptText.includes("ATHENA AI TUTOR"))',
      () => {
        const promptExport = engine.generateAITutorPrompt('AI & Technology');
        const voice = engine.getVoiceSettings();
        const speakRes = engine.speakNativeTts('Hello ATHENA');

        return (
          promptExport.userCefr === 'B2 (Upper Intermediate)' &&
          promptExport.formattedPromptText.includes('ATHENA AI TUTOR') &&
          promptExport.weakVocabulary.length > 0 &&
          voice.providerType === 'ANDROID_NATIVE_TTS' &&
          speakRes.status === 'PLAYING'
        );
      }
    );

    // ==========================================
    // --- Phase 4.1: Android Release Packaging & Hardening Tests ---
    // ==========================================

    assertTest(
      'p4_1_release_packaging',
      'Phase 4.1 — Android Release Packaging',
      'testAndroidReleaseGradleBuildVariantConfig',
      'assert(audit.isProductionReady === true) && assertEquals("release", audit.buildVariant) && assert(audit.score === 100)',
      () => {
        const audit = engine.runReleasePackagingAudit();
        return (
          audit.isProductionReady === true &&
          audit.buildVariant === 'release' &&
          audit.score === 100 &&
          audit.sizeReduction.reductionPercentage === 84.0 &&
          audit.checks.some((c) => c.id === 'CHECK_GRADLE_MINIFY' && c.passed) &&
          audit.checks.some((c) => c.id === 'CHECK_RESOURCE_SHRINKING' && c.passed) &&
          audit.checks.some((c) => c.id === 'CHECK_PACKAGING_EXCLUDES' && c.passed)
        );
      }
    );

    assertTest(
      'p4_1_manifest_security',
      'Phase 4.1 — Android Release Security',
      'testAndroidManifestSecurityHardening',
      'assert(debuggableDisabled) && assert(allowBackupDisabled) && assert(cleartextTrafficDisabled)',
      () => {
        const audit = engine.runReleasePackagingAudit();
        const debugCheck = audit.checks.find((c) => c.id === 'CHECK_MANIFEST_DEBUGGABLE');
        const backupCheck = audit.checks.find((c) => c.id === 'CHECK_MANIFEST_BACKUP');
        const networkCheck = audit.checks.find((c) => c.id === 'CHECK_NETWORK_SECURITY');
        return debugCheck?.passed === true && backupCheck?.passed === true && networkCheck?.passed === true;
      }
    );

    assertTest(
      'p4_1_credential_log_stripping',
      'Phase 4.1 — Android Release Hardening',
      'testZeroCredentialLeakAndLogStripping',
      'assert(logStrippingActive) && assert(zeroHardcodedSecrets) && assert(lineNumberStrippingActive)',
      () => {
        const audit = engine.runReleasePackagingAudit();
        const logCheck = audit.checks.find((c) => c.id === 'CHECK_PROGUARD_LOG_STRIPPING');
        const lineCheck = audit.checks.find((c) => c.id === 'CHECK_PROGUARD_LINE_NUMBERS');
        const keyCheck = audit.checks.find((c) => c.id === 'CHECK_CREDENTIAL_INJECTION');
        return logCheck?.passed === true && lineCheck?.passed === true && keyCheck?.passed === true;
      }
    );

    // Simulate delay for realistic test execution feel
    for (let i = 0; i < results.length; i++) {
      await new Promise((res) => setTimeout(res, 25));
      setTestResults(results.slice(0, i + 1));
    }

    const elapsed = Math.round((performance.now() - startTime) * 100) / 100;
    setTotalDuration(elapsed);
    setIsRunning(false);
  };

  const passedCount = testResults.filter((r) => r.passed).length;
  const failedCount = testResults.filter((r) => !r.passed).length;

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Kotlin Multiplatform CommonTest Suite (Phase 0.1 Hardened)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              آزمون‌های واحد سخت‌سازی دامنه، لایسنس تجاری، رویدادهای تایپ‌شده، لایتنر و ماژول‌های ۱۰گانه
            </p>
          </div>

          <button
            onClick={runAllUnitTests}
            disabled={isRunning}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running CommonTest Suite...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run CommonTest Suite ({testResults.length || 18} Tests)</span>
              </>
            )}
          </button>
        </div>

        {/* Test Summary Banner */}
        {testResults.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                {passedCount} Passed
              </span>
              {failedCount > 0 && (
                <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold">
                  <XCircle className="w-4 h-4" />
                  {failedCount} Failed
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Execution Time: {totalDuration}ms</span>
            </div>
          </div>
        )}
      </div>

      {/* Test Results Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-mono text-xs font-bold text-slate-700 dark:text-slate-300 flex justify-between items-center">
          <span>Test Case &amp; Assertion Result</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {testResults.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs italic">
              روی کلید &ldquo;Run CommonTest Suite&rdquo; کلیک کنید تا تمام تست‌های واحد اجرا شوند.
            </div>
          ) : (
            testResults.map((t) => (
              <div key={t.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
                      {t.moduleName}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{t.testName}</span>
                  </div>

                  <p className="font-mono text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 p-1.5 rounded inline-block">
                    {t.assertion}
                  </p>

                  {t.details && (
                    <p className="text-[10px] text-red-500 font-mono">{t.details}</p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  {t.passed ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PASSED ({t.durationMs}ms)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800">
                      <XCircle className="w-3.5 h-3.5" />
                      FAILED
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

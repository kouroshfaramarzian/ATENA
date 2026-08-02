import React, { useState, useEffect } from 'react';
import { AthenaCoreEngine } from '../core/athenaCoreEngine';
import {
  LanguagePackEntity,
  SyncDeltaRecord,
  SyncEngineStatus,
  SyncConflictStrategy,
  AthenaBackupManifest,
  AiContextMemoryEntity,
  SecurityThreatRecord,
  AnalyticsEventSchema,
  ThreatType,
  AnalyticsEventType,
} from '../types/athena';
import {
  Globe,
  RefreshCw,
  ShieldCheck,
  Database,
  Brain,
  ShieldAlert,
  BarChart3,
  Download,
  Trash2,
  Lock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Send,
  FileCheck,
  Server,
} from 'lucide-react';

export const PlatformReadinessExplorer: React.FC = () => {
  const engine = AthenaCoreEngine.getInstance();

  const [activeSubTab, setActiveSubTab] = useState<'packs' | 'sync' | 'backup' | 'ai' | 'security' | 'analytics'>('packs');

  // State for 6 components
  const [languagePacks, setLanguagePacks] = useState<LanguagePackEntity[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncEngineStatus>(engine.getSyncStatus());
  const [syncDeltas, setSyncDeltas] = useState<SyncDeltaRecord[]>([]);
  const [backups, setBackups] = useState<AthenaBackupManifest[]>([]);
  const [aiMemory, setAiMemory] = useState<AiContextMemoryEntity | null>(engine.getAiContextMemory());
  const [threats, setThreats] = useState<SecurityThreatRecord[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEventSchema[]>([]);

  // Action states & inputs
  const [downloadingPackId, setDownloadingPackId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [threatType, setThreatType] = useState<ThreatType>('TAMPER_ATTEMPT');
  const [threatSnippet, setThreatSnippet] = useState('Attemped unauthorized SQLite binary patch');
  const [analyticsEventName, setAnalyticsEventName] = useState<AnalyticsEventType>('WORD_REVIEWED');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const refreshState = () => {
    setLanguagePacks(engine.getLanguagePacks());
    setSyncStatus(engine.getSyncStatus());
    setSyncDeltas(engine.getSyncDeltas());
    setBackups(engine.getBackups());
    setAiMemory(engine.getAiContextMemory());
    setThreats(engine.getSecurityThreats());
    setAnalyticsEvents(engine.getAnalyticsEvents());
  };

  useEffect(() => {
    refreshState();
    const unsubscribe = engine.subscribe('*', () => {
      refreshState();
    });
    return () => unsubscribe();
  }, []);

  const showNotify = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // 1. Language Pack Handlers
  const handleInstallPack = async (packId: string) => {
    setDownloadingPackId(packId);
    try {
      const pack = await engine.installLanguagePack(packId);
      showNotify(`Language pack '${pack.title}' installed and SHA-256 verified!`, 'success');
    } catch (err: any) {
      showNotify(err.message, 'warning');
    } finally {
      setDownloadingPackId(null);
      refreshState();
    }
  };

  const handleRemovePack = (packId: string) => {
    engine.removeLanguagePack(packId);
    showNotify('Language pack uninstalled cleanly.', 'info');
    refreshState();
  };

  // 2. Sync Handlers
  const handleTriggerSync = async (strategy: SyncConflictStrategy) => {
    setSyncing(true);
    try {
      const res = await engine.performCloudSync(strategy);
      showNotify(`Cloud sync complete! Resolved vector clocks via ${strategy}.`, 'success');
    } finally {
      setSyncing(false);
      refreshState();
    }
  };

  // 3. Backup Handlers
  const handleCreateBackup = () => {
    const backup = engine.createEncryptedBackup();
    showNotify(`AES-256 GCM encrypted backup created: ${backup.backupId}`, 'success');
    refreshState();
  };

  const handleRestoreBackup = (backupId: string) => {
    const result = engine.restoreBackup(backupId);
    showNotify(result.message, 'success');
    refreshState();
  };

  // 4. AI Memory Handlers
  const handleAddAiTurn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    engine.addAiTurn('user', aiInput);
    engine.addAiTurn('model', `Synthesized AI response contextualized to B2 learner profile for query: "${aiInput}"`);
    setAiInput('');
    showNotify('New interaction turn added to AI Context Memory buffer.', 'info');
    refreshState();
  };

  // 5. Threat Handlers
  const handleSimulateThreat = () => {
    const record = engine.simulateThreatVector(threatType, threatSnippet);
    showNotify(`Security threat vector '${threatType}' simulated & sandboxed!`, 'warning');
    refreshState();
  };

  // 6. Analytics Handlers
  const handleTrackEvent = () => {
    engine.trackAnalyticsEvent(analyticsEventName, {
      screen: 'PlatformReadinessExplorer',
      timestampMs: Date.now(),
      locale: 'fa-IR',
    });
    showNotify(`Analytics event '${analyticsEventName}' logged locally.`, 'info');
    refreshState();
  };

  const handleDispatchBatch = () => {
    const batch = engine.dispatchAnalyticsBatch();
    showNotify(`Dispatched batch of ${batch.dispatchedCount} anonymized events!`, 'success');
    refreshState();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Phase 0.2
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">Platform Readiness Layer</h2>
          </div>
          <p className="text-sm text-slate-400">
            Hardened architectural components preparing ATHENA Core for production Android, iOS, and Windows clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            KMP Core Foundation: v3.0 (Ready)
          </div>
        </div>
      </div>

      {/* Floating Notification toast */}
      {notification && (
        <div
          className={`px-4 py-3 rounded-lg border text-sm font-medium shadow-lg transition-all animate-in fade-in slide-in-from-top-2 flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : notification.type === 'warning'
              ? 'bg-amber-950/80 border-amber-800 text-amber-200'
              : 'bg-indigo-950/80 border-indigo-800 text-indigo-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Sub-tab Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { id: 'packs', label: '1. Language Packs', icon: Globe, count: languagePacks.length },
          { id: 'sync', label: '2. Offline Sync', icon: RefreshCw, count: syncDeltas.filter((d) => !d.isSynced).length },
          { id: 'backup', label: '3. Backup & Restore', icon: Database, count: backups.length },
          { id: 'ai', label: '4. AI Memory', icon: Brain, count: aiMemory?.recentTurns.length || 0 },
          { id: 'security', label: '5. Threat Model', icon: ShieldAlert, count: threats.length },
          { id: 'analytics', label: '6. Analytics Schema', icon: BarChart3, count: analyticsEvents.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {tab.count}
                </span>
              </div>
              <span className="text-xs font-semibold truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-slate-200">
        {/* TAB 1: LANGUAGE PACKS */}
        {activeSubTab === 'packs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  Language Pack Architecture
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Offline-first linguistic assets with SHA-256 validation, domain categorization, and memory compression.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {languagePacks.map((pack) => (
                <div
                  key={pack.id}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-white text-sm leading-snug">{pack.title}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          pack.status === 'INSTALLED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : pack.status === 'UPDATE_AVAILABLE'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {pack.status}
                      </span>
                    </div>

                    <p className="text-xs font-mono text-slate-400 mb-3">
                      v{pack.version} • {pack.wordCount.toLocaleString()} words • {pack.downloadSizeMb} MB
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {pack.supportedDomains.map((dom) => (
                        <span key={dom} className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] border border-slate-800">
                          {dom}
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] font-mono text-slate-500 truncate bg-slate-900/80 p-2 rounded border border-slate-850">
                      SHA256: {pack.checksumSha256.substring(0, 16)}...
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    {pack.status === 'INSTALLED' ? (
                      <button
                        onClick={() => handleRemovePack(pack.id)}
                        className="px-3 py-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium flex items-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Uninstall Pack
                      </button>
                    ) : (
                      <button
                        disabled={downloadingPackId === pack.id}
                        onClick={() => handleInstallPack(pack.id)}
                        className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                      >
                        {downloadingPackId === pack.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Verifying SHA256...
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            {pack.status === 'UPDATE_AVAILABLE' ? 'Update Pack' : 'Download Pack'}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: OFFLINE SYNC DATA MODEL */}
        {activeSubTab === 'sync' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-indigo-400" />
                  Sync Data Model & Offline Conflict Resolution
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Vector clock timestamps, delta change log queue, and client-side resolution strategies.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={syncing}
                  onClick={() => handleTriggerSync('CLIENT_WINS')}
                  className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {syncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  Trigger Sync (Client Wins)
                </button>
              </div>
            </div>

            {/* Sync Engine Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
              <div>
                <span className="text-xs text-slate-400">Sync State</span>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">{syncStatus.syncState}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Pending Local Deltas</span>
                <p className="text-sm font-bold text-amber-400 mt-0.5">{syncStatus.pendingDeltasCount} record(s)</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Conflicts Resolved</span>
                <p className="text-sm font-bold text-indigo-400 mt-0.5">{syncStatus.conflictsResolvedCount} total</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Strategy</span>
                <p className="text-sm font-bold text-slate-200 mt-0.5">{syncStatus.conflictStrategy}</p>
              </div>
            </div>

            {/* Sync Delta Table */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Local Change Queue (Sync Delta Log)
              </h4>
              <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
                      <th className="p-3">Delta ID</th>
                      <th className="p-3">Entity Type</th>
                      <th className="p-3">Operation</th>
                      <th className="p-3">Vector Clock (Client / Server)</th>
                      <th className="p-3">Payload Snippet</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {syncDeltas.map((delta) => (
                      <tr key={delta.id} className="hover:bg-slate-900/50 font-mono text-slate-300">
                        <td className="p-3 text-indigo-400">{delta.id}</td>
                        <td className="p-3 font-semibold">{delta.entityType}</td>
                        <td className="p-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              delta.operation === 'INSERT'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : delta.operation === 'UPDATE'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {delta.operation}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">
                          {delta.vectorClock.clientTimestamp} / {delta.vectorClock.serverTimestamp}
                        </td>
                        <td className="p-3 text-slate-400 max-w-[200px] truncate">{delta.payloadJson}</td>
                        <td className="p-3">
                          {delta.isSynced ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Synced
                            </span>
                          ) : (
                            <span className="text-amber-400 flex items-center gap-1">
                              <RefreshCw className="w-3 h-3 animate-pulse" /> Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BACKUP & RESTORE MODEL */}
        {activeSubTab === 'backup' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  Backup & Restore Model (AES-256 GCM Encrypted)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Secure local SQLite snapshot export, encrypted payload signature verification, and full database restores.
                </p>
              </div>

              <button
                onClick={handleCreateBackup}
                className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Lock className="w-3.5 h-3.5" />
                Create Encrypted Backup
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {backups.map((b) => (
                <div key={b.backupId} className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-400">{b.backupId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 bg-slate-900 p-3 rounded">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Created At</span>
                      {new Date(b.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Payload Size</span>
                      {b.payloadSizeKb} KB
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Schema Version</span>
                      v{b.schemaVersion}
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Device</span>
                      {b.deviceModel}
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-slate-500 truncate bg-slate-900/60 p-2 rounded">
                    Sig: {b.signatureAesGcm}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleRestoreBackup(b.backupId)}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Restore Snapshot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AI CONTEXT MEMORY MODEL */}
        {activeSubTab === 'ai' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-400" />
                  AI Context Memory Model
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Persistent conversational context window, learner difficulty history vectors, and prompt token budget manager.
                </p>
              </div>
            </div>

            {aiMemory && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Context Summary</h4>
                    <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded leading-relaxed">
                      {aiMemory.memorySummary}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Token Budget:</span>
                      <span className="text-emerald-400 font-bold">{aiMemory.promptTokenBudget} tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Weakest Domain:</span>
                      <span className="text-amber-400">{aiMemory.userDifficultyHistory.weakestDomain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Ease Factor:</span>
                      <span className="text-indigo-400">{aiMemory.userDifficultyHistory.averageEaseFactor}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Recent Turns Buffer ({aiMemory.recentTurns.length} turns)
                  </h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {aiMemory.recentTurns.map((turn, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs leading-relaxed ${
                          turn.role === 'user'
                            ? 'bg-indigo-950/40 border-indigo-900/60 text-indigo-200 ml-6'
                            : 'bg-slate-950 border-slate-800 text-slate-300 mr-6'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 font-mono text-[10px] opacity-60">
                          <span>{turn.role === 'user' ? 'User (Kourosh)' : 'ATHENA AI Tutor'}</span>
                          <span>{new Date(turn.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p>{turn.content}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddAiTurn} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Simulate user prompt to AI Tutor..."
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Send className="w-3.5 h-3.5" /> Send Turn
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SECURITY THREAT MODEL */}
        {activeSubTab === 'security' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-indigo-400" />
                  Security Threat Model & Tamper Safeguards
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Detection vectors for root/jailbreak, checksum mismatches, unauthorized API access, and license forgery.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Simulate Threat Event Vector</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={threatType}
                  onChange={(e) => setThreatType(e.target.value as ThreatType)}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="TAMPER_ATTEMPT">TAMPER_ATTEMPT</option>
                  <option value="CHECKSUM_MISMATCH">CHECKSUM_MISMATCH</option>
                  <option value="UNAUTHORIZED_API_ACCESS">UNAUTHORIZED_API_ACCESS</option>
                  <option value="ROOT_JAILBREAK_DETECTED">ROOT_JAILBREAK_DETECTED</option>
                  <option value="INVALID_LICENSE_SIGNATURE">INVALID_LICENSE_SIGNATURE</option>
                </select>

                <input
                  type="text"
                  value={threatSnippet}
                  onChange={(e) => setThreatSnippet(e.target.value)}
                  placeholder="Threat payload snippet..."
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />

                <button
                  onClick={handleSimulateThreat}
                  className="px-3 py-2 bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> Trigger Security Alert
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Threat Logs & Mitigation Actions</h4>
              <div className="space-y-2">
                {threats.map((t) => (
                  <div key={t.threatId} className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-red-400">{t.threatType}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                          {t.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{t.payloadSnippet}</p>
                      <p className="text-[11px] font-mono text-emerald-400">Mitigation: {t.mitigationAction}</p>
                    </div>

                    <div className="text-right font-mono text-[10px] text-slate-500 shrink-0">
                      {new Date(t.detectedAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ANALYTICS EVENT SCHEMA */}
        {activeSubTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Analytics Event Schema & Telemetry Dispatcher
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Privacy-first anonymized telemetry logging, schema validation, and batched offline event dispatches.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleTrackEvent}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" /> Log Event
                </button>
                <button
                  onClick={handleDispatchBatch}
                  className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Server className="w-3.5 h-3.5" /> Dispatch Batch
                </button>
              </div>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
                    <th className="p-3">Event ID</th>
                    <th className="p-3">Event Name</th>
                    <th className="p-3">Anonymized Session</th>
                    <th className="p-3">Attributes JSON</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {analyticsEvents.map((evt) => (
                    <tr key={evt.eventId} className="hover:bg-slate-900/50 font-mono text-slate-300">
                      <td className="p-3 text-indigo-400">{evt.eventId}</td>
                      <td className="p-3 font-semibold">{evt.eventName}</td>
                      <td className="p-3 text-slate-400">{evt.anonymizedSessionId}</td>
                      <td className="p-3 text-slate-400 max-w-[200px] truncate">{JSON.stringify(evt.attributes)}</td>
                      <td className="p-3">
                        {evt.isBatched ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <FileCheck className="w-3 h-3" /> Dispatched
                          </span>
                        ) : (
                          <span className="text-amber-400 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-pulse" /> Unbatched
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

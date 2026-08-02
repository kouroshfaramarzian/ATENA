import React, { useState, useEffect } from 'react';
import { Header, TabType } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { LiveSimulator } from './components/LiveSimulator';
import { AndroidMvpApp } from './components/AndroidMvpApp';
import { IntelligentReaderExplorer } from './components/IntelligentReaderExplorer';
import { PlatformReadinessExplorer } from './components/PlatformReadinessExplorer';
import { ArchitectureGraph } from './components/ArchitectureGraph';
import { CodeBrowser } from './components/CodeBrowser';
import { SchemaInspector } from './components/SchemaInspector';
import { UnitTestRunner } from './components/UnitTestRunner';
import { DeliverablesExport } from './components/DeliverablesExport';
import { AthenaCoreEngine } from './core/athenaCoreEngine';
import { AppLifecycleState } from './types/athena';
import { Cpu, Shield, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('android_mvp');
  const engine = AthenaCoreEngine.getInstance();
  const [coreState, setCoreState] = useState<AppLifecycleState>(engine.getState());
  const [dbVersion, setDbVersion] = useState<number>(engine.getDbVersion());

  useEffect(() => {
    // Auto initialize core engine on startup
    if (coreState === 'UNINITIALIZED') {
      engine.initializeCore().then(() => {
        setCoreState(engine.getState());
        setDbVersion(engine.getDbVersion());
      });
    }
  }, [coreState, engine]);

  const handleInitCore = async () => {
    await engine.initializeCore();
    setCoreState(engine.getState());
    setDbVersion(engine.getDbVersion());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        coreState={coreState}
        onInitCore={handleInitCore}
        dbVersion={dbVersion}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'overview' && (
          <DashboardOverview
            onSelectTab={setActiveTab}
            activeModuleCount={engine.getModules().filter((m) => m.status === 'ACTIVE').length}
          />
        )}

        {activeTab === 'android_mvp' && <AndroidMvpApp />}

        {activeTab === 'phase2_reader' && <IntelligentReaderExplorer />}

        {activeTab === 'simulator' && <LiveSimulator />}

        {activeTab === 'readiness' && <PlatformReadinessExplorer />}

        {activeTab === 'graph' && <ArchitectureGraph />}

        {activeTab === 'code' && <CodeBrowser />}

        {activeTab === 'schema' && <SchemaInspector />}

        {activeTab === 'tests' && <UnitTestRunner />}

        {activeTab === 'deliverables' && <DeliverablesExport />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              ATHENA Core Foundation Architecture — Phase 0
            </span>
            <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              v1.0.0-phase0
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              Offline-First SQLDelight Engine
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              Kotlin Multiplatform (KMP)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

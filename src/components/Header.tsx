import React from 'react';
import { AppLifecycleState } from '../types/athena';
import {
  Layers,
  Play,
  GitFork,
  Code2,
  Database,
  CheckCircle2,
  FileText,
  RefreshCw,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  BookOpen,
} from 'lucide-react';

export type TabType =
  | 'overview'
  | 'phase2_reader'
  | 'android_mvp'
  | 'simulator'
  | 'readiness'
  | 'graph'
  | 'code'
  | 'schema'
  | 'tests'
  | 'deliverables';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  coreState: AppLifecycleState;
  onInitCore: () => void;
  dbVersion: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  coreState,
  onInitCore,
  dbVersion,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'android_mvp', label: 'ATHENA Smart Dictionary v1.0', icon: Smartphone },
    { id: 'overview', label: 'Architecture Overview', icon: Layers },
    { id: 'phase2_reader', label: 'Intelligent Reader', icon: BookOpen },
    { id: 'simulator', label: 'Core Live Simulator', icon: Play },
    { id: 'readiness', label: 'Platform Readiness', icon: Cpu },
    { id: 'code', label: 'KMP Codebase', icon: Code2 },
    { id: 'schema', label: 'SQLDelight Schema', icon: Database },
    { id: 'tests', label: 'Unit Test Runner', icon: CheckCircle2 },
  ];

  const getStatusBadge = () => {
    switch (coreState) {
      case 'READY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            HARDENED CORE READY
          </span>
        );
      case 'INITIALIZING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400">
            <RefreshCw className="w-3 h-3 animate-spin" />
            BOOTSTRAPPING HARDENED CORE...
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 border border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400">
            UNINITIALIZED
          </span>
        );
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                ATHENA <span className="text-indigo-600 dark:text-indigo-400 font-normal">Core Foundation</span>
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-md border border-emerald-300 dark:border-emerald-800">
                Phase 0.1 Hardened
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kotlin Multiplatform Clean Architecture • Sealed Events • Learning Profile • Commercial Entitlements
            </p>
          </div>
        </div>

        {/* System Controls */}
        <div className="flex items-center gap-3">
          {getStatusBadge()}

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>SQLDelight v{dbVersion}</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <ShieldAlert className="w-3 h-3" />
            <span>Pro License Active</span>
          </div>

          <button
            onClick={onInitCore}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${coreState === 'INITIALIZING' ? 'animate-spin' : ''}`} />
            {coreState === 'READY' ? 'Re-Initialize Core' : 'Initialize Core'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto scrollbar-none border-t border-slate-100 dark:border-slate-800/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-medium border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

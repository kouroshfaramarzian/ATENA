import React from 'react';
import { MODULE_DOCS, HARDENING_PHASE_DOCS } from '../data/architectureDocs';
import { TabType } from './Header';
import {
  Cpu,
  Sliders,
  Boxes,
  Radio,
  Plug,
  Database,
  Lock,
  ArrowUpRight,
  Terminal,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  UserCheck,
  BookOpen,
  FileCode,
  Gauge,
  Award,
} from 'lucide-react';

interface DashboardOverviewProps {
  onSelectTab: (tab: TabType) => void;
  activeModuleCount: number;
}

const moduleIcons: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Cpu,
  2: Sliders,
  3: Boxes,
  4: Radio,
  5: Plug,
  6: UserCheck,
  7: Database,
  8: Lock,
  9: ArrowUpRight,
  10: Terminal,
};

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onSelectTab,
  activeModuleCount,
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Architecture Card with Hardening Phase 0.1 & Phase 0.2 Highlights */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 0.1 — Core Hardening Complete</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>Phase 0.2 — Platform Readiness Ready</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ATHENA Hardened Core Architecture Specification
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            ساختار نهایی شده دامنه ATHENA شامل رویدادهای Sealed Class، تفکیک Learning Profile، لایسنس تجاری و ۶ کامپوننت آمادگی پلتفرم Phase 0.2 (Language Packs, Sync Engine, Encrypted Backup, AI Memory, Threat Model, Analytics Schema).
          </p>

          {/* Quick Metrics */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Core Modules</span>
              <span className="text-xl font-bold text-white">10 + 6 Readiness</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Language Packs</span>
              <span className="text-xl font-bold text-indigo-300">SHA-256 Validated</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">Sync Vector Clocks</span>
              <span className="text-xl font-bold text-emerald-400">Offline-First</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400 block font-medium">AES-256 Backups</span>
              <span className="text-xl font-bold text-amber-300">GCM Signed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 0.1 Hardening Upgrades Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              جزئیات اصلاحات و سخت‌سازی ۶‌گانه Phase 0.1 Hardening
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ستون فقرات دامنه ATHENA قبل از پیاده‌سازی رابط کاربری اندروید
            </p>
          </div>
          <button
            onClick={() => onSelectTab('simulator')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 cursor-pointer"
          >
            <span>تست زنده در Simulator</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                <Radio className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">۱. Domain Events</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              رویدادهای تایپ‌شده Sealed Class مانند WordAdded و WordReviewed جهت اتصال آنالیتیکس و هوش مصنوعی.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                <UserCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">۲. Learning Profile</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              تفکیک کامل کاربر پایه از پروفایل یادگیری تخصصی (سطح CEFR، اهداف، نقاط ضعف و زبان توضیحات).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">۳. Enriched Word Model</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              مدل چندوجهی Word شامل IPA، معانی به تفکیک نقش دستور، دامنه‌های تخصصی و تاریخچه مرور لایتنر.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">۴. License Entitlements</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              لایسنس تجاری محصول با سقف فعال‌سازی ۳ دستگاه، لایسنس زبان‌ها و امضای دیجیتال ECDSA.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                <FileCode className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">۵. Provider API Contracts</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              اینترفیس‌های رسمی DictionaryProvider, VoiceProvider, AIProvider و GrammarProvider.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold">
                <Gauge className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">۶. 100k+ Stress Benchmark</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              شبیه‌سازی و تست عملکرد دیتابیس روی ۱۰۰,۰۰۰ کلمه و ۱,۰۰۰,۰۰۰ مرور جهت تضمین مقیاس‌پذیری.
            </p>
          </div>
        </div>
      </div>

      {/* 10 Core Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              ۱۰ ماژول اصلی هسته ATHENA (معماری Hardened KMP)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ارزیابی جزئیات، رابط‌ها و مسئولیت‌های هر ماژول
            </p>
          </div>
          <button
            onClick={() => onSelectTab('simulator')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
          >
            <span>شبیه‌سازی زنده در Simulator</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODULE_DOCS.map((mod) => {
            const IconComponent = moduleIcons[mod.id] || Boxes;
            return (
              <div
                key={mod.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider block">
                          Module {mod.id}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {mod.titleEn}
                        </h4>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {mod.deliverableName}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {mod.descriptionFa}
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs space-y-1.5 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">مسئولیت:</span>
                      <span className="text-slate-500 dark:text-slate-400">{mod.responsibility}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">رابط‌ها:</span>
                      <div className="flex flex-wrap gap-1">
                        {mod.interfaces.map((iface) => (
                          <span
                            key={iface}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40"
                          >
                            {iface}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                  <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>تست‌های ساختاری تایید شد</span>
                  </span>

                  <button
                    onClick={() => onSelectTab('code')}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium inline-flex items-center gap-1 text-xs cursor-pointer"
                  >
                    <span>مشاهده کد KMP</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

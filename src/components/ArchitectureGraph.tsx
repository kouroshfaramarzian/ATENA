import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Database,
  Radio,
  Sliders,
  Boxes,
  Plug,
  Lock,
  ArrowUpRight,
  Terminal,
  Smartphone,
  Monitor,
  Apple,
  ArrowDown,
  Info,
} from 'lucide-react';

export const ArchitectureGraph: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string | null>('domain');

  const layers = [
    {
      id: 'interface',
      name: 'Interface Layer (Presentation & Platform Bindings)',
      color: 'border-purple-500 bg-purple-500/5 dark:bg-purple-950/20',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
      description: 'لایه‌ای که UI و پلتفرم‌های مختلف (Android / Windows / iOS) به StateFlow های Core متصل می‌شوند.',
      components: [
        { name: 'Android Target (Jetpack Compose)', icon: Smartphone },
        { name: 'Windows Target (JVM / Compose Desktop)', icon: Monitor },
        { name: 'iOS Target (SwiftUI / KMP Bridge)', icon: Apple },
      ],
    },
    {
      id: 'application',
      name: 'Application Layer (Use Cases & Core Logic)',
      color: 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-950/20',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
      description: 'هدایت چرخه‌حیات سیستم، موتور کانفیگ، مدیریت رویدادها و مدیریت پلاگین‌ها.',
      components: [
        { name: 'ApplicationCore (Module 1)', icon: Cpu },
        { name: 'ConfigurationEngine (Module 2)', icon: Sliders },
        { name: 'ModuleManager (Module 3)', icon: Boxes },
        { name: 'AthenaEventBus (Module 4)', icon: Radio },
        { name: 'PluginManager (Module 5)', icon: Plug },
        { name: 'AthenaLogger (Module 10)', icon: Terminal },
      ],
    },
    {
      id: 'domain',
      name: 'Domain Layer (Pure Business Core & DDD Entities)',
      color: 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
      description: 'مستقل از همه چیز. تعریف خالص داده‌ها شامل User, Language, Word, LearningItem, Setting, Device, License.',
      components: [
        { name: 'Data Model Layer (Module 6)', icon: Layers },
        { name: 'Repository Interfaces', icon: Database },
      ],
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure Layer (Storage, Security & Drivers)',
      color: 'border-amber-500 bg-amber-500/5 dark:bg-amber-950/20',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      description: 'پیاده‌سازی فیزیکی SQLite دیتابیس با SQLDelight، موتور مهاجرت اسکیما و کلیدهای رمزنگاری.',
      components: [
        { name: 'LocalStorageEngine (Module 7)', icon: Database },
        { name: 'EncryptionEngine (Module 8)', icon: Lock },
        { name: 'MigrationEngine (Module 9)', icon: ArrowUpRight },
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Clean Architecture &amp; Module Dependency Diagram
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          نمودار لایه‌بندی ۴ گانه ATHENA و جهت جریان وابستگی‌ها (Inward Dependency Rule)
        </p>
      </div>

      {/* Layer Diagram Stack */}
      <div className="space-y-4">
        {layers.map((layer, idx) => (
          <React.Fragment key={layer.id}>
            <div
              onClick={() => setSelectedLayer(layer.id)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-2xs ${layer.color} ${
                selectedLayer === layer.id ? 'ring-2 ring-indigo-500 scale-[1.01]' : 'hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${layer.badgeColor}`}>
                    Layer {idx + 1}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {layer.name}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
                {layer.description}
              </p>

              {/* Component Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {layer.components.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div
                      key={c.name}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center gap-1.5 shadow-2xs"
                    >
                      <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200 leading-tight">
                        {c.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {idx < layers.length - 1 && (
              <div className="flex justify-center my-1">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-500 border border-slate-200 dark:border-slate-700">
                  <ArrowDown className="w-3.5 h-3.5 text-indigo-500 animate-bounce" />
                  <span>Depends on inner layers (Inward Dependency Rule)</span>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Selected Layer Info */}
      {selectedLayer && (
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-indigo-900 dark:text-indigo-200">
              قانون کلیدی Clean Architecture در ATHENA:
            </h4>
            <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed">
              لایه‌های بیرونی (Infrastructure و Interface) از لایه‌های داخلی (Domain و Application) آگاه هستند، اما لایه Domain هیچ‌گونه دانش یا وابستگی به دیتابیس، سیستم‌عامل، فریم‌ورک‌های گرافیکی یا کتابخانه‌های خارجی ندارد.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

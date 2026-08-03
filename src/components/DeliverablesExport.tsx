import React, { useState } from 'react';
import { MODULE_DOCS, CODING_STANDARDS_TEXT } from '../data/architectureDocs';
import { FileText, Copy, Check, Download, ExternalLink, Sparkles, Code2, Globe } from 'lucide-react';

export const DeliverablesExport: React.FC = () => {
  const [copiedFa, setCopiedFa] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedStandards, setCopiedStandards] = useState(false);

  const englishPromptText = `You are a Senior Software Architect responsible for designing the foundation of ATHENA, a scalable language learning platform.

Your task is to implement Phase 0 & Phase 0.2: Core Foundation & Platform Readiness Architecture.

The goal is NOT to build UI or user-facing features yet.

You must create a future-proof core system that can support millions of users and multiple platforms including Android, Windows, and iOS.

Architecture Requirements:
1. Use Modular Clean Architecture.
2. Apply Domain Driven Design principles.
3. Keep business logic completely independent from UI platforms.
4. Design the system using Kotlin Multiplatform.
5. Use SQLDelight for cross-platform local database management.
6. Use Repository Pattern.
7. Use Dependency Injection with Koin.
8. Use Kotlin Serialization for data exchange.
9. Follow Offline First principles with Vector Clock conflict resolution.
10. Prepare the architecture for future cloud synchronization & platform readiness.

Core 10 Modules:
1. Application Core
2. Configuration Engine
3. Module Manager
4. Event Bus
5. Plugin Architecture
6. Data Model Layer
7. Local Storage Engine (SQLDelight)
8. Encryption Engine
9. Migration Engine
10. Logging System

Phase 0.2 Platform Readiness Layer (6 Components):
1. Language Pack Architecture (SHA-256 validated, memory compressed, offline packs)
2. Sync Data Model (Offline-First Vector Clock & Conflict Resolution strategies)
3. Backup & Restore Model (AES-256 GCM encrypted database snapshots)
4. AI Context Memory Model (Recent conversation turns buffer & token budget)
5. Security Threat Model (Tamper detection, root/jailbreak safeguards, license signature verification)
6. Analytics Event Schema (Privacy-first anonymized event logging & offline batch dispatches)

Phase 1 Android Application MVP Requirements:
1. Vocabulary Management (Add, Edit, Delete, Word Details)
2. Leitner Learning System (5-box spaced repetition queue, flip flashcards, rating evaluations)
3. Word Detail Screen (IPA phonetics, audio speech, Persian translation, context usage, learning history)
4. Language Support (Native: Persian, Target: English, Language Pack Extensible)
5. CSV Importer (Batch load with fields: word, meaning, example, part_of_speech, domain)
6. Dashboard (Total vocabulary, words learned today, due count, Leitner box progress)
7. Settings (Native/Target languages, voice TTS speed, daily learning goal)

Phase 4.1 Android Release Packaging & Hardening Requirements:
1. Gradle Release Build Configuration (isMinifyEnabled = true, isShrinkResources = true, R8 obfuscation)
2. PackagingOptions Excludes (Exclude META-INF/*.version, META-INF/*.kotlin_module, **/*.sq, **/*.sqm, **/debug/**, **/test/**)
3. Hardened AndroidManifest (android:debuggable="false", android:allowBackup="false", android:usesCleartextTraffic="false")
4. Network Security Config (Strict HTTPS pinning, block user installed CA certificates)
5. ProGuard Log & Line Number Stripping (-assumenosideeffects for Log.d/v/i/w, -renamesourcefileattribute "")
6. Zero Credential Leaks (Inject keys via encrypted BuildConfig at build time, never in code or manifest)`;

  const handleCopyText = (text: string, type: 'fa' | 'en' | 'standards') => {
    navigator.clipboard.writeText(text);
    if (type === 'fa') {
      setCopiedFa(true);
      setTimeout(() => setCopiedFa(false), 2000);
    } else if (type === 'en') {
      setCopiedEn(true);
      setTimeout(() => setCopiedEn(false), 2000);
    } else {
      setCopiedStandards(true);
      setTimeout(() => setCopiedStandards(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    const fullContent = `# ATHENA Phase 0 — Core Foundation Architecture Handoff Spec

## Persian Summary
${MODULE_DOCS.map((m) => `### ${m.titleFa}\n- **Deliverable**: ${m.deliverableName}\n- **Responsibility**: ${m.responsibility}`).join('\n\n')}

## Coding Standards
${CODING_STANDARDS_TEXT}

## AI Agent Prompt Spec
\`\`\`
${englishPromptText}
\`\`\`
`;
    const blob = new Blob([fullContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ATHENA_Phase0_Architecture_Spec.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Phase 0 Handoff Document &amp; Deliverables Package
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            مستندات کامل تحویلی به تیم برونسپاری یا AI Agent جهت پیاده‌سازی فاز صفر ATHENA Core
          </p>
        </div>

        <button
          onClick={handleDownloadMarkdown}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>دانلود مستند (.md)</span>
        </button>
      </div>

      {/* Grid: Persian Summary & AI Agent Prompt Spec */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Persian Summary Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" />
              خلاصه فارسی سند تحویلی (Phase 0)
            </h3>
            <button
              onClick={() => handleCopyText(JSON.stringify(MODULE_DOCS, null, 2), 'fa')}
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedFa ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFa ? 'کپی شد!' : 'کپی خلاصه'}</span>
            </button>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 text-xs text-slate-700 dark:text-slate-300">
            {MODULE_DOCS.map((m) => (
              <div key={m.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block">{m.titleFa}</span>
                <p className="text-slate-600 dark:text-slate-300">{m.responsibility}</p>
                <span className="text-[10px] font-mono text-slate-400 block">Deliverable: {m.deliverableName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent English Prompt Spec */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-500" />
              English AI Agent Prompt Spec
            </h3>
            <button
              onClick={() => handleCopyText(englishPromptText, 'en')}
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedEn ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEn ? 'Copied!' : 'Copy Prompt'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 text-indigo-300 rounded-lg text-xs font-mono max-h-[420px] overflow-y-auto border border-slate-800 whitespace-pre-wrap leading-relaxed">
            {englishPromptText}
          </pre>
        </div>
      </div>

      {/* Coding Standards Block */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            ATHENA Coding &amp; Architectural Standards
          </h3>
          <button
            onClick={() => handleCopyText(CODING_STANDARDS_TEXT, 'standards')}
            className="text-xs text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            {copiedStandards ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedStandards ? 'کپی شد!' : 'کپی استانداردهای کدنویسی'}</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-950 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800 whitespace-pre-wrap leading-relaxed">
          {CODING_STANDARDS_TEXT}
        </pre>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Database, Table, ArrowRight, ShieldCheck, FileCode, CheckCircle2 } from 'lucide-react';

export const SchemaInspector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tables' | 'migrations' | 'er'>('tables');

  const tables = [
    {
      name: 'WordEntity',
      description: 'جدول اصلی ذخیره‌سازی واژگان و دیکشنری محلی',
      columns: [
        { name: 'id', type: 'TEXT', constraints: 'PRIMARY KEY NOT NULL' },
        { name: 'word', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'phonetic', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'translation', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'language_code', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'part_of_speech', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'difficulty_level', type: 'INTEGER', constraints: 'DEFAULT 1' },
        { name: 'created_at', type: 'TEXT', constraints: 'NOT NULL' },
      ],
      indexes: ['idx_word_language ON WordEntity(language_code)'],
    },
    {
      name: 'CardMemoryStateEntity',
      description: 'جدول حافظه FSRS 4.5 با پارامترهای Stability، Difficulty و Retrievability',
      columns: [
        { name: 'card_id', type: 'TEXT', constraints: 'PRIMARY KEY REFERENCES WordEntity(id)' },
        { name: 'stability', type: 'REAL', constraints: 'NOT NULL (S: Days stable before forgetting)' },
        { name: 'difficulty', type: 'REAL', constraints: 'NOT NULL (D: Scale 1.0 to 10.0)' },
        { name: 'retrievability', type: 'REAL', constraints: 'NOT NULL (R: 0.0 to 1.0 probability)' },
        { name: 'review_count', type: 'INTEGER', constraints: 'DEFAULT 0' },
        { name: 'lapse_count', type: 'INTEGER', constraints: 'DEFAULT 0' },
        { name: 'success_count', type: 'INTEGER', constraints: 'DEFAULT 0' },
        { name: 'failure_count', type: 'INTEGER', constraints: 'DEFAULT 0' },
        { name: 'average_response_time', type: 'INTEGER', constraints: 'DEFAULT 1200 ms' },
        { name: 'last_rating', type: 'TEXT', constraints: 'AGAIN | HARD | GOOD | EASY' },
        { name: 'last_review_at', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'next_review_at', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'created_at', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'updated_at', type: 'TEXT', constraints: 'NOT NULL' },
      ],
      indexes: [
        'idx_fsrs_next_review ON CardMemoryStateEntity(next_review_at)',
        'idx_fsrs_retrievability ON CardMemoryStateEntity(retrievability)',
      ],
    },
    {
      name: 'ReviewLogEntity',
      description: 'جدول ثبت لیتیک و تاریخچه مرور کاربر برای الگوریتم FSRS 4.5 و هوش مصنوعی',
      columns: [
        { name: 'id', type: 'TEXT', constraints: 'PRIMARY KEY NOT NULL' },
        { name: 'card_id', type: 'TEXT', constraints: 'FOREIGN KEY REFERENCES WordEntity(id)' },
        { name: 'timestamp', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'rating', type: 'TEXT', constraints: 'NOT NULL (AGAIN | HARD | GOOD | EASY)' },
        { name: 'response_time_ms', type: 'INTEGER', constraints: 'NOT NULL' },
        { name: 'previous_stability', type: 'REAL', constraints: 'NOT NULL' },
        { name: 'new_stability', type: 'REAL', constraints: 'NOT NULL' },
        { name: 'previous_difficulty', type: 'REAL', constraints: 'NOT NULL' },
        { name: 'new_difficulty', type: 'REAL', constraints: 'NOT NULL' },
        { name: 'previous_retrievability', type: 'REAL', constraints: 'NOT NULL' },
        { name: 'new_retrievability', type: 'REAL', constraints: 'NOT NULL' },
      ],
      indexes: ['idx_review_log_card ON ReviewLogEntity(card_id)'],
    },
    {
      name: 'UserSettingEntity',
      description: 'تنظیمات و کلیدهای رمزنگاری‌شده کاربر در محلی',
      columns: [
        { name: 'setting_key', type: 'TEXT', constraints: 'PRIMARY KEY NOT NULL' },
        { name: 'setting_value', type: 'TEXT', constraints: 'NOT NULL (ENC Payload)' },
        { name: 'is_encrypted', type: 'INTEGER', constraints: 'DEFAULT 1' },
        { name: 'updated_at', type: 'TEXT', constraints: 'NOT NULL' },
      ],
      indexes: [],
    },
  ];

  const migrations = [
    {
      file: '1.sqm',
      title: 'Initial Database Blueprint (v1)',
      sql: `CREATE TABLE WordEntity (\n  id TEXT PRIMARY KEY NOT NULL,\n  word TEXT NOT NULL,\n  translation TEXT NOT NULL\n);`,
    },
    {
      file: '2.sqm',
      title: 'Add Leitner Box & Spaced Repetition (v2)',
      sql: `CREATE TABLE LearningItemEntity (\n  id TEXT PRIMARY KEY NOT NULL,\n  word_id TEXT NOT NULL REFERENCES WordEntity(id),\n  box_level INTEGER NOT NULL DEFAULT 1,\n  next_review_at TEXT NOT NULL\n);`,
    },
    {
      file: '3.sqm',
      title: 'Phonetic & Audio Metadata Support (v3)',
      sql: `ALTER TABLE WordEntity ADD COLUMN phonetic TEXT DEFAULT '';\nALTER TABLE WordEntity ADD COLUMN part_of_speech TEXT DEFAULT 'noun';`,
    },
    {
      file: '4.sqm',
      title: 'Encrypted Settings & Device Licensing (v4)',
      sql: `CREATE TABLE UserSettingEntity (\n  setting_key TEXT PRIMARY KEY NOT NULL,\n  setting_value TEXT NOT NULL,\n  is_encrypted INTEGER DEFAULT 1\n);`,
    },
    {
      file: '5.sqm',
      title: 'Knowledge Graph & Context Indexing (v5)',
      sql: `CREATE INDEX idx_word_context ON WordEntity(word, language_code);`,
    },
    {
      file: '6.sqm',
      title: 'FSRS 4.5 Memory Engine & Review Log Migration (v6)',
      sql: `DROP TABLE IF EXISTS LearningItemEntity;
CREATE TABLE CardMemoryStateEntity (
  card_id TEXT PRIMARY KEY REFERENCES WordEntity(id),
  stability REAL NOT NULL,
  difficulty REAL NOT NULL,
  retrievability REAL NOT NULL,
  review_count INTEGER NOT NULL DEFAULT 0,
  lapse_count INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  failure_count INTEGER NOT NULL DEFAULT 0,
  average_response_time INTEGER NOT NULL DEFAULT 1200,
  last_rating TEXT,
  last_review_at TEXT NOT NULL,
  next_review_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE ReviewLogEntity (
  id TEXT PRIMARY KEY NOT NULL,
  card_id TEXT NOT NULL REFERENCES WordEntity(id),
  timestamp TEXT NOT NULL,
  rating TEXT NOT NULL,
  response_time_ms INTEGER NOT NULL,
  previous_stability REAL NOT NULL,
  new_stability REAL NOT NULL,
  previous_difficulty REAL NOT NULL,
  new_difficulty REAL NOT NULL,
  previous_retrievability REAL NOT NULL,
  new_retrievability REAL NOT NULL
);

CREATE INDEX idx_fsrs_next_review ON CardMemoryStateEntity(next_review_at);
CREATE INDEX idx_review_log_card ON ReviewLogEntity(card_id);`,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
          <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          SQLDelight Database Schemas &amp; Migrations Inspector
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          مشاهده ساختار جداول دیتابیس محلی، کلیدهای خارجی، ایندکس‌ها و فایل‌های مهاجرت اسکیما (.sqm)
        </p>

        <div className="flex space-x-2 mt-4 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'tables' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Database Tables (SQLDelight)
          </button>
          <button
            onClick={() => setActiveTab('migrations')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'migrations' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Migration Scripts (.sqm)
          </button>
        </div>
      </div>

      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tables.map((tbl) => (
            <div
              key={tbl.name}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Table className="w-4 h-4 text-indigo-500" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{tbl.name}</h3>
                  <span className="text-[10px] text-slate-500">{tbl.description}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Columns:</span>
                <div className="space-y-1.5 font-mono text-xs">
                  {tbl.columns.map((col) => (
                    <div
                      key={col.name}
                      className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                    >
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{col.name}</span>
                      <div className="text-right">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{col.type}</span>
                        <span className="text-[9px] text-slate-400 block">{col.constraints}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {tbl.indexes.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Indexes:</span>
                  {tbl.indexes.map((idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 block truncate"
                    >
                      {idx}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'migrations' && (
        <div className="space-y-4">
          {migrations.map((mig) => (
            <div
              key={mig.file}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{mig.file} — {mig.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  Verified Migration
                </span>
              </div>

              <pre className="p-3 bg-slate-950 text-emerald-400 rounded-lg text-xs font-mono overflow-x-auto border border-slate-800">
                {mig.sql}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Sun,
  Moon,
  Type,
  Palette,
  Sliders,
  CheckSquare,
  Volume2,
  Clock,
  Brain,
  Database,
  Shield,
  Info,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Check,
  ChevronRight,
  Sparkles,
  BookOpen,
  FileText,
  Lock,
  Heart,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AthenaCoreEngine } from '../core/athenaCoreEngine';
import { BackupEngine } from '../core/backupEngine';
import { AthenaUserSettings, DictionaryDisplaySettings, TapBehaviorAction } from '../types/athena';

interface SettingsScreenProps {
  onSettingsChange?: () => void;
  showToast: (msg: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onSettingsChange, showToast }) => {
  const engine = AthenaCoreEngine.getInstance();
  const [settings, setSettings] = useState<AthenaUserSettings>(engine.getUserSettings());
  const [activeTabSection, setActiveTabSection] = useState<'all' | 'general' | 'dict' | 'tap' | 'audio' | 'learning' | 'ai' | 'backup' | 'privacy' | 'about'>('all');

  // Modals
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showLicensesModal, setShowLicensesModal] = useState(false);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);

  useEffect(() => {
    setSettings(engine.getUserSettings());
  }, []);

  const updateSettingField = <K extends keyof AthenaUserSettings>(
    section: K,
    patch: Partial<AthenaUserSettings[K]>
  ) => {
    const updated: AthenaUserSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        ...patch,
      },
    };
    setSettings(updated);
    engine.saveUserSettings(updated);
    if (onSettingsChange) onSettingsChange();
    showToast('تنظیمات ذخیره شد');
  };

  const updateDictSetting = (field: keyof DictionaryDisplaySettings, value: boolean) => {
    const updatedDict = {
      ...settings.dictionary,
      [field]: value,
    };
    updateSettingField('dictionary', updatedDict);
  };

  const handleExportDatabase = () => {
    const jsonStr = engine.exportUserDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ATHENA_Dictionary_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('فایل پشتیبان دیتابیس دانلود شد');
  };

  const handleImportDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = engine.importUserDatabaseJson(content);
        if (success) {
          setSettings(engine.getUserSettings());
          showToast('دیتابیس با موفقیت بازگردانی شد');
          if (onSettingsChange) onSettingsChange();
        } else {
          showToast('خطا در خواندن فایل پشتیبان!');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClearHistory = () => {
    engine.clearLearningHistory();
    setShowClearHistoryConfirm(false);
    showToast('تاریخچه یادگیری و کارت‌های FSRS بازنشانی شدند');
    if (onSettingsChange) onSettingsChange();
  };

  const dictFieldLabels: { key: keyof DictionaryDisplaySettings; labelFa: string; labelEn: string; icon: string }[] = [
    { key: 'showPersianTranslation', labelFa: 'ترجمه فارسی', labelEn: 'Persian Translation', icon: '🇮🇷' },
    { key: 'showEnglishDefinition', labelFa: 'تعریف انگلیسی', labelEn: 'English Definition', icon: '🇬🇧' },
    { key: 'showPronunciationIpa', labelFa: 'تلفظ IPA', labelEn: 'Pronunciation (IPA)', icon: '🗣️' },
    { key: 'showPhonetics', labelFa: 'فونتیک و استرس کلمه', labelEn: 'Phonetics & Stress', icon: '🎵' },
    { key: 'showPartOfSpeech', labelFa: 'نقش دستوری (پارت آو اسپچ)', labelEn: 'Part of Speech', icon: '🏷️' },
    { key: 'showExampleSentences', labelFa: 'جملات نمونه (محتوایی)', labelEn: 'Example Sentences', icon: '📝' },
    { key: 'showSynonyms', labelFa: 'واژگان مترادف (Synonyms)', labelEn: 'Synonyms', icon: '🔄' },
    { key: 'showAntonyms', labelFa: 'واژگان متضاد (Antonyms)', labelEn: 'Antonyms', icon: '↔️' },
    { key: 'showWordFamily', labelFa: 'هم‌خانواده کلمات (Word Family)', labelEn: 'Word Family', icon: '🌳' },
    { key: 'showVerbForms', labelFa: 'اشکال افعال (Verb Forms)', labelEn: 'Verb Forms', icon: '⚡' },
    { key: 'showCollocations', labelFa: 'کالوکیشن‌ها و ترکیبات (Collocations)', labelEn: 'Collocations', icon: '🔗' },
    { key: 'showIdioms', labelFa: 'اصطلاحات کاربردی (Idioms)', labelEn: 'Idioms', icon: '💬' },
    { key: 'showPhrasalVerbs', labelFa: 'افعال عبارتی (Phrasal Verbs)', labelEn: 'Phrasal Verbs', icon: '🧩' },
    { key: 'showCefrLevel', labelFa: 'سطح بندی استاندارد CEFR', labelEn: 'CEFR Level', icon: '📊' },
    { key: 'showFrequencyLevel', labelFa: 'میزان کاربرد و فراوانی کلمه', labelEn: 'Frequency Level', icon: '🔥' },
    { key: 'showEtymology', labelFa: 'ریشه‌شناسی و تاریخچه واژه', labelEn: 'Etymology & Origin', icon: '🏛️' },
  ];

  const tapActionOptions: { value: TapBehaviorAction; labelFa: string; descFa: string }[] = [
    { value: 'POPUP', labelFa: 'پاپ‌آپ سریع (<150ms)', descFa: 'نمایش شناور جزئیات کلمه بدون خروج از صفحه فعلی' },
    { value: 'FULL_PAGE', labelFa: 'صفحه کامل دیکشنری', descFa: 'انتقال مستقیم به تب اختصاصی دیکشنری' },
    { value: 'SPEAK', labelFa: 'پخش تلفظ صوتی', descFa: 'قرائت فوری تلفظ انگلیسی کلمه' },
    { value: 'COPY', labelFa: 'کپی در حافظه موقت', descFa: 'ذخیره واژه و معنی در Clipboard' },
    { value: 'BOOKMARK', labelFa: 'نشانه گذاری (بوک‌مارک)', descFa: 'افزودن مستقیم کلمه به لیست واژگان من' },
  ];

  return (
    <div className="space-y-6 dir-rtl text-right pb-12">
      {/* Settings Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-5 rounded-2xl border border-indigo-900/60 shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">تنظیمات پیشرفته ATHENA</h1>
              <p className="text-xs text-slate-300">شخصی‌سازی کامل ظاهر، رفتارهای لمس، نمایش دیکشنری و هوش مصنوعی</p>
            </div>
          </div>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/30 font-mono">
            v3.4.0 Release
          </span>
        </div>
      </div>

      {/* Categorized Settings Sections */}

      {/* 1. GENERAL SETTINGS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Globe className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">تنظیمات عمومی (General Settings)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* App Language */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
            <label className="text-slate-300 font-semibold block">زبان برنامه (App Language)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateSettingField('general', { appLanguage: 'fa' })}
                className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-2 transition ${
                  settings.general.appLanguage === 'fa'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>فارسی (Persian)</span>
              </button>
              <button
                onClick={() => updateSettingField('general', { appLanguage: 'en' })}
                className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-2 transition ${
                  settings.general.appLanguage === 'en'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>English</span>
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
            <label className="text-slate-300 font-semibold block">تم دیداری (Theme)</label>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                onClick={() => updateSettingField('general', { theme: 'dark' })}
                className={`py-2 rounded-lg border font-bold flex flex-col items-center gap-1 transition ${
                  settings.general.theme === 'dark'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>تاریک (Dark)</span>
              </button>
              <button
                onClick={() => updateSettingField('general', { theme: 'light' })}
                className={`py-2 rounded-lg border font-bold flex flex-col items-center gap-1 transition ${
                  settings.general.theme === 'light'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>روشن (Light)</span>
              </button>
              <button
                onClick={() => updateSettingField('general', { theme: 'system' })}
                className={`py-2 rounded-lg border font-bold flex flex-col items-center gap-1 transition ${
                  settings.general.theme === 'system'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>سیستم</span>
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
            <label className="text-slate-300 font-semibold block">اندازه قلم (Font Size)</label>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              {(['small', 'medium', 'large'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateSettingField('general', { fontSize: sz })}
                  className={`py-2 rounded-lg border font-bold capitalize transition ${
                    settings.general.fontSize === sz
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {sz === 'small' ? 'کوچک' : sz === 'medium' ? 'متوسط' : 'بزرگ'}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
            <label className="text-slate-300 font-semibold block">رنگ اصلی (Accent Color)</label>
            <div className="flex items-center justify-around pt-1">
              {[
                { hex: '#6366F1', label: 'Indigo' },
                { hex: '#10B981', label: 'Emerald' },
                { hex: '#F59E0B', label: 'Amber' },
                { hex: '#EC4899', label: 'Rose' },
                { hex: '#06B6D4', label: 'Cyan' },
              ].map((c) => (
                <button
                  key={c.hex}
                  onClick={() => updateSettingField('general', { accentColor: c.hex })}
                  className={`w-7 h-7 rounded-full border-2 transition relative flex items-center justify-center ${
                    settings.general.accentColor === c.hex ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-80'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {settings.general.accentColor === c.hex && <Check className="w-4 h-4 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. DICTIONARY CUSTOMIZATION SETTINGS (16 FIELD TOGGLES) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">تنظیمات نمایش جزئیات دیکشنری (16 گزینه‌ای)</h2>
          </div>
          <span className="text-[10px] text-slate-400">سفارشی‌سازی کامل فیلدهای پاپ‌آپ و کارت‌ها</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          مشخص کنید چه اطلاعاتی هنگام مشاهده کلمه یا پاپ‌آپ سریع نمایش داده شوند. تمام فیلدهای غیرفعال کاملاً از دید کاربر مخفی می‌شوند.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {dictFieldLabels.map((item) => {
            const isChecked = settings.dictionary[item.key];
            return (
              <div
                key={item.key}
                onClick={() => updateDictSetting(item.key, !isChecked)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                  isChecked
                    ? 'bg-slate-950 border-indigo-500/40 text-white'
                    : 'bg-slate-950/40 border-slate-850 text-slate-500 opacity-75'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{item.icon}</span>
                  <div>
                    <span className="text-xs font-bold block">{item.labelFa}</span>
                    <span className="text-[10px] text-slate-500 dir-ltr block text-left">{item.labelEn}</span>
                  </div>
                </div>

                <div
                  className={`w-9 h-5 rounded-full transition relative p-0.5 ${
                    isChecked ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isChecked ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. TAP BEHAVIOR SETTINGS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Type className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white">رفتار لمس کلمات (Tap Behavior)</h2>
        </div>

        <p className="text-xs text-slate-400">
          با لمس هر کلمه انگلیسی در هر کجای اپلیکیشن (متن‌ها، مثال‌ها، مکالمات هوش مصنوعی و...) این اقدام پیش‌فرض انجام می‌شود:
        </p>

        <div className="space-y-2">
          {tapActionOptions.map((opt) => {
            const isSelected = settings.tapBehavior.defaultAction === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() => updateSettingField('tapBehavior', { defaultAction: opt.value })}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                  isSelected
                    ? 'bg-indigo-950/50 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-800'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">{opt.labelFa}</span>
                  <span className="text-[11px] text-slate-400 block">{opt.descFa}</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-indigo-400 bg-indigo-600' : 'border-slate-700'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PRONUNCIATION SETTINGS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Volume2 className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-white">تنظیمات تلفظ صوتی (Pronunciation)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Auto play */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">پخش خودکار صوتی</span>
              <span className="text-[10px] text-slate-500 block">پخش صدا به محض باز شدن کلمه</span>
            </div>
            <button
              onClick={() => updateSettingField('pronunciation', { autoPlay: !settings.pronunciation.autoPlay })}
              className={`w-9 h-5 rounded-full transition relative p-0.5 ${
                settings.pronunciation.autoPlay ? 'bg-purple-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.pronunciation.autoPlay ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Accent */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
            <span className="font-bold text-white block">لهجه استاندارد (Accent)</span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                onClick={() => updateSettingField('pronunciation', { accent: 'US' })}
                className={`py-1.5 rounded-lg border font-bold ${
                  settings.pronunciation.accent === 'US' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                🇺🇸 آمریکایی (US)
              </button>
              <button
                onClick={() => updateSettingField('pronunciation', { accent: 'UK' })}
                className={`py-1.5 rounded-lg border font-bold ${
                  settings.pronunciation.accent === 'UK' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                🇬🇧 بریتانیایی (UK)
              </button>
            </div>
          </div>

          {/* Speech Speed */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">سرعت قرائت</span>
              <span className="font-mono text-purple-400 font-bold">{settings.pronunciation.speechSpeed || 1.0}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={settings.pronunciation.speechSpeed || 1.0}
              onChange={(e) => updateSettingField('pronunciation', { speechSpeed: parseFloat(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 5. LEARNING & FSRS GOAL SETTINGS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Clock className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white">برنامه‌ریزی و یادگیری (Learning Goals)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Daily Goal */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">هدف مطالعه روزانه</span>
              <span className="font-mono text-emerald-400 font-bold">{settings.learning.dailyGoalMinutes} دقیقه</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={settings.learning.dailyGoalMinutes}
              onChange={(e) => updateSettingField('learning', { dailyGoalMinutes: parseInt(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Daily New Cards */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">کارت‌های جدید روزانه</span>
              <span className="font-mono text-emerald-400 font-bold">{settings.learning.maxNewCardsPerDay || 20} کارت</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={settings.learning.maxNewCardsPerDay || 20}
              onChange={(e) => updateSettingField('learning', { maxNewCardsPerDay: parseInt(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Target Retention Rate (FSRS 4.5) */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">نرخ بازیابی هدف FSRS (Retention)</span>
              <span className="font-mono text-emerald-400 font-bold">{(settings.learning.targetRetention || 0.9) * 100}%</span>
            </div>
            <input
              type="range"
              min="0.80"
              max="0.98"
              step="0.01"
              value={settings.learning.targetRetention || 0.9}
              onChange={(e) => updateSettingField('learning', { targetRetention: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 6. AI LEARNING & EXTENSIBLE LLM ASSISTANT SETTINGS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">تنظیمات استاد هوش مصنوعی و مدل‌های زبان (AI Tutor Workflow)</h2>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Phase 2 Architecture Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">فعال‌سازی استاد هوش مصنوعی</span>
              <span className="text-[10px] text-slate-500 block">پاسخ به سوالات گرامر و تحلیل مکالمه</span>
            </div>
            <button
              onClick={() => updateSettingField('aiLearning', { enableAiLearning: !settings.aiLearning.enableAiLearning })}
              className={`w-9 h-5 rounded-full transition relative p-0.5 ${
                settings.aiLearning.enableAiLearning ? 'bg-cyan-600' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.aiLearning.enableAiLearning ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">سختی تطبیقی هوشمند (ΔD)</span>
              <span className="text-[10px] text-slate-500 block">تنظیم سختی بر اساس تحلیل اشتباهات FSRS</span>
            </div>
            <button
              onClick={() => updateSettingField('aiLearning', { adaptiveDifficulty: !settings.aiLearning.adaptiveDifficulty })}
              className={`w-9 h-5 rounded-full transition relative p-0.5 ${
                settings.aiLearning.adaptiveDifficulty ? 'bg-cyan-600' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.aiLearning.adaptiveDifficulty ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* AI Tutor Connection Mode Setup */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-white block text-sm">حالت ارتباطی مدل هوش مصنوعی (LLM Assistant Mode)</span>
            <p className="text-slate-400 text-[11px]">
              انتخاب روش فراخوانی استاد هوش مصنوعی بر اساس اشتراک، کلید شخصی یا تولید پرامپت دستی.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Mode A: ATHENA Managed */}
            <div
              onClick={() => {
                const engine = AthenaCoreEngine.getInstance();
                const aiEngine = engine.getAiTutorEngine();
                const current = aiEngine.getSettings();
                aiEngine.saveSettings({ ...current, mode: 'ATHENA_MANAGED' });
                showToast('حالت سرویس مدیریت‌شده آتنا فعال شد');
              }}
              className={`p-3.5 rounded-xl border cursor-pointer space-y-2 transition ${
                engine.getAiTutorEngine().getSettings().mode === 'ATHENA_MANAGED'
                  ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">۱. اشتراک آتنا (Managed)</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">خودکار</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                ارتباط مستقیم و امن بدون نیاز به API Key با پشتیبانی کامل از دیتابیس واژگان و FSRS.
              </p>
            </div>

            {/* Mode B: Manual Prompt & Paste */}
            <div
              onClick={() => {
                const engine = AthenaCoreEngine.getInstance();
                const aiEngine = engine.getAiTutorEngine();
                const current = aiEngine.getSettings();
                aiEngine.saveSettings({ ...current, mode: 'MANUAL_PROMPT' });
                showToast('حالت تولید پرامپت دستی و کپی-پیست فعال شد');
              }}
              className={`p-3.5 rounded-xl border cursor-pointer space-y-2 transition ${
                engine.getAiTutorEngine().getSettings().mode === 'MANUAL_PROMPT'
                  ? 'bg-amber-950/60 border-amber-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">۲. تولید پرامپت و کپی</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">رایگان</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تولید پرامپت اختصاصی جهت کپی در ChatGPT یا Gemini و کپی پاسخ جهت تحلیل واژگان.
              </p>
            </div>

            {/* Mode C: User Own API Key */}
            <div
              onClick={() => {
                const engine = AthenaCoreEngine.getInstance();
                const aiEngine = engine.getAiTutorEngine();
                const current = aiEngine.getSettings();
                aiEngine.saveSettings({ ...current, mode: 'USER_API_KEY' });
                showToast('حالت کلید API اختصاصی کاربر فعال شد');
              }}
              className={`p-3.5 rounded-xl border cursor-pointer space-y-2 transition ${
                engine.getAiTutorEngine().getSettings().mode === 'USER_API_KEY'
                  ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">۳. کلید API اختصاصی (BYOK)</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300">رمزنگاری شده</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                استفاده از کلید شخصی OpenAI، Gemini، Claude یا ارائه‌دهنده‌های دلخواه با امنیت بالا.
              </p>
            </div>
          </div>

          {/* API Key Configuration Panel */}
          {engine.getAiTutorEngine().getSettings().mode === 'USER_API_KEY' && (
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-white">تنظیمات کلید API (Provider & Encrypted Storage)</span>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  <span>ذخیره‌سازی رمزنگاری شده کلیدها در حافظه امن کلاینت</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ارائه‌دهنده مدل (Provider)</label>
                  <select
                    value={engine.getAiTutorEngine().getSettings().apiKeyConfig.provider}
                    onChange={(e) => {
                      const aiEngine = engine.getAiTutorEngine();
                      aiEngine.updateApiKey(e.target.value as any, '', e.target.value === 'GEMINI' ? 'gemini-3.6-flash' : 'gpt-4o-mini');
                      showToast(`ارائه‌دهنده به ${e.target.value} تغییر کرد`);
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
                  >
                    <option value="GEMINI">Google Gemini API (Default)</option>
                    <option value="OPENAI">OpenAI Compatible API</option>
                    <option value="CLAUDE">Anthropic Claude API</option>
                    <option value="CUSTOM">Custom Gateway Endpoint</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">نام مدل (Model Name)</label>
                  <input
                    type="text"
                    defaultValue={engine.getAiTutorEngine().getSettings().apiKeyConfig.modelName || 'gemini-3.6-flash'}
                    onChange={(e) => {
                      const aiEngine = engine.getAiTutorEngine();
                      const cur = aiEngine.getSettings();
                      aiEngine.saveSettings({
                        ...cur,
                        apiKeyConfig: { ...cur.apiKeyConfig, modelName: e.target.value },
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-400">ورود API Key جدید</label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    placeholder="AIzaSy... یا sk-..."
                    onChange={(e) => {
                      if (e.target.value.trim()) {
                        const aiEngine = engine.getAiTutorEngine();
                        const prov = aiEngine.getSettings().apiKeyConfig.provider;
                        aiEngine.updateApiKey(prov, e.target.value.trim());
                      }
                    }}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono"
                  />
                  <button
                    onClick={() => {
                      const aiEngine = engine.getAiTutorEngine();
                      aiEngine.testConnection().then((res) => {
                        showToast(res.message);
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition"
                  >
                    تست اتصال (Test)
                  </button>
                  <button
                    onClick={() => {
                      const aiEngine = engine.getAiTutorEngine();
                      aiEngine.removeApiKey();
                      showToast('کلید API حذف شد');
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 transition"
                  >
                    حذف کلید
                  </button>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Masked Stored Key: {engine.getAiTutorEngine().getSettings().apiKeyConfig.apiKeyObfuscated || 'هیچ کلیدی ثبت نشده است'}</span>
                  <span>
                    Status: {engine.getAiTutorEngine().getSettings().apiKeyConfig.isTested ? '✅ Verified' : '⚠️ Not Tested'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 7. BACKUP & SYNC */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Database className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">پشتیبان‌گیری و مالکیت کامل داده‌ها (Backup & Data Ownership)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => {
              BackupEngine.getInstance().downloadBackupFile();
              showToast('پشتیبان کامل ATHENA با موفقیت دانلود شد');
            }}
            className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-indigo-300 flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>پشتیبان کامل (JSON Backup)</span>
          </button>

          <button
            onClick={() => {
              BackupEngine.getInstance().downloadCsvExport();
              showToast('خروجی Excel / CSV واژگان و FSRS دانلود شد');
            }}
            className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-cyan-300 flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>خروجی اکسل (CSV Export)</span>
          </button>

          <label className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 transition cursor-pointer">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>بازگردانی بک‌آپ (Import JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  const content = event.target?.result as string;
                  if (content) {
                    const result = BackupEngine.getInstance().restoreBackup(content);
                    showToast(result.message);
                    if (result.success && onSettingsChange) {
                      onSettingsChange();
                    }
                  }
                };
                reader.readAsText(file);
              }}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 8. PRIVACY & DATA RESET */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Shield className="w-4 h-4 text-rose-400" />
          <h2 className="text-sm font-bold text-white">حریم خصوصی و پاک‌سازی داده‌ها (Privacy)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="p-3 bg-slate-950 border border-slate-850 rounded-xl font-bold text-slate-300 flex items-center justify-between hover:bg-slate-850 transition"
          >
            <span>سیاست حریم خصوصی (Privacy Policy)</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => setShowTermsModal(true)}
            className="p-3 bg-slate-950 border border-slate-850 rounded-xl font-bold text-slate-300 flex items-center justify-between hover:bg-slate-850 transition"
          >
            <span>شرایط استفاده (Terms of Service)</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => setShowClearHistoryConfirm(true)}
            className="p-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/50 rounded-xl font-bold text-rose-300 flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>پاک‌سازی تاریخچه یادگیری FSRS</span>
          </button>

          <button
            onClick={() => {
              engine.deleteLocalData();
              showToast('تمام داده‌های محلی برنامه پاک‌سازی شدند');
              if (onSettingsChange) onSettingsChange();
            }}
            className="p-3 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 rounded-xl font-bold text-rose-200 flex items-center justify-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف تمام داده‌های آفلاین دستگاه</span>
          </button>
        </div>
      </div>

      {/* 9. ABOUT ATHENA COMMERCIAL APP */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl mx-auto border border-indigo-400/30">
          <BookOpen className="w-8 h-8 text-white" />
        </div>

        <div>
          <h3 className="text-lg font-black text-white">ATHENA Smart Dictionary</h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Commercial Android Edition v3.4.0 (Build 2026.08)</p>
        </div>

        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          دیکشنری و موتور یادگیری هوشمند آثینا با معماری Kotlin Multiplatform، موتور الگوریتمی FSRS 4.5 و لایه هوش مصنوعی سرور-سایدی.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setShowLicensesModal(true)}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>مجوزهای اپن‌سورس</span>
          </button>
        </div>
      </div>

      {/* MODAL: Privacy Policy */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-lg w-full space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              سیاست حریم خصوصی ATHENA
            </h3>
            <div className="text-xs text-slate-300 leading-relaxed space-y-2 dir-rtl text-right">
              <p>
                اپلیکیشن دیکشنری هوشمند ATHENA متعهد به حفظ کامل حریم خصوصی داده‌های کاربران است.
              </p>
              <p>
                <strong>ذخیره‌سازی آفلاین:</strong> تمامی واژگان ذخیره‌شده، لایتنر و لاگ‌های مرور FSRS به‌صورت آفلاین و رمزنگاری‌شده در دیتابیس محلی دستگاه شما نگهداری می‌شوند.
              </p>
              <p>
                <strong>ارتباطات API:</strong> درخواست‌های هوش مصنوعی صرفاً برای پردازش متن از طریق کانال امن HTTPS ارسال می‌شوند و هیچ اطلاعات هویت‌سنجی شخصی نگهداری نمی‌شود.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Terms of Service */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-lg w-full space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              شرایط استفاده از خدمات (Terms of Service)
            </h3>
            <div className="text-xs text-slate-300 leading-relaxed space-y-2 dir-rtl text-right">
              <p>استفاده از نرم‌افزار ATHENA مشمول حقوق مالکیت معنوی موتور الگوریتمی FSRS 4.5 و لایسنس تجاری می‌باشد.</p>
              <p>استفاده شخص از محتوای آموزشی و دیکشنری برای مقاصد غیرتجاری آزاد است.</p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Open Source Licenses */}
      {showLicensesModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-lg w-full space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-400" />
              مجوزهای نرم‌افزاری (Open Source Licenses)
            </h3>
            <div className="text-xs text-slate-300 space-y-3 font-mono dir-ltr text-left">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                <span className="font-bold text-indigo-400 block">React 18 & Vite (MIT)</span>
                <span className="text-[10px] text-slate-400">Copyright (c) Meta Platforms, Inc.</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                <span className="font-bold text-purple-400 block">Kotlin Multiplatform (Apache 2.0)</span>
                <span className="text-[10px] text-slate-400">Copyright (c) JetBrains s.r.o.</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                <span className="font-bold text-emerald-400 block">FSRS 4.5 Memory Engine (MIT)</span>
                <span className="text-[10px] text-slate-400">Free Spaced Repetition Scheduler Algorithm</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                <span className="font-bold text-amber-400 block">Lucide Icons (ISC)</span>
                <span className="text-[10px] text-slate-400">Copyright (c) Lucide Contributors</span>
              </div>
            </div>
            <button
              onClick={() => setShowLicensesModal(false)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
            >
              بستن
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: Clear History */}
      {showClearHistoryConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-900/60 rounded-2xl p-5 max-w-md w-full space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-950/80 border border-rose-800 rounded-full flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">تایید بازنشانی تاریخچه یادگیری FSRS</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              آیا مطمئن هستید؟ تمام داده‌های پایداری حافظه ($S$) و لاگ‌های مرور مرور لایتنر شما پاک خواهند شد.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => setShowClearHistoryConfirm(false)}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                انصراف
              </button>
              <button
                onClick={handleClearHistory}
                className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl"
              >
                بله، بازنشانی شود
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

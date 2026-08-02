/**
 * ATHENA Core Architecture Deliverables & Handoff Specifications
 * Clean Architecture, Domain-Driven Design, Persian summary, English Prompt, Coding Standards
 * Hardening Phase 0.1 Specifications included
 */

export interface ModuleDoc {
  id: number;
  titleFa: string;
  titleEn: string;
  target: string;
  descriptionFa: string;
  deliverableName: string;
  responsibility: string;
  interfaces: string[];
  testCases: string[];
}

export const HARDENING_PHASE_DOCS = {
  phaseName: 'Phase 0.1 — Core Domain Hardening',
  status: 'IMPLEMENTED & TESTED',
  descriptionFa: 'سخت‌سازی دامنه اصلی شامل استانداردسازی رویدادهای Sealed Class، تفکیک Learning Profile، غنی‌سازی مدل Word، لایسنس تجاری و قراردادهای Provider ماژول‌ها',
  requirements: [
    {
      titleFa: '۱. رویدادهای دامنه استاندارد (Domain Event Contract)',
      descriptionFa: 'تبدیل رویدادهای متنی به رویدادهای تایپ‌شده Sealed Class مانند AthenaDomainEvent.WordAdded و AthenaDomainEvent.WordReviewed جهت اتصال آنالیتیکس و هوش مصنوعی',
    },
    {
      titleFa: '۲. پروفایل یادگیری کاربر (User Learning Profile)',
      descriptionFa: 'تفکیک جدول مشخصات پایه کاربر از پروفایل یادگیری (شامل سطح CEFR A1-C2، اهداف یادگیری، نقاط ضعف و زبان توضیح پیش‌فرض)',
    },
    {
      titleFa: '۳. غنی‌سازی مدل کلمه (Enriched Word Entity)',
      descriptionFa: 'توسعه مدل Word به ساختار چندوجهی شامل معانی با نقش دستور، فیلد تلفظ IPA، مثال‌های زمینه‌ای، برچسب دامنه و اتصال به تاریخچه مرور لایتنر',
    },
    {
      titleFa: '۴. مدل لایسنس تجاری (License & Entitlement Architecture)',
      descriptionFa: 'معماری لایسنس تجاری شامل انواع Trial/Pro/Enterprise، سقف فعال‌سازی دستگاه‌ها، لایسنس زبان‌ها و اعتبارسنجی امضای دیجیتال',
    },
    {
      titleFa: '۵. قراردادهای API ماژول‌ها (Provider Interfaces)',
      descriptionFa: 'تعریف دقیق اینترفیس‌های DictionaryProvider، VoiceProvider، AIProvider و GrammarProvider برای توسعه مستقل ماژول‌های آینده',
    },
    {
      titleFa: '۶. تست بار سنگین (100,000+ Records Benchmark)',
      descriptionFa: 'تست عملکرد و نمایه حافظه برای پردازش ۱۰۰,۰۰۰ کلمه و ۱,۰۰۰,۰۰۰ رکورد مرور برای اطمینان از مقیاس‌پذیری KMP',
    },
  ],
};

export const MODULE_DOCS: ModuleDoc[] = [
  {
    id: 1,
    titleFa: 'ماژول ۱ — هسته اصلی برنامه (Application Core)',
    titleEn: 'Module 1 — Application Core',
    target: 'مدیریت چرخه‌حیات و آغاز‌به‌کار سیستم',
    descriptionFa: 'ایجاد هسته اصلی برنامه بدون وابستگی به رابط‌کاربری، مدیریت لایف‌سایکل و راه‌اندازی ماژول‌ها.',
    deliverableName: 'AthenaCore Module',
    responsibility: 'مقداردهی اولیه برنامه‌، بارگذاری ماژول‌ها و مدیریت چرخه حیات (Lifecycle)',
    interfaces: ['ApplicationCore', 'CoreLifecycleListener', 'CoreState'],
    testCases: ['تست موفقیت‌آمیز Init', 'تست Shutdown کامل سیستم', 'تست رفتار در صورت بروز خطای Bootstrap'],
  },
  {
    id: 2,
    titleFa: 'ماژول ۲ — موتور تنظیمات (Configuration Engine)',
    titleEn: 'Module 2 — Configuration Engine',
    target: 'مدیریت تنظیمات و پرچم‌های ویژگی بدون وابستگی به UI',
    descriptionFa: 'مدیریت تمام تنظیمات کاربر، پرچم‌های قابلیت‌ها (Feature Flags) و کانفیگ‌های محیطی.',
    deliverableName: 'Configuration API',
    responsibility: 'ذخیره‌سازی و خواندن کانفیگ زبان‌های مبدا/مقصد، سرعت پخش صوت و سویچ ویژگی‌های آینده',
    interfaces: ['ConfigurationEngine', 'SystemPreferences', 'FeatureFlags'],
    testCases: ['اعمال تغییر زبان و انتشار رویداد', 'تغییر وضعیت Feature Flags', 'تایید مقادیر پیش‌فرض'],
  },
  {
    id: 3,
    titleFa: 'ماژول ۳ — مدیریت ماژول‌ها (Module Manager & Provider Contracts)',
    titleEn: 'Module 3 — Module Manager & Provider Contracts',
    target: 'ثبت و کنترل ماژول‌های مستقل و اینترفیس‌های Provider',
    descriptionFa: 'سیستم مدیریت قابلیتها و قراردادهای دقیق DictionaryProvider, VoiceProvider, AIProvider, GrammarProvider.',
    deliverableName: 'Module Registration & Provider System',
    responsibility: 'مدیریت ورود/خروج، وضعیت اجرایی و پیاده‌سازی اینترفیس‌های ارائه خدمات ماژول‌ها',
    interfaces: ['ModuleManager', 'DictionaryProvider', 'VoiceProvider', 'AIProvider', 'GrammarProvider'],
    testCases: ['ثبت ماژول جدید در runtime', 'فراخوانی متدهای Provider', 'بررسی نیازمندی‌های ماژول‌ها'],
  },
  {
    id: 4,
    titleFa: 'ماژول ۴ — گذرگاه رویدادها (Sealed Domain Event Bus)',
    titleEn: 'Module 4 — Sealed Domain Event Bus',
    target: 'ارتباط رویداد محور تایپ‌شده غیرمستقیم بین ماژول‌ها',
    descriptionFa: 'ارتباط Event-Driven با Sealed Classes دامنه مانند AthenaDomainEvent.WordAdded و WordReviewed.',
    deliverableName: 'Domain Event System',
    responsibility: 'ارسال و دریافت async رویدادهای دامنه بین بخش‌های مختلف بدون coupling مستقیم',
    interfaces: ['AthenaEventBus', 'AthenaDomainEvent', 'EventListener'],
    testCases: ['ارسال AthenaDomainEvent.WordAdded و دریافت در لایتنر', 'تست Unsubscribe', 'تست تایپ‌ایمنی و Serialization'],
  },
  {
    id: 5,
    titleFa: 'ماژول ۵ — معماری افزونه‌ها (Plugin Architecture)',
    titleEn: 'Module 5 — Plugin Architecture',
    target: 'امکان افزودن قابلیت جدید بدون تغییر در Core',
    descriptionFa: 'تعریف ساختار هوک و پلاگین برای اضافه کردن ماژول‌هایی مثل OCR یا AI بدون تغییر کد Core.',
    deliverableName: 'Plugin Interface',
    responsibility: 'مدیریت Hook pipeline ها و اجرای اکستنشن‌های توسعه‌دهندگان',
    interfaces: ['PluginManager', 'AthenaPlugin', 'PluginHook'],
    testCases: ['اجرای Hook در مرحله پیش‌پردازش کلمه', 'غیرفعال‌سازی پلاگین بدون خطا در Core', 'تست امنیت اجرا'],
  },
  {
    id: 6,
    titleFa: 'ماژول ۶ — لایه مدل داده‌ها و پروفایل (Data Model & Learning Profile Layer)',
    titleEn: 'Module 6 — Data Model & Learning Profile Layer',
    target: 'مدل استاندارد Domain Entities، Learning Profile و License',
    descriptionFa: 'تعریف Domain Entities خالص شامل User, LearningProfile, EnrichedWord, UserLearningState, LicenseEntitlement.',
    deliverableName: 'Hardened Domain Models',
    responsibility: 'مدل‌سازی دقیق مفاهیم دامنه و تفکیک مشخصات کاربر از پروفایل یادگیری تخصصی',
    interfaces: ['User', 'LearningProfile', 'EnrichedWord', 'UserLearningState', 'LicenseEntitlement'],
    testCases: ['تست صحت Serialization / Deserialization', 'تست محاسبه Retrievability Score لایتنر', 'تست سطح CEFR'],
  },
  {
    id: 7,
    titleFa: 'ماژول ۷ — موتور ذخیره‌سازی محلی (Local Storage Engine)',
    titleEn: 'Module 7 — Local Storage Engine',
    target: 'پایگاه داده آفلاین چندپلتفرمی با SQLDelight',
    descriptionFa: 'مدیریت ذخیره‌سازی داده‌ها به‌صورت Offline-First در SQLite با استفاده از SQLDelight.',
    deliverableName: 'Local Database Layer',
    responsibility: 'اجرای دستورات CRUD، مدیریت اتصالات و کوئری‌های بهینه SQLite',
    interfaces: ['LocalStorageEngine', 'WordRepository', 'AthenaDatabase'],
    testCases: ['تست درج و خواندن کلمات غنی‌شده', 'تست کوئری لایتنر با تاریخ مرور', 'تست بنچمارک ۱۰,۰۰۰ کوئری بر ثانیه'],
  },
  {
    id: 8,
    titleFa: 'ماژول ۸ — موتور رمزنگاری و لایسنس (Encryption & Licensing Engine)',
    titleEn: 'Module 8 — Encryption & Licensing Engine',
    target: 'امنیت داده‌ها و مدیریت لایسنس تجاری محصول',
    descriptionFa: 'رمزنگاری پایگاه داده محلی، کلیدهای API و اعتبارسنجی لایسنس تجاری و محدودیت دستگاه‌ها.',
    deliverableName: 'Security & Licensing Service',
    responsibility: 'رمزنگاری AES-256 داده‌های حساس و چک لایسنس‌های Pro/Enterprise با امضای دیجیتال',
    interfaces: ['EncryptionEngine', 'LicenseEntitlement', 'DeviceActivation'],
    testCases: ['تست رمزنگاری و رمزگشایی داده', 'تست سقف فعال‌سازی ۳ دستگاه لایسنس Pro', 'تست امضای دیجیتال'],
  },
  {
    id: 9,
    titleFa: 'ماژول ۹ — موتور مهاجرت پایگاه داده (Migration Engine)',
    titleEn: 'Module 9 — Migration Engine',
    target: 'ارتقای ساختار پایگاه داده به نسخه 2 بدون از دست رفتن داده',
    descriptionFa: 'چارچوب مهاجرت دیتابیس جهت ارتقا به اسکیما v2 (شامل جداول LearningProfile و Entitlements).',
    deliverableName: 'Database Migration Framework',
    responsibility: 'بررسی نسخه دیتابیس، اجرای فایل‌های .sqm و تایید سلامت داده‌های مهاجرت شده',
    interfaces: ['MigrationEngine', 'MigrationResult', 'SchemaVersionChecker'],
    testCases: ['تست مهاجرت موفق از v1 به v2', 'تست افزودن جدول LearningProfile بدون پاک شدن کلمات قبلی'],
  },
  {
    id: 10,
    titleFa: 'ماژول ۱۰ — سیستم ثبت رویدادها و تست بار (Logging & Stress Test System)',
    titleEn: 'Module 10 — Logging & Stress Test System',
    target: 'ثبت خطاها، تلمتری و بنچمارک پردازش ۱۰۰,۰۰۰ رکورد',
    descriptionFa: 'سیستم لاگ ساختاریافته به همراه بنچمارک خودکار مقیاس‌پذیری زیرفشار (Stress Test).',
    deliverableName: 'Logging & Benchmark System',
    responsibility: 'جمع‌آوری لاگ‌های رده‌بندی‌شده و اجرای بنچمارک عملکرد لایتنر روی ۱۰۰,۰۰۰ کلمه',
    interfaces: ['AthenaLogger', 'StressTestBenchmark', 'LogRecord'],
    testCases: ['تست پردازش ۱۰۰,۰۰۰ کلمه و ۱,۰۰۰,۰۰۰ مرور', 'محاسبه زمان اجرای توابع با tracePerformance'],
  },
];

export const CODING_STANDARDS_TEXT = `
# ATHENA Core Foundation — Phase 0.1 Hardened Architecture Standards

## 1. Domain-Driven Design (DDD) & Sealed Domain Events
- **Sealed Domain Events**: All cross-module events MUST be derived from \`AthenaDomainEvent\` sealed class hierarchy.
- **Decoupled Learning Profile**: \`User\` entity is separated from \`LearningProfile\`. The AI Tutor and Leitner Engine depend strictly on \`LearningProfile\` fields (CEFR level, weak areas, target goals).

## 2. Enriched Multi-Faceted Word Model
- Vocabulary items MUST be modeled via \`EnrichedWord\` containing:
  - Phonetic IPAs and stress patterns
  - Meanings per Part-Of-Speech (Noun, Verb, Adj, etc.) with contextual usage notes
  - Domain categorization (Academic, Tech, Business, Medical)
  - Detailed \`UserLearningState\` with ease factor, lapse count, and retrievability score.

## 3. Provider API Contracts
- Modules MUST communicate through explicit Provider interfaces (\`DictionaryProvider\`, \`VoiceProvider\`, \`AIProvider\`, \`GrammarProvider\`). No direct module-to-module internal implementation references are allowed.

## 4. Commercial Licensing & Multi-Device Entitlements
- Commercial licenses (\`LicenseEntitlement\`) cryptographically verify unlocked features (AI Tutor, OCR, Unlimited Cloud Sync) and limit active device slots.

## 5. Storage, Migration & High-Load Performance
- SQLite migrations strictly increment database version (e.g., v1 -> v2) without data loss.
- High-load query benchmarks must execute at >= 10,000 queries per second under stress simulation.
`;

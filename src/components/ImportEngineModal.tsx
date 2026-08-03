import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, FileText, FileSpreadsheet, Archive, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { AthenaCoreEngine } from '../core/athenaCoreEngine';
import { ImportResult } from '../core/importEngine';

interface ImportEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (count: number) => void;
}

export const ImportEngineModal: React.FC<ImportEngineModalProps> = ({ isOpen, onClose, onImportSuccess }) => {
  const engine = AthenaCoreEngine.getInstance();
  const importEngine = engine.getImportEngine();

  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFile(files[0]);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const res = await importEngine.importFile(file);
      setResult(res);

      if (res.importedCards.length > 0) {
        // Add to Athena Vocabulary Manager & FSRS
        res.importedCards.forEach((card) => {
          engine.getVocabularyManager().createCard(card);
        });

        if (onImportSuccess) {
          onImportSuccess(res.importedCards.length);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در خواندن فایل وارد شده');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden dir-rtl text-right"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white">موتور واردسازی واژگان (Import Engine)</h2>
                <p className="text-xs text-slate-400">پشتیبانی از Anki (.apkg)، Excel، CSV، TSV و TXT</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 text-xs">
            {/* Format badges */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-center gap-1.5 text-emerald-400">
                <FileSpreadsheet className="w-4 h-4" />
                <span>.xlsx / .csv</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-center gap-1.5 text-purple-400">
                <Archive className="w-4 h-4" />
                <span>Anki .apkg</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-center gap-1.5 text-amber-400">
                <FileText className="w-4 h-4" />
                <span>.txt / .tsv</span>
              </div>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsHovered(true);
              }}
              onDragLeave={() => setIsHovered(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center space-y-3 relative ${
                isHovered ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
              }`}
            >
              <input
                type="file"
                accept=".csv,.tsv,.txt,.apkg,.xlsx,.xls"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

              {isLoading ? (
                <div className="space-y-2">
                  <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-bold text-indigo-300">در حال پردازش و استخراج کارت‌ها...</p>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white text-sm">فایل خود را کشیده و اینجا رها کنید</p>
                    <p className="text-slate-400 text-xs">یا برای انتخاب فایل از سیستم کلیک کنید</p>
                  </div>
                </>
              )}
            </div>

            {/* Results display */}
            {result && (
              <div className="bg-emerald-950/30 border border-emerald-800/50 p-4 rounded-xl space-y-2 text-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>عملیات واردسازی با موفقیت انجام شد!</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>تعداد کل واژگان شناسایی‌شده: {result.totalParsed}</div>
                  <div>تعداد کارت‌های واردشده به FSRS: {result.importedCards.length}</div>
                </div>
                {result.sourceType === 'ANKI' && (
                  <p className="text-[11px] text-emerald-300/80">
                    * فایل‌های سنگین رسانه‌ای (عکس/صدا) جهت حفظ سرعت برنامه نادیده گرفته شدند.
                  </p>
                )}
              </div>
            )}

            {errorMessage && (
              <div className="bg-rose-950/40 border border-rose-800/50 p-3 rounded-xl flex items-center gap-2 text-rose-300">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              کارت‌های واردشده مستقیماً وارد موتور الگوریتم FSRS می‌شوند.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
            >
              بستن
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

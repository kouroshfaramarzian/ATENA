import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bot,
  Copy,
  Check,
  Sparkles,
  Send,
  MessageSquare,
  Lock,
  RotateCcw,
  BookMarked,
  Brain,
  AlertCircle,
  FileText,
  Sliders,
  Flame,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { AthenaCoreEngine } from '../core/athenaCoreEngine';
import { AiPromptGenerator, AiAnalysisResult } from '../core/aiTutorEngine';

interface AiTutorWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const AiTutorWorkflowModal: React.FC<AiTutorWorkflowModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const engine = AthenaCoreEngine.getInstance();
  const aiEngine = engine.getAiTutorEngine();
  const [settings, setSettings] = useState(aiEngine.getSettings());

  // Mode Selection
  const [activeMode, setActiveMode] = useState(settings.mode);

  // Option B: Manual Prompt & Paste State
  const [topic, setTopic] = useState('Travel & Culture');
  const [cefr, setCefr] = useState('B2');
  const [generatedPrompt, setGeneratedPrompt] = useState(
    AiPromptGenerator.generatePrompt('Travel & Culture', 'B2').copyFormatted
  );
  const [pastedLlmResponse, setPastedLlmResponse] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AiAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Option A / C: Direct Chat
  const [userChatInput, setUserChatInput] = useState('');
  const [isProcessingChat, setIsProcessingChat] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { sender: 'USER' | 'AI'; text: string; analysis?: AiAnalysisResult }[]
  >([
    {
      sender: 'AI',
      text: 'Hello! I am your ATHENA AI Tutor. Which topic would you like to practice today?',
    },
  ]);

  if (!isOpen) return null;

  const handleModeChange = (newMode: typeof activeMode) => {
    setActiveMode(newMode);
    const updated = { ...settings, mode: newMode };
    setSettings(updated);
    aiEngine.saveSettings(updated);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopiedPrompt(true);
    showToast('پرامپت ساختاریافته کپی شد! آن را در ChatGPT یا Gemini پیست کنید.');
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleAnalyzePastedText = () => {
    if (!pastedLlmResponse.trim()) {
      showToast('لطفاً ابتدا پاسخ دریافتی از چت‌بات را وارد کنید.');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = aiEngine.processConversationTurn(pastedLlmResponse, topic);
      res.then((analysis) => {
        setAnalysisResult(analysis);
        setIsAnalyzing(false);
        showToast(`تحلیل کامل شد! ${analysis.extractedVocabulary.length} واژه جدید شناسایی شد.`);
      });
    }, 400);
  };

  const handleInjectToFsrs = () => {
    if (!analysisResult || analysisResult.extractedVocabulary.length === 0) return;
    const added = engine.injectExtractedVocabularyToFsrs(analysisResult.extractedVocabulary);
    showToast(`${added} واژه جدید مستقیماً وارد الگوریتم یادگیری FSRS شدند!`);
  };

  const handleSendDirectChat = () => {
    if (!userChatInput.trim() || isProcessingChat) return;
    const msg = userChatInput.trim();
    setUserChatInput('');
    setIsProcessingChat(true);

    const newHistory = [...chatHistory, { sender: 'USER' as const, text: msg }];
    setChatHistory(newHistory);

    aiEngine.processConversationTurn(msg, topic).then((res) => {
      setChatHistory([
        ...newHistory,
        {
          sender: 'AI',
          text: res.suggestedNextResponseEn || 'That is very interesting!',
          analysis: res,
        },
      ]);
      setIsProcessingChat(false);
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  استاد هوش مصنوعی آتنا (ATHENA AI Tutor Assistant)
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
                    Phase 2 Extensible Workflow
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  تمرین هدفمند مکالمه، تحلیل اشتباهات گرامری و استخراج خودکار واژگان جهت یادگیری FSRS
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="bg-slate-950/60 border-b border-slate-800 p-2 flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => handleModeChange('ATHENA_MANAGED')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
                activeMode === 'ATHENA_MANAGED'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>۱. سرویس مدیریت‌شده (Managed)</span>
            </button>

            <button
              onClick={() => handleModeChange('MANUAL_PROMPT')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
                activeMode === 'MANUAL_PROMPT'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>۲. پرامپت‌ساز و کپی-پیست (Manual Mode)</span>
            </button>

            <button
              onClick={() => handleModeChange('USER_API_KEY')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
                activeMode === 'USER_API_KEY'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>۳. کلید API اختصاصی (BYOK)</span>
            </button>
          </div>

          {/* Main Body */}
          <div className="p-5 overflow-y-auto flex-1 space-y-6 text-xs text-slate-200">
            {/* OPTION B: MANUAL PROMPT & PASTE MODE */}
            {activeMode === 'MANUAL_PROMPT' && (
              <div className="space-y-6">
                {/* Step 1: Prompt Generator Config */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      گام ۱: تنظیم موضوع و سطح پرامپت اختصاصی
                    </span>
                    <span className="text-[10px] text-slate-400">کپی آسان در ChatGPT / Gemini / Claude</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">موضوع مکالمه (Topic)</label>
                      <select
                        value={topic}
                        onChange={(e) => {
                          setTopic(e.target.value);
                          setGeneratedPrompt(
                            AiPromptGenerator.generatePrompt(e.target.value, cefr).copyFormatted
                          );
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
                      >
                        <option value="Travel & Culture">سفر و مبادلات فرهنگی (Travel & Culture)</option>
                        <option value="Business & Economics">تجارت و اقتصاد (Business & Economics)</option>
                        <option value="Academic & Research">دانشگاهی و آیلتس (Academic & IELTS)</option>
                        <option value="Technology & AI">تکنولوژی و هوش مصنوعی (Technology & AI)</option>
                        <option value="Everyday Conversation">گفتگوی روزمره (Everyday Life)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">سطح هدف (CEFR Level)</label>
                      <select
                        value={cefr}
                        onChange={(e) => {
                          setCefr(e.target.value);
                          setGeneratedPrompt(
                            AiPromptGenerator.generatePrompt(topic, e.target.value).copyFormatted
                          );
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
                      >
                        <option value="A2">A2 - Elementary</option>
                        <option value="B1">B1 - Intermediate</option>
                        <option value="B2">B2 - Upper Intermediate (پیشنهادی)</option>
                        <option value="C1">C1 - Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-mono text-[11px]">پرامپت تولید شده:</span>
                      <button
                        onClick={handleCopyPrompt}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] flex items-center gap-1 transition"
                      >
                        {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPrompt ? 'کپی شد!' : 'کپی پرامپت'}</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-200 leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
                      {generatedPrompt}
                    </pre>
                  </div>
                </div>

                {/* Step 2: Paste LLM Response & Analyze */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="border-b border-slate-800 pb-2">
                    <span className="font-bold text-cyan-300 text-xs flex items-center gap-1.5">
                      <Brain className="w-4 h-4" />
                      گام ۲: پیست کردن پاسخ دریافت شده از هوش مصنوعی و تحلیل خودکار
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">پاسخ چت‌بات را اینجا پیست کنید:</label>
                    <textarea
                      rows={4}
                      value={pastedLlmResponse}
                      onChange={(e) => setPastedLlmResponse(e.target.value)}
                      placeholder="متن پاسخ دریافتی از ChatGPT یا Gemini را اینجا پیست کنید..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    disabled={isAnalyzing || !pastedLlmResponse.trim()}
                    onClick={handleAnalyzePastedText}
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold transition flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>تحلیل پاسخ، استخراج واژگان و برسی گرامر</span>
                  </button>
                </div>

                {/* Step 3: Analysis Results */}
                {analysisResult && (
                  <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/40 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        نتایج تحلیل و استخراج واژگان
                      </span>
                      {analysisResult.extractedVocabulary.length > 0 && (
                        <button
                          onClick={handleInjectToFsrs}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition flex items-center gap-1"
                        >
                          <BookMarked className="w-3.5 h-3.5" />
                          <span>افزودن مستقیم کلمات به دیتابیس FSRS ({analysisResult.extractedVocabulary.length})</span>
                        </button>
                      )}
                    </div>

                    {/* Feedback */}
                    <div className="p-3 bg-indigo-950/40 border border-indigo-900/50 rounded-xl dir-rtl text-right">
                      <span className="text-[11px] font-bold text-indigo-400 block mb-1">بازخورد استاد:</span>
                      <p className="text-xs text-indigo-200 leading-relaxed">{analysisResult.overallFeedbackFa}</p>
                    </div>

                    {/* Extracted Vocab */}
                    {analysisResult.extractedVocabulary.length > 0 && (
                      <div className="space-y-2">
                        <span className="font-bold text-slate-300 block">واژگان جدید شناسایی شده:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {analysisResult.extractedVocabulary.map((v, i) => (
                            <div key={i} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-xs">{v.word}</span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300 font-mono">
                                  {v.partOfSpeech}
                                </span>
                              </div>
                              <p className="text-emerald-400 text-[11px] dir-rtl text-right">{v.translationFa}</p>
                              <p className="text-slate-400 text-[10px] italic">"{v.exampleSentence}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mistakes */}
                    {analysisResult.userMistakes.length > 0 && (
                      <div className="space-y-2">
                        <span className="font-bold text-amber-300 block">نکات اصلاح گرامری:</span>
                        {analysisResult.userMistakes.map((m, i) => (
                          <div key={i} className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-1">
                            <div className="text-rose-300 font-mono text-[11px]">اصلی: "{m.originalText}"</div>
                            <div className="text-emerald-300 font-mono text-[11px] font-bold">اصلاح شده: "{m.correctedText}"</div>
                            <div className="text-slate-400 text-[10px] dir-rtl text-right">{m.explanationFa}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* OPTION A / C: DIRECT CHAT WORKFLOW */}
            {(activeMode === 'ATHENA_MANAGED' || activeMode === 'USER_API_KEY') && (
              <div className="space-y-4">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-white">
                      ارتباط مستقیم با مدل ({activeMode === 'ATHENA_MANAGED' ? 'ATHENA Managed' : aiEngine.getSettings().apiKeyConfig.provider})
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Target CEFR: <strong className="text-cyan-400">{cefr}</strong>
                  </span>
                </div>

                {/* Chat Stream */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-80 overflow-y-auto space-y-3">
                  {chatHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${item.sender === 'USER' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl space-y-2 ${
                          item.sender === 'USER'
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        <p className="leading-relaxed">{item.text}</p>

                        {item.analysis && item.analysis.extractedVocabulary.length > 0 && (
                          <div className="pt-2 border-t border-white/10 space-y-1 text-[11px]">
                            <span className="text-emerald-400 font-bold block">واژگان جدید استخراج شده:</span>
                            <div className="flex flex-wrap gap-1">
                              {item.analysis.extractedVocabulary.map((v, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-bold text-[10px]"
                                >
                                  {v.word} ({v.translationFa})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isProcessingChat && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                      <span>در حال تحلیل پیام و استخراج کلمات جدید...</span>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendDirectChat()}
                    placeholder="پیام خود را به انگلیسی بنویسید (مثلاً: I agree with your statement regarding sustainable development...)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    disabled={isProcessingChat || !userChatInput.trim()}
                    onClick={handleSendDirectChat}
                    className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 transition"
                  >
                    <Send className="w-4 h-4" />
                    ارسال
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { KMP_CODE_FILES, KMP_PROJECT_TREE, CodeFile } from '../data/kmpCodebase';
import {
  Code2,
  FolderTree,
  FileCode,
  Copy,
  Check,
  Search,
  FileText,
  Terminal,
} from 'lucide-react';

export const CodeBrowser: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(KMP_CODE_FILES[1]); // Default to ApplicationCore.kt
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFiles = KMP_CODE_FILES.filter(
    (f) =>
      f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
          <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Kotlin Multiplatform (KMP) Codebase Viewer
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          مشاهده کامل سورس‌کدهای قابل کامپایل، فایل‌های gradle، اسکیماهای SQLDelight و تست‌های واحد تمام ۱۰ ماژول
        </p>
      </div>

      {/* Main Code Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Tree & File Selector (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="جستجوی فایل یا ماژول..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-colors flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-indigo-500'}`} />
                    <div className="overflow-hidden">
                      <span className="block font-bold text-[11px] truncate">
                        {file.path.split('/').pop()}
                      </span>
                      <span className={`block text-[10px] truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {file.module}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Directory Tree Card */}
          <div className="bg-slate-900 text-slate-200 rounded-xl p-4 border border-slate-800 shadow-2xs space-y-2">
            <h3 className="font-bold text-xs font-mono text-indigo-400 flex items-center gap-1.5">
              <FolderTree className="w-4 h-4" />
              Project Structure
            </h3>
            <pre className="text-[10px] font-mono leading-tight text-slate-400 max-h-48 overflow-y-auto">
              {KMP_PROJECT_TREE.join('\n')}
            </pre>
          </div>
        </div>

        {/* Right Code Display & Actions (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[600px]">
            {/* File Header Toolbar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <span className="font-mono text-xs font-bold text-slate-200 block truncate">
                    {selectedFile.path}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {selectedFile.description}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-200 bg-slate-950">
              <pre className="whitespace-pre">
                <code>{selectedFile.code}</code>
              </pre>
            </div>

            {/* Code Footer */}
            <div className="bg-slate-900 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Language: {selectedFile.language.toUpperCase()}</span>
              <span>Target: Kotlin Multiplatform (CommonMain)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useRef } from 'react';
import { useTodo } from '../../context/TodoContext';
import {
  X,
  Settings,
  Palette,
  Volume2,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Sun,
  Moon,
  Laptop,
  Check,
} from 'lucide-react';
import { AccentColor } from '../../types/todo';
import { ACCENT_PALETTES } from '../../utils/theme';
import { exportDataAsJSON, exportTasksAsCSV, parseImportJSON } from '../../utils/storage';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    settings,
    updateSettings,
    tasks,
    categories,
    resetToSampleData,
    clearAllTasks,
    importTasks,
    showToast,
  } = useTodo();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isSettingsOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const data = parseImportJSON(content);
      if (data) {
        importTasks(data.tasks, data.categories, data.settings);
      } else {
        showToast({
          title: 'Import failed',
          message: 'The file format was invalid or corrupted.',
          type: 'error',
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const accentOptions: { key: AccentColor; name: string; hex: string }[] = Object.entries(
    ACCENT_PALETTES
  ).map(([key, val]) => ({
    key: key as AccentColor,
    name: val.name,
    hex: val.hex,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={() => setIsSettingsOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 max-h-[90vh] overflow-y-auto animate-pop-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Application Settings
            </h2>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-6 pt-4 text-xs">
          
          {/* Section 1: Appearance */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              <span>Appearance & Theme</span>
            </div>

            {/* Theme switcher */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'light' })}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border transition-all ${
                  settings.theme === 'light'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border transition-all ${
                  settings.theme === 'dark'
                    ? 'border-indigo-500 bg-indigo-950/60 text-indigo-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ theme: 'system' })}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border transition-all ${
                  settings.theme === 'system'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Laptop className="w-4 h-4 text-slate-500" />
                <span>System</span>
              </button>
            </div>

            {/* Accent colors */}
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-2 font-medium">
                Accent Color Theme:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {accentOptions.map(accent => {
                  const isSelected = settings.accentColor === accent.key;
                  return (
                    <button
                      key={accent.key}
                      onClick={() => updateSettings({ accentColor: accent.key })}
                      className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 transition-all"
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: accent.hex }}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                      </span>
                      <span
                        className={`text-[11px] ${
                          isSelected ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {accent.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Audio & Delight */}
          <div className="pt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Sound & Feedback
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-indigo-500" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      Audio Effects
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Chime sounds on task completion and Pomodoro alerts
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={e => updateSettings({ soundEnabled: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      Confetti Celebration
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Celebratory confetti shower when checking off tasks
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.confettiEnabled}
                  onChange={e => updateSettings({ confettiEnabled: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    Show Completed Tasks in Views
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Display finished items at the bottom of active task views
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showCompletedInView}
                  onChange={e => updateSettings({ showCompletedInView: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Data Backup, Import & Export */}
          <div className="pt-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Data Management & Backup
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              <button
                onClick={() => exportDataAsJSON(tasks, categories, settings)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold transition-colors"
              >
                <Download className="w-4 h-4 text-indigo-500" />
                <span>Export JSON Backup</span>
              </button>

              <button
                onClick={() => exportTasksAsCSV(tasks, categories)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-500" />
                <span>Export CSV Spreadsheet</span>
              </button>
            </div>

            {/* Import file input */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Import JSON Backup File</span>
              </button>
            </div>

            {/* Danger Zone */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
              <button
                onClick={resetToSampleData}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Data</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
                    clearAllTasks();
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete All Tasks</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

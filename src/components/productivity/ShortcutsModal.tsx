import React from 'react';
import { useTodo } from '../../context/TodoContext';
import { X, Keyboard } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen } = useTodo();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: 'N', desc: 'Create a new task' },
    { key: '/', desc: 'Focus global search input' },
    { key: 'Esc', desc: 'Close any open modal or cancel input' },
    { key: '?', desc: 'Open keyboard shortcuts cheat sheet' },
    { key: 'Enter', desc: 'Quickly submit or save in form inputs' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={() => setIsShortcutsOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 animate-pop-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 my-4">
          {shortcuts.map(sc => (
            <div key={sc.key} className="flex items-center justify-between py-2.5 text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {sc.desc}
              </span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-center text-slate-400 mt-2">
          Speed up your workflow using these productivity shortcuts anytime.
        </p>

      </div>
    </div>
  );
};

import React, { useRef, useEffect } from 'react';
import { useTodo } from '../../context/TodoContext';
import {
  Search,
  Plus,
  Timer,
  BarChart3,
  Settings,
  Menu,
  X,
  Keyboard,
  CheckCircle2,
  Moon,
  Sun,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    setSidebarOpen,
    setIsTaskModalOpen,
    setEditingTask,
    setIsPomodoroOpen,
    setIsStatsOpen,
    setIsSettingsOpen,
    setIsShortcutsOpen,
    pomodoro,
    settings,
    updateSettings,
  } = useTodo();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global hotkeys for search (/) and new task (n)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (!isInput) {
        if (e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) {
          e.preventDefault();
          searchInputRef.current?.focus();
        } else if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          setEditingTask(null);
          setIsTaskModalOpen(true);
        } else if (e.key === '?') {
          e.preventDefault();
          setIsShortcutsOpen(true);
        }
      } else if (e.key === 'Escape') {
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setEditingTask, setIsTaskModalOpen, setIsShortcutsOpen]);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  // Format pomodoro seconds mm:ss
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-200 bg-clip-text text-transparent">
                TaskFlow
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 ml-1.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tasks, tags, notes... (/)"
              className="w-full pl-9 pr-12 py-1.5 text-sm bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden md:inline-flex items-center justify-center absolute right-2.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 shadow-xs pointer-events-none">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Right: Action Buttons & Modals trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Pomodoro Timer button */}
          <button
            onClick={() => setIsPomodoroOpen(true)}
            className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              pomodoro.isRunning
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 ring-1 ring-rose-500/30 animate-pulse-subtle'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Pomodoro Focus Timer"
          >
            <Timer className="w-4 h-4" />
            <span className="hidden sm:inline">
              {pomodoro.isRunning ? formatTimer(pomodoro.timeLeft) : 'Focus'}
            </span>
            {pomodoro.isRunning && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>

          {/* Stats Button */}
          <button
            onClick={() => setIsStatsOpen(true)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Productivity Insights & Stats"
            aria-label="Insights"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Theme Quick Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle Theme"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Shortcuts Info */}
          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="hidden sm:inline-flex p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Keyboard Shortcuts (?)"
            aria-label="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* New Task Button */}
          <button
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 active:scale-[0.98] transition-all ml-1"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">New Task</span>
            <kbd className="hidden lg:inline-block ml-1 px-1 py-0.2 text-[10px] bg-white/20 rounded font-normal">
              N
            </kbd>
          </button>

        </div>

      </div>
    </header>
  );
};

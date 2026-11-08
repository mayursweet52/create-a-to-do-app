import React from 'react';
import { useTodo } from '../../context/TodoContext';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Timer,
  Sparkles,
} from 'lucide-react';

export const PomodoroDrawer: React.FC = () => {
  const {
    isPomodoroOpen,
    setIsPomodoroOpen,
    pomodoro,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    switchPomodoroMode,
    linkPomodoroTask,
    tasks,
  } = useTodo();

  if (!isPomodoroOpen) return null;

  const activeTask = tasks.find(t => t.id === pomodoro.activeTaskId);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((pomodoro.totalTime - pomodoro.timeLeft) / pomodoro.totalTime) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={() => setIsPomodoroOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 text-center animate-pop-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-rose-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Focus Pomodoro
            </h2>
          </div>
          <button
            onClick={() => setIsPomodoroOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl my-5 text-xs font-semibold">
          <button
            onClick={() => switchPomodoroMode('focus')}
            className={`flex-1 py-1.5 px-3 rounded-xl transition-all ${
              pomodoro.mode === 'focus'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => switchPomodoroMode('shortBreak')}
            className={`flex-1 py-1.5 px-3 rounded-xl transition-all ${
              pomodoro.mode === 'shortBreak'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => switchPomodoroMode('longBreak')}
            className={`flex-1 py-1.5 px-3 rounded-xl transition-all ${
              pomodoro.mode === 'longBreak'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Linked Task Banner */}
        <div className="mb-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs text-left">
          <div className="flex items-center justify-between text-slate-400 font-medium mb-1">
            <span>Linked Task:</span>
            {activeTask && (
              <button
                onClick={() => linkPomodoroTask(null)}
                className="text-[10px] text-slate-400 hover:text-rose-500"
              >
                Unlink
              </button>
            )}
          </div>
          {activeTask ? (
            <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {activeTask.title}
            </p>
          ) : (
            <select
              value=""
              onChange={e => linkPomodoroTask(e.target.value)}
              className="w-full bg-transparent text-slate-600 dark:text-slate-400 outline-none cursor-pointer text-xs"
            >
              <option value="">Select a task to focus on...</option>
              {tasks.filter(t => !t.completed).map(t => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Circular Progress & Timer Display */}
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center my-3">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              className="text-slate-100 dark:text-slate-800 stroke-current"
              strokeWidth="6"
              cx="50"
              cy="50"
              r="44"
              fill="transparent"
            />
            <circle
              className={`stroke-current transition-all duration-500 ${
                pomodoro.mode === 'focus'
                  ? 'text-rose-500'
                  : pomodoro.mode === 'shortBreak'
                  ? 'text-emerald-500'
                  : 'text-indigo-500'
              }`}
              strokeWidth="6"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progress) / 100}
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="44"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {formatTime(pomodoro.timeLeft)}
            </span>
            <span className="text-xs uppercase font-semibold tracking-wider text-slate-400 mt-1 capitalize">
              {pomodoro.mode === 'focus' ? 'Deep Work' : 'Recharge Break'}
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={resetPomodoro}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={pomodoro.isRunning ? pausePomodoro : startPomodoro}
            className={`px-8 py-3.5 rounded-2xl font-bold text-white shadow-lg flex items-center gap-2 transition-all active:scale-95 ${
              pomodoro.mode === 'focus'
                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
            }`}
          >
            {pomodoro.isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              const nextMode = pomodoro.mode === 'focus' ? 'shortBreak' : 'focus';
              switchPomodoroMode(nextMode);
            }}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Skip to next session"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Sessions completed badge */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Sessions Completed Today:</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {pomodoro.sessionsCompleted}
          </span>
        </div>

      </div>
    </div>
  );
};

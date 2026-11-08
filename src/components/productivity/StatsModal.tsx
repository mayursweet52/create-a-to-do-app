import React from 'react';
import { useTodo } from '../../context/TodoContext';
import {
  X,
  BarChart3,
  Flame,
} from 'lucide-react';
import { isDueToday, isOverdue } from '../../utils/date';

export const StatsModal: React.FC = () => {
  const { isStatsOpen, setIsStatsOpen, tasks, categories, pomodoro } = useTodo();

  if (!isStatsOpen) return null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const overdueCount = tasks.filter(t => isOverdue(t.dueDate, t.completed)).length;
  const dueTodayCount = tasks.filter(t => isDueToday(t.dueDate) && !t.completed).length;

  const priorityCounts = {
    urgent: tasks.filter(t => t.priority === 'urgent' && !t.completed).length,
    high: tasks.filter(t => t.priority === 'high' && !t.completed).length,
    medium: tasks.filter(t => t.priority === 'medium' && !t.completed).length,
    low: tasks.filter(t => t.priority === 'low' && !t.completed).length,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={() => setIsStatsOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 max-h-[90vh] overflow-y-auto animate-pop-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Productivity & Analytics
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Performance snapshot & task breakdown
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsStatsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Tasks
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {totalTasks}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {pendingTasks} pending
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60">
            <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Completion
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {completionRate}%
            </div>
            <div className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
              {completedTasks} completed
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60">
            <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Due Today
            </div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
              {dueTodayCount}
            </div>
            <div className="text-[10px] text-amber-600/70 dark:text-amber-400/70 mt-0.5">
              Immediate attention
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60">
            <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              Overdue
            </div>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              {overdueCount}
            </div>
            <div className="text-[10px] text-rose-600/70 dark:text-rose-400/70 mt-0.5">
              Needs rescheduling
            </div>
          </div>

        </div>

        {/* Priority Distribution */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
            <span>Pending by Priority</span>
            <span className="text-[11px] font-normal text-slate-400">Total: {pendingTasks}</span>
          </div>

          <div className="space-y-2 text-xs">
            
            <div className="flex items-center gap-2">
              <span className="w-16 font-semibold text-rose-600 dark:text-rose-400">Urgent</span>
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all"
                  style={{ width: `${pendingTasks > 0 ? (priorityCounts.urgent / pendingTasks) * 100 : 0}%` }}
                />
              </div>
              <span className="w-6 text-right font-medium text-slate-600 dark:text-slate-400">
                {priorityCounts.urgent}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-16 font-semibold text-orange-600 dark:text-orange-400">High</span>
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all"
                  style={{ width: `${pendingTasks > 0 ? (priorityCounts.high / pendingTasks) * 100 : 0}%` }}
                />
              </div>
              <span className="w-6 text-right font-medium text-slate-600 dark:text-slate-400">
                {priorityCounts.high}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-16 font-semibold text-amber-600 dark:text-amber-400">Medium</span>
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${pendingTasks > 0 ? (priorityCounts.medium / pendingTasks) * 100 : 0}%` }}
                />
              </div>
              <span className="w-6 text-right font-medium text-slate-600 dark:text-slate-400">
                {priorityCounts.medium}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-16 font-semibold text-emerald-600 dark:text-emerald-400">Low</span>
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${pendingTasks > 0 ? (priorityCounts.low / pendingTasks) * 100 : 0}%` }}
                />
              </div>
              <span className="w-6 text-right font-medium text-slate-600 dark:text-slate-400">
                {priorityCounts.low}
              </span>
            </div>

          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Tasks by Category
          </div>

          <div className="space-y-2.5 text-xs">
            {categories.map(cat => {
              const catTasks = tasks.filter(t => t.categoryId === cat.id);
              const catCompleted = catTasks.filter(t => t.completed).length;
              const catTotal = catTasks.length;
              const catPercent = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;

              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {catCompleted}/{catTotal} done ({catPercent}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${catPercent}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pomodoro Focus Stats */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-rose-50 dark:from-indigo-950/40 dark:to-rose-950/40 border border-indigo-100 dark:border-indigo-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Focus Sprints Completed
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {pomodoro.sessionsCompleted * 25} minutes of concentrated deep work
              </div>
            </div>
          </div>
          <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
            {pomodoro.sessionsCompleted}
          </span>
        </div>

      </div>
    </div>
  );
};

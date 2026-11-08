import React from 'react';
import { useTodo } from '../../context/TodoContext';
import {
  Inbox,
  Calendar,
  CalendarDays,
  Star,
  CheckCircle2,
  FolderPlus,
  Flame,
  X,
  AlertOctagon,
} from 'lucide-react';
import { FilterView, Priority } from '../../types/todo';
import { isDueToday, isDueUpcoming, isOverdue } from '../../utils/date';

export const Sidebar: React.FC = () => {
  const {
    tasks,
    categories,
    currentView,
    setCurrentView,
    activeCategoryId,
    setActiveCategoryId,
    priorityFilter,
    setPriorityFilter,
    sidebarOpen,
    setSidebarOpen,
    setIsCategoryModalOpen,
    pomodoro,
  } = useTodo();

  // Compute counts
  const allCount = tasks.filter(t => !t.completed).length;
  const todayCount = tasks.filter(t => !t.completed && (isDueToday(t.dueDate) || isOverdue(t.dueDate, t.completed))).length;
  const upcomingCount = tasks.filter(t => !t.completed && isDueUpcoming(t.dueDate, 7)).length;
  const starredCount = tasks.filter(t => !t.completed && t.isStarred).length;
  const completedCount = tasks.filter(t => t.completed).length;

  const getCategoryCount = (categoryId: string) => {
    return tasks.filter(t => t.categoryId === categoryId && !t.completed).length;
  };

  const navItems: { view: FilterView; label: string; icon: React.ReactNode; count: number; colorClass: string }[] = [
    {
      view: 'all',
      label: 'All Tasks',
      icon: <Inbox className="w-4 h-4" />,
      count: allCount,
      colorClass: 'text-indigo-500',
    },
    {
      view: 'today',
      label: 'Today & Overdue',
      icon: <Calendar className="w-4 h-4" />,
      count: todayCount,
      colorClass: 'text-rose-500',
    },
    {
      view: 'upcoming',
      label: 'Upcoming (7 Days)',
      icon: <CalendarDays className="w-4 h-4" />,
      count: upcomingCount,
      colorClass: 'text-amber-500',
    },
    {
      view: 'starred',
      label: 'Starred & Important',
      icon: <Star className="w-4 h-4" />,
      count: starredCount,
      colorClass: 'text-yellow-500',
    },
    {
      view: 'completed',
      label: 'Completed',
      icon: <CheckCircle2 className="w-4 h-4" />,
      count: completedCount,
      colorClass: 'text-emerald-500',
    },
  ];

  const handleSelectView = (view: FilterView) => {
    setCurrentView(view);
    setActiveCategoryId(null);
    setSidebarOpen(false);
  };

  const handleSelectCategory = (catId: string) => {
    setCurrentView('category');
    setActiveCategoryId(catId);
    setSidebarOpen(false);
  };

  const priorityOptions: { priority: Priority | 'all'; label: string; color: string }[] = [
    { priority: 'all', label: 'All', color: 'bg-slate-400' },
    { priority: 'urgent', label: 'Urgent', color: 'bg-rose-500' },
    { priority: 'high', label: 'High', color: 'bg-orange-500' },
    { priority: 'medium', label: 'Medium', color: 'bg-amber-500' },
    { priority: 'low', label: 'Low', color: 'bg-emerald-500' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 z-40 h-[100dvh] lg:h-[calc(100vh-4rem)] w-72 bg-white/95 dark:bg-slate-900/95 lg:bg-transparent dark:lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border-r border-slate-200/80 dark:border-slate-800 transition-transform duration-200 ease-in-out shrink-0 flex flex-col justify-between overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6">
          
          {/* Mobile Close Button */}
          <div className="flex lg:hidden items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Navigation</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Views */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
              Focus & Views
            </div>
            <nav className="space-y-1">
              {navItems.map(item => {
                const isActive = currentView === item.view && activeCategoryId === null;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleSelectView(item.view)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : item.colorClass}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          isActive
                            ? 'bg-indigo-200/60 dark:bg-indigo-800/60 text-indigo-800 dark:text-indigo-200'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Categories
              </span>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 rounded transition-colors"
                title="Manage categories"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            <nav className="space-y-1">
              {categories.map(cat => {
                const isActive = currentView === 'category' && activeCategoryId === cat.id;
                const count = getCategoryCount(cat.id);

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-slate-200/70 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="truncate">{cat.name}</span>
                    </div>
                    {count > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px]">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Priority Quick Filter */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2 flex items-center gap-1.5">
              <AlertOctagon className="w-3 h-3" />
              <span>Priority Filter</span>
            </div>
            <div className="grid grid-cols-5 gap-1 px-2">
              {priorityOptions.map(p => {
                const isSelected = priorityFilter === p.priority;
                return (
                  <button
                    key={p.priority}
                    onClick={() => setPriorityFilter(p.priority)}
                    className={`py-1 px-1 text-[11px] font-medium rounded-lg text-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Productivity Widget */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 m-3 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Daily Flow
                </div>
                <div className="text-[11px] text-slate-400">
                  {completedCount} tasks completed
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <span>Pomodoro Focus:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {pomodoro.sessionsCompleted} {pomodoro.sessionsCompleted === 1 ? 'sprint' : 'sprints'}
            </span>
          </div>
        </div>

      </aside>
    </>
  );
};

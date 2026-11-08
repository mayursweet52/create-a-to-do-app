import React from 'react';
import { useTodo } from '../../context/TodoContext';
import { TaskCard } from './TaskCard';
import { QuickAddTask } from './QuickAddTask';
import {
  ArrowUpDown,
  CheckCircle,
  Inbox,
  Calendar,
  Plus,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { SortOption } from '../../types/todo';

export const TaskList: React.FC = () => {
  const {
    filteredTasks,
    currentView,
    activeCategoryId,
    categories,
    searchQuery,
    priorityFilter,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    selectedTaskIds,
    selectAllVisible,
    clearSelection,
    setIsTaskModalOpen,
    setEditingTask,
    resetToSampleData,
  } = useTodo();

  const activeCategory = categories.find(c => c.id === activeCategoryId);

  const getViewTitle = () => {
    if (searchQuery.trim()) {
      return `Search results for "${searchQuery}"`;
    }
    switch (currentView) {
      case 'today':
        return "Today & Overdue";
      case 'upcoming':
        return "Upcoming Tasks";
      case 'starred':
        return "Starred & Important";
      case 'completed':
        return "Completed Tasks";
      case 'category':
        return activeCategory ? activeCategory.name : "Category";
      case 'all':
      default:
        return "All Tasks";
    }
  };

  const getViewSubtitle = () => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.completed).length;
    const pending = total - completed;

    if (total === 0) return 'No tasks found';
    return `${pending} pending • ${completed} completed`;
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0) {
      clearSelection();
    } else {
      selectAllVisible(filteredTasks.map(t => t.id));
    }
  };

  const isAllSelected = filteredTasks.length > 0 && selectedTaskIds.length === filteredTasks.length;

  return (
    <div className="space-y-5 pb-20">
      
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            {activeCategory && currentView === 'category' && (
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: activeCategory.color }}
              />
            )}
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {getViewTitle()}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {getViewSubtitle()}
          </p>
        </div>

        {/* Toolbar: Sort & Select All */}
        <div className="flex items-center gap-2 text-xs">
          
          {/* Select all button */}
          {filteredTasks.length > 0 && (
            <button
              onClick={handleSelectAll}
              className={`px-2.5 py-1.5 rounded-xl border font-medium transition-all ${
                isAllSelected
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {isAllSelected ? 'Deselect All' : 'Select All'}
            </button>
          )}

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="bg-transparent outline-none font-medium cursor-pointer"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
              <option value="createdAt">Created Date</option>
              <option value="subtasks">Subtasks Count</option>
            </select>

            <button
              onClick={toggleSortDirection}
              className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title={`Sort direction: ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Quick Add Task Input at top */}
      <QuickAddTask />

      {/* Tasks List or Empty State */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="py-16 px-4 text-center bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-4 shadow-inner">
            {currentView === 'completed' ? (
              <CheckCircle className="w-8 h-8 stroke-[1.5]" />
            ) : currentView === 'today' ? (
              <Calendar className="w-8 h-8 stroke-[1.5]" />
            ) : (
              <Inbox className="w-8 h-8 stroke-[1.5]" />
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
            {searchQuery
              ? 'No matching tasks found'
              : priorityFilter !== 'all'
              ? `No ${priorityFilter} priority tasks`
              : currentView === 'completed'
              ? 'No completed tasks yet'
              : 'All clear! Nothing on your plate'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            {searchQuery
              ? 'Try modifying your search term or clear the filter to see all tasks.'
              : currentView === 'completed'
              ? 'Completed tasks will show up here once you check them off.'
              : 'Enjoy your free time, or create a new task to stay organized and productive!'}
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Task</span>
            </button>

            <button
              onClick={resetToSampleData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Load Sample Tasks</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

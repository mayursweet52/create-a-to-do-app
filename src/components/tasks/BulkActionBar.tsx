import React from 'react';
import { useTodo } from '../../context/TodoContext';
import { Square, Trash2, Flag, Folder, X, Check } from 'lucide-react';
import { Priority } from '../../types/todo';

export const BulkActionBar: React.FC = () => {
  const {
    selectedTaskIds,
    clearSelection,
    bulkToggleCompleted,
    bulkDelete,
    bulkSetPriority,
    bulkSetCategory,
    categories,
    tasks,
  } = useTodo();

  if (selectedTaskIds.length === 0) return null;

  const selectedTasks = tasks.filter(t => selectedTaskIds.includes(t.id));
  const allSelectedCompleted = selectedTasks.length > 0 && selectedTasks.every(t => t.completed);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center gap-2 sm:gap-3 animate-slide-down max-w-[95vw] overflow-x-auto">
      
      {/* Count pill */}
      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500 text-white shrink-0">
        {selectedTaskIds.length} selected
      </span>

      <div className="h-4 w-px bg-slate-700 shrink-0" />

      {/* Toggle Complete */}
      <button
        onClick={() => bulkToggleCompleted(!allSelectedCompleted)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shrink-0"
      >
        {allSelectedCompleted ? (
          <>
            <Square className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Mark Incomplete</span>
          </>
        ) : (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
            <span className="hidden sm:inline">Mark Complete</span>
          </>
        )}
      </button>

      {/* Priority change dropdown */}
      <div className="relative shrink-0 flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-xs font-medium">
        <Flag className="w-3.5 h-3.5 text-amber-400" />
        <select
          onChange={e => {
            if (e.target.value) {
              bulkSetPriority(e.target.value as Priority);
              e.target.value = '';
            }
          }}
          defaultValue=""
          className="bg-transparent text-white outline-none cursor-pointer text-xs"
        >
          <option value="" disabled className="bg-slate-900 text-slate-400">
            Priority
          </option>
          <option value="urgent" className="bg-slate-900 text-rose-400">Urgent</option>
          <option value="high" className="bg-slate-900 text-orange-400">High</option>
          <option value="medium" className="bg-slate-900 text-amber-400">Medium</option>
          <option value="low" className="bg-slate-900 text-emerald-400">Low</option>
        </select>
      </div>

      {/* Category change dropdown */}
      <div className="relative shrink-0 flex items-center gap-1 px-2 py-1 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-xs font-medium">
        <Folder className="w-3.5 h-3.5 text-indigo-400" />
        <select
          onChange={e => {
            if (e.target.value) {
              bulkSetCategory(e.target.value);
              e.target.value = '';
            }
          }}
          defaultValue=""
          className="bg-transparent text-white outline-none cursor-pointer text-xs max-w-[100px] truncate"
        >
          <option value="" disabled className="bg-slate-900 text-slate-400">
            Category
          </option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id} className="bg-slate-900 text-slate-200">
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Delete button */}
      <button
        onClick={bulkDelete}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition-colors shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Delete</span>
      </button>

      {/* Clear selection */}
      <button
        onClick={clearSelection}
        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 ml-1"
        title="Deselect all"
      >
        <X className="w-4 h-4" />
      </button>

    </div>
  );
};

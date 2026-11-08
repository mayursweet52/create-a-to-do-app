import React, { useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import { Plus, Calendar, Flag, Folder, ArrowRight } from 'lucide-react';
import { Priority } from '../../types/todo';
import { getTodayString } from '../../utils/date';

export const QuickAddTask: React.FC = () => {
  const { addTask, categories, activeCategoryId, currentView, settings } = useTodo();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>(settings.defaultPriority || 'medium');
  const [categoryId, setCategoryId] = useState<string>(
    activeCategoryId || (categories[0]?.id ?? '')
  );
  const [dueDate, setDueDate] = useState<string>(
    currentView === 'today' ? getTodayString() : ''
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      priority,
      categoryId: categoryId || (categories[0]?.id ?? ''),
      dueDate: dueDate || undefined,
      completed: false,
      isStarred: false,
      subtasks: [],
      tags: [],
    });

    setTitle('');
    if (currentView !== 'today') {
      setDueDate('');
    }
    setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </div>
        
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task... (press Enter to save)"
          className="flex-1 bg-transparent text-sm sm:text-base outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-medium"
        />

        <button
          onClick={() => handleSubmit()}
          disabled={!title.trim()}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
        >
          <span className="hidden sm:inline">Add</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded quick options */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 animate-fade-in text-xs">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Priority selection */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <Flag className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="bg-transparent outline-none text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent Priority</option>
              </select>
            </div>

            {/* Category selection */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <Folder className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="bg-transparent outline-none text-slate-700 dark:text-slate-300 font-medium cursor-pointer max-w-[140px] truncate"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due date */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="bg-transparent outline-none text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
              />
            </div>

          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-2 py-1"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import { X, Plus, Trash2, Folder, Check } from 'lucide-react';

const COLOR_PRESETS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#64748b', // slate
];

export const CategoryModal: React.FC = () => {
  const {
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    categories,
    addCategory,
    deleteCategory,
    tasks,
  } = useTodo();

  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0]);

  if (!isCategoryModalOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addCategory({
      name: newName.trim(),
      color: selectedColor,
    });

    setNewName('');
    setSelectedColor(COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={() => setIsCategoryModalOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 animate-pop-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Manage Categories
            </h2>
          </div>
          <button
            onClick={() => setIsCategoryModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories List */}
        <div className="my-4 max-h-56 overflow-y-auto space-y-2 pr-1">
          {categories.map(cat => {
            const taskCount = tasks.filter(t => t.categoryId === cat.id).length;
            const canDelete = categories.length > 1;

            return (
              <div
                key={cat.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({taskCount} {taskCount === 1 ? 'task' : 'tasks'})
                  </span>
                </div>

                {canDelete && (
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleCreate} className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Create New Category
          </div>

          <div>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Category name (e.g. Design, Finance)..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Color swatches */}
          <div className="flex items-center justify-between gap-1 pt-1">
            <span className="text-xs text-slate-400 font-medium">Color:</span>
            <div className="flex items-center gap-2">
              {COLOR_PRESETS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                >
                  {selectedColor === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!newName.trim()}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </form>

      </div>
    </div>
  );
};

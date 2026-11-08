import React, { useState, useEffect } from 'react';
import { useTodo } from '../../context/TodoContext';
import { Priority, Subtask } from '../../types/todo';
import {
  X,
  Calendar,
  Clock,
  Tag,
  Trash2,
  Star,
} from 'lucide-react';

export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    setIsTaskModalOpen,
    editingTask,
    setEditingTask,
    addTask,
    updateTask,
    categories,
    settings,
  } = useTodo();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>(undefined);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // Sync state when editingTask or modal open changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority);
      setCategoryId(editingTask.categoryId);
      setDueDate(editingTask.dueDate || '');
      setDueTime(editingTask.dueTime || '');
      setIsStarred(editingTask.isStarred);
      setEstimatedMinutes(editingTask.estimatedMinutes);
      setSubtasks(editingTask.subtasks || []);
      setTags(editingTask.tags || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority(settings.defaultPriority || 'medium');
      setCategoryId(categories[0]?.id || '');
      setDueDate('');
      setDueTime('');
      setIsStarred(false);
      setEstimatedMinutes(undefined);
      setSubtasks([]);
      setTags([]);
    }
  }, [editingTask, isTaskModalOpen, categories, settings.defaultPriority]);

  if (!isTaskModalOpen) return null;

  const handleClose = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        categoryId: categoryId || categories[0]?.id || '',
        dueDate: dueDate || undefined,
        dueTime: dueTime || undefined,
        isStarred,
        estimatedMinutes: estimatedMinutes || undefined,
        subtasks,
        tags,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        categoryId: categoryId || categories[0]?.id || '',
        dueDate: dueDate || undefined,
        dueTime: dueTime || undefined,
        completed: false,
        isStarred,
        estimatedMinutes: estimatedMinutes || undefined,
        subtasks,
        tags,
      });
    }

    if (settings.autoCloseModalOnSave) {
      handleClose();
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub: Subtask = {
      id: 'st_' + Date.now() + Math.random().toString(36).substring(2, 6),
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map(s => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleAddTag = () => {
    const cleanTag = newTagInput.trim().replace(/^#/, '');
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const priorities: { val: Priority; label: string; bg: string; text: string }[] = [
    { val: 'urgent', label: 'Urgent', bg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800', text: 'text-rose-600 dark:text-rose-400' },
    { val: 'high', label: 'High', bg: 'bg-orange-50 dark:bg-orange-950/60 border-orange-300 dark:border-orange-800', text: 'text-orange-600 dark:text-orange-400' },
    { val: 'medium', label: 'Medium', bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800', text: 'text-amber-600 dark:text-amber-400' },
    { val: 'low', label: 'Low', bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800', text: 'text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h2>
            <button
              type="button"
              onClick={() => setIsStarred(!isStarred)}
              className={`p-1 rounded-lg transition-colors ${
                isStarred
                  ? 'text-yellow-400 hover:text-yellow-500'
                  : 'text-slate-300 hover:text-yellow-400'
              }`}
              title="Star task"
            >
              <Star className={`w-5 h-5 ${isStarred ? 'fill-current' : ''}`} />
            </button>
          </div>

          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be accomplished?"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm sm:text-base font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Notes & Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add relevant context, checklists, or links..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {priorities.map(p => {
                const isSelected = priority === p.val;
                return (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => setPriority(p.val)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                      isSelected
                        ? `${p.bg} ${p.text} ring-2 ring-indigo-500/30`
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category & Estimation row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Est. Duration (Minutes)
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={estimatedMinutes !== undefined ? estimatedMinutes : ''}
                onChange={e => setEstimatedMinutes(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                placeholder="e.g. 25"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Due Date</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium outline-none focus:border-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Due Time (Optional)</span>
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={e => setDueTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium outline-none focus:border-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Subtasks Section */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Subtasks ({subtasks.filter(s => s.completed).length}/{subtasks.length})
            </label>

            <div className="space-y-2 mb-2">
              {subtasks.map(st => (
                <div key={st.id} className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(st.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className={`text-xs truncate ${st.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {st.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={e => setNewSubtaskTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add a subtask..."
                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Tags</span>
            </label>

            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-medium"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={e => setNewTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag (e.g. Design, Sprint)..."
                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                Add Tag
              </button>
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            {editingTask ? 'Save Changes' : 'Create Task'}
          </button>
        </div>

      </div>
    </div>
  );
};

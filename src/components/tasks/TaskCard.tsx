import React, { useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import { Task, Priority } from '../../types/todo';
import {
  Check,
  Star,
  Calendar,
  Clock,
  MoreVertical,
  Edit3,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  Play,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { formatDate, isDueToday, isOverdue } from '../../utils/date';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const {
    categories,
    toggleTask,
    toggleStar,
    deleteTask,
    duplicateTask,
    setEditingTask,
    setIsTaskModalOpen,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    selectedTaskIds,
    toggleSelectTask,
    linkPomodoroTask,
    setIsPomodoroOpen,
    startPomodoro,
    pomodoro,
  } = useTodo();

  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const category = categories.find(c => c.id === task.categoryId);
  const isSelected = selectedTaskIds.includes(task.id);
  const overdue = isOverdue(task.dueDate, task.completed);
  const dueToday = isDueToday(task.dueDate);

  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const subtasksPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const isCurrentPomo = pomodoro.activeTaskId === task.id;

  const getPriorityStyle = (p: Priority) => {
    switch (p) {
      case 'urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/60';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-900/60';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/60';
      case 'low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/60';
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const handleStartFocus = () => {
    linkPomodoroTask(task.id);
    startPomodoro();
    setIsPomodoroOpen(true);
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-75 hover:opacity-100'
          : isSelected
          ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800/90 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="p-4 sm:p-4.5">
        <div className="flex items-start gap-3">
          
          {/* Select Checkbox (Bulk selection) */}
          <button
            onClick={() => toggleSelectTask(task.id)}
            className={`mt-1 w-4 h-4 rounded border transition-colors flex items-center justify-center shrink-0 ${
              isSelected
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 opacity-40 group-hover:opacity-100'
            }`}
            title="Select for bulk action"
          >
            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
          </button>

          {/* Completion Button */}
          <button
            onClick={() => toggleTask(task.id)}
            className={`mt-0.5 w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${
              task.completed
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs shadow-emerald-500/30'
                : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400 text-transparent hover:text-emerald-500/40'
            }`}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
          >
            <Check className={`w-3.5 h-3.5 stroke-[3] ${task.completed ? 'animate-check' : ''}`} />
          </button>

          {/* Task Core Content */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                onClick={() => {
                  setEditingTask(task);
                  setIsTaskModalOpen(true);
                }}
                className={`font-semibold text-sm sm:text-base leading-snug cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors select-none ${
                  task.completed
                    ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {task.title}
              </h3>

              {/* Star Button */}
              <button
                onClick={() => toggleStar(task.id)}
                className={`p-1 rounded-lg transition-colors shrink-0 ${
                  task.isStarred
                    ? 'text-yellow-400 hover:text-yellow-500'
                    : 'text-slate-300 dark:text-slate-600 hover:text-yellow-400'
                }`}
                aria-label="Star task"
              >
                <Star className={`w-4 h-4 ${task.isStarred ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Description note if any */}
            {task.description && (
              <p
                onClick={() => {
                  setEditingTask(task);
                  setIsTaskModalOpen(true);
                }}
                className={`text-xs mt-1.5 cursor-pointer line-clamp-2 ${
                  task.completed ? 'text-slate-400/80 dark:text-slate-600' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Badges / Metadata row */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
              
              {/* Category */}
              {category && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </span>
              )}

              {/* Priority */}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-semibold capitalize ${getPriorityStyle(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>

              {/* Due Date */}
              {task.dueDate && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                    overdue
                      ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                      : dueToday
                      ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.dueDate)}</span>
                  {task.dueTime && (
                    <span className="opacity-80">@{task.dueTime}</span>
                  )}
                  {overdue && <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />}
                </span>
              )}

              {/* Subtask count toggle badge */}
              {totalSubtasks > 0 && (
                <button
                  onClick={() => setShowSubtasks(!showSubtasks)}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium transition-colors"
                >
                  <CheckCircle className="w-3 h-3 text-indigo-500" />
                  <span>
                    {completedSubtasks}/{totalSubtasks}
                  </span>
                  {showSubtasks ? (
                    <ChevronUp className="w-3 h-3 ml-0.5" />
                  ) : (
                    <ChevronDown className="w-3 h-3 ml-0.5" />
                  )}
                </button>
              )}

              {/* Tags */}
              {task.tags && task.tags.map(tag => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono"
                >
                  #{tag}
                </span>
              ))}

              {/* Pomodoro Focus link badge if active */}
              {isCurrentPomo && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 text-[11px] font-semibold animate-pulse">
                  <Clock className="w-3 h-3" />
                  <span>Focus Active</span>
                </span>
              )}

            </div>

            {/* Subtasks Progress Bar (if subtasks exist) */}
            {totalSubtasks > 0 && (
              <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${subtasksPercent}%` }}
                />
              </div>
            )}

            {/* Expandable Subtasks Checklist */}
            {showSubtasks && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-slide-down">
                {task.subtasks.map(st => (
                  <div key={st.id} className="flex items-center justify-between group/st text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => toggleSubtask(task.id, st.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                      />
                      <span
                        className={`truncate ${
                          st.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {st.title}
                      </span>
                    </label>
                    <button
                      onClick={() => deleteSubtask(task.id, st.id)}
                      className="opacity-0 group-hover/st:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Add subtask input */}
                <form onSubmit={handleAddSubtask} className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={e => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add subtask..."
                    className="flex-1 text-xs px-2.5 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!newSubtaskTitle.trim()}
                    className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-lg text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* Right Action Menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-7 z-40 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 text-xs animate-pop-in">
                  
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleStartFocus();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-rose-500 fill-current" />
                    <span>Focus with Pomodoro</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setEditingTask(task);
                      setIsTaskModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Task</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowSubtasks(!showSubtasks);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Subtasks ({totalSubtasks})</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      duplicateTask(task.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Duplicate Task</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      deleteTask(task.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Task</span>
                  </button>

                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

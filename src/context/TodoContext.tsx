import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Task,
  Category,
  AppSettings,
  FilterView,
  SortOption,
  SortDirection,
  Priority,
  ToastMessage,
  PomodoroState,
} from '../types/todo';
import {
  loadTasks,
  saveTasks,
  loadCategories,
  saveCategories,
  loadSettings,
  saveSettings,
  loadPomodoroSessions,
  savePomodoroSessions,
  getSampleTasks,
  DEFAULT_CATEGORIES,
} from '../utils/storage';
import { playSound } from '../utils/audio';
import { fireConfetti } from '../utils/confetti';
import { applyTheme } from '../utils/theme';
import { isDueToday, isDueUpcoming, isOverdue } from '../utils/date';

interface TodoContextType {
  tasks: Task[];
  filteredTasks: Task[];
  categories: Category[];
  settings: AppSettings;
  currentView: FilterView;
  activeCategoryId: string | null;
  searchQuery: string;
  priorityFilter: Priority | 'all';
  sortBy: SortOption;
  sortDirection: SortDirection;
  selectedTaskIds: string[];
  toasts: ToastMessage[];
  
  // Modals / Drawers state
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  isPomodoroOpen: boolean;
  isStatsOpen: boolean;
  isSettingsOpen: boolean;
  isCategoryModalOpen: boolean;
  isShortcutsOpen: boolean;
  sidebarOpen: boolean;

  // Pomodoro
  pomodoro: PomodoroState;

  // Setters
  setCurrentView: (view: FilterView) => void;
  setActiveCategoryId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: Priority | 'all') => void;
  setSortBy: (sort: SortOption) => void;
  setSortDirection: (dir: SortDirection) => void;
  setSelectedTaskIds: React.Dispatch<React.SetStateAction<string[]>>;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTaskModalOpen: (open: boolean) => void;
  setEditingTask: (task: Task | null) => void;
  setIsPomodoroOpen: (open: boolean) => void;
  setIsStatsOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  setIsCategoryModalOpen: (open: boolean) => void;
  setIsShortcutsOpen: (open: boolean) => void;

  // Task Actions
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  toggleStar: (id: string) => void;
  duplicateTask: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  
  // Bulk Actions
  toggleSelectTask: (id: string) => void;
  selectAllVisible: (ids: string[]) => void;
  clearSelection: () => void;
  bulkToggleCompleted: (completed: boolean) => void;
  bulkDelete: () => void;
  bulkSetPriority: (priority: Priority) => void;
  bulkSetCategory: (categoryId: string) => void;

  // Category Actions
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Settings Actions
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Pomodoro Actions
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  switchPomodoroMode: (mode: 'focus' | 'shortBreak' | 'longBreak') => void;
  linkPomodoroTask: (taskId: string | null) => void;

  // Utility Actions
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  resetToSampleData: () => void;
  clearAllTasks: () => void;
  importTasks: (tasks: Task[], categories?: Category[], settings?: AppSettings) => void;
}

const TodoContext = createContext<TodoContextType | null>(null);

const FOCUS_SECONDS = 25 * 60;
const SHORT_BREAK_SECONDS = 5 * 60;
const LONG_BREAK_SECONDS = 15 * 60;

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [categories, setCategories] = useState<Category[]>(() => loadCategories());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  
  const [currentView, setCurrentView] = useState<FilterView>('all');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Pomodoro state
  const [pomodoro, setPomodoro] = useState<PomodoroState>(() => ({
    isActive: false,
    isRunning: false,
    mode: 'focus',
    timeLeft: FOCUS_SECONDS,
    totalTime: FOCUS_SECONDS,
    activeTaskId: null,
    sessionsCompleted: loadPomodoroSessions(),
  }));

  // Sync to storage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveSettings(settings);
    applyTheme(settings.theme, settings.accentColor);
  }, [settings]);

  useEffect(() => {
    savePomodoroSessions(pomodoro.sessionsCompleted);
  }, [pomodoro.sessionsCompleted]);

  // Pomodoro timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (pomodoro.isRunning && pomodoro.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoro(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (pomodoro.isRunning && pomodoro.timeLeft === 0) {
      // Completed session
      playSound('bell', settings.soundEnabled);
      fireConfetti(settings.confettiEnabled);

      if (pomodoro.mode === 'focus') {
        const nextSessions = pomodoro.sessionsCompleted + 1;
        const nextMode = nextSessions % 4 === 0 ? 'longBreak' : 'shortBreak';
        const nextTime = nextMode === 'longBreak' ? LONG_BREAK_SECONDS : SHORT_BREAK_SECONDS;
        setPomodoro(prev => ({
          ...prev,
          isRunning: false,
          mode: nextMode,
          timeLeft: nextTime,
          totalTime: nextTime,
          sessionsCompleted: nextSessions,
        }));
        showToast({
          title: 'Focus session finished! 🎉',
          message: `Great job! Time for a ${nextMode === 'longBreak' ? '15-minute' : '5-minute'} break.`,
          type: 'success',
        });
      } else {
        setPomodoro(prev => ({
          ...prev,
          isRunning: false,
          mode: 'focus',
          timeLeft: FOCUS_SECONDS,
          totalTime: FOCUS_SECONDS,
        }));
        showToast({
          title: 'Break finished! ⚡',
          message: 'Ready to dive back into your next focus sprint?',
          type: 'info',
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoro.isRunning, pomodoro.timeLeft, pomodoro.mode, settings.soundEnabled, settings.confettiEnabled]);

  // Toast helper
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((toastData: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    const toast: ToastMessage = {
      ...toastData,
      id,
      duration: toastData.duration ?? 4000,
    };
    setToasts(prev => [...prev.slice(-3), toast]);

    setTimeout(() => {
      removeToast(id);
    }, toast.duration);
  }, [removeToast]);

  // Task actions
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now() + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: taskData.subtasks || [],
      tags: taskData.tags || [],
    };

    setTasks(prev => [newTask, ...prev]);
    playSound('click', settings.soundEnabled);
    showToast({
      title: 'Task added',
      message: newTask.title,
      type: 'success',
    });
  }, [settings.soundEnabled, showToast]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          return {
            ...task,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;

    setTasks(prev => prev.filter(t => t.id !== id));
    setSelectedTaskIds(prev => prev.filter(taskId => taskId !== id));
    playSound('delete', settings.soundEnabled);

    // Provide Undo in toast
    showToast({
      title: 'Task deleted',
      message: target.title,
      type: 'info',
      action: {
        label: 'Undo',
        onClick: () => {
          setTasks(prev => [target, ...prev]);
          playSound('click', settings.soundEnabled);
        },
      },
    });
  }, [tasks, settings.soundEnabled, showToast]);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const nextCompleted = !task.completed;
          if (nextCompleted) {
            playSound('complete', settings.soundEnabled);
            fireConfetti(settings.confettiEnabled);
          } else {
            playSound('uncomplete', settings.soundEnabled);
          }
          return {
            ...task,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  }, [settings.soundEnabled, settings.confettiEnabled]);

  const toggleStar = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          return {
            ...task,
            isStarred: !task.isStarred,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
    playSound('click', settings.soundEnabled);
  }, [settings.soundEnabled]);

  const duplicateTask = useCallback((id: string) => {
    const source = tasks.find(t => t.id === id);
    if (!source) return;

    const copy: Task = {
      ...source,
      id: 'task_' + Date.now() + Math.random().toString(36).substring(2, 6),
      title: `${source.title} (Copy)`,
      completed: false,
      completedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: source.subtasks.map(s => ({
        ...s,
        id: 'st_' + Date.now() + Math.random().toString(36).substring(2, 6),
        completed: false,
      })),
    };

    setTasks(prev => [copy, ...prev]);
    playSound('click', settings.soundEnabled);
    showToast({
      title: 'Task duplicated',
      message: copy.title,
      type: 'info',
    });
  }, [tasks, settings.soundEnabled, showToast]);

  const addSubtask = useCallback((taskId: string, title: string) => {
    if (!title.trim()) return;
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const newSubtask = {
            id: 'st_' + Date.now() + Math.random().toString(36).substring(2, 6),
            title: title.trim(),
            completed: false,
          };
          return {
            ...task,
            subtasks: [...task.subtasks, newSubtask],
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map(s =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          );
          return {
            ...task,
            subtasks: updatedSubtasks,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
    playSound('click', settings.soundEnabled);
  }, [settings.soundEnabled]);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.filter(s => s.id !== subtaskId),
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  }, []);

  // Bulk actions
  const toggleSelectTask = useCallback((id: string) => {
    setSelectedTaskIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  const selectAllVisible = useCallback((ids: string[]) => {
    setSelectedTaskIds(ids);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTaskIds([]);
  }, []);

  const bulkToggleCompleted = useCallback((completed: boolean) => {
    if (selectedTaskIds.length === 0) return;
    setTasks(prev =>
      prev.map(task => {
        if (selectedTaskIds.includes(task.id)) {
          return {
            ...task,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
    if (completed) {
      playSound('complete', settings.soundEnabled);
      fireConfetti(settings.confettiEnabled);
    }
    showToast({
      title: completed ? 'Tasks completed' : 'Tasks uncompleted',
      message: `${selectedTaskIds.length} tasks updated`,
      type: 'success',
    });
    clearSelection();
  }, [selectedTaskIds, settings.soundEnabled, settings.confettiEnabled, showToast, clearSelection]);

  const bulkDelete = useCallback(() => {
    if (selectedTaskIds.length === 0) return;
    const count = selectedTaskIds.length;
    const deleted = tasks.filter(t => selectedTaskIds.includes(t.id));
    
    setTasks(prev => prev.filter(t => !selectedTaskIds.includes(t.id)));
    clearSelection();
    playSound('delete', settings.soundEnabled);

    showToast({
      title: `${count} tasks deleted`,
      type: 'info',
      action: {
        label: 'Undo',
        onClick: () => {
          setTasks(prev => [...deleted, ...prev]);
        },
      },
    });
  }, [selectedTaskIds, tasks, settings.soundEnabled, clearSelection, showToast]);

  const bulkSetPriority = useCallback((priority: Priority) => {
    if (selectedTaskIds.length === 0) return;
    setTasks(prev =>
      prev.map(task =>
        selectedTaskIds.includes(task.id)
          ? { ...task, priority, updatedAt: new Date().toISOString() }
          : task
      )
    );
    showToast({
      title: 'Priority updated',
      message: `${selectedTaskIds.length} tasks marked as ${priority}`,
      type: 'info',
    });
    clearSelection();
  }, [selectedTaskIds, showToast, clearSelection]);

  const bulkSetCategory = useCallback((categoryId: string) => {
    if (selectedTaskIds.length === 0) return;
    setTasks(prev =>
      prev.map(task =>
        selectedTaskIds.includes(task.id)
          ? { ...task, categoryId, updatedAt: new Date().toISOString() }
          : task
      )
    );
    showToast({
      title: 'Category updated',
      message: `${selectedTaskIds.length} tasks reassigned`,
      type: 'info',
    });
    clearSelection();
  }, [selectedTaskIds, showToast, clearSelection]);

  // Category actions
  const addCategory = useCallback((cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: 'cat_' + Date.now() + Math.random().toString(36).substring(2, 6),
    };
    setCategories(prev => [...prev, newCat]);
    showToast({
      title: 'Category created',
      message: newCat.name,
      type: 'success',
    });
  }, [showToast]);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    // Default affected tasks to the first category if available
    const fallbackId = categories.find(c => c.id !== id)?.id || '';
    setTasks(prev =>
      prev.map(t => (t.categoryId === id ? { ...t, categoryId: fallbackId } : t))
    );
    if (activeCategoryId === id) {
      setActiveCategoryId(null);
      setCurrentView('all');
    }
    showToast({
      title: 'Category removed',
      type: 'info',
    });
  }, [categories, activeCategoryId, showToast]);

  // Settings
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // Pomodoro
  const startPomodoro = useCallback(() => {
    setPomodoro(prev => ({ ...prev, isRunning: true, isActive: true }));
    playSound('click', settings.soundEnabled);
  }, [settings.soundEnabled]);

  const pausePomodoro = useCallback(() => {
    setPomodoro(prev => ({ ...prev, isRunning: false }));
    playSound('click', settings.soundEnabled);
  }, [settings.soundEnabled]);

  const resetPomodoro = useCallback(() => {
    const time =
      pomodoro.mode === 'focus'
        ? FOCUS_SECONDS
        : pomodoro.mode === 'shortBreak'
        ? SHORT_BREAK_SECONDS
        : LONG_BREAK_SECONDS;
    setPomodoro(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: time,
      totalTime: time,
    }));
  }, [pomodoro.mode]);

  const switchPomodoroMode = useCallback((mode: 'focus' | 'shortBreak' | 'longBreak') => {
    const time =
      mode === 'focus'
        ? FOCUS_SECONDS
        : mode === 'shortBreak'
        ? SHORT_BREAK_SECONDS
        : LONG_BREAK_SECONDS;
    setPomodoro(prev => ({
      ...prev,
      mode,
      timeLeft: time,
      totalTime: time,
      isRunning: false,
    }));
  }, []);

  const linkPomodoroTask = useCallback((taskId: string | null) => {
    setPomodoro(prev => ({ ...prev, activeTaskId: taskId, isActive: true }));
  }, []);

  // Reset & Clear
  const resetToSampleData = useCallback(() => {
    const samples = getSampleTasks();
    setTasks(samples);
    setCategories(DEFAULT_CATEGORIES);
    saveTasks(samples);
    saveCategories(DEFAULT_CATEGORIES);
    showToast({
      title: 'Sample data restored',
      message: 'Default tasks & categories loaded',
      type: 'info',
    });
  }, [showToast]);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
    saveTasks([]);
    clearSelection();
    showToast({
      title: 'All tasks deleted',
      type: 'warning',
    });
  }, [clearSelection, showToast]);

  const importTasks = useCallback((importedTasks: Task[], importedCats?: Category[], importedSettings?: AppSettings) => {
    if (Array.isArray(importedTasks) && importedTasks.length > 0) {
      setTasks(importedTasks);
    }
    if (importedCats && importedCats.length > 0) {
      setCategories(importedCats);
    }
    if (importedSettings) {
      setSettings(importedSettings);
    }
    showToast({
      title: 'Data imported successfully',
      message: `${importedTasks.length} tasks loaded`,
      type: 'success',
    });
  }, [showToast]);

  // Filtered and Sorted Tasks computation
  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q))) ||
          t.subtasks.some(s => s.title.toLowerCase().includes(q))
      );
    }

    // View filter
    if (currentView === 'today') {
      list = list.filter(t => isDueToday(t.dueDate) || isOverdue(t.dueDate, t.completed));
    } else if (currentView === 'upcoming') {
      list = list.filter(t => isDueUpcoming(t.dueDate, 7));
    } else if (currentView === 'starred') {
      list = list.filter(t => t.isStarred);
    } else if (currentView === 'completed') {
      list = list.filter(t => t.completed);
    } else if (currentView === 'category') {
      if (activeCategoryId) {
        list = list.filter(t => t.categoryId === activeCategoryId);
      }
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      list = list.filter(t => t.priority === priorityFilter);
    }

    // Completed visibility rule (if not explicitly on completed view)
    if (currentView !== 'completed' && !settings.showCompletedInView) {
      list = list.filter(t => !t.completed);
    }

    // Sorting
    const priorityWeight: Record<Priority, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    list.sort((a, b) => {
      // Completed items always sink to bottom unless on completed view
      if (currentView !== 'completed') {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
      }

      let comparison = 0;
      if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate + (a.dueTime ? 'T' + a.dueTime : 'T00:00:00')).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate + (b.dueTime ? 'T' + b.dueTime : 'T00:00:00')).getTime() : Infinity;
        comparison = dateA - dateB;
      } else if (sortBy === 'priority') {
        comparison = priorityWeight[b.priority] - priorityWeight[a.priority];
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'createdAt') {
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'subtasks') {
        comparison = b.subtasks.length - a.subtasks.length;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [
    tasks,
    searchQuery,
    currentView,
    activeCategoryId,
    priorityFilter,
    settings.showCompletedInView,
    sortBy,
    sortDirection,
  ]);

  return (
    <TodoContext.Provider
      value={{
        tasks,
        filteredTasks,
        categories,
        settings,
        currentView,
        activeCategoryId,
        searchQuery,
        priorityFilter,
        sortBy,
        sortDirection,
        selectedTaskIds,
        toasts,
        isTaskModalOpen,
        editingTask,
        isPomodoroOpen,
        isStatsOpen,
        isSettingsOpen,
        isCategoryModalOpen,
        isShortcutsOpen,
        sidebarOpen,
        pomodoro,
        setCurrentView,
        setActiveCategoryId,
        setSearchQuery,
        setPriorityFilter,
        setSortBy,
        setSortDirection,
        setSelectedTaskIds,
        setSidebarOpen,
        setIsTaskModalOpen,
        setEditingTask,
        setIsPomodoroOpen,
        setIsStatsOpen,
        setIsSettingsOpen,
        setIsCategoryModalOpen,
        setIsShortcutsOpen,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        toggleStar,
        duplicateTask,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
        toggleSelectTask,
        selectAllVisible,
        clearSelection,
        bulkToggleCompleted,
        bulkDelete,
        bulkSetPriority,
        bulkSetCategory,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
        startPomodoro,
        pausePomodoro,
        resetPomodoro,
        switchPomodoroMode,
        linkPomodoroTask,
        showToast,
        removeToast,
        resetToSampleData,
        clearAllTasks,
        importTasks,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

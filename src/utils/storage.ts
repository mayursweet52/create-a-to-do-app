import { Category, Task, AppSettings } from '../types/todo';
import { getTodayString } from './date';

const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks_v1',
  CATEGORIES: 'taskflow_categories_v1',
  SETTINGS: 'taskflow_settings_v1',
  POMODORO_SESSIONS: 'taskflow_pomo_sessions_v1',
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-work', name: 'Work & Projects', color: '#3b82f6' },
  { id: 'cat-personal', name: 'Personal', color: '#10b981' },
  { id: 'cat-shopping', name: 'Shopping & Errands', color: '#f59e0b' },
  { id: 'cat-health', name: 'Health & Wellness', color: '#f43f5e' },
  { id: 'cat-learning', name: 'Learning & Growth', color: '#8b5cf6' },
];

export function getSampleTasks(): Task[] {
  const today = getTodayString();
  const d = new Date();
  
  const tomorrowDate = new Date(d);
  tomorrowDate.setDate(d.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];

  const in3DaysDate = new Date(d);
  in3DaysDate.setDate(d.getDate() + 3);
  const in3Days = in3DaysDate.toISOString().split('T')[0];

  return [
    {
      id: 'task-1',
      title: 'Complete quarterly project roadmap & design doc',
      description: 'Review key milestones with the engineering and product team. Make sure API specifications are aligned.',
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: today,
      dueTime: '17:00',
      priority: 'urgent',
      categoryId: 'cat-work',
      isStarred: true,
      tags: ['Work', 'Q4', 'Roadmap'],
      estimatedMinutes: 60,
      spentMinutes: 25,
      subtasks: [
        { id: 'st-1', title: 'Outline core architectural changes', completed: true },
        { id: 'st-2', title: 'Gather feedback from senior engineers', completed: true },
        { id: 'st-3', title: 'Finalize presentation slides', completed: false },
        { id: 'st-4', title: 'Send summary email to stakeholders', completed: false },
      ]
    },
    {
      id: 'task-2',
      title: 'Review pull request & test API endpoints',
      description: 'Check auth middleware security and error handling edge cases.',
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: today,
      dueTime: '14:30',
      priority: 'high',
      categoryId: 'cat-work',
      isStarred: false,
      tags: ['Dev', 'CodeReview'],
      estimatedMinutes: 45,
      spentMinutes: 0,
      subtasks: [
        { id: 'st-5', title: 'Verify test coverage > 90%', completed: false },
        { id: 'st-6', title: 'Approve and merge branch', completed: false },
      ]
    },
    {
      id: 'task-3',
      title: 'Morning 5km run & mindful meditation',
      description: 'Maintain hydration and track heart rate stats.',
      completed: true,
      completedAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: today,
      priority: 'medium',
      categoryId: 'cat-health',
      isStarred: false,
      tags: ['Fitness', 'Habit'],
      estimatedMinutes: 35,
      spentMinutes: 35,
      subtasks: []
    },
    {
      id: 'task-4',
      title: 'Weekly grocery restock for meal prep',
      description: 'Visit the local farmers market for fresh organic produce.',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: tomorrow,
      priority: 'medium',
      categoryId: 'cat-shopping',
      isStarred: false,
      tags: ['Home', 'Food'],
      estimatedMinutes: 30,
      spentMinutes: 0,
      subtasks: [
        { id: 'st-7', title: 'Avocados & organic greens', completed: true },
        { id: 'st-8', title: 'Almond milk & Greek yogurt', completed: false },
        { id: 'st-9', title: 'Whole grain sourdough bread', completed: false },
        { id: 'st-10', title: 'Extra virgin olive oil', completed: false },
      ]
    },
    {
      id: 'task-5',
      title: 'Study React 19 compiler & server actions deep dive',
      description: 'Read the official documentation and experiment with memoization improvements in a sandbox.',
      completed: false,
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: in3Days,
      priority: 'low',
      categoryId: 'cat-learning',
      isStarred: true,
      tags: ['Tech', 'Study'],
      estimatedMinutes: 90,
      spentMinutes: 30,
      subtasks: [
        { id: 'st-11', title: 'Review official release notes', completed: true },
        { id: 'st-12', title: 'Build demo prototype using new hooks', completed: false },
      ]
    },
    {
      id: 'task-6',
      title: 'Plan itinerary and book lodging for holiday weekend',
      description: 'Check mountain cabin ratings, hiking trails, and nearby scenic viewpoints.',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: in3Days,
      priority: 'low',
      categoryId: 'cat-personal',
      isStarred: false,
      tags: ['Vacation', 'Adventure'],
      estimatedMinutes: 60,
      spentMinutes: 0,
      subtasks: []
    }
  ];
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  accentColor: 'indigo',
  soundEnabled: true,
  confettiEnabled: true,
  showCompletedInView: true,
  autoCloseModalOnSave: true,
  defaultPriority: 'medium',
};

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      const sample = getSampleTasks();
      saveTasks(sample);
      return sample;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading tasks from localStorage', e);
    return getSampleTasks();
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks to localStorage', e);
  }
}

export function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading categories from localStorage', e);
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Error saving categories to localStorage', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
  }
}

export function loadPomodoroSessions(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POMODORO_SESSIONS);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

export function savePomodoroSessions(count: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POMODORO_SESSIONS, count.toString());
  } catch {
    // Ignore
  }
}

export function exportDataAsJSON(tasks: Task[], categories: Category[], settings: AppSettings) {
  const data = {
    appName: 'TaskFlow',
    version: '1.0',
    exportDate: new Date().toISOString(),
    tasks,
    categories,
    settings,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taskflow-backup-${getTodayString()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportTasksAsCSV(tasks: Task[], categories: Category[]) {
  const categoryMap = new Map(categories.map(c => [c.id, c.name]));
  
  const headers = ['Title', 'Status', 'Priority', 'Category', 'Due Date', 'Due Time', 'Starred', 'Subtasks Progress', 'Tags', 'Created At'];
  
  const rows = tasks.map(t => {
    const totalSubtasks = t.subtasks.length;
    const doneSubtasks = t.subtasks.filter(s => s.completed).length;
    const subtaskStatus = totalSubtasks > 0 ? `${doneSubtasks}/${totalSubtasks}` : 'None';
    
    return [
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.completed ? 'Completed' : 'Pending',
      t.priority,
      `"${(categoryMap.get(t.categoryId) || 'None').replace(/"/g, '""')}"`,
      t.dueDate || '',
      t.dueTime || '',
      t.isStarred ? 'Yes' : 'No',
      `"${subtaskStatus}"`,
      `"${(t.tags || []).join(', ')}"`,
      t.createdAt ? t.createdAt.split('T')[0] : ''
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taskflow-tasks-${getTodayString()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseImportJSON(fileContent: string): { tasks: Task[]; categories?: Category[]; settings?: AppSettings } | null {
  try {
    const parsed = JSON.parse(fileContent);
    if (parsed && Array.isArray(parsed.tasks)) {
      return {
        tasks: parsed.tasks,
        categories: Array.isArray(parsed.categories) ? parsed.categories : undefined,
        settings: parsed.settings || undefined,
      };
    }
    // Alternatively, if raw array of tasks was exported
    if (Array.isArray(parsed)) {
      return { tasks: parsed };
    }
    return null;
  } catch {
    return null;
  }
}

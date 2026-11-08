export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string; // hex or tailwind identifier
  icon?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  categoryId: string;
  subtasks: Subtask[];
  isStarred: boolean;
  estimatedMinutes?: number;
  spentMinutes?: number;
  tags: string[];
}

export type FilterView = 'all' | 'today' | 'upcoming' | 'starred' | 'completed' | 'category';

export type SortOption = 'dueDate' | 'priority' | 'title' | 'createdAt' | 'subtasks';
export type SortDirection = 'asc' | 'desc';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber' | 'cyan' | 'blue';

export interface AppSettings {
  theme: ThemeMode;
  accentColor: AccentColor;
  soundEnabled: boolean;
  confettiEnabled: boolean;
  showCompletedInView: boolean;
  autoCloseModalOnSave: boolean;
  defaultPriority: Priority;
}

export interface PomodoroState {
  isActive: boolean;
  isRunning: boolean;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  timeLeft: number; // in seconds
  totalTime: number; // in seconds
  activeTaskId: string | null;
  sessionsCompleted: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

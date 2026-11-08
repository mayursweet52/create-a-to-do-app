import React from 'react';
import { TodoProvider } from './context/TodoContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { TaskList } from './components/tasks/TaskList';
import { BulkActionBar } from './components/tasks/BulkActionBar';
import { ToastContainer } from './components/common/Toast';
import { TaskModal } from './components/tasks/TaskModal';
import { PomodoroDrawer } from './components/productivity/PomodoroDrawer';
import { StatsModal } from './components/productivity/StatsModal';
import { CategoryModal } from './components/categories/CategoryModal';
import { ShortcutsModal } from './components/productivity/ShortcutsModal';
import { SettingsModal } from './components/settings/SettingsModal';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Left Navigation Sidebar */}
        <Sidebar />

        {/* Main Workspace */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <TaskList />
        </main>
      </div>

      {/* Floating Action Bars & Overlays */}
      <BulkActionBar />
      <ToastContainer />
      <TaskModal />
      <PomodoroDrawer />
      <StatsModal />
      <CategoryModal />
      <ShortcutsModal />
      <SettingsModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
};

export default App;

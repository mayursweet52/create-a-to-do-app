# ⚡ TaskFlow — Modern Intelligent To-Do & Productivity App

A feature-rich, high-performance To-Do and Task Management web application built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Vite**.

Designed for speed, clarity, and focus — combining intuitive task management with a built-in Pomodoro focus timer, subtask checklists, productivity analytics, data portability, and customizable themes.

---

## ✨ Features

### 📋 Core Task Management
- **Quick Task Capture**: Instant inline task creation with keyboard shortcut (`N` or press Enter).
- **Rich Task Details**: Titles, notes/descriptions, priority levels, categories, tags (`#tag`), due dates, and due times.
- **Subtasks & Checklists**: Break tasks down into smaller actionable checklist items with real-time progress bars.
- **Priority Matrix**: Visual indicators for **Urgent**, **High**, **Medium**, and **Low** priorities.
- **Smart Due Dates**: Relative date badges with visual highlights for **Today**, **Tomorrow**, and **Overdue** items.
- **Task Duplication & Fast Editing**: Duplicate recurring tasks or edit inline/modal with one click.
- **Undoable Deletion**: Safe deletion with floating toast notification and instant "Undo" button.

### ⏱️ Integrated Pomodoro Focus Timer
- **Deep Work & Breaks**: Preset 25-minute focus sprints, 5-minute short breaks, and 15-minute long breaks.
- **Task Linking**: Connect any active task directly to your Pomodoro session to track concentrated effort.
- **Visual Circular Progress**: Real-time animated timer ring with sound alerts upon session completion.
- **Focus Streak Tracking**: Daily counter for completed focus intervals.

### 📊 Productivity Dashboard & Insights
- Real-time completion rate percentage (`%`).
- Tasks breakdown by priority and category.
- Today's pending workload vs. overdue tasks that require immediate attention.
- Total focus sprints accomplished.

### 🗂️ Views, Filtering & Sorting
- **Smart Views**:
  - **All Tasks**: Complete overview of active and finished items.
  - **Today & Overdue**: Tasks requiring urgent focus today.
  - **Upcoming**: What's due in the next 7 days.
  - **Starred & Important**: Highlighted priority tasks.
  - **Completed**: Dedicated archive of accomplished tasks.
  - **Custom Categories**: Filter by Work, Personal, Shopping, Health, Learning, or custom created tags.
- **Dynamic Search (`/` or `Cmd+K`)**: Instant search across titles, descriptions, subtasks, and `#tags`.
- **Flexible Sorting**: Sort ascending/descending by Due Date, Priority, Title, Created Date, or Subtask Count.

### ⚡ Bulk Actions
- Select multiple tasks at once.
- Batch mark as Complete / Incomplete.
- Bulk change priority or assign category in a single step.
- Bulk delete with undo safeguard.

### 🎨 Personalization & Delight
- **Dark Mode / Light Mode / System Default**: Seamless theme switching with smooth transitions.
- **Custom Accent Palettes**: Choose between Indigo, Emerald, Violet, Rose, Amber, Cyan, and Blue themes.
- **Subtle Sound Effects**: Pleasing Web Audio API chimes when completing tasks or finishing focus timers (toggleable in settings).
- **Celebratory Confetti**: Rewarding confetti burst upon checking off tasks.

### 💾 Data Portability & Persistence
- **100% Local-First**: Automatic localStorage persistence with zero server setup required.
- **JSON Export & Import**: Backup and restore your complete workspace anytime.
- **CSV Export**: Export your tasks into a spreadsheet-ready `.csv` file.
- **Sample Data Loader**: Pre-loaded with realistic sample tasks and categories to immediately explore features.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| <kbd>N</kbd> | Open New Task modal |
| <kbd>/</kbd> or <kbd>Ctrl/Cmd + K</kbd> | Focus global search input |
| <kbd>Esc</kbd> | Close active modal or blur search |
| <kbd>?</kbd> | Open Keyboard Shortcuts cheat sheet |
| <kbd>Enter</kbd> | Add task / submit current form |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended, tested on v22)
- npm, pnpm, or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mayursweet52/create-a-to-do-app.git
   cd create-a-to-do-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview the production build**:
   ```bash
   npm run preview
   ```

---

## 📂 Project Structure

```
├── index.html                   # Entry HTML with custom typography
├── package.json                 # Project dependencies & scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind design tokens & dark mode configuration
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite bundler configuration
└── src/
    ├── main.tsx                 # React entry point
    ├── App.tsx                  # Root application layout
    ├── index.css                # Global styles & custom scrollbars
    ├── types/
    │   └── todo.ts              # TypeScript interfaces (Task, Category, Settings, etc.)
    ├── utils/
    │   ├── audio.ts             # Web Audio API synthesizer for sound effects
    │   ├── confetti.ts          # Confetti particle burst helpers
    │   ├── date.ts              # Relative dates & overdue calculations
    │   ├── storage.ts           # LocalStorage, JSON import/export, CSV export
    │   └── theme.ts             # Dark/Light & accent color palette manager
    ├── context/
    │   └── TodoContext.tsx      # Global state provider & actions
    └── components/
        ├── layout/
        │   ├── Header.tsx       # Navbar with search, quick actions & modals
        │   └── Sidebar.tsx      # Navigation views, categories & daily flow badge
        ├── tasks/
        │   ├── QuickAddTask.tsx # Inline fast task input
        │   ├── TaskCard.tsx     # Interactive task card with subtasks & quick menu
        │   ├── TaskList.tsx     # Task view list, sorting bar & empty states
        │   ├── TaskModal.tsx    # Modal for creating and editing tasks
        │   └── BulkActionBar.tsx# Floating multi-selection action toolbar
        ├── productivity/
        │   ├── PomodoroDrawer.tsx # Circular focus timer with focus & break modes
        │   ├── StatsModal.tsx   # Productivity analytics & priority breakdown
        │   └── ShortcutsModal.tsx # Keyboard shortcuts reference
        ├── categories/
        │   └── CategoryModal.tsx# Custom category manager with color swatches
        ├── settings/
        │   └── SettingsModal.tsx# Theme, audio, data import/export controls
        └── common/
            └── Toast.tsx        # Toast notifications with Undo support
```

---

## 📄 License
MIT

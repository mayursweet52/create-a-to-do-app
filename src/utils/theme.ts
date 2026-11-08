import { AccentColor, ThemeMode } from '../types/todo';

export const ACCENT_PALETTES: Record<AccentColor, { name: string; hex: string; lightHex: string; values: Record<string, string> }> = {
  indigo: {
    name: 'Indigo',
    hex: '#6366f1',
    lightHex: '#eef2ff',
    values: {
      '--color-primary-50': '#eef2ff',
      '--color-primary-100': '#e0e7ff',
      '--color-primary-200': '#c7d2fe',
      '--color-primary-300': '#a5b4fc',
      '--color-primary-400': '#818cf8',
      '--color-primary-500': '#6366f1',
      '--color-primary-600': '#4f46e5',
      '--color-primary-700': '#4338ca',
      '--color-primary-800': '#3730a3',
      '--color-primary-900': '#312e81',
    }
  },
  emerald: {
    name: 'Emerald',
    hex: '#10b981',
    lightHex: '#ecfdf5',
    values: {
      '--color-primary-50': '#ecfdf5',
      '--color-primary-100': '#d1fae5',
      '--color-primary-200': '#a7f3d0',
      '--color-primary-300': '#6ee7b7',
      '--color-primary-400': '#34d399',
      '--color-primary-500': '#10b981',
      '--color-primary-600': '#059669',
      '--color-primary-700': '#047857',
      '--color-primary-800': '#065f46',
      '--color-primary-900': '#064e3b',
    }
  },
  violet: {
    name: 'Violet',
    hex: '#8b5cf6',
    lightHex: '#f5f3ff',
    values: {
      '--color-primary-50': '#f5f3ff',
      '--color-primary-100': '#ede9fe',
      '--color-primary-200': '#ddd6fe',
      '--color-primary-300': '#c4b5fd',
      '--color-primary-400': '#a78bfa',
      '--color-primary-500': '#8b5cf6',
      '--color-primary-600': '#7c3aed',
      '--color-primary-700': '#6d28d9',
      '--color-primary-800': '#5b21b6',
      '--color-primary-900': '#4c1d95',
    }
  },
  rose: {
    name: 'Rose',
    hex: '#f43f5e',
    lightHex: '#fff1f2',
    values: {
      '--color-primary-50': '#fff1f2',
      '--color-primary-100': '#ffe4e6',
      '--color-primary-200': '#fecdd3',
      '--color-primary-300': '#fda4af',
      '--color-primary-400': '#fb7185',
      '--color-primary-500': '#f43f5e',
      '--color-primary-600': '#e11d48',
      '--color-primary-700': '#be123c',
      '--color-primary-800': '#9f1239',
      '--color-primary-900': '#881337',
    }
  },
  amber: {
    name: 'Amber',
    hex: '#f59e0b',
    lightHex: '#fffbeb',
    values: {
      '--color-primary-50': '#fffbeb',
      '--color-primary-100': '#fef3c7',
      '--color-primary-200': '#fde68a',
      '--color-primary-300': '#fcd34d',
      '--color-primary-400': '#fbbf24',
      '--color-primary-500': '#f59e0b',
      '--color-primary-600': '#d97706',
      '--color-primary-700': '#b45309',
      '--color-primary-800': '#92400e',
      '--color-primary-900': '#78350f',
    }
  },
  cyan: {
    name: 'Cyan',
    hex: '#06b6d4',
    lightHex: '#ecfeff',
    values: {
      '--color-primary-50': '#ecfeff',
      '--color-primary-100': '#cffafe',
      '--color-primary-200': '#a5f3fc',
      '--color-primary-300': '#67e8f9',
      '--color-primary-400': '#22d3ee',
      '--color-primary-500': '#06b6d4',
      '--color-primary-600': '#0891b2',
      '--color-primary-700': '#0e7490',
      '--color-primary-800': '#155e75',
      '--color-primary-900': '#164e63',
    }
  },
  blue: {
    name: 'Blue',
    hex: '#3b82f6',
    lightHex: '#eff6ff',
    values: {
      '--color-primary-50': '#eff6ff',
      '--color-primary-100': '#dbeafe',
      '--color-primary-200': '#bfdbfe',
      '--color-primary-300': '#93c5fd',
      '--color-primary-400': '#60a5fa',
      '--color-primary-500': '#3b82f6',
      '--color-primary-600': '#2563eb',
      '--color-primary-700': '#1d4ed8',
      '--color-primary-800': '#1e40af',
      '--color-primary-900': '#1e3a8a',
    }
  }
};

export function applyTheme(theme: ThemeMode, accent: AccentColor) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Set dark mode class
  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
  } else {
    // System
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  // Set CSS variables for accent
  const palette = ACCENT_PALETTES[accent] || ACCENT_PALETTES.indigo;
  for (const [key, val] of Object.entries(palette.values)) {
    root.style.setProperty(key, val);
  }
}

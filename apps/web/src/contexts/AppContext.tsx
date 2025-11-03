import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { TransformResult, MatchCtx } from '@css-windify/core';

/**
 * Application settings
 */
export interface AppSettings {
  strict: boolean;
  approximate: boolean;
  version: 'v3' | 'v4' | 'auto';
  theme: 'vs-dark' | 'vs-light';
  thresholds: {
    spacingPx: number;
    fontPx: number;
    radiiPx: number;
  };
  exportFormat: 'json' | 'markdown';
}

/**
 * Application state
 */
interface AppState {
  // CSS Input
  cssInput: string;
  setCssInput: (css: string) => void;

  // Transform Result
  result: TransformResult | null;
  setResult: (result: TransformResult | null) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // UI State
  activeTab: 'warnings' | 'coverage' | 'settings';
  setActiveTab: (tab: 'warnings' | 'coverage' | 'settings') => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const DEFAULT_SETTINGS: AppSettings = {
  strict: false,
  approximate: true,
  version: 'auto',
  theme: 'vs-dark',
  thresholds: {
    spacingPx: 2,
    fontPx: 1,
    radiiPx: 2,
  },
  exportFormat: 'json',
};

const STORAGE_KEY = 'csswindify-settings';

/**
 * Load settings from localStorage
 */
function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

/**
 * App Context Provider
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [cssInput, setCssInput] = useState('');
  const [result, setResult] = useState<TransformResult | null>(null);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [activeTab, setActiveTab] = useState<'warnings' | 'coverage' | 'settings'>('warnings');

  // Save settings to localStorage when they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const value: AppState = {
    cssInput,
    setCssInput,
    result,
    setResult,
    settings,
    updateSettings,
    activeTab,
    setActiveTab,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook to use App Context
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

/**
 * Get MatchCtx from settings
 */
export function getMatchCtxFromSettings(settings: AppSettings): MatchCtx {
  return {
    theme: {},
    version: settings.version,
    opts: {
      strict: settings.strict,
      approximate: settings.approximate,
      thresholds: settings.thresholds,
    },
  };
}

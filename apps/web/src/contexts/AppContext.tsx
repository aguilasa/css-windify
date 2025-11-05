'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  result: Record<string, TransformResult> | null;
  setResult: (result: Record<string, TransformResult> | null) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // UI State
  activeTab: 'warnings' | 'coverage' | 'settings';
  setActiveTab: (tab: 'warnings' | 'coverage' | 'settings') => void;

  // History
  history: string[];
  addToHistory: (css: string) => void;
  clearHistory: () => void;

  // Examples Modal
  showExamplesModal: boolean;
  setShowExamplesModal: (show: boolean) => void;

  // Share URL
  getShareableURL: () => string;
  loadFromURL: () => void;
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
const HISTORY_KEY = 'csswindify-history';
const LAST_CSS_KEY = 'csswindify-last-css';
const MAX_HISTORY = 5;
const MAX_URL_LENGTH = 2000;

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
  const [result, setResult] = useState<Record<string, TransformResult> | null>(null);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [activeTab, setActiveTab] = useState<'warnings' | 'coverage' | 'settings'>('warnings');
  const [history, setHistory] = useState<string[]>(() => loadHistory());
  const [showExamplesModal, setShowExamplesModal] = useState(false);

  // Load CSS from URL on mount
  useEffect(() => {
    loadFromURL();
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Save last CSS to localStorage
  useEffect(() => {
    if (cssInput) {
      try {
        localStorage.setItem(LAST_CSS_KEY, cssInput);
      } catch (error) {
        console.error('Failed to save CSS:', error);
      }
    }
  }, [cssInput]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }, [history]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addToHistory = (css: string) => {
    if (!css.trim()) return;
    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== css);
      return [css, ...filtered].slice(0, MAX_HISTORY);
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const getShareableURL = (): string => {
    try {
      const encoded = btoa(encodeURIComponent(cssInput));
      const url = `${window.location.origin}${window.location.pathname}#css=${encoded}`;

      if (url.length > MAX_URL_LENGTH) {
        throw new Error('CSS is too large to share via URL');
      }

      return url;
    } catch (error) {
      console.error('Failed to create shareable URL:', error);
      return '';
    }
  };

  const loadFromURL = () => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#css=')) {
        const encoded = hash.substring(5);
        const decoded = decodeURIComponent(atob(encoded));
        setCssInput(decoded);
        // Clear hash after loading
        window.history.replaceState(null, '', window.location.pathname);
      } else {
        // Load last CSS from localStorage
        const lastCSS = localStorage.getItem(LAST_CSS_KEY);
        if (lastCSS) {
          setCssInput(lastCSS);
        }
      }
    } catch (error) {
      console.error('Failed to load CSS from URL:', error);
    }
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
    history,
    addToHistory,
    clearHistory,
    showExamplesModal,
    setShowExamplesModal,
    getShareableURL,
    loadFromURL,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Load history from localStorage
 */
function loadHistory(): string[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load history:', error);
  }
  return [];
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
  // Convert 'auto' to 'v4' as default
  const version = settings.version === 'auto' ? 'v4' : settings.version;

  return {
    theme: {},
    version,
    opts: {
      strict: settings.strict,
      approximate: settings.approximate,
      thresholds: settings.thresholds,
      screens: {}, // Empty screens for now, can be populated from theme if needed
    },
  };
}

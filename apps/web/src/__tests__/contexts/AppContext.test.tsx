import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React, { type ReactNode } from 'react';
import { AppProvider, useApp } from '../../contexts/AppContext';

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = '';
  });

  const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>;

  describe('Initial State', () => {
    it('should provide initial state', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      expect(result.current.cssInput).toBe('');
      expect(result.current.result).toBeNull();
      expect(result.current.settings).toBeDefined();
      expect(result.current.activeTab).toBe('warnings');
      expect(result.current.history).toEqual([]);
      expect(result.current.showExamplesModal).toBe(false);
    });

    it('should have default settings', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      expect(result.current.settings).toEqual({
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
      });
    });
  });

  describe('CSS Input', () => {
    it('should update CSS input', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.setCssInput('.button { padding: 1rem; }');
      });

      expect(result.current.cssInput).toBe('.button { padding: 1rem; }');
    });

    it('should save CSS to localStorage', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.setCssInput('.test { color: red; }');
      });

      // Wait for effect
      setTimeout(() => {
        const saved = localStorage.getItem('csswindify-last-css');
        expect(saved).toBe('.test { color: red; }');
      }, 100);
    });
  });

  describe('Settings', () => {
    it('should update settings', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.updateSettings({ strict: true });
      });

      expect(result.current.settings.strict).toBe(true);
    });

    it('should persist settings to localStorage', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.updateSettings({ theme: 'vs-light' });
      });

      setTimeout(() => {
        const saved = localStorage.getItem('csswindify-settings');
        expect(saved).toContain('vs-light');
      }, 100);
    });
  });

  describe('History', () => {
    it('should add to history', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.addToHistory('.button { padding: 1rem; }');
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0]).toBe('.button { padding: 1rem; }');
    });

    it('should not add empty CSS to history', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.addToHistory('   ');
      });

      expect(result.current.history).toHaveLength(0);
    });

    it('should limit history to 5 items', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        for (let i = 0; i < 7; i++) {
          result.current.addToHistory(`.test${i} { color: red; }`);
        }
      });

      expect(result.current.history).toHaveLength(5);
    });

    it('should clear history', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.addToHistory('.test { color: red; }');
        result.current.clearHistory();
      });

      expect(result.current.history).toHaveLength(0);
    });
  });

  describe('Shareable URL', () => {
    it('should generate shareable URL', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.setCssInput('.button { padding: 1rem; }');
      });

      const url = result.current.getShareableURL();
      expect(url).toContain('#css=');
      expect(url).toContain(window.location.origin);
    });

    it('should handle empty CSS', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      const url = result.current.getShareableURL();
      expect(url).toContain('#css=');
    });
  });

  describe('Active Tab', () => {
    it('should change active tab', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.setActiveTab('coverage');
      });

      expect(result.current.activeTab).toBe('coverage');
    });
  });

  describe('Examples Modal', () => {
    it('should toggle examples modal', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.setShowExamplesModal(true);
      });

      expect(result.current.showExamplesModal).toBe(true);

      act(() => {
        result.current.setShowExamplesModal(false);
      });

      expect(result.current.showExamplesModal).toBe(false);
    });
  });
});

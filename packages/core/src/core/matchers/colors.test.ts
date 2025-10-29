import { describe, it, expect } from 'vitest';
import { matchColor } from './colors';
import { MatchCtx } from '../../types';

describe('colors matcher', () => {
  // Mock theme for testing
  const mockTheme = {
    colors: {
      black: '#000000',
      white: '#ffffff',
      primary: '#3b82f6',
      secondary: {
        '100': '#e0f2fe',
        '500': '#0ea5e9',
      },
      gray: {
        '100': '#f3f4f6',
        '200': '#e5e7eb',
        '300': '#d1d5db',
        '400': '#9ca3af',
        '500': '#6b7280',
        '600': '#4b5563',
        '700': '#374151',
        '800': '#1f2937',
        '900': '#111827',
      },
    },
  };

  const ctx: MatchCtx = {
    theme: mockTheme,
    version: 'v3',
    opts: {
      strict: false,
      approximate: false,
      thresholds: {
        spacingPx: 2,
        fontPx: 1,
        radiiPx: 2,
      },
      screens: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
      },
    },
  };

  describe('text color', () => {
    it('should match basic named colors', () => {
      expect(matchColor('text', 'black', ctx).class).toBe('text-black');
      expect(matchColor('text', 'white', ctx).class).toBe('text-white');
      expect(matchColor('text', 'transparent', ctx).class).toBe('text-transparent');
      expect(matchColor('text', 'current', ctx).class).toBe('text-current');
    });

    it('should match theme colors', () => {
      expect(matchColor('text', '#3b82f6', ctx).class).toBe('text-primary');
      expect(matchColor('text', '#e0f2fe', ctx).class).toBe('text-secondary-100');
      expect(matchColor('text', '#0ea5e9', ctx).class).toBe('text-secondary-500');
      expect(matchColor('text', '#6b7280', ctx).class).toBe('text-gray-500');
    });

    it('should handle hex colors with different formats', () => {
      expect(matchColor('text', '#fff', ctx).class).toBe('text-white');
      expect(matchColor('text', '#000', ctx).class).toBe('text-black');
    });

    it('should use arbitrary values for non-theme colors', () => {
      expect(matchColor('text', '#ff0000', ctx).class).toBe('text-[#ff0000]');
      expect(matchColor('text', 'rgb(255, 0, 0)', ctx).class).toBe('text-[rgb(255,0,0)]');
    });

    it('should handle CSS variables', () => {
      expect(matchColor('text', 'var(--color-primary)', ctx).class).toBe(
        'text-[var(--color-primary)]'
      );
    });

    it('should handle empty or invalid values', () => {
      expect(matchColor('text', '', ctx).class).toBe('');
      expect(matchColor('text', null as unknown as string, ctx).class).toBe('');
    });
  });

  describe('background color', () => {
    it('should match basic named colors', () => {
      expect(matchColor('bg', 'black', ctx).class).toBe('bg-black');
      expect(matchColor('bg', 'white', ctx).class).toBe('bg-white');
      expect(matchColor('bg', 'transparent', ctx).class).toBe('bg-transparent');
      expect(matchColor('bg', 'current', ctx).class).toBe('bg-current');
    });

    it('should match theme colors', () => {
      expect(matchColor('bg', '#3b82f6', ctx).class).toBe('bg-primary');
      expect(matchColor('bg', '#e0f2fe', ctx).class).toBe('bg-secondary-100');
      expect(matchColor('bg', '#0ea5e9', ctx).class).toBe('bg-secondary-500');
    });

    it('should use arbitrary values for non-theme colors', () => {
      expect(matchColor('bg', '#ff0000', ctx).class).toBe('bg-[#ff0000]');
      expect(matchColor('bg', 'rgb(255, 0, 0)', ctx).class).toBe('bg-[rgb(255,0,0)]');
    });
  });

  describe('border color', () => {
    it('should match basic named colors', () => {
      expect(matchColor('border', 'black', ctx).class).toBe('border-black');
      expect(matchColor('border', 'white', ctx).class).toBe('border-white');
      expect(matchColor('border', 'transparent', ctx).class).toBe('border-transparent');
      expect(matchColor('border', 'current', ctx).class).toBe('border-current');
    });

    it('should match theme colors', () => {
      expect(matchColor('border', '#3b82f6', ctx).class).toBe('border-primary');
      expect(matchColor('border', '#e0f2fe', ctx).class).toBe('border-secondary-100');
      expect(matchColor('border', '#0ea5e9', ctx).class).toBe('border-secondary-500');
    });

    it('should use arbitrary values for non-theme colors', () => {
      expect(matchColor('border', '#ff0000', ctx).class).toBe('border-[#ff0000]');
      expect(matchColor('border', 'rgb(255, 0, 0)', ctx).class).toBe('border-[rgb(255,0,0)]');
    });
  });
});

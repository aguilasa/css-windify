import { describe, it, expect } from 'vitest';
import { matchBorderWidth, matchBorderColor, matchBorderRadius } from './borders';
import { MatchCtx } from '../../types';

describe('borders matcher', () => {
  // Mock theme for testing
  const mockTheme = {
    colors: {
      'black': '#000000',
      'white': '#ffffff',
      'primary': '#3b82f6',
      'secondary': {
        '100': '#e0f2fe',
        '500': '#0ea5e9'
      }
    }
  };

  const ctx: MatchCtx = {
    theme: mockTheme,
    opts: {
      strict: false,
      approximate: false
    }
  };

  describe('border width', () => {
    it('should match predefined border widths', () => {
      expect(matchBorderWidth('0')).toBe('border-0');
      expect(matchBorderWidth('0px')).toBe('border-0');
      expect(matchBorderWidth('1px')).toBe('border');
      expect(matchBorderWidth('2px')).toBe('border-2');
      expect(matchBorderWidth('4px')).toBe('border-4');
      expect(matchBorderWidth('8px')).toBe('border-8');
    });

    it('should normalize values before matching', () => {
      expect(matchBorderWidth('  1px  ')).toBe('border');
      expect(matchBorderWidth('0PX')).toBe('border-0');
    });

    it('should use arbitrary values for non-predefined widths', () => {
      expect(matchBorderWidth('3px')).toBe('border-[3px]');
      expect(matchBorderWidth('0.5rem')).toBe('border-[0.5rem]');
    });

    it('should handle empty or invalid values', () => {
      expect(matchBorderWidth('')).toBe('');
      expect(matchBorderWidth(null as unknown as string)).toBe('');
    });
  });

  describe('border color', () => {
    it('should match basic named colors', () => {
      expect(matchBorderColor('black', ctx)).toBe('border-black');
      expect(matchBorderColor('white', ctx)).toBe('border-white');
      expect(matchBorderColor('transparent', ctx)).toBe('border-transparent');
    });

    it('should match theme colors', () => {
      expect(matchBorderColor('#3b82f6', ctx)).toBe('border-primary');
      expect(matchBorderColor('#e0f2fe', ctx)).toBe('border-secondary-100');
    });

    it('should use arbitrary values for non-theme colors', () => {
      expect(matchBorderColor('#ff0000', ctx)).toBe('border-[#ff0000]');
      expect(matchBorderColor('rgb(255, 0, 0)', ctx)).toBe('border-[rgb(255,0,0)]');
    });
  });

  describe('border radius', () => {
    it('should match predefined border radius values', () => {
      expect(matchBorderRadius('0')).toBe('rounded-none');
      expect(matchBorderRadius('0px')).toBe('rounded-none');
      expect(matchBorderRadius('0.125rem')).toBe('rounded-sm');
      expect(matchBorderRadius('0.25rem')).toBe('rounded');
      expect(matchBorderRadius('0.375rem')).toBe('rounded-md');
      expect(matchBorderRadius('0.5rem')).toBe('rounded-lg');
      expect(matchBorderRadius('0.75rem')).toBe('rounded-xl');
      expect(matchBorderRadius('1rem')).toBe('rounded-2xl');
      expect(matchBorderRadius('1.5rem')).toBe('rounded-3xl');
      expect(matchBorderRadius('9999px')).toBe('rounded-full');
      expect(matchBorderRadius('50%')).toBe('rounded-full');
    });

    it('should detect values close to "full" radius', () => {
      expect(matchBorderRadius('48%')).toBe('rounded-full');
      expect(matchBorderRadius('52%')).toBe('rounded-full');
      expect(matchBorderRadius('1000px')).toBe('rounded-full');
      expect(matchBorderRadius('9999rem')).toBe('rounded-[9999rem]'); // Not px, so not detected as "full"
    });

    it('should use arbitrary values for non-predefined radius', () => {
      expect(matchBorderRadius('0.3rem')).toBe('rounded-[0.3rem]');
      expect(matchBorderRadius('15px')).toBe('rounded-[15px]');
      expect(matchBorderRadius('30%')).toBe('rounded-[30%]');
    });

    it('should handle empty or invalid values', () => {
      expect(matchBorderRadius('')).toBe('');
      expect(matchBorderRadius(null as unknown as string)).toBe('');
    });
  });
});

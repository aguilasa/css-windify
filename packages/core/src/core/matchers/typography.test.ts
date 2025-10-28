import { describe, it, expect } from 'vitest';
import { matchTypography } from './typography';
import { MatchCtx } from '../../types';

describe('typography matcher', () => {
  // Mock theme for testing
  const mockTheme = {
    fontSize: {
      'xs': ['0.75rem', { lineHeight: '1rem' }],
      'sm': ['0.875rem', { lineHeight: '1.25rem' }],
      'base': ['1rem', { lineHeight: '1.5rem' }],
      'lg': ['1.125rem', { lineHeight: '1.75rem' }],
      'xl': ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
    },
    lineHeight: {
      'none': '1',
      'tight': '1.25',
      'normal': '1.5',
      'relaxed': '1.625',
      'loose': '2',
    }
  };

  const ctx: MatchCtx = {
    theme: mockTheme,
    opts: {
      strict: false,
      approximate: false
    }
  };

  describe('font-size', () => {
    it('should match font-size values from theme', () => {
      expect(matchTypography('font-size', '0.75rem', ctx)).toBe('text-xs');
      expect(matchTypography('font-size', '0.875rem', ctx)).toBe('text-sm');
      expect(matchTypography('font-size', '1rem', ctx)).toBe('text-base');
      expect(matchTypography('font-size', '1.125rem', ctx)).toBe('text-lg');
      expect(matchTypography('font-size', '1.25rem', ctx)).toBe('text-xl');
      expect(matchTypography('font-size', '1.5rem', ctx)).toBe('text-2xl');
    });

    it('should use arbitrary values for non-theme font-size values', () => {
      expect(matchTypography('font-size', '18px', ctx)).toBe('text-[18px]');
      expect(matchTypography('font-size', '2.5rem', ctx)).toBe('text-[2.5rem]');
      expect(matchTypography('font-size', '100%', ctx)).toBe('text-[100%]');
    });

    it('should handle empty or invalid font-size values', () => {
      expect(matchTypography('font-size', '', ctx)).toBe('');
      expect(matchTypography('font-size', null as unknown as string, ctx)).toBe('');
    });
  });

  describe('line-height', () => {
    it('should match line-height values from theme', () => {
      expect(matchTypography('line-height', '1', ctx)).toBe('leading-none');
      expect(matchTypography('line-height', '1.25', ctx)).toBe('leading-tight');
      expect(matchTypography('line-height', '1.5', ctx)).toBe('leading-normal');
      expect(matchTypography('line-height', '1.625', ctx)).toBe('leading-relaxed');
      expect(matchTypography('line-height', '2', ctx)).toBe('leading-loose');
    });

    it('should use arbitrary values for non-theme line-height values', () => {
      expect(matchTypography('line-height', '1.8', ctx)).toBe('leading-[1.8]');
      expect(matchTypography('line-height', '24px', ctx)).toBe('leading-[24px]');
      expect(matchTypography('line-height', '150%', ctx)).toBe('leading-[150%]');
    });

    it('should handle empty or invalid line-height values', () => {
      expect(matchTypography('line-height', '', ctx)).toBe('');
      expect(matchTypography('line-height', null as unknown as string, ctx)).toBe('');
    });
  });

  describe('letter-spacing', () => {
    it('should match predefined letter-spacing values', () => {
      expect(matchTypography('letter-spacing', 'normal', ctx)).toBe('tracking-normal');
      expect(matchTypography('letter-spacing', '0', ctx)).toBe('tracking-normal');
      expect(matchTypography('letter-spacing', '0px', ctx)).toBe('tracking-normal');
      expect(matchTypography('letter-spacing', '0.05em', ctx)).toBe('tracking-wide');
      expect(matchTypography('letter-spacing', '0.1em', ctx)).toBe('tracking-wider');
      expect(matchTypography('letter-spacing', '-0.05em', ctx)).toBe('tracking-tight');
      expect(matchTypography('letter-spacing', '-0.1em', ctx)).toBe('tracking-tighter');
    });

    it('should use arbitrary values for non-predefined letter-spacing values', () => {
      expect(matchTypography('letter-spacing', '0.2em', ctx)).toBe('tracking-[0.2em]');
      expect(matchTypography('letter-spacing', '2px', ctx)).toBe('tracking-[2px]');
      expect(matchTypography('letter-spacing', '-1px', ctx)).toBe('tracking-[-1px]');
    });

    it('should handle empty or invalid letter-spacing values', () => {
      expect(matchTypography('letter-spacing', '', ctx)).toBe('');
      expect(matchTypography('letter-spacing', null as unknown as string, ctx)).toBe('');
    });
  });

  describe('invalid property', () => {
    it('should return empty string for invalid typography property', () => {
      expect(matchTypography('invalid' as any, 'value', ctx)).toBe('');
    });
  });
});

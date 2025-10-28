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
      expect(matchTypography('font-size', '0.75rem', ctx).class).toBe('text-xs');
      expect(matchTypography('font-size', '0.875rem', ctx).class).toBe('text-sm');
      expect(matchTypography('font-size', '1rem', ctx).class).toBe('text-base');
      expect(matchTypography('font-size', '1.125rem', ctx).class).toBe('text-lg');
      expect(matchTypography('font-size', '1.25rem', ctx).class).toBe('text-xl');
      expect(matchTypography('font-size', '1.5rem', ctx).class).toBe('text-2xl');
    });

    it('should use arbitrary values for non-theme font-size values', () => {
      expect(matchTypography('font-size', '18px', ctx).class).toBe('text-[18px]');
      expect(matchTypography('font-size', '2.5rem', ctx).class).toBe('text-[2.5rem]');
      expect(matchTypography('font-size', '100%', ctx).class).toBe('text-[100%]');
    });

    it('should handle empty or invalid font-size values', () => {
      expect(matchTypography('font-size', '', ctx).class).toBe('');
      expect(matchTypography('font-size', null as unknown as string, ctx).class).toBe('');
    });
  });

  describe('line-height', () => {
    it('should match line-height values from theme', () => {
      expect(matchTypography('line-height', '1', ctx).class).toBe('leading-none');
      expect(matchTypography('line-height', '1.25', ctx).class).toBe('leading-tight');
      expect(matchTypography('line-height', '1.5', ctx).class).toBe('leading-normal');
      expect(matchTypography('line-height', '1.625', ctx).class).toBe('leading-relaxed');
      expect(matchTypography('line-height', '2', ctx).class).toBe('leading-loose');
    });

    it('should use arbitrary values for non-theme line-height values', () => {
      expect(matchTypography('line-height', '1.8', ctx).class).toBe('leading-[1.8]');
      expect(matchTypography('line-height', '24px', ctx).class).toBe('leading-[24px]');
      expect(matchTypography('line-height', '150%', ctx).class).toBe('leading-[150%]');
    });

    it('should handle empty or invalid line-height values', () => {
      expect(matchTypography('line-height', '', ctx).class).toBe('');
      expect(matchTypography('line-height', null as unknown as string, ctx).class).toBe('');
    });
  });

  describe('letter-spacing', () => {
    it('should match predefined letter-spacing values', () => {
      expect(matchTypography('letter-spacing', 'normal', ctx).class).toBe('tracking-normal');
      expect(matchTypography('letter-spacing', '0', ctx).class).toBe('tracking-normal');
      expect(matchTypography('letter-spacing', '0px', ctx).class).toBe('tracking-normal');
      expect(matchTypography('letter-spacing', '0.05em', ctx).class).toBe('tracking-wide');
      expect(matchTypography('letter-spacing', '0.1em', ctx).class).toBe('tracking-wider');
      expect(matchTypography('letter-spacing', '-0.05em', ctx).class).toBe('tracking-tight');
      expect(matchTypography('letter-spacing', '-0.1em', ctx).class).toBe('tracking-tighter');
    });

    it('should use arbitrary values for non-predefined letter-spacing values', () => {
      expect(matchTypography('letter-spacing', '0.2em', ctx).class).toBe('tracking-[0.2em]');
      expect(matchTypography('letter-spacing', '2px', ctx).class).toBe('tracking-[2px]');
      expect(matchTypography('letter-spacing', '-1px', ctx).class).toBe('tracking-[-1px]');
    });

    it('should handle empty or invalid letter-spacing values', () => {
      expect(matchTypography('letter-spacing', '', ctx).class).toBe('');
      expect(matchTypography('letter-spacing', null as unknown as string, ctx).class).toBe('');
    });
  });

  describe('invalid property', () => {
    it('should return empty string for invalid typography property', () => {
      expect(matchTypography('invalid' as any, 'value', ctx).class).toBe('');
    });
  });

  describe('approximate matching', () => {
    // Create a context with approximate matching enabled
    const approxCtx: MatchCtx = {
      theme: mockTheme,
      opts: {
        strict: false,
        approximate: true
      }
    };

    it('should approximate font-size values when approximate is enabled', () => {
      // 15px is close to 16px (1rem/text-base) or 14px (0.875rem/text-sm)
      const result = matchTypography('font-size', '15px', approxCtx);
      expect(result.class).toBe('text-sm');
      expect(result.warning).toContain('approximate mapping');
      expect(result.warning).toContain('15px');
      expect(result.warning).toContain('text-sm');
    });

    it('should not approximate when strict mode is enabled', () => {
      // Create a context with strict mode enabled
      const strictCtx: MatchCtx = {
        theme: mockTheme,
        opts: {
          strict: true,
          approximate: true // This should be ignored when strict is true
        }
      };

      // 15px should use arbitrary value in strict mode
      const result = matchTypography('font-size', '15px', strictCtx);
      expect(result.class).toBe('text-[15px]');
      expect(result.warning).toBeUndefined();
    });
  });
});

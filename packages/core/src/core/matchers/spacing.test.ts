import { describe, it, expect } from 'vitest';
import { matchSpacing } from './spacing';
import { MatchCtx } from '../../types';

describe('spacing matcher', () => {
  // Mock theme for testing
  const mockTheme = {
    spacing: {
      '0': '0px',
      '1': '0.25rem',
      '2': '0.5rem',
      '4': '1rem',
      '8': '2rem',
      'px': '1px',
    }
  };

  const ctx: MatchCtx = {
    theme: mockTheme,
    opts: {
      strict: false,
      approximate: false
    }
  };

  describe('single values', () => {
    it('should match width values from theme', () => {
      expect(matchSpacing('w', '1rem', ctx).classes).toEqual(['w-4']);
      expect(matchSpacing('w', '0.25rem', ctx).classes).toEqual(['w-1']);
      expect(matchSpacing('w', '0px', ctx).classes).toEqual(['w-0']);
    });

    it('should match height values from theme', () => {
      expect(matchSpacing('h', '2rem', ctx).classes).toEqual(['h-8']);
      expect(matchSpacing('h', '0.5rem', ctx).classes).toEqual(['h-2']);
    });

    it('should match position values from theme', () => {
      expect(matchSpacing('top', '1rem', ctx).classes).toEqual(['top-4']);
      expect(matchSpacing('right', '0.25rem', ctx).classes).toEqual(['right-1']);
      expect(matchSpacing('bottom', '2rem', ctx).classes).toEqual(['bottom-8']);
      expect(matchSpacing('left', '0.5rem', ctx).classes).toEqual(['left-2']);
    });

    it('should use arbitrary values for non-theme values', () => {
      expect(matchSpacing('w', '15px', ctx).classes).toEqual(['w-[15px]']);
      expect(matchSpacing('h', '3.5rem', ctx).classes).toEqual(['h-[3.5rem]']);
      expect(matchSpacing('top', '25%', ctx).classes).toEqual(['top-[25%]']);
    });

    it('should handle special values', () => {
      expect(matchSpacing('w', 'auto', ctx).classes).toEqual(['w-auto']);
      expect(matchSpacing('h', '0', ctx).classes).toEqual(['h-0']);
    });

    it('should handle empty or invalid values', () => {
      expect(matchSpacing('w', '', ctx).classes).toEqual([]);
      expect(matchSpacing('h', null as unknown as string, ctx).classes).toEqual([]);
    });
  });

  describe('margin shorthand', () => {
    it('should handle single value margin', () => {
      expect(matchSpacing('m', '1rem', ctx).classes).toEqual(['m-4']);
      expect(matchSpacing('m', '0', ctx).classes).toEqual(['m-0']);
    });

    it('should handle two-value margin', () => {
      // Vertical | Horizontal
      const result = matchSpacing('m', '1rem 2rem', ctx).classes;
      expect(result).toContain('my-4');
      expect(result).toContain('mx-8');
    });

    it('should handle three-value margin', () => {
      // Top | Horizontal | Bottom
      const result = matchSpacing('m', '1rem 2rem 0.5rem', ctx).classes;
      expect(result).toContain('mt-4');
      expect(result).toContain('mr-8');
      expect(result).toContain('ml-8');
      expect(result).toContain('mb-2');
    });

    it('should handle four-value margin', () => {
      // Top | Right | Bottom | Left
      const result = matchSpacing('m', '1rem 2rem 0.5rem 0.25rem', ctx).classes;
      expect(result).toContain('mt-4');
      expect(result).toContain('mr-8');
      expect(result).toContain('mb-2');
      expect(result).toContain('ml-1');
    });

    it('should handle arbitrary values in margin shorthand', () => {
      const result = matchSpacing('m', '10px 15px', ctx).classes;
      expect(result).toContain('mx-[15px]');
      expect(result).toContain('my-[10px]');
    });
  });

  describe('padding shorthand', () => {
    it('should handle single value padding', () => {
      expect(matchSpacing('p', '1rem', ctx).classes).toEqual(['p-4']);
      expect(matchSpacing('p', '0', ctx).classes).toEqual(['p-0']);
    });

    it('should handle two-value padding', () => {
      // Vertical | Horizontal
      const result = matchSpacing('p', '1rem 2rem', ctx).classes;
      expect(result).toContain('py-4');
      expect(result).toContain('px-8');
    });

    it('should handle three-value padding', () => {
      // Top | Horizontal | Bottom
      const result = matchSpacing('p', '1rem 2rem 0.5rem', ctx).classes;
      expect(result).toContain('pt-4');
      expect(result).toContain('pr-8');
      expect(result).toContain('pl-8');
      expect(result).toContain('pb-2');
    });

    it('should handle four-value padding', () => {
      // Top | Right | Bottom | Left
      const result = matchSpacing('p', '1rem 2rem 0.5rem 0.25rem', ctx).classes;
      expect(result).toContain('pt-4');
      expect(result).toContain('pr-8');
      expect(result).toContain('pb-2');
      expect(result).toContain('pl-1');
    });

    it('should handle arbitrary values in padding shorthand', () => {
      const result = matchSpacing('p', '10px 15px', ctx).classes;
      expect(result).toContain('px-[15px]');
      expect(result).toContain('py-[10px]');
    });
  });

  describe('different unit types', () => {
    it('should handle px values', () => {
      expect(matchSpacing('w', '1px', ctx).classes).toEqual(['w-px']);
      expect(matchSpacing('h', '10px', ctx).classes).toEqual(['h-[10px]']);
    });

    it('should handle rem values', () => {
      expect(matchSpacing('w', '1rem', ctx).classes).toEqual(['w-4']);
      expect(matchSpacing('h', '3rem', ctx).classes).toEqual(['h-[3rem]']);
    });

    it('should handle percentage values', () => {
      expect(matchSpacing('w', '100%', ctx).classes).toEqual(['w-[100%]']);
      expect(matchSpacing('h', '50%', ctx).classes).toEqual(['h-[50%]']);
    });

    it('should handle number values', () => {
      expect(matchSpacing('w', '0', ctx).classes).toEqual(['w-0']);
      expect(matchSpacing('h', '1', ctx).classes).toEqual(['h-[1]']);
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

    it('should approximate spacing values when approximate is enabled', () => {
      // 15px is close to 16px (1rem/4)
      const result = matchSpacing('w', '15px', approxCtx);
      expect(result.classes).toEqual(['w-4']);
      expect(result.warnings.length).toBe(1);
      expect(result.warnings[0]).toContain('approximate mapping');
      expect(result.warnings[0]).toContain('15px');
      expect(result.warnings[0]).toContain('w-4');
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
      const result = matchSpacing('w', '15px', strictCtx);
      expect(result.classes).toEqual(['w-[15px]']);
      expect(result.warnings.length).toBe(0);
    });
  });
});

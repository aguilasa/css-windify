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
      expect(matchSpacing('w', '1rem', ctx)).toEqual(['w-4']);
      expect(matchSpacing('w', '0.25rem', ctx)).toEqual(['w-1']);
      expect(matchSpacing('w', '0px', ctx)).toEqual(['w-0']);
    });

    it('should match height values from theme', () => {
      expect(matchSpacing('h', '2rem', ctx)).toEqual(['h-8']);
      expect(matchSpacing('h', '0.5rem', ctx)).toEqual(['h-2']);
    });

    it('should match position values from theme', () => {
      expect(matchSpacing('top', '1rem', ctx)).toEqual(['top-4']);
      expect(matchSpacing('right', '0.25rem', ctx)).toEqual(['right-1']);
      expect(matchSpacing('bottom', '2rem', ctx)).toEqual(['bottom-8']);
      expect(matchSpacing('left', '0.5rem', ctx)).toEqual(['left-2']);
    });

    it('should use arbitrary values for non-theme values', () => {
      expect(matchSpacing('w', '15px', ctx)).toEqual(['w-[15px]']);
      expect(matchSpacing('h', '3.5rem', ctx)).toEqual(['h-[3.5rem]']);
      expect(matchSpacing('top', '25%', ctx)).toEqual(['top-[25%]']);
    });

    it('should handle special values', () => {
      expect(matchSpacing('w', 'auto', ctx)).toEqual(['w-auto']);
      expect(matchSpacing('h', '0', ctx)).toEqual(['h-0']);
    });

    it('should handle empty or invalid values', () => {
      expect(matchSpacing('w', '', ctx)).toEqual([]);
      expect(matchSpacing('h', null as unknown as string, ctx)).toEqual([]);
    });
  });

  describe('margin shorthand', () => {
    it('should handle single value margin', () => {
      expect(matchSpacing('m', '1rem', ctx)).toEqual(['m-4']);
      expect(matchSpacing('m', '0', ctx)).toEqual(['m-0']);
    });

    it('should handle two-value margin', () => {
      // Vertical | Horizontal
      const result = matchSpacing('m', '1rem 2rem', ctx);
      expect(result).toContain('mx-8');
      expect(result).toContain('my-4');
    });

    it('should handle three-value margin', () => {
      // Top | Horizontal | Bottom
      const result = matchSpacing('m', '1rem 2rem 0.5rem', ctx);
      expect(result).toContain('mt-4');
      expect(result).toContain('mr-8');
      expect(result).toContain('ml-8');
      expect(result).toContain('mb-2');
    });

    it('should handle four-value margin', () => {
      // Top | Right | Bottom | Left
      const result = matchSpacing('m', '1rem 2rem 0.5rem 0.25rem', ctx);
      expect(result).toContain('mt-4');
      expect(result).toContain('mr-8');
      expect(result).toContain('mb-2');
      expect(result).toContain('ml-1');
    });

    it('should handle arbitrary values in margin shorthand', () => {
      const result = matchSpacing('m', '10px 15px', ctx);
      expect(result).toContain('mx-[15px]');
      expect(result).toContain('my-[10px]');
    });
  });

  describe('padding shorthand', () => {
    it('should handle single value padding', () => {
      expect(matchSpacing('p', '1rem', ctx)).toEqual(['p-4']);
      expect(matchSpacing('p', '0', ctx)).toEqual(['p-0']);
    });

    it('should handle two-value padding', () => {
      // Vertical | Horizontal
      const result = matchSpacing('p', '1rem 2rem', ctx);
      expect(result).toContain('px-8');
      expect(result).toContain('py-4');
    });

    it('should handle three-value padding', () => {
      // Top | Horizontal | Bottom
      const result = matchSpacing('p', '1rem 2rem 0.5rem', ctx);
      expect(result).toContain('pt-4');
      expect(result).toContain('pr-8');
      expect(result).toContain('pl-8');
      expect(result).toContain('pb-2');
    });

    it('should handle four-value padding', () => {
      // Top | Right | Bottom | Left
      const result = matchSpacing('p', '1rem 2rem 0.5rem 0.25rem', ctx);
      expect(result).toContain('pt-4');
      expect(result).toContain('pr-8');
      expect(result).toContain('pb-2');
      expect(result).toContain('pl-1');
    });

    it('should handle arbitrary values in padding shorthand', () => {
      const result = matchSpacing('p', '10px 15px', ctx);
      expect(result).toContain('px-[15px]');
      expect(result).toContain('py-[10px]');
    });
  });

  describe('different unit types', () => {
    it('should handle px values', () => {
      expect(matchSpacing('w', '1px', ctx)).toEqual(['w-px']);
      expect(matchSpacing('h', '10px', ctx)).toEqual(['h-[10px]']);
    });

    it('should handle rem values', () => {
      expect(matchSpacing('w', '1rem', ctx)).toEqual(['w-4']);
      expect(matchSpacing('h', '3rem', ctx)).toEqual(['h-[3rem]']);
    });

    it('should handle percentage values', () => {
      expect(matchSpacing('w', '100%', ctx)).toEqual(['w-[100%]']);
      expect(matchSpacing('h', '50%', ctx)).toEqual(['h-[50%]']);
    });

    it('should handle number values', () => {
      expect(matchSpacing('w', '0', ctx)).toEqual(['w-0']);
      expect(matchSpacing('h', '1', ctx)).toEqual(['h-[1]']);
    });
  });
});

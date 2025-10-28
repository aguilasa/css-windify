import { describe, it, expect } from 'vitest';
import { matchDisplay, matchPosition, matchInset, matchInsetShorthand } from './layout';
import { MatchCtx } from '../../types';

describe('layout matcher', () => {
  // Mock theme for testing
  const mockTheme = {
    spacing: {
      '0': '0px',
      '1': '0.25rem',
      '2': '0.5rem',
      '4': '1rem',
      '8': '2rem',
      px: '1px',
    },
  };

  const ctx: MatchCtx = {
    theme: mockTheme,
    opts: {
      strict: false,
      approximate: false,
    },
  };

  describe('display', () => {
    it('should match display values', () => {
      expect(matchDisplay('block')).toBe('block');
      expect(matchDisplay('inline')).toBe('inline');
      expect(matchDisplay('inline-block')).toBe('inline-block');
      expect(matchDisplay('flex')).toBe('flex');
      expect(matchDisplay('inline-flex')).toBe('inline-flex');
      expect(matchDisplay('grid')).toBe('grid');
      expect(matchDisplay('inline-grid')).toBe('inline-grid');
      expect(matchDisplay('table')).toBe('table');
      expect(matchDisplay('table-row')).toBe('table-row');
      expect(matchDisplay('table-cell')).toBe('table-cell');
      expect(matchDisplay('contents')).toBe('contents');
      expect(matchDisplay('list-item')).toBe('list-item');
      expect(matchDisplay('none')).toBe('hidden');
      expect(matchDisplay('hidden')).toBe('hidden');
    });

    it('should normalize display values', () => {
      expect(matchDisplay('BLOCK')).toBe('block');
      expect(matchDisplay('  flex  ')).toBe('flex');
    });

    it('should handle empty or invalid display values', () => {
      expect(matchDisplay('')).toBe('');
      expect(matchDisplay(null as unknown as string)).toBe('');
      expect(matchDisplay('invalid-display')).toBe('');
    });
  });

  describe('position', () => {
    it('should match position values', () => {
      expect(matchPosition('static')).toBe('static');
      expect(matchPosition('relative')).toBe('relative');
      expect(matchPosition('absolute')).toBe('absolute');
      expect(matchPosition('fixed')).toBe('fixed');
      expect(matchPosition('sticky')).toBe('sticky');
    });

    it('should normalize position values', () => {
      expect(matchPosition('RELATIVE')).toBe('relative');
      expect(matchPosition('  absolute  ')).toBe('absolute');
    });

    it('should handle empty or invalid position values', () => {
      expect(matchPosition('')).toBe('');
      expect(matchPosition(null as unknown as string)).toBe('');
      expect(matchPosition('invalid-position')).toBe('');
    });
  });

  describe('inset', () => {
    it('should match inset values from theme', () => {
      const topResult = matchInset('top', '1rem', ctx);
      const rightResult = matchInset('right', '0.5rem', ctx);
      const bottomResult = matchInset('bottom', '2rem', ctx);
      const leftResult = matchInset('left', '0.25rem', ctx);

      // Check if the results are arrays or objects
      if (Array.isArray(topResult)) {
        expect(topResult).toEqual(['top-4']);
      } else {
        expect(topResult.classes).toEqual(['top-4']);
      }

      if (Array.isArray(rightResult)) {
        expect(rightResult).toEqual(['right-2']);
      } else {
        expect(rightResult.classes).toEqual(['right-2']);
      }

      if (Array.isArray(bottomResult)) {
        expect(bottomResult).toEqual(['bottom-8']);
      } else {
        expect(bottomResult.classes).toEqual(['bottom-8']);
      }

      if (Array.isArray(leftResult)) {
        expect(leftResult).toEqual(['left-1']);
      } else {
        expect(leftResult.classes).toEqual(['left-1']);
      }
    });

    it('should use arbitrary values for non-theme inset values', () => {
      const topResult = matchInset('top', '15px', ctx);
      const rightResult = matchInset('right', '3rem', ctx);
      const bottomResult = matchInset('bottom', '25%', ctx);
      const leftResult = matchInset('left', 'auto', ctx);

      if (Array.isArray(topResult)) {
        expect(topResult).toEqual(['top-[15px]']);
      } else {
        expect(topResult.classes).toEqual(['top-[15px]']);
      }

      if (Array.isArray(rightResult)) {
        expect(rightResult).toEqual(['right-[3rem]']);
      } else {
        expect(rightResult.classes).toEqual(['right-[3rem]']);
      }

      if (Array.isArray(bottomResult)) {
        expect(bottomResult).toEqual(['bottom-[25%]']);
      } else {
        expect(bottomResult.classes).toEqual(['bottom-[25%]']);
      }

      if (Array.isArray(leftResult)) {
        expect(leftResult).toEqual(['left-auto']);
      } else {
        expect(leftResult.classes).toEqual(['left-auto']);
      }
    });

    it('should handle empty or invalid inset values', () => {
      const emptyResult = matchInset('top', '', ctx);
      const nullResult = matchInset('right', null as unknown as string, ctx);

      if (Array.isArray(emptyResult)) {
        expect(emptyResult).toEqual([]);
      } else {
        expect(emptyResult.classes).toEqual([]);
      }

      if (Array.isArray(nullResult)) {
        expect(nullResult).toEqual([]);
      } else {
        expect(nullResult.classes).toEqual([]);
      }
    });
  });

  describe('inset shorthand', () => {
    it('should handle inset shorthand values', () => {
      const result = matchInsetShorthand('1rem', ctx);
      expect(result.classes).toContain('top-4');
      expect(result.classes).toContain('right-4');
      expect(result.classes).toContain('bottom-4');
      expect(result.classes).toContain('left-4');
    });

    it('should handle arbitrary values in inset shorthand', () => {
      const result = matchInsetShorthand('15px', ctx);
      expect(result.classes).toContain('top-[15px]');
      expect(result.classes).toContain('right-[15px]');
      expect(result.classes).toContain('bottom-[15px]');
      expect(result.classes).toContain('left-[15px]');
    });

    it('should handle empty inset shorthand values', () => {
      const result = matchInsetShorthand('', ctx);
      expect(result.classes).toEqual([]);
    });
  });
});

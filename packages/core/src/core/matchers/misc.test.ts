import { describe, it, expect } from 'vitest';
import { matchOverflow, matchZIndex, matchOpacity, matchBoxShadow } from './misc';

describe('misc matchers', () => {
  describe('overflow', () => {
    it('should match predefined overflow values', () => {
      expect(matchOverflow('visible')).toBe('overflow-visible');
      expect(matchOverflow('hidden')).toBe('overflow-hidden');
      expect(matchOverflow('scroll')).toBe('overflow-scroll');
      expect(matchOverflow('auto')).toBe('overflow-auto');
    });

    it('should handle overflow-x and overflow-y', () => {
      expect(matchOverflow('hidden', 'x')).toBe('overflow-x-hidden');
      expect(matchOverflow('scroll', 'y')).toBe('overflow-y-scroll');
    });

    it('should normalize values before matching', () => {
      expect(matchOverflow('  hidden  ')).toBe('overflow-hidden');
      expect(matchOverflow('SCROLL')).toBe('overflow-scroll');
    });

    it('should use arbitrary values for non-predefined overflow', () => {
      expect(matchOverflow('inherit')).toBe('overflow-[inherit]');
      expect(matchOverflow('clip')).toBe('overflow-[clip]');
    });

    it('should handle empty or invalid values', () => {
      expect(matchOverflow('')).toBe('');
      expect(matchOverflow(null as unknown as string)).toBe('');
    });
  });

  describe('z-index', () => {
    it('should match predefined z-index values', () => {
      expect(matchZIndex('0')).toBe('z-0');
      expect(matchZIndex('10')).toBe('z-10');
      expect(matchZIndex('20')).toBe('z-20');
      expect(matchZIndex('30')).toBe('z-30');
      expect(matchZIndex('40')).toBe('z-40');
      expect(matchZIndex('50')).toBe('z-50');
      expect(matchZIndex('auto')).toBe('z-auto');
    });

    it('should normalize values before matching', () => {
      expect(matchZIndex('  10  ')).toBe('z-10');
      expect(matchZIndex('AUTO')).toBe('z-auto');
    });

    it('should use arbitrary values for non-predefined z-index', () => {
      expect(matchZIndex('15')).toBe('z-[15]');
      expect(matchZIndex('100')).toBe('z-[100]');
      expect(matchZIndex('-1')).toBe('z-[-1]');
    });

    it('should handle empty or invalid values', () => {
      expect(matchZIndex('')).toBe('');
      expect(matchZIndex(null as unknown as string)).toBe('');
    });
  });

  describe('opacity', () => {
    it('should match percentage values', () => {
      expect(matchOpacity('0%')).toBe('opacity-0');
      expect(matchOpacity('50%')).toBe('opacity-50');
      expect(matchOpacity('100%')).toBe('opacity-100');
    });

    it('should match decimal values', () => {
      expect(matchOpacity('0')).toBe('opacity-0');
      expect(matchOpacity('0.5')).toBe('opacity-50');
      expect(matchOpacity('1')).toBe('opacity-100');
    });

    it('should normalize values before matching', () => {
      expect(matchOpacity('  50%  ')).toBe('opacity-50');
      expect(matchOpacity('0.75')).toBe('opacity-75');
    });

    it('should use arbitrary values for non-standard opacity', () => {
      expect(matchOpacity('1.5')).toBe('opacity-[1.5]');
      expect(matchOpacity('inherit')).toBe('opacity-[inherit]');
    });

    it('should handle empty or invalid values', () => {
      expect(matchOpacity('')).toBe('');
      expect(matchOpacity(null as unknown as string)).toBe('');
    });
  });

  describe('box-shadow', () => {
    it('should match "none" to shadow-none', () => {
      const result = matchBoxShadow('none');
      expect(result.class).toBe('shadow-none');
      expect(result.warning).toBeUndefined();
    });

    it('should match shadow-sm token', () => {
      const result = matchBoxShadow('0 1px 2px 0 rgb(0 0 0 / 0.05)');
      expect(result.class).toBe('shadow-sm');
      expect(result.warning).toBeUndefined();
    });

    it('should match shadow (default) token', () => {
      const result = matchBoxShadow(
        '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
      );
      expect(result.class).toBe('shadow');
      expect(result.warning).toBeUndefined();
    });

    it('should match shadow-md token', () => {
      const result = matchBoxShadow(
        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
      );
      expect(result.class).toBe('shadow-md');
      expect(result.warning).toBeUndefined();
    });

    it('should match shadow-lg token', () => {
      const result = matchBoxShadow(
        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
      );
      expect(result.class).toBe('shadow-lg');
      expect(result.warning).toBeUndefined();
    });

    it('should match shadow-xl token', () => {
      const result = matchBoxShadow(
        '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      );
      expect(result.class).toBe('shadow-xl');
      expect(result.warning).toBeUndefined();
    });

    it('should match shadow-2xl token', () => {
      const result = matchBoxShadow('0 25px 50px -12px rgb(0 0 0 / 0.25)');
      expect(result.class).toBe('shadow-2xl');
      expect(result.warning).toBeUndefined();
    });

    it('should match rgba format', () => {
      const result = matchBoxShadow('0 1px 2px 0 rgba(0, 0, 0, 0.05)');
      expect(result.class).toBe('shadow-sm');
      expect(result.warning).toBeUndefined();
    });

    it('should normalize spaces and match', () => {
      const result = matchBoxShadow('0  1px  2px  0  rgb(0  0  0  /  0.05)');
      expect(result.class).toBe('shadow-sm');
      expect(result.warning).toBeUndefined();
    });

    it('should use arbitrary value for custom shadows', () => {
      const result = matchBoxShadow('0 0 10px red');
      expect(result.class).toBe('shadow-[0 0 10px red]');
      expect(result.warning).toContain('No exact Tailwind token');
    });

    it('should use arbitrary value for non-standard shadows', () => {
      const result = matchBoxShadow('inset 0 2px 4px rgba(0,0,0,0.1)');
      expect(result.class).toBe('shadow-[inset 0 2px 4px rgba(0,0,0,0.1)]');
      expect(result.warning).toContain('No exact Tailwind token');
    });

    it('should handle empty value', () => {
      const result = matchBoxShadow('');
      expect(result.class).toBe('');
      expect(result.warning).toBeUndefined();
    });

    it('should normalize case', () => {
      const result = matchBoxShadow('NONE');
      expect(result.class).toBe('shadow-none');
      expect(result.warning).toBeUndefined();
    });

    it('should handle complex multi-shadow values', () => {
      const result = matchBoxShadow('0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)');
      expect(result.class).toBe('shadow');
      expect(result.warning).toBeUndefined();
    });
  });
});

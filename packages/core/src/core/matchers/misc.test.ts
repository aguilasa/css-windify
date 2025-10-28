import { describe, it, expect } from 'vitest';
import { matchOverflow, matchZIndex, matchOpacity } from './misc';

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
});

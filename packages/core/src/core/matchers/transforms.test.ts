import { describe, it, expect } from 'vitest';
import { matchTranslate, matchScale, matchRotate, matchSkew, matchTransform } from './transforms';

describe('transform matchers', () => {
  describe('matchTranslate', () => {
    it('should match predefined translate values', () => {
      expect(matchTranslate('0', 'x')).toBe('translate-x-0');
      expect(matchTranslate('0.25rem', 'x')).toBe('translate-x-1');
      expect(matchTranslate('0.5rem', 'x')).toBe('translate-x-2');
      expect(matchTranslate('1rem', 'x')).toBe('translate-x-4');
      expect(matchTranslate('2rem', 'y')).toBe('translate-y-8');
    });

    it('should match percentage values', () => {
      expect(matchTranslate('50%', 'x')).toBe('translate-x-1/2');
      expect(matchTranslate('100%', 'y')).toBe('translate-y-full');
    });

    it('should handle negative values', () => {
      expect(matchTranslate('-0.25rem', 'x')).toBe('-translate-x-1');
      expect(matchTranslate('-1rem', 'y')).toBe('-translate-y-4');
      expect(matchTranslate('-50%', 'x')).toBe('-translate-x-1/2');
    });

    it('should use arbitrary values for custom translate', () => {
      expect(matchTranslate('15px', 'x')).toBe('translate-x-[15px]');
      expect(matchTranslate('3.5rem', 'y')).toBe('translate-y-[3.5rem]');
    });

    it('should handle two-value syntax', () => {
      const result = matchTranslate('1rem 2rem');
      expect(result).toContain('translate-x-4');
      expect(result).toContain('translate-y-8');
    });

    it('should handle empty values', () => {
      expect(matchTranslate('')).toBe('');
    });
  });

  describe('matchScale', () => {
    it('should match predefined scale values', () => {
      expect(matchScale('0')).toBe('scale-0');
      expect(matchScale('0.5')).toBe('scale-50');
      expect(matchScale('0.75')).toBe('scale-75');
      expect(matchScale('1')).toBe('scale-100');
      expect(matchScale('1.5')).toBe('scale-150');
    });

    it('should handle axis-specific scale', () => {
      expect(matchScale('1.5', 'x')).toBe('scale-x-150');
      expect(matchScale('0.75', 'y')).toBe('scale-y-75');
    });

    it('should use arbitrary values for custom scale', () => {
      expect(matchScale('0.85')).toBe('scale-[0.85]');
      expect(matchScale('2', 'x')).toBe('scale-x-[2]');
    });

    it('should handle two-value syntax', () => {
      const result = matchScale('1.5 0.75');
      expect(result).toContain('scale-x-150');
      expect(result).toContain('scale-y-75');
    });

    it('should handle empty values', () => {
      expect(matchScale('')).toBe('');
    });
  });

  describe('matchRotate', () => {
    it('should match predefined rotate values', () => {
      expect(matchRotate('0deg')).toBe('rotate-0');
      expect(matchRotate('1deg')).toBe('rotate-1');
      expect(matchRotate('45deg')).toBe('rotate-45');
      expect(matchRotate('90deg')).toBe('rotate-90');
      expect(matchRotate('180deg')).toBe('rotate-180');
    });

    it('should handle negative rotation', () => {
      expect(matchRotate('-45deg')).toBe('rotate--45');
      expect(matchRotate('-90deg')).toBe('rotate--90');
      expect(matchRotate('-180deg')).toBe('rotate--180');
    });

    it('should use arbitrary values for custom rotation', () => {
      expect(matchRotate('30deg')).toBe('rotate-[30deg]');
      expect(matchRotate('75deg')).toBe('rotate-[75deg]');
    });

    it('should handle empty values', () => {
      expect(matchRotate('')).toBe('');
    });
  });

  describe('matchSkew', () => {
    it('should match predefined skew values', () => {
      expect(matchSkew('0deg', 'x')).toBe('skew-x-0');
      expect(matchSkew('3deg', 'x')).toBe('skew-x-3');
      expect(matchSkew('6deg', 'y')).toBe('skew-y-6');
      expect(matchSkew('12deg', 'x')).toBe('skew-x-12');
    });

    it('should handle negative skew', () => {
      expect(matchSkew('-3deg', 'x')).toBe('skew-x--3');
      expect(matchSkew('-6deg', 'y')).toBe('skew-y--6');
    });

    it('should use arbitrary values for custom skew', () => {
      expect(matchSkew('5deg', 'x')).toBe('skew-x-[5deg]');
      expect(matchSkew('10deg', 'y')).toBe('skew-y-[10deg]');
    });

    it('should handle two-value syntax', () => {
      const result = matchSkew('3deg 6deg');
      expect(result).toContain('skew-x-3');
      expect(result).toContain('skew-y-6');
    });

    it('should handle empty values', () => {
      expect(matchSkew('')).toBe('');
    });
  });

  describe('matchTransform', () => {
    it('should handle transform: none', () => {
      const result = matchTransform('none');
      expect(result.classes).toEqual([]);
      expect(result.warning).toBeUndefined();
    });

    it('should handle single translate function', () => {
      const result = matchTransform('translate(1rem, 2rem)');
      expect(result.classes).toContain('translate-x-4');
      expect(result.classes).toContain('translate-y-8');
      expect(result.warning).toBeUndefined();
    });

    it('should handle single translateX function', () => {
      const result = matchTransform('translateX(1rem)');
      expect(result.classes).toEqual(['translate-x-4']);
      expect(result.warning).toBeUndefined();
    });

    it('should handle single translateY function', () => {
      const result = matchTransform('translateY(50%)');
      expect(result.classes).toEqual(['translate-y-1/2']);
      expect(result.warning).toBeUndefined();
    });

    it('should handle single scale function', () => {
      const result = matchTransform('scale(1.5)');
      expect(result.classes).toEqual(['scale-150']);
      expect(result.warning).toBeUndefined();
    });

    it('should handle scale with two values', () => {
      const result = matchTransform('scale(1.5, 0.75)');
      expect(result.classes).toContain('scale-x-150');
      expect(result.classes).toContain('scale-y-75');
      expect(result.warning).toBeUndefined();
    });

    it('should handle single rotate function', () => {
      const result = matchTransform('rotate(45deg)');
      expect(result.classes).toEqual(['rotate-45']);
      expect(result.warning).toBeUndefined();
    });

    it('should handle single skew function', () => {
      const result = matchTransform('skew(3deg, 6deg)');
      expect(result.classes).toContain('skew-x-3');
      expect(result.classes).toContain('skew-y-6');
      expect(result.warning).toBeUndefined();
    });

    it('should handle skewX function', () => {
      const result = matchTransform('skewX(3deg)');
      expect(result.classes).toEqual(['skew-x-3']);
      expect(result.warning).toBeUndefined();
    });

    it('should handle skewY function', () => {
      const result = matchTransform('skewY(6deg)');
      expect(result.classes).toEqual(['skew-y-6']);
      expect(result.warning).toBeUndefined();
    });

    it('should handle multiple transform functions', () => {
      const result = matchTransform('translate(1rem, 2rem) rotate(45deg) scale(1.5)');
      expect(result.classes).toContain('translate-x-4');
      expect(result.classes).toContain('translate-y-8');
      expect(result.classes).toContain('rotate-45');
      expect(result.classes).toContain('scale-150');
      expect(result.warning).toBeUndefined();
    });

    it('should handle complex transform chain', () => {
      const result = matchTransform('translateX(50%) rotate(90deg) scaleX(1.5) skewY(3deg)');
      expect(result.classes).toContain('translate-x-1/2');
      expect(result.classes).toContain('rotate-90');
      expect(result.classes).toContain('scale-x-150');
      expect(result.classes).toContain('skew-y-3');
      expect(result.warning).toBeUndefined();
    });

    it('should handle unparseable transform', () => {
      const result = matchTransform('invalid-transform');
      expect(result.classes).toEqual(['transform-[invalid-transform]']);
      expect(result.warning).toContain('Unable to parse');
    });

    it('should handle empty transform', () => {
      const result = matchTransform('');
      expect(result.classes).toEqual([]);
    });

    it('should normalize whitespace', () => {
      const result = matchTransform('  translate(1rem, 2rem)  rotate(45deg)  ');
      expect(result.classes).toContain('translate-x-4');
      expect(result.classes).toContain('translate-y-8');
      expect(result.classes).toContain('rotate-45');
    });
  });
});

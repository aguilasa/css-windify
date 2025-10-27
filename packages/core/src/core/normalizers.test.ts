import { describe, it, expect } from 'vitest';
import {
  normalizeValue,
  isPx,
  isRem,
  isEm,
  isPct,
  isNumber,
  toArbitrary,
  arbitraryProperty,
  parseBoxShorthand,
  parseColorNormalize
} from './normalizers';

describe('normalizers', () => {
  describe('normalizeValue', () => {
    it('should trim whitespace', () => {
      expect(normalizeValue('  10px  ')).toBe('10px');
      expect(normalizeValue('\t5rem\n')).toBe('5rem');
    });

    it('should convert to lowercase when appropriate', () => {
      expect(normalizeValue('BLOCK')).toBe('block');
      expect(normalizeValue('SOLID')).toBe('solid');
    });

    it('should preserve case for font names and other case-sensitive values', () => {
      expect(normalizeValue('Arial')).toBe('Arial');
      expect(normalizeValue('Times New Roman')).toBe('Times New Roman');
    });

    it('should preserve case for functions and variables', () => {
      expect(normalizeValue('calc(100% - 20px)')).toBe('calc(100% - 20px)');
      expect(normalizeValue('var(--myColor)')).toBe('var(--myColor)');
    });

    it('should handle empty or invalid inputs', () => {
      expect(normalizeValue('')).toBe('');
      expect(normalizeValue('   ')).toBe('');
      expect(normalizeValue(null as unknown as string)).toBe('');
      expect(normalizeValue(undefined as unknown as string)).toBe('');
    });
  });

  describe('isPx', () => {
    it('should identify pixel values', () => {
      expect(isPx('10px')).toBe(true);
      expect(isPx('  10px  ')).toBe(true);
      expect(isPx('-10.5px')).toBe(true);
      expect(isPx('.5px')).toBe(true);
    });

    it('should reject non-pixel values', () => {
      expect(isPx('10rem')).toBe(false);
      expect(isPx('10')).toBe(false);
      expect(isPx('10px 20px')).toBe(false);
      expect(isPx('px')).toBe(false);
      expect(isPx('')).toBe(false);
    });
  });

  describe('isRem', () => {
    it('should identify rem values', () => {
      expect(isRem('10rem')).toBe(true);
      expect(isRem('  10rem  ')).toBe(true);
      expect(isRem('-10.5rem')).toBe(true);
      expect(isRem('.5rem')).toBe(true);
    });

    it('should reject non-rem values', () => {
      expect(isRem('10px')).toBe(false);
      expect(isRem('10')).toBe(false);
      expect(isRem('10rem 20rem')).toBe(false);
      expect(isRem('rem')).toBe(false);
      expect(isRem('')).toBe(false);
    });
  });

  describe('isEm', () => {
    it('should identify em values', () => {
      expect(isEm('10em')).toBe(true);
      expect(isEm('  10em  ')).toBe(true);
      expect(isEm('-10.5em')).toBe(true);
      expect(isEm('.5em')).toBe(true);
    });

    it('should reject non-em values', () => {
      expect(isEm('10px')).toBe(false);
      expect(isEm('10')).toBe(false);
      expect(isEm('10em 20em')).toBe(false);
      expect(isEm('em')).toBe(false);
      expect(isEm('')).toBe(false);
    });
  });

  describe('isPct', () => {
    it('should identify percentage values', () => {
      expect(isPct('10%')).toBe(true);
      expect(isPct('  10%  ')).toBe(true);
      expect(isPct('-10.5%')).toBe(true);
      expect(isPct('.5%')).toBe(true);
      expect(isPct('100%')).toBe(true);
    });

    it('should reject non-percentage values', () => {
      expect(isPct('10px')).toBe(false);
      expect(isPct('10')).toBe(false);
      expect(isPct('10% 20%')).toBe(false);
      expect(isPct('%')).toBe(false);
      expect(isPct('')).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should identify number values', () => {
      expect(isNumber('10')).toBe(true);
      expect(isNumber('  10  ')).toBe(true);
      expect(isNumber('-10.5')).toBe(true);
      expect(isNumber('.5')).toBe(true);
      expect(isNumber('0')).toBe(true);
    });

    it('should reject non-number values', () => {
      expect(isNumber('10px')).toBe(false);
      expect(isNumber('10%')).toBe(false);
      expect(isNumber('10 20')).toBe(false);
      expect(isNumber('ten')).toBe(false);
      expect(isNumber('')).toBe(false);
    });
  });

  describe('toArbitrary', () => {
    it('should format arbitrary values correctly', () => {
      expect(toArbitrary('w', '100px')).toBe('w-[100px]');
      expect(toArbitrary('h', '50%')).toBe('h-[50%]');
      expect(toArbitrary('m', 'calc(100% - 20px)')).toBe('m-[calc(100% - 20px)]');
    });

    it('should handle whitespace', () => {
      expect(toArbitrary('  w  ', '  100px  ')).toBe('w-[100px]');
    });

    it('should handle empty inputs', () => {
      expect(toArbitrary('', '100px')).toBe('');
      expect(toArbitrary('w', '')).toBe('');
      expect(toArbitrary('', '')).toBe('');
    });
  });

  describe('arbitraryProperty', () => {
    it('should format arbitrary properties correctly', () => {
      expect(arbitraryProperty('color', 'red')).toBe('[color:red]');
      expect(arbitraryProperty('font-size', '16px')).toBe('[font-size:16px]');
      expect(arbitraryProperty('transform', 'rotate(45deg)')).toBe('[transform:rotate(45deg)]');
    });

    it('should handle whitespace', () => {
      expect(arbitraryProperty('  color  ', '  red  ')).toBe('[color:red]');
    });

    it('should handle empty inputs', () => {
      expect(arbitraryProperty('', 'red')).toBe('');
      expect(arbitraryProperty('color', '')).toBe('');
      expect(arbitraryProperty('', '')).toBe('');
    });
  });

  describe('parseBoxShorthand', () => {
    it('should handle single value', () => {
      expect(parseBoxShorthand('10px')).toEqual(['10px', '10px', '10px', '10px']);
    });

    it('should handle two values', () => {
      expect(parseBoxShorthand('10px 20px')).toEqual(['10px', '20px', '10px', '20px']);
    });

    it('should handle three values', () => {
      expect(parseBoxShorthand('10px 20px 30px')).toEqual(['10px', '20px', '30px', '20px']);
    });

    it('should handle four values', () => {
      expect(parseBoxShorthand('10px 20px 30px 40px')).toEqual(['10px', '20px', '30px', '40px']);
    });

    it('should handle mixed units', () => {
      expect(parseBoxShorthand('10px 20% 30em 40rem')).toEqual(['10px', '20%', '30em', '40rem']);
    });

    it('should handle extra whitespace', () => {
      expect(parseBoxShorthand('  10px   20px  ')).toEqual(['10px', '20px', '10px', '20px']);
    });

    it('should handle empty input', () => {
      expect(parseBoxShorthand('')).toEqual([]);
      expect(parseBoxShorthand('   ')).toEqual([]);
    });

    it('should handle more than four values by ignoring extras', () => {
      expect(parseBoxShorthand('10px 20px 30px 40px 50px')).toEqual(['10px', '20px', '30px', '40px']);
    });
  });

  describe('parseColorNormalize', () => {
    it('should convert hex shorthand to full form', () => {
      expect(parseColorNormalize('#fff')).toBe('#ffffff');
      expect(parseColorNormalize('#f00')).toBe('#ff0000');
      expect(parseColorNormalize('#abc')).toBe('#aabbcc');
    });

    it('should convert hex shorthand with alpha to full form', () => {
      expect(parseColorNormalize('#fffa')).toBe('#ffffffaa');
      expect(parseColorNormalize('#f00a')).toBe('#ff0000aa');
    });

    it('should preserve full hex format', () => {
      expect(parseColorNormalize('#ffffff')).toBe('#ffffff');
      expect(parseColorNormalize('#ff0000')).toBe('#ff0000');
    });

    it('should remove whitespace from functional notation', () => {
      expect(parseColorNormalize('rgb(255, 0, 0)')).toBe('rgb(255,0,0)');
      expect(parseColorNormalize('rgba(255, 0, 0, 0.5)')).toBe('rgba(255,0,0,0.5)');
      expect(parseColorNormalize('hsl(0, 100%, 50%)')).toBe('hsl(0,100%,50%)');
    });

    it('should preserve named colors', () => {
      expect(parseColorNormalize('red')).toBe('red');
      expect(parseColorNormalize('blue')).toBe('blue');
      expect(parseColorNormalize('transparent')).toBe('transparent');
    });

    it('should handle whitespace', () => {
      expect(parseColorNormalize('  #fff  ')).toBe('#ffffff');
      expect(parseColorNormalize('  red  ')).toBe('red');
    });

    it('should handle empty input', () => {
      expect(parseColorNormalize('')).toBe('');
      expect(parseColorNormalize('   ')).toBe('');
    });
  });
});

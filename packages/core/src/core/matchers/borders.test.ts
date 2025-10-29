import { describe, it, expect } from 'vitest';
import {
  matchBorderWidth,
  matchBorderColor,
  matchBorderRadius,
  parseBorderShorthand,
  matchBorderShorthand,
} from './borders';
import { MatchCtx } from '../../types';

describe('borders matcher', () => {
  // Mock theme for testing
  const mockTheme = {
    colors: {
      black: '#000000',
      white: '#ffffff',
      primary: '#3b82f6',
      secondary: {
        '100': '#e0f2fe',
        '500': '#0ea5e9',
      },
    },
  };

  const ctx: MatchCtx = {
    theme: mockTheme,
    version: 'v3',
    opts: {
      strict: false,
      approximate: false,
      thresholds: {
        spacingPx: 2,
        fontPx: 1,
        radiiPx: 2,
      },
      screens: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
      },
    },
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
      expect(matchBorderColor('black', ctx).class).toBe('border-black');
      expect(matchBorderColor('white', ctx).class).toBe('border-white');
      expect(matchBorderColor('transparent', ctx).class).toBe('border-transparent');
    });

    it('should match theme colors', () => {
      expect(matchBorderColor('#3b82f6', ctx).class).toBe('border-primary');
      expect(matchBorderColor('#e0f2fe', ctx).class).toBe('border-secondary-100');
    });

    it('should use arbitrary values for non-theme colors', () => {
      expect(matchBorderColor('#ff0000', ctx).class).toBe('border-[#ff0000]');
      expect(matchBorderColor('rgb(255, 0, 0)', ctx).class).toBe('border-[rgb(255,0,0)]');
    });
  });

  describe('border shorthand', () => {
    it('should parse border shorthand components', () => {
      const result1 = parseBorderShorthand('1px solid black');
      expect(result1.width).toBe('1px');
      expect(result1.style).toBe('solid');
      expect(result1.color).toBe('black');

      const result2 = parseBorderShorthand('2px dashed red');
      expect(result2.width).toBe('2px');
      expect(result2.style).toBe('dashed');
      expect(result2.color).toBe('red');

      const result3 = parseBorderShorthand('medium dotted #000');
      expect(result3.width).toBe('medium');
      expect(result3.style).toBe('dotted');
      expect(result3.color).toBe('#000');
    });

    it('should handle partial shorthand', () => {
      const result1 = parseBorderShorthand('solid black');
      expect(result1.width).toBeUndefined();
      expect(result1.style).toBe('solid');
      expect(result1.color).toBe('black');

      const result2 = parseBorderShorthand('1px black');
      expect(result2.width).toBe('1px');
      expect(result2.style).toBeUndefined();
      expect(result2.color).toBe('black');

      const result3 = parseBorderShorthand('1px solid');
      expect(result3.width).toBe('1px');
      expect(result3.style).toBe('solid');
      expect(result3.color).toBeUndefined();
    });

    it('should match border shorthand to Tailwind classes', () => {
      // Default border (1px solid) with color
      const result1 = matchBorderShorthand('1px solid black', ctx);
      expect(result1.classes).toContain('border');
      expect(result1.classes).toContain('border-black');
      expect(result1.classes.length).toBe(2); // No style class for 'solid' as it's default

      // Custom width with default style and color
      const result2 = matchBorderShorthand('2px solid red', ctx);
      expect(result2.classes).toContain('border-2');
      expect(result2.classes).toContain('border-[red]');
      expect(result2.classes.length).toBe(2); // No style class for 'solid' as it's default

      // Default width with custom style and color
      const result3 = matchBorderShorthand('dashed blue', ctx);
      expect(result3.classes).toContain('border');
      expect(result3.classes).toContain('border-dashed');
      expect(result3.classes).toContain('border-[blue]');
      expect(result3.classes.length).toBe(3);

      // Zero width border
      const result4 = matchBorderShorthand('0 solid black', ctx);
      expect(result4.classes).toContain('border-0');
      expect(result4.classes).toContain('border-black');
      expect(result4.classes.length).toBe(2);
    });

    it('should handle the specific acceptance criteria', () => {
      // Acceptance criteria: "border: 1px solid #000" → border, border-[1px] ou border se token 1px for "border" default, cor via border-color
      const result = matchBorderShorthand('1px solid #000', ctx);
      expect(result.classes).toContain('border'); // Default width
      expect(result.classes).toContain('border-black'); // Color via theme
      expect(result.classes.length).toBe(2); // No style class for 'solid' as it's default
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

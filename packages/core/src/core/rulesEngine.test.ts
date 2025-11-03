import { describe, it, expect } from 'vitest';
import { toTailwind, transformRule, transformDeclarations } from './rulesEngine';
import { CssRule, MatchCtx } from '../types';

describe('rulesEngine', () => {
  // Mock context for testing
  const ctx: MatchCtx = {
    theme: {
      spacing: {
        '0': '0px',
        '1': '0.25rem',
        '2': '0.5rem',
        '4': '1rem',
        '8': '2rem',
      },
      colors: {
        black: '#000000',
        white: '#ffffff',
        red: '#ff0000',
        blue: '#0000ff',
      },
      fontSize: {
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
      },
      lineHeight: {
        none: '1',
        tight: '1.25',
        normal: '1.5',
      },
    },
    opts: {
      strict: false,
      approximate: false,
    },
  };

  describe('toTailwind', () => {
    it('should convert display property to Tailwind class', () => {
      const result = toTailwind('display', 'flex', ctx);
      expect(result.classes).toEqual(['flex']);
      expect(result.warning).toBeNull();
    });

    it('should convert color property to Tailwind class', () => {
      const result = toTailwind('color', 'red', ctx);
      // The color matcher might use arbitrary values depending on implementation
      expect(result.classes[0]).toContain('text-');
      expect(result.classes[0]).toContain('red');
    });

    it('should use arbitrary value for unknown colors', () => {
      const result = toTailwind('color', 'purple', ctx);
      expect(result.classes[0]).toContain('text-[purple]');
      expect(result.warning).not.toBeNull();
    });

    it('should handle font-weight values', () => {
      expect(toTailwind('font-weight', '700', ctx).classes).toEqual(['font-bold']);
      expect(toTailwind('font-weight', 'bold', ctx).classes).toEqual(['font-bold']);
    });

    it('should handle text-align values', () => {
      expect(toTailwind('text-align', 'center', ctx).classes).toEqual(['text-center']);
    });

    it('should handle object-fit values', () => {
      expect(toTailwind('object-fit', 'cover', ctx).classes).toEqual(['object-cover']);
    });

    it('should handle properties without direct handlers', () => {
      const result = toTailwind('custom-property', 'custom-value', ctx);
      expect(result.classes[0]).toContain('[custom-property:custom-value]');
      expect(result.warning).not.toBeNull();
    });
  });

  describe('transformRule', () => {
    it('should transform a CSS rule with multiple declarations', () => {
      const rule: CssRule = {
        selector: '.card',
        declarations: [
          { prop: 'display', value: 'flex' },
          { prop: 'flex-direction', value: 'column' },
          { prop: 'padding', value: '1rem' },
          { prop: 'background-color', value: 'white' },
          { prop: 'border-radius', value: '0.25rem' },
          { prop: 'box-shadow', value: '0 2px 4px rgba(0,0,0,0.1)' }, // No direct handler
        ],
      };

      const result = transformRule(rule, ctx);

      // Check that classes were generated
      expect(result.classes).toContain('flex');
      expect(result.classes).toContain('flex-col');
      expect(result.classes).toContain('p-4');
      expect(result.classes).toContain('bg-white');
      expect(result.classes).toContain('rounded');
      expect(result.classes.some((cls) => cls.includes('shadow-'))).toBe(true);

      // Check for warnings
      expect(result.warnings.some((w) => w.includes('box-shadow'))).toBe(true);
      expect(result.warnings.some((w) => w.includes("Selector '.card'"))).toBe(true);

      // Check coverage
      expect(result.coverage.matched).toBe(6);
      expect(result.coverage.total).toBe(6);
    });

    it('should deduplicate classes when transforming rules', () => {
      const rule: CssRule = {
        selector: '.button',
        declarations: [
          { prop: 'padding', value: '0.5rem 1rem' },
          { prop: 'padding-top', value: '0.5rem' }, // Duplicate of what's in the shorthand
          { prop: 'background-color', value: 'blue' },
          { prop: 'color', value: 'white' },
        ],
      };

      const result = transformRule(rule, ctx);

      // Count occurrences of padding classes
      const paddingClasses = result.classes.filter(
        (cls) => cls.startsWith('p-') || cls.startsWith('px-') || cls.startsWith('py-')
      );

      // Should have deduplicated the padding classes
      expect(new Set(paddingClasses).size).toBe(paddingClasses.length);

      // Check that all expected classes are present
      expect(result.classes.some((cls) => cls.includes('bg-') && cls.includes('blue'))).toBe(true);
      expect(result.classes.some((cls) => cls.includes('text-') && cls.includes('white'))).toBe(
        true
      );
    });
  });

  describe('transformDeclarations', () => {
    it('should transform multiple declarations and handle warnings', () => {
      const declarations = [
        { prop: 'margin', value: '1rem' },
        { prop: 'width', value: '100%' }, // Will use arbitrary value
        { prop: 'height', value: '2rem' },
        { prop: 'unknown-prop', value: 'value' }, // No handler
      ];

      const result = transformDeclarations(declarations, ctx);

      // Check classes
      expect(result.classes).toContain('m-4');
      expect(result.classes).toContain('h-8');
      expect(result.classes.some((cls) => cls.includes('w-[100%]'))).toBe(true);
      expect(result.classes.some((cls) => cls.includes('[unknown-prop:value]'))).toBe(true);

      // Check warnings
      expect(result.warnings.some((w) => w.includes('arbitrary'))).toBe(true);
      expect(result.warnings.some((w) => w.includes('unknown-prop'))).toBe(true);

      // Check coverage
      expect(result.coverage.matched).toBe(4);
      expect(result.coverage.total).toBe(4);
    });

    it('should apply hover variant to declarations', () => {
      const declarations = [
        { prop: 'color', value: 'red', variants: ['hover'] },
        { prop: 'background-color', value: 'blue' }, // No variant
      ];

      const result = transformDeclarations(declarations, ctx);

      // Check that hover variant is applied to color but not to background-color
      expect(result.classes.some((cls) => cls.startsWith('hover:') && cls.includes('text-'))).toBe(
        true
      );
      expect(result.classes.some((cls) => !cls.startsWith('hover:') && cls.includes('bg-'))).toBe(
        true
      );
    });

    it('should apply responsive variants to declarations', () => {
      const declarations = [
        { prop: 'margin', value: '1rem', variants: ['sm', 'md'] },
        { prop: 'padding', value: '2rem', variants: ['lg'] },
      ];

      const result = transformDeclarations(declarations, ctx);

      // Check that responsive variants are applied correctly
      expect(result.classes.some((cls) => cls.startsWith('sm:md:') && cls.includes('m-'))).toBe(
        true
      );
      expect(result.classes.some((cls) => cls.startsWith('lg:') && cls.includes('p-'))).toBe(true);
    });

    it('should handle mixed variants and non-variants', () => {
      const declarations = [
        { prop: 'color', value: 'white', variants: ['hover', 'focus'] },
        { prop: 'margin', value: '1rem', variants: ['sm'] },
        { prop: 'padding', value: '2rem' }, // No variant
      ];

      const result = transformDeclarations(declarations, ctx);

      // Check that variants are applied correctly
      expect(
        result.classes.some((cls) => cls.startsWith('hover:focus:') && cls.includes('text-'))
      ).toBe(true);
      expect(result.classes.some((cls) => cls.startsWith('sm:') && cls.includes('m-'))).toBe(true);
      expect(result.classes.some((cls) => !cls.includes(':') && cls.includes('p-'))).toBe(true);
    });
  });
});

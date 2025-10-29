import { describe, it, expect } from 'vitest';
import Tailwindify from './index';
import { CssRule } from './types';

describe('Tailwindify', () => {
  describe('Class methods', () => {
    it('should process a CSS rule with default options', async () => {
      const tailwindify = new Tailwindify();
      const rule: CssRule = {
        selector: '.button',
        declarations: [
          { prop: 'color', value: 'red' },
          { prop: 'padding', value: '1rem' },
        ],
      };

      const result = await tailwindify.processRule(rule);

      expect(result).toBeDefined();
      expect(Array.isArray(result.classes)).toBe(true);
      expect(result.coverage).toBeDefined();
      expect(result.coverage.total).toBe(2);
    });

    it('should process a CSS rule with custom prefix', async () => {
      const tailwindify = new Tailwindify({ prefix: 'tw-' });
      const rule: CssRule = {
        selector: '.button',
        declarations: [{ prop: 'color', value: 'red' }],
      };

      const result = await tailwindify.processRule(rule);

      expect(result).toBeDefined();
      expect(result.classes.length).toBeGreaterThan(0);
      expect(result.classes[0].startsWith('tw-')).toBe(true);
    });

    it('should process CSS declarations with default options', async () => {
      const tailwindify = new Tailwindify();
      const declarations = [
        { prop: 'color', value: 'red' },
        { prop: 'padding', value: '1rem' },
      ];

      const result = await tailwindify.processDeclarations(declarations);

      expect(result).toBeDefined();
      expect(Array.isArray(result.classes)).toBe(true);
      expect(result.coverage).toBeDefined();
      expect(result.coverage.total).toBe(2);
    });

    it('should process CSS declarations with custom prefix', async () => {
      const tailwindify = new Tailwindify({ prefix: 'tw-' });
      const declarations = [{ prop: 'color', value: 'red' }];

      const result = await tailwindify.processDeclarations(declarations);

      expect(result).toBeDefined();
      expect(result.classes.length).toBeGreaterThan(0);
      expect(result.classes[0].startsWith('tw-')).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should transform a simple CSS rule to Tailwind classes', async () => {
      const tailwindify = new Tailwindify();
      const rule: CssRule = {
        selector: '.button',
        declarations: [
          { prop: 'color', value: 'red' },
          { prop: 'padding', value: '1rem' },
        ],
      };

      const result = await tailwindify.processRule(rule);

      expect(result).toBeDefined();
      expect(Array.isArray(result.classes)).toBe(true);
      expect(result.coverage).toBeDefined();
      expect(result.coverage.total).toBe(2);
    });
  });
});

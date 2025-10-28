import { describe, it, expect } from 'vitest';
import Tailwindify from './index';
import { CssRule } from './types';

describe('Tailwindify', () => {
  describe('Class methods', () => {
    it('should process a CSS rule with default options', () => {
      // TODO: Implement test after updating Tailwindify class
    });

    it('should process a CSS rule with custom prefix', () => {
      // TODO: Implement test after updating Tailwindify class
    });

    it('should process CSS declarations with default options', () => {
      // TODO: Implement test after updating Tailwindify class
    });

    it('should process CSS declarations with custom prefix', () => {
      // TODO: Implement test after updating Tailwindify class
    });
  });

  describe('Integration', () => {
    it('should transform a simple CSS rule to Tailwind classes', () => {
      const tailwindify = new Tailwindify();
      const rule: CssRule = {
        selector: '.button',
        declarations: [
          { prop: 'color', value: 'red' },
          { prop: 'padding', value: '1rem' },
        ],
      };

      const result = tailwindify.processRule(rule);

      expect(result).toBeDefined();
      expect(Array.isArray(result.classes)).toBe(true);
      expect(result.coverage).toBeDefined();
      expect(result.coverage.total).toBe(2);
    });
  });
});

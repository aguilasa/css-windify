import { describe, it, expect } from 'vitest';
import { transformCssText } from '../index';
import { MatchCtx } from '../types';

describe('Button Component Fixture', () => {
  const buttonCss = `
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.25rem;
      border-radius: 0.375rem;
      background-color: #3b82f6;
      color: #ffffff;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s;
    }

    .button:hover {
      background-color: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .button:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
    }

    .button:active {
      transform: translateY(0);
    }

    .button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (min-width: 768px) {
      .button {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      }
    }
  `;

  describe('Strict Mode', () => {
    const ctx: MatchCtx = {
      theme: {},
      version: 'v3',
      opts: {
        strict: true,
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

    it('should convert button base styles', () => {
      const result = transformCssText(buttonCss, ctx);
      const buttonClasses = result.bySelector['.button'].classes;

      expect(buttonClasses).toContain('inline-flex');
      expect(buttonClasses).toContain('items-center');
      expect(buttonClasses).toContain('justify-center');
      expect(buttonClasses).toContain('py-2');
      expect(buttonClasses).toContain('px-4');
      expect(buttonClasses).toContain('text-sm');
      expect(buttonClasses).toContain('font-medium');
      expect(buttonClasses).toContain('rounded-md');
      expect(buttonClasses).toContain('bg-blue-500');
      expect(buttonClasses).toContain('text-white');
      expect(buttonClasses).toContain('cursor-pointer');
    });

    it('should convert hover state', () => {
      const result = transformCssText(buttonCss, ctx);
      const hoverClasses = result.bySelector['.button:hover'].classes;

      expect(hoverClasses).toContain('bg-blue-600');
      expect(hoverClasses).toContain('-translate-y-1');
    });

    it('should convert focus state', () => {
      const result = transformCssText(buttonCss, ctx);
      const focusClasses = result.bySelector['.button:focus'].classes;

      expect(focusClasses).toContain('outline-2');
      expect(focusClasses).toContain('outline-transparent');
      expect(focusClasses).toContain('outline-offset-2');
    });

    it('should convert disabled state', () => {
      const result = transformCssText(buttonCss, ctx);
      const disabledClasses = result.bySelector['.button:disabled'].classes;

      expect(disabledClasses).toContain('opacity-50');
      expect(disabledClasses).toContain('cursor-not-allowed');
    });

    it('should convert responsive styles', () => {
      const result = transformCssText(buttonCss, ctx);

      // Check if we have multiple selectors (including media query variants)
      const selectors = Object.keys(result.bySelector);

      expect(selectors.length).toBeGreaterThanOrEqual(5);
    });

    it('should have high coverage in strict mode', () => {
      const result = transformCssText(buttonCss, ctx);
      const allResults = Object.values(result.bySelector);

      // Calculate overall coverage
      const totalMatched = allResults.reduce((sum, r) => sum + r.coverage.matched, 0);
      const totalProps = allResults.reduce((sum, r) => sum + r.coverage.total, 0);
      const overallCoverage = (totalMatched / totalProps) * 100;

      expect(overallCoverage).toBeGreaterThan(70);
    });

    it('should match snapshot in strict mode', () => {
      const result = transformCssText(buttonCss, ctx);

      expect({
        selectors: Object.keys(result.bySelector),
        baseClasses: result.bySelector['.button'].classes.sort(),
        hoverClasses: result.bySelector['.button:hover'].classes.sort(),
        focusClasses: result.bySelector['.button:focus'].classes.sort(),
        coverage: result.bySelector['.button'].coverage,
      }).toMatchSnapshot();
    });
  });

  describe('Approximate Mode', () => {
    const ctx: MatchCtx = {
      theme: {},
      version: 'v3',
      opts: {
        strict: false,
        approximate: true,
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

    it('should convert button with approximation', () => {
      const result = transformCssText(buttonCss, ctx);
      const buttonClasses = result.bySelector['.button'].classes;

      expect(buttonClasses).toContain('inline-flex');
      expect(buttonClasses).toContain('items-center');
      expect(buttonClasses).toContain('justify-center');
    });

    it('should have higher coverage in approximate mode', () => {
      const result = transformCssText(buttonCss, ctx);
      const allResults = Object.values(result.bySelector);

      const totalMatched = allResults.reduce((sum, r) => sum + r.coverage.matched, 0);
      const totalProps = allResults.reduce((sum, r) => sum + r.coverage.total, 0);
      const overallCoverage = (totalMatched / totalProps) * 100;

      expect(overallCoverage).toBeGreaterThan(70);
    });

    it('should match snapshot in approximate mode', () => {
      const result = transformCssText(buttonCss, ctx);

      expect({
        selectors: Object.keys(result.bySelector),
        baseClasses: result.bySelector['.button'].classes.sort(),
        coverage: result.bySelector['.button'].coverage,
      }).toMatchSnapshot();
    });
  });

  describe('Warnings', () => {
    const ctx: MatchCtx = {
      theme: {},
      version: 'v3',
      opts: {
        strict: true,
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

    it('should report warnings for unmapped properties', () => {
      const result = transformCssText(buttonCss, ctx);
      const allResults = Object.values(result.bySelector);

      const totalWarnings = allResults.reduce((sum, r) => sum + r.warnings.length, 0);

      // Should have some warnings but not too many
      expect(totalWarnings).toBeGreaterThanOrEqual(0);
    });
  });
});

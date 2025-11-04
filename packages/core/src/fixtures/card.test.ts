import { describe, it, expect } from 'vitest';
import { transformCssText } from '../index';
import { MatchCtx } from '../types';

describe('Card Component Fixture', () => {
  const cardCss = `
    .card {
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      overflow: hidden;
      transition: all 0.3s;
    }

    .card:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .card-body {
      padding: 1.5rem;
      flex: 1 1 0%;
    }

    .card-footer {
      padding: 1rem 1.5rem;
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    @media (min-width: 768px) {
      .card {
        flex-direction: row;
      }
    }
  `;

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

  describe('Card Structure', () => {
    it('should convert card base styles', () => {
      const result = transformCssText(cardCss, ctx);
      const cardClasses = result.bySelector['.card'].classes;

      expect(cardClasses).toContain('flex');
      expect(cardClasses).toContain('flex-col');
      expect(cardClasses).toContain('bg-white');
      expect(cardClasses).toContain('rounded-lg');
      expect(cardClasses).toContain('overflow-hidden');
    });

    it('should convert box-shadow correctly', () => {
      const result = transformCssText(cardCss, ctx);
      const cardClasses = result.bySelector['.card'].classes;

      // Should have shadow class
      const hasShadow = cardClasses.some((c) => c.includes('shadow'));
      expect(hasShadow).toBe(true);
    });

    it('should convert hover shadow', () => {
      const result = transformCssText(cardCss, ctx);
      const hoverClasses = result.bySelector['.card:hover'].classes;

      // Should have larger shadow on hover
      const hasShadow = hoverClasses.some((c) => c.includes('shadow'));
      expect(hasShadow).toBe(true);
      expect(hoverClasses).toContain('-translate-y-2');
    });

    it('should convert card header', () => {
      const result = transformCssText(cardCss, ctx);
      const headerClasses = result.bySelector['.card-header'].classes;

      expect(headerClasses).toContain('p-6');
      expect(headerClasses).toContain('border-b');
    });

    it('should convert card title', () => {
      const result = transformCssText(cardCss, ctx);
      const titleClasses = result.bySelector['.card-title'].classes;

      expect(titleClasses).toContain('text-xl');
      expect(titleClasses).toContain('font-semibold');
      expect(titleClasses).toContain('m-0');
    });

    it('should convert card body with flex-1', () => {
      const result = transformCssText(cardCss, ctx);
      const bodyClasses = result.bySelector['.card-body'].classes;

      expect(bodyClasses).toContain('p-6');
      expect(bodyClasses).toContain('flex-1');
    });

    it('should convert card footer', () => {
      const result = transformCssText(cardCss, ctx);
      const footerClasses = result.bySelector['.card-footer'].classes;

      expect(footerClasses).toContain('border-t');
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle responsive flex direction', () => {
      const result = transformCssText(cardCss, ctx);
      const selectors = Object.keys(result.bySelector);

      // Should have multiple selectors
      expect(selectors.length).toBeGreaterThan(6);
    });
  });

  describe('Coverage', () => {
    it('should have good coverage', () => {
      const result = transformCssText(cardCss, ctx);
      const allResults = Object.values(result.bySelector);

      const totalMatched = allResults.reduce((sum, r) => sum + r.coverage.matched, 0);
      const totalProps = allResults.reduce((sum, r) => sum + r.coverage.total, 0);
      const overallCoverage = (totalMatched / totalProps) * 100;

      expect(overallCoverage).toBeGreaterThan(60);
    });
  });

  describe('Snapshots', () => {
    it('should match card snapshot', () => {
      const result = transformCssText(cardCss, ctx);

      expect({
        selectors: Object.keys(result.bySelector).sort(),
        cardClasses: result.bySelector['.card'].classes.sort(),
        cardHoverClasses: result.bySelector['.card:hover'].classes.sort(),
        headerClasses: result.bySelector['.card-header'].classes.sort(),
        bodyClasses: result.bySelector['.card-body'].classes.sort(),
        footerClasses: result.bySelector['.card-footer'].classes.sort(),
      }).toMatchSnapshot();
    });
  });
});

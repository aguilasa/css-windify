import { describe, it, expect } from 'vitest';
import { transformCssText } from '../index';
import { MatchCtx } from '../types';

describe('Grid Layout Fixture', () => {
  const gridCss = `
    .grid-container {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 1rem;
      padding: 2rem;
    }

    .grid-item {
      background-color: #f3f4f6;
      padding: 1.5rem;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .grid-item-span-2 {
      grid-column: span 2 / span 2;
    }

    .grid-item-span-3 {
      grid-column: span 3 / span 3;
    }

    .grid-item-span-4 {
      grid-column: span 4 / span 4;
    }

    .grid-item-span-6 {
      grid-column: span 6 / span 6;
    }

    .grid-item-span-12 {
      grid-column: span 12 / span 12;
    }

    .grid-auto-rows {
      grid-auto-rows: minmax(100px, auto);
    }

    .grid-dense {
      grid-auto-flow: dense;
    }

    @media (min-width: 640px) {
      .grid-container {
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 1.5rem;
      }
    }

    @media (min-width: 1024px) {
      .grid-container {
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 2rem;
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

  describe('Grid Container', () => {
    it('should convert grid display', () => {
      const result = transformCssText(gridCss, ctx);
      const containerClasses = result.bySelector['.grid-container'].classes;

      expect(containerClasses).toContain('grid');
      expect(containerClasses).toContain('gap-4');
      expect(containerClasses).toContain('p-8');
    });

    it('should convert grid-template-columns', () => {
      const result = transformCssText(gridCss, ctx);
      const containerClasses = result.bySelector['.grid-container'].classes;

      expect(containerClasses).toContain('grid-cols-12');
    });
  });

  describe('Grid Items', () => {
    it('should convert grid item styles', () => {
      const result = transformCssText(gridCss, ctx);
      const itemClasses = result.bySelector['.grid-item'].classes;

      expect(itemClasses).toContain('bg-gray-100');
      expect(itemClasses).toContain('p-6');
      expect(itemClasses).toContain('rounded-lg');
      expect(itemClasses).toContain('border');
    });

    it('should convert col-span-2', () => {
      const result = transformCssText(gridCss, ctx);
      const span2Classes = result.bySelector['.grid-item-span-2'].classes;

      expect(span2Classes).toContain('col-span-2');
    });

    it('should convert col-span-3', () => {
      const result = transformCssText(gridCss, ctx);
      const span3Classes = result.bySelector['.grid-item-span-3'].classes;

      expect(span3Classes).toContain('col-span-3');
    });

    it('should convert col-span-4', () => {
      const result = transformCssText(gridCss, ctx);
      const span4Classes = result.bySelector['.grid-item-span-4'].classes;

      expect(span4Classes).toContain('col-span-4');
    });

    it('should convert col-span-6', () => {
      const result = transformCssText(gridCss, ctx);
      const span6Classes = result.bySelector['.grid-item-span-6'].classes;

      expect(span6Classes).toContain('col-span-6');
    });

    it('should convert col-span-12', () => {
      const result = transformCssText(gridCss, ctx);
      const span12Classes = result.bySelector['.grid-item-span-12'].classes;

      expect(span12Classes).toContain('col-span-12');
    });
  });

  describe('Grid Auto Properties', () => {
    it('should convert grid-auto-flow', () => {
      const result = transformCssText(gridCss, ctx);
      const denseClasses = result.bySelector['.grid-dense'].classes;

      expect(denseClasses).toContain('grid-flow-dense');
    });
  });

  describe('Responsive Grid', () => {
    it('should handle responsive grid columns', () => {
      const result = transformCssText(gridCss, ctx);
      const selectors = Object.keys(result.bySelector);

      // Should have multiple selectors including responsive variants
      expect(selectors.length).toBeGreaterThan(8);
    });
  });

  describe('Coverage', () => {
    it('should have high coverage for grid properties', () => {
      const result = transformCssText(gridCss, ctx);
      const allResults = Object.values(result.bySelector);

      const totalMatched = allResults.reduce((sum, r) => sum + r.coverage.matched, 0);
      const totalProps = allResults.reduce((sum, r) => sum + r.coverage.total, 0);
      const overallCoverage = (totalMatched / totalProps) * 100;

      expect(overallCoverage).toBeGreaterThan(70);
    });
  });

  describe('Snapshots', () => {
    it('should match grid layout snapshot', () => {
      const result = transformCssText(gridCss, ctx);

      expect({
        selectors: Object.keys(result.bySelector).sort(),
        containerClasses: result.bySelector['.grid-container'].classes.sort(),
        itemClasses: result.bySelector['.grid-item'].classes.sort(),
        span2Classes: result.bySelector['.grid-item-span-2'].classes.sort(),
        span6Classes: result.bySelector['.grid-item-span-6'].classes.sort(),
      }).toMatchSnapshot();
    });
  });
});

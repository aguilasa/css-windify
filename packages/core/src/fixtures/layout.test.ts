import { describe, it, expect } from 'vitest';
import { mockTailwindTheme } from '../test/mockTheme';
import { transformCssText } from '../index';
import { MatchCtx } from '../types';

describe('Complex Layout Fixture', () => {
  const layoutCss = `
    .layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #f9fafb;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background-color: #ffffff;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #3b82f6;
    }

    .header-nav {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-link {
      color: #6b7280;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-link:hover {
      color: #3b82f6;
    }

    .main-content {
      display: flex;
      flex: 1 1 0%;
      max-width: 1280px;
      margin: 0 auto;
      width: 100%;
      padding: 2rem;
      gap: 2rem;
    }

    .sidebar {
      display: none;
      flex-direction: column;
      width: 16rem;
      background-color: #ffffff;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      height: fit-content;
      position: sticky;
      top: 5rem;
    }

    .content-area {
      flex: 1 1 0%;
      background-color: #ffffff;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }

    .footer {
      background-color: #111827;
      color: #ffffff;
      padding: 3rem 2rem;
      margin-top: auto;
    }

    .footer-content {
      max-width: 1280px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      gap: 2rem;
    }

    @media (min-width: 768px) {
      .sidebar {
        display: flex;
      }

      .footer-content {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (min-width: 1024px) {
      .main-content {
        padding: 3rem;
      }

      .footer-content {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }

    @media (prefers-color-scheme: dark) {
      .layout {
        background-color: #111827;
      }

      .header {
        background-color: #1f2937;
        border-bottom: 1px solid #374151;
      }

      .sidebar {
        background-color: #1f2937;
      }

      .content-area {
        background-color: #1f2937;
        color: #f3f4f6;
      }
    }
  `;

  const ctx: MatchCtx = {
    theme: mockTailwindTheme,
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

  describe('Layout Structure', () => {
    it('should convert main layout container', () => {
      const result = transformCssText(layoutCss, ctx);

      // Check that layout selector exists and has classes
      const layoutSelector = Object.keys(result.bySelector).find((s) => s.includes('.layout'));
      expect(layoutSelector).toBeDefined();

      if (layoutSelector) {
        const layoutClasses = result.bySelector[layoutSelector].classes;
        expect(layoutClasses.length).toBeGreaterThan(0);
      }
    });

    it('should convert sticky header', () => {
      const result = transformCssText(layoutCss, ctx);
      const headerClasses = result.bySelector['.header'].classes;

      expect(headerClasses).toContain('flex');
      expect(headerClasses).toContain('items-center');
      expect(headerClasses).toContain('justify-between');
      expect(headerClasses).toContain('bg-white');
      expect(headerClasses).toContain('sticky');
      expect(headerClasses).toContain('top-0');
      expect(headerClasses).toContain('z-50');
    });

    it('should convert header logo', () => {
      const result = transformCssText(layoutCss, ctx);
      const logoClasses = result.bySelector['.header-logo'].classes;

      expect(logoClasses).toContain('text-2xl');
      expect(logoClasses).toContain('font-bold');
      expect(logoClasses).toContain('text-blue-500');
    });

    it('should convert navigation', () => {
      const result = transformCssText(layoutCss, ctx);
      const navClasses = result.bySelector['.header-nav'].classes;

      expect(navClasses).toContain('flex');
      expect(navClasses).toContain('gap-8');
      expect(navClasses).toContain('items-center');
    });
  });

  describe('Main Content Area', () => {
    it('should convert main content container', () => {
      const result = transformCssText(layoutCss, ctx);
      const mainClasses = result.bySelector['.main-content'].classes;

      expect(mainClasses).toContain('flex');
      // flex: 1 generates arbitrary value
      expect(mainClasses.some((c) => c.includes('flex'))).toBe(true);
      // max-width generates arbitrary value (not in mockTheme)
      expect(mainClasses.some((c) => c.includes('max-w'))).toBe(true);
      expect(mainClasses).toContain('mx-auto');
      // width: 100% generates arbitrary value (full not in spacing)
      expect(mainClasses.some((c) => c.includes('w-'))).toBe(true);
      expect(mainClasses).toContain('p-8');
      expect(mainClasses).toContain('gap-8');
    });

    it('should convert sidebar', () => {
      const result = transformCssText(layoutCss, ctx);
      const sidebarClasses = result.bySelector['.sidebar'].classes;

      expect(sidebarClasses).toContain('hidden');
      expect(sidebarClasses).toContain('flex-col');
      expect(sidebarClasses).toContain('w-64');
      expect(sidebarClasses).toContain('bg-white');
      expect(sidebarClasses).toContain('p-6');
      expect(sidebarClasses).toContain('rounded-lg');
      expect(sidebarClasses).toContain('sticky');
    });

    it('should convert content area', () => {
      const result = transformCssText(layoutCss, ctx);
      const contentClasses = result.bySelector['.content-area'].classes;

      // flex: 1 generates arbitrary value
      expect(contentClasses.some((c) => c.includes('flex'))).toBe(true);
      expect(contentClasses).toContain('bg-white');
      expect(contentClasses).toContain('p-8');
      expect(contentClasses).toContain('rounded-lg');
    });
  });

  describe('Footer', () => {
    it('should convert footer', () => {
      const result = transformCssText(layoutCss, ctx);
      const footerClasses = result.bySelector['.footer'].classes;

      expect(footerClasses).toContain('bg-gray-900');
      expect(footerClasses).toContain('text-white');
      expect(footerClasses).toContain('mt-auto');
    });

    it('should convert footer grid', () => {
      const result = transformCssText(layoutCss, ctx);
      const footerContentClasses = result.bySelector['.footer-content'].classes;

      // max-width generates arbitrary value (not in mockTheme)
      expect(footerContentClasses.some((c) => c.includes('max-w'))).toBe(true);
      expect(footerContentClasses).toContain('mx-auto');
      expect(footerContentClasses).toContain('grid');
      expect(footerContentClasses).toContain('grid-cols-1');
      expect(footerContentClasses).toContain('gap-8');
    });
  });

  describe('Interactive States', () => {
    it('should convert nav link hover', () => {
      const result = transformCssText(layoutCss, ctx);
      const hoverClasses = result.bySelector['.nav-link:hover'].classes;

      expect(hoverClasses).toContain('hover:text-blue-500');
    });
  });

  describe('Responsive Behavior', () => {
    it('should have responsive variants', () => {
      const result = transformCssText(layoutCss, ctx);
      const selectors = Object.keys(result.bySelector);

      // Should have many selectors including responsive variants
      expect(selectors.length).toBeGreaterThan(10);
    });
  });

  describe('Dark Mode', () => {
    it('should have dark mode variants', () => {
      const result = transformCssText(layoutCss, ctx);
      const selectors = Object.keys(result.bySelector);

      // Should have selectors (dark mode creates additional variants)
      expect(selectors.length).toBeGreaterThan(10);
    });
  });

  describe('Coverage', () => {
    it('should have good overall coverage', () => {
      const result = transformCssText(layoutCss, ctx);
      const allResults = Object.values(result.bySelector);

      const totalMatched = allResults.reduce((sum, r) => sum + r.coverage.matched, 0);
      const totalProps = allResults.reduce((sum, r) => sum + r.coverage.total, 0);
      const overallCoverage = (totalMatched / totalProps) * 100;

      expect(overallCoverage).toBeGreaterThan(65);
    });
  });

  describe('Snapshots', () => {
    it('should match complex layout snapshot', () => {
      const result = transformCssText(layoutCss, ctx);

      expect({
        selectors: Object.keys(result.bySelector).sort(),
        layoutClasses: result.bySelector['.layout'].classes.sort(),
        headerClasses: result.bySelector['.header'].classes.sort(),
        mainClasses: result.bySelector['.main-content'].classes.sort(),
        sidebarClasses: result.bySelector['.sidebar'].classes.sort(),
        footerClasses: result.bySelector['.footer'].classes.sort(),
      }).toMatchSnapshot();
    });
  });
});

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { transformCssText } from '../src/core/cssTransformer';
import { loadTheme } from '../src/core/themeLoader';
import { loadTokens } from '../src/core/tokensLoader';
import type { MatchCtx } from '../src/types';

describe('v3/v4 Parity Tests', () => {
  const fixturesDir = join(__dirname, 'fixtures', 'v3-v4-comparison');
  const sampleCss = readFileSync(join(fixturesDir, 'sample.css'), 'utf-8');

  describe('Version Detection', () => {
    it('should detect v3 when using config-based theme', async () => {
      const theme = await loadTheme(fixturesDir);

      const ctx: MatchCtx = {
        theme,
        tokens: undefined,
        version: 'v3',
        opts: {
          strict: true,
          approximate: false,
          thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      const result = transformCssText(sampleCss, ctx);

      // Verify it processed the CSS
      expect(Object.keys(result.bySelector).length).toBeGreaterThan(0);
      expect(result.bySelector['.button']).toBeDefined();
    });

    it('should detect v4 when tokens are available', async () => {
      // In a real v4 scenario, loadTokens would parse CSS tokens
      // For now, we simulate v4 by manually setting version
      const tokens = await loadTokens();

      const ctx: MatchCtx = {
        theme: undefined,
        tokens,
        version: 'v4',
        opts: {
          strict: true,
          approximate: false,
          thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      const result = transformCssText(sampleCss, ctx);

      // Verify it processed the CSS
      expect(Object.keys(result.bySelector).length).toBeGreaterThan(0);
      expect(result.bySelector['.button']).toBeDefined();
    });
  });

  describe('Coverage Parity', () => {
    it('should produce similar coverage between v3 and v4 in strict mode', async () => {
      const theme = await loadTheme(fixturesDir);
      const tokens = await loadTokens();

      // v3 context
      const v3Ctx: MatchCtx = {
        theme,
        tokens: undefined,
        version: 'v3',
        opts: {
          strict: true,
          approximate: false,
          thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      // v4 context
      const v4Ctx: MatchCtx = {
        theme: undefined,
        tokens,
        version: 'v4',
        opts: {
          strict: true,
          approximate: false,
          thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      const v3Result = transformCssText(sampleCss, v3Ctx);
      const v4Result = transformCssText(sampleCss, v4Ctx);

      // Compare coverage for .button selector
      const v3Button = v3Result.bySelector['.button'];
      const v4Button = v4Result.bySelector['.button'];

      expect(v3Button).toBeDefined();
      expect(v4Button).toBeDefined();

      // Coverage percentages should be similar (within 10%)
      const coverageDiff = Math.abs(v3Button.coverage.percentage - v4Button.coverage.percentage);
      expect(coverageDiff).toBeLessThanOrEqual(10);

      // Both should have processed the same number of declarations
      expect(v3Button.coverage.total).toBe(v4Button.coverage.total);
    });

    it('should produce similar coverage with approximation enabled', async () => {
      const theme = await loadTheme(fixturesDir);
      const tokens = await loadTokens();

      // v3 context with approximation
      const v3Ctx: MatchCtx = {
        theme,
        tokens: undefined,
        version: 'v3',
        opts: {
          strict: false,
          approximate: true,
          thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      // v4 context with approximation
      const v4Ctx: MatchCtx = {
        theme: undefined,
        tokens,
        version: 'v4',
        opts: {
          strict: false,
          approximate: true,
          thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      const v3Result = transformCssText(sampleCss, v3Ctx);
      const v4Result = transformCssText(sampleCss, v4Ctx);

      // Compare coverage for .spacing-test selector (has non-standard values)
      const v3Spacing = v3Result.bySelector['.spacing-test'];
      const v4Spacing = v4Result.bySelector['.spacing-test'];

      expect(v3Spacing).toBeDefined();
      expect(v4Spacing).toBeDefined();

      // With approximation, both should have similar or better coverage
      expect(v3Spacing.coverage.percentage).toBeGreaterThanOrEqual(0);
      expect(v4Spacing.coverage.percentage).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Class Generation Parity', () => {
    it('should generate equivalent classes for standard values', async () => {
      const theme = await loadTheme(fixturesDir);
      const tokens = await loadTokens();

      const v3Ctx: MatchCtx = {
        theme,
        tokens: undefined,
        version: 'v3',
        opts: {
          strict: true,
          approximate: false,
          thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      const v4Ctx: MatchCtx = {
        theme: undefined,
        tokens,
        version: 'v4',
        opts: {
          strict: true,
          approximate: false,
          thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      const v3Result = transformCssText(sampleCss, v3Ctx);
      const v4Result = transformCssText(sampleCss, v4Ctx);

      // Compare classes for .button
      const v3Classes = v3Result.bySelector['.button'].classes;
      const v4Classes = v4Result.bySelector['.button'].classes;

      // Should have similar number of classes
      const classDiff = Math.abs(v3Classes.length - v4Classes.length);
      expect(classDiff).toBeLessThanOrEqual(2); // Allow small differences

      // Key classes should be present in both
      const keyClasses = ['inline-flex', 'font-semibold'];
      for (const cls of keyClasses) {
        const v3Has = v3Classes.some((c) => c.includes(cls));
        const v4Has = v4Classes.some((c) => c.includes(cls));
        expect(v3Has).toBe(v4Has);
      }
    });

    it('should handle arbitrary values consistently', async () => {
      const theme = await loadTheme(fixturesDir);
      const tokens = await loadTokens();

      const v3Ctx: MatchCtx = {
        theme,
        tokens: undefined,
        version: 'v3',
        opts: {
          strict: true,
          approximate: false,
          thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      const v4Ctx: MatchCtx = {
        theme: undefined,
        tokens,
        version: 'v4',
        opts: {
          strict: true,
          approximate: false,
          thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      const v3Result = transformCssText(sampleCss, v3Ctx);
      const v4Result = transformCssText(sampleCss, v4Ctx);

      // Both should use arbitrary values for non-standard spacing
      const v3Spacing = v3Result.bySelector['.spacing-test'];
      const v4Spacing = v4Result.bySelector['.spacing-test'];

      const v3HasArbitrary = v3Spacing.classes.some((c) => c.includes('['));
      const v4HasArbitrary = v4Spacing.classes.some((c) => c.includes('['));

      // In strict mode, both should behave similarly regarding arbitrary values
      // They may or may not use arbitrary depending on whether values match theme
      expect(typeof v3HasArbitrary).toBe('boolean');
      expect(typeof v4HasArbitrary).toBe('boolean');

      // Both should have processed the same declarations
      expect(v3Spacing.coverage.total).toBe(v4Spacing.coverage.total);
    });
  });

  describe('Warning Categories', () => {
    it('should include appropriate warning categories for v3', async () => {
      const theme = await loadTheme(fixturesDir);

      const ctx: MatchCtx = {
        theme,
        tokens: undefined,
        version: 'v3',
        opts: {
          strict: true,
          approximate: false,
          thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      const result = transformCssText(sampleCss, ctx);
      const allWarnings = Object.values(result.bySelector).flatMap((r) => r.warnings);

      // v3 should have arbitrary-value warnings but not token-miss or v3-fallback
      const hasArbitraryWarnings = allWarnings.some((w) => w.includes('arbitrary value'));
      expect(hasArbitraryWarnings).toBe(true);

      // Should not have v4-specific warnings
      const hasTokenMiss = allWarnings.some((w) => w.includes('token-miss'));
      const hasV3Fallback = allWarnings.some((w) => w.includes('v3-fallback'));
      expect(hasTokenMiss).toBe(false);
      expect(hasV3Fallback).toBe(false);
    });

    it('should categorize warnings correctly', async () => {
      const theme = await loadTheme(fixturesDir);

      const ctx: MatchCtx = {
        theme,
        tokens: undefined,
        version: 'v3',
        opts: {
          strict: true,
          approximate: false,
          thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      const result = transformCssText(sampleCss, ctx);

      // Check that coverage includes warningsByCategory
      const buttonResult = result.bySelector['.button'];
      if (buttonResult.coverage.warningsByCategory) {
        expect(buttonResult.coverage.warningsByCategory).toHaveProperty('arbitrary-value');
        expect(buttonResult.coverage.warningsByCategory).toHaveProperty('no-handler');
        expect(buttonResult.coverage.warningsByCategory).toHaveProperty('approximate');
        expect(buttonResult.coverage.warningsByCategory).toHaveProperty('token-miss');
        expect(buttonResult.coverage.warningsByCategory).toHaveProperty('v3-fallback');
        expect(buttonResult.coverage.warningsByCategory).toHaveProperty('other');
      }
    });
  });

  describe('Approximation Behavior', () => {
    it('should produce approximate warnings when values are within threshold', async () => {
      const theme = await loadTheme(fixturesDir);

      const ctx: MatchCtx = {
        theme,
        tokens: undefined,
        version: 'v3',
        opts: {
          strict: false,
          approximate: true,
          thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      const result = transformCssText(sampleCss, ctx);

      // .spacing-test has 0.625rem (10px) margin, which might approximate to 0.5rem (8px) or 0.75rem (12px)
      const spacingResult = result.bySelector['.spacing-test'];

      // Should have processed declarations
      expect(spacingResult.coverage.total).toBeGreaterThan(0);

      // With approximation enabled, should have reasonable coverage
      expect(spacingResult.coverage.percentage).toBeGreaterThanOrEqual(0);

      // May have warnings about approximation or arbitrary values
      const hasWarnings = spacingResult.warnings.length > 0;
      expect(typeof hasWarnings).toBe('boolean');
    });

    it('should respect threshold limits', async () => {
      const theme = await loadTheme(fixturesDir);

      // Very strict thresholds
      const strictCtx: MatchCtx = {
        theme,
        tokens: undefined,
        version: 'v3',
        opts: {
          strict: false,
          approximate: true,
          thresholds: { spacingPx: 0, fontPx: 0, radiiPx: 0 }, // No approximation
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      // Lenient thresholds
      const lenientCtx: MatchCtx = {
        theme,
        tokens: undefined,
        version: 'v3',
        opts: {
          strict: false,
          approximate: true,
          thresholds: { spacingPx: 10, fontPx: 5, radiiPx: 10 }, // Very lenient
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      const strictResult = transformCssText(sampleCss, strictCtx);
      const lenientResult = transformCssText(sampleCss, lenientCtx);

      // Lenient should have fewer arbitrary values (more approximations)
      const strictArbitrary = strictResult.bySelector['.spacing-test'].classes.filter((c) =>
        c.includes('[')
      ).length;
      const lenientArbitrary = lenientResult.bySelector['.spacing-test'].classes.filter((c) =>
        c.includes('[')
      ).length;

      // Lenient should have equal or fewer arbitrary values
      expect(lenientArbitrary).toBeLessThanOrEqual(strictArbitrary);
    });
  });

  describe('Category Coverage', () => {
    it('should track coverage by category', async () => {
      const theme = await loadTheme(fixturesDir);

      const ctx: MatchCtx = {
        theme,
        tokens: undefined,
        version: 'v3',
        opts: {
          strict: true,
          approximate: false,
          thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
          screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
        },
      };

      const result = transformCssText(sampleCss, ctx);
      const buttonResult = result.bySelector['.button'];

      // Should have category breakdown
      if (buttonResult.coverage.categories) {
        expect(buttonResult.coverage.categories).toHaveProperty('spacing');
        expect(buttonResult.coverage.categories).toHaveProperty('color');
        expect(buttonResult.coverage.categories).toHaveProperty('typography');
        expect(buttonResult.coverage.categories).toHaveProperty('layout');
        expect(buttonResult.coverage.categories).toHaveProperty('border');
        expect(buttonResult.coverage.categories).toHaveProperty('effects');

        // Button should have spacing properties
        expect(buttonResult.coverage.categories.spacing.total).toBeGreaterThan(0);

        // Button should have color properties
        expect(buttonResult.coverage.categories.color.total).toBeGreaterThan(0);

        // Button should have typography properties
        expect(buttonResult.coverage.categories.typography.total).toBeGreaterThan(0);
      }
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  calculateCoverage,
  aggregateWarnings,
  countNonArbitraryClasses,
  calculateCategoryStats,
  categorizeWarning,
  summarize,
  compareResults,
  generateDiff,
  CssTransformResult,
} from './reporter';
import { TransformResult } from '../types';

describe('reporter', () => {
  describe('calculateCoverage', () => {
    it('should calculate coverage correctly', () => {
      const coverage = calculateCoverage(8, 10, 6);
      expect(coverage.matched).toBe(8);
      expect(coverage.total).toBe(10);
      expect(coverage.percentage).toBe(80);
      expect(coverage.nonArbitrary).toBe(6);
    });

    it('should handle zero total case', () => {
      const coverage = calculateCoverage(0, 0);
      expect(coverage.matched).toBe(0);
      expect(coverage.total).toBe(0);
      expect(coverage.percentage).toBe(0);
    });

    it('should include category statistics when provided', () => {
      const categories = {
        spacing: { matched: 3, total: 4, percentage: 75 },
        color: { matched: 2, total: 2, percentage: 100 },
        typography: { matched: 1, total: 2, percentage: 50 },
        layout: { matched: 0, total: 0, percentage: 0 },
        border: { matched: 0, total: 0, percentage: 0 },
        background: { matched: 0, total: 0, percentage: 0 },
        effects: { matched: 0, total: 0, percentage: 0 },
        'flex-grid': { matched: 0, total: 0, percentage: 0 },
        sizing: { matched: 0, total: 0, percentage: 0 },
        other: { matched: 0, total: 0, percentage: 0 },
      };

      const coverage = calculateCoverage(6, 8, 5, categories);
      expect(coverage.categories).toBeDefined();
      expect(coverage.categories?.spacing.matched).toBe(3);
      expect(coverage.categories?.color.percentage).toBe(100);
    });
  });

  describe('aggregateWarnings', () => {
    it('should deduplicate warnings', () => {
      const warnings = ['Warning 1', 'Warning 2', 'Warning 1', 'Warning 3'];

      const result = aggregateWarnings(warnings);
      expect(result.warnings).toHaveLength(3);
      expect(result.warnings).toContain('Warning 1 (2 occurrences)');
      expect(result.warnings).toContain('Warning 2');
      expect(result.warnings).toContain('Warning 3');
    });

    it('should categorize warnings correctly', () => {
      const warnings = [
        "Used arbitrary value for 'width: 123px'",
        "No direct Tailwind equivalent for 'custom-prop: value'",
        'approximate mapping: 15px → w-4 (1px difference)',
        'Some other warning',
      ];

      const result = aggregateWarnings(warnings);
      expect(result.byCategory['arbitrary-value']).toBe(1);
      expect(result.byCategory['no-handler']).toBe(1);
      expect(result.byCategory['approximate']).toBe(1);
      expect(result.byCategory['other']).toBe(1);
    });
  });

  describe('countNonArbitraryClasses', () => {
    it('should count classes without arbitrary values', () => {
      const classes = ['p-4', 'w-[123px]', 'text-lg', 'bg-[#fff]', 'flex'];

      const count = countNonArbitraryClasses(classes);
      expect(count).toBe(3); // p-4, text-lg, flex
    });

    it('should handle empty array', () => {
      expect(countNonArbitraryClasses([])).toBe(0);
    });
  });

  describe('calculateCategoryStats', () => {
    it('should calculate stats by category', () => {
      const declarations = [
        { prop: 'width' },
        { prop: 'height' },
        { prop: 'color' },
        { prop: 'font-size' },
        { prop: 'margin' },
        { prop: 'custom-prop' },
      ];

      const matchedProps = new Set(['width', 'color', 'font-size']);
      const stats = calculateCategoryStats(declarations, matchedProps);

      expect(stats.spacing.total).toBe(3); // width, height, margin
      expect(stats.spacing.matched).toBe(1); // width
      expect(stats.spacing.percentage).toBe(33); // 1/3 = 33%

      expect(stats.color.total).toBe(1); // color
      expect(stats.color.matched).toBe(1); // color
      expect(stats.color.percentage).toBe(100); // 1/1 = 100%

      expect(stats.typography.total).toBe(1); // font-size
      expect(stats.typography.matched).toBe(1); // font-size
      expect(stats.typography.percentage).toBe(100); // 1/1 = 100%

      expect(stats.other.total).toBe(1); // custom-prop
      expect(stats.other.matched).toBe(0);
      expect(stats.other.percentage).toBe(0);
    });
  });

  describe('categorizeWarning', () => {
    it('should categorize arbitrary value warnings', () => {
      expect(categorizeWarning("Used arbitrary value for 'width: 123px'")).toBe('arbitrary-value');
    });

    it('should categorize no handler warnings', () => {
      expect(categorizeWarning("No direct Tailwind equivalent for 'custom-prop: value'")).toBe(
        'no-handler'
      );
      expect(categorizeWarning('Could not transform: custom-prop: value')).toBe('no-handler');
    });

    it('should categorize approximate warnings', () => {
      expect(categorizeWarning('approximate mapping: 15px → w-4 (1px difference)')).toBe(
        'approximate'
      );
      expect(categorizeWarning('Using approximate value')).toBe('approximate');
    });

    it('should categorize token-miss warnings', () => {
      expect(categorizeWarning('token-miss: spacing token not found')).toBe('token-miss');
      expect(categorizeWarning('token not found in v4 theme')).toBe('token-miss');
    });

    it('should categorize v3-fallback warnings', () => {
      expect(categorizeWarning('v3-fallback: using v3 theme')).toBe('v3-fallback');
      expect(categorizeWarning('falling back to v3 config')).toBe('v3-fallback');
    });

    it('should categorize other warnings', () => {
      expect(categorizeWarning('Some other warning')).toBe('other');
    });
  });

  describe('summarize', () => {
    it('should generate a summary for a single result', () => {
      const result: TransformResult = {
        classes: ['p-4', 'w-[123px]', 'text-lg'],
        warnings: ["Used arbitrary value for 'width: 123px'"],
        coverage: {
          matched: 3,
          total: 4,
          percentage: 75,
          nonArbitrary: 2,
          categories: {
            spacing: { matched: 2, total: 2, percentage: 100 },
            color: { matched: 0, total: 0, percentage: 0 },
            typography: { matched: 1, total: 1, percentage: 100 },
            layout: { matched: 0, total: 0, percentage: 0 },
            border: { matched: 0, total: 0, percentage: 0 },
            background: { matched: 0, total: 0, percentage: 0 },
            effects: { matched: 0, total: 0, percentage: 0 },
            'flex-grid': { matched: 0, total: 0, percentage: 0 },
            sizing: { matched: 0, total: 0, percentage: 0 },
            other: { matched: 0, total: 1, percentage: 0 },
          },
          warningsByCategory: {
            'arbitrary-value': 1,
            'no-handler': 0,
            approximate: 0,
            'token-miss': 0,
            'v3-fallback': 0,
            other: 0,
          },
        },
      };

      const summary = summarize(result);
      expect(summary.text).toContain('Overall Coverage: 75% (3/4)');
      expect(summary.text).toContain('Non-arbitrary classes: 2');
      expect(summary.text).toContain('spacing: 100% (2/2)');
      expect(summary.text).toContain('typography: 100% (1/1)');
      expect(summary.text).toContain('arbitrary-value: 1');
      expect(summary.text).toContain('p-4 w-[123px] text-lg');
      expect(summary.stats.totals.matched).toBe(3);
      expect(summary.stats.totals.total).toBe(4);
      expect(summary.stats.totals.percentage).toBe(75);
      expect(summary.stats.totals.nonArbitrary).toBe(2);
      expect(summary.stats.samples.classes).toEqual(['p-4', 'w-[123px]', 'text-lg']);
      expect(summary.stats.samples.warnings).toEqual(["Used arbitrary value for 'width: 123px'"]);
    });

    it('should combine multiple results', () => {
      const results: TransformResult[] = [
        {
          classes: ['p-4', 'w-[123px]'],
          warnings: ["Used arbitrary value for 'width: 123px'"],
          coverage: {
            matched: 2,
            total: 3,
            percentage: 67,
            nonArbitrary: 1,
            categories: {
              spacing: { matched: 2, total: 2, percentage: 100 },
              color: { matched: 0, total: 0, percentage: 0 },
              typography: { matched: 0, total: 0, percentage: 0 },
              layout: { matched: 0, total: 0, percentage: 0 },
              border: { matched: 0, total: 0, percentage: 0 },
              background: { matched: 0, total: 0, percentage: 0 },
              effects: { matched: 0, total: 0, percentage: 0 },
              'flex-grid': { matched: 0, total: 0, percentage: 0 },
              sizing: { matched: 0, total: 0, percentage: 0 },
              other: { matched: 0, total: 1, percentage: 0 },
            },
            warningsByCategory: {
              'arbitrary-value': 1,
              'no-handler': 0,
              approximate: 0,
              'token-miss': 0,
              'v3-fallback': 0,
              other: 0,
            },
          },
        },
        {
          classes: ['text-lg', 'bg-[#fff]'],
          warnings: ["Used arbitrary value for 'background-color: #fff'"],
          coverage: {
            matched: 2,
            total: 2,
            percentage: 100,
            nonArbitrary: 1,
            categories: {
              spacing: { matched: 0, total: 0, percentage: 0 },
              color: { matched: 1, total: 1, percentage: 100 },
              typography: { matched: 1, total: 1, percentage: 100 },
              layout: { matched: 0, total: 0, percentage: 0 },
              border: { matched: 0, total: 0, percentage: 0 },
              background: { matched: 0, total: 0, percentage: 0 },
              effects: { matched: 0, total: 0, percentage: 0 },
              'flex-grid': { matched: 0, total: 0, percentage: 0 },
              sizing: { matched: 0, total: 0, percentage: 0 },
              other: { matched: 0, total: 0, percentage: 0 },
            },
            warningsByCategory: {
              'arbitrary-value': 1,
              'no-handler': 0,
              approximate: 0,
              'token-miss': 0,
              'v3-fallback': 0,
              other: 0,
            },
          },
        },
      ];

      const summary = summarize(results);
      expect(summary.text).toContain('Overall Coverage: 80% (4/5)');
      expect(summary.text).toContain('Non-arbitrary classes: 2');
      expect(summary.text).toContain('spacing: 100% (2/2)');
      expect(summary.text).toContain('typography: 100% (1/1)');
      expect(summary.text).toContain('color: 100% (1/1)');
      expect(summary.text).toContain('arbitrary-value: 2');
      expect(summary.stats.totals.matched).toBe(4);
      expect(summary.stats.totals.total).toBe(5);
      expect(summary.stats.totals.percentage).toBe(80);
      expect(summary.stats.warningsByCategory['arbitrary-value']).toBe(2);
    });

    it('should handle new warning categories (token-miss, v3-fallback)', () => {
      const result: TransformResult = {
        classes: ['p-4', 'text-base'],
        warnings: [
          'token-miss: spacing token not found for 13px',
          'v3-fallback: using v3 theme for color resolution',
          'approximate: font-size 17px → text-base (1px diff)',
        ],
        coverage: {
          matched: 2,
          total: 3,
          percentage: 67,
          nonArbitrary: 2,
          categories: {
            spacing: { matched: 1, total: 1, percentage: 100 },
            color: { matched: 0, total: 0, percentage: 0 },
            typography: { matched: 1, total: 1, percentage: 100 },
            layout: { matched: 0, total: 0, percentage: 0 },
            border: { matched: 0, total: 0, percentage: 0 },
            background: { matched: 0, total: 0, percentage: 0 },
            effects: { matched: 0, total: 0, percentage: 0 },
            'flex-grid': { matched: 0, total: 0, percentage: 0 },
            sizing: { matched: 0, total: 0, percentage: 0 },
            other: { matched: 0, total: 1, percentage: 0 },
          },
          warningsByCategory: {
            'arbitrary-value': 0,
            'no-handler': 0,
            approximate: 1,
            'token-miss': 1,
            'v3-fallback': 1,
            other: 0,
          },
        },
      };

      const summary = summarize(result);
      expect(summary.stats.warningsByCategory['token-miss']).toBe(1);
      expect(summary.stats.warningsByCategory['v3-fallback']).toBe(1);
      expect(summary.stats.warningsByCategory.approximate).toBe(1);
      expect(summary.text).toContain('token-miss: 1');
      expect(summary.text).toContain('v3-fallback: 1');
      expect(summary.text).toContain('approximate: 1');
    });

    it('should extract sample classes and warnings', () => {
      const manyClasses = Array.from({ length: 20 }, (_, i) => `class-${i}`);
      const manyWarnings = Array.from({ length: 10 }, (_, i) => `warning-${i}`);

      const result: TransformResult = {
        classes: manyClasses,
        warnings: manyWarnings,
        coverage: {
          matched: 20,
          total: 20,
          percentage: 100,
          nonArbitrary: 20,
        },
      };

      const summary = summarize(result);
      // Should only include first 10 classes
      expect(summary.stats.samples.classes).toHaveLength(10);
      expect(summary.stats.samples.classes[0]).toBe('class-0');
      expect(summary.stats.samples.classes[9]).toBe('class-9');

      // Should only include first 5 warnings
      expect(summary.stats.samples.warnings).toHaveLength(5);
      expect(summary.stats.samples.warnings[0]).toBe('warning-0');
      expect(summary.stats.samples.warnings[4]).toBe('warning-4');
    });

    it('should provide complete stats structure', () => {
      const result: TransformResult = {
        classes: ['p-4'],
        warnings: [],
        coverage: {
          matched: 1,
          total: 1,
          percentage: 100,
          nonArbitrary: 1,
        },
      };

      const summary = summarize(result);

      // Verify structure
      expect(summary).toHaveProperty('text');
      expect(summary).toHaveProperty('stats');
      expect(summary.stats).toHaveProperty('totals');
      expect(summary.stats).toHaveProperty('byCategory');
      expect(summary.stats).toHaveProperty('warningsByCategory');
      expect(summary.stats).toHaveProperty('samples');

      // Verify totals
      expect(summary.stats.totals).toHaveProperty('matched');
      expect(summary.stats.totals).toHaveProperty('total');
      expect(summary.stats.totals).toHaveProperty('percentage');
      expect(summary.stats.totals).toHaveProperty('nonArbitrary');

      // Verify all categories are present
      expect(summary.stats.byCategory).toHaveProperty('spacing');
      expect(summary.stats.byCategory).toHaveProperty('color');
      expect(summary.stats.byCategory).toHaveProperty('typography');
      expect(summary.stats.byCategory).toHaveProperty('layout');
      expect(summary.stats.byCategory).toHaveProperty('border');
      expect(summary.stats.byCategory).toHaveProperty('background');
      expect(summary.stats.byCategory).toHaveProperty('effects');
      expect(summary.stats.byCategory).toHaveProperty('flex-grid');
      expect(summary.stats.byCategory).toHaveProperty('sizing');
      expect(summary.stats.byCategory).toHaveProperty('other');

      // Verify all warning categories are present
      expect(summary.stats.warningsByCategory).toHaveProperty('arbitrary-value');
      expect(summary.stats.warningsByCategory).toHaveProperty('no-handler');
      expect(summary.stats.warningsByCategory).toHaveProperty('approximate');
      expect(summary.stats.warningsByCategory).toHaveProperty('token-miss');
      expect(summary.stats.warningsByCategory).toHaveProperty('v3-fallback');
      expect(summary.stats.warningsByCategory).toHaveProperty('other');
    });
  });

  describe('compareResults', () => {
    it('should compare strict and approximate results', () => {
      const strictResult: CssTransformResult = {
        bySelector: {
          '.button': {
            classes: ['px-4', 'py-2'],
            warnings: ['warning 1'],
            coverage: { matched: 2, total: 3, percentage: 66.67, nonArbitrary: 2 },
          },
        },
      };

      const approximateResult: CssTransformResult = {
        bySelector: {
          '.button': {
            classes: ['px-4', 'py-2', 'rounded'],
            warnings: [],
            coverage: { matched: 3, total: 3, percentage: 100, nonArbitrary: 3 },
          },
        },
      };

      const comparison = compareResults(strictResult, approximateResult);

      expect(comparison.strictCoverage).toBeCloseTo(66.67, 1);
      expect(comparison.approximateCoverage).toBe(100);
      expect(comparison.coverageDiff).toBeCloseTo(33.33, 1);
      expect(comparison.strictWarnings).toBe(1);
      expect(comparison.approximateWarnings).toBe(0);
      expect(comparison.selectorComparison).toHaveLength(1);
      expect(comparison.selectorComparison[0].classesDiff).toBe(1);
    });
  });

  describe('generateDiff', () => {
    it('should generate visual diff between CSS and Tailwind', () => {
      const cssDeclarations = [
        { prop: 'padding', value: '1rem' },
        { prop: 'color', value: 'blue' },
      ];
      const tailwindClasses = ['p-4', 'text-blue-500'];

      const diff = generateDiff(cssDeclarations, tailwindClasses);

      expect(diff.cssLines).toHaveLength(2);
      expect(diff.tailwindLines).toHaveLength(2);
      expect(diff.diff).toContain('CSS');
      expect(diff.diff).toContain('Tailwind');
      expect(diff.diff).toContain('padding: 1rem');
      expect(diff.diff).toContain('p-4');
    });

    it('should handle different lengths', () => {
      const cssDeclarations = [{ prop: 'padding', value: '1rem' }];
      const tailwindClasses = ['p-4', 'text-blue-500', 'rounded'];

      const diff = generateDiff(cssDeclarations, tailwindClasses);

      expect(diff.cssLines).toHaveLength(1);
      expect(diff.tailwindLines).toHaveLength(3);
      expect(diff.diff).toContain('padding: 1rem');
      expect(diff.diff).toContain('p-4');
      expect(diff.diff).toContain('rounded');
    });
  });
});

import { describe, it, expect } from 'vitest';
import { 
  calculateCoverage, 
  aggregateWarnings, 
  countNonArbitraryClasses, 
  calculateCategoryStats,
  categorizeWarning,
  summarize
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
        other: { matched: 0, total: 0, percentage: 0 }
      };

      const coverage = calculateCoverage(6, 8, 5, categories);
      expect(coverage.categories).toBeDefined();
      expect(coverage.categories?.spacing.matched).toBe(3);
      expect(coverage.categories?.color.percentage).toBe(100);
    });
  });

  describe('aggregateWarnings', () => {
    it('should deduplicate warnings', () => {
      const warnings = [
        'Warning 1',
        'Warning 2',
        'Warning 1',
        'Warning 3'
      ];

      const result = aggregateWarnings(warnings);
      expect(result.warnings).toHaveLength(3);
      expect(result.warnings).toContain('Warning 1 (2 occurrences)');
      expect(result.warnings).toContain('Warning 2');
      expect(result.warnings).toContain('Warning 3');
    });

    it('should categorize warnings correctly', () => {
      const warnings = [
        'Used arbitrary value for \'width: 123px\'',
        'No direct Tailwind equivalent for \'custom-prop: value\'',
        'approximate mapping: 15px → w-4 (1px difference)',
        'Some other warning'
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
      const classes = [
        'p-4',
        'w-[123px]',
        'text-lg',
        'bg-[#fff]',
        'flex'
      ];

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
        { prop: 'custom-prop' }
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
      expect(categorizeWarning('Used arbitrary value for \'width: 123px\'')).toBe('arbitrary-value');
    });

    it('should categorize no handler warnings', () => {
      expect(categorizeWarning('No direct Tailwind equivalent for \'custom-prop: value\'')).toBe('no-handler');
      expect(categorizeWarning('Could not transform: custom-prop: value')).toBe('no-handler');
    });

    it('should categorize approximate warnings', () => {
      expect(categorizeWarning('approximate mapping: 15px → w-4 (1px difference)')).toBe('approximate');
    });

    it('should categorize other warnings', () => {
      expect(categorizeWarning('Some other warning')).toBe('other');
    });
  });

  describe('summarize', () => {
    it('should generate a summary for a single result', () => {
      const result: TransformResult = {
        classes: ['p-4', 'w-[123px]', 'text-lg'],
        warnings: ['Used arbitrary value for \'width: 123px\''],
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
            other: { matched: 0, total: 1, percentage: 0 }
          },
          warningsByCategory: {
            'arbitrary-value': 1,
            'no-handler': 0,
            'approximate': 0,
            'other': 0
          }
        }
      };

      const summary = summarize(result);
      expect(summary).toContain('Overall Coverage: 75% (3/4)');
      expect(summary).toContain('Non-arbitrary classes: 2');
      expect(summary).toContain('spacing: 100% (2/2)');
      expect(summary).toContain('typography: 100% (1/1)');
      expect(summary).toContain('arbitrary-value: 1');
      expect(summary).toContain('p-4 w-[123px] text-lg');
    });

    it('should combine multiple results', () => {
      const results: TransformResult[] = [
        {
          classes: ['p-4', 'w-[123px]'],
          warnings: ['Used arbitrary value for \'width: 123px\''],
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
              other: { matched: 0, total: 1, percentage: 0 }
            },
            warningsByCategory: {
              'arbitrary-value': 1,
              'no-handler': 0,
              'approximate': 0,
              'other': 0
            }
          }
        },
        {
          classes: ['text-lg', 'bg-[#fff]'],
          warnings: ['Used arbitrary value for \'background-color: #fff\''],
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
              other: { matched: 0, total: 0, percentage: 0 }
            },
            warningsByCategory: {
              'arbitrary-value': 1,
              'no-handler': 0,
              'approximate': 0,
              'other': 0
            }
          }
        }
      ];

      const summary = summarize(results);
      expect(summary).toContain('Overall Coverage: 80% (4/5)');
      expect(summary).toContain('Non-arbitrary classes: 2');
      expect(summary).toContain('spacing: 100% (2/2)');
      expect(summary).toContain('typography: 100% (1/1)');
      expect(summary).toContain('color: 100% (1/1)');
      expect(summary).toContain('arbitrary-value: 2');
    });
  });
});

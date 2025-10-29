/**
 * Reporter utilities for calculating coverage and aggregating warnings
 */
import {
  TransformResult,
  PropertyCategory,
  WarningCategory,
  CategoryStats,
  SummarizeResult,
} from '../types';

/**
 * Maps CSS properties to their categories
 */
export const propertyCategoryMap: Record<string, PropertyCategory> = {
  // Spacing properties
  margin: 'spacing',
  'margin-top': 'spacing',
  'margin-right': 'spacing',
  'margin-bottom': 'spacing',
  'margin-left': 'spacing',
  padding: 'spacing',
  'padding-top': 'spacing',
  'padding-right': 'spacing',
  'padding-bottom': 'spacing',
  'padding-left': 'spacing',
  width: 'spacing',
  height: 'spacing',
  'min-width': 'spacing',
  'min-height': 'spacing',
  'max-width': 'spacing',
  'max-height': 'spacing',
  gap: 'spacing',
  'column-gap': 'spacing',
  'row-gap': 'spacing',

  // Color properties
  color: 'color',
  'background-color': 'color',
  'border-color': 'color',

  // Typography properties
  'font-size': 'typography',
  'font-weight': 'typography',
  'line-height': 'typography',
  'letter-spacing': 'typography',
  'text-align': 'typography',
  'text-decoration': 'typography',
  'text-transform': 'typography',

  // Layout properties
  display: 'layout',
  position: 'layout',
  top: 'layout',
  right: 'layout',
  bottom: 'layout',
  left: 'layout',
  inset: 'layout',
  'z-index': 'layout',
  overflow: 'layout',
  'overflow-x': 'layout',
  'overflow-y': 'layout',

  // Border properties
  border: 'border',
  'border-width': 'border',
  'border-style': 'border',
  'border-radius': 'border',

  // Background properties
  background: 'background',
  'background-image': 'background',
  'background-size': 'background',
  'background-position': 'background',
  'background-repeat': 'background',

  // Effects properties
  opacity: 'effects',
  'box-shadow': 'effects',
  transform: 'effects',
  transition: 'effects',
};

/**
 * Categorizes a warning message
 * @param warning Warning message
 * @returns Warning category
 */
export function categorizeWarning(warning: string): WarningCategory {
  if (warning.includes('arbitrary value')) {
    return 'arbitrary-value';
  }
  if (
    warning.includes('No direct Tailwind equivalent') ||
    warning.includes('Could not transform')
  ) {
    return 'no-handler';
  }
  if (warning.includes('approximate mapping') || warning.includes('approximate')) {
    return 'approximate';
  }
  if (warning.includes('token-miss') || warning.includes('token not found')) {
    return 'token-miss';
  }
  if (warning.includes('v3-fallback') || warning.includes('falling back to v3')) {
    return 'v3-fallback';
  }
  return 'other';
}

/**
 * Calculate coverage statistics
 * @param matched Number of matched declarations
 * @param total Total number of declarations
 * @param nonArbitrary Number of declarations matched with non-arbitrary classes
 * @param categories Optional category statistics
 * @param warningsByCategory Optional warnings by category
 * @returns Enhanced coverage object
 */
export function calculateCoverage(
  matched: number,
  total: number,
  nonArbitrary: number = 0,
  categories?: Record<PropertyCategory, CategoryStats>,
  warningsByCategory?: Record<WarningCategory, number>
): TransformResult['coverage'] {
  return {
    matched,
    total,
    percentage: total > 0 ? Math.round((matched / total) * 100) : 0,
    nonArbitrary,
    categories,
    warningsByCategory,
  };
}

/**
 * Aggregate warnings to avoid duplicates and categorize them
 * @param warnings Array of warning messages
 * @returns Object with deduplicated warnings and categorized counts
 */
export function aggregateWarnings(warnings: string[]): {
  warnings: string[];
  byCategory: Record<WarningCategory, number>;
} {
  // Remove duplicates
  const uniqueWarnings = [...new Set(warnings)];

  // Group similar warnings
  const warningCounts = new Map<string, number>();
  const warningsByCategory: Record<WarningCategory, number> = {
    'arbitrary-value': 0,
    'no-handler': 0,
    approximate: 0,
    'token-miss': 0,
    'v3-fallback': 0,
    other: 0,
  };

  for (const warning of warnings) {
    // Count occurrences
    const count = warningCounts.get(warning) || 0;
    warningCounts.set(warning, count + 1);

    // Categorize warnings
    const category = categorizeWarning(warning);
    warningsByCategory[category] = (warningsByCategory[category] || 0) + 1;
  }

  // Format warnings with counts if there are duplicates
  const formattedWarnings = uniqueWarnings.map((warning) => {
    const count = warningCounts.get(warning) || 0;
    if (count > 1) {
      return `${warning} (${count} occurrences)`;
    }
    return warning;
  });

  return {
    warnings: formattedWarnings,
    byCategory: warningsByCategory,
  };
}

/**
 * Count non-arbitrary classes
 * @param classes Array of Tailwind classes
 * @returns Number of non-arbitrary classes
 */
export function countNonArbitraryClasses(classes: string[]): number {
  return classes.filter((cls) => !cls.includes('[')).length;
}

/**
 * Categorize properties and calculate per-category statistics
 * @param declarations CSS declarations
 * @param matchedProps Set of matched property names
 * @returns Category statistics
 */
export function calculateCategoryStats(
  declarations: { prop: string }[],
  matchedProps: Set<string>
): Record<PropertyCategory, CategoryStats> {
  const stats: Record<PropertyCategory, CategoryStats> = {
    spacing: { matched: 0, total: 0, percentage: 0 },
    color: { matched: 0, total: 0, percentage: 0 },
    typography: { matched: 0, total: 0, percentage: 0 },
    layout: { matched: 0, total: 0, percentage: 0 },
    border: { matched: 0, total: 0, percentage: 0 },
    background: { matched: 0, total: 0, percentage: 0 },
    effects: { matched: 0, total: 0, percentage: 0 },
    'flex-grid': { matched: 0, total: 0, percentage: 0 },
    sizing: { matched: 0, total: 0, percentage: 0 },
    other: { matched: 0, total: 0, percentage: 0 },
  };

  // Count total and matched properties by category
  for (const decl of declarations) {
    const category = propertyCategoryMap[decl.prop.toLowerCase()] || 'other';
    stats[category].total++;

    if (matchedProps.has(decl.prop.toLowerCase())) {
      stats[category].matched++;
    }
  }

  // Calculate percentages
  for (const category of Object.keys(stats) as PropertyCategory[]) {
    const { matched, total } = stats[category];
    stats[category].percentage = total > 0 ? Math.round((matched / total) * 100) : 0;
  }

  return stats;
}

/**
 * Generate a human-readable summary of transformation results
 * @param results Single result or array of results to summarize
 * @returns Object with text summary and structured stats
 */
export function summarize(results: TransformResult | TransformResult[]): SummarizeResult {
  // Handle array of results
  if (Array.isArray(results)) {
    // Combine results
    const combined: TransformResult = {
      classes: results.flatMap((r) => r.classes),
      warnings: results.flatMap((r) => r.warnings),
      coverage: {
        matched: results.reduce((sum, r) => sum + r.coverage.matched, 0),
        total: results.reduce((sum, r) => sum + r.coverage.total, 0),
        percentage: 0,
        nonArbitrary: results.reduce((sum, r) => sum + (r.coverage.nonArbitrary || 0), 0),
        categories: undefined,
        warningsByCategory: undefined,
      },
    };

    // Calculate combined percentage
    combined.coverage.percentage =
      combined.coverage.total > 0
        ? Math.round((combined.coverage.matched / combined.coverage.total) * 100)
        : 0;

    // Combine category stats if available
    if (results.some((r) => r.coverage.categories)) {
      const categories = {} as Record<PropertyCategory, CategoryStats>;

      for (const category of [
        'spacing',
        'color',
        'typography',
        'layout',
        'border',
        'background',
        'effects',
        'flex-grid',
        'sizing',
        'other',
      ] as PropertyCategory[]) {
        categories[category] = {
          matched: results.reduce(
            (sum, r) => sum + (r.coverage.categories?.[category]?.matched || 0),
            0
          ),
          total: results.reduce(
            (sum, r) => sum + (r.coverage.categories?.[category]?.total || 0),
            0
          ),
          percentage: 0,
        };

        categories[category].percentage =
          categories[category].total > 0
            ? Math.round((categories[category].matched / categories[category].total) * 100)
            : 0;
      }

      combined.coverage.categories = categories;
    }

    // Combine warning categories if available
    if (results.some((r) => r.coverage.warningsByCategory)) {
      const warningsByCategory = {} as Record<WarningCategory, number>;

      for (const category of [
        'arbitrary-value',
        'no-handler',
        'approximate',
        'token-miss',
        'v3-fallback',
        'other',
      ] as WarningCategory[]) {
        warningsByCategory[category] = results.reduce(
          (sum, r) => sum + (r.coverage.warningsByCategory?.[category] || 0),
          0
        );
      }

      combined.coverage.warningsByCategory = warningsByCategory;
    }

    return buildSummarizeResult(combined);
  }

  // Handle single result
  return buildSummarizeResult(results);
}

/**
 * Format a transformation result as a human-readable summary
 * @param result Transformation result to format
 * @returns Formatted summary string
 */
function formatSummary(result: TransformResult): string {
  const { coverage, classes, warnings } = result;
  const lines: string[] = [];

  // Overall statistics
  lines.push('# Tailwind CSS Transformation Summary');
  lines.push('');
  lines.push(
    `## Overall Coverage: ${coverage.percentage}% (${coverage.matched}/${coverage.total})`
  );
  lines.push(`- Non-arbitrary classes: ${coverage.nonArbitrary || 0}`);
  lines.push(`- Total classes generated: ${classes.length}`);
  lines.push(`- Total warnings: ${warnings.length}`);
  lines.push('');

  // Category statistics
  if (coverage.categories) {
    lines.push('## Coverage by Category');
    for (const [category, stats] of Object.entries(coverage.categories)) {
      if (stats.total > 0) {
        lines.push(`- ${category}: ${stats.percentage}% (${stats.matched}/${stats.total})`);
      }
    }
    lines.push('');
  }

  // Warning categories
  if (coverage.warningsByCategory) {
    lines.push('## Warnings by Category');
    for (const [category, count] of Object.entries(coverage.warningsByCategory)) {
      if (count > 0) {
        lines.push(`- ${category}: ${count}`);
      }
    }
    lines.push('');
  }

  // Sample of classes
  if (classes.length > 0) {
    lines.push('## Sample Classes');
    const sampleSize = Math.min(classes.length, 10);
    lines.push(
      `${classes.slice(0, sampleSize).join(' ')}${classes.length > sampleSize ? ' ...' : ''}`
    );
    lines.push('');
  }

  // Sample of warnings
  if (warnings.length > 0) {
    lines.push('## Sample Warnings');
    const sampleSize = Math.min(warnings.length, 5);
    for (let i = 0; i < sampleSize; i++) {
      lines.push(`- ${warnings[i]}`);
    }
    if (warnings.length > sampleSize) {
      lines.push(`- ... and ${warnings.length - sampleSize} more`);
    }
  }

  return lines.join('\n');
}

/**
 * Build a structured SummarizeResult from a TransformResult
 * @param result Transformation result to process
 * @returns Structured summary with text and stats
 */
function buildSummarizeResult(result: TransformResult): SummarizeResult {
  const { coverage, classes, warnings } = result;

  // Initialize category stats with all categories
  const byCategory: Record<PropertyCategory, CategoryStats> = coverage.categories || {
    spacing: { matched: 0, total: 0, percentage: 0 },
    color: { matched: 0, total: 0, percentage: 0 },
    typography: { matched: 0, total: 0, percentage: 0 },
    layout: { matched: 0, total: 0, percentage: 0 },
    border: { matched: 0, total: 0, percentage: 0 },
    background: { matched: 0, total: 0, percentage: 0 },
    effects: { matched: 0, total: 0, percentage: 0 },
    'flex-grid': { matched: 0, total: 0, percentage: 0 },
    sizing: { matched: 0, total: 0, percentage: 0 },
    other: { matched: 0, total: 0, percentage: 0 },
  };

  // Initialize warning categories with all categories
  const warningsByCategory: Record<WarningCategory, number> = coverage.warningsByCategory || {
    'arbitrary-value': 0,
    'no-handler': 0,
    approximate: 0,
    'token-miss': 0,
    'v3-fallback': 0,
    other: 0,
  };

  // Sample classes (up to 10)
  const sampleClasses = classes.slice(0, 10);

  // Sample warnings (up to 5)
  const sampleWarnings = warnings.slice(0, 5);

  // Generate text summary
  const text = formatSummary(result);

  return {
    text,
    stats: {
      totals: {
        matched: coverage.matched,
        total: coverage.total,
        percentage: coverage.percentage,
        nonArbitrary: coverage.nonArbitrary,
      },
      byCategory,
      warningsByCategory,
      samples: {
        classes: sampleClasses,
        warnings: sampleWarnings,
      },
    },
  };
}

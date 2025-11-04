/**
 * High-level CSS transformation functions
 */
import { parseCssRules } from '../parsers/cssRules';
import { transformRule } from './rulesEngine';
import { MatchCtx, TransformResult, CategoryStats } from '../types';

/**
 * Merge two TransformResult objects
 */
function mergeResults(existing: TransformResult, newResult: TransformResult): TransformResult {
  const mergeCategory = (cat1: CategoryStats, cat2: CategoryStats): CategoryStats => ({
    matched: cat1.matched + cat2.matched,
    total: cat1.total + cat2.total,
    percentage: ((cat1.matched + cat2.matched) / (cat1.total + cat2.total || 1)) * 100,
  });

  return {
    classes: [...existing.classes, ...newResult.classes],
    warnings: [...existing.warnings, ...newResult.warnings],
    coverage: {
      matched: existing.coverage.matched + newResult.coverage.matched,
      total: existing.coverage.total + newResult.coverage.total,
      percentage:
        ((existing.coverage.matched + newResult.coverage.matched) /
          (existing.coverage.total + newResult.coverage.total)) *
        100,
      nonArbitrary: existing.coverage.nonArbitrary + newResult.coverage.nonArbitrary,
      categories:
        existing.coverage.categories && newResult.coverage.categories
          ? {
              spacing: mergeCategory(
                existing.coverage.categories.spacing,
                newResult.coverage.categories.spacing
              ),
              color: mergeCategory(
                existing.coverage.categories.color,
                newResult.coverage.categories.color
              ),
              typography: mergeCategory(
                existing.coverage.categories.typography,
                newResult.coverage.categories.typography
              ),
              layout: mergeCategory(
                existing.coverage.categories.layout,
                newResult.coverage.categories.layout
              ),
              border: mergeCategory(
                existing.coverage.categories.border,
                newResult.coverage.categories.border
              ),
              background: mergeCategory(
                existing.coverage.categories.background,
                newResult.coverage.categories.background
              ),
              effects: mergeCategory(
                existing.coverage.categories.effects,
                newResult.coverage.categories.effects
              ),
              'flex-grid': mergeCategory(
                existing.coverage.categories['flex-grid'],
                newResult.coverage.categories['flex-grid']
              ),
              sizing: mergeCategory(
                existing.coverage.categories.sizing,
                newResult.coverage.categories.sizing
              ),
              other: mergeCategory(
                existing.coverage.categories.other,
                newResult.coverage.categories.other
              ),
            }
          : existing.coverage.categories || newResult.coverage.categories,
    },
  };
}

/**
 * Transform a complete CSS text into Tailwind classes, organized by selector
 *
 * @param css - The CSS text to transform
 * @param ctx - The matching context with theme and options
 * @returns An object with transformation results by selector
 */
export function transformCssText(
  css: string,
  ctx: MatchCtx
): {
  bySelector: Record<string, TransformResult>;
} {
  // Parse the CSS text into rules
  const rules = parseCssRules(css);

  // Transform each rule and organize by selector
  const bySelector: Record<string, TransformResult> = {};

  for (const rule of rules) {
    const result = transformRule(rule, ctx);

    // If selector already exists, merge the results
    if (bySelector[rule.selector]) {
      bySelector[rule.selector] = mergeResults(bySelector[rule.selector], result);
    } else {
      bySelector[rule.selector] = result;
    }
  }

  return { bySelector };
}

/**
 * Rules engine for transforming CSS to Tailwind classes
 */
import { CssDeclaration, CssRule, MatchCtx, TransformResult } from '../types';
import { calculateCoverage, aggregateWarnings } from './reporter';

/**
 * Convert a CSS property and value to Tailwind classes
 * @param prop CSS property
 * @param value CSS value
 * @param ctx Matching context
 * @returns Array of Tailwind classes
 */
export function toTailwind(prop: string, value: string, ctx: MatchCtx): string[] {
  // This is a placeholder implementation
  // In a real implementation, this would match CSS properties to Tailwind classes using ctx
  // For now, we're just using a simple fallback
  
  // Suppress unused parameter warning
  void ctx;
  
  // Fallback: return the property and value as a custom property
  return [`${prop}:${value}`];
}

/**
 * Transform a CSS rule to Tailwind classes
 * @param rule CSS rule to transform
 * @param ctx Matching context
 * @returns Transform result with classes, warnings, and coverage
 */
export function transformRule(rule: CssRule, ctx: MatchCtx): TransformResult {
  // Transform the declarations within the rule
  const result = transformDeclarations(rule.declarations, ctx);
  
  // Add selector information to the result if needed
  if (rule.selector !== '*' && rule.selector !== '') {
    result.warnings.push(`Selector '${rule.selector}' was converted but may need manual adjustment`);
  }
  
  return result;
}

/**
 * Transform CSS declarations to Tailwind classes
 * @param decls CSS declarations to transform
 * @param ctx Matching context
 * @returns Transform result with classes, warnings, and coverage
 */
export function transformDeclarations(decls: CssDeclaration[], ctx: MatchCtx): TransformResult {
  const classes: string[] = [];
  const warnings: string[] = [];
  let matched = 0;
  const total = decls.length;
  
  // Process each declaration
  for (const decl of decls) {
    const tailwindClasses = toTailwind(decl.prop, decl.value, ctx);
    
    if (tailwindClasses.length > 0) {
      classes.push(...tailwindClasses);
      matched++;
    } else {
      warnings.push(`Could not transform: ${decl.prop}: ${decl.value}`);
    }
  }
  
  // Calculate coverage and aggregate warnings
  const coverage = calculateCoverage(matched, total);
  const aggregatedWarnings = aggregateWarnings(warnings);
  
  return {
    classes,
    warnings: aggregatedWarnings,
    coverage
  };
}

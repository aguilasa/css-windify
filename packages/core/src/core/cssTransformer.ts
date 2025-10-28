/**
 * High-level CSS transformation functions
 */
import { parseCssRules } from '../parsers/cssRules';
import { transformRule } from './rulesEngine';
import { MatchCtx, TransformResult } from '../types';

/**
 * Transform a complete CSS text into Tailwind classes, organized by selector
 * 
 * @param css - The CSS text to transform
 * @param ctx - The matching context with theme and options
 * @returns An object with transformation results by selector
 */
export function transformCssText(css: string, ctx: MatchCtx): { 
  bySelector: Record<string, TransformResult>;
} {
  // Parse the CSS text into rules
  const rules = parseCssRules(css);
  
  // Transform each rule and organize by selector
  const bySelector: Record<string, TransformResult> = {};
  
  for (const rule of rules) {
    const result = transformRule(rule, ctx);
    bySelector[rule.selector] = result;
  }
  
  return { bySelector };
}

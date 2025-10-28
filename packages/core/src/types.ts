/**
 * Type definitions for Tailwindify
 */

export interface TailwindifyOptions {
  prefix?: string;
  strict?: boolean;
  approximate?: boolean;
}

export interface CssDeclaration {
  prop: string;
  value: string;
  variants?: string[];
}

export interface CssRule {
  selector: string;
  declarations: CssDeclaration[];
}

export type PropertyCategory =
  | 'spacing'
  | 'color'
  | 'typography'
  | 'layout'
  | 'border'
  | 'background'
  | 'effects'
  | 'other';

export type WarningCategory = 'arbitrary-value' | 'no-handler' | 'approximate' | 'other';

export interface CategoryStats {
  matched: number;
  total: number;
  percentage: number;
}

export interface TransformResult {
  classes: string[];
  warnings: string[];
  coverage: {
    matched: number;
    total: number;
    percentage: number;
    nonArbitrary: number;
    categories?: Record<PropertyCategory, CategoryStats>;
    warningsByCategory?: Record<WarningCategory, number>;
  };
}

export interface MatchCtx {
  theme: any;
  opts: {
    strict: boolean;
    approximate: boolean;
  };
}

export type RuleHandler = (
  value: string,
  ctx: MatchCtx
) => string[] | { classes: string[]; warnings: string[] } | null;

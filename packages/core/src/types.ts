/**
 * Type definitions for Tailwindify
 */

export interface ApproximationThresholds {
  spacingPx?: number;
  fontPx?: number;
  radiiPx?: number;
}

export interface TailwindifyOptions {
  prefix?: string; // Tailwind class prefix (if any)
  strict?: boolean;
  approximate?: boolean;
  thresholds?: ApproximationThresholds;
  version?: 'auto' | 'v3' | 'v4';
  screens?: Record<string, number>; // override or provide when not found
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

export type WarningCategory =
  | 'arbitrary-value'
  | 'no-handler'
  | 'approximate'
  | 'token-miss'
  | 'v3-fallback'
  | 'other';

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

export interface ThemeTokens {
  spacing: Record<string, string>; // '4': '1rem'
  colors: Record<string, string | Record<string, string>>;
  fontSize: Record<string, [string, object?]>;
  lineHeight: Record<string, string>;
  screens: Record<string, number>; // numeric px for convenience
  version: 'v3' | 'v4';
  source: 'config' | 'css-variables' | 'default';
}

export interface MatchCtx {
  theme?: any; // v3 config result
  tokens?: ThemeTokens; // v4 tokens or v3 projection
  version: 'v3' | 'v4';
  opts: {
    strict: boolean;
    approximate: boolean;
    thresholds: ApproximationThresholds;
    screens: Record<string, number>;
  };
}

export type RuleHandler = (
  value: string,
  ctx: MatchCtx
) => string[] | { classes: string[]; warnings: string[] } | null;

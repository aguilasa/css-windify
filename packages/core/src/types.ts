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
}

export interface CssRule {
  selector: string;
  declarations: CssDeclaration[];
}

export interface TransformResult {
  classes: string[];
  warnings: string[];
  coverage: {
    matched: number;
    total: number;
  };
}

export interface MatchCtx {
  theme: any;
  opts: {
    strict: boolean;
    approximate: boolean;
  };
}

export type RuleHandler = (value: string, ctx: MatchCtx) => string[] | null;

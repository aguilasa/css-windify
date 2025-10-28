/**
 * Tailwindify core functionality
 */
import { transformRule, transformDeclarations } from './core/rulesEngine';
import { TailwindifyOptions, CssRule, CssDeclaration, MatchCtx, TransformResult } from './types';

// Re-export types
export * from './types';

class Tailwindify {
  private options: TailwindifyOptions;

  constructor(options: TailwindifyOptions = {}) {
    this.options = {
      prefix: '',
      strict: true,
      approximate: false,
      ...options,
    };
  }

  /**
   * Convert a CSS rule to Tailwind classes
   */
  processRule(rule: CssRule): TransformResult {
    const ctx: MatchCtx = {
      theme: {}, // Theme would be loaded from Tailwind config
      opts: {
        strict: !!this.options.strict,
        approximate: !!this.options.approximate
      }
    };
    
    const result = transformRule(rule, ctx);
    
    // Apply prefix if specified
    if (this.options.prefix) {
      result.classes = result.classes.map(cls => `${this.options.prefix}${cls}`);
    }
    
    return result;
  }

  /**
   * Process a list of CSS declarations
   */
  processDeclarations(declarations: CssDeclaration[]): TransformResult {
    const ctx: MatchCtx = {
      theme: {}, // Theme would be loaded from Tailwind config
      opts: {
        strict: !!this.options.strict,
        approximate: !!this.options.approximate
      }
    };
    
    const result = transformDeclarations(declarations, ctx);
    
    // Apply prefix if specified
    if (this.options.prefix) {
      result.classes = result.classes.map(cls => `${this.options.prefix}${cls}`);
    }
    
    return result;
  }
}

// Export types and functions
export { toTailwind } from './core/rulesEngine';
export { transformRule, transformDeclarations };
export {
  normalizeValue,
  isPx,
  isRem,
  isEm,
  isPct,
  isNumber,
  toArbitrary,
  arbitraryProperty,
  parseBoxShorthand,
  parseColorNormalize
} from './core/normalizers';

export {
  loadTheme,
  defaultTheme,
  resolveSpacingToken,
  resolveColorToken,
  resolveFontSizeToken,
  resolveLineHeightToken
} from './core/themeLoader';

export {
  matchSpacing,
  matchTypography,
  matchDisplay,
  matchPosition,
  matchInset,
  matchInsetShorthand,
  displayMap,
  positionMap
} from './core/matchers';

// Export both named and default exports
export { Tailwindify };
export default Tailwindify;

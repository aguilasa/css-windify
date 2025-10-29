/**
 * Tailwindify core functionality
 */
import { transformRule, transformDeclarations } from './core/rulesEngine';
import { TailwindifyOptions, CssRule, CssDeclaration, MatchCtx, TransformResult } from './types';
import { loadTokens, detectTailwindVersion } from './core/tokensLoader';

// Re-export types
export * from './types';

class Tailwindify {
  private options: TailwindifyOptions;
  private tokensPromise: Promise<any> | null = null;

  constructor(options: TailwindifyOptions = {}) {
    this.options = {
      prefix: '',
      strict: true,
      approximate: false,
      version: 'auto',
      thresholds: {
        spacingPx: 2,
        fontPx: 1,
        radiiPx: 2,
      },
      ...options,
    };

    // Start loading tokens in the background
    this.preloadTokens();
  }

  /**
   * Preload tokens to improve performance for subsequent calls
   */
  private preloadTokens(): void {
    if (!this.tokensPromise) {
      this.tokensPromise = loadTokens();
    }
  }

  /**
   * Convert a CSS rule to Tailwind classes
   */
  async processRule(rule: CssRule): Promise<TransformResult> {
    const ctx = await this.createMatchContext();
    const result = transformRule(rule, ctx);

    // Apply prefix if specified
    if (this.options.prefix) {
      result.classes = result.classes.map((cls) => `${this.options.prefix}${cls}`);
    }

    return result;
  }

  /**
   * Create a match context with loaded tokens
   */
  private async createMatchContext(): Promise<MatchCtx> {
    // Ensure tokens are loaded
    if (!this.tokensPromise) {
      this.preloadTokens();
    }

    const tokens = await this.tokensPromise;
    const version =
      this.options.version === 'auto'
        ? detectTailwindVersion({ version: this.options.version })
        : this.options.version || 'v3';

    return {
      theme: tokens, // For backward compatibility
      tokens,
      version,
      opts: {
        strict: !!this.options.strict,
        approximate: !!this.options.approximate,
        thresholds: this.options.thresholds || {
          spacingPx: 2,
          fontPx: 1,
          radiiPx: 2,
        },
        screens: this.options.screens ||
          tokens.screens || {
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            '2xl': 1536,
          },
      },
    };
  }

  /**
   * Process a list of CSS declarations
   */
  async processDeclarations(declarations: CssDeclaration[]): Promise<TransformResult> {
    const ctx = await this.createMatchContext();
    const result = transformDeclarations(declarations, ctx);

    // Apply prefix if specified
    if (this.options.prefix) {
      result.classes = result.classes.map((cls) => `${this.options.prefix}${cls}`);
    }

    return result;
  }
}

// Export types and functions
export { toTailwind } from './core/rulesEngine';
export { transformRule, transformDeclarations };
export { summarize } from './core/reporter';
export { transformCssText } from './core/cssTransformer';
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
  parseColorNormalize,
} from './core/normalizers';

export { loadTheme, defaultTheme } from './core/themeLoader';

export { loadTokens, defaultTokens, detectTailwindVersion } from './core/tokensLoader';

export {
  resolveNearestTokenPx,
  resolveSpacingToken,
  resolveColorToken,
  resolveFontSizeToken,
  resolveLineHeightToken,
} from './core/resolvers';

export {
  matchSpacing,
  matchTypography,
  matchDisplay,
  matchPosition,
  matchInset,
  matchInsetShorthand,
  displayMap,
  positionMap,
  // Color matchers
  matchColor,
  // Border matchers
  matchBorderWidth,
  matchBorderColor,
  matchBorderRadius,
  parseBorderShorthand,
  matchBorderShorthand,
  // Background matchers
  matchBackgroundColor,
  matchBackgroundSize,
  matchBackgroundPosition,
  matchBackgroundImage,
  parseBackgroundShorthand,
  matchBackgroundShorthand,
  // Flexbox and Grid matchers
  matchFlexDirection,
  matchJustifyContent,
  matchAlignItems,
  matchGap,
  matchGridTemplateColumns,
  matchPlaceContent,
  matchPlaceItems,
  matchPlaceSelf,
  // Misc matchers
  matchOverflow,
  matchZIndex,
  matchOpacity,
} from './core/matchers';

// Variant utilities
export { withVariant, withVariants } from './core/variants';

// Parsers
export { parseInlineCss, parseCssRules } from './parsers';

// Export both named and default exports
export { Tailwindify };
export default Tailwindify;

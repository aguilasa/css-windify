/**
 * Token resolvers for Tailwind CSS v3 and v4
 * Handles both theme-based (v3) and token-based (v4) resolution
 *
 * @see SPEC.md → "Resolvers"
 * @see SPEC.md → "Spacing resolution"
 * @see SPEC.md → "Color resolution strategy"
 * @see SPEC.md → "Tailwind v4 Migration Plan" → "Resolvers in v4"
 */
import { MatchCtx } from '../types';
import { normalizeValue, parseColorNormalize, toPx } from './normalizers';

/**
 * Memoization cache for resolver functions
 */
const resolverCache = new Map<string, any>();

/**
 * Clear the resolver cache
 */
export function clearResolverCache(): void {
  resolverCache.clear();
}

/**
 * Get cache statistics
 */
export function getResolverCacheStats(): { size: number; hitRate?: number } {
  return {
    size: resolverCache.size,
  };
}

/**
 * Create a cache key from function name and arguments
 */
function createCacheKey(fnName: string, ...args: any[]): string {
  return `${fnName}:${JSON.stringify(args)}`;
}

/**
 * Find the nearest token in a numeric token map based on a pixel value
 *
 * @see SPEC.md → "Resolvers" → "resolveNearestTokenPx"
 * @see SPEC.md → "Spacing resolution" (approximation logic)
 * Used for approximate mode to find closest matching token within threshold
 *
 * @param valuePx The pixel value to find the nearest token for
 * @param tokenMapPx The mapping of token names to their pixel values
 * @returns Object with the nearest token key, its pixel value, and the difference in pixels
 */
export function resolveNearestTokenPx(
  valuePx: number,
  tokenMapPx: Record<string, number>
): { tokenKey: string; tokenPx: number; diffPx: number } | null {
  if (!valuePx || !tokenMapPx || Object.keys(tokenMapPx).length === 0) {
    return null;
  }

  let nearestToken = '';
  let nearestValuePx = 0;
  let minDiff = Infinity;

  // Find the token with the closest value
  for (const [token, tokenPx] of Object.entries(tokenMapPx)) {
    const diff = Math.abs(valuePx - tokenPx);
    if (diff < minDiff) {
      minDiff = diff;
      nearestToken = token;
      nearestValuePx = tokenPx;
    }
  }

  if (nearestToken) {
    return {
      tokenKey: nearestToken,
      tokenPx: nearestValuePx,
      diffPx: minDiff,
    };
  }

  return null;
}

/**
 * Convert token map values to pixel values for comparison
 *
 * @param tokenMap The mapping of token names to their values (rem, px, etc.)
 * @param baseFontSize The base font size in pixels (default: 16px)
 * @returns Record mapping token names to pixel values
 */
function tokenMapToPx(
  tokenMap: Record<string, string>,
  baseFontSize: number = 16
): Record<string, number> {
  const result: Record<string, number> = {};

  for (const [token, value] of Object.entries(tokenMap)) {
    const pxValue = toPx(value, baseFontSize);
    if (pxValue !== null) {
      result[token] = pxValue;
    }
  }

  return result;
}

/**
 * Resolves a spacing value to a Tailwind token
 *
 * @see SPEC.md → "Resolvers" → "resolveSpacingToken"
 * @see SPEC.md → "Spacing resolution"
 * @see SPEC.md → "Thresholds by category (defaults)" → spacingPx: 2
 *
 * Implements:
 * - Exact matching in strict mode
 * - Approximate matching within threshold (default: 2px)
 * - Arbitrary values for non-matches
 *
 * @param value CSS spacing value (margin, padding, etc.)
 * @param ctx The matching context with theme and options
 * @returns Object with token, match type, and warning if applicable
 */
export function resolveSpacingToken(
  value: string,
  ctx: MatchCtx
): { token: string | null; type: 'exact' | 'approximate' | 'none'; warning?: string } {
  // Check cache
  const cacheKey = createCacheKey('resolveSpacingToken', value, ctx.opts.approximate);
  const cached = resolverCache.get(cacheKey);
  if (cached) return cached;
  if (!value) {
    return { token: null, type: 'none' };
  }

  const normalizedValue = normalizeValue(value);
  const prop = 'spacing'; // Generic property name for spacing
  const thresholdPx = ctx.opts.thresholds?.spacingPx ?? 2; // Default to 2px threshold

  // Try v4 tokens first if available
  if (ctx.version === 'v4' && ctx.tokens?.spacing) {
    const spacing = ctx.tokens.spacing;

    // Check for exact match in tokens
    for (const [key, tokenValue] of Object.entries(spacing)) {
      if (normalizedValue === tokenValue) {
        return { token: key, type: 'exact' };
      }
    }

    // If approximate matching is enabled, try to find the closest token
    if (ctx.opts.approximate && !ctx.opts.strict) {
      const valuePx = toPx(value);
      if (valuePx !== null) {
        const spacingPx = tokenMapToPx(spacing);
        const nearest = resolveNearestTokenPx(valuePx, spacingPx);

        if (nearest && nearest.diffPx <= thresholdPx) {
          return {
            token: nearest.tokenKey,
            type: 'approximate',
            warning: `approximate: ${prop} ${value} → ${nearest.tokenKey} (${nearest.diffPx.toFixed(1)}px difference)`,
          };
        }
      }
    }

    // If strict mode and no match found, emit token-miss warning
    if (ctx.opts.strict) {
      return {
        token: null,
        type: 'none',
        warning: `token-miss: no exact match for ${prop} value ${value}`,
      };
    }
  }

  // Fall back to v3 theme if available
  if (ctx.theme?.spacing) {
    const spacing = ctx.theme.spacing as Record<string, string>;

    // Check for exact match in theme
    for (const [key, themeValue] of Object.entries(spacing)) {
      if (normalizedValue === themeValue) {
        // If we're in v4 mode but using v3 theme, emit v3-fallback warning
        if (ctx.version === 'v4') {
          return {
            token: key,
            type: 'exact',
            warning: `v3-fallback: using v3 theme for ${prop} value ${value} → ${key}`,
          };
        }
        return { token: key, type: 'exact' };
      }
    }

    // If approximate matching is enabled, try to find the closest token
    if (ctx.opts.approximate && !ctx.opts.strict) {
      const valuePx = toPx(value);
      if (valuePx !== null) {
        const spacingPx = tokenMapToPx(spacing);
        const nearest = resolveNearestTokenPx(valuePx, spacingPx);

        if (nearest && nearest.diffPx <= thresholdPx) {
          const warningPrefix =
            ctx.version === 'v4' ? 'v3-fallback approximate: ' : 'approximate: ';
          const result = {
            token: nearest.tokenKey,
            type: 'approximate' as const,
            warning: `${warningPrefix}${prop} ${value} → ${nearest.tokenKey} (${nearest.diffPx.toFixed(1)}px difference)`,
          };
          resolverCache.set(cacheKey, result);
          return result;
        }
      }
    }
  }

  // No match found
  const result = { token: null, type: 'none' as const };
  resolverCache.set(cacheKey, result);
  return result;
}

/**
 * Resolves a color value to a Tailwind token
 *
 * @param hexOrNamed CSS color value (hex, named, etc.)
 * @param ctx The matching context with theme and options
 * @returns Object with class (if found), type, and warning if applicable
 */
export function resolveColorToken(
  hexOrNamed: string,
  ctx: MatchCtx
): { class?: string; type: 'exact' | 'none'; warning?: string } {
  if (!hexOrNamed) {
    return { type: 'none' };
  }

  const normalizedColor = parseColorNormalize(hexOrNamed);
  const prop = 'color'; // Generic property name for color

  // Try v4 tokens first if available
  if (ctx.version === 'v4' && ctx.tokens?.colors) {
    const colors = ctx.tokens.colors;

    // Check for direct matches in tokens colors
    for (const [colorName, colorValue] of Object.entries(colors)) {
      // Handle both string values and nested color objects
      if (typeof colorValue === 'string') {
        const normalizedTokenColor = parseColorNormalize(colorValue);
        if (normalizedColor === normalizedTokenColor) {
          return { type: 'exact', class: colorName };
        }
      } else if (typeof colorValue === 'object' && colorValue !== null) {
        // Handle nested color objects (e.g., blue: { 500: '#3b82f6' })
        for (const [shade, shadeValue] of Object.entries(colorValue as Record<string, string>)) {
          if (typeof shadeValue === 'string') {
            const normalizedTokenColor = parseColorNormalize(shadeValue);
            if (normalizedColor === normalizedTokenColor) {
              return { type: 'exact', class: `${colorName}-${shade}` };
            }
          }
        }
      }
    }

    // If strict mode and no match found, emit token-miss warning
    if (ctx.opts.strict) {
      return {
        type: 'none',
        warning: `token-miss: no exact match for ${prop} value ${hexOrNamed}`,
      };
    }
  }

  // Fall back to v3 theme if available
  if (ctx.theme?.colors) {
    const colors = ctx.theme.colors;

    // Check for direct matches in theme colors
    for (const [colorName, colorValue] of Object.entries(colors)) {
      // Handle both string values and nested color objects
      if (typeof colorValue === 'string') {
        const normalizedThemeColor = parseColorNormalize(colorValue);
        if (normalizedColor === normalizedThemeColor) {
          // If we're in v4 mode but using v3 theme, emit v3-fallback warning
          if (ctx.version === 'v4') {
            return {
              type: 'exact',
              class: colorName,
              warning: `v3-fallback: using v3 theme for ${prop} value ${hexOrNamed} → ${colorName}`,
            };
          }
          return { type: 'exact', class: colorName };
        }
      } else if (typeof colorValue === 'object' && colorValue !== null) {
        // Handle nested color objects (e.g., blue: { 500: '#3b82f6' })
        for (const [shade, shadeValue] of Object.entries(colorValue as Record<string, unknown>)) {
          if (typeof shadeValue === 'string') {
            const normalizedThemeColor = parseColorNormalize(shadeValue);
            if (normalizedColor === normalizedThemeColor) {
              const colorClass = `${colorName}-${shade}`;
              // If we're in v4 mode but using v3 theme, emit v3-fallback warning
              if (ctx.version === 'v4') {
                return {
                  type: 'exact',
                  class: colorClass,
                  warning: `v3-fallback: using v3 theme for ${prop} value ${hexOrNamed} → ${colorClass}`,
                };
              }
              return { type: 'exact', class: colorClass };
            }
          }
        }
      }
    }
  }

  // No match found
  return { type: 'none' };
}

/**
 * Resolves a font size value to a Tailwind token
 *
 * @param pxOrRem CSS font size value
 * @param ctx The matching context with theme and options
 * @returns Object with token, match type, and warning if applicable
 */
export function resolveFontSizeToken(
  pxOrRem: string,
  ctx: MatchCtx
): { token: string | null; type: 'exact' | 'approximate' | 'none'; warning?: string } {
  if (!pxOrRem) {
    return { token: null, type: 'none' };
  }

  const normalizedValue = normalizeValue(pxOrRem);
  const prop = 'font-size'; // Property name
  const thresholdPx = ctx.opts.thresholds?.fontPx ?? 1; // Default to 1px threshold

  // Try v4 tokens first if available
  if (ctx.version === 'v4' && ctx.tokens?.fontSize) {
    const fontSize = ctx.tokens.fontSize;
    const fontSizeMap: Record<string, string> = {};

    // Create a map of font size values for easier processing
    for (const [key, value] of Object.entries(fontSize)) {
      if (Array.isArray(value) && value[0]) {
        fontSizeMap[key] = value[0];
        // Check for exact match
        if (normalizedValue === value[0]) {
          return { token: key, type: 'exact' };
        }
      }
    }

    // If approximate matching is enabled, try to find the closest token
    if (ctx.opts.approximate && !ctx.opts.strict) {
      const valuePx = toPx(pxOrRem);
      if (valuePx !== null) {
        const fontSizePx = tokenMapToPx(fontSizeMap);
        const nearest = resolveNearestTokenPx(valuePx, fontSizePx);

        if (nearest && nearest.diffPx <= thresholdPx) {
          return {
            token: nearest.tokenKey,
            type: 'approximate',
            warning: `approximate: ${prop} ${pxOrRem} → ${nearest.tokenKey} (${nearest.diffPx.toFixed(1)}px difference)`,
          };
        }
      }
    }

    // If strict mode and no match found, emit token-miss warning
    if (ctx.opts.strict) {
      return {
        token: null,
        type: 'none',
        warning: `token-miss: no exact match for ${prop} value ${pxOrRem}`,
      };
    }
  }

  // Fall back to v3 theme if available
  if (ctx.theme?.fontSize) {
    const fontSize = ctx.theme.fontSize;
    const fontSizeMap: Record<string, string> = {};

    // Create a map of font size values for easier processing
    for (const [key, value] of Object.entries(fontSize)) {
      // Handle both string values and arrays with line height
      if (typeof value === 'string') {
        fontSizeMap[key] = value;
        if (normalizedValue === value) {
          // If we're in v4 mode but using v3 theme, emit v3-fallback warning
          if (ctx.version === 'v4') {
            return {
              token: key,
              type: 'exact',
              warning: `v3-fallback: using v3 theme for ${prop} value ${pxOrRem} → ${key}`,
            };
          }
          return { token: key, type: 'exact' };
        }
      } else if (Array.isArray(value) && value[0]) {
        fontSizeMap[key] = value[0];
        if (normalizedValue === value[0]) {
          // If we're in v4 mode but using v3 theme, emit v3-fallback warning
          if (ctx.version === 'v4') {
            return {
              token: key,
              type: 'exact',
              warning: `v3-fallback: using v3 theme for ${prop} value ${pxOrRem} → ${key}`,
            };
          }
          return { token: key, type: 'exact' };
        }
      }
    }

    // If approximate matching is enabled, try to find the closest token
    if (ctx.opts.approximate && !ctx.opts.strict) {
      const valuePx = toPx(pxOrRem);
      if (valuePx !== null) {
        const fontSizePx = tokenMapToPx(fontSizeMap);
        const nearest = resolveNearestTokenPx(valuePx, fontSizePx);

        if (nearest && nearest.diffPx <= thresholdPx) {
          const warningPrefix =
            ctx.version === 'v4' ? 'v3-fallback approximate: ' : 'approximate: ';
          return {
            token: nearest.tokenKey,
            type: 'approximate',
            warning: `${warningPrefix}${prop} ${pxOrRem} → ${nearest.tokenKey} (${nearest.diffPx.toFixed(1)}px difference)`,
          };
        }
      }
    }
  }

  // No match found
  return { token: null, type: 'none' };
}

/**
 * Resolves a line height value to a Tailwind token
 *
 * @param value CSS line height value
 * @param ctx The matching context with theme and options
 * @returns Object with token, match type, and warning if applicable
 */
export function resolveLineHeightToken(
  value: string,
  ctx: MatchCtx
): { token: string | null; type: 'exact' | 'approximate' | 'none'; warning?: string } {
  if (!value) {
    return { token: null, type: 'none' };
  }

  const normalizedValue = normalizeValue(value);
  const prop = 'line-height'; // Property name
  const thresholdPx = ctx.opts.thresholds?.fontPx ?? 1; // Use font threshold for line height

  // Try v4 tokens first if available
  if (ctx.version === 'v4' && ctx.tokens?.lineHeight) {
    const lineHeight = ctx.tokens.lineHeight;

    // Check for exact match in tokens
    for (const [key, tokenValue] of Object.entries(lineHeight)) {
      const stringValue = String(tokenValue);
      if (normalizedValue === stringValue) {
        return { token: key, type: 'exact' };
      }
    }

    // If approximate matching is enabled, try to find the closest token
    if (ctx.opts.approximate && !ctx.opts.strict) {
      // Convert to numeric values for comparison
      const valueNum = parseFloat(normalizedValue);
      if (!isNaN(valueNum)) {
        const lineHeightMap: Record<string, number> = {};

        for (const [key, tokenValue] of Object.entries(lineHeight)) {
          const num = parseFloat(String(tokenValue));
          if (!isNaN(num)) {
            lineHeightMap[key] = num;
          }
        }

        const nearest = resolveNearestTokenPx(valueNum, lineHeightMap);

        if (nearest && nearest.diffPx <= thresholdPx) {
          return {
            token: nearest.tokenKey,
            type: 'approximate',
            warning: `approximate: ${prop} ${value} → ${nearest.tokenKey} (${nearest.diffPx.toFixed(2)} difference)`,
          };
        }
      }
    }

    // If strict mode and no match found, emit token-miss warning
    if (ctx.opts.strict) {
      return {
        token: null,
        type: 'none',
        warning: `token-miss: no exact match for ${prop} value ${value}`,
      };
    }
  }

  // Fall back to v3 theme if available
  if (ctx.theme?.lineHeight) {
    const lineHeight = ctx.theme.lineHeight;

    // Check for exact match in theme
    for (const [key, themeValue] of Object.entries(lineHeight)) {
      const stringValue = String(themeValue);
      if (normalizedValue === stringValue) {
        // If we're in v4 mode but using v3 theme, emit v3-fallback warning
        if (ctx.version === 'v4') {
          return {
            token: key,
            type: 'exact',
            warning: `v3-fallback: using v3 theme for ${prop} value ${value} → ${key}`,
          };
        }
        return { token: key, type: 'exact' };
      }
    }

    // If approximate matching is enabled, try to find the closest token
    if (ctx.opts.approximate && !ctx.opts.strict) {
      // Convert to numeric values for comparison
      const valueNum = parseFloat(normalizedValue);
      if (!isNaN(valueNum)) {
        const lineHeightMap: Record<string, number> = {};

        for (const [key, themeValue] of Object.entries(lineHeight)) {
          const num = parseFloat(String(themeValue));
          if (!isNaN(num)) {
            lineHeightMap[key] = num;
          }
        }

        const nearest = resolveNearestTokenPx(valueNum, lineHeightMap);

        if (nearest && nearest.diffPx <= thresholdPx) {
          const warningPrefix =
            ctx.version === 'v4' ? 'v3-fallback approximate: ' : 'approximate: ';
          return {
            token: nearest.tokenKey,
            type: 'approximate',
            warning: `${warningPrefix}${prop} ${value} → ${nearest.tokenKey} (${nearest.diffPx.toFixed(2)} difference)`,
          };
        }
      }
    }
  }

  // No match found
  return { token: null, type: 'none' };
}

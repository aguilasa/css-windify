/**
 * Typography matchers for Tailwind CSS
 */
import { MatchCtx } from '../../types';
import { toArbitrary } from '../normalizers';
import { resolveFontSizeToken, resolveLineHeightToken } from '../themeLoader';

// Mapping of typography property to Tailwind class prefix
const typographyPrefixMap: Record<string, string> = {
  'font-size': 'text',
  'line-height': 'leading',
  'letter-spacing': 'tracking',
};

// Mapping for letter-spacing predefined values
const letterSpacingMap: Record<string, string> = {
  normal: 'normal',
  '0': 'normal',
  '0px': 'normal',
  '0.05em': 'wide',
  '0.1em': 'wider',
  '-0.05em': 'tight',
  '-0.1em': 'tighter',
};

/**
 * Matches typography values to Tailwind classes
 *
 * @param kind The typography property (font-size, line-height, letter-spacing)
 * @param value The CSS value
 * @param ctx The matching context with theme
 * @returns Object with Tailwind class and warning if approximate
 */
export function matchTypography(
  kind: 'font-size' | 'line-height' | 'letter-spacing',
  value: string,
  ctx: MatchCtx
): { class: string; warning?: string } {
  if (!value || !kind) return { class: '' };

  const prefix = typographyPrefixMap[kind];
  if (!prefix) return { class: '' };

  // Handle each typography property differently
  switch (kind) {
    case 'font-size':
      return handleFontSize(value, ctx);
    case 'line-height':
      return handleLineHeight(value, ctx);
    case 'letter-spacing':
      return handleLetterSpacing(value, ctx);
    default:
      return { class: '' };
  }
}

/**
 * Handles font-size values
 *
 * @param value The CSS value
 * @param ctx The matching context
 * @returns Object with Tailwind class and warning if approximate
 */
function handleFontSize(value: string, ctx: MatchCtx): { class: string; warning?: string } {
  // Try to resolve from theme with approximation if enabled and not in strict mode
  const result = resolveFontSizeToken(value, ctx.theme, {
    approximate: ctx.opts.approximate && !ctx.opts.strict,
    maxDiffPx: 1, // Default to 1px max difference
  });

  if (result.token) {
    // If it's an approximate match, add a warning
    if (result.type === 'approximate') {
      return {
        class: `text-${result.token}`,
        warning: `approximate mapping: ${value} → text-${result.token} (${result.diff}px difference)`,
      };
    }

    // Exact match
    return { class: `text-${result.token}` };
  }

  // Use arbitrary value if no match found
  return { class: toArbitrary('text', value) };
}

/**
 * Handles line-height values
 *
 * @param value The CSS value
 * @param ctx The matching context
 * @returns Object with Tailwind class and warning if approximate
 */
function handleLineHeight(value: string, ctx: MatchCtx): { class: string; warning?: string } {
  // Try to resolve from theme with approximation if enabled and not in strict mode
  const result = resolveLineHeightToken(value, ctx.theme, {
    approximate: ctx.opts.approximate && !ctx.opts.strict,
    maxDiffPx: 1, // Default to 1px max difference
  });

  if (result.token) {
    // If it's an approximate match, add a warning
    if (result.type === 'approximate') {
      return {
        class: `leading-${result.token}`,
        warning: `approximate mapping: ${value} → leading-${result.token} (${result.diff}px difference)`,
      };
    }

    // Exact match
    return { class: `leading-${result.token}` };
  }

  // Use arbitrary value if no match found
  return { class: toArbitrary('leading', value) };
}

/**
 * Handles letter-spacing values
 *
 * @param value The CSS value
 * @param ctx The matching context
 * @returns Object with Tailwind class and warning if approximate
 */
function handleLetterSpacing(value: string, _ctx: MatchCtx): { class: string; warning?: string } {
  // Check for predefined values
  const normalizedValue = value.trim().toLowerCase();
  if (letterSpacingMap[normalizedValue]) {
    return { class: `tracking-${letterSpacingMap[normalizedValue]}` };
  }

  // Use arbitrary value if no match found
  return { class: toArbitrary('tracking', value) };
}

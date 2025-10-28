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
  'normal': 'normal',
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
 * @returns Tailwind class
 */
export function matchTypography(
  kind: 'font-size' | 'line-height' | 'letter-spacing',
  value: string,
  ctx: MatchCtx
): string {
  if (!value || !kind) return '';

  const prefix = typographyPrefixMap[kind];
  if (!prefix) return '';

  // Handle each typography property differently
  switch (kind) {
    case 'font-size':
      return handleFontSize(value, ctx);
    case 'line-height':
      return handleLineHeight(value, ctx);
    case 'letter-spacing':
      return handleLetterSpacing(value, ctx);
    default:
      return '';
  }
}

/**
 * Handles font-size values
 * 
 * @param value The CSS value
 * @param ctx The matching context
 * @returns Tailwind class
 */
function handleFontSize(value: string, ctx: MatchCtx): string {
  // Try to resolve from theme
  const token = resolveFontSizeToken(value, ctx.theme);
  if (token) {
    return `text-${token}`;
  }

  // Use arbitrary value if no match found
  return toArbitrary('text', value);
}

/**
 * Handles line-height values
 * 
 * @param value The CSS value
 * @param ctx The matching context
 * @returns Tailwind class
 */
function handleLineHeight(value: string, ctx: MatchCtx): string {
  // Try to resolve from theme
  const token = resolveLineHeightToken(value, ctx.theme);
  if (token) {
    return `leading-${token}`;
  }

  // Use arbitrary value if no match found
  return toArbitrary('leading', value);
}

/**
 * Handles letter-spacing values
 * 
 * @param value The CSS value
 * @param ctx The matching context
 * @returns Tailwind class
 */
function handleLetterSpacing(value: string, _ctx: MatchCtx): string {
  // Check for predefined values
  const normalizedValue = value.trim().toLowerCase();
  if (letterSpacingMap[normalizedValue]) {
    return `tracking-${letterSpacingMap[normalizedValue]}`;
  }

  // Use arbitrary value if no match found
  return toArbitrary('tracking', value);
}

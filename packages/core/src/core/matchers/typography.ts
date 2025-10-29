/**
 * Typography matchers for Tailwind CSS
 */
import { MatchCtx } from '../../types';
import { toArbitrary, normalizeValue, arbitraryProperty } from '../normalizers';
import { resolveFontSizeToken, resolveLineHeightToken } from '../resolvers';
import { matchColor } from './colors';

// Mapping of typography property to Tailwind class prefix
const typographyPrefixMap: Record<string, string> = {
  'font-size': 'text',
  'line-height': 'leading',
  'letter-spacing': 'tracking',
};

// Mapping for letter-spacing predefined values
const letterSpacingMap: Record<string, string> = {
  // Normal
  normal: 'normal',
  '0': 'normal',
  '0px': 'normal',
  '0em': 'normal',

  // Wider values
  '0.025em': 'wide',
  '0.05em': 'wide',
  '0.1em': 'wider',
  '0.15em': 'wider',
  '0.2em': 'widest',
  '0.25em': 'widest',
  '4px': 'wide',
  '8px': 'wider',
  '12px': 'widest',

  // Tighter values
  '-0.025em': 'tight',
  '-0.05em': 'tight',
  '-0.1em': 'tighter',
  '-0.15em': 'tighter',
  '-0.2em': 'tightest',
  '-0.25em': 'tightest',
  '-4px': 'tight',
  '-8px': 'tighter',
  '-12px': 'tightest',
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
  // Try to resolve from theme or tokens
  const result = resolveFontSizeToken(value, ctx);

  if (result.token) {
    // If there's a warning, pass it through
    if (result.warning) {
      return {
        class: `text-${result.token}`,
        warning: result.warning,
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
  // Try to resolve from theme or tokens
  const result = resolveLineHeightToken(value, ctx);

  if (result.token) {
    // If there's a warning, pass it through
    if (result.warning) {
      return {
        class: `leading-${result.token}`,
        warning: result.warning,
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

/**
 * Matches text-decoration values to Tailwind classes
 *
 * @param value The CSS text-decoration value
 * @returns Tailwind class or array of classes
 */
export function matchTextDecoration(value: string): string | string[] {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle simple values
  if (normalizedValue === 'underline') {
    return 'underline';
  }

  if (normalizedValue === 'line-through') {
    return 'line-through';
  }

  if (normalizedValue === 'none') {
    return 'no-underline';
  }

  // Handle complex values that might include multiple decorations
  const classes = [];

  if (normalizedValue.includes('underline')) {
    classes.push('underline');
  }

  if (normalizedValue.includes('line-through')) {
    classes.push('line-through');
  }

  // If no standard classes were found, use arbitrary property
  if (classes.length === 0) {
    return arbitraryProperty('text-decoration', normalizedValue);
  }

  return classes;
}

/**
 * Matches text-decoration-color values to Tailwind classes
 *
 * @param value The CSS text-decoration-color value
 * @param ctx The matching context
 * @returns Tailwind class
 */
export function matchTextDecorationColor(value: string, ctx: MatchCtx): string {
  if (!value) return '';

  // Use color matcher with decoration prefix
  const result = matchColor('decoration', value, ctx);
  return result.class;
}

/**
 * Matches text-decoration-style values to Tailwind classes
 *
 * @param value The CSS text-decoration-style value
 * @returns Tailwind class
 */
export function matchTextDecorationStyle(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Map text-decoration-style values to Tailwind classes
  const styleMap: Record<string, string> = {
    solid: 'decoration-solid',
    double: 'decoration-double',
    dotted: 'decoration-dotted',
    dashed: 'decoration-dashed',
    wavy: 'decoration-wavy',
  };

  if (styleMap[normalizedValue]) {
    return styleMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return arbitraryProperty('text-decoration-style', normalizedValue);
}

/**
 * Matches text-decoration-thickness values to Tailwind classes
 *
 * @param value The CSS text-decoration-thickness value
 * @returns Tailwind class
 */
export function matchTextDecorationThickness(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Map text-decoration-thickness values to Tailwind classes
  const thicknessMap: Record<string, string> = {
    auto: 'decoration-auto',
    'from-font': 'decoration-from-font',
    '0': 'decoration-0',
    '0px': 'decoration-0',
    '1px': 'decoration-1',
    '2px': 'decoration-2',
    '4px': 'decoration-4',
    '8px': 'decoration-8',
  };

  if (thicknessMap[normalizedValue]) {
    return thicknessMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return toArbitrary('decoration', normalizedValue);
}

/**
 * Color matchers for Tailwind CSS
 */
import { MatchCtx } from '../../types';
import { parseColorNormalize, toArbitrary } from '../normalizers';
import { resolveColorToken } from '../themeLoader';

// Basic named colors that are always available in Tailwind
const basicNamedColors = ['black', 'white', 'transparent', 'current'];

/**
 * Matches color values to Tailwind classes
 *
 * @param prefix The color property prefix (text, bg, border)
 * @param value The CSS color value
 * @param ctx The matching context with theme
 * @returns Tailwind class
 */
export function matchColor(prefix: 'text' | 'bg' | 'border', value: string, ctx: MatchCtx): string {
  if (!value || !prefix) return '';

  // Normalize the color value
  const normalizedValue = parseColorNormalize(value);

  // Handle CSS variables
  if (normalizedValue.startsWith('var(')) {
    return toArbitrary(prefix, normalizedValue);
  }

  // Check for basic named colors first
  const lowerValue = normalizedValue.toLowerCase();
  if (basicNamedColors.includes(lowerValue)) {
    return `${prefix}-${lowerValue}`;
  }

  // Try to resolve from theme
  const colorResult = resolveColorToken(normalizedValue, ctx.theme);
  if (colorResult.type === 'exact' && colorResult.class) {
    return `${prefix}-${colorResult.class}`;
  }

  // Use arbitrary value if no match found
  return toArbitrary(prefix, normalizedValue);
}

/**
 * Color matchers for Tailwind CSS
 */
import { MatchCtx } from '../../types';
import { parseColorNormalize, toArbitrary } from '../normalizers';
import { resolveColorToken } from '../resolvers';

// Basic named colors that are always available in Tailwind
const basicNamedColors = ['black', 'white', 'transparent', 'current'];

/**
 * Matches color values to Tailwind classes
 *
 * @param prefix The color property prefix (text, bg, border, decoration)
 * @param value The CSS color value
 * @param ctx The matching context with theme
 * @returns Tailwind class
 */
export function matchColor(
  prefix: 'text' | 'bg' | 'border' | 'decoration',
  value: string,
  ctx: MatchCtx
): { class: string; warning?: string } {
  if (!value || !prefix) return { class: '' };

  // Normalize the color value
  const normalizedValue = parseColorNormalize(value);

  // Handle CSS variables
  if (normalizedValue.startsWith('var(')) {
    return { class: toArbitrary(prefix, normalizedValue) };
  }

  // Check for basic named colors first
  const lowerValue = normalizedValue.toLowerCase();
  if (basicNamedColors.includes(lowerValue)) {
    return { class: `${prefix}-${lowerValue}` };
  }

  // Try to resolve from theme or tokens
  const colorResult = resolveColorToken(normalizedValue, ctx);
  if (colorResult.type === 'exact' && colorResult.class) {
    // If there's a warning, pass it through
    if (colorResult.warning) {
      return {
        class: `${prefix}-${colorResult.class}`,
        warning: colorResult.warning,
      };
    }
    return { class: `${prefix}-${colorResult.class}` };
  }

  // Use arbitrary value if no match found
  return { class: toArbitrary(prefix, normalizedValue) };
}

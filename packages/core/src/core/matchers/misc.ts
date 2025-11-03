/**
 * Miscellaneous matchers for Tailwind CSS (overflow, z-index, opacity, box-shadow)
 */
import { normalizeValue, toArbitrary } from '../normalizers';
import type { MatchCtx } from '../../types';

// Overflow mapping
const overflowMap: Record<string, string> = {
  visible: 'overflow-visible',
  hidden: 'overflow-hidden',
  scroll: 'overflow-scroll',
  auto: 'overflow-auto',
};

// Z-index common values
const zIndexMap: Record<string, string> = {
  '0': 'z-0',
  '10': 'z-10',
  '20': 'z-20',
  '30': 'z-30',
  '40': 'z-40',
  '50': 'z-50',
  auto: 'z-auto',
};

/**
 * Matches overflow values to Tailwind classes
 *
 * @param value The CSS overflow value
 * @param axis Optional axis ('x' or 'y') for overflow-x or overflow-y
 * @returns Tailwind class
 */
export function matchOverflow(value: string, axis?: 'x' | 'y'): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);
  const prefix = axis ? `overflow-${axis}` : 'overflow';

  // Check for predefined overflow values
  if (overflowMap[normalizedValue]) {
    const baseClass = overflowMap[normalizedValue];
    // Replace 'overflow-' with the correct prefix if needed
    return axis ? baseClass.replace('overflow-', prefix + '-') : baseClass;
  }

  // Use arbitrary value if no match found
  return toArbitrary(prefix, normalizedValue);
}

/**
 * Matches z-index values to Tailwind classes
 *
 * @param value The CSS z-index value
 * @returns Tailwind class
 */
export function matchZIndex(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Check for predefined z-index values
  if (zIndexMap[normalizedValue]) {
    return zIndexMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return toArbitrary('z', normalizedValue);
}

/**
 * Matches opacity values to Tailwind classes
 *
 * @param value The CSS opacity value
 * @returns Tailwind class
 */
export function matchOpacity(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle percentage values
  if (normalizedValue.endsWith('%')) {
    const percentage = parseInt(normalizedValue, 10);
    if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
      return `opacity-${percentage}`;
    }
  }

  // Handle decimal values (0-1)
  const floatValue = parseFloat(normalizedValue);
  if (!isNaN(floatValue) && floatValue >= 0 && floatValue <= 1) {
    const percentage = Math.round(floatValue * 100);
    return `opacity-${percentage}`;
  }

  // Use arbitrary value if no match found
  return toArbitrary('opacity', normalizedValue);
}

/**
 * Normalize box-shadow value for comparison
 * Removes extra spaces and normalizes rgb/rgba format
 */
function normalizeBoxShadow(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      // Normalize spaces around commas
      .replace(/\s*,\s*/g, ',')
      // Normalize multiple spaces to single space
      .replace(/\s+/g, ' ')
      // Normalize rgb/rgba format
      .replace(/rgb\(\s*/g, 'rgb(')
      .replace(/rgba\(\s*/g, 'rgba(')
      .replace(/\s*\/\s*/g, '/')
      // Remove spaces before closing parenthesis
      .replace(/\s+\)/g, ')')
  );
}

// Box-shadow token mapping (Tailwind v3 default values)
const boxShadowMap: Record<string, string> = {
  none: 'shadow-none',
  '0 1px 2px 0 rgb(0 0 0/0.05)': 'shadow-sm',
  '0 1px 3px 0 rgb(0 0 0/0.1),0 1px 2px -1px rgb(0 0 0/0.1)': 'shadow',
  '0 4px 6px -1px rgb(0 0 0/0.1),0 2px 4px -2px rgb(0 0 0/0.1)': 'shadow-md',
  '0 10px 15px -3px rgb(0 0 0/0.1),0 4px 6px -4px rgb(0 0 0/0.1)': 'shadow-lg',
  '0 20px 25px -5px rgb(0 0 0/0.1),0 8px 10px -6px rgb(0 0 0/0.1)': 'shadow-xl',
  '0 25px 50px -12px rgb(0 0 0/0.25)': 'shadow-2xl',
  // Alternative formats with rgba
  '0 1px 2px 0 rgba(0,0,0,0.05)': 'shadow-sm',
  '0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px -1px rgba(0,0,0,0.1)': 'shadow',
  '0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -2px rgba(0,0,0,0.1)': 'shadow-md',
  '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -4px rgba(0,0,0,0.1)': 'shadow-lg',
  '0 20px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(0,0,0,0.1)': 'shadow-xl',
  '0 25px 50px -12px rgba(0,0,0,0.25)': 'shadow-2xl',
};

/**
 * Matches box-shadow values to Tailwind classes
 *
 * @param value The CSS box-shadow value
 * @param ctx Match context (for future extensibility)
 * @returns Object with class and optional warning
 */
export function matchBoxShadow(
  value: string,
  _ctx?: MatchCtx
): { class: string; warning?: string } {
  if (!value) {
    return { class: '' };
  }

  const normalizedValue = normalizeBoxShadow(value);

  // Check for exact match in token map
  if (boxShadowMap[normalizedValue]) {
    return { class: boxShadowMap[normalizedValue] };
  }

  // Check for "none"
  if (normalizedValue === 'none') {
    return { class: 'shadow-none' };
  }

  // Use arbitrary value for custom shadows
  const arbitraryClass = toArbitrary('shadow', value);
  return {
    class: arbitraryClass,
    warning: `No exact Tailwind token for box-shadow: ${value}, used arbitrary value`,
  };
}

/**
 * Miscellaneous matchers for Tailwind CSS (overflow, z-index, opacity)
 */
import { normalizeValue, toArbitrary } from '../normalizers';

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

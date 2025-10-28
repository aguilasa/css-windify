/**
 * Border matchers for Tailwind CSS
 */
import { MatchCtx } from '../../types';
import { normalizeValue, toArbitrary, arbitraryProperty } from '../normalizers';
import { matchColor } from './colors';

// Border width mapping
const borderWidthMap: Record<string, string> = {
  '0': 'border-0',
  '0px': 'border-0',
  '1px': 'border',
  '2px': 'border-2',
  '4px': 'border-4',
  '8px': 'border-8',
};

// Border radius mapping
const borderRadiusMap: Record<string, string> = {
  '0': 'rounded-none',
  '0px': 'rounded-none',
  '0.125rem': 'rounded-sm',
  '0.25rem': 'rounded',
  '0.375rem': 'rounded-md',
  '0.5rem': 'rounded-lg',
  '0.75rem': 'rounded-xl',
  '1rem': 'rounded-2xl',
  '1.5rem': 'rounded-3xl',
  '9999px': 'rounded-full',
  '50%': 'rounded-full',
};

/**
 * Matches border width values to Tailwind classes
 *
 * @param value The CSS border-width value
 * @returns Tailwind class
 */
export function matchBorderWidth(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Check for predefined border widths
  if (borderWidthMap[normalizedValue]) {
    return borderWidthMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return toArbitrary('border', normalizedValue);
}

/**
 * Parse border shorthand and extract components
 *
 * @param value The CSS border shorthand value (e.g., "1px solid black")
 * @returns Object with width, style, and color components
 */
export function parseBorderShorthand(value: string): {
  width?: string;
  style?: string;
  color?: string;
} {
  if (!value) return {};

  const parts = value.trim().split(/\s+/);
  const result: { width?: string; style?: string; color?: string } = {};

  // Border styles as defined in CSS
  const borderStyles = [
    'none',
    'hidden',
    'dotted',
    'dashed',
    'solid',
    'double',
    'groove',
    'ridge',
    'inset',
    'outset',
  ];

  for (const part of parts) {
    // Check if it's a width (has px, rem, em, etc. or is a number)
    if (
      /^\d+(\.\d+)?(px|rem|em|%|vh|vw|vmin|vmax)?$/.test(part) ||
      part === '0' ||
      part === 'thin' ||
      part === 'medium' ||
      part === 'thick'
    ) {
      result.width = part;
    }
    // Check if it's a style
    else if (borderStyles.includes(part.toLowerCase())) {
      result.style = part;
    }
    // Assume it's a color
    else {
      result.color = part;
    }
  }

  return result;
}

/**
 * Matches border shorthand to Tailwind classes
 *
 * @param value The CSS border shorthand value
 * @param ctx The matching context with theme
 * @returns Array of Tailwind classes
 */
export function matchBorderShorthand(value: string, ctx: MatchCtx): string[] {
  if (!value) return [];

  // Parse the shorthand
  const { width, style, color } = parseBorderShorthand(value);
  const classes: string[] = [];

  // Handle width
  if (width) {
    // If width is "0", use "border-0"
    if (width === '0') {
      classes.push('border-0');
    }
    // If width is "1px" (default border width), use just "border"
    else if (width === '1px') {
      classes.push('border');
    }
    // Otherwise, try to match the width
    else {
      classes.push(matchBorderWidth(width));
    }
  } else {
    // If no width specified, use the default "border"
    classes.push('border');
  }

  // Handle style (only solid is default in Tailwind, others need arbitrary values)
  if (style && style.toLowerCase() !== 'solid') {
    classes.push(arbitraryProperty('border-style', style));
  }

  // Handle color
  if (color) {
    classes.push(matchColor('border', color, ctx));
  }

  return classes;
}

/**
 * Matches border color values to Tailwind classes
 *
 * @param value The CSS border-color value
 * @param ctx The matching context
 * @returns Tailwind class
 */
export function matchBorderColor(value: string, ctx: MatchCtx): string {
  return matchColor('border', value, ctx);
}

/**
 * Matches border radius values to Tailwind classes
 *
 * @param value The CSS border-radius value
 * @returns Tailwind class
 */
export function matchBorderRadius(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Check for predefined border radius values
  if (borderRadiusMap[normalizedValue]) {
    return borderRadiusMap[normalizedValue];
  }

  // Check for percentage values close to 50%
  if (normalizedValue.endsWith('%')) {
    const percentage = parseFloat(normalizedValue);
    if (percentage >= 45 && percentage <= 55) {
      return 'rounded-full';
    }
  }

  // Check for very large px values (likely meant to be "full")
  if (normalizedValue.endsWith('px')) {
    const pixels = parseFloat(normalizedValue);
    if (pixels >= 1000) {
      return 'rounded-full';
    }
  }

  // Use arbitrary value if no match found
  return toArbitrary('rounded', normalizedValue);
}

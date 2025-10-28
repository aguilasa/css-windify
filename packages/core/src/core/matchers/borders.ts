/**
 * Border matchers for Tailwind CSS
 */
import { MatchCtx } from '../../types';
import { normalizeValue, toArbitrary } from '../normalizers';
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

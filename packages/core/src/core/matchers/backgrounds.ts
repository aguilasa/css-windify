/**
 * Background matchers for Tailwind CSS
 */
import { MatchCtx } from '../../types';
import { normalizeValue, toArbitrary } from '../normalizers';
import { matchColor } from './colors';

// Background size mapping
const backgroundSizeMap: Record<string, string> = {
  'cover': 'bg-cover',
  'contain': 'bg-contain',
  'auto': 'bg-auto',
};

// Background position mapping
const backgroundPositionMap: Record<string, string> = {
  'center': 'bg-center',
  'top': 'bg-top',
  'right': 'bg-right',
  'bottom': 'bg-bottom',
  'left': 'bg-left',
  'top right': 'bg-top-right',
  'top left': 'bg-top-left',
  'bottom right': 'bg-bottom-right',
  'bottom left': 'bg-bottom-left',
  'right top': 'bg-top-right',
  'left top': 'bg-top-left',
  'right bottom': 'bg-bottom-right',
  'left bottom': 'bg-bottom-left',
};

/**
 * Matches background color values to Tailwind classes
 * 
 * @param value The CSS background-color value
 * @param ctx The matching context
 * @returns Tailwind class
 */
export function matchBackgroundColor(value: string, ctx: MatchCtx): string {
  return matchColor('bg', value, ctx);
}

/**
 * Matches background size values to Tailwind classes
 * 
 * @param value The CSS background-size value
 * @returns Tailwind class
 */
export function matchBackgroundSize(value: string): string {
  if (!value) return '';
  
  const normalizedValue = normalizeValue(value);
  
  // Check for predefined background sizes
  if (backgroundSizeMap[normalizedValue]) {
    return backgroundSizeMap[normalizedValue];
  }
  
  // Use arbitrary value if no match found
  return toArbitrary('bg', normalizedValue);
}

/**
 * Matches background position values to Tailwind classes
 * 
 * @param value The CSS background-position value
 * @returns Tailwind class
 */
export function matchBackgroundPosition(value: string): string {
  if (!value) return '';
  
  const normalizedValue = normalizeValue(value);
  
  // Check for predefined background positions
  if (backgroundPositionMap[normalizedValue]) {
    return backgroundPositionMap[normalizedValue];
  }
  
  // Use arbitrary value if no match found
  return toArbitrary('bg', normalizedValue);
}

/**
 * Matches background image values to Tailwind classes
 * 
 * @param value The CSS background-image value
 * @returns Tailwind class
 */
export function matchBackgroundImage(value: string): string {
  if (!value) return '';
  
  const normalizedValue = normalizeValue(value);
  
  // Handle gradients and other complex values
  if (normalizedValue.startsWith('linear-gradient') || 
      normalizedValue.startsWith('radial-gradient') ||
      normalizedValue.startsWith('conic-gradient') ||
      normalizedValue.startsWith('url(')) {
    return toArbitrary('bg', normalizedValue);
  }
  
  // Handle none value
  if (normalizedValue === 'none') {
    return 'bg-none';
  }
  
  // Use arbitrary value for other cases
  return toArbitrary('bg', normalizedValue);
}

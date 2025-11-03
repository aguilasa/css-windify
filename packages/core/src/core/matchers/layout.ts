/**
 * Layout matchers for Tailwind CSS
 */
import { MatchCtx } from '../../types';
import { normalizeValue, toArbitrary } from '../normalizers';
import { matchSpacing } from './spacing';

// Display property mapping
export const displayMap: Record<string, string> = {
  block: 'block',
  inline: 'inline',
  'inline-block': 'inline-block',
  flex: 'flex',
  'inline-flex': 'inline-flex',
  grid: 'grid',
  'inline-grid': 'inline-grid',
  table: 'table',
  'table-row': 'table-row',
  'table-cell': 'table-cell',
  contents: 'contents',
  'list-item': 'list-item',
  hidden: 'hidden',
  none: 'hidden',
};

// Position property mapping
export const positionMap: Record<string, string> = {
  static: 'static',
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  sticky: 'sticky',
};

/**
 * Matches display property values to Tailwind classes
 *
 * @param value The CSS display value
 * @returns Tailwind class or empty string if not matched
 */
export function matchDisplay(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);
  return displayMap[normalizedValue] || '';
}

/**
 * Matches position property values to Tailwind classes
 *
 * @param value The CSS position value
 * @returns Tailwind class or empty string if not matched
 */
export function matchPosition(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);
  return positionMap[normalizedValue] || '';
}

/**
 * Matches the inset property to Tailwind classes
 *
 * @param property The CSS property (top, right, bottom, left)
 * @param value The CSS value
 * @param ctx The matching context
 * @returns Array of Tailwind classes and warnings
 */
export function matchInset(
  property: 'top' | 'right' | 'bottom' | 'left',
  value: string,
  ctx: MatchCtx
): string[] | { classes: string[]; warnings: string[] } {
  const result = matchSpacing(property, value, ctx);
  return result.warnings.length > 0 ? result : result.classes;
}

/**
 * Matches the inset shorthand property to Tailwind classes
 *
 * @param value The CSS inset value
 * @param ctx The matching context
 * @returns Array of Tailwind classes and warnings
 */
export function matchInsetShorthand(
  value: string,
  ctx: MatchCtx
): { classes: string[]; warnings: string[] } {
  // For inset shorthand, we need to handle each direction

  // Use spacing matcher for each direction
  const topResult = matchSpacing('top', value, ctx);
  const rightResult = matchSpacing('right', value, ctx);
  const bottomResult = matchSpacing('bottom', value, ctx);
  const leftResult = matchSpacing('left', value, ctx);

  // Combine all classes and warnings
  const classes = [
    ...topResult.classes,
    ...rightResult.classes,
    ...bottomResult.classes,
    ...leftResult.classes,
  ];

  const warnings = [
    ...topResult.warnings,
    ...rightResult.warnings,
    ...bottomResult.warnings,
    ...leftResult.warnings,
  ];

  return { classes, warnings };
}

// Object position mapping
const objectPositionMap: Record<string, string> = {
  center: 'object-center',
  top: 'object-top',
  right: 'object-right',
  bottom: 'object-bottom',
  left: 'object-left',
  // Two-value combinations
  'top left': 'object-left-top',
  'left top': 'object-left-top',
  'top right': 'object-right-top',
  'right top': 'object-right-top',
  'bottom left': 'object-left-bottom',
  'left bottom': 'object-left-bottom',
  'bottom right': 'object-right-bottom',
  'right bottom': 'object-right-bottom',
};

/**
 * Matches object-position values to Tailwind classes
 *
 * @param value The CSS object-position value
 * @param _ctx Match context (for future extensibility)
 * @returns Tailwind class
 */
export function matchObjectPosition(value: string, _ctx?: MatchCtx): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Check for predefined position values
  if (objectPositionMap[normalizedValue]) {
    return objectPositionMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return toArbitrary('object', normalizedValue);
}

// Aspect ratio mapping
const aspectRatioMap: Record<string, string> = {
  auto: 'aspect-auto',
  '1/1': 'aspect-square',
  '16/9': 'aspect-video',
};

/**
 * Matches aspect-ratio values to Tailwind classes
 *
 * @param value The CSS aspect-ratio value
 * @param _ctx Match context (for future extensibility)
 * @returns Tailwind class
 */
export function matchAspectRatio(value: string, _ctx?: MatchCtx): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Check for predefined aspect ratio values
  if (aspectRatioMap[normalizedValue]) {
    return aspectRatioMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return toArbitrary('aspect', normalizedValue);
}

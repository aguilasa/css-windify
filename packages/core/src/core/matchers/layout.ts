/**
 * Layout matchers for Tailwind CSS
 */
import { MatchCtx } from '../../types';
import { normalizeValue } from '../normalizers';
import { matchSpacing } from './spacing';

// Display property mapping
export const displayMap: Record<string, string> = {
  'block': 'block',
  'inline': 'inline',
  'inline-block': 'inline-block',
  'flex': 'flex',
  'inline-flex': 'inline-flex',
  'grid': 'grid',
  'inline-grid': 'inline-grid',
  'table': 'table',
  'table-row': 'table-row',
  'table-cell': 'table-cell',
  'contents': 'contents',
  'list-item': 'list-item',
  'hidden': 'hidden',
  'none': 'hidden',
};

// Position property mapping
export const positionMap: Record<string, string> = {
  'static': 'static',
  'relative': 'relative',
  'absolute': 'absolute',
  'fixed': 'fixed',
  'sticky': 'sticky',
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
 * Matches inset properties (top, right, bottom, left) to Tailwind classes
 * 
 * @param property The CSS property (top, right, bottom, left)
 * @param value The CSS value
 * @param ctx The matching context
 * @returns Array of Tailwind classes
 */
export function matchInset(
  property: 'top' | 'right' | 'bottom' | 'left',
  value: string,
  ctx: MatchCtx
): string[] {
  return matchSpacing(property, value, ctx);
}

/**
 * Matches the inset shorthand property to Tailwind classes
 * 
 * @param value The CSS inset value
 * @param ctx The matching context
 * @returns Array of Tailwind classes
 */
export function matchInsetShorthand(value: string, ctx: MatchCtx): string[] {
  // For inset shorthand, we need to handle each direction
  
  // Use spacing matcher for each direction
  const topClasses = matchSpacing('top', value, ctx);
  const rightClasses = matchSpacing('right', value, ctx);
  const bottomClasses = matchSpacing('bottom', value, ctx);
  const leftClasses = matchSpacing('left', value, ctx);
  
  // Combine all classes
  return [...topClasses, ...rightClasses, ...bottomClasses, ...leftClasses];
}

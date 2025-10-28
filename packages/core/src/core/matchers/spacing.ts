/**
 * Spacing matchers for Tailwind CSS
 */
import { MatchCtx } from '../../types';
import { parseBoxShorthand, toArbitrary } from '../normalizers';
import { resolveSpacingToken } from '../themeLoader';

// Mapping of prefix to Tailwind class prefix
const prefixMap: Record<string, string> = {
  'm': 'm',      // margin
  'p': 'p',      // padding
  'w': 'w',      // width
  'h': 'h',      // height
  'top': 'top',  // top
  'right': 'right', // right
  'bottom': 'bottom', // bottom
  'left': 'left', // left
};

// Mapping for margin/padding shorthand directions
const directionMap: Record<string, string[]> = {
  'm': ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'],
  'p': ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'],
};

/**
 * Matches spacing values to Tailwind classes
 * Supports shorthand notation for margin and padding
 * 
 * @param prefix The CSS property prefix (m, p, w, h, top, right, bottom, left)
 * @param raw The raw CSS value
 * @param ctx The matching context with theme
 * @returns Array of Tailwind classes
 */
export function matchSpacing(
  prefix: 'm' | 'p' | 'w' | 'h' | 'top' | 'right' | 'bottom' | 'left',
  raw: string,
  ctx: MatchCtx
): string[] {
  if (!raw || !prefix) return [];

  // Handle shorthand for margin and padding (1-4 values)
  if (prefix === 'm' || prefix === 'p') {
    return handleShorthand(prefix, raw, ctx);
  }

  // Handle single value properties (width, height, top, right, bottom, left)
  return handleSingleValue(prefix, raw, ctx);
}

/**
 * Handles shorthand notation for margin and padding
 * 
 * @param prefix The property prefix (m or p)
 * @param raw The raw CSS value
 * @param ctx The matching context
 * @returns Array of Tailwind classes
 */
function handleShorthand(prefix: 'm' | 'p', raw: string, ctx: MatchCtx): string[] {
  const values = parseBoxShorthand(raw);
  if (!values.length) return [];

  const directions = directionMap[prefix];
  const result: string[] = [];

  // If all values are the same, use the shorthand
  if (values.every(v => v === values[0])) {
    const cls = createSpacingClass(directions[0], values[0], ctx);
    if (cls) result.push(cls);
    return result;
  }
  
  // Handle two-value shorthand (vertical | horizontal)
  if (values.length === 2 || (values.length === 4 && values[0] === values[2] && values[1] === values[3])) {
    // Vertical value (same for top and bottom)
    const verticalCls = createSpacingClass(directions[2], values[0], ctx); // my/py
    if (verticalCls) result.push(verticalCls);
    
    // Horizontal value (same for left and right)
    const horizontalCls = createSpacingClass(directions[1], values[1], ctx); // mx/px
    if (horizontalCls) result.push(horizontalCls);
    
    return result;
  }

  // Handle three-value shorthand (top | horizontal | bottom)
  if (values.length === 3) {
    // Top value
    const topCls = createSpacingClass(directions[3], values[0], ctx); // mt/pt
    if (topCls) result.push(topCls);
    
    // Horizontal value (same for left and right)
    const horizontalCls = createSpacingClass(directions[1], values[1], ctx); // mx/px
    if (horizontalCls) result.push(horizontalCls);
    
    // Bottom value
    const bottomCls = createSpacingClass(directions[5], values[2], ctx); // mb/pb
    if (bottomCls) result.push(bottomCls);
    
    return result;
  }
  
  // If we have 4 different values, use individual directions
  if (values.length === 4) {
    // Top, Right, Bottom, Left
    const topCls = createSpacingClass(directions[3], values[0], ctx); // mt/pt
    const rightCls = createSpacingClass(directions[4], values[1], ctx); // mr/pr
    const bottomCls = createSpacingClass(directions[5], values[2], ctx); // mb/pb
    const leftCls = createSpacingClass(directions[6], values[3], ctx); // ml/pl
    
    if (topCls) result.push(topCls);
    if (rightCls) result.push(rightCls);
    if (bottomCls) result.push(bottomCls);
    if (leftCls) result.push(leftCls);
    
    return result;
  }

  return result;
}

/**
 * Handles single value properties (width, height, top, right, bottom, left)
 * 
 * @param prefix The property prefix
 * @param raw The raw CSS value
 * @param ctx The matching context
 * @returns Array of Tailwind classes
 */
function handleSingleValue(
  prefix: 'w' | 'h' | 'top' | 'right' | 'bottom' | 'left',
  raw: string,
  ctx: MatchCtx
): string[] {
  const cls = createSpacingClass(prefixMap[prefix], raw, ctx);
  return cls ? [cls] : [];
}

/**
 * Creates a Tailwind spacing class
 * 
 * @param prefix The Tailwind class prefix
 * @param value The CSS value
 * @param ctx The matching context
 * @returns Tailwind class or null if not matched
 */
function createSpacingClass(prefix: string, value: string, ctx: MatchCtx): string | null {
  // Special case for 0
  if (value === '0' || value === '0px') {
    return `${prefix}-0`;
  }

  // Special case for auto
  if (value === 'auto') {
    return `${prefix}-auto`;
  }

  // Try to resolve from theme
  const token = resolveSpacingToken(value, ctx.theme);
  if (token) {
    return `${prefix}-${token}`;
  }

  // Use arbitrary value if no match found
  return toArbitrary(prefix, value);
}

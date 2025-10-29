/**
 * Spacing matchers for Tailwind CSS
 *
 * @see SPEC.md → "Matching and Mapping Rules (v3 baseline)" → "Box model and dimensions" → "margin/padding"
 * @see SPEC.md → "Shorthand handling" → "margin/padding: decompose 1–4 values into sides and axes"
 * @see SPEC.md → "Spacing resolution"
 *
 * Edge cases handled:
 * - '0' and 'auto' have special handling (see SPEC.md)
 * - Shorthand decomposition into 1-4 values
 * - Approximate matching within threshold
 */
import { MatchCtx } from '../../types';
import { parseBoxShorthand, toArbitrary } from '../normalizers';
import { resolveSpacingToken } from '../resolvers';

// Mapping of prefix to Tailwind class prefix
const prefixMap: Record<string, string> = {
  // Margin
  m: 'm', // margin
  mt: 'mt', // margin-top
  mr: 'mr', // margin-right
  mb: 'mb', // margin-bottom
  ml: 'ml', // margin-left

  // Padding
  p: 'p', // padding
  pt: 'pt', // padding-top
  pr: 'pr', // padding-right
  pb: 'pb', // padding-bottom
  pl: 'pl', // padding-left

  // Sizing
  w: 'w', // width
  h: 'h', // height
  'min-w': 'min-w', // min-width
  'min-h': 'min-h', // min-height
  'max-w': 'max-w', // max-width
  'max-h': 'max-h', // max-height

  // Positioning
  top: 'top', // top
  right: 'right', // right
  bottom: 'bottom', // bottom
  left: 'left', // left
};

// Mapping for margin/padding shorthand directions
const directionMap: Record<string, string[]> = {
  m: ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'],
  p: ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl'],
};

/**
 * Matches spacing values to Tailwind classes
 * Supports shorthand notation for margin and padding
 *
 * @param prefix The CSS property prefix
 * @param raw The raw CSS value
 * @param ctx The matching context with theme
 * @returns Object with classes and warnings
 */
export function matchSpacing(
  prefix: string,
  raw: string,
  ctx: MatchCtx
): { classes: string[]; warnings: string[] } {
  if (!raw || !prefix) return { classes: [], warnings: [] };

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
 * @returns Array of Tailwind classes and warnings
 */
function handleShorthand(
  prefix: 'm' | 'p',
  raw: string,
  ctx: MatchCtx
): { classes: string[]; warnings: string[] } {
  const values = parseBoxShorthand(raw);
  if (!values.length) return { classes: [], warnings: [] };

  const directions = directionMap[prefix];
  const classes: string[] = [];
  const warnings: string[] = [];

  // If all values are the same, use the shorthand
  if (values.every((v) => v === values[0])) {
    const result = createSpacingClass(directions[0], values[0], ctx);
    if (result.class) classes.push(result.class);
    if (result.warning) warnings.push(result.warning);
    return { classes, warnings };
  }

  // Handle two-value shorthand (vertical | horizontal)
  if (
    values.length === 2 ||
    (values.length === 4 && values[0] === values[2] && values[1] === values[3])
  ) {
    // Vertical value (same for top and bottom)
    const verticalResult = createSpacingClass(directions[2], values[0], ctx); // my/py
    if (verticalResult.class) classes.push(verticalResult.class);
    if (verticalResult.warning) warnings.push(verticalResult.warning);

    // Horizontal value (same for left and right)
    const horizontalResult = createSpacingClass(directions[1], values[1], ctx); // mx/px
    if (horizontalResult.class) classes.push(horizontalResult.class);
    if (horizontalResult.warning) warnings.push(horizontalResult.warning);

    return { classes, warnings };
  }

  // Handle three-value shorthand (top | horizontal | bottom)
  if (values.length === 3) {
    // Top value
    const topResult = createSpacingClass(directions[3], values[0], ctx); // mt/pt
    if (topResult.class) classes.push(topResult.class);
    if (topResult.warning) warnings.push(topResult.warning);

    // Horizontal value (same for left and right)
    const horizontalResult = createSpacingClass(directions[1], values[1], ctx); // mx/px
    if (horizontalResult.class) classes.push(horizontalResult.class);
    if (horizontalResult.warning) warnings.push(horizontalResult.warning);

    // Bottom value
    const bottomResult = createSpacingClass(directions[5], values[2], ctx); // mb/pb
    if (bottomResult.class) classes.push(bottomResult.class);
    if (bottomResult.warning) warnings.push(bottomResult.warning);

    return { classes, warnings };
  }

  // If we have 4 different values, use individual directions
  if (values.length === 4) {
    // Top, Right, Bottom, Left
    const topResult = createSpacingClass(directions[3], values[0], ctx); // mt/pt
    const rightResult = createSpacingClass(directions[4], values[1], ctx); // mr/pr
    const bottomResult = createSpacingClass(directions[5], values[2], ctx); // mb/pb
    const leftResult = createSpacingClass(directions[6], values[3], ctx); // ml/pl

    if (topResult.class) classes.push(topResult.class);
    if (rightResult.class) classes.push(rightResult.class);
    if (bottomResult.class) classes.push(bottomResult.class);
    if (leftResult.class) classes.push(leftResult.class);

    if (topResult.warning) warnings.push(topResult.warning);
    if (rightResult.warning) warnings.push(rightResult.warning);
    if (bottomResult.warning) warnings.push(bottomResult.warning);
    if (leftResult.warning) warnings.push(leftResult.warning);

    return { classes, warnings };
  }

  return { classes, warnings };
}

/**
 * Handles single value properties
 *
 * @param prefix The property prefix
 * @param raw The raw CSS value
 * @param ctx The matching context
 * @returns Array of Tailwind classes and warnings
 */
function handleSingleValue(
  prefix: string,
  raw: string,
  ctx: MatchCtx
): { classes: string[]; warnings: string[] } {
  const result = createSpacingClass(prefixMap[prefix], raw, ctx);
  const classes: string[] = result.class ? [result.class] : [];
  const warnings: string[] = result.warning ? [result.warning] : [];
  return { classes, warnings };
}

/**
 * Creates a Tailwind spacing class
 *
 * @param prefix The Tailwind class prefix
 * @param value The CSS value
 * @param ctx The matching context
 * @returns Object with Tailwind class and warning if approximate
 */
function createSpacingClass(
  prefix: string,
  value: string,
  ctx: MatchCtx
): { class: string | null; warning?: string } {
  // Special case for 0
  if (value === '0' || value === '0px') {
    return { class: `${prefix}-0` };
  }

  // Special case for auto
  if (value === 'auto') {
    return { class: `${prefix}-auto` };
  }

  // Try to resolve from theme or tokens with approximation if enabled and not in strict mode
  const result = resolveSpacingToken(value, ctx);

  if (result.token) {
    // If there's a warning, pass it through
    if (result.warning) {
      return {
        class: `${prefix}-${result.token}`,
        warning: result.warning,
      };
    }

    // Exact match
    return { class: `${prefix}-${result.token}` };
  }

  // Use arbitrary value if no match found
  return { class: toArbitrary(prefix, value) };
}

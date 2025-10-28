/**
 * Flexbox and Grid matchers for Tailwind CSS
 */
import { MatchCtx } from '../../types';
import { normalizeValue, toArbitrary } from '../normalizers';

// Flex direction mapping
const flexDirectionMap: Record<string, string> = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  column: 'flex-col',
  'column-reverse': 'flex-col-reverse',
  col: 'flex-col', // Alias for column
  'col-reverse': 'flex-col-reverse', // Alias for column-reverse
};

// Justify content mapping
const justifyContentMap: Record<string, string> = {
  'flex-start': 'justify-start',
  start: 'justify-start',
  'flex-end': 'justify-end',
  end: 'justify-end',
  center: 'justify-center',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
  'space-evenly': 'justify-evenly',
  stretch: 'justify-stretch',
};

// Align items mapping
const alignItemsMap: Record<string, string> = {
  'flex-start': 'items-start',
  start: 'items-start',
  'flex-end': 'items-end',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

// Place content mapping
const placeContentMap: Record<string, string> = {
  center: 'place-content-center',
  start: 'place-content-start',
  end: 'place-content-end',
  'space-between': 'place-content-between',
  'space-around': 'place-content-around',
  'space-evenly': 'place-content-evenly',
  stretch: 'place-content-stretch',
};

// Place items mapping
const placeItemsMap: Record<string, string> = {
  start: 'place-items-start',
  end: 'place-items-end',
  center: 'place-items-center',
  stretch: 'place-items-stretch',
};

// Place self mapping
const placeSelfMap: Record<string, string> = {
  auto: 'place-self-auto',
  start: 'place-self-start',
  end: 'place-self-end',
  center: 'place-self-center',
  stretch: 'place-self-stretch',
};

/**
 * Matches flex direction values to Tailwind classes
 *
 * @param value The CSS flex-direction value
 * @returns Tailwind class
 */
export function matchFlexDirection(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Check for predefined flex directions
  if (flexDirectionMap[normalizedValue]) {
    return flexDirectionMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return toArbitrary('flex', normalizedValue);
}

/**
 * Matches justify content values to Tailwind classes
 *
 * @param value The CSS justify-content value
 * @returns Tailwind class
 */
export function matchJustifyContent(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Check for predefined justify content values
  if (justifyContentMap[normalizedValue]) {
    return justifyContentMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return toArbitrary('justify', normalizedValue);
}

/**
 * Matches align items values to Tailwind classes
 *
 * @param value The CSS align-items value
 * @returns Tailwind class
 */
export function matchAlignItems(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Check for predefined align items values
  if (alignItemsMap[normalizedValue]) {
    return alignItemsMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return toArbitrary('items', normalizedValue);
}

/**
 * Matches gap values to Tailwind classes
 *
 * @param direction The gap direction ('', 'x', or 'y')
 * @param value The CSS gap value
 * @param ctx The matching context
 * @returns Tailwind class
 */
export function matchGap(direction: '' | 'x' | 'y', value: string, ctx: MatchCtx): string {
  if (!value) return '';

  const prefix = direction ? `gap-${direction}` : 'gap';

  // Try to resolve from theme
  const token = ctx.theme?.spacing ? ctx.theme.spacing[value] : null;
  if (token) {
    // If the value is directly in the theme, use it
    return `${prefix}-${value}`;
  }

  // Check for theme values by normalizing
  const normalizedValue = normalizeValue(value);
  for (const [key, themeValue] of Object.entries(ctx.theme?.spacing || {})) {
    if (normalizeValue(themeValue as string) === normalizedValue) {
      return `${prefix}-${key}`;
    }
  }

  // Use arbitrary value if no match found
  return toArbitrary(prefix, value);
}

/**
 * Matches grid-template-columns values to Tailwind classes
 *
 * @param value The CSS grid-template-columns value
 * @returns Tailwind class
 */
export function matchGridTemplateColumns(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle repeat(N, minmax(0, 1fr)) pattern with flexible whitespace
  const cleanedValue = normalizedValue.replace(/\s+/g, '');
  const repeatPattern = /^repeat\((\d+),minmax\(0,1fr\)\)$/;
  const match = cleanedValue.match(repeatPattern);

  if (match) {
    const columns = parseInt(match[1], 10);
    if (columns >= 1 && columns <= 12) {
      return `grid-cols-${columns}`;
    }
  }

  // Handle simple integer values for number of columns
  if (/^\d+$/.test(normalizedValue)) {
    const columns = parseInt(normalizedValue, 10);
    if (columns >= 1 && columns <= 12) {
      return `grid-cols-${columns}`;
    }
  }

  // Use arbitrary value if no match found
  return toArbitrary('grid-cols', normalizedValue);
}

/**
 * Matches place-content values to Tailwind classes
 *
 * @param value The CSS place-content value
 * @returns Tailwind class
 */
export function matchPlaceContent(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Check for predefined place-content values
  if (placeContentMap[normalizedValue]) {
    return placeContentMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return toArbitrary('place-content', normalizedValue);
}

/**
 * Matches place-items values to Tailwind classes
 *
 * @param value The CSS place-items value
 * @returns Tailwind class
 */
export function matchPlaceItems(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Check for predefined place-items values
  if (placeItemsMap[normalizedValue]) {
    return placeItemsMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return toArbitrary('place-items', normalizedValue);
}

/**
 * Matches place-self values to Tailwind classes
 *
 * @param value The CSS place-self value
 * @returns Tailwind class
 */
export function matchPlaceSelf(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Check for predefined place-self values
  if (placeSelfMap[normalizedValue]) {
    return placeSelfMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return toArbitrary('place-self', normalizedValue);
}

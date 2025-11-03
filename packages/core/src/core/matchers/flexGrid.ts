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

/**
 * Matches flex-basis values to Tailwind classes
 *
 * @param value The CSS flex-basis value
 * @param ctx The matching context
 * @returns Tailwind class
 */
export function matchFlexBasis(value: string, ctx: MatchCtx): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle common values
  if (normalizedValue === 'auto') {
    return 'basis-auto';
  }

  if (normalizedValue === '0' || normalizedValue === '0px') {
    return 'basis-0';
  }

  if (normalizedValue === '1' || normalizedValue === '100%') {
    return 'basis-full';
  }

  if (normalizedValue === '50%') {
    return 'basis-1/2';
  }

  if (normalizedValue === '33.333333%' || normalizedValue === '33.33%') {
    return 'basis-1/3';
  }

  if (normalizedValue === '66.666667%' || normalizedValue === '66.67%') {
    return 'basis-2/3';
  }

  if (normalizedValue === '25%') {
    return 'basis-1/4';
  }

  if (normalizedValue === '75%') {
    return 'basis-3/4';
  }

  if (normalizedValue === '20%') {
    return 'basis-1/5';
  }

  if (normalizedValue === '40%') {
    return 'basis-2/5';
  }

  if (normalizedValue === '60%') {
    return 'basis-3/5';
  }

  if (normalizedValue === '80%') {
    return 'basis-4/5';
  }

  // Try to resolve from spacing tokens
  if (ctx.theme?.spacing) {
    for (const [key, themeValue] of Object.entries(ctx.theme.spacing)) {
      if (normalizeValue(themeValue as string) === normalizedValue) {
        return `basis-${key}`;
      }
    }
  }

  // Use arbitrary value if no match found
  return toArbitrary('basis', normalizedValue);
}

/**
 * Matches flex-grow values to Tailwind classes
 *
 * @param value The CSS flex-grow value
 * @returns Tailwind class
 */
export function matchFlexGrow(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle common values
  if (normalizedValue === '0') {
    return 'grow-0';
  }

  if (normalizedValue === '1') {
    return 'grow';
  }

  // Use arbitrary value if no match found
  return toArbitrary('grow', normalizedValue);
}

/**
 * Matches flex-shrink values to Tailwind classes
 *
 * @param value The CSS flex-shrink value
 * @returns Tailwind class
 */
export function matchFlexShrink(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle common values
  if (normalizedValue === '0') {
    return 'shrink-0';
  }

  if (normalizedValue === '1') {
    return 'shrink';
  }

  // Use arbitrary value if no match found
  return toArbitrary('shrink', normalizedValue);
}

/**
 * Matches grid-auto-flow values to Tailwind classes
 *
 * @param value The CSS grid-auto-flow value
 * @returns Tailwind class
 */
export function matchGridAutoFlow(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Map grid-auto-flow values to Tailwind classes
  const flowMap: Record<string, string> = {
    row: 'grid-flow-row',
    column: 'grid-flow-col',
    dense: 'grid-flow-dense',
    'row dense': 'grid-flow-row-dense',
    'column dense': 'grid-flow-col-dense',
    // Aliases
    col: 'grid-flow-col',
    'col dense': 'grid-flow-col-dense',
  };

  if (flowMap[normalizedValue]) {
    return flowMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return toArbitrary('grid-flow', normalizedValue);
}

/**
 * Matches grid-column values to Tailwind classes
 *
 * @param value The CSS grid-column value
 * @returns Tailwind class or array of classes
 */
export function matchGridColumn(value: string): string | string[] {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle span values
  const spanMatch = normalizedValue.match(/^span\s+(\d+)$/i);
  if (spanMatch) {
    const span = parseInt(spanMatch[1], 10);
    if (span >= 1 && span <= 12) {
      return `col-span-${span}`;
    }
    return toArbitrary('col-span', span.toString());
  }

  // Handle specific grid line values
  const lineMatch = normalizedValue.match(/^(\d+)\s*\/\s*(\d+|span\s+\d+)$/i);
  if (lineMatch) {
    const start = parseInt(lineMatch[1], 10);
    const classes = [];

    // Add start class
    if (start >= 1 && start <= 13) {
      classes.push(`col-start-${start}`);
    } else {
      classes.push(toArbitrary('col-start', start.toString()));
    }

    // Handle end value
    const endValue = lineMatch[2];
    const endSpanMatch = endValue.match(/span\s+(\d+)/i);

    if (endSpanMatch) {
      const span = parseInt(endSpanMatch[1], 10);
      if (span >= 1 && span <= 12) {
        classes.push(`col-span-${span}`);
      } else {
        classes.push(toArbitrary('col-span', span.toString()));
      }
    } else {
      const end = parseInt(endValue, 10);
      if (end >= 1 && end <= 13) {
        classes.push(`col-end-${end}`);
      } else {
        classes.push(toArbitrary('col-end', end.toString()));
      }
    }

    return classes;
  }

  // Handle auto
  if (normalizedValue === 'auto') {
    return 'col-auto';
  }

  // Use arbitrary value if no match found
  return toArbitrary('col', normalizedValue);
}

/**
 * Matches grid-row values to Tailwind classes
 *
 * @param value The CSS grid-row value
 * @returns Tailwind class or array of classes
 */
export function matchGridRow(value: string): string | string[] {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle span values
  const spanMatch = normalizedValue.match(/^span\s+(\d+)$/i);
  if (spanMatch) {
    const span = parseInt(spanMatch[1], 10);
    if (span >= 1 && span <= 6) {
      return `row-span-${span}`;
    }
    return toArbitrary('row-span', span.toString());
  }

  // Handle specific grid line values
  const lineMatch = normalizedValue.match(/^(\d+)\s*\/\s*(\d+|span\s+\d+)$/i);
  if (lineMatch) {
    const start = parseInt(lineMatch[1], 10);
    const classes = [];

    // Add start class
    if (start >= 1 && start <= 7) {
      classes.push(`row-start-${start}`);
    } else {
      classes.push(toArbitrary('row-start', start.toString()));
    }

    // Handle end value
    const endValue = lineMatch[2];
    const endSpanMatch = endValue.match(/span\s+(\d+)/i);

    if (endSpanMatch) {
      const span = parseInt(endSpanMatch[1], 10);
      if (span >= 1 && span <= 6) {
        classes.push(`row-span-${span}`);
      } else {
        classes.push(toArbitrary('row-span', span.toString()));
      }
    } else {
      const end = parseInt(endValue, 10);
      if (end >= 1 && end <= 7) {
        classes.push(`row-end-${end}`);
      } else {
        classes.push(toArbitrary('row-end', end.toString()));
      }
    }

    return classes;
  }

  // Handle auto
  if (normalizedValue === 'auto') {
    return 'row-auto';
  }

  // Use arbitrary value if no match found
  return toArbitrary('row', normalizedValue);
}

/**
 * Matches grid-column-start values to Tailwind classes
 *
 * @param value The CSS grid-column-start value
 * @returns Tailwind class
 */
export function matchGridColumnStart(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle numeric values
  if (/^\d+$/.test(normalizedValue)) {
    const start = parseInt(normalizedValue, 10);
    if (start >= 1 && start <= 13) {
      return `col-start-${start}`;
    }
  }

  // Handle auto
  if (normalizedValue === 'auto') {
    return 'col-start-auto';
  }

  // Use arbitrary value if no match found
  return toArbitrary('col-start', normalizedValue);
}

/**
 * Matches grid-column-end values to Tailwind classes
 *
 * @param value The CSS grid-column-end value
 * @returns Tailwind class
 */
export function matchGridColumnEnd(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle numeric values
  if (/^\d+$/.test(normalizedValue)) {
    const end = parseInt(normalizedValue, 10);
    if (end >= 1 && end <= 13) {
      return `col-end-${end}`;
    }
  }

  // Handle auto
  if (normalizedValue === 'auto') {
    return 'col-end-auto';
  }

  // Use arbitrary value if no match found
  return toArbitrary('col-end', normalizedValue);
}

/**
 * Matches grid-row-start values to Tailwind classes
 *
 * @param value The CSS grid-row-start value
 * @returns Tailwind class
 */
export function matchGridRowStart(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle numeric values
  if (/^\d+$/.test(normalizedValue)) {
    const start = parseInt(normalizedValue, 10);
    if (start >= 1 && start <= 7) {
      return `row-start-${start}`;
    }
  }

  // Handle auto
  if (normalizedValue === 'auto') {
    return 'row-start-auto';
  }

  // Use arbitrary value if no match found
  return toArbitrary('row-start', normalizedValue);
}

/**
 * Matches grid-row-end values to Tailwind classes
 *
 * @param value The CSS grid-row-end value
 * @returns Tailwind class
 */
export function matchGridRowEnd(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle numeric values
  if (/^\d+$/.test(normalizedValue)) {
    const end = parseInt(normalizedValue, 10);
    if (end >= 1 && end <= 7) {
      return `row-end-${end}`;
    }
  }

  // Handle auto
  if (normalizedValue === 'auto') {
    return 'row-end-auto';
  }

  // Use arbitrary value if no match found
  return toArbitrary('row-end', normalizedValue);
}

/**
 * Matches grid-template-areas values to Tailwind classes
 * Always uses arbitrary values as grid-template-areas is too complex for predefined classes
 *
 * @param value The CSS grid-template-areas value
 * @param _ctx Match context (for future extensibility)
 * @returns Tailwind class with arbitrary value
 */
export function matchGridTemplateAreas(value: string, _ctx?: MatchCtx): string {
  if (!value) return '';

  // grid-template-areas always uses arbitrary values
  // The value is already formatted as a string with quotes
  return `[grid-template-areas:${value}]`;
}

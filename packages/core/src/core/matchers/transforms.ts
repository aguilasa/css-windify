/**
 * Transform matchers for Tailwind CSS
 * Handles translate, scale, rotate, skew, and combined transform properties
 */
import { MatchCtx } from '../../types';
import { normalizeValue, toArbitrary } from '../normalizers';

// Translate mappings for common values
const translateMap: Record<string, string> = {
  '0': '0',
  '0px': '0',
  '0.125rem': '0.5',
  '0.25rem': '1',
  '0.375rem': '1.5',
  '0.5rem': '2',
  '0.625rem': '2.5',
  '0.75rem': '3',
  '0.875rem': '3.5',
  '1rem': '4',
  '1.25rem': '5',
  '1.5rem': '6',
  '1.75rem': '7',
  '2rem': '8',
  '2.25rem': '9',
  '2.5rem': '10',
  '2.75rem': '11',
  '3rem': '12',
  '50%': '1/2',
  '100%': 'full',
};

// Scale mappings
const scaleMap: Record<string, string> = {
  '0': '0',
  '0.5': '50',
  '0.75': '75',
  '0.9': '90',
  '0.95': '95',
  '1': '100',
  '1.05': '105',
  '1.1': '110',
  '1.25': '125',
  '1.5': '150',
};

// Rotate mappings
const rotateMap: Record<string, string> = {
  '0deg': '0',
  '1deg': '1',
  '2deg': '2',
  '3deg': '3',
  '6deg': '6',
  '12deg': '12',
  '45deg': '45',
  '90deg': '90',
  '180deg': '180',
  '-180deg': '-180',
  '-90deg': '-90',
  '-45deg': '-45',
  '-12deg': '-12',
  '-6deg': '-6',
  '-3deg': '-3',
  '-2deg': '-2',
  '-1deg': '-1',
};

// Skew mappings
const skewMap: Record<string, string> = {
  '0deg': '0',
  '1deg': '1',
  '2deg': '2',
  '3deg': '3',
  '6deg': '6',
  '12deg': '12',
  '-12deg': '-12',
  '-6deg': '-6',
  '-3deg': '-3',
  '-2deg': '-2',
  '-1deg': '-1',
};

/**
 * Parse a transform function from CSS transform value
 * Examples: translate(10px, 20px), scale(1.5), rotate(45deg)
 */
function parseTransformFunction(func: string): { name: string; values: string[] } | null {
  const match = func.trim().match(/^([\w-]+)\(([^)]+)\)$/);
  if (!match) return null;

  const [, name, valuesStr] = match;
  const values = valuesStr.split(',').map((v) => v.trim());
  return { name: name.toLowerCase(), values };
}

/**
 * Matches translate values to Tailwind classes
 *
 * @param value The CSS translate value (e.g., "10px", "50%", "10px 20px")
 * @param axis Optional axis ('x' or 'y')
 * @param _ctx Match context (for future extensibility)
 * @returns Tailwind class
 */
export function matchTranslate(value: string, axis?: 'x' | 'y', _ctx?: MatchCtx): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle two-value syntax (translateX translateY)
  if (!axis && normalizedValue.includes(' ')) {
    const [x, y] = normalizedValue.split(/\s+/);
    const xClass = matchTranslate(x, 'x');
    const yClass = matchTranslate(y, 'y');
    return [xClass, yClass].filter(Boolean).join(' ');
  }

  const prefix = axis ? `translate-${axis}` : 'translate-x';

  // Check for predefined values
  if (translateMap[normalizedValue]) {
    return `${prefix}-${translateMap[normalizedValue]}`;
  }

  // Handle negative values
  if (normalizedValue.startsWith('-')) {
    const positiveValue = normalizedValue.slice(1);
    if (translateMap[positiveValue]) {
      return `-${prefix}-${translateMap[positiveValue]}`;
    }
  }

  // Use arbitrary value
  return toArbitrary(prefix, normalizedValue);
}

/**
 * Matches scale values to Tailwind classes
 *
 * @param value The CSS scale value (e.g., "1.5", "0.75")
 * @param axis Optional axis ('x' or 'y')
 * @param _ctx Match context (for future extensibility)
 * @returns Tailwind class
 */
export function matchScale(value: string, axis?: 'x' | 'y', _ctx?: MatchCtx): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle two-value syntax (scaleX scaleY)
  if (!axis && normalizedValue.includes(' ')) {
    const [x, y] = normalizedValue.split(/\s+/);
    const xClass = matchScale(x, 'x');
    const yClass = matchScale(y, 'y');
    return [xClass, yClass].filter(Boolean).join(' ');
  }

  const prefix = axis ? `scale-${axis}` : 'scale';

  // Check for predefined values
  if (scaleMap[normalizedValue]) {
    return `${prefix}-${scaleMap[normalizedValue]}`;
  }

  // Use arbitrary value
  return toArbitrary(prefix, normalizedValue);
}

/**
 * Matches rotate values to Tailwind classes
 *
 * @param value The CSS rotate value (e.g., "45deg", "-90deg")
 * @param _ctx Match context (for future extensibility)
 * @returns Tailwind class
 */
export function matchRotate(value: string, _ctx?: MatchCtx): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Check for predefined values
  if (rotateMap[normalizedValue]) {
    return `rotate-${rotateMap[normalizedValue]}`;
  }

  // Use arbitrary value
  return toArbitrary('rotate', normalizedValue);
}

/**
 * Matches skew values to Tailwind classes
 *
 * @param value The CSS skew value (e.g., "3deg", "-6deg")
 * @param axis Optional axis ('x' or 'y')
 * @param _ctx Match context (for future extensibility)
 * @returns Tailwind class
 */
export function matchSkew(value: string, axis?: 'x' | 'y', _ctx?: MatchCtx): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle two-value syntax (skewX skewY)
  if (!axis && normalizedValue.includes(' ')) {
    const [x, y] = normalizedValue.split(/\s+/);
    const xClass = matchSkew(x, 'x');
    const yClass = matchSkew(y, 'y');
    return [xClass, yClass].filter(Boolean).join(' ');
  }

  const prefix = axis ? `skew-${axis}` : 'skew-x';

  // Check for predefined values
  if (skewMap[normalizedValue]) {
    return `${prefix}-${skewMap[normalizedValue]}`;
  }

  // Use arbitrary value
  return toArbitrary(prefix, normalizedValue);
}

/**
 * Matches transform shorthand with multiple functions
 *
 * @param value The CSS transform value (e.g., "translate(10px, 20px) rotate(45deg)")
 * @param _ctx Match context (for future extensibility)
 * @returns Object with classes array and optional warning
 */
export function matchTransform(
  value: string,
  _ctx?: MatchCtx
): { classes: string[]; warning?: string } {
  if (!value) return { classes: [] };

  const normalizedValue = normalizeValue(value);

  // Handle "none"
  if (normalizedValue === 'none') {
    return { classes: [] };
  }

  // Parse multiple transform functions
  const functions = value.match(/[\w-]+\([^)]+\)/g);

  if (!functions || functions.length === 0) {
    // Unable to parse, use arbitrary
    return {
      classes: [toArbitrary('transform', value)],
      warning: `Unable to parse transform value: ${value}, used arbitrary value`,
    };
  }

  const classes: string[] = [];
  const unmatchedFunctions: string[] = [];

  for (const func of functions) {
    const parsed = parseTransformFunction(func);
    if (!parsed) {
      unmatchedFunctions.push(func);
      continue;
    }

    const { name, values } = parsed;

    switch (name) {
      case 'translate': {
        if (values.length === 1) {
          classes.push(matchTranslate(values[0], 'x'));
        } else if (values.length === 2) {
          classes.push(matchTranslate(values[0], 'x'));
          classes.push(matchTranslate(values[1], 'y'));
        }
        break;
      }

      case 'translatex': {
        classes.push(matchTranslate(values[0], 'x'));
        break;
      }

      case 'translatey': {
        classes.push(matchTranslate(values[0], 'y'));
        break;
      }

      case 'scale': {
        if (values.length === 1) {
          classes.push(matchScale(values[0]));
        } else if (values.length === 2) {
          classes.push(matchScale(values[0], 'x'));
          classes.push(matchScale(values[1], 'y'));
        }
        break;
      }

      case 'scalex': {
        classes.push(matchScale(values[0], 'x'));
        break;
      }

      case 'scaley': {
        classes.push(matchScale(values[0], 'y'));
        break;
      }

      case 'rotate': {
        classes.push(matchRotate(values[0]));
        break;
      }

      case 'skew': {
        if (values.length === 1) {
          classes.push(matchSkew(values[0], 'x'));
        } else if (values.length === 2) {
          classes.push(matchSkew(values[0], 'x'));
          classes.push(matchSkew(values[1], 'y'));
        }
        break;
      }

      case 'skewx': {
        classes.push(matchSkew(values[0], 'x'));
        break;
      }

      case 'skewy': {
        classes.push(matchSkew(values[0], 'y'));
        break;
      }

      default: {
        unmatchedFunctions.push(func);
      }
    }
  }

  // If we have unmatched functions, add them as arbitrary
  if (unmatchedFunctions.length > 0) {
    classes.push(toArbitrary('transform', value));
    return {
      classes,
      warning: `Some transform functions not matched: ${unmatchedFunctions.join(', ')}`,
    };
  }

  // If no classes were generated, use arbitrary for the whole value
  if (classes.length === 0) {
    return {
      classes: [toArbitrary('transform', value)],
      warning: `No Tailwind classes found for transform: ${value}, used arbitrary value`,
    };
  }

  return { classes };
}

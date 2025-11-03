/**
 * Miscellaneous matchers for Tailwind CSS (overflow, z-index, opacity, box-shadow, filter)
 */
import { normalizeValue, toArbitrary, arbitraryProperty } from '../normalizers';
import type { MatchCtx } from '../../types';

// Overflow mapping
const overflowMap: Record<string, string> = {
  visible: 'overflow-visible',
  hidden: 'overflow-hidden',
  scroll: 'overflow-scroll',
  auto: 'overflow-auto',
};

// Z-index common values
const zIndexMap: Record<string, string> = {
  '0': 'z-0',
  '10': 'z-10',
  '20': 'z-20',
  '30': 'z-30',
  '40': 'z-40',
  '50': 'z-50',
  auto: 'z-auto',
};

/**
 * Matches overflow values to Tailwind classes
 *
 * @param value The CSS overflow value
 * @param axis Optional axis ('x' or 'y') for overflow-x or overflow-y
 * @returns Tailwind class
 */
export function matchOverflow(value: string, axis?: 'x' | 'y'): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);
  const prefix = axis ? `overflow-${axis}` : 'overflow';

  // Check for predefined overflow values
  if (overflowMap[normalizedValue]) {
    const baseClass = overflowMap[normalizedValue];
    // Replace 'overflow-' with the correct prefix if needed
    return axis ? baseClass.replace('overflow-', prefix + '-') : baseClass;
  }

  // Use arbitrary value if no match found
  return toArbitrary(prefix, normalizedValue);
}

/**
 * Matches z-index values to Tailwind classes
 *
 * @param value The CSS z-index value
 * @returns Tailwind class
 */
export function matchZIndex(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Check for predefined z-index values
  if (zIndexMap[normalizedValue]) {
    return zIndexMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return toArbitrary('z', normalizedValue);
}

/**
 * Matches opacity values to Tailwind classes
 *
 * @param value The CSS opacity value
 * @returns Tailwind class
 */
export function matchOpacity(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Handle percentage values
  if (normalizedValue.endsWith('%')) {
    const percentage = parseInt(normalizedValue, 10);
    if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
      return `opacity-${percentage}`;
    }
  }

  // Handle decimal values (0-1)
  const floatValue = parseFloat(normalizedValue);
  if (!isNaN(floatValue) && floatValue >= 0 && floatValue <= 1) {
    const percentage = Math.round(floatValue * 100);
    return `opacity-${percentage}`;
  }

  // Use arbitrary value if no match found
  return toArbitrary('opacity', normalizedValue);
}

/**
 * Normalize box-shadow value for comparison
 * Removes extra spaces and normalizes rgb/rgba format
 */
function normalizeBoxShadow(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      // Normalize spaces around commas
      .replace(/\s*,\s*/g, ',')
      // Normalize multiple spaces to single space
      .replace(/\s+/g, ' ')
      // Normalize rgb/rgba format
      .replace(/rgb\(\s*/g, 'rgb(')
      .replace(/rgba\(\s*/g, 'rgba(')
      .replace(/\s*\/\s*/g, '/')
      // Remove spaces before closing parenthesis
      .replace(/\s+\)/g, ')')
  );
}

// Box-shadow token mapping (Tailwind v3 default values)
const boxShadowMap: Record<string, string> = {
  none: 'shadow-none',
  '0 1px 2px 0 rgb(0 0 0/0.05)': 'shadow-sm',
  '0 1px 3px 0 rgb(0 0 0/0.1),0 1px 2px -1px rgb(0 0 0/0.1)': 'shadow',
  '0 4px 6px -1px rgb(0 0 0/0.1),0 2px 4px -2px rgb(0 0 0/0.1)': 'shadow-md',
  '0 10px 15px -3px rgb(0 0 0/0.1),0 4px 6px -4px rgb(0 0 0/0.1)': 'shadow-lg',
  '0 20px 25px -5px rgb(0 0 0/0.1),0 8px 10px -6px rgb(0 0 0/0.1)': 'shadow-xl',
  '0 25px 50px -12px rgb(0 0 0/0.25)': 'shadow-2xl',
  // Alternative formats with rgba
  '0 1px 2px 0 rgba(0,0,0,0.05)': 'shadow-sm',
  '0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px -1px rgba(0,0,0,0.1)': 'shadow',
  '0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -2px rgba(0,0,0,0.1)': 'shadow-md',
  '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -4px rgba(0,0,0,0.1)': 'shadow-lg',
  '0 20px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(0,0,0,0.1)': 'shadow-xl',
  '0 25px 50px -12px rgba(0,0,0,0.25)': 'shadow-2xl',
};

/**
 * Matches box-shadow values to Tailwind classes
 *
 * @param value The CSS box-shadow value
 * @param ctx Match context (for future extensibility)
 * @returns Object with class and optional warning
 */
export function matchBoxShadow(
  value: string,
  _ctx?: MatchCtx
): { class: string; warning?: string } {
  if (!value) {
    return { class: '' };
  }

  const normalizedValue = normalizeBoxShadow(value);

  // Check for exact match in token map
  if (boxShadowMap[normalizedValue]) {
    return { class: boxShadowMap[normalizedValue] };
  }

  // Check for "none"
  if (normalizedValue === 'none') {
    return { class: 'shadow-none' };
  }

  // Use arbitrary value for custom shadows
  const arbitraryClass = toArbitrary('shadow', value);
  return {
    class: arbitraryClass,
    warning: `No exact Tailwind token for box-shadow: ${value}, used arbitrary value`,
  };
}

// Filter function mappings
const blurMap: Record<string, string> = {
  '0': 'blur-none',
  '4px': 'blur-sm',
  '8px': 'blur',
  '12px': 'blur-md',
  '16px': 'blur-lg',
  '24px': 'blur-xl',
  '40px': 'blur-2xl',
  '64px': 'blur-3xl',
};

const brightnessMap: Record<string, string> = {
  '0': 'brightness-0',
  '0.5': 'brightness-50',
  '0.75': 'brightness-75',
  '0.9': 'brightness-90',
  '0.95': 'brightness-95',
  '1': 'brightness-100',
  '1.05': 'brightness-105',
  '1.1': 'brightness-110',
  '1.25': 'brightness-125',
  '1.5': 'brightness-150',
  '2': 'brightness-200',
};

const contrastMap: Record<string, string> = {
  '0': 'contrast-0',
  '0.5': 'contrast-50',
  '0.75': 'contrast-75',
  '1': 'contrast-100',
  '1.25': 'contrast-125',
  '1.5': 'contrast-150',
  '2': 'contrast-200',
};

const grayscaleMap: Record<string, string> = {
  '0': 'grayscale-0',
  '1': 'grayscale',
};

const hueRotateMap: Record<string, string> = {
  '0deg': 'hue-rotate-0',
  '15deg': 'hue-rotate-15',
  '30deg': 'hue-rotate-30',
  '60deg': 'hue-rotate-60',
  '90deg': 'hue-rotate-90',
  '180deg': 'hue-rotate-180',
};

const invertMap: Record<string, string> = {
  '0': 'invert-0',
  '1': 'invert',
};

const saturateMap: Record<string, string> = {
  '0': 'saturate-0',
  '0.5': 'saturate-50',
  '1': 'saturate-100',
  '1.5': 'saturate-150',
  '2': 'saturate-200',
};

const sepiaMap: Record<string, string> = {
  '0': 'sepia-0',
  '1': 'sepia',
};

const dropShadowMap: Record<string, string> = {
  '0 1px 2px rgb(0 0 0 / 0.1)': 'drop-shadow-sm',
  '0 1px 1px rgb(0 0 0 / 0.05)': 'drop-shadow-sm',
  '0 4px 3px rgb(0 0 0 / 0.07)': 'drop-shadow',
  '0 10px 8px rgb(0 0 0 / 0.04)': 'drop-shadow-md',
  '0 20px 13px rgb(0 0 0 / 0.03)': 'drop-shadow-lg',
  '0 25px 25px rgb(0 0 0 / 0.15)': 'drop-shadow-xl',
  '0 0 #0000': 'drop-shadow-none',
};

/**
 * Parse a single filter function from CSS filter value
 * Examples: blur(4px), brightness(1.5), contrast(200%), hue-rotate(90deg)
 */
function parseFilterFunction(func: string): { name: string; value: string } | null {
  const match = func.trim().match(/^([\w-]+)\(([^)]+)\)$/);
  if (!match) return null;

  const [, name, value] = match;
  return { name: name.toLowerCase(), value: value.trim() };
}

/**
 * Match a single filter function to Tailwind class
 */
function matchSingleFilter(name: string, value: string): string | null {
  const normalizedValue = normalizeValue(value);

  switch (name) {
    case 'blur': {
      if (blurMap[normalizedValue]) {
        return blurMap[normalizedValue];
      }
      // Try to match without unit for 0
      if (normalizedValue === '0' || normalizedValue === '0px') {
        return 'blur-none';
      }
      return toArbitrary('blur', normalizedValue);
    }

    case 'brightness': {
      // Convert percentage to decimal
      let decimalValue = normalizedValue;
      if (normalizedValue.endsWith('%')) {
        const percentage = parseFloat(normalizedValue);
        if (!isNaN(percentage)) {
          decimalValue = (percentage / 100).toString();
        }
      }
      if (brightnessMap[decimalValue]) {
        return brightnessMap[decimalValue];
      }
      return toArbitrary('brightness', normalizedValue);
    }

    case 'contrast': {
      // Convert percentage to decimal
      let decimalValue = normalizedValue;
      if (normalizedValue.endsWith('%')) {
        const percentage = parseFloat(normalizedValue);
        if (!isNaN(percentage)) {
          decimalValue = (percentage / 100).toString();
        }
      }
      if (contrastMap[decimalValue]) {
        return contrastMap[decimalValue];
      }
      return toArbitrary('contrast', normalizedValue);
    }

    case 'grayscale': {
      // Convert percentage to decimal
      let decimalValue = normalizedValue;
      if (normalizedValue.endsWith('%')) {
        const percentage = parseFloat(normalizedValue);
        if (!isNaN(percentage)) {
          decimalValue = (percentage / 100).toString();
        }
      }
      if (grayscaleMap[decimalValue]) {
        return grayscaleMap[decimalValue];
      }
      return toArbitrary('grayscale', normalizedValue);
    }

    case 'hue-rotate': {
      if (hueRotateMap[normalizedValue]) {
        return hueRotateMap[normalizedValue];
      }
      return toArbitrary('hue-rotate', normalizedValue);
    }

    case 'invert': {
      // Convert percentage to decimal
      let decimalValue = normalizedValue;
      if (normalizedValue.endsWith('%')) {
        const percentage = parseFloat(normalizedValue);
        if (!isNaN(percentage)) {
          decimalValue = (percentage / 100).toString();
        }
      }
      if (invertMap[decimalValue]) {
        return invertMap[decimalValue];
      }
      return toArbitrary('invert', normalizedValue);
    }

    case 'saturate': {
      // Convert percentage to decimal
      let decimalValue = normalizedValue;
      if (normalizedValue.endsWith('%')) {
        const percentage = parseFloat(normalizedValue);
        if (!isNaN(percentage)) {
          decimalValue = (percentage / 100).toString();
        }
      }
      if (saturateMap[decimalValue]) {
        return saturateMap[decimalValue];
      }
      return toArbitrary('saturate', normalizedValue);
    }

    case 'sepia': {
      // Convert percentage to decimal
      let decimalValue = normalizedValue;
      if (normalizedValue.endsWith('%')) {
        const percentage = parseFloat(normalizedValue);
        if (!isNaN(percentage)) {
          decimalValue = (percentage / 100).toString();
        }
      }
      if (sepiaMap[decimalValue]) {
        return sepiaMap[decimalValue];
      }
      return toArbitrary('sepia', normalizedValue);
    }

    case 'drop-shadow': {
      const normalized = normalizeBoxShadow(value);
      if (dropShadowMap[normalized]) {
        return dropShadowMap[normalized];
      }
      return toArbitrary('drop-shadow', value);
    }

    default:
      return null;
  }
}

/**
 * Matches CSS filter values to Tailwind classes
 * Supports multiple filter functions and generates multiple classes
 *
 * @param value The CSS filter value (e.g., "blur(4px) brightness(1.5)")
 * @param _ctx Match context (for future extensibility)
 * @returns Object with classes array and optional warning
 */
export function matchFilter(
  value: string,
  _ctx?: MatchCtx
): { classes: string[]; warning?: string } {
  if (!value) {
    return { classes: [] };
  }

  const normalizedValue = normalizeValue(value);

  // Handle "none"
  if (normalizedValue === 'none') {
    return { classes: ['filter-none'] };
  }

  // Parse multiple filter functions
  // Split by closing parenthesis followed by space and function name
  const functions = value.match(/[\w-]+\([^)]+\)/g);

  if (!functions || functions.length === 0) {
    // Unable to parse, use arbitrary property
    return {
      classes: [arbitraryProperty('filter', value)],
      warning: `Unable to parse filter value: ${value}, used arbitrary value`,
    };
  }

  const classes: string[] = [];
  const unmatchedFunctions: string[] = [];

  for (const func of functions) {
    const parsed = parseFilterFunction(func);
    if (!parsed) {
      unmatchedFunctions.push(func);
      continue;
    }

    const matched = matchSingleFilter(parsed.name, parsed.value);
    if (matched) {
      classes.push(matched);
    } else {
      unmatchedFunctions.push(func);
    }
  }

  // If we have unmatched functions, add them as arbitrary
  if (unmatchedFunctions.length > 0) {
    const arbitraryValue = unmatchedFunctions.join(' ');
    classes.push(toArbitrary('filter', arbitraryValue));
    return {
      classes,
      warning: `Some filter functions could not be matched: ${arbitraryValue}`,
    };
  }

  // If no classes were generated, use arbitrary for the whole value
  if (classes.length === 0) {
    return {
      classes: [toArbitrary('filter', value)],
      warning: `No Tailwind classes found for filter: ${value}, used arbitrary value`,
    };
  }

  return { classes };
}

// Mix blend mode mapping
const mixBlendModeMap: Record<string, string> = {
  normal: 'mix-blend-normal',
  multiply: 'mix-blend-multiply',
  screen: 'mix-blend-screen',
  overlay: 'mix-blend-overlay',
  darken: 'mix-blend-darken',
  lighten: 'mix-blend-lighten',
  'color-dodge': 'mix-blend-color-dodge',
  'color-burn': 'mix-blend-color-burn',
  'hard-light': 'mix-blend-hard-light',
  'soft-light': 'mix-blend-soft-light',
  difference: 'mix-blend-difference',
  exclusion: 'mix-blend-exclusion',
  hue: 'mix-blend-hue',
  saturation: 'mix-blend-saturation',
  color: 'mix-blend-color',
  luminosity: 'mix-blend-luminosity',
  // Additional blend modes
  'plus-darker': 'mix-blend-plus-darker',
  'plus-lighter': 'mix-blend-plus-lighter',
};

/**
 * Matches mix-blend-mode values to Tailwind classes
 *
 * @param value The CSS mix-blend-mode value
 * @param _ctx Match context (for future extensibility)
 * @returns Tailwind class
 */
export function matchMixBlendMode(value: string, _ctx?: MatchCtx): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Check for predefined blend mode values
  if (mixBlendModeMap[normalizedValue]) {
    return mixBlendModeMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return toArbitrary('mix-blend', normalizedValue);
}

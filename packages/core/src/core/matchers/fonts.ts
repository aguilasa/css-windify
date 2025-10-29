/**
 * Font matchers for Tailwind CSS
 */
import { MatchCtx } from '../../types';
import { arbitraryProperty } from '../normalizers';
import { matchTypography } from './typography';

/**
 * Parse font shorthand and extract components
 *
 * @param value The CSS font shorthand value
 * @returns Object with extracted components
 */
export function parseFontShorthand(value: string): {
  style?: string;
  variant?: string;
  weight?: string;
  size?: string;
  lineHeight?: string;
  family?: string;
} {
  if (!value) return {};

  const result: {
    style?: string;
    variant?: string;
    weight?: string;
    size?: string;
    lineHeight?: string;
    family?: string;
  } = {};

  // Font styles
  const fontStyles = ['normal', 'italic', 'oblique'];

  // Font variants
  const fontVariants = ['normal', 'small-caps'];

  // Font weights
  const fontWeights = [
    'normal',
    'bold',
    'lighter',
    'bolder',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
  ];

  // Split by spaces but preserve quoted strings
  const parts: string[] = [];
  let currentPart = '';
  let inQuotes = false;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
      currentPart += char;
    } else if (char === ' ' && !inQuotes) {
      if (currentPart) {
        parts.push(currentPart);
        currentPart = '';
      }
    } else {
      currentPart += char;
    }
  }

  if (currentPart) {
    parts.push(currentPart);
  }

  // Process parts from left to right
  let i = 0;

  // Extract style, variant, and weight (optional)
  while (i < parts.length) {
    const part = parts[i].toLowerCase();

    if (fontStyles.includes(part) && !result.style) {
      result.style = part;
      i++;
    } else if (fontVariants.includes(part) && !result.variant) {
      result.variant = part;
      i++;
    } else if (fontWeights.includes(part) && !result.weight) {
      result.weight = part;
      i++;
    } else {
      break; // Move on to size/line-height
    }
  }

  // Extract size and line-height (required)
  if (i < parts.length) {
    const sizeLinePart = parts[i];
    const sizeLine = sizeLinePart.split('/');

    if (sizeLine.length > 0) {
      result.size = sizeLine[0];

      if (sizeLine.length > 1) {
        result.lineHeight = sizeLine[1];
      }
    }

    i++;
  }

  // The rest is the font family
  if (i < parts.length) {
    // Join the remaining parts as the font family
    result.family = parts.slice(i).join(' ');

    // Remove any commas at the end
    result.family = result.family.replace(/,\s*$/, '');
  }

  return result;
}

/**
 * Matches font shorthand to Tailwind classes
 *
 * @param value The CSS font shorthand value
 * @param ctx The matching context with theme
 * @returns Object with classes and warnings
 */
export function matchFontShorthand(
  value: string,
  ctx: MatchCtx
): { classes: string[]; warnings: string[] } {
  if (!value) return { classes: [], warnings: [] };

  // Parse the shorthand
  const { style, variant, weight, size, lineHeight, family } = parseFontShorthand(value);
  const classes: string[] = [];
  const warnings: string[] = [];

  // Handle style
  if (style) {
    if (style === 'italic') {
      classes.push('italic');
    } else if (style === 'normal') {
      classes.push('not-italic');
    } else {
      classes.push(arbitraryProperty('font-style', style));
      warnings.push(
        `No direct Tailwind equivalent for 'font-style: ${style}', used arbitrary property`
      );
    }
  }

  // Handle variant
  if (variant) {
    if (variant === 'small-caps') {
      classes.push(arbitraryProperty('font-variant', 'small-caps'));
      warnings.push(
        `No direct Tailwind equivalent for 'font-variant: small-caps', used arbitrary property`
      );
    }
    // normal variant doesn't need a class
  }

  // Handle weight
  if (weight) {
    // Map font-weight values to Tailwind classes
    const weightMap: Record<string, string> = {
      '100': 'font-thin',
      '200': 'font-extralight',
      '300': 'font-light',
      '400': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold',
      '800': 'font-extrabold',
      '900': 'font-black',
      normal: 'font-normal',
      bold: 'font-bold',
    };

    if (weightMap[weight]) {
      classes.push(weightMap[weight]);
    } else {
      classes.push(arbitraryProperty('font-weight', weight));
      warnings.push(
        `No direct Tailwind equivalent for 'font-weight: ${weight}', used arbitrary property`
      );
    }
  }

  // Handle size
  if (size) {
    const fontSizeResult = matchTypography('font-size', size, ctx);
    classes.push(fontSizeResult.class);

    if (fontSizeResult.warning) {
      warnings.push(fontSizeResult.warning);
    }
  }

  // Handle line-height
  if (lineHeight) {
    const lineHeightResult = matchTypography('line-height', lineHeight, ctx);
    classes.push(lineHeightResult.class);

    if (lineHeightResult.warning) {
      warnings.push(lineHeightResult.warning);
    }
  }

  // Handle family
  if (family) {
    // Tailwind doesn't have built-in font family utilities except for font-sans, font-serif, font-mono
    // So we need to use arbitrary values for specific font families
    const familyLower = family.toLowerCase();

    if (familyLower.includes('sans-serif') || familyLower.includes('system-ui')) {
      classes.push('font-sans');
    } else if (familyLower.includes('serif')) {
      classes.push('font-serif');
    } else if (familyLower.includes('monospace') || familyLower.includes('mono')) {
      classes.push('font-mono');
    } else {
      classes.push(arbitraryProperty('font-family', family));
      warnings.push(
        `No direct Tailwind equivalent for 'font-family: ${family}', used arbitrary property`
      );
    }
  }

  return { classes, warnings };
}

/**
 * Background matchers for Tailwind CSS
 */
import { MatchCtx } from '../../types';
import { normalizeValue, toArbitrary, arbitraryProperty } from '../normalizers';
import { matchColor } from './colors';

// Background size mapping
const backgroundSizeMap: Record<string, string> = {
  cover: 'bg-cover',
  contain: 'bg-contain',
  auto: 'bg-auto',
};

// Background position mapping
const backgroundPositionMap: Record<string, string> = {
  center: 'bg-center',
  top: 'bg-top',
  right: 'bg-right',
  bottom: 'bg-bottom',
  left: 'bg-left',
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
 * @returns Object with class and warning
 */
export function matchBackgroundColor(
  value: string,
  ctx: MatchCtx
): { class: string; warning?: string } {
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
  if (
    normalizedValue.startsWith('linear-gradient') ||
    normalizedValue.startsWith('radial-gradient') ||
    normalizedValue.startsWith('conic-gradient') ||
    normalizedValue.startsWith('url(')
  ) {
    return toArbitrary('bg', normalizedValue);
  }

  // Handle none value
  if (normalizedValue === 'none') {
    return 'bg-none';
  }

  // Use arbitrary value for other cases
  return toArbitrary('bg', normalizedValue);
}

/**
 * Matches background-repeat values to Tailwind classes
 *
 * @param value The CSS background-repeat value
 * @returns Tailwind class
 */
export function matchBackgroundRepeat(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Map background-repeat values to Tailwind classes
  const repeatMap: Record<string, string> = {
    repeat: 'bg-repeat',
    'no-repeat': 'bg-no-repeat',
    'repeat-x': 'bg-repeat-x',
    'repeat-y': 'bg-repeat-y',
    round: 'bg-repeat-round',
    space: 'bg-repeat-space',
  };

  if (repeatMap[normalizedValue]) {
    return repeatMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return arbitraryProperty('background-repeat', normalizedValue);
}

/**
 * Matches background-attachment values to Tailwind classes
 *
 * @param value The CSS background-attachment value
 * @returns Tailwind class
 */
export function matchBackgroundAttachment(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Map background-attachment values to Tailwind classes
  const attachmentMap: Record<string, string> = {
    fixed: 'bg-fixed',
    local: 'bg-local',
    scroll: 'bg-scroll',
  };

  if (attachmentMap[normalizedValue]) {
    return attachmentMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return arbitraryProperty('background-attachment', normalizedValue);
}

/**
 * Matches background-origin values to Tailwind classes
 *
 * @param value The CSS background-origin value
 * @returns Tailwind class
 */
export function matchBackgroundOrigin(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Map background-origin values to Tailwind classes
  // Note: Tailwind doesn't have built-in utilities for background-origin
  // so we use arbitrary properties
  const originMap: Record<string, string> = {
    'border-box': 'bg-origin-border',
    'padding-box': 'bg-origin-padding',
    'content-box': 'bg-origin-content',
  };

  if (originMap[normalizedValue]) {
    return originMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return arbitraryProperty('background-origin', normalizedValue);
}

/**
 * Matches background-clip values to Tailwind classes
 *
 * @param value The CSS background-clip value
 * @returns Tailwind class
 */
export function matchBackgroundClip(value: string): string {
  if (!value) return '';

  const normalizedValue = normalizeValue(value);

  // Map background-clip values to Tailwind classes
  const clipMap: Record<string, string> = {
    'border-box': 'bg-clip-border',
    'padding-box': 'bg-clip-padding',
    'content-box': 'bg-clip-content',
    text: 'bg-clip-text',
  };

  if (clipMap[normalizedValue]) {
    return clipMap[normalizedValue];
  }

  // Use arbitrary value if no match found
  return arbitraryProperty('background-clip', normalizedValue);
}

/**
 * Parse background shorthand and extract components
 *
 * @param value The CSS background shorthand value
 * @returns Object with extracted components
 */
export function parseBackgroundShorthand(value: string): {
  color?: string;
  image?: string;
  position?: string;
  size?: string;
  repeat?: string;
} {
  if (!value) return {};

  const result: {
    color?: string;
    image?: string;
    position?: string;
    size?: string;
    repeat?: string;
  } = {};

  // Extract url() if present
  const urlMatch = value.match(/url\([^)]+\)/);
  if (urlMatch) {
    result.image = urlMatch[0];
    // Remove the url part from the value for further processing
    value = value.replace(urlMatch[0], '').trim();
  }

  // Extract position/size if in format "center/cover"
  const positionSizeMatch = value.match(/([\w\s%-]+)\/([\w\s%-]+)/);
  if (positionSizeMatch) {
    result.position = positionSizeMatch[1].trim();
    result.size = positionSizeMatch[2].trim();
    // Remove the position/size part from the value
    value = value.replace(positionSizeMatch[0], '').trim();
  }

  // Extract repeat values
  const repeatValues = ['repeat', 'no-repeat', 'repeat-x', 'repeat-y', 'space', 'round'];
  for (const repeat of repeatValues) {
    if (value.includes(repeat)) {
      result.repeat = repeat;
      // Remove the repeat part from the value
      value = value.replace(repeat, '').trim();
      break;
    }
  }

  // Extract position if not already found and present in the value
  if (!result.position) {
    const positions = [
      'center',
      'top',
      'right',
      'bottom',
      'left',
      'top left',
      'top right',
      'bottom left',
      'bottom right',
    ];
    for (const pos of positions) {
      if (value.includes(pos)) {
        result.position = pos;
        // Remove the position part from the value
        value = value.replace(pos, '').trim();
        break;
      }
    }
  }

  // What remains is likely the color
  if (value.trim()) {
    result.color = value.trim();
  }

  return result;
}

/**
 * Matches background shorthand to Tailwind classes
 *
 * @param value The CSS background shorthand value
 * @param ctx The matching context with theme
 * @returns Object with classes and warnings
 */
export function matchBackgroundShorthand(
  value: string,
  ctx: MatchCtx
): { classes: string[]; warnings: string[] } {
  if (!value) return { classes: [], warnings: [] };

  // Parse the shorthand
  const { color, image, position, size, repeat } = parseBackgroundShorthand(value);
  const classes: string[] = [];
  const warnings: string[] = [];

  // Handle color
  if (color) {
    const colorResult = matchBackgroundColor(color, ctx);
    classes.push(colorResult.class);
    if (colorResult.warning) {
      warnings.push(colorResult.warning);
    }
  }

  // Handle image
  if (image) {
    classes.push(matchBackgroundImage(image));
  }

  // Handle position
  if (position) {
    classes.push(matchBackgroundPosition(position));
  }

  // Handle size
  if (size) {
    classes.push(matchBackgroundSize(size));
  }

  // Handle repeat
  if (repeat) {
    // Tailwind doesn't have direct utilities for all repeat values
    if (repeat === 'no-repeat') {
      classes.push('bg-no-repeat');
    } else if (repeat === 'repeat') {
      // Default in Tailwind, no class needed
    } else {
      classes.push(arbitraryProperty('background-repeat', repeat));
    }
  }

  return { classes, warnings };
}

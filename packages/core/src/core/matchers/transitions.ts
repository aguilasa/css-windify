/**
 * Transition and animation matchers for Tailwind CSS
 */
import { normalizeValue, arbitraryProperty } from '../normalizers';

/**
 * Parse transition shorthand and extract components
 *
 * @param value The CSS transition shorthand value
 * @returns Object with extracted components
 */
export function parseTransitionShorthand(value: string): {
  property?: string;
  duration?: string;
  timingFunction?: string;
  delay?: string;
} {
  if (!value) return {};

  // If it's "none" or "all", return early
  if (value.trim() === 'none' || value.trim() === 'all') {
    return { property: value.trim() };
  }

  const parts = value.trim().split(/\s+/);
  const result: {
    property?: string;
    duration?: string;
    timingFunction?: string;
    delay?: string;
  } = {};

  // Common timing functions
  const timingFunctions = [
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'linear',
    'step-start',
    'step-end',
  ];

  // Check for cubic-bezier or steps function
  const isFunctionValue = (val: string): boolean => {
    return val.includes('cubic-bezier(') || val.includes('steps(');
  };

  // Check if a value is a time value (s or ms)
  const isTimeValue = (val: string): boolean => {
    return /^\d+(\.\d+)?(s|ms)$/.test(val);
  };

  // First part is usually the property unless it's a time or timing function
  if (parts.length > 0) {
    const firstPart = parts[0];

    if (isTimeValue(firstPart)) {
      result.duration = firstPart;
    } else if (timingFunctions.includes(firstPart) || isFunctionValue(firstPart)) {
      result.timingFunction = firstPart;
    } else {
      result.property = firstPart;
    }
  }

  // Second part is usually duration unless property was missing
  if (parts.length > 1) {
    const secondPart = parts[1];

    if (isTimeValue(secondPart)) {
      if (!result.duration) {
        result.duration = secondPart;
      } else {
        result.delay = secondPart;
      }
    } else if (timingFunctions.includes(secondPart) || isFunctionValue(secondPart)) {
      result.timingFunction = secondPart;
    } else if (!result.property) {
      result.property = secondPart;
    }
  }

  // Third part is usually timing function or delay
  if (parts.length > 2) {
    const thirdPart = parts[2];

    if (isTimeValue(thirdPart)) {
      if (!result.duration) {
        result.duration = thirdPart;
      } else {
        result.delay = thirdPart;
      }
    } else if (timingFunctions.includes(thirdPart) || isFunctionValue(thirdPart)) {
      result.timingFunction = thirdPart;
    }
  }

  // Fourth part is usually delay
  if (parts.length > 3) {
    const fourthPart = parts[3];

    if (isTimeValue(fourthPart)) {
      result.delay = fourthPart;
    }
  }

  return result;
}

/**
 * Matches transition shorthand to Tailwind classes
 *
 * @param value The CSS transition shorthand value
 * @returns Object with classes and warnings
 */
export function matchTransitionShorthand(value: string): { classes: string[]; warnings: string[] } {
  if (!value) return { classes: [], warnings: [] };

  // Parse the shorthand
  const { property, duration, timingFunction, delay } = parseTransitionShorthand(value);
  const classes: string[] = [];
  const warnings: string[] = [];

  // Handle property (determines the transition type)
  if (property === 'none') {
    classes.push('transition-none');
    return { classes, warnings };
  } else if (property === 'all') {
    classes.push('transition-all');
  } else if (property) {
    // Map common properties to Tailwind transition classes
    const transitionMap: Record<string, string> = {
      transform: 'transition-transform',
      opacity: 'transition-opacity',
      background: 'transition-colors',
      'background-color': 'transition-colors',
      color: 'transition-colors',
      'border-color': 'transition-colors',
      'box-shadow': 'transition-shadow',
      height: 'transition-all', // No specific class for height
      width: 'transition-all', // No specific class for width
    };

    if (transitionMap[property]) {
      classes.push(transitionMap[property]);
    } else {
      classes.push('transition');
      warnings.push(
        `No specific Tailwind transition class for '${property}', using general 'transition'`
      );
    }
  } else {
    classes.push('transition');
  }

  // Handle duration
  if (duration) {
    // Extract the numeric value and unit
    const durationMatch = duration.match(/^(\d+(\.\d+)?)(ms|s)$/);

    if (durationMatch) {
      const [, value, , unit] = durationMatch;
      const durationMs = unit === 's' ? parseFloat(value) * 1000 : parseFloat(value);

      // Map to Tailwind duration classes
      const durationMap: Record<number, string> = {
        75: 'duration-75',
        100: 'duration-100',
        150: 'duration-150',
        200: 'duration-200',
        300: 'duration-300',
        500: 'duration-500',
        700: 'duration-700',
        1000: 'duration-1000',
      };

      // Find the closest duration
      let closestDuration = 300; // Default
      let minDiff = Math.abs(durationMs - 300);

      for (const [dur] of Object.entries(durationMap)) {
        const diff = Math.abs(durationMs - parseInt(dur));
        if (diff < minDiff) {
          minDiff = diff;
          closestDuration = parseInt(dur);
        }
      }

      if (durationMap[closestDuration]) {
        classes.push(durationMap[closestDuration]);

        // Add warning if it's not an exact match
        if (durationMs !== closestDuration) {
          warnings.push(`Approximated '${duration}' to '${durationMap[closestDuration]}'`);
        }
      } else {
        classes.push(arbitraryProperty('transition-duration', duration));
        warnings.push(
          `No direct Tailwind equivalent for 'transition-duration: ${duration}', used arbitrary property`
        );
      }
    } else {
      classes.push(arbitraryProperty('transition-duration', duration));
      warnings.push(`Invalid duration format '${duration}', used arbitrary property`);
    }
  }

  // Handle timing function
  if (timingFunction) {
    // Map to Tailwind ease classes
    const easeMap: Record<string, string> = {
      linear: 'ease-linear',
      ease: 'ease-in-out', // Default ease in CSS is similar to ease-in-out
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
    };

    if (easeMap[timingFunction]) {
      classes.push(easeMap[timingFunction]);
    } else {
      classes.push(arbitraryProperty('transition-timing-function', timingFunction));
      warnings.push(
        `No direct Tailwind equivalent for 'transition-timing-function: ${timingFunction}', used arbitrary property`
      );
    }
  }

  // Handle delay
  if (delay) {
    // Extract the numeric value and unit
    const delayMatch = delay.match(/^(\d+(\.\d+)?)(ms|s)$/);

    if (delayMatch) {
      const [, value, , unit] = delayMatch;
      const delayMs = unit === 's' ? parseFloat(value) * 1000 : parseFloat(value);

      // Map to Tailwind delay classes
      const delayMap: Record<number, string> = {
        75: 'delay-75',
        100: 'delay-100',
        150: 'delay-150',
        200: 'delay-200',
        300: 'delay-300',
        500: 'delay-500',
        700: 'delay-700',
        1000: 'delay-1000',
      };

      // Find the closest delay
      let closestDelay = 300; // Default
      let minDiff = Math.abs(delayMs - 300);

      for (const [del] of Object.entries(delayMap)) {
        const diff = Math.abs(delayMs - parseInt(del));
        if (diff < minDiff) {
          minDiff = diff;
          closestDelay = parseInt(del);
        }
      }

      if (delayMap[closestDelay]) {
        classes.push(delayMap[closestDelay]);

        // Add warning if it's not an exact match
        if (delayMs !== closestDelay) {
          warnings.push(`Approximated '${delay}' to '${delayMap[closestDelay]}'`);
        }
      } else {
        classes.push(arbitraryProperty('transition-delay', delay));
        warnings.push(
          `No direct Tailwind equivalent for 'transition-delay: ${delay}', used arbitrary property`
        );
      }
    } else {
      classes.push(arbitraryProperty('transition-delay', delay));
      warnings.push(`Invalid delay format '${delay}', used arbitrary property`);
    }
  }

  // If we couldn't parse any specific parts, use arbitrary property
  if (classes.length === 0) {
    classes.push(arbitraryProperty('transition', value));
    warnings.push(`Could not parse transition shorthand '${value}', used arbitrary property`);
  }

  return { classes, warnings };
}

/**
 * Matches animation shorthand to Tailwind classes
 *
 * @param value The CSS animation shorthand value
 * @returns Object with classes and warnings
 */
export function matchAnimationShorthand(value: string): { classes: string[]; warnings: string[] } {
  if (!value) return { classes: [], warnings: [] };

  const normalizedValue = normalizeValue(value);
  const classes: string[] = [];
  const warnings: string[] = [];

  // Handle none value
  if (normalizedValue === 'none') {
    classes.push('animate-none');
    return { classes, warnings };
  }

  // Handle common animation names
  const animationMap: Record<string, string> = {
    spin: 'animate-spin',
    ping: 'animate-ping',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
  };

  // Check if the value contains any of the known animation names
  let matched = false;
  for (const [name, className] of Object.entries(animationMap)) {
    if (normalizedValue.includes(name)) {
      classes.push(className);
      matched = true;
      break;
    }
  }

  // If no match found, use arbitrary property
  if (!matched) {
    classes.push(arbitraryProperty('animation', value));
    warnings.push(
      `No direct Tailwind equivalent for 'animation: ${value}', used arbitrary property`
    );
  }

  return { classes, warnings };
}

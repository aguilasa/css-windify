/**
 * Utility functions for normalizing and transforming CSS values
 */

/**
 * Normalizes a CSS value by trimming and converting to lowercase when applicable
 * Preserves units and case-sensitive values
 * 
 * @param v The value to normalize
 * @returns Normalized value
 */
export function normalizeValue(v: string): string {
  if (!v) return '';
  
  // Trim the value
  const trimmed = v.trim();
  
  // Don't lowercase values that might be case-sensitive (like font names with capitals)
  // or values that contain variables or functions
  if (
    trimmed.includes('(') || // Functions like rgb(), var(), etc.
    trimmed.includes('"') || // Quoted strings
    trimmed.includes("'") || // Quoted strings
    /^[A-Z][a-z]/.test(trimmed) // Values starting with capital letters followed by lowercase (likely proper nouns)
  ) {
    return trimmed;
  }
  
  return trimmed.toLowerCase();
}

/**
 * Checks if a value is in pixels
 * 
 * @param v The value to check
 * @returns True if the value is in pixels
 */
export function isPx(v: string): boolean {
  return /^-?\d*\.?\d+px$/.test(normalizeValue(v));
}

/**
 * Checks if a value is in rem
 * 
 * @param v The value to check
 * @returns True if the value is in rem
 */
export function isRem(v: string): boolean {
  return /^-?\d*\.?\d+rem$/.test(normalizeValue(v));
}

/**
 * Checks if a value is in em
 * 
 * @param v The value to check
 * @returns True if the value is in em
 */
export function isEm(v: string): boolean {
  return /^-?\d*\.?\d+em$/.test(normalizeValue(v));
}

/**
 * Checks if a value is a percentage
 * 
 * @param v The value to check
 * @returns True if the value is a percentage
 */
export function isPct(v: string): boolean {
  return /^-?\d*\.?\d+%$/.test(normalizeValue(v));
}

/**
 * Checks if a value is a number (with or without decimal point)
 * 
 * @param v The value to check
 * @returns True if the value is a number
 */
export function isNumber(v: string): boolean {
  return /^-?\d*\.?\d+$/.test(normalizeValue(v));
}

/**
 * Converts a value to a Tailwind arbitrary value format
 * 
 * @param prefix The Tailwind prefix
 * @param v The value
 * @returns Formatted arbitrary value
 */
export function toArbitrary(prefix: string, v: string): string {
  const normalizedPrefix = prefix.trim();
  const normalizedValue = normalizeValue(v);
  
  if (!normalizedPrefix || !normalizedValue) return '';
  
  return `${normalizedPrefix}-[${normalizedValue}]`;
}

/**
 * Creates an arbitrary property with value in Tailwind format
 * 
 * @param prop The CSS property
 * @param v The value
 * @returns Formatted arbitrary property
 */
export function arbitraryProperty(prop: string, v: string): string {
  const normalizedProp = normalizeValue(prop);
  const normalizedValue = normalizeValue(v);
  
  if (!normalizedProp || !normalizedValue) return '';
  
  return `[${normalizedProp}:${normalizedValue}]`;
}

/**
 * Parses CSS box model shorthand values (margin, padding, etc.)
 * Returns an array of 1-4 values based on CSS shorthand rules
 * 
 * @param v The shorthand value
 * @returns Array of expanded values [top, right, bottom, left]
 */
export function parseBoxShorthand(v: string): string[] {
  if (!v) return [];
  
  const parts = normalizeValue(v).split(/\s+/).filter(Boolean);
  
  // Handle different number of values according to CSS spec
  switch (parts.length) {
    case 1: // all sides
      return [parts[0], parts[0], parts[0], parts[0]];
    case 2: // vertical | horizontal
      return [parts[0], parts[1], parts[0], parts[1]];
    case 3: // top | horizontal | bottom
      return [parts[0], parts[1], parts[2], parts[1]];
    case 4: // top | right | bottom | left
      return parts.slice(0, 4);
    default:
      // For more than 4 values, take only the first 4
      return parts.length > 4 ? parts.slice(0, 4) : [];
  }
}

/**
 * Normalizes color values
 * - Converts shorthand hex to full form (#fff -> #ffffff)
 * - Removes whitespace
 * - Preserves case for named colors
 * 
 * @param v The color value
 * @returns Normalized color
 */
export function parseColorNormalize(v: string): string {
  if (!v) return '';
  
  const trimmed = v.trim().toLowerCase();
  
  // Handle hex shorthand (#fff -> #ffffff)
  if (/^#[0-9a-f]{3}$/.test(trimmed)) {
    return '#' + trimmed[1] + trimmed[1] + trimmed[2] + trimmed[2] + trimmed[3] + trimmed[3];
  }
  
  // Handle hex shorthand with alpha (#rgba -> #rrggbbaa)
  if (/^#[0-9a-f]{4}$/.test(trimmed)) {
    return '#' + 
      trimmed[1] + trimmed[1] + 
      trimmed[2] + trimmed[2] + 
      trimmed[3] + trimmed[3] +
      trimmed[4] + trimmed[4];
  }
  
  // Remove whitespace from functional notation like rgb(), rgba(), etc.
  if (/^(rgb|rgba|hsl|hsla)\s*\(/.test(trimmed)) {
    return trimmed.replace(/\s+/g, '');
  }
  
  return trimmed;
}

/**
 * Converts a CSS value to pixels
 * 
 * @param value The CSS value (px, rem, em)
 * @param baseFontSize The base font size in pixels (default: 16px)
 * @returns The value in pixels or null if conversion is not possible
 */
export function toPx(value: string, baseFontSize: number = 16): number | null {
  if (!value) return null;
  
  const normalizedValue = normalizeValue(value);
  
  // Already in pixels
  if (isPx(normalizedValue)) {
    return parseFloat(normalizedValue);
  }
  
  // Convert from rem
  if (isRem(normalizedValue)) {
    const remValue = parseFloat(normalizedValue);
    return remValue * baseFontSize;
  }
  
  // Convert from em
  if (isEm(normalizedValue)) {
    const emValue = parseFloat(normalizedValue);
    return emValue * baseFontSize;
  }
  
  // Handle unitless values as pixels
  if (isNumber(normalizedValue)) {
    return parseFloat(normalizedValue);
  }
  
  return null;
}

/**
 * Find the nearest token in a token map based on a value
 * 
 * @param value The value to find the nearest token for (px or rem)
 * @param tokenMap The mapping of token names to their values
 * @param baseFontSize The base font size in pixels (default: 16px)
 * @returns Object with the nearest token, its value, and the difference in pixels
 */
export function findNearestToken(
  value: string, 
  tokenMap: Record<string, string>,
  baseFontSize: number = 16
): { token: string; value: string; diff: number } | null {
  if (!value || !tokenMap || Object.keys(tokenMap).length === 0) {
    return null;
  }
  
  // Convert the input value to pixels for comparison
  const valuePx = toPx(value, baseFontSize);
  if (valuePx === null) {
    return null;
  }
  
  let nearestToken = '';
  let nearestValue = '';
  let minDiff = Infinity;
  
  // Find the token with the closest value
  for (const [token, tokenValue] of Object.entries(tokenMap)) {
    const tokenPx = toPx(tokenValue, baseFontSize);
    if (tokenPx === null) continue;
    
    const diff = Math.abs(valuePx - tokenPx);
    if (diff < minDiff) {
      minDiff = diff;
      nearestToken = token;
      nearestValue = tokenValue;
    }
  }
  
  if (nearestToken) {
    return {
      token: nearestToken,
      value: nearestValue,
      diff: minDiff
    };
  }
  
  return null;
}

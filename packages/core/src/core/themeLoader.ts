/**
 * Theme loader and token resolvers for Tailwind CSS
 */
import * as fs from 'fs';
import * as path from 'path';
import { normalizeValue, parseColorNormalize, findNearestToken } from './normalizers';

/**
 * Default minimal theme with basic Tailwind CSS defaults
 */
export const defaultTheme = {
  spacing: {
    '0': '0px',
    '0.5': '0.125rem',
    '1': '0.25rem',
    '1.5': '0.375rem',
    '2': '0.5rem',
    '2.5': '0.625rem',
    '3': '0.75rem',
    '3.5': '0.875rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '7': '1.75rem',
    '8': '2rem',
    '9': '2.25rem',
    '10': '2.5rem',
    '11': '2.75rem',
    '12': '3rem',
    '14': '3.5rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '28': '7rem',
    '32': '8rem',
    '36': '9rem',
    '40': '10rem',
    '44': '11rem',
    '48': '12rem',
    '52': '13rem',
    '56': '14rem',
    '60': '15rem',
    '64': '16rem',
    '72': '18rem',
    '80': '20rem',
    '96': '24rem',
    'px': '1px',
  },
  screens: {
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  },
  colors: {
    'black': '#000000',
    'white': '#ffffff',
    'transparent': 'transparent',
    'current': 'currentColor',
  },
  fontSize: {
    'xs': ['0.75rem', { lineHeight: '1rem' }],
    'sm': ['0.875rem', { lineHeight: '1.25rem' }],
    'base': ['1rem', { lineHeight: '1.5rem' }],
    'lg': ['1.125rem', { lineHeight: '1.75rem' }],
    'xl': ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }],
  },
  lineHeight: {
    'none': '1',
    'tight': '1.25',
    'snug': '1.375',
    'normal': '1.5',
    'relaxed': '1.625',
    'loose': '2',
  }
};

/**
 * Attempts to load a Tailwind config file from the given directory
 * Falls back to default theme if no config is found
 * 
 * @param cwd Current working directory to search for Tailwind config
 * @returns Tailwind theme object
 */
export async function loadTheme(cwd: string): Promise<any> {
  const possibleConfigFiles = [
    'tailwind.config.js',
    'tailwind.config.cjs',
    'tailwind.config.mjs',
    'tailwind.config.ts'
  ];

  for (const configFile of possibleConfigFiles) {
    const configPath = path.join(cwd, configFile);
    
    if (fs.existsSync(configPath)) {
      try {
        // Dynamic import to support different module formats
        // Using a variable to avoid direct import() which can cause issues in tests
        const importFunc = new Function('path', 'return import(path)');
        const config = await importFunc(configPath);
        
        // Handle both default exports and regular exports
        const resolvedConfig = config.default || config;
        
        // Return the theme or merge with default theme
        if (resolvedConfig && resolvedConfig.theme) {
          return {
            ...defaultTheme,
            ...resolvedConfig.theme
          };
        }
      } catch (error) {
        console.error(`Error loading Tailwind config from ${configPath}:`, error);
      }
    }
  }

  // Return default theme if no config is found or valid
  return defaultTheme;
}

/**
 * Resolves a spacing value to a Tailwind token
 * 
 * @param value CSS spacing value (margin, padding, etc.)
 * @param theme Tailwind theme object
 * @param opts Options for token resolution
 * @returns Object with token, match type, and difference if approximate
 */
export function resolveSpacingToken(
  value: string, 
  theme: any, 
  opts?: { approximate?: boolean; maxDiffPx?: number }
): { token: string | null; type: 'exact' | 'approximate' | 'none'; diff?: number } {
  if (!value || !theme || !theme.spacing) {
    return { token: null, type: 'none' };
  }
  
  const normalizedValue = normalizeValue(value);
  const spacing = theme.spacing as Record<string, string>;
  
  // Direct match in theme
  for (const [key, themeValue] of Object.entries(spacing)) {
    if (normalizedValue === themeValue) {
      return { token: key, type: 'exact' };
    }
  }
  
  // If approximate matching is enabled, try to find the closest token
  if (opts?.approximate) {
    const maxDiffPx = opts.maxDiffPx ?? 1; // Default to 1px max difference
    const nearest = findNearestToken(value, spacing);
    
    if (nearest && nearest.diff <= maxDiffPx) {
      return { 
        token: nearest.token, 
        type: 'approximate', 
        diff: nearest.diff 
      };
    }
  }
  
  // No match found
  return { token: null, type: 'none' };
}

/**
 * Resolves a color value to a Tailwind token
 * 
 * @param hexOrNamed CSS color value (hex, named, etc.)
 * @param theme Tailwind theme object
 * @returns Object with type ('exact' if found, 'none' if not) and class if found
 */
export function resolveColorToken(hexOrNamed: string, theme: any): { type: 'exact' | 'none'; class?: string } {
  if (!hexOrNamed || !theme || !theme.colors) {
    return { type: 'none' };
  }
  
  const normalizedColor = parseColorNormalize(hexOrNamed);
  
  // Check for direct matches in theme colors
  for (const [colorName, colorValue] of Object.entries(theme.colors)) {
    // Handle both string values and nested color objects
    if (typeof colorValue === 'string') {
      const normalizedThemeColor = parseColorNormalize(colorValue);
      if (normalizedColor === normalizedThemeColor) {
        return { type: 'exact', class: colorName };
      }
    } else if (typeof colorValue === 'object' && colorValue !== null) {
      // Handle nested color objects (e.g., blue: { 500: '#3b82f6' })
      for (const [shade, shadeValue] of Object.entries(colorValue as Record<string, unknown>)) {
        if (typeof shadeValue === 'string') {
          const normalizedThemeColor = parseColorNormalize(shadeValue);
          if (normalizedColor === normalizedThemeColor) {
            return { type: 'exact', class: `${colorName}-${shade}` };
          }
        }
      }
    }
  }
  
  // No match found
  return { type: 'none' };
}

/**
 * Resolves a font size value to a Tailwind token
 * 
 * @param pxOrRem CSS font size value
 * @param theme Tailwind theme object
 * @param opts Options for token resolution
 * @returns Object with token, match type, and difference if approximate
 */
export function resolveFontSizeToken(
  pxOrRem: string, 
  theme: any,
  opts?: { approximate?: boolean; maxDiffPx?: number }
): { token: string | null; type: 'exact' | 'approximate' | 'none'; diff?: number } {
  if (!pxOrRem || !theme || !theme.fontSize) {
    return { token: null, type: 'none' };
  }
  
  const normalizedValue = normalizeValue(pxOrRem);
  
  // Create a map of font size values for easier processing
  const fontSizeMap: Record<string, string> = {};
  
  // Check for direct matches in theme fontSize
  for (const [key, value] of Object.entries(theme.fontSize)) {
    // Handle both string values and arrays with line height
    if (typeof value === 'string') {
      fontSizeMap[key] = value;
      if (normalizedValue === value) {
        return { token: key, type: 'exact' };
      }
    } else if (Array.isArray(value) && value[0]) {
      fontSizeMap[key] = value[0];
      if (normalizedValue === value[0]) {
        return { token: key, type: 'exact' };
      }
    }
  }
  
  // If approximate matching is enabled, try to find the closest token
  if (opts?.approximate) {
    const maxDiffPx = opts.maxDiffPx ?? 1; // Default to 1px max difference
    const nearest = findNearestToken(pxOrRem, fontSizeMap);
    
    if (nearest && nearest.diff <= maxDiffPx) {
      return { 
        token: nearest.token, 
        type: 'approximate', 
        diff: nearest.diff 
      };
    }
  }
  
  // No match found
  return { token: null, type: 'none' };
}

/**
 * Resolves a line height value to a Tailwind token
 * 
 * @param value CSS line height value
 * @param theme Tailwind theme object
 * @param opts Options for token resolution
 * @returns Object with token, match type, and difference if approximate
 */
export function resolveLineHeightToken(
  value: string, 
  theme: any,
  opts?: { approximate?: boolean; maxDiffPx?: number }
): { token: string | null; type: 'exact' | 'approximate' | 'none'; diff?: number } {
  if (!value || !theme || !theme.lineHeight) {
    return { token: null, type: 'none' };
  }
  
  const normalizedValue = normalizeValue(value);
  
  // Create a map of line height values for easier processing
  const lineHeightMap: Record<string, string> = {};
  
  // Direct match in theme
  for (const [key, themeValue] of Object.entries(theme.lineHeight)) {
    const stringValue = String(themeValue);
    lineHeightMap[key] = stringValue;
    
    if (normalizedValue === stringValue) {
      return { token: key, type: 'exact' };
    }
  }
  
  // If approximate matching is enabled, try to find the closest token
  if (opts?.approximate) {
    const maxDiffPx = opts.maxDiffPx ?? 1; // Default to 1px max difference
    const nearest = findNearestToken(value, lineHeightMap);
    
    if (nearest && nearest.diff <= maxDiffPx) {
      return { 
        token: nearest.token, 
        type: 'approximate', 
        diff: nearest.diff 
      };
    }
  }
  
  // No match found
  return { token: null, type: 'none' };
}

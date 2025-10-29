/**
 * Tokens loader for Tailwind CSS v4
 * Extracts CSS custom properties and converts them to ThemeTokens
 */
import * as fs from 'fs';
import * as path from 'path';
import { ThemeTokens } from '../types';
import { loadTheme } from './themeLoader';

// Regular expressions for extracting CSS custom properties
const ROOT_SELECTOR_REGEX = /:root\s*{([^}]*)}/g;
const CSS_VAR_REGEX = /--([a-zA-Z0-9-_.]+)\s*:\s*([^;]+);/g;

// Token prefix patterns
const TOKEN_PATTERNS = {
  spacing: /^spacing-(.+)$/,
  fontSize: /^font-size-(.+)$/,
  lineHeight: /^leading-(.+)$/,
  color: /^color-([a-zA-Z0-9-]+)(?:-([0-9]+))?$/,
  screen: /^screen-(.+)$/,
};

/**
 * Default theme tokens based on Tailwind CSS v4 defaults
 * Used as fallback when no tokens are found
 */
export const defaultTokens: ThemeTokens = {
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
    px: '1px',
  },
  colors: {
    black: '#000000',
    white: '#ffffff',
    transparent: 'transparent',
    current: 'currentColor',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
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
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  screens: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  version: 'v4',
  source: 'default',
};

/**
 * Parse CSS file content to extract custom properties
 *
 * @param cssContent CSS file content
 * @returns Object with extracted custom properties
 */
function parseCssCustomProperties(cssContent: string): Record<string, string> {
  const customProperties: Record<string, string> = {};

  // Extract content from :root selector
  let match;
  while ((match = ROOT_SELECTOR_REGEX.exec(cssContent)) !== null) {
    const rootContent = match[1];

    // Extract custom properties
    let propMatch;
    while ((propMatch = CSS_VAR_REGEX.exec(rootContent)) !== null) {
      const [, name, value] = propMatch;
      customProperties[name] = value.trim();
    }
  }

  return customProperties;
}

/**
 * Convert CSS custom properties to ThemeTokens
 *
 * @param customProperties Object with CSS custom properties
 * @returns ThemeTokens object
 */
function convertCustomPropertiesToTokens(customProperties: Record<string, string>): ThemeTokens {
  const tokens: ThemeTokens = {
    spacing: {},
    colors: {},
    fontSize: {},
    lineHeight: {},
    screens: {},
    version: 'v4',
    source: 'css-variables',
  };

  // Process each custom property
  for (const [name, value] of Object.entries(customProperties)) {
    // Spacing tokens
    const spacingMatch = name.match(TOKEN_PATTERNS.spacing);
    if (spacingMatch) {
      tokens.spacing[spacingMatch[1].replace('-', '.')] = value;
      continue;
    }

    // Font size tokens
    const fontSizeMatch = name.match(TOKEN_PATTERNS.fontSize);
    if (fontSizeMatch) {
      tokens.fontSize[fontSizeMatch[1]] = [value, {}];
      continue;
    }

    // Line height tokens
    const lineHeightMatch = name.match(TOKEN_PATTERNS.lineHeight);
    if (lineHeightMatch) {
      tokens.lineHeight[lineHeightMatch[1]] = value;
      continue;
    }

    // Color tokens
    const colorMatch = name.match(TOKEN_PATTERNS.color);
    if (colorMatch) {
      const colorName = colorMatch[1];
      const shade = colorMatch[2];

      if (shade) {
        // Handle nested color with shade
        if (!tokens.colors[colorName] || typeof tokens.colors[colorName] === 'string') {
          tokens.colors[colorName] = {};
        }

        if (typeof tokens.colors[colorName] === 'object') {
          (tokens.colors[colorName] as Record<string, string>)[shade] = value;
        }
      } else {
        // Handle direct color
        tokens.colors[colorName] = value;
      }
      continue;
    }

    // Screen tokens
    const screenMatch = name.match(TOKEN_PATTERNS.screen);
    if (screenMatch) {
      // Convert screen value to numeric pixels
      const screenValue = value.trim();
      const pxMatch = screenValue.match(/^([0-9.]+)px$/);

      if (pxMatch) {
        tokens.screens[screenMatch[1]] = parseFloat(pxMatch[1]);
      } else {
        // Try to convert other units to pixels (approximate)
        // For simplicity, we'll just use the raw value if it's not in px
        console.warn(`Screen value not in pixels: ${screenValue}. Using as-is.`);
        tokens.screens[screenMatch[1]] = parseInt(screenValue, 10) || 0;
      }
      continue;
    }
  }

  return tokens;
}

/**
 * Project a v3 theme into a ThemeTokens structure
 *
 * @param theme Tailwind v3 theme object
 * @returns ThemeTokens object
 */
function projectV3ThemeToTokens(theme: any): ThemeTokens {
  const tokens: ThemeTokens = {
    spacing: {},
    colors: {},
    fontSize: {},
    lineHeight: {},
    screens: {},
    version: 'v3',
    source: 'config',
  };

  // Copy spacing tokens
  if (theme.spacing) {
    tokens.spacing = { ...theme.spacing };
  }

  // Copy color tokens
  if (theme.colors) {
    tokens.colors = { ...theme.colors };
  }

  // Copy font size tokens
  if (theme.fontSize) {
    tokens.fontSize = { ...theme.fontSize };
  }

  // Copy line height tokens
  if (theme.lineHeight) {
    tokens.lineHeight = { ...theme.lineHeight };
  }

  // Convert screens to numeric values
  if (theme.screens) {
    for (const [key, value] of Object.entries(theme.screens)) {
      const screenValue = String(value);
      const pxMatch = screenValue.match(/^([0-9.]+)px$/);

      if (pxMatch) {
        tokens.screens[key] = parseFloat(pxMatch[1]);
      } else {
        // Default to the string value converted to number or 0
        tokens.screens[key] = parseInt(screenValue, 10) || 0;
      }
    }
  }

  return tokens;
}

/**
 * Load tokens from CSS custom properties and/or Tailwind config
 *
 * @param options Options for loading tokens
 * @returns ThemeTokens object
 */
export async function loadTokens(options?: {
  cssPath?: string;
  configPath?: string;
}): Promise<ThemeTokens> {
  // Try to load CSS custom properties first (v4 approach)
  if (options?.cssPath && fs.existsSync(options.cssPath)) {
    try {
      const cssContent = fs.readFileSync(options.cssPath, 'utf-8');
      const customProperties = parseCssCustomProperties(cssContent);

      // Check if we found any relevant tokens
      const tokens = convertCustomPropertiesToTokens(customProperties);

      // If we found any tokens, return them
      if (
        Object.keys(tokens.spacing).length > 0 ||
        Object.keys(tokens.colors).length > 0 ||
        Object.keys(tokens.fontSize).length > 0
      ) {
        return tokens;
      }
    } catch (error) {
      console.error(`Error loading CSS tokens from ${options.cssPath}:`, error);
    }
  }

  // If no CSS tokens found, try to load Tailwind config (v3 fallback)
  try {
    const configDir = options?.configPath ? path.dirname(options.configPath) : process.cwd();

    const theme = await loadTheme(configDir);
    return projectV3ThemeToTokens(theme);
  } catch (error) {
    console.error('Error loading Tailwind config:', error);
  }

  // Return default tokens if all else fails
  return { ...defaultTokens };
}

/**
 * Detect Tailwind version based on available tokens and theme
 *
 * @param options Options for version detection
 * @returns 'v3' or 'v4'
 */
export function detectTailwindVersion(options?: {
  cssPath?: string;
  configPath?: string;
  version?: 'auto' | 'v3' | 'v4';
}): 'v3' | 'v4' {
  // If version is explicitly set, use it
  if (options?.version === 'v3') return 'v3';
  if (options?.version === 'v4') return 'v4';

  // For 'auto' or undefined, check if CSS tokens file exists
  if (options?.cssPath && fs.existsSync(options.cssPath)) {
    try {
      const cssContent = fs.readFileSync(options.cssPath, 'utf-8');
      const customProperties = parseCssCustomProperties(cssContent);

      // Check if we found any relevant tokens
      for (const name of Object.keys(customProperties)) {
        if (
          name.match(TOKEN_PATTERNS.spacing) ||
          name.match(TOKEN_PATTERNS.fontSize) ||
          name.match(TOKEN_PATTERNS.color)
        ) {
          return 'v4';
        }
      }
    } catch (error) {
      console.error(`Error checking CSS tokens from ${options.cssPath}:`, error);
    }
  }

  // Default to v3 if no v4 tokens found
  return 'v3';
}

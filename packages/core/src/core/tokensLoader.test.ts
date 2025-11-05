import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { loadTokens, detectTailwindVersion, parseCustomProperties } from './tokensLoader';
import { loadTheme } from './themeLoader';

// Mock fs and path modules
vi.mock('fs');
vi.mock('path');
vi.mock('./themeLoader');

describe('tokensLoader', () => {
  const mockCssContent = `
    :root {
      --spacing-0: 0px;
      --spacing-1: 0.25rem;
      --spacing-2: 0.5rem;
      --spacing-4: 1rem;
      --font-size-sm: 0.875rem;
      --font-size-base: 1rem;
      --font-size-lg: 1.125rem;
      --leading-none: 1;
      --leading-normal: 1.5;
      --color-blue-500: #3b82f6;
      --color-gray-900: #111827;
      --color-white: #ffffff;
      --screen-sm: 640px;
      --screen-md: 768px;
      --screen-lg: 1024px;
    }
  `;

  const mockTheme = {
    spacing: {
      '0': '0px',
      '1': '0.25rem',
      '2': '0.5rem',
      '4': '1rem',
    },
    colors: {
      blue: {
        '500': '#3b82f6',
      },
      gray: {
        '900': '#111827',
      },
      white: '#ffffff',
    },
    fontSize: {
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
    },
    lineHeight: {
      none: '1',
      normal: '1.5',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
    },
  };

  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();

    // Mock fs.existsSync
    vi.mocked(fs.existsSync).mockImplementation((filePath) => {
      if (filePath === '/path/to/tokens.css') return true;
      if (filePath === '/path/to/missing.css') return false;
      if (filePath === '/path/to/tailwind.config.js') return true;
      return false;
    });

    // Mock fs.readFileSync
    vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
      if (filePath === '/path/to/tokens.css') return mockCssContent;
      throw new Error(`File not found: ${String(filePath)}`);
    });

    // Mock fs.statSync
    vi.mocked(fs.statSync).mockImplementation((filePath) => {
      if (filePath === '/path/to/tokens.css') {
        return { mtimeMs: 1234567890 } as fs.Stats;
      }
      throw new Error(`File not found: ${String(filePath)}`);
    });

    // Mock path.dirname
    vi.mocked(path.dirname).mockImplementation(() => {
      return '/path/to';
    });

    // Mock path.join
    vi.mocked(path.join).mockImplementation((...paths: string[]) => {
      return paths.join('/');
    });

    // Mock loadTheme
    vi.mocked(loadTheme).mockResolvedValue(mockTheme);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('loadTokens', () => {
    it('should load tokens from CSS file when available', async () => {
      const tokens = await loadTokens({ cssPath: '/path/to/tokens.css' });

      // Check version and source
      expect(tokens.version).toBe('v4');
      expect(tokens.source).toBe('css-variables');

      // Check spacing tokens
      expect(tokens.spacing['0']).toBe('0px');
      expect(tokens.spacing['1']).toBe('0.25rem');
      expect(tokens.spacing['2']).toBe('0.5rem');
      expect(tokens.spacing['4']).toBe('1rem');

      // Check font size tokens
      expect(tokens.fontSize.sm[0]).toBe('0.875rem');
      expect(tokens.fontSize.base[0]).toBe('1rem');
      expect(tokens.fontSize.lg[0]).toBe('1.125rem');

      // Check line height tokens
      expect(tokens.lineHeight.none).toBe('1');
      expect(tokens.lineHeight.normal).toBe('1.5');

      // Check color tokens
      expect(tokens.colors['blue-500']).toBe('#3b82f6');
      expect(tokens.colors['gray-900']).toBe('#111827');
      expect(tokens.colors.white).toBe('#ffffff');

      // Check screen tokens
      expect(tokens.screens.sm).toBe(640);
      expect(tokens.screens.md).toBe(768);
      expect(tokens.screens.lg).toBe(1024);
    });

    it('should fall back to v3 theme when CSS file is not available', async () => {
      const tokens = await loadTokens({ cssPath: '/path/to/missing.css' });

      // Check version and source
      expect(tokens.version).toBe('v3');
      expect(tokens.source).toBe('config');

      // Verify loadTheme was called
      expect(loadTheme).toHaveBeenCalled();

      // Check spacing tokens from v3 theme
      expect(tokens.spacing['0']).toBe('0px');
      expect(tokens.spacing['1']).toBe('0.25rem');
      expect(tokens.spacing['2']).toBe('0.5rem');
      expect(tokens.spacing['4']).toBe('1rem');

      // Check that screens were converted to numeric values
      expect(tokens.screens.sm).toBe(640);
      expect(tokens.screens.md).toBe(768);
      expect(tokens.screens.lg).toBe(1024);
    });

    it('should fall back to default tokens when both CSS and config are not available', async () => {
      // Mock loadTheme to throw an error
      vi.mocked(loadTheme).mockRejectedValue(new Error('Config not found'));

      const tokens = await loadTokens({ cssPath: '/path/to/missing.css' });

      // Check version and source
      expect(tokens.version).toBe('v4');
      expect(tokens.source).toBe('default');

      // Check that default tokens are used
      expect(tokens.spacing['0']).toBe('0px');
      expect(tokens.spacing['1']).toBe('0.25rem');
      expect(tokens.spacing['4']).toBe('1rem');
      expect(tokens.fontSize.base[0]).toBe('1rem');
    });

    it('should handle errors gracefully when reading CSS file', async () => {
      // Mock readFileSync to throw an error
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw new Error('Error reading file');
      });

      const tokens = await loadTokens({ cssPath: '/path/to/tokens.css' });

      // Should fall back to v3 theme
      expect(tokens.version).toBe('v3');
      expect(tokens.source).toBe('config');

      // Verify loadTheme was called
      expect(loadTheme).toHaveBeenCalled();
    });
  });

  describe('detectTailwindVersion', () => {
    it('should detect v4 when CSS tokens are present', () => {
      const version = detectTailwindVersion({ cssPath: '/path/to/tokens.css' });
      expect(version).toBe('v4');
    });

    it('should detect v3 when CSS tokens are not present', () => {
      const version = detectTailwindVersion({ cssPath: '/path/to/missing.css' });
      expect(version).toBe('v3');
    });

    it('should respect explicit version setting', () => {
      expect(detectTailwindVersion({ version: 'v3' })).toBe('v3');
      expect(detectTailwindVersion({ version: 'v4' })).toBe('v4');
    });

    it('should handle errors gracefully', () => {
      // Mock readFileSync to throw an error
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw new Error('Error reading file');
      });

      const version = detectTailwindVersion({ cssPath: '/path/to/tokens.css' });
      expect(version).toBe('v3');
    });
  });

  describe('parseCustomProperties', () => {
    it('should extract spacing tokens from CSS', () => {
      const css = `
        :root {
          --spacing-0: 0px;
          --spacing-1: 0.25rem;
          --spacing-2: 0.5rem;
          --spacing-4: 1rem;
        }
      `;
      const properties = parseCustomProperties(css);

      expect(properties['spacing-0']).toBe('0px');
      expect(properties['spacing-1']).toBe('0.25rem');
      expect(properties['spacing-2']).toBe('0.5rem');
      expect(properties['spacing-4']).toBe('1rem');
    });

    it('should extract color tokens from CSS', () => {
      const css = `
        :root {
          --color-blue-500: #3b82f6;
          --color-red-600: #dc2626;
          --color-white: #ffffff;
        }
      `;
      const properties = parseCustomProperties(css);

      expect(properties['color-blue-500']).toBe('#3b82f6');
      expect(properties['color-red-600']).toBe('#dc2626');
      expect(properties['color-white']).toBe('#ffffff');
    });

    it('should extract font size tokens from CSS', () => {
      const css = `
        :root {
          --font-size-xs: 0.75rem;
          --font-size-sm: 0.875rem;
          --font-size-base: 1rem;
          --font-size-lg: 1.125rem;
        }
      `;
      const properties = parseCustomProperties(css);

      expect(properties['font-size-xs']).toBe('0.75rem');
      expect(properties['font-size-sm']).toBe('0.875rem');
      expect(properties['font-size-base']).toBe('1rem');
      expect(properties['font-size-lg']).toBe('1.125rem');
    });

    it('should extract line height tokens from CSS', () => {
      const css = `
        :root {
          --leading-none: 1;
          --leading-tight: 1.25;
          --leading-normal: 1.5;
          --leading-loose: 2;
        }
      `;
      const properties = parseCustomProperties(css);

      expect(properties['leading-none']).toBe('1');
      expect(properties['leading-tight']).toBe('1.25');
      expect(properties['leading-normal']).toBe('1.5');
      expect(properties['leading-loose']).toBe('2');
    });

    it('should extract screen breakpoint tokens from CSS', () => {
      const css = `
        :root {
          --screen-sm: 640px;
          --screen-md: 768px;
          --screen-lg: 1024px;
          --screen-xl: 1280px;
          --screen-2xl: 1536px;
        }
      `;
      const properties = parseCustomProperties(css);

      expect(properties['screen-sm']).toBe('640px');
      expect(properties['screen-md']).toBe('768px');
      expect(properties['screen-lg']).toBe('1024px');
      expect(properties['screen-xl']).toBe('1280px');
      expect(properties['screen-2xl']).toBe('1536px');
    });

    it('should handle multiple :root blocks', () => {
      const css = `
        :root {
          --spacing-1: 0.25rem;
          --color-blue-500: #3b82f6;
        }
        
        @layer base {
          :root {
            --spacing-2: 0.5rem;
            --color-red-500: #ef4444;
          }
        }
      `;
      const properties = parseCustomProperties(css);

      expect(properties['spacing-1']).toBe('0.25rem');
      expect(properties['spacing-2']).toBe('0.5rem');
      expect(properties['color-blue-500']).toBe('#3b82f6');
      expect(properties['color-red-500']).toBe('#ef4444');
    });

    it('should handle escaped dots in property names', () => {
      const css = `
        :root {
          --spacing-0\\.5: 0.125rem;
          --spacing-1\\.5: 0.375rem;
          --spacing-2\\.5: 0.625rem;
        }
      `;
      const properties = parseCustomProperties(css);

      expect(properties['spacing-0\\.5']).toBe('0.125rem');
      expect(properties['spacing-1\\.5']).toBe('0.375rem');
      expect(properties['spacing-2\\.5']).toBe('0.625rem');
    });

    it('should handle empty CSS content', () => {
      const properties = parseCustomProperties('');
      expect(Object.keys(properties)).toHaveLength(0);
    });

    it('should handle CSS without :root selector', () => {
      const css = `
        .some-class {
          color: red;
        }
      `;
      const properties = parseCustomProperties(css);
      expect(Object.keys(properties)).toHaveLength(0);
    });

    it('should trim whitespace from values', () => {
      const css = `
        :root {
          --spacing-1:   0.25rem  ;
          --color-blue:  #3b82f6   ;
        }
      `;
      const properties = parseCustomProperties(css);

      expect(properties['spacing-1']).toBe('0.25rem');
      expect(properties['color-blue']).toBe('#3b82f6');
    });
  });
});

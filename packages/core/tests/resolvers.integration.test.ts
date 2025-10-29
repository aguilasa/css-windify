import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import {
  resolveSpacingToken,
  resolveColorToken,
  resolveFontSizeToken,
  resolveLineHeightToken,
} from '../src/core/resolvers';
import { loadTokens } from '../src/core/tokensLoader';
import { MatchCtx } from '../src/types';
import * as path from 'path';
import * as fs from 'fs';

describe('resolvers integration tests', () => {
  // Create a temporary CSS file with tokens for testing
  const tempDir = path.join(__dirname, 'temp');
  const tokensCssPath = path.join(tempDir, 'tokens.css');

  // Create the temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  // Create a CSS file with tokens
  const cssContent = `
    :root {
      /* Spacing tokens */
      --spacing-0: 0px;
      --spacing-1: 0.25rem;
      --spacing-2: 0.5rem;
      --spacing-4: 1rem;
      --spacing-8: 2rem;
      
      /* Font size tokens */
      --font-size-sm: 0.875rem;
      --font-size-base: 1rem;
      --font-size-lg: 1.125rem;
      
      /* Line height tokens */
      --leading-none: 1;
      --leading-normal: 1.5;
      --leading-loose: 2;
      
      /* Color tokens */
      --color-blue-500: #3b82f6;
      --color-red-500: #ef4444;
      --color-white: #ffffff;
      --color-black: #000000;
      
      /* Screen tokens */
      --screen-sm: 640px;
      --screen-md: 768px;
      --screen-lg: 1024px;
    }
  `;

  fs.writeFileSync(tokensCssPath, cssContent);

  // Clean up after tests
  afterAll(() => {
    if (fs.existsSync(tokensCssPath)) {
      fs.unlinkSync(tokensCssPath);
    }
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir);
    }
  });

  describe('resolvers with loaded tokens', () => {
    let ctx: MatchCtx;

    // Load tokens before tests
    beforeEach(async () => {
      const tokens = await loadTokens({ cssPath: tokensCssPath });
      ctx = {
        version: 'v4',
        tokens,
        theme: {}, // Empty theme to ensure we're using tokens
        opts: {
          strict: false,
          approximate: true,
          thresholds: {
            spacingPx: 2,
            fontPx: 1,
            radiiPx: 2,
          },
          screens: {
            sm: 640,
            md: 768,
            lg: 1024,
          },
        },
      };
    });

    it('should resolve spacing tokens from CSS variables', () => {
      const result = resolveSpacingToken('1rem', ctx);

      expect(result.token).toBe('4');
      expect(result.type).toBe('exact');
      expect(result.warning).toBeUndefined();
    });

    it('should resolve approximate spacing with warning', () => {
      const result = resolveSpacingToken('0.48rem', ctx);

      expect(result.token).toBe('2');
      expect(result.type).toBe('approximate');
      expect(result.warning).toContain('approximate');
      expect(result.warning).toContain('0.48rem');
    });

    it('should resolve color tokens from CSS variables', () => {
      const result = resolveColorToken('#3b82f6', ctx);

      expect(result.class).toBe('blue-500');
      expect(result.type).toBe('exact');
      expect(result.warning).toBeUndefined();
    });

    it('should resolve font size tokens from CSS variables', () => {
      const result = resolveFontSizeToken('1rem', ctx);

      expect(result.token).toBe('base');
      expect(result.type).toBe('exact');
      expect(result.warning).toBeUndefined();
    });

    it('should resolve line height tokens from CSS variables', () => {
      const result = resolveLineHeightToken('1.5', ctx);

      expect(result.token).toBe('normal');
      expect(result.type).toBe('exact');
      expect(result.warning).toBeUndefined();
    });

    it('should emit token-miss warning in strict mode', () => {
      const strictCtx = { ...ctx, opts: { ...ctx.opts, strict: true } };

      const result = resolveSpacingToken('3rem', strictCtx);

      expect(result.token).toBeNull();
      expect(result.type).toBe('none');
      expect(result.warning).toContain('token-miss');
    });
  });

  describe('resolvers with v3 fallback', () => {
    let ctx: MatchCtx;

    // Create a context with v4 version but no tokens
    beforeEach(async () => {
      ctx = {
        version: 'v4',
        tokens: undefined,
        theme: {
          spacing: {
            '0': '0px',
            '1': '0.25rem',
            '2': '0.5rem',
            '4': '1rem',
            '8': '2rem',
          },
          colors: {
            blue: {
              '500': '#3b82f6',
            },
            red: {
              '500': '#ef4444',
            },
            white: '#ffffff',
            black: '#000000',
          },
          fontSize: {
            sm: ['0.875rem', { lineHeight: '1.25rem' }],
            base: ['1rem', { lineHeight: '1.5rem' }],
            lg: ['1.125rem', { lineHeight: '1.75rem' }],
          },
          lineHeight: {
            none: '1',
            normal: '1.5',
            loose: '2',
          },
        },
        opts: {
          strict: false,
          approximate: true,
          thresholds: {
            spacingPx: 2,
            fontPx: 1,
            radiiPx: 2,
          },
          screens: {
            sm: 640,
            md: 768,
            lg: 1024,
          },
        },
      };
    });

    it('should fall back to v3 theme with warning', () => {
      const result = resolveSpacingToken('1rem', ctx);

      expect(result.token).toBe('4');
      expect(result.type).toBe('exact');
      expect(result.warning).toContain('v3-fallback');
    });

    it('should fall back to v3 theme for colors with warning', () => {
      const result = resolveColorToken('#3b82f6', ctx);

      expect(result.class).toBe('blue-500');
      expect(result.type).toBe('exact');
      expect(result.warning).toContain('v3-fallback');
    });
  });
});

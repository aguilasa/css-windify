import { describe, it, expect } from 'vitest';
import {
  resolveNearestTokenPx,
  resolveSpacingToken,
  resolveColorToken,
  resolveFontSizeToken,
  resolveLineHeightToken,
} from './resolvers';
import { MatchCtx } from '../types';

describe('resolvers', () => {
  describe('resolveNearestTokenPx', () => {
    it('should find the nearest token by pixel value', () => {
      const tokenMapPx = {
        '0': 0,
        '1': 4,
        '2': 8,
        '4': 16,
        '6': 24,
        '8': 32,
      };

      const result = resolveNearestTokenPx(10, tokenMapPx);

      expect(result).not.toBeNull();
      expect(result?.tokenKey).toBe('2');
      expect(result?.tokenPx).toBe(8);
      expect(result?.diffPx).toBe(2);
    });

    it('should handle exact matches', () => {
      const tokenMapPx = {
        '0': 0,
        '1': 4,
        '2': 8,
        '4': 16,
      };

      const result = resolveNearestTokenPx(8, tokenMapPx);

      expect(result).not.toBeNull();
      expect(result?.tokenKey).toBe('2');
      expect(result?.tokenPx).toBe(8);
      expect(result?.diffPx).toBe(0);
    });

    it('should return null for invalid inputs', () => {
      expect(resolveNearestTokenPx(0, {})).toBeNull();
      expect(resolveNearestTokenPx(0, null as any)).toBeNull();
      expect(resolveNearestTokenPx(null as any, { '0': 0 })).toBeNull();
    });
  });

  describe('resolveSpacingToken', () => {
    // Create base context for testing
    const baseCtx: MatchCtx = {
      version: 'v3',
      theme: {
        spacing: {
          '0': '0px',
          '1': '0.25rem',
          '2': '0.5rem',
          '4': '1rem',
          '8': '2rem',
        },
      },
      opts: {
        strict: false,
        approximate: false,
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

    // Create v4 context for testing
    const v4Ctx: MatchCtx = {
      ...baseCtx,
      version: 'v4',
      tokens: {
        spacing: {
          '0': '0px',
          '1': '0.25rem',
          '2': '0.5rem',
          '4': '1rem',
          '8': '2rem',
        },
        colors: {},
        fontSize: {},
        lineHeight: {},
        screens: {
          sm: 640,
          md: 768,
          lg: 1024,
        },
        version: 'v4',
        source: 'css-variables',
      },
    };

    it('should find exact match in v3 theme', () => {
      const result = resolveSpacingToken('1rem', baseCtx);

      expect(result.token).toBe('4');
      expect(result.type).toBe('exact');
      expect(result.warning).toBeUndefined();
    });

    it('should find exact match in v4 tokens', () => {
      const result = resolveSpacingToken('1rem', v4Ctx);

      expect(result.token).toBe('4');
      expect(result.type).toBe('exact');
      expect(result.warning).toBeUndefined();
    });

    it('should find approximate match when enabled', () => {
      const ctx = {
        ...baseCtx,
        opts: { ...baseCtx.opts, approximate: true },
      };

      const result = resolveSpacingToken('0.55rem', ctx);

      expect(result.token).toBe('2');
      expect(result.type).toBe('approximate');
      expect(result.warning).toContain('approximate');
      expect(result.warning).toContain('0.55rem');
    });

    it('should not find approximate match when disabled', () => {
      const result = resolveSpacingToken('0.55rem', baseCtx);

      expect(result.token).toBeNull();
      expect(result.type).toBe('none');
    });

    it('should emit token-miss warning in strict v4 mode', () => {
      const ctx = {
        ...v4Ctx,
        opts: { ...v4Ctx.opts, strict: true },
      };

      const result = resolveSpacingToken('0.55rem', ctx);

      expect(result.token).toBeNull();
      expect(result.type).toBe('none');
      expect(result.warning).toContain('token-miss');
    });

    it('should emit v3-fallback warning when falling back to v3 theme', () => {
      // Create v4 context with empty tokens but v3 theme
      const ctx: MatchCtx = {
        ...v4Ctx,
        tokens: {
          ...v4Ctx.tokens!,
          spacing: {},
        },
      };

      const result = resolveSpacingToken('1rem', ctx);

      expect(result.token).toBe('4');
      expect(result.type).toBe('exact');
      expect(result.warning).toContain('v3-fallback');
    });
  });

  describe('resolveColorToken', () => {
    // Create base context for testing
    const baseCtx: MatchCtx = {
      version: 'v3',
      theme: {
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
      },
      opts: {
        strict: false,
        approximate: false,
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

    // Create v4 context for testing
    const v4Ctx: MatchCtx = {
      ...baseCtx,
      version: 'v4',
      tokens: {
        spacing: {},
        colors: {
          'blue-500': '#3b82f6',
          'red-500': '#ef4444',
          white: '#ffffff',
          black: '#000000',
        },
        fontSize: {},
        lineHeight: {},
        screens: {
          sm: 640,
          md: 768,
          lg: 1024,
        },
        version: 'v4',
        source: 'css-variables',
      },
    };

    it('should find exact match in v3 theme', () => {
      const result = resolveColorToken('#3b82f6', baseCtx);

      expect(result.class).toBe('blue-500');
      expect(result.type).toBe('exact');
      expect(result.warning).toBeUndefined();
    });

    it('should find exact match in v4 tokens', () => {
      const result = resolveColorToken('#3b82f6', v4Ctx);

      expect(result.class).toBe('blue-500');
      expect(result.type).toBe('exact');
      expect(result.warning).toBeUndefined();
    });

    it('should emit token-miss warning in strict v4 mode', () => {
      const ctx = {
        ...v4Ctx,
        opts: { ...v4Ctx.opts, strict: true },
      };

      const result = resolveColorToken('#ff00ff', ctx);

      expect(result.class).toBeUndefined();
      expect(result.type).toBe('none');
      expect(result.warning).toContain('token-miss');
    });

    it('should emit v3-fallback warning when falling back to v3 theme', () => {
      // Create v4 context with empty tokens but v3 theme
      const ctx: MatchCtx = {
        ...v4Ctx,
        tokens: {
          ...v4Ctx.tokens!,
          colors: {},
        },
      };

      const result = resolveColorToken('#3b82f6', ctx);

      expect(result.class).toBe('blue-500');
      expect(result.type).toBe('exact');
      expect(result.warning).toContain('v3-fallback');
    });
  });

  describe('resolveFontSizeToken', () => {
    // Create base context for testing
    const baseCtx: MatchCtx = {
      version: 'v3',
      theme: {
        fontSize: {
          xs: ['0.75rem', { lineHeight: '1rem' }],
          sm: ['0.875rem', { lineHeight: '1.25rem' }],
          base: ['1rem', { lineHeight: '1.5rem' }],
          lg: ['1.125rem', { lineHeight: '1.75rem' }],
          xl: ['1.25rem', { lineHeight: '1.75rem' }],
        },
      },
      opts: {
        strict: false,
        approximate: false,
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

    // Create v4 context for testing
    const v4Ctx: MatchCtx = {
      ...baseCtx,
      version: 'v4',
      tokens: {
        spacing: {},
        colors: {},
        fontSize: {
          xs: ['0.75rem', { lineHeight: '1rem' }],
          sm: ['0.875rem', { lineHeight: '1.25rem' }],
          base: ['1rem', { lineHeight: '1.5rem' }],
          lg: ['1.125rem', { lineHeight: '1.75rem' }],
          xl: ['1.25rem', { lineHeight: '1.75rem' }],
        },
        lineHeight: {},
        screens: {
          sm: 640,
          md: 768,
          lg: 1024,
        },
        version: 'v4',
        source: 'css-variables',
      },
    };

    it('should find exact match in v3 theme', () => {
      const result = resolveFontSizeToken('1rem', baseCtx);

      expect(result.token).toBe('base');
      expect(result.type).toBe('exact');
      expect(result.warning).toBeUndefined();
    });

    it('should find exact match in v4 tokens', () => {
      const result = resolveFontSizeToken('1rem', v4Ctx);

      expect(result.token).toBe('base');
      expect(result.type).toBe('exact');
      expect(result.warning).toBeUndefined();
    });

    it('should find approximate match when enabled', () => {
      const ctx = {
        ...baseCtx,
        opts: { ...baseCtx.opts, approximate: true },
      };

      const result = resolveFontSizeToken('0.89rem', ctx);

      expect(result.token).toBe('sm');
      expect(result.type).toBe('approximate');
      expect(result.warning).toContain('approximate');
      expect(result.warning).toContain('0.89rem');
    });

    it('should not find approximate match when disabled', () => {
      const result = resolveFontSizeToken('0.89rem', baseCtx);

      expect(result.token).toBeNull();
      expect(result.type).toBe('none');
    });

    it('should emit token-miss warning in strict v4 mode', () => {
      const ctx = {
        ...v4Ctx,
        opts: { ...v4Ctx.opts, strict: true },
      };

      const result = resolveFontSizeToken('0.89rem', ctx);

      expect(result.token).toBeNull();
      expect(result.type).toBe('none');
      expect(result.warning).toContain('token-miss');
    });

    it('should emit v3-fallback warning when falling back to v3 theme', () => {
      // Create v4 context with empty tokens but v3 theme
      const ctx: MatchCtx = {
        ...v4Ctx,
        tokens: {
          ...v4Ctx.tokens!,
          fontSize: {},
        },
      };

      const result = resolveFontSizeToken('1rem', ctx);

      expect(result.token).toBe('base');
      expect(result.type).toBe('exact');
      expect(result.warning).toContain('v3-fallback');
    });
  });

  describe('resolveLineHeightToken', () => {
    // Create base context for testing
    const baseCtx: MatchCtx = {
      version: 'v3',
      theme: {
        lineHeight: {
          none: '1',
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.625',
          loose: '2',
        },
      },
      opts: {
        strict: false,
        approximate: false,
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

    // Create v4 context for testing
    const v4Ctx: MatchCtx = {
      ...baseCtx,
      version: 'v4',
      tokens: {
        spacing: {},
        colors: {},
        fontSize: {},
        lineHeight: {
          none: '1',
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.625',
          loose: '2',
        },
        screens: {
          sm: 640,
          md: 768,
          lg: 1024,
        },
        version: 'v4',
        source: 'css-variables',
      },
    };

    it('should find exact match in v3 theme', () => {
      const result = resolveLineHeightToken('1.5', baseCtx);

      expect(result.token).toBe('normal');
      expect(result.type).toBe('exact');
      expect(result.warning).toBeUndefined();
    });

    it('should find exact match in v4 tokens', () => {
      const result = resolveLineHeightToken('1.5', v4Ctx);

      expect(result.token).toBe('normal');
      expect(result.type).toBe('exact');
      expect(result.warning).toBeUndefined();
    });

    it('should find approximate match when enabled', () => {
      const ctx = {
        ...baseCtx,
        opts: { ...baseCtx.opts, approximate: true },
      };

      const result = resolveLineHeightToken('1.52', ctx);

      expect(result.token).toBe('normal');
      expect(result.type).toBe('approximate');
      expect(result.warning).toContain('approximate');
      expect(result.warning).toContain('1.52');
    });

    it('should not find approximate match when disabled', () => {
      const result = resolveLineHeightToken('1.52', baseCtx);

      expect(result.token).toBeNull();
      expect(result.type).toBe('none');
    });

    it('should emit token-miss warning in strict v4 mode', () => {
      const ctx = {
        ...v4Ctx,
        opts: { ...v4Ctx.opts, strict: true },
      };

      const result = resolveLineHeightToken('1.52', ctx);

      expect(result.token).toBeNull();
      expect(result.type).toBe('none');
      expect(result.warning).toContain('token-miss');
    });

    it('should emit v3-fallback warning when falling back to v3 theme', () => {
      // Create v4 context with empty tokens but v3 theme
      const ctx: MatchCtx = {
        ...v4Ctx,
        tokens: {
          ...v4Ctx.tokens!,
          lineHeight: {},
        },
      };

      const result = resolveLineHeightToken('1.5', ctx);

      expect(result.token).toBe('normal');
      expect(result.type).toBe('exact');
      expect(result.warning).toContain('v3-fallback');
    });
  });
});

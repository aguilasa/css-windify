/**
 * Performance benchmarks for CSSWindify
 * Run with: pnpm bench
 */

import { bench, describe } from 'vitest';
import { transformCssText } from '../src/index';
import { loadTokens, clearTokenCache } from '../src/core/tokensLoader';
import { resolveSpacingToken, clearResolverCache } from '../src/core/resolvers';
import { MatchCtx } from '../src/types';

// Sample CSS for benchmarking
const sampleCSS = `
  .button {
    display: flex;
    padding: 1rem 2rem;
    margin: 0.5rem;
    background-color: #3b82f6;
    color: #ffffff;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .card {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    padding: 2rem;
    background-color: #f3f4f6;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #1f2937;
    color: #f9fafb;
  }
`;

const ctx: MatchCtx = {
  theme: {},
  version: 'v3',
  tokens: undefined,
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
      xl: 1280,
      '2xl': 1536,
    },
  },
};

describe('CSS Transformation', () => {
  bench('transformCssText - small CSS', () => {
    transformCssText(sampleCSS, ctx);
  });

  bench('transformCssText - large CSS', () => {
    const largeCss = sampleCSS.repeat(10);
    transformCssText(largeCss, ctx);
  });

  bench('transformCssText - with cache', () => {
    // Run twice to test cache
    transformCssText(sampleCSS, ctx);
    transformCssText(sampleCSS, ctx);
  });
});

describe('Token Loading', () => {
  bench('loadTokens - with cache', async () => {
    await loadTokens({ cssPath: './tests/fixtures/tailwind-v4.css' });
  });

  bench('loadTokens - without cache', async () => {
    clearTokenCache();
    await loadTokens({ cssPath: './tests/fixtures/tailwind-v4.css' });
  });
});

describe('Resolver Functions', () => {
  bench('resolveSpacingToken - with cache', () => {
    resolveSpacingToken('1rem', ctx);
    resolveSpacingToken('1rem', ctx); // Should hit cache
  });

  bench('resolveSpacingToken - without cache', () => {
    clearResolverCache();
    resolveSpacingToken('1rem', ctx);
  });

  bench('resolveSpacingToken - various values', () => {
    const values = ['0.5rem', '1rem', '1.5rem', '2rem', '16px', '24px', '32px'];
    values.forEach((v) => resolveSpacingToken(v, ctx));
  });
});

describe('Cache Performance', () => {
  bench('cache hit rate - high', () => {
    clearResolverCache();
    // Warm up cache
    for (let i = 0; i < 10; i++) {
      resolveSpacingToken('1rem', ctx);
    }
    // Test cache hits
    for (let i = 0; i < 100; i++) {
      resolveSpacingToken('1rem', ctx);
    }
  });

  bench('cache hit rate - low', () => {
    clearResolverCache();
    // Test cache misses
    for (let i = 0; i < 100; i++) {
      resolveSpacingToken(`${i}px`, ctx);
    }
  });
});

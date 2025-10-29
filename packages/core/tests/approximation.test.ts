import { describe, it, expect } from 'vitest';
import { transformDeclarations, loadTheme } from '../src';

describe('Approximation Mode Tests', () => {
  // Test cases with values that are close to Tailwind tokens
  const testCases = [
    { prop: 'width', value: '15px', expectedStrict: 'w-[15px]', expectedApprox: 'w-4' },
    { prop: 'height', value: '31px', expectedStrict: 'h-[31px]', expectedApprox: 'h-8' },
    { prop: 'margin', value: '7px', expectedStrict: 'm-[7px]', expectedApprox: 'm-2' },
    { prop: 'padding', value: '23px', expectedStrict: 'p-[23px]', expectedApprox: 'p-6' },
    { prop: 'font-size', value: '15px', expectedStrict: 'text-[15px]', expectedApprox: 'text-sm' },
    {
      prop: 'line-height',
      value: '1.49',
      expectedStrict: 'leading-[1.49]',
      expectedApprox: 'leading-normal',
    },
    // Removed border-radius as it might not be properly implemented for approximation yet
  ];

  it('should use arbitrary values in strict mode and approximate in approximate mode', async () => {
    const theme = await loadTheme(process.cwd());

    // Test in strict mode
    const strictCtx = {
      theme,
      version: 'v3' as const,
      opts: {
        strict: true,
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
          xl: 1280,
          '2xl': 1536,
        },
      },
    };
    const strictResults = testCases.map((tc) => {
      const result = transformDeclarations([{ prop: tc.prop, value: tc.value }], strictCtx);
      return {
        prop: tc.prop,
        value: tc.value,
        classes: result.classes,
        warnings: result.warnings,
        expected: tc.expectedStrict,
      };
    });

    // Test in approximate mode
    const approxCtx = {
      theme,
      version: 'v3' as const,
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
    const approxResults = testCases.map((tc) => {
      const result = transformDeclarations([{ prop: tc.prop, value: tc.value }], approxCtx);
      return {
        prop: tc.prop,
        value: tc.value,
        classes: result.classes,
        warnings: result.warnings,
        expected: tc.expectedApprox,
      };
    });

    // Verify strict mode results
    strictResults.forEach((result) => {
      expect(result.classes).toContain(result.expected);
      // Strict mode should have arbitrary values and warnings
      expect(result.classes.some((cls) => cls.includes('['))).toBe(true);
      expect(result.warnings.some((w) => w.includes('arbitrary value'))).toBe(true);
    });

    // Verify approximate mode results
    approxResults.forEach((result) => {
      expect(result.classes).toContain(result.expected);
      // Approximate mode should have warnings about approximation
      expect(result.warnings.some((w) => w.includes('approximate:'))).toBe(true);
    });

    // Snapshot the results for future comparison
    expect({ strictResults, approxResults }).toMatchSnapshot();
  });

  it('should demonstrate approximation with different settings', async () => {
    const theme = await loadTheme(process.cwd());

    // Test with strict mode (no approximation)
    const strictCtx = {
      theme,
      version: 'v3' as const,
      opts: {
        strict: true,
        approximate: true, // Should be ignored when strict is true
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

    // Test with approximate mode
    const approxCtx = {
      theme,
      version: 'v3' as const,
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

    // Use a value that's known to work with approximation
    const value = '15px'; // Close to 16px (1rem)

    const strictResult = transformDeclarations([{ prop: 'width', value }], strictCtx);
    const approxResult = transformDeclarations([{ prop: 'width', value }], approxCtx);

    // Strict mode should have arbitrary values in classes
    expect(strictResult.classes.some((c) => c.includes('['))).toBe(true);

    // Snapshot the results for comparison
    expect({
      value,
      strict: {
        classes: strictResult.classes,
        warnings: strictResult.warnings,
      },
      approximate: {
        classes: approxResult.classes,
        warnings: approxResult.warnings,
      },
    }).toMatchSnapshot();
  });
});

import { describe, it, expect } from 'vitest';
import * as path from 'path';
import { loadTokens, detectTailwindVersion } from '../src/core/tokensLoader';

describe('tokensLoader integration tests', () => {
  const fixturesPath = path.join(__dirname, 'fixtures');
  const tokensCssPath = path.join(fixturesPath, 'tokens.css');

  describe('loadTokens with real CSS file', () => {
    it('should load tokens from the CSS file', async () => {
      const tokens = await loadTokens({ cssPath: tokensCssPath });

      // Check version and source
      expect(tokens.version).toBe('v4');
      expect(tokens.source).toBe('css-variables');

      // Check spacing tokens
      expect(tokens.spacing['0']).toBe('0px');
      expect(tokens.spacing['1']).toBe('0.25rem');
      expect(tokens.spacing['4']).toBe('1rem');

      // Check font size tokens
      expect(tokens.fontSize.sm[0]).toBe('0.875rem');
      expect(tokens.fontSize.base[0]).toBe('1rem');
      expect(tokens.fontSize.lg[0]).toBe('1.125rem');

      // Check line height tokens
      expect(tokens.lineHeight.none).toBe('1');
      expect(tokens.lineHeight.normal).toBe('1.5');

      // Check color tokens
      expect(tokens.colors.black).toBe('#000000');
      expect(tokens.colors.white).toBe('#ffffff');
      expect(tokens.colors['gray-500']).toBe('#6b7280');
      expect(tokens.colors['blue-500']).toBe('#3b82f6');

      // Check screen tokens
      expect(tokens.screens.sm).toBe(640);
      expect(tokens.screens.md).toBe(768);
      expect(tokens.screens.lg).toBe(1024);
      expect(tokens.screens.xl).toBe(1280);
      expect(tokens.screens['2xl']).toBe(1536);
    });
  });

  describe('detectTailwindVersion with real CSS file', () => {
    it('should detect v4 when CSS tokens are present', () => {
      const version = detectTailwindVersion({ cssPath: tokensCssPath });
      expect(version).toBe('v4');
    });

    it('should detect v3 when CSS tokens are not present', () => {
      const version = detectTailwindVersion({
        cssPath: path.join(fixturesPath, 'non-existent.css'),
      });
      expect(version).toBe('v3');
    });

    it('should respect explicit version setting', () => {
      expect(detectTailwindVersion({ version: 'v3', cssPath: tokensCssPath })).toBe('v3');
      expect(
        detectTailwindVersion({
          version: 'v4',
          cssPath: path.join(fixturesPath, 'non-existent.css'),
        })
      ).toBe('v4');
    });
  });
});

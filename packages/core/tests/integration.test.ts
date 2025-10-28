import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseCssRules, transformRule, loadTheme } from '../src';

// Helper function to read fixture files
function readFixture(filename: string): string {
  return fs.readFileSync(path.join(__dirname, 'fixtures', filename), 'utf-8');
}

// Test each fixture with both strict and approximate modes
describe('CSS to Tailwind Integration Tests', () => {
  // Load fixtures
  const buttonCss = readFixture('button.css');
  const cardCss = readFixture('card.css');
  const gridCss = readFixture('grid.css');

  // Create contexts for testing
  const createContext = async (strict: boolean, approximate: boolean) => {
    const theme = await loadTheme(process.cwd());
    return {
      theme,
      opts: { strict, approximate }
    };
  };

  describe('Button Component', () => {
    it('should transform button CSS with strict mode', async () => {
      const ctx = await createContext(true, false);
      const rules = parseCssRules(buttonCss);
      
      // Transform each rule and collect results
      const results = rules.map(rule => {
        const result = transformRule(rule, ctx);
        return {
          selector: rule.selector,
          classes: result.classes,
          warnings: result.warnings,
          coverage: result.coverage
        };
      });
      
      // Snapshot the results
      expect(results).toMatchSnapshot();
    });

    it('should transform button CSS with approximate mode', async () => {
      const ctx = await createContext(false, true);
      const rules = parseCssRules(buttonCss);
      
      // Transform each rule and collect results
      const results = rules.map(rule => {
        const result = transformRule(rule, ctx);
        return {
          selector: rule.selector,
          classes: result.classes,
          warnings: result.warnings,
          coverage: result.coverage
        };
      });
      
      // Snapshot the results
      expect(results).toMatchSnapshot();
    });
  });

  describe('Card Component', () => {
    it('should transform card CSS with strict mode', async () => {
      const ctx = await createContext(true, false);
      const rules = parseCssRules(cardCss);
      
      // Transform each rule and collect results
      const results = rules.map(rule => {
        const result = transformRule(rule, ctx);
        return {
          selector: rule.selector,
          classes: result.classes,
          warnings: result.warnings,
          coverage: result.coverage
        };
      });
      
      // Snapshot the results
      expect(results).toMatchSnapshot();
    });

    it('should transform card CSS with approximate mode', async () => {
      const ctx = await createContext(false, true);
      const rules = parseCssRules(cardCss);
      
      // Transform each rule and collect results
      const results = rules.map(rule => {
        const result = transformRule(rule, ctx);
        return {
          selector: rule.selector,
          classes: result.classes,
          warnings: result.warnings,
          coverage: result.coverage
        };
      });
      
      // Snapshot the results
      expect(results).toMatchSnapshot();
    });
  });

  describe('Grid Component', () => {
    it('should transform grid CSS with strict mode', async () => {
      const ctx = await createContext(true, false);
      const rules = parseCssRules(gridCss);
      
      // Transform each rule and collect results
      const results = rules.map(rule => {
        const result = transformRule(rule, ctx);
        return {
          selector: rule.selector,
          classes: result.classes,
          warnings: result.warnings,
          coverage: result.coverage
        };
      });
      
      // Snapshot the results
      expect(results).toMatchSnapshot();
    });

    it('should transform grid CSS with approximate mode', async () => {
      const ctx = await createContext(false, true);
      const rules = parseCssRules(gridCss);
      
      // Transform each rule and collect results
      const results = rules.map(rule => {
        const result = transformRule(rule, ctx);
        return {
          selector: rule.selector,
          classes: result.classes,
          warnings: result.warnings,
          coverage: result.coverage
        };
      });
      
      // Snapshot the results
      expect(results).toMatchSnapshot();
    });
  });

  describe('Coverage Comparison', () => {
    it('should compare coverage between strict and approximate modes', async () => {
      const strictCtx = await createContext(true, false);
      const approxCtx = await createContext(false, true);
      
      // Process all fixtures
      const fixtures = [
        { name: 'button', css: buttonCss },
        { name: 'card', css: cardCss },
        { name: 'grid', css: gridCss }
      ];
      
      const coverageResults = await Promise.all(fixtures.map(async fixture => {
        const rules = parseCssRules(fixture.css);
        
        // Get results for both modes
        const strictResults = rules.map(rule => transformRule(rule, strictCtx));
        const approxResults = rules.map(rule => transformRule(rule, approxCtx));
        
        // Calculate total coverage
        const strictCoverage = {
          matched: strictResults.reduce((sum, r) => sum + r.coverage.matched, 0),
          total: strictResults.reduce((sum, r) => sum + r.coverage.total, 0),
          nonArbitrary: strictResults.reduce((sum, r) => sum + (r.coverage.nonArbitrary || 0), 0),
          warnings: strictResults.reduce((sum, r) => sum + r.warnings.length, 0)
        };
        
        const approxCoverage = {
          matched: approxResults.reduce((sum, r) => sum + r.coverage.matched, 0),
          total: approxResults.reduce((sum, r) => sum + r.coverage.total, 0),
          nonArbitrary: approxResults.reduce((sum, r) => sum + (r.coverage.nonArbitrary || 0), 0),
          warnings: approxResults.reduce((sum, r) => sum + r.warnings.length, 0)
        };
        
        return {
          fixture: fixture.name,
          strict: strictCoverage,
          approximate: approxCoverage
        };
      }));
      
      // Snapshot the coverage comparison
      expect(coverageResults).toMatchSnapshot();
    });
  });
});

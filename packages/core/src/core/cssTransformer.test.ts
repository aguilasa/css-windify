import { describe, it, expect } from 'vitest';
import { transformCssText } from './cssTransformer';

describe('cssTransformer', () => {
  describe('transformCssText', () => {
    it('should transform CSS text into Tailwind classes by selector', () => {
      // Sample CSS
      const css = `
        .button {
          display: flex;
          padding: 1rem;
          margin: 0.5rem;
          background-color: #3b82f6;
          color: white;
          border-radius: 0.25rem;
        }
        
        .card {
          display: block;
          padding: 1.5rem;
          margin: 1rem;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      `;
      
      // Transform with default context
      const result = transformCssText(css, {
        theme: {},
        opts: { strict: false, approximate: true }
      });
      
      // Verify structure
      expect(result).toHaveProperty('bySelector');
      expect(Object.keys(result.bySelector)).toContain('.button');
      expect(Object.keys(result.bySelector)).toContain('.card');
      
      // Verify button results
      const buttonResult = result.bySelector['.button'];
      expect(buttonResult).toHaveProperty('classes');
      expect(buttonResult).toHaveProperty('warnings');
      expect(buttonResult).toHaveProperty('coverage');
      expect(buttonResult.classes.length).toBeGreaterThan(0);
      
      // Verify card results
      const cardResult = result.bySelector['.card'];
      expect(cardResult).toHaveProperty('classes');
      expect(cardResult).toHaveProperty('warnings');
      expect(cardResult).toHaveProperty('coverage');
      expect(cardResult.classes.length).toBeGreaterThan(0);
    });
    
    it('should handle empty CSS text', () => {
      const result = transformCssText('', {
        theme: {},
        opts: { strict: false, approximate: true }
      });
      
      expect(result).toHaveProperty('bySelector');
      expect(Object.keys(result.bySelector).length).toBe(0);
    });
  });
});

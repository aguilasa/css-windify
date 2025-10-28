import { describe, it, expect } from 'vitest';
import { parseCssRules } from './cssRules';

describe('cssRules parser', () => {
  it('should parse simple CSS rules', () => {
    const css = `
      .card {
        display: flex;
        flex-direction: column;
        padding: 1rem;
      }
    `;
    
    const result = parseCssRules(css);
    
    expect(result).toHaveLength(1);
    expect(result[0].selector).toBe('.card');
    expect(result[0].declarations).toHaveLength(3);
    expect(result[0].declarations[0]).toEqual({ prop: 'display', value: 'flex' });
    expect(result[0].declarations[1]).toEqual({ prop: 'flex-direction', value: 'column' });
    expect(result[0].declarations[2]).toEqual({ prop: 'padding', value: '1rem' });
  });

  it('should parse multiple CSS rules', () => {
    const css = `
      .card {
        display: flex;
        padding: 1rem;
      }
      
      .button {
        background-color: blue;
        color: white;
      }
    `;
    
    const result = parseCssRules(css);
    
    expect(result).toHaveLength(2);
    expect(result[0].selector).toBe('.card');
    expect(result[0].declarations).toHaveLength(2);
    expect(result[1].selector).toBe('.button');
    expect(result[1].declarations).toHaveLength(2);
  });

  it('should handle complex selectors', () => {
    const css = `
      .card > .header h2:hover {
        color: blue;
        font-weight: bold;
      }
    `;
    
    const result = parseCssRules(css);
    
    expect(result).toHaveLength(1);
    expect(result[0].selector).toBe('.card > .header h2:hover');
    expect(result[0].declarations).toHaveLength(2);
  });

  it('should ignore @media rules for now', () => {
    const css = `
      .card {
        padding: 1rem;
      }
      
      @media (min-width: 768px) {
        .card {
          padding: 2rem;
        }
      }
    `;
    
    const result = parseCssRules(css);
    
    expect(result).toHaveLength(1);
    expect(result[0].selector).toBe('.card');
    expect(result[0].declarations).toHaveLength(1);
    expect(result[0].declarations[0]).toEqual({ prop: 'padding', value: '1rem' });
  });

  it('should handle empty input', () => {
    expect(parseCssRules('')).toEqual([]);
    expect(parseCssRules('   ')).toEqual([]);
    expect(parseCssRules(null as unknown as string)).toEqual([]);
  });

  it('should handle invalid CSS gracefully', () => {
    const invalidCss = `
      .card {
        display: flex
        padding: 1rem;
      }
    `;
    
    expect(() => parseCssRules(invalidCss)).not.toThrow();
    expect(parseCssRules(invalidCss)).toEqual([]);
  });
});

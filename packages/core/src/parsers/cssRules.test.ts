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

  it('should process @media rules and extract responsive variants', () => {
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

    expect(result).toHaveLength(2);
    expect(result[0].selector).toBe('.card');
    expect(result[0].declarations).toHaveLength(1);
    expect(result[0].declarations[0]).toEqual({ prop: 'padding', value: '1rem' });

    // Check that the media query rule has the responsive variant
    expect(result[1].selector).toBe('.card');
    expect(result[1].declarations).toHaveLength(1);
    expect(result[1].declarations[0].prop).toBe('padding');
    expect(result[1].declarations[0].value).toBe('2rem');
    expect(result[1].declarations[0].variants).toEqual(['md']);
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

  describe('variant extraction', () => {
    it('should extract hover pseudo-class variant', () => {
      const css = `
        .btn:hover {
          background-color: blue;
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toEqual(['hover']);
    });

    it('should extract focus pseudo-class variant', () => {
      const css = `
        .btn:focus {
          outline: none;
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toEqual(['focus']);
    });

    it('should extract visited pseudo-class variant', () => {
      const css = `
        a:visited {
          color: purple;
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toEqual(['visited']);
    });

    it('should extract focus-visible and focus-within variants', () => {
      const css = `
        .input:focus-visible {
          outline: 2px solid blue;
        }
        .container:focus-within {
          border-color: blue;
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toEqual(['focus-visible']);
      expect(rules[1].declarations[0].variants).toEqual(['focus-within']);
    });

    it('should extract first, last, odd, and even variants', () => {
      const css = `
        li:first-child {
          margin-top: 0;
        }
        li:last-child {
          margin-bottom: 0;
        }
        li:nth-child(odd) {
          background-color: #f3f4f6;
        }
        li:nth-child(even) {
          background-color: white;
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toEqual(['first']);
      expect(rules[1].declarations[0].variants).toEqual(['last']);
      expect(rules[2].declarations[0].variants).toEqual(['odd']);
      expect(rules[3].declarations[0].variants).toEqual(['even']);
    });

    it('should extract group variants', () => {
      const css = `
        .group:hover .item {
          color: blue;
        }
        .group:focus .item {
          outline: 1px solid blue;
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toEqual(['group-hover']);
      expect(rules[1].declarations[0].variants).toEqual(['group-focus']);
    });

    it('should extract peer variants', () => {
      const css = `
        .peer:checked ~ .item {
          display: block;
        }
        .peer:focus ~ .item {
          border-color: blue;
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toEqual(['peer-checked']);
      expect(rules[1].declarations[0].variants).toEqual(['peer-focus']);
    });

    it('should extract responsive variants from media queries', () => {
      const css = `
        @media (min-width: 768px) {
          .container {
            padding: 2rem;
          }
        }
        @media (min-width: 1024px) {
          .container {
            padding: 4rem;
          }
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toEqual(['md']);
      expect(rules[1].declarations[0].variants).toEqual(['lg']);
    });

    it('should extract dark mode variant', () => {
      const css = `
        @media (prefers-color-scheme: dark) {
          .card {
            background-color: #1f2937;
            color: white;
          }
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toEqual(['dark']);
      expect(rules[0].declarations[1].variants).toEqual(['dark']);
    });

    it('should combine responsive and pseudo-class variants', () => {
      const css = `
        @media (min-width: 768px) {
          .btn:hover {
            background-color: blue;
          }
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toContain('md');
      expect(rules[0].declarations[0].variants).toContain('hover');
      expect(rules[0].declarations[0].variants?.length).toBe(2);
    });

    it('should handle complex variant combinations', () => {
      const css = `
        @media (min-width: 768px) {
          .group:hover .card:first-child {
            transform: scale(1.05);
          }
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toContain('md');
      expect(rules[0].declarations[0].variants).toContain('group-hover');
      expect(rules[0].declarations[0].variants).toContain('first');
      expect(rules[0].declarations[0].variants?.length).toBe(3);
    });
  });

  describe('media query parsing', () => {
    it('should extract max-width variants', () => {
      const css = `
        @media (max-width: 639px) {
          .card {
            padding: 0.5rem;
          }
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toContain('max-sm');
    });

    it('should extract orientation variants', () => {
      const css = `
        @media (orientation: portrait) {
          .card {
            flex-direction: column;
          }
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toContain('portrait');
    });

    it('should extract landscape orientation', () => {
      const css = `
        @media (orientation: landscape) {
          .card {
            flex-direction: row;
          }
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toContain('landscape');
    });

    it('should extract dark mode variant', () => {
      const css = `
        @media (prefers-color-scheme: dark) {
          .card {
            background-color: #1a1a1a;
          }
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toContain('dark');
    });

    it('should use 1px tolerance in approximate mode', () => {
      const css = `
        @media (min-width: 639px) {
          .card {
            padding: 1rem;
          }
        }
      `;

      // Without approximate, 639px should not match sm (640px)
      const rulesStrict = parseCssRules(css, false);
      expect(rulesStrict[0].declarations[0].variants).toBeUndefined();

      // With approximate, 639px should match sm (640px) with 1px tolerance
      const rulesApprox = parseCssRules(css, true);
      expect(rulesApprox[0].declarations[0].variants).toContain('sm');
    });

    it('should match exact breakpoints without tolerance', () => {
      const css = `
        @media (min-width: 640px) {
          .card {
            padding: 1rem;
          }
        }
      `;

      const rules = parseCssRules(css, false);
      expect(rules[0].declarations[0].variants).toContain('sm');
    });

    it('should handle multiple media query conditions', () => {
      const css = `
        @media (min-width: 768px) and (orientation: landscape) {
          .card {
            display: grid;
          }
        }
      `;

      const rules = parseCssRules(css);
      expect(rules[0].declarations[0].variants).toContain('md');
      // Note: Currently only extracts one variant per media query
      // Multiple conditions in same query would need enhancement
    });
  });
});

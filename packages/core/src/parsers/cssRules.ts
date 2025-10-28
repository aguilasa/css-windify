/**
 * Parser for CSS rules using PostCSS
 */
import postcss from 'postcss';
import { CssDeclaration, CssRule } from '../types';

/**
 * Parse a CSS string into an array of CSS rules
 * 
 * @param css The CSS string to parse
 * @returns Array of CSS rules
 */
export function parseCssRules(css: string): CssRule[] {
  if (!css) {
    return [];
  }

  try {
    // Parse the CSS using PostCSS
    const root = postcss.parse(css);
    const rules: CssRule[] = [];

    // Process each rule
    root.walkRules((rule) => {
      // Skip @media rules for now
      if (rule.parent?.type === 'atrule' && rule.parent.name === 'media') {
        return;
      }

      const declarations: CssDeclaration[] = [];

      // Process each declaration in the rule
      rule.walkDecls((decl) => {
        declarations.push({
          prop: decl.prop,
          value: decl.value
        });
      });

      // Add the rule to the result
      rules.push({
        selector: rule.selector,
        declarations
      });
    });

    return rules;
  } catch (error) {
    console.error('Error parsing CSS:', error);
    return [];
  }
}

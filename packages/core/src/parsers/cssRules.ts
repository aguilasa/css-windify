/**
 * Parser for CSS rules using PostCSS
 */
import postcss from 'postcss';
import { CssDeclaration, CssRule } from '../types';
import { PSEUDO_VARIANTS, GROUP_VARIANTS, PEER_VARIANTS } from '../core/variants';

/**
 * Extract responsive variants from a media query
 *
 * @param mediaQuery The media query string
 * @param approximate Whether to use approximate matching with 1px tolerance
 * @returns The responsive variant or undefined if not recognized
 */
function extractResponsiveVariant(mediaQuery: string, approximate = false): string | undefined {
  const tolerance = approximate ? 1 : 0;

  // Match min-width media queries
  const minWidthMatch = mediaQuery.match(/\(min-width:\s*([\d.]+)(px|rem|em)\)/i);
  if (minWidthMatch) {
    const value = parseFloat(minWidthMatch[1]);
    const unit = minWidthMatch[2].toLowerCase();

    // Convert to pixels for comparison if needed
    let valueInPx = value;
    if (unit === 'rem') valueInPx = value * 16;
    if (unit === 'em') valueInPx = value * 16;

    // Map to Tailwind's default breakpoints with tolerance
    // 2xl: 1536px
    if (Math.abs(valueInPx - 1536) <= tolerance) return '2xl';
    // xl: 1280px
    if (Math.abs(valueInPx - 1280) <= tolerance) return 'xl';
    // lg: 1024px
    if (Math.abs(valueInPx - 1024) <= tolerance) return 'lg';
    // md: 768px
    if (Math.abs(valueInPx - 768) <= tolerance) return 'md';
    // sm: 640px
    if (Math.abs(valueInPx - 640) <= tolerance) return 'sm';
  }

  // Match max-width media queries (for reverse breakpoints)
  const maxWidthMatch = mediaQuery.match(/\(max-width:\s*([\d.]+)(px|rem|em)\)/i);
  if (maxWidthMatch) {
    const value = parseFloat(maxWidthMatch[1]);
    const unit = maxWidthMatch[2].toLowerCase();

    // Convert to pixels for comparison if needed
    let valueInPx = value;
    if (unit === 'rem') valueInPx = value * 16;
    if (unit === 'em') valueInPx = value * 16;

    // Map to Tailwind's max-* variants with tolerance
    if (Math.abs(valueInPx - 639) <= tolerance) return 'max-sm';
    if (Math.abs(valueInPx - 767) <= tolerance) return 'max-md';
    if (Math.abs(valueInPx - 1023) <= tolerance) return 'max-lg';
    if (Math.abs(valueInPx - 1279) <= tolerance) return 'max-xl';
    if (Math.abs(valueInPx - 1535) <= tolerance) return 'max-2xl';
  }

  // Handle orientation media queries
  if (mediaQuery.includes('orientation: portrait')) {
    return 'portrait';
  }
  if (mediaQuery.includes('orientation: landscape')) {
    return 'landscape';
  }

  // Handle dark mode media query
  if (mediaQuery.includes('prefers-color-scheme: dark')) {
    return 'dark';
  }

  return undefined;
}

/**
 * Extract pseudo-class variants from a selector
 *
 * @param selector The CSS selector
 * @returns Array of extracted variants
 */
function extractPseudoVariants(selector: string): string[] {
  const variants: string[] = [];
  const matchedPseudoClasses = new Set<string>();

  // Check for group variants (e.g., .group:hover .element or .group:hover .element:first-child)
  const groupMatch = selector.match(/\.group:(\w[\w-]*)\s+/);
  if (groupMatch) {
    const pseudoClass = groupMatch[1];
    const groupVariant = `group-${pseudoClass}`;
    if (GROUP_VARIANTS.includes(groupVariant)) {
      variants.push(groupVariant);
      matchedPseudoClasses.add(pseudoClass); // Mark this pseudo-class as matched
    }
  }

  // Check for peer variants (e.g., .peer:checked ~ .element or .peer:checked ~ .element:first-child)
  const peerMatch = selector.match(/\.peer:(\w[\w-]*)\s*[~+>]\s*/);
  if (peerMatch) {
    const pseudoClass = peerMatch[1];
    const peerVariant = `peer-${pseudoClass}`;
    if (PEER_VARIANTS.includes(peerVariant)) {
      variants.push(peerVariant);
      matchedPseudoClasses.add(pseudoClass); // Mark this pseudo-class as matched
    }
  }

  // Check for direct pseudo-classes on the target element
  // Sort by length descending to match longer variants first (e.g., focus-visible before focus)
  const sortedVariants = [...PSEUDO_VARIANTS].sort((a, b) => b.length - a.length);

  for (const variant of sortedVariants) {
    // Skip if this pseudo-class was already matched as part of a group/peer variant
    if (matchedPseudoClasses.has(variant)) {
      continue;
    }

    // Use word boundary to match exact pseudo-class names
    const regex = new RegExp(`:${variant}(?![\\w-])`, 'g');
    if (regex.test(selector)) {
      variants.push(variant);
    }
  }

  // Handle :first-child, :last-child, :nth-child(odd), :nth-child(even)
  if (selector.includes(':first-child')) {
    variants.push('first');
  }
  if (selector.includes(':last-child')) {
    variants.push('last');
  }
  if (selector.includes(':nth-child(odd)')) {
    variants.push('odd');
  }
  if (selector.includes(':nth-child(even)')) {
    variants.push('even');
  }

  return variants;
}

/**
 * Parse a CSS string into an array of CSS rules
 *
 * @param css The CSS string to parse
 * @param approximate Whether to use approximate matching with 1px tolerance for breakpoints
 * @returns Array of CSS rules
 */
export function parseCssRules(css: string, approximate = false): CssRule[] {
  if (!css) {
    return [];
  }

  try {
    // Parse the CSS using PostCSS
    const root = postcss.parse(css);
    const rules: CssRule[] = [];

    // Process each rule
    root.walkRules((rule) => {
      const declarations: CssDeclaration[] = [];
      const variants: string[] = [];

      // Extract responsive variants from media queries
      if (rule.parent?.type === 'atrule' && rule.parent.name === 'media') {
        const mediaQuery = rule.parent.params;
        const responsiveVariant = extractResponsiveVariant(mediaQuery, approximate);
        if (responsiveVariant) {
          variants.push(responsiveVariant);
        }
      }

      // Extract pseudo-class variants from the selector
      const pseudoVariants = extractPseudoVariants(rule.selector);
      variants.push(...pseudoVariants);

      // Process each declaration in the rule
      rule.walkDecls((decl) => {
        declarations.push({
          prop: decl.prop,
          value: decl.value,
          variants: variants.length > 0 ? [...variants] : undefined,
        });
      });

      // Add the rule to the result
      rules.push({
        selector: rule.selector,
        declarations,
      });
    });

    return rules;
  } catch (error) {
    console.error('Error parsing CSS:', error);
    return [];
  }
}

/**
 * Utility functions for handling Tailwind CSS variants
 *
 * @see SPEC.md → "Variants and Responsive Behavior"
 * @see SPEC.md → "Variants and Responsive Behavior" → "Supported pseudo-classes and state variants"
 * @see SPEC.md → "Variants and Responsive Behavior" → "Variant application"
 */

/**
 * List of supported pseudo-class variants
 *
 * @see SPEC.md → "Variants and Responsive Behavior" → "Supported pseudo-classes and state variants"
 */
export const PSEUDO_VARIANTS = [
  'hover',
  'focus',
  'active',
  'disabled',
  'visited',
  'focus-visible',
  'focus-within',
  'first',
  'last',
  'odd',
  'even',
];

/**
 * List of supported group variants
 */
export const GROUP_VARIANTS = [
  'group-hover',
  'group-focus',
  'group-active',
  'group-focus-visible',
  'group-focus-within',
];

/**
 * List of supported peer variants
 */
export const PEER_VARIANTS = [
  'peer-focus',
  'peer-hover',
  'peer-active',
  'peer-checked',
  'peer-focus-visible',
  'peer-focus-within',
];

/**
 * List of all supported variants
 */
export const ALL_VARIANTS = [...PSEUDO_VARIANTS, ...GROUP_VARIANTS, ...PEER_VARIANTS];

/**
 * Apply a variant prefix to a list of Tailwind classes
 *
 * @param prefix The variant prefix (e.g., 'hover', 'sm', 'md', 'focus')
 * @param classes Array of Tailwind classes to apply the variant to
 * @returns Array of classes with the variant prefix applied
 */
export function withVariant(prefix: string, classes: string[]): string[] {
  if (!prefix || !classes || classes.length === 0) {
    return classes;
  }

  // Apply the variant prefix to each class
  return classes.map((cls) => `${prefix}:${cls}`);
}

/**
 * Deduplicate variants while preserving order
 *
 * @param variants Array of variant prefixes that may contain duplicates
 * @returns Array of unique variants preserving the original order
 */
export function dedupeVariants(variants: string[]): string[] {
  if (!variants || variants.length === 0) {
    return [];
  }

  const seen = new Set<string>();
  const result: string[] = [];

  // Keep only the first occurrence of each variant
  for (const variant of variants) {
    if (!seen.has(variant)) {
      seen.add(variant);
      result.push(variant);
    }
  }

  return result;
}

/**
 * Apply multiple variant prefixes to a list of Tailwind classes
 *
 * @see SPEC.md → "Variants and Responsive Behavior" → "Variant application"
 * Applies variants as prefixes in the given order, preserving hierarchy.
 * Example: ['md', 'dark', 'hover'] → 'md:dark:hover:text-blue-600'
 *
 * @param variants Array of variant prefixes (e.g., ['hover', 'sm', 'md', 'focus'])
 * @param classes Array of Tailwind classes to apply the variants to
 * @returns Array of classes with all variant prefixes applied
 */
export function withVariants(variants: string[], classes: string[]): string[] {
  if (!variants || variants.length === 0 || !classes || classes.length === 0) {
    return classes;
  }

  // Deduplicate variants while preserving order
  // @see SPEC.md → "Variants and Responsive Behavior" → "Variant application" (dedupe repeated variants)
  const uniqueVariants = dedupeVariants(variants);
  let result: string[] = [...classes];

  // Apply each variant in reverse order to get the correct nesting
  // e.g., ['md', 'dark', 'hover'] should result in 'md:dark:hover:class'
  for (let i = uniqueVariants.length - 1; i >= 0; i--) {
    result = withVariant(uniqueVariants[i], result);
  }

  return result;
}

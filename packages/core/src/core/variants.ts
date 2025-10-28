/**
 * Utility functions for handling Tailwind CSS variants
 */

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
  return classes.map(cls => `${prefix}:${cls}`);
}

/**
 * Apply multiple variant prefixes to a list of Tailwind classes
 * 
 * @param variants Array of variant prefixes (e.g., ['hover', 'sm', 'md', 'focus'])
 * @param classes Array of Tailwind classes to apply the variants to
 * @returns Array of classes with all variant prefixes applied
 */
export function withVariants(variants: string[], classes: string[]): string[] {
  if (!variants || variants.length === 0 || !classes || classes.length === 0) {
    return classes;
  }

  let result: string[] = [...classes];

  // Apply each variant in reverse order to get the correct nesting
  // e.g., ['hover', 'focus'] should result in 'hover:focus:class'
  for (let i = variants.length - 1; i >= 0; i--) {
    result = withVariant(variants[i], result);
  }

  return result;
}

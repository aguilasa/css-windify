/**
 * Reporter utilities for calculating coverage and aggregating warnings
 */

/**
 * Calculate coverage statistics
 * @param matched Number of matched declarations
 * @param total Total number of declarations
 * @returns Coverage object with matched and total counts
 */
export function calculateCoverage(matched: number, total: number): { matched: number; total: number } {
  return {
    matched,
    total
  };
}

/**
 * Aggregate warnings to avoid duplicates
 * @param warnings Array of warning messages
 * @returns Deduplicated array of warnings
 */
export function aggregateWarnings(warnings: string[]): string[] {
  // Remove duplicates
  const uniqueWarnings = [...new Set(warnings)];
  
  // Group similar warnings
  const warningCounts = new Map<string, number>();
  
  for (const warning of warnings) {
    const count = warningCounts.get(warning) || 0;
    warningCounts.set(warning, count + 1);
  }
  
  // Format warnings with counts if there are duplicates
  return uniqueWarnings.map(warning => {
    const count = warningCounts.get(warning) || 0;
    if (count > 1) {
      return `${warning} (${count} occurrences)`;
    }
    return warning;
  });
}

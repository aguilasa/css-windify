/**
 * Example demonstrating the enhanced reporter functionality
 */
import { transformDeclarations, summarize } from '../src';
import { CssDeclaration } from '../src/types';

// Sample CSS declarations
const declarations: CssDeclaration[] = [
  { prop: 'margin', value: '1rem' },
  { prop: 'padding', value: '1rem 2rem' },
  { prop: 'width', value: '100%' },
  { prop: 'height', value: '15px' }, // Will use approximation if enabled
  { prop: 'color', value: '#3b82f6' },
  { prop: 'background-color', value: '#ffffff' },
  { prop: 'font-size', value: '1rem' },
  { prop: 'line-height', value: '1.5' },
  { prop: 'display', value: 'flex' },
  { prop: 'justify-content', value: 'space-between' },
  { prop: 'border', value: '1px solid #000' },
  { prop: 'border-radius', value: '0.25rem' },
  { prop: 'opacity', value: '0.8' },
  { prop: 'z-index', value: '10' },
  { prop: 'custom-property', value: 'custom-value' }, // No handler for this
];

// Transform with strict mode (no approximation)
const strictResult = transformDeclarations(declarations, {
  theme: {}, // Using default theme
  tokens: undefined,
  version: 'v3',
  opts: {
    strict: true,
    approximate: false,
    thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
    screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
  },
});

// Transform with approximation enabled
const approximateResult = transformDeclarations(declarations, {
  theme: {}, // Using default theme
  tokens: undefined,
  version: 'v3',
  opts: {
    strict: false,
    approximate: true,
    thresholds: { spacingPx: 2, fontPx: 1, radiiPx: 2 },
    screens: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
  },
});

// Generate summaries
console.log('=== STRICT MODE SUMMARY ===');
const strictSummary = summarize(strictResult);
console.log(strictSummary.text);
console.log('\nStats:', JSON.stringify(strictSummary.stats, null, 2));

console.log('\n\n=== APPROXIMATE MODE SUMMARY ===');
const approximateSummary = summarize(approximateResult);
console.log(approximateSummary.text);
console.log('\nStats:', JSON.stringify(approximateSummary.stats, null, 2));

// Compare both results
console.log('\n\n=== COMPARISON SUMMARY ===');
const comparisonSummary = summarize([strictResult, approximateResult]);
console.log(comparisonSummary.text);
console.log('\nCombined Stats:');
console.log('  Totals:', comparisonSummary.stats.totals);
console.log('  Sample Classes:', comparisonSummary.stats.samples.classes.slice(0, 5));
console.log('  Warning Counts:', comparisonSummary.stats.warningsByCategory);

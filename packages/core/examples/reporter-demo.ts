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
  { prop: 'custom-property', value: 'custom-value' } // No handler for this
];

// Transform with strict mode (no approximation)
const strictResult = transformDeclarations(declarations, {
  theme: {}, // Using default theme
  opts: {
    strict: true,
    approximate: false
  }
});

// Transform with approximation enabled
const approximateResult = transformDeclarations(declarations, {
  theme: {}, // Using default theme
  opts: {
    strict: false,
    approximate: true
  }
});

// Generate summaries
console.log('=== STRICT MODE SUMMARY ===');
console.log(summarize(strictResult));

console.log('\n\n=== APPROXIMATE MODE SUMMARY ===');
console.log(summarize(approximateResult));

// Compare both results
console.log('\n\n=== COMPARISON SUMMARY ===');
console.log(summarize([strictResult, approximateResult]));

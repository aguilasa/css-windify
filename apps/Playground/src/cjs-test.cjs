// CommonJS test
const { transformDeclarations } = require('tailwindify-core');

// Test data
const declarations = [
  { prop: 'margin', value: '1rem' },
  { prop: 'padding', value: '2rem' }
];

const ctx = {
  theme: {},
  opts: {
    strict: false,
    approximate: true
  }
};

// Run the transformation
const result = transformDeclarations(declarations, ctx);

// Output results
console.log(`CJS Test - Classes: ${result.classes.join(', ')}`);
console.log(`CJS Test - Warnings: ${result.warnings.join(', ')}`);
console.log(`CJS Test - Coverage: ${result.coverage.matched}/${result.coverage.total}`);

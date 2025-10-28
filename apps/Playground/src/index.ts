import { loadTheme, transformRule, transformDeclarations, parseInlineCss, parseCssRules } from 'tailwindify-core';
import { createInterface } from 'readline';

// Initialize the readline interface for stdin/stdout
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Process CSS input
async function processCssInput(input: string) {
  console.log('\n🔍 Processing CSS input...');
  
  // Load default theme
  const theme = await loadTheme(process.cwd());
  const ctx = { theme, opts: { strict: false, approximate: false } };
  
  // Determine if input is a CSS rule block or inline CSS
  const isRuleBlock = input.includes('{');
  
  let result;
  if (isRuleBlock) {
    // Parse CSS rules
    console.log('📋 Detected CSS rule block');
    const rules = parseCssRules(input);
    
    if (rules.length === 0) {
      console.log('❌ No valid CSS rules found');
      return;
    }
    
    // Process each rule
    for (const rule of rules) {
      console.log(`\n🔸 Rule: ${rule.selector}`);
      result = transformRule(rule, ctx);
      
      // Output results
      outputResults(result);
    }
  } else {
    // Parse inline CSS
    console.log('📋 Detected inline CSS');
    const declarations = parseInlineCss(input);
    
    if (declarations.length === 0) {
      console.log('❌ No valid CSS declarations found');
      return;
    }
    
    // Transform declarations
    result = transformDeclarations(declarations, ctx);
    
    // Output results
    outputResults(result);
  }
}

// Output transformation results
function outputResults(result: { classes: string[], warnings: string[], coverage: { matched: number, total: number } }) {
  // Output classes
  console.log('\n✅ Tailwind Classes:');
  if (result.classes.length > 0) {
    console.log(`  ${result.classes.join(' ')}`);
  } else {
    console.log('  No classes generated');
  }
  
  // Output warnings
  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.warnings.forEach(warning => {
      console.log(`  - ${warning}`);
    });
  }
  
  // Output coverage
  const coveragePercent = result.coverage.total > 0 
    ? Math.round((result.coverage.matched / result.coverage.total) * 100) 
    : 0;
  
  console.log(`\n📊 Coverage: ${result.coverage.matched}/${result.coverage.total} (${coveragePercent}%)`);
}

// Main function
async function main() {
  console.log('🚀 Tailwindify Playground');
  console.log('Enter CSS (inline style or rule block) and press Enter:');
  
  let input = '';
  
  // Read from stdin
  for await (const line of rl) {
    // Empty line signals end of input
    if (line.trim() === '') {
      if (input.trim() !== '') {
        await processCssInput(input.trim());
        input = '';
        console.log('\n🔄 Enter more CSS or press Ctrl+C to exit:');
      }
    } else {
      input += line + '\n';
    }
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

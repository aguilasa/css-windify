import { loadTheme, transformRule, transformDeclarations } from 'tailwindify-core';
import postcss from 'postcss';
import { createInterface } from 'readline';

// Define types locally to avoid dependency issues
interface CssDeclaration {
  prop: string;
  value: string;
  variants?: string[];
}

interface CssRule {
  selector: string;
  declarations: CssDeclaration[];
}

/**
 * Parse an inline CSS style string into an array of CSS declarations
 */
function parseInlineCss(style: string): CssDeclaration[] {
  if (!style) {
    return [];
  }

  // Split the style string by semicolons
  const declarations: CssDeclaration[] = [];
  const parts = style.split(';');

  for (const part of parts) {
    // Skip empty parts
    const trimmedPart = part.trim();
    if (!trimmedPart) {
      continue;
    }

    // Split each part by the first colon
    const colonIndex = trimmedPart.indexOf(':');
    if (colonIndex === -1) {
      continue; // Skip invalid parts without a colon
    }

    const prop = trimmedPart.substring(0, colonIndex).trim();
    const value = trimmedPart.substring(colonIndex + 1).trim();

    // Skip if property or value is empty
    if (!prop || !value) {
      continue;
    }

    declarations.push({ prop, value });
  }

  return declarations;
}

/**
 * Parse a CSS string into an array of CSS rules
 */
function parseCssRules(css: string): CssRule[] {
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
          value: decl.value,
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

// Initialize the readline interface for stdin/stdout
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
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
function outputResults(result: {
  classes: string[];
  warnings: string[];
  coverage: { matched: number; total: number };
}) {
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
    result.warnings.forEach((warning) => {
      console.log(`  - ${warning}`);
    });
  }

  // Output coverage
  const coveragePercent =
    result.coverage.total > 0
      ? Math.round((result.coverage.matched / result.coverage.total) * 100)
      : 0;

  console.log(
    `\n📊 Coverage: ${result.coverage.matched}/${result.coverage.total} (${coveragePercent}%)`
  );
}

// Main function
async function main() {
  console.log('🚀 Tailwindify Playground');

  // Check for command line arguments
  const args = process.argv.slice(2);
  if (args.length > 0) {
    // Join all arguments in case they were split by spaces
    const fullArg = args.join(' ');

    // Handle inline CSS format: inline:property: value; property: value;
    if (fullArg.startsWith('inline:')) {
      const inlineCSS = fullArg.substring('inline:'.length);
      console.log('📋 Processing inline CSS from command line');
      console.log(`Input: ${inlineCSS}`);
      await processCssInput(inlineCSS);
      process.exit(0);
    }

    // Handle rule format: rule:.selector { property: value; }
    if (fullArg.startsWith('rule:')) {
      const ruleCSS = fullArg.substring('rule:'.length);
      console.log('📋 Processing CSS rule from command line');
      console.log(`Input: ${ruleCSS}`);
      await processCssInput(ruleCSS);
      process.exit(0);
    }

    // If no specific format is provided but arguments exist, try to process as is
    if (!fullArg.startsWith('inline:') && !fullArg.startsWith('rule:')) {
      console.log('📋 Processing CSS from command line');
      console.log(`Input: ${fullArg}`);
      await processCssInput(fullArg);
      process.exit(0);
    }
  }

  // Interactive mode
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
main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});

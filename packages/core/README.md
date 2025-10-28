# CSSWindify Core

The core engine for converting CSS to Tailwind CSS classes. This package provides the fundamental functionality for analyzing CSS properties and generating equivalent Tailwind classes.

## Features

- Convert inline CSS styles to Tailwind classes
- Transform CSS rule blocks to Tailwind classes
- Support for various CSS property categories:
  - Spacing (margin, padding, width, height)
  - Typography (font-size, line-height, etc.)
  - Colors (text, background, border)
  - Layout (display, position, etc.)
  - Borders (width, radius, etc.)
  - Backgrounds
  - Effects (opacity, z-index, etc.)
- Approximate matching for non-exact values
- Detailed reporting and metrics

## Installation

```bash
npm install css-windify-core
# or
yarn add css-windify-core
# or
pnpm add css-windify-core
```

## Public API

### Core Functions

```typescript
// Convert a CSS rule to Tailwind classes
function transformRule(rule: CssRule, ctx: MatchCtx): TransformResult;

// Convert CSS declarations to Tailwind classes
function transformDeclarations(decls: CssDeclaration[], ctx: MatchCtx): TransformResult;

// Convert a single CSS property to Tailwind classes
function toTailwind(
  prop: string,
  value: string,
  ctx: MatchCtx
): { classes: string[]; warning: string | null };

// Generate a human-readable summary of transformation results
function summarize(results: TransformResult | TransformResult[]): string;
```

### Theme Handling

```typescript
// Load Tailwind theme from configuration
function loadTheme(configPath?: string): Promise<any>;

// Resolve tokens from theme
function resolveSpacingToken(
  value: string,
  theme: any,
  options?: { approximate: boolean; maxDiffPx: number }
): TokenResult;
function resolveColorToken(value: string, theme: any): ColorResult;
function resolveFontSizeToken(
  value: string,
  theme: any,
  options?: { approximate: boolean; maxDiffPx: number }
): TokenResult;
function resolveLineHeightToken(
  value: string,
  theme: any,
  options?: { approximate: boolean; maxDiffPx: number }
): TokenResult;
```

### Types

```typescript
interface CssDeclaration {
  prop: string;
  value: string;
  variants?: string[];
}

interface CssRule {
  selector: string;
  declarations: CssDeclaration[];
}

interface TransformResult {
  classes: string[];
  warnings: string[];
  coverage: {
    matched: number;
    total: number;
    percentage: number;
    nonArbitrary: number;
    categories?: Record<PropertyCategory, CategoryStats>;
    warningsByCategory?: Record<WarningCategory, number>;
  };
}

interface MatchCtx {
  theme: any;
  opts: {
    strict: boolean;
    approximate: boolean;
  };
}
```

## Usage Examples

### Basic Usage

```typescript
import { transformDeclarations } from 'css-windify-core';

// CSS declarations to transform
const declarations = [
  { prop: 'margin', value: '1rem' },
  { prop: 'padding', value: '1rem 2rem' },
  { prop: 'color', value: '#3b82f6' },
];

// Transform with default options
const result = transformDeclarations(declarations, {
  theme: {}, // Using default theme
  opts: {
    strict: false,
    approximate: true,
  },
});

console.log(result.classes); // ['m-4', 'py-4', 'px-8', 'text-blue-500']
```

### With Reporting

```typescript
import { transformDeclarations, summarize } from 'css-windify-core';

// Transform CSS declarations
const result = transformDeclarations(declarations, ctx);

// Generate a summary report
const report = summarize(result);
console.log(report);
```

## Extending with Custom Handlers

You can extend CSSWindify with custom property handlers to support additional CSS properties or custom transformations.

### Example: Adding a Custom Handler

```typescript
import { propertyHandlers } from 'css-windify-core';

// Add a custom handler for a new CSS property
propertyHandlers['aspect-ratio'] = (value, ctx) => {
  if (value === '1/1') {
    return ['aspect-square'];
  } else if (value === '16/9') {
    return ['aspect-video'];
  } else {
    // Use arbitrary value for other ratios
    return [`aspect-[${value}]`];
  }
};
```

### Example: Overriding an Existing Handler

```typescript
import { propertyHandlers } from 'css-windify-core';

// Override the existing handler for 'display' property
const originalHandler = propertyHandlers['display'];
propertyHandlers['display'] = (value, ctx) => {
  // Custom logic for specific values
  if (value === 'grid-inline') {
    return ['inline-grid'];
  }

  // Fall back to the original handler for other values
  return originalHandler(value, ctx);
};
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch
```

## Building

```bash
# Build the package
pnpm build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

# CSSWindify

[![Build Status](https://github.com/yourusername/css-windify/workflows/CI/badge.svg)](https://github.com/yourusername/css-windify/actions)
[![Coverage](https://codecov.io/gh/yourusername/css-windify/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/css-windify)
[![NPM Version](https://img.shields.io/npm/v/@css-windify/core.svg)](https://www.npmjs.com/package/@css-windify/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

> **Convert CSS to Tailwind CSS classes automatically with high fidelity and performance.**

CSSWindify is a powerful tool that transforms traditional CSS into Tailwind CSS utility classes. It supports both Tailwind v3 and v4, features 100+ property matchers, and offers strict and approximate conversion modes.

## ✨ Features

- 🎯 **100+ CSS Property Matchers** - Comprehensive coverage of layout, typography, colors, effects, and transforms
- 🔄 **Tailwind v3 & v4 Support** - Automatic version detection with CSS custom properties (v4) and config-based (v3) workflows
- ⚡ **High Performance** - Built-in caching and memoization for 10-20x faster repeated conversions
- 🎨 **Dual Conversion Modes** - Strict mode for exact matches, approximate mode for close matches within thresholds
- 🔌 **Plugin System** - Extensible architecture with custom handlers and lifecycle hooks
- 📊 **Advanced Reporting** - Coverage metrics, warnings, and export to JSON/Markdown
- 🧪 **661+ Tests** - Thoroughly tested with unit tests, fixtures, and benchmarks
- 🚀 **CLI & Programmatic API** - Use via command line or integrate into your build process

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install @css-windify/core

# Using pnpm
pnpm add @css-windify/core

# Using yarn
yarn add @css-windify/core
```

### Programmatic Usage

```typescript
import { transformCssText } from '@css-windify/core';

const css = `
  .button {
    display: flex;
    padding: 1rem 2rem;
    background-color: #3b82f6;
    color: white;
    border-radius: 0.5rem;
    font-weight: 600;
  }
`;

const result = transformCssText(css, {
  theme: {},
  version: 'auto', // Auto-detect v3 or v4
  opts: {
    strict: false,
    approximate: true,
    thresholds: {
      spacingPx: 2,
      fontPx: 1,
      radiiPx: 2,
    },
  },
});

console.log(result['.button'].classes);
// Output: ['flex', 'px-8', 'py-4', 'bg-blue-500', 'text-white', 'rounded-lg', 'font-semibold']
```

### CLI Usage

```bash
# Install CLI globally
npm install -g @css-windify/cli

# Convert a CSS file
css-windify input.css --output output.json

# With coverage threshold
css-windify input.css --min-coverage 80

# Strict mode
css-windify input.css --strict

# From stdin
echo ".btn { padding: 1rem; }" | css-windify
```

## 📚 Documentation

- **[API Documentation](https://yourusername.github.io/css-windify/)** - Complete TypeDoc API reference (auto-generated)
- **[Migration Guide](./MIGRATION.md)** - Migrating from Tailwind v3 to v4
- **[Plugin Development](./packages/core/src/plugins/README.md)** - Creating custom plugins
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute

### Generate Documentation Locally

```bash
# Generate API docs
pnpm docs:generate

# Serve docs locally
pnpm docs:serve
# Open http://localhost:8080
```

## 🎯 Conversion Modes

### Strict Mode

Only exact matches from Tailwind theme/tokens are used. Non-matches fall back to arbitrary values.

```typescript
const result = transformCssText(css, {
  opts: { strict: true, approximate: false },
});
// padding: 17px → px-[17px] (no approximate match)
```

### Approximate Mode

Allows close matches within configurable thresholds. Emits warnings for approximations.

```typescript
const result = transformCssText(css, {
  opts: {
    strict: false,
    approximate: true,
    thresholds: { spacingPx: 2 },
  },
});
// padding: 17px → px-4 (16px, within 2px threshold)
// Warning: "approximate: padding 17px → 4 (1px difference)"
```

## 🔌 Plugin System

Extend CSSWindify with custom property handlers:

```typescript
import { createPlugin, registerPlugin } from '@css-windify/core';

const myPlugin = createPlugin(
  'my-plugin',
  '1.0.0',
  {
    'custom-property': (value, ctx) => {
      return `custom-${value}`;
    },
  },
  'My custom plugin'
);

await registerPlugin(myPlugin);
```

## 📊 Advanced Reporting

```typescript
import { exportReport, compareResults } from '@css-windify/core';

// Export results
await exportReport(result, 'json', './output.json');
await exportReport(result, 'markdown', './report.md');

// Compare strict vs approximate
const strictResult = transformCssText(css, { opts: { strict: true } });
const approxResult = transformCssText(css, { opts: { approximate: true } });
const comparison = compareResults(strictResult, approxResult);

console.log(`Coverage improvement: ${comparison.coverageDiff}%`);
```

## 🏗️ Architecture

Monorepo structure:

```
css-windify/
├── packages/
│   ├── core/          # Core conversion engine (661+ tests)
│   └── cli/           # Command-line interface
├── apps/
│   ├── web/           # Web interface (Vite + React)
│   └── Playground/    # Development playground
```

## 🧪 Development

```bash
# Clone repository
git clone https://github.com/yourusername/css-windify.git
cd css-windify

# Install dependencies
pnpm install

# Run tests
pnpm test

# Run benchmarks
pnpm bench

# Build all packages
pnpm build
```

## 📈 Performance

- **Token Loading:** 10-20x faster with cache (mtime-based invalidation)
- **Resolver Calls:** 10x faster with memoization
- **Overall:** 50% faster on repeated operations

```bash
# Run performance benchmarks
pnpm bench
```

## 🗺️ Roadmap

### v1.1 (Next)

- Web UI with Monaco editor
- TypeDoc API documentation
- CI/CD with GitHub Actions

### v1.2 (Future)

- VS Code extension
- Plugin marketplace
- Container queries support

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Setting up the development environment
- Running tests and benchmarks
- Code style and conventions
- Submitting pull requests

## 📄 License

MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [PostCSS](https://postcss.org/) for CSS parsing
- Inspired by [Tailwind CSS](https://tailwindcss.com/)
- Tested with [Vitest](https://vitest.dev/)

---

**Made with ❤️ by the CSSWindify team**

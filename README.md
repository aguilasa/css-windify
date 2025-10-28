# CSSWindify

CSSWindify is a tool that automatically converts traditional CSS to Tailwind CSS v4 classes. It analyzes your CSS code and generates equivalent Tailwind classes, making migration to Tailwind CSS faster and more efficient.

## Project Overview

CSSWindify helps developers:

- Convert legacy CSS to Tailwind CSS
- Understand how CSS properties map to Tailwind classes
- Accelerate adoption of Tailwind CSS in existing projects
- Maintain consistent styling during incremental migrations

## Architecture

The project is structured as a monorepo with the following components:

```
css-windify/
├── packages/
│   └── core/         # Core conversion engine
├── apps/
│   └── Playground/   # Interactive testing environment
```

### Core Package

The core package (`css-windify-core`) contains the main conversion logic:

- CSS parsers for both inline styles and rule blocks
- Matchers for different CSS properties
- Theme handling for Tailwind configuration
- Reporting utilities for conversion metrics

### Playground App

The Playground app provides an interactive environment to test the conversion engine with real CSS input and see the resulting Tailwind classes.

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/css-windify.git
cd css-windify

# Install dependencies
pnpm install

# Build the core package
pnpm build
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run core package tests only
pnpm --filter css-windify-core test
```

### Using the Playground

```bash
# Start the playground
cd apps/Playground
pnpm dev
```

Then enter CSS code (either inline styles or rule blocks) and press Enter to see the conversion results.

## Roadmap

### Short-term

- Improve coverage of CSS properties
- Enhance approximation logic for non-exact value matches
- Add support for more complex selectors and media queries

### Medium-term

- CLI tool for batch processing files
- VS Code extension for in-editor conversion
- Integration with popular build tools

### Long-term

- Web UI for interactive conversion
- Tailwind configuration generator based on existing CSS
- Two-way conversion (Tailwind to CSS and back)

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

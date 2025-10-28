# CSSWindify CLI

A command-line tool for converting CSS to Tailwind CSS classes.

## Overview

CSSWindify CLI is a command-line interface that leverages the `css-windify-core` package to convert traditional CSS files to Tailwind CSS classes. This tool is designed to help developers migrate existing projects to Tailwind CSS or learn how their CSS translates to Tailwind utility classes.

## Planned Features

- Convert CSS files to Tailwind classes
- Process entire directories of CSS files
- Output results to console or files
- Generate HTML preview with applied Tailwind classes
- Support for configuration options (strict mode, approximation, etc.)
- Integration with Tailwind config files

## Implementation Plan

1. **Command Structure**
   - `css-windify convert <file|directory>` - Convert CSS files to Tailwind
   - `css-windify preview <file>` - Generate HTML preview of conversion
   - `css-windify watch <directory>` - Watch for changes and convert in real-time

2. **Options**
   - `--output` - Specify output directory
   - `--config` - Path to Tailwind config
   - `--strict` - Enable strict mode (no approximation)
   - `--format` - Output format (json, css, html)

3. **Core Integration**
   - Use `transformCssText` from `css-windify-core` for CSS processing
   - Use `summarize` for generating readable reports

## Development

```bash
# Install dependencies
pnpm install

# Build the CLI
pnpm build

# Link for local development
pnpm link --global

# Run the CLI
css-windify --help
```

## Next Steps

- Implement command structure using Commander.js
- Add file reading/writing utilities
- Integrate with css-windify-core for CSS transformation
- Add reporting and output formatting
- Create tests for CLI functionality

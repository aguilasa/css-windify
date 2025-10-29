# CSSWindify CLI

A command-line tool for converting CSS to Tailwind CSS classes.

## Overview

CSSWindify CLI is a command-line interface that leverages the `css-windify-core` package to convert traditional CSS files to Tailwind CSS classes. This tool is designed to help developers migrate existing projects to Tailwind CSS or learn how their CSS translates to Tailwind utility classes.

## Installation

```bash
# Install dependencies
pnpm install

# Build the CLI
pnpm build

# Link for local development (optional)
pnpm link --global
```

## Usage

### Basic Usage

Convert a CSS file to Tailwind classes:

```bash
css-windify styles.css
```

### Input from stdin

```bash
cat styles.css | css-windify
echo ".btn { display: flex; padding: 1rem; }" | css-windify
```

### Multiple Files

Process multiple CSS files:

```bash
css-windify file1.css file2.css file3.css
```

Use glob patterns:

```bash
css-windify src/**/*.css
```

## Options

### `--report <format>`

Output format: `json` or `markdown` (default: `markdown`)

```bash
# JSON output
css-windify styles.css --report json

# Markdown output (default)
css-windify styles.css --report markdown
```

### `--strict`

Enable strict mode (no approximation):

```bash
css-windify styles.css --strict
```

### `--approximate`

Enable approximation mode (allows near-matches within thresholds):

```bash
css-windify styles.css --approximate
```

### `--thresholds.spacing <px>`

Set spacing approximation threshold in pixels (default: 2):

```bash
css-windify styles.css --thresholds.spacing 4
```

### `--thresholds.font <px>`

Set font size approximation threshold in pixels (default: 1):

```bash
css-windify styles.css --thresholds.font 2
```

### `--thresholds.radii <px>`

Set border radius approximation threshold in pixels (default: 2):

```bash
css-windify styles.css --thresholds.radii 3
```

### `--version <version>`

Specify Tailwind version: `auto`, `v3`, or `v4` (default: `auto`):

```bash
css-windify styles.css --version v3
```

### `--screens <screens>`

Custom breakpoints (comma-separated name:value pairs):

```bash
css-windify styles.css --screens "sm:480,md:768,lg:1024,xl:1280"
```

## Examples

### Example 1: Convert with strict mode and JSON output

```bash
css-windify button.css --strict --report json
```

Output:

```json
{
  "meta": {
    "files": ["button.css"],
    "timestamp": "2025-10-29T22:46:15.368Z"
  },
  "results": [
    {
      "selector": ".btn",
      "classes": "inline-block px-4 py-2 font-semibold text-center bg-blue-500 text-white border rounded",
      "warnings": [],
      "coverage": {
        "matched": 10,
        "total": 10,
        "percentage": 100
      }
    }
  ],
  "summary": {
    "text": "...",
    "stats": { ... }
  }
}
```

### Example 2: Convert with approximation and custom thresholds

```bash
css-windify styles.css --approximate --thresholds.spacing 4 --thresholds.font 2
```

### Example 3: Pipe CSS from stdin

```bash
echo ".card { display: flex; padding: 1rem; gap: 0.5rem; }" | css-windify --report json
```

## Output Format

### JSON Output

The JSON output includes:

- **meta**: Metadata about the conversion (files, timestamp)
- **results**: Array of conversion results per selector
  - `selector`: CSS selector
  - `classes`: Ordered Tailwind classes (space-separated)
  - `warnings`: Array of warning messages
  - `coverage`: Coverage statistics
- **summary**: Overall summary with text and structured stats
  - `text`: Human-readable summary
  - `stats`: Structured statistics (totals, byCategory, warningsByCategory, samples)

### Markdown Output

The Markdown output includes:

- Input information (files, mode, thresholds)
- Results by selector (classes, warnings, coverage)
- Overall summary with statistics

## Testing

Run the integration tests:

```bash
pnpm test
```

Or manually:

```bash
cd test
./cli.test.sh
```

The test suite validates:

- File input with JSON and Markdown output
- Stdin input
- Strict and approximate modes
- Custom thresholds and screens
- JSON structure and ordered classes
- Summary inclusion

## Features

✅ **Input Options**

- Read from file(s) or stdin
- Support for glob patterns
- Multiple file processing

✅ **Conversion Modes**

- Strict mode (exact matches only)
- Approximate mode (near-matches within thresholds)
- Configurable thresholds per category

✅ **Output Formats**

- JSON (structured data)
- Markdown (human-readable)

✅ **Class Ordering**

- Deterministic class ordering by category
- Follows SPEC.md ordering algorithm

✅ **Summary Reports**

- Coverage statistics (matched, total, percentage)
- Per-category breakdown
- Warning categorization
- Sample classes and warnings

✅ **Customization**

- Custom breakpoints
- Adjustable approximation thresholds
- Version selection (v3/v4/auto)

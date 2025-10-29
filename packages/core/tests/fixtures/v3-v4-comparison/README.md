# v3/v4 Comparison Fixtures

This directory contains fixtures for testing parity between Tailwind v3 (config-based) and v4 (CSS tokens-based) implementations.

## Files

### `sample.css`

Sample CSS file with various properties to test:

- Spacing (padding, margin, gap)
- Colors (text, background)
- Typography (font-size, line-height, font-weight)
- Layout (display, flex-direction)
- Borders (border, border-radius)
- Effects (box-shadow)

### `tailwind.config.js`

Tailwind v3 configuration file with:

- Custom colors
- Extended spacing scale
- Font sizes with line heights
- Border radius values
- Box shadow definitions

### `tokens.css`

Simulated Tailwind v4 CSS tokens in `:root`:

- Spacing tokens (`--spacing-*`)
- Color tokens (`--color-*`)
- Font size tokens (`--font-size-*`)
- Line height tokens (`--leading-*`)
- Border radius tokens (`--radius-*`)
- Screen breakpoint tokens (`--screen-*`)

## Purpose

These fixtures are used by `tests/v3-v4-parity.test.ts` to validate:

1. **Version Detection**: Correctly identifies v3 vs v4 based on available tokens
2. **Coverage Parity**: Similar coverage percentages between v3 and v4
3. **Class Generation**: Equivalent or compatible classes produced
4. **Warning Categories**: Appropriate warnings for each version
5. **Approximation Behavior**: Consistent approximation within thresholds
6. **Category Coverage**: Per-category statistics tracking

## Test Scenarios

### Strict Mode

- Only exact matches allowed
- No approximation
- Arbitrary values for non-matching values

### Approximate Mode

- Near-matches within thresholds allowed
- Configurable thresholds per category
- Warnings for approximations

### Standard Values

- Values that match theme/tokens exactly
- Should produce identical or very similar classes

### Non-Standard Values

- Values not in theme/tokens
- Should use arbitrary values consistently
- May approximate if within thresholds

## Expected Behavior

### v3 (Config-based)

- Uses `tailwind.config.js` for theme
- Resolves values against config theme
- Warnings: `arbitrary-value`, `no-handler`, `approximate`

### v4 (CSS Tokens-based)

- Uses CSS custom properties from `tokens.css`
- Resolves values against CSS tokens
- Additional warnings: `token-miss`, `v3-fallback`

### Parity Goals

- Coverage percentages within 10% of each other
- Same number of declarations processed
- Similar class counts (within 2 classes)
- Consistent arbitrary value usage
- Threshold-based approximation works in both versions

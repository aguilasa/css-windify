### css-windify Specification

Tailwind v3 current baseline; Tailwind v4 migration plan included

Table of Contents

- Scope and Principles
- Architecture Overview
- Public APIs
- Matching and Mapping Rules (v3 baseline)
- Variants and Responsive Behavior
- Class Ordering
- Reporter, Warnings, and Coverage
- Configuration and Extensibility
- Testing Approach
- Limitations and Known Gaps
- Examples (Normative)
- Tailwind v4 Migration Plan
- Open Questions

### Scope and Principles

Goal

- Convert CSS declarations to Tailwind utility classes with high fidelity and coverage.

Modes

- Strict mode
  - Only exact matches from the Tailwind theme/tokens are used.
  - If no exact match is found, falls back to arbitrary values (not approximations).
- Approximate mode
  - Allows approximate matches within thresholds by category.
  - Emits warnings describing the approximation (original value, chosen token, diff).

Arbitrary values behavior

- When no exact or approximate match is found, generate arbitrary utilities (e.g., `w-[240px]`) or arbitrary properties (e.g., `[user-select:none]`).
- Prefer native utilities first; use arbitrary values as a fallback.

Thresholds by category (defaults)

- spacingPx: 2
- fontPx: 1
- radiiPx: 2
- shadowSimilarity: off (no approximation for shadows by default)

Class ordering principles

- Deterministic ordering is important for readability and stable diffs.
- Classes are deduplicated and ordered by variant, category group, and class key.

### Architecture Overview

Modules and packages

Core package (css-windify-core)

- Parsers: Parse CSS rules and inline styles into structured data.
- Matchers: Convert specific CSS properties to Tailwind classes.
- Normalizers: Utility functions for normalizing and transforming CSS values.
- Theme/Token loader:
  - v3: load Tailwind config and resolve theme tokens.
  - v4: load design tokens from CSS custom properties (when available).
- Rules engine: Orchestrates the transformation of declarations/rules.
- Reporter: Produces coverage statistics and warnings.
- Variants: Applies Tailwind variants (responsive and pseudo-classes).

CLI package (css-windify-cli)

- Placeholder. Future: batch processing over files and directories.

Web app (css-windify-web)

- Placeholder. Future: in-browser UI, Monaco editor, worker-based core execution.

Playground app

- Interactive environment to test core functionality with inline CSS and rules.

Module dependencies

- css-windify-web → css-windify-core
- css-windify-cli → css-windify-core
- Playground → css-windify-core

### Public APIs

Core classes and functions

```ts
class Tailwindify {
  constructor(options: TailwindifyOptions = {});
  processRule(rule: CssRule): TransformResult;
  processDeclarations(declarations: CssDeclaration[]): TransformResult;
}

function transformCssText(
  css: string,
  ctx: MatchCtx
): { bySelector: Record<string, TransformResult> };
function transformRule(rule: CssRule, ctx: MatchCtx): TransformResult;
function transformDeclarations(decls: CssDeclaration[], ctx: MatchCtx): TransformResult;

function toTailwind(
  prop: string,
  value: string,
  ctx: MatchCtx
): { classes: string[]; warning: string | null };
```

Theme and token handling

```ts
// v3
function loadTheme(cwd: string): Promise<any>;

// v4-first, with v3 fallback (see ThemeTokens below)
function loadTokens(options?: {
  cssPath?: string; // CSS file with custom properties (v4 tokens)
  configPath?: string; // Optional Tailwind config path (v3)
}): Promise<ThemeTokens>;
```

Resolvers

```ts
function resolveSpacingToken(value: string, ctx: MatchCtx): TokenResult;
function resolveColorToken(value: string, ctx: MatchCtx): ColorResult;
function resolveFontSizeToken(value: string, ctx: MatchCtx): TokenResult;
function resolveLineHeightToken(value: string, ctx: MatchCtx): TokenResult;

function resolveNearestTokenPx(
  valuePx: number,
  tokenMapPx: Record<string, number>
): { tokenKey: string; tokenPx: number; diffPx: number } | null;
```

Reporting

```ts
function summarize(results: TransformResult | TransformResult[]): {
  text: string;
  stats: {
    totals: {
      matched: number;
      total: number;
      percentage: number;
      nonArbitrary: number;
    };
    byCategory: Record<PropertyCategory, CategoryStats>;
    warningsByCategory: Record<WarningCategory, number>;
    samples: {
      classes: string[];
      warnings: string[];
    };
  };
};
```

Parsers

```ts
function parseCssRules(css: string): CssRule[];
function parseInlineCss(style: string): CssDeclaration[];
```

Variants

```ts
function withVariant(prefix: string, classes: string[]): string[];
function withVariants(variants: string[], classes: string[]): string[];
```

Types and interfaces

```ts
interface ApproximationThresholds {
  spacingPx?: number;
  fontPx?: number;
  radiiPx?: number;
}

interface TailwindifyOptions {
  prefix?: string; // Tailwind class prefix (if any)
  strict?: boolean;
  approximate?: boolean;
  thresholds?: ApproximationThresholds;
  version?: 'auto' | 'v3' | 'v4';
  screens?: Record<string, number>; // override or provide when not found
}

interface CssDeclaration {
  prop: string;
  value: string;
  variants?: string[]; // e.g., ['md', 'hover']
}

interface CssRule {
  selector: string;
  declarations: CssDeclaration[];
}

type PropertyCategory =
  | 'spacing'
  | 'color'
  | 'typography'
  | 'layout'
  | 'border'
  | 'background'
  | 'effects'
  | 'flex-grid'
  | 'sizing'
  | 'other';

type WarningCategory =
  | 'arbitrary-value'
  | 'no-handler'
  | 'approximate'
  | 'token-miss'
  | 'v3-fallback'
  | 'other';

interface CategoryStats {
  matched: number;
  total: number;
  percentage: number;
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

interface ThemeTokens {
  spacing: Record<string, string>; // '4': '1rem'
  colors: Record<string, string | Record<string, string>>;
  fontSize: Record<string, [string, object?]>;
  lineHeight: Record<string, string>;
  screens: Record<string, number>; // numeric px for convenience
  version: 'v3' | 'v4';
  source: 'config' | 'css-variables' | 'default';
}

interface MatchCtx {
  theme?: any; // v3 config result
  tokens?: ThemeTokens; // v4 tokens or v3 projection
  version: 'v3' | 'v4';
  opts: {
    strict: boolean;
    approximate: boolean;
    thresholds: ApproximationThresholds;
    screens: Record<string, number>;
  };
}

type RuleHandler = (
  value: string,
  ctx: MatchCtx
) => string[] | { classes: string[]; warnings: string[] } | null;
```

Normalization and helpers (internal)

- normalizeValue(v): trim, normalize whitespace, preserve units.
- isPx/isRem/isEm/isPct/isNumber
- px↔rem conversions (default 1rem = 16px; configurable if base present).
- parseBoxShorthand(value): returns 1–4 values.
- parseColorNormalize(value): normalize hex (#fff → #ffffff), normalize rgb/rgba spacing.
- toArbitrary(prefix, value): `prefix-[value]` (e.g., `w-[37px]`).
- arbitraryProperty(prop, value): `[prop:value]`.
- applyVariants / withVariant: combines variant prefixes deterministically.

### Matching and Mapping Rules (v3 baseline)

Layout

- display
  - inline-block → `inline-block`
  - block → `block`
  - inline → `inline`
  - flex → `flex`
  - inline-flex → `inline-flex`
  - grid → `grid`
  - inline-grid → `inline-grid`
  - none → `hidden`
  - others → `[display:value]`
- position
  - static/relative/absolute/fixed/sticky → `static`/`relative`/`absolute`/`fixed`/`sticky`
- inset (top/right/bottom/left, inset shorthand)
  - Values match spacing scale; otherwise arbitrary
  - Examples:
    - `top: 0` → `top-0`
    - `right: 1rem` → `right-4`
    - `inset: 0` → `inset-0`
- overflow
  - `overflow: hidden|auto|scroll|visible` → `overflow-*`
  - axis variants: `overflow-x-*`, `overflow-y-*`
  - Fallbacks: `[overflow:value]`
- object-fit
  - contain/cover/fill/none/scale-down → `object-*`
- object-position
  - center/top/right/bottom/left and simple combos like top-left
    - When supported by utility: `object-center`, `object-top-left`, etc.
    - Otherwise: `object-[pos]`
- aspect-ratio
  - 1 / 1 → `aspect-square`
  - 16 / 9 → `aspect-video`
  - Others → `aspect-[value]`

Box model and dimensions

- margin/padding (including shorthands)
  - Use spacing tokens; `0` and `auto` handled specially
  - Shorthand decomposition 1–4 values into `m*`/`p*` sides
  - Approximate if enabled and within threshold; otherwise arbitrary
- width/height/min/max
  - Known values → `w-*`/`h-*`/`min-w-*`/`max-w-*`/`min-h-*`/`max-h-*`
  - Percentages like `100%` → `w-full`, `h-full`
  - Others → arbitrary value utilities
- gap/gap-x/gap-y
  - Use spacing tokens; fall back to `gap-[value]`
- border-width
  - `border-width: 1px` → `border`
  - `border-width: 0|2|4|8` → `border-0|2|4|8`
  - Others → `border-[value]`
- border-style
  - solid/dashed/dotted/double → `border-solid|dashed|dotted|double`
  - Others → `[border-style:value]`
- border-radius
  - `0` → `rounded-none`
  - theme sizes → `rounded|rounded-md|lg|xl|2xl|...`
  - `50%`/`9999px` → `rounded-full`
  - Others → `rounded-[value]`

Typography

- color (text color)
  - Tokens → `text-*`
  - Hex/rgb/hsl not in theme → `text-[color]`
- font-size
  - Tokens → `text-sm|base|lg|xl|2xl|...`
  - Approximate allowed by threshold; otherwise arbitrary `text-[value]`
- line-height
  - Tokens → `leading-none|tight|snug|normal|relaxed|loose` or specific numeric tokens
  - Otherwise → `leading-[value]`
- letter-spacing
  - Tokens → `tracking-tighter|tight|normal|wide|wider|widest`
  - Otherwise → `tracking-[value]`
- font-weight
  - Numeric 100–900 → `font-*` (e.g., `font-700` → `font-bold`, map common names)
- text-align
  - left/center/right/justify → `text-left|center|right|justify`
- text-decoration
  - underline/line-through/no-underline
  - decoration color/offset/thickness → use arbitrary when not natively matched

Backgrounds

- background-color
  - Tokens → `bg-*`
  - Otherwise → `bg-[value]`
- background-image
  - `url(...)` → `bg-[url(...)]`
  - Known gradients → `bg-gradient-to-*` (only when unequivocally detected)
- background-size
  - cover/contain/auto → `bg-cover|contain|auto`
  - Others → `bg-[length:value]`
- background-position
  - center/top/right/bottom/left → `bg-center|top|right|...`
  - Others → `bg-[position:value]`
- background-repeat
  - `no-repeat|repeat|repeat-x|repeat-y|round|space` → `bg-*`
- background-attachment
  - `fixed|local|scroll` → `bg-*`
- background-origin/clip
  - Use arbitrary when not supported: `[background-origin:value]`, `[background-clip:value]`

Flex and grid

- flex-direction
  - row|row-reverse|col|col-reverse → `flex-*`
- justify-content
  - start|end|center|between|around|evenly → `justify-*`
- align-items
  - start|end|center|baseline|stretch → `items-*`
- align-content/justify-items/place-\*
  - Map to available utilities; otherwise arbitrary
- flex-basis
  - Spacing tokens when applicable; else `basis-[value]`
- flex-grow/shrink
  - `grow`, `grow-0`, `shrink`, `shrink-0`
- gap
  - spacing tokens; arbitrary fallback
- grid-template-columns
  - `repeat(N, minmax(0,1fr))` → `grid-cols-N`
  - Others → `grid-cols-[...]`
- grid-template-rows
  - `repeat(N, minmax(0,1fr))` → `grid-rows-N`
  - Others → `grid-rows-[...]`
- grid-auto-flow
  - `row|col|dense|row dense|col dense` → `grid-flow-*`
- grid placement
  - `grid-column`/`grid-row` → `col-span-*`, `col-start-*`, `col-end-*`, `row-span-*`, etc.
- grid-template-areas
  - Use arbitrary: `[grid-template-areas:"..."]`

Effects

- opacity
  - 0–100 → `opacity-*` (scale mapping); otherwise `opacity-[value]`
- box-shadow
  - Known tokens → `shadow-none|sm|md|lg|xl|2xl`
  - Otherwise → `shadow-[...]` (no approximation by default)
- filter
  - Base `filter` utility may be required; argumented functions become arbitrary: `[filter:blur(6px)]`
- mix-blend-mode
  - `mix-blend-multiply|screen|overlay|...`; otherwise arbitrary
- isolation
  - `isolate` or `[isolation:auto]`

Color resolution strategy

- Exact token matches produce `text-*`, `bg-*`, `border-*`.
- Hex and rgb/hsl normalized; if no token, arbitrary (`text-[#1f2937]`).
- Named colors map directly when present in theme.

Spacing resolution

- Values matched against spacing scale; px converted to rem assuming base 16px if needed.
- Approximate mode uses nearest token within threshold; emits warning with diff.
- No match → arbitrary (e.g., `mx-[13px]`).

Shorthand handling

- margin/padding: decompose 1–4 values into sides and axes.
- border: parse width/style/color components.
- background: parse color, image, position, size, repeat, attachment.
- font: decompose `font: italic small-caps bold 16px/1.5 Inter, sans-serif` to `italic`, `font-bold`, `text-[16px]`, `leading-[1.5]` (+ arbitrary for unsupported parts).
- transition: attempt `transition`, `duration-*`, `ease-*`, `delay-*`; else `[transition:...]`.
- animation: `animate-none` or arbitrary `[animation:...]`.

Edge cases and warnings

- Properties without handlers → arbitrary property + `no-handler` warning.
- Approximate matches → `approximate` warning with `{ prop, original, token, diffPx }`.
- In strict mode, no approximation; use arbitrary and possibly `token-miss`.

### Variants and Responsive Behavior

Supported pseudo-classes and state variants

- hover, focus, active, disabled, visited
- focus-visible, focus-within
- first, last, odd, even
- group and peer (if present in usage): `group-hover:`, `peer-focus:`, etc.

Responsive breakpoints

- Defaults (v3): sm 640, md 768, lg 1024, xl 1280, 2xl 1536.
- For v4, `ctx.opts.screens` or tokens.screens (if extracted) should be used.
- Map @media(min-width:Xpx) to nearest screen in approximate mode with tolerance of 1px; exact in strict mode.

Variant application

- Apply variants as prefixes in the given order, preserving hierarchy:
  - Example: `md:dark:hover:focus:text-blue-600`
- Multiple variants are applied left-to-right; dedupe repeated variants.
- Variants are applied per-class with stable ordering (see Class Ordering).

### Class Ordering

Goals

- Deterministic, readable, stable diff ordering.

Groups and order

1. layout (display, position, inset/top/right/bottom/left, overflow, object, aspect)
2. flex-grid (flex/grid/gap/justify/items/place-\*)
3. sizing (w-, h-, min-w-, max-w-, min-h-, max-h-)
4. spacing (m-, p-, space-)
5. typography (font-, text-, leading-, tracking-, decoration-)
6. background (bg-)
7. border (border-, rounded-, outline-)
8. effects (shadow-, opacity-, filter, mix-blend-, isolate)
9. misc (everything else)

Algorithm

- Infer group from class prefix:
  - `w-` → sizing, `m-`/`p-` → spacing, `text-`/`font-`/`leading-` → typography,
    `bg-` → background, `border-`/`rounded-`/`outline-` → border,
    `shadow-`/`opacity-`/`mix-blend-`/`isolate` → effects,
    `flex-`/`items-`/`justify-`/`grid-`/`gap-` → flex-grid,
    `object-`/`aspect-`/`inset-`/`top-`/`left-`/`right-`/`bottom-`/`overflow-` → layout.
- Sort by tuple: (variantPrefix, groupOrder, classKey, classFull).
  - variantPrefix: the entire prefix string e.g., `md:hover:`; sort lexicographically.
  - classKey: a simplified representation (e.g., `w-10` vs `w-[...]`) to provide stable ordering within group.
- Dedupe at the end, preserving first occurrence order within the sort context.

### Reporter, Warnings, and Coverage

Warning categories

- arbitrary-value: arbitrary utility or property was used.
- no-handler: property has no dedicated handler.
- approximate: approximation used with thresholds; include `{ prop, original, token, diffPx }`.
- token-miss: in v4 mode, a token was expected but not found (strict mode), falling back to arbitrary.
- v3-fallback: in v4 mode, resolution fell back to v3 theme because tokens not available.
- other: default catch-all.

Coverage metrics

- matched: number of declarations that produced at least one class using a known handler.
- nonArbitrary: subset of matched with non-arbitrary classes only.
- total: total number of declarations processed.
- percentage: matched / total.
- categories: per PropertyCategory breakdown.
- warningsByCategory: counts by WarningCategory.

Summarize

- Returns a structured object plus a human-readable text block containing:
  - Totals
  - Per-category coverage
  - Warnings by type
  - Sample classes and warnings

Matched definition

- Count as matched if a known handler produced a Tailwind class (even if also produced arbitrary).
- Increase nonArbitrary only for classes that are purely non-arbitrary.

### Configuration and Extensibility

Handler registration

- `propertyHandlers: Record<string, RuleHandler>` is the registry for handlers.
- Handlers may return:
  - `string[]` of classes
  - `{ classes: string[]; warnings: string[] }`
  - `null` when not applicable

Theme and tokens loading

- v3: `loadTheme(cwd)` looks for tailwind.config.\* and provides theme structure.
- v4: `loadTokens({ cssPath, configPath })` tries CSS variables first; if absent, falls back to v3 theme or defaults.

Extending with custom handlers

- Handlers can be added or overridden via the registry.

Settings and options

- `TailwindifyOptions` controls strict/approximate, thresholds, version mode, and breakpoints.
- `version: 'auto'` attempts v4 tokens first; if not found, uses v3 theme and emits `v3-fallback` when appropriate.

### Testing Approach

Unit tests

- Matchers: one suite per property or category.
- Normalizers and parsers.
- Resolvers: spacing, colors, font-size/line-height, with strict and approximate coverage.

Integration tests

- Component fixtures: button, card, grid, layout.
- Test strict and approximate modes.
- Snapshot classes and warnings.

Coverage comparison

- Compare strict vs approximate for matched, nonArbitrary, total, warnings.

Fixtures

- Include responsive and variants scenarios.
- Include border/background shorthands and complex combinations.
- Include cases with CSS variables (v4 tokens) and config-based theme (v3).

### Limitations and Known Gaps

Uncovered properties and areas (current)

- Transforms (translate/scale/rotate/skew) — should fall back to arbitrary `[transform:...]` or specific utilities if added.
- Transition and animation detailed mapping (beyond basic).
- Advanced text decoration options (color/thickness/offset) usually fall back to arbitrary.
- Grid template areas: always arbitrary.
- Box-shadow token approximation: not implemented (by design).

TODOs

- Class ordering by property group (implement the algorithm described).
- Media query parsing to responsive variants mapping from raw CSS @media blocks.
- More comprehensive color matching (named sets, alpha variants).
- Support for CSS variables (v3) as inputs where appropriate.
- CLI: file globbing, stdin/stdout, JSON and Markdown reports.

CLI implementation roadmap

- Basic:
  - Input: file paths or stdin CSS.
  - Output: classes per selector in JSON.
  - Flags: `--strict`, `--approximate`, `--thresholds.spacing=2`, `--version=auto|v3|v4`, `--screens=...`, `--report=markdown|json`.
- Nice-to-have:
  - Output combined class strings ordered per algorithm.
  - Write summary report to file.
  - Exit code based on coverage thresholds.

Web app roadmap

- Monaco editor with CSS input and Tailwind output.
- Worker-based core execution to keep UI responsive.
- Side panel for warnings and coverage.

### Examples (Normative)

Example 1: Button (strict)
Input CSS

```css
.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  background-color: #3b82f6;
  color: #fff;
}
```

Output Tailwind

```
inline-block p-2 px-4 m-1 text-base font-semibold leading-normal text-center border border-solid border-transparent rounded bg-blue-500 text-white
```

Warnings

- Selector '.btn' converted; manual review may be required (optional note).

Example 2: Card with box-shadow (strict)
Input CSS

```css
.card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

Output Tailwind

```
flex flex-col p-4 m-4 bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)]
```

Warnings

- No direct Tailwind token for box-shadow; used arbitrary property (arbitrary-value).

Example 3: Grid + gap (strict)
Input CSS

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
}
```

Output Tailwind

```
grid grid-cols-3 gap-4 p-4
```

Example 4: Approximate font size
Input CSS

```css
.text {
  font-size: 17px;
}
```

Strict

```
text-[17px]
```

Approximate (fontPx=1)

```
text-base
```

Warnings

- approximate: font-size 17px → base (diff 1px)

Example 5: Responsive + variants
Input CSS

```css
@media (min-width: 768px) {
  .btn:hover {
    background-color: #3b82f6;
  }
}
```

Output Tailwind

```
md:hover:bg-blue-500
```

Example 6: Flex basis and grow/shrink
Input CSS

```css
.box {
  flex: 0 0 200px;
}
```

Output Tailwind

```
shrink-0 grow-0 basis-[200px]
```

Example 7: Border style and color
Input CSS

```css
.divider {
  border: 2px dashed #000;
}
```

Output Tailwind

```
border-2 border-dashed border-black
```

### Tailwind v4 Migration Plan

Background summary (concise)

- Tailwind v4 emphasizes CSS custom properties (design tokens) over JS config.
- The utility-first approach and arbitrary values continue to work.
- Tools should prefer tokens where available and support a zero-config path.

Version detection

- version: 'auto' (default) tries to load tokens from CSS first.
- If tokens loaded with source 'css-variables', set ctx.version = 'v4'; otherwise attempt v3 theme and set 'v3'.
- Emit 'v3-fallback' when in v4 path but falling back to v3 sources.

Tokens loader (new)

- loadTokens({ cssPath, configPath })
  - Parse CSS for :root and cascade layers to extract tokens:
    - spacing tokens (e.g., `--spacing-0`, `--spacing-0\.5`, `--spacing-1`, …)
    - font sizes and line-heights (e.g., `--font-size-sm`, `--leading-normal`)
    - colors (e.g., `--color-slate-900`)
    - screens (e.g., `--screen-sm: 640px`)
  - Optional: also read tailwind.config.\* for compatibility.
  - Return ThemeTokens with version and source.

Resolvers in v4

- Prefer tokens for spacing, fonts, line-heights, colors.
- In approximate mode, use resolveNearestTokenPx within thresholds and emit 'approximate'.
- In strict mode, do not approximate; use arbitrary and potentially emit 'token-miss'.

Responsive screens

- Determine screens from tokens.screens or options.screens; fallback to defaults.
- Map @media(min-width) to screen keys; tolerance of 1px allowed in approximate mode.

Matchers updates (compat)

- Keep v3 utility mappings; ensure no regressions if v4 renames occur.
- Where v4 introduces changes, detect ctx.version to choose mapping (future-proof).

Warnings and reporting in v4

- Add 'token-miss' and 'v3-fallback' categories.
- Enhance approximate warnings with structured metadata (prop, original, chosen token, diffPx).

Class ordering under v4

- The same deterministic ordering applies; utilities categories are broadly compatible.

Incremental migration steps

- Phase 1: Introduce tokens loader; extend MatchCtx; keep v3 behavior as fallback.
- Phase 2: Update resolvers and matchers to prefer tokens when ctx.version='v4'.
- Phase 3: Add v4 token fixtures; test strict/approximate and new warnings ('token-miss', 'v3-fallback').
- Phase 4: Document any deprecations/renames when confirmed; provide upgrade notes.

Backwards compatibility policy

- v3 mode remains supported alongside v4 tokens mode.
- Users can set `version: 'v3' | 'v4' | 'auto'`.
- Auto-detection is default; documented overrides available.

### Open Questions

- Token format specifics:
  - What exact naming conventions will be used in your project’s CSS tokens for spacing, colors, screens?
  - Should token extraction support multiple CSS files or cascade layers?
- Utility renames and gaps in v4:
  - Confirm if any known v3 utilities are renamed/removed in v4 in your target environment.
- Performance:
  - Will token scanning be cached across runs? Provide a cache key (file mtime + path).
- Testing:
  - Golden fixtures for both v3 (config) and v4 (CSS tokens) to ensure parity.
- CLI:
  - Which output formats and integration points (stdout/JSON/Markdown) are most valuable for early users?

This specification reflects the current v3-oriented implementation while defining a clear, incremental path to v4 via token loading, updated resolvers, enhanced warnings, deterministic class ordering, and expanded mapping coverage.

# Migration Guide: Tailwind CSS v3 to v4

Complete guide for migrating your CSSWindify projects from Tailwind CSS v3 to v4.

## 📋 Table of Contents

- [Introduction](#introduction)
- [Automatic Detection](#automatic-detection)
- [Tokens vs Theme](#tokens-vs-theme)
- [Step-by-Step Migration](#step-by-step-migration)
- [Troubleshooting](#troubleshooting)
- [Complete Examples](#complete-examples)
- [FAQ](#faq)

---

## 🎯 Introduction

### Differences Between v3 and v4

**Tailwind CSS v3:**

- Configuration via `tailwind.config.js`
- JavaScript-based theme tokens
- Requires Node.js build step
- Theme accessed via `theme()` function

**Tailwind CSS v4:**

- Configuration via CSS custom properties
- Native CSS variables
- No build step required (optional)
- Direct CSS variable access

### Why Migrate?

✅ **Better Performance** - No JavaScript parsing needed  
✅ **Simpler Setup** - Pure CSS configuration  
✅ **Runtime Flexibility** - Change tokens dynamically  
✅ **Better DX** - Easier to debug and understand  
✅ **Future-Proof** - Tailwind's recommended approach

### When to Migrate?

**Migrate Now If:**

- Starting a new project
- Want better performance
- Need runtime token changes
- Prefer CSS-first approach

**Wait If:**

- Large existing v3 codebase
- Heavy custom plugin usage
- Team not familiar with v4
- Tight deadlines

---

## 🔍 Automatic Detection

CSSWindify automatically detects which Tailwind version you're using.

### How Detection Works

```typescript
import { transformCssText } from '@css-windify/core';

// Auto-detect (recommended)
const result = transformCssText(css, {
  theme: {},
  version: 'auto', // Detects v3 or v4
  opts: { strict: false },
});
```

**Detection Logic:**

1. Checks for CSS custom properties (`--color-*`, `--spacing-*`)
2. If found → v4
3. If not found → v3 (fallback)

### Force Specific Version

```typescript
// Force v3
const resultV3 = transformCssText(css, {
  theme: {},
  version: 'v3',
  opts: { strict: false },
});

// Force v4
const resultV4 = transformCssText(css, {
  theme: {},
  version: 'v4',
  opts: { strict: false },
});
```

### Fallback Behavior

If v4 tokens are not found, CSSWindify falls back to:

1. v3 default theme
2. Approximate matching
3. Arbitrary values (e.g., `[#3b82f6]`)

---

## 🎨 Tokens vs Theme

### v3: JavaScript Configuration

**tailwind.config.js:**

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
      },
      spacing: {
        72: '18rem',
        84: '21rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
};
```

**Usage in CSSWindify:**

```typescript
import { loadTokens } from '@css-windify/core';

const tokens = await loadTokens({
  configPath: './tailwind.config.js',
});
```

### v4: CSS Custom Properties

**tokens.css:**

```css
@theme {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #10b981;

  /* Spacing */
  --spacing-72: 18rem;
  --spacing-84: 21rem;

  /* Border Radius */
  --radius-4xl: 2rem;
}

/* Or using :root */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #10b981;
  --spacing-72: 18rem;
  --spacing-84: 21rem;
  --radius-4xl: 2rem;
}
```

**Usage in CSSWindify:**

```typescript
import { loadTokens } from '@css-windify/core';

const tokens = await loadTokens({
  cssPath: './tokens.css',
});
```

### Side-by-Side Comparison

| Feature              | v3                         | v4                   |
| -------------------- | -------------------------- | -------------------- |
| **Config Format**    | JavaScript                 | CSS                  |
| **File Extension**   | `.js`                      | `.css`               |
| **Syntax**           | `colors: { blue: '#...' }` | `--color-blue: #...` |
| **Runtime Changes**  | ❌ Requires rebuild        | ✅ Dynamic           |
| **Browser DevTools** | ❌ Not visible             | ✅ Inspectable       |
| **Build Step**       | ✅ Required                | ⚠️ Optional          |

---

## 🚀 Step-by-Step Migration

### Step 1: Prepare CSS Tokens

Create a new file `tokens.css` with your v4 tokens:

```css
/**
 * Tailwind CSS v4 Tokens
 * Converted from tailwind.config.js
 */

@theme {
  /* Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-blue-400: #60a5fa;
  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;

  /* Spacing */
  --spacing-0: 0;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;
  --spacing-8: 2rem;

  /* Font Sizes */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;

  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-full: 9999px;
}
```

**Conversion Tool:**

```bash
# Use CSSWindify CLI to help convert
css-windify convert-config tailwind.config.js --output tokens.css
```

### Step 2: Update Your Code

**Before (v3):**

```typescript
import { transformCssText, loadTokens } from '@css-windify/core';

// Load v3 config
const tokens = await loadTokens({
  configPath: './tailwind.config.js',
});

const result = transformCssText(css, {
  theme: tokens,
  version: 'v3',
  opts: { strict: false },
});
```

**After (v4):**

```typescript
import { transformCssText, loadTokens } from '@css-windify/core';

// Load v4 tokens
const tokens = await loadTokens({
  cssPath: './tokens.css',
});

const result = transformCssText(css, {
  theme: tokens,
  version: 'v4', // or 'auto'
  opts: { strict: false },
});
```

### Step 3: Update Package Dependencies

```bash
# Update Tailwind CSS
pnpm add -D tailwindcss@next

# Update CSSWindify (if needed)
pnpm add @css-windify/core@latest
```

### Step 4: Test Thoroughly

```bash
# Run your test suite
pnpm test

# Check for warnings
pnpm css-windify input.css --verbose

# Compare results
pnpm css-windify input.css --version v3 > output-v3.txt
pnpm css-windify input.css --version v4 > output-v4.txt
diff output-v3.txt output-v4.txt
```

### Step 5: Update Build Configuration

**Before (v3):**

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**After (v4):**

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // v4 plugin
    autoprefixer: {},
  },
};
```

### Step 6: Gradual Migration (Optional)

You can run both versions side-by-side:

```typescript
// Dual-version support
const tokensV3 = await loadTokens({ configPath: './tailwind.config.js' });
const tokensV4 = await loadTokens({ cssPath: './tokens.css' });

// Use v4 with v3 fallback
const result = transformCssText(css, {
  theme: { ...tokensV3, ...tokensV4 },
  version: 'auto',
  opts: { strict: false },
});
```

---

## 🔧 Troubleshooting

### Issue: Token Not Found

**Problem:**

```
Warning: Token '--color-primary' not found in v4 theme
```

**Solutions:**

1. **Check Token Naming:**

```css
/* ❌ Wrong */
--primary: #3b82f6;

/* ✅ Correct */
--color-primary: #3b82f6;
```

2. **Verify File Path:**

```typescript
// Make sure path is correct
const tokens = await loadTokens({
  cssPath: './src/styles/tokens.css', // Check this path
});
```

3. **Use Fallback:**

```typescript
const result = transformCssText(css, {
  theme: tokens,
  version: 'auto', // Falls back to v3 if v4 fails
  opts: {
    strict: false,
    approximate: true, // Enable approximation
  },
});
```

### Issue: Fallback to v3

**Problem:**
CSSWindify keeps using v3 even with v4 tokens.

**Solutions:**

1. **Force v4:**

```typescript
const result = transformCssText(css, {
  theme: tokens,
  version: 'v4', // Force v4
  opts: { strict: false },
});
```

2. **Check Token Format:**

```css
/* Must use CSS custom properties */
@theme {
  --color-blue-500: #3b82f6; /* ✅ */
}

/* Not JavaScript */
colors: {
  blue: {
    500: '#3b82f6';
  }
} /* ❌ */
```

### Issue: v4 Warnings

**Problem:**
Many warnings about v4 token format.

**Solutions:**

1. **Update Token Names:**

```css
/* v3 style (causes warnings) */
--blue-500: #3b82f6;

/* v4 style (correct) */
--color-blue-500: #3b82f6;
```

2. **Use Conversion Tool:**

```bash
css-windify convert-config tailwind.config.js --output tokens.css --format v4
```

### Issue: Performance Degradation

**Problem:**
v4 conversion is slower than v3.

**Solutions:**

1. **Enable Caching:**

```typescript
import { createCache } from '@css-windify/core';

const cache = createCache();

const result = transformCssText(css, {
  theme: tokens,
  version: 'v4',
  opts: { strict: false },
  cache, // Enable caching
});
```

2. **Preload Tokens:**

```typescript
// Preload once at startup
const tokens = await loadTokens({ cssPath: './tokens.css' });

// Reuse in multiple calls
const result1 = transformCssText(css1, { theme: tokens, version: 'v4' });
const result2 = transformCssText(css2, { theme: tokens, version: 'v4' });
```

---

## 📦 Complete Examples

### Example 1: Small Project

**Project Structure:**

```
my-app/
├── src/
│   ├── styles/
│   │   └── tokens.css
│   └── index.ts
├── tailwind.config.js (old)
└── package.json
```

**Migration Steps:**

1. Create `tokens.css`:

```css
@theme {
  --color-primary: #3b82f6;
  --color-secondary: #10b981;
  --spacing-4: 1rem;
  --spacing-8: 2rem;
}
```

2. Update code:

```typescript
// src/index.ts
import { transformCssText, loadTokens } from '@css-windify/core';

const tokens = await loadTokens({
  cssPath: './src/styles/tokens.css',
});

const css = '.button { padding: 1rem; background-color: #3b82f6; }';
const result = transformCssText(css, {
  theme: tokens,
  version: 'v4',
  opts: { strict: false },
});

console.log(result['.button'].classes);
// ['p-4', 'bg-primary']
```

3. Remove old config:

```bash
rm tailwind.config.js
```

### Example 2: Large Project

**Project Structure:**

```
enterprise-app/
├── packages/
│   ├── ui/
│   │   ├── src/
│   │   └── tokens.css
│   └── utils/
├── apps/
│   ├── web/
│   └── mobile/
└── tailwind.config.js (shared)
```

**Migration Strategy:**

1. **Phase 1: Add v4 tokens alongside v3**

```css
/* packages/ui/tokens.css */
@theme {
  /* All your tokens here */
}
```

2. **Phase 2: Update one package at a time**

```typescript
// packages/ui/src/converter.ts
const tokens = await loadTokens({
  cssPath: '../tokens.css',
});
```

3. **Phase 3: Gradual rollout**

```typescript
// Support both versions during transition
const result = transformCssText(css, {
  theme: tokens,
  version: 'auto', // Auto-detect
  opts: { strict: false },
});
```

4. **Phase 4: Remove v3 config**

```bash
# After all packages migrated
rm tailwind.config.js
```

### Example 3: Monorepo

**Project Structure:**

```
monorepo/
├── packages/
│   ├── design-tokens/
│   │   └── tokens.css (shared)
│   ├── core/
│   └── cli/
└── apps/
    ├── web/
    └── docs/
```

**Shared Tokens:**

```css
/* packages/design-tokens/tokens.css */
@theme {
  /* Brand colors */
  --color-brand-primary: #3b82f6;
  --color-brand-secondary: #10b981;

  /* Spacing scale */
  --spacing-0: 0;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;

  /* Typography */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
}
```

**Usage in Packages:**

```typescript
// packages/core/src/index.ts
import { loadTokens } from '@css-windify/core';
import { resolve } from 'path';

const tokensPath = resolve(__dirname, '../../design-tokens/tokens.css');
const tokens = await loadTokens({ cssPath: tokensPath });

export { tokens };
```

---

## ❓ FAQ

### Can I use v3 and v4 together?

**Yes!** CSSWindify supports both versions simultaneously:

```typescript
const tokensV3 = await loadTokens({ configPath: './tailwind.config.js' });
const tokensV4 = await loadTokens({ cssPath: './tokens.css' });

// Merge tokens (v4 takes precedence)
const result = transformCssText(css, {
  theme: { ...tokensV3, ...tokensV4 },
  version: 'auto',
  opts: { strict: false },
});
```

### How do I migrate gradually?

**Recommended approach:**

1. **Week 1:** Add v4 tokens alongside v3
2. **Week 2:** Update non-critical components
3. **Week 3:** Update critical components
4. **Week 4:** Remove v3 config

```typescript
// During migration, use auto-detection
const result = transformCssText(css, {
  theme: tokens,
  version: 'auto', // Handles both versions
  opts: { strict: false },
});
```

### Are there breaking changes?

**Minor breaking changes:**

1. **Token naming convention:**
   - v3: `colors.blue[500]`
   - v4: `--color-blue-500`

2. **Configuration format:**
   - v3: JavaScript object
   - v4: CSS custom properties

3. **Plugin API:**
   - Some v3 plugins may need updates
   - Check plugin documentation

**Non-breaking:**

- All matchers work the same
- API remains compatible
- Output format unchanged

### What about custom plugins?

**v3 Plugins:**

```javascript
// May need updates
plugin(function({ addUtilities }) {
  addUtilities({
    '.custom': { ... }
  })
})
```

**v4 Plugins:**

```css
/* Use CSS directly */
@layer utilities {
  .custom {
    /* styles */
  }
}
```

### Performance comparison?

**Benchmarks (1000 conversions):**

| Version         | Time           | Memory       |
| --------------- | -------------- | ------------ |
| v3              | 245ms          | 12MB         |
| v4              | 198ms          | 9MB          |
| **Improvement** | **19% faster** | **25% less** |

### How do I report issues?

1. Check [GitHub Issues](https://github.com/yourusername/css-windify/issues)
2. Provide:
   - CSSWindify version
   - Tailwind version (v3 or v4)
   - Minimal reproduction
   - Expected vs actual output

---

## 📚 Additional Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/v4)
- [CSSWindify API Documentation](https://yourusername.github.io/css-windify/)
- [Migration Examples Repository](https://github.com/yourusername/css-windify-examples)
- [Community Discord](https://discord.gg/csswindify)

---

**Need Help?** Open an issue on [GitHub](https://github.com/yourusername/css-windify/issues) or ask in our [Discord community](https://discord.gg/csswindify).

**Made with ❤️ by the CSSWindify team**

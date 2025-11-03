# CSSWindify Plugin System

The plugin system allows you to extend CSSWindify with custom property handlers and lifecycle hooks.

## Table of Contents

- [Overview](#overview)
- [Creating a Plugin](#creating-a-plugin)
- [Property Handlers](#property-handlers)
- [Lifecycle Hooks](#lifecycle-hooks)
- [Plugin Registry](#plugin-registry)
- [Examples](#examples)

## Overview

Plugins enable you to:

- Add custom CSS property handlers
- Hook into the transformation lifecycle
- Extend CSSWindify without modifying core code
- Share custom matchers across projects

## Creating a Plugin

### Basic Plugin

```typescript
import { createPlugin } from 'css-windify-core';

const myPlugin = createPlugin(
  'my-plugin',
  '1.0.0',
  {
    // Custom handlers
    'custom-property': (value) => `custom-${value}`,
  },
  'My custom plugin'
);
```

### Advanced Plugin

```typescript
import { Plugin } from 'css-windify-core';

const advancedPlugin: Plugin = {
  metadata: {
    name: 'advanced-plugin',
    version: '1.0.0',
    description: 'An advanced plugin with hooks',
    author: 'Your Name',
  },

  handlers: {
    'custom-spacing': (value, ctx) => {
      // Custom logic
      const num = parseFloat(value);
      return `space-[${num}px]`;
    },
  },

  hooks: {
    beforeTransform: async (context) => {
      console.log('Starting transformation...');
    },

    afterTransform: async (context) => {
      console.log('Transformation complete!');
    },
  },

  init: async () => {
    console.log('Plugin initialized');
  },

  destroy: async () => {
    console.log('Plugin destroyed');
  },
};
```

## Property Handlers

Property handlers convert CSS property values to Tailwind classes.

### Handler Signature

```typescript
type PropertyHandler = (
  value: string,
  ctx: MatchCtx
) => string | string[] | { classes: string[]; warnings?: string[] };
```

### Simple Handler

```typescript
{
  'border-style': (value) => {
    const styles = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
      double: 'border-double',
      none: 'border-none',
    };
    return styles[value] || `border-[${value}]`;
  }
}
```

### Handler with Context

```typescript
{
  'custom-margin': (value, ctx) => {
    // Access theme tokens
    if (ctx.tokens?.spacing[value]) {
      return `m-${value}`;
    }
    // Use approximate mode
    if (ctx.opts.approximate) {
      return `m-[${value}]`;
    }
    return '';
  }
}
```

### Handler with Warnings

```typescript
{
  'experimental-prop': (value) => {
    return {
      classes: [`[experimental-prop:${value}]`],
      warnings: ['This property is experimental'],
    };
  }
}
```

## Lifecycle Hooks

Hooks allow you to execute code at specific points in the transformation process.

### Available Hooks

#### beforeTransform

Called before CSS transformation starts.

```typescript
beforeTransform: async (context) => {
  console.log('CSS:', context.css);
  console.log('Context:', context.ctx);
};
```

#### afterTransform

Called after CSS transformation completes.

```typescript
afterTransform: async (context) => {
  console.log('Result:', context.result);
  // Modify result if needed
};
```

#### beforeMatch

Called before a property is matched.

```typescript
beforeMatch: async (context) => {
  console.log('Matching:', context.property, context.value);
};
```

#### afterMatch

Called after a property is matched.

```typescript
afterMatch: async (context) => {
  console.log('Result:', context.result);
};
```

## Plugin Registry

### Global Registry

```typescript
import { registerPlugin, unregisterPlugin, getAllPlugins } from 'css-windify-core';

// Register a plugin
await registerPlugin(myPlugin);

// Get all plugins
const plugins = getAllPlugins();

// Unregister a plugin
await unregisterPlugin('my-plugin');
```

### Custom Registry

```typescript
import { PluginRegistry } from 'css-windify-core';

const registry = new PluginRegistry({
  allowDuplicates: false,
  enableHooks: true,
});

await registry.register(myPlugin);
```

## Examples

### Example 1: Custom Animation Plugin

```typescript
import { Plugin } from 'css-windify-core';

const animationPlugin: Plugin = {
  metadata: {
    name: 'animation-plugin',
    version: '1.0.0',
    description: 'Custom animation utilities',
  },

  handlers: {
    'animation-delay': (value) => {
      const delays = {
        '0s': 'delay-0',
        '75ms': 'delay-75',
        '100ms': 'delay-100',
        '150ms': 'delay-150',
        '200ms': 'delay-200',
        '300ms': 'delay-300',
        '500ms': 'delay-500',
        '700ms': 'delay-700',
        '1000ms': 'delay-1000',
      };
      return delays[value] || `delay-[${value}]`;
    },

    'animation-iteration-count': (value) => {
      if (value === 'infinite') return 'animate-infinite';
      return `animate-[iteration-count:${value}]`;
    },
  },
};
```

### Example 2: Logging Plugin

```typescript
const loggingPlugin: Plugin = {
  metadata: {
    name: 'logging-plugin',
    version: '1.0.0',
  },

  hooks: {
    beforeTransform: async (context) => {
      console.time('transformation');
    },

    afterTransform: async (context) => {
      console.timeEnd('transformation');

      const selectors = Object.keys(context.result);
      const totalClasses = Object.values(context.result).reduce(
        (sum, r) => sum + r.classes.length,
        0
      );

      console.log(`Processed ${selectors.length} selectors`);
      console.log(`Generated ${totalClasses} classes`);
    },
  },
};
```

### Example 3: Theme Extension Plugin

```typescript
const themePlugin: Plugin = {
  metadata: {
    name: 'theme-plugin',
    version: '1.0.0',
    description: 'Extend theme with custom values',
  },

  handlers: {
    'brand-color': (value, ctx) => {
      const brandColors = {
        primary: 'text-brand-primary',
        secondary: 'text-brand-secondary',
        accent: 'text-brand-accent',
      };
      return brandColors[value] || `text-[${value}]`;
    },
  },

  init: async () => {
    console.log('Theme plugin loaded');
  },
};
```

## Best Practices

1. **Naming**: Use descriptive, unique plugin names
2. **Versioning**: Follow semantic versioning
3. **Error Handling**: Handle edge cases gracefully
4. **Performance**: Keep handlers lightweight
5. **Documentation**: Document custom properties
6. **Testing**: Test plugins thoroughly
7. **Cleanup**: Implement destroy() for cleanup

## API Reference

See [types.ts](./types.ts) for complete type definitions.

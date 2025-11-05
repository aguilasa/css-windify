/**
 * Rules engine for transforming CSS to Tailwind classes
 */
import { CssDeclaration, CssRule, MatchCtx, RuleHandler, TransformResult } from '../types';
import {
  calculateCoverage,
  aggregateWarnings,
  countNonArbitraryClasses,
  calculateCategoryStats,
} from './reporter';
import { arbitraryProperty } from './normalizers';
import { withVariants } from './variants';
import {
  // Layout matchers
  matchDisplay,
  matchPosition,
  matchInset,
  matchInsetShorthand,
  matchObjectPosition,
  matchAspectRatio,

  // Spacing matchers
  matchSpacing,

  // Color matchers
  matchColor,

  // Border matchers
  matchBorderWidth,
  matchBorderRadius,

  // Cursor matcher
  matchCursor,
  matchBorderShorthand,
  matchBorderStyle,

  // Typography matchers
  matchTypography,
  matchTextDecoration,
  matchTextDecorationColor,
  matchTextDecorationStyle,
  matchTextDecorationThickness,

  // Background matchers
  matchBackgroundColor,
  matchBackgroundSize,
  matchBackgroundPosition,
  matchBackgroundImage,
  matchBackgroundShorthand,
  matchBackgroundRepeat,
  matchBackgroundAttachment,
  matchBackgroundOrigin,
  matchBackgroundClip,

  // Flexbox and Grid matchers
  matchFlexDirection,
  matchJustifyContent,
  matchAlignItems,
  matchGap,
  matchGridTemplateColumns,
  matchPlaceContent,
  matchPlaceItems,
  matchPlaceSelf,
  matchFlexBasis,
  matchFlexGrow,
  matchFlexShrink,
  matchGridAutoFlow,
  matchGridColumn,
  matchGridRow,
  matchGridColumnStart,
  matchGridColumnEnd,
  matchGridRowStart,
  matchGridRowEnd,
  matchGridTemplateAreas,

  // Font matchers
  matchFontShorthand,

  // Transition and Animation matchers
  matchTransitionShorthand,
  matchAnimationShorthand,

  // Transform matchers
  matchTranslate,
  matchScale,
  matchRotate,
  matchSkew,
  matchTransform,

  // Misc matchers
  matchOverflow,
  matchZIndex,
  matchOpacity,
  matchBoxShadow,
  matchFilter,
  matchMixBlendMode,
  matchIsolation,
} from './matchers';

// Define property groups for ordering (used for documentation and future sorting)
// const propertyGroups = [
//   'typography',   // Typography related properties
//   'layout',       // Layout related properties
//   'spacing',      // Margin, padding
//   'sizing',       // Width, height
//   'flexbox',      // Flexbox properties
//   'grid',         // Grid properties
//   'border',       // Border properties
//   'background',   // Background properties
//   'effects',      // Effects like opacity, shadow
//   'other'         // Any other properties
// ];

// Map CSS properties to their group (used for documentation and future sorting)
// const propertyGroupMap: Record<string, string> = {
//   // Typography
//   'font-size': 'typography',
//   'line-height': 'typography',
//   'letter-spacing': 'typography',
//   'font-weight': 'typography',
//   'text-align': 'typography',
//   'color': 'typography',
//
//   // Layout
//   'display': 'layout',
//   'position': 'layout',
//   'top': 'layout',
//   'right': 'layout',
//   'bottom': 'layout',
//   'left': 'layout',
//   'z-index': 'layout',
//   'object-fit': 'layout',
//
//   // Spacing
//   'margin': 'spacing',
//   'margin-top': 'spacing',
//   'margin-right': 'spacing',
//   'margin-bottom': 'spacing',
//   'margin-left': 'spacing',
//   'padding': 'spacing',
//   'padding-top': 'spacing',
//   'padding-right': 'spacing',
//   'padding-bottom': 'spacing',
//   'padding-left': 'spacing',
//
//   // Sizing
//   'width': 'sizing',
//   'height': 'sizing',
//   'min-width': 'sizing',
//   'min-height': 'sizing',
//   'max-width': 'sizing',
//   'max-height': 'sizing',
//
//   // Flexbox
//   'flex-direction': 'flexbox',
//   'justify-content': 'flexbox',
//   'align-items': 'flexbox',
//   'gap': 'flexbox',
//
//   // Grid
//   'grid-template-columns': 'grid',
//   'place-content': 'grid',
//   'place-items': 'grid',
//   'place-self': 'grid',
//
//   // Border
//   'border': 'border',
//   'border-width': 'border',
//   'border-color': 'border',
//   'border-radius': 'border',
//
//   // Background
//   'background': 'background',
//   'background-color': 'background',
//   'background-image': 'background',
//   'background-size': 'background',
//   'background-position': 'background',
// };

// Map CSS properties to their handlers
const propertyHandlers: Record<string, RuleHandler> = {
  // Layout properties
  display: (value) => [matchDisplay(value)],
  position: (value) => [matchPosition(value)],
  'object-position': (value) => [matchObjectPosition(value)],
  'aspect-ratio': (value) => [matchAspectRatio(value)],
  top: (value, ctx) => matchInset('top', value, ctx),
  right: (value, ctx) => matchInset('right', value, ctx),
  bottom: (value, ctx) => matchInset('bottom', value, ctx),
  left: (value, ctx) => matchInset('left', value, ctx),
  inset: (value, ctx) => matchInsetShorthand(value, ctx),

  // Spacing properties
  margin: (value, ctx) => {
    const result = matchSpacing('m', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
  'margin-top': (value, ctx) => {
    const result = matchSpacing('mt', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
  'margin-right': (value, ctx) => {
    const result = matchSpacing('mr', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
  'margin-bottom': (value, ctx) => {
    const result = matchSpacing('mb', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
  'margin-left': (value, ctx) => {
    const result = matchSpacing('ml', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
  padding: (value, ctx) => {
    const result = matchSpacing('p', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
  'padding-top': (value, ctx) => {
    const result = matchSpacing('pt', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
  'padding-right': (value, ctx) => {
    const result = matchSpacing('pr', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
  'padding-bottom': (value, ctx) => {
    const result = matchSpacing('pb', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
  'padding-left': (value, ctx) => {
    const result = matchSpacing('pl', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },

  // Sizing properties
  width: (value, ctx) => {
    const result = matchSpacing('w', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
  height: (value, ctx) => {
    const result = matchSpacing('h', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
  'min-width': (value, ctx) => {
    const result = matchSpacing('min-w', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
  'min-height': (value, ctx) => {
    const result = matchSpacing('min-h', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
  'max-width': (value, ctx) => {
    const result = matchSpacing('max-w', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
  'max-height': (value, ctx) => {
    const result = matchSpacing('max-h', value, ctx);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },

  // Color properties
  color: (value, ctx) => {
    const result = matchColor('text', value, ctx);
    return [result.class];
  },
  'border-color': (value, ctx) => {
    const result = matchColor('border', value, ctx);
    return [result.class];
  },

  // Border properties
  'border-width': (value) => [matchBorderWidth(value)],
  'border-radius': (value) => [matchBorderRadius(value)],

  // Typography properties
  'font-size': (value, ctx) => {
    const result = matchTypography('font-size', value, ctx);
    return result.warning
      ? { classes: [result.class], warnings: [result.warning] }
      : [result.class];
  },
  'line-height': (value, ctx) => {
    const result = matchTypography('line-height', value, ctx);
    return result.warning
      ? { classes: [result.class], warnings: [result.warning] }
      : [result.class];
  },
  'letter-spacing': (value, ctx) => {
    const result = matchTypography('letter-spacing', value, ctx);
    return result.warning
      ? { classes: [result.class], warnings: [result.warning] }
      : [result.class];
  },
  'font-weight': (value) => {
    // Map font-weight values to Tailwind classes
    const weightMap: Record<string, string> = {
      '100': 'font-thin',
      '200': 'font-extralight',
      '300': 'font-light',
      '400': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold',
      '800': 'font-extrabold',
      '900': 'font-black',
      normal: 'font-normal',
      bold: 'font-bold',
    };

    const normalizedValue = value.trim();
    if (weightMap[normalizedValue]) {
      return [weightMap[normalizedValue]];
    }

    // Use arbitrary value if no match found
    return [arbitraryProperty('font-weight', value)];
  },
  'text-align': (value) => {
    // Map text-align values to Tailwind classes
    const alignMap: Record<string, string> = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    };

    const normalizedValue = value.trim().toLowerCase();
    if (alignMap[normalizedValue]) {
      return [alignMap[normalizedValue]];
    }

    // Use arbitrary value if no match found
    return [arbitraryProperty('text-align', value)];
  },

  // Text decoration properties
  'text-decoration': (value) => {
    const result = matchTextDecoration(value);
    return Array.isArray(result) ? result : [result];
  },
  'text-decoration-color': (value, ctx) => {
    const result = matchTextDecorationColor(value, ctx);
    return [result];
  },
  'text-decoration-style': (value) => [matchTextDecorationStyle(value)],
  'text-decoration-thickness': (value) => [matchTextDecorationThickness(value)],

  // Object properties
  'object-fit': (value) => {
    // Map object-fit values to Tailwind classes
    const fitMap: Record<string, string> = {
      contain: 'object-contain',
      cover: 'object-cover',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    };

    const normalizedValue = value.trim().toLowerCase();
    if (fitMap[normalizedValue]) {
      return [fitMap[normalizedValue]];
    }

    // Use arbitrary value if no match found
    return [arbitraryProperty('object-fit', value)];
  },

  // Flexbox and Grid properties
  'flex-direction': (value) => [matchFlexDirection(value)],
  'justify-content': (value) => [matchJustifyContent(value)],
  'align-items': (value) => [matchAlignItems(value)],
  gap: (value, ctx) => [matchGap('', value, ctx)],
  'column-gap': (value, ctx) => [matchGap('x', value, ctx)],
  'row-gap': (value, ctx) => [matchGap('y', value, ctx)],
  'grid-template-columns': (value) => [matchGridTemplateColumns(value)],
  'place-content': (value) => [matchPlaceContent(value)],
  'place-items': (value) => [matchPlaceItems(value)],
  'place-self': (value) => [matchPlaceSelf(value)],
  'flex-basis': (value, ctx) => [matchFlexBasis(value, ctx)],
  'flex-grow': (value) => [matchFlexGrow(value)],
  'flex-shrink': (value) => [matchFlexShrink(value)],
  'grid-auto-flow': (value) => [matchGridAutoFlow(value)],
  'grid-column': (value) => {
    const result = matchGridColumn(value);
    return Array.isArray(result) ? result : [result];
  },
  'grid-row': (value) => {
    const result = matchGridRow(value);
    return Array.isArray(result) ? result : [result];
  },
  'grid-column-start': (value) => [matchGridColumnStart(value)],
  'grid-column-end': (value) => [matchGridColumnEnd(value)],
  'grid-row-start': (value) => [matchGridRowStart(value)],
  'grid-row-end': (value) => [matchGridRowEnd(value)],
  'grid-template-areas': (value) => [matchGridTemplateAreas(value)],

  // Background properties
  background: (value, ctx) => matchBackgroundShorthand(value, ctx).classes,
  'background-color': (value, ctx) => {
    const result = matchBackgroundColor(value, ctx);
    return [result.class];
  },
  'background-size': (value) => [matchBackgroundSize(value)],
  'background-position': (value) => [matchBackgroundPosition(value)],
  'background-image': (value) => [matchBackgroundImage(value)],
  'background-repeat': (value) => [matchBackgroundRepeat(value)],
  'background-attachment': (value) => [matchBackgroundAttachment(value)],
  'background-origin': (value) => [matchBackgroundOrigin(value)],
  'background-clip': (value) => [matchBackgroundClip(value)],

  // Border properties
  border: (value, ctx) => matchBorderShorthand(value, ctx).classes,
  'border-style': (value) => [matchBorderStyle(value)],

  // Font properties
  font: (value, ctx) => matchFontShorthand(value, ctx).classes,

  // Transition properties
  transition: (value) => matchTransitionShorthand(value).classes,

  // Animation properties
  animation: (value) => matchAnimationShorthand(value).classes,

  // Transform properties
  transform: (value, ctx) => {
    const result = matchTransform(value, ctx);
    return result.warning
      ? { classes: result.classes, warnings: [result.warning] }
      : result.classes;
  },
  translate: (value, ctx) => [matchTranslate(value, undefined, ctx)],
  scale: (value, ctx) => [matchScale(value, undefined, ctx)],
  rotate: (value, ctx) => [matchRotate(value, ctx)],
  skew: (value, ctx) => [matchSkew(value, undefined, ctx)],

  // Misc properties
  overflow: (value) => [matchOverflow(value)],
  'overflow-x': (value) => [matchOverflow(value, 'x')],
  'overflow-y': (value) => [matchOverflow(value, 'y')],
  'z-index': (value) => [matchZIndex(value)],
  opacity: (value) => [matchOpacity(value)],
  'box-shadow': (value, ctx) => {
    const result = matchBoxShadow(value, ctx);
    return result.warning
      ? { classes: [result.class], warnings: [result.warning] }
      : [result.class];
  },
  filter: (value, ctx) => {
    const result = matchFilter(value, ctx);
    return result.warning
      ? { classes: result.classes, warnings: [result.warning] }
      : result.classes;
  },
  'mix-blend-mode': (value) => [matchMixBlendMode(value)],
  isolation: (value) => [matchIsolation(value)],
  cursor: (value) => {
    const result = matchCursor(value);
    return result.warnings.length > 0
      ? { classes: result.classes, warnings: result.warnings }
      : result.classes;
  },
};

/**
 * Convert a CSS property and value to Tailwind classes
 * @param prop CSS property
 * @param value CSS value
 * @param ctx Matching context
 * @returns Object with classes and warning information
 */
export function toTailwind(
  prop: string,
  value: string,
  ctx: MatchCtx
): { classes: string[]; warning: string | null } {
  // Normalize property name
  const normalizedProp = prop.trim().toLowerCase();

  // Check if we have a handler for this property
  const handler = propertyHandlers[normalizedProp];

  if (handler) {
    // Use the handler to convert the property
    const result = handler(value, ctx);

    if (result) {
      // If the result is already in the expected format
      if (typeof result === 'object' && 'classes' in result && 'warnings' in result) {
        const warnings = result.warnings;
        return {
          classes: result.classes,
          warning: warnings.length > 0 ? warnings.join('; ') : null,
        };
      }

      // If the result is an array of classes
      if (Array.isArray(result) && result.length > 0) {
        // Check if any class uses arbitrary values
        const hasArbitrary = result.some((cls) => cls.includes('[') && cls.includes(']'));

        if (hasArbitrary) {
          return {
            classes: result,
            warning: `Used arbitrary value for '${prop}: ${value}'`,
          };
        }

        return { classes: result, warning: null };
      }

      // If the result is an object with class property (from color matchers)
      if (typeof result === 'object' && result !== null && 'class' in result) {
        // Ensure result.class is treated as a string
        const classValue = result.class as string;
        const classes = [classValue];
        // Safely access warning property if it exists
        const warning =
          'warning' in result && typeof result.warning === 'string' ? result.warning : null;
        return {
          classes,
          warning: warning,
        };
      }
    }
  }

  // Fallback: use arbitrary property
  const arbitraryClass = arbitraryProperty(prop, value);
  return {
    classes: [arbitraryClass],
    warning: `No direct Tailwind equivalent for '${prop}: ${value}', used arbitrary property`,
  };
}

/**
 * Get the property group for a CSS property
 * @param prop CSS property
 * @returns Property group name
 */
// function getPropertyGroup(prop: string): string {
//   const normalizedProp = prop.trim().toLowerCase();
//   return propertyGroupMap[normalizedProp] || 'other';
// }

/**
 * Get the group for a Tailwind class
 *
 * @see SPEC.md → "Class Ordering" → "Groups and order"
 * @see SPEC.md → "Class Ordering" → "Algorithm"
 *
 * Implements the 9-group ordering system:
 * 1. layout, 2. flex-grid, 3. sizing, 4. spacing, 5. typography,
 * 6. background, 7. border, 8. effects, 9. misc
 *
 * @param className Tailwind class name
 * @returns Group name and order value
 */
export function getClassGroup(className: string): { group: string; order: number } {
  // Extract the base class name without variants
  const baseClass = className.split(':').pop() || '';

  // Define the groups and their order as specified in SPEC.md
  // @see SPEC.md → "Class Ordering" → "Groups and order"
  const groups = {
    layout: 1, // display, position, inset/top/right/bottom/left, overflow, object, aspect
    'flex-grid': 2, // flex/grid/gap/justify/items/place-*
    sizing: 3, // w-, h-, min-w-, max-w-, min-h-, max-h-
    spacing: 4, // m-, p-, space-
    typography: 5, // font-, text-, leading-, tracking-, decoration-
    background: 6, // bg-
    border: 7, // border-, rounded-, outline-
    effects: 8, // shadow-, opacity-, filter, mix-blend-, isolate
    misc: 9, // everything else
  };

  // Layout group prefixes
  if (
    baseClass === 'block' ||
    baseClass === 'inline' ||
    baseClass === 'inline-block' ||
    baseClass === 'flex' ||
    baseClass === 'inline-flex' ||
    baseClass === 'grid' ||
    baseClass === 'inline-grid' ||
    baseClass === 'hidden' ||
    baseClass === 'static' ||
    baseClass === 'fixed' ||
    baseClass === 'absolute' ||
    baseClass === 'relative' ||
    baseClass === 'sticky' ||
    baseClass.startsWith('inset-') ||
    baseClass.startsWith('top-') ||
    baseClass.startsWith('right-') ||
    baseClass.startsWith('bottom-') ||
    baseClass.startsWith('left-') ||
    baseClass.startsWith('overflow-') ||
    baseClass.startsWith('object-') ||
    baseClass.startsWith('aspect-')
  ) {
    return { group: 'layout', order: groups.layout };
  }

  // Flex and Grid group prefixes
  if (
    baseClass.startsWith('flex-') ||
    baseClass.startsWith('items-') ||
    baseClass.startsWith('justify-') ||
    baseClass.startsWith('grid-') ||
    baseClass.startsWith('gap-') ||
    baseClass.startsWith('place-') ||
    baseClass.startsWith('content-') ||
    baseClass.startsWith('col-') ||
    baseClass.startsWith('row-') ||
    baseClass === 'justify-between' ||
    baseClass === 'justify-center' ||
    baseClass === 'justify-start' ||
    baseClass === 'justify-end' ||
    baseClass === 'justify-around' ||
    baseClass === 'justify-evenly' ||
    baseClass === 'items-center' ||
    baseClass === 'items-start' ||
    baseClass === 'items-end' ||
    baseClass === 'items-baseline' ||
    baseClass === 'items-stretch'
  ) {
    return { group: 'flex-grid', order: groups['flex-grid'] };
  }

  // Sizing group prefixes
  if (
    baseClass.startsWith('w-') ||
    baseClass.startsWith('h-') ||
    baseClass.startsWith('min-w-') ||
    baseClass.startsWith('min-h-') ||
    baseClass.startsWith('max-w-') ||
    baseClass.startsWith('max-h-')
  ) {
    return { group: 'sizing', order: groups.sizing };
  }

  // Spacing group prefixes
  if (
    baseClass.startsWith('m-') ||
    baseClass.startsWith('mx-') ||
    baseClass.startsWith('my-') ||
    baseClass.startsWith('mt-') ||
    baseClass.startsWith('mr-') ||
    baseClass.startsWith('mb-') ||
    baseClass.startsWith('ml-') ||
    baseClass.startsWith('p-') ||
    baseClass.startsWith('px-') ||
    baseClass.startsWith('py-') ||
    baseClass.startsWith('pt-') ||
    baseClass.startsWith('pr-') ||
    baseClass.startsWith('pb-') ||
    baseClass.startsWith('pl-') ||
    baseClass.startsWith('space-')
  ) {
    return { group: 'spacing', order: groups.spacing };
  }

  // Typography group prefixes
  if (
    baseClass.startsWith('font-') ||
    baseClass.startsWith('text-') ||
    baseClass.startsWith('leading-') ||
    baseClass.startsWith('tracking-') ||
    baseClass.startsWith('decoration-') ||
    baseClass.startsWith('underline') ||
    baseClass.startsWith('line-through') ||
    baseClass.startsWith('no-underline')
  ) {
    return { group: 'typography', order: groups.typography };
  }

  // Background group prefixes
  if (baseClass.startsWith('bg-')) {
    return { group: 'background', order: groups.background };
  }

  // Border group prefixes
  if (
    baseClass.startsWith('border-') ||
    baseClass.startsWith('rounded-') ||
    baseClass.startsWith('outline-') ||
    baseClass === 'border' ||
    baseClass === 'rounded' ||
    baseClass === 'outline'
  ) {
    return { group: 'border', order: groups.border };
  }

  // Effects group prefixes
  if (
    baseClass.startsWith('shadow-') ||
    baseClass.startsWith('opacity-') ||
    baseClass.startsWith('filter-') ||
    baseClass.startsWith('mix-blend-') ||
    baseClass.startsWith('isolate') ||
    baseClass === 'shadow' ||
    baseClass === 'opacity' ||
    baseClass === 'filter' ||
    baseClass === 'isolate'
  ) {
    return { group: 'effects', order: groups.effects };
  }

  // Default to misc group
  return { group: 'misc', order: groups.misc };
}

/**
 * Extract variant prefix from a Tailwind class
 * @param className Tailwind class name
 * @returns Variant prefix and base class
 */
export function extractVariantAndBase(className: string): {
  variantPrefix: string;
  baseClass: string;
  variants: string[];
} {
  const parts = className.split(':');

  // If there are no variants
  if (parts.length === 1) {
    return { variantPrefix: '', baseClass: className, variants: [] };
  }

  // Extract the base class (last part) and variant prefix (everything else with colons)
  const baseClass = parts.pop() || '';

  // Deduplicate variants while preserving order
  const variants: string[] = [];
  const seen = new Set<string>();

  for (const variant of parts) {
    if (!seen.has(variant)) {
      seen.add(variant);
      variants.push(variant);
    }
  }

  const variantPrefix = variants.join(':') + ':';

  return { variantPrefix, baseClass, variants };
}

/**
 * Get a simplified class key for stable ordering
 * @param className Tailwind class name
 * @returns Simplified class key
 */
function getClassKey(className: string): string {
  // Extract the base class without variants
  const { baseClass } = extractVariantAndBase(className);

  // For arbitrary values, simplify to the prefix
  if (baseClass.includes('[') && baseClass.includes(']')) {
    const bracketIndex = baseClass.indexOf('[');
    if (bracketIndex > 0) {
      return baseClass.substring(0, bracketIndex);
    }
  }

  // For numeric classes, extract the prefix
  const match = baseClass.match(/^([a-z-]+)(\d+|\d+\.\d+)/);
  if (match) {
    return match[1];
  }

  return baseClass;
}

/**
 * Define the variant priority order
 * Lower number means higher priority (will be sorted first)
 */
const VARIANT_PRIORITY: Record<string, number> = {
  // Responsive variants (screen sizes) - highest priority
  sm: 10,
  md: 11,
  lg: 12,
  xl: 13,
  '2xl': 14,
  'max-sm': 15,
  'max-md': 16,
  'max-lg': 17,
  'max-xl': 18,
  'max-2xl': 19,

  // Color scheme variants
  dark: 20,
  light: 21,

  // Group variants
  'group-hover': 30,
  'group-focus': 31,
  'group-active': 32,
  'group-focus-visible': 33,
  'group-focus-within': 34,

  // Peer variants
  'peer-hover': 40,
  'peer-focus': 41,
  'peer-active': 42,
  'peer-checked': 43,
  'peer-focus-visible': 44,
  'peer-focus-within': 45,

  // Pseudo-class variants
  first: 50,
  last: 51,
  odd: 52,
  even: 53,
  visited: 54,
  hover: 55,
  focus: 56,
  'focus-visible': 57,
  'focus-within': 58,
  active: 59,
  disabled: 60,
};

/**
 * Get the priority of a variant
 * @param variant The variant name
 * @returns The priority value (lower is higher priority)
 */
function getVariantPriority(variant: string): number {
  return VARIANT_PRIORITY[variant] || 100; // Default to lowest priority if not found
}

/**
 * Sort Tailwind classes by property group
 *
 * @see SPEC.md → "Class Ordering" → "Algorithm"
 * @see SPEC.md → "Class Ordering" → "Goals" (deterministic, readable, stable diff ordering)
 *
 * Implements sorting by tuple: (variantPrefix, groupOrder, classKey, classFull)
 * - Deduplicates classes
 * - Sorts by variant count, then variant priority, then group, then class key
 * - Preserves first occurrence order within sort context
 *
 * @param classes Array of Tailwind classes
 * @returns Sorted array of classes
 */
export function sortClasses(classes: string[]): string[] {
  // First dedupe the classes to avoid duplicates
  // @see SPEC.md → "Class Ordering" → "Algorithm" (dedupe at the end)
  const uniqueClasses = [...new Set(classes)];

  // Create sort entries with metadata for sorting
  const sortEntries = uniqueClasses.map((cls) => {
    const { variantPrefix, baseClass, variants } = extractVariantAndBase(cls);
    const { order: groupOrder } = getClassGroup(cls);
    const classKey = getClassKey(cls);

    // Calculate variant priority score (for sorting variants in the correct order)
    const variantPriorityScore =
      variants.length > 0
        ? variants.reduce((score, variant, index) => {
            // Use variant priority and position to calculate score
            return score + getVariantPriority(variant) * Math.pow(10, index);
          }, 0)
        : 0;

    return {
      original: cls,
      variantPrefix,
      variants,
      baseClass,
      groupOrder,
      classKey,
      variantPriorityScore,
    };
  });

  // Sort by variant prefix, group order, class key, and full class name
  sortEntries.sort((a, b) => {
    // First by variant count (fewer variants first)
    const aVariantCount = a.variants.length;
    const bVariantCount = b.variants.length;
    if (aVariantCount !== bVariantCount) {
      return aVariantCount - bVariantCount;
    }

    // Then by variant priority score
    if (a.variantPriorityScore !== b.variantPriorityScore) {
      return a.variantPriorityScore - b.variantPriorityScore;
    }

    // Then by group order
    if (a.groupOrder !== b.groupOrder) {
      return a.groupOrder - b.groupOrder;
    }

    // Then by class key
    if (a.classKey !== b.classKey) {
      return a.classKey.localeCompare(b.classKey);
    }

    // Finally by the full original class name
    return a.original.localeCompare(b.original);
  });

  // Return the sorted classes with deduplicated variants
  return sortEntries.map((entry) => {
    // Reconstruct the class name with deduplicated variants
    if (entry.variants.length > 0) {
      return `${entry.variants.join(':')}:${entry.baseClass}`;
    }
    return entry.baseClass;
  });
}

/**
 * Transform a CSS rule to Tailwind classes
 * @param rule CSS rule to transform
 * @param ctx Matching context
 * @returns Transform result with classes, warnings, and coverage
 */
export function transformRule(rule: CssRule, ctx: MatchCtx): TransformResult {
  // Transform the declarations within the rule
  const result = transformDeclarations(rule.declarations, ctx);

  // Add selector information to the result if needed
  if (rule.selector !== '*' && rule.selector !== '') {
    result.warnings.push(
      `Selector '${rule.selector}' was converted but may need manual adjustment`
    );
  }

  return result;
}

/**
 * Transform CSS declarations to Tailwind classes
 * @param decls CSS declarations to transform
 * @param ctx Matching context
 * @returns Transform result with classes, warnings, and coverage
 */
export function transformDeclarations(decls: CssDeclaration[], ctx: MatchCtx): TransformResult {
  const allClasses: string[] = [];
  const warnings: string[] = [];
  let matched = 0;
  const total = decls.length;
  const matchedProps = new Set<string>();

  // Process each declaration
  for (const decl of decls) {
    const result = toTailwind(decl.prop, decl.value, ctx);

    if (result.classes && result.classes.length > 0) {
      // Apply variants if provided
      const classesWithVariants =
        decl.variants && decl.variants.length > 0
          ? withVariants(decl.variants, result.classes)
          : result.classes;

      allClasses.push(...classesWithVariants);
      matched++;
      matchedProps.add(decl.prop.toLowerCase());

      // Add warning if present
      if (result.warning) {
        warnings.push(result.warning);
      }
    } else {
      warnings.push(`Could not transform: ${decl.prop}: ${decl.value}`);
    }
  }

  // Deduplicate and sort classes
  const classes = sortClasses(allClasses);

  // Count non-arbitrary classes
  const nonArbitrary = countNonArbitraryClasses(classes);

  // Calculate category statistics
  const categoryStats = calculateCategoryStats(decls, matchedProps);

  // Aggregate and categorize warnings
  const { warnings: aggregatedWarnings, byCategory: warningsByCategory } =
    aggregateWarnings(warnings);

  // Calculate enhanced coverage
  const coverage = calculateCoverage(
    matched,
    total,
    nonArbitrary,
    categoryStats,
    warningsByCategory
  );

  return {
    classes,
    warnings: aggregatedWarnings,
    coverage,
  };
}

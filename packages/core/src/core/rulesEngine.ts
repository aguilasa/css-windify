/**
 * Rules engine for transforming CSS to Tailwind classes
 */
import { CssDeclaration, CssRule, MatchCtx, RuleHandler, TransformResult } from '../types';
import { calculateCoverage, aggregateWarnings, countNonArbitraryClasses, calculateCategoryStats } from './reporter';
import { arbitraryProperty } from './normalizers';
import { withVariants } from './variants';
import {
  // Layout matchers
  matchDisplay,
  matchPosition,
  matchInset,
  matchInsetShorthand,
  
  // Spacing matchers
  matchSpacing,
  
  // Color matchers
  matchColor,
  
  // Border matchers
  matchBorderWidth,
  matchBorderRadius,
  matchBorderShorthand,
  
  // Typography matchers
  matchTypography,
  
  // Background matchers
  matchBackgroundColor,
  matchBackgroundSize,
  matchBackgroundPosition,
  matchBackgroundImage,
  matchBackgroundShorthand,
  
  // Flexbox and Grid matchers
  matchFlexDirection,
  matchJustifyContent,
  matchAlignItems,
  matchGap,
  matchGridTemplateColumns,
  matchPlaceContent,
  matchPlaceItems,
  matchPlaceSelf,
  
  // Misc matchers
  matchOverflow,
  matchZIndex,
  matchOpacity
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
  'display': (value) => [matchDisplay(value)],
  'position': (value) => [matchPosition(value)],
  'top': (value, ctx) => matchInset('top', value, ctx),
  'right': (value, ctx) => matchInset('right', value, ctx),
  'bottom': (value, ctx) => matchInset('bottom', value, ctx),
  'left': (value, ctx) => matchInset('left', value, ctx),
  'inset': (value, ctx) => matchInsetShorthand(value, ctx),
  
  // Spacing properties
  'margin': (value, ctx) => {
    const result = matchSpacing('m', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  'margin-top': (value, ctx) => {
    const result = matchSpacing('mt', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  'margin-right': (value, ctx) => {
    const result = matchSpacing('mr', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  'margin-bottom': (value, ctx) => {
    const result = matchSpacing('mb', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  'margin-left': (value, ctx) => {
    const result = matchSpacing('ml', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  'padding': (value, ctx) => {
    const result = matchSpacing('p', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  'padding-top': (value, ctx) => {
    const result = matchSpacing('pt', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  'padding-right': (value, ctx) => {
    const result = matchSpacing('pr', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  'padding-bottom': (value, ctx) => {
    const result = matchSpacing('pb', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  'padding-left': (value, ctx) => {
    const result = matchSpacing('pl', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  
  // Sizing properties
  'width': (value, ctx) => {
    const result = matchSpacing('w', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  'height': (value, ctx) => {
    const result = matchSpacing('h', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  'min-width': (value, ctx) => {
    const result = matchSpacing('min-w', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  'min-height': (value, ctx) => {
    const result = matchSpacing('min-h', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  'max-width': (value, ctx) => {
    const result = matchSpacing('max-w', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  'max-height': (value, ctx) => {
    const result = matchSpacing('max-h', value, ctx);
    return result.warnings.length > 0 ? { classes: result.classes, warnings: result.warnings } : result.classes;
  },
  
  // Color properties
  'color': (value, ctx) => [matchColor('text', value, ctx)],
  'border-color': (value, ctx) => [matchColor('border', value, ctx)],
  
  // Border properties
  'border-width': (value) => [matchBorderWidth(value)],
  'border-radius': (value) => [matchBorderRadius(value)],
  
  // Typography properties
  'font-size': (value, ctx) => {
    const result = matchTypography('font-size', value, ctx);
    return result.warning ? { classes: [result.class], warnings: [result.warning] } : [result.class];
  },
  'line-height': (value, ctx) => {
    const result = matchTypography('line-height', value, ctx);
    return result.warning ? { classes: [result.class], warnings: [result.warning] } : [result.class];
  },
  'letter-spacing': (value, ctx) => {
    const result = matchTypography('letter-spacing', value, ctx);
    return result.warning ? { classes: [result.class], warnings: [result.warning] } : [result.class];
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
      'normal': 'font-normal',
      'bold': 'font-bold',
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
      'left': 'text-left',
      'center': 'text-center',
      'right': 'text-right',
      'justify': 'text-justify',
    };
    
    const normalizedValue = value.trim().toLowerCase();
    if (alignMap[normalizedValue]) {
      return [alignMap[normalizedValue]];
    }
    
    // Use arbitrary value if no match found
    return [arbitraryProperty('text-align', value)];
  },
  
  // Object properties
  'object-fit': (value) => {
    // Map object-fit values to Tailwind classes
    const fitMap: Record<string, string> = {
      'contain': 'object-contain',
      'cover': 'object-cover',
      'fill': 'object-fill',
      'none': 'object-none',
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
  'gap': (value, ctx) => [matchGap('', value, ctx)],
  'column-gap': (value, ctx) => [matchGap('x', value, ctx)],
  'row-gap': (value, ctx) => [matchGap('y', value, ctx)],
  'grid-template-columns': (value) => [matchGridTemplateColumns(value)],
  'place-content': (value) => [matchPlaceContent(value)],
  'place-items': (value) => [matchPlaceItems(value)],
  'place-self': (value) => [matchPlaceSelf(value)],
  
  // Background properties
  'background': (value, ctx) => matchBackgroundShorthand(value, ctx),
  'background-color': (value, ctx) => [matchBackgroundColor(value, ctx)],
  'background-size': (value) => [matchBackgroundSize(value)],
  'background-position': (value) => [matchBackgroundPosition(value)],
  'background-image': (value) => [matchBackgroundImage(value)],
  
  // Border properties
  'border': (value, ctx) => matchBorderShorthand(value, ctx),
  
  // Misc properties
  'overflow': (value) => [matchOverflow(value)],
  'overflow-x': (value) => [matchOverflow(value, 'x')],
  'overflow-y': (value) => [matchOverflow(value, 'y')],
  'z-index': (value) => [matchZIndex(value)],
  'opacity': (value) => [matchOpacity(value)],
};

/**
 * Convert a CSS property and value to Tailwind classes
 * @param prop CSS property
 * @param value CSS value
 * @param ctx Matching context
 * @returns Object with classes and warning information
 */
export function toTailwind(prop: string, value: string, ctx: MatchCtx): { classes: string[], warning: string | null } {
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
          warning: warnings.length > 0 ? warnings.join('; ') : null
        };
      }
      
      // If the result is an array of classes
      if (Array.isArray(result) && result.length > 0) {
        // Check if any class uses arbitrary values
        const hasArbitrary = result.some(cls => cls.includes('[') && cls.includes(']'));
        
        if (hasArbitrary) {
          return {
            classes: result,
            warning: `Used arbitrary value for '${prop}: ${value}'`
          };
        }
        
        return { classes: result, warning: null };
      }
    }
  }
  
  // Fallback: use arbitrary property
  const arbitraryClass = arbitraryProperty(prop, value);
  return {
    classes: [arbitraryClass],
    warning: `No direct Tailwind equivalent for '${prop}: ${value}', used arbitrary property`
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
 * Sort Tailwind classes by property group
 * @param classes Array of Tailwind classes
 * @returns Sorted array of classes
 */
function sortClasses(classes: string[]): string[] {
  // For now, just return the unique classes
  // In a more advanced implementation, we would sort by property group
  return [...new Set(classes)];
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
    result.warnings.push(`Selector '${rule.selector}' was converted but may need manual adjustment`);
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
      const classesWithVariants = decl.variants && decl.variants.length > 0
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
  const { warnings: aggregatedWarnings, byCategory: warningsByCategory } = aggregateWarnings(warnings);
  
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
    coverage
  };
}

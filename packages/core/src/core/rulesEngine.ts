/**
 * Rules engine for transforming CSS to Tailwind classes
 */
import { CssDeclaration, CssRule, MatchCtx, RuleHandler, TransformResult } from '../types';
import { calculateCoverage, aggregateWarnings } from './reporter';
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
  
  // Typography matchers
  matchTypography,
  
  // Flexbox and Grid matchers
  matchFlexDirection,
  matchJustifyContent,
  matchAlignItems,
  matchGap,
  matchGridTemplateColumns,
  matchPlaceContent,
  matchPlaceItems,
  matchPlaceSelf
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
  'margin': (value, ctx) => matchSpacing('m', value, ctx),
  'margin-top': (value, ctx) => matchSpacing('m' as any, value, ctx),
  'margin-right': (value, ctx) => matchSpacing('m' as any, value, ctx),
  'margin-bottom': (value, ctx) => matchSpacing('m' as any, value, ctx),
  'margin-left': (value, ctx) => matchSpacing('m' as any, value, ctx),
  'padding': (value, ctx) => matchSpacing('p', value, ctx),
  'padding-top': (value, ctx) => matchSpacing('p' as any, value, ctx),
  'padding-right': (value, ctx) => matchSpacing('p' as any, value, ctx),
  'padding-bottom': (value, ctx) => matchSpacing('p' as any, value, ctx),
  'padding-left': (value, ctx) => matchSpacing('p' as any, value, ctx),
  
  // Sizing properties
  'width': (value, ctx) => matchSpacing('w', value, ctx),
  'height': (value, ctx) => matchSpacing('h', value, ctx),
  'min-width': (value, ctx) => matchSpacing('w' as any, value, ctx),
  'min-height': (value, ctx) => matchSpacing('h' as any, value, ctx),
  'max-width': (value, ctx) => matchSpacing('w' as any, value, ctx),
  'max-height': (value, ctx) => matchSpacing('h' as any, value, ctx),
  
  // Color properties
  'color': (value, ctx) => [matchColor('text', value, ctx)],
  'background-color': (value, ctx) => [matchColor('bg', value, ctx)],
  'border-color': (value, ctx) => [matchColor('border', value, ctx)],
  
  // Border properties
  'border-width': (value) => [matchBorderWidth(value)],
  'border': (value) => [matchBorderWidth(value)], // Simplified - in reality would need to parse value
  'border-radius': (value) => [matchBorderRadius(value)],
  
  // Typography properties
  'font-size': (value, ctx) => [matchTypography('font-size', value, ctx)],
  'line-height': (value, ctx) => [matchTypography('line-height', value, ctx)],
  'letter-spacing': (value, ctx) => [matchTypography('letter-spacing', value, ctx)],
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
    const classes = handler(value, ctx);
    
    if (classes && classes.length > 0) {
      // Check if any class uses arbitrary values
      const hasArbitrary = classes.some(cls => cls.includes('[') && cls.includes(']'));
      
      if (hasArbitrary) {
        return {
          classes,
          warning: `Used arbitrary value for '${prop}: ${value}'`
        };
      }
      
      return { classes, warning: null };
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
  
  // Calculate coverage and aggregate warnings
  const coverage = calculateCoverage(matched, total);
  const aggregatedWarnings = aggregateWarnings(warnings);
  
  return {
    classes,
    warnings: aggregatedWarnings,
    coverage
  };
}

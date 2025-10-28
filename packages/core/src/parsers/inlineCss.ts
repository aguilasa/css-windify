/**
 * Parser for inline CSS styles
 */
import { CssDeclaration } from '../types';

/**
 * Parse an inline CSS style string into an array of CSS declarations
 *
 * @param style The inline CSS style string (e.g., "color: red; margin: 10px;")
 * @returns Array of CSS declarations
 */
export function parseInlineCss(style: string): CssDeclaration[] {
  if (!style) {
    return [];
  }

  // Split the style string by semicolons
  const declarations: CssDeclaration[] = [];
  const parts = style.split(';');

  for (const part of parts) {
    // Skip empty parts
    const trimmedPart = part.trim();
    if (!trimmedPart) {
      continue;
    }

    // Split each part by the first colon
    const colonIndex = trimmedPart.indexOf(':');
    if (colonIndex === -1) {
      continue; // Skip invalid parts without a colon
    }

    const prop = trimmedPart.substring(0, colonIndex).trim();
    const value = trimmedPart.substring(colonIndex + 1).trim();

    // Skip if property or value is empty
    if (!prop || !value) {
      continue;
    }

    declarations.push({ prop, value });
  }

  return declarations;
}

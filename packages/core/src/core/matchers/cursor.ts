/**
 * Cursor matcher for Tailwind CSS
 */

const cursorMap: Record<string, string> = {
  auto: 'cursor-auto',
  default: 'cursor-default',
  pointer: 'cursor-pointer',
  wait: 'cursor-wait',
  text: 'cursor-text',
  move: 'cursor-move',
  help: 'cursor-help',
  'not-allowed': 'cursor-not-allowed',
  none: 'cursor-none',
  'context-menu': 'cursor-context-menu',
  progress: 'cursor-progress',
  cell: 'cursor-cell',
  crosshair: 'cursor-crosshair',
  'vertical-text': 'cursor-vertical-text',
  alias: 'cursor-alias',
  copy: 'cursor-copy',
  'no-drop': 'cursor-no-drop',
  grab: 'cursor-grab',
  grabbing: 'cursor-grabbing',
  'all-scroll': 'cursor-all-scroll',
  'col-resize': 'cursor-col-resize',
  'row-resize': 'cursor-row-resize',
  'n-resize': 'cursor-n-resize',
  'e-resize': 'cursor-e-resize',
  's-resize': 'cursor-s-resize',
  'w-resize': 'cursor-w-resize',
  'ne-resize': 'cursor-ne-resize',
  'nw-resize': 'cursor-nw-resize',
  'se-resize': 'cursor-se-resize',
  'sw-resize': 'cursor-sw-resize',
  'ew-resize': 'cursor-ew-resize',
  'ns-resize': 'cursor-ns-resize',
  'nesw-resize': 'cursor-nesw-resize',
  'nwse-resize': 'cursor-nwse-resize',
  'zoom-in': 'cursor-zoom-in',
  'zoom-out': 'cursor-zoom-out',
};

export function matchCursor(value: string): { classes: string[]; warnings: string[] } {
  const classes: string[] = [];
  const warnings: string[] = [];

  const twClass = cursorMap[value];
  if (twClass) {
    classes.push(twClass);
  } else {
    // Use arbitrary value for unknown cursor values
    classes.push(`[cursor:${value}]`);
    warnings.push(`Used arbitrary value for 'cursor: ${value}'`);
  }

  return { classes, warnings };
}

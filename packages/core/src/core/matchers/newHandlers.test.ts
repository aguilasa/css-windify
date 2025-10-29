/**
 * Tests for the new handlers added to the matchers
 */
import { describe, expect, it } from 'vitest';
import {
  // Flex and Grid
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
} from './flexGrid';

import {
  // Background
  matchBackgroundRepeat,
  matchBackgroundAttachment,
  matchBackgroundOrigin,
  matchBackgroundClip,
} from './backgrounds';

import {
  // Border
  matchBorderStyle,
} from './borders';

import {
  // Text decoration
  matchTextDecoration,
  matchTextDecorationStyle,
  matchTextDecorationThickness,
} from './typography';

const mockCtx = {
  theme: {
    spacing: {
      '0': '0px',
      '1': '0.25rem',
      '2': '0.5rem',
      '4': '1rem',
      '8': '2rem',
    },
  },
  version: 'v3' as const,
  opts: {
    strict: false,
    approximate: true,
    thresholds: {
      spacingPx: 2,
      fontPx: 1,
      radiiPx: 2,
    },
    screens: {
      sm: 640,
      md: 768,
      lg: 1024,
    },
  },
};

describe('Flex and Grid Handlers', () => {
  describe('matchFlexBasis', () => {
    it('should handle common flex-basis values', () => {
      expect(matchFlexBasis('auto', mockCtx)).toBe('basis-auto');
      expect(matchFlexBasis('0', mockCtx)).toBe('basis-0');
      expect(matchFlexBasis('100%', mockCtx)).toBe('basis-full');
      expect(matchFlexBasis('50%', mockCtx)).toBe('basis-1/2');
      expect(matchFlexBasis('33.333333%', mockCtx)).toBe('basis-1/3');
      expect(matchFlexBasis('66.666667%', mockCtx)).toBe('basis-2/3');
      expect(matchFlexBasis('25%', mockCtx)).toBe('basis-1/4');
    });

    it('should handle arbitrary values', () => {
      expect(matchFlexBasis('300px', mockCtx)).toBe('basis-[300px]');
      expect(matchFlexBasis('calc(100% - 20px)', mockCtx)).toBe('basis-[calc(100% - 20px)]');
    });
  });

  describe('matchFlexGrow', () => {
    it('should handle flex-grow values', () => {
      expect(matchFlexGrow('0')).toBe('grow-0');
      expect(matchFlexGrow('1')).toBe('grow');
      expect(matchFlexGrow('2')).toBe('grow-[2]');
    });
  });

  describe('matchFlexShrink', () => {
    it('should handle flex-shrink values', () => {
      expect(matchFlexShrink('0')).toBe('shrink-0');
      expect(matchFlexShrink('1')).toBe('shrink');
      expect(matchFlexShrink('2')).toBe('shrink-[2]');
    });
  });

  describe('matchGridAutoFlow', () => {
    it('should handle grid-auto-flow values', () => {
      expect(matchGridAutoFlow('row')).toBe('grid-flow-row');
      expect(matchGridAutoFlow('column')).toBe('grid-flow-col');
      expect(matchGridAutoFlow('dense')).toBe('grid-flow-dense');
      expect(matchGridAutoFlow('row dense')).toBe('grid-flow-row-dense');
      expect(matchGridAutoFlow('column dense')).toBe('grid-flow-col-dense');
      expect(matchGridAutoFlow('col')).toBe('grid-flow-col');
      expect(matchGridAutoFlow('col dense')).toBe('grid-flow-col-dense');
    });

    it('should handle arbitrary values', () => {
      expect(matchGridAutoFlow('custom')).toBe('grid-flow-[custom]');
    });
  });

  describe('matchGridColumn', () => {
    it('should handle span values', () => {
      expect(matchGridColumn('span 2')).toBe('col-span-2');
      expect(matchGridColumn('span 12')).toBe('col-span-12');
      expect(matchGridColumn('span 13')).toBe('col-span-[13]');
    });

    it('should handle start/end values', () => {
      const result = matchGridColumn('2 / 4');
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result).toContain('col-start-2');
        expect(result).toContain('col-end-4');
      }
    });

    it('should handle span in end position', () => {
      const result = matchGridColumn('2 / span 3');
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result).toContain('col-start-2');
        expect(result).toContain('col-span-3');
      }
    });
  });

  describe('matchGridRow', () => {
    it('should handle span values', () => {
      expect(matchGridRow('span 2')).toBe('row-span-2');
      expect(matchGridRow('span 6')).toBe('row-span-6');
      expect(matchGridRow('span 7')).toBe('row-span-[7]');
    });

    it('should handle start/end values', () => {
      const result = matchGridRow('2 / 4');
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result).toContain('row-start-2');
        expect(result).toContain('row-end-4');
      }
    });
  });

  describe('Grid Start/End Handlers', () => {
    it('should handle grid-column-start values', () => {
      expect(matchGridColumnStart('1')).toBe('col-start-1');
      expect(matchGridColumnStart('13')).toBe('col-start-13');
      expect(matchGridColumnStart('14')).toBe('col-start-[14]');
      expect(matchGridColumnStart('auto')).toBe('col-start-auto');
    });

    it('should handle grid-column-end values', () => {
      expect(matchGridColumnEnd('1')).toBe('col-end-1');
      expect(matchGridColumnEnd('13')).toBe('col-end-13');
      expect(matchGridColumnEnd('14')).toBe('col-end-[14]');
      expect(matchGridColumnEnd('auto')).toBe('col-end-auto');
    });

    it('should handle grid-row-start values', () => {
      expect(matchGridRowStart('1')).toBe('row-start-1');
      expect(matchGridRowStart('7')).toBe('row-start-7');
      expect(matchGridRowStart('8')).toBe('row-start-[8]');
      expect(matchGridRowStart('auto')).toBe('row-start-auto');
    });

    it('should handle grid-row-end values', () => {
      expect(matchGridRowEnd('1')).toBe('row-end-1');
      expect(matchGridRowEnd('7')).toBe('row-end-7');
      expect(matchGridRowEnd('8')).toBe('row-end-[8]');
      expect(matchGridRowEnd('auto')).toBe('row-end-auto');
    });
  });
});

describe('Background Handlers', () => {
  describe('matchBackgroundRepeat', () => {
    it('should handle background-repeat values', () => {
      expect(matchBackgroundRepeat('repeat')).toBe('bg-repeat');
      expect(matchBackgroundRepeat('no-repeat')).toBe('bg-no-repeat');
      expect(matchBackgroundRepeat('repeat-x')).toBe('bg-repeat-x');
      expect(matchBackgroundRepeat('repeat-y')).toBe('bg-repeat-y');
      expect(matchBackgroundRepeat('round')).toBe('bg-repeat-round');
      expect(matchBackgroundRepeat('space')).toBe('bg-repeat-space');
    });

    it('should handle arbitrary values', () => {
      expect(matchBackgroundRepeat('inherit')).toBe('[background-repeat:inherit]');
    });
  });

  describe('matchBackgroundAttachment', () => {
    it('should handle background-attachment values', () => {
      expect(matchBackgroundAttachment('fixed')).toBe('bg-fixed');
      expect(matchBackgroundAttachment('local')).toBe('bg-local');
      expect(matchBackgroundAttachment('scroll')).toBe('bg-scroll');
    });

    it('should handle arbitrary values', () => {
      expect(matchBackgroundAttachment('inherit')).toBe('[background-attachment:inherit]');
    });
  });

  describe('matchBackgroundOrigin', () => {
    it('should handle background-origin values', () => {
      expect(matchBackgroundOrigin('border-box')).toBe('bg-origin-border');
      expect(matchBackgroundOrigin('padding-box')).toBe('bg-origin-padding');
      expect(matchBackgroundOrigin('content-box')).toBe('bg-origin-content');
    });

    it('should handle arbitrary values', () => {
      expect(matchBackgroundOrigin('inherit')).toBe('[background-origin:inherit]');
    });
  });

  describe('matchBackgroundClip', () => {
    it('should handle background-clip values', () => {
      expect(matchBackgroundClip('border-box')).toBe('bg-clip-border');
      expect(matchBackgroundClip('padding-box')).toBe('bg-clip-padding');
      expect(matchBackgroundClip('content-box')).toBe('bg-clip-content');
      expect(matchBackgroundClip('text')).toBe('bg-clip-text');
    });

    it('should handle arbitrary values', () => {
      expect(matchBackgroundClip('inherit')).toBe('[background-clip:inherit]');
    });
  });
});

describe('Border Handlers', () => {
  describe('matchBorderStyle', () => {
    it('should handle border-style values', () => {
      expect(matchBorderStyle('solid')).toBe('border-solid');
      expect(matchBorderStyle('dashed')).toBe('border-dashed');
      expect(matchBorderStyle('dotted')).toBe('border-dotted');
      expect(matchBorderStyle('double')).toBe('border-double');
      expect(matchBorderStyle('none')).toBe('border-none');
    });

    it('should handle arbitrary values', () => {
      expect(matchBorderStyle('groove')).toBe('[border-style:groove]');
      expect(matchBorderStyle('ridge')).toBe('[border-style:ridge]');
      expect(matchBorderStyle('inset')).toBe('[border-style:inset]');
      expect(matchBorderStyle('outset')).toBe('[border-style:outset]');
    });
  });
});

describe('Text Decoration Handlers', () => {
  describe('matchTextDecoration', () => {
    it('should handle text-decoration values', () => {
      expect(matchTextDecoration('underline')).toBe('underline');
      expect(matchTextDecoration('line-through')).toBe('line-through');
      expect(matchTextDecoration('none')).toBe('no-underline');
    });

    it('should handle multiple decorations', () => {
      const result = matchTextDecoration('underline line-through');
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result).toContain('underline');
        expect(result).toContain('line-through');
      }
    });

    it('should handle arbitrary values', () => {
      expect(matchTextDecoration('overline')).toBe('[text-decoration:overline]');
    });
  });

  describe('matchTextDecorationStyle', () => {
    it('should handle text-decoration-style values', () => {
      expect(matchTextDecorationStyle('solid')).toBe('decoration-solid');
      expect(matchTextDecorationStyle('double')).toBe('decoration-double');
      expect(matchTextDecorationStyle('dotted')).toBe('decoration-dotted');
      expect(matchTextDecorationStyle('dashed')).toBe('decoration-dashed');
      expect(matchTextDecorationStyle('wavy')).toBe('decoration-wavy');
    });

    it('should handle arbitrary values', () => {
      expect(matchTextDecorationStyle('inherit')).toBe('[text-decoration-style:inherit]');
    });
  });

  describe('matchTextDecorationThickness', () => {
    it('should handle text-decoration-thickness values', () => {
      expect(matchTextDecorationThickness('auto')).toBe('decoration-auto');
      expect(matchTextDecorationThickness('from-font')).toBe('decoration-from-font');
      expect(matchTextDecorationThickness('0')).toBe('decoration-0');
      expect(matchTextDecorationThickness('1px')).toBe('decoration-1');
      expect(matchTextDecorationThickness('2px')).toBe('decoration-2');
      expect(matchTextDecorationThickness('4px')).toBe('decoration-4');
      expect(matchTextDecorationThickness('8px')).toBe('decoration-8');
    });

    it('should handle arbitrary values', () => {
      expect(matchTextDecorationThickness('3px')).toBe('decoration-[3px]');
    });
  });
});

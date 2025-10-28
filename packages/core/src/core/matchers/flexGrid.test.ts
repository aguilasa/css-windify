import { describe, it, expect } from 'vitest';
import { 
  matchFlexDirection,
  matchJustifyContent,
  matchAlignItems,
  matchGap,
  matchGridTemplateColumns,
  matchPlaceContent,
  matchPlaceItems,
  matchPlaceSelf
} from './flexGrid';
import { MatchCtx } from '../../types';

describe('flexGrid matcher', () => {
  // Mock theme for testing
  const mockTheme = {
    spacing: {
      '0': '0px',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '8': '2rem',
      'px': '1px',
    }
  };

  const ctx: MatchCtx = {
    theme: mockTheme,
    opts: {
      strict: false,
      approximate: false
    }
  };

  describe('flex direction', () => {
    it('should match predefined flex directions', () => {
      expect(matchFlexDirection('row')).toBe('flex-row');
      expect(matchFlexDirection('row-reverse')).toBe('flex-row-reverse');
      expect(matchFlexDirection('column')).toBe('flex-col');
      expect(matchFlexDirection('column-reverse')).toBe('flex-col-reverse');
      expect(matchFlexDirection('col')).toBe('flex-col');
      expect(matchFlexDirection('col-reverse')).toBe('flex-col-reverse');
    });

    it('should normalize values before matching', () => {
      expect(matchFlexDirection('  row  ')).toBe('flex-row');
      expect(matchFlexDirection('COLUMN')).toBe('flex-col');
    });

    it('should use arbitrary values for non-predefined directions', () => {
      expect(matchFlexDirection('inherit')).toBe('flex-[inherit]');
      expect(matchFlexDirection('initial')).toBe('flex-[initial]');
    });

    it('should handle empty or invalid values', () => {
      expect(matchFlexDirection('')).toBe('');
      expect(matchFlexDirection(null as unknown as string)).toBe('');
    });
  });

  describe('justify content', () => {
    it('should match predefined justify content values', () => {
      expect(matchJustifyContent('flex-start')).toBe('justify-start');
      expect(matchJustifyContent('start')).toBe('justify-start');
      expect(matchJustifyContent('flex-end')).toBe('justify-end');
      expect(matchJustifyContent('end')).toBe('justify-end');
      expect(matchJustifyContent('center')).toBe('justify-center');
      expect(matchJustifyContent('space-between')).toBe('justify-between');
      expect(matchJustifyContent('space-around')).toBe('justify-around');
      expect(matchJustifyContent('space-evenly')).toBe('justify-evenly');
      expect(matchJustifyContent('stretch')).toBe('justify-stretch');
    });

    it('should normalize values before matching', () => {
      expect(matchJustifyContent('  center  ')).toBe('justify-center');
      expect(matchJustifyContent('SPACE-BETWEEN')).toBe('justify-between');
    });

    it('should use arbitrary values for non-predefined justify content', () => {
      expect(matchJustifyContent('inherit')).toBe('justify-[inherit]');
      expect(matchJustifyContent('safe center')).toBe('justify-[safe center]');
    });
  });

  describe('align items', () => {
    it('should match predefined align items values', () => {
      expect(matchAlignItems('flex-start')).toBe('items-start');
      expect(matchAlignItems('start')).toBe('items-start');
      expect(matchAlignItems('flex-end')).toBe('items-end');
      expect(matchAlignItems('end')).toBe('items-end');
      expect(matchAlignItems('center')).toBe('items-center');
      expect(matchAlignItems('baseline')).toBe('items-baseline');
      expect(matchAlignItems('stretch')).toBe('items-stretch');
    });

    it('should normalize values before matching', () => {
      expect(matchAlignItems('  center  ')).toBe('items-center');
      expect(matchAlignItems('BASELINE')).toBe('items-baseline');
    });

    it('should use arbitrary values for non-predefined align items', () => {
      expect(matchAlignItems('inherit')).toBe('items-[inherit]');
      expect(matchAlignItems('safe center')).toBe('items-[safe center]');
    });
  });

  describe('gap', () => {
    it('should match gap values from theme', () => {
      expect(matchGap('', '1rem', ctx)).toBe('gap-4');
      expect(matchGap('x', '0.5rem', ctx)).toBe('gap-x-2');
      expect(matchGap('y', '0.75rem', ctx)).toBe('gap-y-3');
    });

    it('should match the specific acceptance criteria', () => {
      // Acceptance criteria: gap: 12px vira gap-3 se token existir, senão gap-[12px]
      expect(matchGap('', '0.75rem', ctx)).toBe('gap-3'); // 0.75rem maps to 3 in the theme
      expect(matchGap('', '12px', ctx)).toBe('gap-[12px]'); // 12px doesn't exist in theme
    });

    it('should use arbitrary values for non-theme gap values', () => {
      expect(matchGap('', '15px', ctx)).toBe('gap-[15px]');
      expect(matchGap('x', '3rem', ctx)).toBe('gap-x-[3rem]');
      expect(matchGap('y', '25%', ctx)).toBe('gap-y-[25%]');
    });
  });

  describe('grid template columns', () => {
    it('should match the specific acceptance criteria', () => {
      // Acceptance criteria: grid-template-columns: repeat(3, minmax(0, 1fr)) → grid-cols-3
      expect(matchGridTemplateColumns('repeat(3, minmax(0, 1fr))')).toBe('grid-cols-3');
    });

    it('should match repeat patterns with different numbers', () => {
      expect(matchGridTemplateColumns('repeat(1, minmax(0, 1fr))')).toBe('grid-cols-1');
      expect(matchGridTemplateColumns('repeat(2, minmax(0, 1fr))')).toBe('grid-cols-2');
      expect(matchGridTemplateColumns('repeat(12, minmax(0, 1fr))')).toBe('grid-cols-12');
    });

    it('should match simple integer values', () => {
      expect(matchGridTemplateColumns('3')).toBe('grid-cols-3');
      expect(matchGridTemplateColumns('12')).toBe('grid-cols-12');
    });

    it('should normalize values before matching', () => {
      expect(matchGridTemplateColumns('  repeat(3, minmax(0, 1fr))  ')).toBe('grid-cols-3');
      expect(matchGridTemplateColumns('repeat( 4 , minmax( 0 , 1fr ) )')).toBe('grid-cols-4');
    });

    it('should use arbitrary values for complex grid templates', () => {
      expect(matchGridTemplateColumns('1fr 2fr 1fr')).toBe('grid-cols-[1fr 2fr 1fr]');
      expect(matchGridTemplateColumns('repeat(2, 100px)')).toBe('grid-cols-[repeat(2, 100px)]');
      expect(matchGridTemplateColumns('minmax(100px, 1fr) 3fr')).toBe('grid-cols-[minmax(100px, 1fr) 3fr]');
    });
  });

  describe('place content', () => {
    it('should match predefined place content values', () => {
      expect(matchPlaceContent('center')).toBe('place-content-center');
      expect(matchPlaceContent('start')).toBe('place-content-start');
      expect(matchPlaceContent('end')).toBe('place-content-end');
      expect(matchPlaceContent('space-between')).toBe('place-content-between');
      expect(matchPlaceContent('space-around')).toBe('place-content-around');
      expect(matchPlaceContent('space-evenly')).toBe('place-content-evenly');
      expect(matchPlaceContent('stretch')).toBe('place-content-stretch');
    });

    it('should normalize values before matching', () => {
      expect(matchPlaceContent('  center  ')).toBe('place-content-center');
      expect(matchPlaceContent('SPACE-BETWEEN')).toBe('place-content-between');
    });

    it('should use arbitrary values for non-predefined place content', () => {
      expect(matchPlaceContent('inherit')).toBe('place-content-[inherit]');
      expect(matchPlaceContent('safe center')).toBe('place-content-[safe center]');
    });
  });

  describe('place items', () => {
    it('should match predefined place items values', () => {
      expect(matchPlaceItems('start')).toBe('place-items-start');
      expect(matchPlaceItems('end')).toBe('place-items-end');
      expect(matchPlaceItems('center')).toBe('place-items-center');
      expect(matchPlaceItems('stretch')).toBe('place-items-stretch');
    });

    it('should normalize values before matching', () => {
      expect(matchPlaceItems('  center  ')).toBe('place-items-center');
      expect(matchPlaceItems('STRETCH')).toBe('place-items-stretch');
    });

    it('should use arbitrary values for non-predefined place items', () => {
      expect(matchPlaceItems('inherit')).toBe('place-items-[inherit]');
      expect(matchPlaceItems('baseline')).toBe('place-items-[baseline]');
    });
  });

  describe('place self', () => {
    it('should match predefined place self values', () => {
      expect(matchPlaceSelf('auto')).toBe('place-self-auto');
      expect(matchPlaceSelf('start')).toBe('place-self-start');
      expect(matchPlaceSelf('end')).toBe('place-self-end');
      expect(matchPlaceSelf('center')).toBe('place-self-center');
      expect(matchPlaceSelf('stretch')).toBe('place-self-stretch');
    });

    it('should normalize values before matching', () => {
      expect(matchPlaceSelf('  center  ')).toBe('place-self-center');
      expect(matchPlaceSelf('AUTO')).toBe('place-self-auto');
    });

    it('should use arbitrary values for non-predefined place self', () => {
      expect(matchPlaceSelf('inherit')).toBe('place-self-[inherit]');
      expect(matchPlaceSelf('baseline')).toBe('place-self-[baseline]');
    });
  });
});

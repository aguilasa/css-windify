import { describe, it, expect } from 'vitest';
import {
  matchOverflow,
  matchZIndex,
  matchOpacity,
  matchBoxShadow,
  matchFilter,
  matchMixBlendMode,
  matchIsolation,
} from './misc';

describe('misc matchers', () => {
  describe('overflow', () => {
    it('should match predefined overflow values', () => {
      expect(matchOverflow('visible')).toBe('overflow-visible');
      expect(matchOverflow('hidden')).toBe('overflow-hidden');
      expect(matchOverflow('scroll')).toBe('overflow-scroll');
      expect(matchOverflow('auto')).toBe('overflow-auto');
    });

    it('should handle overflow-x and overflow-y', () => {
      expect(matchOverflow('hidden', 'x')).toBe('overflow-x-hidden');
      expect(matchOverflow('scroll', 'y')).toBe('overflow-y-scroll');
    });

    it('should normalize values before matching', () => {
      expect(matchOverflow('  hidden  ')).toBe('overflow-hidden');
      expect(matchOverflow('SCROLL')).toBe('overflow-scroll');
    });

    it('should use arbitrary values for non-predefined overflow', () => {
      expect(matchOverflow('inherit')).toBe('overflow-[inherit]');
      expect(matchOverflow('clip')).toBe('overflow-[clip]');
    });

    it('should handle empty or invalid values', () => {
      expect(matchOverflow('')).toBe('');
      expect(matchOverflow(null as unknown as string)).toBe('');
    });
  });

  describe('z-index', () => {
    it('should match predefined z-index values', () => {
      expect(matchZIndex('0')).toBe('z-0');
      expect(matchZIndex('10')).toBe('z-10');
      expect(matchZIndex('20')).toBe('z-20');
      expect(matchZIndex('30')).toBe('z-30');
      expect(matchZIndex('40')).toBe('z-40');
      expect(matchZIndex('50')).toBe('z-50');
      expect(matchZIndex('auto')).toBe('z-auto');
    });

    it('should normalize values before matching', () => {
      expect(matchZIndex('  10  ')).toBe('z-10');
      expect(matchZIndex('AUTO')).toBe('z-auto');
    });

    it('should use arbitrary values for non-predefined z-index', () => {
      expect(matchZIndex('15')).toBe('z-[15]');
      expect(matchZIndex('100')).toBe('z-[100]');
      expect(matchZIndex('-1')).toBe('z-[-1]');
    });

    it('should handle empty or invalid values', () => {
      expect(matchZIndex('')).toBe('');
      expect(matchZIndex(null as unknown as string)).toBe('');
    });
  });

  describe('opacity', () => {
    it('should match percentage values', () => {
      expect(matchOpacity('0%')).toBe('opacity-0');
      expect(matchOpacity('50%')).toBe('opacity-50');
      expect(matchOpacity('100%')).toBe('opacity-100');
    });

    it('should match decimal values', () => {
      expect(matchOpacity('0')).toBe('opacity-0');
      expect(matchOpacity('0.5')).toBe('opacity-50');
      expect(matchOpacity('1')).toBe('opacity-100');
    });

    it('should normalize values before matching', () => {
      expect(matchOpacity('  50%  ')).toBe('opacity-50');
      expect(matchOpacity('0.75')).toBe('opacity-75');
    });

    it('should use arbitrary values for non-standard opacity', () => {
      expect(matchOpacity('1.5')).toBe('opacity-[1.5]');
      expect(matchOpacity('inherit')).toBe('opacity-[inherit]');
    });

    it('should handle empty or invalid values', () => {
      expect(matchOpacity('')).toBe('');
      expect(matchOpacity(null as unknown as string)).toBe('');
    });
  });

  describe('box-shadow', () => {
    it('should match "none" to shadow-none', () => {
      const result = matchBoxShadow('none');
      expect(result.class).toBe('shadow-none');
      expect(result.warning).toBeUndefined();
    });

    it('should match shadow-sm token', () => {
      const result = matchBoxShadow('0 1px 2px 0 rgb(0 0 0 / 0.05)');
      expect(result.class).toBe('shadow-sm');
      expect(result.warning).toBeUndefined();
    });

    it('should match shadow (default) token', () => {
      const result = matchBoxShadow(
        '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
      );
      expect(result.class).toBe('shadow');
      expect(result.warning).toBeUndefined();
    });

    it('should match shadow-md token', () => {
      const result = matchBoxShadow(
        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
      );
      expect(result.class).toBe('shadow-md');
      expect(result.warning).toBeUndefined();
    });

    it('should match shadow-lg token', () => {
      const result = matchBoxShadow(
        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
      );
      expect(result.class).toBe('shadow-lg');
      expect(result.warning).toBeUndefined();
    });

    it('should match shadow-xl token', () => {
      const result = matchBoxShadow(
        '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      );
      expect(result.class).toBe('shadow-xl');
      expect(result.warning).toBeUndefined();
    });

    it('should match shadow-2xl token', () => {
      const result = matchBoxShadow('0 25px 50px -12px rgb(0 0 0 / 0.25)');
      expect(result.class).toBe('shadow-2xl');
      expect(result.warning).toBeUndefined();
    });

    it('should match rgba format', () => {
      const result = matchBoxShadow('0 1px 2px 0 rgba(0, 0, 0, 0.05)');
      expect(result.class).toBe('shadow-sm');
      expect(result.warning).toBeUndefined();
    });

    it('should normalize spaces and match', () => {
      const result = matchBoxShadow('0  1px  2px  0  rgb(0  0  0  /  0.05)');
      expect(result.class).toBe('shadow-sm');
      expect(result.warning).toBeUndefined();
    });

    it('should use arbitrary value for custom shadows', () => {
      const result = matchBoxShadow('0 0 10px red');
      expect(result.class).toBe('shadow-[0 0 10px red]');
      expect(result.warning).toContain('No exact Tailwind token');
    });

    it('should use arbitrary value for non-standard shadows', () => {
      const result = matchBoxShadow('inset 0 2px 4px rgba(0,0,0,0.1)');
      expect(result.class).toBe('shadow-[inset 0 2px 4px rgba(0,0,0,0.1)]');
      expect(result.warning).toContain('No exact Tailwind token');
    });

    it('should handle empty value', () => {
      const result = matchBoxShadow('');
      expect(result.class).toBe('');
      expect(result.warning).toBeUndefined();
    });

    it('should normalize case', () => {
      const result = matchBoxShadow('NONE');
      expect(result.class).toBe('shadow-none');
      expect(result.warning).toBeUndefined();
    });

    it('should handle complex multi-shadow values', () => {
      const result = matchBoxShadow('0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)');
      expect(result.class).toBe('shadow');
      expect(result.warning).toBeUndefined();
    });
  });

  describe('filter', () => {
    describe('blur', () => {
      it('should match predefined blur values', () => {
        expect(matchFilter('blur(4px)').classes).toEqual(['blur-sm']);
        expect(matchFilter('blur(8px)').classes).toEqual(['blur']);
        expect(matchFilter('blur(12px)').classes).toEqual(['blur-md']);
        expect(matchFilter('blur(16px)').classes).toEqual(['blur-lg']);
        expect(matchFilter('blur(24px)').classes).toEqual(['blur-xl']);
        expect(matchFilter('blur(40px)').classes).toEqual(['blur-2xl']);
        expect(matchFilter('blur(64px)').classes).toEqual(['blur-3xl']);
      });

      it('should match blur-none', () => {
        expect(matchFilter('blur(0)').classes).toEqual(['blur-none']);
        expect(matchFilter('blur(0px)').classes).toEqual(['blur-none']);
      });

      it('should use arbitrary for custom blur values', () => {
        const result = matchFilter('blur(5px)');
        expect(result.classes).toEqual(['blur-[5px]']);
      });
    });

    describe('brightness', () => {
      it('should match predefined brightness values', () => {
        expect(matchFilter('brightness(0)').classes).toEqual(['brightness-0']);
        expect(matchFilter('brightness(0.5)').classes).toEqual(['brightness-50']);
        expect(matchFilter('brightness(0.75)').classes).toEqual(['brightness-75']);
        expect(matchFilter('brightness(1)').classes).toEqual(['brightness-100']);
        expect(matchFilter('brightness(1.5)').classes).toEqual(['brightness-150']);
        expect(matchFilter('brightness(2)').classes).toEqual(['brightness-200']);
      });

      it('should convert percentage to decimal', () => {
        expect(matchFilter('brightness(50%)').classes).toEqual(['brightness-50']);
        expect(matchFilter('brightness(100%)').classes).toEqual(['brightness-100']);
        expect(matchFilter('brightness(150%)').classes).toEqual(['brightness-150']);
      });

      it('should use arbitrary for custom brightness values', () => {
        const result = matchFilter('brightness(0.85)');
        expect(result.classes).toEqual(['brightness-[0.85]']);
      });
    });

    describe('contrast', () => {
      it('should match predefined contrast values', () => {
        expect(matchFilter('contrast(0)').classes).toEqual(['contrast-0']);
        expect(matchFilter('contrast(0.5)').classes).toEqual(['contrast-50']);
        expect(matchFilter('contrast(1)').classes).toEqual(['contrast-100']);
        expect(matchFilter('contrast(1.5)').classes).toEqual(['contrast-150']);
      });

      it('should convert percentage to decimal', () => {
        expect(matchFilter('contrast(100%)').classes).toEqual(['contrast-100']);
        expect(matchFilter('contrast(150%)').classes).toEqual(['contrast-150']);
      });
    });

    describe('grayscale', () => {
      it('should match predefined grayscale values', () => {
        expect(matchFilter('grayscale(0)').classes).toEqual(['grayscale-0']);
        expect(matchFilter('grayscale(1)').classes).toEqual(['grayscale']);
      });

      it('should convert percentage to decimal', () => {
        expect(matchFilter('grayscale(100%)').classes).toEqual(['grayscale']);
        expect(matchFilter('grayscale(0%)').classes).toEqual(['grayscale-0']);
      });
    });

    describe('hue-rotate', () => {
      it('should match predefined hue-rotate values', () => {
        expect(matchFilter('hue-rotate(0deg)').classes).toEqual(['hue-rotate-0']);
        expect(matchFilter('hue-rotate(15deg)').classes).toEqual(['hue-rotate-15']);
        expect(matchFilter('hue-rotate(30deg)').classes).toEqual(['hue-rotate-30']);
        expect(matchFilter('hue-rotate(90deg)').classes).toEqual(['hue-rotate-90']);
        expect(matchFilter('hue-rotate(180deg)').classes).toEqual(['hue-rotate-180']);
      });

      it('should use arbitrary for custom angles', () => {
        const result = matchFilter('hue-rotate(45deg)');
        expect(result.classes).toEqual(['hue-rotate-[45deg]']);
      });
    });

    describe('invert', () => {
      it('should match predefined invert values', () => {
        expect(matchFilter('invert(0)').classes).toEqual(['invert-0']);
        expect(matchFilter('invert(1)').classes).toEqual(['invert']);
      });

      it('should convert percentage to decimal', () => {
        expect(matchFilter('invert(100%)').classes).toEqual(['invert']);
      });
    });

    describe('saturate', () => {
      it('should match predefined saturate values', () => {
        expect(matchFilter('saturate(0)').classes).toEqual(['saturate-0']);
        expect(matchFilter('saturate(0.5)').classes).toEqual(['saturate-50']);
        expect(matchFilter('saturate(1)').classes).toEqual(['saturate-100']);
        expect(matchFilter('saturate(1.5)').classes).toEqual(['saturate-150']);
        expect(matchFilter('saturate(2)').classes).toEqual(['saturate-200']);
      });
    });

    describe('sepia', () => {
      it('should match predefined sepia values', () => {
        expect(matchFilter('sepia(0)').classes).toEqual(['sepia-0']);
        expect(matchFilter('sepia(1)').classes).toEqual(['sepia']);
      });

      it('should convert percentage to decimal', () => {
        expect(matchFilter('sepia(100%)').classes).toEqual(['sepia']);
      });
    });

    describe('multiple filters', () => {
      it('should handle multiple filter functions', () => {
        const result = matchFilter('blur(4px) brightness(1.5)');
        expect(result.classes).toEqual(['blur-sm', 'brightness-150']);
        expect(result.warning).toBeUndefined();
      });

      it('should handle three or more filters', () => {
        const result = matchFilter('blur(8px) brightness(1.5) contrast(1.25)');
        expect(result.classes).toEqual(['blur', 'brightness-150', 'contrast-125']);
        expect(result.warning).toBeUndefined();
      });

      it('should handle mix of matched and arbitrary filters', () => {
        const result = matchFilter('blur(8px) brightness(0.85)');
        expect(result.classes).toContain('blur');
        expect(result.classes).toContain('brightness-[0.85]');
      });
    });

    describe('special cases', () => {
      it('should handle filter: none', () => {
        const result = matchFilter('none');
        expect(result.classes).toEqual(['filter-none']);
        expect(result.warning).toBeUndefined();
      });

      it('should handle empty value', () => {
        const result = matchFilter('');
        expect(result.classes).toEqual([]);
      });

      it('should handle unparseable filter', () => {
        const result = matchFilter('invalid-filter');
        expect(result.classes).toEqual(['[filter:invalid-filter]']);
        expect(result.warning).toContain('Unable to parse');
      });

      it('should normalize whitespace', () => {
        const result = matchFilter('  blur(8px)  brightness(1.5)  ');
        expect(result.classes).toEqual(['blur', 'brightness-150']);
      });
    });
  });

  describe('mix-blend-mode', () => {
    it('should match all standard blend modes', () => {
      expect(matchMixBlendMode('normal')).toBe('mix-blend-normal');
      expect(matchMixBlendMode('multiply')).toBe('mix-blend-multiply');
      expect(matchMixBlendMode('screen')).toBe('mix-blend-screen');
      expect(matchMixBlendMode('overlay')).toBe('mix-blend-overlay');
      expect(matchMixBlendMode('darken')).toBe('mix-blend-darken');
      expect(matchMixBlendMode('lighten')).toBe('mix-blend-lighten');
      expect(matchMixBlendMode('color-dodge')).toBe('mix-blend-color-dodge');
      expect(matchMixBlendMode('color-burn')).toBe('mix-blend-color-burn');
      expect(matchMixBlendMode('hard-light')).toBe('mix-blend-hard-light');
      expect(matchMixBlendMode('soft-light')).toBe('mix-blend-soft-light');
      expect(matchMixBlendMode('difference')).toBe('mix-blend-difference');
      expect(matchMixBlendMode('exclusion')).toBe('mix-blend-exclusion');
      expect(matchMixBlendMode('hue')).toBe('mix-blend-hue');
      expect(matchMixBlendMode('saturation')).toBe('mix-blend-saturation');
      expect(matchMixBlendMode('color')).toBe('mix-blend-color');
      expect(matchMixBlendMode('luminosity')).toBe('mix-blend-luminosity');
    });

    it('should match additional blend modes', () => {
      expect(matchMixBlendMode('plus-darker')).toBe('mix-blend-plus-darker');
      expect(matchMixBlendMode('plus-lighter')).toBe('mix-blend-plus-lighter');
    });

    it('should normalize values before matching', () => {
      expect(matchMixBlendMode('  multiply  ')).toBe('mix-blend-multiply');
      expect(matchMixBlendMode('SCREEN')).toBe('mix-blend-screen');
      expect(matchMixBlendMode('OVERLAY')).toBe('mix-blend-overlay');
      expect(matchMixBlendMode('  DIFFERENCE  ')).toBe('mix-blend-difference');
    });

    it('should use arbitrary values for non-predefined blend modes', () => {
      expect(matchMixBlendMode('custom-blend')).toBe('mix-blend-[custom-blend]');
      expect(matchMixBlendMode('inherit')).toBe('mix-blend-[inherit]');
      expect(matchMixBlendMode('unset')).toBe('mix-blend-[unset]');
    });

    it('should handle empty or invalid values', () => {
      expect(matchMixBlendMode('')).toBe('');
      expect(matchMixBlendMode(null as unknown as string)).toBe('');
    });
  });

  describe('isolation', () => {
    it('should match isolate value', () => {
      expect(matchIsolation('isolate')).toBe('isolate');
    });

    it('should match auto value', () => {
      expect(matchIsolation('auto')).toBe('isolation-auto');
    });

    it('should normalize values before matching', () => {
      expect(matchIsolation('  isolate  ')).toBe('isolate');
      expect(matchIsolation('ISOLATE')).toBe('isolate');
      expect(matchIsolation('AUTO')).toBe('isolation-auto');
    });

    it('should use arbitrary values for non-predefined isolation', () => {
      expect(matchIsolation('inherit')).toBe('isolation-[inherit]');
      expect(matchIsolation('unset')).toBe('isolation-[unset]');
    });

    it('should handle empty or invalid values', () => {
      expect(matchIsolation('')).toBe('');
      expect(matchIsolation(null as unknown as string)).toBe('');
    });
  });
});

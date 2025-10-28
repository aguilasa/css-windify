import { describe, it, expect } from 'vitest';
import { 
  matchBackgroundColor, 
  matchBackgroundSize, 
  matchBackgroundPosition,
  matchBackgroundImage
} from './backgrounds';
import { MatchCtx } from '../../types';

describe('backgrounds matcher', () => {
  // Mock theme for testing
  const mockTheme = {
    colors: {
      'black': '#000000',
      'white': '#ffffff',
      'primary': '#3b82f6',
      'secondary': {
        '100': '#e0f2fe',
        '500': '#0ea5e9'
      }
    }
  };

  const ctx: MatchCtx = {
    theme: mockTheme,
    opts: {
      strict: false,
      approximate: false
    }
  };

  describe('background color', () => {
    it('should match basic named colors', () => {
      expect(matchBackgroundColor('black', ctx)).toBe('bg-black');
      expect(matchBackgroundColor('white', ctx)).toBe('bg-white');
      expect(matchBackgroundColor('transparent', ctx)).toBe('bg-transparent');
      expect(matchBackgroundColor('current', ctx)).toBe('bg-current');
    });

    it('should match theme colors', () => {
      expect(matchBackgroundColor('#3b82f6', ctx)).toBe('bg-primary');
      expect(matchBackgroundColor('#e0f2fe', ctx)).toBe('bg-secondary-100');
      expect(matchBackgroundColor('#0ea5e9', ctx)).toBe('bg-secondary-500');
    });

    it('should use arbitrary values for non-theme colors', () => {
      expect(matchBackgroundColor('#ff0000', ctx)).toBe('bg-[#ff0000]');
      expect(matchBackgroundColor('rgb(255, 0, 0)', ctx)).toBe('bg-[rgb(255,0,0)]');
    });

    it('should handle CSS variables', () => {
      expect(matchBackgroundColor('var(--color-primary)', ctx)).toBe('bg-[var(--color-primary)]');
    });
  });

  describe('background size', () => {
    it('should match predefined background sizes', () => {
      expect(matchBackgroundSize('cover')).toBe('bg-cover');
      expect(matchBackgroundSize('contain')).toBe('bg-contain');
      expect(matchBackgroundSize('auto')).toBe('bg-auto');
    });

    it('should normalize values before matching', () => {
      expect(matchBackgroundSize('  cover  ')).toBe('bg-cover');
      expect(matchBackgroundSize('CONTAIN')).toBe('bg-contain');
    });

    it('should use arbitrary values for non-predefined sizes', () => {
      expect(matchBackgroundSize('50% 100%')).toBe('bg-[50% 100%]');
      expect(matchBackgroundSize('10px 20px')).toBe('bg-[10px 20px]');
    });

    it('should handle empty or invalid values', () => {
      expect(matchBackgroundSize('')).toBe('');
      expect(matchBackgroundSize(null as unknown as string)).toBe('');
    });
  });

  describe('background position', () => {
    it('should match predefined background positions', () => {
      expect(matchBackgroundPosition('center')).toBe('bg-center');
      expect(matchBackgroundPosition('top')).toBe('bg-top');
      expect(matchBackgroundPosition('right')).toBe('bg-right');
      expect(matchBackgroundPosition('bottom')).toBe('bg-bottom');
      expect(matchBackgroundPosition('left')).toBe('bg-left');
      expect(matchBackgroundPosition('top right')).toBe('bg-top-right');
      expect(matchBackgroundPosition('top left')).toBe('bg-top-left');
      expect(matchBackgroundPosition('bottom right')).toBe('bg-bottom-right');
      expect(matchBackgroundPosition('bottom left')).toBe('bg-bottom-left');
    });

    it('should normalize values before matching', () => {
      expect(matchBackgroundPosition('  center  ')).toBe('bg-center');
      expect(matchBackgroundPosition('TOP')).toBe('bg-top');
      expect(matchBackgroundPosition('right top')).toBe('bg-top-right');
    });

    it('should use arbitrary values for non-predefined positions', () => {
      expect(matchBackgroundPosition('25% 75%')).toBe('bg-[25% 75%]');
      expect(matchBackgroundPosition('10px 20px')).toBe('bg-[10px 20px]');
    });

    it('should handle empty or invalid values', () => {
      expect(matchBackgroundPosition('')).toBe('');
      expect(matchBackgroundPosition(null as unknown as string)).toBe('');
    });
  });

  describe('background image', () => {
    it('should handle url values', () => {
      expect(matchBackgroundImage('url(image.jpg)')).toBe('bg-[url(image.jpg)]');
      expect(matchBackgroundImage('url("image.png")')).toBe('bg-[url("image.png")]');
      expect(matchBackgroundImage("url('image.svg')")).toBe("bg-[url('image.svg')]");
    });

    it('should handle gradient values', () => {
      expect(matchBackgroundImage('linear-gradient(to right, red, blue)')).toBe('bg-[linear-gradient(to right, red, blue)]');
      expect(matchBackgroundImage('radial-gradient(circle, red, blue)')).toBe('bg-[radial-gradient(circle, red, blue)]');
    });

    it('should handle none value', () => {
      expect(matchBackgroundImage('none')).toBe('bg-none');
    });

    it('should normalize values before matching', () => {
      expect(matchBackgroundImage('  none  ')).toBe('bg-none');
      expect(matchBackgroundImage('NONE')).toBe('bg-none');
    });

    it('should handle empty or invalid values', () => {
      expect(matchBackgroundImage('')).toBe('');
      expect(matchBackgroundImage(null as unknown as string)).toBe('');
    });
  });
});

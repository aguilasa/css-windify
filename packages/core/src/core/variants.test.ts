import { describe, it, expect } from 'vitest';
import { withVariant, withVariants } from './variants';

describe('variants', () => {
  describe('withVariant', () => {
    it('should apply a variant prefix to classes', () => {
      const classes = ['text-red-500', 'bg-blue-200', 'p-4'];
      const result = withVariant('hover', classes);
      
      expect(result).toEqual(['hover:text-red-500', 'hover:bg-blue-200', 'hover:p-4']);
    });

    it('should handle empty classes array', () => {
      expect(withVariant('hover', [])).toEqual([]);
    });

    it('should handle empty variant prefix', () => {
      const classes = ['text-red-500', 'bg-blue-200'];
      expect(withVariant('', classes)).toEqual(classes);
    });

    it('should handle null or undefined inputs', () => {
      expect(withVariant('hover', null as unknown as string[])).toEqual(null as unknown as string[]);
      expect(withVariant(null as unknown as string, ['text-red-500'])).toEqual(['text-red-500']);
    });
  });

  describe('withVariants', () => {
    it('should apply multiple variants to classes', () => {
      const classes = ['text-red-500', 'bg-blue-200'];
      const result = withVariants(['hover', 'focus'], classes);
      
      expect(result).toEqual(['hover:focus:text-red-500', 'hover:focus:bg-blue-200']);
    });

    it('should apply responsive variants', () => {
      const classes = ['text-red-500', 'p-4'];
      const result = withVariants(['sm', 'md'], classes);
      
      expect(result).toEqual(['sm:md:text-red-500', 'sm:md:p-4']);
    });

    it('should handle empty variants array', () => {
      const classes = ['text-red-500', 'bg-blue-200'];
      expect(withVariants([], classes)).toEqual(classes);
    });

    it('should handle empty classes array', () => {
      expect(withVariants(['hover', 'focus'], [])).toEqual([]);
    });

    it('should handle null or undefined inputs', () => {
      expect(withVariants(null as unknown as string[], ['text-red-500'])).toEqual(['text-red-500']);
      expect(withVariants(['hover'], null as unknown as string[])).toEqual(null as unknown as string[]);
    });
  });
});

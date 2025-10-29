import { describe, it, expect } from 'vitest';
import {
  withVariant,
  withVariants,
  dedupeVariants,
  PSEUDO_VARIANTS,
  GROUP_VARIANTS,
  PEER_VARIANTS,
} from './variants';

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
      expect(withVariant('hover', null as unknown as string[])).toEqual(
        null as unknown as string[]
      );
      expect(withVariant(null as unknown as string, ['text-red-500'])).toEqual(['text-red-500']);
    });

    it('should apply pseudo-class variants', () => {
      PSEUDO_VARIANTS.forEach((variant) => {
        const classes = ['text-red-500'];
        const result = withVariant(variant, classes);
        expect(result).toEqual([`${variant}:text-red-500`]);
      });
    });

    it('should apply group variants', () => {
      GROUP_VARIANTS.forEach((variant) => {
        const classes = ['text-red-500'];
        const result = withVariant(variant, classes);
        expect(result).toEqual([`${variant}:text-red-500`]);
      });
    });

    it('should apply peer variants', () => {
      PEER_VARIANTS.forEach((variant) => {
        const classes = ['text-red-500'];
        const result = withVariant(variant, classes);
        expect(result).toEqual([`${variant}:text-red-500`]);
      });
    });
  });

  describe('dedupeVariants', () => {
    it('should deduplicate variants while preserving order', () => {
      const variants = ['hover', 'focus', 'hover', 'active', 'focus'];
      const result = dedupeVariants(variants);
      expect(result).toEqual(['hover', 'focus', 'active']);
    });

    it('should handle empty variants array', () => {
      expect(dedupeVariants([])).toEqual([]);
    });

    it('should handle null or undefined inputs', () => {
      expect(dedupeVariants(null as unknown as string[])).toEqual([]);
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
      expect(withVariants(['hover'], null as unknown as string[])).toEqual(
        null as unknown as string[]
      );
    });

    it('should deduplicate variants while preserving order', () => {
      const classes = ['text-red-500'];
      const result = withVariants(['hover', 'focus', 'hover'], classes);
      expect(result).toEqual(['hover:focus:text-red-500']);
    });

    it('should handle complex variant combinations', () => {
      const classes = ['text-red-500'];
      const result = withVariants(['md', 'dark', 'group-hover', 'focus'], classes);
      expect(result).toEqual(['md:dark:group-hover:focus:text-red-500']);
    });

    it('should apply multiple variants to multiple classes', () => {
      const classes = ['text-red-500', 'bg-blue-200', 'p-4'];
      const result = withVariants(['hover', 'focus', 'active'], classes);
      expect(result).toEqual([
        'hover:focus:active:text-red-500',
        'hover:focus:active:bg-blue-200',
        'hover:focus:active:p-4',
      ]);
    });

    it('should apply all new pseudo-class variants', () => {
      const classes = ['text-red-500'];
      const result = withVariants(
        ['visited', 'focus-visible', 'focus-within', 'first', 'last', 'odd', 'even'],
        classes
      );
      expect(result).toEqual([
        'visited:focus-visible:focus-within:first:last:odd:even:text-red-500',
      ]);
    });

    it('should apply all new group variants', () => {
      const classes = ['text-red-500'];
      const result = withVariants(GROUP_VARIANTS, classes);
      expect(result).toEqual([
        'group-hover:group-focus:group-active:group-focus-visible:group-focus-within:text-red-500',
      ]);
    });

    it('should apply all new peer variants', () => {
      const classes = ['text-red-500'];
      const result = withVariants(PEER_VARIANTS, classes);
      expect(result).toEqual([
        'peer-focus:peer-hover:peer-active:peer-checked:peer-focus-visible:peer-focus-within:text-red-500',
      ]);
    });
  });
});

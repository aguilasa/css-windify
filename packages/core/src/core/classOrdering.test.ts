import { describe, expect, it } from 'vitest';
import { getClassGroup, sortClasses } from './rulesEngine';

describe('Class ordering', () => {
  describe('getClassGroup', () => {
    it('should correctly identify layout classes', () => {
      const layoutClasses = [
        'block',
        'inline-block',
        'flex',
        'grid',
        'hidden',
        'static',
        'fixed',
        'absolute',
        'relative',
        'sticky',
        'inset-0',
        'top-0',
        'right-4',
        'bottom-10',
        'left-auto',
        'overflow-hidden',
        'object-cover',
        'aspect-square',
      ];

      for (const cls of layoutClasses) {
        expect(getClassGroup(cls).group).toBe('layout');
        expect(getClassGroup(cls).order).toBe(1);
      }
    });

    it('should correctly identify flex-grid classes', () => {
      const flexGridClasses = [
        'flex-row',
        'flex-col',
        'items-center',
        'justify-between',
        'grid-cols-3',
        'gap-4',
        'place-content-center',
        'content-center',
        'col-span-2',
        'row-start-1',
      ];

      for (const cls of flexGridClasses) {
        expect(getClassGroup(cls).group).toBe('flex-grid');
        expect(getClassGroup(cls).order).toBe(2);
      }
    });

    it('should correctly identify sizing classes', () => {
      const sizingClasses = [
        'w-full',
        'h-screen',
        'min-w-0',
        'min-h-screen',
        'max-w-md',
        'max-h-[500px]',
      ];

      for (const cls of sizingClasses) {
        expect(getClassGroup(cls).group).toBe('sizing');
        expect(getClassGroup(cls).order).toBe(3);
      }
    });

    it('should correctly identify spacing classes', () => {
      const spacingClasses = [
        'm-4',
        'mx-auto',
        'my-2',
        'mt-0',
        'mr-4',
        'mb-8',
        'ml-2',
        'p-4',
        'px-6',
        'py-2',
        'pt-4',
        'pr-2',
        'pb-8',
        'pl-4',
        'space-x-2',
      ];

      for (const cls of spacingClasses) {
        expect(getClassGroup(cls).group).toBe('spacing');
        expect(getClassGroup(cls).order).toBe(4);
      }
    });

    it('should correctly identify typography classes', () => {
      const typographyClasses = [
        'font-bold',
        'text-lg',
        'text-blue-500',
        'leading-tight',
        'tracking-wide',
        'decoration-wavy',
        'underline',
        'line-through',
        'no-underline',
      ];

      for (const cls of typographyClasses) {
        expect(getClassGroup(cls).group).toBe('typography');
        expect(getClassGroup(cls).order).toBe(5);
      }
    });

    it('should correctly identify background classes', () => {
      const backgroundClasses = [
        'bg-white',
        'bg-blue-500',
        'bg-opacity-50',
        'bg-gradient-to-r',
        'bg-cover',
      ];

      for (const cls of backgroundClasses) {
        expect(getClassGroup(cls).group).toBe('background');
        expect(getClassGroup(cls).order).toBe(6);
      }
    });

    it('should correctly identify border classes', () => {
      const borderClasses = [
        'border',
        'border-2',
        'border-blue-500',
        'rounded',
        'rounded-md',
        'rounded-full',
        'outline-none',
      ];

      for (const cls of borderClasses) {
        expect(getClassGroup(cls).group).toBe('border');
        expect(getClassGroup(cls).order).toBe(7);
      }
    });

    it('should correctly identify effects classes', () => {
      const effectsClasses = [
        'shadow',
        'shadow-lg',
        'opacity-50',
        'filter',
        'mix-blend-multiply',
        'isolate',
      ];

      for (const cls of effectsClasses) {
        expect(getClassGroup(cls).group).toBe('effects');
        expect(getClassGroup(cls).order).toBe(8);
      }
    });

    it('should classify unknown classes as misc', () => {
      const miscClasses = [
        'cursor-pointer',
        'select-none',
        'z-10',
        'transition',
        'duration-300',
        'scale-95',
      ];

      for (const cls of miscClasses) {
        expect(getClassGroup(cls).group).toBe('misc');
        expect(getClassGroup(cls).order).toBe(9);
      }
    });

    it('should handle variant prefixes correctly', () => {
      const classesWithVariants = [
        'md:flex',
        'hover:bg-blue-600',
        'dark:text-white',
        'md:hover:text-lg',
      ];

      // The group should be determined by the base class, not the variant
      expect(getClassGroup(classesWithVariants[0]).group).toBe('layout');
      expect(getClassGroup(classesWithVariants[1]).group).toBe('background');
      expect(getClassGroup(classesWithVariants[2]).group).toBe('typography');
      expect(getClassGroup(classesWithVariants[3]).group).toBe('typography');
    });
  });

  describe('sortClasses', () => {
    it('should sort classes by group order', () => {
      const unsorted = ['text-lg', 'flex', 'p-4', 'bg-white', 'w-full'];

      const sorted = sortClasses(unsorted);

      // Expected order: flex (layout), w-full (sizing), p-4 (spacing), text-lg (typography), bg-white (background)
      expect(sorted[0]).toBe('flex');
      expect(sorted[1]).toBe('w-full');
      expect(sorted[2]).toBe('p-4');
      expect(sorted[3]).toBe('text-lg');
      expect(sorted[4]).toBe('bg-white');
    });

    it('should sort classes with variants correctly', () => {
      const unsorted = ['md:p-4', 'hover:bg-blue-600', 'flex', 'md:w-1/2', 'hover:text-white'];

      const sorted = sortClasses(unsorted);

      // First non-variant classes grouped by category
      expect(sorted[0]).toBe('flex');

      // Then hover variants grouped by category
      expect(sorted[1]).toBe('hover:text-white');
      expect(sorted[2]).toBe('hover:bg-blue-600');

      // Then md variants grouped by category
      expect(sorted[3]).toBe('md:w-1/2');
      expect(sorted[4]).toBe('md:p-4');
    });

    it('should sort complex variant combinations correctly', () => {
      const unsorted = [
        'md:hover:bg-blue-600',
        'hover:bg-red-500',
        'md:p-4',
        'lg:flex',
        'dark:hover:text-white',
        'sm:p-2',
      ];

      const sorted = sortClasses(unsorted);

      // First by variant prefix lexicographically, then by group
      // The actual order is determined by the lexicographic sorting of variant prefixes
      expect(sorted).toContain('hover:bg-red-500');
      expect(sorted).toContain('dark:hover:text-white');
      expect(sorted).toContain('lg:flex');
      expect(sorted).toContain('md:hover:bg-blue-600');
      expect(sorted).toContain('md:p-4');
      expect(sorted).toContain('sm:p-2');

      // Verify that the sorting is deterministic
      const sorted2 = sortClasses(unsorted);
      expect(sorted).toEqual(sorted2);
    });

    it('should deduplicate classes while preserving order', () => {
      const withDuplicates = [
        'flex',
        'p-4',
        'flex', // duplicate
        'text-lg',
        'p-4', // duplicate
        'bg-white',
      ];

      const sorted = sortClasses(withDuplicates);

      expect(sorted.length).toBe(4); // Only unique classes
      expect(sorted).toEqual(['flex', 'p-4', 'text-lg', 'bg-white']);
    });

    it('should handle arbitrary values correctly', () => {
      const withArbitrary = [
        'w-[240px]',
        'text-[#336699]',
        'grid-cols-[repeat(2,_1fr)]',
        'h-[calc(100vh-80px)]',
        'bg-[url("/img/bg.jpg")]',
      ];

      const sorted = sortClasses(withArbitrary);

      // Should group by prefix before the arbitrary value
      // Verify all classes are present and sorted by their group
      expect(sorted).toContain('grid-cols-[repeat(2,_1fr)]');
      expect(sorted).toContain('w-[240px]');
      expect(sorted).toContain('h-[calc(100vh-80px)]');
      expect(sorted).toContain('text-[#336699]');
      expect(sorted).toContain('bg-[url("/img/bg.jpg")]');

      // Verify that classes are grouped by their prefix category
      const flexGridIndex = sorted.findIndex((cls) => cls.startsWith('grid-'));
      const sizingIndex1 = sorted.findIndex((cls) => cls.startsWith('w-'));
      const sizingIndex2 = sorted.findIndex((cls) => cls.startsWith('h-'));
      const typographyIndex = sorted.findIndex((cls) => cls.startsWith('text-'));
      const backgroundIndex = sorted.findIndex((cls) => cls.startsWith('bg-'));

      // Verify that the sorting respects group order
      expect(flexGridIndex).toBeLessThan(sizingIndex1);
      expect(flexGridIndex).toBeLessThan(sizingIndex2);
      expect(sizingIndex1).toBeLessThan(typographyIndex);
      expect(sizingIndex2).toBeLessThan(typographyIndex);
      expect(typographyIndex).toBeLessThan(backgroundIndex);
    });

    it('should sort a complex real-world example correctly and deterministically', () => {
      const complex = [
        'md:flex',
        'p-4',
        'hover:bg-blue-600',
        'text-lg',
        'rounded-md',
        'w-full',
        'md:w-auto',
        'justify-between',
        'items-center',
        'bg-white',
        'shadow-md',
        'border',
        'border-gray-200',
        'md:hover:bg-blue-700',
        'dark:bg-gray-800',
        'dark:border-gray-700',
        'dark:text-white',
        'dark:hover:bg-gray-700',
      ];

      const sorted1 = sortClasses(complex);
      const sorted2 = sortClasses([...complex].reverse()); // Test with reversed input

      // Both should produce the same deterministic order
      expect(sorted1).toEqual(sorted2);

      // Check that the ordering follows the expected pattern
      // First non-variant classes grouped by category
      const nonVariantIndices = sorted1
        .filter((cls: string) => !cls.includes(':'))
        .map((cls: string) => sorted1.indexOf(cls));

      // Verify that non-variant classes are grouped together at the beginning
      expect(Math.max(...nonVariantIndices)).toBeLessThan(
        sorted1.findIndex((cls: string) => cls.includes(':'))
      );

      // Check that dark: variants are grouped together
      const darkVariants = sorted1.filter((cls: string) => cls.startsWith('dark:'));
      const darkIndices = darkVariants.map((cls: string) => sorted1.indexOf(cls));
      expect(Math.max(...darkIndices) - Math.min(...darkIndices)).toBe(darkVariants.length - 1);

      // Check that hover: variants are grouped together
      const hoverVariants = sorted1.filter((cls: string) => cls.startsWith('hover:'));
      const hoverIndices = hoverVariants.map((cls: string) => sorted1.indexOf(cls));
      expect(Math.max(...hoverIndices) - Math.min(...hoverIndices)).toBe(hoverVariants.length - 1);
    });
  });
});

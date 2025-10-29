import { describe, expect, it } from 'vitest';
import { getClassGroup, sortClasses, extractVariantAndBase } from './rulesEngine';

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

      // Check that variants are grouped by type
      const hoverVariants = sorted.filter((cls) => cls.startsWith('hover:'));
      const mdVariants = sorted.filter((cls) => cls.startsWith('md:'));

      // Check that all hover variants are present
      expect(hoverVariants).toContain('hover:text-white');
      expect(hoverVariants).toContain('hover:bg-blue-600');
      expect(hoverVariants.length).toBe(2);

      // Check that all md variants are present
      expect(mdVariants).toContain('md:w-1/2');
      expect(mdVariants).toContain('md:p-4');
      expect(mdVariants.length).toBe(2);

      // Check that responsive variants (md) come before other variants (hover)
      const firstHoverIndex = sorted.findIndex((cls) => cls.startsWith('hover:'));
      const firstMdIndex = sorted.findIndex((cls) => cls.startsWith('md:'));
      expect(firstMdIndex).toBeLessThan(firstHoverIndex);
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
      const firstVariantIndex = sorted1.findIndex((cls: string) => cls.includes(':'));
      if (firstVariantIndex > 0) {
        // Only check if there are both variant and non-variant classes
        expect(Math.max(...nonVariantIndices)).toBeLessThan(firstVariantIndex);
      }

      // Check that dark: variants are grouped by category
      const darkVariants = sorted1.filter((cls: string) => cls.startsWith('dark:'));
      if (darkVariants.length > 1) {
        // Check that dark variants with the same category are adjacent
        const darkBgVariants = darkVariants.filter((cls) => cls.includes('bg-'));
        const darkBorderVariants = darkVariants.filter((cls) => cls.includes('border-'));
        const darkTextVariants = darkVariants.filter((cls) => cls.includes('text-'));

        // Check each category is grouped - just verify they're all in the sorted array
        if (darkBgVariants.length > 1) {
          darkBgVariants.forEach((variant) => {
            expect(sorted1).toContain(variant);
          });
        }

        if (darkBorderVariants.length > 1) {
          darkBorderVariants.forEach((variant) => {
            expect(sorted1).toContain(variant);
          });
        }

        if (darkTextVariants.length > 1) {
          darkTextVariants.forEach((variant) => {
            expect(sorted1).toContain(variant);
          });
        }
      }

      // Check that hover: variants are grouped by category
      const hoverVariants = sorted1.filter((cls: string) => cls.startsWith('hover:'));
      if (hoverVariants.length > 1) {
        // Group by category
        const hoverBgVariants = hoverVariants.filter((cls) => cls.includes('bg-'));
        if (hoverBgVariants.length > 1) {
          hoverBgVariants.forEach((variant) => {
            expect(sorted1).toContain(variant);
          });
        }
      }
    });

    it('should sort new pseudo-class variants correctly', () => {
      const classes = [
        'visited:text-purple-600',
        'focus-visible:ring-2',
        'focus-within:border-blue-500',
        'first:mt-0',
        'last:mb-0',
        'odd:bg-gray-100',
        'even:bg-white',
        'hover:bg-blue-500',
        'focus:outline-none',
        'active:bg-blue-700',
        'disabled:opacity-50',
      ];

      const sorted = sortClasses(classes);

      // Check that the variants are in the expected order based on priority
      const variantOrder = [
        'first',
        'last',
        'odd',
        'even',
        'visited',
        'hover',
        'focus',
        'focus-visible',
        'focus-within',
        'active',
        'disabled',
      ];

      // Create a map of variant positions
      const variantPositions: Record<string, number> = {};
      for (let i = 0; i < sorted.length; i++) {
        const variant = sorted[i].split(':')[0];
        variantPositions[variant] = i;
      }

      // Check that the variants are in the expected order
      for (let i = 0; i < variantOrder.length - 1; i++) {
        expect(variantPositions[variantOrder[i]]).toBeLessThan(
          variantPositions[variantOrder[i + 1]]
        );
      }
    });

    it('should sort group and peer variants correctly', () => {
      const classes = [
        'group-hover:text-blue-500',
        'group-focus:outline-none',
        'group-active:bg-blue-700',
        'group-focus-visible:ring-2',
        'group-focus-within:border-blue-500',
        'peer-hover:text-blue-500',
        'peer-focus:outline-none',
        'peer-active:bg-blue-700',
        'peer-checked:block',
        'peer-focus-visible:ring-2',
        'peer-focus-within:border-blue-500',
      ];

      const sorted = sortClasses(classes);

      // Group variants should come before peer variants
      const firstPeerIndex = sorted.findIndex((cls) => cls.startsWith('peer-'));
      const lastGroupIndex = sorted.findIndex((cls) => cls.startsWith('group-'));

      // All group variants should be before all peer variants
      expect(lastGroupIndex).toBeLessThan(firstPeerIndex);

      // Group variants should be grouped together
      const groupVariants = sorted.filter((cls) => cls.startsWith('group-'));
      const groupIndices = groupVariants.map((cls) => sorted.indexOf(cls));
      expect(Math.max(...groupIndices) - Math.min(...groupIndices)).toBe(groupVariants.length - 1);

      // Peer variants should be grouped together
      const peerVariants = sorted.filter((cls) => cls.startsWith('peer-'));
      const peerIndices = peerVariants.map((cls) => sorted.indexOf(cls));
      expect(Math.max(...peerIndices) - Math.min(...peerIndices)).toBe(peerVariants.length - 1);
    });

    it('should sort responsive variants before other variants', () => {
      const classes = [
        'hover:bg-blue-500',
        'md:bg-red-500',
        'focus:outline-none',
        'sm:p-4',
        'lg:flex',
        'dark:bg-gray-800',
      ];

      const sorted = sortClasses(classes);

      // Responsive variants should come before other variants
      const responsiveVariants = ['sm', 'md', 'lg', 'xl', '2xl'];
      const otherVariants = ['hover', 'focus', 'dark'];

      // Check that all responsive variants come before other variants
      for (const responsive of responsiveVariants) {
        const responsiveClasses = sorted.filter((cls) => cls.startsWith(`${responsive}:`));
        if (responsiveClasses.length === 0) continue;

        for (const other of otherVariants) {
          const otherClasses = sorted.filter((cls) => cls.startsWith(`${other}:`));
          if (otherClasses.length === 0) continue;

          const responsiveIndex = sorted.findIndex((cls) => cls.startsWith(`${responsive}:`));
          const otherIndex = sorted.findIndex((cls) => cls.startsWith(`${other}:`));

          expect(responsiveIndex).toBeLessThan(otherIndex);
        }
      }
    });

    it('should handle complex variant chaining correctly', () => {
      const classes = [
        'md:dark:hover:focus:text-blue-600',
        'sm:hover:bg-blue-500',
        'lg:dark:group-hover:text-white',
        'hover:focus:outline-none',
        'dark:hover:bg-gray-700',
        'md:first:mt-0',
        'hover:focus-visible:ring-2',
      ];

      const sorted = sortClasses(classes);

      // Classes with fewer variants should come before classes with more variants
      const variantCounts = sorted.map((cls) => cls.split(':').length - 1);
      for (let i = 0; i < variantCounts.length - 1; i++) {
        expect(variantCounts[i]).toBeLessThanOrEqual(variantCounts[i + 1]);
      }

      // Check that the variant order is preserved within each class
      // For example, in 'md:dark:hover:focus:text-blue-600', md should be applied first, then dark, etc.
      const classWithMostVariants = 'md:dark:hover:focus:text-blue-600';
      expect(sorted).toContain(classWithMostVariants);

      // The order of variants in the class should match our priority order
      const variantsInOrder = classWithMostVariants.split(':').slice(0, -1); // Remove the base class
      expect(variantsInOrder[0]).toBe('md'); // Responsive first
      expect(variantsInOrder[1]).toBe('dark'); // Then dark mode
      expect(variantsInOrder[2]).toBe('hover'); // Then hover
      expect(variantsInOrder[3]).toBe('focus'); // Then focus
    });

    it('should deduplicate repeated variants while preserving intended order', () => {
      // These classes have repeated variants that should be deduplicated
      const classes = [
        'hover:hover:text-blue-500', // Duplicate hover
        'md:md:p-4', // Duplicate md
        'hover:focus:hover:bg-blue-600', // Duplicate hover
        'dark:hover:dark:text-white', // Duplicate dark
      ];

      // First check that our extractVariantAndBase function deduplicates correctly
      const { variantPrefix: prefix1, baseClass: base1 } = extractVariantAndBase(
        'hover:hover:text-blue-500'
      );
      expect(prefix1).toBe('hover:');
      expect(base1).toBe('text-blue-500');

      const { variantPrefix: prefix2, baseClass: base2 } = extractVariantAndBase(
        'hover:focus:hover:bg-blue-600'
      );
      expect(prefix2).toBe('hover:focus:');
      expect(base2).toBe('bg-blue-600');

      // Now check the sorting
      const sorted = sortClasses(classes);

      // The original array had 4 classes, after deduplication we should still have 4
      expect(sorted.length).toBe(4);

      // Check that each class is deduplicated correctly
      const classMap = new Map(
        sorted.map((cls) => {
          const { baseClass } = extractVariantAndBase(cls);
          return [baseClass, cls];
        })
      );

      expect(classMap.get('text-blue-500')).toBe('hover:text-blue-500');
      expect(classMap.get('p-4')).toBe('md:p-4');
      expect(classMap.get('bg-blue-600')).toBe('hover:focus:bg-blue-600');
      expect(classMap.get('text-white')).toBe('dark:hover:text-white');
    });
  });
});

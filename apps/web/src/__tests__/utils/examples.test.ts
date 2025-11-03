import { describe, it, expect } from 'vitest';
import { CSS_EXAMPLES, getExamplesByCategory, getExampleById, getCategories } from '../../examples';

describe('examples.ts', () => {
  describe('CSS_EXAMPLES', () => {
    it('should have examples', () => {
      expect(CSS_EXAMPLES).toBeDefined();
      expect(CSS_EXAMPLES.length).toBeGreaterThan(0);
    });

    it('should have valid structure', () => {
      CSS_EXAMPLES.forEach((example) => {
        expect(example).toHaveProperty('id');
        expect(example).toHaveProperty('name');
        expect(example).toHaveProperty('category');
        expect(example).toHaveProperty('description');
        expect(example).toHaveProperty('css');
        expect(typeof example.id).toBe('string');
        expect(typeof example.name).toBe('string');
        expect(typeof example.description).toBe('string');
        expect(typeof example.css).toBe('string');
      });
    });

    it('should have unique IDs', () => {
      const ids = CSS_EXAMPLES.map((ex) => ex.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('getExamplesByCategory', () => {
    it('should return button examples', () => {
      const examples = getExamplesByCategory('button');
      expect(examples.length).toBeGreaterThan(0);
      examples.forEach((ex) => {
        expect(ex.category).toBe('button');
      });
    });

    it('should return card examples', () => {
      const examples = getExamplesByCategory('card');
      expect(examples.length).toBeGreaterThan(0);
      examples.forEach((ex) => {
        expect(ex.category).toBe('card');
      });
    });

    it('should return form examples', () => {
      const examples = getExamplesByCategory('form');
      expect(examples.length).toBeGreaterThan(0);
      examples.forEach((ex) => {
        expect(ex.category).toBe('form');
      });
    });

    it('should return layout examples', () => {
      const examples = getExamplesByCategory('layout');
      expect(examples.length).toBeGreaterThan(0);
      examples.forEach((ex) => {
        expect(ex.category).toBe('layout');
      });
    });
  });

  describe('getExampleById', () => {
    it('should return example by ID', () => {
      const example = getExampleById('button-primary');
      expect(example).toBeDefined();
      expect(example?.id).toBe('button-primary');
    });

    it('should return undefined for invalid ID', () => {
      const example = getExampleById('invalid-id');
      expect(example).toBeUndefined();
    });
  });

  describe('getCategories', () => {
    it('should return all categories', () => {
      const categories = getCategories();
      expect(categories).toHaveLength(4);
      expect(categories).toEqual([
        { id: 'button', label: 'Buttons' },
        { id: 'card', label: 'Cards' },
        { id: 'form', label: 'Forms' },
        { id: 'layout', label: 'Layouts' },
      ]);
    });
  });
});

/**
 * Pre-loaded CSS examples for quick testing
 */

export interface CSSExample {
  id: string;
  name: string;
  category: 'button' | 'card' | 'form' | 'layout';
  description: string;
  css: string;
}

export const CSS_EXAMPLES: CSSExample[] = [
  // Button Examples
  {
    id: 'button-primary',
    name: 'Primary Button',
    category: 'button',
    description: 'A modern primary button with hover effects',
    css: `.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}`,
  },
  {
    id: 'button-outline',
    name: 'Outline Button',
    category: 'button',
    description: 'Button with border and transparent background',
    css: `.btn-outline {
  display: inline-flex;
  padding: 0.5rem 1rem;
  border: 2px solid #3b82f6;
  color: #3b82f6;
  background-color: transparent;
  border-radius: 0.375rem;
  font-weight: 500;
}

.btn-outline:hover {
  background-color: #3b82f6;
  color: white;
}`,
  },

  // Card Examples
  {
    id: 'card-simple',
    name: 'Simple Card',
    category: 'card',
    description: 'Basic card with shadow and padding',
    css: `.card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.card-body {
  color: #6b7280;
  line-height: 1.5;
}`,
  },
  {
    id: 'card-product',
    name: 'Product Card',
    category: 'card',
    description: 'E-commerce product card with image',
    css: `.product-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 12rem;
  object-fit: cover;
}

.product-content {
  padding: 1rem;
}

.product-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
}`,
  },

  // Form Examples
  {
    id: 'form-input',
    name: 'Form Input',
    category: 'form',
    description: 'Styled form input with label',
    css: `.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}`,
  },
  {
    id: 'form-complete',
    name: 'Complete Form',
    category: 'form',
    description: 'Full form with multiple elements',
    css: `.form-container {
  max-width: 28rem;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
}`,
  },

  // Layout Examples
  {
    id: 'layout-grid',
    name: 'Grid Layout',
    category: 'layout',
    description: 'Responsive grid with gap',
    css: `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 2rem;
}

.grid-item {
  background-color: #f3f4f6;
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}`,
  },
  {
    id: 'layout-flex',
    name: 'Flex Layout',
    category: 'layout',
    description: 'Flexbox layout with alignment',
    css: `.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
}

.flex-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.flex-right {
  display: flex;
  gap: 0.75rem;
}`,
  },
  {
    id: 'layout-sidebar',
    name: 'Sidebar Layout',
    category: 'layout',
    description: 'Two-column layout with sidebar',
    css: `.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 16rem;
  background-color: #1f2937;
  padding: 1.5rem;
  color: white;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f9fafb;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}`,
  },
];

/**
 * Get examples by category
 */
export function getExamplesByCategory(category: CSSExample['category']): CSSExample[] {
  return CSS_EXAMPLES.filter((ex) => ex.category === category);
}

/**
 * Get example by ID
 */
export function getExampleById(id: string): CSSExample | undefined {
  return CSS_EXAMPLES.find((ex) => ex.id === id);
}

/**
 * Get all categories
 */
export function getCategories(): Array<{ id: CSSExample['category']; label: string }> {
  return [
    { id: 'button', label: 'Buttons' },
    { id: 'card', label: 'Cards' },
    { id: 'form', label: 'Forms' },
    { id: 'layout', label: 'Layouts' },
  ];
}

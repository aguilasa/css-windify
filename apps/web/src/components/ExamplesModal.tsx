import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { getCategories, getExamplesByCategory, type CSSExample } from '../examples';

export function ExamplesModal() {
  const { showExamplesModal, setShowExamplesModal, setCssInput } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<CSSExample['category']>('button');

  if (!showExamplesModal) return null;

  const categories = getCategories();
  const examples = getExamplesByCategory(selectedCategory);

  const loadExample = (example: CSSExample) => {
    setCssInput(example.css);
    setShowExamplesModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-lg bg-gray-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">CSS Examples</h2>
          <button
            onClick={() => setShowExamplesModal(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[60vh]">
          {/* Categories */}
          <div className="w-48 border-r border-gray-700 bg-gray-800">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full px-4 py-3 text-left text-sm ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Examples */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid gap-4">
              {examples.map((example) => (
                <div
                  key={example.id}
                  className="cursor-pointer rounded border border-gray-700 bg-gray-800 p-4 transition hover:border-blue-500"
                  onClick={() => loadExample(example)}
                >
                  <h3 className="mb-1 font-semibold text-white">{example.name}</h3>
                  <p className="mb-3 text-sm text-gray-400">{example.description}</p>
                  <pre className="overflow-auto rounded bg-gray-900 p-3 text-xs text-gray-300">
                    {example.css.substring(0, 200)}
                    {example.css.length > 200 && '...'}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 px-6 py-3 text-sm text-gray-400">
          Click an example to load it into the editor
        </div>
      </div>
    </div>
  );
}

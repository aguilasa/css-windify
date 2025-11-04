import { Link } from 'react-router-dom';
import { CSS_EXAMPLES, getCategories } from '../examples';
import { useState } from 'react';
import type { CSSExample } from '../examples';

export function Examples() {
  const [selectedCategory, setSelectedCategory] = useState<CSSExample['category']>('button');
  const categories = getCategories();
  const examples = CSS_EXAMPLES.filter((ex) => ex.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <span className="text-xl font-bold text-white">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CSSWindify</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">CSS Examples</p>
              </div>
            </Link>
            <Link
              to="/converter"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              Try Converter
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">CSS Examples</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Browse pre-loaded CSS examples to get started quickly
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 flex space-x-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap rounded-lg px-6 py-3 font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Examples Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {examples.map((example) => (
            <div
              key={example.id}
              className="overflow-hidden rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800"
            >
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  {example.name}
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">{example.description}</p>

                {/* CSS Preview */}
                <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                  <pre className="overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
                    <code>{example.css}</code>
                  </pre>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Link
                    to={`/converter?example=${example.id}`}
                    className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-center text-white transition-colors hover:bg-blue-600"
                  >
                    Try in Converter
                  </Link>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(example.css);
                    }}
                    className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Copy CSS
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

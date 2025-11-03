import { useState } from 'react';
import { Editor } from './Editor';

/**
 * Example component demonstrating Editor usage
 */
export function EditorExample() {
  const [cssCode, setCssCode] = useState(`/* Enter your CSS here */
.button {
  display: flex;
  padding: 1rem 2rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
}

.card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 2rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}`);

  const [theme, setTheme] = useState<'vs-dark' | 'vs-light'>('vs-dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'vs-dark' ? 'vs-light' : 'vs-dark'));
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900 px-6 py-4">
        <h1 className="text-xl font-bold text-white">CSSWindify Editor</h1>
        <button
          onClick={toggleTheme}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Toggle Theme ({theme === 'vs-dark' ? 'Dark' : 'Light'})
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor value={cssCode} onChange={setCssCode} theme={theme} />
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-700 bg-gray-900 px-6 py-2 text-sm text-gray-400">
        {cssCode.split('\n').length} lines • {cssCode.length} characters
      </div>
    </div>
  );
}

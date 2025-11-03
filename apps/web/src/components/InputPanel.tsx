import { Editor } from './Editor';
import { useApp } from '../contexts/AppContext';

export function InputPanel() {
  const { cssInput, setCssInput, settings } = useApp();

  const handleClear = () => {
    setCssInput('');
  };

  const handleFormat = () => {
    // Basic CSS formatting
    const formatted = cssInput
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n\n');
    setCssInput(formatted);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
        <h2 className="text-sm font-semibold text-white">CSS Input</h2>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="rounded bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600"
          >
            Clear
          </button>
          <button
            onClick={handleFormat}
            className="rounded bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600"
          >
            Format
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor value={cssInput} onChange={setCssInput} theme={settings.theme} />
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-700 bg-gray-800 px-4 py-1 text-xs text-gray-400">
        {cssInput.split('\n').length} lines • {cssInput.length} characters
      </div>
    </div>
  );
}

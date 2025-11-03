import { useState } from 'react';
import { InputPanel } from './InputPanel';
import { OutputPanel } from './OutputPanel';
import { SidePanel } from './SidePanel';
import { ExportButton } from './ExportButton';
import { useWorker } from '../hooks/useWorker';
import { useApp, getMatchCtxFromSettings } from '../contexts/AppContext';

export function Layout() {
  const { cssInput, setResult, settings } = useApp();
  const { state, transform, cancel } = useWorker();
  const [leftWidth, setLeftWidth] = useState(40); // percentage

  const handleTransform = async () => {
    try {
      const matchCtx = getMatchCtxFromSettings(settings);
      const result = await transform(cssInput, matchCtx);
      setResult(result);
    } catch (err) {
      console.error('Transform error:', err);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-700 bg-gray-900 px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">CSSWindify</h1>
          <span className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
            v1.0
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleTransform}
            disabled={state === 'processing' || !cssInput}
            className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state === 'processing' ? 'Processing...' : 'Transform'}
          </button>
          {state === 'processing' && (
            <button
              onClick={cancel}
              className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
            >
              Cancel
            </button>
          )}
          <ExportButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Input */}
        <div style={{ width: `${leftWidth}%` }} className="flex flex-col">
          <InputPanel />
        </div>

        {/* Resizer */}
        <div
          className="w-1 cursor-col-resize bg-gray-700 hover:bg-blue-500"
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = leftWidth;

            const handleMouseMove = (e: MouseEvent) => {
              const delta = e.clientX - startX;
              const newWidth = startWidth + (delta / window.innerWidth) * 100;
              setLeftWidth(Math.max(20, Math.min(60, newWidth)));
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        {/* Middle Panel - Output */}
        <div style={{ width: `${60 - leftWidth}%` }} className="flex flex-col">
          <OutputPanel />
        </div>

        {/* Right Panel - Side */}
        <div className="w-80">
          <SidePanel />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900 px-6 py-2 text-center text-xs text-gray-400">
        Made with ❤️ by the CSSWindify team • MIT License
      </footer>
    </div>
  );
}

import { useState } from 'react';
import { useWorker } from '../hooks/useWorker';
import { Editor } from './Editor';

/**
 * Example component demonstrating useWorker hook usage
 */
export function WorkerExample() {
  const [cssCode, setCssCode] = useState(`/* Enter CSS to transform */
.button {
  display: flex;
  padding: 1rem 2rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
}`);

  const { state, result, error, transform, cancel, reset } = useWorker();

  const handleTransform = async () => {
    try {
      await transform(cssCode, {
        theme: {},
        version: 'auto',
        opts: {
          strict: false,
          approximate: true,
          thresholds: {
            spacingPx: 2,
            fontPx: 1,
            radiiPx: 2,
          },
        },
      });
    } catch (err) {
      console.error('Transform error:', err);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-900 px-6 py-4">
        <h1 className="text-xl font-bold text-white">CSSWindify with Web Worker</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Input Panel */}
        <div className="flex w-1/2 flex-col border-r border-gray-700">
          <div className="border-b border-gray-700 bg-gray-800 px-4 py-2">
            <h2 className="text-sm font-semibold text-white">CSS Input</h2>
          </div>
          <div className="flex-1">
            <Editor value={cssCode} onChange={setCssCode} theme="vs-dark" />
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex w-1/2 flex-col">
          <div className="border-b border-gray-700 bg-gray-800 px-4 py-2">
            <h2 className="text-sm font-semibold text-white">Tailwind Output</h2>
          </div>
          <div className="flex-1 overflow-auto bg-gray-900 p-4">
            {state === 'idle' && (
              <div className="text-gray-400">
                Click "Transform" to convert CSS to Tailwind classes
              </div>
            )}

            {state === 'processing' && (
              <div className="flex items-center gap-3 text-blue-400">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
                <span>Processing CSS...</span>
              </div>
            )}

            {state === 'success' && result && (
              <div className="space-y-4">
                {Object.entries(result).map(([selector, data]) => (
                  <div key={selector} className="rounded border border-gray-700 bg-gray-800 p-4">
                    <div className="mb-2 font-mono text-sm font-semibold text-blue-400">
                      {selector}
                    </div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {data.classes.map((cls, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-green-900/30 px-2 py-1 font-mono text-sm text-green-400"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                    {data.warnings.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {data.warnings.map((warning, idx) => (
                          <div key={idx} className="text-xs text-yellow-400">
                            ⚠️ {warning}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      Coverage: {data.coverage.matched}/{data.coverage.total} (
                      {data.coverage.percentage.toFixed(1)}%)
                    </div>
                  </div>
                ))}
              </div>
            )}

            {state === 'error' && error && (
              <div className="rounded border border-red-700 bg-red-900/20 p-4">
                <div className="mb-2 font-semibold text-red-400">{error.name}</div>
                <div className="text-sm text-red-300">{error.message}</div>
                {error.stack && (
                  <pre className="mt-2 overflow-auto text-xs text-red-400">{error.stack}</pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between border-t border-gray-700 bg-gray-900 px-6 py-4">
        <div className="flex gap-3">
          <button
            onClick={handleTransform}
            disabled={state === 'processing'}
            className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state === 'processing' ? 'Processing...' : 'Transform'}
          </button>

          {state === 'processing' && (
            <button
              onClick={cancel}
              className="rounded bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700"
            >
              Cancel
            </button>
          )}

          {(state === 'success' || state === 'error') && (
            <button
              onClick={reset}
              className="rounded bg-gray-700 px-6 py-2 font-semibold text-white hover:bg-gray-600"
            >
              Reset
            </button>
          )}
        </div>

        <div className="text-sm text-gray-400">
          State: <span className="font-semibold text-white">{state}</span>
        </div>
      </div>
    </div>
  );
}

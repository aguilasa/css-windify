import { useState } from 'react';
import { useApp } from '../contexts/AppContext';

export function OutputPanel() {
  const { result } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedClass, setCopiedClass] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedClass(label || text);
      setTimeout(() => setCopiedClass(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const copyAll = () => {
    if (!result) return;
    const allClasses = Object.values(result)
      .flatMap((r: any) => r.classes)
      .join(' ');
    copyToClipboard(allClasses, 'all');
  };

  const filteredResult = result
    ? Object.entries(result).filter(([selector]) =>
        selector.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
        <h2 className="text-sm font-semibold text-white">Tailwind Output</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search selectors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded bg-gray-700 px-3 py-1 text-sm text-white placeholder-gray-400"
          />
          <button
            onClick={copyAll}
            disabled={!result}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {copiedClass === 'all' ? 'Copied!' : 'Copy All'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-900 p-4">
        {!result && <div className="text-gray-400">Transform CSS to see Tailwind classes here</div>}

        {result && filteredResult.length === 0 && (
          <div className="text-gray-400">No results match your search</div>
        )}

        {result && filteredResult.length > 0 && (
          <div className="space-y-4">
            {filteredResult.map(([selector, data]: [string, any]) => (
              <div key={selector} className="rounded border border-gray-700 bg-gray-800 p-4">
                <div className="mb-2 font-mono text-sm font-semibold text-blue-400">{selector}</div>
                <div className="mb-2 flex flex-wrap gap-2">
                  {data.classes?.map((cls: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => copyToClipboard(cls)}
                      className="group relative rounded bg-green-900/30 px-2 py-1 font-mono text-sm text-green-400 hover:bg-green-900/50"
                      title="Click to copy"
                    >
                      {cls}
                      {copiedClass === cls && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-gray-700 px-2 py-1 text-xs text-white">
                          Copied!
                        </span>
                      )}
                    </button>
                  )) || []}
                </div>
                {data.warnings?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {data.warnings.map((warning: string, idx: number) => (
                      <div key={idx} className="text-xs text-yellow-400">
                        ⚠️ {warning}
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  Coverage: {data.coverage?.matched || 0}/{data.coverage?.total || 0} (
                  {data.coverage?.percentage?.toFixed(1) || '0.0'}%)
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

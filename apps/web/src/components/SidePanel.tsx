import { useApp } from '../contexts/AppContext';
import { SettingsPanel } from './SettingsPanel';

export function SidePanel() {
  const { result, activeTab, setActiveTab } = useApp();

  const tabs = [
    { id: 'warnings' as const, label: 'Warnings', count: result ? getTotalWarnings(result) : 0 },
    { id: 'coverage' as const, label: 'Coverage', count: 0 },
    { id: 'settings' as const, label: 'Settings', count: 0 },
  ];

  return (
    <div className="flex h-full flex-col border-l border-gray-700 bg-gray-900">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 rounded-full bg-yellow-600 px-2 py-0.5 text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'warnings' && <WarningsTab result={result} />}
        {activeTab === 'coverage' && <CoverageTab result={result} />}
        {activeTab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  );
}

function WarningsTab({ result }: { result: any }) {
  if (!result) {
    return <div className="text-gray-400">No warnings yet</div>;
  }

  const warnings = Object.entries(result).flatMap(([selector, data]: [string, any]) =>
    (data.warnings || []).map((warning: string) => ({ selector, warning }))
  );

  if (warnings.length === 0) {
    return <div className="text-green-400">✓ No warnings!</div>;
  }

  return (
    <div className="space-y-2">
      {warnings.map((item: any, idx: number) => (
        <div key={idx} className="rounded border border-yellow-700 bg-yellow-900/20 p-3">
          <div className="mb-1 font-mono text-xs text-yellow-400">{item.selector}</div>
          <div className="text-sm text-yellow-300">{item.warning}</div>
        </div>
      ))}
    </div>
  );
}

function CoverageTab({ result }: { result: any }) {
  if (!result) {
    return <div className="text-gray-400">No coverage data yet</div>;
  }

  const totalMatched = Object.values(result).reduce(
    (sum: number, data: any) => sum + (data.coverage?.matched || 0),
    0
  );
  const totalProps = Object.values(result).reduce(
    (sum: number, data: any) => sum + (data.coverage?.total || 0),
    0
  );
  const percentage = totalProps > 0 ? (totalMatched / totalProps) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Overall Coverage */}
      <div className="rounded border border-gray-700 bg-gray-800 p-4">
        <h3 className="mb-2 text-sm font-semibold text-white">Overall Coverage</h3>
        <div className="mb-2 h-4 overflow-hidden rounded-full bg-gray-700">
          <div className="h-full bg-green-500" style={{ width: `${percentage}%` }} />
        </div>
        <div className="text-sm text-gray-400">
          {totalMatched} / {totalProps} properties ({percentage.toFixed(1)}%)
        </div>
      </div>

      {/* Per Selector */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-white">By Selector</h3>
        {Object.entries(result).map(([selector, data]: [string, any]) => (
          <div key={selector} className="rounded border border-gray-700 bg-gray-800 p-3">
            <div className="mb-1 font-mono text-xs text-blue-400">{selector}</div>
            <div className="mb-1 h-2 overflow-hidden rounded-full bg-gray-700">
              <div
                className="h-full bg-green-500"
                style={{ width: `${data.coverage?.percentage || 0}%` }}
              />
            </div>
            <div className="text-xs text-gray-400">
              {data.coverage?.matched || 0}/{data.coverage?.total || 0} (
              {data.coverage?.percentage?.toFixed(1) || '0.0'}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getTotalWarnings(result: any): number {
  return Object.values(result).reduce(
    (sum: number, data: any) => sum + (data.warnings?.length || 0),
    0
  );
}

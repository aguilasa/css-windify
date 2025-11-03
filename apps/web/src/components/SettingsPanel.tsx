import { useApp } from '../contexts/AppContext';

export function SettingsPanel() {
  const { settings, updateSettings } = useApp();

  return (
    <div className="space-y-6">
      {/* Conversion Mode */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">Conversion Mode</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.strict}
              onChange={(e) => updateSettings({ strict: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-300">Strict Mode</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.approximate}
              onChange={(e) => updateSettings({ approximate: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-300">Approximate Mode</span>
          </label>
        </div>
      </div>

      {/* Tailwind Version */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">Tailwind Version</h3>
        <select
          value={settings.version}
          onChange={(e) => updateSettings({ version: e.target.value as any })}
          className="w-full rounded bg-gray-700 px-3 py-2 text-sm text-white"
        >
          <option value="auto">Auto-detect</option>
          <option value="v3">Tailwind v3</option>
          <option value="v4">Tailwind v4</option>
        </select>
      </div>

      {/* Thresholds */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">Thresholds (px)</h3>
        <div className="space-y-3">
          <div>
            <label className="mb-1 flex justify-between text-xs text-gray-400">
              <span>Spacing</span>
              <span>{settings.thresholds.spacingPx}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={settings.thresholds.spacingPx}
              onChange={(e) =>
                updateSettings({
                  thresholds: { ...settings.thresholds, spacingPx: Number(e.target.value) },
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 flex justify-between text-xs text-gray-400">
              <span>Font Size</span>
              <span>{settings.thresholds.fontPx}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={settings.thresholds.fontPx}
              onChange={(e) =>
                updateSettings({
                  thresholds: { ...settings.thresholds, fontPx: Number(e.target.value) },
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1 flex justify-between text-xs text-gray-400">
              <span>Border Radius</span>
              <span>{settings.thresholds.radiiPx}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={settings.thresholds.radiiPx}
              onChange={(e) =>
                updateSettings({
                  thresholds: { ...settings.thresholds, radiiPx: Number(e.target.value) },
                })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Theme */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">Editor Theme</h3>
        <select
          value={settings.theme}
          onChange={(e) => updateSettings({ theme: e.target.value as any })}
          className="w-full rounded bg-gray-700 px-3 py-2 text-sm text-white"
        >
          <option value="vs-dark">Dark</option>
          <option value="vs-light">Light</option>
        </select>
      </div>

      {/* Export Format */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">Export Format</h3>
        <select
          value={settings.exportFormat}
          onChange={(e) => updateSettings({ exportFormat: e.target.value as any })}
          className="w-full rounded bg-gray-700 px-3 py-2 text-sm text-white"
        >
          <option value="json">JSON</option>
          <option value="markdown">Markdown</option>
        </select>
      </div>
    </div>
  );
}

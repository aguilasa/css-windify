import { useState } from 'react';
import { useApp } from '../contexts/AppContext';

export function ExportButton() {
  const { result, cssInput } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const exportAsJSON = () => {
    if (!result) return;
    const json = JSON.stringify(result, null, 2);
    downloadFile(json, 'csswindify-result.json', 'application/json');
    setShowMenu(false);
  };

  const exportAsMarkdown = () => {
    if (!result) return;
    let md = '# CSSWindify Conversion Result\n\n';
    Object.entries(result).forEach(([selector, data]: [string, any]) => {
      md += `## ${selector}\n\n`;
      md += `**Classes:** ${data.classes.join(' ')}\n\n`;
      if (data.warnings.length > 0) {
        md += `**Warnings:**\n${data.warnings.map((w: string) => `- ${w}`).join('\n')}\n\n`;
      }
      md += `**Coverage:** ${data.coverage.matched}/${data.coverage.total} (${data.coverage.percentage.toFixed(1)}%)\n\n`;
    });
    downloadFile(md, 'csswindify-result.md', 'text/markdown');
    setShowMenu(false);
  };

  const copyToClipboard = async () => {
    if (!result) return;
    const allClasses = Object.values(result)
      .flatMap((r: any) => r.classes)
      .join(' ');
    try {
      await navigator.clipboard.writeText(allClasses);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowMenu(false);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareURL = () => {
    const encoded = btoa(encodeURIComponent(cssInput));
    const url = `${window.location.origin}?css=${encoded}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowMenu(false);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={!result}
        className="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {copied ? 'Copied!' : 'Export'}
      </button>

      {showMenu && result && (
        <div className="absolute bottom-full right-0 mb-2 w-48 rounded border border-gray-700 bg-gray-800 py-1 shadow-lg">
          <button
            onClick={copyToClipboard}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
          >
            📋 Copy to Clipboard
          </button>
          <button
            onClick={exportAsJSON}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
          >
            📄 Download JSON
          </button>
          <button
            onClick={exportAsMarkdown}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
          >
            📝 Download Markdown
          </button>
          <button
            onClick={shareURL}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
          >
            🔗 Share URL
          </button>
        </div>
      )}
    </div>
  );
}

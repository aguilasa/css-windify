import { Editor as MonacoEditor, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useRef, useState } from 'react';

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  theme?: 'vs-dark' | 'vs-light';
  language?: string;
  height?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
}

export function Editor({
  value,
  onChange,
  theme = 'vs-dark',
  language = 'css',
  height = '100%',
  options = {},
}: EditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('off');

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure CSS language features
    monaco.languages.css.cssDefaults.setOptions({
      validate: true,
      lint: {
        compatibleVendorPrefixes: 'warning',
        vendorPrefix: 'warning',
        duplicateProperties: 'warning',
        emptyRules: 'warning',
        importStatement: 'ignore',
        boxModel: 'ignore',
        universalSelector: 'ignore',
        zeroUnits: 'ignore',
        fontFaceProperties: 'warning',
        hexColorLength: 'error',
        argumentsInColorFunction: 'error',
        unknownProperties: 'warning',
        ieHack: 'ignore',
        unknownVendorSpecificProperties: 'ignore',
        propertyIgnoredDueToDisplay: 'warning',
        important: 'ignore',
        float: 'ignore',
        idSelector: 'ignore',
      },
    });

    // Monaco's built-in CSS language support provides excellent auto-complete
    // for all CSS properties and values out of the box
  };

  const handleChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 32));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 10));
  };

  const toggleWordWrap = () => {
    setWordWrap((prev) => (prev === 'on' ? 'off' : 'on'));
  };

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    fontSize,
    wordWrap,
    minimap: { enabled: true },
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false,
    },
    ...options,
  };

  return (
    <div className="flex h-full flex-col">
      {/* Editor Controls */}
      <div className="flex items-center gap-2 border-b border-gray-700 bg-gray-800 px-4 py-2">
        <button
          onClick={decreaseFontSize}
          className="rounded bg-gray-700 px-2 py-1 text-sm text-white hover:bg-gray-600"
          title="Decrease font size"
        >
          A-
        </button>
        <span className="text-sm text-gray-300">{fontSize}px</span>
        <button
          onClick={increaseFontSize}
          className="rounded bg-gray-700 px-2 py-1 text-sm text-white hover:bg-gray-600"
          title="Increase font size"
        >
          A+
        </button>

        <div className="mx-2 h-4 w-px bg-gray-600" />

        <button
          onClick={toggleWordWrap}
          className={`rounded px-3 py-1 text-sm ${
            wordWrap === 'on'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
          title="Toggle word wrap"
        >
          Word Wrap: {wordWrap === 'on' ? 'On' : 'Off'}
        </button>

        <div className="ml-auto text-xs text-gray-400">
          {language.toUpperCase()} • {theme === 'vs-dark' ? 'Dark' : 'Light'} Theme
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <MonacoEditor
          height={height}
          language={language}
          theme={theme}
          value={value}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          options={editorOptions}
          loading={
            <div className="flex h-full items-center justify-center bg-gray-900 text-gray-400">
              Loading editor...
            </div>
          }
        />
      </div>
    </div>
  );
}

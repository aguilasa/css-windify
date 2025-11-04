# CSSWindify Web

A web interface for converting CSS to Tailwind CSS classes.

## Overview

CSSWindify Web is a browser-based tool that provides an interactive interface for converting CSS to Tailwind CSS. It uses the Monaco Editor for code editing and leverages the `css-windify-core` package in a web worker to perform the conversions without blocking the UI.

## Planned Features

- Interactive CSS editor with syntax highlighting
- Real-time conversion to Tailwind classes
- Split view showing original CSS and converted Tailwind
- Copy-to-clipboard functionality
- Configurable conversion options (strict mode, approximation, etc.)
- Shareable conversion links
- Theme preview with the converted Tailwind classes

## Implementation Plan

1. **UI Components**
   - Monaco Editor for CSS input

### Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open http://localhost:5173
```

### Build for Production

```bash
# Build the app
pnpm build

# Preview production build
pnpm preview
```

## 📖 Usage Guide

### Basic Usage

1. **Enter CSS** in the left panel (Input)
2. **Click Transform** or press `Ctrl/Cmd + Enter`
3. **View Tailwind classes** in the right panel (Output)
4. **Copy or export** the results

### Examples

Click the **Examples** button in the header to browse pre-loaded CSS examples:

- **Buttons** - Primary, outline styles
- **Cards** - Simple, product cards
- **Forms** - Input fields, complete forms
- **Layouts** - Grid, flexbox, sidebar layouts

### Settings

Access settings via the **Side Panel** → **Settings** tab:

- **Mode**: Strict or Approximate
- **Version**: Auto-detect, v3, or v4
- **Thresholds**: Fine-tune approximation (spacing, font, radii)
- **Theme**: Dark or Light mode

### Keyboard Shortcuts

| Shortcut           | Action          |
| ------------------ | --------------- |
| `Ctrl/Cmd + Enter` | Transform CSS   |
| `Ctrl/Cmd + K`     | Clear input     |
| `Ctrl/Cmd + /`     | Toggle settings |
| `Esc`              | Close modals    |

### Export Options

Click the **Export** button to:

- 📋 **Copy to Clipboard** - Copy all Tailwind classes
- 📄 **Export as JSON** - Download JSON file
- 📝 **Export as Markdown** - Download MD file
- 🔗 **Share URL** - Copy shareable link

### History

Access your last 5 CSS inputs:

- Click **History** in the side panel
- Click any item to load it
- Clear history with the **Clear** button

## 🎨 Example CSS

Try these examples:

**Button:**

```css
.button {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
}
```

**Card:**

```css
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Vite** - Build tool and dev server
- **Monaco Editor** - Code editor (VS Code engine)
- **Tailwind CSS 4** - Styling
- **Web Workers** - Background processing
- **@css-windify/core** - CSS transformation engine

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── components/          # React components
│   │   ├── Layout.tsx       # Main layout
│   │   ├── InputPanel.tsx   # CSS input
│   │   ├── OutputPanel.tsx  # Tailwind output
│   │   ├── SidePanel.tsx    # Side panel with tabs
│   │   ├── SettingsPanel.tsx # Settings
│   │   ├── ExportButton.tsx # Export dropdown
│   │   ├── ExamplesModal.tsx # Examples browser
│   │   └── Editor.tsx       # Monaco wrapper
│   ├── contexts/            # React contexts
│   │   └── AppContext.tsx   # Global state
│   ├── hooks/               # Custom hooks
│   │   └── useWorker.ts     # Web Worker hook
│   ├── types/               # TypeScript types
│   ├── examples.ts          # Pre-loaded examples
│   ├── worker.ts            # Web Worker
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## 📊 Performance

- ⚡ **Fast Transformation** - Web Worker ensures UI stays responsive
- 💾 **Efficient Storage** - Smart caching and localStorage
- 🎯 **Optimized Build** - Code splitting and lazy loading
- 📦 **Small Bundle** - Optimized for production

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](../../CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Editor powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ by the CSSWindify team**

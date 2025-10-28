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
   - Results panel for Tailwind output
   - Configuration panel for options
   - Preview panel for visual representation

2. **Web Worker Integration**
   - Offload CSS processing to a web worker
   - Use `transformCssText` from `css-windify-core` for conversion
   - Handle large CSS files without UI freezing

3. **Features**
   - Real-time conversion as you type
   - Syntax highlighting for both CSS and Tailwind
   - Error handling and validation
   - Export options (CSS, HTML, JSON)

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Next Steps

- Set up basic React application structure
- Implement Monaco Editor integration
- Create web worker for CSS processing
- Design UI components and layout
- Integrate with css-windify-core for CSS transformation
- Add configuration options and preview functionality

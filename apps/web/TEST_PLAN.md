# Web App Test Plan

## 📋 Test Coverage Analysis

### Components to Test (10 components)

1. **Editor.tsx** - Monaco editor wrapper
2. **ExamplesModal.tsx** - Modal with examples
3. **ExportButton.tsx** - Export dropdown
4. **InputPanel.tsx** - CSS input panel
5. **Layout.tsx** - Main layout with keyboard shortcuts
6. **OutputPanel.tsx** - Tailwind output display
7. **SettingsPanel.tsx** - Settings form
8. **SidePanel.tsx** - Tabs panel (warnings/coverage/settings)
9. **EditorExample.tsx** - Example component
10. **WorkerExample.tsx** - Worker example

### Contexts to Test (1 context)

1. **AppContext.tsx** - Global state management

### Hooks to Test (1 hook)

1. **useWorker.ts** - Web Worker communication

### Utilities to Test

1. **examples.ts** - Example data
2. **worker.ts** - Web Worker

---

## 🧪 Test Strategy

### Unit Tests

- Components (isolated)
- Hooks
- Utilities
- Context providers

### Integration Tests

- Component interactions
- Context + Components
- Worker communication

### E2E Tests (Optional)

- Full user flows
- Keyboard shortcuts
- Export functionality

---

## 📦 Test Dependencies

```json
{
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.1.0",
  "@testing-library/user-event": "^14.5.0",
  "@vitest/ui": "^1.2.0",
  "jsdom": "^23.0.0",
  "vitest": "^1.2.0"
}
```

---

## 🎯 Priority Tests

### High Priority

1. ✅ AppContext (state management)
2. ✅ useWorker (worker communication)
3. ✅ examples.ts (data validation)
4. ✅ ExportButton (export logic)
5. ✅ SettingsPanel (form handling)

### Medium Priority

6. ✅ InputPanel (editor integration)
7. ✅ OutputPanel (display logic)
8. ✅ SidePanel (tab navigation)
9. ✅ ExamplesModal (modal behavior)

### Low Priority

10. ✅ Layout (integration)
11. ✅ Editor (Monaco wrapper)

---

## 📝 Test Files Structure

```
apps/web/
├── src/
│   ├── __tests__/
│   │   ├── components/
│   │   │   ├── Editor.test.tsx
│   │   │   ├── ExamplesModal.test.tsx
│   │   │   ├── ExportButton.test.tsx
│   │   │   ├── InputPanel.test.tsx
│   │   │   ├── Layout.test.tsx
│   │   │   ├── OutputPanel.test.tsx
│   │   │   ├── SettingsPanel.test.tsx
│   │   │   └── SidePanel.test.tsx
│   │   ├── contexts/
│   │   │   └── AppContext.test.tsx
│   │   ├── hooks/
│   │   │   └── useWorker.test.ts
│   │   └── utils/
│   │       └── examples.test.ts
│   └── test/
│       ├── setup.ts
│       └── mocks/
│           ├── worker.mock.ts
│           └── monaco.mock.ts
├── vitest.config.ts
└── package.json
```

---

## 🔍 Test Coverage Goals

- **Overall:** 80%+
- **Components:** 75%+
- **Hooks:** 90%+
- **Utils:** 95%+
- **Context:** 90%+

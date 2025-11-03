# Web App Tests

## 🧪 Test Suite

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# UI mode
pnpm test:ui

# Coverage report
pnpm test:coverage
```

### Test Structure

```
__tests__/
├── components/     # Component tests
├── contexts/       # Context tests
├── hooks/          # Hook tests
└── utils/          # Utility tests
```

### Test Files

#### Implemented Tests

1. **utils/examples.test.ts** ✅
   - CSS_EXAMPLES validation
   - getExamplesByCategory
   - getExampleById
   - getCategories

2. **contexts/AppContext.test.tsx** ✅
   - Initial state
   - CSS input management
   - Settings persistence
   - History management
   - Shareable URLs
   - Tab navigation
   - Modal state

#### Pending Tests

3. **hooks/useWorker.test.ts**
   - Worker initialization
   - Transform function
   - Cancel operation
   - Error handling
   - Cleanup

4. **components/ExportButton.test.tsx**
   - Export as JSON
   - Export as Markdown
   - Copy to clipboard
   - Share URL

5. **components/SettingsPanel.test.tsx**
   - Form inputs
   - Settings update
   - Threshold sliders

6. **components/InputPanel.test.tsx**
   - Clear button
   - Format button
   - Character count

7. **components/OutputPanel.test.tsx**
   - Display results
   - Copy classes
   - Search/filter

8. **components/SidePanel.test.tsx**
   - Tab navigation
   - Warnings display
   - Coverage display

9. **components/ExamplesModal.test.tsx**
   - Modal open/close
   - Category selection
   - Load example

10. **components/Layout.test.tsx**
    - Keyboard shortcuts
    - Transform button
    - Responsive behavior

### Coverage Goals

- **Overall:** 80%+
- **Components:** 75%+
- **Hooks:** 90%+
- **Utils:** 95%+
- **Context:** 90%+

### Current Coverage

Run `pnpm test:coverage` to see current coverage.

### Writing Tests

#### Component Test Template

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Component } from '../Component';

describe('Component', () => {
  it('should render', () => {
    render(<Component />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

#### Hook Test Template

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHook } from '../useHook';

describe('useHook', () => {
  it('should work', () => {
    const { result } = renderHook(() => useHook());
    expect(result.current).toBeDefined();
  });
});
```

### Mocks

- **Monaco Editor:** Mocked in setup.ts
- **Web Worker:** Mocked in setup.ts
- **localStorage:** Mocked in setup.ts
- **navigator.clipboard:** Mocked in setup.ts

### CI/CD

Tests run automatically on:

- Pull requests
- Push to main
- Manual workflow dispatch

### Troubleshooting

**Tests not running?**

- Check dependencies: `pnpm install`
- Clear cache: `pnpm vitest --clearCache`

**Coverage too low?**

- Add more test cases
- Test edge cases
- Test error scenarios

**Flaky tests?**

- Use `waitFor` for async operations
- Mock time-dependent code
- Avoid test interdependencies

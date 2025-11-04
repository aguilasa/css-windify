import { afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Setup global mocks before all tests
beforeAll(() => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      get length() {
        return Object.keys(store).length;
      },
      key: (index: number) => {
        const keys = Object.keys(store);
        return keys[index] || null;
      },
    };
  })();

  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  // Mock navigator.clipboard
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn(() => Promise.resolve()),
      readText: vi.fn(() => Promise.resolve('')),
    },
  });

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock crypto.randomUUID
  if (!global.crypto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).crypto = {};
  }
  Object.defineProperty(global.crypto, 'randomUUID', {
    value: () => 'test-uuid-' + Math.random().toString(36).substring(7),
  });

  // Mock window.location
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (window as any).location;
  window.location = {
    ...window.location,
    hash: '',
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    reload: vi.fn(),
    replace: vi.fn(),
    assign: vi.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  if (global.localStorage) {
    global.localStorage.clear();
  }
});

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  Editor: () => null,
}));

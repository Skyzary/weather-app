import '@testing-library/jest-dom'

// Polyfill ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
  value: ResizeObserver,
})

// Polyfill matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Polyfill requestAnimationFrame
globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => setTimeout(callback, 0)
globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id)

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

import { vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
        if (key === 'feelsLike') return 'feelsLike';
        if (options && options.city) return 'weatherInCity';
        return key;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en',
    },
  }),
  initReactI18next: { type: '3rdParty', init: () => {} }
}));

vi.mock('../i18n', () => ({
  default: {
    t: (key: string) => key,
    language: 'en'
  }
}));


import '@testing-library/jest-dom/vitest'

// Polyfill ResizeObserver for Radix UI components in JSDOM
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error polyfill for test env
global.ResizeObserver = ResizeObserverStub

// IndexedDB polyfill for JSDOM (Dexie)
import 'fake-indexeddb/auto'



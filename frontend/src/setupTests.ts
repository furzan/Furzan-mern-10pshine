import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder (needed for react-router)
global.TextEncoder = class TextEncoder {
  encode(str: string) {
    const buf = Buffer.from(str, 'utf-8');
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }
} as any;

global.TextDecoder = class TextDecoder {
  decode(arr: Uint8Array) {
    return Buffer.from(arr).toString('utf-8');
  }
} as any;

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
  },
  writable: true
});

// Mock import.meta.env for Vite
(global as any).import = {
  meta: {
    env: {
      VITE_SERVER_URL: 'http://localhost:3000'
    }
  }
};
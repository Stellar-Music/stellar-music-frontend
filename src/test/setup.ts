// Global test setup for Vitest jsdom environment
const storageMap = new Map<string, string>();

const storageMock = {
  getItem: (key: string) => storageMap.get(key) || null,
  setItem: (key: string, value: string) => storageMap.set(key, String(value)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
  key: (i: number) => Array.from(storageMap.keys())[i] || null,
  get length() {
    return storageMap.size;
  },
};

Object.defineProperty(window, 'localStorage', { value: storageMock, writable: true, configurable: true });
Object.defineProperty(window, 'sessionStorage', { value: storageMock, writable: true, configurable: true });

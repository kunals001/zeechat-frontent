import type { WebStorage } from 'redux-persist';

const createNoopStorage = (): WebStorage => ({
  getItem: async (): Promise<string | null> => null,
  setItem: async (): Promise<void> => {},
  removeItem: async (): Promise<void> => {},
});

const storage: WebStorage = typeof window !== 'undefined'
  ? require('redux-persist/lib/storage').default
  : createNoopStorage();

export default storage;

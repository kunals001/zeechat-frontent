// app/store/storage.ts
const isServer = typeof window === 'undefined';

const createNoopStorage = () => {
  return {
    getItem: (_key: string) => Promise.resolve(null),
    setItem: (_key: string, value: string) => Promise.resolve(value),
    removeItem: (_key: string) => Promise.resolve(),
  };
};

const storage = !isServer
  ? require('redux-persist/lib/storage').default
  : createNoopStorage();

export default storage;

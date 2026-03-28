/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEWS_API_KEY?: string;
  readonly VITE_NEWS_API_COUNTRY?: string;
  readonly VITE_TWELVE_DATA_API_KEY?: string;
  readonly VITE_TWELVE_DATA_SYMBOLS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

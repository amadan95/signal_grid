const parseCsvEnv = (value: string | undefined, fallback: string[]) => {
  const entries = value
    ?.split(',')
    .map((entry) => entry.trim().toUpperCase())
    .filter(Boolean);

  return entries && entries.length > 0 ? entries : fallback;
};

const newsApiKey = import.meta.env.VITE_NEWS_API_KEY?.trim() ?? '';
const newsApiCountry = import.meta.env.VITE_NEWS_API_COUNTRY?.trim().toLowerCase() || 'us';
const twelveDataApiKey = import.meta.env.VITE_TWELVE_DATA_API_KEY?.trim() ?? '';
const twelveDataSymbols = parseCsvEnv(import.meta.env.VITE_TWELVE_DATA_SYMBOLS, [
  'AAPL',
  'MSFT',
  'NVDA',
]);

export const envConfig = {
  newsApiKey,
  newsApiCountry,
  twelveDataApiKey,
  twelveDataSymbols,
} as const;

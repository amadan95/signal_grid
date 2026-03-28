import { fetchTwelveDataQuotes } from '../services/twelveData';
import { formatTimestamp } from '../utils/layout';
import type { Adapter, AdapterFetchContext } from '../types';

interface LiveStocksData {
  tickers: Array<{
    symbol: string;
    price: number;
    change: number;
    percentChange: number;
  }>;
  timestamp: string;
}

export const liveStocksAdapter: Adapter<LiveStocksData> = {
  id: 'liveStocks',
  name: 'Live Markets',
  enabled: Boolean(import.meta.env.VITE_TWELVE_DATA_API_KEY),
  refreshIntervalMs: 10 * 60 * 1000,
  fetchData: async ({ now }: AdapterFetchContext) => ({
    tickers: await fetchTwelveDataQuotes(),
    timestamp: formatTimestamp(now),
  }),
  normalizeToBoardLines: (data, boardConfig) => {
    const lines = [
      'MARKET WATCH',
      ...data.tickers.slice(0, boardConfig.rows - 1).map((stock) => {
        const direction = stock.percentChange >= 0 ? '+' : '-';
        return `${stock.symbol} ${stock.price.toFixed(2)} ${direction}${Math.abs(
          stock.percentChange,
        ).toFixed(1)}`;
      }),
    ];

    return {
      title: 'LIVE MARKET',
      lines,
      timestamp: data.timestamp,
      status: 'ready',
      themeHint: data.tickers.some((stock) => stock.change < 0) ? 'alert' : 'success',
    };
  },
};

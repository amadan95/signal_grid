import { buildMarketBoardLine } from './marketLine';
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
    const marketRows = data.tickers
      .slice(0, boardConfig.rows - 1)
      .map((stock) =>
        buildMarketBoardLine(stock.symbol, stock.price, stock.percentChange),
      );
    const lines = [
      'MARKET WATCH',
      ...marketRows.map((row) => row.text),
    ];

    return {
      title: 'LIVE MARKET',
      lines,
      cellHints: [[], ...marketRows.map((row) => row.hints)],
      timestamp: data.timestamp,
      status: 'ready',
      themeHint: 'default',
    };
  },
};

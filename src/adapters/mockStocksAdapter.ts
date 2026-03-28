import { formatTimestamp } from '../utils/layout';
import type { Adapter, AdapterFetchContext } from '../types';

interface StockData {
  tickers: Array<{
    symbol: string;
    price: number;
    change: number;
  }>;
  timestamp: string;
}

const stockSymbols = ['STRM', 'AERO', 'LUMA', 'ORBT'];

export const mockStocksAdapter: Adapter<StockData> = {
  id: 'mockStocks',
  name: 'Mock Stocks',
  enabled: true,
  refreshIntervalMs: 10000,
  fetchData: ({ now, seed }: AdapterFetchContext) => ({
    tickers: stockSymbols.map((symbol, index) => {
      const drift = ((seed + index * 13) % 27) / 10 - 1.2;
      const price = 100 + index * 42 + drift * 4;
      return {
        symbol,
        price,
        change: drift,
      };
    }),
    timestamp: formatTimestamp(now),
  }),
  normalizeToBoardLines: (data, boardConfig) => {
    const lines = [
      'MARKET WATCH',
      ...data.tickers.slice(0, boardConfig.rows - 1).map((stock) => {
        const direction = stock.change >= 0 ? '+' : '-';
        return `${stock.symbol} ${stock.price.toFixed(1)} ${direction}${Math.abs(stock.change).toFixed(1)}`;
      }),
    ];

    return {
      title: 'MARKET WATCH',
      lines,
      timestamp: data.timestamp,
      status: 'ready',
      themeHint: data.tickers.some((stock) => stock.change < 0) ? 'alert' : 'success',
    };
  },
};

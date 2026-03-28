import { buildMarketBoardLine } from './marketLine';
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
    const marketRows = data.tickers
      .slice(0, boardConfig.rows - 1)
      .map((stock) => buildMarketBoardLine(stock.symbol, stock.price, stock.change, 1));
    const lines = [
      'MARKET WATCH',
      ...marketRows.map((row) => row.text),
    ];

    return {
      title: 'MARKET WATCH',
      lines,
      cellHints: [[], ...marketRows.map((row) => row.hints)],
      timestamp: data.timestamp,
      status: 'ready',
      themeHint: 'default',
    };
  },
};

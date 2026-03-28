import { envConfig } from '../config/env';

interface TwelveDataQuoteResponse {
  symbol?: string;
  close?: string;
  price?: string;
  change?: string;
  percent_change?: string;
  status?: string;
  message?: string;
}

export interface MarketTicker {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
}

const TWELVE_DATA_QUOTE_URL = 'https://api.twelvedata.com/quote';

const parseNumericField = (value: string | undefined, fallback = 0) => {
  if (!value) return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const fetchQuote = async (symbol: string): Promise<MarketTicker> => {
  const params = new URLSearchParams({
    symbol,
    apikey: envConfig.twelveDataApiKey,
  });

  const response = await fetch(`${TWELVE_DATA_QUOTE_URL}?${params.toString()}`);
  const data = (await response.json()) as TwelveDataQuoteResponse;

  if (!response.ok || data.status === 'error') {
    throw new Error(data.message || `Twelve Data request failed for ${symbol}`);
  }

  return {
    symbol,
    price: parseNumericField(data.close ?? data.price),
    change: parseNumericField(data.change),
    percentChange: parseNumericField(data.percent_change),
  };
};

export const fetchTwelveDataQuotes = async () => {
  if (!envConfig.twelveDataApiKey) {
    throw new Error('Twelve Data API key is missing');
  }

  return Promise.all(envConfig.twelveDataSymbols.map((symbol) => fetchQuote(symbol)));
};

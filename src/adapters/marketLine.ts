import type { BoardThemeHint } from '../types';

export interface MarketBoardLine {
  text: string;
  hints: Array<BoardThemeHint | undefined>;
}

export const buildMarketBoardLine = (
  symbol: string,
  price: number,
  percentChange: number,
  pricePrecision = 2,
): MarketBoardLine => {
  const direction = percentChange >= 0 ? '+' : '-';
  const percentText = `${direction}${Math.abs(percentChange).toFixed(1)}%`;
  const text = `${symbol} ${price.toFixed(pricePrecision)} ${percentText}`;
  const percentStartIndex = text.length - percentText.length;
  const hint = percentChange >= 0 ? 'success' : 'alert';
  const hints = Array.from({ length: text.length }, (_, index) =>
    index >= percentStartIndex ? hint : undefined,
  );

  return {
    text,
    hints,
  };
};

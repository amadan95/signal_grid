import { envConfig } from '../config/env';
import { fetchNewsApiHeadline } from '../services/newsApi';
import { splitIntoBoardLines } from '../utils/layout';
import type { Adapter, AdapterFetchContext } from '../types';

interface LiveSportsData {
  headline: string;
  source: string;
}

export const liveSportsAdapter: Adapter<LiveSportsData> = {
  id: 'liveSports',
  name: 'Live Sports',
  enabled: Boolean(envConfig.newsApiKey),
  refreshIntervalMs: 45 * 60 * 1000,
  fetchData: async ({ seed }: AdapterFetchContext) => {
    const story = await fetchNewsApiHeadline('sports', seed);
    return {
      headline: story.title,
      source: story.source,
    };
  },
  normalizeToBoardLines: (data, boardConfig) => ({
    title: 'SPORTS WIRE',
    lines: splitIntoBoardLines(
      data.headline,
      boardConfig.columns,
      boardConfig.rows,
    ),
    timestamp: data.source.toUpperCase().slice(0, 12),
    status: 'ready',
    themeHint: 'cool',
  }),
};

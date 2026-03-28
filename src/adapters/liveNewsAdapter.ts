import { envConfig } from '../config/env';
import { fetchNewsApiHeadline } from '../services/newsApi';
import { splitIntoBoardLines } from '../utils/layout';
import type { Adapter, AdapterFetchContext } from '../types';

interface LiveNewsData {
  headline: string;
  source: string;
}

export const liveNewsAdapter: Adapter<LiveNewsData> = {
  id: 'liveNews',
  name: 'Live News',
  enabled: Boolean(envConfig.newsApiKey),
  refreshIntervalMs: 45 * 60 * 1000,
  fetchData: async ({ seed }: AdapterFetchContext) => {
    const story = await fetchNewsApiHeadline('general', seed);
    return {
      headline: story.title,
      source: story.source,
    };
  },
  normalizeToBoardLines: (data, boardConfig) => ({
    title: 'TOP STORY',
    lines: splitIntoBoardLines(
      data.headline,
      boardConfig.columns,
      boardConfig.rows,
    ),
    timestamp: data.source.toUpperCase().slice(0, 12),
    status: 'ready',
    themeHint: 'default',
  }),
};

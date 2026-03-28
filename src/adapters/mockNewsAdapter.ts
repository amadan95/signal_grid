import { splitIntoBoardLines } from '../utils/layout';
import type { Adapter, AdapterFetchContext } from '../types';

const mockHeadlines = [
  'Orbital rail network approves a dawn launch corridor expansion',
  'Transit AI trims commuter delays across the eastern spine',
  'Retro hardware auction sends electromechanical displays surging',
  'Autonomous weather drones map a fast-moving Atlantic front',
  'Mission control archive restores century-old navigation telemetry',
];

interface NewsData {
  headline: string;
}

const pickHeadline = ({ seed }: AdapterFetchContext) =>
  mockHeadlines[seed % mockHeadlines.length];

export const mockNewsAdapter: Adapter<NewsData> = {
  id: 'mockNews',
  name: 'Mock News',
  enabled: true,
  refreshIntervalMs: 15000,
  fetchData: (context) => ({
    headline: pickHeadline(context),
  }),
  normalizeToBoardLines: (data, boardConfig) => ({
    title: 'NEWS BULLETIN',
    lines: splitIntoBoardLines(data.headline, boardConfig.columns, boardConfig.rows),
    timestamp: 'WIRE',
    status: 'ready',
    themeHint: 'default',
  }),
};

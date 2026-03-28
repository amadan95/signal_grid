import { formatTimestamp } from '../utils/layout';
import type { Adapter, AdapterFetchContext } from '../types';

interface WeatherData {
  city: string;
  temperatureF: number;
  condition: string;
  windMph: number;
  updated: string;
}

const conditions = ['CLEAR', 'LOW CLOUD', 'DRIZZLE', 'SUN BREAKS'];

export const mockWeatherAdapter: Adapter<WeatherData> = {
  id: 'mockWeather',
  name: 'Mock Weather',
  enabled: true,
  refreshIntervalMs: 12000,
  fetchData: ({ now, seed }: AdapterFetchContext) => ({
    city: 'NEW YORK',
    temperatureF: 58 + (seed % 10),
    condition: conditions[seed % conditions.length],
    windMph: 6 + (seed % 8),
    updated: formatTimestamp(now),
  }),
  normalizeToBoardLines: (data, boardConfig) => {
    const lines = [
      'WEATHER DESK',
      `${data.city} ${Math.round(data.temperatureF)}F`,
      `${data.condition}`,
      `WIND ${Math.round(data.windMph)} MPH`,
    ].slice(0, boardConfig.rows);

    while (lines.length < boardConfig.rows) {
      lines.push(' '.repeat(boardConfig.columns));
    }

    return {
      title: 'WEATHER DESK',
      lines,
      timestamp: data.updated,
      status: 'ready',
      themeHint: 'cool',
    };
  },
};

import { createCustomMessageAdapter } from './customMessageAdapter';
import { liveNewsAdapter } from './liveNewsAdapter';
import { liveSportsAdapter } from './liveSportsAdapter';
import { liveStocksAdapter } from './liveStocksAdapter';
import { mockNewsAdapter } from './mockNewsAdapter';
import { mockStocksAdapter } from './mockStocksAdapter';
import { mockWeatherAdapter } from './mockWeatherAdapter';
import type { Adapter } from '../types';

export type RegisteredAdapter = Adapter<any>;

export const createAdapterRegistry = (customMessage: string): RegisteredAdapter[] =>
  [
    createCustomMessageAdapter(customMessage),
    liveNewsAdapter,
    liveSportsAdapter,
    liveStocksAdapter,
    mockNewsAdapter,
    mockStocksAdapter,
    mockWeatherAdapter,
  ].filter((adapter) => adapter.enabled);

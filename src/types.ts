export type AnimationMode = 'precise' | 'mechanical' | 'fastTicker';

export type ThemeId = 'analogSentinel' | 'nightShift' | 'terminalEmber';

export type BoardThemeHint = 'default' | 'alert' | 'success' | 'cool';

export type BoardStatus = 'ready' | 'loading' | 'offline' | 'error';

export interface BoardConfig {
  columns: number;
  rows: number;
  animationMode: AnimationMode;
  ripple: number;
  flipDurationMs: number;
  characterSet: string;
}

export interface DisplayPayload {
  title: string;
  lines: string[];
  cellHints?: Array<Array<BoardThemeHint | undefined>>;
  timestamp: string;
  status: BoardStatus;
  themeHint?: BoardThemeHint;
}

export interface AdapterFetchContext {
  seed: number;
  now: Date;
}

export interface Adapter<TData = unknown> {
  id: string;
  name: string;
  enabled: boolean;
  refreshIntervalMs: number;
  fetchData: (context: AdapterFetchContext) => Promise<TData> | TData;
  normalizeToBoardLines: (
    data: TData,
    boardConfig: BoardConfig,
  ) => DisplayPayload;
}

export interface FeedSnapshot {
  adapterId: string;
  adapterName: string;
  payload: DisplayPayload;
  fetchedAt: number;
}

export interface BoardCellTransition {
  index: number;
  row: number;
  column: number;
  delayMs: number;
}

export interface AudioSettings {
  muted: boolean;
  volume: number;
  density: number;
}

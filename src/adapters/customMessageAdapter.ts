import { DEFAULT_CUSTOM_MESSAGE } from '../constants';
import { fitLinesToBoard, splitIntoBoardLines } from '../utils/layout';
import type { Adapter } from '../types';

interface CustomMessageData {
  message: string;
}

export const createCustomMessageAdapter = (message: string): Adapter<CustomMessageData> => ({
  id: 'customMessage',
  name: 'Custom Message',
  enabled: true,
  refreshIntervalMs: 60000,
  fetchData: () => ({
    message: message || DEFAULT_CUSTOM_MESSAGE,
  }),
  normalizeToBoardLines: (data, boardConfig) => {
    const segments = data.message
      .split('|')
      .map((part) => part.trim())
      .filter(Boolean);

    const hasManualLineBreaks = segments.length > 1;
    const title = hasManualLineBreaks ? 'MANUAL PROGRAM' : 'MANUAL FEED';

    const lines = hasManualLineBreaks
      ? fitLinesToBoard(segments.slice(0, boardConfig.rows), boardConfig)
      : splitIntoBoardLines(data.message, boardConfig.columns, boardConfig.rows);

    while (lines.length < boardConfig.rows) {
      lines.push(''.padEnd(boardConfig.columns, ' '));
    }

    return {
      title,
      lines,
      timestamp: 'LIVE',
      status: 'ready',
      themeHint: 'default',
    };
  },
});

import type { BoardCellTransition, BoardConfig } from '../types';

export const buildBoardSchedule = (config: BoardConfig): BoardCellTransition[] => {
  const centerRow = (config.rows - 1) / 2;
  const centerColumn = (config.columns - 1) / 2;

  return Array.from({ length: config.rows * config.columns }, (_, index) => {
    const row = Math.floor(index / config.columns);
    const column = index % config.columns;
    const rippleDistance =
      Math.abs(row - centerRow) * 0.75 + Math.abs(column - centerColumn) * 0.42;
    const delayMs = Math.round(rippleDistance * config.ripple * 22);

    return {
      index,
      row,
      column,
      delayMs,
    };
  });
};

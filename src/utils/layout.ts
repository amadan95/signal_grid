import { DEFAULT_CHARACTER_SET } from '../constants';
import type { BoardConfig, BoardThemeHint } from '../types';

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const sanitizeForBoardText = (
  input: string,
  characterSet = DEFAULT_CHARACTER_SET,
) => {
  const normalized = input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^ -~]/g, ' ')
    .split('')
    .map((char) => (characterSet.includes(char) || char === ' ' ? char : ' '))
    .join('');

  return normalized.replace(/\s+/g, ' ').trim();
};

export const splitIntoBoardLines = (
  input: string,
  columns: number,
  rows: number,
): string[] => {
  const normalized = sanitizeForBoardText(input);

  if (!normalized) {
    return Array.from({ length: rows }, () => ''.padEnd(columns, ' '));
  }

  const words = normalized.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  const pushLine = (line: string) => {
    lines.push(line.slice(0, columns).padEnd(columns, ' '));
  };

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
      continue;
    }

    if (`${currentLine} ${word}`.length <= columns) {
      currentLine = `${currentLine} ${word}`;
      continue;
    }

    pushLine(currentLine);
    currentLine = word;
  }

  if (currentLine) {
    pushLine(currentLine);
  }

  while (lines.length < rows) {
    lines.push(''.padEnd(columns, ' '));
  }

  return lines.slice(0, rows);
};

export const fitLinesToBoard = (
  lines: string[],
  config: BoardConfig,
): string[] => {
  const next = lines
    .slice(0, config.rows)
    .map((line) =>
      sanitizeForBoardText(line, config.characterSet)
        .slice(0, config.columns)
        .padEnd(config.columns, ' '),
    );

  while (next.length < config.rows) {
    next.push(''.padEnd(config.columns, ' '));
  }

  return next;
};

export const fitCellHintsToBoard = (
  rows: Array<Array<BoardThemeHint | undefined>> | undefined,
  config: BoardConfig,
) => {
  const next = (rows ?? [])
    .slice(0, config.rows)
    .map((row) => row.slice(0, config.columns));

  while (next.length < config.rows) {
    next.push([]);
  }

  return next.map((row) =>
    Array.from({ length: config.columns }, (_, index) => row[index]),
  );
};

export const boardLinesToChars = (lines: string[]): string[] =>
  lines.flatMap((line) => line.split(''));

export const formatTimestamp = (date: Date) =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);

export const randomFromSeed = (seed: number) => {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

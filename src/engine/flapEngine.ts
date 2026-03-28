import type { AnimationMode, BoardConfig } from '../types';

export const mechanicalCharacterSet = (
  characterSet: string,
  input: string,
): string =>
  input.toUpperCase().split('').find((char) => characterSet.includes(char)) ?? ' ';

const getModeLoops = (mode: AnimationMode) => {
  switch (mode) {
    case 'precise':
      return 0;
    case 'fastTicker':
      return 1;
    case 'mechanical':
    default:
      return 2;
  }
};

export const getStepSequence = (
  fromChar: string,
  toChar: string,
  config: Pick<BoardConfig, 'characterSet' | 'animationMode'>,
): string[] => {
  const set = config.characterSet;
  const from = mechanicalCharacterSet(set, fromChar);
  const to = mechanicalCharacterSet(set, toChar);
  if (from === to) return [to];

  const fromIndex = set.indexOf(from);
  const toIndex = set.indexOf(to);
  const length = set.length;
  const loops = getModeLoops(config.animationMode);
  const distance =
    (toIndex - fromIndex + length + loops * length) % length || length;

  return Array.from({ length: distance }, (_, index) => {
    const stepIndex = (fromIndex + index + 1) % length;
    return set[stepIndex];
  });
};

export const estimateStepDurationMs = (mode: AnimationMode, baseDuration: number) => {
  switch (mode) {
    case 'precise':
      return Math.max(140, baseDuration + 20);
    case 'fastTicker':
      return Math.max(80, baseDuration - 40);
    case 'mechanical':
    default:
      return Math.max(110, baseDuration);
  }
};

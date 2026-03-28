import type { ThemeId } from '../types';

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  className: string;
  description: string;
}

export const themes: ThemeDefinition[] = [
  {
    id: 'analogSentinel',
    label: 'Analog Sentinel',
    className: 'theme-analog-sentinel',
    description: 'Obsidian chassis with amber active state and mission-control glow.',
  },
  {
    id: 'nightShift',
    label: 'Night Shift',
    className: 'theme-night-shift',
    description: 'Cooler deck tones with cyan telemetry and softened contrast.',
  },
  {
    id: 'terminalEmber',
    label: 'Terminal Ember',
    className: 'theme-terminal-ember',
    description: 'A warmer red-amber board inspired by emergency relay stations.',
  },
];

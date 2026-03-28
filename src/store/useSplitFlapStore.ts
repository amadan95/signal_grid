import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_CHARACTER_SET, DEFAULT_CUSTOM_MESSAGE } from '../constants';
import type {
  AudioSettings,
  BoardConfig,
  DisplayPayload,
  FeedSnapshot,
  ThemeId,
} from '../types';

interface SplitFlapState {
  boardConfig: BoardConfig;
  themeId: ThemeId;
  audio: AudioSettings;
  reducedMotion: boolean;
  controlDeckCollapsed: boolean;
  rotationEnabled: boolean;
  rotationIntervalMs: number;
  activeFeedId: string;
  playlist: string[];
  feedSnapshots: Record<string, FeedSnapshot>;
  currentPayload: DisplayPayload;
  customMessage: string;
  fullscreen: boolean;
  setBoardConfig: (patch: Partial<BoardConfig>) => void;
  setThemeId: (themeId: ThemeId) => void;
  setAudio: (patch: Partial<AudioSettings>) => void;
  setReducedMotion: (value: boolean) => void;
  setControlDeckCollapsed: (value: boolean) => void;
  toggleControlDeck: () => void;
  setRotationEnabled: (value: boolean) => void;
  setRotationIntervalMs: (value: number) => void;
  setActiveFeedId: (id: string) => void;
  setPlaylist: (playlist: string[]) => void;
  setFeedSnapshot: (snapshot: FeedSnapshot) => void;
  setCurrentPayload: (payload: DisplayPayload) => void;
  setCustomMessage: (value: string) => void;
  setFullscreen: (value: boolean) => void;
}

interface PersistedSplitFlapState {
  boardConfig: BoardConfig;
  themeId: ThemeId;
  audio: AudioSettings;
  reducedMotion: boolean;
  controlDeckCollapsed: boolean;
  rotationEnabled: boolean;
  rotationIntervalMs: number;
  activeFeedId: string;
  playlist: string[];
  customMessage: string;
}

const defaultBoardConfig: BoardConfig = {
  columns: 20,
  rows: 4,
  animationMode: 'mechanical',
  ripple: 1,
  flipDurationMs: 160,
  characterSet: DEFAULT_CHARACTER_SET,
};

const defaultPayload: DisplayPayload = {
  title: 'SYSTEM READY',
  lines: ['ANALOG SENTINEL', 'SYSTEM INITIALIZING', 'STANDBY FOR FEEDS'],
  timestamp: 'BOOT',
  status: 'loading',
  themeHint: 'default',
};

const defaultPersistedState: PersistedSplitFlapState = {
  boardConfig: defaultBoardConfig,
  themeId: 'analogSentinel',
  audio: {
    muted: false,
    volume: 0.65,
    density: 0.6,
  },
  reducedMotion: false,
  controlDeckCollapsed: true,
  rotationEnabled: true,
  rotationIntervalMs: 6000,
  activeFeedId: 'customMessage',
  playlist: ['customMessage', 'mockNews', 'mockStocks', 'mockWeather'],
  customMessage: DEFAULT_CUSTOM_MESSAGE,
};

export const useSplitFlapStore = create<SplitFlapState>()(
  persist(
    (set) => ({
      boardConfig: defaultBoardConfig,
      themeId: defaultPersistedState.themeId,
      audio: defaultPersistedState.audio,
      reducedMotion: defaultPersistedState.reducedMotion,
      controlDeckCollapsed: defaultPersistedState.controlDeckCollapsed,
      rotationEnabled: defaultPersistedState.rotationEnabled,
      rotationIntervalMs: defaultPersistedState.rotationIntervalMs,
      activeFeedId: defaultPersistedState.activeFeedId,
      playlist: defaultPersistedState.playlist,
      feedSnapshots: {},
      currentPayload: defaultPayload,
      customMessage: defaultPersistedState.customMessage,
      fullscreen: false,
      setBoardConfig: (patch) =>
        set((state) => ({
          boardConfig: {
            ...state.boardConfig,
            ...patch,
          },
        })),
      setThemeId: (themeId) => set({ themeId }),
      setAudio: (patch) =>
        set((state) => ({
          audio: {
            ...state.audio,
            ...patch,
          },
        })),
      setReducedMotion: (value) => set({ reducedMotion: value }),
      setControlDeckCollapsed: (value) => set({ controlDeckCollapsed: value }),
      toggleControlDeck: () =>
        set((state) => ({ controlDeckCollapsed: !state.controlDeckCollapsed })),
      setRotationEnabled: (value) => set({ rotationEnabled: value }),
      setRotationIntervalMs: (value) => set({ rotationIntervalMs: value }),
      setActiveFeedId: (activeFeedId) => set({ activeFeedId }),
      setPlaylist: (playlist) => set({ playlist }),
      setFeedSnapshot: (snapshot) =>
        set((state) => ({
          feedSnapshots: {
            ...state.feedSnapshots,
            [snapshot.adapterId]: snapshot,
          },
        })),
      setCurrentPayload: (currentPayload) => set({ currentPayload }),
      setCustomMessage: (customMessage) => set({ customMessage }),
      setFullscreen: (fullscreen) => set({ fullscreen }),
    }),
    {
      name: 'split-flap-display-store',
      version: 3,
      migrate: (persistedState) => {
        const state = persistedState as Partial<PersistedSplitFlapState>;
        return {
          ...defaultPersistedState,
          ...state,
          controlDeckCollapsed: true,
          boardConfig: {
            ...defaultBoardConfig,
            ...state.boardConfig,
            characterSet: DEFAULT_CHARACTER_SET,
          },
        };
      },
      partialize: (state) => ({
        boardConfig: state.boardConfig,
        themeId: state.themeId,
        audio: state.audio,
        reducedMotion: state.reducedMotion,
        controlDeckCollapsed: state.controlDeckCollapsed,
        rotationEnabled: state.rotationEnabled,
        rotationIntervalMs: state.rotationIntervalMs,
        activeFeedId: state.activeFeedId,
        playlist: state.playlist,
        customMessage: state.customMessage,
      }),
    },
  ),
);

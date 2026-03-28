import { useEffect, useMemo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { createAdapterRegistry } from '../adapters/registry';
import { useSplitFlapStore } from '../store/useSplitFlapStore';
import { fitLinesToBoard } from '../utils/layout';

export function useDisplayController() {
  const {
    activeFeedId,
    boardConfig,
    customMessage,
    feedSnapshots,
    playlist,
    rotationEnabled,
    rotationIntervalMs,
    setActiveFeedId,
    setCurrentPayload,
    setFeedSnapshot,
  } = useSplitFlapStore(useShallow((state) => ({
    activeFeedId: state.activeFeedId,
    boardConfig: state.boardConfig,
    customMessage: state.customMessage,
    feedSnapshots: state.feedSnapshots,
    playlist: state.playlist,
    rotationEnabled: state.rotationEnabled,
    rotationIntervalMs: state.rotationIntervalMs,
    setActiveFeedId: state.setActiveFeedId,
    setCurrentPayload: state.setCurrentPayload,
    setFeedSnapshot: state.setFeedSnapshot,
  })));

  const registry = useMemo(() => createAdapterRegistry(customMessage), [customMessage]);
  const registryMap = useMemo(
    () => Object.fromEntries(registry.map((adapter) => [adapter.id, adapter])),
    [registry],
  );
  const rotationIndexRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const intervals: number[] = [];

    const createErrorPayload = (adapterName: string) => ({
      title: 'SOURCE ERROR',
      lines: fitLinesToBoard(
        [
          `${adapterName} OFFLINE`,
          'CHECK API KEY',
          'OR QUOTA LIMIT',
        ],
        boardConfig,
      ),
      timestamp: 'ERROR',
      status: 'error' as const,
      themeHint: 'alert' as const,
    });

    const fetchAdapter = async (adapterId: string, seedOffset = 0) => {
      const adapter = registryMap[adapterId];
      if (!adapter) return;
      const now = new Date();

      try {
        const data = await adapter.fetchData({
          seed: Math.floor(now.getTime() / Math.max(1, adapter.refreshIntervalMs)) + seedOffset,
          now,
        });

        if (cancelled) return;

        const payload = adapter.normalizeToBoardLines(data, boardConfig);
        const snapshot = {
          adapterId: adapter.id,
          adapterName: adapter.name,
          payload,
          fetchedAt: now.getTime(),
        };
        setFeedSnapshot(snapshot);

        if (adapter.id === activeFeedId) {
          setCurrentPayload(payload);
        }
      } catch {
        if (cancelled) return;

        const payload = createErrorPayload(adapter.name.toUpperCase());
        const snapshot = {
          adapterId: adapter.id,
          adapterName: adapter.name,
          payload,
          fetchedAt: now.getTime(),
        };
        setFeedSnapshot(snapshot);

        if (adapter.id === activeFeedId) {
          setCurrentPayload(payload);
        }
      }
    };

    registry.forEach((adapter, index) => {
      void fetchAdapter(adapter.id, index);
      const intervalId = window.setInterval(() => {
        void fetchAdapter(adapter.id, index);
      }, adapter.refreshIntervalMs);
      intervals.push(intervalId);
    });

    return () => {
      cancelled = true;
      intervals.forEach((intervalId) => window.clearInterval(intervalId));
    };
  }, [
    activeFeedId,
    boardConfig,
    registry,
    registryMap,
    setCurrentPayload,
    setFeedSnapshot,
  ]);

  useEffect(() => {
    const activeSnapshot = feedSnapshots[activeFeedId];
    if (activeSnapshot) {
      setCurrentPayload(activeSnapshot.payload);
    }
  }, [activeFeedId, feedSnapshots, setCurrentPayload]);

  useEffect(() => {
    const activeIndex = playlist.indexOf(activeFeedId);
    if (activeIndex >= 0) {
      rotationIndexRef.current = activeIndex;
    }
  }, [activeFeedId, playlist]);

  useEffect(() => {
    if (!rotationEnabled || playlist.length === 0) return;

    const intervalId = window.setInterval(() => {
      rotationIndexRef.current = (rotationIndexRef.current + 1) % playlist.length;
      setActiveFeedId(playlist[rotationIndexRef.current]);
    }, rotationIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [playlist, rotationEnabled, rotationIntervalMs, setActiveFeedId]);

  return registry;
}

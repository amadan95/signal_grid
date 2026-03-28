import { useMemo } from 'react';
import { buildBoardSchedule } from '../engine/animationScheduler';
import { fitLinesToBoard } from '../utils/layout';
import { SplitFlapRow } from './SplitFlapRow';
import { useSplitFlapStore } from '../store/useSplitFlapStore';
import type { DisplayPayload } from '../types';

interface SplitFlapBoardProps {
  feedLabel: string;
  payload: DisplayPayload;
}

const statusLabels: Record<DisplayPayload['status'], string> = {
  ready: 'Ready',
  loading: 'Loading',
  offline: 'Offline',
  error: 'Fault',
};

export function SplitFlapBoard({ feedLabel, payload }: SplitFlapBoardProps) {
  const boardConfig = useSplitFlapStore((state) => state.boardConfig);

  const normalizedLines = useMemo(
    () => fitLinesToBoard(payload.lines, boardConfig),
    [boardConfig, payload.lines],
  );

  const rowDelays = useMemo(() => {
    const schedule = buildBoardSchedule(boardConfig);
    return Array.from({ length: boardConfig.rows }, (_, rowIndex) =>
      schedule
        .filter((cell) => cell.row === rowIndex)
        .sort((left, right) => left.column - right.column)
        .map((cell) => cell.delayMs),
    );
  }, [boardConfig]);

  return (
    <section className="boardConsole">
      <div className={`boardFrame hint-${payload.themeHint ?? 'default'}`}>
        <div className="boardFrame__hud">
          <div className="boardChip">{feedLabel}</div>
          <div className="boardChip boardChip--muted">{payload.title}</div>
          <div className={`boardChip boardChip--status status-${payload.status}`}>
            <span className="statusDot" />
            <span>{statusLabels[payload.status]}</span>
            <span className="boardChip__divider" />
            <span>{payload.timestamp}</span>
          </div>
        </div>
        <div
          className="boardFrame__inner"
          style={{ ['--board-rows' as string]: String(boardConfig.rows) }}
        >
          {normalizedLines.map((rowText, index) => (
            <SplitFlapRow
              key={index}
              rowText={rowText}
              delays={rowDelays[index] ?? []}
              hint={payload.themeHint}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

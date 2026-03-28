import { useMemo } from 'react';
import { buildBoardSchedule } from '../engine/animationScheduler';
import { fitCellHintsToBoard, fitLinesToBoard } from '../utils/layout';
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
  const secondaryLabel =
    payload.title.trim() && payload.title.toUpperCase() !== feedLabel.toUpperCase()
      ? payload.title
      : null;
  const visibleRows = useMemo(() => {
    const lastContentRowIndex = payload.lines.reduce((lastIndex, line, index) => {
      return line.trim().length > 0 ? index : lastIndex;
    }, -1);

    if (lastContentRowIndex < 0) {
      return boardConfig.rows;
    }

    return Math.max(3, Math.min(boardConfig.rows, lastContentRowIndex + 1));
  }, [boardConfig.rows, payload.lines]);

  const renderConfig = useMemo(
    () => ({
      ...boardConfig,
      rows: visibleRows,
    }),
    [boardConfig, visibleRows],
  );

  const normalizedLines = useMemo(
    () => fitLinesToBoard(payload.lines, renderConfig),
    [payload.lines, renderConfig],
  );
  const normalizedCellHints = useMemo(
    () => fitCellHintsToBoard(payload.cellHints, renderConfig),
    [payload.cellHints, renderConfig],
  );

  const rowDelays = useMemo(() => {
    const schedule = buildBoardSchedule(renderConfig);
    return Array.from({ length: renderConfig.rows }, (_, rowIndex) =>
      schedule
        .filter((cell) => cell.row === rowIndex)
        .sort((left, right) => left.column - right.column)
        .map((cell) => cell.delayMs),
    );
  }, [renderConfig]);

  return (
    <section className="boardConsole">
      <div className={`boardFrame hint-${payload.themeHint ?? 'default'}`}>
        <div className="boardTelemetry">
          <div className="boardTelemetry__sourceGroup">
            <span className="boardTelemetry__source">{feedLabel}</span>
            {secondaryLabel ? (
              <span className="boardTelemetry__detail">{secondaryLabel}</span>
            ) : null}
          </div>
          <div className={`boardTelemetry__status status-${payload.status}`}>
            <span className="statusDot" />
            <span>{statusLabels[payload.status]}</span>
          </div>
          <div className="boardTelemetry__timestamp">{payload.timestamp}</div>
        </div>
        <div
          className="boardFrame__inner"
          style={{ ['--board-rows' as string]: String(visibleRows) }}
        >
          {normalizedLines.map((rowText, index) => (
            <SplitFlapRow
              cellHints={normalizedCellHints[index]}
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

import { SplitFlapCell } from './SplitFlapCell';
import type { BoardThemeHint } from '../types';

interface SplitFlapRowProps {
  rowText: string;
  cellHints?: Array<BoardThemeHint | undefined>;
  delays: number[];
  hint?: BoardThemeHint;
}

export function SplitFlapRow({ rowText, cellHints, delays, hint }: SplitFlapRowProps) {
  return (
    <div
      className="splitFlapRow"
      role="row"
      style={{ gridTemplateColumns: `repeat(${rowText.length}, minmax(0, 1fr))` }}
    >
      {rowText.split('').map((char, index) => (
        <SplitFlapCell
          key={index}
          char={char}
          delayMs={delays[index] ?? 0}
          hint={cellHints?.[index] ?? hint}
        />
      ))}
    </div>
  );
}

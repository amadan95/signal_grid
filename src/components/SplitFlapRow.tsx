import { SplitFlapCell } from './SplitFlapCell';
import type { BoardThemeHint } from '../types';

interface SplitFlapRowProps {
  rowText: string;
  delays: number[];
  hint?: BoardThemeHint;
}

export function SplitFlapRow({ rowText, delays, hint }: SplitFlapRowProps) {
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
          hint={hint}
        />
      ))}
    </div>
  );
}

import { useSplitFlapStore } from '../../store/useSplitFlapStore';

export function BoardPanel() {
  const boardConfig = useSplitFlapStore((state) => state.boardConfig);
  const setBoardConfig = useSplitFlapStore((state) => state.setBoardConfig);

  return (
    <>
      <div className="gridFields">
        <label className="field">
          <span>Columns</span>
          <input
            inputMode="numeric"
            max={24}
            min={12}
            onChange={(event) => setBoardConfig({ columns: Number(event.target.value) })}
            type="number"
            value={boardConfig.columns}
          />
        </label>
        <label className="field">
          <span>Rows</span>
          <input
            inputMode="numeric"
            max={6}
            min={3}
            onChange={(event) => setBoardConfig({ rows: Number(event.target.value) })}
            type="number"
            value={boardConfig.rows}
          />
        </label>
      </div>

      <label className="field">
        <span>Mode</span>
        <select
          onChange={(event) =>
            setBoardConfig({
              animationMode: event.target.value as typeof boardConfig.animationMode,
            })
          }
          value={boardConfig.animationMode}
        >
          <option value="precise">Precise</option>
          <option value="mechanical">Mechanical</option>
          <option value="fastTicker">Fast ticker</option>
        </select>
      </label>

      <label className="rangeField">
        <div className="rangeField__header">
          <span>Flip speed</span>
          <strong>{boardConfig.flipDurationMs} ms</strong>
        </div>
        <input
          max={260}
          min={90}
          onChange={(event) =>
            setBoardConfig({ flipDurationMs: Number(event.target.value) })
          }
          step={5}
          type="range"
          value={boardConfig.flipDurationMs}
        />
      </label>

      <label className="rangeField">
        <div className="rangeField__header">
          <span>Ripple stagger</span>
          <strong>{boardConfig.ripple.toFixed(2)}</strong>
        </div>
        <input
          max={2}
          min={0}
          onChange={(event) => setBoardConfig({ ripple: Number(event.target.value) })}
          step={0.05}
          type="range"
          value={boardConfig.ripple}
        />
      </label>
    </>
  );
}

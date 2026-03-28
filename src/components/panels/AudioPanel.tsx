import { useSplitFlapStore } from '../../store/useSplitFlapStore';

export function AudioPanel() {
  const audio = useSplitFlapStore((state) => state.audio);
  const reducedMotion = useSplitFlapStore((state) => state.reducedMotion);
  const setAudio = useSplitFlapStore((state) => state.setAudio);
  const setReducedMotion = useSplitFlapStore((state) => state.setReducedMotion);

  return (
    <>
      <label className="switchRow">
        <div className="switchRow__copy">
          <strong>Mute</strong>
          <small>Disable flap clicks.</small>
        </div>
        <input
          checked={audio.muted}
          onChange={(event) => setAudio({ muted: event.target.checked })}
          type="checkbox"
        />
      </label>

      <label className="rangeField">
        <div className="rangeField__header">
          <span>Volume</span>
          <strong>{Math.round(audio.volume * 100)}%</strong>
        </div>
        <input
          max={1}
          min={0}
          onChange={(event) => setAudio({ volume: Number(event.target.value) })}
          step={0.01}
          type="range"
          value={audio.volume}
        />
      </label>

      <label className="rangeField">
        <div className="rangeField__header">
          <span>Density</span>
          <strong>{Math.round(audio.density * 100)}%</strong>
        </div>
        <input
          max={1}
          min={0.15}
          onChange={(event) => setAudio({ density: Number(event.target.value) })}
          step={0.05}
          type="range"
          value={audio.density}
        />
      </label>

      <label className="switchRow">
        <div className="switchRow__copy">
          <strong>Reduced motion</strong>
          <small>Use quieter motion.</small>
        </div>
        <input
          checked={reducedMotion}
          onChange={(event) => setReducedMotion(event.target.checked)}
          type="checkbox"
        />
      </label>
    </>
  );
}

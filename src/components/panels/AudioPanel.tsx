import { useSplitFlapStore } from '../../store/useSplitFlapStore';

export function AudioPanel() {
  const audio = useSplitFlapStore((state) => state.audio);
  const reducedMotion = useSplitFlapStore((state) => state.reducedMotion);
  const setAudio = useSplitFlapStore((state) => state.setAudio);
  const setReducedMotion = useSplitFlapStore((state) => state.setReducedMotion);

  return (
    <section className="controlPanelSection">
      <div className="controlPanelSection__header">
        <div>
          <h3>Sound and motion</h3>
          <p>Keep the board tactile without flooding the room when many cells move at once.</p>
        </div>
      </div>

      <label className="switchRow">
        <div className="switchRow__copy">
          <strong>Mute system</strong>
          <small>Disable flap clicks while keeping the visual motion intact.</small>
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
          <span>Sound density</span>
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
          <small>Shortens animation travel for quieter visual motion.</small>
        </div>
        <input
          checked={reducedMotion}
          onChange={(event) => setReducedMotion(event.target.checked)}
          type="checkbox"
        />
      </label>
    </section>
  );
}

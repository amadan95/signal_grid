import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ROTATION_INTERVAL_OPTIONS } from '../../constants';
import { useSplitFlapStore } from '../../store/useSplitFlapStore';

interface RotationPanelProps {
  adapterOptions: Array<{
    id: string;
    name: string;
  }>;
}

export function RotationPanel({ adapterOptions }: RotationPanelProps) {
  const {
    activeFeedId,
    playlist,
    rotationEnabled,
    rotationIntervalMs,
    setPlaylist,
    setRotationEnabled,
    setRotationIntervalMs,
  } = useSplitFlapStore(
    useShallow((state) => ({
      activeFeedId: state.activeFeedId,
      playlist: state.playlist,
      rotationEnabled: state.rotationEnabled,
      rotationIntervalMs: state.rotationIntervalMs,
      setPlaylist: state.setPlaylist,
      setRotationEnabled: state.setRotationEnabled,
      setRotationIntervalMs: state.setRotationIntervalMs,
    })),
  );

  const playlistSet = useMemo(() => new Set(playlist), [playlist]);

  return (
    <section className="drawerSection">
      <div className="drawerSection__header">
        <div>
          <h3>Rotation</h3>
          <p>Cycle through selected feeds when you want the board to run on its own.</p>
        </div>
        <span className={`drawerStatusPill ${rotationEnabled ? 'is-active' : ''}`}>
          {rotationEnabled ? 'Playlist on' : 'Direct'}
        </span>
      </div>

      <label className="switchRow">
        <div className="switchRow__copy">
          <strong>Playlist rotation</strong>
          <small>Cycle through the selected feeds below.</small>
        </div>
        <input
          checked={rotationEnabled}
          onChange={(event) => setRotationEnabled(event.target.checked)}
          type="checkbox"
        />
      </label>

      <label className="field">
        <span>Cadence</span>
        <select
          disabled={!rotationEnabled}
          name="rotation-cadence"
          onChange={(event) => setRotationIntervalMs(Number(event.target.value))}
          value={rotationIntervalMs}
        >
          {ROTATION_INTERVAL_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option / 1000} s
            </option>
          ))}
        </select>
      </label>

      <div className="playlistList">
        {adapterOptions.map((adapter) => {
          const checked = playlistSet.has(adapter.id);
          const isActive = activeFeedId === adapter.id;
          const detail = isActive ? 'On air now' : checked ? 'Included in playlist' : 'Excluded';

          return (
            <label
              className={`feedOption ${checked ? 'is-enabled' : ''} ${
                isActive ? 'is-active' : ''
              }`}
              key={adapter.id}
            >
              <div className="feedOption__meta">
                <span className="feedOption__name">{adapter.name}</span>
                <small>{detail}</small>
              </div>
              <div className="feedOption__actions">
                <input
                  aria-label={`Include ${adapter.name} in playlist rotation`}
                  checked={checked}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setPlaylist(checked ? playlist : [...playlist, adapter.id]);
                      return;
                    }

                    setPlaylist(playlist.filter((id) => id !== adapter.id));
                  }}
                  type="checkbox"
                />
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
}

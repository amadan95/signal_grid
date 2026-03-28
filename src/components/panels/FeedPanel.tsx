import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ROTATION_INTERVAL_OPTIONS } from '../../constants';
import { useSplitFlapStore } from '../../store/useSplitFlapStore';

interface FeedPanelProps {
  adapterOptions: Array<{
    id: string;
    name: string;
  }>;
}

export function FeedPanel({ adapterOptions }: FeedPanelProps) {
  const {
    activeFeedId,
    customMessage,
    playlist,
    rotationEnabled,
    rotationIntervalMs,
    setActiveFeedId,
    setCustomMessage,
    setPlaylist,
    setRotationEnabled,
    setRotationIntervalMs,
  } = useSplitFlapStore(useShallow((state) => ({
    activeFeedId: state.activeFeedId,
    customMessage: state.customMessage,
    playlist: state.playlist,
    rotationEnabled: state.rotationEnabled,
    rotationIntervalMs: state.rotationIntervalMs,
    setActiveFeedId: state.setActiveFeedId,
    setCustomMessage: state.setCustomMessage,
    setPlaylist: state.setPlaylist,
    setRotationEnabled: state.setRotationEnabled,
    setRotationIntervalMs: state.setRotationIntervalMs,
  })));

  const playlistSet = useMemo(() => new Set(playlist), [playlist]);

  return (
    <section className="controlPanelSection">
      <div className="controlPanelSection__header">
        <div>
          <h3>Feed routing</h3>
          <p>Pick the source on air now and choose which feeds are eligible for rotation.</p>
        </div>
        <span className="miniBadge">{rotationEnabled ? 'Rotation live' : 'Direct only'}</span>
      </div>

      <label className="field">
        <span>Manual message</span>
        <textarea
          onChange={(event) => setCustomMessage(event.target.value.toUpperCase())}
          rows={4}
          value={customMessage}
        />
        <small className="fieldHint">
          Use <code>|</code> to force line breaks. Plain text wraps across the board
          automatically.
        </small>
      </label>

      <label className="field">
        <span>On-air source</span>
        <select
          onChange={(event) => setActiveFeedId(event.target.value)}
          value={activeFeedId}
        >
          {adapterOptions.map((adapter) => (
            <option key={adapter.id} value={adapter.id}>
              {adapter.name}
            </option>
          ))}
        </select>
        <small className="fieldHint">This source is shown on the board immediately.</small>
      </label>

      <div className="subPanel">
        <label className="switchRow">
          <div className="switchRow__copy">
            <strong>Rotate through playlist</strong>
            <small>The board cycles through the enabled sources below.</small>
          </div>
          <input
            checked={rotationEnabled}
            onChange={(event) => setRotationEnabled(event.target.checked)}
            type="checkbox"
          />
        </label>

        <label className="field">
          <span>Rotation cadence</span>
          <select
            disabled={!rotationEnabled}
            onChange={(event) => setRotationIntervalMs(Number(event.target.value))}
            value={rotationIntervalMs}
          >
            {ROTATION_INTERVAL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option / 1000}s
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="playlistList">
        {adapterOptions.map((adapter) => {
          const checked = playlistSet.has(adapter.id);
          const isActive = activeFeedId === adapter.id;
          const detail = isActive ? 'On air now' : checked ? 'Included in rotation' : 'Standby';
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
                {isActive ? <span className="feedOption__badge">On air</span> : null}
                <input
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

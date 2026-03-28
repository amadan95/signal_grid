import { useShallow } from 'zustand/react/shallow';
import { useSplitFlapStore } from '../../store/useSplitFlapStore';

interface NowPlayingPanelProps {
  adapterOptions: Array<{
    id: string;
    name: string;
  }>;
}

export function NowPlayingPanel({ adapterOptions }: NowPlayingPanelProps) {
  const {
    activeFeedId,
    customMessage,
    setActiveFeedId,
    setCustomMessage,
  } = useSplitFlapStore(
    useShallow((state) => ({
      activeFeedId: state.activeFeedId,
      customMessage: state.customMessage,
      setActiveFeedId: state.setActiveFeedId,
      setCustomMessage: state.setCustomMessage,
    })),
  );

  return (
    <section className="drawerSection">
      <div className="drawerSection__header">
        <div>
          <h3>Now playing</h3>
          <p>Choose the live source or write a manual message.</p>
        </div>
      </div>

      <label className="field">
        <span>Manual message</span>
        <textarea
          autoCapitalize="characters"
          name="manual-message"
          onChange={(event) => setCustomMessage(event.target.value.toUpperCase())}
          rows={4}
          spellCheck={false}
          value={customMessage}
        />
        <small className="fieldHint">Use <code>|</code> for line breaks.</small>
      </label>

      <label className="field">
        <span>Source</span>
        <select
          name="active-source"
          onChange={(event) => setActiveFeedId(event.target.value)}
          value={activeFeedId}
        >
          {adapterOptions.map((adapter) => (
            <option key={adapter.id} value={adapter.id}>
              {adapter.name}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}

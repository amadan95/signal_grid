import { AudioPanel } from './panels/AudioPanel';
import { BoardPanel } from './panels/BoardPanel';
import { FeedPanel } from './panels/FeedPanel';
import { ThemePanel } from './panels/ThemePanel';

interface SettingsPanelProps {
  adapterOptions: Array<{
    id: string;
    name: string;
  }>;
  isOpen: boolean;
  onToggleDock: () => void;
  onToggleFullscreen: () => void;
  fullscreen: boolean;
}

export function SettingsPanel({
  adapterOptions,
  isOpen,
  onToggleDock,
  onToggleFullscreen,
  fullscreen,
}: SettingsPanelProps) {
  return (
    <aside className={`controlPanel ${isOpen ? 'is-open' : 'is-closed'}`}>
      <div className="controlPanel__toolbar">
        <div className="controlPanel__toolbarCopy">
          <p className="eyebrow">Control Deck</p>
          <h2>Operations</h2>
          <p className="controlPanel__lead">
            Route feeds, tune the board timing, and set the console finish.
          </p>
        </div>
        <div className="controlPanel__actions">
          <button className="secondaryButton" onClick={onToggleDock} type="button">
            Hide
          </button>
          <button className="primaryButton" onClick={onToggleFullscreen} type="button">
            {fullscreen ? 'Exit Full' : 'Fullscreen'}
          </button>
        </div>
      </div>

      <FeedPanel adapterOptions={adapterOptions} />
      <BoardPanel />
      <AudioPanel />
      <ThemePanel />
    </aside>
  );
}

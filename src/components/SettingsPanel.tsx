import { forwardRef, useState, type KeyboardEventHandler } from 'react';
import { BoardPanel } from './panels/BoardPanel';
import { DisclosureSection } from './panels/DisclosureSection';
import { NowPlayingPanel } from './panels/NowPlayingPanel';
import { RotationPanel } from './panels/RotationPanel';
import { AudioPanel } from './panels/AudioPanel';
import { ThemePanel } from './panels/ThemePanel';

interface SettingsPanelProps {
  adapterOptions: Array<{
    id: string;
    name: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
  onToggleFullscreen: () => void;
  fullscreen: boolean;
  onKeyDown: KeyboardEventHandler<HTMLElement>;
}

export const SettingsPanel = forwardRef<HTMLElement, SettingsPanelProps>(function SettingsPanel({
  adapterOptions,
  isOpen,
  onClose,
  onToggleFullscreen,
  fullscreen,
  onKeyDown,
}, ref) {
  const [expandedSections, setExpandedSections] = useState({
    board: false,
    audio: false,
    theme: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  return (
    <aside
      aria-hidden={!isOpen}
      aria-label="Signal Grid controls"
      className={`controlPanel ${isOpen ? 'is-open' : 'is-closed'}`}
      id="signal-grid-controls"
      onKeyDown={onKeyDown}
      ref={ref}
      tabIndex={-1}
    >
      <div className="controlPanel__header">
        <div className="controlPanel__title">
          <p className="eyebrow">Signal Grid</p>
          <h2>Controls</h2>
        </div>
        <div className="controlPanel__actions">
          <button className="secondaryButton" onClick={onToggleFullscreen} type="button">
            {fullscreen ? 'Exit Full' : 'Fullscreen'}
          </button>
          <button className="primaryButton" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>

      <div className="controlPanel__body">
        <NowPlayingPanel adapterOptions={adapterOptions} />
        <RotationPanel adapterOptions={adapterOptions} />

        <DisclosureSection
          description="Timing, layout, and ripple"
          onToggle={() => toggleSection('board')}
          open={expandedSections.board}
          title="Board"
        >
          <BoardPanel />
        </DisclosureSection>

        <DisclosureSection
          description="Sound and motion"
          onToggle={() => toggleSection('audio')}
          open={expandedSections.audio}
          title="Audio"
        >
          <AudioPanel />
        </DisclosureSection>

        <DisclosureSection
          description="Color and finish"
          onToggle={() => toggleSection('theme')}
          open={expandedSections.theme}
          title="Theme"
        >
          <ThemePanel />
        </DisclosureSection>
      </div>
    </aside>
  );
});

import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { SettingsPanel } from './components/SettingsPanel';
import { SplitFlapBoard } from './components/SplitFlapBoard';
import { useDisplayController } from './hooks/useDisplayController';
import { useSystemPreferences } from './hooks/useSystemPreferences';
import { useSplitFlapStore } from './store/useSplitFlapStore';
import { themes } from './theme/themes';

function App() {
  const registry = useDisplayController();
  useSystemPreferences();

  const {
    activeFeedId,
    controlDeckCollapsed,
    currentPayload,
    fullscreen,
    setControlDeckCollapsed,
    setFullscreen,
    themeId,
  } = useSplitFlapStore(
    useShallow((state) => ({
      activeFeedId: state.activeFeedId,
      controlDeckCollapsed: state.controlDeckCollapsed,
      currentPayload: state.currentPayload,
      fullscreen: state.fullscreen,
      setControlDeckCollapsed: state.setControlDeckCollapsed,
      setFullscreen: state.setFullscreen,
      themeId: state.themeId,
    })),
  );

  const themeClassName = useMemo(
    () => themes.find((theme) => theme.id === themeId)?.className ?? themes[0].className,
    [themeId],
  );

  const activeFeedName = useMemo(
    () => registry.find((adapter) => adapter.id === activeFeedId)?.name ?? 'Custom Message',
    [activeFeedId, registry],
  );

  useEffect(() => {
    const listener = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', listener);
    return () => document.removeEventListener('fullscreenchange', listener);
  }, [setFullscreen]);

  const handleToggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  };

  return (
    <div className={`appShell ${themeClassName}`}>
      <div className="ambientBackdrop" />
      <button
        aria-expanded={!controlDeckCollapsed}
        aria-label={controlDeckCollapsed ? 'Show controls' : 'Hide controls'}
        className={`controlDeckToggle ${
          controlDeckCollapsed ? 'is-collapsed' : 'is-expanded'
        }`}
        onClick={() => setControlDeckCollapsed(!controlDeckCollapsed)}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="controlDeckToggle__icon"
          fill="none"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="4" width="4" height="16" rx="1.25" />
          <path d="M10 7H20" />
          <path d="M10 12H20" />
          <path d="M10 17H20" />
        </svg>
      </button>

      {!controlDeckCollapsed ? (
        <button
          aria-label="Hide controls"
          className="controlDeckScrim"
          onClick={() => setControlDeckCollapsed(true)}
          type="button"
        />
      ) : null}

      <div
        className={`instrumentLayout ${
          controlDeckCollapsed ? 'is-controlDeckCollapsed' : 'has-controlDeck'
        }`}
      >
        <main className="displayStage">
          <SplitFlapBoard feedLabel={activeFeedName} payload={currentPayload} />
        </main>
      </div>

      <SettingsPanel
        adapterOptions={registry.map((adapter) => ({
          id: adapter.id,
          name: adapter.name,
        }))}
        fullscreen={fullscreen}
        isOpen={!controlDeckCollapsed}
        onToggleDock={() => setControlDeckCollapsed(true)}
        onToggleFullscreen={handleToggleFullscreen}
      />
    </div>
  );
}

export default App;

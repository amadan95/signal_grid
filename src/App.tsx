import { useEffect, useMemo, useRef, type KeyboardEventHandler } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { SettingsPanel } from './components/SettingsPanel';
import { SplitFlapBoard } from './components/SplitFlapBoard';
import { useDisplayController } from './hooks/useDisplayController';
import { useSystemPreferences } from './hooks/useSystemPreferences';
import { useSplitFlapStore } from './store/useSplitFlapStore';
import { themes } from './theme/themes';

const focusableSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const getFocusableElements = (container: HTMLElement | null) =>
  container
    ? Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => !element.hasAttribute('hidden') && element.offsetParent !== null,
      )
    : [];

function App() {
  const registry = useDisplayController();
  useSystemPreferences();
  const drawerRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

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

  const closeControlDeck = () => {
    setControlDeckCollapsed(true);
    window.requestAnimationFrame(() => {
      toggleRef.current?.focus();
    });
  };

  useEffect(() => {
    const listener = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', listener);
    return () => document.removeEventListener('fullscreenchange', listener);
  }, [setFullscreen]);

  useEffect(() => {
    document.title = `${activeFeedName} - Signal Grid`;
  }, [activeFeedName]);

  useEffect(() => {
    if (controlDeckCollapsed) return;

    const frameId = window.requestAnimationFrame(() => {
      const panel = drawerRef.current;
      const [firstFocusable] = getFocusableElements(panel);
      (firstFocusable ?? panel)?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [controlDeckCollapsed]);

  useEffect(() => {
    if (controlDeckCollapsed) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closeControlDeck();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [controlDeckCollapsed]);

  const handleToggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  };

  const handleDrawerKeyDown: KeyboardEventHandler<HTMLElement> = (event) => {
    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements(drawerRef.current);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <div className={`appShell ${themeClassName}`}>
      <div className="ambientBackdrop" />
      {!controlDeckCollapsed ? (
        <button
          aria-label="Hide controls"
          className="controlDeckScrim"
          onClick={closeControlDeck}
          type="button"
        />
      ) : null}

      <div
        className={`instrumentLayout ${
          controlDeckCollapsed ? 'is-controlDeckCollapsed' : 'has-controlDeck'
        }`}
      >
        <button
          aria-controls="signal-grid-controls"
          aria-expanded={!controlDeckCollapsed}
          aria-label={controlDeckCollapsed ? 'Show controls' : 'Hide controls'}
          className={`controlDeckToggle ${
            controlDeckCollapsed ? 'is-collapsed' : 'is-expanded'
          }`}
          onClick={() =>
            controlDeckCollapsed
              ? setControlDeckCollapsed(false)
              : closeControlDeck()
          }
          ref={toggleRef}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="controlDeckToggle__icon"
            fill="none"
            viewBox="0 0 24 24"
          >
            <rect x="3.5" y="4.5" width="5" height="15" rx="1.5" />
            <path d="M11 7.5H20" />
            <path d="M11 12H20" />
            <path d="M11 16.5H20" />
          </svg>
        </button>

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
        onClose={closeControlDeck}
        onKeyDown={handleDrawerKeyDown}
        onToggleFullscreen={handleToggleFullscreen}
        ref={drawerRef}
      />
    </div>
  );
}

export default App;

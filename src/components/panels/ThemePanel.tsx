import { themes } from '../../theme/themes';
import { useSplitFlapStore } from '../../store/useSplitFlapStore';

export function ThemePanel() {
  const themeId = useSplitFlapStore((state) => state.themeId);
  const setThemeId = useSplitFlapStore((state) => state.setThemeId);

  return (
    <section className="controlPanelSection">
      <div className="controlPanelSection__header">
        <div>
          <h3>Console finish</h3>
          <p>Shift the signal color and surface tone without changing the board geometry.</p>
        </div>
      </div>
      <div className="themeGrid">
        {themes.map((theme) => (
          <button
            key={theme.id}
            className={`themeButton ${theme.id === themeId ? 'is-active' : ''}`}
            onClick={() => setThemeId(theme.id)}
            type="button"
          >
            <span>{theme.label}</span>
            <small>{theme.description}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

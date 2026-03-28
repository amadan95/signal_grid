import { themes } from '../../theme/themes';
import { useSplitFlapStore } from '../../store/useSplitFlapStore';

export function ThemePanel() {
  const themeId = useSplitFlapStore((state) => state.themeId);
  const setThemeId = useSplitFlapStore((state) => state.setThemeId);

  return (
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
  );
}

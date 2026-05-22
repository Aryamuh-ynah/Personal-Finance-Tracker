
import { THEMES } from "../styles/appStyles";

export default function SettingsPage({ themeId, setThemeId }) {
  return (
    <main className="settings-page">
      <h2 className="settings-title">Settings</h2>
      <p className="settings-subtitle">
        Choose your favorite theme. Your selection will stay saved after reload.
      </p>

      <div className="theme-grid">
        {THEMES.map((theme) => {
          const active = theme.id === themeId;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setThemeId(theme.id)}
              className={`theme-card ${active ? "theme-card-active" : ""}`}
            >
              <div className="theme-card-top">
                <div>
                  <div className="theme-name">{theme.name}</div>
                  <div className="theme-description">{theme.description}</div>
                </div>

                <div className="theme-colors">
                  {theme.colors.map((color) => (
                    <span
                      key={color}
                      className="theme-color-dot"
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>

              {active && (
                <span className="theme-selected-badge">Selected</span>
              )}
            </button>
          );
        })}
      </div>
    </main>
  );
}
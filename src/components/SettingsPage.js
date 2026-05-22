import { THEMES } from "../styles/appStyles";

const APPEARANCE_OPTIONS = [
  {
    id: "dark",
    icon: "🌙",
    title: "Dark Mode",
    description: "Modern dark interface",
  },
  {
    id: "light",
    icon: "☀️",
    title: "Light Mode",
    description: "Clean bright interface",
  },
];

export default function SettingsPage({
  themeId,
  setThemeId,
  appearance,
  setAppearance,
  budgetInput,
  setBudgetInput,
  saveBudget,
  editBudget,
  setEditBudget,
  budget,
  styles,
}) {
  return (
    <main className="settings-page">
      <h2 className="settings-title">Settings</h2>

      <p className="settings-subtitle">
        Manage your app appearance, theme, and monthly budget.
      </p>

      <h3 className="settings-section-title">🌓 Appearance</h3>

      <div className="appearance-grid">
        {APPEARANCE_OPTIONS.map((option) => {
          const active = appearance === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setAppearance(option.id)}
              className={`appearance-card ${
                active ? "appearance-card-active" : ""
              }`}
            >
              <div className="appearance-icon">{option.icon}</div>
              <div className="appearance-title">{option.title}</div>
              <div className="appearance-description">
                {option.description}
              </div>
            </button>
          );
        })}
      </div>


      <h3 className="settings-section-title">🎨 Color Theme</h3>

      <div className="theme-grid mb-5">
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

              {active && <span className="theme-selected-badge">Selected</span>}
            </button>
          );
        })}
      </div>


    <h3 className="settings-section-title">💸 Monthly Budget</h3>

      <section className="settings-section">
        {!editBudget ? (
          <>
            <div style={styles.label}>Current Budget</div>

            <div className="budget-settings-value">
              ৳{Number(budget || 0).toLocaleString()}
            </div>

            <button
              type="button"
              style={styles.btn("var(--primary)")}
              onClick={() => {
                setBudgetInput(String(budget || 0));
                setEditBudget(true);
              }}
            >
              ✏️ Edit Budget
            </button>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 12 }}>
              <div style={styles.label}>Budget Amount (৳)</div>

              <input
                style={styles.input}
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="Enter monthly budget"
              />
            </div>

            <div className="budget-settings-actions">
              <button
                type="button"
                style={styles.btn("#22c55e")}
                onClick={saveBudget}
              >
                Save Budget
              </button>

              <button
                type="button"
                style={styles.btn("#334155")}
                onClick={() => {
                  setBudgetInput(String(budget || 0));
                  setEditBudget(false);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </section>

    </main>
  );
}
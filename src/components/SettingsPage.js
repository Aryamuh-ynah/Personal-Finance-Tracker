import { THEMES } from "../styles/appStyles";

export default function SettingsPage({
  themeId,
  setThemeId,
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
        Manage your app theme and monthly budget.
      </p>

      <section style={styles.card}>
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>
          💸 Monthly Budget
        </div>

        {!editBudget ? (
          <>
            <div style={styles.label}>Current Budget</div>

            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                marginBottom: 14,
                color: "var(--text-main)",
              }}
            >
              ৳{Number(budget).toLocaleString()}
            </div>

            <button
              type="button"
              style={styles.btn("var(--primary)")}
              onClick={() => {
                setBudgetInput(String(budget));
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

            <button type="button" style={styles.btn("#22c55e")} onClick={saveBudget}>
              Save Budget
            </button>

            <button
              type="button"
              style={{ ...styles.btn("#334155"), marginTop: 10 }}
              onClick={() => {
                setBudgetInput(String(budget));
                setEditBudget(false);
              }}
            >
              Cancel
            </button>
          </>
        )}
      </section>

      <h3
        style={{
          margin: "22px 0 8px",
          fontSize: 18,
          fontWeight: 800,
          color: "var(--text-main)",
        }}
      >
        🎨 Themes
      </h3>

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

              {active && <span className="theme-selected-badge">Selected</span>}
            </button>
          );
        })}
      </div>
    </main>
  );
}
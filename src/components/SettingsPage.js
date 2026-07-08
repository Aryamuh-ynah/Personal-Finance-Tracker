import { THEMES } from "../styles/appStyles";
import { monthKey, today } from "../utils/finance";


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
  dpsEnabled,
  setDpsEnabled,
  expenses,
  incomes,
  statementMonth,
  setStatementMonth,
  downloadStatement,
  allMonths,
  styles,
}) {
  return (
    <main className="settings-page">
      <h2 className="settings-title">Settings</h2>

      <p className="settings-subtitle">
        Manage your app appearance, theme, and monthly budget.
      </p>

      <h3 className="settings-section-title">🌓 Appearance</h3>

      <div className="appearance-toggle-card">
        <div>
          <div className="appearance-toggle-title">
            {appearance === "dark" ? "Dark Mode" : "Light Mode"}
          </div>

          <div className="appearance-toggle-description">
            {appearance === "dark"
              ? "Modern dark interface"
              : "Clean bright interface"}
          </div>
        </div>

        <button
          type="button"
          className={`appearance-toggle ${
            appearance === "dark" ? "appearance-toggle-dark" : "appearance-toggle-light"
          }`}
          onClick={() =>
            setAppearance(appearance === "dark" ? "light" : "dark")
          }
          aria-label="Toggle dark and light mode"
        >
          <span className="appearance-toggle-icon">
            {appearance === "dark" ? "🌙" : "☀️"}
          </span>
        </button>
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
    <h3 className="settings-section-title">🏦 DPS Tracker</h3>

    <section className="settings-section">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 800,
              color: "var(--text-main)",
              marginBottom: 4,
            }}
          >
            Start DPS Tracking
          </div>

          <div
            style={{
              color: "var(--text-muted)",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            Turn this on to show a separate DPS tracker tab in the bottom
            navigation.
          </div>
        </div>

        <button
          type="button"
          className={`appearance-toggle ${
            dpsEnabled ? "appearance-toggle-light" : "appearance-toggle-dark"
          }`}
          onClick={() => setDpsEnabled(!dpsEnabled)}
          aria-label="Toggle DPS tracker tab"
        >
          <span className="appearance-toggle-icon">
            {dpsEnabled ? "🏦" : "—"}
          </span>
        </button>
      </div>
    </section>


      <h3 className="settings-section-title">📄 Statement PDF</h3>

      <section className="settings-section">
        <div style={{ marginBottom: 12 }}>
          <div style={styles.label}>Statement Month</div>

          <select
            style={styles.select}
            value={statementMonth}
            onChange={(e) => setStatementMonth(e.target.value)}
          >
            {(allMonths.length ? allMonths : [monthKey(today())]).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          style={styles.btn("var(--primary)")}
          onClick={downloadStatement}
        >
          📥 Download Statement PDF
        </button>

        <p
          style={{
            marginTop: 10,
            fontSize: 12,
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}
        >
          The PDF will include monthly income, expenses, budget, net balance, and
          transaction details.
        </p>
      </section>


    </main>
  );
}
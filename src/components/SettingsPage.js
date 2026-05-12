
export default function SettingsPage({
  settings,
  onUpdateSettings,
  categoryBudgets,
  onUpdateCategoryBudget,
  onExportBackup,
  onImportBackup,
}) {
  return (
    <div>
      <h2>Settings</h2>

      <section>
        <h3>Appearance</h3>
        <label>
          Theme
          <select
            value={settings.theme}
            onChange={(e) => onUpdateSettings({ theme: e.target.value })}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </section>

      <section>
        <h3>Currency</h3>
        <input
          value={settings.currency}
          onChange={(e) => onUpdateSettings({ currency: e.target.value })}
        />
      </section>

      <section>
        <h3>Category Budgets</h3>
        {Object.entries(categoryBudgets).map(([category, amount]) => (
          <div key={category}>
            <label>{category}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) =>
                onUpdateCategoryBudget(category, Number(e.target.value))
              }
            />
          </div>
        ))}
      </section>

      <section>
        <h3>Backup & Restore</h3>
        <button onClick={onExportBackup}>Download Backup</button>
        <input type="file" accept="application/json" onChange={onImportBackup} />
      </section>
    </div>
  );
}
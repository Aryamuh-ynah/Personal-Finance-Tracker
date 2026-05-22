const NAV_ITEMS = [
  ["dashboard", "📊", "Dashboard"],
  ["income", "💰", "Income"],
  ["expenses", "➕", "Expense"],
  ["history", "📋", "History"],
  ["settings", "⚙️", "Settings"],
];

export default function BottomNav({ tab, setTab, styles }) {
  return (
    <nav style={styles.nav}>
      {NAV_ITEMS.map(([id, icon, label]) => (
        <button
          key={id}
          style={styles.navBtn(tab === id)}
          onClick={() => setTab(id)}
        >
          <span style={{ fontSize: 20 }}>{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}
// const NAV_ITEMS = [
//   ["dashboard", "📊", "Dashboard"],
//   ["income", "💰", "Income"],
//   ["expenses", "➕", "Expense"],
//   ...(dpsEnabled ? [["dps", "🏦", "DPS"]] : []),
//   ["history", "📋", "History"],
//   ["settings", "⚙️", "Settings"],
// ];

// export default function BottomNav({ tab, setTab, dpsEnabled, styles }) {
//   return (
//     <nav style={styles.nav}>
//       {NAV_ITEMS.map(([id, icon, label]) => (
//         <button
//           key={id}
//           style={styles.navBtn(tab === id)}
//           onClick={() => setTab(id)}
//         >
//           <span style={{ fontSize: 20 }}>{icon}</span>
//           {label}
//         </button>
//       ))}
//     </nav>
//   );
// }

export default function BottomNav({ tab, setTab, dpsEnabled, styles }) {
  const navItems = [
    ["dashboard", "📊", "Dashboard"],
    ["income", "💰", "Income"],
    ["expenses", "➕", "Expense"],
    ["history", "📋", "History"],
    ...(dpsEnabled ? [["dps", "🏦", "DPS"]] : []),
    ["settings", "⚙️", "Settings"],
  ];

  return (
    <nav style={styles.nav}>
      {navItems.map(([id, icon, label]) => (
        <button
          key={id}
          type="button"
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
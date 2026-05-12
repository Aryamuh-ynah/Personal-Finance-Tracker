import { CATEGORIES } from "../constants/finance";
import { catMeta, fmt, monthKey, today } from "../utils/finance";

export default function HistoryPage({ filteredExp, filterMonth, setFilterMonth, filterCat, setFilterCat, allMonths, startEditExp, deleteExpense, styles }) {
  return (
    <div>
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 8 }}>
        <select style={{ ...styles.select, flex: 1 }} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
          {(allMonths.length ? allMonths : [monthKey(today())]).map((month) => <option key={month} value={month}>{month}</option>)}
        </select>
        <select style={{ ...styles.select, flex: 1 }} value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option>All</option>
          {CATEGORIES.map((category) => <option key={category.name}>{category.name}</option>)}
        </select>
      </div>
      <div style={{ padding: "8px 16px", color: "#94a3b8", fontSize: 13 }}>
        {filteredExp.length} transactions · {fmt(filteredExp.reduce((sum, expense) => sum + expense.amount, 0))} spent
      </div>
      {filteredExp.length === 0 && <div style={{ textAlign: "center", color: "#64748b", padding: 40 }}>No expenses found.</div>}
      {filteredExp.map((expense) => {
        const meta = catMeta(expense.category, CATEGORIES);
        return (
          <div key={expense.id} style={styles.item}>
            <div style={{ fontSize: 26 }}>{meta.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={styles.badge(meta.color)}>{expense.category}</span>
                <span style={{ fontWeight: 700 }}>{fmt(expense.amount)}</span>
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{expense.date}{expense.note ? ` · ${expense.note}` : ""}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <button onClick={() => startEditExp(expense)} style={{ background: "#334155", border: "none", borderRadius: 6, color: "#94a3b8", padding: "4px 8px", cursor: "pointer", fontSize: 13 }}>✏️</button>
              <button onClick={() => deleteExpense(expense.id)} style={{ background: "#7f1d1d", border: "none", borderRadius: 6, color: "#fca5a5", padding: "4px 8px", cursor: "pointer", fontSize: 13 }}>🗑️</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

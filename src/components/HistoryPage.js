import { useState } from "react";
import { CATEGORIES, INCOME_SOURCES } from "../constants/finance";
import { fmt, monthKey, today } from "../utils/finance";

export default function HistoryPage({
  filteredExp,
  filteredInc,
  filterMonth,
  setFilterMonth,
  filterCat,
  setFilterCat,
  allMonths,
  startEditExp,
  deleteExpense,
  startEditInc,
  deleteIncome,
  styles
}) {
  const [typeFilter, setTypeFilter] = useState("Expenses");

  const getExpenseMeta = (category) =>
    CATEGORIES.find(c => c.name === category) || { icon: "📦", color: "#6b7280" };
  const getIncomeMeta = (source) =>
    INCOME_SOURCES.find(s => s.name === source) || { icon: "💰", color: "#6b7280" };

  return (
    <div style={{ padding: 16 }}>
      {/* Top filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {/* Month */}
        <select
          style={{ ...styles.select, flex: 1 }}
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          {(allMonths.length ? allMonths : [monthKey(today())]).map((month) => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        {/* Type */}
        <select
          style={{ ...styles.select, flex: 1 }}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="Expenses">Expenses</option>
          <option value="Income">Income</option>
        </select>

        {/* Category / Source */}
        {typeFilter === "Expenses" && (
          <select
            style={{ ...styles.select, flex: 1 }}
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option>All</option>
            {CATEGORIES.map(c => <option key={c.name}>{c.name}</option>)}
          </select>
        )}
        {typeFilter === "Income" && (
          <select
            style={{ ...styles.select, flex: 1 }}
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option>All</option>
            {INCOME_SOURCES.map(s => <option key={s.name}>{s.name}</option>)}
          </select>
        )}
      </div>

      {/* Expenses Table */}
      {typeFilter === "Expenses" && (
        <>
          <div style={{ padding: "8px 0", color: "#94a3b8", fontSize: 13 }}>
            {filteredExp.length} expense transactions · {fmt(filteredExp.reduce((sum, e) => sum + e.amount, 0))} spent
          </div>
          {filteredExp.length === 0 && <div style={{ textAlign: "center", color: "#64748b", padding: 40 }}>No expenses found.</div>}
          {filteredExp.map(expense => {
            const meta = getExpenseMeta(expense.category);
            return (
              <div key={expense.id} style={styles.item}>
                <div style={{ fontSize: 26 }}>{meta.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={styles.badge(meta.color)}>{expense.category}</span>
                    <span style={{ fontWeight: 700 }}>{fmt(expense.amount)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                    {expense.date}{expense.note ? ` · ${expense.note}` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button onClick={() => startEditExp(expense)} style={buttonStyle("#334155", "#94a3b8")}>✏️</button>
                  <button onClick={() => deleteExpense(expense.id)} style={buttonStyle("#7f1d1d", "#fca5a5")}>🗑️</button>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Income Table */}
      {typeFilter === "Income" && (
        <>
          <div style={{ padding: "8px 0", color: "#94a3b8", fontSize: 13 }}>
            {filteredInc.length} income transactions · {fmt(filteredInc.reduce((sum, i) => sum + i.amount, 0))} received
          </div>
          {filteredInc.length === 0 && <div style={{ textAlign: "center", color: "#64748b", padding: 40 }}>No incomes found.</div>}
          {filteredInc.map(income => {
            const meta = getIncomeMeta(income.source);
            return (
              <div key={income.id} style={styles.item}>
                <div style={{ fontSize: 26 }}>{meta.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={styles.badge(meta.color)}>{income.source}</span>
                    <span style={{ fontWeight: 700 }}>{fmt(income.amount)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                    {income.date}{income.note ? ` · ${income.note}` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button onClick={() => startEditInc(income)} style={buttonStyle("#334155", "#94a3b8")}>✏️</button>
                  <button onClick={() => deleteIncome(income.id)} style={buttonStyle("#7f1d1d", "#fca5a5")}>🗑️</button>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

const buttonStyle = (bg, color) => ({
  background: bg,
  border: "none",
  borderRadius: 6,
  color: color,
  padding: "4px 8px",
  cursor: "pointer",
  fontSize: 13
});
import { fmt } from "../utils/finance";

export default function BudgetCard({ budget, budgetInput, editBudget, setBudgetInput, setEditBudget, saveBudget, totalSpent, remaining, pct, overBudget, nearBudget, styles }) {
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={styles.label}>Monthly Budget</div>
        {editBudget ? (
          <div style={{ display: "flex", gap: 6 }}>
            <input style={{ ...styles.input, width: 120, padding: "6px 10px" }} value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} type="number" />
            <button style={{ ...styles.btn(), width: "auto", padding: "6px 12px", fontSize: 13 }} onClick={saveBudget}>Save</button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 700, color: "#6366f1" }}>{fmt(budget)}</span>
            <button onClick={() => setEditBudget(true)} style={{ background: "#334155", color: "#94a3b8", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>Edit</button>
          </div>
        )}
      </div>
      <div style={{ background: "#0f172a", borderRadius: 99, height: 10, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: overBudget ? "#ef4444" : nearBudget ? "#eab308" : "#6366f1", borderRadius: 99, transition: "width 0.5s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", marginTop: 6 }}>
        <span>Spent {fmt(totalSpent)}</span><span>Left {fmt(Math.max(remaining, 0))}</span>
      </div>
    </div>
  );
}

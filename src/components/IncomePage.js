import { INCOME_SOURCES } from "../constants/finance";
import { catMeta, fmt, monthKey, today } from "../utils/finance";

export default function IncomePage({ incomeView, setIncomeView, editIncId, incForm, setIncForm, addIncome, cancelEditIncome, filteredInc, filterMonth, setFilterMonth, allMonths, startEditInc, deleteIncome, styles }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 8, padding: "12px 16px 0" }}>
        <button style={styles.tabBtn(incomeView === "add")} onClick={() => setIncomeView("add")}>{editIncId ? "✏️ Edit" : "➕ Add Income"}</button>
        <button style={styles.tabBtn(incomeView === "history")} onClick={() => setIncomeView("history")}>📋 History</button>
      </div>

      {incomeView === "add" && (
        <div style={styles.card}>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>{editIncId ? "✏️ Edit Income" : "💰 Add Income"}</div>
          <div style={{ marginBottom: 12 }}>
            <div style={styles.label}>Amount (৳)</div>
            <input style={styles.input} type="number" placeholder="0.00" value={incForm.amount} onChange={(e) => setIncForm((form) => ({ ...form, amount: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={styles.label}>Source</div>
            <select style={styles.select} value={incForm.source} onChange={(e) => setIncForm((form) => ({ ...form, source: e.target.value }))}>
              {INCOME_SOURCES.map((source) => <option key={source.name} value={source.name}>{source.icon} {source.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={styles.label}>Date</div>
            <input style={styles.input} type="date" value={incForm.date} onChange={(e) => setIncForm((form) => ({ ...form, date: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={styles.label}>Note (optional)</div>
            <input style={styles.input} type="text" placeholder="e.g. March salary from company" value={incForm.note} onChange={(e) => setIncForm((form) => ({ ...form, note: e.target.value }))} />
          </div>
          <button style={styles.btn("#22c55e")} onClick={addIncome}>{editIncId ? "Update Income" : "Add Income"}</button>
          {editIncId && <button style={{ ...styles.btn("#334155"), marginTop: 10 }} onClick={cancelEditIncome}>Cancel</button>}
        </div>
      )}

      {incomeView === "history" && (
        <div>
          <div style={{ padding: "8px 16px" }}>
            <select style={styles.select} value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
              {(allMonths.length ? allMonths : [monthKey(today())]).map((month) => <option key={month} value={month}>{month}</option>)}
            </select>
          </div>
          <div style={{ padding: "4px 16px", color: "#94a3b8", fontSize: 13 }}>
            {filteredInc.length} entries · {fmt(filteredInc.reduce((sum, income) => sum + income.amount, 0))} total
          </div>
          {filteredInc.length === 0 && <div style={{ textAlign: "center", color: "#64748b", padding: 40 }}>No income recorded.</div>}
          {filteredInc.map((income) => {
            const meta = catMeta(income.source, INCOME_SOURCES);
            return (
              <div key={income.id} style={styles.item}>
                <div style={{ fontSize: 26 }}>{meta.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={styles.badge(meta.color)}>{income.source}</span>
                    <span style={{ fontWeight: 700, color: "#22c55e" }}>{fmt(income.amount)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{income.date}{income.note ? ` · ${income.note}` : ""}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button onClick={() => startEditInc(income)} style={{ background: "#334155", border: "none", borderRadius: 6, color: "#94a3b8", padding: "4px 8px", cursor: "pointer", fontSize: 13 }}>✏️</button>
                  <button onClick={() => deleteIncome(income.id)} style={{ background: "#7f1d1d", border: "none", borderRadius: 6, color: "#fca5a5", padding: "4px 8px", cursor: "pointer", fontSize: 13 }}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

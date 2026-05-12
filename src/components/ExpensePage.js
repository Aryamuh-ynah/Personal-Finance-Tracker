import { CATEGORIES } from "../constants/finance";

export default function ExpensePage({ editExpId, expForm, setExpForm, addExpense, cancelEditExpense, styles }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 8, padding: "12px 16px 0" }}>
        <button style={styles.tabBtn(true)} onClick={cancelEditExpense}>➕ Add</button>
      </div>
      <div style={styles.card}>
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>{editExpId ? "✏️ Edit Expense" : "➕ Add Expense"}</div>
        <div style={{ marginBottom: 12 }}>
          <div style={styles.label}>Amount (৳)</div>
          <input style={styles.input} type="number" placeholder="0.00" value={expForm.amount} onChange={(e) => setExpForm((form) => ({ ...form, amount: e.target.value }))} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={styles.label}>Category</div>
          <select style={styles.select} value={expForm.category} onChange={(e) => setExpForm((form) => ({ ...form, category: e.target.value }))}>
            {CATEGORIES.map((category) => <option key={category.name} value={category.name}>{category.icon} {category.name}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={styles.label}>Date</div>
          <input style={styles.input} type="date" value={expForm.date} onChange={(e) => setExpForm((form) => ({ ...form, date: e.target.value }))} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={styles.label}>Note (optional)</div>
          <input style={styles.input} type="text" placeholder="e.g. Lunch at office" value={expForm.note} onChange={(e) => setExpForm((form) => ({ ...form, note: e.target.value }))} />
        </div>
        <button style={styles.btn()} onClick={addExpense}>{editExpId ? "Update Expense" : "Add Expense"}</button>
        {editExpId && <button style={{ ...styles.btn("#334155"), marginTop: 10 }} onClick={cancelEditExpense}>Cancel</button>}
      </div>
    </div>
  );
}

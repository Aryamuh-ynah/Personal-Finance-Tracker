import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const CATEGORIES = [
  { name: "Food", icon: "🍔", color: "#f97316" },
  { name: "Transport", icon: "🚌", color: "#3b82f6" },
  { name: "Bills", icon: "💡", color: "#eab308" },
  { name: "Shopping", icon: "🛍️", color: "#ec4899" },
  { name: "Health", icon: "💊", color: "#22c55e" },
  { name: "Education", icon: "📚", color: "#8b5cf6" },
  { name: "Entertainment", icon: "🎮", color: "#06b6d4" },
  { name: "Groceries", icon: "🛒", color: "#84cc16" },
  { name: "Lending", icon: "🤝", color: "#f43f5e" },
  { name: "Other", icon: "📦", color: "#6b7280" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fmt = n => "৳" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 });

const catMeta = name => CATEGORIES.find(c => c.name === name) || CATEGORIES[7];

const today = () => new Date().toISOString().split("T")[0];
const monthKey = d => d.slice(0, 7);

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(20000);
  const [editBudget, setEditBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("20000");
  const [form, setForm] = useState({ amount: "", category: "Food", date: today(), note: "" });
  const [filterCat, setFilterCat] = useState("All");
  const [filterMonth, setFilterMonth] = useState(monthKey(today()));
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [editId, setEditId] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Load data
  useEffect(() => {
    (async () => {
      try {
        const r = await localStorage.getItem("exp_data");
        if (r) {
          const d = JSON.parse(r);
          setExpenses(d.expenses || []);
          setBudget(d.budget || 20000);
          setBudgetInput(String(d.budget || 20000));
        }
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  const save = useCallback(async (exps, bud) => {
    setSaving(true);
    try { await localStorage.setItem("exp_data", JSON.stringify({ expenses: exps, budget: bud })); }
    catch (_) {}
    setSaving(false);
  }, []);

  const thisMonth = expenses.filter(e => monthKey(e.date) === filterMonth);
  const totalSpent = thisMonth.reduce((s, e) => s + e.amount, 0);
  const remaining = budget - totalSpent;
  const pct = Math.min((totalSpent / budget) * 100, 100);
  const overBudget = totalSpent > budget;
  const nearBudget = !overBudget && pct >= 80;

  const addExpense = () => {
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) return showToast("Enter a valid amount", "error");
    let newExps;
    if (editId) {
      newExps = expenses.map(e => e.id === editId ? { ...e, ...form, amount: amt } : e);
      setEditId(null);
      showToast("Expense updated!");
    } else {
      const entry = { id: Date.now(), ...form, amount: amt };
      newExps = [entry, ...expenses];
      showToast("Expense added!");
    }
    setExpenses(newExps);
    save(newExps, budget);
    setForm({ amount: "", category: "Food", date: today(), note: "" });
  };

  const deleteExpense = id => {
    const newExps = expenses.filter(e => e.id !== id);
    setExpenses(newExps);
    save(newExps, budget);
    showToast("Deleted", "error");
  };

  const startEdit = e => {
    setEditId(e.id);
    setForm({ amount: String(e.amount), category: e.category, date: e.date, note: e.note || "" });
    setTab("add");
  };

  const saveBudget = () => {
    const b = parseFloat(budgetInput);
    if (!b || b <= 0) return;
    setBudget(b);
    save(expenses, b);
    setEditBudget(false);
    showToast("Budget updated!");
  };

  // Chart data
  const catTotals = CATEGORIES.map(c => ({
    name: c.name, value: thisMonth.filter(e => e.category === c.name).reduce((s, e) => s + e.amount, 0), color: c.color
  })).filter(c => c.value > 0);

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const key = monthKey(d.toISOString());
    const total = expenses.filter(e => monthKey(e.date) === key).reduce((s, e) => s + e.amount, 0);
    return { month: MONTHS[d.getMonth()], total };
  });

  const filtered = expenses.filter(e =>
    (filterCat === "All" || e.category === filterCat) &&
    monthKey(e.date) === filterMonth
  );

  const months = [...new Set(expenses.map(e => monthKey(e.date)))].sort().reverse();

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f172a", color: "#94a3b8", fontSize: 18 }}>
      Loading your data...
    </div>
  );

  const s = {
    app: { minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif", paddingBottom: 80 },
    header: { background: "#1e293b", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155" },
    title: { fontSize: 20, fontWeight: 700, color: "#f1f5f9" },
    saving: { fontSize: 12, color: "#64748b" },
    nav: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#1e293b", borderTop: "1px solid #334155", display: "flex", justifyContent: "space-around", padding: "8px 0", zIndex: 50 },
    navBtn: (active) => ({ background: "none", border: "none", color: active ? "#6366f1" : "#64748b", fontSize: 11, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", padding: "4px 12px", fontWeight: active ? 700 : 400 }),
    card: { background: "#1e293b", borderRadius: 12, padding: 16, margin: "12px 16px" },
    label: { fontSize: 12, color: "#94a3b8", marginBottom: 4 },
    val: { fontSize: 28, fontWeight: 700 },
    row: { display: "flex", gap: 12, margin: "0 16px 0 16px" },
    halfCard: { background: "#1e293b", borderRadius: 12, padding: 14, flex: 1 },
    input: { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9", padding: "10px 12px", fontSize: 15, boxSizing: "border-box", outline: "none" },
    select: { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9", padding: "10px 12px", fontSize: 15, boxSizing: "border-box" },
    btn: (color = "#6366f1") => ({ background: color, color: "#fff", border: "none", borderRadius: 8, padding: "12px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }),
    expItem: { background: "#1e293b", borderRadius: 10, padding: "12px 14px", margin: "8px 16px", display: "flex", alignItems: "center", gap: 12 },
    badge: (color) => ({ background: color + "22", color, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }),
  };

  const alertBar = overBudget
    ? <div style={{ background: "#7f1d1d", color: "#fca5a5", padding: "10px 16px", fontSize: 13, fontWeight: 600 }}>🚨 Over budget by {fmt(Math.abs(remaining))} this month!</div>
    : nearBudget
    ? <div style={{ background: "#78350f", color: "#fcd34d", padding: "10px 16px", fontSize: 13, fontWeight: 600 }}>⚠️ You've used {Math.round(pct)}% of your budget — spend carefully!</div>
    : null;

  return (
    <div style={s.app}>
      {toast && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: toast.type === "error" ? "#ef4444" : "#22c55e", color: "#fff", padding: "10px 24px", borderRadius: 20, fontWeight: 600, zIndex: 100, fontSize: 14 }}>
          {toast.msg}
        </div>
      )}
      <div style={s.header}>
        <span style={s.title}>💸 ExpenseTracker</span>
        <span style={s.saving}>{saving ? "Saving..." : "✓ Synced"}</span>
      </div>
      {alertBar}

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div>
          <div style={s.card}>
            <div style={s.label}>Monthly Budget</div>
            {editBudget ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...s.input, flex: 1 }} value={budgetInput} onChange={e => setBudgetInput(e.target.value)} type="number" />
                <button style={{ ...s.btn(), width: "auto", padding: "10px 16px" }} onClick={saveBudget}>Save</button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ ...s.val, color: "#6366f1" }}>{fmt(budget)}</div>
                <button onClick={() => setEditBudget(true)} style={{ background: "#334155", color: "#94a3b8", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13 }}>Edit</button>
              </div>
            )}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>
                <span>Spent: {fmt(totalSpent)}</span>
                <span>Left: {fmt(Math.max(remaining, 0))}</span>
              </div>
              <div style={{ background: "#0f172a", borderRadius: 99, height: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: pct + "%", background: overBudget ? "#ef4444" : nearBudget ? "#eab308" : "#6366f1", borderRadius: 99, transition: "width 0.5s" }} />
              </div>
            </div>
          </div>

          <div style={s.row}>
            <div style={s.halfCard}>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>This Month</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#f97316" }}>{fmt(totalSpent)}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{thisMonth.length} transactions</div>
            </div>
            <div style={s.halfCard}>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Remaining</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: remaining >= 0 ? "#22c55e" : "#ef4444" }}>{fmt(Math.abs(remaining))}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{remaining < 0 ? "over budget" : "available"}</div>
            </div>
          </div>

          {catTotals.length > 0 && (
            <div style={s.card}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Spending by Category</div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={catTotals} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`} labelLine={false}>
                    {catTotals.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                  <Tooltip formatter={v => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div style={s.card}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Last 6 Months</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={last6Months}>
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={v => fmt(v)} contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f1f5f9" }} />
                <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={s.card}>
            <div style={{ fontWeight: 600, marginBottom: 10 }}>Top Categories</div>
            {catTotals.sort((a, b) => b.value - a.value).slice(0, 4).map(c => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{catMeta(c.name).icon}</span>
                  <span style={{ fontSize: 14 }}>{c.name}</span>
                </div>
                <span style={{ fontWeight: 600, color: c.color }}>{fmt(c.value)}</span>
              </div>
            ))}
            {catTotals.length === 0 && <div style={{ color: "#64748b", fontSize: 14 }}>No expenses this month yet.</div>}
          </div>
        </div>
      )}

      {/* ADD EXPENSE */}
      {tab === "add" && (
        <div style={s.card}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>{editId ? "✏️ Edit Expense" : "➕ Add Expense"}</div>
          <div style={{ marginBottom: 12 }}>
            <div style={s.label}>Amount (৳)</div>
            <input style={s.input} type="number" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={s.label}>Category</div>
            <select style={s.select} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c.name}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={s.label}>Date</div>
            <input style={s.input} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={s.label}>Note (optional)</div>
            <input style={s.input} type="text" placeholder="e.g. Lunch at office" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          </div>
          <button style={s.btn()} onClick={addExpense}>{editId ? "Update Expense" : "Add Expense"}</button>
          {editId && <button style={{ ...s.btn("#334155"), marginTop: 10 }} onClick={() => { setEditId(null); setForm({ amount: "", category: "Food", date: today(), note: "" }); }}>Cancel</button>}
        </div>
      )}

      {/* HISTORY */}
      {tab === "history" && (
        <div>
          <div style={{ padding: "12px 16px 0", display: "flex", gap: 8, overflowX: "auto" }}>
            <select style={{ ...s.select, width: "auto", flex: 1 }} value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
              {(months.length ? months : [monthKey(today())]).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select style={{ ...s.select, width: "auto", flex: 1 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option>All</option>
              {CATEGORIES.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ padding: "8px 16px", color: "#94a3b8", fontSize: 13 }}>
            {filtered.length} transactions · {fmt(filtered.reduce((s, e) => s + e.amount, 0))} total
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", color: "#64748b", padding: 40 }}>No expenses found.</div>
          )}
          {filtered.map(e => {
            const meta = catMeta(e.category);
            return (
              <div key={e.id} style={s.expItem}>
                <div style={{ fontSize: 26 }}>{meta.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={s.badge(meta.color)}>{e.category}</span>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{fmt(e.amount)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{e.date} {e.note ? `· ${e.note}` : ""}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button onClick={() => startEdit(e)} style={{ background: "#334155", border: "none", borderRadius: 6, color: "#94a3b8", padding: "4px 8px", cursor: "pointer", fontSize: 13 }}>✏️</button>
                  <button onClick={() => deleteExpense(e.id)} style={{ background: "#7f1d1d", border: "none", borderRadius: 6, color: "#fca5a5", padding: "4px 8px", cursor: "pointer", fontSize: 13 }}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <nav style={s.nav}>
        {[["dashboard","📊","Dashboard"],["add","➕","Add"],["history","📋","History"]].map(([id, icon, label]) => (
          <button key={id} style={s.navBtn(tab === id)} onClick={() => setTab(id)}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
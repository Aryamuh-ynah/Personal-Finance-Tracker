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

const INCOME_SOURCES = [
  { name: "Salary", icon: "💼", color: "#22c55e" },
  { name: "Freelance", icon: "💻", color: "#6366f1" },
  { name: "Business", icon: "🏪", color: "#f97316" },
  { name: "Gift", icon: "🎁", color: "#ec4899" },
  { name: "Investment", icon: "📈", color: "#eab308" },
  { name: "Loan Received", icon: "🏦", color: "#06b6d4" },
  { name: "Other", icon: "💰", color: "#6b7280" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmt = n => "৳" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 });
const catMeta = (name, list) => list.find(c => c.name === name) || list[list.length - 1];
const today = () => new Date().toISOString().split("T")[0];
const monthKey = d => d.slice(0, 7);

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budget, setBudget] = useState(20000);
  const [editBudget, setEditBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("20000");
  const [expForm, setExpForm] = useState({ amount: "", category: "Food", date: today(), note: "" });
  const [incForm, setIncForm] = useState({ amount: "", source: "Salary", date: today(), note: "" });
  const [filterCat, setFilterCat] = useState("All");
  const [filterMonth, setFilterMonth] = useState(monthKey(today()));
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [editExpId, setEditExpId] = useState(null);
  const [editIncId, setEditIncId] = useState(null);
  const [incomeView, setIncomeView] = useState("add"); // "add" | "history"

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    (async () => {
      try {
        const r = await localStorage.getItem("fin_data_v2");
        if (r) {
          const d = JSON.parse(r);
          setExpenses(d.expenses || []);
          setIncomes(d.incomes || []);
          setBudget(d.budget || 20000);
          setBudgetInput(String(d.budget || 20000));
        }
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  const save = useCallback(async (exps, incs, bud) => {
    setSaving(true);
    try { await localStorage.setItem("fin_data_v2", JSON.stringify({ expenses: exps, incomes: incs, budget: bud })); }
    catch (_) {}
    setSaving(false);
  }, []);

  const curMonthKey = monthKey(today());
  const thisMonthExp = expenses.filter(e => monthKey(e.date) === curMonthKey);
  const thisMonthInc = incomes.filter(i => monthKey(i.date) === curMonthKey);
  const totalSpent = thisMonthExp.reduce((s, e) => s + e.amount, 0);
  const totalIncome = thisMonthInc.reduce((s, i) => s + i.amount, 0);
  const netBalance = totalIncome - totalSpent;
  const remaining = budget - totalSpent;
  const pct = Math.min((totalSpent / budget) * 100, 100);
  const overBudget = totalSpent > budget;
  const nearBudget = !overBudget && pct >= 80;

  const addExpense = () => {
    const amt = parseFloat(expForm.amount);
    if (!amt || amt <= 0) return showToast("Enter a valid amount", "error");
    let newExps;
    if (editExpId) {
      newExps = expenses.map(e => e.id === editExpId ? { ...e, ...expForm, amount: amt } : e);
      setEditExpId(null);
      showToast("Expense updated!");
    } else {
      newExps = [{ id: Date.now(), ...expForm, amount: amt }, ...expenses];
      showToast("Expense added!");
    }
    setExpenses(newExps);
    save(newExps, incomes, budget);
    setExpForm({ amount: "", category: "Food", date: today(), note: "" });
  };

  const addIncome = () => {
    const amt = parseFloat(incForm.amount);
    if (!amt || amt <= 0) return showToast("Enter a valid amount", "error");
    let newIncs;
    if (editIncId) {
      newIncs = incomes.map(i => i.id === editIncId ? { ...i, ...incForm, amount: amt } : i);
      setEditIncId(null);
      showToast("Income updated!");
    } else {
      newIncs = [{ id: Date.now(), ...incForm, amount: amt }, ...incomes];
      showToast("Income added!");
    }
    setIncomes(newIncs);
    save(expenses, newIncs, budget);
    setIncForm({ amount: "", source: "Salary", date: today(), note: "" });
  };

  const deleteExpense = id => {
    const n = expenses.filter(e => e.id !== id);
    setExpenses(n); save(n, incomes, budget); showToast("Deleted", "error");
  };

  const deleteIncome = id => {
    const n = incomes.filter(i => i.id !== id);
    setIncomes(n); save(expenses, n, budget); showToast("Deleted", "error");
  };

  const startEditExp = e => { setEditExpId(e.id); setExpForm({ amount: String(e.amount), category: e.category, date: e.date, note: e.note || "" }); setTab("expenses"); };
  const startEditInc = i => { setEditIncId(i.id); setIncForm({ amount: String(i.amount), source: i.source, date: i.date, note: i.note || "" }); setTab("income"); setIncomeView("add"); };

  const saveBudget = () => {
    const b = parseFloat(budgetInput);
    if (!b || b <= 0) return;
    setBudget(b); save(expenses, incomes, b); setEditBudget(false); showToast("Budget updated!");
  };

  const catTotals = CATEGORIES.map(c => ({
    name: c.name, value: thisMonthExp.filter(e => e.category === c.name).reduce((s, e) => s + e.amount, 0), color: c.color
  })).filter(c => c.value > 0);

  const srcTotals = INCOME_SOURCES.map(s => ({
    name: s.name, value: thisMonthInc.filter(i => i.source === s.name).reduce((a, i) => a + i.amount, 0), color: s.color
  })).filter(s => s.value > 0);

  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const key = monthKey(d.toISOString());
    return {
      month: MONTHS[d.getMonth()],
      Spent: expenses.filter(e => monthKey(e.date) === key).reduce((s, e) => s + e.amount, 0),
      Income: incomes.filter(i => monthKey(i.date) === key).reduce((s, i) => s + i.amount, 0),
    };
  });

  const allMonths = [...new Set([...expenses.map(e => monthKey(e.date)), ...incomes.map(i => monthKey(i.date))])].sort().reverse();
  const filteredExp = expenses.filter(e => (filterCat === "All" || e.category === filterCat) && monthKey(e.date) === filterMonth);
  const filteredInc = incomes.filter(i => monthKey(i.date) === filterMonth);

  const s = {
    app: { minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif", paddingBottom: 80 },
    header: { background: "#1e293b", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155" },
    nav: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#1e293b", borderTop: "1px solid #334155", display: "flex", justifyContent: "space-around", padding: "6px 0", zIndex: 50 },
    navBtn: (a) => ({ background: "none", border: "none", color: a ? "#6366f1" : "#64748b", fontSize: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", padding: "4px 8px", fontWeight: a ? 700 : 400 }),
    card: { background: "#1e293b", borderRadius: 12, padding: 16, margin: "12px 16px" },
    label: { fontSize: 12, color: "#94a3b8", marginBottom: 4 },
    input: { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9", padding: "10px 12px", fontSize: 15, boxSizing: "border-box", outline: "none" },
    select: { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9", padding: "10px 12px", fontSize: 15, boxSizing: "border-box" },
    btn: (color = "#6366f1") => ({ background: color, color: "#fff", border: "none", borderRadius: 8, padding: "12px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }),
    row: { display: "flex", gap: 10, margin: "0 16px" },
    halfCard: { background: "#1e293b", borderRadius: 12, padding: 14, flex: 1 },
    badge: (color) => ({ background: color + "22", color, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }),
    item: { background: "#1e293b", borderRadius: 10, padding: "12px 14px", margin: "8px 16px", display: "flex", alignItems: "center", gap: 12 },
    tabBtn: (a) => ({ flex: 1, padding: "8px", background: a ? "#6366f1" : "#0f172a", color: a ? "#fff" : "#64748b", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }),
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f172a", color: "#94a3b8" }}>Loading...</div>;

  const alertBar = overBudget
    ? <div style={{ background: "#7f1d1d", color: "#fca5a5", padding: "8px 16px", fontSize: 13, fontWeight: 600 }}>🚨 Over budget by {fmt(Math.abs(remaining))}!</div>
    : nearBudget ? <div style={{ background: "#78350f", color: "#fcd34d", padding: "8px 16px", fontSize: 13, fontWeight: 600 }}>⚠️ Used {Math.round(pct)}% of budget — be careful!</div> : null;

  return (
    <div style={s.app}>
      {toast && <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: toast.type === "error" ? "#ef4444" : "#22c55e", color: "#fff", padding: "10px 24px", borderRadius: 20, fontWeight: 600, zIndex: 100, fontSize: 14 }}>{toast.msg}</div>}

      <div style={s.header}>
        <span style={{ fontSize: 18, fontWeight: 700 }}>💸 Finance Tracker</span>
        <span style={{ fontSize: 12, color: "#64748b" }}>{saving ? "Saving..." : "✓ Synced"}</span>
      </div>
      {alertBar}

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div>
          {/* Net Balance */}
          <div style={{ ...s.card, background: netBalance >= 0 ? "#0f2922" : "#2a0f0f", border: `1px solid ${netBalance >= 0 ? "#22c55e33" : "#ef444433"}` }}>
            <div style={s.label}>Net Balance (This Month)</div>
            <div style={{ fontSize: 34, fontWeight: 800, color: netBalance >= 0 ? "#22c55e" : "#ef4444" }}>{netBalance >= 0 ? "+" : ""}{fmt(netBalance)}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Income − Expenses</div>
          </div>

          <div style={s.row}>
            <div style={s.halfCard}>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>💰 Income</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#22c55e" }}>{fmt(totalIncome)}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{thisMonthInc.length} entries</div>
            </div>
            <div style={s.halfCard}>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>💸 Spent</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f97316" }}>{fmt(totalSpent)}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{thisMonthExp.length} transactions</div>
            </div>
          </div>

          {/* Budget Bar */}
          <div style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={s.label}>Monthly Budget</div>
              {editBudget ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <input style={{ ...s.input, width: 120, padding: "6px 10px" }} value={budgetInput} onChange={e => setBudgetInput(e.target.value)} type="number" />
                  <button style={{ ...s.btn(), width: "auto", padding: "6px 12px", fontSize: 13 }} onClick={saveBudget}>Save</button>
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

          {/* Income by source */}
          {srcTotals.length > 0 && (
            <div style={s.card}>
              <div style={{ fontWeight: 600, marginBottom: 10 }}>Income Sources</div>
              {srcTotals.map(src => {
                const meta = catMeta(src.name, INCOME_SOURCES);
                return (
                  <div key={src.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{meta.icon}</span><span style={{ fontSize: 14 }}>{src.name}</span>
                    </div>
                    <span style={{ fontWeight: 600, color: src.color }}>{fmt(src.value)}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Spending by category */}
          {catTotals.length > 0 && (
            <div style={s.card}>
              <div style={{ fontWeight: 600, marginBottom: 10 }}>Spending by Category</div>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={catTotals} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`} labelLine={false}>
                    {catTotals.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                  <Tooltip formatter={v => fmt(v)} contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f1f5f9" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* 6 month bar */}
          <div style={s.card}>
            <div style={{ fontWeight: 600, marginBottom: 10 }}>6-Month Overview</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={last6} barCategoryGap="30%">
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={v => fmt(v)} contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f1f5f9" }} />
                <Bar dataKey="Income" fill="#22c55e" radius={[4,4,0,0]} />
                <Bar dataKey="Spent" fill="#f97316" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
              <span><span style={{ color: "#22c55e" }}>■</span> Income</span>
              <span><span style={{ color: "#f97316" }}>■</span> Spent</span>
            </div>
          </div>
        </div>
      )}

      {/* INCOME */}
      {tab === "income" && (
        <div>
          <div style={{ display: "flex", gap: 8, padding: "12px 16px 0" }}>
            <button style={s.tabBtn(incomeView === "add")} onClick={() => setIncomeView("add")}>{editIncId ? "✏️ Edit" : "➕ Add Income"}</button>
            <button style={s.tabBtn(incomeView === "history")} onClick={() => setIncomeView("history")}>📋 History</button>
          </div>

          {incomeView === "add" && (
            <div style={s.card}>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>{editIncId ? "✏️ Edit Income" : "💰 Add Income"}</div>
              <div style={{ marginBottom: 12 }}>
                <div style={s.label}>Amount (৳)</div>
                <input style={s.input} type="number" placeholder="0.00" value={incForm.amount} onChange={e => setIncForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={s.label}>Source</div>
                <select style={s.select} value={incForm.source} onChange={e => setIncForm(f => ({ ...f, source: e.target.value }))}>
                  {INCOME_SOURCES.map(src => <option key={src.name}>{src.icon} {src.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={s.label}>Date</div>
                <input style={s.input} type="date" value={incForm.date} onChange={e => setIncForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={s.label}>Note (optional)</div>
                <input style={s.input} type="text" placeholder="e.g. March salary from company" value={incForm.note} onChange={e => setIncForm(f => ({ ...f, note: e.target.value }))} />
              </div>
              <button style={s.btn("#22c55e")} onClick={addIncome}>{editIncId ? "Update Income" : "Add Income"}</button>
              {editIncId && <button style={{ ...s.btn("#334155"), marginTop: 10 }} onClick={() => { setEditIncId(null); setIncForm({ amount: "", source: "Salary", date: today(), note: "" }); }}>Cancel</button>}
            </div>
          )}

          {incomeView === "history" && (
            <div>
              <div style={{ padding: "8px 16px" }}>
                <select style={s.select} value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
                  {(allMonths.length ? allMonths : [monthKey(today())]).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div style={{ padding: "4px 16px", color: "#94a3b8", fontSize: 13 }}>
                {filteredInc.length} entries · {fmt(filteredInc.reduce((s, i) => s + i.amount, 0))} total
              </div>
              {filteredInc.length === 0 && <div style={{ textAlign: "center", color: "#64748b", padding: 40 }}>No income recorded.</div>}
              {filteredInc.map(i => {
                const meta = catMeta(i.source, INCOME_SOURCES);
                return (
                  <div key={i.id} style={s.item}>
                    <div style={{ fontSize: 26 }}>{meta.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={s.badge(meta.color)}>{i.source}</span>
                        <span style={{ fontWeight: 700, color: "#22c55e" }}>{fmt(i.amount)}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{i.date}{i.note ? ` · ${i.note}` : ""}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <button onClick={() => startEditInc(i)} style={{ background: "#334155", border: "none", borderRadius: 6, color: "#94a3b8", padding: "4px 8px", cursor: "pointer", fontSize: 13 }}>✏️</button>
                      <button onClick={() => deleteIncome(i.id)} style={{ background: "#7f1d1d", border: "none", borderRadius: 6, color: "#fca5a5", padding: "4px 8px", cursor: "pointer", fontSize: 13 }}>🗑️</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* EXPENSES */}
      {tab === "expenses" && (
        <div>
          <div style={{ display: "flex", gap: 8, padding: "12px 16px 0" }}>
            <button style={s.tabBtn(!editExpId ? true : true)} onClick={() => { setEditExpId(null); setExpForm({ amount: "", category: "Food", date: today(), note: "" }); }}>➕ Add</button>
          </div>
          <div style={s.card}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>{editExpId ? "✏️ Edit Expense" : "➕ Add Expense"}</div>
            <div style={{ marginBottom: 12 }}>
              <div style={s.label}>Amount (৳)</div>
              <input style={s.input} type="number" placeholder="0.00" value={expForm.amount} onChange={e => setExpForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={s.label}>Category</div>
              <select style={s.select} value={expForm.category} onChange={e => setExpForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c.name}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={s.label}>Date</div>
              <input style={s.input} type="date" value={expForm.date} onChange={e => setExpForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={s.label}>Note (optional)</div>
              <input style={s.input} type="text" placeholder="e.g. Lunch at office" value={expForm.note} onChange={e => setExpForm(f => ({ ...f, note: e.target.value }))} />
            </div>
            <button style={s.btn()} onClick={addExpense}>{editExpId ? "Update Expense" : "Add Expense"}</button>
            {editExpId && <button style={{ ...s.btn("#334155"), marginTop: 10 }} onClick={() => { setEditExpId(null); setExpForm({ amount: "", category: "Food", date: today(), note: "" }); }}>Cancel</button>}
          </div>
        </div>
      )}

      {/* HISTORY */}
      {tab === "history" && (
        <div>
          <div style={{ padding: "12px 16px 0", display: "flex", gap: 8 }}>
            <select style={{ ...s.select, flex: 1 }} value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
              {(allMonths.length ? allMonths : [monthKey(today())]).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select style={{ ...s.select, flex: 1 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option>All</option>
              {CATEGORIES.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ padding: "8px 16px", color: "#94a3b8", fontSize: 13 }}>
            {filteredExp.length} transactions · {fmt(filteredExp.reduce((s, e) => s + e.amount, 0))} spent
          </div>
          {filteredExp.length === 0 && <div style={{ textAlign: "center", color: "#64748b", padding: 40 }}>No expenses found.</div>}
          {filteredExp.map(e => {
            const meta = catMeta(e.category, CATEGORIES);
            return (
              <div key={e.id} style={s.item}>
                <div style={{ fontSize: 26 }}>{meta.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={s.badge(meta.color)}>{e.category}</span>
                    <span style={{ fontWeight: 700 }}>{fmt(e.amount)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{e.date}{e.note ? ` · ${e.note}` : ""}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button onClick={() => startEditExp(e)} style={{ background: "#334155", border: "none", borderRadius: 6, color: "#94a3b8", padding: "4px 8px", cursor: "pointer", fontSize: 13 }}>✏️</button>
                  <button onClick={() => deleteExpense(e.id)} style={{ background: "#7f1d1d", border: "none", borderRadius: 6, color: "#fca5a5", padding: "4px 8px", cursor: "pointer", fontSize: 13 }}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <nav style={s.nav}>
        {[["dashboard","📊","Dashboard"],["income","💰","Income"],["expenses","➕","Expense"],["history","📋","History"]].map(([id, icon, label]) => (
          <button key={id} style={s.navBtn(tab === id)} onClick={() => setTab(id)}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
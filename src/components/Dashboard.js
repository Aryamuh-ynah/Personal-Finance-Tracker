import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATEGORIES, INCOME_SOURCES } from "../constants/finance";
import { catMeta, fmt, monthKey, stripEmoji } from "../utils/finance";
import BudgetCard from "./BudgetCard";

function ExpensesPopup({ isOpen, onClose, expenses, styles }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 200, display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div style={{ background: "#1e293b", borderRadius: "16px 16px 0 0", width: "100%", maxHeight: "60vh", overflowY: "auto", padding: 16 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>💸 This Month&apos;s Expenses</div>
        {expenses.length === 0 && <div style={{ color: "#64748b", fontSize: 14 }}>No expenses this month.</div>}
        {expenses.map((expense) => {
          const meta = catMeta(expense.category, CATEGORIES);
          return (
            <div key={expense.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #334155" }}>
              <span style={{ fontSize: 20 }}>{meta.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{expense.category}{expense.note ? ` · ${expense.note}` : ""}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{expense.date}</div>
              </div>
              <span style={{ fontWeight: 700, color: "#f97316" }}>{fmt(expense.amount)}</span>
            </div>
          );
        })}
        <button style={{ ...styles.btn("#334155"), marginTop: 14 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function IncomePopup({ isOpen, onClose, incomes, expenses, currentMonthIncomes, totalIncome, styles }) {
  if (!isOpen) return null;

  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  const lastKey = monthKey(date.toISOString());
  const lastIncome = incomes.filter((income) => monthKey(income.date) === lastKey).reduce((sum, income) => sum + income.amount, 0);
  const lastExpense = expenses.filter((expense) => monthKey(expense.date) === lastKey).reduce((sum, expense) => sum + expense.amount, 0);
  const carried = lastIncome - lastExpense;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 200, display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div style={{ background: "#1e293b", borderRadius: "16px 16px 0 0", width: "100%", maxHeight: "60vh", overflowY: "auto", padding: 16 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>💰 This Month&apos;s Income</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #334155", background: carried >= 0 ? "#0f291e" : "#2a0f0f", borderRadius: 8, paddingLeft: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 20 }}>🔄</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Carried Forward</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Last month&apos;s leftover ({lastKey})</div>
          </div>
          <span style={{ fontWeight: 700, color: carried >= 0 ? "#22c55e" : "#ef4444" }}>{carried >= 0 ? "+" : ""}{fmt(carried)}</span>
        </div>
        {currentMonthIncomes.length === 0 && <div style={{ color: "#64748b", fontSize: 14, marginTop: 8 }}>No income this month.</div>}
        {currentMonthIncomes.map((income) => {
          const meta = catMeta(income.source, INCOME_SOURCES);
          const hasEmoji = /^\p{Emoji}/u.test(income.source.trim());
          return (
            <div key={income.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #334155" }}>
              <span style={{ fontSize: 20 }}>{meta.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{hasEmoji ? stripEmoji(income.source) : income.source}{income.note ? ` · ${income.note}` : ""}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{income.date}</div>
              </div>
              <span style={{ fontWeight: 700, color: "#22c55e" }}>{fmt(income.amount)}</span>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 4px", borderTop: "1px solid #334155", marginTop: 4 }}>
          <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>Total Available</span>
          <span style={{ fontWeight: 700, color: "#22c55e" }}>{fmt(totalIncome + Math.max(carried, 0))}</span>
        </div>
        <button style={{ ...styles.btn("#334155"), marginTop: 10 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function Dashboard({ data, budgetState, popupState, styles }) {
  const { netBalance, totalIncome, totalSpent, thisMonthExp, thisMonthInc, catTotals, last6 } = data;
  const { budget } = budgetState;
  const { showExpPopup, setShowExpPopup, showIncPopup, setShowIncPopup, expenses, incomes } = popupState;

  return (
    <div>
      <div style={{ ...styles.card, background: netBalance >= 0 ? "#0f2922" : "#2a0f0f", border: `1px solid ${netBalance >= 0 ? "#22c55e33" : "#ef444433"}` }}>
        <div style={styles.label}>Net Balance (This Month)</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: netBalance >= 0 ? "#22c55e" : "#ef4444" }}>{netBalance >= 0 ? "+" : ""}{fmt(netBalance)}</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Income − Expenses</div>
      </div>

      <div style={styles.row}>
        <div style={{ ...styles.halfCard, cursor: "pointer" }} onClick={() => setShowIncPopup(true)}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>💰 Income</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#22c55e" }}>{fmt(totalIncome)}</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>{thisMonthInc.length} entries</div>
        </div>
        <div style={{ ...styles.halfCard, cursor: "pointer" }} onClick={() => setShowExpPopup(true)}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>💸 Spent</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#f97316" }}>{fmt(totalSpent)}</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>{thisMonthExp.length} transactions</div>
        </div>
      </div>

      <ExpensesPopup isOpen={showExpPopup} onClose={() => setShowExpPopup(false)} expenses={thisMonthExp} styles={styles} />
      <IncomePopup isOpen={showIncPopup} onClose={() => setShowIncPopup(false)} incomes={incomes} expenses={expenses} currentMonthIncomes={thisMonthInc} totalIncome={totalIncome} styles={styles} />

      <BudgetCard budget={budget} totalSpent={totalSpent} styles={styles} />

      {catTotals.length > 0 && (
        <div style={styles.card}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Spending by Category</div>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={catTotals} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`} labelLine={false}>
                {catTotals.map((category, index) => <Cell key={index} fill={category.color} />)}
              </Pie>
              <Tooltip formatter={(value) => fmt(value)} contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f1f5f9" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={styles.card}>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>6-Month Overview</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={last6} barCategoryGap="30%">
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip formatter={(value) => fmt(value)} contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f1f5f9" }} />
            <Bar dataKey="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Spent" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
          <span><span style={{ color: "#22c55e" }}>■</span> Income</span>
          <span><span style={{ color: "#f97316" }}>■</span> Spent</span>
        </div>
      </div>
    </div>
  );
}

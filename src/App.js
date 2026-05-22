import { useCallback, useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/Dashboard";
import ExpensePage from "./components/ExpensePage";
import Header from "./components/Header";
import HistoryPage from "./components/HistoryPage";
import IncomePage from "./components/IncomePage";
import Toast from "./components/Toast";
import { CATEGORIES, DEFAULT_BUDGET, MONTHS } from "./constants/finance";
import { styles } from "./styles/appStyles";
import { fmt, monthKey, today } from "./utils/finance";
import { loadFinanceData, saveFinanceData } from "./utils/storage";

const emptyExpenseForm = () => ({ amount: "", category: "Food", date: today(), note: "" });
const emptyIncomeForm = () => ({ amount: "", source: "Salary", date: today(), note: "" });

export default function App() {
  const [tab, setTab] = useState(() => {
  return localStorage.getItem("activeTab") || "dashboard";
});
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [editBudget, setEditBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(DEFAULT_BUDGET));
  const [expForm, setExpForm] = useState(emptyExpenseForm);
  const [incForm, setIncForm] = useState(emptyIncomeForm);
  const [filterCat, setFilterCat] = useState("All");
  const [filterMonth, setFilterMonth] = useState(monthKey(today()));
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [editExpId, setEditExpId] = useState(null);
  const [showExpPopup, setShowExpPopup] = useState(false);
  const [showIncPopup, setShowIncPopup] = useState(false);
  const [editIncId, setEditIncId] = useState(null);
  const [incomeView, setIncomeView] = useState("add");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    try {
      const data = loadFinanceData();
      setExpenses(data.expenses);
      setIncomes(data.incomes);
      setBudget(data.budget);
      setBudgetInput(String(data.budget));
    } catch (_) {}

    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", tab);
  }, [tab]);

  const save = useCallback((nextExpenses, nextIncomes, nextBudget) => {
    setSaving(true);

    try {
      saveFinanceData(nextExpenses, nextIncomes, nextBudget);
    } catch (_) {}

    setSaving(false);
  }, []);

  const curMonthKey = monthKey(today());
  const thisMonthExp = expenses.filter((expense) => monthKey(expense.date) === curMonthKey);
  const thisMonthInc = incomes.filter((income) => monthKey(income.date) === curMonthKey);
  const totalSpent = thisMonthExp.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = thisMonthInc.reduce((sum, income) => sum + income.amount, 0);
  const netBalance = totalIncome - totalSpent;
  const remaining = budget - totalSpent;
  const pct = Math.min((totalSpent / budget) * 100, 100);
  const overBudget = totalSpent > budget;
  const nearBudget = !overBudget && pct >= 80;

  const addExpense = () => {
    const amount = parseFloat(expForm.amount);
    if (!amount || amount <= 0) return showToast("Enter a valid amount", "error");

    const nextExpenses = editExpId
      ? expenses.map((expense) => expense.id === editExpId ? { ...expense, ...expForm, amount } : expense)
      : [{ id: Date.now(), ...expForm, amount }, ...expenses];

    setExpenses(nextExpenses);
    save(nextExpenses, incomes, budget);
    setEditExpId(null);
    setExpForm(emptyExpenseForm());
    showToast(editExpId ? "Expense updated!" : "Expense added!");
  };

  const addIncome = () => {
    const amount = parseFloat(incForm.amount);
    if (!amount || amount <= 0) return showToast("Enter a valid amount", "error");

    const nextIncomes = editIncId
      ? incomes.map((income) => income.id === editIncId ? { ...income, ...incForm, amount } : income)
      : [{ id: Date.now(), ...incForm, amount }, ...incomes];

    setIncomes(nextIncomes);
    save(expenses, nextIncomes, budget);
    setEditIncId(null);
    setIncForm(emptyIncomeForm());
    showToast(editIncId ? "Income updated!" : "Income added!");
  };

  const deleteExpense = (id) => {
    const nextExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(nextExpenses);
    save(nextExpenses, incomes, budget);
    showToast("Deleted", "error");
  };

  const deleteIncome = (id) => {
    const nextIncomes = incomes.filter((income) => income.id !== id);
    setIncomes(nextIncomes);
    save(expenses, nextIncomes, budget);
    showToast("Deleted", "error");
  };

  const cancelEditExpense = () => {
    setEditExpId(null);
    setExpForm(emptyExpenseForm());
  };

  const cancelEditIncome = () => {
    setEditIncId(null);
    setIncForm(emptyIncomeForm());
  };

  const startEditExp = (expense) => {
    setEditExpId(expense.id);
    setExpForm({ amount: String(expense.amount), category: expense.category, date: expense.date, note: expense.note || "" });
    setTab("expenses");
  };

  const startEditInc = (income) => {
    setEditIncId(income.id);
    setIncForm({ amount: String(income.amount), source: income.source, date: income.date, note: income.note || "" });
    setTab("income");
    setIncomeView("add");
  };

  const saveBudget = () => {
    const nextBudget = parseFloat(budgetInput);
    if (!nextBudget || nextBudget <= 0) return;

    setBudget(nextBudget);
    save(expenses, incomes, nextBudget);
    setEditBudget(false);
    showToast("Budget updated!");
  };

  const catTotals = CATEGORIES.map((category) => ({
    name: category.name,
    value: thisMonthExp.filter((expense) => expense.category === category.name).reduce((sum, expense) => sum + expense.amount, 0),
    color: category.color,
  })).filter((category) => category.value > 0);

  const last6 = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const key = monthKey(date.toISOString());

    return {
      month: MONTHS[date.getMonth()],
      Spent: expenses.filter((expense) => monthKey(expense.date) === key).reduce((sum, expense) => sum + expense.amount, 0),
      Income: incomes.filter((income) => monthKey(income.date) === key).reduce((sum, income) => sum + income.amount, 0),
    };
  });

  const allMonths = [...new Set([...expenses.map((expense) => monthKey(expense.date)), ...incomes.map((income) => monthKey(income.date))])].sort().reverse();
  const filteredExp = expenses.filter(
    (expense) =>
      monthKey(expense.date) === filterMonth &&
      (filterCat === "All" || expense.category === filterCat)
  );

  const filteredInc = incomes.filter(
    (income) =>
      monthKey(income.date) === filterMonth &&
      (filterCat === "All" || income.source === filterCat)
  );



  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f172a", color: "#94a3b8" }}>Loading...</div>;
  }

  const alertBar = overBudget
    ? <div style={{ background: "#7f1d1d", color: "#fca5a5", padding: "8px 16px", fontSize: 13, fontWeight: 600 }}>🚨 Over budget by {fmt(Math.abs(remaining))}!</div>
    : nearBudget ? <div style={{ background: "#78350f", color: "#fcd34d", padding: "8px 16px", fontSize: 13, fontWeight: 600 }}>⚠️ Used {Math.round(pct)}% of budget — be careful!</div> : null;

  return (
    <div style={styles.app}>
      <Toast toast={toast} />
      <Header saving={saving} styles={styles} />
      {alertBar}

      {tab === "dashboard" && (
        <Dashboard
          data={{ netBalance, totalIncome, totalSpent, thisMonthExp, thisMonthInc, catTotals, last6 }}
          budgetState={{ budget, budgetInput, editBudget, setBudgetInput, setEditBudget, saveBudget, remaining, pct, overBudget, nearBudget }}
          popupState={{ showExpPopup, setShowExpPopup, showIncPopup, setShowIncPopup, expenses, incomes }}
          styles={styles}
        />
      )}

      {tab === "income" && (
        <IncomePage
          incomeView={incomeView}
          setIncomeView={setIncomeView}
          editIncId={editIncId}
          incForm={incForm}
          setIncForm={setIncForm}
          addIncome={addIncome}
          cancelEditIncome={cancelEditIncome}
          filteredInc={filteredInc}
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          allMonths={allMonths}
          startEditInc={startEditInc}
          deleteIncome={deleteIncome}
          styles={styles}
        />
      )}

      {tab === "expenses" && (
        <ExpensePage
          editExpId={editExpId}
          expForm={expForm}
          setExpForm={setExpForm}
          addExpense={addExpense}
          cancelEditExpense={cancelEditExpense}
          styles={styles}
        />
      )}

      {tab === "history" && (
        <HistoryPage
          filteredExp={filteredExp}
          filteredInc={filteredInc}      // new
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          filterCat={filterCat}
          setFilterCat={setFilterCat}
          allMonths={allMonths}
          startEditExp={startEditExp}
          deleteExpense={deleteExpense}
          startEditInc={startEditInc}    // new
          deleteIncome={deleteIncome}    // new
          styles={styles}
        />
      )}

      <BottomNav tab={tab} setTab={setTab} styles={styles} />
    </div>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/Dashboard";
import ExpensePage from "./components/ExpensePage";
import Header from "./components/Header";
import HistoryPage from "./components/HistoryPage";
import IncomePage from "./components/IncomePage";
import SettingsPage from "./components/SettingsPage";
import Toast from "./components/Toast";
import { CATEGORIES, DEFAULT_BUDGET, MONTHS } from "./constants/finance";
import { createStyles, DEFAULT_THEME_ID } from "./styles/appStyles";
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

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem("themeId") || DEFAULT_THEME_ID;
  });

  const styles = useMemo(() => createStyles(themeId), [themeId]);
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
    } catch (error) {
      console.error("Failed to load finance data:", error);
      showToast("Could not load saved data. Using default data.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", tab);
  }, [tab]);

  useEffect(() => {
    localStorage.setItem("themeId", themeId);
  }, [themeId]);


  const save = useCallback((nextExpenses, nextIncomes, nextBudget) => {
    setSaving(true);

    try {
      saveFinanceData(nextExpenses, nextIncomes, nextBudget);
      return true;
    } catch (error) {
      console.error("Failed to save finance data:", error);
      showToast("Could not save data. Please try again.", "error");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const curMonthKey = monthKey(today());
  const thisMonthExp = expenses.filter((expense) => monthKey(expense.date) === curMonthKey);
  const thisMonthInc = incomes.filter((income) => monthKey(income.date) === curMonthKey);
  const totalSpent = thisMonthExp.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const totalIncome = thisMonthInc.reduce(
    (sum, income) => sum + Number(income.amount || 0),
    0
  );
  const netBalance = totalIncome - totalSpent;
  const safeBudget = Number(budget) || 0;
  const remaining = safeBudget - totalSpent;
  const pct = safeBudget > 0 ? Math.min((totalSpent / safeBudget) * 100, 100) : 0;
  const overBudget = totalSpent > budget;
  const nearBudget = !overBudget && pct >= 80;

  const addExpense = () => {
    const amount = parseFloat(expForm.amount);
    if (!amount || amount <= 0) return showToast("Enter a valid amount", "error");

    const nextExpenses = editExpId
      ? expenses.map((expense) => expense.id === editExpId ? { ...expense, ...expForm, amount } : expense)
      : [{ id: Date.now(), ...expForm, amount }, ...expenses];

    if (!save(nextExpenses, incomes, budget)) return;

    setExpenses(nextExpenses);
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

    if (!save(expenses, nextIncomes, budget)) return;

    setIncomes(nextIncomes);
    setEditIncId(null);
    setIncForm(emptyIncomeForm());
    showToast(editIncId ? "Income updated!" : "Income added!");
  };

  const deleteExpense = (id) => {
    setDeleteConfirm({
      type: "expense",
      id,
      title: "Delete Expense?",
      message: "Are you sure you want to delete this expense?",
    });
  };
  const deleteIncome = (id) => {
    setDeleteConfirm({
      type: "income",
      id,
      title: "Delete Income?",
      message: "Are you sure you want to delete this income?",
    });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === "expense") {
      const nextExpenses = expenses.filter(
        (expense) => expense.id !== deleteConfirm.id
      );

      if (!save(nextExpenses, incomes, budget)) return;

      setExpenses(nextExpenses);
      showToast("Expense deleted", "error");
    }

    if (deleteConfirm.type === "income") {
      const nextIncomes = incomes.filter(
        (income) => income.id !== deleteConfirm.id
      );

      if (!save(expenses, nextIncomes, budget)) return;

      setIncomes(nextIncomes);
      showToast("Income deleted", "error");
    }

    setDeleteConfirm(null);
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
    setIncForm({
      amount: String(income.amount),
      source: income.source,
      date: income.date,
      note: income.note || "",
    });
    setTab("income");
  };
  const saveBudget = () => {
    const nextBudget = parseFloat(budgetInput);

    if (!nextBudget || nextBudget <= 0) {
      showToast("Enter a valid budget", "error");
      return;
    }

    if (!save(expenses, incomes, nextBudget)) return;

    setBudget(nextBudget);
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
    <div data-theme={themeId} style={styles.app}>
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
          editIncId={editIncId}
          incForm={incForm}
          setIncForm={setIncForm}
          addIncome={addIncome}
          cancelEditIncome={cancelEditIncome}
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
      {tab === "settings" && (
        <SettingsPage
          themeId={themeId}
          setThemeId={setThemeId}
          budgetInput={budgetInput}
          setBudgetInput={setBudgetInput}
          saveBudget={saveBudget}
          editBudget={editBudget}
          setEditBudget={setEditBudget}
          budget={budget}
          styles={styles}
        />
      )}


      <BottomNav tab={tab} setTab={setTab} styles={styles} />

      {deleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-icon">🗑️</div>

            <h3 className="delete-modal-title">{deleteConfirm.title}</h3>

            <p className="delete-modal-message">{deleteConfirm.message}</p>

            <div className="delete-modal-actions">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="delete-modal-cancel-btn"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="delete-modal-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

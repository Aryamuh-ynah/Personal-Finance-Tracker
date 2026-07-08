import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/Dashboard";
import DpsPage from "./components/DpsPage";
import ExpensePage from "./components/ExpensePage";
import Header from "./components/Header";
import HistoryPage from "./components/HistoryPage";
import IncomePage from "./components/IncomePage";
import SettingsPage from "./components/SettingsPage";
import Toast from "./components/Toast";
import { CATEGORIES, DEFAULT_BUDGET, MONTHS } from "./constants/finance";
import { createStyles, DEFAULT_THEME_ID } from "./styles/appStyles";
import { fmt, monthKey, normalizeDate, today } from "./utils/finance";
import { downloadStatementPDF } from "./utils/pdfStatement";
import { loadFinanceData, saveDpsPlans, saveFinanceData } from "./utils/storage";

const emptyExpenseForm = () => ({ amount: "", category: "Food", date: normalizeDate(), note: "" });
const emptyIncomeForm = () => ({ amount: "", source: "Salary", date: today(), note: "" });

export default function App() {
  const [tab, setTab] = useState(() => {
    return localStorage.getItem("activeTab") || "dashboard";
  });
  const [dpsEnabled, setDpsEnabled] = useState(() => {
    return localStorage.getItem("dpsEnabled") === "true";
  });
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [dpsPlans, setDpsPlans] = useState([]); 
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
  const [appearance, setAppearance] = useState(() => {
    return localStorage.getItem("appearance") || "dark";
  });
  const [statementMonth, setStatementMonth] = useState(() => monthKey(today()));

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
  useEffect(() => {
    localStorage.setItem("appearance", appearance);
  }, [appearance]);
  useEffect(() => {
    localStorage.setItem("dpsEnabled", String(dpsEnabled));

    if (!dpsEnabled && tab === "dps") {
      setTab("dashboard");
    }
  }, [dpsEnabled, tab]);

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
  

  const currentMonth = monthKey(today())
  const previousIncome = incomes
    .filter((income) => monthKey(income.date) < currentMonth)
    .reduce((sum, income) => sum + Number(income.amount || 0), 0);

  const previousExpense = expenses
    .filter((expense) => monthKey(expense.date) < currentMonth)
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  const carriedForward = previousIncome - previousExpense;

  const netBalance = carriedForward + totalIncome - totalSpent;

  const safeBudget = Number(budget) || 0;
  const remaining = safeBudget - totalSpent;
  const pct = safeBudget > 0 ? Math.min((totalSpent / safeBudget) * 100, 100) : 0;
  const overBudget = totalSpent > safeBudget;
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
    value: thisMonthExp
      .filter((expense) => expense.category === category.name)
      .reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
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
    (expense) => monthKey(expense.date) === filterMonth
  );

  const filteredInc = incomes.filter(
    (income) => monthKey(income.date) === filterMonth
  );


  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0f172a", color: "#94a3b8" }}>Loading...</div>;
  }

  const alertBar = overBudget
    ? <div style={{ background: "#7f1d1d", color: "#fca5a5", padding: "8px 16px", fontSize: 13, fontWeight: 600 }}>🚨 Over budget by {fmt(Math.abs(remaining))}!</div>
    : nearBudget ? <div style={{ background: "#78350f", color: "#fcd34d", padding: "8px 16px", fontSize: 13, fontWeight: 600 }}>⚠️ Used {Math.round(pct)}% of budget — be careful!</div> : null;


  const downloadStatement = () => {
    downloadStatementPDF({
      expenses,
      incomes,
      budget,
      selectedMonth: statementMonth,
    });

    showToast("Statement PDF downloaded!");
  };


  const saveDps = (nextDpsPlans) => {
    try {
      saveDpsPlans(nextDpsPlans);
      setDpsPlans(nextDpsPlans);
      showToast("DPS updated!");
    } catch (error) {
      console.error("Failed to save DPS data:", error);
      showToast("Could not save DPS data", "error");
    }
  };

  const addDpsPlan = (plan) => {
    const newPlan = {
      id: crypto.randomUUID(),
      paidMonths: 0,
      ...plan,
    };

    saveDps([newPlan, ...dpsPlans]);
  };
// DPS tracking functions
  const markDpsPaid = (id) => {
    const currentMonth = monthKey(today());

    const selectedPlan = dpsPlans.find((plan) => plan.id === id);

    if (!selectedPlan) return;

    const payments = Array.isArray(selectedPlan.payments)
      ? selectedPlan.payments
      : [];

    if (payments.includes(currentMonth)) {
      showToast("This month's DPS is already paid", "error");
      return;
    }

    const monthlyAmount = Number(selectedPlan.monthlyAmount || 0);

    if (!monthlyAmount || monthlyAmount <= 0) {
      showToast("Invalid DPS amount", "error");
      return;
    }

    const nextDpsPlans = dpsPlans.map((plan) => {
      if (plan.id !== id) return plan;

      const nextPayments = [
        ...(Array.isArray(plan.payments) ? plan.payments : []),
        currentMonth,
      ];

      return {
        ...plan,
        payments: nextPayments,
        paidMonths: nextPayments.length,
      };
    });

    const dpsExpense = {
      id: crypto.randomUUID(),
      amount: monthlyAmount,
      category: "DPS / Savings",
      date: today(),
      note: `${selectedPlan.name} DPS paid for ${currentMonth}`,
    };

    const nextExpenses = [dpsExpense, ...expenses];

    saveDpsPlans(nextDpsPlans);
    setDpsPlans(nextDpsPlans);

    if (!save(nextExpenses, incomes, budget)) return;

    setExpenses(nextExpenses);
    showToast("DPS payment added to expenses!");
  };

  const deleteDpsPlan = (id) => {
    const confirmDelete = window.confirm("Delete this DPS plan?");
    if (!confirmDelete) return;

    const nextDpsPlans = dpsPlans.filter((plan) => plan.id !== id);
    saveDps(nextDpsPlans);
  };
  
  return (
    <div data-theme={themeId} data-appearance={appearance} style={styles.app}>
      <Toast toast={toast} />
      <Header saving={saving} styles={styles} />
      {alertBar}

      {tab === "dashboard" && (
        <Dashboard
          data={{ netBalance, carriedForward, totalIncome, totalSpent, thisMonthExp, thisMonthInc, catTotals, last6 }}
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
          filteredInc={filteredInc}
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          allMonths={allMonths}
          startEditExp={startEditExp}
          deleteExpense={deleteExpense}
          startEditInc={startEditInc}
          deleteIncome={deleteIncome}
          styles={styles}
        />
      )}

      {tab === "dps" && dpsEnabled && (
      <DpsPage
        dpsPlans={dpsPlans}
        addDpsPlan={addDpsPlan}
        markDpsPaid={markDpsPaid}
        deleteDpsPlan={deleteDpsPlan}
        styles={styles}
      />
    )}
      
      {tab === "settings" && (
        <SettingsPage
          themeId={themeId}
          setThemeId={setThemeId}
          appearance={appearance}
          setAppearance={setAppearance}
          dpsEnabled={dpsEnabled}
          setDpsEnabled={setDpsEnabled}
          budgetInput={budgetInput}
          setBudgetInput={setBudgetInput}
          saveBudget={saveBudget}
          editBudget={editBudget}
          setEditBudget={setEditBudget}
          budget={budget}
          expenses={expenses}
          incomes={incomes}
          statementMonth={statementMonth}
          setStatementMonth={setStatementMonth}
          downloadStatement={downloadStatement}
          allMonths={allMonths}
          styles={styles}
        />
      )}

      <BottomNav
        tab={tab}
        setTab={setTab}
        dpsEnabled={dpsEnabled}
        styles={styles}
      />

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

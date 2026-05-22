import { DEFAULT_BUDGET, STORAGE_KEY } from "../constants/finance";

const defaultFinanceData = {
  expenses: [],
  incomes: [],
  budget: DEFAULT_BUDGET,
};

export function loadFinanceData() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return defaultFinanceData;
  }

  const data = JSON.parse(raw);

  return {
    expenses: Array.isArray(data.expenses) ? data.expenses : [],
    incomes: Array.isArray(data.incomes) ? data.incomes : [],
    budget:
      typeof data.budget === "number" && data.budget > 0
        ? data.budget
        : DEFAULT_BUDGET,
  };
}

export function saveFinanceData(expenses, incomes, budget) {
  const data = {
    expenses: Array.isArray(expenses) ? expenses : [],
    incomes: Array.isArray(incomes) ? incomes : [],
    budget:
      typeof budget === "number" && budget > 0
        ? budget
        : DEFAULT_BUDGET,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
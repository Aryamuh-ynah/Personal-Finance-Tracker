import { DEFAULT_BUDGET, STORAGE_KEY } from "../constants/finance";

export function loadFinanceData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { expenses: [], incomes: [], budget: DEFAULT_BUDGET };
  }

  const data = JSON.parse(raw);
  return {
    expenses: data.expenses || [],
    incomes: data.incomes || [],
    budget: data.budget || DEFAULT_BUDGET,
  };
}

export function saveFinanceData(expenses, incomes, budget) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ expenses, incomes, budget }));
}

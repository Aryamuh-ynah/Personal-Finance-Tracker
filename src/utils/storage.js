import { DEFAULT_CATEGORY_BUDGETS, DEFAULT_DATA, DEFAULT_SETTINGS } from "../constants/finance";

const STORAGE_KEY = "fin_data_v2";

export function loadFinanceData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;

    const parsed = JSON.parse(raw);

    return {
      ...DEFAULT_DATA,
      ...parsed,
      categoryBudgets: {
        ...DEFAULT_CATEGORY_BUDGETS,
        ...(parsed.categoryBudgets || {}),
      },
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {}),
      },
      recurringTransactions: parsed.recurringTransactions || [],
      version: 2,
    };
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveFinanceData(data) {
  const dataToSave = {
    ...data,
    lastUpdated: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}
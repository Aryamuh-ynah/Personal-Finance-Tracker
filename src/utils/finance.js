export const fmt = (n) => "৳" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 });
export const stripEmoji = (str = "") => str.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/gu, " ").trim();
export const catMeta = (name, list) => list.find((c) => c.name === name) || list.find((c) => c.name === stripEmoji(name)) || list[list.length - 1];
export const today = () => new Date().toISOString().split("T")[0];
export const monthKey = (d) => d.slice(0, 7);
export const DEFAULT_CATEGORY_BUDGETS = {
  Food: 0,
  Transport: 0,
  Shopping: 0,
  Bills: 0,
  Health: 0,
  Entertainment: 0,
  Other: 0,
};

export const DEFAULT_SETTINGS = {
  currency: "৳",
  theme: "light",
  monthStartDay: 1,
  cloudSyncEnabled: false,
};

export const DEFAULT_DATA = {
  version: 2,
  expenses: [],
  incomes: [],
  budget: 0,
  categoryBudgets: DEFAULT_CATEGORY_BUDGETS,
  recurringTransactions: [],
  settings: DEFAULT_SETTINGS,
  lastUpdated: new Date().toISOString(),
};
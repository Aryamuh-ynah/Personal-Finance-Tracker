# 💸 Personal Finance Tracker (BDT)

A clean, mobile-friendly personal finance tracker built with React. Track your income, expenses, monthly budget, and carried-forward balance — all in one place, with your data saved across sessions.

> 🎙️ **Vibe Coded** — This entire app was built through a conversational AI session using [Claude](https://claude.ai) by Anthropic. No boilerplate, no templates — just vibes and prompts.

---

## ✨ Features

- 💰 **Income Tracking** — Log earnings by source (Salary, Freelance, Business, Gift, Investment, Loan Received, etc.)
- 💸 **Expense Tracking** — Categorize spending (Food, Transport, Bills, Shopping, Health, Education, Groceries, Lending, Donations, and more)
- 📊 **Dashboard** — Net balance, budget progress bar, pie chart by category, 6-month income vs. spending bar chart
- 🔄 **Carried Forward** — See last month's leftover balance at the top of your income breakdown
- 🔔 **Budget Alerts** — Warning at 80% usage, red alert when over budget
- 📋 **History** — Filter expenses by month and category
- ✏️ **Edit & Delete** — Full CRUD on both income and expense entries
- 💾 **Persistent Storage** — Data is saved across sessions via Claude's storage API
- 🇧🇩 **BDT (৳ Taka)** default currency

---

## 🛠️ Tech Stack

| Tool               | Purpose                         |
| ------------------ | ------------------------------- |
| React (Hooks)      | UI & state management           |
| Recharts           | Pie chart & bar chart           |
| Claude Storage API | Session-persistent data storage |

---

## 🚀 Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/Aryamuh-ynah/Personal-Finance-Tracker.git
cd Personal-Finance-Tracker
```

### 2. Install dependencies

```bash
npx create-react-app .
npm install recharts
```

### 3. Replace `src/App.js`

Paste the full component code into `src/App.js`.

### 4. Replace Claude Storage with localStorage

The app uses `window.storage` (Claude-specific API). For local use, swap it out:

**Loading:**

```js
const raw = localStorage.getItem("fin_data_v2");
if (raw) {
  const d = JSON.parse(raw);
  setExpenses(d.expenses || []);
  setIncomes(d.incomes || []);
  setBudget(d.budget || 20000);
}
```

**Saving:**

```js
localStorage.setItem(
  "fin_data_v2",
  JSON.stringify({ expenses: exps, incomes: incs, budget: bud }),
);
```

### 5. Start the app

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
finance-tracker/
├── src/
│   └── App.js        ← entire app lives here
├── public/
└── package.json
```

---

## 📸 Screens

| Dashboard                   | Add Income                 | Expense History            |
| --------------------------- | -------------------------- | -------------------------- |
| Net balance, charts, budget | Source, amount, date, note | Filter by month & category |

---

## 🗂️ Expense Categories

🍔 Food · 🚌 Transport · 💡 Bills · 🛍️ Shopping · 💊 Health · 📚 Education · 🎮 Entertainment · 🛒 Groceries · 🤝 Lending · 🤲 Donations · 📦 Other

## 💰 Income Sources

💼 Salary · 💻 Freelance · 🏪 Business · 🎁 Gift · 📈 Investment · 🏦 Loan Received · 💰 Other

---

## 🤝 Contributing

Pull requests are welcome! If you'd like to add features (CSV export, savings goals, dark/light toggle), feel free to fork and open a PR.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

> Built with ❤️ and good vibes using [Claude AI](https://claude.ai) — proof that you don't need to write code to build something useful.

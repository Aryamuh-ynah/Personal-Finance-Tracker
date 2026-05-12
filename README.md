# 💸 Personal Finance Tracker (BDT)

A clean, mobile-friendly personal finance tracker built with React. Track your income, expenses, monthly budget, and carried-forward balance — all in one place, with your data saved in your browser across sessions.

> 🎙️ **Vibe Coded** — This app started through a conversational AI session using [Claude](https://claude.ai) by Anthropic and was refined into a React project.

---

## ✨ Features

- 💰 **Income Tracking** — Log earnings by source (Salary, Freelance, Business, Gift, Investment, Loan Received, etc.)
- 💸 **Expense Tracking** — Categorize spending (Food, Transport, Bills, Shopping, Health, Education, Groceries, Lending, Donations, and more)
- 📊 **Dashboard** — Net balance, budget progress bar, pie chart by category, 6-month income vs. spending bar chart
- 🔄 **Carried Forward** — See last month's leftover balance at the top of your income breakdown
- 🔔 **Budget Alerts** — Warning at 80% usage, red alert when over budget
- 📋 **History** — Filter expenses by month and category
- ✏️ **Edit & Delete** — Full CRUD on both income and expense entries
- 💾 **Persistent Storage** — Data is saved across sessions with browser `localStorage`
- 🇧🇩 **BDT (৳ Taka)** default currency

---

## 🛠️ Tech Stack

| Tool          | Purpose                              |
| ------------- | ------------------------------------ |
| React (Hooks) | UI & state management                |
| Recharts      | Pie chart & bar chart                |
| localStorage  | Browser-based persistent data storage |

---

## 🚀 Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/Aryamuh-ynah/Personal-Finance-Tracker.git
cd Personal-Finance-Tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the app

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
finance-tracker/
├── public/
├── src/
│   ├── components/       # Dashboard, forms, history, nav, toast
│   ├── constants/        # Categories, income sources, storage key
│   ├── styles/           # Shared inline style object
│   ├── utils/            # Formatting, dates, localStorage helpers
│   ├── App.js            # App state and page wiring
│   └── index.js
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

> Built with ❤️ and good vibes using [Claude AI](https://claude.ai) and React.

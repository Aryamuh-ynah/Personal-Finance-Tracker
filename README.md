# 💸 Personal Finance Tracker (BDT)

A clean, mobile-friendly personal finance tracker built with React. Track your income, expenses, monthly budget, transaction history and carried-forward balance — all in one place, with your data saved in your browser across sessions.

> 🎙️ **Vibe Coded** — This app started through a conversational AI session using [Claude](https://claude.ai) by Anthropic and was refined into a React project.

---

## ✨ Features

- 📊 **Dashboard Overview**
  - Monthly income
  - Monthly expenses
  - Net balance
  - Budget usage progress
  - Category-wise spending chart
  - 6-month income vs expense overview

- 💰 **Income Tracking**
  - Add income by source
  - Edit income records
  - Delete income with confirmation popup
  - Supports Salary, Freelance, Business, Gift, Investment, Loan Received, and Other

- 💸 **Expense Tracking**
  - Add expenses by category
  - Edit expense records
  - Delete expense with custom confirmation modal
  - Supports Food, Transport, Bills, Shopping, Health, Education, Groceries, Donations, Lending, and more

- 📋 **History Page**
  - View all income and expense records
  - Filter by month
  - Filter expenses by category
  - Filter income by source

- ⚙️ **Settings Page**
  - Edit monthly budget
  - Choose from 5 modern themes
  - Theme selection is saved after reload

- 🎨 Theme System

The app includes 5 modern color themes:

- Midnight Indigo
- Emerald Mint
- Ocean Cyan
- Sunset Amber
- Graphite Lime

Each theme works with both dark and light mode.

- 📄 PDF Statement Download

Users can download a monthly finance statement PDF including:

- Monthly budget
- Total income
- Total expenses
- Net balance
- Budget left
- Income details
- Expense details

The PDF is generated in A4 format.

- 💾 **Persistent Storage**
  - Uses browser `localStorage`
  - Data remains saved after page refresh
  - Active tab and selected theme stay saved

- 🇧🇩 **BDT Currency**
  - Default currency format uses Bangladeshi Taka `৳`

---

## 🛠️ Tech Stack

| Tool            | Purpose                               |
| --------------- | ------------------------------------- |
| React           | Frontend UI development               |
| React Hooks     | State management and component logic  |
| Tailwind CSS    | Utility-first styling                 |
| CSS Variables   | Theme and dark/light mode support     |
| Recharts        | Pie chart and bar chart visualization |
| jsPDF           | PDF statement generation              |
| jspdf-autotable | PDF table formatting                  |
| localStorage    | Browser-based persistent data storage |
| Netlify         | Live deployment                       |

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
│   ├── App.css
│   ├── index.css
│   ├── App.js            # App state and page wiring
│   └── index.js
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 📸 Screens

| Dashboard                   | Add Income                 | History                    |
| --------------------------- | -------------------------- | -------------------------- |
| Net balance, charts, budget | Source, amount, date, note | Filter by month & category |

---

## 🧮 Main Calculations

```txt
Total Income = Sum of current month income
Total Expense = Sum of current month expenses
Net Balance = Total Income - Total Expense
Budget Left = Monthly Budget - Total Expense
Budget Usage = Total Expense / Monthly Budget * 100
```

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

> Built with ❤️ and good vibes using [Claude AI](https://claude.ai), [ChatGPT](https://chatgpt.com) and React.

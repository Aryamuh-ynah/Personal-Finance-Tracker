import { useState } from "react";
import { CATEGORIES, INCOME_SOURCES } from "../constants/finance";
import { catMeta, fmt, monthKey, today } from "../utils/finance";

const buttonStyle = (bg, color) => ({
  background: bg,
  border: "none",
  borderRadius: 6,
  color,
  padding: "4px 8px",
  cursor: "pointer",
  fontSize: 13,
});

export default function HistoryPage({
  filteredExp,
  filteredInc,
  filterMonth,
  setFilterMonth,
  allMonths,
  startEditExp,
  deleteExpense,
  startEditInc,
  deleteIncome,
  styles,
}) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [expenseCategory, setExpenseCategory] = useState("All");
  const [incomeSource, setIncomeSource] = useState("All");

  const getExpenseMeta = (category) => catMeta(category, CATEGORIES);
  const getIncomeMeta = (source) => catMeta(source, INCOME_SOURCES);

  const visibleExpenses = filteredExp.filter(
    (expense) =>
      expenseCategory === "All" || expense.category === expenseCategory
  );

  const visibleIncomes = filteredInc.filter(
    (income) => incomeSource === "All" || income.source === incomeSource
  );

  const allRecords = [
    ...visibleIncomes.map((income) => ({
      ...income,
      recordType: "income",
    })),
    ...visibleExpenses.map((expense) => ({
      ...expense,
      recordType: "expense",
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <select
          style={{ ...styles.select, flex: 1 }}
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          {(allMonths.length ? allMonths : [monthKey(today())]).map(
            (month) => (
              <option key={month} value={month}>
                {month}
              </option>
            )
          )}
        </select>

        <select
          style={{ ...styles.select, flex: 1 }}
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setExpenseCategory("All");
            setIncomeSource("All");
          }}
        >
          <option value="All">All</option>
          <option value="Expenses">Expenses</option>
          <option value="Income">Income</option>
        </select>

        {typeFilter === "Expenses" && (
          <select
            style={{ ...styles.select, flex: 1 }}
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
          >
            <option value="All">All</option>
            {CATEGORIES.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        )}

        {typeFilter === "Income" && (
          <select
            style={{ ...styles.select, flex: 1 }}
            value={incomeSource}
            onChange={(e) => setIncomeSource(e.target.value)}
          >
            <option value="All">All</option>
            {INCOME_SOURCES.map((source) => (
              <option key={source.name} value={source.name}>
                {source.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {typeFilter === "All" && (
        <>
          <div
            style={{
              padding: "8px 0",
              color: "var(--text-muted)",
              fontSize: 13,
            }}
          >
            {visibleExpenses.length} expense transactions ·{" "}
            {fmt(
              visibleExpenses.reduce(
                (sum, expense) => sum + Number(expense.amount || 0),
                0
              )
            )}{" "}
            spent | {visibleIncomes.length} income transactions ·{" "}
            {fmt(
              visibleIncomes.reduce(
                (sum, income) => sum + Number(income.amount || 0),
                0
              )
            )}{" "}
            received
          </div>

          {allRecords.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                padding: 40,
              }}
            >
              No records found.
            </div>
          )}

          {allRecords.map((record) => {
            const isIncome = record.recordType === "income";
            const meta = isIncome
              ? getIncomeMeta(record.source)
              : getExpenseMeta(record.category);

            return (
              <div key={`${record.recordType}-${record.id}`} style={styles.item}>
                <div style={{ fontSize: 26 }}>{meta.icon}</div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={styles.badge(meta.color)}>
                      {isIncome ? record.source : record.category}
                    </span>

                    <span
                      style={{
                        fontWeight: 700,
                        color: isIncome ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {isIncome ? "+" : "-"}
                      {fmt(Number(record.amount || 0))}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginTop: 4,
                    }}
                  >
                    {record.date}
                    {record.note ? ` · ${record.note}` : ""}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      isIncome ? startEditInc(record) : startEditExp(record)
                    }
                    style={buttonStyle("#334155", "#94a3b8")}
                  >
                    ✏️
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      isIncome
                        ? deleteIncome(record.id)
                        : deleteExpense(record.id)
                    }
                    style={buttonStyle("#7f1d1d", "#fca5a5")}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}

      {typeFilter === "Expenses" && (
        <>
          <div
            style={{
              padding: "8px 0",
              color: "var(--text-muted)",
              fontSize: 13,
            }}
          >
            {visibleExpenses.length} expense transactions ·{" "}
            {fmt(
              visibleExpenses.reduce(
                (sum, expense) => sum + Number(expense.amount || 0),
                0
              )
            )}{" "}
            spent
          </div>

          {visibleExpenses.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                padding: 40,
              }}
            >
              No expenses found.
            </div>
          )}

          {visibleExpenses.map((expense) => {
            const meta = getExpenseMeta(expense.category);

            return (
              <div key={expense.id} style={styles.item}>
                <div style={{ fontSize: 26 }}>{meta.icon}</div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={styles.badge(meta.color)}>
                      {expense.category}
                    </span>

                    <span style={{ fontWeight: 700, color: "#ef4444" }}>
                      -{fmt(Number(expense.amount || 0))}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginTop: 4,
                    }}
                  >
                    {expense.date}
                    {expense.note ? ` · ${expense.note}` : ""}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => startEditExp(expense)}
                    style={buttonStyle("#334155", "#94a3b8")}
                  >
                    ✏️
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteExpense(expense.id)}
                    style={buttonStyle("#7f1d1d", "#fca5a5")}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}

      {typeFilter === "Income" && (
        <>
          <div
            style={{
              padding: "8px 0",
              color: "var(--text-muted)",
              fontSize: 13,
            }}
          >
            {visibleIncomes.length} income transactions ·{" "}
            {fmt(
              visibleIncomes.reduce(
                (sum, income) => sum + Number(income.amount || 0),
                0
              )
            )}{" "}
            received
          </div>

          {visibleIncomes.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                padding: 40,
              }}
            >
              No incomes found.
            </div>
          )}

          {visibleIncomes.map((income) => {
            const meta = getIncomeMeta(income.source);

            return (
              <div key={income.id} style={styles.item}>
                <div style={{ fontSize: 26 }}>{meta.icon}</div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={styles.badge(meta.color)}>
                      {income.source}
                    </span>

                    <span style={{ fontWeight: 700, color: "#22c55e" }}>
                      +{fmt(Number(income.amount || 0))}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginTop: 4,
                    }}
                  >
                    {income.date}
                    {income.note ? ` · ${income.note}` : ""}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => startEditInc(income)}
                    style={buttonStyle("#334155", "#94a3b8")}
                  >
                    ✏️
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteIncome(income.id)}
                    style={buttonStyle("#7f1d1d", "#fca5a5")}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
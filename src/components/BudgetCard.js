import { fmt } from "../utils/finance";

export default function BudgetCard({ budget, monthExpense, styles }) {
  const percent = Math.min((monthExpense / budget) * 100, 100);

  return (
    <div style={styles.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div>
          <div style={styles.label}>Monthly Budget</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{fmt(budget)}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={styles.label}>Spent</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#ef4444" }}>
            {fmt(monthExpense)}
          </div>
        </div>
      </div>

      <div
        style={{
          height: 10,
          background: "var(--input-bg)",
          borderRadius: 999,
          overflow: "hidden",
          border: "1px solid var(--border-color)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            background:
              percent >= 90
                ? "#ef4444"
                : percent >= 70
                ? "#f59e0b"
                : "var(--primary)",
            borderRadius: 999,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        {percent.toFixed(0)}% of budget used
      </div>
    </div>
  );
}
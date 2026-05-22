import { fmt } from "../utils/finance";

export default function BudgetCard({ budget, spent = 0, styles }) {
  const safeBudget = Number(budget) || 0;
  const safeSpent = Number(spent) || 0;

  const percent =
    safeBudget > 0 ? Math.min((safeSpent / safeBudget) * 100, 100) : 0;

  const left = Math.max(safeBudget - safeSpent, 0);

  return (
    <div style={styles.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <div>
          <div style={styles.label}>Monthly Budget</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>
            {fmt(safeBudget)}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={styles.label}>Spent</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#ef4444" }}>
            {fmt(safeSpent)}
          </div>
        </div>
      </div>

      <div
        style={{
          height: 9,
          background: "var(--input-bg)",
          borderRadius: 999,
          overflow: "hidden",
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
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{percent.toFixed(0)}% of budget used</span>
        <span>Left {fmt(left)}</span>
      </div>
    </div>
  );
}
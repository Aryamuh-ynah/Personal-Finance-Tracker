import { useState } from "react";

const emptyDpsForm = () => ({
  name: "",
  monthlyAmount: "",
  startMonth: "",
  durationMonths: "24",
});

const formatTK = (value) => {
  const amount = Number(value || 0);

  return `৳${amount.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
};

export default function DpsPage({
  dpsPlans,
  addDpsPlan,
  markDpsPaid,
  deleteDpsPlan,
  styles,
}) {
  const [form, setForm] = useState(emptyDpsForm());

  const submitDps = () => {
    const monthlyAmount = Number(form.monthlyAmount || 0);
    const durationMonths = Number(form.durationMonths || 0);

    if (!form.name.trim()) {
      alert("Enter DPS name");
      return;
    }

    if (!monthlyAmount || monthlyAmount <= 0) {
      alert("Enter valid monthly amount");
      return;
    }

    if (!form.startMonth) {
      alert("Enter start month");
      return;
    }

    if (!durationMonths || durationMonths <= 0) {
      alert("Enter valid duration");
      return;
    }

    addDpsPlan({
      name: form.name.trim(),
      monthlyAmount,
      startMonth: form.startMonth,
      durationMonths,
    });

    setForm(emptyDpsForm());
  };

  return (
    <main style={{ padding: 16 }}>
      <div style={styles.card}>
        <h2 style={{ margin: "0 0 14px", color: "var(--text-main)" }}>
          🏦 Add DPS Plan
        </h2>

        <div style={{ marginBottom: 12 }}>
          <div style={styles.label}>DPS Name</div>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. Bank DPS"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={styles.label}>Monthly Amount</div>
          <input
            style={styles.input}
            type="number"
            placeholder="e.g. 5000"
            value={form.monthlyAmount}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                monthlyAmount: e.target.value,
              }))
            }
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={styles.label}>Start Month</div>
          <input
            style={styles.input}
            type="month"
            value={form.startMonth}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, startMonth: e.target.value }))
            }
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={styles.label}>Duration Months</div>
          <input
            style={styles.input}
            type="number"
            value={form.durationMonths}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                durationMonths: e.target.value,
              }))
            }
          />
        </div>

        <button
          type="button"
          style={styles.btn("var(--primary)")}
          onClick={submitDps}
        >
          Add DPS
        </button>
      </div>

      <div style={styles.card}>
        <h2 style={{ margin: "0 0 14px", color: "var(--text-main)" }}>
          📋 DPS Plans
        </h2>

        {dpsPlans.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: 30,
            }}
          >
            No DPS plan added yet.
          </div>
        )}

        {dpsPlans.map((plan) => {
          const paidMonths = Number(plan.paidMonths || 0);
          const durationMonths = Number(plan.durationMonths || 0);
          const monthlyAmount = Number(plan.monthlyAmount || 0);

          const totalTarget = monthlyAmount * durationMonths;
          const savedAmount = monthlyAmount * paidMonths;
          const remainingAmount = Math.max(totalTarget - savedAmount, 0);
          const progress =
            durationMonths > 0
              ? Math.min((paidMonths / durationMonths) * 100, 100)
              : 0;

          return (
            <div
              key={plan.id}
              style={{
                background: "var(--input-bg)",
                border: "1px solid var(--border-color)",
                borderRadius: 14,
                padding: 14,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      color: "var(--text-main)",
                      fontSize: 16,
                    }}
                  >
                    {plan.name}
                  </div>

                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    Start: {plan.startMonth} · {paidMonths}/{durationMonths}{" "}
                    months paid
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteDpsPlan(plan.id)}
                  style={{
                    background: "#7f1d1d",
                    color: "#fca5a5",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 10px",
                    cursor: "pointer",
                    height: 32,
                  }}
                >
                  🗑️
                </button>
              </div>

              <div
                style={{
                  height: 9,
                  background: "var(--card-bg)",
                  borderRadius: 999,
                  overflow: "hidden",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "var(--primary)",
                    borderRadius: 999,
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 10,
                  marginBottom: 12,
                  fontSize: 13,
                }}
              >
                <div>
                  <div style={styles.label}>Monthly</div>
                  <strong>{formatTK(monthlyAmount)}</strong>
                </div>

                <div>
                  <div style={styles.label}>Target</div>
                  <strong>{formatTK(totalTarget)}</strong>
                </div>

                <div>
                  <div style={styles.label}>Saved</div>
                  <strong style={{ color: "#22c55e" }}>
                    {formatTK(savedAmount)}
                  </strong>
                </div>

                <div>
                  <div style={styles.label}>Remaining</div>
                  <strong style={{ color: "#f97316" }}>
                    {formatTK(remainingAmount)}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                disabled={paidMonths >= durationMonths}
                onClick={() => markDpsPaid(plan.id)}
                style={{
                  ...styles.btn(
                    paidMonths >= durationMonths ? "#64748b" : "var(--primary)"
                  ),
                  cursor: paidMonths >= durationMonths ? "not-allowed" : "pointer",
                }}
              >
                {paidMonths >= durationMonths
                  ? "Completed"
                  : "Mark This Month Paid"}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
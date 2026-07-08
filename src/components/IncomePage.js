import { INCOME_SOURCES } from "../constants/finance";

export default function IncomePage({
  editIncId,
  incForm,
  setIncForm,
  addIncome,
  cancelEditIncome,
  styles,
}) {
  return (
    <div>

      <div style={styles.card}>
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>
          {editIncId ? "✏️ Edit Income" : "💰 Add Income"}
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={styles.label}>Amount (৳)</div>
          <input
            style={styles.input}
            type="number"
            placeholder="0.00"
            value={incForm.amount}
            onChange={(e) =>
              setIncForm((form) => ({
                ...form,
                amount: e.target.value,
              }))
            }
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={styles.label}>Source</div>
          <select
            style={styles.select}
            value={incForm.source}
            onChange={(e) =>
              setIncForm((form) => ({
                ...form,
                source: e.target.value,
              }))
            }
          >
            {INCOME_SOURCES.map((source) => (
              <option key={source.name} value={source.name}>
                {source.icon} {source.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={styles.label}>Date</div>
          <input
            style={styles.input}
            type="text"
            placeholder="YYYY-MM-DD"
            value={incForm.date}
            onChange={(e) =>
              setIncForm((form) => ({
                ...form,
                date: e.target.value,
              }))
            }
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={styles.label}>Note (optional)</div>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. March salary from company"
            value={incForm.note}
            onChange={(e) =>
              setIncForm((form) => ({
                ...form,
                note: e.target.value,
              }))
            }
          />
        </div>

        <button style={styles.btn("var(--primary)")} onClick={addIncome}>
          {editIncId ? "Update Income" : "Add Income"}
        </button>

        {editIncId && (
          <button
            style={{ ...styles.btn("#334155"), marginTop: 10 }}
            onClick={cancelEditIncome}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
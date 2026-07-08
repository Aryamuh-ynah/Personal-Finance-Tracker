export default function DpsPage({ styles }) {
  return (
    <main style={{ padding: 16 }}>
      <div style={styles.card}>
        <h2 style={{ margin: "0 0 8px", color: "var(--text-main)" }}>
          🏦 DPS Tracker
        </h2>

        <p
          style={{
            margin: 0,
            color: "var(--text-muted)",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          DPS tracking feature is enabled. You can later add monthly DPS amount,
          duration, paid months, and progress tracking here.
        </p>
      </div>
    </main>
  );
}
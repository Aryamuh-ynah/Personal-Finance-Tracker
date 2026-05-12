export default function Header({ saving, styles }) {
  return (
    <div style={styles.header}>
      <span style={{ fontSize: 18, fontWeight: 700 }}>💸 Finance Tracker</span>
      <span style={{ fontSize: 12, color: "#64748b" }}>{saving ? "Saving..." : "✓ Synced"}</span>
    </div>
  );
}

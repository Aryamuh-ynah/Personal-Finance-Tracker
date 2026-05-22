export const DEFAULT_THEME_ID = "midnight";

export const THEMES = [
  {
    id: "midnight",
    name: "Midnight Indigo",
    description: "Dark navy with modern indigo accent",
    colors: ["#0f172a", "#1e293b", "#6366f1"],
  },
  {
    id: "emerald",
    name: "Emerald Mint",
    description: "Fresh green finance-focused theme",
    colors: ["#052e2b", "#064e3b", "#10b981"],
  },
  {
    id: "ocean",
    name: "Ocean Cyan",
    description: "Deep blue with clean cyan highlights",
    colors: ["#082f49", "#0f3a5f", "#06b6d4"],
  },
  {
    id: "sunset",
    name: "Sunset Amber",
    description: "Warm dark theme with amber glow",
    colors: ["#1c1917", "#292524", "#f59e0b"],
  },
  {
    id: "plum",
    name: "Plum Rose",
    description: "Premium purple and rose combination",
    colors: ["#2e1065", "#3b0764", "#ec4899"],
  },
];

export const createStyles = () => ({
  app: {
    minHeight: "100vh",
    background: "var(--app-bg)",
    color: "var(--text-main)",
    fontFamily: "'Segoe UI', sans-serif",
    paddingBottom: 80,
    transition: "background 0.2s ease, color 0.2s ease",
  },

  header: {
    background: "var(--card-bg)",
    padding: "14px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--border-color)",
  },

  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "var(--card-bg)",
    borderTop: "1px solid var(--border-color)",
    display: "flex",
    justifyContent: "space-around",
    padding: "6px 0",
    zIndex: 50,
  },

  navBtn: (active) => ({
    background: "none",
    border: "none",
    color: active ? "var(--primary)" : "var(--text-muted)",
    fontSize: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    cursor: "pointer",
    padding: "4px 8px",
    fontWeight: active ? 700 : 400,
  }),

  card: {
    background: "var(--card-bg)",
    borderRadius: 12,
    padding: 16,
    margin: "12px 16px",
    border: "1px solid var(--border-color)",
  },

  label: {
    fontSize: 12,
    color: "var(--text-muted)",
    marginBottom: 4,
  },

  input: {
    width: "100%",
    background: "var(--input-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    color: "var(--text-main)",
    padding: "10px 12px",
    fontSize: 15,
    boxSizing: "border-box",
    outline: "none",
  },

  select: {
    width: "100%",
    background: "var(--input-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    color: "var(--text-main)",
    padding: "10px 12px",
    fontSize: 15,
    boxSizing: "border-box",
  },

  btn: (color = "var(--primary)") => ({
    background: color,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "12px 20px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
  }),

  row: {
    display: "flex",
    gap: 10,
    margin: "0 16px",
  },

  halfCard: {
    background: "var(--card-bg)",
    borderRadius: 12,
    padding: 14,
    flex: 1,
    border: "1px solid var(--border-color)",
  },

  badge: (color) => ({
    background: color + "22",
    color,
    borderRadius: 20,
    padding: "2px 10px",
    fontSize: 11,
    fontWeight: 600,
  }),

  item: {
    background: "var(--card-bg)",
    borderRadius: 10,
    padding: "12px 14px",
    margin: "8px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "1px solid var(--border-color)",
  },

  tabBtn: (active) => ({
    flex: 1,
    padding: "8px",
    background: active ? "var(--primary)" : "var(--input-bg)",
    color: active ? "#fff" : "var(--text-muted)",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 13,
  }),
});
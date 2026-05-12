export const styles = {
  app: { minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif", paddingBottom: 80 },
  
  header: { background: "#1e293b", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155" },
  
  nav: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#1e293b", borderTop: "1px solid #334155", 
  display: "flex", justifyContent: "space-around", padding: "6px 0", zIndex: 50 },
  
  navBtn: (active) => ({ background: "none", border: "none", color: active ? "#6366f1" : "#64748b", fontSize: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer", padding: "4px 8px", fontWeight: active ? 700 : 400 }),
  
  card: { background: "#1e293b", borderRadius: 12, padding: 16, margin: "12px 16px" },
  
  label: { fontSize: 12, color: "#94a3b8", marginBottom: 4 },
  
  input: { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9", 
  padding: "10px 12px", fontSize: 15, boxSizing: "border-box", outline: "none" },
  
  select: { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9", padding: "10px 12px", fontSize: 15, boxSizing: "border-box" },
  
  btn: (color = "#6366f1") => ({ background: color, color: "#fff", border: "none", borderRadius: 8, padding: "12px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }),
  
  row: { display: "flex", gap: 10, margin: "0 16px" },
  
  halfCard: { background: "#1e293b", borderRadius: 12, padding: 14, flex: 1 },
  
  badge: (color) => ({ background: color + "22", color, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }),
  
  item: { background: "#1e293b", borderRadius: 10, padding: "12px 14px", margin: "8px 16px", display: "flex", alignItems: "center", gap: 12 },
  
  tabBtn: (active) => ({ flex: 1, padding: "8px", background: active ? "#6366f1" : "#0f172a", color: active ? "#fff" : "#64748b", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }),
};

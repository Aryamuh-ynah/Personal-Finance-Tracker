export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: toast.type === "error" ? "#ef4444" : "#22c55e", color: "#fff", padding: "10px 24px", borderRadius: 20, fontWeight: 600, zIndex: 100, fontSize: 14 }}>
      {toast.msg}
    </div>
  );
}

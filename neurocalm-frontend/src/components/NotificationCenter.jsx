import React, { useState, useRef, useEffect } from "react";

const TYPE_STYLE = {
  critical: { color: "#F43F5E", bg: "rgba(244,63,94,0.08)",   border: "rgba(244,63,94,0.2)"  },
  warning:  { color: "#F59E0B", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)" },
  success:  { color: "#10B981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.2)" },
  info:     { color: "#00D4FF", bg: "rgba(0,212,255,0.08)",   border: "rgba(0,212,255,0.2)"  },
};

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)   return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export default function NotificationCenter({ alerts, unreadCount, dismiss, clearAll }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "relative",
          background: open ? "rgba(0,212,255,0.08)" : "none",
          border: open ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent",
          borderRadius: 8, cursor: "pointer",
          color: open ? "var(--accent)" : "var(--text-muted)",
          padding: "6px 8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: 2, right: 2,
            minWidth: 14, height: 14, borderRadius: 7,
            background: "var(--warning)", color: "#fff",
            fontSize: 9, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 3px", fontFamily: "Sora, sans-serif",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          width: 340,
          background: "#111827",
          border: "1px solid var(--border)",
          borderRadius: 14,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          zIndex: 200, overflow: "hidden",
          animation: "fadeUp 0.2s ease forwards",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
              Alerts {alerts.length > 0 && <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}>({alerts.length})</span>}
            </span>
            {alerts.length > 0 && (
              <button onClick={clearAll} className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: "4px 8px" }}>Clear all</button>
            )}
          </div>
          <div style={{ maxHeight: 340, overflowY: "auto", padding: 6 }}>
            {alerts.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔔</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>No alerts yet</div>
                <div style={{ fontSize: 11.5, color: "var(--text-subtle)", marginTop: 4 }}>Alerts appear when your energy changes significantly</div>
              </div>
            ) : alerts.map(a => {
              const s = TYPE_STYLE[a.type] || TYPE_STYLE.info;
              return (
                <div key={a.id} style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 4, background: s.bg, border: `1px solid ${s.border}` }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 12.5, color: s.color, marginBottom: 2, fontFamily: "Sora, sans-serif" }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{a.message}</div>
                    <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 4 }}>{timeAgo(a.ts)}</div>
                  </div>
                  <button onClick={() => dismiss(a.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 16, alignSelf: "flex-start", padding: "0 2px" }}>×</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

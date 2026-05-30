import React, { useState } from "react";

export default function PermissionBanner({ signals, onRequestNotif }) {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("nc_perm_dismissed") === "1"
  );

  if (dismissed || signals.notifPermission !== "default") return null;

  const dismiss = () => { localStorage.setItem("nc_perm_dismissed", "1"); setDismissed(true); };

  return (
    <div style={{
      margin: "0 32px",
      padding: "12px 18px",
      borderRadius: 12,
      background: "linear-gradient(135deg, rgba(0,212,255,0.07), rgba(139,92,246,0.07))",
      border: "1px solid rgba(0,212,255,0.18)",
      display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
    }}>
      <span style={{ fontSize: 20 }}>🔔</span>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: 13.5, color: "var(--text)", marginBottom: 2 }}>
          Enable browser notifications
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
          NeuroCalm will alert you when energy drops critically or burnout risk spikes — even when the tab is in the background.
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-primary btn-sm" onClick={async () => {
          const result = await onRequestNotif();
          if (result !== "default") dismiss();
        }}>
          Allow Alerts
        </button>
        <button className="btn btn-ghost btn-sm" onClick={dismiss}>Not now</button>
      </div>
    </div>
  );
}

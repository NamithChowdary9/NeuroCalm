import { useState, useCallback, useRef } from "react";

let _id = 0;

export default function useNotifications() {
  const [alerts, setAlerts]   = useState([]);
  const lastScoreRef          = useRef(null);
  const lastRiskRef           = useRef(null);

  const push = useCallback((title, message, type = "info") => {
    const id = ++_id;
    setAlerts(a => [{ id, title, message, type, ts: Date.now() }, ...a].slice(0, 20));
    if (type !== "critical") setTimeout(() => setAlerts(a => a.filter(x => x.id !== id)), 6000);
    return id;
  }, []);

  const dismiss  = useCallback((id) => setAlerts(a => a.filter(x => x.id !== id)), []);
  const clearAll = useCallback(() => setAlerts([]), []);

  const checkThresholds = useCallback((score, risk, sendOsNotif) => {
    const prev     = lastScoreRef.current;
    const prevRisk = lastRiskRef.current;
    if (prev !== null) {
      if (score < 30 && prev >= 30) {
        push("🚨 Critical Energy Level", `Neural energy dropped to ${score}. Immediate recovery needed.`, "critical");
        sendOsNotif?.("NeuroCalm Alert", `Energy critical: ${score}/100. Take a recovery break now.`);
      } else if (score >= 50 && prev < 50) {
        push("✅ Energy Recovering", `Neural energy restored to ${score}. Good progress.`, "success");
      }
      if (risk >= 70 && (prevRisk === null || prevRisk < 70)) {
        push("⚠️ High Burnout Risk", `Risk at ${risk}%. Consider blocking recovery time today.`, "warning");
        sendOsNotif?.("NeuroCalm Warning", `Burnout risk is high: ${risk}%. Schedule a break.`);
      }
      if (risk < 40 && prevRisk !== null && prevRisk >= 40) {
        push("🌙 Risk Level Safe", `Burnout risk reduced to ${risk}%. Keep maintaining balance.`, "success");
      }
    }
    lastScoreRef.current = score;
    lastRiskRef.current  = risk;
  }, [push]);

  const unreadCount = alerts.length;

  return { alerts, push, dismiss, clearAll, checkThresholds, unreadCount };
}

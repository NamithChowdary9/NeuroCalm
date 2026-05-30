import { useState, useEffect, useRef, useCallback } from "react";

const STORAGE_KEY = "nc_device_signals";

function loadStored() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
function saveStored(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

export default function useDeviceSignals() {
  const stored = loadStored();
  const [signals, setSignals] = useState({
    tabSwitches:        stored?.tabSwitches        || 0,
    focusLostCount:     stored?.focusLostCount     || 0,
    sessionMinutes:     stored?.sessionMinutes     || 0,
    notificationsShown: stored?.notificationsShown || 0,
    networkType:        "unknown",
    networkSlow:        false,
    batteryLevel:       100,
    batteryCharging:    true,
    pageVisibility:     "visible",
    notifPermission:    typeof Notification !== "undefined" ? Notification.permission : "default",
    contextSwitchRate:  0,
    sessionStart:       stored?.sessionStart || Date.now(),
  });

  const switchesThisMin = useRef(0);

  // Page Visibility API
  useEffect(() => {
    const handler = () => {
      const visible = document.visibilityState === "visible";
      if (visible) switchesThisMin.current++;
      setSignals(s => ({
        ...s,
        pageVisibility: document.visibilityState,
        tabSwitches: visible ? s.tabSwitches + 1 : s.tabSwitches,
      }));
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  // Window focus/blur
  useEffect(() => {
    const onBlur  = () => setSignals(s => ({ ...s, focusLostCount: s.focusLostCount + 1 }));
    const onFocus = () => setSignals(s => ({ ...s, lastActiveTime: Date.now() }));
    window.addEventListener("blur",  onBlur);
    window.addEventListener("focus", onFocus);
    return () => { window.removeEventListener("blur", onBlur); window.removeEventListener("focus", onFocus); };
  }, []);

  // Session timer every 60s
  useEffect(() => {
    const t = setInterval(() => setSignals(s => ({ ...s, sessionMinutes: s.sessionMinutes + 1 })), 60000);
    return () => clearInterval(t);
  }, []);

  // Switch rate reset every 60s
  useEffect(() => {
    const t = setInterval(() => {
      setSignals(s => ({ ...s, contextSwitchRate: switchesThisMin.current }));
      switchesThisMin.current = 0;
    }, 60000);
    return () => clearInterval(t);
  }, []);

  // Network Info API
  useEffect(() => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return;
    const update = () => {
      const slow = ["slow-2g","2g","3g"].includes(conn.effectiveType);
      setSignals(s => ({ ...s, networkType: conn.effectiveType || "unknown", networkSlow: slow }));
    };
    update();
    conn.addEventListener("change", update);
    return () => conn.removeEventListener("change", update);
  }, []);

  // Battery API
  useEffect(() => {
    if (!navigator.getBattery) return;
    navigator.getBattery().then(battery => {
      const update = () => setSignals(s => ({
        ...s,
        batteryLevel:    Math.round(battery.level * 100),
        batteryCharging: battery.charging,
      }));
      update();
      battery.addEventListener("levelchange",    update);
      battery.addEventListener("chargingchange", update);
    }).catch(() => {});
  }, []);

  // Persist
  useEffect(() => {
    saveStored({
      tabSwitches:        signals.tabSwitches,
      focusLostCount:     signals.focusLostCount,
      sessionMinutes:     signals.sessionMinutes,
      notificationsShown: signals.notificationsShown,
      sessionStart:       signals.sessionStart,
    });
  }, [signals.tabSwitches, signals.focusLostCount, signals.sessionMinutes]);

  // Derived device stress score
  const deviceStressScore = (() => {
    let score = 0;
    if (signals.tabSwitches > 20)          score += 20;
    else if (signals.tabSwitches > 10)     score += 10;
    if (signals.focusLostCount > 15)       score += 15;
    else if (signals.focusLostCount > 8)   score += 8;
    if (signals.sessionMinutes > 240)      score += 20;
    else if (signals.sessionMinutes > 120) score += 10;
    if (signals.networkSlow)               score += 10;
    if (signals.batteryLevel < 20 && !signals.batteryCharging) score += 10;
    if (signals.contextSwitchRate > 5)     score += 15;
    return Math.min(100, score);
  })();

  const requestNotifPermission = useCallback(async () => {
    if (!("Notification" in window)) return "unsupported";
    const perm = await Notification.requestPermission();
    setSignals(s => ({ ...s, notifPermission: perm }));
    return perm;
  }, []);

  const sendNotification = useCallback((title, body) => {
    if (Notification.permission !== "granted") return;
    new Notification(title, { body, tag: "neurocalm" });
    setSignals(s => ({ ...s, notificationsShown: s.notificationsShown + 1 }));
  }, []);

  return { signals, deviceStressScore, requestNotifPermission, sendNotification };
}

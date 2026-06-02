const DEFAULT_API_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://namithchowdary9-neurocalm-backend.hf.space";

export const API_BASE_URL = process.env.REACT_APP_API_URL || DEFAULT_API_URL;

export async function analyzeEnergy(metrics, user) {
  const payload = {
    user_id: user?.uid || user?.email || "default",
    sleep_hours: metrics.sleepHours,
    stress_level: metrics.stressLevel,
    meetings: metrics.meetings,
    notifications: metrics.notifications,
    workload: metrics.workload,
    mood: metrics.mood,
    social_interaction: metrics.socialInteraction,
    recovery_hours: metrics.recoveryHours,
  };

  const response = await fetch(`${API_BASE_URL}/api/energy/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Energy analysis failed with ${response.status}`);
  }

  return response.json();
}

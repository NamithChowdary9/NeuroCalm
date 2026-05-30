import math
from typing import List, Dict, Any

def compute_energy_score(m: dict) -> int:
  raw = (100
    - 5   * m.get("meetings",        0)
    - 4   * m.get("stress_level",    5)
    - 3   * (m.get("notifications",  0) / 10)
    + 2   * m.get("recovery_hours",  2)
    - 0.5 * m.get("calls_received",  0)
    - 1   * max(0, m.get("screen_time_hours", 0) - 8)
    + 0.5 * m.get("mood",            5)
    - 0.2 * (m.get("app_switches",   0) / 5)
    + 0.4 * m.get("sleep_hours",     7) * 0.3)
  return max(0, min(100, round(raw)))

def compute_burnout_risk(m: dict) -> int:
  num = (m.get("stress_level", 5) + m.get("meetings", 0)
    + m.get("notifications", 0) / 10
    + m.get("calls_received", 0) / 8
    + max(0, m.get("screen_time_hours", 0) - 6) * 0.5
    + m.get("workload", 5) * 0.4
    + m.get("tab_switches", 0) * 0.05)
  den = max(0.1, m.get("sleep_hours", 7) + m.get("recovery_hours", 2))
  return max(0, min(100, round((num / den) * 10)))

def get_energy_state(score: int) -> Dict[str, str]:
  if score >= 80: return {"label":"Healthy",     "color":"#10B981"}
  if score >= 50: return {"label":"Moderate",    "color":"#38BDF8"}
  if score >= 20: return {"label":"Overloaded",  "color":"#F59E0B"}
  return              {"label":"Burnout Risk", "color":"#F43F5E"}

def generate_recommendations(m: dict, score: int) -> List[Dict]:
  tips = []
  if score < 30:                         tips.append({"icon":"🚨","text":"Critical burnout risk. Block a recovery window immediately.","priority":"critical"})
  if m.get("meetings",0) > 5:           tips.append({"icon":"📅","text":"Meeting overload. Decline non-essential meetings for 24h.","priority":"high"})
  if m.get("notifications",0) > 50:    tips.append({"icon":"🔕","text":"Interaction pressure high. Enable deep focus mode.","priority":"high"})
  if m.get("calls_received",0) > 10:  tips.append({"icon":"📞","text":"High call volume. Switch to async communication.","priority":"medium"})
  if m.get("stress_level",5) > 7:      tips.append({"icon":"🧘","text":"High mental load. Avoid non-essential interactions.","priority":"medium"})
  if m.get("recovery_hours",2) < 2:    tips.append({"icon":"🌙","text":"Recovery window low. Schedule downtime tonight.","priority":"medium"})
  if m.get("screen_time_hours",0) > 8:tips.append({"icon":"👁️","text":"Screen time above limit. Take a 20-minute break.","priority":"medium"})
  if m.get("sleep_hours",7) < 6:       tips.append({"icon":"😴","text":"Sleep debt accumulating. Target 7-8 hours tonight.","priority":"high"})
  if m.get("mood",6) < 4:              tips.append({"icon":"💙","text":"Low mood detected. A short walk can help.","priority":"medium"})
  if score > 75:                         tips.append({"icon":"⚡","text":"Energy optimal. Perfect for deep focused work.","priority":"positive"})
  if not tips:                           tips.append({"icon":"✅","text":"Energy balance stable. Maintain current habits.","priority":"positive"})
  return tips[:4]

def compute_risk_factors(m: dict) -> List[Dict[str, Any]]:
  return [
    {"label":"Stress Level",          "value":m.get("stress_level",5)*10,               "weight":0.28,"color":"#F59E0B","icon":"⚡"},
    {"label":"Meeting Overload",      "value":min(100,m.get("meetings",0)*14),           "weight":0.22,"color":"#8B5CF6","icon":"📅"},
    {"label":"Interaction Pressure",  "value":min(100,m.get("notifications",0)),         "weight":0.18,"color":"#F43F5E","icon":"🔔"},
    {"label":"Call Volume",           "value":min(100,m.get("calls_received",0)*6),      "weight":0.12,"color":"#00D4FF","icon":"📞"},
    {"label":"Sleep Deficit",         "value":max(0,100-m.get("sleep_hours",7)*12),      "weight":0.12,"color":"#38BDF8","icon":"😴"},
    {"label":"Low Recovery",          "value":max(0,100-m.get("recovery_hours",2)*20),   "weight":0.08,"color":"#10B981","icon":"🌙"},
  ]

def generate_forecast(current_risk: int, days: int = 7) -> List[Dict[str, Any]]:
  import random
  random.seed(current_risk * 31)
  labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
  result = []
  for i in range(days):
    val = max(5, min(100, round(current_risk + math.sin(i*0.8)*9 + random.uniform(-7,7) + i*(1.3 if current_risk>60 else -0.9))))
    result.append({"day":labels[i%7],"risk":val,"trend":"↑" if val>current_risk else "↓"})
  return result

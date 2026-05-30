from fastapi import APIRouter, Query
from datetime import datetime, timezone, timedelta
import random
import math
from utils.database import get_history
from utils.ai_engine import compute_energy_score, compute_burnout_risk, get_energy_state

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
HOURS = list(range(9, 21))


def seeded_random(seed: int, min_val: int, max_val: int) -> int:
    random.seed(seed)
    return random.randint(min_val, max_val)


@router.get("/weekly-trend")
async def get_weekly_trend(user_id: str = "default"):
    """7-day energy score trend. Uses DB history if available, otherwise simulated."""
    history = await get_history(user_id, limit=7)

    if history:
        return {
            "labels": [h["timestamp"][:10] if isinstance(h["timestamp"], str) else h["timestamp"].strftime("%a") for h in history],
            "data": [h["energy_score"] for h in history],
            "source": "database",
        }

    # Simulated fallback
    base = 65
    data = []
    for i in range(7):
        noise = math.sin(i * 1.2) * 15 + random.uniform(-8, 8)
        data.append(max(10, min(100, round(base + noise))))

    return {"labels": DAYS, "data": data, "source": "simulated"}


@router.get("/interaction-pressure")
async def get_interaction_pressure():
    """Daily communication load bar chart data."""
    random.seed(42)
    data = [random.randint(20, 95) for _ in DAYS]
    colors = ["#F43F5E" if v > 70 else "#F59E0B" if v > 45 else "#00D4FF" for v in data]
    return {"labels": DAYS, "data": data, "colors": colors}


@router.get("/emotional-timeline")
async def get_emotional_timeline():
    """Hourly mood data for today."""
    random.seed(99)
    data = [random.randint(30, 95) for _ in HOURS]
    return {
        "labels": [f"{h}:00" for h in HOURS],
        "data": data,
    }


@router.get("/heatmap")
async def get_heatmap():
    """Weekly activity intensity heatmap."""
    hour_labels = [f"{h}:00" for h in HOURS]
    grid = []
    for di, day in enumerate(DAYS):
        row = []
        for hi, hour in enumerate(HOURS):
            seed = di * 100 + hi
            random.seed(seed)
            intensity = random.randint(0, 100)
            row.append({"hour": hour_labels[hi], "intensity": intensity})
        grid.append({"day": day, "hours": row})
    return {"grid": grid, "days": DAYS, "hours": hour_labels}


@router.get("/mental-load")
async def get_mental_load(
    meetings: int = 3,
    notifications: int = 30,
    stress: float = 5,
    workload: float = 5,
    social: float = 5,
):
    """Mental load donut chart breakdown."""
    return {
        "labels": ["Meetings", "Notifications", "Stress", "Workload", "Social"],
        "data": [
            min(100, meetings * 10),
            min(100, notifications),
            stress * 10,
            workload * 10,
            social * 10,
        ],
        "colors": ["#8B5CF6", "#F43F5E", "#F59E0B", "#00D4FF", "#10B981"],
    }


@router.get("/history")
async def get_user_history(user_id: str = "default", limit: int = Query(default=30, le=100)):
    history = await get_history(user_id, limit)
    return {"user_id": user_id, "count": len(history), "entries": history}

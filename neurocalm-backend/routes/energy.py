from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from models.schemas import MetricsInput, EnergyResponse
from utils.ai_engine import (
    compute_energy_score,
    compute_burnout_risk,
    get_energy_state,
    generate_recommendations,
)
from utils.database import save_metrics_entry

router = APIRouter(prefix="/api/energy", tags=["Energy"])


@router.post("/analyze", response_model=EnergyResponse)
async def analyze_energy(data: MetricsInput):
    """
    Compute energy score, burnout risk, state, and AI recommendations
    from submitted metrics. Persists result to MongoDB.
    """
    m = data.model_dump()
    score = compute_energy_score(m)
    risk = compute_burnout_risk(m)
    state = get_energy_state(score)
    recommendations = generate_recommendations(m, score)

    entry = {
        "user_id": data.user_id,
        "energy_score": score,
        "burnout_risk": risk,
        "energy_state": state["label"],
        "metrics": m,
        "timestamp": datetime.now(timezone.utc),
    }
    await save_metrics_entry(entry)

    return EnergyResponse(
        energy_score=score,
        burnout_risk=risk,
        energy_state=state["label"],
        state_color=state["color"],
        recommendations=recommendations,
        metrics=m,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/score")
async def get_score(
    meetings: int = 3,
    stress: float = 5,
    notifications: int = 30,
    recovery: float = 2,
    sleep: float = 7,
):
    """Quick GET endpoint for score calculation."""
    m = {
        "meetings": meetings,
        "stress_level": stress,
        "notifications": notifications,
        "recovery_hours": recovery,
        "sleep_hours": sleep,
    }
    score = compute_energy_score(m)
    risk = compute_burnout_risk(m)
    state = get_energy_state(score)
    return {
        "energy_score": score,
        "burnout_risk": risk,
        "energy_state": state["label"],
        "color": state["color"],
    }

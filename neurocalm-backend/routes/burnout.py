from fastapi import APIRouter
from models.schemas import MetricsInput
from utils.ai_engine import (
    compute_burnout_risk,
    compute_energy_score,
    compute_risk_factors,
    generate_forecast,
)

router = APIRouter(prefix="/api/burnout", tags=["Burnout"])


@router.post("/predict")
async def predict_burnout(data: MetricsInput):
    """
    Full burnout prediction: current risk, 7-day forecast,
    weighted risk factors, and contextual recommendation.
    """
    m = data.model_dump()
    current_risk = compute_burnout_risk(m)
    energy_score = compute_energy_score(m)
    risk_factors = compute_risk_factors(m)
    forecast = generate_forecast(current_risk)

    # Confidence based on completeness of data
    confidence = min(0.95, 0.6 + (energy_score / 100) * 0.35)

    if current_risk >= 70:
        rec = "Immediate intervention required. Block recovery time today and reduce meeting load."
    elif current_risk >= 40:
        rec = "Monitor closely. Reduce stress triggers and prioritize 7+ hours of sleep."
    else:
        rec = "Risk levels stable. Maintain current recovery habits to stay in the safe zone."

    return {
        "current_risk": current_risk,
        "energy_score": energy_score,
        "forecast": forecast,
        "risk_factors": risk_factors,
        "prediction_confidence": round(confidence, 2),
        "recommendation": rec,
        "risk_level": "High" if current_risk >= 70 else "Moderate" if current_risk >= 40 else "Low",
        "risk_color": "#F43F5E" if current_risk >= 70 else "#F59E0B" if current_risk >= 40 else "#10B981",
    }


@router.get("/quick")
async def quick_burnout(
    meetings: int = 3,
    stress: float = 5,
    notifications: int = 30,
    sleep: float = 7,
    recovery: float = 2,
):
    """Quick GET endpoint for burnout risk only."""
    m = {
        "meetings": meetings,
        "stress_level": stress,
        "notifications": notifications,
        "sleep_hours": sleep,
        "recovery_hours": recovery,
    }
    risk = compute_burnout_risk(m)
    return {
        "risk": risk,
        "level": "High" if risk >= 70 else "Moderate" if risk >= 40 else "Low",
        "color": "#F43F5E" if risk >= 70 else "#F59E0B" if risk >= 40 else "#10B981",
    }

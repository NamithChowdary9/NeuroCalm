from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime


class MetricsInput(BaseModel):
    user_id: str = "default"
    sleep_hours: float = Field(default=7.0, ge=0, le=24)
    stress_level: float = Field(default=5.0, ge=1, le=10)
    meetings: int = Field(default=3, ge=0, le=30)
    notifications: int = Field(default=30, ge=0, le=500)
    workload: float = Field(default=5.0, ge=1, le=10)
    mood: float = Field(default=6.0, ge=1, le=10)
    social_interaction: float = Field(default=5.0, ge=1, le=10)
    recovery_hours: float = Field(default=2.0, ge=0, le=24)
    timestamp: Optional[datetime] = None

    @field_validator("timestamp", mode="before")
    @classmethod
    def set_timestamp(cls, v):
        return v or datetime.utcnow()


class EnergyResponse(BaseModel):
    energy_score: int
    burnout_risk: int
    energy_state: str
    state_color: str
    recommendations: List[dict]
    metrics: dict
    timestamp: str


class HistoryEntry(BaseModel):
    user_id: str
    energy_score: int
    burnout_risk: int
    energy_state: str
    metrics: dict
    timestamp: datetime


class PredictionResponse(BaseModel):
    current_risk: int
    forecast: List[dict]  # {day, risk, trend}
    risk_factors: List[dict]  # {label, value, weight}
    prediction_confidence: float
    recommendation: str

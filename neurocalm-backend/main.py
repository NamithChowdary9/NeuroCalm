"""
NeuroCalm Backend — FastAPI Application
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from routes.energy import router as energy_router
from routes.analytics import router as analytics_router
from routes.burnout import router as burnout_router
from utils.database import ping_db

load_dotenv()

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

# Build list of allowed origins (supports comma-separated list in env)
_raw_origins = os.getenv("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = (
    [o.strip() for o in _raw_origins.split(",") if o.strip()]
    if _raw_origins
    else [FRONTEND_ORIGIN, "http://localhost:3000", "http://127.0.0.1:3000"]
)
ALLOWED_ORIGIN_REGEX = os.getenv("ALLOWED_ORIGIN_REGEX", r"https://.*\.(vercel\.app|hf\.space)")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db_ok = await ping_db()
    print(f"[NeuroCalm] MongoDB: {'✅ Connected' if db_ok else '⚠️  Not connected (using simulation mode)'}")
    print("[NeuroCalm] Server starting...")
    yield
    # Shutdown
    print("[NeuroCalm] Server shutting down.")


app = FastAPI(
    title="NeuroCalm API",
    description="Agentic AI Social Energy Management — Backend",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(energy_router)
app.include_router(analytics_router)
app.include_router(burnout_router)


@app.get("/")
async def root():
    return {
        "app": "NeuroCalm API",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": [
            "POST /api/energy/analyze",
            "GET  /api/energy/score",
            "GET  /api/analytics/weekly-trend",
            "GET  /api/analytics/interaction-pressure",
            "GET  /api/analytics/emotional-timeline",
            "GET  /api/analytics/heatmap",
            "GET  /api/analytics/mental-load",
            "GET  /api/analytics/history",
            "POST /api/burnout/predict",
            "GET  /api/burnout/quick",
            "GET  /health",
        ],
    }


@app.get("/health")
async def health_check():
    db_status = await ping_db()
    return {
        "status": "healthy",
        "database": "connected" if db_status else "unavailable",
        "mode": "live" if db_status else "simulation",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

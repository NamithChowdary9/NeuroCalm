# NeuroCalm 🧠⚡
**Agentic AI Social Energy Management OS**

A production-ready, Google-inspired dark dashboard that monitors social energy, predicts burnout, and delivers AI-powered recovery recommendations in real time.

---

## Project Structure

```
neurocalm/
├── neurocalm-frontend/        # React + Tailwind + Chart.js
│   ├── src/
│   │   ├── context/
│   │   │   └── EnergyContext.jsx    # Global state + AI logic
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Collapsible navigation
│   │   │   ├── Header.jsx           # Top bar with live score
│   │   │   └── EnergyMeter.jsx      # Animated SVG score gauge
│   │   └── pages/
│   │       ├── Landing.jsx          # Hero landing page
│   │       ├── Dashboard.jsx        # Main dashboard
│   │       ├── Analytics.jsx        # Charts & heatmap
│   │       ├── BurnoutPrediction.jsx# Risk gauge & forecast
│   │       └── Settings.jsx         # Input form with live preview
│   └── package.json
│
└── neurocalm-backend/         # FastAPI + MongoDB Atlas
    ├── main.py                      # App entry point
    ├── models/
    │   └── schemas.py               # Pydantic models
    ├── routes/
    │   ├── energy.py                # Energy analysis endpoints
    │   ├── analytics.py             # Chart data endpoints
    │   └── burnout.py               # Burnout prediction endpoints
    └── utils/
        ├── ai_engine.py             # Core AI logic (formulas + rules)
        └── database.py              # MongoDB Motor async client
```

---

## Quick Start

### Frontend

```bash
cd neurocalm-frontend
npm install
npm start
# Opens at http://localhost:3000
```

### Backend

```bash
cd neurocalm-backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your MongoDB URI if using Atlas

# Start server
python main.py
# API at http://localhost:8000
# Docs at http://localhost:8000/docs
```

---

## API Endpoints

### Energy
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/energy/analyze` | Full analysis from metrics |
| `GET`  | `/api/energy/score`   | Quick score calculation |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analytics/weekly-trend` | 7-day energy chart |
| `GET` | `/api/analytics/interaction-pressure` | Daily load bars |
| `GET` | `/api/analytics/emotional-timeline` | Hourly mood data |
| `GET` | `/api/analytics/heatmap` | Weekly activity grid |
| `GET` | `/api/analytics/mental-load` | Donut chart data |
| `GET` | `/api/analytics/history` | User history log |

### Burnout
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/burnout/predict` | Full prediction + forecast |
| `GET`  | `/api/burnout/quick`   | Quick risk number |

---

## Energy Formulas

```
EnergyScore = 100 − (5×Meetings + 4×Stress + 3×(Notifications÷10) − 2×Recovery)
BurnoutRisk  = (Stress + Meetings + Notifications÷10) ÷ (Sleep + Recovery) × 10
```

**Energy States:**
- 80–100 → 🟢 Healthy
- 50–79  → 🔵 Moderate
- 20–49  → 🟡 Overloaded
- 0–19   → 🔴 Burnout Risk

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + React Router + Tailwind CSS |
| Charts | Chart.js + react-chartjs-2 |
| State | React Context + useState/useEffect |
| Backend | FastAPI + Uvicorn |
| Database | MongoDB Atlas (Motor async) |
| AI Logic | Rule-based engine + Scikit-learn ready |
| Design | Glassmorphism, Sora + Inter fonts, #0B0F19 palette |

---

## Design System

```
Background:  #0B0F19
Card:        #111827 (glassmorphism)
Accent Blue: #00D4FF
Purple:      #8B5CF6
Healthy:     #10B981
Warning:     #F43F5E
Amber:       #F59E0B
```

---

## Environment Variables

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB=neurocalm
SECRET_KEY=your-secret-key
FRONTEND_ORIGIN=http://localhost:3000
OLLAMA_URL=http://localhost:11434    # Optional: local LLM
OLLAMA_MODEL=mistral
```

---

## Extending with ML

The `utils/ai_engine.py` module is designed to be swapped out with a trained model:

```python
# Current: rule-based
score = compute_energy_score(metrics)

# Future: ML model
from sklearn.ensemble import GradientBoostingRegressor
model = load_model("neurocalm_model.pkl")
score = model.predict([feature_vector])
```

---

Built with ❤️ by NeuroCalm

import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import { useEnergy } from "../context/EnergyContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const TT = { backgroundColor: "#1a2235", borderColor: "rgba(244,63,94,0.15)", borderWidth: 1, titleColor: "#6B7280", bodyColor: "#F9FAFB", padding: 10, displayColors: false };

function Gauge({ risk }) {
  const sz = 230, cx = sz/2, cy = sz/2 + 16, r = 88;
  const toRad = d => d * Math.PI / 180;
  const sa = -210, ea = 30, total = ea - sa;
  const arcPath = (s, e, radius) => {
    const x1 = cx + radius * Math.cos(toRad(s)), y1 = cy + radius * Math.sin(toRad(s));
    const x2 = cx + radius * Math.cos(toRad(e)), y2 = cy + radius * Math.sin(toRad(e));
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${e-s>180?1:0} 1 ${x2} ${y2}`;
  };
  const ra = sa + (risk / 100) * total;
  const nr = toRad(ra);
  const col = risk >= 70 ? "#F43F5E" : risk >= 40 ? "#F59E0B" : "#10B981";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={sz} height={sz * 0.72} viewBox={`0 0 ${sz} ${sz * 0.72}`}>
        <path d={arcPath(sa, ea, r)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" strokeLinecap="round"/>
        {[{s:sa,e:sa+total*.33,c:"#10B981"},{s:sa+total*.33,e:sa+total*.66,c:"#F59E0B"},{s:sa+total*.66,e:ea,c:"#F43F5E"}].map((z,i)=>(
          <path key={i} d={arcPath(z.s,z.e,r)} fill="none" stroke={z.c} strokeWidth="9" strokeOpacity="0.55" strokeLinecap="butt"/>
        ))}
        <line x1={cx} y1={cy} x2={cx+58*Math.cos(nr)} y2={cy+58*Math.sin(nr)} stroke={col} strokeWidth="2.5" strokeLinecap="round" style={{filter:`drop-shadow(0 0 6px ${col})`}}/>
        <circle cx={cx} cy={cy} r={5} fill={col} style={{filter:`drop-shadow(0 0 8px ${col})`}}/>
        <text x={cx-68} y={cy+26} fill="#6B7280" fontSize="10" textAnchor="middle">Safe</text>
        <text x={cx}    y={cy-94} fill="#6B7280" fontSize="10" textAnchor="middle">Risk</text>
        <text x={cx+68} y={cy+26} fill="#6B7280" fontSize="10" textAnchor="middle">Critical</text>
      </svg>
      <div style={{ textAlign: "center", marginTop: -6 }}>
        <span className="metric-num" style={{ fontSize: 48, color: col, textShadow: `0 0 28px ${col}44` }}>{risk}</span>
        <span style={{ fontSize: 20, color: col }}>%</span>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Burnout Probability</div>
      </div>
    </div>
  );
}

function RiskBar({ icon, label, value, color }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 14 }}>{icon}</span>
          <span style={{ fontSize: 13, color: "var(--text-2)", fontWeight: 500 }}>{label}</span>
        </div>
        <span className="metric-num" style={{ fontSize: 13, color }}>{value}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 8px ${color}33` }} />
      </div>
    </div>
  );
}

export default function BurnoutPrediction() {
  const { metrics, burnoutRisk, energyScore } = useEnergy();

  const forecast = useMemo(() => {
    return DAYS.map((_, i) => {
      const n = Math.sin(i * 0.9) * 10 + (Math.random() - 0.4) * 12;
      return Math.max(5, Math.min(100, Math.round(burnoutRisk + n + i * (burnoutRisk > 60 ? 1.2 : -0.7))));
    });
  }, [burnoutRisk]);

  const riskColor = burnoutRisk >= 70 ? "#F43F5E" : burnoutRisk >= 40 ? "#F59E0B" : "#10B981";
  const riskLabel = burnoutRisk >= 70 ? "High Risk" : burnoutRisk >= 40 ? "Moderate Risk" : "Low Risk";

  const factors = [
    { icon: "⚡", label: "Stress Level",       value: metrics.stressLevel * 10,                    color: "#F59E0B" },
    { icon: "📅", label: "Meeting Overload",   value: Math.min(100, metrics.meetings * 14),         color: "#8B5CF6" },
    { icon: "🔔", label: "Interaction Pressure",value: Math.min(100, metrics.notifications),        color: "#F43F5E" },
    { icon: "📞", label: "Call Volume",         value: Math.min(100, metrics.callsReceived * 6),    color: "#00D4FF" },
    { icon: "😴", label: "Sleep Deficit",       value: Math.max(0, 100 - metrics.sleepHours * 12), color: "#38BDF8" },
    { icon: "🌙", label: "Low Recovery",        value: Math.max(0, 100 - metrics.recoveryHours * 20), color: "#10B981" },
  ];

  const chartData = {
    labels: DAYS,
    datasets: [
      {
        label: "Burnout Risk %",
        data: forecast,
        borderColor: "#F43F5E",
        backgroundColor: "rgba(244,63,94,0.07)",
        borderWidth: 2, fill: true, tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: forecast.map(v => v >= 70 ? "#F43F5E" : v >= 40 ? "#F59E0B" : "#10B981"),
      },
      {
        label: "Safe threshold (40%)",
        data: Array(7).fill(40),
        borderColor: "rgba(245,158,11,0.35)",
        borderDash: [5,5], borderWidth: 1, pointRadius: 0, fill: false,
      },
    ],
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: true, labels: { color: "#6B7280", font: { size: 11 }, padding: 12, boxWidth: 12, boxHeight: 2 } }, tooltip: TT },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#6B7280", font: { size: 11 } }, border: { display: false } },
      y: { min: 0, max: 100, grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#6B7280", font: { size: 11 } }, border: { display: false } },
    },
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="page-content">

        {/* Row 1: Gauge + Risk factors */}
        <div className="grid-2">

          <div className="card card-glass card-p" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div className="section-title">Burnout Probability Gauge</div>
              <div className="section-sub">Current AI risk assessment</div>
            </div>
            <Gauge risk={burnoutRisk} />
            <div style={{
              marginTop: 14,
              padding: "8px 20px", borderRadius: 10,
              background: `${riskColor}12`, border: `1px solid ${riskColor}28`,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: riskColor, boxShadow: `0 0 6px ${riskColor}` }} />
              <span className="metric-num" style={{ fontSize: 14, color: riskColor }}>{riskLabel}</span>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)", textAlign: "center", marginTop: 10, lineHeight: 1.65, maxWidth: 280 }}>
              {burnoutRisk >= 70
                ? "Immediate recovery action required. Stress accumulation has exceeded safe operating thresholds."
                : burnoutRisk >= 40
                ? "Elevated risk detected. Consider reducing meeting load and improving sleep quality."
                : "Risk within safe range. Maintain your current recovery balance to stay protected."}
            </p>
          </div>

          <div className="card card-glass card-p">
            <div className="section-title" style={{ marginBottom: 4 }}>Risk Factor Breakdown</div>
            <div className="section-sub" style={{ marginBottom: 18 }}>Weighted contribution of each signal to burnout risk</div>
            {factors.map(f => <RiskBar key={f.label} {...f} />)}
          </div>
        </div>

        {/* Row 2: Forecast */}
        <div className="card card-glass card-p">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div className="section-title">7-Day Burnout Forecast</div>
              <div className="section-sub">AI-projected risk trajectory based on current behavioral patterns</div>
            </div>
            <span className="badge badge-warning">AI Projection</span>
          </div>
          <div style={{ height: 160 }}>
            <Line data={chartData} options={chartOpts} />
          </div>
        </div>

        {/* Row 3: Summary chips */}
        <div className="grid-3">
          {[
            { label: "Current Risk",    value: `${burnoutRisk}%`,   color: riskColor,        icon: "🎯" },
            { label: "Energy Score",    value: `${energyScore}/100`, color: "var(--accent)", icon: "⚡" },
            { label: "Recovery Today",  value: `${metrics.recoveryHours}h`, color: "var(--healthy)", icon: "🌙" },
          ].map(c => (
            <div key={c.label} className="card card-glass card-p-sm" style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26 }}>{c.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</div>
                <div className="metric-num" style={{ fontSize: 24, color: c.color, marginTop: 2 }}>{c.value}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

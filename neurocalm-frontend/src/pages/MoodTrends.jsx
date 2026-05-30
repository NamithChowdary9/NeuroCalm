import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useEnergy } from "../context/EnergyContext";
import { IconHeart, IconZap } from "../components/NcIcons";

const MOODS = [
  { emoji:"😔", label:"Struggling", value:1, color:"#F43F5E" },
  { emoji:"😟", label:"Low",        value:3, color:"#F97316" },
  { emoji:"😐", label:"Neutral",    value:5, color:"#F59E0B" },
  { emoji:"🙂", label:"Good",       value:7, color:"#06B6D4" },
  { emoji:"😄", label:"Excellent",  value:9, color:"#10B981" },
];

const ENERGY_LEVELS = [
  { icon:"🪫", label:"Depleted", value:1 },
  { icon:"🔋", label:"Low",      value:3 },
  { icon:"⚡", label:"Moderate", value:5 },
  { icon:"🔥", label:"High",     value:7 },
  { icon:"✨", label:"Peak",     value:9 },
];

const TT = { contentStyle:{background:"#0D1117",border:"1px solid rgba(99,102,241,0.2)",borderRadius:10,fontSize:12}, labelStyle:{color:"#94A3B8",fontSize:11} };

export default function MoodTrends() {
  const { metrics, updateMetrics, moodLog, logMood, hourly } = useEnergy();
  const [selectedMood,   setSelectedMood]   = useState(null);
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [note,  setNote]  = useState("");
  const [saved, setSaved] = useState(false);

  const h   = Array.isArray(hourly)  ? hourly  : [];
  const log = Array.isArray(moodLog) ? moodLog : [];

  const moodHistory = h.slice(0,14).reverse().map(x => ({
    time:  x.label || `${x.hour}:00`,
    mood:  (x.mood   || 5) * 10,
    stress:(x.stress || 5) * 10,
  }));

  const logEntry = () => {
    if (!selectedMood) return;
    logMood({ mood:selectedMood, energy:selectedEnergy||5, note, stress:metrics.stressLevel });
    updateMetrics({ mood:selectedMood });
    setSaved(true);
    setNote("");
    setTimeout(() => setSaved(false), 2500);
  };

  const avgMood   = log.length > 0 ? Math.round(log.slice(0,10).reduce((a,x) => a+(x.mood||5),0)/Math.min(10,log.length)) : metrics.mood;
  const moodTrend = log.length >= 2 ? (log[0].mood > log[1].mood ? "↑ Improving" : "↓ Declining") : "Tracking...";

  return (
    <div className="page">
      <div className="page-pad">

        {/* Quick log */}
        <div className="glass anim-fade-up" style={{ padding:"24px 26px",borderColor:"rgba(139,92,246,0.2)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:18 }}>
            <IconHeart size={36}/>
            <div>
              <div className="card-title">How are you feeling right now?</div>
              <div className="card-sub">Log your current emotional state for AI analysis</div>
            </div>
          </div>

          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:12,color:"var(--text2)",fontWeight:600,marginBottom:10 }}>MOOD</div>
            <div style={{ display:"flex",gap:8 }}>
              {MOODS.map(m => (
                <button key={m.value} onClick={() => setSelectedMood(m.value)} className="mood-btn"
                  style={{ borderColor:selectedMood===m.value?m.color:"transparent",background:selectedMood===m.value?`${m.color}12`:"rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize:26 }}>{m.emoji}</span>
                  <span style={{ fontSize:10,color:selectedMood===m.value?m.color:"var(--text2)",fontWeight:600 }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:12,color:"var(--text2)",fontWeight:600,marginBottom:10 }}>ENERGY LEVEL</div>
            <div style={{ display:"flex",gap:8 }}>
              {ENERGY_LEVELS.map(e => (
                <button key={e.value} onClick={() => setSelectedEnergy(e.value)} className="mood-btn"
                  style={{ borderColor:selectedEnergy===e.value?"#6366F1":"transparent",background:selectedEnergy===e.value?"rgba(99,102,241,0.12)":"rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize:22 }}>{e.icon}</span>
                  <span style={{ fontSize:10,color:selectedEnergy===e.value?"#818CF8":"var(--text2)",fontWeight:600 }}>{e.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            <input className="input" placeholder="Optional note — what's on your mind? (stays private)" value={note} onChange={e => setNote(e.target.value)}/>
          </div>

          <button onClick={logEntry} disabled={!selectedMood} className="btn btn-primary" style={{ opacity:selectedMood?1:0.5,justifyContent:"center" }}>
            {saved ? "✓ Logged Successfully" : "Log Mood Entry"}
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
          {[
            { label:"Current Mood",      value:`${metrics.mood}/10`, color:"#A78BFA", icon:"😊" },
            { label:"Avg Mood (recent)", value:`${avgMood}/10`,      color:"#06B6D4", icon:"📊" },
            { label:"Mood Trend",        value:moodTrend,            color:moodTrend.includes("↑")?"#10B981":"#F59E0B", icon:"📈" },
          ].map((s,i) => (
            <div key={i} className="glass" style={{ padding:"18px 20px",display:"flex",alignItems:"center",gap:14 }}>
              <div style={{ width:44,height:44,borderRadius:12,background:`${s.color}15`,border:`1.5px solid ${s.color}45`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,boxShadow:`0 4px 14px ${s.color}18` }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize:11,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em" }}>{s.label}</div>
                <div style={{ fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:22,color:s.color,marginTop:3 }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Mood chart */}
        <div className="glass" style={{ padding:"22px 24px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:4 }}>
            <IconZap size={28}/>
            <div className="card-title">Mood & Stress Timeline</div>
          </div>
          <div className="card-sub" style={{ marginBottom:16 }}>{h.length>=2?"Real hourly data":"Simulated — logs build as you use the app"}</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodHistory} margin={{top:4,right:4,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="time"  tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip {...TT}/>
              <Line type="monotone" dataKey="mood"   stroke="#A78BFA" strokeWidth={2} dot={false} name="Mood"/>
              <Line type="monotone" dataKey="stress" stroke="#F43F5E" strokeWidth={2} dot={false} strokeDasharray="4 2" name="Stress"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent log */}
        {log.length > 0 && (
          <div className="glass" style={{ padding:"20px 22px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
              <IconHeart size={28}/>
              <div className="card-title">Recent Mood Entries</div>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {log.slice(0,8).map((entry,i) => {
                const m  = MOODS.find(x => Math.abs(x.value-entry.mood)<=1) || MOODS[2];
                const ts = new Date(entry.ts);
                return (
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)" }}>
                    <div style={{ width:38,height:38,borderRadius:10,background:`${m.color}15`,border:`1.5px solid ${m.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>
                      {m.emoji}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13,color:"var(--text)",fontWeight:500 }}>{m.label} · Energy {entry.energy}/10</div>
                      {entry.note && <div style={{ fontSize:12,color:"var(--text2)",marginTop:2 }}>{entry.note}</div>}
                    </div>
                    <div style={{ fontSize:11,color:"var(--text2)" }}>{ts.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

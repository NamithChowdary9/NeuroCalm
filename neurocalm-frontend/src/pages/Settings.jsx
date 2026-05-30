import React, { useState } from "react";
import EnergyMeter from "../components/EnergyMeter";
import { useEnergy } from "../context/EnergyContext";
import { IconMoon, IconZap, IconMessageCircle, IconMonitor, IconSave, IconReset, IconShield } from "../components/NcIcons";

function Section({ Icon, title, sub, children }) {
  return (
    <div className="glass" style={{ padding:"22px 24px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:18 }}>
        <Icon size={36}/>
        <div>
          <div className="card-title">{title}</div>
          {sub && <div className="card-sub">{sub}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

function SliderRow({ label, name, value, min, max, step, unit, color, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
        <label style={{ fontSize:13,color:"var(--text2)",fontWeight:500 }}>{label}</label>
        <span style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14,color }}>{value}{unit}</span>
      </div>
      <input type="range" className="slider" min={min} max={max} step={step} value={value}
        onChange={e => onChange(name, Number(e.target.value))}
        style={{ background:`linear-gradient(90deg,${color} ${pct}%,rgba(255,255,255,0.07) ${pct}%)` }}
      />
    </div>
  );
}

function NumRow({ label, name, value, min, max, unit, onChange }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:7 }}>{label}</label>
      <input type="number" className="input" min={min} max={max} value={value}
        onChange={e => onChange(name, Math.max(min, Math.min(max, Number(e.target.value))))}
        style={{ maxWidth:200 }}
      />
      {unit && <span style={{ fontSize:11,color:"var(--text2)",marginLeft:8 }}>{unit}</span>}
    </div>
  );
}

export default function Settings() {
  const { metrics, updateMetrics, resetMetrics, energyScore, burnoutRisk, energyState, recommendations } = useEnergy();
  const [saved, setSaved] = useState(false);
  const ch   = (n, v) => updateMetrics({ [n]: v });
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };
  const riskColor = burnoutRisk>=70?"#F43F5E":burnoutRisk>=40?"#F59E0B":"#10B981";

  return (
    <div className="page">
      <div className="page-pad" style={{ display:"grid",gridTemplateColumns:"1fr 290px",gap:22 }}>

        {/* Left */}
        <div style={{ display:"flex",flexDirection:"column",gap:18 }}>

          <Section Icon={IconMoon} title="Recovery & Sleep" sub="Primary energy sources — these directly boost your neural score">
            <SliderRow label="Sleep Hours"     name="sleepHours"    value={metrics.sleepHours}    min={0} max={12} step={0.5} unit="h"   color="#06B6D4" onChange={ch}/>
            <SliderRow label="Recovery Window" name="recoveryHours" value={metrics.recoveryHours} min={0} max={8}  step={0.5} unit="h"   color="#10B981" onChange={ch}/>
          </Section>

          <Section Icon={IconZap} title="Mental Load" sub="High stress and workload are the primary burnout accelerators">
            <SliderRow label="Stress Level" name="stressLevel" value={metrics.stressLevel} min={1} max={10} step={1} unit="/10" color="#F59E0B" onChange={ch}/>
            <SliderRow label="Workload"     name="workload"    value={metrics.workload}    min={1} max={10} step={1} unit="/10" color="#F97316" onChange={ch}/>
            <SliderRow label="Mood"         name="mood"        value={metrics.mood}        min={1} max={10} step={1} unit="/10" color="#8B5CF6" onChange={ch}/>
          </Section>

          <Section Icon={IconMessageCircle} title="Interaction Pressure" sub="Communication volume directly drains social energy">
            <NumRow    label="Meetings Today"           name="meetings"          value={metrics.meetings}          min={0} max={20}  unit="sessions" onChange={ch}/>
            <NumRow    label="Notifications"            name="notifications"     value={metrics.notifications}     min={0} max={200} unit="alerts"   onChange={ch}/>
            <NumRow    label="Calls Received"           name="callsReceived"     value={metrics.callsReceived}     min={0} max={30}  unit="calls"    onChange={ch}/>
            <SliderRow label="Social Interaction Level" name="socialInteraction" value={metrics.socialInteraction} min={1} max={10} step={1} unit="/10" color="#F43F5E" onChange={ch}/>
          </Section>

          <Section Icon={IconMonitor} title="Digital Usage" sub="Screen time and context switching tracked as cognitive load">
            <SliderRow label="Screen Time"  name="screenTimeHours" value={metrics.screenTimeHours} min={0} max={16} step={0.5} unit="h" color="#F43F5E" onChange={ch}/>
            <NumRow    label="App Switches" name="appSwitches"     value={metrics.appSwitches}     min={0} max={100}           unit="context shifts" onChange={ch}/>
          </Section>

          {/* Privacy note */}
          <div className="glass" style={{ padding:"16px 20px",borderColor:"rgba(99,102,241,0.15)",background:"rgba(99,102,241,0.04)" }}>
            <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
              <IconShield size={32}/>
              <div>
                <div style={{ fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:4 }}>Privacy Statement</div>
                <p style={{ fontSize:12.5,color:"var(--text2)",lineHeight:1.65,margin:0 }}>NeuroCalm only accesses metadata signals. No message content, call recordings, or personal data is ever read, stored, or transmitted. All scoring happens locally in your browser.</p>
              </div>
            </div>
          </div>

          <div style={{ display:"flex",gap:10 }}>
            <button onClick={save} className="btn btn-primary" style={{ flex:1,justifyContent:"center",display:"flex",alignItems:"center",gap:8 }}>
              <IconSave size={22}/> {saved ? "✓ Saved & Recalculated" : "Save & Recalculate"}
            </button>
            <button onClick={resetMetrics} className="btn btn-ghost" style={{ display:"flex",alignItems:"center",gap:8 }}>
              <IconReset size={22}/> Reset
            </button>
          </div>
        </div>

        {/* Right preview */}
        <div style={{ display:"flex",flexDirection:"column",gap:14,position:"sticky",top:80,height:"fit-content" }}>
          <div className="glass" style={{ padding:"22px 18px",display:"flex",flexDirection:"column",alignItems:"center" }}>
            <div style={{ fontSize:11,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12 }}>Live Preview</div>
            <EnergyMeter score={energyScore} state={energyState} size={185}/>
          </div>

          <div className="glass" style={{ padding:"16px 18px" }}>
            <div style={{ fontSize:11,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",marginBottom:8 }}>Burnout Risk</div>
            <div style={{ fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:32,color:riskColor }}>{burnoutRisk}<span style={{ fontSize:16 }}>%</span></div>
            <div className="progress-bg" style={{ marginTop:8 }}>
              <div className="progress-fill" style={{ width:`${burnoutRisk}%`,background:`linear-gradient(90deg,#10B981,${riskColor})` }}/>
            </div>
          </div>

          <div className="glass" style={{ padding:"16px 18px" }}>
            <div style={{ fontSize:11,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",marginBottom:10 }}>AI Insights</div>
            <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
              {(Array.isArray(recommendations) ? recommendations : []).slice(0,3).map((r,i) => {
                const col = r.priority==="critical"?"#F43F5E":r.priority==="positive"?"#10B981":r.priority==="high"?"#F59E0B":"#818CF8";
                return (
                  <div key={i} style={{ display:"flex",gap:8,padding:"9px 11px",borderRadius:9,background:`${col}09`,border:`1px solid ${col}20` }}>
                    <div style={{ width:28,height:28,borderRadius:8,background:`${col}18`,border:`1.5px solid ${col}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>
                      {r.icon}
                    </div>
                    <p style={{ fontSize:11.5,color:"var(--text2)",lineHeight:1.5,margin:0 }}>{r.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass" style={{ padding:"14px 16px" }}>
            <div style={{ fontSize:11,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",marginBottom:7 }}>Score Formula</div>
            <div style={{ fontFamily:"monospace",fontSize:11,color:"#818CF8",lineHeight:1.9 }}>
              Score = 100 −<br/>
              &nbsp;&nbsp;5×Meetings<br/>
              &nbsp;&nbsp;−4×Stress<br/>
              &nbsp;&nbsp;−3×(Notifs÷10)<br/>
              &nbsp;&nbsp;+2×Recovery<br/>
              &nbsp;&nbsp;−0.5×Calls
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

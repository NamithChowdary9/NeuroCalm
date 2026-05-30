import React, { useState } from "react";
import { useEnergy } from "../context/EnergyContext";
import { IconZap, IconMoon, IconFlame, IconMessageCircle, IconCheckCircle } from "./NcIcons";

const STEPS = [
  { id:"welcome",  title:"Welcome to NeuroCalm",  sub:"Your Agentic AI emotional wellness OS. Let's calibrate your baseline in 90 seconds.", Icon:IconZap,           color:"#6366F1" },
  { id:"recovery", title:"Sleep & Recovery",       sub:"These are your primary energy sources. Accurate inputs unlock better AI predictions.", Icon:IconMoon,          color:"#06B6D4",
    fields:[{name:"sleepHours",label:"Sleep Hours",min:0,max:12,step:0.5,unit:"h",color:"#06B6D4"},{name:"recoveryHours",label:"Recovery Time",min:0,max:8,step:0.5,unit:"h",color:"#10B981"}] },
  { id:"stress",   title:"Mental Load",             sub:"Honest stress levels help the AI detect burnout risk before you feel it.",            Icon:IconFlame,         color:"#F59E0B",
    fields:[{name:"stressLevel",label:"Stress Level",min:1,max:10,step:1,unit:"/10",color:"#F59E0B"},{name:"workload",label:"Workload",min:1,max:10,step:1,unit:"/10",color:"#F97316"},{name:"mood",label:"Current Mood",min:1,max:10,step:1,unit:"/10",color:"#8B5CF6"}] },
  { id:"social",   title:"Social & Interaction",    sub:"Social pressure signals are highly predictive of emotional fatigue.",                 Icon:IconMessageCircle, color:"#8B5CF6",
    fields:[{name:"meetings",label:"Meetings Today",min:0,max:20,step:1,unit:"",color:"#8B5CF6"},{name:"notifications",label:"Notifications (est.)",min:0,max:200,step:5,unit:"",color:"#F43F5E"},{name:"socialInteraction",label:"Social Interaction Level",min:1,max:10,step:1,unit:"/10",color:"#06B6D4"}] },
  { id:"done",     title:"Calibration Complete",    sub:"",                                                                                    Icon:IconCheckCircle,   color:"#10B981" },
];

export default function Onboarding({ onComplete }) {
  const { metrics, updateMetrics, energyScore, burnoutRisk, energyState } = useEnergy();
  const [step, setStep] = useState(0);
  const cur = STEPS[step];

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else { localStorage.setItem("nc_onboarded", "1"); onComplete(); }
  };

  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(8,11,20,0.98)",backdropFilter:"blur(12px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24 }}>

      {/* Progress dots */}
      <div style={{ display:"flex",gap:6,marginBottom:40 }}>
        {STEPS.map((_,i) => (
          <div key={i} style={{ height:3,width:i===step?32:8,borderRadius:2,background:i<=step?"#6366F1":"rgba(255,255,255,0.1)",transition:"all 0.3s" }}/>
        ))}
      </div>

      <div style={{ width:"100%",maxWidth:520,background:"rgba(13,17,23,0.95)",border:"1px solid var(--border)",borderRadius:24,padding:"40px 44px",boxShadow:"0 40px 80px rgba(0,0,0,0.7)" }}>

        {/* Icon + heading */}
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ display:"flex",justifyContent:"center",marginBottom:18 }}>
            <cur.Icon size={56}/>
          </div>
          <h2 style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:22,color:"var(--text)",marginBottom:8 }}>{cur.title}</h2>
          <p style={{ fontSize:14,color:"var(--text2)",lineHeight:1.65,margin:0 }}>{cur.sub}</p>
        </div>

        {/* Slider fields */}
        {cur.fields && (
          <div style={{ display:"flex",flexDirection:"column",gap:22,marginBottom:28 }}>
            {cur.fields.map(f => {
              const val = metrics[f.name] ?? f.min;
              const pct = ((val - f.min) / (f.max - f.min)) * 100;
              return (
                <div key={f.name}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                    <label style={{ fontSize:13,color:"var(--text2)",fontWeight:500 }}>{f.label}</label>
                    <span style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:15,color:f.color }}>{val}{f.unit}</span>
                  </div>
                  <input type="range" className="slider" min={f.min} max={f.max} step={f.step} value={val}
                    onChange={e => updateMetrics({ [f.name]: Number(e.target.value) })}
                    style={{ background:`linear-gradient(90deg,${f.color} ${pct}%,rgba(255,255,255,0.07) ${pct}%)` }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Done screen */}
        {cur.id === "done" && (
          <div style={{ textAlign:"center",marginBottom:28,padding:"24px",borderRadius:16,background:energyState.bg,border:`1px solid ${energyState.border}` }}>
            <div style={{ fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:60,color:energyState.color,lineHeight:1,textShadow:`0 0 40px ${energyState.color}44` }}>{energyScore}</div>
            <div style={{ fontSize:14,color:energyState.color,fontWeight:600,marginTop:8 }}>Initial Energy Score · {energyState.label}</div>
            <div style={{ height:1,background:`${energyState.color}20`,margin:"14px 0" }}/>
            <div style={{ display:"flex",justifyContent:"center",gap:24 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:22,color:"#F43F5E" }}>{burnoutRisk}%</div>
                <div style={{ fontSize:11,color:"var(--text2)" }}>Burnout Risk</div>
              </div>
            </div>
            <p style={{ fontSize:12,color:"var(--text2)",marginTop:14,lineHeight:1.65 }}>Your AI agent will observe your patterns continuously and evolve its insights over time.</p>
          </div>
        )}

        <div style={{ display:"flex",gap:10 }}>
          {step > 0 && step < STEPS.length - 1 && (
            <button className="btn btn-ghost" style={{ flex:1,justifyContent:"center" }} onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          <button className="btn btn-primary" style={{ flex:1,justifyContent:"center" }} onClick={next}>
            {step === STEPS.length - 1 ? "Enter Dashboard →" : step === STEPS.length - 2 ? "Complete Setup →" : "Continue →"}
          </button>
        </div>

        {step === 0 && (
          <button className="btn btn-ghost btn-sm" style={{ width:"100%",justifyContent:"center",marginTop:10,fontSize:12 }}
            onClick={() => { localStorage.setItem("nc_onboarded","1"); onComplete(); }}>
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}

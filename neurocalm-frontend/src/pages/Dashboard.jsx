import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import EnergyMeter from "../components/EnergyMeter";
import { useEnergy } from "../context/EnergyContext";
import {
  IconBrain, IconTrendingUp, IconHeart, IconUsers, IconActivity, IconArrowRight
} from "../components/NcIcons";

function SummaryCard({ Icon, iconColor, label, value, unit, sub, trend, onClick }) {
  return (
    <div onClick={onClick} className="glass glass-hover"
      style={{ padding:"22px 22px 18px",cursor:"pointer",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:iconColor,opacity:0.07,filter:"blur(20px)",pointerEvents:"none" }}/>
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14 }}>
        <div style={{ fontSize:11.5,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em" }}>{label}</div>
        <Icon size={36}/>
      </div>
      <div style={{ display:"flex",alignItems:"baseline",gap:4,marginBottom:4 }}>
        <span style={{ fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:34,color:iconColor,lineHeight:1,textShadow:`0 0 20px ${iconColor}44` }}>{value}</span>
        {unit && <span style={{ fontSize:13,color:"var(--text2)",fontWeight:500 }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize:12,color:"var(--text2)",marginBottom:12 }}>{sub}</div>}
      <div style={{ height:3,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden" }}>
        <div style={{ height:"100%",width:`${Math.min(100,typeof value==="number"?value:parseInt(value)||0)}%`,background:`linear-gradient(90deg,${iconColor}88,${iconColor})`,borderRadius:2,transition:"width 0.9s ease",boxShadow:`0 0 6px ${iconColor}55` }}/>
      </div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:10 }}>
        {trend && <span style={{ fontSize:11,color:iconColor,fontWeight:600 }}>{trend}</span>}
        <div style={{ display:"flex",alignItems:"center",gap:4,color:"var(--text2)",fontSize:11,marginLeft:"auto" }}>
          <span>Details</span><IconArrowRight size={11}/>
        </div>
      </div>
    </div>
  );
}

function MiniChart({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={50}>
      <AreaChart data={data} margin={{ top:4,right:0,left:0,bottom:0 }}>
        <defs>
          <linearGradient id={`mc-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#mc-${color.replace("#","")})`} dot={false}/>
        <Tooltip content={() => null}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

function AISnippet({ insight, onClick }) {
  const cfg = {
    critical: { color:"#F43F5E", bg:"rgba(244,63,94,0.08)",  border:"rgba(244,63,94,0.18)"  },
    high:     { color:"#F59E0B", bg:"rgba(245,158,11,0.08)", border:"rgba(245,158,11,0.18)" },
    medium:   { color:"#818CF8", bg:"rgba(99,102,241,0.08)", border:"rgba(99,102,241,0.18)" },
    positive: { color:"#10B981", bg:"rgba(16,185,129,0.08)", border:"rgba(16,185,129,0.18)" },
    info:     { color:"#06B6D4", bg:"rgba(6,182,212,0.08)",  border:"rgba(6,182,212,0.18)"  },
  };
  const s = cfg[insight.priority] || cfg.info;
  return (
    <div onClick={onClick}
      style={{ display:"flex",gap:12,padding:"14px 16px",borderRadius:12,background:s.bg,border:`1px solid ${s.border}`,cursor:"pointer",transition:"all 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.transform="translateY(-1px)"}
      onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
    >
      <div style={{ width:38,height:38,borderRadius:10,background:`${s.color}15`,border:`1.5px solid ${s.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>
        {insight.icon}
      </div>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
          <span style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:13,color:s.color }}>{insight.title}</span>
          <span style={{ fontSize:9,padding:"2px 7px",borderRadius:10,background:`${s.color}18`,color:s.color,fontWeight:700 }}>{insight.tag}</span>
        </div>
        <p style={{ fontSize:12.5,color:"var(--text2)",lineHeight:1.55,margin:0,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{insight.text}</p>
      </div>
      <IconArrowRight size={14} color="var(--text2)" style={{ flexShrink:0,marginTop:2 }}/>
    </div>
  );
}

export default function Dashboard() {
  const { metrics, energyScore, burnoutRisk, stability, socialPressure, energyState, aiInsights, hourly, user } = useEnergy();
  const navigate = useNavigate();

  const riskColor      = burnoutRisk >= 70 ? "#F43F5E" : burnoutRisk >= 40 ? "#F59E0B" : "#10B981";
  const stabilityColor = stability  >= 70 ? "#10B981" : stability  >= 45 ? "#06B6D4" : "#F59E0B";

  const trendPoints = useMemo(() => {
    const h = Array.isArray(hourly) ? hourly : [];
    if (h.length >= 3) return h.slice(0,12).reverse().map(x => ({ v:x.score }));
    return Array.from({ length:8 }, () => ({ v:Math.max(20,Math.min(100,Math.round(energyScore+(Math.random()-0.5)*25))) }));
  }, [hourly, energyScore]);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="page mesh-bg">
      <div className="page-pad">

        {/* Greeting */}
        <div className="anim-fade-up" style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:26,color:"var(--text)",marginBottom:4 }}>
              {greeting}, <span className="grad-text">{user?.name?.split(" ")[0] || "there"}</span> 👋
            </h1>
            <p style={{ fontSize:14,color:"var(--text2)" }}>
              {aiInsights[0]?.priority === "critical"
                ? "⚠️ Your AI agent has detected something that needs your attention."
                : aiInsights[0]?.priority === "positive"
                ? "✨ Your neural energy is looking strong today."
                : "Your AI agent is actively monitoring your emotional state."}
            </p>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:9,background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.2)" }}>
            <div className="dot-live"/>
            <span style={{ fontSize:12,color:"#818CF8",fontWeight:600 }}>AI Agent Active</span>
          </div>
        </div>

        {/* Main grid */}
        <div style={{ display:"grid",gridTemplateColumns:"220px 1fr",gap:18,alignItems:"start" }}>
          <div className="glass anim-fade-up d1" style={{ padding:"24px 18px",display:"flex",flexDirection:"column",alignItems:"center",gap:16 }}>
            <EnergyMeter score={energyScore} state={energyState} size={195}/>
            <div style={{ width:"100%",height:50 }}><MiniChart data={trendPoints} color={energyState.color}/></div>
            <button onClick={() => navigate("/analytics")} className="btn btn-ghost btn-sm" style={{ width:"100%",justifyContent:"center",fontSize:12 }}>
              View Trends →
            </button>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            <SummaryCard Icon={IconTrendingUp} iconColor={riskColor}      label="Burnout Risk"        value={burnoutRisk}               unit="%" sub={burnoutRisk>=70?"Critical zone":burnoutRisk>=40?"Elevated":"Safe zone"} onClick={() => navigate("/burnout")}   />
            <SummaryCard Icon={IconHeart}      iconColor={stabilityColor} label="Emotional Stability" value={stability}                 unit="/100" sub="Mood & recovery index"         onClick={() => navigate("/mood")}      />
            <SummaryCard Icon={IconUsers}      iconColor="#8B5CF6"        label="Social Pressure"     value={Math.min(socialPressure,100)} unit="/100" sub="Interaction load today"      onClick={() => navigate("/analytics")} />
            <SummaryCard Icon={IconActivity}   iconColor="#06B6D4"        label="Recovery Window"     value={metrics.recoveryHours}     unit="h"   sub="Downtime accumulated"            onClick={() => navigate("/settings")}  />
          </div>
        </div>

        {/* AI Insights preview */}
        <div className="glass anim-fade-up d3" style={{ padding:"22px 24px" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <IconBrain size={32}/>
              <div>
                <div className="card-title">AI Agent Observations</div>
                <div className="card-sub">Dynamically generated from your behavioral patterns</div>
              </div>
            </div>
            <button onClick={() => navigate("/ai-insights")} className="btn btn-ghost btn-sm" style={{ display:"flex",alignItems:"center",gap:5 }}>
              All Insights <IconArrowRight size={12}/>
            </button>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {aiInsights.slice(0,3).map((ins,i) => (
              <AISnippet key={i} insight={ins} onClick={() => navigate("/ai-insights")}/>
            ))}
          </div>
        </div>

        {/* Quick metrics row */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12 }}>
          {[
            { label:"Meetings",     value:metrics.meetings,      unit:"today",  color:"#8B5CF6" },
            { label:"Mental Load",  value:metrics.stressLevel,   unit:"/10",    color:"#F59E0B" },
            { label:"Interactions", value:metrics.notifications, unit:"alerts", color:"#F43F5E" },
            { label:"Sleep",        value:metrics.sleepHours,    unit:"hrs",    color:"#06B6D4" },
          ].map((m,i) => (
            <div key={i} className="glass anim-fade-up" style={{ padding:"16px 18px",animationDelay:`${0.35+i*0.05}s`,opacity:0 }}>
              <div style={{ fontSize:11,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8 }}>{m.label}</div>
              <div style={{ display:"flex",alignItems:"baseline",gap:3 }}>
                <span style={{ fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:26,color:m.color }}>{m.value}</span>
                <span style={{ fontSize:11,color:"var(--text2)" }}>{m.unit}</span>
              </div>
              <div className="progress-bg" style={{ marginTop:8 }}>
                <div className="progress-fill" style={{ width:`${Math.min(100,typeof m.value==="number"?m.value*5:parseInt(m.value)*5)}%`,background:m.color,maxWidth:"100%" }}/>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

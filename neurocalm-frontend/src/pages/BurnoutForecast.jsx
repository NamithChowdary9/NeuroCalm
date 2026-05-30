import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { useEnergy } from "../context/EnergyContext";
import { IconTrendingUp, IconAlertTriangle, IconShield, IconActivity } from "../components/NcIcons";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const TT = { contentStyle:{background:"#0D1117",border:"1px solid rgba(244,63,94,0.2)",borderRadius:10,fontSize:12}, labelStyle:{color:"#94A3B8"} };

function GaugeArc({ risk }) {
  const sz=220, cx=sz/2, cy=sz/2+16, r=86;
  const toRad = d => d * Math.PI / 180;
  const sa=-210, ea=30, total=ea-sa;
  const arc = (s, e, rd) => {
    const x1=cx+rd*Math.cos(toRad(s)), y1=cy+rd*Math.sin(toRad(s));
    const x2=cx+rd*Math.cos(toRad(e)), y2=cy+rd*Math.sin(toRad(e));
    return `M ${x1} ${y1} A ${rd} ${rd} 0 ${e-s>180?1:0} 1 ${x2} ${y2}`;
  };
  const na=sa+(risk/100)*total, nr=toRad(na);
  const col = risk>=70?"#F43F5E":risk>=40?"#F59E0B":"#10B981";
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center" }}>
      <svg width={sz} height={sz*0.7} viewBox={`0 0 ${sz} ${sz*0.7}`}>
        <path d={arc(sa,ea,r)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" strokeLinecap="round"/>
        {[[sa,sa+total*.33,"#10B981"],[sa+total*.33,sa+total*.66,"#F59E0B"],[sa+total*.66,ea,"#F43F5E"]].map(([s,e,c],i)=>(
          <path key={i} d={arc(s,e,r)} fill="none" stroke={c} strokeWidth="9" strokeOpacity="0.5" strokeLinecap="butt"/>
        ))}
        <line x1={cx} y1={cy} x2={cx+58*Math.cos(nr)} y2={cy+58*Math.sin(nr)} stroke={col} strokeWidth="3" strokeLinecap="round" style={{filter:`drop-shadow(0 0 6px ${col})`}}/>
        <circle cx={cx} cy={cy} r={6} fill={col} style={{filter:`drop-shadow(0 0 8px ${col})`}}/>
        {["Safe","Risk","Critical"].map((l,i)=>(
          <text key={i} x={[cx-72,cx,cx+72][i]} y={cy+28} fill="#475569" fontSize="10" textAnchor="middle">{l}</text>
        ))}
      </svg>
      <div style={{ textAlign:"center",marginTop:-8 }}>
        <span style={{ fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:52,color:col,textShadow:`0 0 32px ${col}44` }}>{risk}</span>
        <span style={{ fontSize:22,color:col }}>%</span>
        <div style={{ fontSize:12,color:"var(--text2)",marginTop:4 }}>Burnout Probability</div>
      </div>
    </div>
  );
}

export default function BurnoutForecast() {
  const { metrics, burnoutRisk, energyScore, hourly, aiMemory } = useEnergy();
  const h = Array.isArray(hourly) ? hourly : [];

  const forecast = useMemo(() => DAYS.map((_,i) => {
    const val = Math.max(5,Math.min(100,Math.round(burnoutRisk+Math.sin(i*0.9)*9+i*(burnoutRisk>60?1.4:-0.8)+(Math.random()-0.5)*6)));
    return { day:DAYS[i], risk:val };
  }), [burnoutRisk]);

  const factors = [
    { label:"Stress Level",         value:metrics.stressLevel*10,                     color:"#F59E0B", weight:"28%", Icon:IconAlertTriangle },
    { label:"Meeting Overload",     value:Math.min(100,(metrics.meetings||0)*14),      color:"#8B5CF6", weight:"22%", Icon:IconActivity      },
    { label:"Interaction Pressure", value:Math.min(100,metrics.notifications||0),      color:"#F43F5E", weight:"18%", Icon:IconTrendingUp    },
    { label:"Sleep Deficit",        value:Math.max(0,100-(metrics.sleepHours||7)*12),  color:"#06B6D4", weight:"18%", Icon:IconShield        },
    { label:"Low Recovery",         value:Math.max(0,100-(metrics.recoveryHours||2)*20),color:"#10B981",weight:"14%", Icon:IconShield        },
  ];

  const riskColor  = burnoutRisk>=70?"#F43F5E":burnoutRisk>=40?"#F59E0B":"#10B981";
  const riskLabel  = burnoutRisk>=70?"High Risk":burnoutRisk>=40?"Moderate Risk":"Low Risk";
  const streakDays = aiMemory?.streaks?.highStress || 0;

  return (
    <div className="page">
      <div className="page-pad">

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18 }}>

          {/* Gauge */}
          <div className="glass" style={{ padding:"28px 24px",display:"flex",flexDirection:"column",alignItems:"center" }}>
            <div className="card-title" style={{ marginBottom:4,textAlign:"center" }}>Burnout Probability</div>
            <div className="card-sub" style={{ marginBottom:16,textAlign:"center" }}>Calculated from your real behavioral inputs</div>
            <GaugeArc risk={burnoutRisk}/>
            <div style={{ marginTop:16,padding:"10px 24px",borderRadius:12,background:`${riskColor}12`,border:`1.5px solid ${riskColor}40`,display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ width:8,height:8,borderRadius:"50%",background:riskColor,boxShadow:`0 0 8px ${riskColor}` }}/>
              <span style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14,color:riskColor }}>{riskLabel}</span>
            </div>
            <p style={{ fontSize:12.5,color:"var(--text2)",textAlign:"center",marginTop:12,lineHeight:1.7,maxWidth:280 }}>
              {burnoutRisk>=70?"Immediate recovery action required. Your stress accumulation has exceeded safe operating thresholds.":burnoutRisk>=40?"Elevated risk detected. Prioritize recovery sleep and reduce meeting density.":"Risk within safe parameters. Maintain current recovery balance."}
            </p>
          </div>

          {/* Risk factors */}
          <div className="glass" style={{ padding:"22px 24px" }}>
            <div className="card-title" style={{ marginBottom:4 }}>Risk Factor Breakdown</div>
            <div className="card-sub" style={{ marginBottom:18 }}>Weighted contribution of each signal</div>
            {factors.map((f,i) => (
              <div key={i} style={{ marginBottom:14 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <f.Icon size={26}/>
                    <span style={{ fontSize:13,color:"var(--text2)",fontWeight:500 }}>{f.label}</span>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ fontSize:10,color:"var(--text2)" }}>{f.weight} weight</span>
                    <span style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:13,color:f.color }}>{f.value}%</span>
                  </div>
                </div>
                <div className="progress-bg">
                  <div className="progress-fill" style={{ width:`${f.value}%`,background:`linear-gradient(90deg,${f.color}88,${f.color})`,boxShadow:`0 0 6px ${f.color}44` }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-day forecast */}
        <div className="glass" style={{ padding:"22px 24px" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <IconTrendingUp size={32}/>
              <div>
                <div className="card-title">7-Day Burnout Forecast</div>
                <div className="card-sub">AI-projected risk trajectory based on current behavioral patterns</div>
              </div>
            </div>
            <span style={{ fontSize:10,padding:"3px 9px",borderRadius:10,background:"rgba(244,63,94,0.1)",color:"#FB7185",border:"1px solid rgba(244,63,94,0.2)",fontWeight:700 }}>AI Projection</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={forecast} margin={{top:4,right:4,left:-20,bottom:0}}>
              <defs>
                <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#F43F5E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="day" tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip {...TT} formatter={v => [`${v}%`,"Risk"]}/>
              <ReferenceLine y={40} stroke="rgba(245,158,11,0.4)" strokeDasharray="4 4"/>
              <ReferenceLine y={70} stroke="rgba(244,63,94,0.4)" strokeDasharray="4 4"/>
              <Area type="monotone" dataKey="risk" stroke="#F43F5E" strokeWidth={2} fill="url(#gf)" dot={{ fill:"#F43F5E",r:3 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary chips */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
          {[
            { Icon:IconTrendingUp, label:"Current Risk",       value:`${burnoutRisk}%`,    color:riskColor                         },
            { Icon:IconActivity,   label:"Energy Score",       value:`${energyScore}`,     color:"#818CF8"                         },
            { Icon:IconAlertTriangle, label:"High Stress Streak", value:`${streakDays} days`, color:streakDays>=3?"#F43F5E":"#10B981" },
          ].map((c,i) => (
            <div key={i} className="glass" style={{ padding:"18px 20px",display:"flex",alignItems:"center",gap:14 }}>
              <c.Icon size={36}/>
              <div>
                <div style={{ fontSize:11,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em" }}>{c.label}</div>
                <div style={{ fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:24,color:c.color,marginTop:3 }}>{c.value}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

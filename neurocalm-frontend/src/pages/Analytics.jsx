import React, { useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatHourLabel, useEnergy } from "../context/EnergyContext";

const TT_STYLE = { contentStyle:{ background:"#0D1117",border:"1px solid rgba(99,102,241,0.2)",borderRadius:10,fontSize:12,fontFamily:"Inter,sans-serif" }, labelStyle:{ color:"#94A3B8",fontSize:11 }, itemStyle:{ color:"#818CF8" } };

function GCard({ title, sub, badge, badgeColor="#818CF8", children }) {
  return (
    <div className="glass" style={{ padding:"22px 24px" }}>
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:18 }}>
        <div>
          <div className="card-title">{title}</div>
          {sub&&<div className="card-sub">{sub}</div>}
        </div>
        {badge&&<span style={{ fontSize:10,padding:"3px 9px",borderRadius:10,background:`${badgeColor}15`,color:badgeColor,border:`1px solid ${badgeColor}25`,fontWeight:700,flexShrink:0 }}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function StatChip({ label, value, color }) {
  return (
    <div className="glass" style={{ padding:"16px 18px",textAlign:"center" }}>
      <div style={{ fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:26,color }}>{value}</div>
      <div style={{ fontSize:11,color:"var(--text2)",marginTop:4 }}>{label}</div>
    </div>
  );
}

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function Analytics() {
  const ctx        = useEnergy();
  const metrics    = ctx?.metrics||{};
  const energyScore= ctx?.energyScore||70;
  const hourlyRaw  = ctx?.hourly;
  const hourly     = Array.isArray(hourlyRaw)?hourlyRaw:[];
  const hasData    = hourly.length>=2;

  // Hourly energy & risk
  const hourlyData = useMemo(()=>{
    if(!hasData) return Array.from({length:8},(_,i)=>({ label:formatHourLabel(9+i, true), score:Math.round(55+Math.sin(i*0.8)*22), risk:Math.round(30+Math.cos(i*0.7)*15) }));
    return hourly.slice(0,16).reverse().map(h=>({ label:formatHourLabel(h.hour, true)||h.label, score:h.score||0, risk:h.risk||0, stress:(h.stress||5)*10, mood:(h.mood||5)*10 }));
  },[hourly,hasData]);

  // Daily averages
  const dailyData = useMemo(()=>{
    if(!hasData) return DAYS.map((d,i)=>({day:d,avg:Math.round(50+Math.sin(i)*18)}));
    const byDay={};
    hourly.forEach(h=>{const k=h.dayOfWeek||"Mon";if(!byDay[k])byDay[k]=[];byDay[k].push(h.score||0);});
    return DAYS.map(d=>({day:d,avg:byDay[d]?Math.round(byDay[d].reduce((a,b)=>a+b,0)/byDay[d].length):0}));
  },[hourly,hasData]);

  // Stats
  const avgScore   = hasData?Math.round(hourly.slice(0,24).reduce((a,h)=>a+(h.score||0),0)/Math.min(24,hourly.length)):energyScore;
  const peakScore  = hasData?Math.max(...hourly.slice(0,24).map(h=>h.score||0)):energyScore;
  const avgRisk    = hasData?Math.round(hourly.slice(0,24).reduce((a,h)=>a+(h.risk||0),0)/Math.min(24,hourly.length)):0;
  const sessions   = hourly.length;

  const heatDays  = DAYS;
  const heatHours = Array.from({length:16},(_,i)=>7+i);
  const heatmap   = useMemo(()=>{
    return heatDays.map(d=>heatHours.map(hour=>{
      const match=hourly.find(h=>h.dayOfWeek===d&&h.hour===hour);
      return match?Math.round(100-(match.score||50)):0;
    }));
  },[hourly]);

  const heatColor=v=>v===0?"rgba(255,255,255,0.06)":v<20?"rgba(16,185,129,0.35)":v<40?"rgba(6,182,212,0.5)":v<60?"rgba(245,158,11,0.6)":v<80?"rgba(244,63,94,0.7)":"rgba(244,63,94,0.95)";

  return (
    <div className="page">
      <div className="page-pad">

        {!hasData&&(
          <div className="glass" style={{ padding:"16px 20px",borderColor:"rgba(245,158,11,0.2)",background:"rgba(245,158,11,0.06)" }}>
            <span style={{ fontSize:13,color:"#FCD34D" }}>⏱ Real data appears here after 1+ hour of usage. Charts below show a simulated preview of what your data will look like.</span>
          </div>
        )}

        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14 }}>
          <StatChip label="Avg Energy Score"  value={avgScore}         color="#818CF8"/>
          <StatChip label="Peak Score"        value={peakScore}        color="#10B981"/>
          <StatChip label="Avg Burnout Risk"  value={`${avgRisk}%`}    color={avgRisk>=60?"#F43F5E":"#F59E0B"}/>
          <StatChip label="Hours Tracked"     value={sessions}         color="#06B6D4"/>
        </div>

        {/* Energy over time */}
        <GCard title="Hourly Energy Score" sub={hasData?`${hourly.length} real snapshots · updates every hour`:"Simulated preview"} badge={hasData?"Live Data":"Simulated"} badgeColor={hasData?"#10B981":"#F59E0B"}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={hourlyData} margin={{top:4,right:4,left:-20,bottom:0}}>
              <defs>
                <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="label" tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip {...TT_STYLE} formatter={v=>[`${v}`,`Energy Score`]}/>
              <Area type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2} fill="url(#ge)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </GCard>

        {/* Burnout + Stress */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18 }}>
          <GCard title="Burnout Risk Over Time" sub={hasData?"From real hourly data":"Simulated"}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={hourlyData} margin={{top:4,right:4,left:-20,bottom:0}}>
                <defs>
                  <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="label" tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,100]} tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip {...TT_STYLE} formatter={v=>[`${v}%`,"Risk"]}/>
                <Area type="monotone" dataKey="risk" stroke="#F43F5E" strokeWidth={2} fill="url(#gr)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </GCard>

          <GCard title="Daily Average Energy" sub="Averaged from all hourly snapshots per day">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={dailyData} margin={{top:4,right:4,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="day" tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,100]} tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip {...TT_STYLE} formatter={v=>[`${v}`,`Avg Score`]}/>
                <Bar dataKey="avg" radius={[5,5,0,0]}
                  fill="#6366F1"
                  label={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </GCard>
        </div>

        {/* Heatmap */}
        <GCard title="Weekly Activity Heatmap" sub="Cognitive load intensity by day and hour — darker = higher mental strain">
          {/* Hour labels */}
          <div style={{ display:"flex",alignItems:"center",marginBottom:6 }}>
            <div style={{ width:44,flexShrink:0 }}/>
            <div style={{ display:"flex",flex:1,gap:3 }}>
              {heatHours.map(hour=>(
                <div key={hour} style={{ flex:1,textAlign:"center",fontSize:10,color:"var(--text2)",fontWeight:500 }}>
                  {formatHourLabel(hour)}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          {heatDays.map((day,di)=>(
            <div key={day} style={{ display:"flex",alignItems:"center",gap:0,marginBottom:5 }}>
              <div style={{ width:44,fontSize:11,color:"var(--text2)",fontWeight:600,flexShrink:0 }}>{day}</div>
              <div style={{ display:"flex",flex:1,gap:3 }}>
                {heatHours.map((hour,hi)=>{
                  const val = heatmap[di]?.[hi]||0;
                  return (
                    <div key={hour}
                      title={`${day} ${formatHourLabel(hour, true)}: ${val}% load`}
                      style={{
                        flex:1, height:28, borderRadius:5,
                        background:heatColor(val),
                        cursor:"pointer",
                        transition:"transform 0.15s, filter 0.15s",
                        border:"1px solid rgba(255,255,255,0.04)",
                      }}
                      onMouseEnter={e=>{ e.currentTarget.style.transform="scaleY(1.25)"; e.currentTarget.style.filter="brightness(1.4)"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.transform="scaleY(1)"; e.currentTarget.style.filter="brightness(1)"; }}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:14,justifyContent:"flex-end" }}>
            <span style={{ fontSize:11,color:"var(--text2)" }}>Low</span>
            {[
              "rgba(16,185,129,0.35)",
              "rgba(6,182,212,0.5)",
              "rgba(245,158,11,0.6)",
              "rgba(244,63,94,0.7)",
              "rgba(244,63,94,0.95)",
            ].map((c,i)=>(
              <div key={i} style={{ width:18,height:18,borderRadius:4,background:c,border:"1px solid rgba(255,255,255,0.06)" }}/>
            ))}
            <span style={{ fontSize:11,color:"var(--text2)" }}>High</span>
          </div>
        </GCard>

      </div>
    </div>
  );
}

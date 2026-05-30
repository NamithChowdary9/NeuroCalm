import React, { useEffect, useState } from "react";

const R = 72, C = 2*Math.PI*R;

export default function EnergyMeter({ score, state, size=210 }) {
  const [anim, setAnim] = useState(0);
  useEffect(()=>{ const t=setTimeout(()=>setAnim(score),150); return ()=>clearTimeout(t); },[score]);
  const offset = C-(anim/100)*C;
  const cx=size/2, cy=size/2;

  return (
    <div style={{ position:"relative",width:size,height:size,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position:"absolute",inset:0 }}>
        <defs>
          <filter id="mg"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <linearGradient id="mg2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={state.color}/>
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.7"/>
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={R+12} fill="none" stroke={state.color} strokeWidth="1" strokeOpacity="0.07"/>
        <circle cx={cx} cy={cy} r={R+6}  fill="none" stroke={state.color} strokeWidth="1" strokeOpacity="0.04"/>
        <circle cx={cx} cy={cy} r={R}    fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" strokeLinecap="round"/>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="url(#mg2)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition:"stroke-dashoffset 1.1s cubic-bezier(0.4,0,0.2,1)" }}
          filter="url(#mg)"
        />
        {[0,25,50,75,100].map(p=>{
          const a=(p/100)*360-90, r2=a*Math.PI/180;
          return <line key={p} x1={cx+(R-14)*Math.cos(r2)} y1={cy+(R-14)*Math.sin(r2)} x2={cx+(R-8)*Math.cos(r2)} y2={cy+(R-8)*Math.sin(r2)} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeLinecap="round"/>;
        })}
      </svg>
      <div style={{ textAlign:"center",zIndex:1 }}>
        <div style={{ fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:46,color:state.color,lineHeight:1,textShadow:`0 0 32px ${state.color}55`,transition:"color 0.5s" }}>{anim}</div>
        <div style={{ fontSize:10,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:4 }}>Neural Energy</div>
        <div style={{ display:"inline-flex",alignItems:"center",gap:5,marginTop:7,padding:"3px 10px",borderRadius:20,background:state.bg,border:`1px solid ${state.border}` }}>
          <div style={{ width:5,height:5,borderRadius:"50%",background:state.color,boxShadow:`0 0 5px ${state.color}`,animation:"pulse 2s infinite" }}/>
          <span style={{ fontSize:11,fontWeight:700,color:state.color,fontFamily:"Sora,sans-serif" }}>{state.label}</span>
        </div>
      </div>
    </div>
  );
}

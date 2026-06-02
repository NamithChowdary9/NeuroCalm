import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEnergy } from "../context/EnergyContext";
import useDeviceSignals from "../hooks/useDeviceSignals";
import useNotifications from "../hooks/useNotifications";
import { IconMenu, IconBell, IconLogOut } from "./NcIcons";

const META = {
  "/dashboard":   { title:"Dashboard",        sub:"Your neural energy at a glance"        },
  "/analytics":   { title:"Analytics",        sub:"Deep dive into your patterns"          },
  "/ai-insights": { title:"AI Insights",      sub:"Agentic observations about your state" },
  "/mood":        { title:"Mood Trends",      sub:"Emotional timeline & tracking"         },
  "/burnout":     { title:"Burnout Forecast", sub:"Predictive risk analysis"              },
  "/settings":    { title:"Energy Input",     sub:"Update your current metrics"           },
};

export default function Header({ sidebarOpen, onToggleSidebar }) {
  const { energyScore, energyState, user, setUser, updateDeviceSignals } = useEnergy();
  const navigate  = useNavigate();
  const location  = useLocation();
  const meta      = META[location.pathname] || { title:"NeuroCalm", sub:"" };

  const { signals, sendNotification } = useDeviceSignals();
  const { alerts, dismiss, clearAll, checkThresholds, unreadCount } = useNotifications();
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 30000); return () => clearInterval(t); }, []);
  useEffect(() => { if (updateDeviceSignals) updateDeviceSignals(signals); }, [signals]);
  useEffect(() => { checkThresholds(energyScore, 0, sendNotification); }, [energyScore]);
  useEffect(() => {
    const h = (e) => { if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header style={{ height:60,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",borderBottom:"1px solid var(--border)",background:"rgba(8,11,20,0.9)",backdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:50,flexShrink:0 }}>

      {/* Left */}
      <div style={{ display:"flex",alignItems:"center",gap:12 }}>
        <button onClick={onToggleSidebar}
          style={{ display:"flex",alignItems:"center",justifyContent:"center",width:34,height:34,borderRadius:8,background:"rgba(255,255,255,0.04)",border:"1px solid var(--border)",cursor:"pointer",transition:"all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(99,102,241,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
        >
          <IconMenu size={16}/>
        </button>

        <div>
          <h2 style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:15,color:"var(--text)",margin:0,lineHeight:1.2 }}>{meta.title}</h2>
          {meta.sub && <p style={{ fontSize:11,color:"var(--text2)",margin:0 }}>{meta.sub}</p>}
        </div>
      </div>

      {/* Right */}
      <div style={{ display:"flex",alignItems:"center",gap:10 }}>

        {/* Time */}
        <div style={{ textAlign:"right",marginRight:4 }}>
          <div style={{ fontFamily:"Sora,sans-serif",fontSize:12.5,fontWeight:600,color:"var(--text)",lineHeight:1.2 }}>
            {time.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit",hour12:true })}
          </div>
          <div style={{ fontSize:10.5,color:"var(--text2)" }}>
            {time.toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" })}
          </div>
        </div>

        {/* Score chip */}
        <div style={{ display:"flex",alignItems:"center",gap:7,padding:"6px 13px",borderRadius:9,background:energyState.bg,border:`1px solid ${energyState.border}`,cursor:"pointer" }}
          onClick={() => navigate("/dashboard")}>
          <div style={{ width:7,height:7,borderRadius:"50%",background:energyState.color,boxShadow:`0 0 6px ${energyState.color}`,animation:"pulse 2s infinite" }}/>
          <span style={{ fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:14,color:energyState.color }}>{energyScore}</span>
          <span style={{ fontSize:11,color:"var(--text2)",fontWeight:500 }}>{energyState.label}</span>
        </div>

        {/* Bell */}
        <div ref={bellRef} style={{ position:"relative" }}>
          <button onClick={() => setBellOpen(o => !o)}
            style={{ position:"relative",display:"flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:9,background:bellOpen?"rgba(99,102,241,0.12)":"rgba(255,255,255,0.04)",border:`1px solid ${bellOpen?"rgba(99,102,241,0.35)":"var(--border)"}`,cursor:"pointer",transition:"all 0.15s" }}
          >
            <IconBell size={28}/>
            {unreadCount > 0 && (
              <span style={{ position:"absolute",top:3,right:3,width:8,height:8,borderRadius:"50%",background:"var(--rose)",border:"1.5px solid var(--bg)" }}/>
            )}
          </button>

          {bellOpen && (
            <div style={{ position:"absolute",top:"calc(100% + 8px)",right:0,width:320,background:"#0D1117",border:"1px solid var(--border)",borderRadius:14,boxShadow:"0 20px 60px rgba(0,0,0,0.7)",zIndex:200,overflow:"hidden" }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderBottom:"1px solid var(--border)" }}>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <IconBell size={24}/>
                  <span style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:13,color:"var(--text)" }}>Alerts</span>
                </div>
                {alerts.length > 0 && (
                  <button onClick={clearAll} style={{ background:"none",border:"none",cursor:"pointer",fontSize:11,color:"var(--text2)" }}>Clear all</button>
                )}
              </div>
              <div style={{ maxHeight:320,overflowY:"auto",padding:6 }}>
                {alerts.length === 0 ? (
                  <div style={{ padding:"28px 16px",textAlign:"center" }}>
                    <div style={{ display:"flex",justifyContent:"center",marginBottom:8 }}><IconBell size={36}/></div>
                    <div style={{ fontSize:13,color:"var(--text2)" }}>No alerts</div>
                  </div>
                ) : alerts.map(a => {
                  const col = a.type==="critical"?"#F43F5E":a.type==="warning"?"#F59E0B":a.type==="success"?"#10B981":"#818CF8";
                  return (
                    <div key={a.id} style={{ display:"flex",gap:10,padding:"10px 12px",borderRadius:10,marginBottom:4,background:`${col}0A`,border:`1px solid ${col}20` }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12,fontWeight:600,color:col,marginBottom:2 }}>{a.title}</div>
                        <div style={{ fontSize:11.5,color:"var(--text2)",lineHeight:1.5 }}>{a.message}</div>
                      </div>
                      <button onClick={() => dismiss(a.id)} style={{ background:"none",border:"none",cursor:"pointer",color:"var(--text2)",fontSize:16,alignSelf:"flex-start" }}>×</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Avatar + sign out */}
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#6366F1,#06B6D4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",fontFamily:"Sora,sans-serif",flexShrink:0 }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <button
            onClick={() => { setUser(null); navigate("/signin"); }}
            style={{ display:"flex",alignItems:"center",gap:5,background:"none",border:"1px solid var(--border)",borderRadius:7,padding:"6px 10px",cursor:"pointer",color:"var(--text2)",fontSize:12,transition:"all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(244,63,94,0.3)"; e.currentTarget.style.color="#F43F5E"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text2)"; }}
          >
            <IconLogOut size={13}/> Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

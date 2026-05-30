import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEnergy } from "../context/EnergyContext";
import {
  IconDashboard, IconBarChart, IconBrain, IconHeart,
  IconTrendingUp, IconSettings, IconZapLogo
} from "./NcIcons";

const NAV = [
  { path:"/dashboard",   label:"Dashboard",        Icon:IconDashboard  },
  { path:"/analytics",   label:"Analytics",        Icon:IconBarChart   },
  { path:"/ai-insights", label:"AI Insights",      Icon:IconBrain      },
  { path:"/mood",        label:"Mood Trends",      Icon:IconHeart      },
  { path:"/burnout",     label:"Burnout Forecast", Icon:IconTrendingUp },
  { path:"/settings",    label:"Settings",         Icon:IconSettings   },
];

export default function Sidebar({ open, onToggle }) {
  const { energyScore, energyState, user } = useEnergy();
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <>
      {open && (
        <div onClick={onToggle}
          style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:98,display:"none" }}
          className="mobile-overlay"
        />
      )}

      <aside style={{
        position:"fixed", top:0, left:0, height:"100vh", width:240, zIndex:99,
        background:"rgba(8,11,20,0.97)",
        backdropFilter:"blur(24px)",
        borderRight:"1px solid var(--border)",
        display:"flex", flexDirection:"column",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition:"transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        overflowX:"hidden",
      }}>

        {/* Logo row */}
        <div style={{ padding:"20px 18px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid var(--border)" }}>
          <div onClick={() => navigate("/dashboard")} style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer" }}>
            <IconZapLogo size={32}/>
            <span style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:17,color:"var(--text)" }}>
              Neuro<span style={{ color:"#818CF8" }}>Calm</span>
            </span>
          </div>
        </div>

        {/* Energy snapshot */}
        <div style={{ margin:"12px 12px 8px",padding:"12px 14px",borderRadius:12,background:energyState.bg,border:`1px solid ${energyState.border}` }}>
          <div style={{ fontSize:10,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6 }}>Neural Energy</div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <span style={{ fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:30,color:energyState.color,lineHeight:1 }}>{energyScore}</span>
            <div>
              <div style={{ fontSize:12,fontWeight:600,color:energyState.color }}>{energyState.label}</div>
              <div style={{ fontSize:10,color:"var(--text2)" }}>out of 100</div>
            </div>
          </div>
          <div style={{ marginTop:8,height:3,borderRadius:2,background:"rgba(255,255,255,0.07)" }}>
            <div style={{ height:"100%",width:`${energyScore}%`,background:energyState.color,borderRadius:2,transition:"width 0.8s ease",boxShadow:`0 0 6px ${energyState.color}` }}/>
          </div>
        </div>

        <div className="divider" style={{ margin:"4px 0" }}/>

        {/* Nav */}
        <nav style={{ flex:1,padding:"8px 10px",display:"flex",flexDirection:"column",gap:2 }}>
          {NAV.map(({ path, label, Icon }) => {
            const active = location.pathname === path;
            return (
              <NavLink key={path} to={path} className={`nav-item ${active ? "active" : ""}`}
                style={{ display:"flex",alignItems:"center",gap:10 }}>
                <Icon size={28}/>
                <span>{label}</span>
                {path === "/ai-insights" && (
                  <span style={{ marginLeft:"auto",fontSize:9,padding:"2px 6px",borderRadius:10,background:"rgba(99,102,241,0.2)",color:"#818CF8",fontWeight:700 }}>AI</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User */}
        {user && (
          <div style={{ padding:"12px 14px",borderTop:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#6366F1,#06B6D4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",fontFamily:"Sora,sans-serif",flexShrink:0 }}>
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ overflow:"hidden",flex:1 }}>
              <div style={{ fontSize:12.5,fontWeight:600,color:"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{user.name}</div>
              <div style={{ fontSize:11,color:"var(--text2)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{user.email}</div>
            </div>
            <div className="dot-live"/>
          </div>
        )}
      </aside>
    </>
  );
}

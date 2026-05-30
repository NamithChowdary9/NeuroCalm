import React from "react";
import { useNavigate } from "react-router-dom";
import { IconZapLogo, IconBrain, IconShield, IconTrendingUp, IconActivity, IconCpu, IconArrowRight } from "../components/NcIcons";

const FEATURES = [
  { Icon:IconBrain,      title:"Agentic AI Engine",         desc:"Continuously observes, learns, and reasons about your emotional patterns — never static, always evolving.",    color:"#6366F1" },
  { Icon:IconActivity,   title:"Real-Time Energy Tracking",  desc:"Live neural energy score calculated from behavioral signals, sleep data, social load, and recovery patterns.", color:"#06B6D4" },
  { Icon:IconTrendingUp, title:"Burnout Prediction",         desc:"7-day predictive modeling that detects burnout trajectories before they become crises.",                       color:"#10B981" },
  { Icon:IconBrain,      title:"Emotional Memory",           desc:"AI remembers your behavioral patterns across sessions and identifies recurring triggers intelligently.",        color:"#8B5CF6" },
  { Icon:IconCpu,        title:"Browser Signal Analysis",    desc:"Tracks tab switches, session time, network quality, and battery state as cognitive load signals.",             color:"#F59E0B" },
  { Icon:IconShield,     title:"Privacy by Design",          desc:"Zero message content access. Only metadata signals analyzed. All processing happens locally.",                 color:"#F43F5E" },
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="mesh-bg" style={{ minHeight:"100vh" }}>

      {/* Nav */}
      <nav style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 60px",height:64,borderBottom:"1px solid var(--border)",background:"rgba(8,11,20,0.9)",backdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:100 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer" }} onClick={() => navigate("/")}>
          <IconZapLogo size={32}/>
          <span style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:17,color:"var(--text)" }}>Neuro<span style={{ color:"#818CF8" }}>Calm</span></span>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/signin")}>Sign In</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/signup")}>Get Started →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth:860,margin:"0 auto",padding:"100px 60px 80px",textAlign:"center" }}>
        <div className="anim-fade-up" style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.2)",marginBottom:28 }}>
          <div className="dot-live"/>
          <span style={{ fontSize:12.5,color:"#818CF8",fontWeight:600 }}>Agentic AI · Continuously Learning</span>
        </div>
        <h1 className="anim-fade-up d1" style={{ fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:"clamp(38px,5.5vw,66px)",lineHeight:1.08,color:"var(--text)",letterSpacing:"-2px",marginBottom:24 }}>
          The AI that understands<br/><span className="shimmer-text">your emotional state.</span>
        </h1>
        <p className="anim-fade-up d2" style={{ fontSize:"clamp(15px,2vw,18px)",color:"var(--text2)",lineHeight:1.75,maxWidth:580,margin:"0 auto 44px" }}>
          NeuroCalm is an Agentic AI wellness OS that monitors your neural energy, predicts burnout, tracks emotional patterns, and adapts its intelligence to you over time.
        </p>
        <div className="anim-fade-up d3" style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/signup")}>Start Free →</button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate("/signin")}>Sign In</button>
        </div>

        {/* Stats */}
        <div className="anim-fade-up d4" style={{ display:"inline-flex",gap:0,marginTop:56,background:"rgba(13,17,23,0.8)",border:"1px solid var(--border)",borderRadius:16,overflow:"hidden",backdropFilter:"blur(16px)" }}>
          {[{v:"99ms",l:"Response time"},{v:"Hourly",l:"Data snapshots"},{v:"7-day",l:"AI forecast"},{v:"100%",l:"Privacy safe"}].map((s,i) => (
            <div key={i} style={{ padding:"16px 28px",borderRight:i<3?"1px solid var(--border)":"none",textAlign:"center" }}>
              <div style={{ fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:20,color:"#818CF8" }}>{s.v}</div>
              <div style={{ fontSize:11,color:"var(--text2)",marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider-glow" style={{ maxWidth:800,margin:"0 auto" }}/>

      {/* Features */}
      <section style={{ maxWidth:1080,margin:"0 auto",padding:"80px 60px" }}>
        <div style={{ textAlign:"center",marginBottom:52 }}>
          <h2 style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:"clamp(26px,3.5vw,38px)",color:"var(--text)",letterSpacing:"-0.5px",marginBottom:12 }}>
            Not a dashboard. An operating system<br/>for your emotional intelligence.
          </h2>
          <p style={{ fontSize:15,color:"var(--text2)",maxWidth:480,margin:"0 auto" }}>Built for the modern knowledge worker who needs more than charts.</p>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18 }}>
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <div key={i} className="glass glass-hover anim-fade-up" style={{ padding:"24px",animationDelay:`${i*0.06}s`,opacity:0 }}>
              <div style={{ marginBottom:16 }}>
                <Icon size={44}/>
              </div>
              <h3 style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14.5,color:"var(--text)",marginBottom:8 }}>{title}</h3>
              <p style={{ fontSize:13,color:"var(--text2)",lineHeight:1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth:1080,margin:"0 auto 80px",padding:"0 60px" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.08))",border:"1px solid rgba(99,102,241,0.18)",borderRadius:24,padding:"52px 60px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:40,flexWrap:"wrap" }}>
          <div>
            <h2 style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:28,color:"var(--text)",marginBottom:10 }}>Start protecting your energy today.</h2>
            <p style={{ fontSize:15,color:"var(--text2)",maxWidth:420 }}>Join professionals using NeuroCalm to prevent burnout before it happens.</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/signup")}>Create Free Account →</button>
        </div>
      </section>

      <footer style={{ borderTop:"1px solid var(--border)",padding:"24px 60px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <IconZapLogo size={24}/>
          <span style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:13,color:"var(--text)" }}>Neuro<span style={{ color:"#818CF8" }}>Calm</span></span>
        </div>
        <div style={{ fontSize:12,color:"var(--text2)" }}>© 2025 NeuroCalm · Privacy-first · Zero message content accessed</div>
      </footer>
    </div>
  );
}

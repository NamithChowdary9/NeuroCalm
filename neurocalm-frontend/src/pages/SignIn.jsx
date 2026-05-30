import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEnergy } from "../context/EnergyContext";
import { IconZapLogo, IconMail, IconLock } from "../components/NcIcons";

export default function SignIn() {
  const { setUser } = useEnergy();
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email:"", password:"" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const name = form.email.split("@")[0].replace(/[._-]/g," ").replace(/\b\w/g, c => c.toUpperCase());
    setUser({ name, email:form.email });
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="mesh-bg" style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24 }}>
      <Link to="/" style={{ textDecoration:"none",display:"flex",alignItems:"center",gap:9,marginBottom:36 }}>
        <IconZapLogo size={32}/>
        <span style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:18,color:"var(--text)" }}>Neuro<span style={{ color:"#818CF8" }}>Calm</span></span>
      </Link>

      <div className="auth-card anim-fade-up">
        <h1 style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:24,color:"var(--text)",marginBottom:6,textAlign:"center" }}>Welcome back</h1>
        <p style={{ fontSize:13.5,color:"var(--text2)",textAlign:"center",marginBottom:28 }}>Sign in to your NeuroCalm account</p>

        <form onSubmit={submit} style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
            <label style={{ fontSize:13,fontWeight:500,color:"var(--text2)" }}>Email address</label>
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}>
                <IconMail size={15}/>
              </div>
              <input className="input" style={{ paddingLeft:36 }} type="email" placeholder="you@company.com"
                value={form.email} onChange={e => setForm(f => ({...f,email:e.target.value}))} autoComplete="email"/>
            </div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
            <label style={{ fontSize:13,fontWeight:500,color:"var(--text2)" }}>Password</label>
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}>
                <IconLock size={15}/>
              </div>
              <input className="input" style={{ paddingLeft:36 }} type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({...f,password:e.target.value}))} autoComplete="current-password"/>
            </div>
          </div>
          {error && (
            <div style={{ padding:"9px 12px",borderRadius:8,background:"rgba(244,63,94,0.1)",border:"1px solid rgba(244,63,94,0.2)",fontSize:13,color:"#F43F5E" }}>{error}</div>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width:"100%",padding:"12px",fontSize:14,marginTop:4,opacity:loading?0.7:1,justifyContent:"center" }}>
            {loading ? "Signing in…" : <><span>Sign In</span><ArrowRight size={15}/></>}
          </button>
        </form>

        <div className="divider" style={{ margin:"20px 0" }}/>
        <p style={{ fontSize:13,color:"var(--text2)",textAlign:"center" }}>
          Don't have an account? <Link to="/signup" style={{ color:"#818CF8",fontWeight:600,textDecoration:"none" }}>Create one →</Link>
        </p>
      </div>
    </div>
  );
}

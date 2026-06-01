import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEnergy } from "../context/EnergyContext";
import { IconZapLogo, IconMail, IconLock } from "../components/NcIcons";
import { signInWithGoogle } from "../firebase";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.7 35.7 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2C41.1 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-3.9z"/>
    </svg>
  );
}

export default function SignIn() {
  const { setUser } = useEnergy();
  const navigate = useNavigate();
  const [form,       setForm]       = useState({ email:"", password:"" });
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [gLoading,   setGLoading]   = useState(false);

  const handleGoogle = async () => {
    setGLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      // Page redirects to Google — no further action needed here
    } catch (e) {
      console.error("Google sign-in error:", e);
      setError(`Sign-in error: ${e.message}`);
      setGLoading(false);
    }
  };

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
        <p style={{ fontSize:13.5,color:"var(--text2)",textAlign:"center",marginBottom:24 }}>Sign in to your NeuroCalm account</p>

        {/* Google Sign In */}
        <button onClick={handleGoogle} disabled={gLoading}
          style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"11px 16px",borderRadius:10,background:"#fff",border:"1px solid #e2e8f0",cursor:"pointer",fontSize:14,fontWeight:600,color:"#1a1a1a",marginBottom:16,transition:"all 0.2s",opacity:gLoading?0.7:1 }}
          onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
          onMouseLeave={e => e.currentTarget.style.background="#fff"}
        >
          <GoogleIcon/>
          {gLoading ? "Signing in…" : "Continue with Google"}
        </button>

        {/* Divider */}
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
          <div style={{ flex:1,height:1,background:"var(--border)" }}/>
          <span style={{ fontSize:12,color:"var(--text2)" }}>or sign in with email</span>
          <div style={{ flex:1,height:1,background:"var(--border)" }}/>
        </div>

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

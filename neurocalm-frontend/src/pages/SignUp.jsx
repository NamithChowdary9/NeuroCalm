import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEnergy } from "../context/EnergyContext";
import { IconZapLogo, IconMail, IconLock, IconUser } from "../components/NcIcons";
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

export default function SignUp() {
  const { setUser } = useEnergy();
  const navigate = useNavigate();
  const [form,     setForm]     = useState({ name:"", email:"", password:"", confirm:"" });
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const strength = form.password.length===0?0:form.password.length<6?1:form.password.length<10?2:3;
  const sColor   = ["transparent","#F43F5E","#F59E0B","#10B981"][strength];
  const sLabel   = ["","Weak","Moderate","Strong"][strength];

  const handleGoogle = async () => {
    setGLoading(true);
    setError("");
    try {
      const firebaseUser = await signInWithGoogle();
      if (firebaseUser) {
        setUser({
          name:  firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
          uid:   firebaseUser.uid,
        });
        navigate("/dashboard");
      }
    } catch (e) {
      console.error("Google sign-in error:", e);
      setError(`Sign-in failed: ${e.message}`);
      setGLoading(false);
    }
  };

  const submit = async e => {
    e.preventDefault();
    setError("");
    if (!form.name||!form.email||!form.password) { setError("Please fill in all fields."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setUser({ name:form.name, email:form.email });
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="mesh-bg" style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24 }}>
      <Link to="/" style={{ textDecoration:"none",display:"flex",alignItems:"center",gap:9,marginBottom:32 }}>
        <IconZapLogo size={32}/>
        <span style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:18,color:"var(--text)" }}>Neuro<span style={{ color:"#818CF8" }}>Calm</span></span>
      </Link>

      <div className="auth-card anim-fade-up">
        <h1 style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:24,color:"var(--text)",marginBottom:6,textAlign:"center" }}>Create your account</h1>
        <p style={{ fontSize:13.5,color:"var(--text2)",textAlign:"center",marginBottom:24 }}>Start your AI wellness journey — free forever.</p>

        {/* Google Sign Up */}
        <button onClick={handleGoogle} disabled={gLoading}
          style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"11px 16px",borderRadius:10,background:"#fff",border:"1px solid #e2e8f0",cursor:"pointer",fontSize:14,fontWeight:600,color:"#1a1a1a",marginBottom:16,transition:"all 0.2s",opacity:gLoading?0.7:1 }}
          onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
          onMouseLeave={e => e.currentTarget.style.background="#fff"}
        >
          <GoogleIcon/>
          {gLoading ? "Signing up…" : "Continue with Google"}
        </button>

        {/* Divider */}
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
          <div style={{ flex:1,height:1,background:"var(--border)" }}/>
          <span style={{ fontSize:12,color:"var(--text2)" }}>or sign up with email</span>
          <div style={{ flex:1,height:1,background:"var(--border)" }}/>
        </div>

        <form onSubmit={submit} style={{ display:"flex",flexDirection:"column",gap:13 }}>
          {[
            { name:"name",  label:"Full name", type:"text",  placeholder:"Your name",       IconComp:IconUser, auto:"name"  },
            { name:"email", label:"Email",     type:"email", placeholder:"you@company.com", IconComp:IconMail, auto:"email" },
          ].map(f => (
            <div key={f.name} style={{ display:"flex",flexDirection:"column",gap:6 }}>
              <label style={{ fontSize:13,fontWeight:500,color:"var(--text2)" }}>{f.label}</label>
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}>
                  <f.IconComp size={15}/>
                </div>
                <input className="input" style={{ paddingLeft:36 }} type={f.type} placeholder={f.placeholder}
                  value={form[f.name]} onChange={e => setForm(p => ({...p,[f.name]:e.target.value}))} autoComplete={f.auto}/>
              </div>
            </div>
          ))}

          <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
            <label style={{ fontSize:13,fontWeight:500,color:"var(--text2)" }}>Password</label>
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}>
                <IconLock size={15}/>
              </div>
              <input className="input" style={{ paddingLeft:36 }} type="password" placeholder="Min. 6 characters"
                value={form.password} onChange={e => setForm(p => ({...p,password:e.target.value}))} autoComplete="new-password"/>
            </div>
            {form.password.length > 0 && (
              <div>
                <div style={{ height:3,borderRadius:2,background:"rgba(255,255,255,0.07)",overflow:"hidden" }}>
                  <div style={{ height:"100%",width:`${(strength/3)*100}%`,background:sColor,borderRadius:2,transition:"all 0.3s" }}/>
                </div>
                <span style={{ fontSize:11,color:sColor }}>{sLabel}</span>
              </div>
            )}
          </div>

          <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
            <label style={{ fontSize:13,fontWeight:500,color:"var(--text2)" }}>Confirm password</label>
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",pointerEvents:"none" }}>
                <IconLock size={15}/>
              </div>
              <input className="input" style={{ paddingLeft:36 }} type="password" placeholder="Re-enter password"
                value={form.confirm} onChange={e => setForm(p => ({...p,confirm:e.target.value}))} autoComplete="new-password"/>
            </div>
          </div>

          {error && (
            <div style={{ padding:"9px 12px",borderRadius:8,background:"rgba(244,63,94,0.1)",border:"1px solid rgba(244,63,94,0.2)",fontSize:13,color:"#F43F5E" }}>{error}</div>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width:"100%",padding:"12px",fontSize:14,marginTop:4,opacity:loading?0.7:1,justifyContent:"center" }}>
            {loading ? "Creating account…" : <><span>Create Account</span><ArrowRight size={15}/></>}
          </button>
        </form>

        <p style={{ fontSize:11.5,color:"var(--text2)",textAlign:"center",marginTop:14,lineHeight:1.6 }}>Privacy-first · No message content ever accessed</p>
        <div className="divider" style={{ margin:"14px 0" }}/>
        <p style={{ fontSize:13,color:"var(--text2)",textAlign:"center" }}>
          Already have an account? <Link to="/signin" style={{ color:"#818CF8",fontWeight:600,textDecoration:"none" }}>Sign In →</Link>
        </p>
      </div>
    </div>
  );
}

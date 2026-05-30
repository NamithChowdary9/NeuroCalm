import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEnergy } from "../context/EnergyContext";
import { IconZapLogo, IconMail, IconLock, IconUser } from "../components/NcIcons";

export default function SignUp() {
  const { setUser } = useEnergy();
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ name:"", email:"", password:"", confirm:"" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const strength = form.password.length===0?0:form.password.length<6?1:form.password.length<10?2:3;
  const sColor   = ["transparent","#F43F5E","#F59E0B","#10B981"][strength];
  const sLabel   = ["","Weak","Moderate","Strong"][strength];

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

  const FIELDS = [
    { name:"name",  label:"Full name", type:"text",  placeholder:"Your name",       IconComp:IconUser, auto:"name"  },
    { name:"email", label:"Email",     type:"email", placeholder:"you@company.com", IconComp:IconMail, auto:"email" },
  ];

  return (
    <div className="mesh-bg" style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24 }}>
      <Link to="/" style={{ textDecoration:"none",display:"flex",alignItems:"center",gap:9,marginBottom:32 }}>
        <IconZapLogo size={32}/>
        <span style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:18,color:"var(--text)" }}>Neuro<span style={{ color:"#818CF8" }}>Calm</span></span>
      </Link>

      <div className="auth-card anim-fade-up">
        <h1 style={{ fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:24,color:"var(--text)",marginBottom:6,textAlign:"center" }}>Create your account</h1>
        <p style={{ fontSize:13.5,color:"var(--text2)",textAlign:"center",marginBottom:28 }}>Start your AI wellness journey — free forever.</p>

        <form onSubmit={submit} style={{ display:"flex",flexDirection:"column",gap:13 }}>
          {FIELDS.map(f => (
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

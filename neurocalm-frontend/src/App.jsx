import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { EnergyProvider, useEnergy } from "./context/EnergyContext";
import Sidebar from "./components/Sidebar";
import Header  from "./components/Header";
import Onboarding from "./components/Onboarding";
import Landing  from "./pages/Landing";
import SignIn   from "./pages/SignIn";
import SignUp   from "./pages/SignUp";
import Dashboard  from "./pages/Dashboard";
import Analytics  from "./pages/Analytics";
import AIInsights from "./pages/AIInsights";
import MoodTrends from "./pages/MoodTrends";
import BurnoutForecast from "./pages/BurnoutForecast";
import Settings from "./pages/Settings";
import { auth, getRedirectResult } from "./firebase";
import "./index.css";

function Shell() {
  const { user } = useEnergy();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("nc_onboarded"));
  if (!user) return <Navigate to="/signin" replace/>;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)" }}>
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)}/>}
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)}/>
      <div style={{ flex:1, marginLeft:sidebarOpen?240:0, transition:"margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", display:"flex", flexDirection:"column", minHeight:"100vh" }}>
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(o => !o)}/>
        <main style={{ flex:1 }}>
          <Routes>
            <Route path="/dashboard"   element={<Dashboard/>}/>
            <Route path="/analytics"   element={<Analytics/>}/>
            <Route path="/ai-insights" element={<AIInsights/>}/>
            <Route path="/mood"        element={<MoodTrends/>}/>
            <Route path="/burnout"     element={<BurnoutForecast/>}/>
            <Route path="/settings"    element={<Settings/>}/>
            <Route path="*"            element={<Navigate to="/dashboard" replace/>}/>
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user } = useEnergy();
  return (
    <Routes>
      <Route path="/"       element={<Landing/>}/>
      <Route path="/signin" element={user ? <Navigate to="/dashboard" replace/> : <SignIn/>}/>
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace/> : <SignUp/>}/>
      <Route path="/*"      element={<Shell/>}/>
    </Routes>
  );
}

function RedirectHandler({ onDone }) {
  const { setUser } = useEnergy();
  const navigate = useNavigate();

  useEffect(() => {
    getRedirectResult(auth)
      .then(result => {
        if (result?.user) {
          setUser({
            name:  result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
            uid:   result.user.uid,
          });
          navigate("/dashboard", { replace: true });
        }
      })
      .catch(e => console.error("Redirect result error:", e))
      .finally(() => onDone());
  }, []);

  return null;
}

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);

  return (
    <EnergyProvider>
      <BrowserRouter>
        <RedirectHandler onDone={() => setAuthChecked(true)}/>
        {/* Show nothing until redirect check is done to avoid flash */}
        {authChecked
          ? <AppRoutes/>
          : (
            <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", border:"3px solid rgba(99,102,241,0.3)", borderTopColor:"#6366F1", animation:"spin 0.8s linear infinite" }}/>
            </div>
          )
        }
      </BrowserRouter>
    </EnergyProvider>
  );
}

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

const Ctx = createContext(null);

// ── Storage helpers ───────────────────────────────────────────────
const get  = (k, fb) => { try { const r=localStorage.getItem(k); return r?JSON.parse(r):fb; } catch { return fb; } };
const set  = (k, v)  => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} };
const del  = (k)     => { try { localStorage.removeItem(k); } catch {} };

const KEYS = { metrics:"nc_m", user:"nc_u", hourly:"nc_h", sessions:"nc_s", aiMemory:"nc_ai", moodLog:"nc_mood" };

const DEFAULT = {
  sleepHours:7, stressLevel:4, meetings:3, notifications:30,
  workload:5, mood:6, socialInteraction:5, recoveryHours:2,
  callsReceived:8, screenTimeHours:6, appSwitches:25,
};

// ── Scoring formulas ──────────────────────────────────────────────
export const calcScore = m => Math.max(0,Math.min(100,Math.round(
  100 - 5*(m.meetings||0) - 4*(m.stressLevel||5) - 3*((m.notifications||0)/10)
  + 2*(m.recoveryHours||2) - 0.5*(m.callsReceived||0)
  - 1*(m.screenTimeHours>8?m.screenTimeHours-8:0)
  + 0.5*(m.mood||5) - 0.2*((m.appSwitches||0)/5)
)));

export const calcRisk = m => Math.max(0,Math.min(100,Math.round(
  ((m.stressLevel||5)+(m.meetings||0)+(m.notifications||0)/10
  +(m.callsReceived||0)/8+(m.screenTimeHours>6?(m.screenTimeHours-6)*0.5:0)
  +(m.workload||5)*0.4)
  / Math.max(0.1,(m.sleepHours||7)+(m.recoveryHours||2))*10
)));

export const calcStability = m => Math.max(0,Math.min(100,Math.round(
  100 - Math.abs(m.mood-5)*8 - (m.stressLevel||5)*4
  + (m.sleepHours||7)*3 + (m.recoveryHours||2)*5
)));

export const calcSocialPressure = m => Math.max(0,Math.min(100,Math.round(
  (m.meetings||0)*8 + (m.socialInteraction||5)*7
  + (m.notifications||0)*0.3 + (m.callsReceived||0)*4
)));

export const getState = score => {
  if(score>=80) return {label:"Thriving",    color:"#10B981",bg:"rgba(16,185,129,0.1)", border:"rgba(16,185,129,0.25)"};
  if(score>=60) return {label:"Balanced",    color:"#06B6D4",bg:"rgba(6,182,212,0.1)",  border:"rgba(6,182,212,0.25)" };
  if(score>=40) return {label:"Strained",    color:"#F59E0B",bg:"rgba(245,158,11,0.1)", border:"rgba(245,158,11,0.25)"};
  if(score>=20) return {label:"Overloaded",  color:"#F97316",bg:"rgba(249,115,22,0.1)", border:"rgba(249,115,22,0.25)"};
  return              {label:"Critical",    color:"#F43F5E",bg:"rgba(244,63,94,0.1)",  border:"rgba(244,63,94,0.25)" };
};

// ── Agentic AI Brain ──────────────────────────────────────────────
function generateAgentInsights(metrics, hourly, aiMemory) {
  const insights = [];
  const h = Array.isArray(hourly) ? hourly : [];
  const score  = calcScore(metrics);
  const risk   = calcRisk(metrics);
  const recent = h.slice(0,24);

  // Trend analysis
  if(recent.length>=3){
    const scores = recent.map(x=>x.score);
    const avg    = scores.reduce((a,b)=>a+b,0)/scores.length;
    const trend  = scores[0]-scores[scores.length-1];
    if(trend<-15) insights.push({icon:"📉",title:"Declining Energy Pattern",text:`Your energy score has dropped ${Math.abs(Math.round(trend))} points over the last ${recent.length} tracked hours. This sustained decline suggests accumulated fatigue rather than temporary stress.`,priority:"high",tag:"Trend"});
    else if(trend>15) insights.push({icon:"📈",title:"Recovery Momentum Detected",text:`Energy levels have improved by ${Math.round(trend)} points recently. Your recovery behaviors are producing measurable results — maintain this pattern.`,priority:"positive",tag:"Recovery"});

    const risks = recent.map(x=>x.risk);
    const avgRisk = risks.reduce((a,b)=>a+b,0)/risks.length;
    if(avgRisk>65) insights.push({icon:"🔥",title:"Sustained Burnout Pressure",text:`Average burnout risk of ${Math.round(avgRisk)}% over recent hours is clinically significant. Without intervention, cognitive performance typically degrades within 48 hours.`,priority:"critical",tag:"Burnout"});
  }

  // Pattern-based insights
  if(metrics.meetings>4 && metrics.stressLevel>6) insights.push({icon:"🧠",title:"Meeting-Stress Correlation Active",text:`High meeting load (${metrics.meetings}) combined with elevated stress (${metrics.stressLevel}/10) creates compounding cognitive drain. Your prefrontal cortex is working in overdrive.`,priority:"high",tag:"Cognitive"});
  if(metrics.notifications>60) insights.push({icon:"⚡",title:"Attention Fragmentation Warning",text:`${metrics.notifications} notifications represent ${Math.round(metrics.notifications/8)} interruptions per hour. Each context switch costs 23 minutes of focused productivity. Consider batching notifications.`,priority:"high",tag:"Focus"});
  if(metrics.sleepHours<6) insights.push({icon:"🌙",title:"Sleep Debt Compounding",text:`${metrics.sleepHours}h of sleep is below the 7-9h threshold. Sleep debt accumulates — after 3 nights of 6h sleep, cognitive impairment equals 24h of total deprivation.`,priority:"critical",tag:"Sleep"});
  if(metrics.mood<4) insights.push({icon:"💙",title:"Emotional Exhaustion Indicators",text:`Low mood score (${metrics.mood}/10) combined with current stress levels suggests emotional exhaustion. This is your nervous system signaling it needs psychological recovery time.`,priority:"medium",tag:"Emotional"});
  if(metrics.recoveryHours<1.5) insights.push({icon:"🌿",title:"Recovery Deficit Detected",text:`Under 1.5 hours of recovery time creates a stress-without-repair cycle. Without deliberate recovery windows, your baseline stress threshold permanently elevates over time.`,priority:"high",tag:"Recovery"});
  if(metrics.screenTimeHours>9) insights.push({icon:"👁️",title:"Digital Fatigue Accumulating",text:`${metrics.screenTimeHours}h of screen exposure triggers blue-light suppression of melatonin and sustained dopamine drain from passive scrolling. Evening wind-down is critical tonight.`,priority:"medium",tag:"Digital"});
  if(metrics.socialInteraction>7 && metrics.recoveryHours<2) insights.push({icon:"🌿",title:"Social Battery Depleted",text:`Prolonged social engagement (${metrics.socialInteraction}/10) without adequate recovery suggests introversion recovery needs are unmet. Schedule 30 minutes of solitude.`,priority:"medium",tag:"Social"});

  // Memory-based patterns (from aiMemory)
  if(aiMemory?.streaks?.highStress>=3) insights.push({icon:"⚠️",title:"Chronic Stress Pattern Identified",text:`This is your ${aiMemory.streaks.highStress}rd consecutive day with elevated stress. Chronic stress patterns alter cortisol baseline within 2 weeks. This requires structural change, not just coping.`,priority:"critical",tag:"Pattern"});
  if(aiMemory?.streaks?.lowSleep>=2) insights.push({icon:"🌙",title:"Sleep Pattern Disruption",text:`Sleep below optimal threshold for ${aiMemory.streaks.lowSleep} consecutive days. Your circadian rhythm may be shifting — consistent sleep timing matters as much as duration.`,priority:"high",tag:"Sleep"});

  // Positive reinforcement
  if(score>75 && risk<30) insights.push({icon:"✨",title:"Optimal Cognitive State",text:`Current metrics indicate peak performance conditions — high energy, low burnout risk, and stable mood. This is the ideal time for deep creative or analytical work.`,priority:"positive",tag:"Optimal"});

  // Default if nothing triggered
  if(insights.length===0) insights.push({icon:"🧘",title:"Baseline Stability Maintained",text:`Current metrics are within normal range. Consistent monitoring helps detect early warning signs before they become significant stressors. Keep logging your daily state.`,priority:"info",tag:"Status"});

  return insights.slice(0,5);
}

// ── Provider ──────────────────────────────────────────────────────
export function EnergyProvider({ children }) {
  const [metrics,   setMetrics]   = useState(()=>({...DEFAULT,...get(KEYS.metrics,{})}));
  const [user,      setUserState] = useState(()=>get(KEYS.user,null));
  const [hourly,    setHourly]    = useState(()=>get(KEYS.hourly,[]));
  const [moodLog,   setMoodLog]   = useState(()=>get(KEYS.moodLog,[]));
  const [aiMemory,  setAiMemory]  = useState(()=>get(KEYS.aiMemory,{streaks:{},patterns:[],lastAnalysis:null}));
  const [sessionStart] = useState(Date.now());
  const lastHourRef = useRef(null);

  // Persist
  useEffect(()=>set(KEYS.metrics,metrics),[metrics]);
  useEffect(()=>{ if(user) set(KEYS.user,user); else del(KEYS.user); },[user]);

  // ── Hourly snapshot ───────────────────────────────────────────
  useEffect(()=>{
    const snap = ()=>{
      const now   = new Date();
      const hour  = now.getHours();
      const score = calcScore(metrics);
      const risk  = calcRisk(metrics);
      const entry = {
        ts: Date.now(), hour, date: now.toLocaleDateString("en-US",{month:"short",day:"numeric"}),
        dayOfWeek: now.toLocaleDateString("en-US",{weekday:"short"}),
        label: `${hour}:00`,
        score, risk,
        stability:  calcStability(metrics),
        social:     calcSocialPressure(metrics),
        state:      getState(score).label,
        stress:     metrics.stressLevel,
        mood:       metrics.mood,
        sleep:      metrics.sleepHours,
        meetings:   metrics.meetings,
        notifications: metrics.notifications,
        recovery:   metrics.recoveryHours,
      };
      setHourly(h=>{
        const key = `${entry.date}-${hour}`;
        const filtered = h.filter(x=>`${x.date}-${x.hour}`!==key);
        const next = [entry,...filtered].slice(0,168);
        set(KEYS.hourly,next);
        return next;
      });
      // Update AI memory
      setAiMemory(mem=>{
        const streaks = {...(mem.streaks||{})};
        if(metrics.stressLevel>7) streaks.highStress = (streaks.highStress||0)+1;
        else streaks.highStress = 0;
        if(metrics.sleepHours<6) streaks.lowSleep = (streaks.lowSleep||0)+1;
        else streaks.lowSleep = 0;
        const next = {...mem,streaks,lastAnalysis:Date.now()};
        set(KEYS.aiMemory,next);
        return next;
      });
      lastHourRef.current = hour;
    };

    snap(); // immediate on mount
    const now    = new Date();
    const msLeft = (60-now.getMinutes())*60000 - now.getSeconds()*1000;
    const tid    = setTimeout(()=>{ snap(); const iv=setInterval(snap,3600000); return ()=>clearInterval(iv); }, msLeft);
    return ()=>clearTimeout(tid);
  },[metrics]);

  // ── Auto recovery drift ───────────────────────────────────────
  useEffect(()=>{
    const t = setInterval(()=>setMetrics(m=>({...m,recoveryHours:Math.min(8,+(m.recoveryHours+0.015).toFixed(3))})),60000);
    return ()=>clearInterval(t);
  },[]);

  // Derived
  const energyScore    = calcScore(metrics);
  const burnoutRisk    = calcRisk(metrics);
  const stability      = calcStability(metrics);
  const socialPressure = calcSocialPressure(metrics);
  const energyState    = getState(energyScore);
  const aiInsights     = generateAgentInsights(metrics, hourly, aiMemory);

  const updateMetrics = useCallback(u=>setMetrics(m=>({...m,...u})),[]);
  const resetMetrics  = useCallback(()=>setMetrics(DEFAULT),[]);
  const setUser       = useCallback(u=>setUserState(u),[]);

  const logMood = useCallback((moodEntry)=>{
    setMoodLog(log=>{
      const next=[{...moodEntry,ts:Date.now()},...log].slice(0,500);
      set(KEYS.moodLog,next);
      return next;
    });
  },[]);

  const [deviceSignals,setDeviceSignals] = useState({tabSwitches:0,sessionMinutes:0,focusLostCount:0,notifPermission:"default",networkSlow:false,batteryLevel:100,batteryCharging:true});
  const updateDeviceSignals = useCallback(u=>{
    setDeviceSignals(s=>({...s,...u}));
    if(u.tabSwitches!==undefined)    setMetrics(m=>({...m,appSwitches:u.tabSwitches}));
    if(u.sessionMinutes!==undefined) setMetrics(m=>({...m,screenTimeHours:Math.round(u.sessionMinutes/60*10)/10}));
  },[]);

  return (
    <Ctx.Provider value={{
      metrics,updateMetrics,resetMetrics,
      energyScore,burnoutRisk,stability,socialPressure,
      energyState,aiInsights,aiMemory,
      hourly,moodLog,logMood,
      user,setUser,
      deviceSignals,updateDeviceSignals,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useEnergy = ()=>{ const c=useContext(Ctx); if(!c) throw new Error("useEnergy outside provider"); return c; };

/**
 * NcIcons — Filled-outline SVG icons for NeuroCalm
 * Style: thick colored stroke + soft pastel fill (works on dark backgrounds)
 * Each icon is self-contained with its own color palette.
 */

import React from "react";

const base = (size, children, viewBox = "0 0 48 48") => (
  <svg width={size} height={size} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
    {children}
  </svg>
);

/* ── Brain / AI ── indigo */
export function IconBrain({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#6366F1" fillOpacity="0.18"/>
      <path d="M24 10c-3.5 0-6.5 2.2-7.8 5.3A7 7 0 0 0 10 22a7 7 0 0 0 4 6.3V36a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7.7A7 7 0 0 0 38 22a7 7 0 0 0-6.2-6.7C30.5 12.2 27.5 10 24 10z"
        fill="#818CF8" fillOpacity="0.35" stroke="#818CF8" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M20 22c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#818CF8" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="24" y1="18" x2="24" y2="36" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="18" y1="26" x2="30" y2="26" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
    </>
  );
}

/* ── Zap / Energy ── amber */
export function IconZap({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#F59E0B" fillOpacity="0.18"/>
      <path d="M27 10L14 26h10l-3 12 17-18H28l-1-10z"
        fill="#FCD34D" fillOpacity="0.4" stroke="#F59E0B" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"/>
    </>
  );
}

/* ── Heart / Mood ── rose */
export function IconHeart({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#F43F5E" fillOpacity="0.15"/>
      <path d="M24 36s-14-8.5-14-17a8 8 0 0 1 14-5.3A8 8 0 0 1 38 19c0 8.5-14 17-14 17z"
        fill="#FB7185" fillOpacity="0.35" stroke="#F43F5E" strokeWidth="2.2" strokeLinejoin="round"/>
    </>
  );
}

/* ── TrendingUp / Burnout ── amber-orange */
export function IconTrendingUp({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#F59E0B" fillOpacity="0.15"/>
      <polyline points="8,32 18,20 26,26 38,14"
        fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="30,14 38,14 38,22"
        fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 38h32" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"/>
    </>
  );
}

/* ── Activity / Recovery ── cyan */
export function IconActivity({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#06B6D4" fillOpacity="0.15"/>
      <polyline points="8,24 16,24 20,12 24,36 28,20 32,28 36,24 40,24"
        fill="none" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

/* ── Users / Social ── violet */
export function IconUsers({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#8B5CF6" fillOpacity="0.15"/>
      <circle cx="18" cy="18" r="6" fill="#A78BFA" fillOpacity="0.3" stroke="#8B5CF6" strokeWidth="2.2"/>
      <circle cx="30" cy="18" r="6" fill="#A78BFA" fillOpacity="0.3" stroke="#8B5CF6" strokeWidth="2.2"/>
      <path d="M6 38c0-6.6 5.4-12 12-12" stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M30 26c6.6 0 12 5.4 12 12" stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M18 26c3.3 0 6 2.7 6 6s-2.7 6-6 6" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5"/>
    </>
  );
}

/* ── Shield / Privacy ── rose */
export function IconShield({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#F43F5E" fillOpacity="0.12"/>
      <path d="M24 8l14 5v10c0 9-6 15-14 17C16 38 10 32 10 23V13l14-5z"
        fill="#FB7185" fillOpacity="0.25" stroke="#F43F5E" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M18 24l4 4 8-8" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

/* ── Moon / Sleep ── cyan */
export function IconMoon({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#06B6D4" fillOpacity="0.15"/>
      <path d="M30 10a14 14 0 1 1-14 20A10 10 0 0 0 30 10z"
        fill="#67E8F9" fillOpacity="0.3" stroke="#06B6D4" strokeWidth="2.2" strokeLinejoin="round"/>
    </>
  );
}

/* ── Flame / Stress ── orange */
export function IconFlame({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#F97316" fillOpacity="0.15"/>
      <path d="M24 8c0 0 8 8 8 16a8 8 0 0 1-16 0c0-4 2-7 4-9 0 4 4 6 4 6s4-4 0-13z"
        fill="#FED7AA" fillOpacity="0.4" stroke="#F97316" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M24 30a4 4 0 0 1-4-4c0-2 1-3.5 2-4.5 0 2 2 3 2 3s2-2 0-6c4 4 4 8 0 11.5z"
        fill="#F97316" fillOpacity="0.5" stroke="none"/>
    </>
  );
}

/* ── MessageCircle / Social ── violet */
export function IconMessageCircle({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#8B5CF6" fillOpacity="0.15"/>
      <path d="M38 22c0 7.7-6.3 14-14 14a13.9 13.9 0 0 1-7-1.9L10 38l3.9-7A13.9 13.9 0 0 1 12 24c0-7.7 6.3-14 14-14s14 6.3 14 14z"
        fill="#A78BFA" fillOpacity="0.25" stroke="#8B5CF6" strokeWidth="2.2" strokeLinejoin="round"/>
      <circle cx="19" cy="24" r="1.5" fill="#8B5CF6"/>
      <circle cx="24" cy="24" r="1.5" fill="#8B5CF6"/>
      <circle cx="29" cy="24" r="1.5" fill="#8B5CF6"/>
    </>
  );
}

/* ── Monitor / Screen ── rose */
export function IconMonitor({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#F43F5E" fillOpacity="0.12"/>
      <rect x="8" y="10" width="32" height="22" rx="3"
        fill="#FCA5A5" fillOpacity="0.2" stroke="#F43F5E" strokeWidth="2.2"/>
      <line x1="16" y1="38" x2="32" y2="38" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="32" x2="24" y2="38" stroke="#F43F5E" strokeWidth="2.2" strokeLinecap="round"/>
    </>
  );
}

/* ── Save ── emerald */
export function IconSave({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#10B981" fillOpacity="0.15"/>
      <path d="M34 38H14a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2h16l8 8v18a2 2 0 0 1-2 2z"
        fill="#6EE7B7" fillOpacity="0.25" stroke="#10B981" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M18 38V26h12v12" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 10v8h10" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

/* ── RotateCcw / Reset ── text2 */
export function IconReset({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#94A3B8" fillOpacity="0.1"/>
      <path d="M14 24a10 10 0 1 0 2-6" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round"/>
      <polyline points="10,14 14,24 24,20" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

/* ── Bell / Notifications ── indigo */
export function IconBell({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#6366F1" fillOpacity="0.15"/>
      <path d="M24 8a10 10 0 0 0-10 10v6l-3 4h26l-3-4v-6A10 10 0 0 0 24 8z"
        fill="#818CF8" fillOpacity="0.25" stroke="#818CF8" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M21 36a3 3 0 0 0 6 0" stroke="#818CF8" strokeWidth="2.2" strokeLinecap="round"/>
    </>
  );
}

/* ── CPU / Engine ── indigo */
export function IconCpu({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#6366F1" fillOpacity="0.15"/>
      <rect x="14" y="14" width="20" height="20" rx="3"
        fill="#818CF8" fillOpacity="0.25" stroke="#818CF8" strokeWidth="2.2"/>
      <rect x="19" y="19" width="10" height="10" rx="1.5"
        fill="#818CF8" fillOpacity="0.4" stroke="#818CF8" strokeWidth="1.5"/>
      <line x1="19" y1="10" x2="19" y2="14" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="10" x2="24" y2="14" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="29" y1="10" x2="29" y2="14" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="19" y1="34" x2="19" y2="38" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="24" y1="34" x2="24" y2="38" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="29" y1="34" x2="29" y2="38" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="10" y1="19" x2="14" y2="19" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="10" y1="24" x2="14" y2="24" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="10" y1="29" x2="14" y2="29" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="34" y1="19" x2="38" y2="19" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="34" y1="24" x2="38" y2="24" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="34" y1="29" x2="38" y2="29" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
    </>
  );
}

/* ── LayoutDashboard ── indigo */
export function IconDashboard({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#6366F1" fillOpacity="0.15"/>
      <rect x="10" y="10" width="12" height="14" rx="3" fill="#818CF8" fillOpacity="0.3" stroke="#818CF8" strokeWidth="2"/>
      <rect x="26" y="10" width="12" height="8"  rx="3" fill="#818CF8" fillOpacity="0.3" stroke="#818CF8" strokeWidth="2"/>
      <rect x="10" y="28" width="12" height="10" rx="3" fill="#818CF8" fillOpacity="0.3" stroke="#818CF8" strokeWidth="2"/>
      <rect x="26" y="22" width="12" height="16" rx="3" fill="#818CF8" fillOpacity="0.3" stroke="#818CF8" strokeWidth="2"/>
    </>
  );
}

/* ── BarChart2 / Analytics ── cyan */
export function IconBarChart({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#06B6D4" fillOpacity="0.15"/>
      <rect x="10" y="26" width="7" height="12" rx="2" fill="#67E8F9" fillOpacity="0.35" stroke="#06B6D4" strokeWidth="2"/>
      <rect x="20" y="18" width="7" height="20" rx="2" fill="#67E8F9" fillOpacity="0.35" stroke="#06B6D4" strokeWidth="2"/>
      <rect x="30" y="10" width="7" height="28" rx="2" fill="#67E8F9" fillOpacity="0.35" stroke="#06B6D4" strokeWidth="2"/>
    </>
  );
}

/* ── Settings gear ── emerald */
export function IconSettings({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#10B981" fillOpacity="0.15"/>
      <circle cx="24" cy="24" r="5" fill="#6EE7B7" fillOpacity="0.4" stroke="#10B981" strokeWidth="2.2"/>
      <path d="M24 10v4M24 34v4M10 24h4M34 24h4M14.9 14.9l2.8 2.8M30.3 30.3l2.8 2.8M14.9 33.1l2.8-2.8M30.3 17.7l2.8-2.8"
        stroke="#10B981" strokeWidth="2.2" strokeLinecap="round"/>
    </>
  );
}

/* ── ArrowRight ── neutral */
export function IconArrowRight({ size = 16, color = "#94A3B8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Menu / Hamburger ── neutral */
export function IconMenu({ size = 18, color = "#94A3B8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="3" y1="6"  x2="21" y2="6"  stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/* ── ChevronLeft ── neutral */
export function IconChevronLeft({ size = 16, color = "#94A3B8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── LogOut ── neutral */
export function IconLogOut({ size = 14, color = "#94A3B8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="16,17 21,12 16,7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/* ── X / Close ── neutral */
export function IconX({ size = 16, color = "#94A3B8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Mail ── indigo */
export function IconMail({ size = 14, color = "#818CF8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.8"/>
      <polyline points="2,4 12,13 22,4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ── Lock ── indigo */
export function IconLock({ size = 14, color = "#818CF8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.8"/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.5" fill={color}/>
    </svg>
  );
}

/* ── User ── indigo */
export function IconUser({ size = 14, color = "#818CF8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.8"/>
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

/* ── CheckCircle / Done ── emerald */
export function IconCheckCircle({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#10B981" fillOpacity="0.15"/>
      <circle cx="24" cy="24" r="13" fill="#6EE7B7" fillOpacity="0.2" stroke="#10B981" strokeWidth="2.2"/>
      <path d="M16 24l6 6 10-12" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  );
}

/* ── AlertTriangle ── amber */
export function IconAlertTriangle({ size = 32 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="#F59E0B" fillOpacity="0.15"/>
      <path d="M24 10L8 38h32L24 10z" fill="#FCD34D" fillOpacity="0.25" stroke="#F59E0B" strokeWidth="2.2" strokeLinejoin="round"/>
      <line x1="24" y1="22" x2="24" y2="30" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="24" cy="34" r="1.5" fill="#F59E0B"/>
    </>
  );
}

/* ── Zap logo (small, for nav/auth) ── */
export function IconZapLogo({ size = 30 }) {
  return base(size,
    <>
      <rect width="48" height="48" rx="12" fill="url(#zl)"/>
      <defs>
        <linearGradient id="zl" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#6366F1"/>
          <stop offset="100%" stopColor="#8B5CF6"/>
        </linearGradient>
      </defs>
      <path d="M27 10L14 26h10l-3 12 17-18H28l-1-10z"
        fill="#fff" fillOpacity="0.9" stroke="none"/>
    </>
  );
}

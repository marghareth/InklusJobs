"use client";

import { useState, useRef, useEffect } from "react";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  *, *::before, *::after { box-sizing: border-box; }

  @keyframes slideIn   { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes progFill  { from{width:0} to{width:var(--w)} }
  @keyframes checkPop  { from{opacity:0;transform:scale(0) rotate(-20deg)} to{opacity:1;transform:scale(1) rotate(0)} }
  @keyframes fallDown  { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(540deg);opacity:0} }
  @keyframes popIn     { 0%{transform:scale(0) rotate(-15deg)} 65%{transform:scale(1.1) rotate(3deg)} 100%{transform:scale(1) rotate(0)} }
  @keyframes spin      { to{transform:rotate(360deg)} }

  .ob-card { transition: border-color .15s, background .15s, transform .15s, box-shadow .15s; }
  .ob-card:hover { transform: translateY(-2px); box-shadow: 0 4px 18px rgba(15,92,110,0.18) !important; }
  .ob-card:active { transform: scale(0.98); }
  .ob-card:focus-visible { outline: 3px solid #0F5C6E; outline-offset: 3px; }

  .ob-chip { transition: border-color .13s, background .13s, color .13s, transform .13s; }
  .ob-chip:hover { transform: translateY(-1px); }
  .ob-chip:focus-visible { outline: 3px solid #0F5C6E; outline-offset: 2px; }

  .ob-inp:focus { border-color: #0F5C6E !important; box-shadow: 0 0 0 3px rgba(15,92,110,0.15) !important; outline: none; }

  .ob-btn-pri { transition: transform .14s, box-shadow .14s, background .14s; }
  .ob-btn-pri:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(15,92,110,0.35) !important; }
  .ob-btn-pri:active:not(:disabled) { transform: scale(0.97); }
  .ob-btn-pri:focus-visible { outline: 3px solid #0F5C6E; outline-offset: 3px; }

  .ob-btn-ghost { transition: background .13s, transform .13s; }
  .ob-btn-ghost:hover { background: rgba(15,92,110,0.08) !important; transform: translateY(-1px); }
  .ob-btn-ghost:focus-visible { outline: 3px solid #0F5C6E; outline-offset: 2px; }

  .ob-toggle-thumb { transition: left .22s cubic-bezier(.4,0,.2,1); }
  .ob-toggle-track { transition: background .22s; }
  .ob-toggle-track:focus-visible { outline: 3px solid #0F5C6E; outline-offset: 2px; }

  .drag-item { cursor: grab; transition: transform .14s, box-shadow .14s, border-color .14s; }
  .drag-item:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(15,92,110,0.15) !important; }
  .drag-item.is-dragging { cursor: grabbing; opacity: .45; transform: scale(1.02); }
  .drag-over-target { border-color: #0F5C6E !important; background: rgba(15,92,110,0.05) !important; }
  .drag-item:focus-visible { outline: 3px solid #0F5C6E; outline-offset: 2px; }

  input[type=range] { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 99px; cursor: pointer; outline: none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #0F5C6E; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(15,92,110,0.4); cursor: pointer; transition: transform .15s; }
  input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.15); }
  input[type=range]:focus-visible { box-shadow: 0 0 0 3px rgba(15,92,110,0.2); }
`;

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  navy:    "#0A2A35",
  teal:    "#0F5C6E",
  tealMid: "#1A8FA5",
  tealL:   "#E6F4F6",
  tealL2:  "#C8E8ED",
  bg:      "#F2F7F8",
  white:   "#FFFFFF",
  body:    "#1E3A45",
  muted:   "#5A7A85",
  border:  "#C5DDE2",
  success: "#059669",
  ff:      "'DM Sans', Arial, sans-serif",
};

// ─── SVG Icon system (line art, no emoji) ────────────────────────────────────
const ICONS = {
  // Industry
  monitor:    [["M9 17H5a2 2 0 0 0-2 2h14a2 2 0 0 0-2-2h-4M3 7h18a1 1 0 0 1 1 1v8H2V8a1 1 0 0 1 1-1Z"]],
  heart:      [["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"]],
  barChart:   [["M12 20V10","M18 20V4","M6 20v-4"]],
  shoppingCart:[["M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5h11.8M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"]],
  factory:    [["M3 21h18M2 9h20M12 3l8 6H4l8-6zM9 21V9M15 21V9"]],
  graduationCap:[["M22 10v6M2 10l10-5 10 5-10 5z","M6 12v5c3 3 9 3 12 0v-5"]],
  film:       [["M15 10l4.55-2.5A1 1 0 0 1 21 8.5v7a1 1 0 0 1-1.45.9L15 14","M1 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8z"]],
  landmark:   [["M3 22h18","M6 18V11","M10 18V11","M14 18V11","M18 18V11","M2 11l10-7 10 7"]],
  gift:       [["M20 12v10H4V12","M22 7H2v5h20V7z","M12 22V7","M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z","M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"]],
  tool:       [["M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"]],
  zap:        [["M13 2 3 14h9l-1 8 10-12h-9l1-8z"]],
  truck:      [["M1 3h15v13H1z","M16 8h4l3 3v5h-7V8z","M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z","M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"]],
  users:      [["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2","M23 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75","M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]],
  scale:      [["M12 3v18","M3 8l9-5 9 5","M3 8v10l9 5 9-5V8"]],
  home:       [["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z","M9 22V12h6v10"]],
  plane:      [["M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"]],
  utensils:   [["M3 2v7c0 1.1.9 2 2 2 1.1 0 2-.9 2-2V2","M7 2v20","M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"]],
  box:        [["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z","M3.27 6.96 12 12.01l8.73-5.05","M12 22.08V12"]],
  // Work setup
  homeOffice: [["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z","M9 22V12h6v10"]],
  hybrid:     [["M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"]],
  building:   [["M3 21h18","M5 21V7l8-4v18","M19 21V11l-6-4","M9 9v.01","M9 12v.01","M9 15v.01","M9 18v.01"]],
  // Sort/rank
  checkCircle:[["M22 11.08V12a10 10 0 1 1-5.93-9.14","M22 4 12 14.01l-3-3"]],
  star:       [["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"]],
  trendingUp: [["M23 6l-9.5 9.5-5-5L1 18","M17 6h6v6"]],
  briefcase:  [["M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16","M2 9h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z"]],
  // Dashboard
  sparkles:   [["M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"]],
  search:     [["M21 21l-4.35-4.35M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z"]],
  barChartUp: [["M18 20V10","M12 20V4","M6 20v-6"]],
  // Misc
  check:      [["M20 6 9 17l-5-5"]],
  gripVertical:[["M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01"]],
  shield:     [["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"]],
  eye:        [["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0"]],
  bell:       [["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 0 1-3.46 0"]],
  robot:      [["M12 2a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3V4a2 2 0 0 1 2-2z","M9 11h.01M15 11h.01","M9 15h6"]],
  upload:     [["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"]],
  grid:       [["M3 3h7v7H3z","M14 3h7v7h-7z","M14 14h7v7h-7z","M3 14h7v7H3z"]],
  chevRight:  [["M9 18l6-6-6-6"]],
};

const Icon = ({ name, size = 22, color = C.teal, strokeWidth = 1.7 }) => {
  const paths = ICONS[name] || [["M12 12m-4 0a4 4 0 1 0 8 0 4 4 0 0 0-8 0"]];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((group, gi) => group.map((d, di) => <path key={`${gi}-${di}`} d={d} />))}
    </svg>
  );
};

// ─── Primitives ───────────────────────────────────────────────────────────────
const Divider = () => <div style={{ height: 1, background: C.border, margin: "28px 0" }} />;

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} style={{ display: "block", fontFamily: C.ff, fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 12 }}>{children}</label>
);

const AccentText = ({ children }) => (
  <span style={{ color: C.teal }}>{children}</span>
);

const OBInput = ({ id, placeholder, value, onChange, multiline, rows = 4, autoFocus }) => {
  const s = { width: "100%", padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: C.ff, background: C.white, color: C.navy, resize: "none", transition: "border-color .2s, box-shadow .2s" };
  return multiline
    ? <textarea id={id} rows={rows} placeholder={placeholder} value={value} onChange={onChange} autoFocus={autoFocus} style={s} className="ob-inp" />
    : <input id={id} type="text" placeholder={placeholder} value={value} onChange={onChange} autoFocus={autoFocus} style={s} className="ob-inp" />;
};

const Chip = ({ label, selected, onToggle, delay = 0 }) => (
  <button onClick={onToggle} aria-pressed={selected} className="ob-chip"
    style={{ padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: selected ? 700 : 500, border: `1.5px solid ${selected ? C.teal : C.border}`, background: selected ? C.tealL : C.white, color: selected ? C.teal : C.muted, cursor: "pointer", fontFamily: C.ff, animation: `fadeUp .35s ease ${delay}ms both`, display: "inline-flex", alignItems: "center", gap: 6 }}>
    {selected && (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
    )}
    {label}
  </button>
);

const Toggle = ({ id, checked, onChange, label, desc, iconName }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", border:`1.5px solid ${checked ? C.teal : C.border}`, borderRadius:12, background:checked ? C.tealL : C.white, transition:"all .18s", gap:12 }}>
    <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, minWidth:0 }}>
      {iconName && (
        <div style={{ width:40, height:40, borderRadius:10, background:checked ? C.teal : C.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background .18s" }}>
          <Icon name={iconName} size={18} color={checked ? C.white : C.teal} />
        </div>
      )}
      <div style={{ minWidth:0 }}>
        <div style={{ fontFamily:C.ff, fontSize:14, fontWeight:700, color:C.navy, lineHeight:1.3 }}>{label}</div>
        {desc && <div style={{ fontFamily:C.ff, fontSize:12, color:C.muted, marginTop:3, lineHeight:1.45 }}>{desc}</div>}
      </div>
    </div>
    <button role="switch" aria-checked={checked} aria-label={label} id={`toggle-${id}`} onClick={() => onChange(!checked)} className="ob-toggle-track"
      style={{ width:44, height:24, borderRadius:999, border:"none", cursor:"pointer", background:checked ? C.teal : C.border, position:"relative", flexShrink:0, padding:0, display:"block" }}>
      <span className="ob-toggle-thumb" style={{ position:"absolute", top:2, left:checked ? 22 : 2, width:20, height:20, borderRadius:"50%", background:C.white, boxShadow:"0 1px 4px rgba(0,0,0,0.18)", display:"block" }} />
    </button>
  </div>
);

const IconCard = ({ iconName, label, selected, onSelect, delay = 0 }) => (
  <button onClick={onSelect} aria-pressed={selected} className="ob-card"
    style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "18px 10px", borderRadius: 14, border: `1.5px solid ${selected ? C.teal : C.border}`, background: selected ? C.tealL : C.white, cursor: "pointer", position: "relative", animation: `fadeUp .4s ease ${delay}ms both`, boxShadow: selected ? `0 2px 12px rgba(15,92,110,0.15)` : "0 1px 4px rgba(10,42,53,0.05)" }}>
    {selected && (
      <div style={{ position: "absolute", top: 6, right: 6, width: 18, height: 18, borderRadius: "50%", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", animation: "checkPop .25s cubic-bezier(.34,1.56,.64,1) both" }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
    )}
    <div style={{ width: 42, height: 42, borderRadius: 12, background: selected ? C.teal : C.bg, display: "flex", alignItems: "center", justifyContent: "center", transition: "background .18s" }}>
      <Icon name={iconName} size={20} color={selected ? C.white : C.teal} />
    </div>
    <span style={{ fontFamily: C.ff, fontSize: 11, fontWeight: selected ? 700 : 600, color: selected ? C.teal : C.muted, textAlign: "center", lineHeight: 1.3 }}>{label}</span>
  </button>
);

// ─── Step header ──────────────────────────────────────────────────────────────
const STEPS_META = [
  { label: "Company Basics",   desc: "Tell us about your company"     },
  { label: "Hiring Needs",     desc: "What talent you're seeking"     },
  { label: "Inclusive Hiring", desc: "Build your inclusive workplace" },
  { label: "Dashboard Setup",  desc: "Customize your experience"      },
];

const StepHeader = ({ step, title, subtitle }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{ fontFamily: C.ff, fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.tealMid, marginBottom: 10 }}>
      Step {step} of {STEPS_META.length}
    </div>
    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 400, margin: "0 0 8px", lineHeight: 1.15, color: C.navy }}>{title}</h2>
    <p style={{ fontFamily: C.ff, fontSize: 15, color: C.muted, margin: 0 }}>{subtitle}</p>
  </div>
);

// ─── Progress bar ─────────────────────────────────────────────────────────────
const ProgressHeader = ({ step }) => {
  const pct = Math.round((step / STEPS_META.length) * 100);
  return (
    <div style={{ padding: "24px 40px 0", zIndex: 2 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {STEPS_META.map((s, i) => {
            const done = i + 1 < step, active = i + 1 === step;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div aria-current={active ? "step" : undefined}
                  style={{ width: active ? 36 : 28, height: active ? 36 : 28, borderRadius: "50%", background: done ? C.teal : active ? C.navy : C.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: active ? 14 : 12, fontWeight: 800, color: done || active ? C.white : C.muted, fontFamily: C.ff, transition: "all .3s cubic-bezier(.34,1.56,.64,1)", boxShadow: active ? `0 4px 14px rgba(10,42,53,0.3)` : "none" }}>
                  {done
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : i + 1}
                </div>
                {i < STEPS_META.length - 1 && <div style={{ width: 28, height: 2, background: done ? C.teal : C.border, borderRadius: 99, transition: "background .35s" }} />}
              </div>
            );
          })}
        </div>
        <span style={{ fontFamily: C.ff, fontSize: 13, fontWeight: 600, color: C.muted }}>{pct}% complete</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: C.border, overflow: "hidden" }}>
        <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
          style={{ height: "100%", width: `${pct}%`, background: C.teal, borderRadius: 99, transition: "width .6s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ step }) => (
  <div style={{ width: 272, flexShrink: 0, background: C.navy, minHeight: "100vh", padding: "36px 24px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
    <div style={{ marginBottom: 44, display: "flex", justifyContent: "center" }}>
      <div style={{ background: C.white, borderRadius: 12, padding: "10px 16px" }}>
        <img src="/images/logo.png" alt="InklusiJobs" width={130} height={38} style={{ objectFit: "contain", display: "block" }} />
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {STEPS_META.map((s, i) => {
        const done = i + 1 < step, active = i + 1 === step;
        return (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 14px", borderRadius: 12, background: active ? "rgba(15,92,110,0.35)" : "transparent", border: `1px solid ${active ? C.tealMid : "transparent"}`, transition: "all .2s" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: done ? C.tealMid : active ? C.teal : "rgba(255,255,255,0.08)", border: `2px solid ${done || active ? "transparent" : "rgba(255,255,255,0.15)"}`, transition: "all .2s" }}>
              {done
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : <span style={{ fontFamily: C.ff, fontSize: 12, fontWeight: 800, color: done || active ? C.white : "rgba(255,255,255,0.3)" }}>{i + 1}</span>}
            </div>
            <div>
              <div style={{ fontFamily: C.ff, fontSize: 13, fontWeight: 700, color: active ? C.white : done ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.3)", transition: "color .2s" }}>{s.label}</div>
              <div style={{ fontFamily: C.ff, fontSize: 11, color: active ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)", marginTop: 2 }}>{s.desc}</div>
            </div>
          </div>
        );
      })}
    </div>

    <div style={{ marginTop: "auto", padding: "14px 16px", background: "rgba(15,92,110,0.25)", borderRadius: 12, border: "1px solid rgba(26,143,165,0.3)" }}>
      <div style={{ fontFamily: C.ff, fontSize: 12, fontWeight: 700, color: C.tealMid, marginBottom: 4 }}>♿ WCAG 2.1 AA</div>
      <div style={{ fontFamily: C.ff, fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>Accessible by design. Inclusive at every step.</div>
    </div>
  </div>
);

// ─── STEP 1 ───────────────────────────────────────────────────────────────────
const INDUSTRIES = [
  { icon: "monitor",      label: "Technology" },
  { icon: "heart",        label: "Healthcare" },
  { icon: "barChart",     label: "Finance" },
  { icon: "shoppingCart", label: "Retail" },
  { icon: "factory",      label: "Manufacturing" },
  { icon: "graduationCap",label: "Education" },
  { icon: "film",         label: "Media & Creative" },
  { icon: "landmark",     label: "Government" },
  { icon: "gift",         label: "Non-profit" },
  { icon: "tool",         label: "Construction" },
  { icon: "zap",          label: "Energy & Utilities" },
  { icon: "truck",        label: "Logistics" },
  { icon: "users",        label: "Human Resources" },
  { icon: "scale",        label: "Legal" },
  { icon: "home",         label: "Real Estate" },
  { icon: "plane",        label: "Tourism & Hotels" },
  { icon: "utensils",     label: "Food & Beverage" },
  { icon: "box",          label: "Other" },
];
const SIZES = ["1–10","11–50","51–200","201–500","501–1000","1001–5000","5000+"];
const POS_TYPES = ["Full-time","Part-time","Contract","Freelance","Internship","Apprenticeship","Seasonal","Project-based","Remote-only","Hybrid","Temporary"];

const Step1 = ({ data, set }) => {
  const [showOther, setShowOther] = useState(data.industry === "Other");
  const [logoPreview, setLogoPreview] = useState(data.logoPreview || null);
  const fileRef = useRef(null);

  const togglePos = t => { const c = data.posTypes || []; set({ ...data, posTypes: c.includes(t) ? c.filter(x => x !== t) : [...c, t] }); };
  const handleLogo = e => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader(); r.onload = ev => { setLogoPreview(ev.target.result); set({ ...data, logoPreview: ev.target.result }); }; r.readAsDataURL(file);
  };

  return (
    <div style={{ animation: "slideIn .4s ease both" }}>
      <StepHeader step={1} title="Build your hiring profile" subtitle="Let's start with your company basics" />

      <Label htmlFor="company-name">Company Name</Label>
      <OBInput id="company-name" placeholder="e.g., InklusiJobs" value={data.company} onChange={e => set({ ...data, company: e.target.value })} />
      <Divider />

      <Label>What <AccentText>industry</AccentText> are you in?</Label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 10 }}>
        {INDUSTRIES.map((ind, i) => (
          <IconCard key={ind.label} iconName={ind.icon} label={ind.label} delay={i * 25}
            selected={data.industry === ind.label}
            onSelect={() => { setShowOther(ind.label === "Other"); set({ ...data, industry: ind.label, industryOther: ind.label !== "Other" ? "" : data.industryOther }); }} />
        ))}
      </div>
      {(showOther || data.industry === "Other") && (
        <OBInput autoFocus placeholder="Please specify your industry..." value={data.industryOther || ""} onChange={e => set({ ...data, industryOther: e.target.value })} />
      )}
      <Divider />

      <Label>Company <AccentText>size</AccentText></Label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {SIZES.map((s, i) => (
          <button key={s} onClick={() => set({ ...data, size: s })} className="ob-card" aria-pressed={data.size === s}
            style={{ padding: "13px 8px", borderRadius: 10, border: `1.5px solid ${data.size === s ? C.teal : C.border}`, background: data.size === s ? C.tealL : C.white, color: data.size === s ? C.teal : C.muted, fontSize: 13, fontWeight: data.size === s ? 700 : 500, cursor: "pointer", fontFamily: C.ff, animation: `fadeUp .35s ease ${i*30}ms both` }}>
            {s}
          </button>
        ))}
      </div>
      <Divider />

      <Label>Position types <span style={{ fontWeight: 400, color: C.muted, fontSize: 13 }}>(select all that apply)</span></Label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {POS_TYPES.map((t, i) => <Chip key={t} label={t} delay={i * 20} selected={(data.posTypes || []).includes(t)} onToggle={() => togglePos(t)} />)}
      </div>
      <Divider />

      <Label>Company Logo <span style={{ fontWeight: 400, color: C.muted, fontSize: 13 }}>(optional)</span></Label>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogo} />
      {logoPreview ? (
        <div style={{ border: `1.5px solid ${C.teal}`, borderRadius: 12, padding: 20, textAlign: "center", background: C.tealL }}>
          <img src={logoPreview} alt="Logo preview" style={{ maxHeight: 80, maxWidth: "100%", objectFit: "contain", borderRadius: 8, marginBottom: 10 }} />
          <div style={{ fontFamily: C.ff, fontSize: 13, color: C.teal, fontWeight: 700, marginBottom: 8 }}>✓ Logo uploaded</div>
          <button onClick={() => { setLogoPreview(null); set({ ...data, logoPreview: null }); }} style={{ background: "none", border: `1px solid ${C.teal}`, borderRadius: 8, color: C.teal, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "5px 12px", fontFamily: C.ff }}>Remove</button>
        </div>
      ) : (
        <div onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleLogo({ target: { files: e.dataTransfer.files } }); }}
          style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: "32px 24px", textAlign: "center", background: C.bg, cursor: "pointer", transition: "all .2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.background = C.tealL; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bg; }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.tealL, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
            <Icon name="upload" size={20} color={C.teal} />
          </div>
          <div style={{ fontFamily: C.ff, fontSize: 14, color: C.muted }}>
            <span style={{ color: C.teal, fontWeight: 700 }}>Click to upload</span> or drag & drop
          </div>
          <div style={{ fontFamily: C.ff, fontSize: 12, color: C.muted, marginTop: 4 }}>PNG, JPG, SVG · max 2MB</div>
        </div>
      )}
    </div>
  );
};

// ─── STEP 2 ───────────────────────────────────────────────────────────────────
const INDUSTRY_ROLES = {
  "Technology":         ["Software Developer","Frontend Engineer","Backend Engineer","DevOps Engineer","Data Analyst","Product Manager","UX Designer","QA Engineer","System Administrator","IT Support"],
  "Healthcare":         ["Nurse","Medical Transcriptionist","Healthcare Administrator","Billing Specialist","Patient Coordinator","Medical Coder","Pharmacist Assistant","Health Data Analyst","Telemedicine Support","Clinical Research Assistant"],
  "Finance":            ["Bookkeeper","Accountant","Financial Analyst","Payroll Specialist","Auditor","Tax Consultant","Investment Analyst","Compliance Officer","Credit Analyst","Financial Advisor"],
  "Retail":             ["Sales Associate","Store Manager","Inventory Specialist","Visual Merchandiser","E-commerce Coordinator","Customer Service Rep","Purchasing Officer","Retail Analyst","Logistics Coordinator","Product Photographer"],
  "Manufacturing":      ["Production Operator","Quality Control Inspector","Logistics Coordinator","Safety Officer","Inventory Analyst","Assembly Technician","Maintenance Engineer","Supply Chain Coordinator","Warehouse Supervisor","Process Analyst"],
  "Education":          ["Online Tutor","Curriculum Developer","Instructional Designer","Learning Experience Designer","Education Coordinator","Subject Matter Expert","Academic Advisor","Content Creator","Virtual Assistant","Student Support Specialist"],
  "Media & Creative":   ["Graphic Designer","Video Editor","Content Writer","Social Media Manager","Photographer","Motion Designer","Copywriter","Illustrator","Brand Strategist","Creative Director"],
  "Government":         ["Administrative Assistant","Data Encoder","Public Records Officer","Policy Analyst","Communications Officer","IT Support Specialist","Records Manager","Community Liaison","Budget Analyst","Program Coordinator"],
  "Non-profit":         ["Program Coordinator","Grant Writer","Community Outreach Officer","Volunteer Coordinator","Fundraising Specialist","Social Media Coordinator","Case Manager","Communications Officer","Project Coordinator","Data Entry Specialist"],
  "Construction":       ["AutoCAD Drafter","Project Coordinator","Site Document Controller","Cost Estimator","Safety Compliance Officer","Procurement Specialist","BIM Technician","Administrative Coordinator","Quantity Surveyor","Logistics Coordinator"],
  "Energy & Utilities": ["Data Analyst","Operations Coordinator","Environmental Compliance Officer","Technical Writer","Customer Service Rep","GIS Technician","Project Scheduler","Administrative Support","Billing Analyst","Sustainability Coordinator"],
  "Logistics":          ["Logistics Coordinator","Inventory Analyst","Supply Chain Analyst","Customer Service Rep","Freight Coordinator","Warehouse Administrator","Data Entry Specialist","Route Planner","Import/Export Coordinator","Operations Analyst"],
  "Human Resources":    ["HR Assistant","Recruitment Coordinator","Payroll Specialist","Training Coordinator","HR Analyst","Employee Relations Officer","Compensation Analyst","Onboarding Specialist","Benefits Coordinator","HRIS Specialist"],
  "Legal":              ["Legal Secretary","Paralegal","Legal Transcriptionist","Compliance Analyst","Contract Reviewer","Legal Researcher","Court Reporter","Administrative Legal Assistant","Document Manager","Case Coordinator"],
  "Real Estate":        ["Property Manager","Leasing Agent","Real Estate Admin","Listing Coordinator","Virtual Assistant","Marketing Coordinator","Property Analyst","Documentation Specialist","Appraisal Support","Customer Relations Officer"],
  "Tourism & Hotels":   ["Reservations Agent","Guest Relations Officer","Travel Coordinator","Events Coordinator","Front Desk Agent","Tour Planner","Hospitality Trainer","Revenue Analyst","Social Media Manager","Food & Beverage Coordinator"],
  "Food & Beverage":    ["Kitchen Assistant","Food Safety Inspector","Menu Developer","Supply Chain Coordinator","Quality Assurance Technician","Food Photographer","Restaurant Coordinator","Delivery Coordinator","Nutrition Analyst","Catering Manager"],
  "Other":              ["Administrative Assistant","Data Entry Specialist","Customer Service Rep","Operations Coordinator","Project Coordinator","Content Writer","Social Media Manager","Virtual Assistant","Bookkeeper","Marketing Assistant"],
};

const INDUSTRY_SKILLS = {
  "Technology":         ["JavaScript","React","Python","SQL","Node.js","TypeScript","AWS","Figma","Git","REST APIs","Docker","Agile","UI/UX Design","System Design","Cloud Computing"],
  "Healthcare":         ["Medical Terminology","Electronic Health Records","Patient Communication","HIPAA Compliance","Medical Coding","Data Entry","Microsoft Excel","Healthcare Software","Clinical Documentation","Billing & Coding"],
  "Finance":            ["Microsoft Excel","Bookkeeping","Accounting Software","Financial Reporting","Data Analysis","Tax Preparation","QuickBooks","Payroll Processing","Auditing","Financial Modeling"],
  "Retail":             ["Inventory Management","Customer Service","POS Systems","Sales Techniques","Visual Merchandising","E-commerce Platforms","Product Photography","Excel","Stock Management","CRM Tools"],
  "Manufacturing":      ["Quality Control","Safety Compliance","Production Planning","AutoCAD","Inventory Management","Logistics Coordination","Lean Manufacturing","Supply Chain","Data Entry","Technical Documentation"],
  "Education":          ["Curriculum Design","Instructional Design","LMS Platforms","Content Creation","E-learning Tools","Student Assessment","Communication","Research Skills","Subject Matter Expertise","Virtual Facilitation"],
  "Media & Creative":   ["Adobe Creative Suite","Video Editing","Graphic Design","Copywriting","Social Media","Content Strategy","Photography","Motion Graphics","Brand Development","Canva"],
  "Government":         ["Administrative Support","Data Entry","Microsoft Office","Records Management","Public Communication","Policy Research","Compliance","Report Writing","Database Management","Customer Service"],
  "Non-profit":         ["Grant Writing","Community Outreach","Project Coordination","Social Media","Fundraising","Volunteer Management","Data Entry","Communication","Event Planning","Impact Reporting"],
  "Construction":       ["AutoCAD","Project Coordination","Cost Estimation","BIM Software","Safety Standards","Document Control","Procurement","Scheduling","Technical Drawing","Compliance Monitoring"],
  "Energy & Utilities": ["Data Analysis","GIS Software","Environmental Compliance","Technical Writing","Excel","Project Scheduling","Customer Service","Billing Systems","Sustainability Reporting","Regulatory Knowledge"],
  "Logistics":          ["Supply Chain Management","Inventory Control","Data Entry","Excel","Logistics Software","Customer Service","Route Planning","Warehouse Management","Import/Export","Freight Coordination"],
  "Human Resources":    ["Recruitment","Onboarding","Payroll Systems","Employee Relations","HR Software","Training & Development","Performance Management","Labor Law","Benefits Administration","HRIS Platforms"],
  "Legal":              ["Legal Research","Document Management","Microsoft Office","Contract Review","Legal Terminology","Compliance","Transcription","Case Management Software","Attention to Detail","Confidentiality"],
  "Real Estate":        ["CRM Tools","Property Management Software","Customer Service","Documentation","Market Analysis","Communication","Listing Management","Virtual Tours","Microsoft Office","Social Media Marketing"],
  "Tourism & Hotels":   ["Reservation Systems","Customer Service","Event Planning","Communication","Sales","Hospitality Software","Social Media","Revenue Management","Foreign Language","Tour Planning"],
  "Food & Beverage":    ["Food Safety","Quality Assurance","Supply Chain","Menu Development","Customer Service","Inventory Management","HACCP","Food Photography","Nutrition Knowledge","Catering Coordination"],
  "Other":              ["Microsoft Office","Customer Service","Data Entry","Communication","Project Coordination","Social Media","Content Writing","Virtual Assistance","Bookkeeping","Administrative Support"],
};

const FALLBACK_ROLES  = ["Administrative Assistant","Customer Service Rep","Data Entry Specialist","Operations Coordinator","Project Coordinator","Content Writer","Social Media Manager","Virtual Assistant"];
const FALLBACK_SKILLS = ["Microsoft Office","Customer Service","Communication","Data Entry","Project Coordination","Content Writing","Social Media","Teamwork","Attention to Detail","Problem Solving"];
const EXP_LEVELS = ["No Experience Needed","Some Experience","Intermediate","Experienced","Expert / Managerial"];
const WORK_SETUP = [
  { icon: "homeOffice", label: "Remote" },
  { icon: "hybrid",     label: "Hybrid" },
  { icon: "building",   label: "On-site" },
];
const BUDGETS    = ["< ₱20k","₱20k–₱40k","₱40k–₱80k","₱80k–₱150k","₱150k+","Negotiable"];
const FREQUENCIES= ["Occasional","Regular","Frequent","Ongoing"];
const URGENCIES  = ["Low","Medium","High","Urgent"];

const Step2 = ({ data, set, industry }) => {
  const [skillSearch, setSkillSearch]     = useState("");
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [showCustomBudget, setShowCustomBudget] = useState(false);
  const [customBudget, setCustomBudget]   = useState(data.budgetCustom || "");

  // Industry-specific role and skill lists
  const industryKey  = industry === "Other" ? "Other" : (industry || "Other");
  const rolesList    = INDUSTRY_ROLES[industryKey]  || FALLBACK_ROLES;
  const skillPool    = INDUSTRY_SKILLS[industryKey] || FALLBACK_SKILLS;

  // Skills: show chips from pool, then allow search into full pool
  const addedSkills  = data.skills || [];
  const poolNotAdded = skillPool.filter(s => !addedSkills.includes(s));

  const allSkillsPool = [...new Set([...skillPool, ...Object.values(INDUSTRY_SKILLS).flat()])];
  const filtered = skillSearch.length === 0 ? [] : (() => {
    const q = skillSearch.toLowerCase();
    const notAdded = allSkillsPool.filter(s => !addedSkills.includes(s));
    return [...notAdded.filter(s => s.toLowerCase().startsWith(q)), ...notAdded.filter(s => !s.toLowerCase().startsWith(q) && s.toLowerCase().includes(q))].slice(0, 8);
  })();

  const toggleRole  = r => { const c = data.roles||[];  set({ ...data, roles:  c.includes(r) ? c.filter(x=>x!==r) : [...c,r] }); };
  const addSkill    = s => { if (!addedSkills.includes(s)) set({ ...data, skills: [...addedSkills, s] }); setSkillSearch(""); };
  const removeSkill = s => set({ ...data, skills: addedSkills.filter(x=>x!==s) });

  const expIdx = EXP_LEVELS.indexOf(data.expLevel || EXP_LEVELS[2]);
  const safeExpIdx = expIdx < 0 ? 2 : expIdx;

  const applyCustomBudget = () => {
    const v = customBudget.trim();
    if (!v) return;
    set({ ...data, budget: v, budgetCustom: v });
    setShowCustomBudget(false);
  };

  return (
    <div style={{ animation: "slideIn .4s ease both" }}>
      <StepHeader step={2} title="What are you looking for?" subtitle="Help us match you with the right talent" />

      {/* Roles — industry-matched */}
      <Label>What <AccentText>roles</AccentText> do you typically hire for?</Label>
      {industry && (
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, padding:"8px 12px", background:C.tealL, borderRadius:8, border:`1px solid ${C.tealL2}` }}>
          <Icon name="checkCircle" size={14} color={C.teal} />
          <span style={{ fontFamily:C.ff, fontSize:12, color:C.teal, fontWeight:600 }}>
            Showing roles for <strong>{industry}</strong>
          </span>
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        {rolesList.map((r, i) => <Chip key={r} label={r} delay={i*15} selected={(data.roles||[]).includes(r)} onToggle={() => toggleRole(r)} />)}
        {(data.roles||[]).filter(r => !rolesList.includes(r)).map(r => (
          <span key={r} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:8, fontSize:13, fontWeight:700, border:`1.5px solid ${C.teal}`, background:C.tealL, color:C.teal, fontFamily:C.ff }}>
            {r}
            <button onClick={() => toggleRole(r)} aria-label={`Remove ${r}`} style={{ background:"none", border:"none", cursor:"pointer", color:C.teal, fontSize:16, padding:0, lineHeight:1 }}>×</button>
          </span>
        ))}
      </div>
      {showCustomRole ? (
        <div style={{ display:"flex", gap:8, marginBottom:4 }}>
          <OBInput autoFocus placeholder="e.g. Accessibility Consultant..." value={customRoleInput} onChange={e => setCustomRoleInput(e.target.value)} />
          <button onClick={() => { if (customRoleInput.trim()) { toggleRole(customRoleInput.trim()); setCustomRoleInput(""); setShowCustomRole(false); } }}
            style={{ padding:"0 18px", borderRadius:10, border:"none", background:C.teal, color:C.white, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:C.ff, whiteSpace:"nowrap" }}>Add</button>
          <button onClick={() => { setShowCustomRole(false); setCustomRoleInput(""); }}
            style={{ padding:"0 14px", borderRadius:10, border:`1.5px solid ${C.border}`, background:C.white, color:C.muted, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:C.ff, whiteSpace:"nowrap" }}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowCustomRole(true)} className="ob-btn-ghost"
          style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:8, border:`1.5px solid ${C.border}`, background:C.white, color:C.muted, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:C.ff }}>
          + Add a role not listed
        </button>
      )}
      <Divider />

      {/* Skills — chips from pool first, then search */}
      <Label>Required <AccentText>skills</AccentText></Label>
      <p style={{ fontFamily:C.ff, fontSize:13, color:C.muted, marginBottom:12, marginTop:-8, lineHeight:1.5 }}>
        Common skills for <strong>{industry || "your industry"}</strong> — select all that apply, then search to add more.
      </p>

      {/* Skill pool chips */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
        {poolNotAdded.slice(0, 12).map((s, i) => (
          <button key={s} onClick={() => addSkill(s)} className="ob-chip"
            style={{ padding:"8px 14px", borderRadius:8, fontSize:13, fontWeight:500, border:`1.5px solid ${C.border}`, background:C.white, color:C.muted, cursor:"pointer", fontFamily:C.ff, display:"inline-flex", alignItems:"center", gap:5, animation:`fadeUp .35s ease ${i*18}ms both` }}>
            + {s}
          </button>
        ))}
      </div>

      {/* Added skills */}
      {addedSkills.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:10 }}>
          {addedSkills.map(s => (
            <span key={s} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"6px 12px", background:C.tealL, borderRadius:8, fontSize:13, fontWeight:700, color:C.teal, border:`1px solid ${C.tealL2}`, fontFamily:C.ff }}>
              {s}
              <button onClick={() => removeSkill(s)} aria-label={`Remove ${s}`} style={{ background:"none", border:"none", cursor:"pointer", color:C.teal, fontSize:15, padding:0, lineHeight:1 }}>×</button>
            </span>
          ))}
        </div>
      )}

      {/* Search for more */}
      <div style={{ position:"relative", marginBottom:10 }}>
        <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
          <Icon name="search" size={16} color={C.muted} />
        </div>
        <input id="skill-search" placeholder="Search for more skills..." value={skillSearch} onChange={e => setSkillSearch(e.target.value)}
          style={{ width:"100%", padding:"11px 14px 11px 38px", borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:14, fontFamily:C.ff, background:C.white, color:C.navy, transition:"border-color .2s,box-shadow .2s" }} className="ob-inp"
          onBlur={() => setTimeout(() => setSkillSearch(""), 150)} />
        {skillSearch && filtered.length > 0 && (
          <div style={{ position:"absolute", top:"110%", left:0, right:0, background:C.white, border:`1.5px solid ${C.border}`, borderRadius:12, boxShadow:"0 8px 28px rgba(10,42,53,0.12)", zIndex:20, overflow:"hidden" }}>
            {filtered.map((s, i) => (
              <button key={s} onMouseDown={() => addSkill(s)}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"11px 16px", background:"none", border:"none", borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none", cursor:"pointer", fontSize:14, color:C.navy, fontFamily:C.ff, textAlign:"left" }}
                onMouseEnter={e => e.currentTarget.style.background = C.tealL}
                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                <span><strong style={{color:C.teal}}>{s.slice(0,skillSearch.length)}</strong>{s.slice(skillSearch.length)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <Divider />

      {/* Experience level — generalized */}
      <div style={{ marginBottom: 8 }}>
        <Label>Experience expectation: <AccentText>{data.expLevel || EXP_LEVELS[2]}</AccentText></Label>
        <p style={{ fontFamily:C.ff, fontSize:13, color:C.muted, marginBottom:10, marginTop:-8, lineHeight:1.5 }}>Choose the general level of experience you expect from candidates.</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {EXP_LEVELS.map((l, i) => (
            <Chip key={l} label={l} delay={i*20} selected={(data.expLevel||EXP_LEVELS[2])===l} onToggle={() => set({ ...data, expLevel:l })} />
          ))}
        </div>
      </div>
      <Divider />

      <Label>Work <AccentText>setup</AccentText></Label>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:4 }}>
        {WORK_SETUP.map((w, i) => <IconCard key={w.label} iconName={w.icon} label={w.label} delay={i*55} selected={data.workSetup===w.label} onSelect={() => set({ ...data, workSetup:w.label })} />)}
      </div>
      <Divider />

      {/* Budget — preset chips + custom input */}
      <Label>Monthly budget range</Label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:10 }}>
        {BUDGETS.map((b, i) => (
          <Chip key={b} label={b} delay={i*18}
            selected={data.budget===b && !data.budgetCustom}
            onToggle={() => { set({ ...data, budget:b, budgetCustom:"" }); setShowCustomBudget(false); setCustomBudget(""); }} />
        ))}
        {/* Custom budget chip / button */}
        {data.budgetCustom ? (
          <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:8, fontSize:13, fontWeight:700, border:`1.5px solid ${C.teal}`, background:C.tealL, color:C.teal, fontFamily:C.ff }}>
            {data.budgetCustom}
            <button onClick={() => { set({ ...data, budget:"", budgetCustom:"" }); setCustomBudget(""); }} aria-label="Remove custom budget" style={{ background:"none", border:"none", cursor:"pointer", color:C.teal, fontSize:16, padding:0, lineHeight:1 }}>×</button>
          </span>
        ) : showCustomBudget ? (
          <div style={{ display:"flex", gap:8, alignItems:"center", width:"100%" }}>
            <input autoFocus placeholder="e.g. ₱25k–₱35k or negotiable per project" value={customBudget} onChange={e => setCustomBudget(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter") applyCustomBudget(); if (e.key==="Escape") { setShowCustomBudget(false); setCustomBudget(""); } }}
              style={{ flex:1, padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.teal}`, fontSize:14, fontFamily:C.ff, background:C.tealL, color:C.navy, outline:"none" }} className="ob-inp" />
            <button onClick={applyCustomBudget} style={{ padding:"10px 16px", borderRadius:10, border:"none", background:C.teal, color:C.white, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:C.ff, whiteSpace:"nowrap" }}>Set</button>
            <button onClick={() => { setShowCustomBudget(false); setCustomBudget(""); }} style={{ padding:"10px 12px", borderRadius:10, border:`1.5px solid ${C.border}`, background:C.white, color:C.muted, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:C.ff }}>✕</button>
          </div>
        ) : (
          <button onClick={() => setShowCustomBudget(true)} className="ob-btn-ghost"
            style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:8, border:`1.5px solid ${C.border}`, background:C.white, color:C.muted, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:C.ff }}>
            + Specify custom range
          </button>
        )}
      </div>
      <Divider />

      <Label>Hiring frequency</Label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
        {FREQUENCIES.map((f, i) => <Chip key={f} label={f} delay={i*22} selected={data.frequency===f} onToggle={() => set({ ...data, frequency:f })} />)}
      </div>

      <Label>Urgency level</Label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
        {URGENCIES.map((u, i) => <Chip key={u} label={u} delay={i*22} selected={data.urgency===u} onToggle={() => set({ ...data, urgency:u })} />)}
      </div>
    </div>
  );
};

// ─── STEP 3 ───────────────────────────────────────────────────────────────────
const ACCOMMODATIONS = ["Wheelchair Accessible","Flexible Hours","Remote Work Options","Assistive Technology","Sign Language Interpreter","Quiet Workspace","Screen Readers","Ergonomic Equipment","Braille Materials","Dedicated Parking","Modified Duties","Job Coaching"];
const RANK_DEFAULT   = ["Verified Skills","Portfolio Quality","Communication","Speed","Cultural Fit","Cost"];
const SORT_OPTIONS   = [
  { icon: "checkCircle", label: "Highest Verification Score" },
  { icon: "star",        label: "Best Skill Match %"         },
  { icon: "trendingUp",  label: "Recently Active"            },
  { icon: "briefcase",   label: "Portfolio Strength"         },
];

const Step3 = ({ data, set }) => {
  const [rankItems, setRankItems]   = useState(data.rankItems || RANK_DEFAULT);
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [showCustom, setShowCustom]   = useState(false);
  const [customInput, setCustomInput] = useState("");

  const toggleAccom = a => { const c = data.accommodations||[]; set({ ...data, accommodations: c.includes(a) ? c.filter(x=>x!==a) : [...c,a] }); };
  const addCustom = () => {
    const a = customInput.trim(); if (!a) return;
    const c = data.accommodations||[];
    if (!c.includes(a)) set({ ...data, accommodations:[...c,a] });
    setCustomInput(""); setShowCustom(false);
  };
  const handleDrop = i => {
    if (draggingIdx===null || draggingIdx===i) { setDraggingIdx(null); setDragOverIdx(null); return; }
    const n = [...rankItems]; const [m] = n.splice(draggingIdx,1); n.splice(i,0,m);
    setRankItems(n); set({ ...data, rankItems:n }); setDraggingIdx(null); setDragOverIdx(null);
  };

  return (
    <div style={{ animation:"slideIn .4s ease both" }}>
      <StepHeader step={3} title="Build an inclusive workplace" subtitle="Your hiring preferences and evaluation criteria" />

      <Label>Workplace <AccentText>accommodations</AccentText> you can provide</Label>
      <p style={{ fontFamily:C.ff, fontSize:13, color:C.muted, marginBottom:12, marginTop:-8, lineHeight:1.5 }}>Select all that apply. This helps candidates know what support is available.</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
        {ACCOMMODATIONS.map((a, i) => <Chip key={a} label={a} delay={i*15} selected={(data.accommodations||[]).includes(a)} onToggle={() => toggleAccom(a)} />)}
        {(data.accommodations||[]).filter(a => !ACCOMMODATIONS.includes(a)).map(a => (
          <span key={a} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:8, fontSize:13, fontWeight:700, border:`1.5px solid ${C.teal}`, background:C.tealL, color:C.teal, fontFamily:C.ff }}>
            {a}<button onClick={() => toggleAccom(a)} aria-label={`Remove ${a}`} style={{ background:"none", border:"none", cursor:"pointer", color:C.teal, fontSize:16, padding:0, lineHeight:1 }}>×</button>
          </span>
        ))}
      </div>
      {showCustom ? (
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          <OBInput autoFocus placeholder="Describe a specific accommodation..." value={customInput} onChange={e => setCustomInput(e.target.value)} />
          <button onClick={addCustom} style={{ padding:"0 18px", borderRadius:12, border:"none", background:C.teal, color:C.white, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:C.ff, whiteSpace:"nowrap" }}>Add</button>
          <button onClick={() => { setShowCustom(false); setCustomInput(""); }} style={{ padding:"0 14px", borderRadius:12, border:`1.5px solid ${C.border}`, background:C.white, color:C.muted, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:C.ff, whiteSpace:"nowrap" }}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setShowCustom(true)} className="ob-btn-ghost" style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:8, border:`1.5px solid ${C.border}`, background:C.white, color:C.muted, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:C.ff, marginBottom:4 }}>
          + Add custom accommodation
        </button>
      )}

      <div style={{ marginTop:16 }}>
        <Toggle id="inclusive-guidance" iconName="shield" label="Inclusive hiring guidance" desc="Receive tips and best practices for building diverse, accessible teams" checked={data.inclusiveGuidance !== false} onChange={v => set({ ...data, inclusiveGuidance:v })} />
      </div>
      <Divider />

      <Label>Rank what <AccentText>matters most</AccentText> when hiring</Label>
      <p style={{ fontFamily:C.ff, fontSize:13, color:C.muted, marginBottom:14, marginTop:-8, lineHeight:1.5 }}>Drag to reorder. Number 1 is your top priority.</p>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {rankItems.map((item, i) => (
          <div key={item} draggable
            onDragStart={() => setDraggingIdx(i)}
            onDragOver={e => { e.preventDefault(); setDragOverIdx(i); }}
            onDrop={() => handleDrop(i)}
            onDragEnd={() => { setDraggingIdx(null); setDragOverIdx(null); }}
            className={`drag-item${draggingIdx===i?" is-dragging":""}${dragOverIdx===i&&draggingIdx!==i?" drag-over-target":""}`}
            style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:C.white, border:`1.5px solid ${C.border}`, borderRadius:12, userSelect:"none", animation:`fadeUp .4s ease ${i*50}ms both` }}>
            <Icon name="gripVertical" size={18} color={C.muted} />
            <div style={{ width:28, height:28, borderRadius:"50%", background:i<3?C.teal:C.tealL, border:`1.5px solid ${i<3?"transparent":C.tealL2}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:i<3?C.white:C.teal, flexShrink:0, transition:"background .2s" }}>{i+1}</div>
            <span style={{ fontFamily:C.ff, fontSize:14, fontWeight:600, color:C.navy, flex:1 }}>{item}</span>
            <span style={{ fontFamily:C.ff, fontSize:12, color:C.muted }}>↕ drag</span>
          </div>
        ))}
      </div>
      <Divider />

      <Label>How should we <AccentText>sort candidates</AccentText> for you?</Label>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        {SORT_OPTIONS.map((s, i) => (
          <IconCard key={s.label} iconName={s.icon} label={s.label} delay={i*45}
            selected={(data.sortBy||[]).includes(s.label)}
            onSelect={() => { const c=data.sortBy||[]; set({ ...data, sortBy:c.includes(s.label)?c.filter(x=>x!==s.label):[...c,s.label] }); }} />
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <Toggle id="ai-suggest" iconName="robot" label="AI auto-suggested candidates" desc="Get daily candidate recommendations based on your preferences" checked={data.aiSuggest !== false} onChange={v => set({ ...data, aiSuggest:v })} />
        <Toggle id="notifications" iconName="bell" label="Candidate notifications" desc="Get notified when new matching candidates join the platform" checked={data.notifications !== false} onChange={v => set({ ...data, notifications:v })} />
      </div>
    </div>
  );
};

// ─── STEP 4 ───────────────────────────────────────────────────────────────────
const DASH_OPTIONS = [
  { icon:"sparkles",   label:"Candidate Recommendations", desc:"AI-curated top matches" },
  { icon:"briefcase",  label:"Job Posts",                 desc:"Manage your listings"   },
  { icon:"search",     label:"Talent Search",             desc:"Browse all candidates"  },
  { icon:"barChartUp", label:"Analytics",                 desc:"Hiring performance"     },
];

const Step4 = ({ data, set }) => {
  const toggle = label => { const c=data.dashFirst||[]; set({ ...data, dashFirst:c.includes(label)?c.filter(x=>x!==label):[...c,label] }); };

  return (
    <div style={{ animation:"slideIn .4s ease both" }}>
      <StepHeader step={4} title="Customize your dashboard" subtitle="Set up your preferred hiring workflow" />

      <Label>What would you like to see <AccentText>first</AccentText>?</Label>
      <p style={{ fontFamily:C.ff, fontSize:13, color:C.muted, marginBottom:14, marginTop:-8, lineHeight:1.5 }}>Select the sections you want pinned to the top of your dashboard.</p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {DASH_OPTIONS.map((d, i) => (
          <button key={d.label} onClick={() => toggle(d.label)} aria-pressed={(data.dashFirst||[]).includes(d.label)} className="ob-card"
            style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 18px", borderRadius:14, border:`1.5px solid ${(data.dashFirst||[]).includes(d.label)?C.teal:C.border}`, background:(data.dashFirst||[]).includes(d.label)?C.tealL:C.white, cursor:"pointer", position:"relative", animation:`fadeUp .4s ease ${i*50}ms both`, textAlign:"left" }}>
            {(data.dashFirst||[]).includes(d.label) && (
              <div style={{ position:"absolute", top:8, right:8, width:18, height:18, borderRadius:"50%", background:C.teal, display:"flex", alignItems:"center", justifyContent:"center", animation:"checkPop .25s cubic-bezier(.34,1.56,.64,1) both" }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            )}
            <div style={{ width:42, height:42, borderRadius:12, background:(data.dashFirst||[]).includes(d.label)?C.teal:C.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background .18s" }}>
              <Icon name={d.icon} size={20} color={(data.dashFirst||[]).includes(d.label)?C.white:C.teal} />
            </div>
            <div>
              <div style={{ fontFamily:C.ff, fontSize:14, fontWeight:700, color:C.navy }}>{d.label}</div>
              <div style={{ fontFamily:C.ff, fontSize:12, color:C.muted, marginTop:2 }}>{d.desc}</div>
            </div>
          </button>
        ))}
      </div>
      <Divider />

      <Label htmlFor="mission">Company mission statement <span style={{ fontWeight:400, color:C.muted, fontSize:13 }}>(optional)</span></Label>
      <OBInput id="mission" multiline rows={5} placeholder="Share your company's values and what makes your workplace special for candidates..." value={data.mission||""} onChange={e => set({ ...data, mission:e.target.value })} />
      <p style={{ fontFamily:C.ff, fontSize:12, color:C.muted, marginTop:6 }}>This will be shown to candidates viewing your profile.</p>
      <Divider />

      <Toggle id="visibility" iconName="eye" label="Profile visibility" desc="Your company profile is visible to all candidates on InklusiJobs" checked={data.visible !== false} onChange={v => set({ ...data, visible:v })} />

      <div style={{ marginTop:24, borderRadius:14, padding:"22px 24px", background:C.tealL, border:`1.5px solid ${C.tealL2}` }}>
        <div style={{ fontFamily:C.ff, fontSize:14, fontWeight:700, color:C.navy, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
          <Icon name="grid" size={18} color={C.teal} />
          Your dashboard will include:
        </div>
        {["AI-powered candidate matching based on your preferences","Inclusive Employer badge displayed on your profile","Custom job templates tailored to your industry","Diversity analytics on your hiring pipeline"].map((item, i) => (
          <div key={item} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:i<3?10:0, animation:`fadeUp .35s ease ${i*70}ms both` }}>
            <div style={{ width:20, height:20, borderRadius:"50%", background:C.teal, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span style={{ fontFamily:C.ff, fontSize:14, color:C.body, lineHeight:1.5 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── COMPLETE ─────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = [C.teal, C.tealMid, C.navy, "#059669", "#D97706", "#7C3AED"];

const CompleteScreen = () => (
  <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:C.ff, position:"relative", overflow:"hidden" }}>
    <style>{CSS}</style>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
    {/* Subtle bg pattern */}
    <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(${C.tealL2} 1px, transparent 1px)`, backgroundSize:"28px 28px", opacity:0.5, pointerEvents:"none" }} />
    {/* Confetti */}
    {Array.from({length:20}).map((_,i) => (
      <div key={i} style={{ position:"absolute", left:`${4+(i*4.8)%91}%`, top:-10, width:7+(i%4)*3, height:7+(i%3)*2, borderRadius:i%3===0?"50%":"3px", background:CONFETTI_COLORS[i%CONFETTI_COLORS.length], animation:`fallDown ${2.4+(i%4)*0.7}s ease-in ${i*120}ms both`, opacity:.85 }} />
    ))}

    <div style={{ position:"relative", zIndex:2, maxWidth:520, width:"90%", textAlign:"center", animation:"fadeUp .5s ease both" }}>
      <div style={{ background:C.white, borderRadius:24, padding:"52px 44px", boxShadow:"0 8px 48px rgba(10,42,53,0.12)", border:`1px solid ${C.border}` }}>
        <div style={{ width:88, height:88, borderRadius:"50%", background:C.teal, margin:"0 auto 28px", display:"flex", alignItems:"center", justifyContent:"center", animation:"popIn .6s cubic-bezier(.34,1.56,.64,1) .15s both", boxShadow:"0 6px 28px rgba(15,92,110,0.35)" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(24px,3.5vw,34px)", fontWeight:400, margin:"0 0 12px", lineHeight:1.2, color:C.navy }}>
          Your dashboard is ready!
        </h2>
        <p style={{ fontFamily:C.ff, fontSize:15, color:C.muted, margin:"0 0 32px", lineHeight:1.7 }}>
          You&apos;re all set to discover verified PWD talent and build a more inclusive team.
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:36, textAlign:"left" }}>
          {["AI-powered candidate matching is active","Inclusive Employer Badge earned","Dashboard configured to your preferences","Start posting jobs immediately"].map((item, i) => (
            <div key={item} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", borderRadius:12, background:C.tealL, border:`1px solid ${C.tealL2}`, animation:`fadeUp .35s ease ${.3+i*.08}s both` }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:C.teal, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span style={{ fontFamily:C.ff, fontSize:14, fontWeight:600, color:C.navy }}>{item}</span>
            </div>
          ))}
        </div>

        <a href="/employer/dashboard" style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"15px 40px", borderRadius:12, background:C.navy, color:C.white, fontSize:15, fontWeight:700, textDecoration:"none", boxShadow:"0 6px 22px rgba(10,42,53,0.3)", fontFamily:C.ff, transition:"transform .14s,box-shadow .14s" }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 10px 28px rgba(10,42,53,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 6px 22px rgba(10,42,53,0.3)"; }}>
          Go to Dashboard
          <Icon name="chevRight" size={16} color={C.white} />
        </a>

        <div style={{ marginTop:16, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <div style={{ width:16, height:16, borderRadius:"50%", background:C.success, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span style={{ fontFamily:C.ff, fontSize:13, color:C.success, fontWeight:700 }}>Inclusive Employer Badge earned</span>
        </div>
      </div>
    </div>
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const RANK_ITEMS_DEFAULT = ["Verified Skills","Portfolio Quality","Communication","Speed","Cultural Fit","Cost"];

export default function EmployerOnboarding() {
  const [step, setStep]         = useState(1);
  const [complete, setComplete] = useState(false);
  const [checking, setChecking] = useState(true);
  const contentRef = useRef(null);

  // If onboarding already done, go straight to dashboard
  useEffect(() => {
    try {
      const raw = localStorage.getItem("inklusijobs_employer");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.completedAt) {
          window.location.href = "/employer/dashboard";
          return;
        }
      }
    } catch {}
    setChecking(false);
  }, []);

  const [s1, setS1] = useState({ company:"", industry:"", size:"", posTypes:[] });
  const [s2, setS2] = useState({ roles:[], skills:[], expLevel:"Intermediate", workSetup:"Remote", budget:"", budgetCustom:"", frequency:"", urgency:"" });
  const [s3, setS3] = useState({ accommodations:[], inclusiveGuidance:true, rankItems:RANK_ITEMS_DEFAULT, sortBy:[], aiSuggest:true, notifications:true });
  const [s4, setS4] = useState({ dashFirst:["Candidate Recommendations","Job Posts"], mission:"", visible:true });

  const canNext = () => step === 1 ? s1.company.trim().length > 0 && !!s1.industry : true;

  const handleStep = dir => {
    if (dir > 0 && !canNext()) return;
    setStep(v => v + dir);
    contentRef.current?.scrollTo({ top:0, behavior:"smooth" });
  };

  const handleComplete = () => {
    let authUser = {};
    try { authUser = JSON.parse(localStorage.getItem("ij_current_user") || "{}"); } catch {}
    const profile = {
      s1:{ ...s1, firstName:authUser.firstName||"", lastName:authUser.lastName||"", email:authUser.email||"" },
      s2, s3, s4,
      s5:{ theme:"navy", layout:"Comfortable", widgets:s4.dashFirst||[], teammates:[] },
      completedAt: Date.now(),
    };
    localStorage.setItem("inklusijobs_employer", JSON.stringify(profile));
    setComplete(true);
  };

  if (checking) return <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}><div style={{ width:32, height:32, border:`3px solid ${C.tealL2}`, borderTopColor:C.teal, borderRadius:"50%", animation:"spin .7s linear infinite" }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
  if (complete) return <CompleteScreen />;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:C.ff }}>
      <style>{CSS}</style>
      {/* Google Fonts — loaded as a proper link so @import doesn't break */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      <Sidebar step={step} />

      <div ref={contentRef} style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
        <ProgressHeader step={step} />

        <div style={{ flex:1, padding:"32px 52px 0" }}>
          <div style={{ maxWidth:820, margin:"0 auto" }}>
            <div style={{ background:C.white, borderRadius:20, padding:"40px 44px", marginBottom:24, boxShadow:"0 2px 16px rgba(10,42,53,0.07)", border:`1px solid ${C.border}` }}>
              {step === 1 && <Step1 data={s1} set={setS1} />}
              {step === 2 && <Step2 data={s2} set={setS2} industry={s1.industry} />}
              {step === 3 && <Step3 data={s3} set={setS3} />}
              {step === 4 && <Step4 data={s4} set={setS4} />}
            </div>
          </div>
        </div>

        {/* Nav footer */}
        <div style={{ position:"sticky", bottom:0, background:C.white, borderTop:`1px solid ${C.border}`, padding:"18px 52px", display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:10, boxShadow:"0 -2px 12px rgba(10,42,53,0.06)" }}>
          <button onClick={() => handleStep(-1)} disabled={step===1} className="ob-btn-ghost"
            style={{ padding:"11px 22px", borderRadius:10, border:`1.5px solid ${C.border}`, background:C.white, color:step===1?C.border:C.body, fontSize:14, fontWeight:600, cursor:step===1?"not-allowed":"pointer", opacity:step===1?.4:1, fontFamily:C.ff }}>
            ← Back
          </button>

          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            {step===2 && (
              <button onClick={() => handleStep(1)} className="ob-btn-ghost"
                style={{ padding:"11px 20px", borderRadius:10, border:`1.5px solid ${C.border}`, background:C.white, color:C.muted, fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:C.ff }}>
                Skip
              </button>
            )}
            {step < 4 ? (
              <button onClick={() => handleStep(1)} disabled={!canNext()} className="ob-btn-pri"
                style={{ padding:"11px 30px", borderRadius:10, border:"none", background:canNext()?C.navy:C.border, color:canNext()?C.white:C.muted, fontSize:14, fontWeight:700, cursor:canNext()?"pointer":"not-allowed", fontFamily:C.ff, boxShadow:canNext()?"0 4px 16px rgba(10,42,53,0.25)":"none" }}>
                Continue →
              </button>
            ) : (
              <button onClick={handleComplete} className="ob-btn-pri"
                style={{ padding:"11px 30px", borderRadius:10, border:"none", background:C.teal, color:C.white, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:C.ff, boxShadow:"0 4px 16px rgba(15,92,110,0.3)" }}>
                Complete Setup ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
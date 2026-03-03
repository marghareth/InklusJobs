"use client";
/* eslint-disable @next/next/no-page-custom-font */

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const LexendFont = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap');* { font-family: 'Lexend', sans-serif !important; }`}</style>
);

/* ─── THEME ──────────────────────────────────────────────────────────────── */
const T = {
  teal:      "#0A8778",
  tealLight: "#E8F5F3",
  navy:      "#0D0D1E",
  bodyText:  "#1A2A35",
  muted:     "#666666",
  border:    "#E0E0E0",
  bg:        "#F4F6F5",
  white:     "#FFFFFF",
  success:   "#0D6B5E",
  warning:   "#B24020",
  danger:    "#CC1016",
};

/* ─── MOCK DATA ──────────────────────────────────────────────────────────── */
const ALL_CANDIDATES = [
  { id:1, name:"Maria Santos",   initials:"MS", role:"Software Developer", match:97, skills:["JavaScript","React","Accessibility"], disability:"Visual Impairment",   exp:"3 yrs", status:"New",         budget:"₱80k–₱150k" },
  { id:2, name:"Juan dela Cruz", initials:"JD", role:"Data Analyst",       match:93, skills:["Python","SQL","Excel"],               disability:"Hearing Impairment",  exp:"2 yrs", status:"Reviewed",    budget:"₱40k–₱80k"  },
  { id:3, name:"Ana Reyes",      initials:"AR", role:"Content Writer",     match:89, skills:["Content Writing","SEO","Canva"],      disability:"Mobility Disability", exp:"4 yrs", status:"New",         budget:"₱20k–₱40k"  },
  { id:4, name:"Pedro Lim",      initials:"PL", role:"Customer Support",   match:85, skills:["Customer Service","Communication"],   disability:"Speech Impairment",   exp:"1 yr",  status:"Shortlisted", budget:"₱20k–₱40k"  },
  { id:5, name:"Rosa Gomez",     initials:"RG", role:"HR Manager",         match:83, skills:["HR Management","Project Management"], disability:"Chronic Illness",     exp:"5 yrs", status:"New",         budget:"₱80k–₱150k" },
  { id:6, name:"Carlo Mendoza",  initials:"CM", role:"Designer",           match:80, skills:["Figma","Canva","Social Media"],       disability:"Autism Spectrum",     exp:"2 yrs", status:"Reviewed",    budget:"₱40k–₱80k"  },
  { id:7, name:"Liza Castillo",  initials:"LC", role:"DevOps Engineer",    match:76, skills:["AWS","Node.js","TypeScript"],         disability:"ADHD",                exp:"3 yrs", status:"New",         budget:"₱80k–₱150k" },
  { id:8, name:"Ben Torres",     initials:"BT", role:"Product Manager",    match:74, skills:["Project Management","Communication"], disability:"Physical Disability",  exp:"6 yrs", status:"Shortlisted", budget:"₱150k+"     },
];

const MOCK_JOBS = [
  { id:1, title:"Senior React Developer", type:"Full-time",  applicants:14, posted:"2d ago", status:"Active", urgent:true  },
  { id:2, title:"Data Analyst",           type:"Part-time",  applicants:9,  posted:"5d ago", status:"Active", urgent:false },
  { id:3, title:"Customer Support Agent", type:"Contract",   applicants:22, posted:"1d ago", status:"Active", urgent:true  },
  { id:4, title:"UX/UI Designer",         type:"Freelance",  applicants:6,  posted:"1w ago", status:"Draft",  urgent:false },
  { id:5, title:"HR Coordinator",         type:"Full-time",  applicants:11, posted:"3d ago", status:"Active", urgent:false },
];

/* ─── PRIMITIVES ─────────────────────────────────────────────────────────── */
const Card = ({ children, style={}, onClick }) => (
  <div onClick={onClick} style={{ background:T.white, borderRadius:8, border:`1px solid ${T.border}`, padding:"16px", ...style }}>
    {children}
  </div>
);

const Badge = ({ children, color=T.teal, style={} }) => (
  <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:99, background:`${color}15`, color, fontSize:11, fontWeight:700, border:`1px solid ${color}25`, ...style }}>
    {children}
  </span>
);

const Avatar = ({ initials, size=44 }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:T.teal, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.32, fontWeight:800, flexShrink:0 }}>
    {initials}
  </div>
);

const SectionHead = ({ children, action }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
    <h3 style={{ margin:0, fontSize:13, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:"0.06em" }}>{children}</h3>
    {action && <button onClick={action.fn} style={{ fontSize:12, color:T.teal, fontWeight:600, background:"none", border:"none", cursor:"pointer", padding:0 }}>{action.label}</button>}
  </div>
);

const ProgressBar = ({ value, max=100, color=T.teal, height=4 }) => (
  <div style={{ height, borderRadius:99, background:"#E8E8E8", overflow:"hidden" }}>
    <div style={{ height:"100%", width:`${(value/max)*100}%`, background:color, borderRadius:99 }} />
  </div>
);

/* ─── TOP NAV ────────────────────────────────────────────────────────────── */
const TABS = [
  { id:"overview",   label:"Home"       },
  { id:"candidates", label:"Candidates" },
  { id:"jobs",       label:"Jobs"       },
  { id:"profile",    label:"Profile"    },
  { id:"analytics",  label:"Analytics"  },
  { id:"messages",   label:"Messages"   },
  { id:"settings",   label:"Settings"   },
];

const TopNav = ({ active, onTab, profile, onReset }) => {
  const s1 = profile?.s1 || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header style={{ position:"sticky", top:0, zIndex:100, background:T.white, borderBottom:`1px solid ${T.border}` }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", height:54, gap:0 }}>

        {/* Logo */}
        <div style={{ marginRight:20, flexShrink:0 }}>
          <img src="/images/logo.png" alt="InklusiJobs" style={{ height:32, width:"auto", display:"block" }} />
        </div>

        {/* Search */}
        <div style={{ position:"relative", flex:"0 0 240px", marginRight:16 }}>
          <input placeholder="Search..." style={{
            width:"100%", boxSizing:"border-box",
            padding:"7px 14px", borderRadius:20,
            border:`1px solid ${T.border}`, background:"#E8F5F3",
            fontSize:13, fontFamily:"'Lexend', sans-serif", outline:"none", color:T.navy
          }} />
        </div>

        {/* Nav tabs */}
        <nav style={{ display:"flex", flex:1, justifyContent:"center", alignItems:"stretch", height:"100%" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => onTab(tab.id)} style={{
              padding:"0 16px", border:"none", background:"none",
              borderBottom:`2px solid ${active===tab.id ? T.teal : "transparent"}`,
              color: active===tab.id ? T.teal : T.muted,
              fontSize:13, fontWeight: active===tab.id ? 700 : 500,
              cursor:"pointer", fontFamily:"'Lexend', sans-serif", transition:"all 0.15s"
            }}>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Avatar menu */}
        <div ref={menuRef} style={{ position:"relative" }}>
          <button onClick={() => setMenuOpen(m => !m)}
            style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", padding:"0 8px" }}>
            {s1.logoPreview
              ? <img src={s1.logoPreview} alt="" style={{ width:30, height:30, borderRadius:"50%", objectFit:"cover" }} />
              : <div style={{ width:30, height:30, borderRadius:"50%", background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:900 }}>{(s1.company||"E")[0]}</div>
            }
            <span style={{ fontSize:12, color:T.muted }}>▾</span>
          </button>
          {menuOpen && (
            <div style={{ position:"absolute", right:0, top:"110%", background:T.white, border:`1px solid ${T.border}`, borderRadius:8, boxShadow:"0 4px 16px rgba(0,0,0,0.12)", zIndex:200, minWidth:200, overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.navy }}>{s1.company||"Your Company"}</div>
                <div style={{ fontSize:11, color:T.muted }}>{s1.industry||""}</div>
              </div>
              <div style={{ padding:"4px 0" }}>
                <button onClick={() => { onTab("profile"); setMenuOpen(false); }}
                  style={{ display:"block", width:"100%", textAlign:"left", padding:"9px 16px", border:"none", background:"none", fontSize:13, color:T.bodyText, cursor:"pointer", fontFamily:"'Lexend', sans-serif" }}>Company Profile</button>
                <button onClick={onReset}
                  style={{ display:"block", width:"100%", textAlign:"left", padding:"9px 16px", border:"none", background:"none", fontSize:13, color:T.danger, fontWeight:700, cursor:"pointer", fontFamily:"'Lexend', sans-serif" }}>Redo Onboarding</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

/* ─── OVERVIEW TAB ───────────────────────────────────────────────────────── */
const OverviewTab = ({ profile, onTab }) => {
  const s1 = profile?.s1 || {};
  const s2 = profile?.s2 || {};
  const s3 = profile?.s3 || {};
  const topCandidates = ALL_CANDIDATES.slice(0, 4);
  const activeJobs = MOCK_JOBS.filter(j => j.status === "Active").slice(0, 3);

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"20px 16px" }}>

      {/* Company banner — solid color, no gradient */}
      <Card style={{ padding:0, overflow:"hidden", marginBottom:16 }}>
        <div style={{ height:80, background:T.teal }} />
        <div style={{ padding:"0 24px 16px", position:"relative" }}>
          <div style={{ marginTop:-36, marginBottom:10, display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
            <div style={{ width:72, height:72, borderRadius:8, border:"3px solid #fff", background:T.white, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
              {s1.logoPreview
                ? <img src={s1.logoPreview} alt="" style={{ width:"100%", height:"100%", objectFit:"contain", padding:4 }} />
                : <div style={{ width:"100%", height:"100%", background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, color:"#fff", fontWeight:900 }}>{(s1.company||"C")[0]}</div>
              }
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => onTab("jobs")} style={{ padding:"6px 16px", borderRadius:20, border:`1.5px solid ${T.teal}`, background:T.white, color:T.teal, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Lexend', sans-serif" }}>+ Post Job</button>
              <button onClick={() => onTab("profile")} style={{ padding:"6px 16px", borderRadius:20, border:`1.5px solid ${T.border}`, background:T.white, color:T.bodyText, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'Lexend', sans-serif" }}>Edit Profile</button>
            </div>
          </div>
          <div style={{ fontSize:20, fontWeight:800, color:T.navy, marginBottom:2 }}>{s1.company || "Your Company"}</div>
          <div style={{ fontSize:13, color:T.muted }}>{s1.industry || "Industry"} · {s2.workSetup || "Remote"} · {s2.budget || "Competitive"}</div>

          {/* Stats */}
          <div style={{ display:"flex", marginTop:12, paddingTop:12, borderTop:`1px solid ${T.border}` }}>
            {[
              { label:"Matches",      value:ALL_CANDIDATES.length },
              { label:"Active Jobs",  value:MOCK_JOBS.filter(j=>j.status==="Active").length },
              { label:"Applications", value:40 },
              { label:"Profile Views",value:128 },
            ].map((s, i) => (
              <div key={s.label} style={{ flex:1, textAlign:"center", borderRight: i < 3 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ fontSize:20, fontWeight:800, color:T.navy }}>{s.value}</div>
                <div style={{ fontSize:11, color:T.muted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"240px 1fr 240px", gap:16 }}>

        {/* Left: preferences */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Card>
            <SectionHead>Preferences</SectionHead>
            {[
              { label:"Setup",  value: s2.workSetup || "—" },
              { label:"Budget", value: s2.budget    || "—" },
              { label:"Level",  value: s2.expLevel  || "—" },
            ].map(row => (
              <div key={row.label} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid #f0f0f0` }}>
                <span style={{ fontSize:12, color:T.muted }}>{row.label}</span>
                <span style={{ fontSize:12, fontWeight:700, color:T.navy }}>{row.value}</span>
              </div>
            ))}
          </Card>
          <Card>
            <SectionHead>Accommodations</SectionHead>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {(s3.accommodations||[]).length > 0
                ? s3.accommodations.map(a => <Badge key={a} color={T.success}>{a}</Badge>)
                : <span style={{ fontSize:12, color:T.muted }}>None listed</span>}
            </div>
          </Card>
          <Card>
            <SectionHead>Skills Wanted</SectionHead>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {(s2.skills||[]).length > 0
                ? s2.skills.map(s => <Badge key={s} color={T.teal}>{s}</Badge>)
                : <span style={{ fontSize:12, color:T.muted }}>None set</span>}
            </div>
          </Card>
        </div>

        {/* Center: feed */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {/* Top matches */}
          <Card>
            <SectionHead action={{ label:"See all →", fn:() => onTab("candidates") }}>Top Matches</SectionHead>
            {topCandidates.map((c, i) => (
              <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom: i < topCandidates.length-1 ? `1px solid #f0f0f0` : "none" }}>
                <Avatar initials={c.initials} size={40} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.navy }}>{c.name}</div>
                  <div style={{ fontSize:11, color:T.muted }}>{c.role} · {c.exp}</div>
                  <div style={{ display:"flex", gap:4, marginTop:4, flexWrap:"wrap" }}>
                    {c.skills.slice(0,2).map(sk => <Badge key={sk} color={T.teal}>{sk}</Badge>)}
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:18, fontWeight:800, color:T.teal }}>{c.match}%</div>
                  <Badge color={c.status==="Shortlisted"?T.success:T.teal} style={{ marginTop:4 }}>{c.status}</Badge>
                </div>
              </div>
            ))}
          </Card>

          {/* Active jobs */}
          <Card>
            <SectionHead action={{ label:"Manage →", fn:() => onTab("jobs") }}>Active Jobs</SectionHead>
            {activeJobs.map((j, i) => (
              <div key={j.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom: i < activeJobs.length-1 ? `1px solid #f0f0f0` : "none" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.navy, display:"flex", alignItems:"center", gap:6 }}>
                    {j.title}
                    {j.urgent && <Badge color={T.danger}>Urgent</Badge>}
                  </div>
                  <div style={{ fontSize:11, color:T.muted }}>{j.type} · {j.posted}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:16, fontWeight:800, color:T.navy }}>{j.applicants}</div>
                  <div style={{ fontSize:10, color:T.muted }}>applicants</div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Right: insights */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Card style={{ background:T.teal, border:"none" }}>
            <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.6)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>AI Insight</div>
            <p style={{ fontSize:13, color:"#fff", lineHeight:1.6, margin:0 }}>
              Your profile is attracting <strong>34% more</strong> qualified PWD applicants this week.
            </p>
          </Card>

          <Card>
            <SectionHead>This Week</SectionHead>
            {[
              { label:"Profile views",  value:"+23" },
              { label:"New applicants", value:"+8"  },
              { label:"Shortlisted",    value:"3"   },
              { label:"Messages sent",  value:"12"  },
            ].map(s => (
              <div key={s.label} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid #f0f0f0` }}>
                <span style={{ fontSize:12, color:T.bodyText }}>{s.label}</span>
                <span style={{ fontSize:13, fontWeight:800, color:T.teal }}>{s.value}</span>
              </div>
            ))}
          </Card>

          <Card>
            <SectionHead>Upcoming</SectionHead>
            {[
              { name:"Maria Santos", date:"Mar 5, 10:00 AM" },
              { name:"Ben Torres",   date:"Mar 6, 2:00 PM"  },
              { name:"Pedro Lim",    date:"Mar 7, 9:30 AM"  },
            ].map((iv, i) => (
              <div key={i} style={{ padding:"7px 0", borderBottom:`1px solid #f0f0f0` }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.navy }}>{iv.name}</div>
                <div style={{ fontSize:11, color:T.muted }}>{iv.date}</div>
              </div>
            ))}
          </Card>
        </div>

      </div>
    </div>
  );
};

/* ─── CANDIDATES TAB ─────────────────────────────────────────────────────── */
const CandidatesTab = ({ profile }) => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const statuses = ["All","New","Reviewed","Shortlisted"];
  const filtered = ALL_CANDIDATES.filter(c => {
    if (statusFilter !== "All" && c.status !== statusFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.role.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"20px 16px", display:"flex", gap:16 }}>
      <div style={{ flex:1 }}>
        {/* Filters */}
        <Card style={{ marginBottom:12, padding:"10px 14px" }}>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
            <input placeholder="Search name or role..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{ flex:1, minWidth:180, padding:"7px 12px", borderRadius:20, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"'Lexend', sans-serif", outline:"none", background:T.bg }} />
            <div style={{ display:"flex", gap:6 }}>
              {statuses.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  style={{ padding:"5px 14px", borderRadius:20, border:`1.5px solid ${statusFilter===s ? T.teal : T.border}`, background:statusFilter===s ? "#E8F5F3" : T.white, color:statusFilter===s ? T.teal : T.bodyText, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Lexend', sans-serif" }}>
                  {s}
                </button>
              ))}
            </div>
            <span style={{ fontSize:12, color:T.muted }}>{filtered.length} results</span>
          </div>
        </Card>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {filtered.map(c => (
            <Card key={c.id} onClick={() => setSelected(c.id===selected?null:c.id)}
              style={{ cursor:"pointer", border:`1.5px solid ${selected===c.id ? T.teal : T.border}` }}>
              <div style={{ display:"flex", gap:10 }}>
                <Avatar initials={c.initials} size={44} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:T.navy }}>{c.name}</div>
                    <div style={{ fontSize:17, fontWeight:800, color:T.teal }}>{c.match}%</div>
                  </div>
                  <div style={{ fontSize:11, color:T.muted, marginBottom:6 }}>{c.role} · {c.exp}</div>
                  <ProgressBar value={c.match} color={c.match>=90?T.success:c.match>=80?T.teal:T.warning} />
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:6 }}>
                    {c.skills.slice(0,2).map(sk => <Badge key={sk} color={T.teal}>{sk}</Badge>)}
                    <Badge color={T.success}>{c.disability}</Badge>
                  </div>
                  <div style={{ marginTop:6, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <Badge color={c.status==="New"?T.teal:c.status==="Shortlisted"?T.success:T.muted}>{c.status}</Badge>
                    <span style={{ fontSize:11, color:T.muted }}>{c.budget}</span>
                  </div>
                  {selected===c.id && (
                    <div style={{ marginTop:8, display:"flex", gap:6 }}>
                      <button style={{ flex:1, padding:"6px", borderRadius:20, border:"none", background:T.teal, color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Lexend', sans-serif" }}>View</button>
                      <button style={{ flex:1, padding:"6px", borderRadius:20, border:`1.5px solid ${T.border}`, background:T.white, color:T.bodyText, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Lexend', sans-serif" }}>Message</button>
                      <button style={{ padding:"6px 10px", borderRadius:20, border:`1.5px solid ${T.success}`, background:"#f0faf5", color:T.success, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Lexend', sans-serif" }}>Save</button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ width:220, flexShrink:0, display:"flex", flexDirection:"column", gap:12 }}>
        <Card style={{ background:T.teal, border:"none" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.6)", textTransform:"uppercase", marginBottom:6 }}>AI Insight</div>
          <div style={{ fontSize:13, color:"#fff", lineHeight:1.6 }}>
            Showing <strong>{profile?.s2?.expLevel||"Mid-Level"}</strong> · <strong>{profile?.s2?.workSetup||"Remote"}</strong>
          </div>
        </Card>
        <Card>
          <SectionHead>Match Breakdown</SectionHead>
          {[
            { label:"95–100%", count:1, color:T.success },
            { label:"85–94%",  count:3, color:T.teal    },
            { label:"75–84%",  count:3, color:T.warning  },
            { label:"<75%",    count:1, color:T.muted   },
          ].map(row => (
            <div key={row.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:row.color, display:"inline-block" }} />
                <span style={{ fontSize:12, color:T.bodyText }}>{row.label}</span>
              </div>
              <span style={{ fontSize:13, fontWeight:800, color:T.navy }}>{row.count}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

/* ─── JOBS TAB ───────────────────────────────────────────────────────────── */
const JobsTab = ({ profile }) => {
  const s1 = profile?.s1 || {};
  const s2 = profile?.s2 || {};
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({ title:"", type:"Full-time", salary:"", desc:"" });
  const types = (s1.posTypes||[]).length>0 ? s1.posTypes : ["Full-time","Part-time","Contract","Freelance"];

  return (
    <div style={{ maxWidth:860, margin:"0 auto", padding:"20px 16px", display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:13, color:T.muted }}><strong style={{color:T.navy}}>{MOCK_JOBS.length} posts</strong> · {MOCK_JOBS.filter(j=>j.status==="Active").length} active</span>
        <button onClick={() => setShowForm(s=>!s)}
          style={{ padding:"7px 18px", borderRadius:20, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Lexend', sans-serif" }}>
          {showForm ? "Cancel" : "+ Post New Job"}
        </button>
      </div>

      {showForm && (
        <Card style={{ border:`1.5px solid ${T.teal}` }}>
          <SectionHead>New Job Post</SectionHead>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:T.bodyText, display:"block", marginBottom:4 }}>Job Title *</label>
              <input value={newJob.title} onChange={e=>setNewJob({...newJob,title:e.target.value})} placeholder="e.g. Senior React Developer"
                style={{ width:"100%", boxSizing:"border-box", padding:"8px 12px", borderRadius:6, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"'Lexend', sans-serif", outline:"none" }} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:T.bodyText, display:"block", marginBottom:4 }}>Type</label>
              <select value={newJob.type} onChange={e=>setNewJob({...newJob,type:e.target.value})}
                style={{ width:"100%", padding:"8px 12px", borderRadius:6, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"'Lexend', sans-serif", outline:"none", background:T.white }}>
                {types.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:T.bodyText, display:"block", marginBottom:4 }}>Salary Range</label>
              <input value={newJob.salary} onChange={e=>setNewJob({...newJob,salary:e.target.value})} placeholder={s2.budget||"e.g. ₱40k–₱80k"}
                style={{ width:"100%", boxSizing:"border-box", padding:"8px 12px", borderRadius:6, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"'Lexend', sans-serif", outline:"none" }} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:T.bodyText, display:"block", marginBottom:4 }}>Work Setup</label>
              <input value={s2.workSetup||""} readOnly placeholder="From preferences"
                style={{ width:"100%", boxSizing:"border-box", padding:"8px 12px", borderRadius:6, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"'Lexend', sans-serif", background:T.bg, color:T.muted }} />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.bodyText, display:"block", marginBottom:4 }}>Description</label>
              <textarea rows={3} value={newJob.desc} onChange={e=>setNewJob({...newJob,desc:e.target.value})} placeholder="Responsibilities, requirements, accommodations..."
                style={{ width:"100%", boxSizing:"border-box", padding:"8px 12px", borderRadius:6, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"'Lexend', sans-serif", outline:"none", resize:"vertical" }} />
            </div>
          </div>
          <div style={{ marginTop:12, display:"flex", gap:8 }}>
            <button style={{ padding:"7px 20px", borderRadius:20, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Lexend', sans-serif" }}>Publish</button>
            <button style={{ padding:"7px 20px", borderRadius:20, border:`1px solid ${T.border}`, background:T.white, color:T.muted, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Lexend', sans-serif" }}>Save Draft</button>
          </div>
        </Card>
      )}

      {MOCK_JOBS.map(j => (
        <Card key={j.id} style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:T.navy, display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
              {j.title}
              {j.urgent && <Badge color={T.danger}>Urgent</Badge>}
            </div>
            <div style={{ fontSize:12, color:T.muted }}>{j.type} · {j.posted} · {s2.workSetup||"Remote"}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <Badge color={j.status==="Active"?T.success:T.muted}>{j.status}</Badge>
            <div style={{ fontSize:18, fontWeight:800, color:T.navy, marginTop:4 }}>{j.applicants}</div>
            <div style={{ fontSize:10, color:T.muted }}>applicants</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

/* ─── PROFILE TAB ────────────────────────────────────────────────────────── */
const ProfileTab = ({ profile }) => {
  const s1 = profile?.s1 || {};
  const s2 = profile?.s2 || {};
  const s3 = profile?.s3 || {};
  const s4 = profile?.s4 || {};
  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:"20px 16px", display:"flex", flexDirection:"column", gap:12 }}>
      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ height:80, background:T.teal }} />
        <div style={{ padding:"0 24px 16px", position:"relative" }}>
          <div style={{ marginTop:-36, marginBottom:10, display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
            <div style={{ width:72, height:72, borderRadius:8, border:"3px solid #fff", background:T.white, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
              {s1.logoPreview ? <img src={s1.logoPreview} alt="" style={{ width:"100%", height:"100%", objectFit:"contain", padding:4 }} />
                : <div style={{ width:"100%", height:"100%", background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, color:"#fff", fontWeight:900 }}>{(s1.company||"C")[0]}</div>}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <Badge color={T.success}>Inclusive Employer</Badge>
              {s4.visible!==false && <Badge color={T.teal}>Visible</Badge>}
            </div>
          </div>
          <div style={{ fontSize:20, fontWeight:800, color:T.navy, marginBottom:2 }}>{s1.company||"Your Company"}</div>
          <div style={{ fontSize:13, color:T.muted }}>{s1.industry||"Industry"} · {s1.size||"—"} employees</div>
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card>
          <SectionHead>Company Details</SectionHead>
          {[["Company",s1.company],["Industry",s1.industry],["Size",s1.sizeCustom||s1.size],["Work Setup",s2.workSetup],["Budget",s2.budget],["Exp. Level",s2.expLevel]].filter(r=>r[1]).map(([l,v],i,a)=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:i<a.length-1?`1px solid #f0f0f0`:"none" }}>
              <span style={{ fontSize:12, color:T.muted }}>{l}</span>
              <span style={{ fontSize:12, fontWeight:700, color:T.navy }}>{v}</span>
            </div>
          ))}
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Card>
            <SectionHead>Roles Hiring</SectionHead>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {(s2.roles||[]).length>0 ? s2.roles.map(r=><Badge key={r} color={T.teal}>{r}</Badge>) : <span style={{fontSize:12,color:T.muted}}>Not specified</span>}
            </div>
          </Card>
          <Card>
            <SectionHead>Accommodations</SectionHead>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {(s3.accommodations||[]).length>0 ? s3.accommodations.map(a=><Badge key={a} color={T.success}>{a}</Badge>) : <span style={{fontSize:12,color:T.muted}}>None listed</span>}
            </div>
          </Card>
        </div>
      </div>

      {s4.mission && (
        <Card style={{ borderLeft:`4px solid ${T.teal}` }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.teal, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Mission</div>
          <p style={{ fontSize:14, color:T.bodyText, lineHeight:1.7, margin:0, fontStyle:"italic" }}>"{s4.mission}"</p>
        </Card>
      )}
    </div>
  );
};

/* ─── ANALYTICS TAB ──────────────────────────────────────────────────────── */
const AnalyticsTab = ({ profile }) => {
  const s1 = profile?.s1 || {};
  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"20px 16px", display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {[
          { label:"Profile Views",      value:"128", sub:"↑ 23% this week",   color:T.teal    },
          { label:"Total Applications", value:"40",  sub:"↑ 8 this week",     color:"#0D6B5E" },
          { label:"Acceptance Rate",    value:"42%", sub:"Industry avg: 35%", color:T.success  },
        ].map(stat => (
          <Card key={stat.label}>
            <div style={{ fontSize:28, fontWeight:800, color:T.navy, lineHeight:1 }}>{stat.value}</div>
            <div style={{ fontSize:13, fontWeight:700, color:T.bodyText, marginTop:4 }}>{stat.label}</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{stat.sub}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card>
          <SectionHead>Application Funnel</SectionHead>
          {[
            { label:"Profile Views", value:128, pct:100 },
            { label:"Applications",  value:40,  pct:31  },
            { label:"Reviewed",      value:22,  pct:17  },
            { label:"Shortlisted",   value:10,  pct:8   },
            { label:"Hired",         value:3,   pct:2   },
          ].map(row => (
            <div key={row.label} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:T.bodyText }}>{row.label}</span>
                <span style={{ fontSize:12, fontWeight:800, color:T.navy }}>{row.value}</span>
              </div>
              <ProgressBar value={row.pct} />
            </div>
          ))}
        </Card>
        <Card>
          <SectionHead>Diversity Metrics</SectionHead>
          {[
            { label:"Visual Impairment",   pct:33, color:T.teal    },
            { label:"Hearing Impairment",  pct:25, color:"#0D6B5E" },
            { label:"Mobility Disability", pct:22, color:"#12A090" },
            { label:"Other",               pct:20, color:T.muted   },
          ].map(row => (
            <div key={row.label} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, color:T.bodyText }}>{row.label}</span>
                <span style={{ fontSize:12, fontWeight:800, color:T.navy }}>{row.pct}%</span>
              </div>
              <ProgressBar value={row.pct} color={row.color} />
            </div>
          ))}
        </Card>
      </div>
      {s1.industry && (
        <Card style={{ background:T.teal, border:"none" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.6)", textTransform:"uppercase", marginBottom:6 }}>AI Insight — {s1.industry}</div>
          <p style={{ fontSize:13, color:"#fff", lineHeight:1.6, margin:0 }}>
            Inclusive employers in <strong>{s1.industry}</strong> report <strong>34% higher retention</strong> among PWD hires. Adding assistive technology could improve match quality by ~18%.
          </p>
        </Card>
      )}
    </div>
  );
};

/* ─── MESSAGES TAB ───────────────────────────────────────────────────────── */
const MessagesTab = () => {
  const [selected, setSelected] = useState(0);
  const [msg, setMsg] = useState("");
  const convos = ALL_CANDIDATES.map((c,i) => ({
    ...c,
    lastMsg:["Hi! Very interested in the role.","Thank you for reviewing my application.","Looking forward to hearing from you.","I have relevant accessibility experience.","When can we schedule an interview?","Portfolio attached for your review.","Happy to provide references.","Available for a call anytime."][i]||"Hello!",
    time:`${i+1}h ago`, unread:i<3,
  }));
  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"20px 16px" }}>
      <div style={{ display:"flex", background:T.white, borderRadius:8, border:`1px solid ${T.border}`, overflow:"hidden", height:560 }}>
        <div style={{ width:260, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, fontSize:14, fontWeight:800, color:T.navy }}>Messages</div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {convos.map((c,i) => (
              <div key={c.id} onClick={() => setSelected(i)}
                style={{ display:"flex", gap:8, padding:"10px 12px", cursor:"pointer", background:selected===i?"#E8F5F3":"transparent", borderBottom:`1px solid #f0f0f0` }}>
                <Avatar initials={c.initials} size={36} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, fontWeight:700, color:T.navy }}>{c.name}</span>
                    <span style={{ fontSize:10, color:T.muted }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize:11, color:T.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.lastMsg}</div>
                </div>
                {c.unread && <div style={{ width:7, height:7, borderRadius:"50%", background:T.teal, flexShrink:0, marginTop:4 }} />}
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"10px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:10 }}>
            <Avatar initials={convos[selected]?.initials} size={34} />
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:T.navy }}>{convos[selected]?.name}</div>
              <div style={{ fontSize:11, color:T.success }}>Online</div>
            </div>
            <Badge color={T.success} style={{ marginLeft:"auto" }}>{convos[selected]?.disability}</Badge>
          </div>
          <div style={{ flex:1, padding:"14px", display:"flex", flexDirection:"column", justifyContent:"flex-end", gap:8, overflowY:"auto" }}>
            <div style={{ alignSelf:"flex-start", maxWidth:"65%", padding:"10px 13px", borderRadius:"12px 12px 12px 3px", background:T.bg, border:`1px solid ${T.border}`, fontSize:13, color:T.bodyText, lineHeight:1.5 }}>{convos[selected]?.lastMsg}</div>
            <div style={{ alignSelf:"flex-end", maxWidth:"65%", padding:"10px 13px", borderRadius:"12px 12px 3px 12px", background:T.teal, fontSize:13, color:"#fff", lineHeight:1.5 }}>Thanks for reaching out! We'll review your application shortly.</div>
          </div>
          <div style={{ padding:"10px 12px", borderTop:`1px solid ${T.border}`, display:"flex", gap:8 }}>
            <input placeholder="Write a message..." value={msg} onChange={e=>setMsg(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&msg.trim()) setMsg(""); }}
              style={{ flex:1, padding:"8px 12px", borderRadius:20, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"'Lexend', sans-serif", outline:"none", background:T.bg }} />
            <button onClick={()=>setMsg("")}
              style={{ padding:"8px 16px", borderRadius:20, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Lexend', sans-serif" }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── SETTINGS TAB ───────────────────────────────────────────────────────── */
const SettingsTab = ({ profile, onReset }) => {
  const s3 = profile?.s3 || {};
  const [notifs, setNotifs] = useState({ matches:s3.notifications!==false, ai:s3.aiSuggest!==false, apps:true });
  const Toggle = ({ checked, onChange }) => (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      style={{ width:48, height:26, borderRadius:999, border:"none", cursor:"pointer", background:checked?T.teal:"#C4CDD6", position:"relative", transition:"background 0.2s", flexShrink:0, padding:0, outline:"none" }}>
      <span style={{ position:"absolute", top:3, left:checked?25:3, width:20, height:20, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 3px rgba(0,0,0,0.2)", transition:"left 0.2s", display:"block" }} />
    </button>
  );
  return (
    <div style={{ maxWidth:580, margin:"0 auto", padding:"20px 16px", display:"flex", flexDirection:"column", gap:12 }}>
      <Card>
        <SectionHead>Account</SectionHead>
        {["Email Address","Phone Number","New Password"].map(f => (
          <div key={f} style={{ marginBottom:10 }}>
            <label style={{ fontSize:12, fontWeight:700, color:T.bodyText, display:"block", marginBottom:4 }}>{f}</label>
            <input type={f.includes("Password")?"password":"text"} placeholder={f.includes("Password")?"••••••••":`Enter ${f.toLowerCase()}`}
              style={{ width:"100%", boxSizing:"border-box", padding:"8px 12px", borderRadius:6, border:`1px solid ${T.border}`, fontSize:13, fontFamily:"'Lexend', sans-serif", outline:"none" }} />
          </div>
        ))}
        <button style={{ padding:"7px 20px", borderRadius:20, border:"none", background:T.teal, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Lexend', sans-serif" }}>Save</button>
      </Card>
      <Card>
        <SectionHead>Notifications</SectionHead>
        {[
          { key:"matches", label:"New candidate matches",  sub:"Notified when new matches are found" },
          { key:"ai",      label:"AI recommendations",     sub:"Daily AI-powered suggestions"        },
          { key:"apps",    label:"Application updates",    sub:"Status updates from candidates"      },
        ].map(item => (
          <div key={item.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid #f0f0f0` }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.navy }}>{item.label}</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:1 }}>{item.sub}</div>
            </div>
            <Toggle checked={notifs[item.key]} onChange={v=>setNotifs({...notifs,[item.key]:v})} />
          </div>
        ))}
      </Card>
      <Card>
        <SectionHead>Danger Zone</SectionHead>
        <p style={{ fontSize:13, color:T.muted, margin:"0 0 10px", lineHeight:1.5 }}>This clears all onboarding data and restarts the setup flow.</p>
        <button onClick={onReset}
          style={{ padding:"7px 18px", borderRadius:20, border:`1.5px solid ${T.danger}`, background:"#FEF2F2", color:T.danger, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Lexend', sans-serif" }}>
          Reset Onboarding
        </button>
      </Card>
    </div>
  );
};

/* ─── MAIN ───────────────────────────────────────────────────────────────── */
export default function EmployerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("inklusijobs_employer");
      if (raw) setProfile(JSON.parse(raw));
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
    setMounted(true);
  }, []);

  const handleReset = () => {
    localStorage.removeItem("inklusijobs_employer");
    router.replace("/employer/onboarding");
  };

  if (!mounted) return null;

  return (
    <>
      <LexendFont />
      <div style={{ minHeight:"100vh", background:T.bg }}>
      <TopNav active={activeTab} onTab={setActiveTab} profile={profile} onReset={handleReset} />
      {activeTab === "overview"   && <OverviewTab   profile={profile} onTab={setActiveTab} />}
      {activeTab === "candidates" && <CandidatesTab profile={profile} />}
      {activeTab === "jobs"       && <JobsTab       profile={profile} />}
      {activeTab === "profile"    && <ProfileTab    profile={profile} />}
      {activeTab === "analytics"  && <AnalyticsTab  profile={profile} />}
      {activeTab === "messages"   && <MessagesTab />}
      {activeTab === "settings"   && <SettingsTab   profile={profile} onReset={handleReset} />}
    </div>
    </>
  );
}
import { useEffect, useRef, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Syne:wght@600;700&display=swap');

  .sc-root * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes sc-fadeUp   { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
  @keyframes sc-fadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes sc-cardIn   { from { opacity:0; transform:translateY(16px) scale(0.97) } to { opacity:1; transform:translateY(0) scale(1) } }
  @keyframes sc-shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes sc-floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes sc-pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
  @keyframes sc-blink    { 0%,100%{opacity:1} 50%{opacity:0.25} }
  @keyframes sc-barGrow  { from{width:0} to{width:var(--w)} }
  @keyframes sc-borderP  { 0%,100%{border-color:#378ADD} 50%{border-color:#7F77DD} }
  @keyframes sc-countUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  .sc-root {
    font-family: 'DM Sans', sans-serif;
    background: #f7f7f5;
    color: #1a1a1a;
    min-height: 100vh;
  }

  /* ── NAV ── */
  .sc-nav {
    background: #fff;
    border-bottom: 0.5px solid rgba(0,0,0,0.08);
    position: sticky; top: 0; z-index: 100;
  }
  .sc-nav-inner {
    max-width: 1100px; margin: 0 auto; padding: 0 2rem;
    display: flex; justify-content: space-between; align-items: center; height: 60px;
  }
  .sc-logo { display:flex; align-items:center; gap:10px; }
  .sc-logo-mark {
    width:34px; height:34px; background:#185FA5; border-radius:9px;
    display:flex; align-items:center; justify-content:center;
    animation: sc-pulse 3s ease-in-out infinite;
  }
  .sc-logo-name { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:#1a1a1a; letter-spacing:-0.3px; }
  .sc-nav-links { display:flex; gap:28px; }
  .sc-nav-link { font-size:14px; color:#555; text-decoration:none; transition:color 0.2s; cursor:pointer; }
  .sc-nav-link:hover { color:#185FA5; }
  .sc-nav-pill {
    display:flex; align-items:center; gap:6px;
    font-size:12px; font-weight:500; background:#E6F1FB; color:#0C447C;
    padding:4px 12px; border-radius:20px; border:0.5px solid #85B7EB;
  }
  .sc-nav-dot { width:6px; height:6px; border-radius:50%; background:#1D9E75; animation:sc-blink 1.8s ease infinite; }
  .sc-nav-right { display:flex; align-items:center; gap:10px; }

  /* ── BUTTONS ── */
  .sc-btn-primary {
    background:#185FA5; color:#E6F1FB; font-family:'DM Sans',sans-serif;
    font-size:14px; font-weight:500; padding:10px 22px; border-radius:9px;
    border:none; cursor:pointer; transition:transform 0.15s, background 0.2s;
  }
  .sc-btn-primary:hover { background:#0C447C; transform:translateY(-1px); }
  .sc-btn-outline {
    background:transparent; color:#1a1a1a; font-family:'DM Sans',sans-serif;
    font-size:14px; font-weight:500; padding:10px 22px; border-radius:9px;
    border:0.5px solid rgba(0,0,0,0.2); cursor:pointer; transition:transform 0.15s,background 0.2s;
  }
  .sc-btn-outline:hover { background:#f0f0ee; transform:translateY(-1px); }

  /* ── HERO ── */
  .sc-hero { background:#fff; border-bottom:0.5px solid rgba(0,0,0,0.08); overflow:hidden; }
  .sc-hero-inner {
    max-width:1100px; margin:0 auto; padding:72px 2rem 64px;
    display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center;
  }
  .sc-hero-eyebrow {
    display:inline-flex; align-items:center; gap:7px;
    background:#E6F1FB; color:#0C447C;
    font-size:12px; font-weight:500; padding:5px 14px; border-radius:20px;
    margin-bottom:18px; animation:sc-fadeIn 0.5s ease both;
  }
  .sc-hero-eyebrow-dot { width:6px; height:6px; border-radius:50%; background:#1D9E75; animation:sc-blink 1.8s ease infinite; }
  .sc-hero-title {
    font-family:'Syne',sans-serif; font-size:42px; font-weight:700;
    color:#1a1a1a; line-height:1.12; letter-spacing:-1.2px;
    margin-bottom:16px; animation:sc-fadeUp 0.6s ease 0.1s both;
  }
  .sc-hero-accent {
    background: linear-gradient(90deg,#185FA5,#534AB7,#0F6E56,#185FA5);
    background-size:300% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
    animation:sc-shimmer 4s linear infinite;
  }
  .sc-hero-sub {
    font-size:15px; color:#666; line-height:1.7; margin-bottom:28px;
    max-width:420px; animation:sc-fadeUp 0.6s ease 0.2s both;
  }
  .sc-hero-actions { display:flex; gap:10px; margin-bottom:28px; animation:sc-fadeUp 0.6s ease 0.3s both; flex-wrap:wrap; }
  .sc-trust-row { display:flex; align-items:center; gap:14px; animation:sc-fadeUp 0.6s ease 0.4s both; flex-wrap:wrap; }
  .sc-trust-item { display:flex; align-items:center; gap:6px; font-size:12px; color:#777; }
  .sc-trust-dot { width:5px; height:5px; border-radius:50%; background:#1D9E75; }
  .sc-trust-div { width:1px; height:14px; background:rgba(0,0,0,0.1); }

  /* ── LIVE PANEL ── */
  .sc-live-panel { display:flex; flex-direction:column; gap:10px; animation:sc-fadeUp 0.6s ease 0.2s both; }
  .sc-live-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
  .sc-live-title { font-size:11px; font-weight:500; color:#888; text-transform:uppercase; letter-spacing:0.8px; }
  .sc-live-badge {
    display:flex; align-items:center; gap:5px;
    font-size:11px; color:#0F6E56; background:#E1F5EE;
    padding:3px 8px; border-radius:10px;
  }
  .sc-live-dot { width:5px; height:5px; border-radius:50%; background:#1D9E75; animation:sc-blink 1.5s ease infinite; }
  .sc-booking-card {
    background:#fff; border:0.5px solid rgba(0,0,0,0.08); border-radius:13px;
    padding:14px 16px; display:flex; align-items:center; gap:12px;
    transition:transform 0.2s, border-color 0.2s; cursor:default;
  }
  .sc-booking-card:hover { transform:translateX(3px); border-color:rgba(0,0,0,0.16); }
  .sc-booking-card:nth-child(2) { animation:sc-cardIn 0.5s ease 0.5s both; }
  .sc-booking-card:nth-child(3) { animation:sc-cardIn 0.5s ease 0.65s both; }
  .sc-booking-card:nth-child(4) { animation:sc-cardIn 0.5s ease 0.8s both; }
  .sc-booking-card:nth-child(5) { animation:sc-cardIn 0.5s ease 0.95s both; }
  .sc-bc-icon {
    width:38px; height:38px; border-radius:10px;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .sc-ic-blue { background:#E6F1FB; }
  .sc-ic-teal { background:#E1F5EE; }
  .sc-ic-amber { background:#FAEEDA; }
  .sc-ic-purple { background:#EEEDFE; }
  .sc-bc-info { flex:1; min-width:0; }
  .sc-bc-name { font-size:13px; font-weight:500; color:#1a1a1a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .sc-bc-sub { font-size:11px; color:#888; margin-top:2px; }
  .sc-status {
    font-size:11px; font-weight:500; padding:3px 9px;
    border-radius:20px; white-space:nowrap; flex-shrink:0;
  }
  .sc-s-green  { background:#E1F5EE; color:#085041; }
  .sc-s-amber  { background:#FAEEDA; color:#633806; }
  .sc-s-blue   { background:#E6F1FB; color:#0C447C; }
  .sc-s-purple { background:#EEEDFE; color:#3C3489; }

  /* ── STATS BAR ── */
  .sc-stats-bar { background:#fff; border-top:0.5px solid rgba(0,0,0,0.08); border-bottom:0.5px solid rgba(0,0,0,0.08); }
  .sc-stats-grid {
    max-width:1100px; margin:0 auto; padding:0 2rem;
    display:grid; grid-template-columns:repeat(4,1fr);
    border-left:0.5px solid rgba(0,0,0,0.08);
  }
  .sc-stat-cell {
    padding:28px 24px; border-right:0.5px solid rgba(0,0,0,0.08);
    animation:sc-countUp 0.5s ease both;
  }
  .sc-stat-cell:nth-child(1){animation-delay:0.1s}
  .sc-stat-cell:nth-child(2){animation-delay:0.2s}
  .sc-stat-cell:nth-child(3){animation-delay:0.3s}
  .sc-stat-cell:nth-child(4){animation-delay:0.4s}
  .sc-stat-num { font-family:'Syne',sans-serif; font-size:28px; font-weight:700; color:#1a1a1a; letter-spacing:-0.6px; line-height:1.1; margin-bottom:4px; }
  .sc-stat-lbl { font-size:12px; color:#888; }
  .sc-stat-trend { font-size:11px; color:#0F6E56; margin-top:4px; display:flex; align-items:center; gap:3px; }

  /* ── SECTION COMMONS ── */
  .sc-section { padding:72px 2rem; }
  .sc-section-inner { max-width:1100px; margin:0 auto; }
  .sc-chip {
    display:inline-block; font-size:11px; font-weight:500;
    padding:4px 12px; border-radius:20px; margin-bottom:10px;
    text-transform:uppercase; letter-spacing:0.7px;
  }
  .sc-chip-purple { color:#534AB7; background:#EEEDFE; }
  .sc-chip-blue   { color:#185FA5; background:#E6F1FB; }
  .sc-chip-teal   { color:#0F6E56; background:#E1F5EE; }
  .sc-section-h {
    font-family:'Syne',sans-serif; font-size:30px; font-weight:700;
    color:#1a1a1a; letter-spacing:-0.5px; margin-bottom:8px;
  }
  .sc-section-p { font-size:14px; color:#777; margin-bottom:44px; }

  /* ── FEATURE CARDS ── */
  .sc-features-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; }
  .sc-feat-card {
    background:#fff; border:0.5px solid rgba(0,0,0,0.08); border-radius:14px;
    padding:28px; transition:transform 0.2s, border-color 0.2s;
    animation:sc-cardIn 0.5s ease both; cursor:default;
    position:relative; overflow:hidden;
  }
  .sc-feat-card:nth-child(1){animation-delay:0.1s; border-color:#85B7EB;}
  .sc-feat-card:nth-child(2){animation-delay:0.2s;}
  .sc-feat-card:nth-child(3){animation-delay:0.3s;}
  .sc-feat-card:hover { transform:translateY(-3px); border-color:rgba(0,0,0,0.15); }
  .sc-feat-card:nth-child(1):hover { animation:sc-borderP 1.5s ease infinite; }
  .sc-feat-accent { position:absolute; top:0; left:0; right:0; height:3px; border-radius:14px 14px 0 0; }
  .sc-acc-blue   { background:#185FA5; }
  .sc-acc-teal   { background:#1D9E75; }
  .sc-acc-purple { background:#534AB7; }
  .sc-feat-icon {
    width:44px; height:44px; border-radius:11px;
    display:flex; align-items:center; justify-content:center;
    margin-bottom:18px; transition:transform 0.2s;
  }
  .sc-feat-card:hover .sc-feat-icon { transform:scale(1.08); }
  .sc-feat-title { font-size:15px; font-weight:500; color:#1a1a1a; margin-bottom:8px; }
  .sc-feat-desc { font-size:13px; color:#777; line-height:1.65; margin-bottom:18px; }
  .sc-feat-tag { display:inline-block; font-size:11px; font-weight:500; padding:3px 10px; border-radius:20px; }
  .sc-tag-blue   { background:#E6F1FB; color:#0C447C; }
  .sc-tag-teal   { background:#E1F5EE; color:#085041; }
  .sc-tag-purple { background:#EEEDFE; color:#3C3489; }

  /* ── WORKFLOW ── */
  .sc-workflow { background:#fff; padding:72px 2rem; border-top:0.5px solid rgba(0,0,0,0.08); border-bottom:0.5px solid rgba(0,0,0,0.08); }
  .sc-steps-row { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:0; position:relative; }
  .sc-step { padding:24px 20px; position:relative; animation:sc-fadeUp 0.5s ease both; }
  .sc-step:nth-child(1){animation-delay:0.1s}
  .sc-step:nth-child(2){animation-delay:0.2s}
  .sc-step:nth-child(3){animation-delay:0.3s}
  .sc-step:nth-child(4){animation-delay:0.4s}
  .sc-step-num {
    width:36px; height:36px; border-radius:50%;
    background:#E6F1FB; color:#0C447C; font-size:14px; font-weight:500;
    display:flex; align-items:center; justify-content:center;
    margin-bottom:14px; border:0.5px solid #85B7EB; position:relative; z-index:1;
  }
  .sc-step-connector {
    position:absolute; top:42px; left:calc(50% + 18px);
    right:calc(-50% + 18px); height:0.5px;
    background:rgba(0,0,0,0.1); z-index:0;
  }
  .sc-step-title { font-size:14px; font-weight:500; color:#1a1a1a; margin-bottom:6px; }
  .sc-step-desc { font-size:12px; color:#777; line-height:1.6; }

  /* ── USAGE ── */
  .sc-usage-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .sc-usage-card {
    background:#fff; border:0.5px solid rgba(0,0,0,0.08); border-radius:14px;
    padding:24px; animation:sc-cardIn 0.5s ease both;
  }
  .sc-usage-card:nth-child(1){animation-delay:0.1s}
  .sc-usage-card:nth-child(2){animation-delay:0.2s}
  .sc-usage-card-title {
    font-size:14px; font-weight:500; color:#1a1a1a;
    margin-bottom:16px; display:flex; align-items:center; gap:8px;
  }
  .sc-usage-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; }
  .sc-bar-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
  .sc-bar-label { font-size:12px; color:#777; width:90px; flex-shrink:0; }
  .sc-bar-track { flex:1; height:6px; background:#f0f0ee; border-radius:3px; overflow:hidden; }
  .sc-bar-fill { height:6px; border-radius:3px; animation:sc-barGrow 1s ease 0.5s both; }
  .sc-bar-pct { font-size:12px; color:#777; width:32px; text-align:right; }
  .sc-activity-item {
    display:flex; align-items:flex-start; gap:10px;
    padding:10px 0; border-bottom:0.5px solid rgba(0,0,0,0.06);
  }
  .sc-activity-item:last-child { border-bottom:none; }
  .sc-activity-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; margin-top:4px; }
  .sc-activity-text { font-size:12px; color:#1a1a1a; line-height:1.5; }
  .sc-activity-time { font-size:11px; color:#aaa; }

  /* ── CTA ── */
  .sc-cta {
    background:#fff; border-top:0.5px solid rgba(0,0,0,0.08);
    padding:80px 2rem; text-align:center;
  }
  .sc-cta-ring {
    width:64px; height:64px; border-radius:50%;
    background:#E6F1FB; border:0.5px solid #85B7EB;
    display:flex; align-items:center; justify-content:center;
    margin:0 auto 20px; animation:sc-floatY 3s ease-in-out infinite;
  }
  .sc-cta-title { font-family:'Syne',sans-serif; font-size:30px; font-weight:700; color:#1a1a1a; letter-spacing:-0.5px; margin-bottom:10px; }
  .sc-cta-sub { font-size:15px; color:#777; margin-bottom:28px; max-width:480px; margin-left:auto; margin-right:auto; line-height:1.65; }
  .sc-cta-actions { display:flex; justify-content:center; gap:10px; flex-wrap:wrap; }
  .sc-cta-note { font-size:12px; color:#aaa; margin-top:16px; }

  /* ── FOOTER ── */
  .sc-footer { background:#f0f0ee; border-top:0.5px solid rgba(0,0,0,0.08); padding:28px 2rem; }
  .sc-footer-inner { max-width:1100px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
  .sc-footer-copy { font-size:13px; color:#888; }
  .sc-footer-links { display:flex; gap:20px; }
  .sc-footer-link { font-size:13px; color:#888; text-decoration:none; transition:color 0.2s; cursor:pointer; }
  .sc-footer-link:hover { color:#1a1a1a; }

  @media (max-width: 768px) {
    .sc-hero-inner { grid-template-columns:1fr; padding:48px 1.25rem 40px; gap:36px; }
    .sc-hero-title { font-size:32px; }
    .sc-features-grid { grid-template-columns:1fr; }
    .sc-stats-grid { grid-template-columns:repeat(2,1fr); }
    .sc-steps-row { grid-template-columns:1fr 1fr; }
    .sc-usage-grid { grid-template-columns:1fr; }
    .sc-step-connector { display:none; }
    .sc-nav-links { display:none; }
    .sc-section { padding:48px 1.25rem; }
  }
`;

const ArrowUpIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 7L5 3L8 7" stroke="#0F6E56" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CalendarIcon = ({ color = "#185FA5" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2" y="3" width="14" height="12" rx="2" stroke={color} strokeWidth="1.2" />
    <path d="M6 3V7M12 3V7M2 8H16" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const ClockIcon = ({ color = "#0F6E56" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="6" stroke={color} strokeWidth="1.2" />
    <path d="M9 6V9.5L11 11" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const GridPlusIcon = ({ color = "#534AB7" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="3" y="3" width="12" height="12" rx="2" stroke={color} strokeWidth="1.2" />
    <path d="M6 9H12M9 6V12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const AlertIcon = ({ color = "#854F0B" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2L16 6V12L9 16L2 12V6L9 2Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M9 7V9.5M9 11.5V12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const LogoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#E6F1FB" />
    <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#E6F1FB" />
    <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#E6F1FB" />
    <rect x="10" y="10" width="6" height="6" rx="1.5" fill="#85B7EB" />
  </svg>
);

const bookings = [
  { icon: <CalendarIcon />, bg: "sc-ic-blue", name: "Lecture Hall B-204", sub: "Today · 2:00 PM – 4:00 PM · 120 seats", status: "Confirmed", statusClass: "sc-s-green" },
  { icon: <ClockIcon />, bg: "sc-ic-teal", name: "Chemistry Lab — Set A", sub: "Tomorrow · 9:00 AM – 12:00 PM", status: "Pending", statusClass: "sc-s-amber" },
  { icon: <GridPlusIcon />, bg: "sc-ic-purple", name: "Computer Lab 3", sub: "Friday · 10:00 AM – 1:00 PM · 40 PCs", status: "Approved", statusClass: "sc-s-purple" },
  { icon: <AlertIcon />, bg: "sc-ic-amber", name: "Maintenance #1052", sub: "Projector fault · Block C · ETA 2 hrs", status: "In review", statusClass: "sc-s-blue" },
];

const stats = [
  { num: "2,400+", label: "Monthly bookings", trend: "+18% vs last month" },
  { num: "340", label: "Bookable resources", trend: "12 added this term" },
  { num: "98.2%", label: "Booking accuracy", trend: "Zero conflicts this week" },
  { num: "<4 hrs", label: "Avg. issue resolution", trend: "Down from 11 hrs" },
];

const features = [
  {
    accentClass: "sc-acc-blue", iconBg: "sc-ic-blue", tagClass: "sc-tag-blue", tag: "Core module",
    title: "Smart scheduling",
    desc: "Conflict-free booking engine ensures no double-bookings. Find and reserve available rooms and equipment in seconds.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="3" width="16" height="14" rx="2.5" stroke="#185FA5" strokeWidth="1.3" />
        <path d="M7 3V8M13 3V8M2 9H18" stroke="#185FA5" strokeWidth="1.3" strokeLinecap="round" />
        <rect x="5" y="12" width="3" height="2" rx="0.5" fill="#185FA5" />
        <rect x="9" y="12" width="3" height="2" rx="0.5" fill="#185FA5" />
      </svg>
    ),
  },
  {
    accentClass: "sc-acc-teal", iconBg: "sc-ic-teal", tagClass: "sc-tag-teal", tag: "Real-time data",
    title: "Facility catalogue",
    desc: "Browse all campus resources, check capacities, and see live availability before making a booking request.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="4" width="14" height="12" rx="2" stroke="#0F6E56" strokeWidth="1.3" />
        <path d="M7 4V2M13 4V2M6 10H14M6 13H10" stroke="#0F6E56" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    accentClass: "sc-acc-purple", iconBg: "sc-ic-purple", tagClass: "sc-tag-purple", tag: "Priority routing",
    title: "IT & maintenance",
    desc: "Report faults instantly, upload photos of damaged equipment, and track every ticket through to resolution.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L17 6V14L10 18L3 14V6L10 2Z" stroke="#534AB7" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M10 7V11M10 13V13.5" stroke="#534AB7" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

const steps = [
  { num: "1", title: "Search resources", desc: "Filter by type, capacity, date, or location to find what you need instantly.", last: false },
  { num: "2", title: "Check availability", desc: "See real-time slot availability and choose a time that works for you.", last: false },
  { num: "3", title: "Confirm booking", desc: "Submit and receive instant email and in-app confirmation.", last: false },
  { num: "4", title: "Show up & go", desc: "Walk in with your booking QR code. No admin, no friction, no queues.", last: true },
];

const bars = [
  { label: "Lecture halls", pct: 84, color: "#185FA5" },
  { label: "Computer labs", pct: 71, color: "#534AB7" },
  { label: "Science labs", pct: 58, color: "#1D9E75" },
  { label: "Meeting rooms", pct: 47, color: "#BA7517" },
  { label: "Study spaces", pct: 92, color: "#D85A30" },
];

const activities = [
  { color: "#185FA5", text: "Lecture Hall A-101 booked by Dr. Perera for 3 hrs", time: "2 min ago" },
  { color: "#1D9E75", text: "Maintenance #1051 resolved — Projector in Block B", time: "14 min ago" },
  { color: "#534AB7", text: "Computer Lab 2 booking approved for CS3042", time: "28 min ago" },
  { color: "#BA7517", text: "New fault reported — AC unit, Engineering Block", time: "41 min ago" },
];

export default function Home() {
  const styleRef = useRef(null);

  useEffect(() => {
    const tag = document.createElement("style");
    tag.innerHTML = styles;
    document.head.appendChild(tag);
    styleRef.current = tag;
    return () => { if (styleRef.current) document.head.removeChild(styleRef.current); };
  }, []);

  return (
    <div className="sc-root">

      {/* NAV */}
      <nav className="sc-nav">
        <div className="sc-nav-inner">
          <div className="sc-logo">
            <div className="sc-logo-mark"><LogoIcon /></div>
            <span className="sc-logo-name">SmartCampus</span>
          </div>
          <div className="sc-nav-links">
            <a className="sc-nav-link">Facilities</a>
            <a className="sc-nav-link">My bookings</a>
            <a className="sc-nav-link">Support desk</a>
          </div>
          <div className="sc-nav-right">
            <div className="sc-nav-pill">
              <span className="sc-nav-dot" />
              342 rooms live
            </div>
            <button className="sc-btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>Sign in</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="sc-hero">
        <div className="sc-hero-inner">
          <div>
            <div className="sc-hero-eyebrow">
              <span className="sc-hero-eyebrow-dot" />
              New — AI-powered scheduling is here
            </div>
            <h1 className="sc-hero-title">
              Campus operations,<br />
              <span className="sc-hero-accent">simplified.</span>
            </h1>
            <p className="sc-hero-sub">
              Reserve lecture halls, book lab equipment, and report maintenance issues — all in one unified platform built for modern universities.
            </p>
            <div className="sc-hero-actions">
              <button className="sc-btn-primary">Book a resource</button>
              <button className="sc-btn-outline">Report an issue</button>
            </div>
            <div className="sc-trust-row">
              <div className="sc-trust-item"><span className="sc-trust-dot" />No double-bookings</div>
              <div className="sc-trust-div" />
              <div className="sc-trust-item"><span className="sc-trust-dot" />Real-time availability</div>
              <div className="sc-trust-div" />
              <div className="sc-trust-item"><span className="sc-trust-dot" />Instant notifications</div>
            </div>
          </div>

          {/* LIVE PANEL */}
          <div className="sc-live-panel">
            <div className="sc-live-header">
              <span className="sc-live-title">Live bookings</span>
              <span className="sc-live-badge"><span className="sc-live-dot" />Updated now</span>
            </div>
            {bookings.map((b, i) => (
              <div key={i} className="sc-booking-card">
                <div className={`sc-bc-icon ${b.bg}`}>{b.icon}</div>
                <div className="sc-bc-info">
                  <div className="sc-bc-name">{b.name}</div>
                  <div className="sc-bc-sub">{b.sub}</div>
                </div>
                <span className={`sc-status ${b.statusClass}`}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="sc-stats-bar">
        <div className="sc-stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="sc-stat-cell">
              <div className="sc-stat-num">{s.num}</div>
              <div className="sc-stat-lbl">{s.label}</div>
              <div className="sc-stat-trend"><ArrowUpIcon />{s.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="sc-section" style={{ background: "#f7f7f5" }}>
        <div className="sc-section-inner">
          <span className="sc-chip sc-chip-purple">Platform features</span>
          <h2 className="sc-section-h">Everything you need, in one place</h2>
          <p className="sc-section-p">A seamless experience designed for students, staff, and administrators.</p>
          <div className="sc-features-grid">
            {features.map((f, i) => (
              <div key={i} className="sc-feat-card">
                <div className={`sc-feat-accent ${f.accentClass}`} />
                <div className={`sc-feat-icon ${f.iconBg}`}>{f.icon}</div>
                <div className="sc-feat-title">{f.title}</div>
                <div className="sc-feat-desc">{f.desc}</div>
                <span className={`sc-feat-tag ${f.tagClass}`}>{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="sc-workflow">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span className="sc-chip sc-chip-blue">How it works</span>
          <h2 className="sc-section-h">Book in four simple steps</h2>
          <p className="sc-section-p" style={{ marginBottom: 36 }}>From search to confirmation in under 30 seconds.</p>
          <div className="sc-steps-row">
            {steps.map((s, i) => (
              <div key={i} className="sc-step">
                <div className="sc-step-num">{s.num}</div>
                {!s.last && <div className="sc-step-connector" />}
                <div className="sc-step-title">{s.title}</div>
                <div className="sc-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USAGE */}
      <section className="sc-section" style={{ background: "#f7f7f5" }}>
        <div className="sc-section-inner">
          <span className="sc-chip sc-chip-teal">Usage insights</span>
          <h2 className="sc-section-h">Campus at a glance</h2>
          <p className="sc-section-p">Live utilisation and recent activity across all facilities.</p>
          <div className="sc-usage-grid">
            <div className="sc-usage-card">
              <div className="sc-usage-card-title">
                <div className="sc-usage-icon sc-ic-blue">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="1" width="12" height="12" rx="2" stroke="#185FA5" strokeWidth="1.1" />
                    <path d="M3 7H11M3 4H11M3 10H8" stroke="#185FA5" strokeWidth="1.1" strokeLinecap="round" />
                  </svg>
                </div>
                Room utilisation this week
              </div>
              {bars.map((b, i) => (
                <div key={i} className="sc-bar-row">
                  <span className="sc-bar-label">{b.label}</span>
                  <div className="sc-bar-track">
                    <div className="sc-bar-fill" style={{ "--w": `${b.pct}%`, width: `${b.pct}%`, background: b.color }} />
                  </div>
                  <span className="sc-bar-pct">{b.pct}%</span>
                </div>
              ))}
            </div>
            <div className="sc-usage-card">
              <div className="sc-usage-card-title">
                <div className="sc-usage-icon sc-ic-teal">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5" stroke="#0F6E56" strokeWidth="1.1" />
                    <path d="M7 4.5V7L8.5 8.5" stroke="#0F6E56" strokeWidth="1.1" strokeLinecap="round" />
                  </svg>
                </div>
                Recent activity
              </div>
              {activities.map((a, i) => (
                <div key={i} className="sc-activity-item">
                  <span className="sc-activity-dot" style={{ background: a.color }} />
                  <div>
                    <div className="sc-activity-text">{a.text}</div>
                    <div className="sc-activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sc-cta">
        <div className="sc-cta-ring">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="4" y="5" width="20" height="18" rx="3" stroke="#185FA5" strokeWidth="1.4" />
            <path d="M10 5V10M18 5V10M4 13H24" stroke="#185FA5" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M9 18L12 21L19 14" stroke="#1D9E75" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="sc-cta-title">Ready to take control of your campus?</h2>
        <p className="sc-cta-sub">Join thousands of students and staff already using SmartCampus every day. Free to get started.</p>
        <div className="sc-cta-actions">
          <button className="sc-btn-primary">Get started — it's free</button>
          <button className="sc-btn-outline">Watch a demo</button>
        </div>
        <p className="sc-cta-note">No credit card required · Set up in under 5 minutes · SSO supported</p>
      </section>

      {/* FOOTER */}
      <footer className="sc-footer">
        <div className="sc-footer-inner">
          <span className="sc-footer-copy">© 2026 SmartCampus. All rights reserved.</span>
          <div className="sc-footer-links">
            <a className="sc-footer-link">Privacy</a>
            <a className="sc-footer-link">Terms</a>
            <a className="sc-footer-link">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
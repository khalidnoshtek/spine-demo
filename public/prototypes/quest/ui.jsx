/* ============================================================
   Shared UI primitives
   ============================================================ */

// ---------- Progress ring ----------
function Ring({ size = 130, stroke = 13, value = 0, max = 100, grad = "score",
                track = "var(--track)", rounded = true, children, animate = true }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  // resting state shows the TARGET so it's correct even if the clock is paused;
  // animate down-from-0 only when rAF actually advances.
  const [shown, setShown] = React.useState(pct);
  React.useEffect(() => {
    if (!animate) { setShown(pct); return; }
    let raf1, raf2;
    raf1 = requestAnimationFrame(() => { setShown(0);
      raf2 = requestAnimationFrame(() => setShown(pct)); });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [pct, animate]);
  const gid = "rg_" + grad;
  const stops = {
    score: ["#34E0C4", "#7C83FF"],
    primary: ["#7C83FF", "#B06CFF"],
    pink: ["#F472B6", "#FB7185"],
    coin: ["#FFD75E", "#F59E0B"],
    flame: ["#FF9F5A", "#FB6B7B"],
    teal: ["#34E0C4", "#16B8A0"],
    green: ["#5BE38B", "#16B8A0"],
  }[grad] || ["#7C83FF", "#B06CFF"];
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={stops[0]} />
            <stop offset="1" stopColor={stops[1]} />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`url(#${gid})`}
                strokeWidth={stroke} strokeLinecap={rounded ? "round" : "butt"}
                strokeDasharray={c} strokeDashoffset={c * (1 - shown)}
                style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
}

// ---------- mini bar ----------
function Bar({ value, max = 100, grad = "var(--grad-primary)", h = 9 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return <div className="bar" style={{ height: h }}><span style={{ width: pct + "%", background: grad }} /></div>;
}

// ---------- stat tile ----------
function Tile({ icon, iconBg, iconColor, label, value, unit, sub, subColor, onClick, accent }) {
  return (
    <button className="tile tile-tap" onClick={onClick} style={{ textAlign: "left", borderColor: accent ? accent + "44" : undefined }}>
      <div className="tile-ico" style={{ background: iconBg, color: iconColor }}>
        <Icon name={icon} size={19} sw={2.2} />
      </div>
      <div className="tile-label">{label}</div>
      <div className="tile-value num">{value}{unit && <small> {unit}</small>}</div>
      {sub && <div className="tile-sub" style={{ color: subColor || "var(--text-faint)" }}>{sub}</div>}
    </button>
  );
}

// ---------- section header ----------
function Section({ title, link, onLink }) {
  return (
    <div className="section-head">
      <div className="section-title">{title}</div>
      {link && <button className="section-link" onClick={onLink}>{link}<Icon name="chevR" size={15} sw={2.5} /></button>}
    </div>
  );
}

// ---------- coin / flame pills ----------
function CoinPill({ value }) {
  return <span className="pill pill-coin"><CoinChip size={17} /><span className="num">{value.toLocaleString()}</span></span>;
}
function FlamePill({ days }) {
  return <span className="pill pill-flame"><Icon name="flame" size={15} sw={2.4} fill="currentColor" />{days}</span>;
}

// ---------- segmented control ----------
function Segmented({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 14, padding: 4 }}>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} style={{
          flex: 1, padding: "9px 4px", borderRadius: 10, fontWeight: 700, fontSize: 13,
          fontFamily: "var(--font-display)",
          background: value === o ? "var(--grad-primary)" : "transparent",
          color: value === o ? "#fff" : "var(--text-dim)",
          boxShadow: value === o ? "0 6px 16px -6px rgba(124,131,255,.6)" : "none",
          transition: "all .2s",
        }}>{o}</button>
      ))}
    </div>
  );
}

// ---------- bottom sheet ----------
function Sheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        {children}
      </div>
    </div>
  );
}

// ---------- weekly mini chart ----------
function WeekBars({ data, max, grad = "var(--grad-primary)", labels = ["M","T","W","T","F","S","S"], unit = "" }) {
  const mx = max || Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 92 }}>
      {data.map((v, i) => {
        const h = Math.max(6, (v / mx) * 100);
        const today = i === data.length - 1;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 7, height: "100%" }}>
            <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
              <div style={{ width: "100%", height: h + "%", borderRadius: 8,
                background: today ? grad : "var(--fill-bar)",
                boxShadow: today ? "0 6px 14px -6px rgba(124,131,255,.6)" : "none",
                transition: "height .8s cubic-bezier(.2,.8,.2,1)" }} />
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: today ? "var(--primary-soft)" : "var(--text-faint)" }}>{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------- count-up number ----------
function CountUp({ to, dur = 1100, fmt = (n) => Math.round(n).toLocaleString() }) {
  // default to final value so a paused clock still shows the right number
  const [n, setN] = React.useState(to);
  React.useEffect(() => {
    let raf, start, cancelled = false;
    const step = (t) => {
      if (cancelled) return;
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setN(to * e);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [to, dur]);
  return <>{fmt(n)}</>;
}

Object.assign(window, { Ring, Bar, Tile, Section, CoinPill, FlamePill, Segmented, Sheet, WeekBars, CountUp });

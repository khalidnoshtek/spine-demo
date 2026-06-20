/* Spine Command Center — shared UI primitives. Theme-aware via useT(). */
const { useT, Icon, useCountUp, fmt, clamp } = window;

// unique id helper for gradients
let __uid = 0;
const uid = (p) => `${p}-${++__uid}`;

// ── Card ──────────────────────────────────────────────────────────────
function Card({ children, style = {}, pad = 16, onClick, glow = false, active = false }) {
  const t = useT();
  return (
    <div onClick={onClick} style={{
      background: t.surface,
      border: `1px solid ${active ? t.accent : t.border}`,
      borderRadius: t.radius,
      padding: pad,
      backdropFilter: t.glow ? t.blur : 'none',
      WebkitBackdropFilter: t.glow ? t.blur : 'none',
      boxShadow: glow && t.glow ? `0 0 0 1px ${t.accentSoft}, 0 10px 40px -12px ${t.accent}55` : 'none',
      position: 'relative',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'border-color .2s, transform .15s',
      ...style,
    }}>{children}</div>
  );
}

// ── Delta tag (+12% ▲) ─────────────────────────────────────────────────
function Delta({ value, suffix = '%', size = 13 }) {
  const t = useT();
  const up = value >= 0;
  const c = up ? t.good : t.bad;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      color: c, fontSize: size, fontWeight: 600,
      fontFamily: t.fontNum, fontVariantNumeric: 'tabular-nums',
      background: `${c}1a`, padding: '2px 7px 2px 5px', borderRadius: 999,
    }}>
      <Icon name={up ? 'arrowUp' : 'arrowDn'} size={size} color={c} sw={2.4} />
      {up ? '+' : ''}{value}{suffix}
    </span>
  );
}

// ── Pill / chip ────────────────────────────────────────────────────────
function Pill({ children, tone, style = {}, soft = true }) {
  const t = useT();
  const map = { good: t.good, warn: t.warn, bad: t.bad, accent: t.accent };
  const c = map[tone] || t.textDim;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11.5, fontWeight: 600, letterSpacing: 0.2,
      color: soft ? c : t.onAccent,
      background: soft ? `${c}1f` : c,
      padding: '4px 9px', borderRadius: 999, whiteSpace: 'nowrap',
      ...style,
    }}>{children}</span>
  );
}

// ── Section heading ─────────────────────────────────────────────────────
function SectionTitle({ children, right }) {
  const t = useT();
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '4px 2px 10px' }}>
      <h3 style={{ margin: 0, fontFamily: t.fontDisplay, fontSize: 15, fontWeight: 600, color: t.text, letterSpacing: 0.2 }}>{children}</h3>
      {right && <span style={{ fontSize: 12.5, color: t.textDim, fontWeight: 500 }}>{right}</span>}
    </div>
  );
}

// ── Progress bar ─────────────────────────────────────────────────────────
function Bar({ value, max = 100, color, height = 8, track }) {
  const t = useT();
  const c = color || t.accent;
  const pct = clamp((value / max) * 100, 0, 100);
  const w = useCountUp(pct, 1000);
  return (
    <div style={{ height, borderRadius: 999, background: track || t.ringTrack, overflow: 'hidden', width: '100%' }}>
      <div style={{
        height: '100%', width: `${w}%`, borderRadius: 999,
        background: `linear-gradient(90deg, ${c}, ${t.accent2})`,
        boxShadow: t.glow ? `0 0 12px ${c}aa` : 'none',
      }} />
    </div>
  );
}

// ── Score ring (the centrepiece gauge) ──────────────────────────────────
function ScoreRing({ value, size = 200, stroke = 16, label, status, big = true, showVal = true }) {
  const t = useT();
  const gid = React.useRef(uid('ring')).current;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const animated = useCountUp(value, 1100);
  const off = circ - (animated / 100) * circ;
  const cx = size / 2;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={t.accent} />
            <stop offset="100%" stopColor={t.accent2} />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={t.ringTrack} strokeWidth={stroke} />
        <circle cx={cx} cy={cx} r={r} fill="none" stroke={`url(#${gid})`} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
          style={{ filter: t.glow ? `drop-shadow(0 0 10px ${t.accent}cc)` : 'none' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {label && <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: t.textFaint, fontWeight: 600, marginBottom: 2 }}>{label}</div>}
        {showVal && (
          <div style={{ display: 'flex', alignItems: 'flex-start', fontFamily: t.fontNum }}>
            <span style={{ fontSize: big ? size * 0.34 : size * 0.3, fontWeight: 700, color: t.text, lineHeight: 1, letterSpacing: -1 }}>{Math.round(animated)}</span>
            <span style={{ fontSize: big ? 16 : 13, color: t.textFaint, fontWeight: 600, marginTop: big ? 8 : 5 }}>/100</span>
          </div>
        )}
        {status && <div style={{ marginTop: 8 }}><Pill tone="accent">{status}</Pill></div>}
      </div>
    </div>
  );
}

// ── Mini ring (sub-score gauges) ─────────────────────────────────────────
function MiniRing({ value, size = 52, stroke = 5, color, hideVal = false }) {
  const t = useT();
  const gid = React.useRef(uid('mini')).current;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const a = useCountUp(value, 1000);
  const off = circ - (a / 100) * circ;
  const c = color || t.accent;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c} /><stop offset="100%" stopColor={t.accent2} />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={t.ringTrack} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`url(#${gid})`} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.fontNum, fontWeight: 700, fontSize: size * 0.3, color: t.text }}>
        {hideVal ? null : Math.round(a)}
      </div>
    </div>
  );
}

// ── Sparkline ────────────────────────────────────────────────────────────
function Sparkline({ data, w = 80, h = 28, color, fillArea = false }) {
  const t = useT();
  const gid = React.useRef(uid('spk')).current;
  const c = color || t.accent;
  const min = Math.min(...data), max = Math.max(...data);
  const rng = max - min || 1;
  const pts = data.map((d, i) => [ (i / (data.length - 1)) * w, h - ((d - min) / rng) * (h - 4) - 2 ]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.35" /><stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fillArea && <path d={area} fill={`url(#${gid})`} />}
      <path d={line} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: t.glow ? `drop-shadow(0 0 4px ${c}aa)` : 'none' }} />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2.6" fill={c} />
    </svg>
  );
}

// ── Area / trend chart (larger) ──────────────────────────────────────────
function AreaChart({ data, h = 130, color, labels }) {
  const t = useT();
  const gid = React.useRef(uid('area')).current;
  const c = color || t.accent;
  const w = 320;
  const min = Math.min(...data) - 3, max = Math.max(...data) + 2;
  const rng = max - min || 1;
  const pts = data.map((d, i) => [ (i / (data.length - 1)) * w, h - ((d - min) / rng) * (h - 16) - 8 ]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  return (
    <div style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity="0.34" /><stop offset="100%" stopColor={c} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map(g => (
          <line key={g} x1="0" y1={h*g} x2={w} y2={h*g} stroke={t.border} strokeWidth="1" strokeDasharray="2 5" />
        ))}
        <path d={area} fill={`url(#${gid})`} />
        <path d={line} fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: t.glow ? `drop-shadow(0 0 6px ${c}aa)` : 'none' }} />
        <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="4" fill={c} stroke={t.bg} strokeWidth="2" />
      </svg>
      {labels && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: t.textFaint, fontFamily: t.fontNum }}>
          {labels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      )}
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────
function Avatar({ initials, size = 40 }) {
  const t = useT();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
      color: t.onAccent, fontWeight: 700, fontSize: size * 0.36, fontFamily: t.fontDisplay,
      boxShadow: t.glow ? `0 0 18px ${t.accent}66` : 'none',
    }}>{initials}</div>
  );
}

Object.assign(window, { Card, Delta, Pill, SectionTitle, Bar, ScoreRing, MiniRing, Sparkline, AreaChart, Avatar });

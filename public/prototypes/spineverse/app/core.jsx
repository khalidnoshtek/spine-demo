// SPINEVERSE — core: tokens, shared UI, state context, ambient effects
// Exposes everything on window for cross-file babel scripts.

// Theme-dependent tokens; accents (cyan/violet/gold/pain) stay vivid in both modes.
const THEMES = {
  dark: {
    void0: '#04050d', void1: '#070a1c', indigo: '#0c1135', indigo2: '#141a4d',
    text: '#eef3ff', muted: 'rgba(226,234,255,0.62)', faint: 'rgba(226,234,255,0.34)',
    glassBg: 'rgba(255,255,255,0.055)', glassBorder: 'rgba(255,255,255,0.13)',
    cyan: '#2fe6ff', violet: '#9d6bff',
    chipBg: 'rgba(8,12,30,0.5)', chipBorder: 'rgba(255,255,255,0.13)',
    // surfaces
    track: 'rgba(255,255,255,0.10)',   // slider / progress tracks
    subtle: 'rgba(255,255,255,0.06)',  // inactive icon chips, segmented bg
    onEnergy: '#05060f',               // text on cyan/violet CTA
    goldInk: '#ffcf52',                // gold text on surfaces
    toastBg: 'rgba(28,20,4,0.82)',
    toastInk: '#ffd86a',
    bodyTint: 'rgba(120,200,255,0.18)',
    bedTop: '#2a3170', bedBot: '#161a45', bedRail: '#4b54a8', pillow: '#3a4290', blanket: '#4b54a8', blanketEdge: '#5a64bd',
    cardShadow: '0 18px 50px -28px rgba(0,0,0,0.8)',
    sceneInk: '#cfe0ff',
    // scene / illustration accents
    aBlue: '#3aa0ff', aOrange: '#ff9a3c', aGreen: '#37e0a0', aPink: '#ff6b6b', aGold: '#ffcf52', aCyan: '#2fe6ff',
    spineMid: '#7fd9ff', illoStroke: '#2fe6ff',
  },
  light: {
    void0: '#e7ebf8', void1: '#eef1fb', indigo: '#f6f8ff', indigo2: '#eef0ff',
    text: '#1a2348', muted: 'rgba(38,48,96,0.70)', faint: 'rgba(38,48,96,0.45)',
    glassBg: 'rgba(255,255,255,0.86)', glassBorder: 'rgba(40,52,110,0.12)',
    cyan: '#0a93b8', violet: '#6a39de',
    chipBg: 'rgba(255,255,255,0.88)', chipBorder: 'rgba(40,52,110,0.14)',
    track: 'rgba(40,52,110,0.13)',
    subtle: 'rgba(40,52,110,0.07)',
    onEnergy: '#ffffff',
    goldInk: '#9a6403',
    toastBg: 'rgba(255,251,240,0.96)',
    toastInk: '#9a6403',
    bodyTint: 'rgba(40,90,180,0.16)',
    bedTop: '#aab4ee', bedBot: '#7e88cf', bedRail: '#c3cbf5', pillow: '#d7ddfa', blanket: '#9aa4e6', blanketEdge: '#7e88cf',
    cardShadow: '0 16px 40px -24px rgba(40,52,110,0.5)',
    sceneInk: '#2f3d72',
    aBlue: '#1f7fe0', aOrange: '#cf6a12', aGreen: '#1f9e72', aPink: '#dd454c', aGold: '#a96b04', aCyan: '#0a8aae',
    spineMid: '#2ba6cf', illoStroke: '#2f6fd0',
  },
};

const SV = {
  // accents (shared across themes)
  cyanDeep: '#0aa9d6',
  violetDeep: '#6d3cf0',
  // pain heat
  pain1: '#ffe14d', // yellow
  pain2: '#ff9a3c', // orange
  pain3: '#ff3b57', // red
  // reward
  gold: '#ffcf52',
  goldDeep: '#e09b1e',
  __mode: 'dark',
  ...THEMES.dark,
};
window.SV = SV;
window.THEMES = THEMES;

function applyTheme(mode) {
  Object.assign(SV, THEMES[mode] || THEMES.dark);
  SV.__mode = mode;
}
window.applyTheme = applyTheme;

// pick a value based on current theme — for screen-specific backgrounds
const themed = (darkVal, lightVal) => (SV.__mode === 'light' ? lightVal : darkVal);
window.themed = themed;

const painColor = (lvl) => (lvl >= 3 ? SV.pain3 : lvl === 2 ? SV.pain2 : lvl === 1 ? SV.pain1 : SV.cyan);
window.painColor = painColor;

// ───────────────────────── App state ─────────────────────────
const AppCtx = React.createContext(null);
const useApp = () => React.useContext(AppCtx);
window.useApp = useApp;

const SCREENS = [
  'meet', 'pain', 'sleep', 'work', 'sitting',
  'movement', 'exercise', 'lifting', 'weight', 'wearable', 'scan', 'score',
];
window.SCREENS = SCREENS;

const LEVELS = [
  { name: 'Explorer', at: 0 },
  { name: 'Warrior', at: 150 },
  { name: 'Guardian', at: 350 },
  { name: 'Champion', at: 600 },
  { name: 'Master', at: 900 },
  { name: 'Legend', at: 1300 },
];
window.LEVELS = LEVELS;
const levelFor = (coins) => {
  let cur = LEVELS[0];
  for (const l of LEVELS) if (coins >= l.at) cur = l;
  return cur;
};
window.levelFor = levelFor;

const DEFAULT_DATA = { pain: {}, sleep: 7, occupation: null, sitting: 6, walking: 30, exercise: [], lifting: null, weight: 74, height: 172, wearable: null, scored: false, watchedIntro: false };
const SAVE_KEY = 'spineverse_v1';
function loadSaved() {
  try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.data) return s; } catch (e) {}
  return null;
}

function AppProvider({ children }) {
  const saved = React.useRef(loadSaved()).current;
  const [step, setStep] = React.useState(saved ? saved.step : 0);
  const [coins, setCoins] = React.useState(saved ? saved.coins : 0);
  const [rewards, setRewards] = React.useState([]); // toast queue
  const [dir, setDir] = React.useState(1);
  const [theme, setTheme] = React.useState(saved && saved.theme ? saved.theme : 'dark');
  const [data, setData] = React.useState(saved ? { ...DEFAULT_DATA, ...saved.data } : { ...DEFAULT_DATA });

  // keep SV tokens in sync with the active theme (runs during render)
  applyTheme(theme);

  React.useEffect(() => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ step, coins, data, theme })); } catch (e) {}
  }, [step, coins, data, theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const set = (patch) => setData((d) => ({ ...d, ...patch }));

  const reward = React.useCallback((amount, label) => {
    const id = Math.random().toString(36).slice(2);
    setRewards((r) => [...r, { id, amount, label }]);
    setCoins((c) => c + amount);
    setTimeout(() => setRewards((r) => r.filter((x) => x.id !== id)), 2600);
  }, []);

  const go = (n) => { setDir(n > step ? 1 : -1); setStep(Math.max(0, Math.min(SCREENS.length - 1, n))); };
  const next = () => go(step + 1);
  const back = () => go(step - 1);

  const restart = () => { setStep(0); setCoins(0); setData({ ...DEFAULT_DATA }); setGateOpen(false); };

  // ── educational intro video gate (disabled for the dashboard embed — starts straight on the app) ──
  const [gateOpen, setGateOpen] = React.useState(false);
  const openGate = () => setGateOpen(true);
  const closeGate = () => setGateOpen(false);
  const markWatched = () => setData((d) => ({ ...d, watchedIntro: true }));
  const beginJourney = () => { setGateOpen(false); reward(50, 'Journey Started'); go(1); };

  const val = { step, go, next, back, coins, reward, data, set, rewards, dir, restart, level: levelFor(coins), theme, toggleTheme,
    gateOpen, openGate, closeGate, markWatched, beginJourney };
  return <AppCtx.Provider value={val}>{children}</AppCtx.Provider>;
}
window.AppProvider = AppProvider;

// ───────────────────────── Starfield (canvas) ─────────────────────────
function Starfield({ density = 1, hue = 'cool', parallax = 0 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    let raf, w, h, stars = [], t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.floor((w * h) / 5200 * density);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3, z: Math.random() * 0.8 + 0.2,
        tw: Math.random() * Math.PI * 2, sp: Math.random() * 0.6 + 0.2,
      }));
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const draw = () => {
      t += 0.016; ctx.clearRect(0, 0, w, h);
      const lightMode = SV.__mode === 'light';
      for (const s of stars) {
        const a = 0.4 + 0.6 * Math.abs(Math.sin(s.tw + t * s.sp));
        ctx.beginPath();
        ctx.arc(s.x, (s.y + t * 6 * s.z) % h, s.r * s.z * 1.6, 0, 7);
        ctx.fillStyle = lightMode
          ? `rgba(120,135,200,${a * s.z * 0.32})`
          : hue === 'warm'
            ? `rgba(255,224,150,${a * s.z})`
            : `rgba(${160 + 60 * s.z},${210},255,${a * s.z})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [density, hue]);
  return <canvas ref={ref} key={SV.__mode} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />;
}
window.Starfield = Starfield;

// ───────────────────────── Glass panel ─────────────────────────
function Glass({ children, style = {}, glow, onClick, active }) {
  return (
    <div onClick={onClick} style={{
      position: 'relative', borderRadius: 24, padding: 18,
      background: SV.glassBg,
      border: `1px solid ${active ? SV.cyan : SV.glassBorder}`,
      backdropFilter: 'blur(18px) saturate(150%)', WebkitBackdropFilter: 'blur(18px) saturate(150%)',
      boxShadow: active
        ? `0 0 0 1px ${SV.cyan}, 0 14px 50px -18px ${SV.cyan}`
        : glow ? `0 18px 60px -24px ${glow}` : SV.cardShadow,
      transition: 'border-color .3s, box-shadow .3s, transform .3s',
      cursor: onClick ? 'pointer' : 'default', ...style,
    }}>{children}</div>
  );
}
window.Glass = Glass;

// ───────────────────────── Primary CTA ─────────────────────────
function CTA({ children, onClick, tone = 'energy', style = {}, sub }) {
  const grad = tone === 'gold'
    ? `linear-gradient(135deg, ${SV.gold}, ${SV.goldDeep})`
    : `linear-gradient(135deg, ${SV.cyan}, ${SV.violet})`;
  const sh = tone === 'gold' ? SV.gold : SV.violet;
  return (
    <button onClick={onClick} className="sv-cta" style={{
      position: 'relative', width: '100%', border: 'none', cursor: 'pointer',
      borderRadius: 20, padding: '17px 22px', color: tone === 'gold' ? '#2a1c00' : SV.onEnergy,
      fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 17, letterSpacing: 0.2,
      background: grad, boxShadow: `0 12px 36px -10px ${sh}, inset 0 1px 0 rgba(255,255,255,0.5)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, ...style,
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>{children}</span>
      {sub && <span style={{ fontSize: 11.5, fontWeight: 600, opacity: 0.7 }}>{sub}</span>}
    </button>
  );
}
window.CTA = CTA;

// ───────────────────────── Coin glyph ─────────────────────────
function Coin({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <radialGradient id="cg" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#fff4cf" />
          <stop offset="55%" stopColor={SV.gold} />
          <stop offset="100%" stopColor={SV.goldDeep} />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10.5" fill="url(#cg)" stroke="#fff0c0" strokeWidth="0.6" />
      <circle cx="12" cy="12" r="7" fill="none" stroke="rgba(120,70,0,0.35)" strokeWidth="1" />
      <path d="M12 6.5c2.2 0 3.6 1.4 3.6 3.1h-2c0-.7-.6-1.2-1.6-1.2s-1.6.5-1.6 1.1c0 .7.7 1 1.9 1.3 1.8.4 3.4 1 3.4 3 0 1.6-1.2 2.8-3.1 3v1.4h-1.4v-1.4c-2-.2-3.3-1.5-3.3-3.3h2c0 .8.7 1.4 1.8 1.4 1 0 1.7-.5 1.7-1.1 0-.7-.7-1-2-1.3-1.7-.4-3.3-1-3.3-2.9 0-1.6 1.2-2.7 3-2.9V6.5H12z" fill="#7a4500" opacity="0.85" />
    </svg>
  );
}
window.Coin = Coin;

// ───────────────────────── Reward toasts ─────────────────────────
function RewardLayer() {
  const { rewards } = useApp();
  return (
    <div style={{ position: 'absolute', top: 96, left: 0, right: 0, zIndex: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
      {rewards.map((r) => (
        <div key={r.id} className="sv-reward" style={{
          display: 'flex', alignItems: 'center', gap: 9, padding: '9px 16px 9px 11px',
          borderRadius: 999, background: SV.toastBg, backdropFilter: 'blur(14px)',
          border: `1px solid ${SV.gold}66`, boxShadow: `0 10px 30px -8px ${SV.gold}66`,
        }}>
          <Coin size={22} />
          <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, color: SV.toastInk }}>+{r.amount}</span>
          <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 12.5, color: SV.muted }}>{r.label}</span>
        </div>
      ))}
    </div>
  );
}
window.RewardLayer = RewardLayer;

// ───────────────────────── Top HUD ─────────────────────────
function ThemeToggle() {
  const { theme, toggleTheme } = useApp();
  const light = theme === 'light';
  return (
    <button onClick={toggleTheme} aria-label="Toggle light mode" style={{
      pointerEvents: 'auto', width: 34, height: 34, borderRadius: 99, cursor: 'pointer',
      border: `1px solid ${SV.chipBorder}`, background: SV.chipBg, backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {light ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.4" fill={SV.gold} /><g stroke={SV.gold} strokeWidth="2" strokeLinecap="round"><path d="M12 2.6v2.4M12 19v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.6 12h2.4M19 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" /></g></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" fill="none" stroke={SV.cyan} strokeWidth="2" strokeLinejoin="round" /></svg>
      )}
    </button>
  );
}
window.ThemeToggle = ThemeToggle;

function HUD() {
  const { coins, step, level, back } = useApp();
  const showProgress = step > 0 && step < SCREENS.length - 1;
  const canBack = step > 0 && step <= 9;
  return (
    <div style={{ position: 'absolute', top: 58, left: 0, right: 0, zIndex: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 18px', pointerEvents: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, pointerEvents: 'auto' }}>
        {canBack && (
          <button onClick={back} aria-label="Back" style={{ width: 34, height: 34, borderRadius: 99, border: `1px solid ${SV.chipBorder}`, background: SV.chipBg, backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="9" height="16" viewBox="0 0 12 20" fill="none"><path d="M10 2L2 10l8 8" stroke={SV.muted} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 13px 6px 7px', borderRadius: 999, background: SV.chipBg, border: `1px solid ${SV.gold}55`, backdropFilter: 'blur(10px)' }}>
          <Coin size={19} />
          <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: SV.goldInk, minWidth: 18, textAlign: 'left' }} className="sv-coincount">{coins}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, pointerEvents: 'auto' }}>
        {showProgress && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', borderRadius: 999, background: SV.chipBg, border: `1px solid ${SV.chipBorder}`, backdropFilter: 'blur(10px)' }}>
            <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 11.5, color: SV.cyan, letterSpacing: 0.5 }}>{level.name.toUpperCase()}</span>
            <span style={{ width: 1, height: 11, background: SV.glassBorder }} />
            <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 11.5, color: SV.muted }}>{step}<span style={{ opacity: 0.5 }}>/{SCREENS.length - 1}</span></span>
          </div>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}
window.HUD = HUD;

// ───────────────────────── Eyebrow label ─────────────────────────
function Eyebrow({ children, color = SV.cyan }) {
  return <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 11.5, letterSpacing: 3, textTransform: 'uppercase', color, opacity: 0.92 }}>{children}</div>;
}
window.Eyebrow = Eyebrow;

// ───────────────────────── Screen title ─────────────────────────
function Title({ children, style = {} }) {
  return <h1 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 30, lineHeight: 1.08, letterSpacing: -0.6, color: SV.text, margin: 0, textWrap: 'balance', ...style }}>{children}</h1>;
}
window.Title = Title;

// ───────────────────────── Educational Video Gate ─────────────────────────
// Simulated player: progress advances only while playing, can't seek ahead.
// The gating CTA stays locked until the clip is fully watched.
const VIDEO_CAPTIONS = [
  'Your spine carries you through every single day.',
  'Small daily habits — sleep, sitting, lifting — add up over years.',
  'These questions map how your body really lives.',
  'We turn your answers into a personal Spine Score.',
  'Honest answers give you the most accurate result.',
];
const VIDEO_DURATION = 5000; // ms

function VideoGate({ open, watched, onComplete, onClose, onProceed }) {
  const [playing, setPlaying] = React.useState(false);
  const [prog, setProg] = React.useState(watched ? 1 : 0);
  const done = prog >= 1;

  // reset when (re)opened fresh and not yet watched
  React.useEffect(() => {
    if (open && !watched) { setProg(0); setPlaying(false); }
    if (open && watched) { setProg(1); }
  }, [open, watched]);

  React.useEffect(() => {
    if (!playing) return;
    let raf, last = performance.now();
    const tick = (now) => {
      const dt = now - last; last = now;
      setProg((p) => Math.min(1, p + dt / VIDEO_DURATION));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  React.useEffect(() => {
    if (prog >= 1 && playing) { setPlaying(false); onComplete && onComplete(); }
  }, [prog, playing]);

  if (!open) return null;
  const cap = VIDEO_CAPTIONS[Math.min(VIDEO_CAPTIONS.length - 1, Math.floor(prog * VIDEO_CAPTIONS.length))];
  const fmt = (ms) => { const s = Math.round(ms / 1000); return `0:${String(s).padStart(2, '0')}`; };

  return (
    <div className="sv-enter" style={{ position: 'absolute', inset: 0, zIndex: 95, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      background: themed('rgba(3,5,16,0.74)', 'rgba(30,38,80,0.42)'), backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
      <div style={{ margin: 14, marginTop: 'auto', borderRadius: 28, overflow: 'hidden', border: `1px solid ${SV.glassBorder}`, background: SV.__mode === 'light' ? '#ffffff' : '#0a0e22', boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7)' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 12px' }}>
          <div>
            <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: SV.cyan }}>Before we begin</div>
            <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 18, color: SV.text, marginTop: 3 }}>Why we ask these questions</div>
          </div>
          {(done || watched) && (
            <button onClick={onClose} aria-label="Close" style={{ width: 32, height: 32, borderRadius: 99, border: `1px solid ${SV.chipBorder}`, background: SV.chipBg, color: SV.muted, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>✕</button>
          )}
        </div>

        {/* video screen (always dark, like a real player) */}
        <div style={{ position: 'relative', margin: '0 14px', borderRadius: 18, overflow: 'hidden', aspectRatio: '16 / 9',
          background: 'radial-gradient(120% 120% at 50% 0%, #16204d, #060914 70%)' }}>
          {/* faux reel: pulsing energy spine glyph + caption */}
          <svg viewBox="0 0 320 180" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <linearGradient id="vgSpine" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2fe6ff" /><stop offset="100%" stopColor="#9d6bff" /></linearGradient>
              <filter id="vgGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {[...Array(10)].map((_, i) => {
              const y = 26 + i * 13, w = 16 + i * 1.6;
              return <rect key={i} x={160 - w / 2 + Math.sin(i * 0.7) * 5} y={y} width={w} height={6.5} rx={3.2} fill="url(#vgSpine)" filter="url(#vgGlow)" opacity={0.85} className={playing ? 'sv-pulse' : ''} style={{ animationDelay: `${i * 0.12}s` }} />;
            })}
          </svg>
          {/* play / pause control */}
          {!done && (
            <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'} style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', background: playing ? 'transparent' : 'rgba(0,0,0,0.28)', cursor: 'pointer', transition: 'background .3s' }}>
              <span style={{ width: 60, height: 60, borderRadius: 99, background: 'rgba(255,255,255,0.16)', border: '1.5px solid rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', opacity: playing ? 0 : 1, transition: 'opacity .25s' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </button>
          )}
          {/* caption */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '26px 16px 12px', background: 'linear-gradient(0deg, rgba(4,6,16,0.92), transparent)' }}>
            <div key={cap} className="sv-enter" style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 13.5, color: '#eaf2ff', lineHeight: 1.35, textWrap: 'balance', minHeight: 36 }}>
              {done ? "That's why every answer matters. Let's begin." : cap}
            </div>
          </div>
          {/* completed badge */}
          {done && (
            <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 99, background: 'rgba(20,40,30,0.7)', border: '1px solid rgba(80,230,160,0.5)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#5ce6a0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 11, color: '#5ce6a0' }}>Watched</span>
            </div>
          )}
        </div>

        {/* scrubber (display only — can't seek ahead) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px 4px' }}>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 11, color: SV.muted, minWidth: 28 }}>{fmt(prog * VIDEO_DURATION)}</span>
          <div style={{ flex: 1, height: 6, borderRadius: 99, background: SV.track, overflow: 'hidden' }}>
            <div style={{ width: `${prog * 100}%`, height: '100%', background: `linear-gradient(90deg, ${SV.cyan}, ${SV.violet})` }} />
          </div>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 11, color: SV.faint, minWidth: 28 }}>{fmt(VIDEO_DURATION)}</span>
        </div>

        {/* footer CTA */}
        <div style={{ padding: '8px 16px 18px' }}>
          {done ? (
            <CTA onClick={onProceed}>Begin Journey
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </CTA>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '15px', borderRadius: 18, border: `1px dashed ${SV.glassBorder}`, color: SV.muted }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke={SV.muted} strokeWidth="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={SV.muted} strokeWidth="2" /></svg>
              <span style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 13 }}>Watch the clip to unlock your journey</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
window.VideoGate = VideoGate;

// ───────────────────────── Per-question "Why we ask" gate ─────────────────────────
// A short educational popup shown before each scientific question.
const QUESTION_INFO = {
  pain:      { accent: '#ff6b6b', icon: 'pain',     title: 'Where it hurts tells a story', body: 'Pain location pinpoints which spinal segments are under stress — so we target the root cause, not just the symptom.' },
  sleep:     { accent: '#9d6bff', icon: 'sleep',    title: 'Sleep is when your spine repairs', body: 'Your discs rehydrate and tissues recover overnight. Too little rest leaves the spine under-recovered and more injury-prone.' },
  work:      { accent: '#ff9a3c', icon: 'work',     title: 'Your job shapes your spine', body: 'Sitting, driving and lifting create very different load patterns. Knowing your world lets us read your daily strain.' },
  sitting:   { accent: '#2fe6ff', icon: 'sitting',  title: 'Sitting compresses your discs', body: 'Prolonged sitting can raise disc pressure up to 40% versus standing. Your daily hours reveal cumulative compression.' },
  movement:  { accent: '#37e0a0', icon: 'move',     title: 'Motion feeds your spine', body: 'Walking pumps nutrients into spinal discs. Daily distance is one of the strongest predictors of long-term spine health.' },
  exercise:  { accent: '#37e0a0', icon: 'strength', title: 'Strength protects your spine', body: 'A strong core and back share the load your spine carries. Your activities tell us how well-supported it is.' },
  lifting:   { accent: '#ffcf52', icon: 'lift',     title: 'Load is where injuries happen', body: 'How often you lift heavy drives acute spinal stress. Frequency helps us estimate your risk of strain.' },
  weight:    { accent: '#ff9a3c', icon: 'weight',   title: 'Every kilo adds load', body: 'Extra body weight multiplies the force through your lumbar spine with each step, shaping long-term wear.' },
};
window.QUESTION_INFO = QUESTION_INFO;

function InfoIcon({ kind, color }) {
  const s = { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const p = {
    pain:     <g {...s}><path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10z" /><circle cx="12" cy="11" r="2" fill={color} stroke="none" /></g>,
    sleep:    <g {...s}><path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" /></g>,
    work:     <g {...s}><rect x="3" y="7" width="18" height="12" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></g>,
    sitting:  <g {...s}><path d="M7 4v6a3 3 0 0 0 3 3h4M7 13v7M14 13v7M17 9v11" /></g>,
    move:     <g {...s}><circle cx="13" cy="4.5" r="1.6" fill={color} stroke="none" /><path d="M11 9l-3 2 2 3-1 5M11 9l4-1 3 3 2 0M8 11l-3 1" /></g>,
    strength: <g {...s}><path d="M3 9v6M21 9v6M6 7v10M18 7v10M6 12h12" /></g>,
    lift:     <g {...s}><rect x="8" y="3" width="8" height="6" rx="1" /><path d="M12 9v5M8 14h8l-1 6H9z" /></g>,
    weight:   <g {...s}><circle cx="12" cy="7" r="3" /><path d="M7 21l1.5-8h7L17 21M9 13l-2 4M15 13l2 4" /></g>,
  };
  return <svg width="26" height="26" viewBox="0 0 24 24">{p[kind] || p.pain}</svg>;
}

function InfoGate({ infoKey, onClose }) {
  const info = infoKey ? QUESTION_INFO[infoKey] : null;
  const [playing, setPlaying] = React.useState(false);
  const [prog, setProg] = React.useState(0);
  const done = prog >= 1;

  // reset whenever a new question's gate opens
  React.useEffect(() => { setProg(0); setPlaying(false); }, [infoKey]);

  React.useEffect(() => {
    if (!playing) return;
    let raf, last = performance.now();
    const tick = (now) => {
      const dt = now - last; last = now;
      setProg((p) => Math.min(1, p + dt / 5000)); // 5s clip
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  React.useEffect(() => { if (prog >= 1 && playing) setPlaying(false); }, [prog, playing]);

  if (!info) return null;
  const accent = info.accent;
  const fmt = (ms) => `0:0${Math.min(5, Math.round(ms / 1000))}`;

  return (
    <div className="sv-enter" style={{ position: 'absolute', inset: 0, zIndex: 92, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      background: themed('rgba(3,5,16,0.7)', 'rgba(30,38,80,0.4)'), backdropFilter: 'blur(7px)', WebkitBackdropFilter: 'blur(7px)' }}>
      <div className="sv-sheet" style={{ margin: 14, borderRadius: 28, padding: '20px 18px 16px',
        border: `1px solid ${SV.glassBorder}`, background: SV.__mode === 'light' ? '#ffffff' : '#0b1024',
        boxShadow: '0 30px 80px -20px rgba(0,0,0,0.65)' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 14 }}>
          <div style={{ width: 50, height: 50, borderRadius: 15, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${accent}1f`, border: `1px solid ${accent}55` }}>
            <InfoIcon kind={info.icon} color={accent} />
          </div>
          <div>
            <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 10.5, letterSpacing: 2, textTransform: 'uppercase', color: accent }}>Why we ask</div>
            <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 17, color: SV.text, marginTop: 2, lineHeight: 1.15, textWrap: 'balance' }}>{info.title}</div>
          </div>
        </div>

        {/* video screen (always dark, like a real player) */}
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '16 / 9',
          background: `radial-gradient(120% 120% at 50% 0%, ${accent}22, #060914 72%)` }}>
          <svg viewBox="0 0 320 180" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <linearGradient id={`ig${infoKey}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={accent} /><stop offset="100%" stopColor="#9d6bff" /></linearGradient>
              <filter id="igGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {[...Array(9)].map((_, i) => {
              const y = 28 + i * 14, w = 15 + i * 1.5;
              return <rect key={i} x={160 - w / 2 + Math.sin(i * 0.7) * 5} y={y} width={w} height={6} rx={3} fill={`url(#ig${infoKey})`} filter="url(#igGlow)" opacity={0.85} className={playing ? 'sv-pulse' : ''} style={{ animationDelay: `${i * 0.12}s` }} />;
            })}
          </svg>
          {!done && (
            <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'} style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', background: playing ? 'transparent' : 'rgba(0,0,0,0.26)', cursor: 'pointer', transition: 'background .3s' }}>
              <span style={{ width: 54, height: 54, borderRadius: 99, background: 'rgba(255,255,255,0.16)', border: '1.5px solid rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', opacity: playing ? 0 : 1, transition: 'opacity .25s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
              </span>
            </button>
          )}
          {/* caption: the rationale */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '24px 14px 11px', background: 'linear-gradient(0deg, rgba(4,6,16,0.94), transparent)' }}>
            <div style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 12.5, color: '#eaf2ff', lineHeight: 1.4, textWrap: 'balance' }}>
              {done ? "Now you know why — let's capture your answer." : info.body}
            </div>
          </div>
          {done && (
            <div style={{ position: 'absolute', top: 9, right: 9, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 99, background: 'rgba(20,40,30,0.7)', border: '1px solid rgba(80,230,160,0.5)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#5ce6a0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 10.5, color: '#5ce6a0' }}>Watched</span>
            </div>
          )}
        </div>

        {/* scrubber */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 2px 4px' }}>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 10.5, color: SV.muted, minWidth: 26 }}>{fmt(prog * 5000)}</span>
          <div style={{ flex: 1, height: 5, borderRadius: 99, background: SV.track, overflow: 'hidden' }}>
            <div style={{ width: `${prog * 100}%`, height: '100%', background: `linear-gradient(90deg, ${accent}, ${SV.violet})` }} />
          </div>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 10.5, color: SV.faint, minWidth: 26 }}>0:05</span>
        </div>

        {/* footer */}
        <div style={{ marginTop: 6 }}>
          {done ? (
            <CTA onClick={onClose}>Got it — continue
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </CTA>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 18, border: `1px dashed ${SV.glassBorder}`, color: SV.muted }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke={SV.muted} strokeWidth="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={SV.muted} strokeWidth="2" /></svg>
              <span style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 12.5 }}>Watch the 5-sec clip to continue</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
window.InfoGate = InfoGate;

// SPINEVERSE — Screens 9-12 + scoring + gamification finale

const ACTUAL_AGE = 32; // assumed baseline (not collected in flow)
window.ACTUAL_AGE = ACTUAL_AGE;

function computeScore(d) {
  let s = 100;
  const pen = [];
  // sleep
  const sl = d.sleep >= 11 ? 10 : d.sleep;
  if (sl < 7) { const p = (7 - sl) * 5; s -= p; pen.push(['Sleep Debt', p]); }
  // sitting
  if (d.sitting > 5) { const p = (d.sitting - 5) * 3.2; s -= p; pen.push(['Long Sitting Hours', p]); }
  // walking
  if (d.walking < 60) { const p = ((60 - d.walking) / 60) * 16; s -= p; pen.push(['Low Activity', p]); }
  // pain
  const painSum = Object.values(d.pain).reduce((a, b) => a + b, 0);
  if (painSum > 0) { const p = painSum * 3.5; s -= p; pen.push(['Pain Load', p]); }
  // lifting
  const lw = d.lifting === 'daily' ? 9 : d.lifting === 'occasionally' ? 3 : 0;
  if (lw) { s -= lw; pen.push(['Heavy Lifting', lw]); }
  // exercise bonus
  s += Math.min(18, d.exercise.length * 4);
  // bmi
  const bmi = d.weight / Math.pow(d.height / 100, 2);
  if (bmi > 25) { const p = (bmi - 25) * 2.2; s -= p; pen.push(['Body Load', p]); }
  // occupation strain
  if (d.occupation === 'labour' || d.occupation === 'driver') { s -= 4; }

  s = Math.max(12, Math.min(99, Math.round(s)));
  const spineAge = Math.max(ACTUAL_AGE - 4, ACTUAL_AGE + Math.round((100 - s) * 0.26));
  const risk = s >= 80 ? ['Low', SV.cyan] : s >= 62 ? ['Moderate', SV.pain1] : s >= 44 ? ['Elevated', SV.pain2] : ['High', SV.pain3];
  const contributors = pen.sort((a, b) => b[1] - a[1]).slice(0, 3).map((x) => x[0]);
  return { score: s, spineAge, actualAge: ACTUAL_AGE, risk, contributors, bmi };
}
window.computeScore = computeScore;

// ════════════ SCREEN 9 — Weight & BMI ════════════
function WeightScreen() {
  const { next, reward, data, set } = useApp();
  const w = data.weight;
  const bmi = w / Math.pow(data.height / 100, 2);
  const load = Math.min(1, Math.max(0, (bmi - 19) / 16));
  const [reveal, setReveal] = React.useState(false);
  const bodyW = 1 + load * 0.5;
  return (
    <Shell stars={0.5} footer={
      <CTA onClick={() => { reward(70, 'Body Mapped'); next(); }} sub="Reward · +70 Coins">
        Continue
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </CTA>
    }>
      <Eyebrow color={SV.aOrange}>Weight & Body Load</Eyebrow>
      <Title style={{ marginTop: 8, fontSize: 25 }}>Every kilo your spine carries.</Title>

      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        <svg width="200" height="280" viewBox="0 0 200 280">
          <defs><radialGradient id="heatG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={painColor(load >= 0.66 ? 3 : load >= 0.33 ? 2 : 1)} stopOpacity={0.5} /><stop offset="100%" stopOpacity="0" /></radialGradient></defs>
          <ellipse cx="100" cy="266" rx="60" ry="8" fill="#000" opacity="0.4" />
          {/* heat map on lower spine */}
          <ellipse cx="100" cy="170" rx={40 * bodyW} ry="50" fill="url(#heatG)" />
          {/* avatar body, widens with load */}
          <g style={{ transition: 'transform .4s', transformOrigin: '100px 150px', transform: `scaleX(${bodyW})` }} fill={SV.bodyTint} stroke={themed(SV.cyan, '#2f6fd0')} strokeWidth="1.8">
            <circle cx="100" cy="44" r="20" />
            <path d="M72 70 q28 -10 56 0 q10 40 4 96 q-32 12 -64 0 q-6 -56 4 -96z" />
            <path d="M86 162 l-6 96 M114 162 l6 96" strokeWidth="14" strokeLinecap="round" />
          </g>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ transform: 'translateY(-16px)' }}>
            <SpineAvatar strength={0.5} compress={load * 0.7} scale={0.24} current={false} />
          </div>
        </div>
      </div>

      <Glass style={{ marginBottom: 6 }}>
        <Slider min={45} max={140} value={w} accent={painColor(load >= 0.66 ? 3 : load >= 0.33 ? 2 : 1)}
          onChange={(v) => set({ weight: v })} format={(v) => `${v} kg`} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 12.5, color: SV.muted }}>
            Spinal load: <b style={{ color: painColor(load >= 0.66 ? 3 : load >= 0.33 ? 2 : 1) }}>{load < 0.33 ? 'Light' : load < 0.66 ? 'Moderate' : 'Heavy'}</b>
          </span>
          <button onClick={() => setReveal((r) => !r)} style={{ border: `1px solid ${SV.glassBorder}`, background: 'transparent', color: SV.cyan, fontFamily: 'Sora', fontWeight: 700, fontSize: 11.5, padding: '6px 12px', borderRadius: 99, cursor: 'pointer' }}>
            {reveal ? `BMI ${bmi.toFixed(1)}` : 'Reveal BMI'}
          </button>
        </div>
      </Glass>
    </Shell>
  );
}
window.WeightScreen = WeightScreen;

// ════════════ SCREEN 10 — Wearable Connection ════════════
const WEARABLES = [
  { key: 'apple', label: 'Apple Watch' }, { key: 'fitbit', label: 'Fitbit' },
  { key: 'samsung', label: 'Samsung Watch' }, { key: 'garmin', label: 'Garmin' },
  { key: 'amazfit', label: 'Amazfit' }, { key: 'health', label: 'Health Apps' },
];
window.WEARABLES = WEARABLES;

function WearableScreen() {
  const { next, reward, data, set } = useApp();
  const [connecting, setConnecting] = React.useState(false);
  const connected = data.wearable && !connecting;
  const pick = (k) => {
    set({ wearable: k }); setConnecting(true);
    setTimeout(() => { setConnecting(false); reward(60, 'Device Synced'); }, 1700);
  };
  return (
    <Shell stars={0.7} footer={
      connected
        ? <CTA onClick={next} sub="Reward · +60 Coins earned">Power Up Spine <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg></CTA>
        : <button onClick={next} style={{ width: '100%', border: `1px solid ${SV.glassBorder}`, background: 'transparent', color: SV.muted, fontFamily: 'Sora', fontWeight: 700, fontSize: 15, padding: 16, borderRadius: 20, cursor: 'pointer' }}>Continue Manually</button>
    }>
      <Eyebrow color={SV.cyan}>Wearable Connection</Eyebrow>
      <Title style={{ marginTop: 8, fontSize: 25 }}>Plug a power source into your spine.</Title>

      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        <SpineAvatar strength={connected ? 0.95 : 0.5} scale={0.42} height={300} />
        {(connecting || connected) && (
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 300 300" preserveAspectRatio="none">
            <path d="M40 60 Q150 100 150 150" fill="none" stroke={SV.cyan} strokeWidth="2" strokeDasharray="4 8" className="sv-flow" opacity="0.8" />
          </svg>
        )}
        {connected && (
          <div style={{ position: 'absolute', top: 4, left: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[['Steps', '8,420'], ['Heart', '64 bpm'], ['Active', '46 min']].map(([k, v]) => (
              <div key={k} className="sv-enter" style={{ padding: '6px 11px', borderRadius: 10, background: SV.chipBg, border: `1px solid ${SV.cyan}55` }}>
                <div style={{ fontFamily: 'Manrope', fontSize: 9.5, color: SV.faint, textTransform: 'uppercase', letterSpacing: 1 }}>{k}</div>
                <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 13, color: SV.cyan }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {connecting && <div style={{ textAlign: 'center', fontFamily: 'Sora', fontWeight: 700, fontSize: 13, color: SV.cyan, marginBottom: 10 }} className="sv-pulse">Channeling energy…</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9, paddingBottom: 6 }}>
        {WEARABLES.map((wb) => {
          const on = data.wearable === wb.key;
          return (
            <Glass key={wb.key} active={on} onClick={() => pick(wb.key)} style={{ padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ width: 30, height: 30, margin: '0 auto 7px', borderRadius: 9, background: on ? `${SV.cyan}22` : SV.subtle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="6" y="2" width="12" height="20" rx="4" stroke={on ? SV.cyan : SV.muted} strokeWidth="2" /><circle cx="12" cy="12" r="3" fill={on ? SV.cyan : SV.muted} /></svg>
              </div>
              <div style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 10.5, color: on ? SV.text : SV.muted, lineHeight: 1.2 }}>{wb.label}</div>
            </Glass>
          );
        })}
      </div>
    </Shell>
  );
}
window.WearableScreen = WearableScreen;

// ════════════ SCREEN 11 — Intelligence Scan ════════════
const SCAN_METRICS = ['Sleep', 'Movement', 'Pain', 'Weight', 'Occupation', 'Activity'];
function ScanScreen() {
  const { next } = useApp();
  const [active, setActive] = React.useState(-1);
  React.useEffect(() => {
    const timers = SCAN_METRICS.map((_, i) => setTimeout(() => setActive(i), 500 + i * 560));
    const done = setTimeout(() => next(), 500 + SCAN_METRICS.length * 560 + 900);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, []);
  return (
    <Shell stars={1.4} pad={false} bg={`radial-gradient(110% 80% at 50% 45%, ${SV.indigo2} 0%, ${SV.void1} 55%, ${SV.void0} 100%)`}>
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '108px 22px 40px' }}>
        {/* HUD grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }}>
          <defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke={SV.cyan} strokeWidth="0.5" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <Eyebrow>Spine Intelligence Scan</Eyebrow>
        <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, color: SV.text, marginTop: 8, marginBottom: 6 }} className="sv-pulse">Analyzing your spine…</div>

        <div style={{ position: 'relative', margin: '8px 0' }}>
          {/* rotating reticle */}
          <svg width="280" height="280" viewBox="0 0 280 280" style={{ position: 'absolute', inset: 0 }} className="sv-spin-slow">
            <circle cx="140" cy="140" r="120" fill="none" stroke={SV.cyan} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 10" />
            <circle cx="140" cy="140" r="100" fill="none" stroke={SV.violet} strokeOpacity="0.3" strokeWidth="1" strokeDasharray="40 200" />
          </svg>
          <div style={{ position: 'relative', filter: 'drop-shadow(0 0 30px rgba(47,230,255,0.5))' }}>
            <SpineAvatar strength={0.85} scale={0.5} height={260} />
            {/* scan sweep */}
            <div className="sv-scan" style={{ position: 'absolute', left: 0, right: 0, height: 50, background: `linear-gradient(180deg, transparent, ${SV.cyan}55, transparent)`, borderTop: `1.5px solid ${SV.cyan}`, borderBottom: `1.5px solid ${SV.cyan}` }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14, width: '100%' }}>
          {SCAN_METRICS.map((m, i) => {
            const on = i <= active;
            return (
              <div key={m} style={{ padding: '9px 6px', borderRadius: 12, textAlign: 'center', border: `1px solid ${on ? SV.cyan : SV.glassBorder}`, background: on ? `${SV.cyan}1a` : 'transparent', transition: '.3s' }}>
                <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 11.5, color: on ? SV.cyan : SV.faint }}>{m}</div>
                <div style={{ fontFamily: 'Manrope', fontSize: 9, color: on ? SV.cyan : SV.faint, opacity: 0.8 }}>{on ? '✓ analyzed' : '— — —'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
window.ScanScreen = ScanScreen;

// ════════════ SCREEN 12 — Spine Score Reveal ════════════
const AVATARS = [
  { key: 'cyber', name: 'Cyber Spine', at: 0, c1: SV.cyan, c2: SV.violet },
  { key: 'golden', name: 'Golden Spine', at: 350, c1: '#ffe79a', c2: SV.gold },
  { key: 'titanium', name: 'Titanium Spine', at: 600, c1: '#dfe7f0', c2: '#9fb0c8' },
  { key: 'neural', name: 'Neural Spine', at: 900, c1: '#ff8ad6', c2: '#7a5bff' },
  { key: 'elite', name: 'Elite Spine', at: 1300, c1: '#7dffd6', c2: '#28c2a0' },
];
window.AVATARS = AVATARS;

function Ring({ value, color, size = 168 }) {
  const r = size / 2 - 12, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={SV.track} strokeWidth="10" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c - (c * value) / 100} style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)', filter: `drop-shadow(0 0 8px ${color})` }} />
    </svg>
  );
}

function ScoreScreen() {
  const { data, coins, level, restart, reward, set } = useApp();
  const res = React.useMemo(() => computeScore(data), [data]);
  const [shown, setShown] = React.useState(res.score);
  const [ringV, setRingV] = React.useState(0);

  React.useEffect(() => {
    // count up
    const start = performance.now(), dur = 1500;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(res.score * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const rt = setTimeout(() => setRingV(res.score), 120);
    if (!data.scored) { setTimeout(() => { reward(150, 'Assessment Complete'); set({ scored: true }); }, 1600); }
    return () => { cancelAnimationFrame(raf); clearTimeout(rt); };
  }, []);

  const nextLevel = LEVELS.find((l) => l.at > coins) || LEVELS[LEVELS.length - 1];
  const prevAt = level.at, span = Math.max(1, nextLevel.at - prevAt);
  const lvlPct = Math.min(100, ((coins - prevAt) / span) * 100);

  return (
    <Shell stars={1.2} bg={`radial-gradient(110% 70% at 50% 0%, ${SV.indigo2} 0%, ${SV.void1} 50%, ${SV.void0} 100%)`}
      footer={<CTA tone="gold" onClick={restart} sub="Replay the journey">Enter SPINEVERSE</CTA>}>
      <div style={{ textAlign: 'center' }}>
        <Eyebrow color={res.risk[1]}>Your Spine Score</Eyebrow>
      </div>

      {/* score ring */}
      <div style={{ position: 'relative', alignSelf: 'center', margin: '14px 0 6px' }} className="sv-pop">
        <Ring value={ringV} color={res.risk[1]} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 52, color: SV.text, lineHeight: 1, textShadow: `0 0 30px ${res.risk[1]}88` }}>{shown}</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 12, color: SV.faint }}>/ 100</div>
        </div>
      </div>

      {/* risk badge */}
      <div style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 99, background: `${res.risk[1]}1f`, border: `1px solid ${res.risk[1]}66`, marginBottom: 14 }}>
        <span style={{ width: 9, height: 9, borderRadius: 99, background: res.risk[1], boxShadow: `0 0 8px ${res.risk[1]}` }} />
        <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 13, color: res.risk[1] }}>{res.risk[0]} Risk</span>
      </div>

      {/* age cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
        <Glass style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 11, color: SV.faint, textTransform: 'uppercase', letterSpacing: 1 }}>Spine Age</div>
          <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 34, color: res.spineAge > res.actualAge ? SV.pain2 : SV.cyan, lineHeight: 1.1 }}>{res.spineAge}</div>
        </Glass>
        <Glass style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 11, color: SV.faint, textTransform: 'uppercase', letterSpacing: 1 }}>Actual Age</div>
          <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 34, color: SV.text, lineHeight: 1.1 }}>{res.actualAge}</div>
        </Glass>
      </div>

      {/* contributors */}
      {res.contributors.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 13, color: SV.muted, marginBottom: 9 }}>Top contributors</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {res.contributors.map((c, i) => (
              <div key={c} className="sv-enter" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', borderRadius: 14, background: 'rgba(255,80,90,0.08)', border: '1px solid rgba(255,80,90,0.18)', animationDelay: `${i * 0.1}s` }}>
                <span style={{ width: 7, height: 7, borderRadius: 99, background: SV.pain3, boxShadow: `0 0 8px ${SV.pain3}` }} />
                <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13.5, color: SV.text }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* level progress */}
      <Glass style={{ marginTop: 18, padding: 16 }} glow={SV.gold}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Coin size={20} />
            <span style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 18, color: SV.gold }}>{coins}</span>
            <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 12, color: SV.faint }}>Spine Coins</span>
          </div>
          <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 13, color: SV.cyan }}>{level.name}</span>
        </div>
        <div style={{ height: 9, borderRadius: 99, background: SV.track, overflow: 'hidden' }}>
          <div style={{ width: `${lvlPct}%`, height: '100%', borderRadius: 99, background: `linear-gradient(90deg,${SV.gold},${SV.goldDeep})`, transition: 'width 1s ease .4s' }} />
        </div>
        <div style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 11, color: SV.faint, marginTop: 7 }}>
          {nextLevel.at > coins ? `${nextLevel.at - coins} coins to ${nextLevel.name}` : 'Max level reached — Legend'}
        </div>
      </Glass>

      {/* avatar unlocks */}
      <div style={{ marginTop: 18 }}>
        <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 13, color: SV.muted, marginBottom: 10 }}>Spine avatars</div>
        <div style={{ display: 'flex', gap: 11, overflowX: 'auto', paddingBottom: 6, margin: '0 -22px', padding: '0 22px 6px' }}>
          {AVATARS.map((a) => {
            const unlocked = coins >= a.at;
            return (
              <div key={a.key} style={{ flex: '0 0 auto', width: 96, textAlign: 'center', opacity: unlocked ? 1 : 0.5 }}>
                <div style={{ height: 116, borderRadius: 18, border: `1px solid ${unlocked ? a.c1 + '66' : SV.glassBorder}`, background: unlocked ? `radial-gradient(circle at 50% 30%, ${a.c1}22, transparent)` : SV.subtle, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <svg viewBox="0 0 40 100" width="34" height="86" style={{ filter: unlocked ? `drop-shadow(0 0 8px ${a.c1})` : 'grayscale(1)' }}>
                    <defs><linearGradient id={'av' + a.key} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={a.c1} /><stop offset="100%" stopColor={a.c2} /></linearGradient></defs>
                    {[...Array(9)].map((_, i) => <rect key={i} x={14 - i * 0.2} y={8 + i * 9} width={12 + i} height={6} rx={3} fill={`url(#av${a.key})`} />)}
                  </svg>
                  {!unlocked && <div style={{ position: 'absolute', top: 7, right: 7 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke={SV.faint} strokeWidth="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={SV.faint} strokeWidth="2" /></svg></div>}
                </div>
                <div style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 11, color: unlocked ? SV.text : SV.faint, marginTop: 7 }}>{a.name}</div>
                <div style={{ fontFamily: 'Manrope', fontSize: 9.5, color: unlocked ? SV.cyan : SV.faint }}>{unlocked ? 'Unlocked' : `${a.at} coins`}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VIP */}
      <Glass style={{ marginTop: 18, padding: 18 }} glow={SV.gold}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={SV.gold}><path d="M3 7l5 4 4-7 4 7 5-4-2 12H5z" /></svg>
          <span style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 16, color: SV.gold }}>VIP Membership</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Priority Consultations', 'Free Follow-ups', 'Premium Reports', 'Quarterly Spine Reviews', 'Exclusive Challenges'].map((b) => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={SV.gold} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13.5, color: SV.text }}>{b}</span>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 11.5, color: SV.faint, marginTop: 12, textAlign: 'center' }}>Unlocked through daily engagement</div>
      </Glass>

      <div style={{ height: 12 }} />
    </Shell>
  );
}
window.ScoreScreen = ScoreScreen;

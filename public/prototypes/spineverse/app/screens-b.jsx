// SPINEVERSE — Screens 5-8

// ════════════ SCREEN 5 — Sitting Assessment ════════════
function SittingScreen() {
  const { next, reward, data, set } = useApp();
  const hrs = data.sitting;
  const load = Math.min(1, Math.max(0, (hrs - 2) / 10));
  const posture = 1 - load * 0.85;
  const verdict = load < 0.3 ? ['Aligned', SV.cyan] : load < 0.6 ? ['Compressing', SV.pain2] : ['Under strain', SV.pain3];
  return (
    <Shell stars={0.5} footer={
      <CTA onClick={() => { reward(70, 'Posture Logged'); next(); }} sub="Reward · +70 Coins">
        Continue
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </CTA>
    }>
      <Eyebrow color={verdict[1]}>Sitting Assessment</Eyebrow>
      <Title style={{ marginTop: 8, fontSize: 25 }}>What sitting does to your discs.</Title>

      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        {/* chair */}
        <svg width="220" height="320" viewBox="0 0 220 320" style={{ position: 'absolute' }}>
          <g stroke={SV.faint} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55">
            <path d="M70 70 Q66 180 70 230 L150 230 Q150 250 150 280" />
            <path d="M70 230 L70 280 M150 230 L150 280" />
            <path d="M62 230 L158 230" />
          </g>
          <path d="M64 230 L156 230 L150 250 L70 250 Z" fill={SV.subtle} />
        </svg>
        {/* seated spine */}
        <div style={{ position: 'relative', transition: 'transform .4s' }}>
          <SpineAvatar strength={0.5} posture={posture} compress={load} scale={0.5} height={320} current={load < 0.5} />
        </div>
        {/* compression label */}
        <div style={{ position: 'absolute', right: 6, top: '46%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 13, color: verdict[1] }}>{verdict[0]}</span>
          <span style={{ fontFamily: 'Manrope', fontSize: 11, color: SV.faint, maxWidth: 90, textAlign: 'right' }}>disc pressure {Math.round(load * 100)}%</span>
        </div>
      </div>

      <Glass style={{ marginBottom: 6 }}>
        <Slider min={2} max={14} value={hrs} accent={verdict[1]}
          onChange={(v) => set({ sitting: v })} format={(v) => `${v} hrs/day`} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Manrope', fontWeight: 600, fontSize: 11.5, color: SV.faint, marginTop: 6 }}>
          <span>Active day</span><span>Desk-bound</span>
        </div>
      </Glass>
    </Shell>
  );
}
window.SittingScreen = SittingScreen;

// ════════════ SCREEN 6 — Movement Journey ════════════
function MovementScreen() {
  const { next, reward, data, set } = useApp();
  const min = data.walking;
  const p = Math.min(1, min / 120); // progress
  const walkPos = 10 + p * 70;
  return (
    <Shell stars={0.5} bg={themed(`linear-gradient(180deg, ${SV.indigo} 0%, #102a4a ${30 + p * 20}%, #0a1530 100%)`, `linear-gradient(180deg, #dcebff 0%, #cfe6ff ${30 + p * 20}%, #eaf3ff 100%)`)}
      footer={
        <CTA onClick={() => { reward(90, 'Distance Logged'); next(); }} sub="Reward · +90 Coins">
          Continue
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </CTA>
      }>
      <Eyebrow color={SV.aGreen}>Movement Journey</Eyebrow>
      <Title style={{ marginTop: 8, fontSize: 25 }}>How far does your body travel daily?</Title>

      <div style={{ flex: 1, position: 'relative', minHeight: 0, margin: '12px -22px 0', overflow: 'hidden' }}>
        {/* sun */}
        <div style={{ position: 'absolute', top: 12, right: 30, width: 56, height: 56, borderRadius: 99, background: 'radial-gradient(circle,#fff6d8,#ffcf52)', boxShadow: `0 0 ${20 + p * 50}px rgba(255,207,82,${0.3 + p * 0.4})`, opacity: 0.5 + p * 0.5, transition: '.5s' }} />
        {/* mountains — unlock with progress */}
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <path d="M0 200 L80 110 L150 200 Z" fill="#1c3a5a" opacity={p > 0.25 ? 0.9 : 0.1} style={{ transition: '.6s' }} />
          <path d="M120 200 L220 80 L320 200 Z" fill="#244a72" opacity={p > 0.5 ? 0.95 : 0.1} style={{ transition: '.6s' }} />
          <path d="M260 200 L340 120 L400 200 Z" fill="#1c3a5a" opacity={p > 0.75 ? 0.9 : 0.1} style={{ transition: '.6s' }} />
          {/* snow caps */}
          <path d="M205 95 L220 80 L235 95 L226 99 L220 93 L214 99 Z" fill="#cfe6ff" opacity={p > 0.5 ? 0.9 : 0} style={{ transition: '.6s' }} />
          {/* river */}
          <path d="M-10 270 Q120 250 200 268 T410 262 L410 300 L-10 300 Z" fill="#2a78c8" opacity={p > 0.4 ? 0.85 : 0.15} style={{ transition: '.6s' }} />
          {/* ground path */}
          <path d="M0 270 Q200 256 400 272" fill="none" stroke="#3a6b4a" strokeWidth="40" opacity="0.5" />
          <path d="M20 268 Q200 256 380 270" fill="none" stroke="#d9c08a" strokeWidth="6" strokeDasharray="2 12" strokeLinecap="round" opacity="0.7" />
          {/* birds */}
          {p > 0.6 && [...Array(4)].map((_, i) => (
            <path key={i} className="sv-bird" d="M0 0 q4 -4 8 0 q4 -4 8 0" fill="none" stroke="#cfe0ff" strokeWidth="1.6"
              transform={`translate(${60 + i * 70} ${50 + (i % 2) * 20}) scale(${0.8 + (i % 2) * 0.3})`} style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
        </svg>
        {/* walking character */}
        <div className="sv-walk" style={{ position: 'absolute', bottom: 18, left: `${walkPos}%`, transition: 'left .5s' }}>
          <svg width="34" height="46" viewBox="0 0 34 46">
            <circle cx="17" cy="8" r="6" fill="#37e0a0" />
            <path d="M17 14 L17 30 M17 18 L8 24 M17 18 L26 22 M17 30 L9 42 M17 30 L25 42" stroke="#37e0a0" strokeWidth="3" strokeLinecap="round" fill="none" className="sv-stride" />
          </svg>
        </div>
      </div>

      <Glass style={{ marginTop: 10, marginBottom: 6 }}>
        <Slider min={0} max={120} step={5} value={min} accent="#37e0a0"
          onChange={(v) => set({ walking: v })} format={(v) => (v >= 120 ? '120+ min' : `${v} min`)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Manrope', fontWeight: 600, fontSize: 11.5, color: SV.faint, marginTop: 6 }}>
          <span>Sedentary</span><span>Explorer</span>
        </div>
      </Glass>
    </Shell>
  );
}
window.MovementScreen = MovementScreen;

// ════════════ SCREEN 7 — Exercise Arena ════════════
const ACTIVITIES = [
  { key: 'running', label: 'Running', color: '#ff6b6b', lc: '#dd454c' },
  { key: 'gym', label: 'Gym', color: '#ffcf52', lc: '#a96b04' },
  { key: 'yoga', label: 'Yoga', color: '#9d6bff', lc: '#6a39de' },
  { key: 'swimming', label: 'Swimming', color: '#2fe6ff', lc: '#0a8aae' },
  { key: 'sports', label: 'Sports', color: '#37e0a0', lc: '#1f9e72' },
];
window.ACTIVITIES = ACTIVITIES;

function ActIcon({ kind, color }) {
  const s = { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const p = {
    running: <g {...s}><circle cx="15" cy="5.5" r="2" fill={color} /><path d="M13 10l-4 3 3 3-1 5M13 10l4-1 3 3 3 0M9 13l-4 1" /></g>,
    gym: <g {...s}><path d="M3 9v6M21 9v6M6 7v10M18 7v10M6 12h12" /></g>,
    yoga: <g {...s}><circle cx="12" cy="4.5" r="1.8" fill={color} /><path d="M12 7v6m0 0l-6 6m6-6l6 6M6 11h12" /></g>,
    swimming: <g {...s}><circle cx="7" cy="8" r="2" fill={color} /><path d="M9 11l4-2 3 3M3 17c2-1.5 3 1 5 0s3-1 5 0 3 1 5 0M3 21c2-1.5 3 1 5 0s3-1 5 0 3 1 5 0" /></g>,
    sports: <g {...s}><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 0 0 18M3 12h18M5 6c3 2 11 2 14 0M5 18c3-2 11-2 14 0" /></g>,
  };
  return <svg width="30" height="30" viewBox="0 0 24 24">{p[kind]}</svg>;
}
window.ActIcon = ActIcon;

function ExerciseScreen() {
  const { next, reward, data, set } = useApp();
  const sel = data.exercise;
  const toggle = (k) => set({ exercise: sel.includes(k) ? sel.filter((x) => x !== k) : [...sel, k] });
  const strength = Math.min(1, 0.35 + sel.length * 0.16);
  return (
    <Shell stars={0.6} footer={
      <CTA onClick={() => { reward(110, 'Spine Strengthened'); next(); }} sub="Reward · +110 Coins">
        Continue
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </CTA>
    }>
      <Eyebrow color={SV.aGreen}>Exercise Arena</Eyebrow>
      <Title style={{ marginTop: 8, fontSize: 25 }}>What makes your spine stronger?</Title>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, padding: '4px 0 12px' }}>
        <SpineAvatar strength={strength} scale={0.2} />
        <div>
          <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 30, color: SV.cyan, textShadow: `0 0 24px ${SV.cyan}77`, lineHeight: 1 }}>{Math.round(strength * 100)}%</div>
          <div style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 12, color: SV.muted, marginTop: 2 }}>spine strength</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingBottom: 18 }}>
        {ACTIVITIES.map((a) => {
          const on = sel.includes(a.key);
          const col = themed(a.color, a.lc);
          return (
            <Glass key={a.key} active={on} onClick={() => toggle(a.key)} style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 11 }}>
              <div className={on ? 'sv-pop' : ''} style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? `${col}22` : SV.subtle, flexShrink: 0 }}>
                <ActIcon kind={a.key} color={on ? col : SV.muted} />
              </div>
              <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14.5, color: SV.text }}>{a.label}</div>
              {on && <div style={{ marginLeft: 'auto', color: col }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={col} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
            </Glass>
          );
        })}
        <Glass style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }} onClick={() => set({ exercise: [] })}>
          <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: SV.muted }}>None right now</span>
        </Glass>
      </div>
    </Shell>
  );
}
window.ExerciseScreen = ExerciseScreen;

// ════════════ SCREEN 8 — Lifting Challenge ════════════
const LIFTS = [
  { key: 'never', label: 'Never', desc: 'Rarely lift heavy', weight: 0 },
  { key: 'occasionally', label: 'Occasionally', desc: 'A few times a week', weight: 1 },
  { key: 'daily', label: 'Daily', desc: 'Heavy, every day', weight: 2 },
];
window.LIFTS = LIFTS;

function LiftingScreen() {
  const { next, reward, data, set } = useApp();
  const w = data.lifting ? LIFTS.find((l) => l.key === data.lifting).weight : 0;
  const load = w / 2; // 0..1
  const boxes = w === 0 ? 0 : w === 1 ? 1 : 2;
  return (
    <Shell stars={0.5} footer={
      <CTA onClick={() => { reward(70, 'Load Logged'); next(); }} sub={data.lifting ? 'Reward · +70 Coins' : 'Choose how often you lift'} style={{ opacity: data.lifting ? 1 : 0.5, pointerEvents: data.lifting ? 'auto' : 'none' }}>
        Continue
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </CTA>
    }>
      <Eyebrow color={SV.aOrange}>Lifting Challenge</Eyebrow>
      <Title style={{ marginTop: 8, fontSize: 25 }}>How much load do you carry?</Title>

      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        {/* lifter silhouette */}
        <svg width="200" height="260" viewBox="0 0 200 260">
          <ellipse cx="100" cy="244" rx="70" ry="9" fill={themed('#000', '#9aa4c8')} opacity={themed(0.4, 0.35)} />
          {/* spine pressure zone */}
          {load > 0 && <ellipse cx="100" cy="150" rx={26 + load * 14} ry={20 + load * 10} fill={painColor(load >= 1 ? 3 : 2)} opacity={0.18 + load * 0.2} style={{ filter: 'blur(8px)' }} />}
          <g fill={themed(SV.cyan, '#2f6fd0')} opacity={themed(0.9, 1)} stroke="none">
            <circle cx="100" cy="70" r="12" />
            <path d="M84 88 q16 -8 32 0 l-4 60 q-12 6 -24 0 z" />
            <path d="M86 92 l-22 24 M114 92 l22 24" stroke={themed(SV.cyan, '#2f6fd0')} strokeWidth="9" strokeLinecap="round" />
            <path d="M88 146 l-6 64 M112 146 l6 64" stroke={themed(SV.cyan, '#2f6fd0')} strokeWidth="11" strokeLinecap="round" />
          </g>
          {/* boxes */}
          {boxes >= 1 && <rect x="48" y="100" width="30" height="30" rx="3" fill={themed(SV.gold, '#d99a1e')} opacity="0.9" className="sv-pop" />}
          {boxes >= 1 && <rect x="122" y="100" width="30" height="30" rx="3" fill={themed(SV.gold, '#d99a1e')} opacity="0.9" className="sv-pop" />}
          {boxes >= 2 && <rect x="50" y="68" width="26" height="26" rx="3" fill={SV.goldDeep} opacity="0.95" className="sv-pop" />}
          {boxes >= 2 && <rect x="124" y="68" width="26" height="26" rx="3" fill={SV.goldDeep} opacity="0.95" className="sv-pop" />}
        </svg>
        {load > 0 && (
          <div style={{ position: 'absolute', right: 4, top: '40%', textAlign: 'right' }}>
            <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 13, color: painColor(load >= 1 ? 3 : 2) }}>Lumbar load</div>
            <div style={{ fontFamily: 'Manrope', fontSize: 11, color: SV.faint }}>{Math.round(40 + load * 55)}% pressure</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 6 }}>
        {LIFTS.map((l) => {
          const on = data.lifting === l.key;
          return (
            <Glass key={l.key} active={on} onClick={() => set({ lifting: l.key })} style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[0, 1, 2].map((i) => <span key={i} style={{ width: 7, height: 18 + i * 6, borderRadius: 2, background: i <= l.weight ? (on ? SV.goldInk : SV.muted) : SV.track }} />)}
              </div>
              <div>
                <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, color: SV.text }}>{l.label}</div>
                <div style={{ fontFamily: 'Manrope', fontSize: 12, color: SV.muted }}>{l.desc}</div>
              </div>
              {on && <div style={{ marginLeft: 'auto', color: SV.goldInk }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={SV.goldInk} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
            </Glass>
          );
        })}
      </div>
    </Shell>
  );
}
window.LiftingScreen = LiftingScreen;

// SPINEVERSE — shared Shell/Slider + Screens 1-4

// ───────── Screen shell: full-bleed bg + scrollable content + footer ─────────
function Shell({ children, footer, bg, pad = true, scroll = true, hue = 'cool', stars = 1 }) {
  return (
    <div style={{ position: 'relative', minHeight: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: bg || `radial-gradient(120% 80% at 50% 0%, ${SV.indigo} 0%, ${SV.void1} 55%, ${SV.void0} 100%)` }} />
      {stars > 0 && <Starfield density={stars} hue={hue} />}
      <div className="sv-enter" style={{
        position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column',
        overflowY: scroll ? 'auto' : 'hidden', padding: pad ? '108px 22px 0' : 0,
      }}>
        {children}
      </div>
      {footer && (
        <div style={{ position: 'relative', zIndex: 3, padding: '14px 22px 40px', background: `linear-gradient(0deg, ${SV.void0} 35%, transparent)` }}>
          {footer}
        </div>
      )}
    </div>
  );
}
window.Shell = Shell;

// ───────── Custom glowing slider ─────────
function Slider({ min, max, step = 1, value, onChange, format, accent = SV.cyan }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', fontFamily: 'Sora', fontWeight: 700, fontSize: 44, color: SV.text, lineHeight: 1, marginBottom: 14, textShadow: `0 0 30px ${accent}88` }}>
        {format ? format(value) : value}
      </div>
      <div style={{ position: 'relative', height: 34, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 8, borderRadius: 99, background: SV.track }} />
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 8, borderRadius: 99, background: `linear-gradient(90deg, ${SV.cyan}, ${accent})`, boxShadow: `0 0 16px ${accent}` }} />
        <div style={{ position: 'absolute', left: `calc(${pct}% - 13px)`, width: 26, height: 26, borderRadius: 99, background: '#fff', boxShadow: `0 0 0 5px ${accent}55, 0 4px 14px rgba(0,0,0,0.5)`, pointerEvents: 'none' }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: 'absolute', inset: 0, width: '100%', height: 34, opacity: 0, cursor: 'pointer', margin: 0 }} />
      </div>
    </div>
  );
}
window.Slider = Slider;

// ════════════ SCREEN 1 — Meet Your Spine ════════════
function MeetScreen() {
  const { beginJourney } = useApp();
  return (
    <Shell stars={1.4} footer={
      <CTA tone="energy" sub="Reward · +50 Spine Coins" onClick={beginJourney}>
        Begin Journey
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </CTA>
    }>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingBottom: 10 }}>
        <Eyebrow>SPINEVERSE™</Eyebrow>
        <div style={{ margin: '18px 0 6px', filter: 'drop-shadow(0 0 40px rgba(47,230,255,0.3))' }} className="sv-float">
          <SpineAvatar strength={0.6} scale={0.78} />
        </div>
        <Title style={{ fontSize: 27, maxWidth: 300 }}>Let's discover what your spine is trying to tell you.</Title>
        <p style={{ fontFamily: 'Manrope', fontSize: 14.5, color: SV.muted, marginTop: 12, maxWidth: 280, lineHeight: 1.5 }}>
          Meet your living digital spine. It grows, glows and evolves as we learn about you.
        </p>
      </div>
    </Shell>
  );
}
window.MeetScreen = MeetScreen;

// ════════════ SCREEN 2 — Pain Mapping ════════════
function PainScreen() {
  const { next, reward, data, set } = useApp();
  const [view, setView] = React.useState('back');
  const tap = (key) => {
    const cur = data.pain[key] || 0;
    const nextLvl = (cur + 1) % 4;
    const pain = { ...data.pain };
    if (nextLvl === 0) delete pain[key]; else pain[key] = nextLvl;
    set({ pain });
  };
  const any = Object.keys(data.pain).length > 0;
  return (
    <Shell stars={0.7} footer={
      <CTA onClick={() => { reward(100, 'Pain Mapped'); next(); }} sub={any ? 'Reward · +100 Coins' : 'Tap a glowing area, or continue'}>
        {any ? 'Continue' : 'No pain to report'}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </CTA>
    }>
      <Eyebrow>Pain Mapping</Eyebrow>
      <Title style={{ marginTop: 8, fontSize: 25 }}>Where does your body hold tension?</Title>

      {/* view switch */}
      <div style={{ display: 'flex', gap: 6, marginTop: 14, padding: 4, background: SV.subtle, borderRadius: 14, alignSelf: 'flex-start' }}>
        {['front', 'back', 'side'].map((v) => (
          <button key={v} onClick={() => setView(v)} style={{
            border: 'none', cursor: 'pointer', padding: '7px 16px', borderRadius: 10,
            fontFamily: 'Sora', fontWeight: 700, fontSize: 12.5, textTransform: 'capitalize',
            background: view === v ? `linear-gradient(135deg,${SV.cyan},${SV.violet})` : 'transparent',
            color: view === v ? SV.onEnergy : SV.muted,
          }}>{v}</button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 0, padding: '6px 0' }}>
        <div style={{ flex: 1, maxWidth: 215, height: 330, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BodyMap view={view} pain={data.pain} onTap={tap} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9 }}>
          <SpineAvatar pain={data.pain} strength={0.5} scale={0.32} current={false} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, paddingBottom: 6 }}>
        {[['Mild', SV.pain1], ['Moderate', SV.pain2], ['Severe', SV.pain3]].map(([l, c]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 11, height: 11, borderRadius: 99, background: c, boxShadow: `0 0 10px ${c}` }} />
            <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 12, color: SV.muted }}>{l}</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}
window.PainScreen = PainScreen;

// ════════════ SCREEN 3 — Sleep Realm ════════════
function SleepScreen() {
  const { next, reward, data, set } = useApp();
  const h = data.sleep;
  const bright = Math.min(1, Math.max(0, (h - 3) / 7)); // 0 at 3h, 1 at 10h
  const skyTop = `hsl(${230 + bright * 10}, ${50 + bright * 20}%, ${6 + bright * 16}%)`;
  return (
    <Shell stars={1 + bright * 1.6} bg={themed(`radial-gradient(120% 90% at 50% 8%, ${skyTop} 0%, #05071a 60%, #03040f 100%)`, `radial-gradient(120% 90% at 50% 8%, hsl(${225 - bright * 15}, 70%, ${82 + bright * 8}%) 0%, #eef1fb 60%, #e3e7f5 100%)`)}
      footer={
        <CTA onClick={() => { reward(80, 'Dream Tokens'); next(); }} sub="Reward · +80 Dream Tokens">
          Rest Logged
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </CTA>
      }>
      <Eyebrow color={SV.violet}>Sleep Realm</Eyebrow>
      <Title style={{ marginTop: 8, fontSize: 25 }}>How much rest does your spine receive?</Title>

      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
        {/* moon */}
        <div style={{ position: 'absolute', top: 4, right: 14, width: 78, height: 78, borderRadius: 99,
          background: `radial-gradient(circle at 36% 34%, #fff, #d6e0ff ${30 + bright * 20}%, #8a96d8)`,
          boxShadow: `0 0 ${30 + bright * 70}px ${20 + bright * 40}px rgba(180,200,255,${0.12 + bright * 0.4})`,
          transition: 'box-shadow .5s' }} />
        {/* clouds */}
        <div className="sv-cloud" style={{ position: 'absolute', top: 120, left: -40, width: 150, height: 36, borderRadius: 99, background: themed('rgba(255,255,255,0.06)', 'rgba(255,255,255,0.85)'), filter: 'blur(8px)' }} />
        <div className="sv-cloud2" style={{ position: 'absolute', top: 200, right: -30, width: 120, height: 30, borderRadius: 99, background: themed('rgba(255,255,255,0.05)', 'rgba(255,255,255,0.7)'), filter: 'blur(8px)' }} />
        {/* bed with the spine floating above it */}
        <div className="sv-float" style={{ position: 'relative', width: 230, height: 200 }}>
          {/* bed */}
          <svg width="230" height="160" viewBox="0 0 230 160" style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <defs><linearGradient id="bedG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={SV.bedTop} /><stop offset="100%" stopColor={SV.bedBot} /></linearGradient></defs>
            <ellipse cx="115" cy="150" rx="100" ry="11" fill={themed('#000', '#7e88cf')} opacity={themed(0.4, 0.3)} />
            {/* mattress */}
            <rect x="18" y="92" width="194" height="40" rx="12" fill="url(#bedG)" />
            <rect x="18" y="92" width="194" height="14" rx="7" fill={SV.bedRail} opacity="0.6" />
            {/* pillow */}
            <rect x="24" y="74" width="52" height="34" rx="13" fill={SV.pillow} />
            {/* blanket */}
            <path d="M86 132 L210 132 L210 116 Q150 104 86 116 Z" fill={SV.blanket} opacity="0.9" />
            <path d="M86 116 Q150 104 210 116" fill="none" stroke={SV.blanketEdge} strokeWidth="2" opacity="0.7" />
            {/* soft resting glow cast on the mattress */}
            <ellipse cx="118" cy="112" rx={42 + bright * 26} ry="9" fill={SV.cyan} opacity={0.12 + bright * 0.22} style={{ filter: 'blur(5px)' }} />
          </svg>
          {/* glowing spine FLOATING above the bed */}
          <div style={{ position: 'absolute', left: '50%', top: 46, transform: 'translateX(-50%) rotate(90deg)', transformOrigin: 'center', filter: `drop-shadow(0 0 ${14 + bright * 22}px ${SV.cyan}${themed('aa', '88')})` }}>
            <SpineAvatar strength={0.4 + bright * 0.5} scale={0.24} breathing current={bright > 0.4} />
          </div>
          {/* Zzz above the pillow */}
          {[...Array(3)].map((_, i) => (
            <span key={i} className="sv-z" style={{ position: 'absolute', left: 150 + i * 12, top: 28 - i * 6, fontFamily: 'Sora', fontWeight: 700, color: SV.sceneInk, fontSize: 14 + i * 6, animationDelay: `${i * 0.6}s` }}>z</span>
          ))}
        </div>
      </div>

      <Glass style={{ padding: '18px 18px 14px', marginBottom: 6 }}>
        <Slider min={3} max={11} value={h} accent={SV.violet}
          onChange={(v) => set({ sleep: v })}
          format={(v) => (v >= 11 ? '10+ h' : `${v} h`)} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Manrope', fontWeight: 600, fontSize: 11.5, color: SV.faint, marginTop: 6 }}>
          <span>Restless</span><span>Restored</span>
        </div>
      </Glass>
    </Shell>
  );
}
window.SleepScreen = SleepScreen;

// ════════════ SCREEN 4 — Work Reality ════════════
const OCCUPATIONS = [
  { key: 'office', label: 'Office Worker', desc: 'Desk · laptop · long sits', icon: 'desk' },
  { key: 'driver', label: 'Driver', desc: 'Cabin · wheel · vibration', icon: 'wheel' },
  { key: 'field', label: 'Field Worker', desc: 'Outdoors · on the move', icon: 'field' },
  { key: 'labour', label: 'Labour Worker', desc: 'Lifting · physical load', icon: 'build' },
];
window.OCCUPATIONS = OCCUPATIONS;

function OccIcon({ kind, color }) {
  const s = { fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    desk: <g {...s}><rect x="4" y="6" width="16" height="10" rx="1.5" /><path d="M2 20h20M8 16v4M16 16v4" /></g>,
    wheel: <g {...s}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.6" /><path d="M12 9.4V3.2M9.7 13.6 4.5 17M14.3 13.6 19.5 17" /></g>,
    field: <g {...s}><path d="M12 3v18M12 8c4-3 7-1 7-1M12 8c-4-3-7-1-7-1M5 21h14" /></g>,
    build: <g {...s}><path d="M14.5 6.5 18 3l3 3-3.5 3.5M14.5 6.5l-9 9a2.1 2.1 0 1 0 3 3l9-9M14.5 6.5l3 3" /></g>,
  };
  return <svg width="26" height="26" viewBox="0 0 24 24">{paths[kind]}</svg>;
}
window.OccIcon = OccIcon;

function WorkScene({ kind }) {
  // simple parallax silhouette scene per occupation
  const C = {
    office: themed('#3aa0ff', '#1f7fe0'), driver: themed('#ff9a3c', '#cf6a12'),
    field: themed('#37e0a0', '#1f9e72'), labour: themed('#ffcf52', '#b9780a'),
  }[kind] || SV.cyan;
  const elements = {
    office: <g><rect x="50" y="120" width="100" height="8" fill={C} opacity="0.8" /><rect x="60" y="92" width="56" height="30" rx="2" fill="none" stroke={C} strokeWidth="2" /><rect x="120" y="100" width="34" height="22" fill={C} opacity="0.5" /></g>,
    driver: <g><path d="M40 130 Q100 90 160 130" fill="none" stroke={C} strokeWidth="2" /><circle cx="100" cy="118" r="22" fill="none" stroke={C} strokeWidth="2.4" /><circle cx="100" cy="118" r="5" fill={C} /></g>,
    field: <g><path d="M30 132 L70 96 L110 132 M90 132 L130 88 L170 132" fill="none" stroke={C} strokeWidth="2" opacity="0.8" /><circle cx="150" cy="50" r="14" fill={C} opacity="0.6" /></g>,
    labour: <g><rect x="60" y="100" width="30" height="30" fill="none" stroke={C} strokeWidth="2" /><rect x="100" y="86" width="30" height="44" fill={C} opacity="0.45" /><path d="M40 130h120" stroke={C} strokeWidth="2" /></g>,
  };
  return (
    <svg viewBox="0 0 200 150" width="100%" height="150" key={kind} className="sv-enter">
      <ellipse cx="100" cy="138" rx="90" ry="9" fill={C} opacity="0.16" />
      {/* worker silhouette */}
      <g fill={C} opacity="0.92"><circle cx="100" cy="66" r="9" /><path d="M91 76h18v34a4 4 0 0 1-4 4h-10a4 4 0 0 1-4-4z" /></g>
      {elements[kind]}
    </svg>
  );
}
window.WorkScene = WorkScene;

function WorkScreen() {
  const { next, reward, data, set } = useApp();
  return (
    <Shell stars={0.6} footer={
      <CTA onClick={() => { reward(70, 'World Selected'); next(); }} sub={data.occupation ? 'Reward · +70 Coins' : 'Select your world to continue'} style={{ opacity: data.occupation ? 1 : 0.5, pointerEvents: data.occupation ? 'auto' : 'none' }}>
        Enter This World
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </CTA>
    }>
      <Eyebrow color={SV.aOrange}>Work Reality</Eyebrow>
      <Title style={{ marginTop: 8, fontSize: 25 }}>Which world do you spend most of your day in?</Title>

      <Glass style={{ marginTop: 16, padding: 8, overflow: 'hidden' }}>
        {data.occupation
          ? <WorkScene kind={data.occupation} />
          : <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', color: SV.faint, fontFamily: 'Manrope', fontSize: 13 }}>Pick a world below — the scene comes alive</div>}
      </Glass>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginTop: 14, paddingBottom: 8 }}>
        {OCCUPATIONS.map((o) => {
          const on = data.occupation === o.key;
          return (
            <Glass key={o.key} active={on} onClick={() => set({ occupation: o.key })} style={{ padding: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? `${SV.cyan}22` : SV.subtle, marginBottom: 10 }}>
                <OccIcon kind={o.icon} color={on ? SV.cyan : SV.muted} />
              </div>
              <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: SV.text }}>{o.label}</div>
              <div style={{ fontFamily: 'Manrope', fontSize: 11.5, color: SV.muted, marginTop: 3 }}>{o.desc}</div>
            </Glass>
          );
        })}
      </div>
    </Shell>
  );
}
window.WorkScreen = WorkScreen;

/* Spine Command Center — 7-step onboarding + calculating + score reveal. */
const { useT: useTO, Icon: IconO, Card: CardO, Pill: PillO, Bar: BarO, ScoreRing: ScoreRingO,
        Avatar: AvatarO, fmt: fmtO, clamp: clampO, scoreBand: scoreBandO } = window;

// ── small controls ─────────────────────────────────────────────────────
function OnbChips({ options, value, onChange, multi = false, cols = 2 }) {
  const t = useTO();
  const sel = multi ? (value || []) : value;
  const isOn = (o) => multi ? sel.includes(o) : sel === o;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 10 }}>
      {options.map(o => {
        const on = isOn(o);
        return (
          <button key={o} onClick={() => onChange(multi ? (on ? sel.filter(x => x !== o) : [...sel, o]) : o)} style={{
            border: `1.5px solid ${on ? t.accent : t.border}`,
            background: on ? t.accentSoft : t.surface,
            color: on ? t.text : t.textDim,
            borderRadius: t.radiusSm, padding: '14px 12px', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, fontFamily: t.fontDisplay, textAlign: 'left',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            transition: 'all .15s',
          }}>
            {o}
            {on && <IconO name="check" size={16} color={t.accent} sw={2.4} />}
          </button>
        );
      })}
    </div>
  );
}

function OnbStepper({ value, onChange, min, max, step = 1, unit, decimals = 0 }) {
  const t = useTO();
  const btn = (d) => (
    <button onClick={() => onChange(clampO(+(value + d * step).toFixed(2), min, max))} style={{
      width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
      border: `1.5px solid ${t.border}`, background: t.surface, color: t.accent,
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}><IconO name={d > 0 ? 'plus' : 'arrowDn'} size={20} color={t.accent} sw={2.4} style={d < 0 ? { transform: 'rotate(0)' } : {}} /></button>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
      <button onClick={() => onChange(clampO(+(value - step).toFixed(2), min, max))} style={{
        width: 52, height: 52, borderRadius: '50%', border: `1.5px solid ${t.border}`, background: t.surface, color: t.accent, cursor: 'pointer', fontSize: 26, fontWeight: 400, lineHeight: 1 }}>–</button>
      <div style={{ textAlign: 'center', minWidth: 120 }}>
        <div style={{ fontSize: 46, fontWeight: 700, color: t.text, fontFamily: t.fontNum, letterSpacing: -1, lineHeight: 1 }}>{value.toFixed(decimals)}</div>
        <div style={{ fontSize: 12.5, color: t.textFaint, marginTop: 4 }}>{unit}</div>
      </div>
      <button onClick={() => onChange(clampO(+(value + step).toFixed(2), min, max))} style={{
        width: 52, height: 52, borderRadius: '50%', border: `1.5px solid ${t.border}`, background: t.surface, color: t.accent, cursor: 'pointer', fontSize: 26, fontWeight: 400, lineHeight: 1 }}>+</button>
    </div>
  );
}

function OnbSlider({ value, onChange, min, max, step = 1, unit, fmtFn }) {
  const t = useTO();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 22 }}>
        <span style={{ fontSize: 46, fontWeight: 700, color: t.text, fontFamily: t.fontNum, letterSpacing: -1 }}>{fmtFn ? fmtFn(value) : value}</span>
        <span style={{ fontSize: 15, color: t.textFaint, fontWeight: 600, marginLeft: 6 }}>{unit}</span>
      </div>
      <div style={{ position: 'relative', height: 40, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 8, borderRadius: 999, background: t.ringTrack }} />
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 8, borderRadius: 999, background: `linear-gradient(90deg, ${t.accent}, ${t.accent2})`, boxShadow: t.glow ? `0 0 12px ${t.accent}aa` : 'none' }} />
        <div style={{ position: 'absolute', left: `calc(${pct}% - 13px)`, width: 26, height: 26, borderRadius: '50%', background: t.accent, boxShadow: t.glow ? `0 0 16px ${t.accent}` : `0 2px 8px rgba(0,0,0,0.5)`, border: '3px solid #04121a' }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)}
          style={{ position: 'absolute', left: 0, right: 0, width: '100%', height: 40, opacity: 0, cursor: 'pointer', margin: 0 }} />
      </div>
    </div>
  );
}

// ── step shell ──────────────────────────────────────────────────────────
function OnbStep({ icon, kicker, title, sub, children }) {
  const t = useTO();
  return (
    <div key={kicker} style={{ animation: 'onbIn .4s cubic-bezier(.2,.7,.3,1) both' }}>
      <div style={{ width: 56, height: 56, borderRadius: 17, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: t.accentSoft, border: `1px solid ${t.accent}33` }}>
        <IconO name={icon} size={28} color={t.accent} />
      </div>
      <div style={{ fontSize: 11.5, letterSpacing: 1.6, textTransform: 'uppercase', color: t.accent, fontWeight: 700, marginBottom: 8 }}>{kicker}</div>
      <h1 style={{ margin: 0, fontFamily: t.fontDisplay, fontSize: 26, fontWeight: 700, color: t.text, letterSpacing: -0.5, lineHeight: 1.12 }}>{title}</h1>
      {sub && <p style={{ margin: '10px 0 0', fontSize: 13.5, color: t.textDim, lineHeight: 1.45 }}>{sub}</p>}
      <div style={{ marginTop: 28 }}>{children}</div>
    </div>
  );
}

// score reveal — renders the final score (reliable; subtle scale-in via CSS)
function RevealScore() {
  return (
    <div style={{ animation: 'onbPop .7s cubic-bezier(.2,.8,.2,1) both' }}>
      <ScoreRingO value={89} size={216} stroke={18} status={scoreBandO(89)} />
    </div>
  );
}

// ── onboarding flow ───────────────────────────────────────────────────────
function Onboarding({ store, onFinish }) {
  const t = useTO();
  const [step, setStep] = React.useState(0);
  const [a, setA] = React.useState({
    occupation: 'Desk / software', sleep: 7, activity: 'Active', steps: 8,
    height: 178, weight: 74, painArea: ['Lower back'], pain: 2,
    mobility: 'With some effort', stiffness: [],
  });
  const set = (k, v) => setA(s => ({ ...s, [k]: v }));
  const bmi = (a.weight / Math.pow(a.height / 100, 2));

  // calculating auto-advances to reveal
  React.useEffect(() => {
    if (step === 7) { const id = setTimeout(() => setStep(8), 2600); return () => clearTimeout(id); }
  }, [step]);

  const TOTAL = 7;
  const connectedCount = store.connected.length;

  // ── finale screens ──
  if (step === 7) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', background: t.bgScene }}>
        <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 30 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `3px solid ${t.ringTrack}` }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `3px solid transparent`, borderTopColor: t.accent, borderRightColor: t.accent, animation: 'onbSpin 0.9s linear infinite', boxShadow: t.glow ? `0 0 20px ${t.accent}66` : 'none' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconO name="spine" size={40} color={t.accent} />
          </div>
        </div>
        <h1 style={{ margin: 0, fontFamily: t.fontDisplay, fontSize: 23, fontWeight: 700, color: t.text }}>Computing your score</h1>
        <p style={{ margin: '12px 0 0', fontSize: 13.5, color: t.textDim, lineHeight: 1.5, maxWidth: 280 }}>
          Modelling sleep, activity, BMI, pain pattern, mobility & wearable signals…
        </p>
      </div>
    );
  }

  if (step === 8) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center', background: t.bgScene }}>
        <div style={{ animation: 'onbIn .6s cubic-bezier(.2,.7,.3,1) both' }}>
          <div style={{ fontSize: 11.5, letterSpacing: 1.6, textTransform: 'uppercase', color: t.accent, fontWeight: 700, marginBottom: 18 }}>Your Spine Intelligence Score</div>
          <RevealScore />
          <p style={{ margin: '26px auto 0', fontSize: 14, color: t.textDim, lineHeight: 1.5, maxWidth: 290 }}>
            You're starting in the <strong style={{ color: t.text }}>top 15%</strong> for your age group. Small daily wins will push you higher.
          </p>
        </div>
        <button onClick={onFinish} style={{
          marginTop: 32, width: '100%', maxWidth: 320, border: 'none', cursor: 'pointer', borderRadius: 999, padding: '17px',
          fontSize: 15.5, fontWeight: 700, fontFamily: t.fontDisplay, color: t.onAccent,
          background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
          boxShadow: t.glow ? `0 8px 30px ${t.accent}55` : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          animation: 'onbIn .6s .2s cubic-bezier(.2,.7,.3,1) both',
        }}>Enter Command Center <IconO name="chevR" size={18} color="#04121a" sw={2.6} /></button>
      </div>
    );
  }

  // ── question steps ──
  const steps = [
    <OnbStep icon="home" kicker="Step 1 of 7 · Profile" title={`Welcome, ${store.patient.name.split(' ')[0]}`} sub="A quick setup so Spine AI can tailor everything to you. What's your day mostly like?">
      <OnbChips cols={2} value={a.occupation} onChange={v => set('occupation', v)}
        options={['Desk / software', 'On my feet', 'Healthcare', 'Driving', 'Manual labour', 'Mixed']} />
    </OnbStep>,

    <OnbStep icon="moon" kicker="Step 2 of 7 · Sleep" title="How long do you sleep?" sub="Average across a typical week. Sleep is one of the strongest spine-recovery signals.">
      <OnbSlider value={a.sleep} onChange={v => set('sleep', v)} min={4} max={10} step={0.5} unit="hours / night" fmtFn={v => v.toFixed(1)} />
    </OnbStep>,

    <OnbStep icon="flame" kicker="Step 3 of 7 · Activity" title="How active are you?" sub="Be honest — this calibrates your baseline, not a judgement.">
      <OnbChips cols={2} value={a.activity} onChange={v => set('activity', v)}
        options={['Sedentary', 'Lightly active', 'Active', 'Very active']} />
      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 12.5, color: t.textDim, marginBottom: 10 }}>Typical daily steps</div>
        <OnbSlider value={a.steps} onChange={v => set('steps', v)} min={2} max={18} step={1} unit="k steps / day" fmtFn={v => v + 'k'} />
      </div>
    </OnbStep>,

    <OnbStep icon="pulse" kicker="Step 4 of 7 · Body" title="Your measurements" sub="Used to estimate spinal load. We'll keep this private.">
      <CardO pad={16} style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, color: t.textDim, marginBottom: 12 }}>Height</div>
        <OnbStepper value={a.height} onChange={v => set('height', v)} min={140} max={210} step={1} unit="cm" />
      </CardO>
      <CardO pad={16} style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, color: t.textDim, marginBottom: 12 }}>Weight</div>
        <OnbStepper value={a.weight} onChange={v => set('weight', v)} min={40} max={160} step={0.5} unit="kg" decimals={1} />
      </CardO>
      <CardO pad={15} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13.5, color: t.textDim }}>Estimated BMI</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: t.text, fontFamily: t.fontNum }}>{bmi.toFixed(1)}</span>
          <PillO tone={bmi < 25 && bmi >= 18.5 ? 'good' : 'warn'}>{bmi < 18.5 ? 'Low' : bmi < 25 ? 'Healthy' : bmi < 30 ? 'Elevated' : 'High'}</PillO>
        </span>
      </CardO>
    </OnbStep>,

    <OnbStep icon="spine" kicker="Step 5 of 7 · Pain pattern" title="Where do you feel it?" sub="Select any areas you notice discomfort. None is a great answer too.">
      <OnbChips cols={2} multi value={a.painArea} onChange={v => set('painArea', v)}
        options={['Neck', 'Upper back', 'Lower back', 'Hips / sciatica', 'Shoulders', 'No pain']} />
      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: t.textDim, marginBottom: 10 }}>
          <span>Typical intensity</span><span style={{ color: t.textFaint }}>0 = none · 10 = severe</span>
        </div>
        <OnbSlider value={a.pain} onChange={v => set('pain', v)} min={0} max={10} step={1} unit="/ 10 pain" />
      </div>
    </OnbStep>,

    <OnbStep icon="trend" kicker="Step 6 of 7 · Mobility" title="Can you touch your toes?" sub="A quick proxy for spinal flexibility and range of motion.">
      <OnbChips cols={1} value={a.mobility} onChange={v => set('mobility', v)}
        options={['Easily, palms flat', 'With some effort', 'Fingertips only', 'Not close']} />
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12.5, color: t.textDim, marginBottom: 10 }}>Any morning stiffness? (optional)</div>
        <OnbChips cols={2} multi value={a.stiffness} onChange={v => set('stiffness', v)}
          options={['Morning', 'After sitting', 'After driving', 'Rarely']} />
      </div>
    </OnbStep>,

    <OnbStep icon="watch" kicker="Step 7 of 7 · Wearables" title="Connect a device" sub="Live data keeps your score accurate and unlocks Spine Coins. Add as many as you like.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {store.devices.filter(d => d.key !== 'manual').slice(0, 5).map(d => {
          const on = store.connected.includes(d.key);
          return (
            <CardO key={d.key} pad={13} active={on} onClick={() => !on && store.connect(d.key)} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${d.color}22`, border: `1px solid ${d.color}44` }}>
                <IconO name="watch" size={20} color={d.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{d.name}</div>
                <div style={{ fontSize: 11.5, color: t.textDim }}>{d.model}</div>
              </div>
              {on
                ? <PillO tone="good"><IconO name="check" size={13} color={t.good} /> Linked</PillO>
                : <span style={{ fontSize: 12.5, fontWeight: 700, color: t.accent }}>Connect</span>}
            </CardO>
          );
        })}
      </div>
    </OnbStep>,
  ];

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => Math.max(0, s - 1));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: t.bgScene }}>
      {/* progress header */}
      <div style={{ padding: '56px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={step === 0 ? onFinish : back} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, color: t.textDim, transform: 'scaleX(-1)' }}>
          <IconO name={step === 0 ? 'chevR' : 'chevR'} size={20} color={t.textDim} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div style={{ flex: 1, display: 'flex', gap: 5 }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= step ? t.accent : t.ringTrack, boxShadow: i <= step && t.glow ? `0 0 6px ${t.accent}88` : 'none', transition: 'background .3s' }} />
          ))}
        </div>
        <button onClick={onFinish} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12.5, color: t.textFaint, fontWeight: 600, fontFamily: t.fontBody }}>Skip</button>
      </div>

      {/* step content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 20px' }}>
        {steps[step]}
      </div>

      {/* continue */}
      <div style={{ padding: '12px 20px 30px', background: `linear-gradient(0deg, ${t.bg} 30%, transparent)` }}>
        <button onClick={next} style={{
          width: '100%', border: 'none', cursor: 'pointer', borderRadius: 999, padding: '16px',
          fontSize: 15.5, fontWeight: 700, fontFamily: t.fontDisplay, color: t.onAccent,
          background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
          boxShadow: t.glow ? `0 8px 28px ${t.accent}55` : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {step === TOTAL - 1 ? <>Calculate my score <IconO name="bolt" size={18} color="#04121a" sw={2.2} /></> : <>Continue <IconO name="chevR" size={18} color="#04121a" sw={2.6} /></>}
        </button>
      </div>
    </div>
  );
}

window.Onboarding = Onboarding;

/* Spine Command Center — screens A: Today, Risk Engine, Wearables */
const { useT, Icon, fmt, clamp, scoreBand,
        Card, Delta, Pill, SectionTitle, Bar, ScoreRing, MiniRing, Sparkline, AreaChart, Avatar } = window;
const D = window.SPINE_DATA;

const SCREEN_PAD = { padding: '58px 16px 104px' };

// shared screen header
function ScreenHead({ kicker, title, sub }) {
  const t = useT();
  return (
    <div style={{ marginBottom: 16 }}>
      {kicker && <div style={{ fontSize: 11.5, letterSpacing: 1.6, textTransform: 'uppercase', color: t.accent, fontWeight: 700, marginBottom: 6 }}>{kicker}</div>}
      <h1 style={{ margin: 0, fontFamily: t.fontDisplay, fontSize: 30, fontWeight: 700, color: t.text, letterSpacing: -0.6, lineHeight: 1.05 }}>{title}</h1>
      {sub && <p style={{ margin: '7px 0 0', fontSize: 13.5, color: t.textDim, lineHeight: 1.4 }}>{sub}</p>}
    </div>
  );
}

// metric tile used in Today snapshot + Wearables
function MetricTile({ m }) {
  const t = useT();
  const goalPct = m.goal ? clamp((m.value / m.goal) * 100, 0, 100) : null;
  return (
    <Card pad={13} style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: t.textDim, marginBottom: 9 }}>
        <Icon name={m.icon} size={15} color={t.accent} />
        <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: 0.2 }}>{m.label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, fontFamily: t.fontNum }}>
        <span style={{ fontSize: 23, fontWeight: 700, color: t.text, letterSpacing: -0.5 }}>{fmt(m.value)}</span>
        {m.unit && <span style={{ fontSize: 12, color: t.textFaint, fontWeight: 600 }}>{m.unit}</span>}
      </div>
      {goalPct != null && (
        <div style={{ marginTop: 10 }}>
          <Bar value={goalPct} height={5} />
          <div style={{ fontSize: 10.5, color: t.textFaint, marginTop: 5, fontFamily: t.fontNum }}>{fmt(m.goal)} goal</div>
        </div>
      )}
    </Card>
  );
}

// ── TODAY (hero + executive dashboard) ──────────────────────────────────
function TodayScreen({ store, scoreOverride }) {
  const t = useT();
  const p = D.patient;
  const s = D.spineScore;
  const score = scoreOverride != null ? scoreOverride : s.value;
  const labels = ['12w', '', '', '', '8w', '', '', '', '4w', '', '', 'now'];

  return (
    <div style={SCREEN_PAD}>
      {/* greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div onClick={store.restart} style={{ cursor: 'pointer' }} title="Replay onboarding">
          <Avatar initials={p.avatar} size={42} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, color: t.textDim }}>Good morning</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text, fontFamily: t.fontDisplay }}>{p.name}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Pill tone="accent"><Icon name="coin" size={13} color={t.accent} /> {fmt(store.coins)}</Pill>
        </div>
      </div>

      {/* HERO */}
      <Card glow pad={22} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, letterSpacing: 1.2, textTransform: 'uppercase', color: t.textDim, fontWeight: 600, marginBottom: 14 }}>Your Spine Health Today</div>
        <ScoreRing value={score} size={208} stroke={17} status={scoreBand(score)} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18 }}>
          <Delta value={s.deltaMonth} /> <span style={{ fontSize: 12.5, color: t.textDim }}>this month</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 11.5, color: t.textFaint }}>
          <Icon name="sync" size={13} color={t.textFaint} /> {s.updated}
        </div>
      </Card>

      {/* AI coach nudge */}
      <Card onClick={() => store.go('coach')} pad={15} style={{ marginBottom: 22, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`, boxShadow: t.glow ? `0 0 16px ${t.accent}55` : 'none' }}>
          <Icon name="bolt" size={19} color="#04121a" sw={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.accent, marginBottom: 3 }}>SPINE AI · TODAY</div>
          <div style={{ fontSize: 13.5, color: t.text, lineHeight: 1.45 }}>{D.coach.insights[0].text}</div>
        </div>
        <Icon name="chevR" size={16} color={t.textFaint} style={{ marginTop: 3 }} />
      </Card>

      {/* snapshot */}
      <SectionTitle right="from wearables">Today's snapshot</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
        {D.liveMetrics.slice(0, 4).map(m => <MetricTile key={m.key} m={m} />)}
      </div>

      {/* EXECUTIVE DASHBOARD */}
      <SectionTitle right="6 pillars">Executive dashboard</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {D.scores.map(sc => (
          <Card key={sc.key} pad={13}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <MiniRing value={sc.value} size={50} stroke={5} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: t.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sc.label}</div>
                <div style={{ marginTop: 4 }}><Delta value={sc.delta} size={11} /></div>
              </div>
            </div>
            <div style={{ fontSize: 10.8, color: t.textFaint, marginTop: 9, lineHeight: 1.35 }}>{sc.note}</div>
          </Card>
        ))}
      </div>

      {/* trend */}
      <Card pad={16} style={{ marginBottom: 14 }}>
        <SectionTitle right={<Delta value={D.spineScore.deltaMonth} />}>12-week trend</SectionTitle>
        <AreaChart data={D.trend} labels={labels} />
      </Card>

      {/* degeneration indicator */}
      <Card pad={15} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${t.good}1f`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="spine" size={22} color={t.good} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>Degeneration risk</div>
          <div style={{ fontSize: 11.5, color: t.textDim, marginTop: 2 }}>L4–L5 monitored · imaging baseline stable</div>
        </div>
        <Pill tone="good">Low</Pill>
      </Card>
    </div>
  );
}

// ── RISK ENGINE ──────────────────────────────────────────────────────────
function RiskCard({ r, open, onToggle }) {
  const t = useT();
  const tone = { good: t.good, warn: t.warn, bad: t.bad }[r.tone];
  return (
    <Card pad={0} onClick={onToggle} active={open} style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 15 }}>
        <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
          <MiniRing value={r.pct} size={44} stroke={4} color={tone} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{r.label}</div>
          <div style={{ fontSize: 11.5, color: t.textDim, marginTop: 2, fontFamily: t.fontNum }}>{r.stat}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <Pill tone={r.tone}>{r.level}</Pill>
          <Icon name="chevR" size={15} color={t.textFaint} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .25s' }} />
        </div>
      </div>
      {open && (
        <div style={{ padding: '0 15px 15px', borderTop: `1px solid ${t.border}`, paddingTop: 13 }}>
          <div style={{ fontSize: 12.8, color: t.textDim, lineHeight: 1.5 }}>{r.detail}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '10px 12px', borderRadius: t.radiusSm, background: t.accentSoft }}>
            <Icon name="bolt" size={16} color={t.accent} />
            <span style={{ fontSize: 12.5, color: t.text, fontWeight: 600 }}>{r.action}</span>
          </div>
        </div>
      )}
    </Card>
  );
}

function RiskScreen() {
  const t = useT();
  const [open, setOpen] = React.useState('sedentary');
  const flags = D.risks.filter(r => r.tone === 'warn' || r.tone === 'bad').length;
  return (
    <div style={SCREEN_PAD}>
      <ScreenHead kicker="AI Risk Engine" title="Risk radar" sub="Continuously modelled from sleep, activity, BMI, pain & mobility signals." />

      {/* summary */}
      <Card glow pad={18} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative' }}>
          <ScoreRing value={100 - 27} size={92} stroke={9} showVal={false} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: t.text, fontFamily: t.fontNum, lineHeight: 1 }}>{flags}</div>
            <div style={{ fontSize: 9.5, color: t.textFaint, letterSpacing: 0.5 }}>FLAG</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Overall risk: <span style={{ color: t.good }}>Protected</span></div>
          <div style={{ fontSize: 12.5, color: t.textDim, marginTop: 5, lineHeight: 1.45 }}>5 of 6 risk vectors are Low or Very low. One needs attention today.</div>
        </div>
      </Card>

      <SectionTitle right="tap to expand">Risk vectors</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {D.risks.map(r => (
          <RiskCard key={r.key} r={r} open={open === r.key} onToggle={() => setOpen(open === r.key ? null : r.key)} />
        ))}
      </div>
    </div>
  );
}

// ── WEARABLES ──────────────────────────────────────────────────────────────
function DeviceRow({ d, connected, onConnect }) {
  const t = useT();
  return (
    <Card pad={14} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${d.color}22`, border: `1px solid ${d.color}44` }}>
        <Icon name="watch" size={20} color={d.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{d.name}</div>
        <div style={{ fontSize: 11.5, color: t.textDim, marginTop: 2 }}>
          {connected
            ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: 99, background: t.good, boxShadow: `0 0 6px ${t.good}` }} />Synced {d.sync === 'now' ? 'just now' : d.sync + ' ago'}</span>
            : d.model}
        </div>
      </div>
      {connected ? (
        d.battery != null
          ? <span style={{ fontSize: 12, color: t.textDim, fontFamily: t.fontNum }}>{d.battery}%</span>
          : <Icon name="check" size={18} color={t.good} />
      ) : (
        <button onClick={() => onConnect(d.key)} style={{
          border: `1px solid ${t.accent}`, background: 'transparent', color: t.accent,
          fontSize: 12.5, fontWeight: 700, padding: '7px 14px', borderRadius: 999, cursor: 'pointer',
          fontFamily: t.fontDisplay,
        }}>Connect</button>
      )}
    </Card>
  );
}

function DevicesScreen({ store }) {
  const t = useT();
  const connectedList = D.devices.filter(d => store.connected.includes(d.key));
  const availableList = D.devices.filter(d => !store.connected.includes(d.key));
  return (
    <div style={SCREEN_PAD}>
      <ScreenHead kicker="Wearable Intelligence" title="Devices" sub="Every signal feeds your Spine Score in real time." />

      {/* live metrics */}
      <SectionTitle right={`${connectedList.length} connected`}>Live metrics</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9, marginBottom: 22 }}>
        {D.liveMetrics.map(m => (
          <Card key={m.key} pad={11}>
            <Icon name={m.icon} size={16} color={t.accent} />
            <div style={{ fontSize: 19, fontWeight: 700, color: t.text, fontFamily: t.fontNum, marginTop: 8, letterSpacing: -0.5 }}>{fmt(m.value)}<span style={{ fontSize: 10, color: t.textFaint, fontWeight: 600, marginLeft: 2 }}>{m.unit}</span></div>
            <div style={{ fontSize: 10.5, color: t.textDim, marginTop: 2 }}>{m.label}</div>
          </Card>
        ))}
      </div>

      <SectionTitle>Connected</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
        {connectedList.map(d => <DeviceRow key={d.key} d={d} connected onConnect={store.connect} />)}
      </div>

      <SectionTitle>Add a source</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {availableList.map(d => <DeviceRow key={d.key} d={d} connected={false} onConnect={store.connect} />)}
      </div>
    </div>
  );
}

Object.assign(window, { TodayScreen, RiskScreen, DevicesScreen, ScreenHead });

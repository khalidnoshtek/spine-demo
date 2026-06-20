/* Spine Command Center — screens B: Quest (gamification) + AI Coach */
const { useT: useT2, Icon: Icon2, fmt: fmt2, clamp: clamp2,
        Card: Card2, Delta: Delta2, Pill: Pill2, SectionTitle: ST2, Bar: Bar2, MiniRing: MiniRing2, Avatar: Avatar2 } = window;
const DB = window.SPINE_DATA;
const PAD2 = { padding: '58px 16px 104px' };

// segmented control
function Seg({ items, value, onChange }) {
  const t = useT2();
  return (
    <div style={{ display: 'flex', background: t.surface, border: `1px solid ${t.border}`, borderRadius: 999, padding: 4, marginBottom: 18, gap: 3 }}>
      {items.map(it => {
        const on = it.key === value;
        return (
          <button key={it.key} onClick={() => onChange(it.key)} style={{
            flex: 1, border: 'none', cursor: 'pointer', borderRadius: 999, padding: '8px 4px',
            fontSize: 12.5, fontWeight: 700, fontFamily: t.fontDisplay,
            color: on ? t.onAccent : t.textDim,
            background: on ? `linear-gradient(135deg, ${t.accent}, ${t.accent2})` : 'transparent',
            boxShadow: on && t.glow ? `0 0 14px ${t.accent}55` : 'none',
            transition: 'color .2s',
          }}>{it.label}</button>
        );
      })}
    </div>
  );
}

// ── QUEST ────────────────────────────────────────────────────────────────
function WalletHeader({ store }) {
  const t = useT2();
  const w = DB.wallet;
  const xpPct = clamp2((w.xpInLevel / w.xpToNext) * 100, 0, 100);
  return (
    <Card2 glow pad={18} style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <MiniRing2 value={xpPct} size={62} stroke={6} hideVal />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 9, color: t.textFaint, letterSpacing: 0.5, lineHeight: 1 }}>LVL</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: t.text, fontFamily: t.fontNum, lineHeight: 1 }}>{w.xpLevel}</div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.text, fontFamily: t.fontDisplay }}>Spine Wealth</div>
          <div style={{ fontSize: 11.5, color: t.textDim, marginTop: 2, fontFamily: t.fontNum }}>{fmt2(w.xpInLevel)} / {fmt2(w.xpToNext)} XP to Level {w.xpLevel + 1}</div>
          <div style={{ marginTop: 8 }}><Bar2 value={xpPct} height={6} /></div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 12px', borderRadius: t.radiusSm, background: t.surface2 }}>
          <Icon2 name="coin" size={20} color={t.accent} />
          <div>
            <div style={{ fontSize: 19, fontWeight: 700, color: t.text, fontFamily: t.fontNum, lineHeight: 1 }}>{fmt2(store.coins)}</div>
            <div style={{ fontSize: 10.5, color: t.textDim, marginTop: 2 }}>Spine Coins</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 12px', borderRadius: t.radiusSm, background: t.surface2 }}>
          <Icon2 name="pulse" size={20} color={t.accent2} />
          <div>
            <div style={{ fontSize: 19, fontWeight: 700, color: t.text, fontFamily: t.fontNum, lineHeight: 1 }}>{fmt2(DB.wallet.recovery)}</div>
            <div style={{ fontSize: 10.5, color: t.textDim, marginTop: 2 }}>Recovery pts</div>
          </div>
        </div>
      </div>
    </Card2>
  );
}

function ChallengeCard({ c }) {
  const t = useT2();
  const pct = clamp2((c.cur / c.goal) * 100, 0, 100);
  const done = pct >= 100;
  return (
    <Card2 pad={15}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.accentSoft }}>
          <Icon2 name={c.icon} size={19} color={t.accent} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{c.title}</div>
          <div style={{ fontSize: 11, color: t.textFaint, marginTop: 2 }}>{c.sub}</div>
        </div>
        <Pill2 tone="accent"><Icon2 name="coin" size={12} color={t.accent} />{c.reward}</Pill2>
      </div>
      <div style={{ marginTop: 13 }}>
        <Bar2 value={pct} height={7} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: t.fontNum }}>
          <span style={{ fontSize: 11.5, color: t.text, fontWeight: 600 }}>{fmt2(c.cur)} <span style={{ color: t.textFaint, fontWeight: 400 }}>/ {fmt2(c.goal)} {c.unit}</span></span>
          <span style={{ fontSize: 11.5, color: done ? t.good : t.accent, fontWeight: 700 }}>{Math.round(pct)}%</span>
        </div>
      </div>
    </Card2>
  );
}

function LeaderboardView() {
  const t = useT2();
  const lb = DB.leaderboards;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9, marginBottom: 18 }}>
        {DB.ranks.map(r => (
          <Card2 key={r.key} pad={12} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.text, fontFamily: t.fontNum, letterSpacing: -0.5 }}>{r.value}</div>
            <div style={{ fontSize: 10.5, color: t.textDim, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</div>
            <div style={{ marginTop: 7, display: 'flex', justifyContent: 'center' }}><Delta2 value={r.delta} suffix="" size={10.5} /></div>
          </Card2>
        ))}
      </div>

      <ST2 right="Mumbai">City ranking</ST2>
      <Card2 pad={6} style={{ marginBottom: 18 }}>
        {lb.city.map((row, i) => (
          <div key={row.rank} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 11px', borderRadius: t.radiusSm,
            background: row.you ? t.accentSoft : 'transparent',
            borderBottom: i < lb.city.length - 1 && !row.you ? `1px solid ${t.border}` : 'none',
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: row.you ? t.accent : t.textDim, fontFamily: t.fontNum, width: 26 }}>{row.rank}</span>
            {row.you ? <Avatar2 initials="AM" size={28} /> : <div style={{ width: 28, height: 28, borderRadius: 99, background: t.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: t.textDim, fontWeight: 600 }}>{row.name[0]}</div>}
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: row.you ? 700 : 500, color: t.text }}>{row.name}</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: row.you ? t.accent : t.text, fontFamily: t.fontNum }}>{row.score}</span>
          </div>
        ))}
      </Card2>

      <ST2 right="all cities">Top recovery</ST2>
      <Card2 pad={6}>
        {lb.top.map((row, i) => (
          <div key={row.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 11px', borderBottom: i < lb.top.length - 1 ? `1px solid ${t.border}` : 'none' }}>
            <span style={{ fontSize: 15, width: 26, textAlign: 'center' }}>{['🥇','🥈','🥉'][i]}</span>
            <div style={{ width: 28, height: 28, borderRadius: 99, background: t.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: t.textDim, fontWeight: 600 }}>{row.name[0]}</div>
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: t.text }}>{row.name}</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: t.text, fontFamily: t.fontNum }}>{row.score}</span>
          </div>
        ))}
      </Card2>
    </div>
  );
}

function RewardsView({ store }) {
  const t = useT2();
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {DB.rewards.map(rw => {
          const owned = store.redeemed.includes(rw.key);
          const afford = store.coins >= rw.cost;
          return (
            <Card2 key={rw.key} pad={14} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.accentSoft }}>
                  <Icon2 name={rw.icon} size={20} color={t.accent} />
                </div>
                {rw.tag && <Pill2 tone="accent">{rw.tag}</Pill2>}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text, marginTop: 11, lineHeight: 1.25 }}>{rw.title}</div>
              <div style={{ fontSize: 11, color: t.textFaint, marginTop: 3, flex: 1 }}>{rw.sub}</div>
              <button disabled={owned || !afford} onClick={() => store.redeem(rw.key, rw.cost)} style={{
                marginTop: 13, border: 'none', cursor: owned || !afford ? 'default' : 'pointer', borderRadius: 999, padding: '9px 8px',
                fontSize: 12.5, fontWeight: 700, fontFamily: t.fontDisplay,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                color: owned ? t.good : afford ? t.onAccent : t.textFaint,
                background: owned ? `${t.good}22` : afford ? `linear-gradient(135deg, ${t.accent}, ${t.accent2})` : t.surface2,
                opacity: !afford && !owned ? 0.6 : 1,
              }}>
                {owned ? <><Icon2 name="check" size={14} color={t.good} /> Redeemed</> : <><Icon2 name="coin" size={14} color={afford ? t.onAccent : t.textFaint} /> {fmt2(rw.cost)}</>}
              </button>
            </Card2>
          );
        })}
      </div>
    </div>
  );
}

function QuestScreen({ store }) {
  const t = useT2();
  const seg = store.questSeg;
  return (
    <div style={PAD2}>
      <ScreenHeadX kicker="Spine Wealth Economy" title="Quest" sub="Earn coins, climb ranks, and turn healthy habits into rewards." />
      <WalletHeader store={store} />
      <Seg
        value={seg}
        onChange={store.setQuestSeg}
        items={[{ key: 'challenges', label: 'Challenges' }, { key: 'leaderboard', label: 'Ranks' }, { key: 'rewards', label: 'Rewards' }]}
      />
      {seg === 'challenges' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {DB.challenges.map(c => <ChallengeCard key={c.key} c={c} />)}
        </div>
      )}
      {seg === 'leaderboard' && <LeaderboardView />}
      {seg === 'rewards' && <RewardsView store={store} />}
    </div>
  );
}

// helper to reuse ScreenHead from screens-a (exported on window)
function ScreenHeadX(props) { return window.ScreenHead(props); }

// ── AI COACH ───────────────────────────────────────────────────────────────
function Bubble({ from, children }) {
  const t = useT2();
  const me = from === 'me';
  return (
    <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
      <div style={{
        maxWidth: '82%', padding: '11px 14px', borderRadius: 18,
        borderBottomRightRadius: me ? 5 : 18, borderBottomLeftRadius: me ? 18 : 5,
        fontSize: 13.5, lineHeight: 1.45, whiteSpace: 'pre-line',
        color: me ? t.onAccent : t.text,
        background: me ? `linear-gradient(135deg, ${t.accent}, ${t.accent2})` : t.surface,
        border: me ? 'none' : `1px solid ${t.border}`,
        boxShadow: me && t.glow ? `0 4px 18px ${t.accent}44` : 'none',
        fontWeight: me ? 600 : 400,
      }}>{children}</div>
    </div>
  );
}

function Typing() {
  const t = useT2();
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
      <div style={{ padding: '13px 16px', borderRadius: 18, borderBottomLeftRadius: 5, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', gap: 5 }}>
        {[0,1,2].map(i => (
          <span key={i} style={{ width: 6, height: 6, borderRadius: 99, background: t.textDim, animation: `spDot 1s ${i*0.15}s infinite ease-in-out` }} />
        ))}
      </div>
    </div>
  );
}

function CoachScreen({ store }) {
  const t = useT2();
  const endRef = React.useRef(null);
  React.useEffect(() => {
    if (endRef.current) endRef.current.parentElement.scrollTop = endRef.current.offsetTop + 400;
  }, [store.messages.length, store.typing]);

  return (
    <div style={{ ...PAD2, paddingBottom: 150, minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`, boxShadow: t.glow ? `0 0 18px ${t.accent}66` : 'none' }}>
          <Icon2 name="bolt" size={23} color="#04121a" sw={2} />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: t.text, fontFamily: t.fontDisplay }}>Spine AI</div>
          <div style={{ fontSize: 11.5, color: t.good, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: t.good, boxShadow: `0 0 6px ${t.good}` }} />Powered by Laser Spine
          </div>
        </div>
      </div>

      {/* greeting */}
      <Bubble from="ai">{DB.coach.greeting}</Bubble>
      {store.messages.map((m, i) => <Bubble key={i} from={m.from}>{m.text}</Bubble>)}
      {store.typing && <Typing />}
      <div ref={endRef} />

      {/* quick replies — fixed near bottom inside scroll, but render inline */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
        {DB.coach.chips.map(c => (
          <button key={c} onClick={() => store.ask(c)} disabled={store.typing} style={{
            border: `1px solid ${t.border}`, background: t.surface, color: t.text,
            fontSize: 12.5, fontWeight: 500, padding: '9px 13px', borderRadius: 999,
            cursor: store.typing ? 'default' : 'pointer', fontFamily: t.fontBody,
            opacity: store.typing ? 0.5 : 1,
          }}>{c}</button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { QuestScreen, CoachScreen });

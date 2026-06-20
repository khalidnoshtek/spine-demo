/* Spine Command Center — app shell, store, tab bar, and the two-direction mount. */
const { IOSDevice, ThemeCtx, applyAccent,
        Onboarding, TodayScreen, RiskScreen, DevicesScreen, QuestScreen, CoachScreen } = window;

const TABS = [
  { key: 'today',   label: 'Today',   icon: 'home' },
  { key: 'risk',    label: 'Risk',    icon: 'shield' },
  { key: 'devices', label: 'Devices', icon: 'watch' },
  { key: 'quest',   label: 'Quest',   icon: 'trophy' },
  { key: 'coach',   label: 'Coach',   icon: 'chat' },
];

function TabBar({ active, onTab, t }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40,
      paddingBottom: 24, paddingTop: 8,
      background: t.navBg,
      backdropFilter: 'blur(24px) saturate(160%)', WebkitBackdropFilter: 'blur(24px) saturate(160%)',
      borderTop: `1px solid ${t.navBorder}`,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
    }}>
      {TABS.map(tab => {
        const on = tab.key === active;
        return (
          <button key={tab.key} onClick={() => onTab(tab.key)} style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '4px 10px', flex: 1,
          }}>
            <window.Icon name={tab.icon} size={23} color={on ? t.accent : t.textFaint} sw={on ? 2.1 : 1.8}
              style={{ filter: on && t.glow ? `drop-shadow(0 0 6px ${t.accent})` : 'none' }} />
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 500, color: on ? t.accent : t.textFaint, fontFamily: t.fontDisplay }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SpineApp({ baseTheme, accent, scoreOverride }) {
  const t = React.useMemo(() => applyAccent(baseTheme, accent), [baseTheme, accent]);

  const [phase, setPhase] = React.useState('onboarding');
  const [tab, setTab] = React.useState('today');
  const [coins, setCoins] = React.useState(window.SPINE_DATA.wallet.coins);
  const [redeemed, setRedeemed] = React.useState([]);
  const [connected, setConnected] = React.useState(['apple', 'fitbit', 'health']);
  const [questSeg, setQuestSeg] = React.useState('challenges');
  const [messages, setMessages] = React.useState([]);
  const [typing, setTyping] = React.useState(false);
  const scrollRef = React.useRef(null);

  // reset scroll to top on tab change
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [tab]);

  const store = {
    coins, redeemed, connected, questSeg, messages, typing,
    patient: window.SPINE_DATA.patient,
    devices: window.SPINE_DATA.devices,
    go: (k) => setTab(k),
    restart: () => { setPhase('onboarding'); setTab('today'); },
    setQuestSeg,
    connect: (key) => setConnected(c => c.includes(key) ? c : [...c, key]),
    redeem: (key, cost) => setRedeemed(r => {
      if (r.includes(key)) return r;
      setCoins(c => Math.max(0, c - cost));
      return [...r, key];
    }),
    ask: (text) => {
      if (typing) return;
      setMessages(m => [...m, { from: 'me', text }]);
      setTyping(true);
      const reply = window.SPINE_DATA.coach.replies[text] || "Great question — I'm pulling that from your latest signals now.";
      setTimeout(() => {
        setTyping(false);
        setMessages(m => [...m, { from: 'ai', text: reply }]);
      }, 1100);
    },
  };

  let screen = null;
  if (tab === 'today')   screen = <TodayScreen store={store} scoreOverride={scoreOverride} />;
  if (tab === 'risk')    screen = <RiskScreen />;
  if (tab === 'devices') screen = <DevicesScreen store={store} />;
  if (tab === 'quest')   screen = <QuestScreen store={store} />;
  if (tab === 'coach')   screen = <CoachScreen store={store} />;

  return (
    <ThemeCtx.Provider value={t}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 45 }}>
        <div style={{ position: 'relative', height: '100%', background: t.bgScene, fontFamily: t.fontBody, color: t.text }}>
          {phase === 'onboarding' ? (
            <Onboarding store={store} onFinish={() => { setPhase('app'); setTab('today'); }} />
          ) : (
            <React.Fragment>
              <div ref={scrollRef} style={{ position: 'absolute', inset: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                {screen}
              </div>
              <TabBar active={tab} onTab={setTab} t={t} />
            </React.Fragment>
          )}
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}

window.SpineApp = SpineApp;

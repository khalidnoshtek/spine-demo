/* ============================================================
   Spine Quest — main app
   ============================================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": ["#7C83FF", "#A6AAFF", "#5A4FE0"],
  "density": "regular",
  "rounding": "rounded",
  "gamify": "playful",
  "mascot": true
}/*EDITMODE-END*/;

const LEVELS = [
  { name: "Beginner",       icon: "user",    scoreReq: 0,  perk: "Welcome aboard" },
  { name: "Spine Explorer", icon: "map",     scoreReq: 40, perk: "Unlock avatars" },
  { name: "Spine Warrior",  icon: "bolt",    scoreReq: 60, perk: "Premium themes" },
  { name: "Spine Champion", icon: "trophy",  scoreReq: 80, perk: "Priority booking" },
  { name: "Spine Elite",    icon: "crown",   scoreReq: 90, perk: "VIP membership", vip: true },
  { name: "Spine Legend",   icon: "shield",  scoreReq: 97, perk: "Free annual review" },
];

const load = (k, d) => { try { const v = localStorage.getItem("sq_" + k); return v == null ? d : JSON.parse(v); } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem("sq_" + k, JSON.stringify(v)); } catch {} };

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [tab, setTab] = React.useState(() => load("tab", "home"));
  const [trackFocus, setTrackFocus] = React.useState(null);
  const [coins, setCoins] = React.useState(() => load("coins", 2450));
  const [checkedIn, setCheckedIn] = React.useState(() => load("checkedIn", false));
  const [logged, setLogged] = React.useState(() => load("logged", {}));
  const [streak] = React.useState(24);
  const [exerciseStreak] = React.useState(12);
  const [assessing, setAssessing] = React.useState(false);
  const [showOnboard, setShowOnboard] = React.useState(() => !load("onboarded", false));
  const [toasts, setToasts] = React.useState([]);
  const [sheet, setSheet] = React.useState(null);
  const [trackers, setTrackers] = React.useState(() => load("trackers", {
    pain: { value: 2 }, sleep: { value: 7.5, goal: 8 }, steps: { value: 8240, goal: 10000 }, weight: { value: 72.4 },
  }));

  const score = 86;
  const level = { ...LEVELS[3], idx: 3 };
  const theme = t.theme === "light" ? "light" : "dark";

  // keep the device chrome (status bar / home indicator) in sync with theme
  React.useEffect(() => {
    if (window.__setDeviceTheme) window.__setDeviceTheme(theme !== "light");
  }, [theme]);

  React.useEffect(() => save("tab", tab), [tab]);
  React.useEffect(() => save("coins", coins), [coins]);
  React.useEffect(() => save("checkedIn", checkedIn), [checkedIn]);
  React.useEffect(() => save("logged", logged), [logged]);
  React.useEffect(() => save("trackers", trackers), [trackers]);

  const toast = (msg, coin) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { id, msg, coin }]);
    setTimeout(() => setToasts((ts) => ts.map((x) => x.id === id ? { ...x, out: true } : x)), 2200);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 2600);
  };
  const award = (n, msg) => { setCoins((c) => c + n); if (n) toast(msg || "Coins earned", n); };

  const actions = {
    go: (tb, focus = null) => { setTab(tb); setTrackFocus(focus); document.querySelector(".sq-scroll")?.scrollTo(0, 0); },
    openSheet: (kind, data) => setSheet({ kind, data }),
    toast, award,
    checkIn: () => { if (!checkedIn) { setCheckedIn(true); award(25, "Daily check-in!"); } },
    setTracker: (k, v) => setTrackers((tr) => ({ ...tr, [k]: { ...tr[k], value: v } })),
    logItem: (k, coin, msg) => { if (!logged[k]) { setLogged((l) => ({ ...l, [k]: true })); award(coin, msg); } },
    redeem: (r) => { if (coins >= r.cost) { setCoins((c) => c - r.cost); toast(`Redeemed: ${r.name}`); setSheet(null); } },
    toggleTheme: () => setTweak("theme", theme === "light" ? "dark" : "light"),
    replayOnboarding: () => { setSheet(null); setShowOnboard(true); },
  };

  const state = { coins, streak, exerciseStreak, score, level, levels: LEVELS, trackers, logged, checkedIn, theme };

  // tweak-driven root style
  const dens = { compact: ["12px","10px"], regular: ["16px","14px"], comfy: ["20px","18px"] }[t.density] || ["16px","14px"];
  const rnd = { soft: ["10px","14px","18px","22px"], rounded: ["12px","18px","24px","30px"], round: ["16px","24px","30px","38px"] }[t.rounding] || ["12px","18px","24px","30px"];
  const ac = Array.isArray(t.accent) ? t.accent : [t.accent, t.accent, t.accent];
  const rootStyle = {
    "--pad": dens[0], "--gap": dens[1],
    "--r-sm": rnd[0], "--r": rnd[1], "--r-lg": rnd[2], "--r-xl": rnd[3],
    "--primary": ac[0], "--primary-soft": ac[1] || ac[0], "--primary-deep": ac[2] || ac[0],
    "--grad-primary": `linear-gradient(135deg, ${ac[0]}, ${ac[1] || ac[0]})`,
  };
  const showMascot = t.mascot && t.gamify !== "subtle";

  const titles = { home: null, track: "Daily Tracking", levels: "Levels & Ranks", rewards: "Rewards", wearables: "Devices" };

  const screens = {
    home: <Dashboard state={state} actions={actions} />,
    track: <Track state={state} actions={actions} focus={trackFocus} />,
    levels: <Levels state={state} actions={actions} />,
    rewards: <Rewards state={state} actions={actions} />,
    wearables: <Wearables state={state} actions={actions} />,
  };

  return (
    <div className={"sq-root gamify-" + t.gamify + (showMascot ? "" : " no-mascot") + (theme === "light" ? " light" : "")} style={rootStyle}>
      {/* HEADER */}
      <div className="sq-header">
        {tab === "home" ? (
          <>
            <button className="sq-avatar" onClick={() => actions.openSheet("profile")} style={{ transition: "transform .15s" }}>AM</button>
            <div style={{ flex: 1 }}>
              <div className="sq-hello">Good morning 👋</div>
              <div className="sq-name">Aarav Mehta</div>
            </div>
          </>
        ) : (
          <>
            <button className="sq-icon-btn" onClick={() => actions.go("home")}><Icon name="chevL" size={20} /></button>
            <div style={{ flex: 1, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19 }}>{titles[tab]}</div>
          </>
        )}
        <button className="pill pill-coin" onClick={() => actions.go("rewards")} style={{ padding: "7px 11px" }}>
          <CoinChip size={16} /><span className="num">{coins.toLocaleString()}</span>
        </button>
        <button className="sq-icon-btn" onClick={() => actions.openSheet("notif")}>
          <Icon name="bell" size={20} />
          <span className="sq-dot" />
        </button>
      </div>

      {/* SCREEN */}
      {screens[tab]}

      {/* BOTTOM NAV */}
      <div className="sq-nav">
        <NavItem icon="home" label="Home" on={tab === "home"} onClick={() => actions.go("home")} />
        <NavItem icon="pulse" label="Track" on={tab === "track"} onClick={() => actions.go("track")} />
        <button className="nav-fab" onClick={() => setAssessing(true)} aria-label="Spine assessment">
          <Icon name="sparkle" size={26} color="#fff" />
        </button>
        <NavItem icon="trophy" label="Levels" on={tab === "levels"} onClick={() => actions.go("levels")} />
        <NavItem icon="gift" label="Rewards" on={tab === "rewards"} onClick={() => actions.go("rewards")} />
      </div>

      {/* TOASTS */}
      <div className="sq-toast-layer">
        {toasts.map((to) => (
          <div key={to.id} className={"toast" + (to.out ? " out" : "")}>
            {to.coin ? <span className="toast-coin">₵</span> : <Icon name="check" size={18} color="var(--green)" sw={3} />}
            <span>{to.msg}</span>
            {to.coin ? <span className="num" style={{ color: "var(--gold)" }}>+{to.coin}</span> : null}
          </div>
        ))}
      </div>

      {/* SHEETS */}
      <SheetRouter sheet={sheet} onClose={() => setSheet(null)} state={state} actions={actions} />

      {/* ASSESSMENT FLOW */}
      {assessing && (
        <Assessment onClose={() => setAssessing(false)}
          onComplete={(reward) => { setAssessing(false); award(reward, "Assessment complete!"); actions.go("home"); }} />
      )}

      {/* FIRST-RUN ONBOARDING */}
      {showOnboard && (
        <Onboarding
          onSkip={() => { save("onboarded", true); setShowOnboard(false); actions.go("home"); }}
          onComplete={(res) => { save("onboarded", true); setShowOnboard(false); award(res.coins, "Welcome aboard!"); actions.go("home"); }} />
      )}

      {/* TWEAKS */}
      <TweaksPanel>
        <TweakSection label="Appearance" />
        <TweakRadio label="Theme" value={t.theme} options={["dark","light"]} onChange={(v) => setTweak("theme", v)} />
        <TweakSection label="Theme color" />
        <TweakColor label="Accent" value={t.accent}
          options={[["#7C83FF","#A6AAFF","#5A4FE0"],["#34E0C4","#7DEBD8","#16B8A0"],["#F472B6","#F9A8D4","#DB4D98"],["#B06CFF","#C79BFF","#8A3FE0"]]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakRadio label="Corners" value={t.rounding} options={["soft","rounded","round"]} onChange={(v) => setTweak("rounding", v)} />
        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={t.density} options={["compact","regular","comfy"]} onChange={(v) => setTweak("density", v)} />
        <TweakSection label="Gamification" />
        <TweakRadio label="Intensity" value={t.gamify} options={["subtle","playful","max"]} onChange={(v) => setTweak("gamify", v)} />
        <TweakToggle label="Show mascot (Vertee)" value={t.mascot} onChange={(v) => setTweak("mascot", v)} />
      </TweaksPanel>
    </div>
  );
}

function NavItem({ icon, label, on, onClick }) {
  return (
    <button className={"nav-item" + (on ? " on" : "")} onClick={onClick}>
      <Icon name={icon} size={23} sw={on ? 2.4 : 2} fill={on && (icon === "gift") ? "none" : "none"} />
      <span>{label}</span>
    </button>
  );
}

Object.assign(window, { App, NavItem, LEVELS });

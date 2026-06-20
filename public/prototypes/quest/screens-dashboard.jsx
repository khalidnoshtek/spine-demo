/* ============================================================
   Dashboard / Home
   ============================================================ */

function Dashboard({ state, actions }) {
  const { coins, streak, score, lifestyle, level, levels, trackers, checkedIn } = state;
  const next = levels[level.idx + 1];
  const vipNeed = 90;

  return (
    <div className="sq-scroll stagger">
      {/* HERO — Today's Spine Score */}
      <div className="hero" style={{ marginTop: 6 }}>
        <div className="between" style={{ marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 12.5, color: "var(--text-dim)", fontWeight: 700, letterSpacing: ".02em", whiteSpace: "nowrap" }}>TODAY'S SPINE SCORE</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 3 }}>
              <Icon name="arrowUp" size={15} color="var(--green)" sw={2.6} />
              <span style={{ color: "var(--green)", fontWeight: 800, fontSize: 13 }}>+4 this week</span>
            </div>
          </div>
          <button className="pill" onClick={() => actions.openSheet("scoreInfo")}
                  style={{ background: "var(--surface-2)", color: "var(--text-dim)" }}>
            <Icon name="sparkle" size={14} /> Details
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8 }}>
          <Ring size={148} stroke={15} value={score} grad="score">
            <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1 }} className="num">
              <CountUp to={score} fmt={(n) => Math.round(n)} />
            </div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 700, marginTop: 2 }}>/ 100</div>
          </Ring>
          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-flex", padding: "5px 11px", borderRadius: 999, background: "rgba(91,227,139,.16)",
                          color: "var(--green)", fontWeight: 800, fontSize: 13 }}>Excellent</div>
            <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 10, lineHeight: 1.5 }}>
              Your spine health is in great shape. Keep your streak alive to reach <b style={{ color: "var(--text)" }}>VIP</b>.
            </p>
            {/* lifestyle risk */}
            <div className="between" style={{ marginTop: 12, padding: "10px 12px", borderRadius: 13, background: "var(--fill-soft)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="shield" size={17} color="var(--teal)" />
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>Lifestyle Risk</span>
              </div>
              <span style={{ color: "var(--teal)", fontWeight: 800, fontSize: 13 }}>Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATS row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--gap)", marginTop: "var(--gap)" }}>
        <button className="tile tile-tap" onClick={() => actions.go("rewards")} style={{ padding: 13 }}>
          <CoinChip size={26} />
          <div className="tile-value num" style={{ fontSize: 19, marginTop: 8 }}>{coins.toLocaleString()}</div>
          <div className="tile-label" style={{ fontSize: 11 }}>Coins</div>
        </button>
        <button className="tile tile-tap" onClick={() => actions.go("levels")} style={{ padding: 13 }}>
          <div className="tile-ico" style={{ background: "rgba(124,131,255,.15)", color: "var(--primary-soft)", marginBottom: 8 }}>
            <Icon name="trophy" size={18} />
          </div>
          <div className="tile-value num" style={{ fontSize: 15, lineHeight: 1.1 }}>{level.name.replace("Spine ", "")}</div>
          <div className="tile-label" style={{ fontSize: 11 }}>Lvl {level.idx + 1} · Rank</div>
        </button>
        <button className="tile tile-tap" onClick={() => actions.openSheet("streak")} style={{ padding: 13 }}>
          <div className="tile-ico" style={{ background: "rgba(255,159,90,.15)", color: "var(--amber)", marginBottom: 8 }}>
            <Icon name="flame" size={18} fill="currentColor" />
          </div>
          <div className="tile-value num" style={{ fontSize: 19 }}>{streak}</div>
          <div className="tile-label" style={{ fontSize: 11 }}>Day streak</div>
        </button>
      </div>

      {/* DAILY CHECK-IN quest */}
      <div className="card" style={{ marginTop: "var(--gap)", padding: 0, overflow: "hidden",
            background: checkedIn ? undefined : "linear-gradient(110deg, rgba(124,131,255,.16), rgba(244,114,182,.12))",
            borderColor: checkedIn ? undefined : "var(--border-strong)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16 }}>
          <div className="floaty mascot" style={{ flex: "0 0 auto" }}>
            <Vertee size={62} mood={checkedIn ? "happy" : "cheer"} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16 }}>
              {checkedIn ? "Checked in today!" : "Daily check-in ready"}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text-dim)", marginTop: 2 }}>
              {checkedIn ? `Come back tomorrow to keep your ${streak}-day streak.` : "Log your day and keep the flame alive."}
            </div>
          </div>
          {!checkedIn && (
            <button className="btn btn-coin" style={{ width: "auto", padding: "12px 16px", whiteSpace: "nowrap" }}
                    onClick={actions.checkIn}>
              <CoinChip size={18} /> +25
            </button>
          )}
          {checkedIn && <Icon name="check" size={26} color="var(--green)" sw={3} />}
        </div>
      </div>

      {/* VIP PROGRESS */}
      <div className="card card-tap" style={{ marginTop: "var(--gap)" }} onClick={() => actions.go("levels")}>
        <div className="between">
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 34, height: 34, borderRadius: 11, background: "var(--grad-coin)", display: "grid", placeItems: "center", color: "#7a4d00" }}>
              <Icon name="crown" size={19} fill="currentColor" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14.5, fontFamily: "var(--font-display)" }}>VIP Membership</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Unlocks at score {vipNeed}</div>
            </div>
          </div>
          <span className="num" style={{ fontWeight: 800, fontSize: 15, color: "var(--gold)" }}>{score}/{vipNeed}</span>
        </div>
        <div style={{ marginTop: 12 }}>
          <Bar value={score} max={vipNeed} grad="var(--grad-coin)" h={10} />
        </div>
        <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 9, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="zap" size={14} color="var(--gold)" /> Just <b style={{ color: "var(--text)" }}>4 points</b> away — log 3 more workouts this week.
        </div>
      </div>

      {/* TRACKERS */}
      <Section title="Today's tracking" link="Log all" onLink={() => actions.go("track")} />
      <div className="tile-grid">
        <Tile icon="heart" iconBg="rgba(251,113,133,.15)" iconColor="var(--danger)" accent="#FB7185"
              label="Pain level" value={trackers.pain.value} unit="/10"
              sub={trackers.pain.value <= 2 ? "Minimal · nice" : "Logged"} subColor="var(--green)"
              onClick={() => actions.go("track", "pain")} />
        <Tile icon="moon" iconBg="rgba(124,131,255,.15)" iconColor="var(--primary-soft)" accent="#7C83FF"
              label="Sleep" value={trackers.sleep.value} unit="h"
              sub={`Goal ${trackers.sleep.goal}h`} subColor="var(--primary-soft)"
              onClick={() => actions.go("track", "sleep")} />
        <Tile icon="steps" iconBg="rgba(52,224,196,.15)" iconColor="var(--teal)" accent="#34E0C4"
              label="Steps" value={(trackers.steps.value/1000).toFixed(1)} unit="k"
              sub={`${Math.round(trackers.steps.value/trackers.steps.goal*100)}% of goal`} subColor="var(--teal)"
              onClick={() => actions.go("track", "activity")} />
        <Tile icon="scale" iconBg="rgba(176,108,255,.15)" iconColor="#C79BFF" accent="#B06CFF"
              label="Weight" value={trackers.weight.value} unit="kg"
              sub="−0.4 kg this wk" subColor="var(--green)"
              onClick={() => actions.go("track", "weight")} />
      </div>

      {/* WEEKLY PROGRESS */}
      <Section title="Weekly progress" />
      <div className="card">
        <div className="between" style={{ marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12.5, color: "var(--text-dim)", fontWeight: 700 }}>Coins earned</div>
            <div className="num" style={{ fontSize: 26, fontWeight: 800, marginTop: 2 }}>
              <CoinChip size={20} /> 640
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="pill" style={{ background: "rgba(91,227,139,.14)", color: "var(--green)", borderColor: "transparent" }}>
              <Icon name="arrowUp" size={14} sw={2.6} /> 18% vs last wk
            </div>
          </div>
        </div>
        <WeekBars data={[80, 110, 65, 130, 95, 60, 100]} grad="var(--grad-coin)" />
      </div>

      {/* REWARDS teaser */}
      <Section title="Rewards for you" link="See all" onLink={() => actions.go("rewards")} />
      <div className="card card-tap" onClick={() => actions.go("rewards")}
           style={{ display: "flex", alignItems: "center", gap: 14,
                    background: "linear-gradient(110deg, rgba(245,158,11,.14), rgba(124,131,255,.1))" }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--grad-pink)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
          <Icon name="stethoscope" size={24} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14.5, fontFamily: "var(--font-display)" }}>Free physio session</div>
          <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>You can afford this reward now!</div>
        </div>
        <span className="pill pill-coin"><CoinChip size={16} />2,000</span>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });

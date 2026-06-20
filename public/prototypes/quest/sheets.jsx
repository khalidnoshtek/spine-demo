/* ============================================================
   Bottom-sheet content router
   ============================================================ */

function Row({ icon, color, title, sub, right }) {
  return (
    <div className="row" style={{ padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: (color || "#7C83FF") + "22", color: color || "#7C83FF", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
        <Icon name={icon} size={19} fill={["heart","flame","coin","crown","star"].includes(icon) ? "currentColor" : "none"} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function SheetHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <h2 style={{ fontSize: 21 }}>{title}</h2>
      {sub && <p style={{ color: "var(--text-dim)", fontSize: 13.5, marginTop: 5 }}>{sub}</p>}
    </div>
  );
}

function SheetRouter({ sheet, onClose, state, actions }) {
  if (!sheet) return null;
  const { kind, data } = sheet;

  const content = {
    scoreInfo: (
      <>
        <SheetHead title="Your Spine Score" sub="Built from four signals, updated daily." />
        {[["Posture & pain","heart","#FB7185",88],["Activity","steps","#34E0C4",82],["Sleep quality","moon","#7C83FF",90],["Consistency","flame","#FF9F5A",84]].map(([l,ic,c,v]) => (
          <div key={l} style={{ padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
            <div className="between" style={{ marginBottom: 8 }}>
              <div className="row"><Icon name={ic} size={17} color={c} fill={ic==="heart"||ic==="flame"?c:"none"} /><span style={{ fontWeight: 700, fontSize: 13.5 }}>{l}</span></div>
              <span className="num" style={{ fontWeight: 800, color: c }}>{v}</span>
            </div>
            <Bar value={v} grad={c} h={7} />
          </div>
        ))}
        <button className="btn btn-ghost" style={{ marginTop: 18 }} onClick={onClose}>Got it</button>
      </>
    ),
    streak: (
      <>
        <div style={{ textAlign: "center" }}>
          <div className="floaty" style={{ display: "inline-grid", placeItems: "center", width: 76, height: 76, borderRadius: 24, background: "var(--grad-flame)", margin: "4px auto 0" }}>
            <Icon name="flame" size={40} color="#fff" fill="#fff" />
          </div>
          <h2 className="num" style={{ fontSize: 40, marginTop: 12 }}>{state.streak} days</h2>
          <p style={{ color: "var(--text-dim)", fontSize: 13.5, marginTop: 2 }}>Your longest streak yet 🔥</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0 6px" }}>
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, display: "grid", placeItems: "center",
                background: i <= 5 ? "var(--grad-flame)" : "var(--surface-2)", color: i <= 5 ? "#fff" : "var(--text-faint)" }}>
                {i <= 5 ? <Icon name="check" size={16} sw={3} /> : <Icon name="flame" size={15} />}
              </div>
              <div style={{ fontSize: 10.5, color: "var(--text-faint)", marginTop: 5, fontWeight: 700 }}>{d}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ marginTop: 14, display: "flex", gap: 11, alignItems: "center", background: "rgba(124,131,255,.1)" }}>
          <Icon name="shield" size={22} color="var(--primary-soft)" />
          <div style={{ fontSize: 12.5, color: "var(--text-dim)", flex: 1 }}>You have <b style={{ color: "var(--text)" }}>2 streak freezes</b> — miss a day without losing your flame.</div>
        </div>
      </>
    ),
    earn: (
      <>
        <SheetHead title="Ways to earn coins" sub="Stack these daily to climb faster." />
        {[["Daily check-in","cal","#7C83FF","+25"],["Log sleep","moon","#7C83FF","+20"],["Hit step goal","steps","#34E0C4","+20"],["Complete routine","dumbbell","#C79BFF","+30"],["Log pain","heart","#FB7185","+15"],["Update weight","scale","#B06CFF","+10"],["7-day streak bonus","flame","#FF9F5A","+100"]].map(([l,ic,c,v]) => (
          <Row key={l} icon={ic} color={c} title={l} right={<span className="pill pill-coin" style={{ padding: "5px 10px" }}><CoinChip size={14} />{v}</span>} />
        ))}
      </>
    ),
    vip: (
      <>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ display: "inline-grid", placeItems: "center", width: 70, height: 70, borderRadius: 22, background: "var(--grad-coin)", color: "#7a4d00" }}>
            <Icon name="crown" size={38} fill="currentColor" />
          </div>
          <h2 style={{ fontSize: 22, marginTop: 12 }}>VIP Membership</h2>
          <p style={{ color: "var(--text-dim)", fontSize: 13.5, marginTop: 4 }}>Unlocks at Spine score 90 or 5,000 coins</p>
        </div>
        {[["Quarterly spine review","stethoscope"],["Personalized reports","pulse"],["Priority support","bell"],["Exclusive webinars","play"],["Recovery coaching","heart"],["Advanced analytics","pulse"]].map(([l,ic]) => (
          <Row key={l} icon={ic} color="#FBBF24" title={l} right={<Icon name="check" size={18} color="var(--green)" sw={3} />} />
        ))}
        <div className="between" style={{ margin: "16px 0 8px", padding: "12px 14px", borderRadius: 14, background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.25)" }}>
          <span style={{ fontSize: 13, color: "var(--text-dim)" }}>Your progress</span>
          <span className="num" style={{ fontWeight: 800, color: "var(--gold)" }}>{state.score}/90</span>
        </div>
        <button className="btn btn-coin" onClick={onClose}>4 points away — keep going!</button>
      </>
    ),
    redeem: data && (
      <>
        <div style={{ textAlign: "center" }}>
          <div className="pop" style={{ display: "inline-grid", placeItems: "center", width: 72, height: 72, borderRadius: 22, background: data.grad, color: data.vip ? "#7a4d00" : "#fff", margin: "2px auto 0" }}>
            <Icon name={data.icon} size={36} fill={data.icon==="crown"?"currentColor":"none"} color={data.vip?"#7a4d00":"#fff"} />
          </div>
          <h2 style={{ fontSize: 21, marginTop: 12 }}>Redeem {data.name}?</h2>
        </div>
        <div className="card" style={{ marginTop: 16, padding: 14 }}>
          <div className="between" style={{ padding: "5px 0" }}><span className="muted" style={{ fontSize: 13.5 }}>Cost</span><span className="pill pill-coin" style={{ padding: "5px 10px" }}><CoinChip size={14} />{data.cost.toLocaleString()}</span></div>
          <div className="between" style={{ padding: "5px 0", borderTop: "1px solid var(--border)" }}><span className="muted" style={{ fontSize: 13.5 }}>Balance after</span><span className="num" style={{ fontWeight: 800 }}>{(state.coins - data.cost).toLocaleString()}</span></div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-coin" style={{ flex: 1.4 }} onClick={() => actions.redeem(data)}>Confirm</button>
        </div>
      </>
    ),
    notif: (
      <>
        <SheetHead title="Notifications" />
        {[["Streak at risk!","Log today to keep your 24-day flame","flame","#FF9F5A"],["New reward unlocked","Free physio session is now affordable","gift","#F472B6"],["Dr. Sharma posted","New webinar: Desk posture fixes","stethoscope","#34E0C4"],["Great week!","You earned 640 coins — top 5%","trophy","#FBBF24"]].map(([t,s,ic,c]) => (
          <Row key={t} icon={ic} color={c} title={t} sub={s} />
        ))}
      </>
    ),
    profile: (
      <>
        <div className="row" style={{ marginBottom: 8 }}>
          <div className="sq-avatar" style={{ width: 52, height: 52, fontSize: 20 }}>AM</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18 }}>Aarav Mehta</div>
            <div style={{ fontSize: 12.5, color: "var(--primary-soft)", fontWeight: 700 }}>Spine Champion · Level 4</div>
          </div>
        </div>
        {[["Connect a wearable","watch","#34E0C4",() => actions.go("wearables")],["My rewards","gift","#F472B6",() => actions.go("rewards")],["Care team — Dr. Sharma","stethoscope","#7C83FF",null],["Replay onboarding","sparkle","#FBBF24",() => actions.replayOnboarding()],["Settings","cog","#A8A4D4",null]].map(([l,ic,c,fn]) => (
          <button key={l} style={{ width: "100%", textAlign: "left" }} onClick={() => { onClose(); fn && fn(); }}>
            <Row icon={ic} color={c} title={l} right={<Icon name="chevR" size={18} color="var(--text-faint)" />} />
          </button>
        ))}
        {/* theme switch */}
        <div className="row" style={{ padding: "11px 0" }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(124,131,255,.18)", color: "var(--primary-soft)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
            <Icon name={state.theme === "light" ? "moon" : "sparkle"} size={19} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{state.theme === "light" ? "Dark mode" : "Light mode"}</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Switch appearance</div>
          </div>
          <button onClick={() => actions.toggleTheme()} style={{ width: 50, height: 30, borderRadius: 999, padding: 3, flex: "0 0 auto",
            background: state.theme === "light" ? "var(--fill)" : "var(--grad-primary)", transition: "background .2s" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff",
              transform: state.theme === "light" ? "translateX(0)" : "translateX(20px)", transition: "transform .22s cubic-bezier(.3,.9,.3,1)",
              boxShadow: "0 2px 5px rgba(0,0,0,.25)" }} />
          </button>
        </div>
      </>
    ),
  };

  return <Sheet open={true} onClose={onClose}>{content[kind]}</Sheet>;
}

Object.assign(window, { SheetRouter });

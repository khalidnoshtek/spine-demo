/* ============================================================
   Daily Tracking — pain, sleep, activity, weight, exercise
   ============================================================ */

function PainSlider({ value, onChange }) {
  const colors = ["#5BE38B","#5BE38B","#9BE36B","#C7E36B","#FBBF24","#FBBF24","#FF9F5A","#FB7185","#FB7185","#F43F5E","#F43F5E"];
  const labels = ["None","Minimal","Mild","Mild","Moderate","Moderate","Noticeable","Strong","Strong","Severe","Severe"];
  return (
    <div>
      <div className="between" style={{ marginBottom: 12 }}>
        <span className="num" style={{ fontSize: 40, fontWeight: 800, color: colors[value] }}>{value}</span>
        <span style={{ fontWeight: 800, color: colors[value], fontSize: 15 }}>{labels[value]}</span>
      </div>
      <input type="range" min="0" max="10" value={value} onChange={(e) => onChange(+e.target.value)}
        style={{ width: "100%", accentColor: colors[value], height: 26 }} />
      <div className="between" style={{ fontSize: 11, color: "var(--text-faint)", fontWeight: 700, marginTop: 2 }}>
        <span>No pain</span><span>Severe</span>
      </div>
    </div>
  );
}

function Stepper({ value, onChange, step = 0.1, min = 0, max = 200, unit, decimals = 1 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
      <button className="sq-icon-btn" style={{ width: 46, height: 46, borderRadius: 16 }}
              onClick={() => onChange(Math.max(min, +(value - step).toFixed(2)))}>
        <Icon name="minus" size={22} />
      </button>
      <div style={{ textAlign: "center", minWidth: 120 }}>
        <span className="num" style={{ fontSize: 42, fontWeight: 800 }}>{value.toFixed(decimals)}</span>
        <span style={{ fontSize: 16, color: "var(--text-dim)", fontWeight: 700 }}> {unit}</span>
      </div>
      <button className="sq-icon-btn" style={{ width: 46, height: 46, borderRadius: 16 }}
              onClick={() => onChange(Math.min(max, +(value + step).toFixed(2)))}>
        <Icon name="plus" size={22} />
      </button>
    </div>
  );
}

function LogCard({ icon, color, bg, title, sub, done, coin, children, onLog, refEl }) {
  return (
    <div className="card" ref={refEl} style={{ scrollMarginTop: 12 }}>
      <div className="between" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 40, height: 40, borderRadius: 13, background: bg, color, display: "grid", placeItems: "center" }}>
            <Icon name={icon} size={21} fill={icon === "heart" || icon === "flame" ? color : "none"} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15.5, fontFamily: "var(--font-display)" }}>{title}</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{sub}</div>
          </div>
        </div>
        {done && <span className="pill" style={{ background: "rgba(91,227,139,.14)", color: "var(--green)", borderColor: "transparent" }}>
          <Icon name="check" size={14} sw={3} /> Done</span>}
      </div>
      {children}
      <button className="btn" disabled={done} onClick={onLog}
              style={{ marginTop: 18, background: done ? "var(--surface-2)" : "var(--grad-coin)", color: done ? "var(--text-faint)" : "#5a3a00" }}>
        {done ? "Logged today" : <><CoinChip size={18} /> Log &amp; earn +{coin}</>}
      </button>
    </div>
  );
}

function Track({ state, actions, focus }) {
  const { trackers, logged } = state;
  const [pain, setPain] = React.useState(trackers.pain.value);
  const [sleep, setSleep] = React.useState(trackers.sleep.value);
  const [weight, setWeight] = React.useState(trackers.weight.value);
  const refs = { pain: React.useRef(), sleep: React.useRef(), activity: React.useRef(), weight: React.useRef() };

  React.useEffect(() => {
    if (focus && refs[focus]?.current) {
      const el = refs[focus].current;
      el.parentElement.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });
      el.style.borderColor = "var(--primary)";
      const t = setTimeout(() => { if (el) el.style.borderColor = ""; }, 1600);
      return () => clearTimeout(t);
    }
  }, [focus]);

  const stepsPct = Math.round(trackers.steps.value / trackers.steps.goal * 100);

  return (
    <div className="sq-scroll stagger" style={{ paddingTop: 4 }}>
      {/* sync banner */}
      <div className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: 13,
            background: "linear-gradient(110deg, rgba(52,224,196,.12), rgba(124,131,255,.08))" }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(52,224,196,.18)", color: "var(--teal)", display: "grid", placeItems: "center" }}>
          <Icon name="watch" size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5 }}>Apple Watch synced</div>
          <div style={{ fontSize: 11.5, color: "var(--text-dim)" }}>Steps &amp; sleep auto-tracked · 4 min ago</div>
        </div>
        <button className="section-link" onClick={() => actions.go("wearables")}>Devices<Icon name="chevR" size={14} sw={2.5} /></button>
      </div>

      {/* PAIN */}
      <div style={{ marginTop: "var(--gap)" }}>
        <LogCard refEl={refs.pain} icon="heart" color="var(--danger)" bg="rgba(251,113,133,.15)"
          title="Pain log" sub="How's your back today?" done={logged.pain} coin={15}
          onLog={() => { actions.setTracker("pain", pain); actions.logItem("pain", 15, "Pain logged"); }}>
          <PainSlider value={pain} onChange={setPain} />
        </LogCard>
      </div>

      {/* SLEEP */}
      <div style={{ marginTop: "var(--gap)" }}>
        <LogCard refEl={refs.sleep} icon="moon" color="var(--primary-soft)" bg="rgba(124,131,255,.15)"
          title="Sleep" sub="Auto-detected · adjust if needed" done={logged.sleep} coin={20}
          onLog={() => { actions.setTracker("sleep", sleep); actions.logItem("sleep", 20, "Sleep logged"); }}>
          <Stepper value={sleep} onChange={setSleep} step={0.5} max={14} unit="hours" />
          <div className="between" style={{ marginTop: 14, fontSize: 12, color: "var(--text-dim)" }}>
            <span>Goal {trackers.sleep.goal}h</span>
            <span style={{ color: sleep >= trackers.sleep.goal ? "var(--green)" : "var(--amber)", fontWeight: 700 }}>
              {sleep >= trackers.sleep.goal ? "Goal met 🎉" : `${(trackers.sleep.goal - sleep).toFixed(1)}h to goal`}
            </span>
          </div>
        </LogCard>
      </div>

      {/* ACTIVITY */}
      <div className="card" ref={refs.activity} style={{ marginTop: "var(--gap)", scrollMarginTop: 12 }}>
        <div className="between" style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, background: "rgba(52,224,196,.15)", color: "var(--teal)", display: "grid", placeItems: "center" }}>
              <Icon name="steps" size={21} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15.5, fontFamily: "var(--font-display)" }}>Activity</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>From Apple Watch</div>
            </div>
          </div>
          <span className="pill" style={{ background: "rgba(52,224,196,.14)", color: "var(--teal)", borderColor: "transparent" }}>
            <Icon name="link" size={13} /> Auto</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 8 }}>
          <Ring size={104} stroke={12} value={trackers.steps.value} max={trackers.steps.goal} grad="teal">
            <div className="num" style={{ fontSize: 22, fontWeight: 800 }}>{stepsPct}%</div>
          </Ring>
          <div style={{ flex: 1 }}>
            <div className="num" style={{ fontSize: 28, fontWeight: 800 }}>{trackers.steps.value.toLocaleString()}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>of {trackers.steps.goal.toLocaleString()} steps</div>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              <div><div className="num" style={{ fontWeight: 800, fontSize: 16 }}>5.2</div><div style={{ fontSize: 11, color: "var(--text-faint)" }}>km</div></div>
              <div><div className="num" style={{ fontWeight: 800, fontSize: 16 }}>410</div><div style={{ fontSize: 11, color: "var(--text-faint)" }}>kcal</div></div>
              <div><div className="num" style={{ fontWeight: 800, fontSize: 16 }}>42</div><div style={{ fontSize: 11, color: "var(--text-faint)" }}>active min</div></div>
            </div>
          </div>
        </div>
        <button className="btn" disabled={logged.activity} onClick={() => actions.logItem("activity", 20, "Steps goal hit")}
                style={{ marginTop: 16, background: logged.activity ? "var(--surface-2)" : "var(--grad-coin)", color: logged.activity ? "var(--text-faint)" : "#5a3a00" }}>
          {logged.activity ? "Reward claimed" : <><CoinChip size={18} /> Claim goal reward +20</>}
        </button>
      </div>

      {/* EXERCISE routine */}
      <div className="card" style={{ marginTop: "var(--gap)" }}>
        <div className="between" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, background: "rgba(176,108,255,.15)", color: "#C79BFF", display: "grid", placeItems: "center" }}>
              <Icon name="dumbbell" size={21} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15.5, fontFamily: "var(--font-display)" }}>Spine routine</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>3 exercises · ~8 min</div>
            </div>
          </div>
          <FlamePill days={state.exerciseStreak} />
        </div>
        {["Cat–cow stretch", "Pelvic tilt", "Bird-dog hold"].map((ex, i) => (
          <div key={i} className="between" style={{ padding: "10px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: 7, display: "grid", placeItems: "center",
                background: logged.exercise ? "var(--green)" : "var(--surface-2)", color: logged.exercise ? "#06291a" : "var(--text-faint)" }}>
                {logged.exercise ? <Icon name="check" size={14} sw={3} /> : i + 1}
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{ex}</span>
            </div>
            <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{["60s","45s","60s"][i]}</span>
          </div>
        ))}
        <button className="btn" disabled={logged.exercise} onClick={() => actions.logItem("exercise", 30, "Routine complete!", true)}
                style={{ marginTop: 16, background: logged.exercise ? "var(--surface-2)" : "var(--grad-primary)", color: logged.exercise ? "var(--text-faint)" : "#fff" }}>
          {logged.exercise ? "Completed today" : <><Icon name="play" size={16} fill="#fff" /> Start routine · +30</>}
        </button>
      </div>

      {/* WEIGHT */}
      <div style={{ marginTop: "var(--gap)" }}>
        <LogCard refEl={refs.weight} icon="scale" color="#C79BFF" bg="rgba(176,108,255,.15)"
          title="Weight" sub="Update weekly" done={logged.weight} coin={10}
          onLog={() => { actions.setTracker("weight", weight); actions.logItem("weight", 10, "Weight updated"); }}>
          <Stepper value={weight} onChange={setWeight} step={0.1} max={250} unit="kg" />
        </LogCard>
      </div>
    </div>
  );
}

Object.assign(window, { Track });

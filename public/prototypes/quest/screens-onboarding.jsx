/* ============================================================
   First-run Onboarding — 7 steps
   Welcome · Profile · Wearable · Assessment · Results · Goals · Done
   ============================================================ */

const OB_STEPS = ["welcome", "profile", "wearable", "assess", "calc", "results", "goals", "done"];
const OB_STEPNUM = { welcome: 1, profile: 2, wearable: 3, assess: 4, calc: 4, results: 5, goals: 6, done: 7 };

function OBProgress({ stage }) {
  const n = OB_STEPNUM[stage];
  return (
    <div style={{ display: "flex", gap: 6, padding: "0 4px" }}>
      {[1,2,3,4,5,6,7].map((i) => (
        <div key={i} style={{ flex: 1, height: 6, borderRadius: 999, overflow: "hidden", background: "var(--fill)" }}>
          <div style={{ height: "100%", borderRadius: 999,
            width: i < n ? "100%" : i === n ? "55%" : "0%",
            background: "var(--grad-primary)", transition: "width .5s cubic-bezier(.2,.8,.2,1)" }} />
        </div>
      ))}
    </div>
  );
}

function OBField({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-dim)", marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

function OBToggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{ width: 50, height: 30, borderRadius: 999, padding: 3, flex: "0 0 auto",
      background: on ? "var(--grad-primary)" : "var(--fill)", transition: "background .2s" }}>
      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff",
        transform: on ? "translateX(20px)" : "translateX(0)", transition: "transform .22s cubic-bezier(.3,.9,.3,1)",
        boxShadow: "0 2px 5px rgba(0,0,0,.25)" }} />
    </button>
  );
}

function OBSlider({ value, min, max, step, onChange, fmt }) {
  return (
    <div>
      <div className="num" style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>{fmt(value)}</div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)}
        style={{ width: "100%", accentColor: "var(--primary)", height: 26 }} />
    </div>
  );
}

function Onboarding({ onComplete, onSkip }) {
  const [stage, setStage] = React.useState("welcome");
  const [profile, setProfile] = React.useState({ name: "Aarav Mehta", age: 32, height: 174, weight: 72 });
  const [device, setDevice] = React.useState(null);
  const [answers, setAnswers] = React.useState({});
  const [qi, setQi] = React.useState(0);
  const [goals, setGoals] = React.useState({ steps: 10000, sleep: 8, reminder: "Morning", autosync: true });

  const go = (s) => setStage(s);

  React.useEffect(() => {
    if (stage === "calc") { const t = setTimeout(() => go("results"), 2100); return () => clearTimeout(t); }
  }, [stage]);

  const pickQ = (key, val) => {
    setAnswers((a) => ({ ...a, [key]: val }));
    setTimeout(() => {
      if (qi < ASSESS_Q.length - 1) setQi(qi + 1);
      else go("calc");
    }, 230);
  };

  const back = () => {
    if (stage === "profile") go("welcome");
    else if (stage === "wearable") go("profile");
    else if (stage === "assess") { if (qi > 0) setQi(qi - 1); else go("wearable"); }
    else if (stage === "goals") go("results");
  };

  const showBack = ["profile", "wearable", "assess", "goals"].includes(stage);

  return (
    <div className="flow">
      {/* top bar: progress + skip */}
      {stage !== "done" && (
        <div style={{ padding: "12px 16px 6px", display: "flex", alignItems: "center", gap: 12 }}>
          {showBack ? <button className="sq-icon-btn" onClick={back}><Icon name="chevL" size={20} /></button>
                    : <div style={{ width: 40 }} />}
          <div style={{ flex: 1 }}><OBProgress stage={stage} /></div>
          <button onClick={onSkip} style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dim)", minWidth: 40, textAlign: "right" }}>
            {stage === "welcome" ? "Skip" : ""}
          </button>
        </div>
      )}

      {/* ---------------- WELCOME ---------------- */}
      {stage === "welcome" && (
        <>
          <div className="sq-scroll" style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
            <div className="floaty mascot" style={{ margin: "0 auto" }}><Vertee size={128} mood="cheer" /></div>
            <h1 style={{ fontSize: 32, marginTop: 22, lineHeight: 1.08 }}>Welcome to<br/>Spine Quest</h1>
            <p style={{ color: "var(--text-dim)", marginTop: 14, fontSize: 14.5, lineHeight: 1.55, maxWidth: 300, marginInline: "auto" }}>
              Your spine-health journey with <b style={{ color: "var(--text)" }}>Dr. Ayush Sharma</b> &amp; Laser Spine. Track, improve, earn rewards.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22, flexWrap: "wrap" }}>
              {[["pulse","Track daily"],["trophy","Climb ranks"],["gift","Earn rewards"]].map(([ic,l]) => (
                <div key={l} className="pill" style={{ background: "var(--surface-2)", color: "var(--text-dim)", border: "1px solid var(--border)" }}>
                  <Icon name={ic} size={15} color="var(--primary-soft)" /> {l}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "0 18px calc(20px + env(safe-area-inset-bottom))" }}>
            <button className="btn btn-primary" onClick={() => go("profile")}>Get started · 7 quick steps</button>
          </div>
        </>
      )}

      {/* ---------------- PROFILE ---------------- */}
      {stage === "profile" && (
        <>
          <div className="sq-scroll" style={{ paddingTop: 10 }}>
            <h1 style={{ fontSize: 25 }}>Tell us about you</h1>
            <p style={{ color: "var(--text-dim)", marginTop: 8, fontSize: 14, marginBottom: 22 }}>We personalize your plan and scores.</p>
            <OBField label="Your name">
              <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                style={{ width: "100%", padding: "15px 16px", borderRadius: "var(--r)", background: "var(--surface)",
                  border: "1.5px solid var(--border)", color: "var(--text)", fontSize: 15.5, fontWeight: 600, fontFamily: "var(--font-ui)", outline: "none" }} />
            </OBField>
            <OBField label="Age">
              <OBStepper value={profile.age} unit="years" step={1} min={12} max={99} dec={0}
                onChange={(v) => setProfile({ ...profile, age: v })} />
            </OBField>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <OBField label="Height">
                  <OBStepper value={profile.height} unit="cm" step={1} min={120} max={220} dec={0}
                    onChange={(v) => setProfile({ ...profile, height: v })} compact />
                </OBField>
              </div>
              <div style={{ flex: 1 }}>
                <OBField label="Weight">
                  <OBStepper value={profile.weight} unit="kg" step={0.5} min={30} max={200} dec={1}
                    onChange={(v) => setProfile({ ...profile, weight: v })} compact />
                </OBField>
              </div>
            </div>
          </div>
          <div style={{ padding: "0 18px calc(20px + env(safe-area-inset-bottom))" }}>
            <button className="btn btn-primary" onClick={() => go("wearable")} disabled={!profile.name.trim()}>Continue</button>
          </div>
        </>
      )}

      {/* ---------------- WEARABLE ---------------- */}
      {stage === "wearable" && (
        <>
          <div className="sq-scroll" style={{ paddingTop: 10 }}>
            <h1 style={{ fontSize: 25 }}>Connect a wearable</h1>
            <p style={{ color: "var(--text-dim)", marginTop: 8, fontSize: 14, marginBottom: 20 }}>
              Auto-track steps &amp; sleep — and earn coins hands-free.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {DEVICES.map((d) => {
                const sel = device === d.id;
                return (
                  <button key={d.id} className={"opt" + (sel ? " sel" : "")} style={{ marginBottom: 0 }}
                    onClick={() => setDevice(sel ? null : d.id)}>
                    <span style={{ width: 40, height: 40, borderRadius: 12, background: d.bg, display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                      <DeviceGlyph id={d.id} size={22} />
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, display: "block" }}>{d.name}</span>
                      <span style={{ fontSize: 11.5, color: "var(--text-dim)" }}>{d.tracks}</span>
                    </span>
                    <span className="opt-check">{sel && <Icon name="check" size={15} sw={3} />}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ padding: "12px 18px calc(20px + env(safe-area-inset-bottom))", display: "flex", gap: 10 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { setDevice(null); go("assess"); }}>Enter manually</button>
            <button className="btn btn-primary" style={{ flex: 1.4 }} onClick={() => go("assess")}>{device ? "Connect" : "Continue"}</button>
          </div>
        </>
      )}

      {/* ---------------- ASSESSMENT (reuses ASSESS_Q) ---------------- */}
      {stage === "assess" && (() => {
        const Q = ASSESS_Q[qi];
        return (
          <div className="sq-scroll" style={{ paddingTop: 10 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--primary-soft)", marginBottom: 6 }}>
              Spine Assessment · {qi + 1} of {ASSESS_Q.length}
            </div>
            <h1 style={{ fontSize: 24, lineHeight: 1.15 }}>{Q.q}</h1>
            <p style={{ color: "var(--text-dim)", marginTop: 8, fontSize: 14, marginBottom: 20 }}>{Q.sub}</p>
            {Q.opts.map(([label, emoji]) => {
              const sel = answers[Q.key] === label;
              return (
                <button key={label} className={"opt" + (sel ? " sel" : "")} onClick={() => pickQ(Q.key, label)}>
                  <span className="opt-emoji" style={{ fontSize: 20 }}>{emoji}</span>
                  <span style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{label}</span>
                  <span className="opt-check">{sel && <Icon name="check" size={15} sw={3} />}</span>
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* ---------------- CALCULATING ---------------- */}
      {stage === "calc" && (
        <div className="sq-scroll" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <div className="floaty mascot"><Vertee size={108} mood="happy" /></div>
          <div className="spin-slow" style={{ marginTop: 24, width: 52, height: 52, borderRadius: "50%",
            border: "5px solid var(--surface-2)", borderTopColor: "var(--primary)" }} />
          <h2 style={{ fontSize: 21, marginTop: 22 }}>Building your spine profile…</h2>
          <p style={{ color: "var(--text-dim)", marginTop: 8, fontSize: 14 }}>Scoring posture, activity &amp; sleep</p>
        </div>
      )}

      {/* ---------------- RESULTS ---------------- */}
      {stage === "results" && (
        <>
          <div className="sq-scroll" style={{ paddingTop: 4 }}>
            <div style={{ textAlign: "center" }}>
              <div className="pop mascot" style={{ display: "inline-block" }}><Vertee size={70} mood="cheer" /></div>
              <h1 style={{ fontSize: 25, marginTop: 6 }}>Here's your baseline</h1>
            </div>
            <div className="hero pop" style={{ marginTop: 14, textAlign: "center", paddingTop: 22 }}>
              <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 800, letterSpacing: ".08em" }}>SPINE HEALTH SCORE</div>
              <div style={{ marginTop: 12 }}>
                <Ring size={158} stroke={16} value={86} grad="score">
                  <div className="num" style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}><CountUp to={86} fmt={(n)=>Math.round(n)} /></div>
                  <div style={{ fontSize: 11.5, color: "var(--text-dim)", fontWeight: 700 }}>EXCELLENT</div>
                </Ring>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--gap)", marginTop: "var(--gap)" }}>
              <div className="card" style={{ textAlign: "center" }}>
                <Icon name="shield" size={24} color="var(--teal)" />
                <div className="num" style={{ fontWeight: 800, fontSize: 20, marginTop: 6, color: "var(--teal)" }}>Low</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Lifestyle Risk</div>
              </div>
              <div className="card" style={{ textAlign: "center" }}>
                <Icon name="trophy" size={24} color="var(--primary-soft)" />
                <div className="num" style={{ fontWeight: 800, fontSize: 16, marginTop: 6 }}>Champion</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Starting rank</div>
              </div>
            </div>
          </div>
          <div style={{ padding: "12px 18px calc(20px + env(safe-area-inset-bottom))" }}>
            <button className="btn btn-primary" onClick={() => go("goals")}>Set my goals</button>
          </div>
        </>
      )}

      {/* ---------------- GOALS ---------------- */}
      {stage === "goals" && (
        <>
          <div className="sq-scroll" style={{ paddingTop: 10 }}>
            <h1 style={{ fontSize: 25 }}>Set your goals</h1>
            <p style={{ color: "var(--text-dim)", marginTop: 8, fontSize: 14, marginBottom: 22 }}>We'll nudge you and reward the wins.</p>
            <div className="card" style={{ marginBottom: 12 }}>
              <div className="row" style={{ marginBottom: 6 }}><Icon name="steps" size={18} color="var(--teal)" /><span style={{ fontWeight: 700, fontSize: 14 }}>Daily steps</span></div>
              <OBSlider value={goals.steps} min={4000} max={16000} step={500}
                fmt={(v) => (v/1000).toFixed(v%1000?1:0) + "k steps"} onChange={(v) => setGoals({ ...goals, steps: v })} />
            </div>
            <div className="card" style={{ marginBottom: 12 }}>
              <div className="row" style={{ marginBottom: 6 }}><Icon name="moon" size={18} color="var(--primary-soft)" /><span style={{ fontWeight: 700, fontSize: 14 }}>Sleep target</span></div>
              <OBSlider value={goals.sleep} min={6} max={9} step={0.5}
                fmt={(v) => v + " hours"} onChange={(v) => setGoals({ ...goals, sleep: v })} />
            </div>
            <OBField label="Daily check-in reminder">
              <Segmented options={["Morning","Midday","Evening"]} value={goals.reminder} onChange={(v) => setGoals({ ...goals, reminder: v })} />
            </OBField>
            <div className="card between" style={{ marginTop: 4 }}>
              <div className="row"><Icon name="refresh" size={18} color="var(--teal)" /><span style={{ fontWeight: 700, fontSize: 14 }}>Auto-sync wearable</span></div>
              <OBToggle on={goals.autosync} onChange={(v) => setGoals({ ...goals, autosync: v })} />
            </div>
          </div>
          <div style={{ padding: "12px 18px calc(20px + env(safe-area-inset-bottom))" }}>
            <button className="btn btn-primary" onClick={() => go("done")}>Finish setup</button>
          </div>
        </>
      )}

      {/* ---------------- DONE ---------------- */}
      {stage === "done" && (
        <>
          <div className="sq-scroll" style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", paddingTop: 30 }}>
            <div className="pop mascot" style={{ margin: "0 auto" }}><Vertee size={120} mood="cheer" /></div>
            <h1 style={{ fontSize: 30, marginTop: 18 }}>You're all set,<br/>{profile.name.split(" ")[0]}!</h1>
            <p style={{ color: "var(--text-dim)", marginTop: 12, fontSize: 14.5, maxWidth: 290, marginInline: "auto" }}>
              Your journey starts at <b style={{ color: "var(--primary-soft)" }}>Spine Champion</b>. Keep your streak alive to reach VIP.
            </p>
            <div className="card" style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 13, textAlign: "left",
                  background: "linear-gradient(110deg, rgba(245,158,11,.16), rgba(124,131,255,.1))" }}>
              <div className="toast-coin" style={{ width: 42, height: 42, fontSize: 23 }}>₵</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontFamily: "var(--font-display)" }}>+150 welcome coins</div>
                <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>Plus a fresh streak — day 1 begins today.</div>
              </div>
            </div>
          </div>
          <div style={{ padding: "12px 18px calc(20px + env(safe-area-inset-bottom))" }}>
            <button className="btn btn-primary" onClick={() => onComplete({ profile, device, goals, coins: 150 })}>Enter Spine Quest</button>
          </div>
        </>
      )}
    </div>
  );
}

function OBStepper({ value, onChange, step, min, max, unit, dec = 0, compact }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: compact ? "space-between" : "flex-start" }}>
      <button className="sq-icon-btn" style={{ width: 44, height: 44, borderRadius: 14 }}
        onClick={() => onChange(Math.max(min, +(value - step).toFixed(2)))}><Icon name="minus" size={20} /></button>
      <div style={{ textAlign: "center", flex: compact ? 1 : "0 0 auto", minWidth: compact ? 0 : 110 }}>
        <span className="num" style={{ fontSize: 26, fontWeight: 800 }}>{value.toFixed(dec)}</span>
        <span style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 700 }}> {unit}</span>
      </div>
      <button className="sq-icon-btn" style={{ width: 44, height: 44, borderRadius: 14 }}
        onClick={() => onChange(Math.min(max, +(value + step).toFixed(2)))}><Icon name="plus" size={20} /></button>
    </div>
  );
}

Object.assign(window, { Onboarding });

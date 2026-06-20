/* ============================================================
   Spine Assessment — full-screen multi-step flow
   ============================================================ */

const ASSESS_Q = [
  { key: "pain", q: "Where do you feel discomfort most?", sub: "Pick the area that bothers you most.",
    opts: [["Lower back","🔻"],["Upper back / neck","🔺"],["Between shoulders","↔️"],["No pain right now","✨"]] },
  { key: "freq", q: "How often does it bother you?", sub: "Over the last 2 weeks.",
    opts: [["Rarely","🌤️"],["A few times a week","🌦️"],["Most days","🌧️"],["Constantly","⛈️"]] },
  { key: "sit", q: "Hours seated per day?", sub: "Work, commute, screen time combined.",
    opts: [["Under 4h","🟢"],["4–7h","🟡"],["8–10h","🟠"],["More than 10h","🔴"]] },
  { key: "move", q: "How active are you weekly?", sub: "Walking, gym, sport, yoga.",
    opts: [["Daily movement","🏃"],["3–4 times","🚶"],["Once or twice","🧍"],["Rarely active","🛋️"]] },
  { key: "sleep", q: "How do you usually sleep?", sub: "Quality and position matter for spines.",
    opts: [["Deep, 7–8h","😴"],["Okay, wake sometimes","🌙"],["Restless, often sore","🥱"],["Poor, neck/back pain","😣"]] },
  { key: "goal", q: "Your main goal with Spine Quest?", sub: "We'll tune your plan around this.",
    opts: [["Reduce pain","💆"],["Build strength","💪"],["Better posture","🧘"],["Stay consistent","🔥"]] },
];

function Assessment({ onClose, onComplete }) {
  const [step, setStep] = React.useState(-1); // -1 intro, 0..n questions, n calculating, n+1 results
  const [answers, setAnswers] = React.useState({});
  const total = ASSESS_Q.length;

  const pick = (key, val) => {
    setAnswers((a) => ({ ...a, [key]: val }));
    setTimeout(() => setStep((s) => s + 1), 240);
  };

  React.useEffect(() => {
    if (step === total) { const t = setTimeout(() => setStep(total + 1), 2200); return () => clearTimeout(t); }
  }, [step]);

  // intro
  if (step === -1) {
    return (
      <div className="flow">
        <FlowTop onClose={onClose} />
        <div className="sq-scroll" style={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", paddingBottom: 24 }}>
          <div className="floaty mascot" style={{ margin: "0 auto" }}><Vertee size={120} mood="cheer" /></div>
          <div style={{ display: "inline-flex", margin: "20px auto 0", padding: "6px 13px", borderRadius: 999, background: "rgba(124,131,255,.16)", color: "var(--primary-soft)", fontWeight: 800, fontSize: 12.5 }}>
            <Icon name="sparkle" size={14} /> 6 quick questions
          </div>
          <h1 style={{ fontSize: 30, marginTop: 14, lineHeight: 1.1 }}>Spine Health<br/>Assessment</h1>
          <p style={{ color: "var(--text-dim)", marginTop: 12, fontSize: 14.5, lineHeight: 1.55, maxWidth: 300, marginInline: "auto" }}>
            Hi, I'm Vertee! Answer a few questions and I'll calculate your <b style={{ color: "var(--text)" }}>Spine Health Score</b> and <b style={{ color: "var(--text)" }}>Lifestyle Risk</b>.
          </p>
          <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 22 }}>
            <div><div className="num" style={{ fontWeight: 800, fontSize: 20 }}>~90s</div><div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>to finish</div></div>
            <div style={{ width: 1, background: "var(--border)" }} />
            <div><div className="num" style={{ fontWeight: 800, fontSize: 20, color: "var(--gold)" }}>+100</div><div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>coins</div></div>
          </div>
        </div>
        <div style={{ padding: "0 18px calc(20px + env(safe-area-inset-bottom))" }}>
          <button className="btn btn-primary" onClick={() => setStep(0)}>Start assessment</button>
        </div>
      </div>
    );
  }

  // calculating
  if (step === total) {
    return (
      <div className="flow">
        <div className="sq-scroll" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <div className="floaty mascot"><Vertee size={110} mood="happy" /></div>
          <div className="spin-slow" style={{ marginTop: 24, width: 54, height: 54, borderRadius: "50%",
                border: "5px solid var(--surface-2)", borderTopColor: "var(--primary)" }} />
          <h2 style={{ fontSize: 22, marginTop: 24 }}>Calculating your scores…</h2>
          <p style={{ color: "var(--text-dim)", marginTop: 8, fontSize: 14 }}>Analyzing posture, activity &amp; sleep signals</p>
        </div>
      </div>
    );
  }

  // results
  if (step === total + 1) {
    const spineScore = 86, risk = "Low";
    return (
      <div className="flow">
        <FlowTop onClose={onClose} />
        <div className="sq-scroll" style={{ paddingBottom: 24 }}>
          <div style={{ textAlign: "center", marginTop: 4 }}>
            <div className="pop mascot" style={{ display: "inline-block" }}><Vertee size={78} mood="cheer" /></div>
            <h1 style={{ fontSize: 26, marginTop: 8 }}>Your results are in!</h1>
          </div>
          <div className="hero pop" style={{ marginTop: 16, textAlign: "center", paddingTop: 24 }}>
            <div style={{ fontSize: 12.5, color: "var(--text-dim)", fontWeight: 800, letterSpacing: ".08em" }}>SPINE HEALTH SCORE</div>
            <div style={{ marginTop: 14 }}>
              <Ring size={172} stroke={17} value={spineScore} grad="score">
                <div className="num" style={{ fontSize: 52, fontWeight: 800, lineHeight: 1 }}><CountUp to={spineScore} fmt={(n)=>Math.round(n)} /></div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 700 }}>EXCELLENT</div>
              </Ring>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--gap)", marginTop: "var(--gap)" }}>
            <div className="card" style={{ textAlign: "center" }}>
              <Icon name="shield" size={26} color="var(--teal)" />
              <div className="num" style={{ fontWeight: 800, fontSize: 22, marginTop: 6, color: "var(--teal)" }}>{risk}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Lifestyle Risk</div>
            </div>
            <div className="card" style={{ textAlign: "center" }}>
              <Icon name="trophy" size={26} color="var(--primary-soft)" />
              <div className="num" style={{ fontWeight: 800, fontSize: 18, marginTop: 6 }}>Champion</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Starting rank</div>
            </div>
          </div>
          <div className="card" style={{ marginTop: "var(--gap)", display: "flex", alignItems: "center", gap: 13,
                background: "linear-gradient(110deg, rgba(245,158,11,.16), rgba(124,131,255,.1))" }}>
            <div className="toast-coin" style={{ width: 40, height: 40, fontSize: 22 }}>₵</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontFamily: "var(--font-display)" }}>+100 coins earned</div>
              <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>Assessment complete reward</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "0 18px calc(20px + env(safe-area-inset-bottom))" }}>
          <button className="btn btn-primary" onClick={() => onComplete(100)}>Go to my dashboard</button>
        </div>
      </div>
    );
  }

  // question
  const Q = ASSESS_Q[step];
  return (
    <div className="flow">
      <FlowTop onClose={onClose} onBack={step > 0 ? () => setStep(step - 1) : null}
               progress={(step) / total} label={`${step + 1} of ${total}`} />
      <div className="sq-scroll" style={{ paddingTop: 8 }}>
        <h1 style={{ fontSize: 25, lineHeight: 1.15 }}>{Q.q}</h1>
        <p style={{ color: "var(--text-dim)", marginTop: 8, fontSize: 14, marginBottom: 22 }}>{Q.sub}</p>
        {Q.opts.map(([label, emoji]) => {
          const sel = answers[Q.key] === label;
          return (
            <button key={label} className={"opt" + (sel ? " sel" : "")} onClick={() => pick(Q.key, label)}>
              <span className="opt-emoji" style={{ fontSize: 20 }}>{emoji}</span>
              <span style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{label}</span>
              <span className="opt-check">{sel && <Icon name="check" size={15} sw={3} />}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FlowTop({ onClose, onBack, progress, label }) {
  return (
    <div style={{ padding: "12px 16px 6px", display: "flex", alignItems: "center", gap: 12 }}>
      {onBack ? <button className="sq-icon-btn" onClick={onBack}><Icon name="chevL" size={20} /></button>
              : <div style={{ width: 40 }} />}
      {progress != null ? (
        <div style={{ flex: 1 }}>
          <Bar value={progress * 100} grad="var(--grad-primary)" h={8} />
        </div>
      ) : <div style={{ flex: 1 }} />}
      {label && <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-dim)", minWidth: 52, textAlign: "right" }}>{label}</span>}
      <button className="sq-icon-btn" onClick={onClose}><Icon name="close" size={18} /></button>
    </div>
  );
}

Object.assign(window, { Assessment, FlowTop, ASSESS_Q });

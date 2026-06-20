/* ============================================================
   Levels / Rank progression
   ============================================================ */

function Levels({ state, actions }) {
  const { levels, level, score, coins } = state;
  const next = levels[level.idx + 1];
  const toNext = next ? next.scoreReq - score : 0;

  const badges = [
    { name: "First Steps", icon: "steps", color: "#34E0C4", got: true },
    { name: "7-Day Streak", icon: "flame", color: "#FF9F5A", got: true },
    { name: "Sleep Pro", icon: "moon", color: "#7C83FF", got: true },
    { name: "Pain Free Week", icon: "heart", color: "#FB7185", got: true },
    { name: "Workout x50", icon: "dumbbell", color: "#C79BFF", got: true },
    { name: "Coin Hoarder", icon: "coin", color: "#FBBF24", got: true },
    { name: "Score 90+", icon: "shield", color: "#5BE38B", got: false },
    { name: "Legend", icon: "crown", color: "#FBBF24", got: false },
  ];

  return (
    <div className="sq-scroll stagger" style={{ paddingTop: 4 }}>
      {/* current rank hero */}
      <div className="hero" style={{ textAlign: "center", paddingTop: 22 }}>
        <div className="floaty" style={{ display: "inline-block" }}>
          <div style={{ width: 96, height: 96, borderRadius: 30, margin: "0 auto",
            background: "var(--grad-primary)", display: "grid", placeItems: "center",
            boxShadow: "0 18px 40px -10px rgba(124,131,255,.7)" }}>
            <Icon name="trophy" size={48} color="#fff" />
          </div>
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: "var(--text-dim)", fontWeight: 800, letterSpacing: ".1em" }}>CURRENT RANK · LEVEL {level.idx + 1}</div>
        <h2 style={{ fontSize: 28, marginTop: 4 }}>{level.name}</h2>
        {next && (
          <div style={{ marginTop: 16, maxWidth: 300, marginInline: "auto" }}>
            <div className="between" style={{ fontSize: 12.5, marginBottom: 7 }}>
              <span className="muted">{level.name}</span>
              <span style={{ color: "var(--primary-soft)", fontWeight: 700 }}>{next.name}</span>
            </div>
            <Bar value={score - level.scoreReq} max={next.scoreReq - level.scoreReq} grad="var(--grad-primary)" h={11} />
            <div style={{ fontSize: 12.5, color: "var(--text-dim)", marginTop: 9 }}>
              <b style={{ color: "var(--text)" }}>{toNext} points</b> to reach {next.name}
            </div>
          </div>
        )}
      </div>

      {/* the journey path */}
      <Section title="Your journey" />
      <div className="card" style={{ paddingTop: 6, paddingBottom: 6 }}>
        {levels.map((lv, i) => {
          const done = i < level.idx;
          const current = i === level.idx;
          const locked = i > level.idx;
          return (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
              {/* rail */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 15, flex: "0 0 auto", display: "grid", placeItems: "center",
                  background: current ? "var(--grad-primary)" : done ? "rgba(91,227,139,.18)" : "var(--surface-2)",
                  color: current ? "#fff" : done ? "var(--green)" : "var(--text-faint)",
                  boxShadow: current ? "0 8px 20px -6px rgba(124,131,255,.7)" : "none",
                  border: current ? "none" : "1px solid var(--border)" }}>
                  {done ? <Icon name="check" size={22} sw={3} /> : locked ? <Icon name="lock" size={18} /> : <Icon name={lv.icon} size={22} />}
                </div>
                {i < levels.length - 1 && <div style={{ width: 3, flex: 1, minHeight: 22, borderRadius: 3, margin: "4px 0",
                  background: done ? "var(--green)" : "var(--border)" }} />}
              </div>
              {/* content */}
              <div style={{ flex: 1, paddingBottom: 18, paddingTop: 3, opacity: locked ? .6 : 1 }}>
                <div className="between">
                  <div style={{ fontWeight: 800, fontSize: 15.5, fontFamily: "var(--font-display)", color: current ? "var(--primary-soft)" : "var(--text)" }}>{lv.name}</div>
                  {current && <span className="pill" style={{ background: "var(--grad-primary)", color: "#fff", borderColor: "transparent", fontSize: 11, padding: "4px 9px" }}>YOU</span>}
                  {lv.vip && <span className="pill" style={{ background: "rgba(251,191,36,.16)", color: "var(--gold)", borderColor: "transparent", fontSize: 11, padding: "4px 9px" }}><Icon name="crown" size={12} fill="currentColor" />VIP</span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>Score {lv.scoreReq}+ · {lv.perk}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* achievement badges */}
      <Section title="Achievements" link={`6 / 8`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {badges.map((b, i) => (
          <div key={i} className={"badge" + (b.got ? "" : " locked")}>
            <div className="badge-medal" style={{ background: b.got ? `${b.color}22` : "var(--surface-2)", color: b.color }}>
              <Icon name={b.icon} size={24} fill={["heart","flame","coin","star","crown"].includes(b.icon) ? b.color : "none"} />
            </div>
            <span style={{ fontSize: 9.5, fontWeight: 700, textAlign: "center", lineHeight: 1.15, padding: "0 4px", color: b.got ? "var(--text)" : "var(--text-faint)" }}>{b.name}</span>
            {!b.got && <div style={{ position: "absolute", top: 7, right: 7 }}><Icon name="lock" size={13} color="var(--text-faint)" /></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Levels });

/* ============================================================
   Wearable integration / connect device
   ============================================================ */

// simple brand glyphs for each wearable
function DeviceGlyph({ id, size = 26 }) {
  const c = "#fff";
  const map = {
    apple: <path d="M16 6.5c-.8.1-1.8.6-2.4 1.3-.5.6-1 1.6-.8 2.5.9.1 1.9-.5 2.5-1.2.6-.7 1-1.7.7-2.6ZM18.3 17c-.5 1.2-.8 1.7-1.5 2.7-1 1.5-2.4 3.3-4.1 3.3-1.5 0-1.9-1-4-1-2 0-2.5 1-4 1-1.7 0-3-1.7-4-3.1-2.8-4-3.1-8.7-1.4-11.2 1.2-1.8 3.1-2.8 4.9-2.8 1.8 0 2.9 1 4.4 1 1.4 0 2.3-1 4.4-1 1.6 0 3.3.9 4.5 2.4-3.9 2.2-3.3 7.8.3 8.7Z" />,
    fitbit: <><circle cx="12" cy="4" r="1.8"/><circle cx="12" cy="20" r="1.8"/><circle cx="7" cy="8" r="1.8"/><circle cx="17" cy="8" r="1.8"/><circle cx="7" cy="16" r="1.8"/><circle cx="17" cy="16" r="1.8"/><circle cx="12" cy="12" r="2.4"/></>,
    samsung: <ellipse cx="12" cy="12" rx="10" ry="6" fill="none" stroke={c} strokeWidth="2.4" />,
    garmin: <path d="M12 3l3 5-3 3-3-3 3-5ZM5 11l4 2-2 8-3-7 1-3ZM19 11l-1 3-3 7-2-8 4-2Z" />,
    xiaomi: <><rect x="4" y="5" width="6" height="14" rx="2" fill="none" stroke={c} strokeWidth="2.2"/><path d="M14 7v10M19 5v14" stroke={c} strokeWidth="2.2" fill="none"/></>,
    amazfit: <><circle cx="12" cy="12" r="8.5" fill="none" stroke={c} strokeWidth="2.2"/><path d="M12 7v5l3 2" stroke={c} strokeWidth="2.2" fill="none"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={c}>{map[id]}</svg>;
}

const DEVICES = [
  { id: "apple", name: "Apple Watch", bg: "linear-gradient(135deg,#3a3a3c,#1d1d1f)", tracks: "Steps · Heart · Sleep" },
  { id: "fitbit", name: "Fitbit", bg: "linear-gradient(135deg,#00B0B9,#007F86)", tracks: "Steps · Sleep · Activity" },
  { id: "samsung", name: "Galaxy Watch", bg: "linear-gradient(135deg,#1428A0,#0a165e)", tracks: "Steps · Heart · Stress" },
  { id: "garmin", name: "Garmin", bg: "linear-gradient(135deg,#007CC3,#004f7d)", tracks: "Activity · Sleep" },
  { id: "xiaomi", name: "Mi Band", bg: "linear-gradient(135deg,#FF6900,#cc5400)", tracks: "Steps · Sleep" },
  { id: "amazfit", name: "Amazfit", bg: "linear-gradient(135deg,#F73B2F,#b32a21)", tracks: "Steps · SpO₂ · Sleep" },
];

function Wearables({ state, actions }) {
  const [connected, setConnected] = React.useState({ apple: true });
  const [connecting, setConnecting] = React.useState(null);

  const connect = (id) => {
    setConnecting(id);
    setTimeout(() => {
      setConnecting(null);
      setConnected((c) => ({ ...c, [id]: true }));
      actions.toast(`${DEVICES.find(d=>d.id===id).name} connected`, 30);
    }, 1300);
  };

  return (
    <div className="sq-scroll stagger" style={{ paddingTop: 4 }}>
      {/* connected hero */}
      <div className="hero" style={{ textAlign: "center", paddingTop: 22 }}>
        <div className="floaty" style={{ display: "inline-grid", placeItems: "center", width: 86, height: 86, borderRadius: 26,
              margin: "0 auto", background: "linear-gradient(135deg,#3a3a3c,#1d1d1f)", boxShadow: "var(--shadow-lg)" }}>
          <DeviceGlyph id="apple" size={40} />
        </div>
        <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px", borderRadius: 999, background: "rgba(91,227,139,.16)", color: "var(--green)", fontWeight: 800, fontSize: 12.5 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)" }} /> Connected &amp; syncing
        </div>
        <h2 style={{ fontSize: 22, marginTop: 12 }}>Apple Watch Series 9</h2>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>Last sync 4 min ago · battery 78%</p>
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          {[["Steps","8.2k","steps"],["Sleep","7.5h","moon"],["Heart","64","heart"]].map(([l,v,ic]) => (
            <div key={l} className="card" style={{ flex: 1, padding: 12, textAlign: "center" }}>
              <Icon name={ic} size={18} color="var(--primary-soft)" fill={ic==="heart"?"var(--primary-soft)":"none"} />
              <div className="num" style={{ fontWeight: 800, fontSize: 17, marginTop: 5 }}>{v}</div>
              <div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* auto-sync explainer */}
      <div className="card" style={{ marginTop: "var(--gap)", display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(52,224,196,.15)", color: "var(--teal)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
          <Icon name="refresh" size={20} />
        </div>
        <div style={{ flex: 1, fontSize: 13, color: "var(--text-dim)", lineHeight: 1.45 }}>
          We pull steps, sleep &amp; heart data automatically — <b style={{ color: "var(--text)" }}>you earn coins without lifting a finger.</b>
        </div>
      </div>

      {/* available devices */}
      <Section title="Add a device" />
      <div className="stagger" style={{ display: "grid", gap: 11 }}>
        {DEVICES.filter((d) => d.id !== "apple").map((d) => {
          const on = connected[d.id];
          const busy = connecting === d.id;
          return (
            <div key={d.id} className="card" style={{ display: "flex", alignItems: "center", gap: 13, padding: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: d.bg, display: "grid", placeItems: "center", flex: "0 0 auto" }}>
                <DeviceGlyph id={d.id} size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 14.5, fontFamily: "var(--font-display)" }}>{d.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-dim)" }}>{d.tracks}</div>
              </div>
              <button className="btn" disabled={on} onClick={() => connect(d.id)}
                      style={{ width: "auto", padding: "10px 16px", fontSize: 13,
                        background: on ? "rgba(91,227,139,.14)" : "var(--surface-2)",
                        color: on ? "var(--green)" : "var(--primary-soft)",
                        border: on ? "none" : "1px solid var(--border-strong)" }}>
                {busy ? <span className="spin-slow" style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", border: "2.5px solid var(--surface-3)", borderTopColor: "var(--primary)" }} />
                      : on ? <><Icon name="check" size={15} sw={3} /> Linked</> : "Connect"}
              </button>
            </div>
          );
        })}
      </div>

      {/* manual fallback */}
      <Section title="No wearable?" />
      <div className="card card-tap" onClick={() => actions.go("track")} style={{ display: "flex", alignItems: "center", gap: 13,
            background: "linear-gradient(110deg, rgba(124,131,255,.12), rgba(244,114,182,.08))" }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--grad-primary)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
          <Icon name="plus" size={24} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14.5, fontFamily: "var(--font-display)" }}>Enter data manually</div>
          <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>Log steps, sleep &amp; weight by hand — still earns coins.</div>
        </div>
        <Icon name="chevR" size={20} color="var(--primary-soft)" />
      </div>
    </div>
  );
}

Object.assign(window, { Wearables, DeviceGlyph, DEVICES });

/* ============================================================
   Rewards Marketplace
   ============================================================ */

const REWARDS = [
  { id: "physio", cat: "Health", name: "Free physio session", cost: 2000, icon: "stethoscope", grad: "var(--grad-pink)", hot: true },
  { id: "consult", cat: "Health", name: "Free doctor consult", cost: 3000, icon: "user", grad: "var(--grad-primary)" },
  { id: "priority", cat: "Health", name: "Priority booking", cost: 1200, icon: "cal", grad: "linear-gradient(135deg,#34E0C4,#16B8A0)" },
  { id: "avatar", cat: "Cosmetic", name: "Custom avatar pack", cost: 600, icon: "user", grad: "linear-gradient(135deg,#B06CFF,#7C83FF)" },
  { id: "theme", cat: "Cosmetic", name: "Premium theme", cost: 800, icon: "palette", grad: "linear-gradient(135deg,#F472B6,#B06CFF)" },
  { id: "champbadge", cat: "Cosmetic", name: "Spine Champion badge", cost: 1500, icon: "shield", grad: "var(--grad-coin)" },
  { id: "voucher", cat: "Vouchers", name: "₹500 health voucher", cost: 2500, icon: "ticket", grad: "linear-gradient(135deg,#FF9F5A,#FB6B7B)" },
  { id: "vip", cat: "Vouchers", name: "VIP Membership", cost: 5000, icon: "crown", grad: "var(--grad-coin)", vip: true },
];

function Rewards({ state, actions }) {
  const { coins } = state;
  const [cat, setCat] = React.useState("All");
  const cats = ["All", "Health", "Cosmetic", "Vouchers"];
  const list = REWARDS.filter((r) => cat === "All" || r.cat === cat);

  return (
    <div className="sq-scroll stagger" style={{ paddingTop: 4 }}>
      {/* balance hero */}
      <div className="hero" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: "var(--grad-coin)", display: "grid", placeItems: "center",
              boxShadow: "0 14px 30px -8px rgba(245,158,11,.6)", flex: "0 0 auto" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 34, color: "#7a4d00" }}>₵</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12.5, color: "var(--text-dim)", fontWeight: 700 }}>YOUR BALANCE</div>
          <div className="num" style={{ fontSize: 38, fontWeight: 800, lineHeight: 1 }}>{coins.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: "var(--gold)", fontWeight: 700, marginTop: 3 }}>Spine Coins</div>
        </div>
        <button className="sq-icon-btn" onClick={() => actions.openSheet("earn")} style={{ width: 44, height: 44 }}>
          <Icon name="plus" size={22} color="var(--gold)" />
        </button>
      </div>

      {/* VIP feature banner */}
      <div className="card card-tap" style={{ marginTop: "var(--gap)", overflow: "hidden", position: "relative",
            background: "linear-gradient(120deg, rgba(245,158,11,.2), rgba(176,108,255,.16))", borderColor: "rgba(251,191,36,.35)" }}
           onClick={() => actions.openSheet("vip")}>
        <div className="spin-slow" style={{ position: "absolute", right: -40, top: -40, width: 130, height: 130, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(251,191,36,.35), transparent 70%)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 13, position: "relative" }}>
          <div style={{ width: 48, height: 48, borderRadius: 15, background: "var(--grad-coin)", display: "grid", placeItems: "center", color: "#7a4d00", flex: "0 0 auto" }}>
            <Icon name="crown" size={26} fill="currentColor" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15.5, fontFamily: "var(--font-display)" }}>Unlock VIP Membership</div>
            <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>Quarterly reviews · coaching · analytics</div>
          </div>
          <Icon name="chevR" size={20} color="var(--gold)" />
        </div>
      </div>

      {/* filters */}
      <div style={{ marginTop: 18 }}>
        <Segmented options={cats} value={cat} onChange={setCat} />
      </div>

      {/* grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--gap)", marginTop: "var(--gap)" }}>
        {list.map((r) => {
          const can = coins >= r.cost;
          return (
            <div key={r.id} className="card" style={{ padding: 14, display: "flex", flexDirection: "column",
                  gridColumn: r.vip ? "span 2" : undefined, position: "relative", overflow: "hidden",
                  borderColor: r.vip ? "rgba(251,191,36,.35)" : undefined }}>
              {r.hot && <span style={{ position: "absolute", top: 12, right: 12, fontSize: 10, fontWeight: 800, color: "var(--pink)",
                    background: "rgba(244,114,182,.16)", padding: "3px 8px", borderRadius: 999 }}>POPULAR</span>}
              <div style={{ display: "flex", alignItems: "center", gap: r.vip ? 13 : 0, flexDirection: r.vip ? "row" : "column", alignItems: r.vip ? "center" : "flex-start" }}>
                <div style={{ width: r.vip ? 52 : 46, height: r.vip ? 52 : 46, borderRadius: 15, background: r.grad,
                      display: "grid", placeItems: "center", color: r.vip ? "#7a4d00" : "#fff", marginBottom: r.vip ? 0 : 12, flex: "0 0 auto" }}>
                  <Icon name={r.icon} size={r.vip ? 28 : 24} fill={r.icon === "crown" ? "currentColor" : "none"} color={r.vip ? "#7a4d00" : "#fff"} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, fontFamily: "var(--font-display)", lineHeight: 1.2 }}>{r.name}</div>
                  {r.vip && <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 3 }}>8 premium benefits inside</div>}
                </div>
              </div>
              <div className="between" style={{ marginTop: r.vip ? 14 : 12 }}>
                <span className="pill pill-coin" style={{ padding: "5px 10px" }}><CoinChip size={15} />{r.cost.toLocaleString()}</span>
                <button className="btn" disabled={!can}
                        onClick={() => actions.openSheet("redeem", r)}
                        style={{ width: "auto", padding: "9px 16px", fontSize: 13,
                          background: can ? "var(--grad-primary)" : "var(--surface-2)", color: can ? "#fff" : "var(--text-faint)" }}>
                  {can ? "Redeem" : "Locked"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { Rewards, REWARDS });

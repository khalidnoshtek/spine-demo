/* ============================================================
   Vertee mascot + icon set
   ============================================================ */

// ---- Vertee: a friendly glowing-spine coach character ----
function Vertee({ size = 92, mood = "happy", glow = true }) {
  // mood: happy | cheer | wink | calm
  const eyeY = mood === "calm" ? 0 : 0;
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115" fill="none"
         style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="vBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9BA0FF" />
          <stop offset="1" stopColor="#6E5BF0" />
        </linearGradient>
        <linearGradient id="vGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34E0C4" />
          <stop offset="1" stopColor="#7C83FF" />
        </linearGradient>
        <radialGradient id="vShine" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity=".7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {glow && (
        <ellipse cx="50" cy="58" rx="44" ry="50" fill="url(#vGlow)" opacity=".22">
          <animate attributeName="opacity" values=".15;.3;.15" dur="3.5s" repeatCount="indefinite" />
        </ellipse>
      )}

      {/* spine column = stacked rounded vertebrae */}
      {[0,1,2,3].map((i) => {
        const y = 38 + i * 17;
        const w = 30 - i * 2.5;
        return (
          <g key={i}>
            <rect x={50 - w/2} y={y} width={w} height={13} rx="6.5" fill="url(#vBody)" />
            {/* side wings */}
            <circle cx={50 - w/2 - 3} cy={y + 6.5} r="4.5" fill="url(#vBody)" opacity=".85" />
            <circle cx={50 + w/2 + 3} cy={y + 6.5} r="4.5" fill="url(#vBody)" opacity=".85" />
          </g>
        );
      })}

      {/* head */}
      <circle cx="50" cy="28" r="24" fill="url(#vBody)" />
      <ellipse cx="42" cy="20" rx="13" ry="10" fill="url(#vShine)" />

      {/* face */}
      {mood === "wink" ? (
        <>
          <circle cx="42" cy="28" r="3.4" fill="#1a1640" />
          <path d="M54 28 q4 -3 8 0" stroke="#1a1640" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="42" cy={28+eyeY} r="3.6" fill="#1a1640" />
          <circle cx="58" cy={28+eyeY} r="3.6" fill="#1a1640" />
          <circle cx="43.2" cy={26.8+eyeY} r="1.2" fill="#fff" />
          <circle cx="59.2" cy={26.8+eyeY} r="1.2" fill="#fff" />
        </>
      )}
      {/* cheeks */}
      <circle cx="36" cy="34" r="3.4" fill="#F472B6" opacity=".55" />
      <circle cx="64" cy="34" r="3.4" fill="#F472B6" opacity=".55" />
      {/* smile */}
      {mood === "cheer"
        ? <path d="M43 34 q7 9 14 0" stroke="#1a1640" strokeWidth="3" fill="#1a1640" strokeLinejoin="round" />
        : <path d="M44 35 q6 5 12 0" stroke="#1a1640" strokeWidth="3" fill="none" strokeLinecap="round" />}

      {/* little arms when cheering */}
      {mood === "cheer" && (
        <>
          <path d="M28 40 q-10 -8 -8 -18" stroke="url(#vBody)" strokeWidth="6" strokeLinecap="round" />
          <path d="M72 40 q10 -8 8 -18" stroke="url(#vBody)" strokeWidth="6" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

// ---- Icon set (line icons, 24x24 stroke) ----
const ICONS = {
  home: "M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5",
  pulse: "M3 12h4l2-6 4 14 3-9 2 2h3",
  trophy: "M7 4h10v3a5 5 0 0 1-10 0V4ZM7 5H4v1a3 3 0 0 0 3 3M17 5h3v1a3 3 0 0 1-3 3M9 14.5h6M12 12v3M8 20h8M10 18h4",
  gift: "M4 11h16v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8ZM3 8h18v3H3zM12 8v12M12 8S10 3 7.5 4.5 9 8 12 8ZM12 8s2-5 4.5-3.5S15 8 12 8Z",
  heart: "M12 20s-7-4.6-9.3-9.1C1.2 8 2.5 4.5 6 4.5c2 0 3.2 1.3 4 2.4.8-1.1 2-2.4 4-2.4 3.5 0 4.8 3.5 3.3 6.4C19 15.4 12 20 12 20Z",
  moon: "M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z",
  steps: "M9 18a2.5 2.5 0 0 1-5 0c0-2 .6-3 .6-5S4 9 5 7s3-1 3.5.5S8 11 8.5 13s.5 3 .5 5ZM20 15a2.5 2.5 0 0 1-5 0c0-2 .5-2.5.5-4.5S15 9 16 7.5s2.5-1 3 .3-.2 2.7 0 4.7.5 2 1 2.5",
  scale: "M5 8h14l-2 11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L5 8ZM5 8l1.2-3.2a1 1 0 0 1 .9-.6h9.8a1 1 0 0 1 .9.6L19 8M12 11.5v2.5",
  flame: "M12 3s5 4 5 9a5 5 0 0 1-10 0c0-1.5.6-2.7 1.3-3.6C9 10 10 11 10 12c0-2 1-4 2-9Z",
  coin: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM9.5 9.5c0-1.2 1.1-2 2.5-2s2.5.6 2.5 1.7c0 2.3-5 1.2-5 3.6 0 1.1 1.1 1.7 2.5 1.7s2.5-.8 2.5-2M12 6.5v1M12 15.5v1",
  watch: "M9 7h6v10H9zM9 7l.6-3.2a1 1 0 0 1 1-.8h2.8a1 1 0 0 1 1 .8L15 7M9 17l.6 3.2a1 1 0 0 0 1 .8h2.8a1 1 0 0 0 1-.8L15 17M12 10v2.5l1.5 1",
  chevR: "M9 5l7 7-7 7",
  chevL: "M15 5l-7 7 7 7",
  chevD: "M5 9l7 7 7-7",
  close: "M6 6l12 12M18 6 6 18",
  check: "M5 12.5 10 17 19 7",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9Z",
  star: "M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8L12 16.8 6.8 19.5l1-5.8L3.5 9.6l5.9-.8L12 3.5Z",
  bolt: "M13 2 4 14h6l-1 8 9-12h-6l1-8Z",
  cal: "M4 6h16v15H4zM4 9h16M8 3v4M16 3v4M8 13h2M8 17h2M14 13h2",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20a7 7 0 0 1 14 0",
  bell: "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6ZM9.5 19a2.5 2.5 0 0 0 5 0",
  cog: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM19 12c0 .5 0 .9-.1 1.3l1.8 1.4-2 3.4-2.1-.9c-.6.5-1.3.9-2 1.1L12.5 22h-1L11 18.4c-.7-.2-1.4-.6-2-1.1l-2.1.9-2-3.4 1.8-1.4c0-.4-.1-.8-.1-1.3s0-.9.1-1.3L5 9.4l2-3.4 2.1.9c.6-.5 1.3-.9 2-1.1L11.5 2h1l.5 3.6c.7.2 1.4.6 2 1.1l2.1-.9 2 3.4-1.8 1.4c.1.4.1.8.1 1.3Z",
  crown: "M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13L4 8ZM5.5 20h13",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3ZM9 12l2 2 4-4",
  zap: "M5 12a7 7 0 0 1 14 0M8.5 12a3.5 3.5 0 0 1 7 0M12 12v.01",
  arrowUp: "M12 19V5M5 12l7-7 7 7",
  arrowDown: "M12 5v14M5 12l7 7 7-7",
  palette: "M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.5 0-1.4-1-1.6-1-2.8 0-.9.7-1.4 1.6-1.4H16a5 5 0 0 0 5-5c0-4.1-4-7.3-9-7.3ZM7.5 13a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM9.5 8.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM14.5 8.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z",
  ticket: "M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4ZM14 6v12",
  stethoscope: "M6 4v5a4 4 0 0 0 8 0V4M6 4H4.5M14 4h1.5M10 17a5 5 0 0 0 5-5M18 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8L18 16Z",
  refresh: "M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4",
  play: "M7 4.5v15l13-7.5-13-7.5Z",
  link: "M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1",
  dumbbell: "M6.5 6.5l11 11M4 9l2-2 2 2-2 2-2-2ZM16 17l2-2 2 2-2 2-2-2ZM7 12l5 5M12 7l5 5",
  map: "M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2ZM9 4v14M15 6v14",
};

function Icon({ name, size = 22, color = "currentColor", sw = 2, fill = "none" }) {
  const d = ICONS[name] || "";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
         stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {d.split("M").filter(Boolean).map((seg, i) => <path key={i} d={"M" + seg} />)}
    </svg>
  );
}

// solid coin chip used in many places
function CoinChip({ size = 22 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: "50%", display: "grid", placeItems: "center",
      background: "var(--grad-coin)", color: "#7a4d00", flex: "0 0 auto",
      fontFamily: "var(--font-display)", fontWeight: 800, fontSize: size * 0.6,
      boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.35)"
    }}>₵</span>
  );
}

Object.assign(window, { Vertee, Icon, CoinChip, ICONS });

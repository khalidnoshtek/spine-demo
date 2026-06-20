// SPINEVERSE — spine avatar + body pain map (SVG)

const SPINE_REGIONS = [
  { key: 'neck',      label: 'Neck',       t0: 0.00, t1: 0.16 },
  { key: 'shoulders', label: 'Shoulders',  t0: 0.16, t1: 0.30 },
  { key: 'upperBack', label: 'Upper Back', t0: 0.30, t1: 0.50 },
  { key: 'midBack',   label: 'Mid Back',   t0: 0.50, t1: 0.66 },
  { key: 'lowerBack', label: 'Lower Back', t0: 0.66, t1: 0.86 },
  { key: 'hips',      label: 'Hips',       t0: 0.86, t1: 1.00 },
];
window.SPINE_REGIONS = SPINE_REGIONS;
const regionForT = (t) => SPINE_REGIONS.find((r) => t >= r.t0 && t <= r.t1) || SPINE_REGIONS[SPINE_REGIONS.length - 1];

// curve x-offset along the column; posture 1=aligned, 0=collapsed
const spineX = (t, posture = 1) => {
  const base = 15 * Math.sin(t * Math.PI * 2.05);
  const hunch = (1 - posture) * 42 * Math.pow(t, 1.6); // forward collapse toward lumbar
  return 100 + base + hunch;
};

function SpineAvatar({
  pain = {}, strength = 0.5, posture = 1, compress = 0, scale = 1,
  breathing = true, current = true, height = 460, style = {},
}) {
  const N = 24;
  const verts = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const y = 34 + t * 452;
    const x = spineX(t, posture);
    const w = 22 + t * 30;
    const h = 11 + t * 5;
    const region = regionForT(t);
    const lvl = pain[region.key] || 0;
    verts.push({ i, t, x, y, w, h, region: region.key, lvl });
  }
  const energy = 0.35 + strength * 0.65;

  return (
    <svg viewBox="0 0 200 520" width={200 * scale} height={520 * scale} style={{ overflow: 'visible', ...style }}>
      <defs>
        <linearGradient id="spineEnergy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SV.cyan} />
          <stop offset="55%" stopColor={SV.spineMid} />
          <stop offset="100%" stopColor={SV.violet} />
        </linearGradient>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={SV.cyan} stopOpacity={0.5 * energy} />
          <stop offset="100%" stopColor={SV.cyan} stopOpacity="0" />
        </radialGradient>
        <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="bigBlur" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="13" />
        </filter>
      </defs>

      {/* ambient core glow */}
      <ellipse cx="100" cy="260" rx="120" ry="200" fill="url(#coreGlow)" />

      <g className={breathing ? 'sv-breathe' : ''} style={{ transformOrigin: '100px 260px' }}>
        {/* pain halos (behind) */}
        {verts.filter((v) => v.lvl > 0).map((v) => (
          <circle key={'h' + v.i} cx={v.x} cy={v.y} r={16 + v.lvl * 5} fill={painColor(v.lvl)}
            opacity={0.16 + v.lvl * 0.12} filter="url(#bigBlur)" />
        ))}

        {/* connective energy line through centers */}
        <path d={'M ' + verts.map((v) => `${v.x} ${v.y}`).join(' L ')}
          fill="none" stroke="url(#spineEnergy)" strokeWidth={2.4} strokeLinecap="round"
          opacity={0.5 + strength * 0.4} filter="url(#softGlow)" />

        {/* discs */}
        {verts.slice(0, -1).map((v, i) => {
          const n = verts[i + 1];
          const mx = (v.x + n.x) / 2, my = (v.y + n.y) / 2;
          const drx = (v.w * 0.42);
          const dry = (4 - compress * 2.4);
          return <ellipse key={'d' + i} cx={mx} cy={my} rx={drx} ry={Math.max(1.1, dry)}
            fill={compress > 0.55 ? SV.pain2 : SV.cyanDeep} opacity={0.5} />;
        })}

        {/* vertebrae */}
        {verts.map((v) => {
          const col = v.lvl > 0 ? painColor(v.lvl) : 'url(#spineEnergy)';
          return (
            <g key={v.i} filter="url(#softGlow)">
              {/* lateral processes */}
              <rect x={v.x - v.w / 2 - 7} y={v.y - 1.3} width={7} height={2.6} rx={1.3} fill={col} opacity={0.55} />
              <rect x={v.x + v.w / 2} y={v.y - 1.3} width={7} height={2.6} rx={1.3} fill={col} opacity={0.55} />
              {/* body */}
              <rect x={v.x - v.w / 2} y={v.y - v.h / 2} width={v.w} height={v.h} rx={v.h / 2}
                fill={col} stroke="rgba(255,255,255,0.5)" strokeWidth={0.5} />
            </g>
          );
        })}

        {/* travelling current pulse */}
        {current && (
          <circle r={4.4} fill="#ffffff" filter="url(#softGlow)">
            <animateMotion dur={`${3.4 - strength * 1.6}s`} repeatCount="indefinite"
              path={'M ' + verts.map((v) => `${v.x} ${v.y}`).join(' L ')} />
            <animate attributeName="opacity" values="0;1;1;0" dur={`${3.4 - strength * 1.6}s`} repeatCount="indefinite" />
          </circle>
        )}
      </g>
    </svg>
  );
}
window.SpineAvatar = SpineAvatar;

// ───────────────────────── Human body pain map ─────────────────────────
// Three views; tap zones cycle 0→1→2→3→0 intensity. viewBox 200x360.
const BODY_ZONES = {
  front: [
    { key: 'neck',      cx: 100, cy: 64,  r: 12 },
    { key: 'shoulders', cx: 73,  cy: 86,  r: 12 },
    { key: 'shoulders', cx: 127, cy: 86,  r: 12, alias: true },
    { key: 'midBack',   cx: 100, cy: 112, r: 15 },
    { key: 'lowerBack', cx: 100, cy: 150, r: 15 },
    { key: 'hips',      cx: 100, cy: 190, r: 15 },
  ],
  back: [
    { key: 'neck',      cx: 100, cy: 64,  r: 12 },
    { key: 'shoulders', cx: 100, cy: 88,  r: 14 },
    { key: 'upperBack', cx: 100, cy: 116, r: 15 },
    { key: 'midBack',   cx: 100, cy: 146, r: 14 },
    { key: 'lowerBack', cx: 100, cy: 176, r: 14 },
    { key: 'hips',      cx: 100, cy: 202, r: 15 },
  ],
  side: [
    { key: 'neck',      cx: 109, cy: 60,  r: 11 },
    { key: 'upperBack', cx: 114, cy: 104, r: 12 },
    { key: 'midBack',   cx: 112, cy: 142, r: 12 },
    { key: 'lowerBack', cx: 107, cy: 178, r: 13 },
    { key: 'hips',      cx: 103, cy: 206, r: 13 },
  ],
};
window.BODY_ZONES = BODY_ZONES;

function Mannequin({ view }) {
  const limb = themed('#141a45', '#c4cce8');
  const stroke = SV.cyan, sOp = themed(0.42, 0.5);
  if (view === 'side') {
    return (
      <g>
        <path d="M106 72 L100 152" stroke={limb} strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M96 210 L90 314" stroke={limb} strokeWidth="17" strokeLinecap="round" fill="none" />
        <path d="M106 210 L114 314" stroke={limb} strokeWidth="17" strokeLinecap="round" fill="none" />
        <circle cx="108" cy="36" r="16" fill="url(#bodyFill)" stroke={stroke} strokeOpacity={sOp} strokeWidth="1.4" />
        <path d="M108 54 C130 64 128 112 121 154 C117 184 113 202 106 216 L82 216 C87 186 89 154 87 116 C86 90 90 70 97 56 Z"
          fill="url(#bodyFill)" stroke={stroke} strokeOpacity={sOp} strokeWidth="1.4" />
      </g>
    );
  }
  return (
    <g>
      {/* arms */}
      <path d="M72 78 L56 158" stroke={limb} strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M128 78 L144 158" stroke={limb} strokeWidth="15" strokeLinecap="round" fill="none" />
      {/* legs */}
      <path d="M88 206 L82 314" stroke={limb} strokeWidth="17" strokeLinecap="round" fill="none" />
      <path d="M112 206 L118 314" stroke={limb} strokeWidth="17" strokeLinecap="round" fill="none" />
      {/* head */}
      <circle cx="100" cy="36" r="17" fill="url(#bodyFill)" stroke={stroke} strokeOpacity={sOp} strokeWidth="1.4" />
      {/* torso */}
      <path d="M70 74 Q100 60 130 74 L122 162 Q100 171 78 162 Z" fill="url(#bodyFill)" stroke={stroke} strokeOpacity={sOp} strokeWidth="1.4" />
      {/* pelvis */}
      <path d="M78 160 L122 160 L116 208 Q100 216 84 208 Z" fill="url(#bodyFill)" stroke={stroke} strokeOpacity={sOp} strokeWidth="1.4" />
    </g>
  );
}
window.Mannequin = Mannequin;

function BodyMap({ view = 'back', pain = {}, onTap }) {
  const zones = BODY_ZONES[view];
  return (
    <svg viewBox="0 0 200 360" width="100%" height="100%" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="bodyFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={themed('#1a2150', '#e1e6f6')} />
          <stop offset="100%" stopColor={themed('#0a0e28', '#c8d0ec')} />
        </linearGradient>
        <filter id="zoneBlur" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <Mannequin view={view} />

      {zones.map((z, i) => {
        const lvl = pain[z.key] || 0;
        return (
          <g key={i} onClick={() => onTap && onTap(z.key)} style={{ cursor: 'pointer' }}>
            {/* generous invisible hit area */}
            <circle cx={z.cx} cy={z.cy} r={z.r + 8} fill="transparent" />
            {lvl > 0 && <circle cx={z.cx} cy={z.cy} r={z.r + 6} fill={painColor(lvl)} opacity={0.25 + lvl * 0.12} filter="url(#zoneBlur)" />}
            <circle cx={z.cx} cy={z.cy} r={z.r}
              fill={lvl > 0 ? painColor(lvl) : 'rgba(120,200,255,0.12)'}
              fillOpacity={lvl > 0 ? 0.55 : 1}
              stroke={lvl > 0 ? painColor(lvl) : 'rgba(140,210,255,0.55)'} strokeWidth="1.3"
              className={lvl === 0 ? 'sv-zone-idle' : ''} />
            {lvl > 0 && <text x={z.cx} y={z.cy + 4} textAnchor="middle" fontFamily="Sora" fontWeight="700" fontSize="12" fill="#1a0a0a">{lvl}</text>}
          </g>
        );
      })}
    </svg>
  );
}
window.BodyMap = BodyMap;

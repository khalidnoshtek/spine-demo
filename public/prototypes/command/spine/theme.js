/* Spine Command Center — design tokens.
   Two directions (Aurora / Carbon), each in dark + light. Cyan core. */

const _aurora = {
  id: 'aurora', name: 'Aurora', tagline: 'Luminous · glass · glow',
  fontDisplay: "'Sora', system-ui, sans-serif",
  fontBody: "'Sora', system-ui, sans-serif",
  fontNum: "'Sora', system-ui, sans-serif",
  radius: 26, radiusSm: 18, blur: 'blur(22px) saturate(150%)',
};
const _carbon = {
  id: 'carbon', name: 'Carbon', tagline: 'OLED · precision · data',
  fontDisplay: "'Space Grotesk', system-ui, sans-serif",
  fontBody: "'Space Grotesk', system-ui, sans-serif",
  fontNum: "'JetBrains Mono', ui-monospace, monospace",
  radius: 14, radiusSm: 10, blur: 'blur(16px) saturate(140%)',
};

window.SPINE_THEMES = {
  // ── AURORA · DARK ──────────────────────────────────────────────────
  aurora: { ..._aurora,
    mode: 'dark',
    bg: '#060A14',
    bgScene: 'radial-gradient(120% 80% at 50% -8%, rgba(0,229,255,0.20) 0%, rgba(99,102,241,0.10) 34%, rgba(6,10,20,0) 62%), radial-gradient(90% 60% at 100% 110%, rgba(99,102,241,0.14) 0%, rgba(6,10,20,0) 60%), #060A14',
    surface: 'rgba(255,255,255,0.045)', surfaceSolid: '#0E1626', surface2: 'rgba(255,255,255,0.07)',
    border: 'rgba(255,255,255,0.10)', borderStrong: 'rgba(255,255,255,0.16)',
    text: '#F2F6FF', textDim: 'rgba(228,236,255,0.62)', textFaint: 'rgba(228,236,255,0.34)',
    accent: '#00E5FF', accent2: '#7C8CFF', accentSoft: 'rgba(0,229,255,0.14)', onAccent: '#04121a',
    good: '#34E5B0', warn: '#FFC24B', bad: '#FF6E8A',
    ringTrack: 'rgba(255,255,255,0.08)', glow: true,
    navBg: 'rgba(10,15,26,0.72)', navBorder: 'rgba(255,255,255,0.08)',
    statusDark: true,
  },
  // ── AURORA · LIGHT ─────────────────────────────────────────────────
  auroraLight: { ..._aurora,
    mode: 'light',
    bg: '#EAF0F8',
    bgScene: 'radial-gradient(120% 80% at 50% -8%, rgba(0,180,212,0.22) 0%, rgba(99,102,241,0.12) 34%, rgba(234,240,248,0) 62%), radial-gradient(90% 60% at 100% 110%, rgba(124,140,255,0.16) 0%, rgba(234,240,248,0) 60%), #EAF0F8',
    surface: 'rgba(255,255,255,0.72)', surfaceSolid: '#FFFFFF', surface2: 'rgba(255,255,255,0.95)',
    border: 'rgba(13,24,44,0.09)', borderStrong: 'rgba(13,24,44,0.18)',
    text: '#0B1426', textDim: 'rgba(13,24,44,0.60)', textFaint: 'rgba(13,24,44,0.38)',
    accent: '#0097B6', accent2: '#5B63E6', accentSoft: 'rgba(0,151,182,0.13)', onAccent: '#FFFFFF',
    good: '#0E9D6B', warn: '#C07A00', bad: '#DE3F66',
    ringTrack: 'rgba(13,24,44,0.09)', glow: false,
    navBg: 'rgba(255,255,255,0.78)', navBorder: 'rgba(13,24,44,0.08)',
    statusDark: false,
  },
  // ── CARBON · DARK ──────────────────────────────────────────────────
  carbon: { ..._carbon,
    mode: 'dark',
    bg: '#08090B',
    bgScene: 'radial-gradient(100% 60% at 50% -10%, rgba(34,211,238,0.10) 0%, rgba(8,9,11,0) 55%), #08090B',
    surface: '#101216', surfaceSolid: '#101216', surface2: '#171A20',
    border: 'rgba(255,255,255,0.075)', borderStrong: 'rgba(255,255,255,0.14)',
    text: '#F4F6F8', textDim: 'rgba(228,236,245,0.55)', textFaint: 'rgba(228,236,245,0.30)',
    accent: '#22D3EE', accent2: '#A3E635', accentSoft: 'rgba(34,211,238,0.12)', onAccent: '#04121a',
    good: '#4ADE80', warn: '#FACC15', bad: '#F87171',
    ringTrack: 'rgba(255,255,255,0.06)', glow: false,
    navBg: 'rgba(12,13,16,0.88)', navBorder: 'rgba(255,255,255,0.07)',
    statusDark: true,
  },
  // ── CARBON · LIGHT ─────────────────────────────────────────────────
  carbonLight: { ..._carbon,
    mode: 'light',
    bg: '#F3F4F6',
    bgScene: 'radial-gradient(100% 60% at 50% -10%, rgba(8,145,178,0.12) 0%, rgba(243,244,246,0) 55%), #F3F4F6',
    surface: '#FFFFFF', surfaceSolid: '#FFFFFF', surface2: '#F0F1F4',
    border: 'rgba(15,18,24,0.10)', borderStrong: 'rgba(15,18,24,0.2)',
    text: '#0D1014', textDim: 'rgba(15,18,24,0.56)', textFaint: 'rgba(15,18,24,0.34)',
    accent: '#0891B2', accent2: '#4D9E1F', accentSoft: 'rgba(8,145,178,0.11)', onAccent: '#FFFFFF',
    good: '#16A34A', warn: '#CA8A04', bad: '#DC2626',
    ringTrack: 'rgba(15,18,24,0.08)', glow: false,
    navBg: 'rgba(255,255,255,0.9)', navBorder: 'rgba(15,18,24,0.08)',
    statusDark: false,
  },
};

// Curated accent options — each has a dark + light tuned palette.
window.SPINE_ACCENTS = {
  Cyan:   { hex: '#00E5FF',
            dark:  { accent: '#00E5FF', accent2: '#7C8CFF', accentSoft: 'rgba(0,229,255,0.14)' },
            light: { accent: '#0097B6', accent2: '#5B63E6', accentSoft: 'rgba(0,151,182,0.13)' } },
  Teal:   { hex: '#22D3EE',
            dark:  { accent: '#22D3EE', accent2: '#34E5B0', accentSoft: 'rgba(34,211,238,0.13)' },
            light: { accent: '#0E9CB0', accent2: '#0E9D6B', accentSoft: 'rgba(14,156,176,0.13)' } },
  Violet: { hex: '#A78BFA',
            dark:  { accent: '#A78BFA', accent2: '#22D3EE', accentSoft: 'rgba(167,139,250,0.16)' },
            light: { accent: '#7C5CE0', accent2: '#0E9CB0', accentSoft: 'rgba(124,92,224,0.14)' } },
  Lime:   { hex: '#A3E635',
            dark:  { accent: '#A3E635', accent2: '#34E5B0', accentSoft: 'rgba(163,230,53,0.14)' },
            light: { accent: '#4D9E1F', accent2: '#0E9D6B', accentSoft: 'rgba(77,158,31,0.14)' } },
};

export type TileKind = 'live' | 'video' | 'emulator'

export interface Prototype {
  id: string
  name: string
  /** one-line positioning shown under the name / in focus chrome */
  tagline: string
  /** short category chip */
  category: string
  kind: TileKind
  /** accent color used for glow, status dot, focus chrome */
  accent: string
  /** featured tiles render larger with a flagship treatment */
  featured?: boolean
  /** live + emulator: url loaded in an iframe (emulator only mounts on focus) */
  src?: string
  /** video: looping muted source + still poster shown until first paint */
  video?: string
  poster?: string
  /** emulator: platform label shown on the poster chrome */
  platform?: string
  build?: string
}

/**
 * The prototype set powering the grid. Native phone width is 390px — every
 * "live" tile renders the real iframe at that width and is scaled into its
 * bezel with a CSS transform so it stays crisp. See PhoneFrame for the math.
 */
export const PROTOTYPES: Prototype[] = [
  {
    id: 'spineverse',
    name: 'Spineverse',
    tagline: 'Spine health, gamified',
    category: 'Health',
    kind: 'live',
    accent: '#8b5cf6',
    featured: true,
    src: '/prototypes/spineverse/SPINEVERSE.html',
    build: 'Claude Design',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    tagline: 'Recovery-first training',
    category: 'Health',
    kind: 'live',
    accent: '#22d3ee',
    src: '/prototypes/pulse.html',
    build: 'v0.4 · Internal',
  },
  {
    id: 'loop',
    name: 'Loop',
    tagline: 'Sound that follows your day',
    category: 'Audio',
    kind: 'live',
    accent: '#f472b6',
    src: '/prototypes/loop.html',
    build: 'v0.6 · Beta',
  },
  {
    id: 'nest',
    name: 'Nest',
    tagline: 'Your home, one tap',
    category: 'IoT',
    kind: 'live',
    accent: '#34d399',
    src: '/prototypes/nest.html',
    build: 'v0.2 · Prototype',
  },
  {
    id: 'drift',
    name: 'Drift',
    tagline: 'Slow travel, planned fast',
    category: 'Travel',
    kind: 'video',
    accent: '#fbbf24',
    video: '/videos/drift.mp4',
    poster: '/videos/drift.svg',
    build: 'Concept reel',
  },
  {
    id: 'bloom',
    name: 'Bloom',
    tagline: 'A calmer nervous system',
    category: 'Wellness',
    kind: 'video',
    accent: '#a855f7',
    video: '/videos/bloom.mp4',
    poster: '/videos/bloom.svg',
    build: 'Concept reel',
  },
  {
    id: 'vault',
    name: 'Vault',
    tagline: 'Self-custody without the fear',
    category: 'Crypto',
    kind: 'emulator',
    accent: '#f97316',
    src: '/prototypes/vault.html',
    platform: 'iOS 17 · iPhone 15 Pro',
    build: 'Native build',
  },
]

export const STUDIO = {
  name: 'Spine',
  kicker: 'Venture Studio',
  subtitle: 'Live Prototype Lab',
}

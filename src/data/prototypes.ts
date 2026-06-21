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
  /** 'light' apps get a dark status-bar overlay so the time/battery stay legible */
  appTheme?: 'light' | 'dark'
  /** suppress the dashboard status bar when the embedded app draws its own */
  hideStatusBar?: boolean
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
    id: 'command',
    name: 'Spine Command Center',
    tagline: 'The consumer spine-health OS',
    category: 'Health OS',
    kind: 'live',
    accent: '#00E5FF',
    src: '/prototypes/command/index.html',
    build: 'Claude Design',
  },
  {
    id: 'quest',
    name: 'Spine Quest',
    tagline: 'Spine health, leveled up',
    category: 'Gamified Health',
    kind: 'live',
    accent: '#7C83FF',
    src: '/prototypes/quest/index.html',
    build: 'Claude Design',
  },
  {
    id: 'spineos',
    name: 'SpineOS',
    tagline: 'A clearer picture of your back health',
    category: 'Clinical',
    kind: 'live',
    accent: '#0E7C86',
    appTheme: 'light',
    src: '/prototypes/drspine/index.html',
    build: 'Claude Design',
  },
  {
    id: 'spineiq',
    name: 'SpineIQ',
    tagline: 'Spine health, as a quest',
    category: 'Health',
    kind: 'live',
    accent: '#c084fc',
    src: 'https://chiragpatil99.github.io/spineiq-v2/',
    build: 'Live · GitHub Pages',
  },
  {
    id: 'spine3d',
    name: 'Spine 3D',
    tagline: 'A real spine that bends with your posture',
    category: 'WebGL · 3D',
    kind: 'live',
    accent: '#5fd0ff',
    src: '/prototypes/spine3d/index.html',
    build: 'Three.js · interactive',
  },
  {
    id: 'spinelab',
    name: 'Spine Lab',
    tagline: 'X-ray vision for your spine health',
    category: 'X-ray Lab',
    kind: 'live',
    accent: '#38bdf8',
    src: '/prototypes/spinelab/index.html',
    hideStatusBar: true,
    build: 'Claude Design',
  },
]

export const STUDIO = {
  name: 'Spine',
  kicker: 'Venture Studio',
  subtitle: 'Live Prototype Lab',
}

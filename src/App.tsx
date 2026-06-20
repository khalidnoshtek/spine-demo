import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { PROTOTYPES, STUDIO, type Prototype } from './data/prototypes'
import { BASE_H, BASE_W, PhoneFrame } from './components/PhoneFrame'

/** Explicit 5-column placement. Flagship is a 2×2 block; the other six fill the rest exactly. */
const POS: Record<string, { col: string; row: string }> = {
  spineverse: { col: '1 / 3', row: '1 / 3' },
  pulse: { col: '3', row: '1' },
  loop: { col: '4', row: '1' },
  nest: { col: '5', row: '1' },
  drift: { col: '3', row: '2' },
  bloom: { col: '4', row: '2' },
  vault: { col: '5', row: '2' },
}

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

export default function App() {
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [rects, setRects] = useState<Record<string, Rect>>({})
  const [vp, setVp] = useState({ w: 1280, h: 800 })

  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const gridRef = useRef<HTMLDivElement | null>(null)

  // Measure slot geometry (viewport coords — phone layer is fixed) on layout + resize + scroll.
  const measure = useCallback(() => {
    const next: Record<string, Rect> = {}
    for (const p of PROTOTYPES) {
      const el = slotRefs.current[p.id]
      if (!el) continue
      const r = el.getBoundingClientRect()
      next[p.id] = { left: r.left, top: r.top, width: r.width, height: r.height }
    }
    setRects(next)
    setVp({ w: window.innerWidth, h: window.innerHeight })
  }, [])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (gridRef.current) ro.observe(gridRef.current)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [measure])

  // Esc closes focus; lock scroll while a phone is expanded.
  useEffect(() => {
    if (!focusedId) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFocusedId(null)
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [focusedId])

  // Compute the transform target for a phone given current focus state.
  const targetFor = (p: Prototype) => {
    const r = rects[p.id]
    if (focusedId === p.id) {
      const scale = Math.min((vp.h * 0.8) / BASE_H, (vp.w * 0.46) / BASE_W)
      return {
        x: (vp.w - BASE_W * scale) / 2,
        y: (vp.h - BASE_H * scale) / 2,
        scale,
        opacity: 1,
        zIndex: 70,
      }
    }
    if (!r) return { x: 0, y: 0, scale: 0.3, opacity: 0, zIndex: 1 }
    const scale = r.width / BASE_W
    return {
      x: r.left + (r.width - BASE_W * scale) / 2,
      y: r.top + (r.height - BASE_H * scale) / 2,
      scale,
      opacity: focusedId ? 0 : 1,
      zIndex: 1,
    }
  }

  return (
    <div className="studio-bg studio-grid relative min-h-screen w-full overflow-hidden">
      <Header />

      {/* Layout placeholders — define where phones live. Phones themselves are in the fixed layer below. */}
      <main className="mx-auto max-w-[1080px] px-8 pb-8">
        <div
          ref={gridRef}
          className="grid grid-cols-5 gap-x-5 gap-y-12"
          style={{ gridAutoRows: 'min-content' }}
        >
          {PROTOTYPES.map((p) => (
            <div
              key={p.id}
              ref={(el) => {
                slotRefs.current[p.id] = el
              }}
              onClick={() => setFocusedId(p.id)}
              className="group relative cursor-pointer"
              style={{
                gridColumn: POS[p.id].col,
                gridRow: POS[p.id].row,
                aspectRatio: `${BASE_W} / ${BASE_H}`,
              }}
            >
              {p.featured && (
                <div
                  className="flagship-glow pointer-events-none absolute -inset-10 -z-10 rounded-[80px] transition-opacity duration-300"
                  style={{
                    opacity: focusedId ? 0 : undefined,
                    background:
                      'radial-gradient(60% 55% at 50% 45%, rgba(99,102,241,.35), rgba(168,85,247,.18) 45%, transparent 72%)',
                    filter: 'blur(26px)',
                  }}
                />
              )}
              <Caption p={p} dimmed={!!focusedId} />
            </div>
          ))}
        </div>
      </main>

      {/* Dim / blur backdrop when a phone is focused */}
      <AnimatePresence>
        {focusedId && (
          <motion.div
            className="fixed inset-0 z-20"
            style={{ background: 'rgba(4,5,9,.72)', backdropFilter: 'blur(14px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            onClick={() => setFocusedId(null)}
          />
        )}
      </AnimatePresence>

      {/* Persistent phone layer — mounted once, never re-keyed, so iframes never reload */}
      <div className="pointer-events-none fixed inset-0 z-30">
        {PROTOTYPES.map((p) => {
          const t = targetFor(p)
          const isFocused = focusedId === p.id
          return (
            <motion.div
              key={p.id}
              className="absolute left-0 top-0"
              style={{
                transformOrigin: 'top left',
                pointerEvents: isFocused ? 'auto' : 'none',
                zIndex: t.zIndex,
              }}
              initial={false}
              animate={{ x: t.x, y: t.y, scale: t.scale, opacity: t.opacity }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 30,
                opacity: { duration: 0.28 },
              }}
            >
              <FloatWrap id={p.id} active={!focusedId}>
                <PhoneFrame p={p} focused={isFocused} />
              </FloatWrap>
            </motion.div>
          )
        })}
      </div>

      <FocusChrome
        p={PROTOTYPES.find((x) => x.id === focusedId) ?? null}
        onClose={() => setFocusedId(null)}
      />
    </div>
  )
}

/** Gentle ambient float on idle tiles (separate element so it never fights the layout transform). */
function FloatWrap({
  id,
  active,
  children,
}: {
  id: string
  active: boolean
  children: React.ReactNode
}) {
  // Deterministic per-id offset so tiles don't bob in unison.
  const seed = id.charCodeAt(0) + id.charCodeAt(id.length - 1)
  const dur = 6 + (seed % 4)
  const delay = (seed % 7) * 0.4
  return (
    <motion.div
      animate={active ? { y: [0, -8, 0] } : { y: 0 }}
      transition={
        active
          ? { duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.3 }
      }
    >
      {children}
    </motion.div>
  )
}

function Header() {
  return (
    <header className="relative z-10 mx-auto flex max-w-[1080px] items-center justify-between px-8 pb-6 pt-6">
      <div className="flex items-center gap-3.5">
        <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2v20M7 5v14M17 5v14M3 9v6M21 9v6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[19px] font-bold tracking-tight text-white">{STUDIO.name}</h1>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/50">
              {STUDIO.kicker}
            </span>
          </div>
          <p className="text-[12.5px] text-white/40">{STUDIO.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-5 text-[13px] text-white/45">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {PROTOTYPES.length} prototypes live
        </span>
        <span className="hidden h-4 w-px bg-white/10 sm:block" />
        <span className="hidden sm:block">Q2 · Portfolio Review</span>
      </div>
    </header>
  )
}

/** Name / tagline shown beneath each phone in the grid. */
function Caption({ p, dimmed }: { p: Prototype; dimmed: boolean }) {
  return (
    <div
      className="pointer-events-none absolute -bottom-7 left-0 right-0 flex items-center justify-between transition-opacity duration-300"
      style={{ opacity: dimmed ? 0 : 1 }}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-[14px] font-semibold text-white/90">{p.name}</span>
          {p.featured && (
            <span className="flagship-glow rounded-full bg-gradient-to-r from-indigo-500/30 to-fuchsia-500/30 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-indigo-200 ring-1 ring-inset ring-indigo-400/30">
              Flagship
            </span>
          )}
        </div>
        <div className="truncate text-[11.5px] text-white/35">{p.category}</div>
      </div>
      <span
        className="h-1.5 w-1.5 flex-none rounded-full"
        style={{ background: p.accent, boxShadow: `0 0 8px ${p.accent}` }}
      />
    </div>
  )
}

/** Floating label + close affordances shown while a phone is focused. */
function FocusChrome({ p, onClose }: { p: Prototype | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {p && (
        <>
          <motion.button
            onClick={onClose}
            className="fixed right-7 top-7 z-[80] grid h-11 w-11 place-items-center rounded-full bg-white/8 text-white/70 ring-1 ring-white/15 backdrop-blur hover:bg-white/15 hover:text-white"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.button>

          <motion.div
            className="fixed bottom-9 left-1/2 z-[80] -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ delay: 0.12 }}
          >
            <div className="flex items-center justify-center gap-2.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: p.accent, boxShadow: `0 0 10px ${p.accent}` }}
              />
              <h2 className="text-[19px] font-semibold text-white">{p.name}</h2>
              {p.featured && (
                <span className="rounded-full bg-gradient-to-r from-indigo-500/30 to-fuchsia-500/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-200 ring-1 ring-inset ring-indigo-400/30">
                  Flagship
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[13px] text-white/55">{p.tagline}</p>
            <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-white/35">
              <span className="rounded-full border border-white/10 px-2.5 py-1">{p.category}</span>
              {p.build && <span className="rounded-full border border-white/10 px-2.5 py-1">{p.build}</span>}
              <span className="text-white/25">Esc to close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

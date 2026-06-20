import { useEffect, useRef, useState } from 'react'
import type { Prototype } from '../data/prototypes'
import { StatusBar } from './StatusBar'

/** Native render geometry. Prototypes are authored at 390×844; the bezel adds 13px all round. */
export const SCREEN_W = 390
export const SCREEN_H = 844
export const BEZEL = 13
export const BASE_W = SCREEN_W + BEZEL * 2 // 416
export const BASE_H = SCREEN_H + BEZEL * 2 // 870

interface Props {
  p: Prototype
  /** true when this phone is the expanded, interactive one */
  focused: boolean
}

/**
 * One device. The iframe / video mounts once and stays mounted (pre-warm) so the
 * grid is alive on load and expanding never reloads it. Emulator tiles are the
 * exception: they show a poster in the grid and only boot the iframe on focus.
 */
export function PhoneFrame({ p, focused }: Props) {
  const [loaded, setLoaded] = useState(false)
  // Emulator: once booted in focus, keep the iframe for this focus session.
  const [booted, setBooted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (p.kind === 'emulator') {
      if (focused) setBooted(true)
      else {
        setBooted(false)
        setLoaded(false)
      }
    }
  }, [focused, p.kind])

  // Keep autoplay alive even if the browser pauses a backgrounded video.
  useEffect(() => {
    if (p.kind !== 'video') return
    const v = videoRef.current
    if (v) v.play().catch(() => {})
  }, [p.kind, loaded])

  const interactive = focused
  const showIframe = p.kind === 'live' || (p.kind === 'emulator' && booted)

  return (
    <div
      className="relative rounded-[58px] bg-[#0c0e14]"
      style={{
        width: BASE_W,
        height: BASE_H,
        boxShadow:
          '0 2px 2px rgba(255,255,255,.06) inset, 0 -2px 6px rgba(0,0,0,.6) inset, 0 40px 80px -30px rgba(0,0,0,.9)',
        padding: BEZEL,
      }}
    >
      {/* metallic rim */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[58px]"
        style={{
          background:
            'linear-gradient(145deg, rgba(255,255,255,.10), transparent 30%, transparent 70%, rgba(255,255,255,.05))',
          WebkitMaskImage:
            'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: 1.5,
        }}
      />

      {/* screen */}
      <div
        className="relative overflow-hidden rounded-[45px] bg-black"
        style={{ width: SCREEN_W, height: SCREEN_H }}
      >
        {/* ---- content by kind ---- */}
        {showIframe && (
          <iframe
            title={p.name}
            src={p.src}
            width={SCREEN_W}
            height={SCREEN_H}
            scrolling="no"
            loading="eager"
            onLoad={() => setLoaded(true)}
            style={{
              border: 0,
              display: 'block',
              pointerEvents: interactive ? 'auto' : 'none',
            }}
          />
        )}

        {p.kind === 'video' && (
          <video
            ref={videoRef}
            src={p.video}
            poster={p.poster}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setLoaded(true)}
            width={SCREEN_W}
            height={SCREEN_H}
            style={{ objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
          />
        )}

        {/* Emulator poster shown in the grid (and under the booting iframe) */}
        {p.kind === 'emulator' && (
          <EmulatorPoster p={p} booting={focused && !loaded} hidden={booted && loaded} />
        )}

        {/* loading shimmer until first paint (skip for emulator poster, which is itself content) */}
        {!loaded && p.kind !== 'emulator' && (
          <div className="shimmer absolute inset-0" style={{ background: '#0a0c12' }}>
            <div className="absolute inset-0 shimmer" />
          </div>
        )}

        <StatusBar accent={p.accent} />
      </div>
    </div>
  )
}

/** Static, ambient poster for emulator tiles — no Appetize boot in the grid. */
function EmulatorPoster({
  p,
  booting,
  hidden,
}: {
  p: Prototype
  booting: boolean
  hidden: boolean
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500"
      style={{
        opacity: hidden ? 0 : 1,
        background: `radial-gradient(120% 60% at 50% 0%, ${p.accent}33, transparent 60%), #08070a`,
      }}
    >
      <div
        className="mb-5 grid h-20 w-20 place-items-center rounded-[22px] text-3xl font-bold"
        style={{ background: `linear-gradient(135deg, ${p.accent}, #fb923c)`, color: '#1a0d03' }}
      >
        {p.name[0]}
      </div>
      <div className="text-lg font-semibold text-white">{p.name}</div>
      <div className="mt-1 text-xs text-white/45">{p.platform}</div>

      {booting ? (
        <div className="mt-6 flex items-center gap-2 text-xs text-white/60">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
          Booting emulator…
        </div>
      ) : (
        <div
          className="mt-6 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
          style={{ background: `${p.accent}22`, color: p.accent }}
        >
          ▸ Tap to launch native build
        </div>
      )}
    </div>
  )
}

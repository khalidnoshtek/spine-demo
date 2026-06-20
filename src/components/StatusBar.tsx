/** Mock iOS-style status bar overlaid on every phone screen. */
export function StatusBar({ accent }: { accent: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[44px] items-center justify-between px-[26px] text-white">
      <span className="text-[14px] font-semibold tracking-tight tabular-nums">9:41</span>
      <span
        className="absolute left-1/2 top-[9px] h-[26px] w-[88px] -translate-x-1/2 rounded-full bg-black"
        aria-hidden
      />
      <span className="flex items-center gap-[5px]">
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={i * 4.5}
              y={8 - i * 2.4}
              width="3"
              height={3 + i * 2.4}
              rx="0.8"
              fill="white"
              opacity={i === 3 ? 0.4 : 1}
            />
          ))}
        </svg>
        {/* wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="white">
          <path d="M8 2.2c2.5 0 4.8.95 6.5 2.5l-1.3 1.4A7.3 7.3 0 0 0 8 4.1 7.3 7.3 0 0 0 2.8 6.1L1.5 4.7A9.4 9.4 0 0 1 8 2.2Z" />
          <path d="M8 5.6c1.5 0 2.9.57 3.9 1.5l-1.4 1.5A3.5 3.5 0 0 0 8 7.5c-.95 0-1.8.37-2.5.95L4.1 7C5.1 6.1 6.5 5.6 8 5.6Z" />
          <circle cx="8" cy="9.6" r="1.2" />
        </svg>
        {/* battery */}
        <span className="flex items-center gap-[2px]">
          <span className="relative h-[11px] w-[23px] rounded-[3px] border border-white/50 p-[1.5px]">
            <span
              className="block h-full w-[78%] rounded-[1.5px]"
              style={{ background: accent }}
            />
          </span>
          <span className="h-[4px] w-[1.5px] rounded-r-sm bg-white/50" />
        </span>
      </span>
    </div>
  )
}

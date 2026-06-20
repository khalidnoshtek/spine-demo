# Spine · Live Prototype Lab

A desktop dashboard whose tiles are **live phone prototypes**. Every tile runs
for real at small scale; click one and it expands into a fully interactive
device with a smooth shared-element transition. Built for portfolio reviews and
demos.

```bash
npm install
npm run dev      # http://localhost:5173
```

## How it works

### The persistent phone layer

The trickiest requirement — *"the same iframe instance should animate up into
focus mode, don't reload it on expand"* — drives the architecture.

- Every phone is mounted **once** in a single fixed layer ([`App.tsx`](src/App.tsx))
  and **never re-keyed or unmounted**. The grid itself is just invisible
  placeholder slots that define geometry.
- On each layout/resize/scroll we measure the slots and animate each phone's
  `x / y / scale` (pure transforms, GPU-cheap) to either its grid slot or the
  focus center. Because the DOM node never moves in the React tree, the iframe
  inside it never reloads.
- Focus expand/collapse is a spring on those same transforms; non-focused
  phones fade to `opacity: 0` behind a blurred backdrop.

### Three tile kinds ([`prototypes.ts`](src/data/prototypes.ts))

| kind | grid behavior | focus behavior |
| --- | --- | --- |
| `live` | real `<iframe>` rendered at native 390 px, scaled into the bezel via `transform` (stays crisp); **pre-warmed on load** | becomes interactive (`pointer-events`) |
| `video` | muted autoplay loop, pre-warmed | same loop, larger |
| `emulator` | **poster only — no iframe** (multiple live emulators would choke) | boots the iframe lazily on expand, seamless swap from the poster |

Every tile shows a shimmer until first paint, a mock status bar, and a gentle
ambient float.

## Swapping in your own prototypes

Everything is data-driven. Edit [`src/data/prototypes.ts`](src/data/prototypes.ts):

- **Live**: point `src` at any URL authored for a 390 px-wide viewport
  (the bundled examples live in [`public/prototypes/`](public/prototypes)).
- **Video**: drop an MP4 + poster in `public/videos/` and set `video` / `poster`.
- **Emulator**: set `src` to your Appetize embed URL (it only mounts on focus).
- Grid placement is the `POS` map in [`App.tsx`](src/App.tsx) (5 columns; the
  flagship is a 2×2 block). The studio name lives in the `STUDIO` export.

## Stack

Vite · React 19 · TypeScript · Tailwind v4 · Motion (Framer Motion).

> `scripts/shoot.mjs` is a dev-only Puppeteer harness used to screenshot and
> exercise focus mode during development — not part of the app.

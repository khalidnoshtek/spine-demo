/* Spine Command Center — theme context + shared helpers */

window.ThemeCtx = React.createContext(null);
window.useT = () => React.useContext(window.ThemeCtx);

// merge an accent override into a base theme
window.applyAccent = (theme, accent) => {
  if (!accent) return theme;
  return { ...theme, ...accent, ringGlow: accent.accent };
};

// number formatting
window.fmt = (n) => n.toLocaleString('en-US');
window.clamp = (n, a, b) => Math.max(a, Math.min(b, n));

// describe a 0–100 score band
window.scoreBand = (v) => {
  if (v >= 85) return 'Excellent';
  if (v >= 70) return 'Good';
  if (v >= 55) return 'Fair';
  if (v >= 40) return 'Watch';
  return 'At risk';
};

// reusable count-up hook (animates a number toward target on mount/change)
window.useCountUp = (target, ms = 900) => {
  const [v, setV] = React.useState(target);
  const prev = React.useRef(target);
  React.useEffect(() => {
    const from = prev.current, to = target, start = performance.now();
    let raf;
    const tick = (now) => {
      const p = window.clamp((now - start) / ms, 0, 1);
      const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setV(from + (to - from) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
};

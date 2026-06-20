/* Spine Command Center — line-icon set. Single <Icon name size color stroke/> API.
   Icons are 24x24 viewBox, currentColor stroke. */

function Icon({ name, size = 24, color = 'currentColor', sw = 1.8, style = {}, fill = false }) {
  const p = { fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    // nav
    home: <><path {...p} d="M3 10.5 12 4l9 6.5"/><path {...p} d="M5 9.5V20h14V9.5"/></>,
    shield: <><path {...p} d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z"/></>,
    watch: <><rect {...p} x="7" y="7" width="10" height="10" rx="3"/><path {...p} d="M9 7l.5-3h5L15 7M9 17l.5 3h5l.5-3"/><path {...p} d="M12 10v2.5l1.5 1"/></>,
    trophy: <><path {...p} d="M7 4h10v3a5 5 0 0 1-10 0V4z"/><path {...p} d="M7 5H4v1a3 3 0 0 0 3 3M17 5h3v1a3 3 0 0 1-3 3"/><path {...p} d="M12 12v4M9 20h6M10 16h4"/></>,
    spark: <><path {...p} d="M12 3v4M12 17v4M5 12H1M23 12h-4"/><circle {...p} cx="12" cy="12" r="3.2"/></>,
    // metrics
    steps: <><path {...p} d="M8 20c-1.5 0-2.5-1.2-2.5-3 0-2 1-3.5 1-5.5S5 8 7 8s2.5 2 2.5 4-.5 8-1.5 8z"/><path {...p} d="M16 16c1.5 0 2.5-1.2 2.5-3 0-2-1-3-1-5s.5-4-1.5-4-2.5 2-2.5 4 .5 8 2.5 8z"/></>,
    heart: <><path {...p} d="M12 20s-7-4.3-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.7 12 20 12 20z"/></>,
    flame: <><path {...p} d="M12 3c1 3-2 4-2 7a2 2 0 0 0 4 0c0-1-.5-2-.5-2 2 1.5 3 3.5 3 5.5a4.5 4.5 0 0 1-9 0C7.5 8 12 7 12 3z"/></>,
    moon: <><path {...p} d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/></>,
    stand: <><circle {...p} cx="12" cy="4.5" r="1.8"/><path {...p} d="M12 7v6M12 13l-3 7M12 13l3 7M8 9h8"/></>,
    lungs: <><path {...p} d="M12 4v7M9 8c0 2-3 3-3 6s1 5 3 5 2-2 2-4V8M15 8c0 2 3 3 3 6s-1 5-3 5-2-2-2-4V8"/></>,
    // coach / misc
    bolt: <><path {...p} d="M13 3 5 13h6l-1 8 8-10h-6l1-8z"/></>,
    chat: <><path {...p} d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-1-2V6z"/></>,
    coin: <><circle {...p} cx="12" cy="12" r="8"/><path {...p} d="M12 8v8M9.5 9.5h3.5a1.5 1.5 0 0 1 0 3H10a1.5 1.5 0 0 0 0 3h3.5"/></>,
    gift: <><rect {...p} x="4" y="9" width="16" height="11" rx="1.5"/><path {...p} d="M4 13h16M12 9v11M12 9S10.5 4 8 5s1 4 4 4M12 9s1.5-5 4-4-1 4-4 4"/></>,
    crown: <><path {...p} d="M4 8l3 8h10l3-8-5 3.5L12 5 9 11.5 4 8z"/></>,
    report: <><rect {...p} x="5" y="3" width="14" height="18" rx="2"/><path {...p} d="M9 8h6M9 12h6M9 16h4"/></>,
    tag: <><path {...p} d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9z"/><circle {...p} cx="8" cy="8" r="1.3"/></>,
    medal: <><circle {...p} cx="12" cy="14" r="5"/><path {...p} d="M9 9 7 3h10l-2 6M12 12v4M10.5 13.5l3 1"/></>,
    stethoscope: <><path {...p} d="M6 4v5a4 4 0 0 0 8 0V4M6 4H4M14 4h2M10 17v-4M10 17a4 4 0 0 0 8 0v-2"/><circle {...p} cx="19" cy="9" r="2"/></>,
    spine: <><path {...p} d="M12 3v18"/><path {...p} d="M12 5h4M12 8.5h4M12 12h4M12 15.5H8M12 19H8M12 5H8M12 12H8"/></>,
    trend: <><path {...p} d="M4 16l5-5 3 3 6-7"/><path {...p} d="M18 7h-4M18 7v4"/></>,
    pulse: <><path {...p} d="M3 12h4l2-6 4 12 2-6h6"/></>,
    plus: <><path {...p} d="M12 6v12M6 12h12"/></>,
    check: <><path {...p} d="M5 12.5 10 17l9-10"/></>,
    chevR: <><path {...p} d="M9 5l7 7-7 7"/></>,
    arrowUp: <><path {...p} d="M12 19V5M6 11l6-6 6 6"/></>,
    arrowDn: <><path {...p} d="M12 5v14M6 13l6 6 6-6"/></>,
    sync: <><path {...p} d="M4 12a8 8 0 0 1 13.5-5.5L20 9M20 4v5h-5"/><path {...p} d="M20 12a8 8 0 0 1-13.5 5.5L4 15M4 20v-5h5"/></>,
    clock: <><circle {...p} cx="12" cy="12" r="8"/><path {...p} d="M12 8v4.5l3 1.5"/></>,
    fire: <><path {...p} d="M12 3c1 3-2 4-2 7a2 2 0 0 0 4 0c0-1-.5-2-.5-2 2 1.5 3 3.5 3 5.5a4.5 4.5 0 0 1-9 0C7.5 8 12 7 12 3z"/></>,
    send: <><path {...p} d="M4 12 20 4l-7 16-2.5-6.5L4 12z"/></>,
    info: <><circle {...p} cx="12" cy="12" r="8"/><path {...p} d="M12 11v5M12 8h.01"/></>,
    target: <><circle {...p} cx="12" cy="12" r="8"/><circle {...p} cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.4" fill={color}/></>,
    lock: <><rect {...p} x="5" y="11" width="14" height="9" rx="2"/><path {...p} d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0, ...style }}>
      {paths[name] || null}
    </svg>
  );
}

window.Icon = Icon;

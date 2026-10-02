// The manoeuvres page. For each evolution in RIGDATA.MANOEUVRES this builds a
// step-through inside <section data-manoeuvre="id">: a drawing of the ship
// from above that follows the orders, the ship's track, the current order
// with what is hauled and let go, and a deck plan (the shared RIGFIG engine)
// that picks out the lines being worked.
//
// The drawing keeps the wind at the top. Whether a sail is full, shivering or
// aback is worked out from the wind and the angle of its yard, so the picture
// cannot disagree with the geometry; a step may override it (`force`) where
// the sources say a sail is becalmed by another.

(function () {
  const R = window.RIGDATA;
  const LIST = R.MANOEUVRES || [];
  const NS = 'http://www.w3.org/2000/svg';
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');

  function el(name, attrs, parent) {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function html(tag, cls, inner, parent) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (inner != null) e.innerHTML = inner;
    if (parent) parent.appendChild(e);
    return e;
  }
  const rad = (d) => (d * Math.PI) / 180;
  const lerp = (a, b, t) => a + (b - a) * t;
  const norm = (d) => ((((d + 180) % 360) + 360) % 360) - 180;
  const f1 = (n) => Math.round(n * 10) / 10;

  // ---- The ship from above ------------------------------------------------
  // Local coordinates are feet: x to starboard, y aft, with the origin 60 ft
  // abaft the stem so that the jibboom and the driver boom swing inside the
  // same circle.
  const OX = 60;
  const MAST_Y = { fore: R.MASTS.fore.x - OX, main: R.MASTS.main.x - OX, mizen: R.MASTS.mizen.x - OX };
  const TIER = [
    { key: 'course', half: 'yardHalf', depth: 17, w: 2.4 },
    { key: 'topsail', half: 'tyHalf', depth: 13, w: 1.8 },
    { key: 'topgallant', half: 'tgHalf', depth: 9, w: 1.3 },
    { key: 'royal', half: 'ryHalf', depth: 6, w: 1 },
  ];
  const SQUARE = [];
  for (const mast of ['fore', 'main', 'mizen']) {
    TIER.forEach((t, i) => {
      const id = mast === 'mizen' && i === 0 ? 'crossjack' : mast + '-' + t.key;
      SQUARE.push({ id, mast, tier: i, half: R.MASTS[mast][t.half], depth: t.depth, w: t.w, bare: id === 'crossjack' });
    });
  }
  // Fore-and-aft sails: tack (forward end of the foot), the after end of the
  // luff as seen from above, length of the foot, and the angle the foot makes
  // with the keel when sheeted.
  const FA = [
    { id: 'jib', name: 'Jib', tack: -130, head: -44, foot: 56, a: 13 },
    { id: 'fore-topmast-staysail', name: 'Fore topmast staysail', tack: -100, head: -42, foot: 40, a: 13 },
    { id: 'staysails', name: 'Main staysails', tack: -34, head: 34, foot: 50, a: 12 },
    { id: 'mizen-staysail', name: 'Mizen staysail', tack: 42, head: 88, foot: 36, a: 12 },
    { id: 'mizen', name: 'Mizen', tack: 91, head: 91, foot: 42, a: 16, boom: true },
  ];
  const EDGE = Math.sin(rad(6)); // a sail within 6° of edge-on to the wind shivers

  const BREADTH = R.G.breadth;
  function hullPath() {
    const pts = BREADTH.map(([x, b]) => [b, x - OX]).concat(BREADTH.slice(1).reverse().map(([x, b]) => [-b, x - OX]));
    const n = pts.length;
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += ` C ${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
    }
    return d + ' Z';
  }
  const HULL = hullPath();

  function yardAngle(state, sq) {
    const y = state.yards || {};
    return y[sq.id] != null ? y[sq.id] : y[sq.mast] || 0;
  }

  // Everything the drawing needs, as numbers that can be blended.
  function frameOf(state) {
    const rel = state.heading - state.wind;
    const theta = norm(-rel);
    const yards = {};
    for (const sq of SQUARE) yards[sq.id] = yardAngle(state, sq);
    const fa = {};
    for (const s of FA) {
      const mode = (state.sails || {})[s.id] || 'in';
      const lee = theta >= 0 ? -1 : 1;
      let a = 0;
      if (mode === 'starboard') a = s.a;
      else if (mode === 'larboard') a = -s.a;
      else if (mode === 'flat') a = 4 * lee;
      else if (mode === 'fly') a = Math.max(-75, Math.min(75, -theta));
      fa[s.id] = { mode, a };
    }
    return { rel, yards, fa, rudder: state.rudder || 0, state };
  }

  function blend(a, b, t) {
    const yards = {}, fa = {};
    for (const k in b.yards) yards[k] = lerp(a.yards[k], b.yards[k], t);
    const late = t >= 0.5;
    for (const k in b.fa) {
      const moving = a.fa[k].mode !== 'in' && b.fa[k].mode !== 'in';
      fa[k] = { mode: (late ? b : a).fa[k].mode, a: moving ? lerp(a.fa[k].a, b.fa[k].a, t) : (late ? b : a).fa[k].a };
    }
    return { rel: lerp(a.rel, b.rel, t), yards, fa, rudder: lerp(a.rudder, b.rudder, t), state: (late ? b : a).state };
  }

  // How a square sail stands: 'full', 'shiver', 'aback', 'becalmed', 'hung'
  // (loosed or clewed up, hanging in its gear) or 'in'.
  function squareFill(fr, sq) {
    const st = fr.state;
    const set = (st.sails || {})[sq.id] || 'in';
    if (sq.bare || set === 'in' || set === 'hung') return { fill: sq.bare ? 'in' : set, d: 0 };
    const d = -Math.cos(rad(norm(-fr.rel) + fr.yards[sq.id]));
    const forced = (st.force || {})[sq.id];
    if (forced) return { fill: forced, d };
    return { fill: d > EDGE ? 'full' : d < -EDGE ? 'aback' : 'shiver', d };
  }
  function faFill(fr, s) {
    const f = fr.fa[s.id];
    if (f.mode === 'in') return 'in';
    if (f.mode === 'fly') return 'shiver';
    const forced = (fr.state.force || {})[s.id];
    if (forced) return forced;
    const deg = norm(-fr.rel), th = rad(deg), a = rad(f.a), side = f.a >= 0 ? 1 : -1;
    const d = (-Math.sin(th) * Math.cos(a) - Math.cos(th) * Math.sin(a)) * side;
    // With the wind nearly ahead a fore-and-aft sail only shakes; it is aback
    // when the wind is well on the side its sheet is hauled to.
    return d > EDGE ? 'full' : deg * side > 10 ? 'aback' : 'shiver';
  }

  function wavy(ax, ay, bx, by, amp, n) {
    const dx = (bx - ax) / n, dy = (by - ay) / n, len = Math.hypot(bx - ax, by - ay) || 1;
    const nx = (-(by - ay) / len) * amp, ny = ((bx - ax) / len) * amp;
    let d = `M ${f1(ax)} ${f1(ay)}`;
    for (let i = 0; i < n; i++) {
      const s = i % 2 ? -1 : 1;
      d += ` Q ${f1(ax + dx * (i + 0.5) + nx * s)} ${f1(ay + dy * (i + 0.5) + ny * s)} ${f1(ax + dx * (i + 1))} ${f1(ay + dy * (i + 1))}`;
    }
    return d;
  }

  function drawShip(g, over, fr) {
    g.replaceChildren();
    over.replaceChildren();
    g.setAttribute('transform', `rotate(${f1(fr.rel)})`);
    const st = fr.state;

    el('path', { d: HULL, class: 'hull' }, g);
    for (const x of [R.G.forecastleAft, R.G.quarterdeckFore, R.G.poopFore]) el('line', { x1: -20, y1: x - OX, x2: 20, y2: x - OX, class: 'deck' }, g);
    el('line', { x1: 0, y1: 4 - OX, x2: 0, y2: -40 - OX, class: 'sparline', 'stroke-width': 2.4 }, g);
    el('line', { x1: 0, y1: -27 - OX, x2: 0, y2: -72 - OX, class: 'sparline', 'stroke-width': 1.1 }, g);

    // Rudder and tiller turn as one piece about the stern-post.
    const helm = el('g', { transform: `translate(0 ${188 - OX + 1.5}) rotate(${f1(-fr.rudder)})` }, g);
    el('line', { x1: 0, y1: 0, x2: 0, y2: -26, class: 'mv-tiller' }, helm);
    el('line', { x1: 0, y1: 0, x2: 0, y2: 14, class: 'mv-rudder' }, helm);

    // Headway or sternway: an arrow alongside.
    if (st.way === 'ahead' || st.way === 'slow' || st.way === 'astern') {
      const len = st.way === 'ahead' ? 44 : 24, dir = st.way === 'astern' ? 1 : -1, x = -30;
      const y0 = 62 - (dir < 0 ? 0 : len), y1 = y0 + dir * len;
      el('line', { x1: x, y1: y0, x2: x, y2: y1, class: 'mv-way' }, g);
      el('path', { d: `M ${x - 4} ${y1 - dir * 7} L ${x} ${y1} L ${x + 4} ${y1 - dir * 7}`, class: 'mv-way' }, g);
    }

    // Fore-and-aft sails.
    for (const s of FA) {
      const f = fr.fa[s.id];
      const a = rad(f.a), cx = Math.sin(a) * s.foot, cy = s.tack + Math.cos(a) * s.foot;
      if (s.boom) el('line', { x1: 0, y1: s.tack, x2: f1(f.mode === 'in' ? 0 : cx), y2: f1(f.mode === 'in' ? s.tack + s.foot : cy), class: 'sparline', 'stroke-width': 1.2 }, g);
      if (f.mode === 'in') continue;
      const fill = faFill(fr, s);
      if (f.mode === 'fly' || fill === 'shiver') {
        el('path', { d: wavy(0, s.tack, cx, cy, f.mode === 'fly' ? 3 : 1.8, 7), class: 'mv-sail shiver' }, g);
        continue;
      }
      const side = (f.a >= 0 ? 1 : -1) * (fill === 'aback' ? -1 : 1);
      const belly = 7 * side;
      const mx = cx / 2 + Math.cos(a) * belly, my = (s.tack + cy) / 2 - Math.sin(a) * belly;
      el('path', { d: `M 0 ${s.tack} Q ${f1(mx)} ${f1(my)} ${f1(cx)} ${f1(cy)} L 0 ${s.head} Z`, class: 'mv-sail fa ' + fill }, g);
    }

    // Square sails: cloth first, lowest and widest underneath, then the yards.
    for (const mast of ['fore', 'main', 'mizen']) {
      const my = MAST_Y[mast];
      const own = SQUARE.filter((q) => q.mast === mast);
      const end = (sq, k) => {
        const b = rad(fr.yards[sq.id]);
        return [Math.cos(b) * k, my - Math.sin(b) * k];
      };
      for (const sq of own) {
        const { fill, d } = squareFill(fr, sq);
        if (fill === 'in') continue;
        const b = rad(fr.yards[sq.id]), h = sq.half * 0.93;
        const [bx, by] = end(sq, h), [ax, ay] = end(sq, -h);
        if (fill === 'hung') { el('line', { x1: f1(ax), y1: f1(ay), x2: f1(bx), y2: f1(by), class: 'mv-hung', 'stroke-width': sq.w + 2.6 }, g); continue; }
        if (fill === 'shiver') { el('path', { d: wavy(ax, ay, bx, by, 2.6, 8), class: 'mv-sail shiver' }, g); continue; }
        let depth = fill === 'becalmed' ? 2.2 : sq.depth * (0.5 + 0.5 * Math.min(1, Math.abs(d) / 0.6)) * (fill === 'aback' ? -0.62 : 1);
        if (fill === 'becalmed') depth *= d < 0 ? -1 : 1;
        const qx = -Math.sin(b) * depth * 2, qy = my - Math.cos(b) * depth * 2;
        el('path', { d: `M ${f1(ax)} ${f1(ay)} Q ${f1(qx)} ${f1(qy)} ${f1(bx)} ${f1(by)} Z`, class: 'mv-sail ' + fill }, g);
      }
      for (const sq of own) {
        const [bx, by] = end(sq, sq.half), [ax, ay] = end(sq, -sq.half);
        el('line', { x1: f1(ax), y1: f1(ay), x2: f1(bx), y2: f1(by), class: 'sparline', 'stroke-width': sq.w }, g);
      }
      el('circle', { cx: 0, cy: my, r: mast === 'mizen' ? 1.6 : 2.2, class: 'spar' }, g);
    }

    // The cable, when she is at anchor, leads up to windward from the bows.
    if (st.anchor) {
      const r = rad(fr.rel), hx = st.anchor === 'larboard' ? -8 : st.anchor === 'starboard' ? 8 : 0, hy = -50;
      const x = hx * Math.cos(r) - hy * Math.sin(r), y = hx * Math.sin(r) + hy * Math.cos(r);
      el('line', { x1: f1(x), y1: f1(y), x2: f1(x * 0.4), y2: -150, class: 'mv-cable' }, over);
    }
  }

  // ---- Words for the readout ----------------------------------------------
  const POINTS = ['N', 'N by E', 'NNE', 'NE by N', 'NE', 'NE by E', 'ENE', 'E by N', 'E', 'E by S', 'ESE', 'SE by E', 'SE', 'SE by S', 'SSE', 'S by E', 'S', 'S by W', 'SSW', 'SW by S', 'SW', 'SW by W', 'WSW', 'W by S', 'W', 'W by N', 'WNW', 'NW by W', 'NW', 'NW by N', 'NNW', 'N by W'];
  const compass = (deg) => POINTS[Math.round((((deg % 360) + 360) % 360) / 11.25) % 32];
  function pts(n) {
    const q = Math.round(n * 2) / 2, whole = Math.floor(q), half = q - whole ? '½' : '';
    const words = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];
    if (!whole) return 'half a point';
    return (half ? whole + half : words[whole]) + (q === 1 ? ' point' : ' points');
  }
  function windWords(state) {
    const th = norm(state.wind - state.heading), side = th >= 0 ? 'starboard' : 'larboard', p = Math.abs(th) / 11.25;
    if (p < 0.3) return 'wind right ahead';
    if (p > 15.7) return 'wind right aft';
    if (Math.abs(p - 8) < 0.3) return `wind on the ${side} beam`;
    if (Math.abs(p - 12) < 0.3) return `wind on the ${side} quarter`;
    if (p < 8) return `wind ${pts(p)} on the ${side} bow`;
    if (p < 12) return `wind ${pts(p - 8)} abaft the ${side} beam`;
    return `wind ${pts(p - 12)} on the ${side} quarter`;
  }
  const WAY = { ahead: 'headway', slow: 'little headway', none: 'no way on', astern: 'sternway', anchor: 'at anchor' };
  function tillerWords(state) {
    const r = state.rudder || 0;
    if (Math.abs(r) < 1) return 'helm amidships';
    const side = r > 0 ? 'larboard' : 'starboard', th = norm(state.wind - state.heading);
    const hard = Math.abs(r) >= 28 ? 'hard ' : Math.abs(r) < 8 ? 'a little ' : '';
    let word = '';
    if (Math.abs(th) > 3 && Math.abs(th) < 177) word = (th > 0 ? 'larboard' : 'starboard') === side ? 'a-lee' : 'a-weather';
    return `helm ${hard}${word ? word + ': ' : ''}tiller to ${side}, rudder to ${r > 0 ? 'starboard' : 'larboard'}`;
  }
  const FILL = { full: 'full', shiver: 'shivering', aback: 'aback', becalmed: 'becalmed', hung: 'hanging in its gear', in: 'in' };

  // ---- Lines --------------------------------------------------------------
  const sailOf = (id) => R.SAILS.find((s) => s.id === id);
  const lineOf = (sailId, lineId) => { const s = sailOf(sailId); return s && s.lines.find((l) => l.id === lineId); };
  const PREFIX = { 'fore-course': 'fore', 'main-course': 'main', crossjack: 'crossjack' };
  const prefix = (sailId) => PREFIX[sailId] || sailId.replace('-', ' ');
  const NOUN = { braces: 'braces', tacks: 'tacks', sheets: 'sheets', bowlines: 'bowlines', halliards: 'halliards', clewlines: 'clewlines', 'clew-garnets': 'clew-garnets', buntlines: 'buntlines', buntline: 'buntline', leechlines: 'leechlines', slablines: 'slablines', 'reef-tackles': 'reef-tackles', lifts: 'lifts', jeers: 'jeers', trusses: 'trusses', 'preventer-braces': 'preventer braces', 'rolling-tackle': 'rolling tackle', slings: 'slings', 'yard-rope': 'yard rope', reefs: 'reef points and earings', horses: 'horses', clews: 'sheets and clewlines' };
  function join(list) {
    return list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
  }
  // “Larboard braces: main, main topsail and mizen topsail”, one entry per
  // kind of rope and side.
  function lineList(pairs) {
    const groups = new Map();
    for (const [sailId, lineId, side] of pairs) {
      const key = lineId + '|' + (side || 'both');
      if (!groups.has(key)) groups.set(key, { lineId, side: side || 'both', sails: [] });
      groups.get(key).sails.push(sailId);
    }
    return [...groups.values()].map((g) => {
      const noun = NOUN[g.lineId] || g.lineId;
      const undrawn = g.sails.every((s) => { const l = lineOf(s, g.lineId); return !l || !l.path; });
      const where = g.sails.length === 1 && lineOf(g.sails[0], g.lineId) && lineOf(g.sails[0], g.lineId).belay ? ` <span class="mv-at">${lineOf(g.sails[0], g.lineId).belay.short}</span>` : '';
      return `<li><b>${g.side === 'both' ? '' : g.side + ' '}${noun}</b>: ${join(g.sails.map(prefix))}${where}${undrawn ? ' <span class="mv-at">not drawn</span>' : ''}</li>`;
    }).join('');
  }

  // ---- One step-through ---------------------------------------------------
  const steppers = [];

  function build(section, m, number) {
    const head = html('header', '', `<p class="chapter-no">${number}</p><h2>${m.headline || m.title}</h2>` +
      `<p>${m.situation}</p><p class="mv-source"><b>Sequence from</b> ${m.source}</p>` +
      (m.stations ? `<p class="mv-source"><b>Stations</b> ${m.stations}</p>` : ''));
    const box = html('div', 'mv');
    section.prepend(head, box);

    const left = html('div', 'mv-left', '', box);
    const top = html('div', 'mv-top', '', left);
    const shipFig = html('figure', 'mv-ship', '', top);
    const svg = el('svg', { viewBox: '-150 -150 300 300', role: 'img', 'aria-label': 'The ship from above, wind from the top of the drawing' }, shipFig);
    const back = el('g', {}, svg);
    for (const x of [-100, -50, 0, 50, 100]) el('line', { x1: x, y1: -150, x2: x, y2: 150, class: 'mv-stream' }, back);
    el('line', { x1: -128, y1: -144, x2: -128, y2: -116, class: 'mv-wind' }, back);
    el('path', { d: 'M -134 -124 L -128 -112 L -122 -124 Z', class: 'mv-wind-head' }, back);
    const windLbl = el('text', { x: -118, y: -134, class: 'mv-lbl' }, back);
    if (m.shore) {
      el('rect', { x: -150, y: 138, width: 300, height: 12, class: 'mv-shore' }, back);
      el('text', { x: 146, y: 134, class: 'mv-lbl', 'text-anchor': 'end' }, back).textContent = m.shore;
    }
    const ship = el('g', {}, svg);
    const over = el('g', {}, svg);

    const side = html('div', 'mv-side', '', top);
    const trackSvg = el('svg', { viewBox: '0 0 100 100', class: 'mv-track', role: 'img', 'aria-label': 'Her track so far' }, side);
    const readout = html('p', 'mv-readout', '', side);
    const table = html('div', 'mv-sails', '', side);

    const planFig = html('figure', 'mv-plan', '', left);
    const planSvg = el('svg', { role: 'img', 'aria-label': 'Deck plan with the lines worked at this step' }, planFig);
    const planCap = html('figcaption', '', '', planFig);

    const right = html('div', 'mv-right', '', box);
    const orders = html('ol', 'mv-orders', '', right);
    const nav = html('div', 'mv-nav', '', right);
    const prev = html('button', '', '← Previous', nav);
    const next = html('button', '', 'Next →', nav);
    const count = html('span', 'mv-count', '', nav);
    const panel = html('div', 'mv-step', '', right);
    panel.setAttribute('aria-live', 'polite');
    prev.type = next.type = 'button';

    m.steps.forEach((s, i) => {
      const li = html('li', '', '', orders);
      const b = html('button', '', (s.spoken === false ? '' : '“') + (s.short || s.order) + (s.spoken === false ? '' : '”'), li);
      b.type = 'button';
      b.addEventListener('click', () => go(i));
    });

    // Her track: each step runs her on along the mean of the old and new
    // headings, and sets her a little to leeward. Wind from the top.
    const RUN = { ahead: 2, slow: 0.9, none: 0, astern: -0.7, anchor: 0 };
    const track = [[0, 0]];
    m.steps.forEach((s, i) => {
      if (!i) return;
      const a = m.steps[i - 1].state, b = s.state;
      const mid = rad((a.heading - a.wind + b.heading - b.wind) / 2);
      const run = b.run != null ? b.run : RUN[b.way] != null ? RUN[b.way] : 0;
      const drift = b.way === 'anchor' ? 0 : b.way === 'ahead' ? 0.2 : 0.4;
      const p = track[i - 1];
      track.push([p[0] + Math.sin(mid) * run, p[1] - Math.cos(mid) * run + drift]);
    });
    const xs = track.map((p) => p[0]), ys = track.map((p) => p[1]);
    const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 3);
    const k = 64 / span, cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
    const tp = (p) => [f1(50 + (p[0] - cx) * k), f1(54 + (p[1] - cy) * k)];

    function drawTrack(i, fr) {
      trackSvg.replaceChildren();
      el('line', { x1: 8, y1: 5, x2: 8, y2: 15, class: 'mv-wind' }, trackSvg);
      el('path', { d: 'M 5.5 12 L 8 17 L 10.5 12 Z', class: 'mv-wind-head' }, trackSvg);
      el('text', { x: 13, y: 12, class: 'mv-tlbl' }, trackSvg).textContent = 'Track';
      const all = track.map(tp);
      el('polyline', { points: all.map((p) => p.join(',')).join(' '), class: 'mv-path ahead' }, trackSvg);
      el('polyline', { points: all.slice(0, i + 1).map((p) => p.join(',')).join(' '), class: 'mv-path' }, trackSvg);
      all.forEach((p, j) => el('circle', { cx: p[0], cy: p[1], r: j === i ? 0 : 1.1, class: j <= i ? 'mv-dot' : 'mv-dot ahead' }, trackSvg));
      const p = all[i];
      el('path', { d: 'M 0 -7 L 2.6 -2 L 2.6 5 L -2.6 5 L -2.6 -2 Z', class: 'mv-boat', transform: `translate(${p[0]} ${p[1]}) rotate(${f1(fr.rel)})` }, trackSvg);
    }

    function describe(state) {
      const fr = frameOf(state);
      const name = state.headName || compass(state.heading);
      readout.innerHTML = `<b>Head ${name}</b>, ${windWords(state)}. ${WAY[state.way] || ''}${state.way ? '; ' : ''}${tillerWords(state)}.`;
      const cell = (id) => {
        const sq = SQUARE.find((q) => q.id === id);
        if (!sq || sq.bare) return '<td class="none">no sail</td>';
        const { fill } = squareFill(fr, sq);
        const reef = sq.tier === 1 && state.reefs && fill !== 'in' ? `, ${state.reefs === 'close' ? 'close-reefed' : state.reefs + (state.reefs > 1 ? ' reefs' : ' reef')}` : '';
        return `<td class="${fill}">${FILL[fill]}${reef}</td>`;
      };
      const rows = [['Topgallants', 'topgallant'], ['Topsails', 'topsail'], ['Courses', 'course']];
      if (['fore', 'main', 'mizen'].some((mast) => ((state.sails || {})[mast + '-royal'] || 'in') !== 'in')) rows.unshift(['Royals', 'royal']);
      const fa = FA.map((s) => {
        const mode = fr.fa[s.id].mode, fill = faFill(fr, s);
        const word = mode === 'in' ? (s.boom ? 'hauled up' : 'down') : mode === 'fly' ? 'sheet flying' : mode === 'flat' ? 'sheet flatted in' : FILL[fill];
        return `<span class="${mode === 'in' ? 'in' : fill}">${s.name}: ${word}</span>`;
      }).join('');
      table.innerHTML = '<table><thead><tr><td></td><th>Fore</th><th>Main</th><th>Mizen</th></tr></thead><tbody>' +
        rows.map(([label, key]) => `<tr><th>${label}</th>${['fore', 'main', 'mizen'].map((mast) => cell(mast === 'mizen' && key === 'course' ? 'crossjack' : mast + '-' + key)).join('')}</tr>`).join('') +
        `</tbody></table><p>${fa}</p>`;
    }

    // The deck plan: the lines worked at this step, coloured by what is done
    // to them and drawn on the side they are worked.
    const used = new Map();
    for (const s of m.steps) for (const kind of ['haul', 'letGo', 'ease', 'show']) for (const [a, b] of s[kind] || []) {
      const l = lineOf(a, b);
      if (l && l.path) used.set(l, true);
    }
    const fig = R.SAILS.length && window.RIGFIG ? window.RIGFIG.create(planSvg, { view: 'plan', sail: { mast: 'main' }, lines: [...used.keys()] }) : null;

    function plan(s) {
      const marks = [];
      for (const kind of ['letGo', 'ease', 'haul', 'show']) for (const [a, b, side] of s[kind] || []) {
        const l = lineOf(a, b);
        if (l && l.path) marks.push({ line: l, cls: 'mv-' + kind, side });
      }
      if (fig) fig.set({ marked: marks });
      planCap.innerHTML = marks.length
        ? '<span class="key"><i class="mv-k haul"></i> hauled</span><span class="key"><i class="mv-k letGo"></i> let go</span><span class="key"><i class="mv-k ease"></i> eased</span><span class="key"><i class="k-dot"></i> where it comes to hand</span>'
        : 'No rope with a drawn lead is worked at this step.';
    }

    function text(s, i) {
      const st = s.state;
      let h = `<p class="mv-kicker">Head ${st.headName || compass(st.heading)}, ${windWords(st)}</p>`;
      h += s.spoken === false ? `<h3 class="mv-order plain">${s.order}</h3>` : `<h3 class="mv-order">“${s.order}”</h3>`;
      if (s.from) h += `<p class="mv-from">${s.from}</p>`;
      if (s.variants && s.variants.length) h += '<ul class="mv-variants">' + s.variants.map((v) => `<li>“${v.words}” <span>${v.who}</span></li>`).join('') + '</ul>';
      h += s.text;
      const groups = [['letGo', 'Let go'], ['ease', 'Eased'], ['haul', 'Hauled'], ['show', 'Rigged or tended']];
      const lists = groups.filter(([key]) => s[key] && s[key].length).map(([key, label]) => `<div class="mv-lines ${key}"><h5>${label}</h5><ul>${lineList(s[key])}</ul></div>`).join('');
      if (lists) h += `<div class="mv-linebox">${lists}</div>`;
      if (s.also) h += `<h5>Gear not on the deck plan</h5><p>${s.also}</p>`;
      if (s.men) h += '<h5>Who</h5><ul class="mv-men">' + s.men.map(([who, what]) => `<li><b>${who}</b> ${what}</li>`).join('') + '</ul>';
      if (s.helm) h += `<h5>Helm</h5><p>${s.helm}</p>`;
      if (s.why) h += `<h5>Why</h5>${s.why}`;
      panel.innerHTML = h;
      count.textContent = `${i + 1} of ${m.steps.length}`;
    }

    let at = 0, shown = frameOf(m.steps[0].state), anim = 0;
    function paint(fr, i) {
      drawShip(ship, over, fr);
      drawTrack(i, fr);
    }
    function go(i, instant) {
      i = Math.max(0, Math.min(m.steps.length - 1, i));
      const s = m.steps[i], target = frameOf(s.state), from = shown;
      at = i;
      windLbl.textContent = 'Wind ' + compass(s.state.wind);
      [...orders.children].forEach((li, j) => li.firstChild.setAttribute('aria-pressed', j === i));
      prev.disabled = i === 0;
      next.disabled = i === m.steps.length - 1;
      text(s, i);
      describe(s.state);
      plan(s);
      cancelAnimationFrame(anim);
      if (instant || still.matches) { shown = target; paint(target, i); return; }
      const t0 = performance.now(), dur = 900;
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / dur), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        shown = t === 1 ? target : blend(from, target, e);
        paint(shown, i);
        if (t < 1) anim = requestAnimationFrame(tick);
      };
      anim = requestAnimationFrame(tick);
    }
    prev.addEventListener('click', () => go(at - 1));
    next.addEventListener('click', () => go(at + 1));
    go(0, true);
    steppers.push({ section, step: (d) => go(at + d) });
  }

  // ---- The page -----------------------------------------------------------
  const contents = document.getElementById('contents');
  let n = 0;
  for (const section of document.querySelectorAll('section[data-manoeuvre]')) {
    const m = LIST.find((x) => x.id === section.dataset.manoeuvre);
    if (!m) continue;
    n++;
    build(section, m, n);
    if (contents) html('li', '', `<a href="#${section.id}">${m.title}</a>`, contents);
  }

  // Left and right arrows step whichever evolution is in the middle of the window.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    const mid = window.innerHeight / 2;
    const s = steppers.find((x) => { const r = x.section.querySelector('.mv').getBoundingClientRect(); return r.top <= mid && r.bottom >= mid; });
    if (!s) return;
    e.preventDefault();
    s.step(e.key === 'ArrowRight' ? 1 : -1);
  });

  // Twelve points to tack, twenty to wear: Lever's two compasses as one.
  const rose = document.getElementById('points-rose');
  if (rose) {
    const at = (deg, r) => [f1(Math.sin(rad(deg)) * r), f1(-Math.cos(rad(deg)) * r)];
    const arc = (from, to, r, cls) => {
      const a = at(from, r), b = at(to, r), sweep = to > from ? 1 : 0, large = Math.abs(to - from) > 180 ? 1 : 0;
      el('path', { d: `M ${a[0]} ${a[1]} A ${r} ${r} 0 ${large} ${sweep} ${b[0]} ${b[1]}`, class: cls }, rose);
    };
    el('circle', { cx: 0, cy: 0, r: 60, class: 'mv-rose' }, rose);
    for (let i = 0; i < 32; i++) {
      const a = at(i * 11.25, 60), b = at(i * 11.25, i % 4 ? 56 : 52);
      el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'mv-rose' }, rose);
    }
    for (const [deg, name] of [[0, 'N'], [67.5, 'ENE'], [135, 'SE'], [180, 'S'], [270, 'W']]) {
      const p = at(deg, 42);
      el('text', { x: p[0], y: p[1] + 3, class: 'mv-lbl', 'text-anchor': 'middle' }, rose).textContent = name;
    }
    const w0 = at(67.5, 96), w1 = at(67.5, 66);
    el('line', { x1: w0[0], y1: w0[1], x2: w1[0], y2: w1[1], class: 'mv-wind' }, rose);
    el('circle', { cx: w1[0], cy: w1[1], r: 3, class: 'mv-wind-head' }, rose);
    const wl = at(67.5, 100);
    el('text', { x: wl[0] - 4, y: wl[1] - 4, class: 'mv-lbl', 'text-anchor': 'end' }, rose).textContent = 'Wind';
    arc(0, 135, 68, 'mv-arc tack');
    arc(135, 360, 76, 'mv-arc wear');
    const t = at(40, 80), w = at(250, 90);
    el('text', { x: t[0] + 2, y: t[1], class: 'mv-lbl tack' }, rose).textContent = 'tacking, 12 points';
    el('text', { x: w[0] + 12, y: w[1] + 16, class: 'mv-lbl wear', 'text-anchor': 'middle' }, rose).textContent = 'wearing, 20 points';
  }

  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
})();

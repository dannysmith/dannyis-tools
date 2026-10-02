// Steering and sailing theory: the drawings on handling.html.
//
// Every plan drawing has the bow at the top and starboard on the right, so a
// bearing is measured clockwise from the bow and turns into a screen vector
// with vec(). Plan drawings are in feet, in a frame where the stem is at
// (0, 0) and the taffrail at (0, 188). Angles are degrees; a point is 11.25.
//
// Sign conventions used throughout:
//   beta    bearing the wind blows FROM; positive = over the starboard side
//   tiller  angle of the tiller from the keel; positive = fore end to starboard
//   omega   rate the head is swinging; positive = to starboard

(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const PT = 11.25;
  const CLOSE = 6 * PT;          // close-hauled: six points
  const SHARP = 36;              // yard braced sharp up, degrees from the keel
  const FILL = 27.5;             // least angle of wind on the sail for it to stand full
  const HARD = 33;               // helm hard over (Lever: 33 to 35 degrees)

  const rad = (d) => d * Math.PI / 180;
  const deg = (r) => r * 180 / Math.PI;
  const vec = (bearing, r) => [Math.sin(rad(bearing)) * r, -Math.cos(rad(bearing)) * r];
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const sign = (v) => (v > 0 ? 1 : v < 0 ? -1 : 0);
  const r1 = (v) => Math.round(v * 10) / 10;
  const $ = (id) => document.getElementById(id);

  function el(name, attrs, parent, text) {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  // Sets the text of a read-out only when it changes, so that it is announced once.
  function put(id, text) {
    const node = typeof id === 'string' ? $(id) : id;
    if (node && node.textContent !== text) node.textContent = text;
  }
  const label = (parent, x, y, text, anchor, cls) =>
    el('text', { x: r1(x), y: r1(y), class: 'lbl' + (cls ? ' ' + cls : ''), 'text-anchor': anchor || 'middle' }, parent, text);

  // A straight arrow from (x1, y1) to (x2, y2) with a solid head of length h.
  function arrow(parent, x1, y1, x2, y2, cls, h) {
    h = h || 7;
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
    const bx = x2 - ux * h, by = y2 - uy * h;
    const g = el('g', { class: 'h-arrow ' + (cls || '') }, parent);
    el('line', { x1: r1(x1), y1: r1(y1), x2: r1(bx), y2: r1(by) }, g);
    el('polygon', { points: [[x2, y2], [bx - uy * h * 0.45, by + ux * h * 0.45], [bx + uy * h * 0.45, by - ux * h * 0.45]].map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ') }, g);
    return g;
  }

  // An arrow along an arc about (cx, cy), from one bearing to another.
  function arcArrow(parent, cx, cy, r, from, to, cls, h) {
    h = h || 7;
    const dir = to > from ? 1 : -1;
    const stop = to - dir * deg(h / r);
    const a = vec(from, r), b = vec(stop, r), tip = vec(to, r);
    const g = el('g', { class: 'h-arrow ' + (cls || '') }, parent);
    el('path', { d: `M${r1(cx + a[0])},${r1(cy + a[1])} A${r},${r} 0 ${Math.abs(stop - from) > 180 ? 1 : 0} ${dir > 0 ? 1 : 0} ${r1(cx + b[0])},${r1(cy + b[1])}`, fill: 'none' }, g);
    const out = vec(stop, 1);
    el('polygon', { points: [[cx + tip[0], cy + tip[1]], [cx + b[0] + out[0] * h * 0.45, cy + b[1] + out[1] * h * 0.45], [cx + b[0] - out[0] * h * 0.45, cy + b[1] - out[1] * h * 0.45]].map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ') }, g);
    return g;
  }

  function wedge(parent, cx, cy, r, from, to, cls) {
    const a = vec(from, r), b = vec(to, r);
    return el('path', { d: `M${cx},${cy} L${r1(cx + a[0])},${r1(cy + a[1])} A${r},${r} 0 ${Math.abs(to - from) > 180 ? 1 : 0} ${to > from ? 1 : 0} ${r1(cx + b[0])},${r1(cy + b[1])} Z`, class: cls }, parent);
  }

  function badge(parent, x, y, n) {
    el('circle', { cx: x, cy: y, r: 6.5, class: 'badge' }, parent);
    el('text', { x, y: y + 0.4, class: 'badge-num', 'font-size': 8.5 }, parent, n);
  }

  // The shared label class sizes its text by --u, viewBox units per screen
  // pixel, so that lettering stays the same size on screen at any width.
  const fitted = [];
  function fit() {
    for (const svg of fitted) {
      const box = svg.getBoundingClientRect(), view = svg.viewBox.baseVal;
      if (box.width && box.height) svg.style.setProperty('--u', Math.max(view.width / box.width, view.height / box.height).toFixed(3));
    }
  }
  function stage(id, viewBox) {
    const svg = $(id);
    if (!svg) return null;
    svg.setAttribute('viewBox', viewBox);
    fitted.push(svg);
    return svg;
  }

  // A row of buttons of which one is pressed. Calls back with its data-v.
  function choice(id, onPick) {
    const row = $(id);
    if (!row) return;
    row.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-v]');
      if (!b) return;
      for (const o of row.querySelectorAll('button[data-v]')) o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
      onPick(b.dataset.v);
    });
  }
  function press(id, v) {
    const row = $(id);
    if (row) for (const o of row.querySelectorAll('button[data-v]')) o.setAttribute('aria-pressed', o.dataset.v === String(v) ? 'true' : 'false');
  }

  // ---- The ship from above ------------------------------------------------

  const HULL = 'M0,0 C12,2 22,18 24,45 L24.7,100 C24.7,130 23,160 17,184 L14,188 L-14,188 L-17,184 C-23,160 -24.7,130 -24.7,100 L-24,45 C-22,18 -12,2 0,0 Z';
  const MASTS = [
    { key: 'fore', x: 19.6, half: 42.5 },
    { key: 'main', x: 97.8, half: 48.5 },
    { key: 'mizen', x: 149.6, half: 31 },
  ];
  const MID = 95;                 // the middle of her length, about which the wind arrow swings

  // Angle of the yards from the keel for a wind at this bearing. The two ends
  // are from the sources (sharp up close-hauled, square before the wind); the
  // straight line between them is this page's own.
  function yardFor(beta) {
    const b = Math.abs(beta);
    return b <= CLOSE ? SHARP : SHARP + (90 - SHARP) * (b - CLOSE) / (180 - CLOSE);
  }

  // Angle at which the wind meets the after face of a square sail whose
  // weather yardarm bears `a` degrees from the bow. Negative: it is aback.
  function incidence(beta, a) {
    const s = beta >= 0 ? 1 : -1;
    const w = vec(beta + 180, 1), n = vec(s * (a - 90), 1);
    return deg(Math.asin(clamp(w[0] * n[0] + w[1] * n[1], -1, 1)));
  }
  function sailState(beta, a) {
    const i = incidence(beta, a);
    return i >= FILL ? 'full' : i <= -8 ? 'aback' : 'shake';
  }

  function squareSail(g, mast, a, s, state) {
    const u = vec(s * a, mast.half), n = vec(s * (a - 90), 1), m = [0, mast.x - 1.5];
    const w = [m[0] + u[0], m[1] + u[1]], l = [m[0] - u[0], m[1] - u[1]];
    if (state === 'shake') {
      const pts = [];
      for (let i = 0; i <= 14; i++) {
        const k = i / 14, off = i === 0 || i === 14 ? 0 : (i % 2 ? 2.6 : -2.6);
        pts.push(r1(w[0] + (l[0] - w[0]) * k + n[0] * off) + ',' + r1(w[1] + (l[1] - w[1]) * k + n[1] * off));
      }
      el('polyline', { points: pts.join(' '), class: 'h-sail shake' }, g);
    } else if (state !== 'in') {
      const b = { full: 17, becalmed: 6, aback: -10 }[state];
      el('path', { d: `M${r1(w[0])},${r1(w[1])} Q${r1(m[0] + n[0] * b)},${r1(m[1] + n[1] * b)} ${r1(l[0])},${r1(l[1])} Z`, class: 'h-sail ' + state }, g);
    }
    el('line', { x1: r1(w[0]), y1: r1(w[1]), x2: r1(l[0]), y2: r1(l[1]), class: 'sparline h-yard' + (state === 'in' ? ' bare' : ''), 'stroke-width': 2.6 }, g);
  }

  // o: { beta, a?, angles?: {fore, main, mizen}, set?: {fore, main, mizen: 'in' | 'becalmed'},
  //      jib?, driver?: 'full' | 'shake' | 'becalmed' | 'in', tiller?, shadow?,
  //      onDeck?: draws over the hull and under the sails }
  function drawShip(g, o) {
    const s = o.beta >= 0 ? 1 : -1;
    const b = Math.abs(o.beta);
    const a0 = o.a != null ? o.a : yardFor(o.beta);
    const angle = (m) => (o.angles && o.angles[m.key] != null ? o.angles[m.key] : a0);
    const state = (m) => (o.set && o.set[m.key]) || sailState(o.beta, angle(m));

    if (o.shadow) {
      const down = vec(o.beta + 180, 78);
      for (const m of MASTS) {
        if (m.key === 'fore' || state(m) !== 'full') continue;
        const u = vec(s * angle(m), m.half);
        const p = [[u[0], m.x + u[1]], [-u[0], m.x - u[1]], [-u[0] + down[0], m.x - u[1] + down[1]], [u[0] + down[0], m.x + u[1] + down[1]]];
        el('polygon', { points: p.map((q) => r1(q[0]) + ',' + r1(q[1])).join(' '), class: 'h-shadow' }, g);
      }
    }

    el('line', { x1: 0, y1: 5, x2: 0, y2: -44, class: 'sparline', 'stroke-width': 2.4 }, g);
    if (o.tiller != null) {
      const blade = vec(180 + o.tiller, 17);
      el('line', { x1: 0, y1: 187, x2: r1(blade[0]), y2: r1(187 + blade[1]), class: 'h-rudder' }, g);
    }
    el('path', { d: HULL, class: 'hull' }, g);
    for (const x of [53, 95, 135.5]) el('line', { x1: -23.5, y1: x, x2: 23.5, y2: x, class: 'deck' }, g);
    if (o.onDeck) o.onDeck(g);
    if (o.tiller != null) {
      const t = vec(o.tiller, 31);
      el('line', { x1: 0, y1: 187, x2: r1(t[0]), y2: r1(187 + t[1]), class: 'h-tiller' }, g);
      el('circle', { cx: 0, cy: 187, r: 1.8, class: 'h-pivot' }, g);
    }

    const jib = o.jib || (b < 45 ? 'shake' : 'full');
    if (jib !== 'in') {
      const bulge = { full: 13, becalmed: 4, shake: 0 }[jib];
      el('path', { d: `M0,-42 Q${-s * bulge},-6 0,18`, class: 'h-sail fa ' + jib }, g);
    }
    const driver = o.driver || (b < 34 ? 'shake' : 'full');
    if (driver !== 'in') {
      const out = 12 + 50 * clamp((b - CLOSE) / CLOSE, 0, 1);
      const e = vec(180 + s * out, 37);
      const lee = vec(180 + s * out + s * 90, { full: 6, becalmed: 2, shake: 0 }[driver]);
      el('path', { d: `M0,151 Q${r1(e[0] / 2 + lee[0])},${r1(151 + e[1] / 2 + lee[1])} ${r1(e[0])},${r1(151 + e[1])}`, class: 'h-sail fa ' + driver }, g);
    }

    for (const m of MASTS) squareSail(g, m, angle(m), s, state(m));
    for (const m of MASTS) el('circle', { cx: 0, cy: m.x, r: 2.2, class: 'spar' }, g);
  }

  function drawWind(g, beta, inner, outer) {
    const a = vec(beta, outer), b = vec(beta, inner);
    arrow(g, a[0], MID + a[1], b[0], MID + b[1], 'wind', 9);
    // The word sits beside the tail of the arrow, on its upper side.
    let p = vec(beta + 90, 1);
    if (p[1] > 0.01 || (Math.abs(p[1]) <= 0.01 && p[0] < 0)) p = [-p[0], -p[1]];
    label(g, a[0] + p[0] * 7, MID + a[1] + p[1] * 7 + (p[1] < -0.5 ? 0 : 3), 'wind', p[0] > 0.35 ? 'start' : p[0] < -0.35 ? 'end' : 'middle', 'h-windlbl');
  }

  const sideName = (v) => (v > 0 ? 'starboard' : 'port');

  // Where the wind is, in the words of the period.
  function windWords(beta) {
    const p = Math.abs(beta) / PT;
    const side = beta >= 0 ? 'starboard' : 'larboard';
    const pts = (Math.round(p * 2) / 2).toString().replace('.5', '½');
    const where = p < 7.5 ? 'bow' : p <= 8.5 ? 'beam' : 'quarter';
    if (p > 15.5) return 'Wind right aft';
    if (p < 0.5) return 'Wind right ahead';
    return `Wind ${pts} point${pts === '1' ? '' : 's'} from ahead, ${p > 8.5 && p < 10 ? 'abaft the ' + side + ' beam' : 'on the ' + side + ' ' + where}`;
  }
  function pointOfSail(p) {
    if (p < 3) return 'Head to wind';
    if (p < 5.75) return 'Too near the wind';
    if (p < 6.5) return 'Close-hauled';
    if (p < 7.5) return 'One point free';
    if (p <= 8.5) return 'Wind on the beam';
    if (p < 10) return 'Large';
    if (p < 15.5) return 'Wind on the quarter';
    return 'Before the wind';
  }

  // ---- 1. The steering gear -----------------------------------------------

  // The wheel as the helmsman sees it, above a plan of the tiller, its sweep
  // and the run of the tiller rope under the upper deck.
  const GEAR_BOX = '0 0 230 290';
  function drawGear(g, tiller, numbered) {
    clear(g);
    const cx = 115, wy = 68, py = 256, len = 96;

    // The wheel. Top spokes go to port when the tiller goes to starboard.
    label(g, cx, 10, 'The wheel, seen from abaft it', 'middle', 'h-head');
    label(g, 8, wy + 3, 'larboard', 'start');
    label(g, 222, wy + 3, 'starboard', 'end');
    el('line', { x1: 60, y1: 114, x2: 170, y2: 114, class: 'deck' }, g);
    el('path', { d: `M${cx - 9},114 L${cx - 4},${wy} M${cx + 9},114 L${cx + 4},${wy}`, class: 'h-stand' }, g);
    const w = el('g', { transform: `rotate(${r1(-tiller * 7)} ${cx} ${wy})` }, g);
    for (let i = 0; i < 10; i++) {
      const o = vec(i * 36, 43), k = vec(i * 36, 6);
      el('line', { x1: r1(cx + k[0]), y1: r1(wy + k[1]), x2: r1(cx + o[0]), y2: r1(wy + o[1]), class: 'h-spoke' + (i === 0 ? ' king' : '') }, w);
    }
    el('circle', { cx, cy: wy, r: 33, class: 'h-rim' }, w);
    el('circle', { cx, cy: wy, r: 7, class: 'spar' }, w);
    el('circle', { cx, cy: wy - 43, r: 2.6, class: 'h-king' }, w);
    if (Math.abs(tiller) > 0.5) {
      const d = -sign(tiller);
      arcArrow(g, cx, wy, 50, d * 14, d * 52, 'wheel', 6);
    }

    // Under the upper deck, from above.
    label(g, cx, 129, 'Under the upper deck, from above', 'middle', 'h-head');
    el('path', { d: 'M10,136 L26,286 M220,136 L204,286', class: 'h-side' }, g);
    const sweep = [vec(-46, 88), vec(46, 88)];
    el('path', { d: `M${r1(cx + sweep[0][0])},${r1(py + sweep[0][1])} A88,88 0 0 1 ${r1(cx + sweep[1][0])},${r1(py + sweep[1][1])}`, class: 'h-sweep' }, g);
    el('circle', { cx, cy: 140, r: 5.5, class: 'spar h-mizen' }, g);

    const end = vec(tiller, len), tip = [cx + end[0], py + end[1]];
    const mid = vec(tiller, len * 0.55);
    for (const d of [-1, 1]) {
      el('line', { x1: r1(cx + mid[0]), y1: r1(py + mid[1]), x2: cx + d * 95, y2: 218, class: 'h-relief' }, g);
      el('circle', { cx: cx + d * 95, cy: 218, r: 1.8, class: 'h-eye' }, g);
      const side = [cx + d * 97, 170], centre = [cx + d * 9, 150];
      const hauling = numbered || (Math.abs(tiller) > 0.5 && sign(tiller) === d);
      el('polyline', { points: `${r1(tip[0])},${r1(tip[1])} ${side[0]},${side[1]} ${centre[0]},${centre[1]}`, class: 'rope' + (hauling ? ' sel' : '') }, g);
      el('circle', { cx: side[0], cy: side[1], r: 3.2, class: 'block' }, g);
      el('circle', { cx: centre[0], cy: centre[1], r: 3.2, class: 'block' }, g);
    }
    const blade = vec(180 + tiller, 28);
    el('line', { x1: cx, y1: py, x2: r1(cx + blade[0]), y2: r1(py + blade[1]), class: 'h-rudder' }, g);
    el('line', { x1: cx, y1: py, x2: r1(tip[0]), y2: r1(tip[1]), class: 'h-tiller big' }, g);
    el('circle', { cx, cy: py, r: 4, class: 'h-pivot' }, g);

    if (numbered) {
      badge(g, cx + 22, wy - 30, 1);
      badge(g, cx + 22, 144, 3);
      badge(g, cx + 86, 157, 4);
      badge(g, cx + 12, py - len + 14, 5);
      badge(g, cx - 51, py - 72, 6);
      badge(g, cx + 13, py - 6, 7);
      badge(g, cx + 13, py + 22, 8);
      badge(g, cx - 62, 225, 9);
    } else {
      const clear = -sign(tiller || 1);      // the side the tiller is not on
      label(g, cx - 10, 143, 'mizen mast', 'end');
      label(g, cx + clear * 30, py + 28, 'rudder', 'middle');
      label(g, cx + clear * 50, 240, 'relieving tackle', 'middle');
    }
  }

  // The same gear in a section through the stern, bow to the right.
  function drawSection(svg) {
    const X = (x) => r1((196 - x) * 6.2), Y = (z) => r1((42 - z) * 6.2);
    const pts = (list) => list.map((p) => X(p[0]) + ',' + Y(p[1])).join(' ');
    const g = el('g', {}, svg);
    el('rect', { x: 0, y: Y(0), width: 420, height: 400, class: 'sea' }, g);
    el('polygon', { points: pts([[129, -13], [177.6, -13], [179.4, 8], [186, 13], [189.5, 21], [191, 29], [135.5, 29], [135.5, 22.5], [129, 22.5]]), class: 'hull' }, g);
    for (const [z, from, to, name, dash] of [[25, 135.5, 190.2, 'Poop'], [18, 129, 188.6, 'Quarterdeck'], [10, 129, 183, 'Upper deck'], [2.5, 129, 178.6, 'Lower deck', true]]) {
      el('line', { x1: X(from), y1: Y(z), x2: X(to), y2: Y(z), class: 'deck' + (dash ? ' below' : '') }, g);
      label(g, X(from + 0.6), Y(z) - 3, name, 'end');
    }
    el('rect', { x: X(150.6), y: Y(42), width: 12.4, height: Y(-13) - Y(42), class: 'spar h-mast' }, g);
    label(g, X(151.2), Y(36), 'mizen mast', 'end');

    // Rudder on the stern-post, with its pintles.
    el('polygon', { points: pts([[177.9, -13], [184.2, -13], [183.6, -4], [181.6, 4], [181.4, 9], [179.9, 9], [179.5, 6]]), class: 'h-blade' }, g);
    for (const z of [-10, -5, 0, 4.5]) el('line', { x1: X(178.4 + (z + 13) * 0.075), y1: Y(z), x2: X(179.6 + (z + 13) * 0.075), y2: Y(z), class: 'h-pintle' }, g);

    // Tiller under the upper-deck beams, and the sweep that carries its fore end.
    el('line', { x1: X(180.6), y1: Y(8.2), x2: X(151.6), y2: Y(8.5), class: 'h-tiller big' }, g);
    el('rect', { x: X(155), y: Y(9.8), width: 9, height: 4.4, class: 'spar' }, g);
    el('path', { d: `M${X(165)},${Y(8.3)} L${X(168.5)},${Y(4)}`, class: 'h-relief' }, g);
    el('circle', { cx: X(168.5), cy: Y(4), r: 1.8, class: 'h-eye' }, g);

    // The wheel: two wheels on one barrel, edge on.
    el('path', { d: `M${X(146.6)},${Y(18)} L${X(146.6)},${Y(21.6)} M${X(143)},${Y(18)} L${X(143)},${Y(21.6)}`, class: 'h-stand' }, g);
    el('line', { x1: X(146.9), y1: Y(21.6), x2: X(142.7), y2: Y(21.6), class: 'h-barrel' }, g);
    for (const x of [146.6, 143]) el('ellipse', { cx: X(x), cy: Y(21.6), rx: 2.2, ry: 19, class: 'h-rim' }, g);

    // The rope: five turns on the barrel, both ends down through the decks.
    for (const x of [144.2, 144.6, 145, 145.4]) el('line', { x1: X(x), y1: Y(22.2), x2: X(x), y2: Y(21), class: 'rope sel thin' }, g);
    el('polyline', { points: pts([[144.4, 21.4], [144.4, 8.8], [151.6, 8.5]]), class: 'rope sel' }, g);
    el('polyline', { points: pts([[145.2, 21.4], [145.2, 8.8]]), class: 'rope sel' }, g);
    el('circle', { cx: X(144.8), cy: Y(8.8), r: 3.6, class: 'block' }, g);

    badge(g, X(141.4), Y(25.4), 1);
    badge(g, X(142.4), Y(14), 2);
    badge(g, X(142.4), Y(7), 3);
    badge(g, X(152.6), Y(6), 5);
    badge(g, X(157.4), Y(12.2), 6);
    badge(g, X(183.6), Y(10.6), 7);
    badge(g, X(186.4), Y(-6), 8);
    badge(g, X(170.4), Y(5.4), 9);
    arrow(g, 360, 16, 404, 16, 'wind', 7);
    label(g, 354, 19.5, 'forward', 'end');
  }

  function gearFigure() {
    const section = stage('gear-section', '0 0 420 340');
    if (section) drawSection(section);
    const plan = stage('gear-plan', GEAR_BOX);
    if (plan) drawGear(el('g', {}, plan), 0, true);
  }

  // ---- 2. Helm orders -----------------------------------------------------

  const ORDERS = {
    starboard: { say: 'Starboard the helm!', means: 'Tiller to starboard, rudder to port, head to port.' },
    port: { say: 'Port the helm!', means: 'Tiller to port, rudder to starboard, head to starboard.' },
    alee: { say: 'Helm a-lee!', means: 'Tiller to the lee side. Her head comes up toward the wind.' },
    hardalee: { say: 'Hard a-lee!', means: 'Tiller as far to leeward as it will go. She comes up fast; this is how tacking begins.' },
    aweather: { say: 'Helm a-weather!', means: 'Tiller to the weather side. Her head falls off, away from the wind.' },
    ease: { say: 'Ease the helm', means: 'Less helm: the tiller comes part of the way back toward amidships.' },
    meet: { say: 'Meet her', means: 'Opposite helm, to stop the swing she already has, then amidships.' },
    steady: { say: 'Steady!', means: 'Keep the heading she has at this instant, with whatever helm that takes.' },
    right: { say: 'Right the helm!', means: 'Tiller amidships. She swings on a little and stops.' },
    shift: { say: 'Shift the helm!', means: 'Tiller across to the same angle on the other side.' },
    thus: { say: 'Thus!', means: 'Close to the wind: keep her exactly as she goes.' },
    nonear: { say: 'No near!', means: 'She is too close. A little weather helm, and her head goes off (drawn as one point).' },
    luff: { say: 'Luff!', means: 'A little lee helm, and her head comes nearer the wind (drawn as one point, and no nearer than six).' },
    fallnotoff: { say: 'Fall not off!', means: 'Do not let her head drop to leeward: hold her up to the wind.' },
  };

  function helmFigure() {
    const shipSvg = stage('helm-ship', '-116 -66 232 290');
    const gearSvg = stage('helm-gear', GEAR_BOX);
    if (!shipSvg || !gearSvg) return;
    const shipG = el('g', {}, shipSvg), gearG = el('g', {}, gearSvg);
    const out = { order: $('helm-order'), means: $('helm-means'), tiller: $('helm-tiller'), rudder: $('helm-rudder'), wheel: $('helm-wheel'), head: $('helm-head'), wind: $('helm-wind'), note: $('helm-note') };

    const START = 7 * PT, NEAR = 4 * PT, AFT = 15 * PT;
    const S = { beta: START, omega: 0, tiller: 0, want: 0, mode: 'fixed', goal: 0, order: null, note: '' };
    let running = false, last = 0;

    function give(key) {
      const lee = -sign(S.beta);          // the side the tiller goes for "a-lee"
      S.note = '';
      S.order = key;
      const fixed = (t) => { S.mode = 'fixed'; S.want = t; };
      const hold = (goal) => { S.mode = 'goto'; S.goal = goal; };
      if (key === 'starboard') fixed(20);
      else if (key === 'port') fixed(-20);
      else if (key === 'alee') fixed(lee * 20);
      else if (key === 'hardalee') fixed(lee * HARD);
      else if (key === 'aweather') fixed(-lee * 20);
      else if (key === 'right') fixed(0);
      else if (key === 'ease') {
        if (S.mode !== 'fixed' || Math.abs(S.want) < 1) S.note = 'There is no helm on to ease.';
        else fixed(S.want / 2);
      } else if (key === 'shift') {
        if (S.mode !== 'fixed' || Math.abs(S.want) < 1) S.note = 'The helm is amidships: there is nothing to shift.';
        else fixed(-S.want);
      } else if (key === 'meet') {
        if (Math.abs(S.omega) < 0.4) { S.note = 'She is not swinging, so there is nothing to meet.'; fixed(0); } else S.mode = 'check';
      } else if (key === 'steady' || key === 'thus' || key === 'fallnotoff') hold(S.beta);
      else if (key === 'nonear') hold(sign(S.beta) * Math.min(Math.abs(S.beta) + PT, AFT));
      else if (key === 'luff') {
        if (Math.abs(S.beta) <= CLOSE + 0.5) S.note = 'She is already as near as she will lie. Luff further and the sails shake.';
        hold(sign(S.beta) * Math.max(Math.abs(S.beta) - PT, CLOSE));
      }
      for (const b of document.querySelectorAll('[data-order]')) b.setAttribute('aria-pressed', b.dataset.order === key ? 'true' : 'false');
      kick();
    }

    function step(dt) {
      if (S.mode === 'check') {
        S.want = clamp(S.omega * 4, -20, 20);
        if (Math.abs(S.omega) < 0.5) { S.mode = 'fixed'; S.want = 0; S.omega = 0; }
      } else if (S.mode === 'goto') {
        const err = S.beta - S.goal;
        S.want = clamp(-2.2 * err + 2.4 * S.omega, -20, 20);
        if (Math.abs(err) < 0.25 && Math.abs(S.omega) < 0.4) { S.mode = 'fixed'; S.want = 0; S.omega = 0; S.beta = S.goal; }
      }
      const move = clamp(S.want - S.tiller, -50 * dt, 50 * dt);
      S.tiller += move;
      // Going ahead, the head turns away from the tiller, and takes a moment to answer.
      S.omega += ((-0.5 * S.tiller) - S.omega) * Math.min(1, dt / 0.7);
      S.beta -= S.omega * dt;
      const b = Math.abs(S.beta);
      const stopped = b < NEAR || b > AFT;
      if (stopped) {
        S.beta = sign(S.beta) * clamp(b, NEAR, AFT);
        S.omega = 0;
        S.note = b < NEAR
          ? 'The drawing stops here. With her head this near the wind she is in stays: what happens next is tacking, on the next page.'
          : 'The drawing stops here, with the wind nearly aft. Carry on round and she is wearing, on the next page.';
      }
      // With helm on she keeps turning, so the drawing keeps running until it stops her.
      return !stopped && (Math.abs(S.tiller) > 0.05 || Math.abs(S.want) > 0.05 || Math.abs(S.omega) > 0.05 || S.mode !== 'fixed');
    }

    function draw() {
      clear(shipG);
      const s = sign(S.beta);
      label(shipG, 110, -54, 'starboard', 'end');
      label(shipG, -110, -54, 'larboard (port)', 'start');
      label(shipG, s * 110, 216, 'weather side', s > 0 ? 'end' : 'start', 'h-em');
      label(shipG, -s * 110, 216, 'lee side', s > 0 ? 'start' : 'end', 'h-em');
      drawWind(shipG, S.beta, 72, 104);
      drawShip(shipG, { beta: S.beta, tiller: S.tiller });
      if (Math.abs(S.omega) > 0.4) {
        const d = sign(S.omega);
        arcArrow(shipG, 0, 62, 120, d * 3, d * 19, 'head', 8);
        label(shipG, d * 30, -36, 'head to ' + sideName(d), d > 0 ? 'start' : 'end', 'h-headlbl');
      }
      drawGear(gearG, S.tiller, false);

      const t = Math.round(S.tiller), on = Math.abs(S.tiller) > 0.5;
      const lee = -s;
      const o = S.order && ORDERS[S.order];
      put(out.order, o ? '“' + o.say + '”' : 'No order given yet');
      put(out.means, o ? o.means : 'She is sailing with the wind one point free and the helm amidships.');
      put(out.tiller, on ? `${Math.abs(t)}° to ${sideName(S.tiller)}, which is ${sign(S.tiller) === lee ? 'a-lee' : 'a-weather'}` : 'amidships');
      put(out.rudder, on ? `blade to ${sideName(-S.tiller)}` : 'fore and aft');
      put(out.wheel, on ? `top spokes to ${sideName(-S.tiller)}` : 'marked spoke uppermost');
      put(out.head, Math.abs(S.omega) > 0.4 ? `swinging to ${sideName(S.omega)}, ${sign(S.omega) === s ? 'toward the wind' : 'away from the wind'}` : 'steady');
      const p = Math.abs(S.beta) / PT;
      put(out.wind, `${windWords(S.beta)}. ${pointOfSail(p)}${p < 5.75 ? ': the sails shake' : ''}.`);
      put(out.note, S.note);
    }

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      running = step(dt);
      draw();
      if (running) requestAnimationFrame(frame);
    }
    function kick() {
      if (running) return;
      running = true;
      last = performance.now();
      requestAnimationFrame(frame);
    }
    function reset(tack) {
      Object.assign(S, { beta: tack * START, omega: 0, tiller: 0, want: 0, mode: 'fixed', order: null, note: '' });
      for (const b of document.querySelectorAll('[data-order]')) b.setAttribute('aria-pressed', 'false');
      draw();
    }

    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-order]');
      if (b) give(b.dataset.order);
    });
    choice('helm-tack', (v) => reset(Number(v)));
    const again = $('helm-reset');
    if (again) again.addEventListener('click', () => reset(sign(S.beta)));
    draw();
  }

  // ---- 3. Rudder and sails together ---------------------------------------

  function turnFigure() {
    const svg = stage('turn-ship', '-116 -66 232 290');
    if (!svg) return;
    const g = el('g', {}, svg);
    const S = { way: 1, helm: 0, sail: 'trim' };
    const BETA = CLOSE;                    // wind six points on the starboard bow; lee is port
    const SAILS = {
      trim: { head: 0, text: 'The sails before and abaft her centre balance, and do not turn her.' },
      aftoff: { head: -1, text: 'With the mizen hauled up and the mizen topsail shivered, the sails forward have nothing to oppose them and push her head off to leeward.' },
      headoff: { head: 1, text: 'With the jib and fore topmast staysail sheets let fly, the sails aft push her stern to leeward and her head comes up to the wind.' },
      aback: { head: -1, text: 'The head yards braced aback catch the wind on their fore side and push her bow off to leeward (boxing off). They also stop her, and then drive her astern.' },
    };

    function draw() {
      clear(g);
      const tiller = S.helm * 25;
      label(g, 110, -54, 'starboard, weather', 'end');
      label(g, -110, -54, 'larboard, lee', 'start');
      drawWind(g, BETA, 72, 104);
      drawShip(g, {
        beta: BETA, tiller,
        angles: S.sail === 'aback' ? { fore: 180 - SHARP } : null,
        set: S.sail === 'aftoff' ? { mizen: 'in' } : null,
        driver: S.sail === 'aftoff' ? 'in' : 'full',
        jib: S.sail === 'headoff' ? 'shake' : 'full',
      });

      // Water past the rudder, and which way it pushes the stern.
      if (S.way) {
        for (const x of [-36, 36]) arrow(g, x, S.way > 0 ? 172 : 206, x, S.way > 0 ? 206 : 172, 'water', 6);
        label(g, 44, S.way > 0 ? 185 : 196, 'water', 'start');
      }
      const rudder = -S.helm * S.way;      // which way the rudder turns her head
      if (rudder) {
        arrow(g, 0, 214, -rudder * 26, 214, 'helm', 7);
        label(g, -rudder * 30, 217.5, 'stern', rudder > 0 ? 'end' : 'start', 'h-helmlbl');
        arcArrow(g, 0, 62, 112, rudder * 3, rudder * 19, 'helm', 8);
        label(g, rudder * 30, -22, 'rudder', rudder > 0 ? 'start' : 'end', 'h-helmlbl');
      }
      const sails = SAILS[S.sail].head;
      if (sails) {
        arcArrow(g, 0, 62, 124, sails * 3, sails * 19, 'head', 8);
        label(g, sails * 30, -32, 'sails', sails > 0 ? 'start' : 'end', 'h-headlbl');
      }

      const helmName = S.helm < 0 ? 'a-lee (tiller to port)' : 'a-weather (tiller to starboard)';
      put('turn-rudder', !S.helm
        ? 'Helm amidships: the rudder lies fore and aft and turns nothing.'
        : !S.way
          ? `Helm ${helmName}, but she has no way through the water. Nothing presses on the rudder and it does nothing.`
          : S.way > 0
            ? `Helm ${helmName}. The water running aft strikes the forward face of the blade and pushes her stern to ${sideName(S.helm)}, so her head goes to ${sideName(-S.helm)}: the opposite side to the tiller.`
            : `Helm ${helmName}. She is going astern, so the water strikes the after face of the blade and pushes her stern to ${sideName(-S.helm)}. Her head goes to ${sideName(S.helm)}: the same side as the tiller.`);
      put('turn-sails', SAILS[S.sail].text);
      const where = (d) => (d > 0 ? 'to starboard, toward the wind' : 'to port, away from the wind');
      put('turn-both', rudder && sails
        ? (rudder === sails ? `Rudder and sails both turn her head ${where(rudder)}.` : 'Rudder and sails are working against each other.')
        : rudder ? `Only the rudder is turning her: head ${where(rudder)}.`
          : sails ? `Only the sails are turning her: head ${where(sails)}.`
            : 'Nothing is turning her.');
    }

    choice('turn-way', (v) => { S.way = Number(v); draw(); });
    choice('turn-helm', (v) => { S.helm = Number(v); draw(); });
    choice('turn-sail', (v) => { S.sail = v; draw(); });
    draw();
  }

  // ---- 4. Points of sail --------------------------------------------------

  const SAILING = [
    {
      from: 0, name: 'Head to wind',
      yards: 'Wherever the yards are braced, the wind is on the fore side of the sails.',
      sails: 'Every square sail is aback, pressed against its mast. She stops and gathers sternway. A ship passes through this in tacking; she cannot sail here.',
    },
    {
      from: 3, name: 'Too near the wind',
      yards: 'Braced sharp up, about 36° from the keel. They will go no sharper.',
      sails: 'The wind meets the sails too nearly edge on, and they shake and stop driving. This is when the helmsman hears “No near!”',
    },
    {
      from: 5.75, name: 'Close-hauled; by the wind; full and by',
      yards: 'Braced sharp up, about 36° from the keel: a little over three points.',
      sails: 'Tacks on board, sheets aft, bowlines hauled. Every sail draws, the fore-and-aft sails too.',
    },
    {
      from: 6.5, name: 'One point free; going large',
      yards: 'Lee braces eased and the weather ones hauled in a little.',
      sails: 'Sheets eased off and the bowlines let go. Everything draws. The weather studding sails can be set.',
    },
    {
      from: 7.5, name: 'Wind on the beam; two points free',
      yards: 'Braced in a little further.',
      sails: 'Everything draws, with flowing sheets. Weather studding sails.',
    },
    {
      from: 8.5, name: 'Large; wind abaft the beam',
      yards: 'Braced in further as the wind draws aft.',
      sails: 'Everything still draws. The strain on the masts begins to come from abaft.',
    },
    {
      from: 10, name: 'Wind on the quarter; quartering',
      yards: 'Well in toward square.',
      sails: 'The square sails draw, but those aft begin to stand between the wind and those forward. Preventer backstays are got up, because the strain on the masts now comes from abaft.',
    },
    {
      from: 13.5, name: 'Wind nearly aft',
      yards: 'Nearly square.',
      sails: 'With the wind two points on the quarter the weather clew of the mainsail is hauled up, “that it may not becalm the sails forward”. The jib and staysails are in the lee of the square sails and do little.',
    },
    {
      from: 15.5, name: 'Before the wind',
      yards: 'Square: at right angles to the keel.',
      sails: 'The after sails blanket everything forward of them. Spanker, jib and staysails are hauled down, the mizen topsail lowered on the cap or handed, the mainsail hauled up, and the fore topsail and fore topgallant sail, which are becalmed, lowered and clewed up. Studding sails on both sides.',
    },
  ];
  const sailingAt = (p) => SAILING.slice().reverse().find((r) => p >= r.from);

  function pointsFigure() {
    const svg = stage('points-ship', '-162 -68 324 326');
    const slider = $('points-wind');
    if (!svg || !slider) return;
    const g = el('g', {}, svg);
    const S = { pts: 6, reefed: false };

    function leeway(p) {
      const full = S.reefed ? 2 : 1;
      return p < 5.75 ? 0 : p <= 7 ? full : p < 9 ? full * (9 - p) / 2 : 0;
    }

    function draw() {
      clear(g);
      const p = Math.abs(S.pts), s = S.pts >= 0 ? 1 : -1, beta = S.pts === 0 ? 0.01 : S.pts * PT;
      const R = 122;

      // The ring: 32 points, counted from the bow. She cannot lie with the wind in the shaded part.
      wedge(g, 0, MID, R, -CLOSE, CLOSE, 'h-nogo');
      el('circle', { cx: 0, cy: MID, r: R, class: 'h-ring' }, g);
      for (let i = 0; i < 32; i++) {
        const a = vec(i * PT, R), b = vec(i * PT, R - (i % 8 === 0 ? 9 : i % 2 === 0 ? 6 : 3.5));
        el('line', { x1: r1(a[0]), y1: r1(MID + a[1]), x2: r1(b[0]), y2: r1(MID + b[1]), class: 'h-tick' }, g);
      }
      for (const [n, text] of [[4, '4'], [8, '8'], [12, '12'], [16, '16'], [-4, '4'], [-8, '8'], [-12, '12']]) {
        const q = vec(n * PT, R - 17);
        label(g, q[0], MID + q[1] + 3.5, text);
      }

      const row = sailingAt(p);
      const lw = leeway(p);
      if (p >= 5.75) {
        const made = vec(-s * lw * PT, 150), wake = vec(180 - s * lw * PT, 118);
        el('line', { x1: 0, y1: MID, x2: 0, y2: MID - 150, class: 'h-course' }, g);
        if (lw > 0.05) {
          el('line', { x1: r1(wake[0]), y1: r1(MID + wake[1]), x2: r1(made[0]), y2: r1(MID + made[1]), class: 'h-made' }, g);
          label(g, made[0] - s * 4, MID + made[1] + 12, 'made good', s > 0 ? 'end' : 'start', 'h-headlbl');
          label(g, s * 4, MID - 153, 'steered', s > 0 ? 'start' : 'end');
        }
      }

      drawShip(g, {
        beta, shadow: p >= 8.5,
        set: p >= 15.5 ? { fore: 'becalmed', mizen: 'in' } : null,
        jib: p >= 15.5 ? 'in' : p >= 13.5 ? 'becalmed' : null,
        driver: p >= 15.5 ? 'in' : null,
      });
      drawWind(g, beta, R + 4, R + 36);

      slider.setAttribute('aria-valuetext', windWords(beta));
      put('points-where', windWords(beta));
      put('points-name', row.name);
      put('points-count', p < 5.75 ? '' : p < 6.5 ? 'Counted the period way, she has nothing free.' : `Counted the period way, from close-hauled: ${p - 6} point${p - 6 === 1 ? '' : 's'} free.`);
      put('points-yards', p >= 6.5 && p < 15.5 ? `${row.yards} Drawn at ${Math.round(yardFor(beta))}° from the keel.` : row.yards);
      put('points-sails', row.sails);
      const amount = (v) => (v === 1 ? 'one point (11¼°)' : v === 2 ? 'two points (22½°)' : v === 0.5 ? 'half a point' : `${r1(v)} points`);
      put('points-leeway', p < 5.75 ? 'She is not sailing.'
        : lw > 0.05 ? `About ${amount(lw)}: steering ${p} points from the wind she makes good about ${r1(p + lw)}.${p + lw >= 8 && p < 8 ? ' That is no better than straight across the wind: she gains nothing to windward.' : ''}`
          : 'Little, and “not much taken notice of” with the wind abaft the beam.');
      for (const b of document.querySelectorAll('[data-points]')) b.setAttribute('aria-pressed', Number(b.dataset.points) === p ? 'true' : 'false');
    }

    function set(pts) {
      S.pts = clamp(Math.round(pts), -16, 16);
      slider.value = S.pts;
      draw();
    }
    slider.addEventListener('input', () => set(Number(slider.value)));
    $('points-reefed').addEventListener('change', (e) => { S.reefed = e.target.checked; draw(); });
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-points]');
      if (b) set((S.pts < 0 ? -1 : 1) * Number(b.dataset.points));
    });

    // The wind can also be dragged round the ring.
    let dragging = false;
    const at = (e) => {
      const m = svg.getScreenCTM();
      if (!m) return;
      const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      let b = deg(Math.atan2(q.x, -(q.y - MID)));
      set(b / PT);
    };
    // A finger taps to place the wind, so that the page can still be scrolled past the drawing.
    svg.addEventListener('click', at);
    svg.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') return; dragging = true; svg.setPointerCapture(e.pointerId); at(e); });
    svg.addEventListener('pointermove', (e) => { if (dragging) at(e); });
    svg.addEventListener('pointerup', () => { dragging = false; });
    svg.addEventListener('pointercancel', () => { dragging = false; });
    draw();
  }

  // ---- 5. How sharp the yards will brace ----------------------------------

  function braceFigure() {
    const svg = stage('brace-ship', '-116 -66 232 290');
    const slider = $('brace-angle');
    if (!svg || !slider) return;
    const g = el('g', {}, svg);
    const BETA = CLOSE, MAIN = 97.8;
    const LIMIT = 35, SHAKES = CLOSE - FILL;      // 35 and 40 degrees

    function draw() {
      clear(g);
      const a = Number(slider.value);
      const foul = a < LIMIT, full = incidence(BETA, a) >= FILL;
      label(g, 110, -54, 'starboard, weather', 'end');
      label(g, -110, -54, 'larboard, lee', 'start');
      drawWind(g, BETA, 78, 108);
      drawShip(g, {
        beta: BETA, a, jib: 'full', driver: 'full',
        onDeck: (d) => {
          wedge(d, 0, MAIN, 70, 180, 180 + LIMIT, 'h-foul');
          wedge(d, 0, MAIN, 70, SHAKES, BETA, 'h-lift');
          const w = vec(BETA, 74);
          el('line', { x1: 0, y1: MAIN, x2: r1(w[0]), y2: r1(MAIN + w[1]), class: 'h-course' }, d);
        },
      });
      label(g, -42, 172, 'lee shrouds', 'end', 'h-helmlbl');
      label(g, 48, 36, 'sail shakes', 'start');

      if (full) {
        const n = vec(a - 90, 48);
        el('line', { x1: 0, y1: MAIN, x2: 0, y2: r1(MAIN + n[1]), class: 'h-part' }, g);
        el('line', { x1: 0, y1: r1(MAIN + n[1]), x2: r1(n[0]), y2: r1(MAIN + n[1]), class: 'h-part' }, g);
        arrow(g, 0, MAIN, n[0], MAIN + n[1], 'head', 8);
        label(g, 4, MAIN + n[1] - 4, 'ahead', 'end');
        label(g, n[0] - 5, MAIN + n[1] + 3, 'to leeward', 'end');
      }
      for (const m of MASTS) if (foul) {
        const u = vec(180 + a, m.half);
        el('circle', { cx: r1(u[0] * 0.5), cy: r1(m.x + u[1] * 0.5), r: 5, class: 'h-clash' }, g);
      }

      put('brace-value', `${a}° from the keel`);
      const ahead = Math.round(Math.sin(rad(a)) * 100), across = Math.round(Math.cos(rad(a)) * 100);
      put('brace-state', foul
        ? 'The lee yardarm is hard against the foremost lee shrouds. The sail would stand full and she would point higher, which is what Bourdé wanted, but the rigging is in the way.'
        : full ? 'The sail stands full, and the yard clears the shrouds. This is the narrow slot the ship has to work in.'
          : 'The yard is now too nearly in line with the wind. The sail shakes and drives nothing. To fill it again she must bear away, which is why squarer yards mean a course further from the wind.');
      put('brace-push', full
        ? `The sail pushes square to the yard. Of every 100 parts of that push, ${ahead} act along the keel and ${across} across it, to leeward (the two are sides of a right-angled triangle, so they do not add to 100).`
        : 'No push to divide.');
    }
    slider.addEventListener('input', draw);
    draw();
  }

  // ---- 6. Balance ---------------------------------------------------------

  function balanceFigure() {
    const svg = stage('balance-ship', '-116 -66 232 290');
    if (!svg) return;
    const g = el('g', {}, svg);
    const STATES = {
      trim: { tiller: 2, fore: 26, aft: 26, text: 'In balance. The sails before her centre push the bow to leeward exactly as hard as the sails abaft it push the stern. She holds her course with the helm nearly amidships.' },
      aft: { tiller: 14, fore: 20, aft: 38, text: 'Too much sail aft. The stern is pushed to leeward, so the head keeps trying to come up into the wind: she gripes. The helmsman holds her off with the tiller a-weather, and the rudder drags. The cure is to take in after sail: mizen topgallant sail and the topgallant and topmast staysails first, then the mizen.' },
      fwd: { tiller: 14, fore: 32, aft: 26, bow: true, text: 'Pressed down forward. Lying well over, the square sails forward press her bows down, and the water under the lee bow pushes back, forcing her head to windward. She gripes just the same, but taking in after sail would not help. The fore topgallant sail is handed instead, “which eases her forward: she then slackens her helm”.' },
    };
    let now = 'trim';

    function draw() {
      clear(g);
      const st = STATES[now];
      label(g, 110, -54, 'starboard, weather', 'end');
      label(g, -110, -54, 'larboard, lee', 'start');
      drawWind(g, CLOSE, 72, 104);
      drawShip(g, { beta: CLOSE, tiller: st.tiller });
      el('circle', { cx: 0, cy: 91, r: 5, class: 'h-centre' }, g);
      el('path', { d: 'M-8,91 L8,91 M0,83 L0,99', class: 'h-centre' }, g);
      label(g, 30, 101, 'centre she turns about', 'start');
      arrow(g, -28, 30, -28 - st.fore, 30, 'head', 8);
      label(g, -30, 24, 'sails forward', 'end', 'h-headlbl');
      arrow(g, -26, 160, -26 - st.aft, 160, 'head', 8);
      label(g, -30, 154, 'sails aft', 'end', 'h-headlbl');
      if (st.bow) {
        arrow(g, -46, 46, -16, 40, 'water', 7);
        label(g, -50, 49, 'water under', 'end');
        label(g, -50, 58, 'the lee bow', 'end');
      }
      if (now !== 'trim') {
        arcArrow(g, 0, 62, 118, 3, 19, 'helm', 8);
        label(g, 30, -36, 'she gripes', 'start', 'h-helmlbl');
        label(g, 38, 172, 'weather helm', 'start', 'h-helmlbl');
      }
      put('balance-read', st.text);
    }
    choice('balance-state', (v) => { now = v; draw(); });
    draw();
  }

  // ---- 7. Tacking against wearing -----------------------------------------

  const NAMES = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

  function roundFigure() {
    const svg = stage('round-chart', '-170 -170 340 340');
    if (!svg) return;
    const R = 122, WIND = 67.5;
    wedge(svg, 0, 0, R, 0, 135, 'h-nogo');
    el('circle', { cx: 0, cy: 0, r: R, class: 'h-ring' }, svg);
    for (let i = 0; i < 32; i++) {
      const a = vec(i * PT, R), b = vec(i * PT, R - (i % 8 === 0 ? 9 : i % 2 === 0 ? 6 : 3.5));
      el('line', { x1: r1(a[0]), y1: r1(a[1]), x2: r1(b[0]), y2: r1(b[1]), class: 'h-tick' }, svg);
    }
    NAMES.forEach((n, i) => {
      if (n === 'ENE') return;
      const q = vec(i * 22.5, R + 12);
      label(svg, q[0], q[1] + 3.5, n, 'middle', i % 4 === 0 ? 'h-em' : '');
    });
    const a = vec(WIND, R + 44), b = vec(WIND, R + 4);
    arrow(svg, a[0], a[1], b[0], b[1], 'wind', 9);
    label(svg, a[0] - 2, a[1] - 7, 'wind, ENE', 'end', 'h-windlbl');

    arcArrow(svg, 0, 0, 84, 0, 135, 'helm', 9);
    arcArrow(svg, 0, 0, 104, 135, 360, 'head', 9);
    label(svg, 56, -22, 'tack', 'middle', 'h-helmlbl');
    label(svg, 56, -10, '12 points', 'middle', 'h-helmlbl');
    label(svg, -66, 60, 'wear', 'middle', 'h-headlbl');
    label(svg, -66, 72, '20 points', 'middle', 'h-headlbl');

    const ship = el('g', {}, svg);
    el('path', { d: HULL, class: 'hull' }, ship);
    el('line', { x1: 0, y1: 4, x2: 0, y2: -44, class: 'sparline', 'stroke-width': 3 }, ship);
    for (const m of MASTS) el('circle', { cx: 0, cy: m.x, r: 3.4, class: 'spar' }, ship);
    let heading = 0, timer = 0;
    const place = () => ship.setAttribute('transform', `rotate(${r1(heading)}) scale(0.42) translate(0 -94)`);
    const say = (text) => { put('round-read', text); };

    function run(from, to, done) {
      cancelAnimationFrame(timer);
      const t0 = performance.now(), span = Math.abs(to - from) * 26;
      const tick = (now) => {
        const k = clamp((now - t0) / span, 0, 1);
        heading = from + (to - from) * k;
        place();
        if (k < 1) timer = requestAnimationFrame(tick); else say(done);
      };
      timer = requestAnimationFrame(tick);
    }
    choice('round-go', (v) => {
      if (v === 'tack') {
        say('Tacking: head north, on the starboard tack. Her bow goes through the wind.');
        run(0, 135, 'Head SE, on the larboard tack. She turned through NE, ENE (the wind’s eye) and E: twelve points.');
      } else {
        say('Wearing: head SE, on the larboard tack. She turns away from the wind and brings her stern through it.');
        run(135, 360, 'Head north, on the starboard tack. She turned through S, WSW (dead before the wind) and W: twenty points, and all the way round she was running to leeward.');
      }
    });
    place();
  }

  function start() {
    gearFigure();
    helmFigure();
    turnFigure();
    pointsFigure();
    braceFigure();
    balanceFigure();
    roundFigure();
    fit();
    window.addEventListener('resize', fit);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

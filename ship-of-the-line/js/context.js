// The ship itself: hull, decks, masts, yards and standing rigging, drawn as
// quiet background for each of the three views. Each view projects the same
// [x, y, z] feet coordinates (see data.js) on to the page. The sail being
// studied is drawn solid; the other sails on its mast are drawn faintly.

(function () {
  const { G, MASTS, TIERS, yard, shape } = window.RIGDATA;
  const NS = 'http://www.w3.org/2000/svg';

  function svg(name, attrs, parent) {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function label(parent, x, y, text, anchor) {
    const t = svg('text', { x, y, class: 'lbl', 'text-anchor': anchor || 'start' }, parent);
    t.textContent = text;
    return t;
  }

  const pts = (list) => list.map((p) => p[0] + ',' + p[1]).join(' ');

  // Sails that are not one of the square sails on a mast (staysails, studding
  // sails, the driver) carry their own outline as `cloth`, a list of polygons
  // of [x, y, z] points, and any spars of their own as `spars`, a list of
  // { a, b, w } with ends in feet and a width in feet.
  function drawOwn(g, sail, proj) {
    for (const poly of sail.cloth || []) svg('polygon', { points: pts(poly.map(proj)), class: 'sail' }, g);
    for (const s of sail.spars || []) {
      const a = proj(s.a), b = proj(s.b);
      svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'sparline', 'stroke-width': s.w || 1 }, g);
    }
  }

  const VIEWS = {
    // Looking forward from astern at one mast: starboard is on the right.
    aft: { box: [-57, -196, 114, 203], proj: (p) => [p[1], -p[2]] },
    // Starboard side, bow to the right.
    side: { box: [-198, -196, 276, 209], proj: (p) => [-p[0], -p[2]] },
    // From above, bow to the right, starboard at the bottom.
    plan: { box: [-198, -51, 276, 102], proj: (p) => [-p[0], p[1]] },
  };

  function drawAft(g, sail) {
    const m = MASTS[sail.mast];
    const k = m.hullScale;
    svg('rect', { x: -300, y: 0, width: 600, height: 40, class: 'sea' }, g);

    // Hull section at this mast, with tumblehome.
    const side = [[24.3 * k, 0], [24.7 * k, 6], [23.6 * k, 12], [m.railHalf + 0.6, 18], [m.railHalf, m.railZ]];
    const hull = side.map(([y, z]) => [y, -z]).reverse().concat(side.map(([y, z]) => [-y, -z]));
    svg('polygon', { points: pts(hull), class: 'hull' }, g);
    for (const d of m.decks) {
      const half = d.z > 12 ? m.railHalf + 0.5 : 23.6 * k;
      svg('line', { x1: -half, y1: -d.z, x2: half, y2: -d.z, class: d.below ? 'deck below' : 'deck' }, g);
      label(g, -half + 1.2, -d.z - 1, d.name);
    }

    // Seen from astern the sails are furthest away, then the yards, then the mast.
    for (const tier of TIERS) {
      if (tier === 'course' && m.key === 'mizen') continue;
      const S = shape(m, tier);
      const current = tier === sail.tier && !sail.noSail;
      const d = `M ${-S.headY} ${-S.headZ} L ${S.headY} ${-S.headZ} L ${S.clewY} ${-S.clewZ} Q 0 ${-S.footCtrlZ} ${-S.clewY} ${-S.clewZ} Z`;
      svg('path', { d, class: current ? 'sail' : 'sail other' }, g);
    }
    const names = { course: m.lowerYard, topsail: 'topsail yard', topgallant: 'topgallant yard', royal: 'royal yard' };
    for (const tier of TIERS) {
      const y = yard(m, tier);
      const mid = y.half / 51, end = mid * 0.42;
      svg('polygon', { points: pts([[-y.half, -y.z - end], [0, -y.z - mid], [y.half, -y.z - end], [y.half, -y.z + end], [0, -y.z + mid], [-y.half, -y.z + end]]), class: 'spar' }, g);
      label(g, -y.half, -y.z + 5.5, names[tier][0].toUpperCase() + names[tier].slice(1));
    }

    // Masts, top, caps and crosstrees.
    const w = m.key === 'mizen' ? 1 : 1.5;
    svg('rect', { x: -w, y: -m.capZ, width: 2 * w, height: m.capZ - 10, class: 'spar' }, g);
    svg('rect', { x: -w * 0.57, y: -m.tmCapZ, width: w * 1.14, height: m.tmCapZ - m.topZ, class: 'spar' }, g);
    svg('rect', { x: -w * 0.3, y: -m.poleZ, width: w * 0.6, height: m.poleZ - m.crossZ, class: 'spar' }, g);
    svg('rect', { x: -m.topHalf, y: -m.topZ - 0.6, width: m.topHalf * 2, height: 0.7, class: 'spar' }, g);
    svg('rect', { x: -2.6, y: -m.capZ - 0.5, width: 5.2, height: 1, class: 'spar' }, g);
    svg('rect', { x: -5.2, y: -m.crossZ - 0.3, width: 10.4, height: 0.5, class: 'spar' }, g);
    svg('rect', { x: -1.7, y: -m.tmCapZ - 0.4, width: 3.4, height: 0.8, class: 'spar' }, g);

    for (const s of [-1, 1]) {
      svg('rect', { x: s > 0 ? m.railHalf + 0.4 : -m.channelY - 0.6, y: -m.channelZ - 0.3, width: m.channelY - m.railHalf + 0.2, height: 0.6, class: 'spar' }, g);
      // Lower shrouds, futtock shrouds, topmast shrouds, topgallant shrouds.
      svg('line', { x1: s * m.channelY, y1: -m.channelZ, x2: s * 1.5, y2: -(m.topZ + 2), class: 'standing' }, g);
      svg('line', { x1: s * m.topHalf, y1: -m.topZ, x2: s * m.topHalf * 0.47, y2: -(m.topZ - 8), class: 'standing' }, g);
      svg('line', { x1: s * m.topHalf, y1: -(m.topZ + 0.5), x2: s * 1, y2: -(m.crossZ + 0.5), class: 'standing' }, g);
      svg('line', { x1: s * 5.2, y1: -m.crossZ, x2: s * 0.6, y2: -m.tgHoundZ, class: 'standing' }, g);
    }

    drawOwn(g, sail, VIEWS.aft.proj);
    label(g, -m.topHalf - 1.5, -m.topZ - 1.6, 'Top', 'end');
    label(g, -3.6, -m.capZ - 1, 'Lower cap', 'end');
    label(g, -6.2, -m.crossZ - 1.2, 'Crosstrees', 'end');
    label(g, -m.channelY - 1.6, -m.channelZ + 1.2, 'Channel', 'end');
  }

  function mastSide(g, m) {
    const line = (x1, z1, x2, z2, w) => svg('line', { x1: -x1, y1: -z1, x2: -x2, y2: -z2, class: 'sparline', 'stroke-width': w }, g);
    line(m.x, 8, m.x, m.capZ, m.key === 'mizen' ? 2 : 3);
    line(m.x - 0.6, m.topZ, m.x - 0.6, m.tmCapZ, 1.7);
    line(m.x - 1, m.crossZ, m.x - 1, m.poleZ, 0.9);
    line(m.x - 7, m.topZ, m.x + 8, m.topZ, 0.8);
    line(m.x - 2.2, m.capZ, m.x + 1.6, m.capZ, 1.1);
    line(m.x - 3.4, m.crossZ, m.x + 3.6, m.crossZ, 0.6);
    line(m.x - 2, m.tmCapZ, m.x + 0.6, m.tmCapZ, 0.8);
    // Yards are square, so from the side they are seen end-on.
    for (const tier of TIERS) svg('circle', { cx: -(m.x - 1.5), cy: -yard(m, tier).z, r: tier === 'course' ? 1.2 : 0.9, class: 'spar' }, g);
    // Lower shrouds, topmast shrouds and a backstay.
    for (let i = 0; i < 5; i++) svg('line', { x1: -(m.x + 2 + i * 4), y1: -m.channelZ, x2: -m.x, y2: -(m.topZ + 2), class: 'standing' }, g);
    for (let i = 0; i < 3; i++) svg('line', { x1: -(m.x + 1.5 + i * 2.5), y1: -(m.topZ + 0.5), x2: -m.x, y2: -m.crossZ, class: 'standing' }, g);
    svg('line', { x1: -(m.x + 23), y1: -m.channelZ, x2: -m.x, y2: -m.crossZ, class: 'standing' }, g);
  }

  function drawSide(g, sail) {
    svg('rect', { x: -500, y: 0, width: 1000, height: 40, class: 'sea' }, g);
    const profile = [
      [2, 0], [-4, 10], [-9, 17], [-13, 21], [3, 23], [G.forecastleAft, 22], [G.forecastleAft, 20.5],
      [G.quarterdeckFore, 20.5], [G.quarterdeckFore, 22.5], [G.poopFore, 23], [G.poopFore, 29],
      [187, 31.5], [189, 27], [184, 10], [178, 0],
    ];
    svg('polygon', { points: pts(profile.map(([x, z]) => [-x, -z])), class: 'hull' }, g);
    for (let x = 16; x < 168; x += 10.6) {
      svg('rect', { x: -x - 1.3, y: -6.8, width: 2.6, height: 2.6, class: 'port' }, g);
      svg('rect', { x: -x - 6.6, y: -14, width: 2.6, height: 2.6, class: 'port' }, g);
    }
    const D = G.deck;
    const deck = (x1, x2, z, below) => svg('line', { x1: -x1, y1: -z, x2: -x2, y2: -z, class: below ? 'deck below' : 'deck' }, g);
    deck(6, G.forecastleAft, D.forecastle);
    deck(6, 180, D.upper, true);
    deck(G.quarterdeckFore, G.poopFore, D.quarter);
    deck(G.poopFore, 186, D.poop);

    // Bowsprit, jibboom, dolphin striker and boomkin.
    const spar = (a, b, w) => svg('line', { x1: -a[0], y1: -a[1], x2: -b[0], y2: -b[1], class: 'sparline', 'stroke-width': w }, g);
    spar([4, 21], G.bowspritCap, 2.6);
    spar([-27, 40], G.jibboomEnd, 1.1);
    spar(G.bowspritCap, [-41.5, 35], 0.5);
    spar([1, 21], [-6, 20], 0.7);
    // Gaff and driver boom on the mizen.
    spar([151, 60], G.gaffPeak, 0.9);
    spar([151, 33], [193, 37], 1.1);

    // Stays.
    const stay = (a, b) => svg('line', { x1: -a[0], y1: -a[1], x2: -b[0], y2: -b[1], class: 'standing' }, g);
    stay([MASTS.mizen.x, 69], [99, 26]);
    stay([MASTS.main.x, 80], [22, 22]);
    stay([MASTS.main.x, 137], [21, 80]);
    stay([MASTS.fore.x, 72], [-30, 40]);
    stay([MASTS.fore.x, 123], [-39, 46]);
    stay([MASTS.mizen.x, 112], [99, 80]);

    for (const key in MASTS) mastSide(g, MASTS[key]);

    // The sail being studied, edge-on.
    drawOwn(g, sail, VIEWS.side.proj);
    if (sail.tier && !sail.noSail) {
      const m = MASTS[sail.mast], S = shape(m, sail.tier);
      svg('path', { d: `M ${-(m.x - 1.8)} ${-S.headZ} Q ${-(m.x - 5.3)} ${-(S.headZ + S.clewZ) / 2} ${-(m.x - 2)} ${-S.clewZ}`, class: 'sail edge' }, g);
    }

    label(g, -MASTS.fore.x, 9, 'Foremast', 'middle');
    label(g, -MASTS.main.x, 9, 'Mainmast', 'middle');
    label(g, -MASTS.mizen.x, 9, 'Mizen mast', 'middle');
  }

  // Smooth closed outline through the given points (Catmull-Rom as béziers).
  function smooth(points) {
    const n = points.length;
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 0; i < n; i++) {
      const p0 = points[(i - 1 + n) % n], p1 = points[i], p2 = points[(i + 1) % n], p3 = points[(i + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C ${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
    }
    return d + ' Z';
  }

  function drawPlan(g, sail) {
    const overhead = (x1, y1, x2, y2, w) => svg('line', { x1: -x1, y1, x2: -x2, y2, class: 'sparline overhead', 'stroke-width': w }, g);
    // Bowsprit and jibboom, boomkins, gaff and boom.
    overhead(4, 0, G.bowspritCap[0], 0, 2.4);
    overhead(-27, 0, G.jibboomEnd[0], 0, 1);
    overhead(1, 6, -6, 9, 0.7);
    overhead(1, -6, -6, -9, 0.7);
    overhead(151, 0, 193, 0, 1);

    const stbd = G.breadth.map(([x, b]) => [-x, b]);
    const port = G.breadth.slice(1).reverse().map(([x, b]) => [-x, -b]);
    svg('path', { d: smooth(stbd.concat(port)), class: 'hull' }, g);

    // The waist is open to the upper deck between the gangways.
    svg('rect', { x: -93.6, y: -13, width: 93.6 - 55, height: 26, class: 'well' }, g);
    for (const x of [62, 70, 78, 86]) svg('line', { x1: -x, y1: -13, x2: -x, y2: 13, class: 'deck' }, g);
    for (const x of [G.forecastleAft, G.quarterdeckFore, G.poopFore]) svg('line', { x1: -x, y1: -20.6, x2: -x, y2: 20.6, class: 'deck' }, g);

    for (const key in MASTS) {
      const m = MASTS[key];
      svg('circle', { cx: -m.x, cy: 0, r: key === 'mizen' ? 1 : 1.5, class: 'spar' }, g);
      const len = key === 'fore' ? 15 : key === 'main' ? 20 : 13;
      for (const s of [-1, 1]) {
        svg('rect', { x: -(m.x + 1 + len), y: s > 0 ? m.railHalf - 0.4 : -m.channelY - 0.6, width: len, height: m.channelY - m.railHalf + 1, class: 'channel' }, g);
      }
    }
    // Bitts: a cross-piece on two posts.
    for (const [x, half] of [[17.4, 2.8], [24.5, 2.8], [91.4, 2.8], [93.2, 2.8], [102.6, 2.6], [152.6, 2.2]]) {
      svg('line', { x1: -x, y1: -half, x2: -x, y2: half, class: 'bitts' }, g);
    }
    // Belfry, and the catheads at the bows.
    svg('rect', { x: -52.4, y: -1.2, width: 2.4, height: 2.4, class: 'spar' }, g);
    for (const s of [-1, 1]) svg('line', { x1: -11, y1: s * 12.5, x2: -7.5, y2: s * 19, class: 'sparline', 'stroke-width': 1.3 }, g);

    // The yards of the sail being studied overhang the ship's side.
    if (sail.tier) {
      const m = MASTS[sail.mast];
      const own = yard(m, sail.tier);
      overhead(m.x - 1.5, -own.half, m.x - 1.5, own.half, 1.4);
      if (sail.tier !== 'course') {
        const below = yard(m, TIERS[TIERS.indexOf(sail.tier) - 1]);
        overhead(m.x - 1.5, -below.half, m.x - 1.5, below.half, 1.4);
      }
    }
    drawOwn(g, sail, VIEWS.plan.proj);

    label(g, -32, -8, 'Forecastle', 'middle');
    label(g, -74, -15.5, 'Waist', 'middle');
    label(g, -118, -8, 'Quarterdeck', 'middle');
    label(g, -166, -8, 'Poop', 'middle');
  }

  window.RIGVIEWS = { VIEWS, svg, draw: { aft: drawAft, side: drawSide, plan: drawPlan } };
})();

// One drawing of the ship with rigging lines on it. A figure shows one view
// (from astern, profile or deck plan) of one sail's surroundings, draws a set
// of lines quietly, and picks one of them out with numbered points.
//
//   const fig = RIGFIG.create(svgElement, { view: 'aft', sail, lines, onPick });
//   fig.set({ view, sail, lines, box });   // redraw with something changed
//   fig.select(line);                      // highlight one line, or null
//   fig.set({ marked: [line, ...] });      // highlight several, unnumbered;
//                                          // an entry may be { line, cls, side }
//   fig.hover(line);

(function () {
  const { MASTS, TIERS, yard } = window.RIGDATA;
  const { VIEWS, svg, draw } = window.RIGVIEWS;

  // The starboard lead, and its mirror image to larboard where there is one.
  // From the side the two coincide, so only one is drawn.
  function copies(l, viewName, list) {
    const out = [{ list, port: false }];
    if (l.mirror !== false && viewName !== 'side') {
      out.push({ list: list.map((n) => ({ ...n, p: [n.p[0], -n.p[1], n.p[2]] })), port: true });
    }
    return out;
  }

  // Screen segments for a lead. In a view that shows one mast only, a segment
  // that leaves for another mast is cut to a short stub.
  function segments(nodes, view) {
    const out = [];
    for (let i = 1; i < nodes.length; i++) {
      const a = nodes[i - 1], b = nodes[i];
      const pa = view.proj(a.p), pb = view.proj(b.p);
      const ia = !view.inView || view.inView(a.p), ib = !view.inView || view.inView(b.p);
      if (!ia && !ib) continue;
      if (ia && ib) {
        out.push({ a: pa, b: pb, dashed: !!b.inferred });
      } else {
        const [near, far] = ia ? [pa, pb] : [pb, pa];
        out.push({ a: near, b: [near[0] + (far[0] - near[0]) * 0.22, near[1] + (far[1] - near[1]) * 0.22], stub: true });
      }
    }
    return out;
  }

  // `side` limits a mirrored line to its 'starboard' or 'larboard' copy.
  function drawLead(g, l, viewName, view, cls, side) {
    const polylines = (l.path ? [l.path] : []).concat((l.extra || []).map((e) => e.map((p) => ({ p }))));
    for (const list of polylines) {
      for (const copy of copies(l, viewName, list)) {
        if (side && l.mirror !== false && viewName !== 'side' && copy.port !== (side === 'larboard')) continue;
        for (const s of segments(copy.list, view)) {
          const c = [cls, l.cls || '', copy.port ? 'port' : '', s.dashed ? 'inferred' : '', s.stub ? 'stub' : ''].join(' ');
          svg('line', { x1: s.a[0], y1: s.a[1], x2: s.b[0], y2: s.b[1], class: c }, g);
        }
      }
    }
  }

  function belayMarker(g, l, node, view, u, cls) {
    const [x, y] = view.proj(node.p);
    const r = (cls === 'sel' ? 4.5 : 2.6) * u;
    const c = `belay ${cls} ${l.belay.status === 'inferred' ? 'inferred' : ''}`;
    if (l.belay.level === 'upper') svg('rect', { x: x - r, y: y - r, width: 2 * r, height: 2 * r, class: c }, g);
    else svg('circle', { cx: x, cy: y, r, class: c }, g);
  }

  // A box for the view from astern that frames the sail ('sail'), or the sail
  // and everything under it down to the deck ('mast').
  function aftBox(sail, crop) {
    if (!sail.tier) return sail.aftBox || null;
    const m = MASTS[sail.mast];
    const top = { course: m.capZ + 4, topsail: m.tmCapZ + 5, topgallant: m.tgHoundZ + 6, royal: m.poleZ + 3 }[sail.tier];
    if (crop === 'mast') return [-57, -top, 114, top + 6];
    const i = TIERS.indexOf(sail.tier);
    const bottom = i > 0 ? yard(m, TIERS[i - 1]).z - 9 : 14;
    const half = (i > 0 ? yard(m, TIERS[i - 1]).half : m.yardHalf) + 7;
    return [-half, -top, 2 * half, top - bottom];
  }

  function create(el, opts) {
    const f = Object.assign({ el, lines: [], selected: null, u: 1 }, opts);
    const context = svg('g', { class: 'context' }, el);
    const rest = svg('g', {}, el);
    const top = svg('g', { class: 'top' }, el);
    const groups = new Map();

    function view() {
      const m = MASTS[f.sail.mast];
      return { proj: VIEWS[f.view].proj, inView: f.view === 'aft' ? (p) => p[0] > m.x - 14 && p[0] < m.x + 18 : null };
    }

    function renderRest() {
      const v = view();
      rest.replaceChildren();
      groups.clear();
      for (const l of f.lines) {
        if (!l.path && !l.extra) continue;
        const g = svg('g', { class: 'line' }, rest);
        groups.set(l, g);
        svg('title', {}, g).textContent = l.name;
        drawLead(g, l, f.view, v, 'hit');
        drawLead(g, l, f.view, v, 'rope');
        if (f.view === 'plan' && l.path) {
          const last = l.path[l.path.length - 1];
          for (const copy of copies(l, f.view, [last])) belayMarker(g, l, copy.list[0], v, f.u, 'rest');
        }
        if (f.onPick) g.addEventListener('click', () => f.onPick(l));
      }
    }

    function renderSelection() {
      const v = view(), u = f.u, line = f.selected;
      top.replaceChildren();
      // Several lines can be picked out at once, without numbers.
      // An entry is a line, or { line, cls, side } to style it or show one side.
      for (const m of f.marked || []) {
        const l = m.line || m;
        drawLead(top, l, f.view, v, 'rope sel marked ' + (m.cls || ''), m.side);
        if (f.view === 'plan' && l.path) {
          const last = l.path[l.path.length - 1];
          const larboard = m.side === 'larboard' && l.mirror !== false;
          belayMarker(top, l, larboard ? { p: [last.p[0], -last.p[1], last.p[2]] } : last, v, u, 'sel');
        }
      }
      if (!line) return;
      drawLead(top, line, f.view, v, 'rope sel');
      if (!line.path) return;

      for (const n of line.path) {
        if (v.inView && !v.inView(n.p)) continue;
        const [x, y] = v.proj(n.p);
        if (n.mark === 'block') svg('circle', { cx: x, cy: y, r: 2.4 * u, class: 'block' }, top);
        if (n.mark === 'lead') svg('circle', { cx: x, cy: y, r: 1.6 * u, class: 'fast' }, top);
        if (n.mark === 'fast') svg('rect', { x: x - 2.2 * u, y: y - 2.2 * u, width: 4.4 * u, height: 4.4 * u, class: 'fast' }, top);
        if (n.mark === 'belay') belayMarker(top, line, n, v, u, 'sel');
      }

      // Step numbers, matching the written lead. Later steps win where several
      // nodes fall on the same spot, so the belaying point always shows.
      const steps = line.path.filter((n) => n.step);
      const placed = [];
      for (let i = steps.length - 1; i >= 0; i--) {
        const n = steps[i];
        if (v.inView && !v.inView(n.p)) continue;
        const [x, y] = v.proj(n.p);
        const bx = x + 9 * u, by = y - 9 * u;
        if (placed.some(([px, py]) => Math.hypot(px - bx, py - by) < 15 * u)) continue;
        placed.push([bx, by]);
        svg('circle', { cx: bx, cy: by, r: 7 * u, class: 'badge' }, top);
        svg('text', { x: bx, y: by, class: 'badge-num', 'font-size': 10 * u }, top).textContent = i + 1;
      }

      if (f.view === 'plan') {
        const [x, y] = v.proj(line.path[line.path.length - 1].p);
        // Under the marker, or above it for points out at the ship's side.
        const t = svg('text', { x, y: y + (y < 12 ? 17 : -9) * u, class: 'lbl belay-lbl', 'text-anchor': 'middle' }, top);
        t.textContent = line.belay.short;
      }
    }

    // Feet per screen pixel, so that text and markers keep a constant size.
    function measure(box) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      f.u = Math.max(box[2] / r.width, box[3] / r.height);
      el.style.setProperty('--u', f.u);
      return true;
    }

    f.render = () => {
      // A sail that reaches outside the usual frame can carry its own, as
      // aftBox, sideBox or planBox.
      const box = f.box || f.sail[f.view + 'Box'] || VIEWS[f.view].box;
      el.setAttribute('viewBox', box.join(' '));
      if (!measure(box)) return;
      context.replaceChildren();
      draw[f.view](context, f.sail);
      renderRest();
      renderSelection();
    };
    f.set = (changes) => {
      Object.assign(f, changes);
      f.render();
    };
    f.select = (line) => {
      f.selected = line;
      renderSelection();
    };
    f.hover = (line) => {
      for (const [l, g] of groups) g.classList.toggle('hover', l === line);
    };

    new ResizeObserver(f.render).observe(el);
    f.render();
    return f;
  }

  window.RIGFIG = { create, aftBox };
})();

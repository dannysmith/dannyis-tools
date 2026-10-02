// The reference page: pick any square sail and any of its lines, and see the
// lead in all three views with the full description beside it. The address
// bar holds "#sail/line".

(function () {
  const { GROUPS, SAILS, MASTS, TIERS, MATRIX } = window.RIGDATA;
  const T = window.RIGTEXT;

  const sailById = Object.fromEntries(SAILS.map((s) => [s.id, s]));
  const figures = [];
  let sail = sailById['main-topsail'], line;
  let fresh = true;

  // The sail picker is laid out like the sail plan: masts across, bow to the
  // right as in the profile, and the sails stacked from royal down to course.
  function renderPicker() {
    const nav = document.getElementById('sails');
    const order = ['mizen', 'main', 'fore'];
    const short = { course: 'Course', topsail: 'Topsail', topgallant: 'Topgallant', royal: 'Royal' };
    for (const key of order) {
      const h = document.createElement('span');
      h.className = 'mast-name';
      h.textContent = key[0].toUpperCase() + key.slice(1);
      nav.appendChild(h);
    }
    for (const tier of TIERS.slice().reverse()) {
      for (const key of order) {
        const s = SAILS.find((x) => x.mast === key && x.tier === tier);
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = s.noSail ? 'Crossjack yard' : short[tier];
        b.dataset.sail = s.id;
        b.style.setProperty('--w', { royal: 0.5, topgallant: 0.66, topsail: 0.84, course: 1 }[tier] * (MASTS[key].yardHalf / 48.5 + 1) / 2);
        b.addEventListener('click', () => select(s.id));
        nav.appendChild(b);
      }
    }
    // Everything that is not a square sail on a mast goes in a list below.
    const others = SAILS.filter((s) => !s.tier && s.lines.length);
    if (others.length) {
      const pickOther = document.createElement('select');
      pickOther.id = 'other-sails';
      pickOther.setAttribute('aria-label', 'Other sails');
      pickOther.innerHTML = '<option value="">Other sails…</option>' + others.map((s) => `<option value="${s.id}">${s.title.replace(/^The /, '').replace(/^./, (c) => c.toUpperCase())}</option>`).join('');
      pickOther.addEventListener('change', () => pickOther.value && select(pickOther.value));
      nav.appendChild(pickOther);
    }
  }

  function renderChips() {
    const nav = document.getElementById('lines');
    nav.replaceChildren();
    const known = GROUPS.map((g) => g.id);
    for (const group of GROUPS.concat({ id: null, name: 'Other gear' })) {
      const members = sail.lines.filter((l) => (group.id ? l.group === group.id : !known.includes(l.group)));
      if (!members.length) continue;
      const row = document.createElement('div');
      row.className = 'chip-row';
      const h = document.createElement('h3');
      h.textContent = group.name;
      row.appendChild(h);
      for (const l of members) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = l.name;
        b.dataset.id = l.id;
        if (!l.path && !l.extra) b.classList.add('undrawn');
        b.addEventListener('click', () => select(sail.id, l.id));
        for (const on of ['mouseenter', 'focus']) b.addEventListener(on, () => figures.forEach((f) => f.hover(l)));
        for (const off of ['mouseleave', 'blur']) b.addEventListener(off, () => figures.forEach((f) => f.hover(null)));
        row.appendChild(b);
      }
      nav.appendChild(row);
    }
  }

  function renderPanel() {
    document.getElementById('detail').innerHTML =
      `<h2>${line.name}</h2>${T.also(line)}` +
      T.field('What it does', `<p>${line.does}</p>`) +
      T.field(line.path ? 'Its lead, to where it belays' : 'Its lead', T.lead(line)) +
      T.field('Purchase', line.purchase && `<p>${line.purchase}</p>`) +
      T.field('Where it belays', T.belay(line)) +
      T.field('When it is worked', line.worked && `<p>${line.worked}</p>`) +
      T.field('Rope', line.rope && `<p>${line.rope}</p>`) +
      T.field('Notes', T.notes(line)) +
      T.field('Sources', T.sources(line));
  }

  // Choose a sail, and optionally one of its lines.
  function select(sailId, lineId) {
    const changed = fresh || sail.id !== sailId;
    fresh = false;
    sail = sailById[sailId];
    line = sail.lines.find((l) => l.id === lineId) || sail.lines.find((l) => l.id === sail.start);
    history.replaceState(null, '', `#${sail.id}/${line.id}`);

    if (changed) {
      document.getElementById('title').textContent = sail.title;
      document.title = `${sail.title}: rigging a 74`;
      document.getElementById('notice').innerHTML = sail.notice || '';
      document.querySelectorAll('#sails button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.sail === sail.id));
      const other = document.getElementById('other-sails');
      if (other) other.value = sail.tier ? '' : sail.id;
      renderChips();
      figures.forEach((f) => f.set({ sail, lines: sail.lines, selected: line }));
    } else {
      figures.forEach((f) => f.select(line));
    }
    document.querySelectorAll('#lines button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.id === line.id));
    renderPanel();
  }

  function fromHash() {
    const [sailId, lineId] = location.hash.slice(1).split('/');
    select(sailById[sailId] ? sailId : 'main-topsail', lineId);
  }

  // Each figure can be enlarged to fill the diagram area.
  function setupZoom() {
    const stage = document.getElementById('stage');
    document.querySelectorAll('.fig button').forEach((b) => {
      b.addEventListener('click', () => {
        const name = b.closest('.fig').id.replace('view-', '');
        const on = stage.dataset.zoom !== name;
        if (on) stage.dataset.zoom = name;
        else delete stage.dataset.zoom;
        document.querySelectorAll('.fig button').forEach((o) => (o.textContent = o === b && on ? 'Show all three' : 'Enlarge'));
      });
    });
  }

  renderPicker();
  document.getElementById('matrix').innerHTML = T.matrix(MATRIX, '');
  for (const name of ['aft', 'side', 'plan']) {
    figures.push(window.RIGFIG.create(document.querySelector(`#view-${name} svg`), { view: name, sail, lines: sail.lines, onPick: (l) => select(sail.id, l.id) }));
  }
  setupZoom();
  window.addEventListener('hashchange', () => {
    fromHash();
    document.getElementById('title').scrollIntoView();
  });
  fromHash();
})();

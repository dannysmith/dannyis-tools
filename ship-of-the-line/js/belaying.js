// The belaying plan: every line that comes down, plotted where it is made
// fast, with a list beside the drawing grouped by part of the ship. Choosing a
// line shows its whole lead; the filters narrow both the drawing and the list.

(function () {
  const { SAILS, G } = window.RIGDATA;
  const T = window.RIGTEXT;

  // Where on the ship a belaying point is, from its position.
  const PLACES = ['Forecastle', 'Waist and gangways', 'Upper deck, a level below', 'Quarterdeck', 'Poop', 'In the tops'];
  function place(line) {
    const p = line.path[line.path.length - 1].p;
    if (line.belay.level === 'aloft') return 'In the tops';
    if (line.belay.level === 'upper') return 'Upper deck, a level below';
    if (p[0] < G.forecastleAft) return 'Forecastle';
    if (p[0] < G.quarterdeckFore) return 'Waist and gangways';
    if (p[0] < G.poopFore) return 'Quarterdeck';
    return 'Poop';
  }

  // Lines of the same kind on different sails share a filter: "Braces",
  // "Bowlines and bridles" and "Bowlines" all count as bowlines.
  function kind(line) {
    const n = line.name.toLowerCase();
    for (const k of ['halliard', 'brace', 'bowline', 'sheet', 'tack', 'clew', 'buntline', 'leech', 'lift', 'reef', 'brail', 'downhaul', 'jeer', 'truss', 'vang', 'guy']) {
      if (n.includes(k)) return { halliard: 'Halliards', brace: 'Braces', bowline: 'Bowlines', sheet: 'Sheets', tack: 'Tacks', clew: 'Clewlines and clew garnets', buntline: 'Buntlines', leech: 'Leech-lines', lift: 'Lifts', reef: 'Reef tackles', brail: 'Brails', downhaul: 'Downhaulers', jeer: 'Jeers', truss: 'Trusses', vang: 'Vangs', guy: 'Guys' }[k];
    }
    return 'Other';
  }

  const rows = [];
  for (const sail of SAILS) {
    if (sail.alternative) continue;
    for (const line of sail.lines) {
      if (line.path && line.belay) rows.push({ sail, line, place: place(line), kind: kind(line) });
    }
  }

  const state = { mast: 'all', kind: 'all', status: 'all', chosen: null };
  const shown = () => rows.filter((r) => (state.mast === 'all' || r.sail.mast === state.mast) && (state.kind === 'all' || r.kind === state.kind) && (state.status === 'all' || r.line.belay.status === state.status));

  const figs = ['side', 'plan'].map((view) =>
    window.RIGFIG.create(document.querySelector(`#belay-${view}`), { view, sail: SAILS.find((s) => s.id === 'main-topsail'), lines: rows.map((r) => r.line), onPick: (line) => choose(rows.find((r) => r.line === line), true) })
  );

  function filterRow(key, title, options) {
    const div = document.createElement('div');
    div.className = 'chip-row';
    div.innerHTML = `<h3>${title}</h3>`;
    for (const [value, label] of options) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.setAttribute('aria-pressed', state[key] === value);
      b.addEventListener('click', () => {
        state[key] = value;
        div.querySelectorAll('button').forEach((o) => o.setAttribute('aria-pressed', o === b));
        render();
      });
      div.appendChild(b);
    }
    return div;
  }

  function choose(row, scroll) {
    state.chosen = state.chosen === row ? null : row;
    render();
    if (scroll && state.chosen) document.getElementById('row-' + rows.indexOf(row)).scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function render() {
    const visible = shown();
    if (state.chosen && !visible.includes(state.chosen)) state.chosen = null;
    const chosen = state.chosen;
    // With many lines and none chosen, the leads fade so the points can be read.
    figs.forEach((f) => f.el.classList.toggle('quiet', !chosen && visible.length > 40));
    figs.forEach((f) => f.set({ sail: chosen ? chosen.sail : f.sail, lines: visible.map((r) => r.line), selected: chosen ? chosen.line : null }));

    const list = document.getElementById('belay-list');
    list.replaceChildren();
    const count = document.createElement('p');
    count.className = 'count';
    const guessed = visible.filter((r) => r.line.belay.status === 'inferred').length;
    count.textContent = `${visible.length} lines shown. ${guessed} of them belay at a point the period sources do not name.` + (visible.length > 40 ? ' Narrow the list, or choose a line, to see leads clearly.' : '');
    list.appendChild(count);
    for (const name of PLACES) {
      const here = visible.filter((r) => r.place === name);
      if (!here.length) continue;
      const h = document.createElement('h3');
      h.textContent = name;
      list.appendChild(h);
      for (const r of here) {
        const item = document.createElement('article');
        item.className = 'belay-row' + (r === chosen ? ' active' : '');
        item.id = 'row-' + rows.indexOf(r);
        const title = r.sail.title.replace(/^The /, '');
        const guess = r.line.belay.status === 'inferred' ? '<span class="tag">not named</span>' : '';
        item.innerHTML = `<button type="button"><b>${title[0].toUpperCase() + title.slice(1)}: ${r.line.name.toLowerCase()}</b><span>${guess}${r.line.belay.short}</span></button>`;
        item.querySelector('button').addEventListener('click', () => choose(r));
        if (r === chosen) {
          const d = document.createElement('div');
          d.className = 'belay-detail';
          d.innerHTML = T.belay(r.line) + T.field('Its lead', T.lead(r.line)) + T.sources(r.line);
          item.appendChild(d);
        }
        list.appendChild(item);
      }
    }
  }

  const filters = document.getElementById('belay-filters');
  const kinds = [...new Set(rows.map((r) => r.kind))].sort((a, b) => (a === 'Other') - (b === 'Other') || a.localeCompare(b));
  filters.append(
    filterRow('mast', 'Mast', [['all', 'All'], ['fore', 'Fore'], ['main', 'Main'], ['mizen', 'Mizen']]),
    filterRow('kind', 'Kind of line', [['all', 'All']].concat(kinds.map((k) => [k, k]))),
    filterRow('status', 'Evidence', [['all', 'All'], ['period', 'Named in a period source'], ['inferred', 'Not named: my inference']])
  );
  render();
})();

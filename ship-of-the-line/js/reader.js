// The reading page. Each chapter pins a drawing beside a column of steps; the
// step nearest the middle of the window is the active one, and the drawing
// shows its line. Clicking a step, or a line in the drawing, does the same.

(function () {
  const { SAILS, STORY, MATRIX } = window.RIGDATA;
  const { create, aftBox } = window.RIGFIG;
  const T = window.RIGTEXT;

  const sailById = Object.fromEntries(SAILS.map((s) => [s.id, s]));
  const lineOf = (sailId, lineId) => sailById[sailId].lines.find((l) => l.id === lineId);
  const VIEW_NAMES = ['aft', 'side', 'plan'];
  const CAPTIONS = {
    aft: 'From astern, looking forward; starboard is on the right. Lines that leave for another mast are cut short.',
    side: 'Profile above and deck plan below, bow to the right. The yards are drawn square.',
  };

  // Which views suit a line: one that runs along the ship needs the profile
  // and plan; one that stays at its mast is clearest from astern.
  function viewsFor(line) {
    if (line.views) return { views: line.views, crop: line.crop };
    const points = (line.path || []).map((n) => n.p).concat(...(line.extra || []));
    if (!points.length) return { views: ['aft'], crop: 'sail' };
    const xs = points.map((p) => p[0]);
    if (Math.max(...xs) - Math.min(...xs) > 30) return { views: ['side', 'plan'] };
    return { views: ['aft'], crop: line.path ? 'mast' : 'sail' };
  }

  // A sail whose lines are not running rigging can reword the headings with
  // `labels: { lead, fitted, belay, worked, more }`.
  function lineStep(line, title, labels = {}) {
    const more = (line.rope ? `<p>${line.rope}</p>` : '') + T.notes(line) + T.sources(line);
    return (
      `<h4>${title || line.name}</h4>${T.also(line)}<p>${line.does}</p>` +
      T.field(line.path ? labels.lead || 'Its lead, to where it belays' : labels.fitted || 'Its lead', T.lead(line)) +
      T.field('Purchase', line.purchase && `<p>${line.purchase}</p>`) +
      T.field(labels.belay || 'Where it belays', T.belay(line)) +
      T.field(labels.worked || 'When it is worked', line.worked && `<p>${line.worked}</p>`) +
      `<details><summary>${labels.more || (line.rope ? 'Rope, notes and sources' : 'Notes and sources')}</summary>${more}</details>`
    );
  }

  function activate(ch, step) {
    if (ch.active === step) return;
    if (ch.active) ch.active.el.classList.remove('active');
    ch.active = step;
    step.el.classList.add('active');
    ch.caption.textContent = CAPTIONS[step.views[0]];
    for (const name of VIEW_NAMES) {
      const fig = ch.figs[name];
      fig.el.toggleAttribute('hidden', !step.views.includes(name));
      fig.set({ sail: step.sail, lines: step.rest, selected: step.line, marked: step.marked, box: name === 'aft' ? aftBox(step.sail, step.crop) : null });
    }
  }

  const watcher = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) activate(e.target.chapter, e.target.step);
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  function buildChapter(spec, number) {
    const section = document.createElement('section');
    section.className = 'chapter';
    section.id = spec.id;
    section.innerHTML = `
      <header><p class="chapter-no">Part ${number}</p><h2>${spec.title}</h2>${spec.intro}</header>
      <div class="cols">
        <div class="pinned">
          <svg data-view="aft" role="img" aria-label="The mast seen from astern"></svg>
          <svg data-view="side" role="img" aria-label="The ship in profile"></svg>
          <svg data-view="plan" role="img" aria-label="Deck plan"></svg>
          <p class="caption"></p>
        </div>
        <div class="steps"></div>
      </div>`;
    const ch = { figs: {}, caption: section.querySelector('.caption'), steps: [], active: null };
    const column = section.querySelector('.steps');

    for (const group of spec.groups) {
      const head = document.createElement('div');
      head.className = 'job';
      head.innerHTML = `<h3>${group.title}</h3>${group.intro ? `<p>${group.intro}</p>` : ''}`;
      column.appendChild(head);
      for (const s of group.steps) {
        const sail = sailById[s.sail || spec.sail];
        const line = s.line ? lineOf(sail.id, s.line) : null;
        const auto = line ? viewsFor(line) : { views: sail.views || ['side', 'plan'] };
        const restSpec = s.rest || group.rest;
        const step = {
          sail, line,
          views: s.views || auto.views,
          crop: s.crop || auto.crop,
          rest: restSpec ? restSpec.map(([a, b]) => lineOf(a, b)) : sail.lines,
          marked: (s.mark || []).map(([a, b]) => lineOf(a, b)),
          el: document.createElement('article'),
        };
        step.el.className = 'step';
        step.el.innerHTML = line ? lineStep(line, s.title, sail.labels) : s.html;
        step.el.chapter = ch;
        step.el.step = step;
        step.el.addEventListener('click', () => activate(ch, step));
        column.appendChild(step.el);
        ch.steps.push(step);
        watcher.observe(step.el);
      }
    }

    // A line clicked in the drawing brings its step to the middle of the window.
    const pick = (line) => {
      const step = ch.steps.find((s) => s.line === line);
      if (step) step.el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };
    const first = ch.steps[0];
    for (const name of VIEW_NAMES) {
      ch.figs[name] = create(section.querySelector(`svg[data-view=${name}]`), { view: name, sail: first.sail, lines: first.rest, onPick: pick });
    }
    document.getElementById('story').appendChild(section);
    activate(ch, first);
  }

  STORY.forEach((spec, i) => buildChapter(spec, i + 1));
  const summary = document.getElementById('summary');
  document.getElementById('contents').innerHTML =
    STORY.map((c) => `<li><a href="#${c.id}">${c.title}</a></li>`).join('') + (summary ? `<li><a href="#summary">${summary.querySelector('h2').textContent}</a></li>` : '');
  const matrix = document.getElementById('matrix');
  if (matrix) matrix.innerHTML = T.matrix(MATRIX, 'explorer.html');
})();

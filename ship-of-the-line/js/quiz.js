// The quiz. Questions are made from the same records the rest of the tutorial
// draws from, so every answer can be checked against its page: where a line
// belays, what a line is for, which sails carry a line, and which lines are
// worked at an order.

(function () {
  const { SAILS, MATRIX, MANOEUVRES } = window.RIGDATA;

  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const shuffle = (list) => list.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
  const sailName = (s) => s.title.replace(/^The /, 'the ');
  // An order often lets go a line on one side and hauls its partner on the other.
  const lineById = (pair) => {
    const sail = SAILS.find((s) => s.id === pair[0]);
    const line = sail && sail.lines.find((l) => l.id === pair[1]);
    return line ? { sail, line, side: pair[2] } : null;
  };
  const label = (r) => `${sailName(r.sail).replace(/^the /, '')}: ${r.side ? r.side + ' ' : ''}${r.line.name.toLowerCase()}`;
  const firstSentence = (text) => text.split(/(?<=[.!?])\s/)[0];

  // Each maker returns { prompt, options: [{ text, right }], many, why, link }.
  const MAKERS = {
    belay: {
      name: 'Where does it belay?',
      make() {
        const all = SAILS.filter((s) => !s.alternative).flatMap((sail) => sail.lines.filter((l) => l.path && l.belay && l.belay.status === 'period').map((line) => ({ sail, line })));
        const q = pick(all);
        const wrong = shuffle([...new Set(all.map((r) => r.line.belay.short))].filter((s) => s !== q.line.belay.short)).slice(0, 3);
        return {
          prompt: `Where do ${sailName(q.sail)}’s ${q.line.name.toLowerCase()} belay?`,
          options: shuffle([{ text: q.line.belay.short, right: true }].concat(wrong.map((text) => ({ text })))),
          why: q.line.belay.text,
          link: `explorer.html#${q.sail.id}/${q.line.id}`,
        };
      },
    },
    purpose: {
      name: 'Which line is this?',
      make() {
        const sail = pick(SAILS.filter((s) => !s.alternative && s.lines.length >= 6));
        const line = pick(sail.lines);
        const wrong = shuffle(sail.lines.filter((l) => l !== line)).slice(0, 3);
        // Hide the line's own name where the description uses it.
        const words = line.name.split(/,| and /)[0].trim().toLowerCase().replace(/s$/, '');
        const clue = firstSentence(line.does).replace(new RegExp(words + 's?', 'gi'), '…');
        return {
          prompt: `On ${sailName(sail)}: “${clue}” Which is it?`,
          options: shuffle([{ text: line.name, right: true }].concat(wrong.map((l) => ({ text: l.name })))),
          why: line.does,
          link: `explorer.html#${sail.id}/${line.id}`,
        };
      },
    },
    carries: {
      name: 'Which sails have it?',
      make() {
        const rows = MATRIX.rows.filter(([, cells]) => cells.includes('y') && cells.includes('n'));
        const [name, cells, note] = pick(rows);
        const options = MATRIX.columns.map((c, i) => ({ text: c.name, right: cells[i] === 'y', unsure: cells[i] === '?' || cells[i] === ' ' })).filter((o) => !o.unsure);
        return {
          prompt: `Which of these carry ${name.toLowerCase()}? Choose all that do.`,
          options,
          many: true,
          why: note || 'See the table of sails against lines.',
          link: 'square-sails.html#summary',
        };
      },
    },
    orders: {
      name: 'What happens at the order?',
      make() {
        const steps = (MANOEUVRES || []).flatMap((m) => m.steps.map((step) => ({ m, step }))).filter(({ step }) => step.order && step.spoken !== false && (step.haul || []).length + (step.letGo || []).length >= 2);
        if (!steps.length) return null;
        const { m, step } = pick(steps);
        const hauled = (step.haul || []).map(lineById).filter(Boolean);
        const freed = (step.letGo || []).map(lineById).filter(Boolean);
        const ask = hauled.length && (!freed.length || Math.random() < 0.5) ? 'hauled' : 'let go';
        const right = ask === 'hauled' ? hauled : freed;
        const others = ask === 'hauled' ? freed : hauled;
        // Where the order names a side, the wrong answers do too.
        const sided = right.concat(others).some((r) => r.side);
        const pool = SAILS.filter((x) => x.tier).flatMap((sail) => sail.lines.filter((l) => l.path).map((line) => ({ sail, line, side: sided && line.mirror !== false ? pick(['starboard', 'larboard']) : undefined })));
        const used = new Set(right.concat(others).map(label));
        const distract = shuffle(pool.filter((r) => !used.has(label(r)))).slice(0, Math.max(2, 6 - right.length - others.length));
        return {
          prompt: `${m.title}. The order is “${step.order}”. Which of these are ${ask}? Choose all that are.`,
          options: shuffle(right.map((r) => ({ text: label(r), right: true })).concat(others.concat(distract).map((r) => ({ text: label(r) })))),
          many: true,
          why: (step.text || '').split('</p>')[0].replace(/<[^>]+>/g, ''),
          link: `manoeuvres.html#${m.id}`,
        };
      },
    },
  };

  const state = { kinds: new Set(Object.keys(MAKERS)), asked: 0, right: 0, q: null, done: false };
  const el = (id) => document.getElementById(id);

  function next() {
    let q = null;
    for (let i = 0; i < 20 && !q; i++) q = MAKERS[pick([...state.kinds])].make();
    state.q = q;
    state.done = false;
    const box = el('question');
    box.innerHTML = `<p class="prompt">${q.prompt}</p><div class="options"></div><div class="after"></div>`;
    const options = box.querySelector('.options');
    q.options.forEach((o, i) => {
      const id = 'opt' + i;
      options.insertAdjacentHTML('beforeend', `<label for="${id}"><input type="${q.many ? 'checkbox' : 'radio'}" name="opt" id="${id}" value="${i}"><span>${o.text}</span></label>`);
    });
    box.querySelector('.after').innerHTML = '<button type="button" id="check">Check the answer</button>';
    el('check').addEventListener('click', check);
  }

  function check() {
    if (state.done) return;
    const q = state.q;
    const chosen = new Set([...document.querySelectorAll('#question input:checked')].map((i) => Number(i.value)));
    if (!chosen.size) return;
    state.done = true;
    const ok = q.options.every((o, i) => !!o.right === chosen.has(i));
    state.asked++;
    if (ok) state.right++;
    document.querySelectorAll('#question label').forEach((l, i) => {
      l.classList.add(q.options[i].right ? 'is-right' : chosen.has(i) ? 'is-wrong' : 'is-neutral');
      l.querySelector('input').disabled = true;
    });
    document.querySelector('#question .after').innerHTML =
      `<p class="verdict ${ok ? 'good' : 'bad'}">${ok ? 'Right.' : 'Not quite.'}</p><p>${q.why}</p>` +
      `<p><a href="${q.link}">See it in the tutorial</a></p><button type="button" id="next">Next question</button>`;
    el('next').addEventListener('click', next);
    el('next').focus();
    el('score').textContent = `${state.right} right of ${state.asked}`;
  }

  const kinds = el('kinds');
  for (const key in MAKERS) {
    if (!MAKERS[key].make()) continue;
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = MAKERS[key].name;
    b.setAttribute('aria-pressed', 'true');
    b.addEventListener('click', () => {
      if (state.kinds.has(key) && state.kinds.size > 1) state.kinds.delete(key);
      else state.kinds.add(key);
      b.setAttribute('aria-pressed', state.kinds.has(key));
    });
    kinds.appendChild(b);
  }
  if (!MAKERS.orders.make()) state.kinds.delete('orders');
  next();
})();

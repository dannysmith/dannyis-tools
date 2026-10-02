// Turns a line's record into the written description shown beside the
// drawings: what it does, its lead step by step, and where it belays.

(function () {
  // Where a cited page can be read online.
  function sourceLink(ref) {
    const [kind, ...rest] = ref.split(' ');
    const what = rest.join(' ');
    if (kind === 'S') {
      const part = Number(what) <= 193 ? 'part6' : 'part7';
      return { text: `Steel 1794, p. ${what}`, href: `https://maritime.org/doc/steel/${part}.htm#pg${what}` };
    }
    if (kind === 'S74') {
      return { text: `Steel, rigging table for a 74, p. ${what}`, href: `https://maritime.org/doc/steel/tables/pages/0${what}-ShipOf74Guns.htm` };
    }
    if (kind === 'L') {
      return { text: `Lever 1819, p. ${what}`, href: 'https://archive.org/details/youngseaofficers00leve_0' };
    }
    if (kind === 'F') {
      return { text: `Falconer 1769, “${what}”`, href: 'https://www.gutenberg.org/files/57705/57705-h/57705-h.htm' };
    }
    // Any other source, written out in full: "X Moore 1801, FURLING|https://…"
    const [text, href] = what.split('|');
    return { text, href };
  }

  const field = (title, html) => (html ? `<h5>${title}</h5>${html}` : '');

  function lead(line) {
    if (!line.path) return line.lead ? `<p>${line.lead}</p>` : '';
    const items = line.path.filter((n) => n.step).map((n) => `<li${n.inferred ? ' class="inferred"' : ''}>${n.step}</li>`).join('');
    return `<ol class="lead">${items}</ol>`;
  }

  function belay(line) {
    if (!line.belay) return '';
    const tag = line.belay.status === 'inferred' ? '<span class="tag">not in the period sources</span>' : '';
    return `<p>${tag}${line.belay.text}</p>`;
  }

  function sources(line) {
    return `<p class="refs">${line.sources.map(sourceLink).map((s) => (s.href ? `<a href="${s.href}">${s.text}</a>` : s.text)).join('; ')}.</p>`;
  }

  const notes = (line) => (line.notes && line.notes.length ? line.notes.map((n) => `<p>${n}</p>`).join('') : '');
  const also = (line) => (line.also ? `<p class="also">Also ${line.also}</p>` : '');

  // The table of sails against lines. Sail names link to the lookup page.
  function matrix(data, page) {
    const mark = { y: ['●', 'fitted'], n: ['–', 'not fitted'], '?': ['?', 'sources disagree or are silent'], ' ': ['', ''] };
    const head = data.columns.map((c) => `<th scope="col"><a href="${page}#${c.sail}">${c.name}</a></th>`).join('');
    const body = data.rows.map(([name, cells, note]) => {
      const tds = cells.split('').map((c) => `<td class="m-${c === '?' ? 'q' : c.trim() || 'x'}" title="${mark[c][1]}">${mark[c][0]}</td>`).join('');
      return `<tr><th scope="row">${name}</th>${tds}<td class="note">${note}</td></tr>`;
    }).join('');
    return `<thead><tr><td></td>${head}<td></td></tr></thead><tbody>${body}</tbody>`;
  }

  window.RIGTEXT = { matrix, field, lead, belay, sources, notes, also, sourceLink };
})();

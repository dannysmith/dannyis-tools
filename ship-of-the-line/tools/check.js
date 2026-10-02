// Checks the tutorial's data without a browser. Run: node tools/check.js
//
// Loads every data file as the pages do and verifies that leads are well
// formed, that everything a story, manoeuvre or matrix refers to exists, and
// that every page's script and stylesheet tags point at real files.

const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const problems = [];
const bad = (msg) => problems.push(msg);

global.window = global;
// The glossary file also draws its page when there is one; here there is none.
global.document = { getElementById: () => null };
const load = (file) => require(path.join(root, 'js', file));
['data.js', 'sails-courses.js', 'sails-topsails.js', 'sails-upper.js', 'sails-foreaft.js', 'sails-studding.js', 'standing.js', 'matrix.js', 'manoeuvres-data.js', 'glossary.js'].forEach(load);

const { SAILS, MATRIX, MANOEUVRES, GLOSSARY } = window.RIGDATA;
const find = (sailId, lineId) => {
  const sail = SAILS.find((s) => s.id === sailId);
  return sail && sail.lines.find((l) => l.id === lineId);
};
const point = (p) => Array.isArray(p) && p.length === 3 && p.every((v) => typeof v === 'number' && Number.isFinite(v));

// Sails and lines.
const seen = new Set();
for (const sail of SAILS) {
  if (seen.has(sail.id)) bad(`duplicate sail id ${sail.id}`);
  seen.add(sail.id);
  if (!sail.mast) bad(`${sail.id}: no mast`);
  for (const poly of sail.cloth || []) if (!poly.every(point)) bad(`${sail.id}: bad cloth point`);
  const ids = new Set();
  for (const line of sail.lines) {
    const at = `${sail.id}/${line.id}`;
    if (ids.has(line.id)) bad(`${at}: duplicate line id`);
    ids.add(line.id);
    if (!line.name || !line.does) bad(`${at}: missing name or does`);
    if (!line.sources || !line.sources.length) bad(`${at}: no sources`);
    for (const list of [(line.path || []).map((n) => n.p)].concat(line.extra || [])) if (!list.every(point)) bad(`${at}: bad point`);
    if (line.path) {
      if (line.path[line.path.length - 1].mark !== 'belay') bad(`${at}: path does not end in a belay`);
      if (!line.belay) bad(`${at}: path without a belay record`);
    } else if (!line.lead && !line.extra) bad(`${at}: nothing to show (no path, lead or extra)`);
  }
  if (sail.start && !ids.has(sail.start)) bad(`${sail.id}: start line ${sail.start} missing`);
}

// Stories: each sets RIGDATA.STORY, so load them one at a time.
for (const file of fs.readdirSync(path.join(root, 'js')).filter((f) => /^story.*\.js$/.test(f))) {
  load(file);
  for (const chapter of window.RIGDATA.STORY) {
    for (const group of chapter.groups) {
      const refs = (group.rest || []).slice();
      for (const step of group.steps) {
        const sailId = step.sail || chapter.sail;
        if (!SAILS.find((s) => s.id === sailId)) bad(`${file} ${chapter.id}: unknown sail ${sailId}`);
        if (step.line) refs.push([sailId, step.line]);
        if (!step.line && !step.html) bad(`${file} ${chapter.id}: step with neither line nor html`);
        refs.push(...(step.rest || []), ...(step.mark || []));
      }
      for (const [a, b] of refs) if (!find(a, b)) bad(`${file} ${chapter.id}: unknown line ${a}/${b}`);
    }
  }
}

// Manoeuvres, matrix, glossary.
for (const m of MANOEUVRES) {
  for (const step of m.steps) {
    for (const kind of ['haul', 'letGo', 'ease', 'show']) {
      for (const [a, b] of step[kind] || []) if (!find(a, b)) bad(`manoeuvre ${m.id} “${step.order}”: unknown line ${a}/${b}`);
    }
  }
}
for (const c of MATRIX.columns) if (!SAILS.find((s) => s.id === c.sail)) bad(`matrix: unknown sail ${c.sail}`);
for (const [name, cells] of MATRIX.rows) if (cells.length !== MATRIX.columns.length) bad(`matrix row ${name}: ${cells.length} cells`);
const terms = new Set();
for (const g of GLOSSARY) {
  const id = window.RIGDATA.glossaryId(g.term);
  if (terms.has(id)) bad(`glossary: duplicate ${id}`);
  terms.add(id);
}

// Pages: every local script, stylesheet and page link resolves.
const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  for (const [, ref] of html.matchAll(/(?:src|href)="([^"#:]+)(?:#[^"]*)?"/g)) {
    if (!fs.existsSync(path.join(root, ref))) bad(`${page}: missing ${ref}`);
  }
}

const lines = SAILS.reduce((n, s) => n + s.lines.length, 0);
console.log(`${SAILS.length} sails, ${lines} lines, ${MANOEUVRES.length} manoeuvres, ${GLOSSARY.length} glossary terms, ${pages.length} pages`);
if (problems.length) {
  console.log(problems.join('\n'));
  process.exit(1);
}
console.log('No problems found.');

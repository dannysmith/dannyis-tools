# Building a page of the tutorial

Read this before adding a page. `square-sails.html` with `js/story.js` and `js/sails-topsails.js` is the worked example; copy its patterns.

## What the reader wants

The brief is `brief.md`. The reader knows the names of masts, sails and standing rigging from Hornblower-type novels and wants the running rigging and sail handling explained properly, in order, with drawings he can follow. He liked: a drawing pinned beside the text that follows what he is reading, numbered points on the drawing matching numbered steps in the text, period quotations, and honesty about what the sources do not say.

## Ground rules for content

- Reference ship: Steel's 74 (1794 tables), rigged as of about 1805. Where 1794 and 1805 differ, say so.
- Every fact comes from the research notes in `research/` (which cite their sources) or from a source you read yourself. Do not write from general knowledge without saying so. Where the sources disagree or are silent, say that in the text; never pick silently.
- Quote Lever from the 1819 text (`archive.org/details/youngseaofficers00leve_0`). The 1843 American edition is rewritten to later practice. Some research notes quoted the 1843 scan; anything that mentions iron, chain, jackstays or "Am. Ed." is suspect.
- Luce, Totten, Dana, Nares and other post-1830 manuals may be used for the wording of orders, but label them as later and as USN or merchant where they are.
- Period terms and spellings, with variants shown once (clewline/clue-line, halliard/haliard/halyard).
- No anachronisms: no double topsails, wire, iron fittings, jackstays (before 1811), long bulwark pin rails, or mast-foot "fife rails".
- Positions that the sources do not give are marked `inferred: true` so they draw dashed. Say in the step text that it is a guess.

## Writing style

- Plain, direct sentences. Sentence case headings. No hard-wrapped paragraphs in source.
- Explain by what a thing does and in what order it is handled, not by listing.
- No filler, no hype, no "it's worth noting". No time estimates. Curly quotes and apostrophes in text (“ ” ’).
- Headings say something ("The fore tack goes outside the ship"), not labels.

## Files and ownership

Shared files, which you must not edit: `css/style.css`, `js/data.js`, `js/context.js`, `js/figure.js`, `js/describe.js`, `js/reader.js`, `js/site.js`, `js/story.js`, `js/sails-*.js` that already exist, `js/matrix.js`, `js/explorer.js`. If you need something they do not provide, put it in your own files and say so in your report.

Your page gets its own HTML file, its own data and script files under `js/`, and if needed its own stylesheet under `css/`, all named after the page.

## Coordinates

Feet. `[x, y, z]` = distance abaft the stem, distance to starboard of the centreline, height above the waterline. `js/data.js` has the geometry in `RIGDATA.MASTS` (fore, main, mizen: mast station `x`, heights of top, cap, crosstrees, yards; half-lengths of yards; channel and rail positions; deck height) and `RIGDATA.G` (deck levels, forecastle and quarterdeck limits, `bowspritCap`, `jibboomEnd`, `gaffPeak`). Read it. Useful fixed points used elsewhere:

- Decks above water: upper deck 10, forecastle and quarterdeck 18, poop 25. Forecastle runs x 7–53, waist 53–95, quarterdeck from 95, poop from 135.5, taffrail 188.
- Bitts: before the foremast `[17.4, ±2, 19.5]`, abaft it `[24.5, ±2, 19.5]`; main topsail-sheet bitts (upper deck) `[93.2, ±2, 12.5]`, main jeer bitts `[91.4, ±3, 12.5]`; fore-brace bitts on the quarterdeck `[102.6, ±2, 19.5]`; mizen topsail-sheet bitts on the poop `[152.6, ±2, 26.3]`.
- Belfry `[51.6, 0, 21]`. Forecastle breast-rail x 52.6; quarterdeck breast-rail x 95.4. Fife-rail (the open side rail of quarterdeck and poop) y ±20.8, z 22.6.
- Bowsprit runs from `[4, 0, 21]` to the cap at `[-40, 0, 46]`; jibboom from `[-27, 0, 40]` to `[-72, 0, 60]`; dolphin striker hangs from the cap to `[-41.5, 0, 35]`. Boomkin ends `[-6, ±9, 20]`. Catheads about `[9, ±17, 21.5]`.
- Stays: main stay from `[97.8, 0, 80]` to `[22, 0, 22]`; main topmast stay `[97.8, 0, 137]` to `[21, 0, 80]`; fore stay `[19.6, 0, 72]` to `[-30, 0, 40]`; fore topmast stay `[19.6, 0, 123]` to `[-39, 0, 46]`; mizen stay `[149.6, 0, 69]` to `[99, 0, 26]`; mizen topmast stay `[149.6, 0, 112]` to `[99, 0, 80]`.
- Gaff from `[151, 0, 60]` to the peak `[178, 0, 80]`; driver boom from `[151, 0, 33]` to `[193, 0, 37]`.

Heights are estimates, good to a few feet. Keep new points consistent with these.

## Sails and lines

A sail is `{ id, mast, title, lines, start, notice? }` pushed on to `RIGDATA.SAILS`. The square sails also have `tier`. Anything else (staysail, studding sail, driver, or a pseudo-sail such as "standing rigging") instead carries:

- `cloth`: a list of polygons, each a list of `[x, y, z]` points, drawn as the sail in every view.
- `spars`: a list of `{ a, b, w }` (ends in feet, width in feet) for spars of its own, such as booms.
- `mast`: still required (`'fore' | 'main' | 'mizen'`); it sets which mast the view from astern shows.
- `alternative: true` on a sail that is not part of the ship as drawn (an earlier or rival fitting), so the belaying plan and quiz leave it out.
- `labels: { lead, fitted, belay, worked, more }` to reword the headings of each step, for lines that are not running rigging (see `js/standing.js`).
- `views`: default views for steps with no line, e.g. `['side', 'plan']`.
- `aftBox`, `sideBox`, `planBox`: an SVG viewBox for that view, for a sail that reaches outside the usual frame.

A line is:

```js
{
  id: 'sheets', group: 'sail',            // group: 'yard' | 'sail' | 'occasional'
  name: 'Sheets', also: 'variant spellings',
  does: 'What it is for, in a paragraph.',
  path: [                                  // starboard lead, from made fast to belay
    { p: [x, y, z], mark: 'fast',  step: 'Sentence for the numbered list.' },
    { p: [x, y, z], mark: 'block', step: '…' },
    { p: [x, y, z] },                      // a bend with no step: not numbered
    { p: [x, y, z], mark: 'belay', inferred: true, step: '…' },
  ],
  extra: [[[x, y, z], [x, y, z]]],         // decoration: bridle legs, a horse, a reef band
  mirror: false,                           // omit to draw a larboard copy
  views: ['side', 'plan'], crop: 'mast',   // optional; otherwise chosen from the lead's extent
  cls: 'standing-rig',                     // optional; draws dark like standing rigging
  lead: 'Used instead of path when there is nothing to draw.',
  purchase: '…',
  belay: { short: 'Label on the deck plan', level: 'weather' | 'upper' | 'aloft', status: 'period' | 'inferred', text: '…' },
  worked: 'When and how it is handled, with the order if known.',
  rope: 'Size from Steel’s table, if read.',
  notes: ['Disagreements, variants.'],
  sources: ['S 205', 'L 38', 'S74 36', 'F LIFTS', 'X Moore 1801, FURLING|https://…'],
}
```

Marks: `fast` (made fast), `block`, `lead` (a sheave, thimble or fairlead), `belay`. A line with a `path` must end in a `belay` node and have a `belay` record. `level: 'upper'` means the upper deck, below the forecastle and quarterdeck.

Sources: `S n` = Steel 1794 page n (links to maritime.org part 6 for pages up to 193, part 7 above); `S74 n` = his rigging table for a 74, table page n; `L n` = Lever 1819 page n; `F HEADWORD` = Falconer 1769; `X text|url` = anything else, written out.

## A reading page

`js/reader.js` builds the page from `RIGDATA.STORY`, an array of chapters:

```js
{ id, title, sail: 'default-sail-id', intro: '<p>…</p>',
  groups: [{ title, intro, rest: [[sailId, lineId], …]?, steps: [
    { line: 'sheets' },                              // a line of the chapter's sail
    { sail: 'other-sail', line: 'braces', title: 'Heading override' },
    { html: '<h4>…</h4><p>…</p>', views: ['side', 'plan'], mark: [[sailId, lineId], …] },   // prose; `mark` picks out several lines
  ] }] }
```

`rest` sets which lines are drawn quietly behind the selected one (default: all lines of the step's sail). Views are `aft` (one mast from astern), `side` and `plan` (always shown together). `crop` for `aft` on a square sail is `'sail'` or `'mast'`.

The HTML is a copy of `square-sails.html`: `<nav id="site">`, the masthead with `<ol id="contents">`, the legend, `<main id="story">`, closing prose, `<nav id="pager">`, then the scripts in this order: `site.js`, `data.js`, every `sails-*.js` whose lines you refer to, your story file (which sets `RIGDATA.STORY`), `context.js`, `figure.js`, `describe.js`, `reader.js`. Leave out the matrix section unless you have one.

## A page of another kind

If the reading-page pattern does not fit, build your own script, but use the same stylesheet, fonts and colour tokens (`css/style.css`, top of file), put drawings in inline SVG, and keep the page readable top to bottom with any interaction beside the text it belongs to. `RIGFIG.create(svg, { view, sail, lines, onPick })` gives you a ship drawing with lines on it; `fig.set({ marked: [line, …] })` picks out several lines at once; an entry may be `{ line, cls, side }` to give it a class or show only its `'starboard'` or `'larboard'` copy (see `js/manoeuvres.js`).

## Checking

- `node tools/check.js` checks all the data and every page's links. Add your data files to its list.
- `tools/shots.sh` screenshots every page in a real browser.
- `node --check` every script.
- Load your data files in node with `global.window = {}` and check that every path point is three finite numbers, every path ends in a belay, and every line has `does` and `sources`.
- The page must work opened from `file://`: classic scripts only, no modules, no fetch, no build step. Do not start a server.
- If you can drive a browser, look at the page at 1440×900 and at phone width and fix what you see. If you cannot, say so in your report.

## Report back

A short summary: what you built, which files, what is inferred or thin, anything in the shared files that got in your way, and what you could not verify.

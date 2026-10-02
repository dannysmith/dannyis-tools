# Ship of the line rigging tutorial

Interactive tutorial on the running rigging and sail handling of a Royal Navy 74, published at <https://tools.danny.is/ship-of-the-line/>. Open `index.html` directly in a browser; there is no build step or server.

## Pages

| Page                  | What it covers (brief section)                                          |
| --------------------- | ----------------------------------------------------------------------- |
| `index.html`          | Contents, how to read the drawings, what the evidence is                |
| `ship.html`           | Spars and sails reference; standing rigging (1, 2)                      |
| `fundamentals.html`   | Tackles, how yards are held, belaying, the ship's company (3)           |
| `square-sails.html`   | Every line of the square sails, in reading order (4)                    |
| `fore-and-aft.html`   | Headsails, staysails, mizen and driver, spritsail (5)                   |
| `studding-sails.html` | Booms, gear, setting and taking in (6)                                  |
| `belaying.html`       | Where every line comes down, with filters (7)                           |
| `handling.html`       | Steering, helm orders, points of sail, leeway (9, 10)                   |
| `manoeuvres.html`     | Eighteen evolutions stepped through order by order (8)                  |
| `quiz.html`           | Questions generated from the same records                               |
| `glossary.html`       | Terms with period spellings and variants                                |
| `explorer.html`       | Lookup: any line of any sail on its own                                 |

## Decisions

- **Reference ship:** Steel's 74 (1794 tables, 1799 tons), rigged as of c. 1805. Where 1794 and 1805 differ, the 1794 state is noted as an alternate.
- **Lever:** quote the 1819 text (`archive.org/details/youngseaofficers00leve_0`). The 1843 American edition linked in the brief is rewritten to later practice.
- **Confidence is drawn:** solid for a lead Steel or Lever describe, dashed and hollow for positions they do not give.
- **Stack:** plain HTML, CSS and classic scripts, so it runs from `file://`.

## Layout

- The original brief and the cited research notes this was built from are kept outside this repository.
- `docs/building-pages.md` is the guide to the data model, coordinates and conventions. Read it before adding or changing a page.
- `js/data.js` has the ship's geometry in feet. `js/sails-*.js` and `js/standing.js` hold every sail and line as records with 3D leads, text and sources.
- `js/context.js` draws the ship, `js/figure.js` draws lines on it, `js/describe.js` writes a line's description. `js/reader.js` runs the reading pages from a `js/story*.js` file. `js/site.js` is the navigation.
- Pages of another kind have their own script and stylesheet named after the page.

## Checking it

- `node tools/check.js` loads all the data and checks that every lead is well formed and that everything a story, manoeuvre, matrix or page refers to exists.
- `tools/shots.sh [dir]` opens every page in a real browser (through `playwright-cli`), saves a screenshot of each at desktop and phone width, and reports script errors and sideways overflow. Under a sandbox the browser will not launch; run it outside.

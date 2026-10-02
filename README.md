# dannyis-tools

Small web tools and mini-sites, served from <https://tools.danny.is/>. Each one lives at `/<name>/` and the home page lists them all, newest first.

There is no manifest. `build.ts` finds the tools, reads their titles and descriptions from their own files and takes the date from git history.

## Adding a tool

A tool takes one of three shapes, which all look the same from the outside.

| Shape           | In the repo                                    | What gets published         |
| --------------- | ---------------------------------------------- | --------------------------- |
| Single file     | `name.html` in the repo root                   | The file                    |
| Directory       | `name/` containing an `index.html`             | The whole directory         |
| With build step | `name/` with a `build` script in `package.json` | `name/dist/` after building |

`example-directory/` and `example-build-step/` are working examples of the last two shapes: the same counter, once in plain HTML, CSS and JavaScript and once in React and TypeScript.

Build steps are run with `bun install` then `bun run build`, and must produce `dist/index.html`. Use relative URLs inside a tool, because it's served from `/name/` and not the domain root. Anything starting with `.` or `_` is ignored.

## What the home page shows

- **Title:** the tool's `<title>`, or its name if there isn't one.
- **Description:** the tool's `<meta name="description">`. A directory tool without one uses the first paragraph of its `README.md` as plain text.
- **Date:** the first commit that touched the tool. Renaming a tool resets it, and uncommitted tools show as "Not committed" at the top.

## Working locally

```sh
bun run serve   # build, serve at http://localhost:3000 and rebuild on changes
bun run build   # build into _site/ and exit
```

## Deployment

Pushing to `main` builds the site and deploys `_site/` to GitHub Pages via `.github/workflows/deploy.yml`.

# dannyis-tools

Small web tools, served from <https://tools.danny.is/>. Each tool lives at `https://tools.danny.is/<name>/` and the home page lists them all, newest first.

There is no manifest. `build.ts` finds the tools, reads their titles and descriptions from the files themselves and takes the "added" date from git history.

## Adding a tool

A tool takes one of three shapes. All three end up at `/<name>/` and look the same from the outside.

| Shape           | In the repo                                    | What gets published         |
| --------------- | ---------------------------------------------- | --------------------------- |
| Single file     | `name.html` in the repo root                   | The file                    |
| Directory       | `name/` containing an `index.html`             | The whole directory         |
| With build step | `name/` with a `build` script in `package.json` | `name/dist/` after building |

For a tool with a build step, the build runs `bun install` then `bun run build` inside the directory and publishes `dist/`, which must contain an `index.html`. Asset URLs in the built output need to be relative, because the tool is served from `/name/` and not from the domain root.

Directories without an `index.html`, and anything starting with `.` or `_`, are ignored. A file and a directory can't share a name.

## What the home page shows

- **Title:** the `<title>` of the tool's `index.html` (or of `name.html`). Falls back to the name.
- **Description:** the `<meta name="description">` of the same file. A directory tool without one falls back to the first paragraph of its `README.md`, used as plain text, so markdown formatting isn't rendered.
- **Date added:** the date of the first commit that touched the file or directory. Renaming a tool resets it.

## Working locally

```sh
bun install     # once, for editor types
bun run serve   # build, serve at http://localhost:3000 and rebuild on changes
bun run build   # build into _site/ and exit
```

Tools which aren't committed yet show as "Not committed" and sort to the top.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and deploys `_site/` to GitHub Pages. The custom domain is set in the repo's Pages settings, with the source set to "GitHub Actions".

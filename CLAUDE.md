# dannyis-tools

A collection of small, self-contained web tools published at <https://tools.danny.is/>. Read `README.md` for the three shapes a tool can take and how the home page gets its metadata.

## Building a tool

- Pick the simplest shape that works: a single `name.html` in the root first, a directory when it needs separate files or images, a build step only when it's really needed.
- Name tools in lowercase kebab-case. The name is the URL.
- Default to plain HTML, CSS and vanilla JavaScript with no dependencies. No frameworks unless asked.
- If a library is needed in a tool without a build step, load it from a CDN with a pinned version.
- Use `<script type="module">`.
- Every tool needs a real `<title>` and a `<meta name="description">`. Both appear on the home page, so write the description as one or two plain sentences saying what the tool does, starting with a verb ("Convert…", "Plan…") rather than "This tool…".
- A directory tool may have a `README.md`. Its first paragraph is only used on the home page when there's no meta description.
- Use relative URLs for everything inside a tool. Tools are served from `/name/`, never from the domain root.
- Tools must work on a phone: include the viewport meta tag and keep inputs at 16px or larger.
- Tools are static. Nothing runs on a server, so never put secrets in them. If a tool needs an API key, ask the user for it at runtime and keep it in `localStorage`.
- Keep each tool independent. Don't share code or assets between tools.

## Tools with a build step

- Use bun. The `build` script in the tool's `package.json` must write to `dist/` and produce `dist/index.html`.
- Commit the tool's lockfile. Never commit `dist/` or `node_modules/`.

## The site itself

- `build.ts` builds everything into `_site/` and `serve.ts` is the local preview. Both use only what ships with bun; keep it that way.
- Don't add a manifest or per-tool config. Metadata comes from the tools' own files and from git.
- After adding or changing a tool run `bun run build` and check it appears correctly in `_site/index.html`.

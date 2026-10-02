# dannyis-tools

Small, self-contained web tools published at <https://tools.danny.is/>. Read `README.md` for the three shapes a tool can take and how the home page gets its metadata.

## Building a tool

- Pick the simplest shape that works: a single `name.html` first, a directory when it needs separate files or images, a build step only when it's really needed.
- Name tools in lowercase kebab-case. The name is the URL.
- Default to plain HTML, CSS and vanilla JavaScript in a `<script type="module">`. No frameworks unless asked.
- If a tool without a build step needs a library, load it from a CDN with a pinned version.
- Every tool needs a real `<title>` and `<meta name="description">`. Write the description as one or two plain sentences saying what the tool does, starting with a verb ("Convert…", "Plan…") rather than "This tool…".
- Use relative URLs for everything inside a tool.
- Tools must work on a phone: include the viewport meta tag and keep inputs at 16px or larger.
- Tools are static, so never put secrets in them. If a tool needs an API key, ask for it at runtime and keep it in `localStorage`.
- Keep each tool independent. Don't share code or assets between tools.
- For a build step, use bun and commit the tool's lockfile. Never commit `dist/` or `node_modules/`.

## The site itself

- `build.ts` and `serve.ts` use only what ships with bun. Keep it that way, and don't add a manifest or per-tool config.
- After adding or changing a tool, run `bun run build` and check it appears correctly in `_site/index.html`.

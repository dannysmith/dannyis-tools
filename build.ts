// Builds the site into _site/.
//
// A tool is any of these in the repo root:
//   name.html                        → served at /name/
//   name/ containing index.html      → served at /name/
//   name/ with a package.json build  → `bun run build` is run and name/dist/ is served at /name/
//
// The index page at / lists every tool with its title, description and the
// date of the first commit that touched it.

import { $ } from "bun";
import { cp, mkdir, readdir, rm } from "node:fs/promises";

const OUT = "_site";

type Tool = {
  slug: string;
  // title and description are HTML-safe: either taken verbatim from HTML source or escaped.
  title: string;
  description: string;
  // ISO date of the first commit touching the tool, or null if it isn't committed yet.
  added: string | null;
};

// Reads <title> and <meta name="description"> from an HTML file. HTMLRewriter
// hands back the raw source text, so entities like &amp; are still encoded.
async function readHtmlMeta(path: string): Promise<{ title: string; description: string }> {
  let title = "";
  let description = "";
  await new HTMLRewriter()
    .on("title", {
      text(chunk) {
        title += chunk.text;
      },
    })
    .on('meta[name="description"]', {
      element(element) {
        description = element.getAttribute("content") ?? "";
      },
    })
    .transform(new Response(Bun.file(path)))
    .text();
  return { title: title.trim(), description: description.trim() };
}

// Returns the first paragraph of a README as escaped plain text, skipping headings.
async function readReadmeDescription(path: string): Promise<string> {
  const file = Bun.file(path);
  if (!(await file.exists())) return "";
  const paragraph = (await file.text())
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("#"));
  return Bun.escapeHTML((paragraph ?? "").replace(/\s+/g, " "));
}

// Date of the oldest commit touching `path`. Needs full git history, so CI must not use a shallow clone.
async function firstCommitDate(path: string): Promise<string | null> {
  const log = await $`git log --format=%aI -- ${path}`.nothrow().quiet().text();
  return log.trim().split("\n").at(-1) || null;
}

async function buildFileTool(file: string): Promise<Tool> {
  const slug = file.replace(/\.html$/, "");
  await mkdir(`${OUT}/${slug}`);
  await cp(file, `${OUT}/${slug}/index.html`);
  const meta = await readHtmlMeta(file);
  return { slug, title: meta.title || slug, description: meta.description, added: await firstCommitDate(file) };
}

// Returns null for directories which aren't tools.
async function buildDirectoryTool(dir: string): Promise<Tool | null> {
  let source = dir;
  const packageJson = Bun.file(`${dir}/package.json`);
  if ((await packageJson.exists()) && (await packageJson.json()).scripts?.build) {
    console.log(`Building ${dir}…`);
    await $`bun install`.cwd(dir);
    await $`bun run build`.cwd(dir);
    source = `${dir}/dist`;
  }
  if (!(await Bun.file(`${source}/index.html`).exists())) return null;

  // Refusing to overwrite makes the build fail if name.html and name/ both exist.
  await cp(source, `${OUT}/${dir}`, { recursive: true, errorOnExist: true, force: false });
  const meta = await readHtmlMeta(`${source}/index.html`);
  return {
    slug: dir,
    title: meta.title || dir,
    description: meta.description || (await readReadmeDescription(`${dir}/README.md`)),
    added: await firstCommitDate(dir),
  };
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" });

function renderTool(tool: Tool): string {
  // The first ten characters are the date in the committer's own timezone.
  const day = tool.added?.slice(0, 10);
  const date = day ? `<time datetime="${day}">${dateFormat.format(new Date(day))}</time>` : `<time>Not committed</time>`;
  return `      <li>
        <a href="/${tool.slug}/">${tool.title}</a>
        ${date}
        ${tool.description ? `<p>${tool.description}</p>` : ""}
      </li>`;
}

function renderIndex(tools: Tool[]): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Danny's Tools and Mini-sites</title>
    <meta name="description" content="One-off web tools and mini-sites built by Danny Smith, mostly with AI." />
    <style>
      :root {
        color-scheme: light dark;
        --text: light-dark(#191919, #ffffff);
        --muted: light-dark(#596063, #979a9b);
        --background: light-dark(#f8f1e3, #202020);
        --link: light-dark(#fa6863, #ff9890);
        --rule: alpha(from light-dark(#000, #fff) / 10%);
      }
      body {
        font-family: system-ui, sans-serif;
        line-height: 1.5;
        color: var(--text);
        background: var(--background);
        max-width: 48rem;
        margin: 3rem auto;
        padding: 0 1rem;
      }
      header {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      header img {
        border: 3px solid var(--text);
        border-radius: 50%;
      }
      h1 {
        font-size: 2rem;
        line-height: 1.2;
        margin: 0;
      }
      ul {
        list-style: none;
        padding: 0;
      }
      li {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0 1rem;
        align-items: baseline;
        padding: 1rem 0;
        border-top: 1px solid var(--rule);
      }
      a {
        color: var(--link);
        font-weight: 600;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      time {
        color: var(--muted);
        font-size: 0.875rem;
        font-variant-numeric: tabular-nums;
      }
      li p {
        grid-column: 1 / -1;
        margin: 0.25rem 0 0;
        color: var(--muted);
      }
    </style>
  </head>
  <body>
    <header>
      <img src="https://danny.is/avatar.jpg" alt="Danny Smith" width="64" height="64" />
      <h1>Danny's Tools and Mini-sites</h1>
    </header>
    <p>A collection of one-off HTML and JavaScript tools and single-page mini-sites, each made for a specific use case. Most of them are vibe-coded with AI, and the source is <a href="https://github.com/dannysmith/dannyis-tools">on GitHub</a>. You can find the rest of my stuff at <a href="https://danny.is">danny.is</a>.</p>
    <ul>
${tools.map(renderTool).join('\n')}
    </ul>
  </body>
</html>
`
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT);

const tools: Tool[] = [];
for (const entry of await readdir(".", { withFileTypes: true })) {
  if (/^[._]/.test(entry.name)) continue;
  const tool =
    entry.isFile() && entry.name.endsWith(".html")
      ? await buildFileTool(entry.name)
      : entry.isDirectory()
        ? await buildDirectoryTool(entry.name)
        : null;
  if (tool) tools.push(tool);
}

// Newest first, with uncommitted tools at the top.
const addedTime = (tool: Tool) => (tool.added ? Date.parse(tool.added) : Infinity);
tools.sort((a, b) => addedTime(b) - addedTime(a) || a.slug.localeCompare(b.slug));

await Bun.write(`${OUT}/index.html`, renderIndex(tools));
console.log(`Built ${tools.length} tools into ${OUT}/`);

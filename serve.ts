// Local preview: builds the site, serves _site/ and rebuilds whenever a source file changes.
// Set PORT to use something other than Bun's default of 3000.

import { statSync, watch } from "node:fs";
import { stat } from "node:fs/promises";
import { join } from "node:path";

const OUT = "_site";

// Paths written by the build itself, which must not trigger another build.
const IGNORED = /(^|\/)(_site|\.git|node_modules|dist)(\/|$)|bun\.lockb?$/;

function build(): void {
  Bun.spawnSync(["bun", "build.ts"], { stdio: ["ignore", "inherit", "inherit"] });
}

build();

let pending: Timer | undefined;
watch(".", { recursive: true }, (_event, filename) => {
  if (!filename || IGNORED.test(filename)) return;
  // Copying a tool directory fires an event for the directory itself, which would rebuild forever.
  // Real edits always come with an event for a file inside it.
  if (statSync(filename, { throwIfNoEntry: false })?.isDirectory()) return;
  clearTimeout(pending);
  pending = setTimeout(build, 100);
});

const server = Bun.serve({
  // Mirrors GitHub Pages: /name redirects to /name/, which serves name/index.html.
  async fetch(request) {
    const path = decodeURIComponent(new URL(request.url).pathname);
    const target = join(OUT, path.endsWith("/") ? `${path}index.html` : path);
    const info = await stat(target).catch(() => null);
    if (!info) return new Response("Not found", { status: 404 });
    if (info.isDirectory()) return new Response(null, { status: 302, headers: { Location: `${path}/` } });
    return new Response(Bun.file(target));
  },
});

console.log(`Serving ${OUT}/ at ${server.url}`);

#!/bin/sh
# Opens every page in a real browser and saves a screenshot of each, at desktop
# and phone width, reporting script errors and sideways overflow.
#
#   tools/shots.sh [output-dir]      (default: shots/)
#
# Needs playwright-cli. Its browser refuses file:// addresses, so the pages are
# handed to it through request routing; no server is started. Under a sandbox
# the browser may not launch: run this outside it.

root="$(cd "$(dirname "$0")/.." && pwd)"
out="${1:-$root/shots}"
mkdir -p "$out"
cd "$out" || exit 1

playwright-cli -s=shots open >/dev/null 2>&1
playwright-cli -s=shots run-code "async page => {
  const root = '$root';
  await page.context().route('http://ship.test/**', (route) =>
    route.fulfill({ path: root + route.request().url().replace('http://ship.test', '').split('#')[0].split('?')[0] }).catch(() => route.abort()));
  const pages = ['index', 'ship', 'fundamentals', 'square-sails', 'fore-and-aft', 'studding-sails', 'belaying', 'handling', 'manoeuvres', 'quiz', 'glossary', 'explorer'];
  const report = [];
  page.on('pageerror', (e) => report.push('ERROR ' + page.url().split('/').pop() + ': ' + e.message));
  for (const [label, width, height] of [['desktop', 1440, 900], ['phone', 400, 800]]) {
    await page.setViewportSize({ width, height });
    for (const name of pages) {
      await page.goto('http://ship.test/' + name + '.html');
      await page.waitForTimeout(800);
      await page.screenshot({ path: name + '-' + label + '.png' });
      const wide = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
      if (wide) report.push('OVERFLOW ' + name + ' at ' + label + ' width');
    }
  }
  return report.join('\\n') || 'No errors or overflow on any page.';
}" 2>&1 | sed -n '/### Result/,/### Ran/p' | sed '1d;$d'
playwright-cli -s=shots close >/dev/null 2>&1
echo "Screenshots are in $out"

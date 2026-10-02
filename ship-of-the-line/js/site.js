// The pages of the tutorial, in reading order. Fills the bar of links at the
// top of each page (<nav id="site">) and the previous/next links at the foot
// (<nav id="pager">).

(function () {
  const PAGES = [
    ['index.html', 'Contents'],
    ['ship.html', 'The ship'],
    ['fundamentals.html', 'Tackles and belaying'],
    ['square-sails.html', 'Square sails'],
    ['fore-and-aft.html', 'Fore-and-aft sails'],
    ['studding-sails.html', 'Studding sails'],
    ['belaying.html', 'Belaying plan'],
    ['handling.html', 'Steering and theory'],
    ['manoeuvres.html', 'Manoeuvres'],
    ['quiz.html', 'Quiz'],
    ['glossary.html', 'Glossary'],
    ['explorer.html', 'Lookup'],
  ];
  const here = location.pathname.split('/').pop() || 'index.html';
  const at = PAGES.findIndex(([file]) => file === here);

  const site = document.getElementById('site');
  if (site) {
    site.setAttribute('aria-label', 'Pages');
    site.innerHTML = PAGES.map(([file, name], i) => `<a href="${file}"${i === at ? ' aria-current="page"' : ''}>${name}</a>`).join('');
  }
  const pager = document.getElementById('pager');
  if (pager && at >= 0) {
    const link = (i, word) => (PAGES[i] ? `<a href="${PAGES[i][0]}"><span>${word}</span>${PAGES[i][1]}</a>` : '<i></i>');
    pager.innerHTML = link(at - 1, 'Previous') + link(at + 1, 'Next');
  }
  window.RIGSITE = { PAGES };
})();

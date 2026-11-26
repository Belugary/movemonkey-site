// Answer pages, wide screens: the table of contents marks the section being read, the last one
// whose heading has passed the top 30% of the window (scrolling down or up, and on load).
(function () {
  var links = [].slice.call(document.querySelectorAll('.toc a'));
  var heads = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  if (!links.length || heads.indexOf(null) !== -1) return;
  var current = -1, queued = false;
  function mark() {
    queued = false;
    var line = window.innerHeight * 0.3, n = -1;
    heads.forEach(function (h, i) { if (h.getBoundingClientRect().top <= line) n = i; });
    // At the very bottom the last heading may never reach the line on a tall window: mark it anyway.
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) n = heads.length - 1;
    if (n === current) return;
    if (current !== -1) links[current].classList.remove('on');
    if (n !== -1) links[n].classList.add('on');
    current = n;
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(mark); } }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  mark();
})();

// A tap on a language in the switch is remembered, so the site's root opens that language's home
// from then on (the root's pick, scripts/site-home/src/pick-lang.js, reads "mm-lang"; .claude/rules/site.md ST26).
(function () {
  var nav = document.querySelector('.langs');
  if (!nav) return;
  function keep(e) {
    var a = e.target.closest && e.target.closest('a[hreflang]');
    if (!a) return;
    try { window.localStorage.setItem('mm-lang', a.getAttribute('hreflang')); } catch (err) {}
  }
  nav.addEventListener('click', keep);
  nav.addEventListener('auxclick', keep);
})();

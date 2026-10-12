// Runs before first paint (loaded as a blocking script from index.html) so the saved theme never flashes.
// Kept as an external file because the CSP forbids inline scripts.
;(function () {
  try {
    var pref = localStorage.getItem('psyke-theme') || 'system'
    var dark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    var meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', dark ? '#0d1210' : '#f3f5f2')
  } catch (e) {
    /* storage blocked: stay on the default light theme */
  }
})()

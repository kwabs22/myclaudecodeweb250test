/* Home page carousel: swipe or scroll, arrow buttons, dots, and a slow automatic advance that stops on hover, focus or Pause. */
(function () {
  var track = document.getElementById("track");
  if (!track) return;
  var slides = track.children, n = slides.length, dots = document.getElementById("car-dots"), play = document.getElementById("car-play");
  var cur = 0, busy = null, paused = false, held = false, reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  for (var i = 0; i < n; i++) {
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-label", "Show slide " + (i + 1) + " of " + n);
    (function (k) { b.addEventListener("click", function () { go(k); }); })(i);
    dots.appendChild(b);
  }
  function mark() { for (var i = 0; i < n; i++) dots.children[i].setAttribute("aria-current", String(i === cur)); }
  function go(k) { cur = (k + n) % n; clearTimeout(busy); busy = setTimeout(function () { busy = null; }, 700); track.scrollTo({ left: slides[cur].offsetLeft - track.offsetLeft, behavior: reduce ? "auto" : "smooth" }); mark(); }
  track.addEventListener("scroll", function () {
    if (busy) return;
    var k = Math.round(track.scrollLeft / track.clientWidth);
    if (k !== cur && k >= 0 && k < n) { cur = k; mark(); }
  }, { passive: true });
  document.getElementById("car-prev").addEventListener("click", function () { go(cur - 1); });
  document.getElementById("car-next").addEventListener("click", function () { go(cur + 1); });
  play.addEventListener("click", function () { paused = !paused; play.textContent = paused ? "Play" : "Pause"; play.setAttribute("aria-pressed", String(paused)); play.setAttribute("aria-label", paused ? "Resume automatic change" : "Pause automatic change"); });
  var box = track.parentNode;
  ["mouseenter", "focusin", "touchstart"].forEach(function (e) { box.addEventListener(e, function () { held = true; }, { passive: true }); });
  ["mouseleave", "focusout"].forEach(function (e) { box.addEventListener(e, function () { held = false; }); });
  if (!reduce) setInterval(function () { if (!paused && !held && !document.hidden) go(cur + 1); }, 6000);
  mark();
})();

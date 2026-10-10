/* Shared behaviour: theme toggle, folder drawer, search, Mermaid. No dependencies. */
(function () {
  var root = document.documentElement;
  var prefix = root.getAttribute("data-root") || "";

  /* theme: system by default, explicit choice remembered */
  var themeBtn = document.getElementById("theme");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var dark = root.dataset.theme
        ? root.dataset.theme === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = dark ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("atlas-theme", next); } catch (e) {}
      window.dispatchEvent(new Event("atlas-theme"));
    });
  }

  /* folder drawer on narrow screens */
  var toggle = document.getElementById("side-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* search over data/tree.json, fetched on first focus */
  var input = document.getElementById("q");
  var list = document.getElementById("results");
  var nodes = null, loading = null, active = -1, shown = [];

  function load() {
    if (nodes) return Promise.resolve(nodes);
    if (!loading) {
      loading = fetch(prefix + "data/tree.json")
        .then(function (r) { return r.json(); })
        .then(function (d) { nodes = d.nodes; return nodes; })
        .catch(function () { nodes = []; return nodes; });
    }
    return loading;
  }
  function score(n, terms) {
    var hay = (n.t + " " + n.p).toLowerCase(), s = 0;
    for (var i = 0; i < terms.length; i++) {
      var at = hay.indexOf(terms[i]);
      if (at < 0) return -1;
      s += n.t.toLowerCase().indexOf(terms[i]) >= 0 ? 3 : 1;
    }
    return s + (n.k === "doc" ? 1 : 0);
  }
  function render() {
    list.textContent = "";
    if (!shown.length) {
      var li = document.createElement("li");
      li.className = "none";
      li.textContent = "No files match.";
      list.appendChild(li);
      return;
    }
    shown.forEach(function (n, i) {
      var li = document.createElement("li");
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", String(i === active));
      var a = document.createElement("a");
      a.href = prefix + n.u;
      a.textContent = n.t;
      var small = document.createElement("small");
      small.textContent = n.p;
      a.appendChild(small);
      li.appendChild(a);
      list.appendChild(li);
    });
  }
  function close() {
    list.hidden = true;
    input.setAttribute("aria-expanded", "false");
    active = -1;
  }
  function run() {
    var q = input.value.trim().toLowerCase();
    if (!q) return close();
    load().then(function () {
      var terms = q.split(/\s+/);
      shown = nodes
        .map(function (n) { return { n: n, s: score(n, terms) }; })
        .filter(function (x) { return x.s >= 0; })
        .sort(function (a, b) { return b.s - a.s || a.n.p.length - b.n.p.length; })
        .slice(0, 8)
        .map(function (x) { return x.n; });
      active = shown.length ? 0 : -1;
      render();
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
    });
  }
  if (input && list) {
    input.addEventListener("focus", load);
    input.addEventListener("input", run);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { close(); input.blur(); }
      else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (!shown.length) return;
        e.preventDefault();
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + shown.length) % shown.length;
        render();
      } else if (e.key === "Enter" && shown[active]) {
        window.location.href = prefix + shown[active].u;
      }
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        input.focus();
      }
    });
  }

  /* Mermaid diagrams (script is only added to pages that contain one) */
  function mermaidTheme() {
    var t = root.dataset.theme;
    var dark = t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    return dark ? "dark" : "default";
  }
  function drawMermaid() {
    if (!window.mermaid || !document.querySelector("pre.mermaid")) return;
    window.mermaid.initialize({ startOnLoad: false, theme: mermaidTheme(), securityLevel: "strict" });
    window.mermaid.run({ querySelector: "pre.mermaid" }).catch(function () {});
  }
  window.addEventListener("load", drawMermaid);
})();

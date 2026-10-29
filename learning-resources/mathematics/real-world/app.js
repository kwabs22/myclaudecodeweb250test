import * as THREE from "three";
import { OrbitControls } from "./vendor/OrbitControls.js";

const RW = window.RealWorld;
const { MODALITIES, TASKS } = RW;
const U = RW.util;
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const mod = Object.fromEntries(MODALITIES.map((m) => [m.id, m]));
const values = {};                       /* each task keeps its own slider values while you look at others */
for (const t of TASKS) values[t.id] = Object.fromEntries(t.controls.map((c) => [c.key, c.type === "bits" ? c.value.slice() : c.value]));
let current = null, filter = null;
const cardEls = new Map();

/* ------------------------------------------------------------------ chips and the task list */
function buildChips() {
  const el = $("chips");
  el.innerHTML = "";
  for (const m of MODALITIES) {
    const b = document.createElement("button");
    b.className = "chip"; b.style.setProperty("--c", m.color); b.setAttribute("aria-pressed", "false");
    b.innerHTML = `<i></i>${esc(m.name)}`; b.dataset.m = m.id;
    b.addEventListener("click", () => setFilter(filter === m.id ? null : m.id));
    el.appendChild(b);
  }
}
function buildList() {
  const g = $("groups"); g.innerHTML = "";
  for (const m of MODALITIES) {
    const sec = document.createElement("section"); sec.className = "group"; sec.style.setProperty("--c", m.color); sec.dataset.m = m.id;
    sec.innerHTML = `<h3><i></i>${esc(m.name)}</h3><p class="q">${esc(m.ask)}</p><p class="b">${esc(m.blurb)}</p>`;
    const cards = document.createElement("div"); cards.className = "cards";
    for (const t of TASKS.filter((t) => t.modality === m.id)) {
      const c = document.createElement("button"); c.className = "card"; c.style.setProperty("--c", m.color);
      c.innerHTML = `<b>${esc(t.title)}</b><span>${esc(t.ask.length > 110 ? t.ask.slice(0, 107).replace(/\s+\S*$/, "") + "…" : t.ask)}</span>`;
      c.addEventListener("click", () => { select(t.id); $("panel").scrollIntoView({ block: "nearest", behavior: "smooth" }); });
      cardEls.set(t.id, c); cards.appendChild(c);
    }
    sec.appendChild(cards); g.appendChild(sec);
  }
}
function setFilter(id) {
  filter = id;
  document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.m === id)));
  document.querySelectorAll(".group").forEach((s) => s.classList.toggle("dim", !!id && s.dataset.m !== id));
  scene && scene.applyFilter();
}

/* ------------------------------------------------------------------ the task panel */
function control(t, c) {
  const wrap = document.createElement("div"); wrap.className = "ctl";
  const v = values[t.id];
  if (c.type === "range") {
    const max = () => (c.maxFor ? c.maxFor(v) : c.max), step = () => (c.stepFor ? c.stepFor(v) : c.step || 1);
    const id = `c-${t.id}-${c.key}`;
    wrap.innerHTML = `<label for="${id}">${esc(c.label)}<output id="${id}-o"></output></label><input id="${id}" type="range">`;
    const input = wrap.querySelector("input"), out = wrap.querySelector("output");
    const sync = () => { input.min = c.min; input.max = max(); input.step = step(); if (v[c.key] > max()) v[c.key] = max(); input.value = v[c.key]; out.textContent = Number(v[c.key]).toLocaleString(); };
    sync(); input.addEventListener("input", () => { v[c.key] = Number(input.value); out.textContent = Number(v[c.key]).toLocaleString(); update(false); });
    wrap._sync = sync;
  } else if (c.type === "select") {
    const id = `c-${t.id}-${c.key}`;
    wrap.innerHTML = `<label for="${id}">${esc(c.label)}</label><select id="${id}">${c.options.map(([val, text]) => `<option value="${esc(val)}"${String(val) === String(v[c.key]) ? " selected" : ""}>${esc(text)}</option>`).join("")}</select>`;
    const sel = wrap.querySelector("select");
    sel.addEventListener("change", () => { const raw = sel.value; const opt = c.options.find((o) => String(o[0]) === raw); v[c.key] = typeof c.options[0][0] === "number" ? Number(raw) : opt[0]; update(true); });
  } else if (c.type === "seed") {
    wrap.innerHTML = `<span class="lbl">${esc(c.label)}<output>#${v[c.key]}</output></span><button class="btn" type="button">🎲 Try another</button>`;
    wrap.querySelector("button").addEventListener("click", () => { v[c.key] = (v[c.key] % 997) + 1; wrap.querySelector("output").textContent = "#" + v[c.key]; update(false); });
  } else if (c.type === "bits") {
    wrap.innerHTML = `<span class="lbl">${esc(c.label)}</span><div class="bits">${v[c.key].map((b, i) => `<button class="bit" type="button" aria-pressed="${b === 1}" aria-label="Data bit ${i + 1}">${b}</button>`).join("")}</div>`;
    wrap.querySelectorAll(".bit").forEach((btn, i) => btn.addEventListener("click", () => { v[c.key][i] ^= 1; btn.textContent = v[c.key][i]; btn.setAttribute("aria-pressed", String(v[c.key][i] === 1)); update(false); }));
  }
  return wrap;
}
function select(id, fromScene) {
  const t = TASKS.find((x) => x.id === id); if (!t) return;
  current = t; const m = mod[t.modality];
  const p = $("panel"); p.style.setProperty("--c", m.color); p.innerHTML = "";
  const head = document.createElement("div");
  head.innerHTML = `<span class="tag">${esc(m.name)}</span><h2>${esc(t.title)}</h2><p class="ask">${esc(t.ask)}</p>`;
  p.appendChild(head);
  const ctl = document.createElement("div"); ctl.className = "controls"; ctl.id = "ctl";
  t.controls.forEach((c) => ctl.appendChild(control(t, c)));
  p.appendChild(ctl);
  const res = document.createElement("div"); res.id = "res"; p.appendChild(res);
  const links = [];
  if (t.questions.length) links.push(`Related questions: ${t.questions.map((q) => `<a href="../combinatorics_learning_questions.html">${q}</a>`).join(", ")}`);
  if (t.repo.length) links.push(`Code that does the same: ${t.repo.map(([l, h]) => `<a href="${esc(h)}">${esc(l)}</a>`).join(", ")}`);
  const idea = document.createElement("div");
  idea.innerHTML = `<div class="idea"><b>The idea</b>${esc(t.idea)}</div>${links.length ? `<p class="links">${links.join("<br>")}</p>` : ""}`;
  p.appendChild(idea);
  update(false);
  cardEls.forEach((el, k) => el.setAttribute("aria-current", String(k === id)));
  history.replaceState(null, "", "#" + id);
  if (!fromScene && scene) scene.focus(id);
}
function update(rebuildControls) {
  if (rebuildControls) document.querySelectorAll("#ctl .ctl").forEach((w) => w._sync && w._sync());
  const t = current, v = values[t.id], o = t.compute(v);
  const rows = o.rows.map(([a, b], i) => `<div class="r"><dt>${esc(a)}</dt><dd${i === 0 || /^(Chance|Shortest|Best|Fewest|Valid|Runs in|Repaired)/.test(a) ? ' class="hot"' : ""}>${esc(b)}</dd></div>`).join("");
  $("res").innerHTML = `<dl class="rows">${rows}</dl>${o.viz ? `<div class="viz">${viz(o.viz, mod[t.modality].color)}</div>` : ""}${o.note ? `<p class="note">${esc(o.note)}</p>` : ""}`;
}

/* ------------------------------------------------------------------ small pictures */
const PALETTE = ["#e8590c", "#3a63d8", "#0f9d58", "#c026d3", "#ca8a04", "#0891b2"];
function viz(z, color) {
  switch (z.type) {
    case "bars": {
      const max = Math.max(...z.items.map((i) => i.value)), f = (x) => (z.log ? Math.log10(x + 1) / Math.log10(max + 1) : x / max);
      return z.items.map((i) => `<div class="barline${i.on ? " on" : ""}"><span>${esc(i.label)}</span><span class="t"><i style="width:${Math.max(1.5, f(i.value) * 100).toFixed(1)}%"></i></span><span>${esc(U.fmtNum(i.value, 0))}</span></div>`).join("");
    }
    case "list": return `<p class="note" style="margin:0 0 6px">${esc(z.title || "")}</p><div class="pills">${z.items.map((s) => `<span>${esc(s)}</span>`).join("")}</div>`;
    case "route": {
      const pts = z.points, line = (order) => order.concat(order[0]).map((i) => pts[i].join(",")).join(" ");
      return `<svg viewBox="-6 -6 112 112" role="img" aria-label="Map of stops with the shortest route in colour and the nearest-neighbour route dashed"><polyline points="${line(z.greedy)}" fill="none" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="3 2"/><polyline points="${line(z.best)}" fill="none" stroke="${color}" stroke-width="2"/>${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.2" fill="${i === 0 ? "var(--ink)" : "var(--panel)"}" stroke="var(--ink)"/><text x="${p[0]}" y="${p[1] + 1.4}" font-size="3.6" text-anchor="middle" fill="${i === 0 ? "var(--bg)" : "var(--ink)"}">${i === 0 ? "S" : i}</text>`).join("")}</svg>`;
    }
    case "items": return `<div class="scroll"><table><tr><th>Parcel</th><th>Weight</th><th>Value</th><th>Best load</th><th>Greedy</th></tr>${z.items.map((it, i) => `<tr class="${it.best ? "hi" : ""}"><td>${i + 1}</td><td>${it.w}</td><td>${it.val}</td><td>${it.best ? "✓" : ""}</td><td>${it.greedy ? "✓" : ""}</td></tr>`).join("")}</table></div>`;
    case "matrix": return `<div class="scroll"><table><tr><th></th>${z.cost.map((_, j) => `<th>Job ${j + 1}</th>`).join("")}</tr>${z.cost.map((r, i) => `<tr><th>Worker ${i + 1}</th>${r.map((c, j) => `<td class="${z.best[i] === j ? "hi" : ""} ${z.greedy[i] === j ? "out" : ""}">${c}</td>`).join("")}</tr>`).join("")}</table></div>`;
    case "graph": return `<svg viewBox="0 0 100 100" role="img" aria-label="Map with each region coloured so neighbours differ">${z.edges.map(([a, b]) => `<line x1="${z.pos[a][0]}" y1="${z.pos[a][1]}" x2="${z.pos[b][0]}" y2="${z.pos[b][1]}" stroke="var(--muted)" stroke-width="1"/>`).join("")}${z.pos.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="5.2" fill="${PALETTE[z.colours[i] % PALETTE.length]}" stroke="var(--ink)"/>`).join("")}</svg>`;
    case "grid": return `<p class="note" style="margin:0 0 6px">${esc(z.title)}</p><table style="width:auto">${z.cells.map((r) => `<tr>${r.map((c) => `<td style="width:34px;background:${PALETTE[c % PALETTE.length]}33">${c + 1}</td>`).join("")}</tr>`).join("")}</table>`;
    case "schedule": return `<div class="scroll"><table><tr><th>Round</th><th>Matches (team numbers)</th></tr>${z.rounds.map((r, i) => `<tr><td>${i + 1}</td><td style="text-align:left">${r.map(([a, b]) => `${a + 1}–${b + 1}`).join("  ")}</td></tr>`).join("")}</table></div>`;
    case "table": return `<div class="scroll"><table><tr><th>Run</th>${z.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr>${z.rows.map((r, i) => `<tr><td>${i + 1}</td>${r.map((c) => `<td>${"abcd"[c]}</td>`).join("")}</tr>`).join("")}</table></div>`;
    case "bits": return ["sent", "got"].map((k) => `<div class="bitrow"><b>${k === "sent" ? "Sent" : "Received"}</b>${z[k].map((b, i) => `<span class="${k === "got" && z.flip === i + 1 ? "flip" : ""}">${b}</span>`).join("")}</div>`).join("") + `<div class="bitrow"><b>Position</b>${[1, 2, 3, 4, 5, 6, 7].map((i) => `<span style="background:none;color:var(--muted);font-size:12px">${i}</span>`).join("")}</div>`;
    default: return "";
  }
}

/* ------------------------------------------------------------------ the 3D map */
let scene = null;
function build3D() {
  const stage = $("stage");
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { $("nogl").style.display = "flex"; return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  stage.insertBefore(renderer.domElement, stage.firstChild);
  const sc = new THREE.Scene(), camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0, 2.5, 15);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.enablePan = false; controls.minDistance = 6; controls.maxDistance = 26;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  controls.autoRotate = !reduce; controls.autoRotateSpeed = 0.5;
  let touched = false;
  controls.addEventListener("start", () => { controls.autoRotate = false; touched = true; });
  sc.add(new THREE.AmbientLight(0xffffff, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(4, 8, 6); sc.add(key);

  const fib = (i, n, r) => { const y = 1 - (2 * (i + 0.5)) / n, rad = Math.sqrt(1 - y * y), a = i * Math.PI * (3 - Math.sqrt(5)); return new THREE.Vector3(Math.cos(a) * rad * r, y * r, Math.sin(a) * rad * r); };
  const nodes = [], labelEls = [], group = new THREE.Group(); sc.add(group);
  const sphereGeo = new THREE.SphereGeometry(1, 28, 20);
  MODALITIES.forEach((m, mi) => {
    const centre = fib(mi, MODALITIES.length, 5.6), col = new THREE.Color(m.color);
    const hub = new THREE.Mesh(sphereGeo, new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.35, roughness: 0.4, transparent: true, opacity: 0.95 }));
    hub.scale.setScalar(0.5); hub.position.copy(centre); group.add(hub);
    const mine = TASKS.filter((t) => t.modality === m.id);
    mine.forEach((t, ti) => {
      const off = fib(ti, mine.length + 2, 1.9), pos = centre.clone().add(off);
      const mesh = new THREE.Mesh(sphereGeo, new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.15, roughness: 0.35, transparent: true, opacity: 1 }));
      mesh.scale.setScalar(0.3); mesh.position.copy(pos); mesh.userData = { id: t.id, m: m.id, title: t.title }; group.add(mesh);
      const geo = new THREE.BufferGeometry().setFromPoints([centre, pos]);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.45 })); group.add(line);
      nodes.push({ mesh, line, id: t.id, m: m.id, base: 0.3 });
    });
    const el = document.createElement("div"); el.className = "lab group"; el.textContent = m.name; $("labels").appendChild(el);
    labelEls.push({ el, pos: centre.clone().add(new THREE.Vector3(0, 0.75, 0)), m: m.id });
  });
  /* a faint ring of starfield dots so the space has depth */
  const stars = new THREE.BufferGeometry(), sp = new Float32Array(300 * 3);
  for (let i = 0; i < 300; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(14 + Math.random() * 10); sp.set([v.x, v.y, v.z], i * 3); }
  stars.setAttribute("position", new THREE.BufferAttribute(sp, 3)); sc.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0x8892b8, size: 0.06, transparent: true, opacity: 0.6 })));

  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let hover = null, down = null, tween = null;
  const tip = $("tip");
  const pick = (ev) => { const r = renderer.domElement.getBoundingClientRect(); ptr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ptr, camera); const hits = ray.intersectObjects(nodes.filter((n) => !filter || n.m === filter).map((n) => n.mesh)); return hits.length ? hits[0].object : null; };
  renderer.domElement.addEventListener("pointermove", (ev) => {
    const o = pick(ev); hover = o; renderer.domElement.style.cursor = o ? "pointer" : "grab";
    if (o) { const r = stage.getBoundingClientRect(); tip.textContent = o.userData.title; tip.style.left = ev.clientX - r.left + "px"; tip.style.top = ev.clientY - r.top + "px"; tip.style.opacity = 1; } else tip.style.opacity = 0;
  });
  renderer.domElement.addEventListener("pointerleave", () => { hover = null; tip.style.opacity = 0; });
  renderer.domElement.addEventListener("pointerdown", (ev) => (down = [ev.clientX, ev.clientY]));
  renderer.domElement.addEventListener("pointerup", (ev) => { if (down && Math.hypot(ev.clientX - down[0], ev.clientY - down[1]) < 5) { const o = pick(ev); if (o) select(o.userData.id, true); } down = null; });

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    /* a tall, narrow stage (a phone) needs the camera further back to keep every group in view; leave it alone once the reader zooms */
    if (!touched) camera.position.setLength(Math.min(26, 16.5 / Math.min(1, camera.aspect)));
  }
  new ResizeObserver(resize).observe(stage); resize();
  const v3 = new THREE.Vector3();
  let visible = true; new IntersectionObserver((e) => (visible = e[0].isIntersecting)).observe(stage);
  function frame() {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    if (tween) { controls.target.lerp(tween, 0.08); if (controls.target.distanceTo(tween) < 0.02) tween = null; }
    controls.update();
    for (const n of nodes) { const on = current && current.id === n.id, want = n.base * (on ? 1.9 : n === hoverNode() ? 1.5 : 1); n.mesh.scale.setScalar(n.mesh.scale.x + (want - n.mesh.scale.x) * 0.2); }
    renderer.render(sc, camera);
    const w = stage.clientWidth, h = stage.clientHeight;
    for (const L of labelEls) { v3.copy(L.pos).project(camera); const off = v3.z > 1; L.el.style.opacity = off ? 0 : filter && filter !== L.m ? 0.25 : 1; L.el.style.transform = `translate(${(v3.x * 0.5 + 0.5) * w}px,${(-v3.y * 0.5 + 0.5) * h}px) translate(-50%,-50%)`; }
  }
  const hoverNode = () => nodes.find((n) => n.mesh === hover);
  requestAnimationFrame(frame);
  return {
    focus(id) { const n = nodes.find((x) => x.id === id); if (n) { tween = n.mesh.position.clone().multiplyScalar(0.55); controls.autoRotate = false; } },
    applyFilter() { for (const n of nodes) { const on = !filter || n.m === filter; n.mesh.material.opacity = on ? 1 : 0.18; n.line.material.opacity = on ? 0.45 : 0.08; } if (filter) { const c = nodes.filter((n) => n.m === filter).reduce((s, n) => s.add(n.mesh.position), new THREE.Vector3()).multiplyScalar(1 / nodes.filter((n) => n.m === filter).length); tween = c.multiplyScalar(0.6); controls.autoRotate = false; } else tween = new THREE.Vector3(); },
  };
}

/* ------------------------------------------------------------------ start */
buildChips(); buildList();
scene = build3D();
const start = location.hash.slice(1);
select(TASKS.some((t) => t.id === start) ? start : "birthday");

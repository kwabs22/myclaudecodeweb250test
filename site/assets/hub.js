/* Session Atlas home: a 3D map of the repository.
 * The folder tree is laid out as nested rings. Each file is one point; folders are the
 * clusters they sit in. Picking is done in screen space so points of any size are easy to hit.
 */
import * as THREE from "three";
import { OrbitControls } from "./vendor/OrbitControls.js";

THREE.ColorManagement.enabled = false; // hex colours go to the shader unchanged

const data = JSON.parse(document.getElementById("tree-data").textContent);
const CATS = JSON.parse(document.getElementById("cats-data").textContent);
const PROV = JSON.parse((document.getElementById("prov-data") || { textContent: "[]" }).textContent);
const stage = document.getElementById("stage");
const canvas = document.getElementById("map");
const labelsEl = document.getElementById("labels");
const pinEl = document.getElementById("pin");
const tipEl = document.getElementById("tip");
const cardEl = document.getElementById("card");
const chips = [...document.querySelectorAll(".chip")];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const BG = new THREE.Color("#0a0d16");
const SIZE_MULT = 2.5;
const FOV = 45;

/* ------------------------------------------------------------------ layout */

const nodes = data.nodes.map((n) => ({ ...n, dir: n.d === "" ? "_about" : n.d }));
const dirs = new Map();

function makeDir(path) {
  return { path, name: path.split("/").pop(), files: [], kids: [], total: 0, pos: null, R: 1, rf: 0, ring: 0, depth: 0 };
}
function getDir(path) {
  if (dirs.has(path)) return dirs.get(path);
  const d = makeDir(path);
  d.cat = path === "_about" ? "root" : path.split("/")[0];
  dirs.set(path, d);
  const parentPath = path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "";
  getDir(parentPath).kids.push(d);
  return d;
}
const root = makeDir("");
root.cat = "";
dirs.set("", root);
nodes.forEach((n) => getDir(n.dir).files.push(n));

function measure(d, depth) {
  d.depth = depth;
  d.kids.forEach((k) => measure(k, depth + 1));
  d.total = d.files.length + d.kids.reduce((s, k) => s + k.total, 0);
  d.kids.sort((a, b) => b.total - a.total);
  const n = d.files.length;
  d.rf = n <= 1 ? 0.6 : 1.1 + 0.68 * Math.sqrt(n);
  if (!d.kids.length) {
    d.R = d.rf + 0.8;
    return;
  }
  const spread = d.kids.reduce((s, k) => s + 1.75 * k.R, 0) / (2 * Math.PI);
  const maxR = Math.max(...d.kids.map((k) => k.R));
  d.ring = Math.max(spread, (n ? d.rf : 0) + maxR + 1.4, d.kids.length === 1 ? maxR + 2 : 0);
  d.R = d.ring + maxR;
}

function place(d, origin) {
  d.pos = origin;
  const n = d.files.length;
  d.files.forEach((f, i) => {
    if (n === 1) {
      f.pos = origin.clone().add(new THREE.Vector3(0, 0.9, 0));
      return;
    }
    const y = 1 - ((i + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = Math.PI * (3 - Math.sqrt(5)) * i;
    f.pos = new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(d.rf).add(origin);
  });
  const m = d.kids.length;
  const tilt = new THREE.Euler(0.5 + 0.28 * d.depth, 0.75 * d.depth, 0.3 * d.depth);
  d.kids.forEach((k, i) => {
    const a = (i / m) * Math.PI * 2 + d.depth * 0.9;
    const off = new THREE.Vector3(Math.cos(a) * d.ring, (i % 2 ? 1 : -1) * k.R * 0.22, Math.sin(a) * d.ring);
    place(k, origin.clone().add(off.applyEuler(tilt)));
  });
}
measure(root, 0);
place(root, new THREE.Vector3(0, 0, 0));

/* ------------------------------------------------------------------ scene */

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
} catch (err) {
  document.getElementById("nogl").hidden = false;
}

const catColor = {};
Object.entries(CATS).forEach(([k, v]) => (catColor[k] = new THREE.Color(v.color)));

let filter = "";
let mode = "folder";
let step = 0;
let selected = null;
let hovered = null;

if (renderer) init();
else showCard(nodes.find((n) => n.p === "README.md") || nodes[0], false);

function init() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 3000);
  /* frame the real extent of the points, not the layout's padded bounds */
  const box = new THREE.Box3();
  nodes.forEach((n) => box.expandByPoint(n.pos));
  const centre = box.getCenter(new THREE.Vector3());
  const extent = Math.max(...nodes.map((n) => n.pos.distanceTo(centre))) + 3;
  const tanHalf = Math.tan((FOV * Math.PI) / 360);
  let homeDist = (extent / tanHalf) * 1.04;
  const homeOffset = (dist) => new THREE.Vector3(0.5, 0.32, 0.8).setLength(dist);
  camera.position.copy(centre).add(homeOffset(homeDist));

  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(centre);
  controls.enableDamping = !reduced;
  controls.dampingFactor = 0.08;
  controls.autoRotate = !reduced;
  controls.autoRotateSpeed = 0.45;
  controls.minDistance = 8;
  controls.maxDistance = homeDist * 1.8;
  let tween = null;
  let userMoved = false;
  controls.addEventListener("start", () => {
    controls.autoRotate = false;
    userMoved = true;
  });

  /* distance at which every point stays inside the view from any side */
  function fitHome() {
    const keep = camera.position.clone();
    const fill = canvas.clientWidth < 600 ? 0.8 : 0.9;
    const tmp = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    let d = homeDist;
    for (let iter = 0; iter < 4; iter++) {
      const seen = [];
      for (let a = 0; a < 8; a++) {
        camera.position.copy(centre).add(homeOffset(d).applyAxisAngle(up, (a / 8) * Math.PI * 2));
        camera.lookAt(centre);
        camera.updateMatrixWorld();
        let w = 0.01;
        for (const n of nodes) {
          tmp.copy(n.pos).project(camera);
          w = Math.max(w, Math.abs(tmp.x), Math.abs(tmp.y));
        }
        seen.push(w);
      }
      seen.sort((x, y) => x - y);
      d *= seen[5] / fill; // fit 6 of 8 angles fully; the two widest may touch the edge
    }
    camera.position.copy(keep);
    return d;
  }

  /* points: one per file */
  const N = nodes.length;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const size = new Float32Array(N);
  const shape = new Float32Array(N);
  const dim = new Float32Array(N).fill(1);
  const baseBoost = new Float32Array(N);
  const boost = new Float32Array(N);
  nodes.forEach((n, i) => {
    pos.set([n.pos.x, n.pos.y, n.pos.z], i * 3);
    const c = catColor[n.c];
    col.set([c.r, c.g, c.b], i * 3);
    const base = 0.5 + 0.22 * Math.log10(Math.max(n.s, 300) / 300);
    size[i] = Math.min(base, 1.15) * (n.k === "app" ? 1.7 : 1) * SIZE_MULT;
    shape[i] = n.k === "app" ? 1 : 0;
    n.i = i;
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  geo.setAttribute("aShape", new THREE.BufferAttribute(shape, 1));
  geo.setAttribute("aDim", new THREE.BufferAttribute(dim, 1));
  geo.setAttribute("aBoost", new THREE.BufferAttribute(boost, 1));
  const uniforms = { uScale: { value: 600 } };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: `
      attribute vec3 aColor; attribute float aSize; attribute float aShape; attribute float aDim; attribute float aBoost;
      uniform float uScale;
      varying vec3 vColor; varying float vShape; varying float vDim;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = max(3.5, aSize * (1.0 + aBoost) * uScale / -mv.z);
        gl_Position = projectionMatrix * mv;
        vColor = aColor; vShape = aShape; vDim = aDim;
      }`,
    fragmentShader: `
      precision mediump float;
      varying vec3 vColor; varying float vShape; varying float vDim;
      void main() {
        vec2 p = gl_PointCoord * 2.0 - 1.0;
        float d = vShape > 0.5 ? abs(p.x) + abs(p.y) : length(p);
        if (d > 1.0) discard;
        float edge = smoothstep(1.0, 0.8, d);
        vec3 c = mix(vColor, vec3(1.0), smoothstep(0.6, 0.0, d) * 0.4);
        if (vShape > 0.5) c = mix(vec3(0.04, 0.05, 0.09), c, smoothstep(0.28, 0.42, d));
        gl_FragColor = vec4(c, edge * vDim);
      }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  /* lines: folder centre to its files and to its sub-folders */
  const segs = [];
  function addSeg(a, b, cat, k) {
    segs.push({ a, b, cat, k });
  }
  dirs.forEach((d) => {
    if (!d.path) return;
    d.files.forEach((f) => d.files.length > 1 && addSeg(d.pos, f.pos, d.cat, 0.26));
    d.kids.forEach((k) => addSeg(d.pos, k.pos, d.cat, 0.5));
  });
  const linePos = new Float32Array(segs.length * 6);
  const lineCol = new Float32Array(segs.length * 6);
  segs.forEach((s, i) => linePos.set([s.a.x, s.a.y, s.a.z, s.b.x, s.b.y, s.b.z], i * 6));
  const lgeo = new THREE.BufferGeometry();
  lgeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
  lgeo.setAttribute("color", new THREE.BufferAttribute(lineCol, 3));
  const lines = new THREE.LineSegments(lgeo, new THREE.LineBasicMaterial({ vertexColors: true }));
  lines.frustumCulled = false;
  scene.add(lines);

  function paintLines() {
    segs.forEach((s, i) => {
      const on = !filter || s.cat === filter;
      const c = mode === "session" ? BG.clone().lerp(SESS_LATER, on ? s.k * 0.45 : s.k * 0.08) : BG.clone().lerp(catColor[s.cat], on ? s.k : s.k * 0.12);
      lineCol.set([c.r, c.g, c.b, c.r, c.g, c.b], i * 6);
    });
    lgeo.attributes.color.needsUpdate = true;
  }
  /* Colour modes: by folder (identity) or by session (this session / earlier / later). Slots 1 and 2 of the validated palette. */
  const SESS_NOW = new THREE.Color("#d95926"), SESS_PAST = new THREE.Color("#3987e5"), SESS_LATER = new THREE.Color("#8a93a8");
  function applyColors() {
    nodes.forEach((n) => {
      const i = n.i;
      let c, d = 1, b = 0;
      if (mode === "session") {
        if (n.v === step) { c = SESS_NOW; b = 0.35; } else if (n.v < step) { c = SESS_PAST; d = 0.85; } else { c = SESS_LATER; d = 0.1; }
      } else c = catColor[n.c];
      if (filter && n.c !== filter) d *= 0.15;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      dim[i] = d; baseBoost[i] = b; boost[i] = b + (n === selected ? 0.5 : 0);
    });
    geo.attributes.aColor.needsUpdate = true; geo.attributes.aDim.needsUpdate = true; geo.attributes.aBoost.needsUpdate = true;
    paintLines();
  }
  paintLines();

  /* labels */
  const labels = [];
  function addLabel(text, p, cls, color, R, isCat, cat) {
    const el = document.createElement("div");
    el.className = "lab " + cls;
    el.textContent = text;
    el.style.setProperty("--c", color);
    labelsEl.appendChild(el);
    labels.push({ el, p, R, isCat, cat });
  }
  dirs.forEach((d) => {
    if (!d.path) return;
    if (d.depth === 1) {
      const meta = CATS[d.cat];
      addLabel(meta.label, d.pos.clone().add(new THREE.Vector3(0, d.R * 0.62, 0)), "cat", meta.color, d.R, true, d.cat);
    } else if (d.total >= 4) {
      addLabel(d.name, d.pos.clone().add(new THREE.Vector3(0, d.rf + 1.4, 0)), "", CATS[d.cat].color, d.R, false, d.cat);
    }
  });

  /* sizing */
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    homeDist = fitHome();
    controls.maxDistance = homeDist * 1.8;
    if (!userMoved && !tween) camera.position.copy(centre).add(homeOffset(homeDist));
    uniforms.uScale.value = renderer.domElement.height / (2 * Math.tan((FOV * Math.PI) / 360));
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  /* camera moves */
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  function flyTo(target, dist) {
    const dir = camera.position.clone().sub(controls.target).normalize();
    const goal = { target: target.clone(), pos: target.clone().add(dir.multiplyScalar(dist)) };
    if (reduced) {
      controls.target.copy(goal.target);
      camera.position.copy(goal.pos);
      return;
    }
    tween = { t0: performance.now(), dur: 750, fromT: controls.target.clone(), fromP: camera.position.clone(), goal };
    controls.autoRotate = false;
  }
  function stepTween(now) {
    if (!tween) return;
    const t = Math.min(1, (now - tween.t0) / tween.dur);
    const e = ease(t);
    controls.target.lerpVectors(tween.fromT, tween.goal.target, e);
    camera.position.lerpVectors(tween.fromP, tween.goal.pos, e);
    if (t >= 1) tween = null;
  }

  /* filter chips */
  function setFilter(cat) {
    filter = cat;
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.cat === cat)));
    applyColors();
    if (cat) {
      const d = dirs.get(cat) || dirs.get("_about");
      flyTo(d.pos, Math.max(d.R * 2.3, 40));
    } else {
      flyTo(centre, homeDist);
    }
  }
  chips.forEach((c) => c.addEventListener("click", () => setFilter(c.dataset.cat === filter ? "" : c.dataset.cat)));

  /* picking in screen space */
  const v = new THREE.Vector3();
  function pick(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    let best = null;
    let bestScore = Infinity;
    for (const n of nodes) {
      if (filter && n.c !== filter) continue;
      if (mode === "session" && n.v > step) continue;
      v.copy(n.pos).project(camera);
      if (v.z > 1) continue;
      const sx = (v.x * 0.5 + 0.5) * rect.width;
      const sy = (-v.y * 0.5 + 0.5) * rect.height;
      const dist = Math.hypot(sx - mx, sy - my);
      const reach = Math.max(10, (size[n.i] * uniforms.uScale.value) / renderer.getPixelRatio() / n.pos.distanceTo(camera.position) / 2 + 4);
      if (dist <= reach) {
        const score = dist + v.z * 30;
        if (score < bestScore) {
          best = n;
          bestScore = score;
        }
      }
    }
    return best;
  }
  function setHover(n, x, y) {
    if (hovered && hovered !== n) boost[hovered.i] = baseBoost[hovered.i] + (hovered === selected ? 0.5 : 0);
    hovered = n;
    if (n) {
      boost[n.i] = baseBoost[n.i] + 0.7;
      tipEl.textContent = n.t;
      tipEl.hidden = false;
      const rect = stage.getBoundingClientRect();
      const tx = Math.min(x - rect.left + 14, rect.width - 200);
      tipEl.style.transform = `translate(${Math.max(8, tx)}px, ${Math.max(8, y - rect.top - 34)}px)`;
      canvas.style.cursor = "pointer";
    } else {
      tipEl.hidden = true;
      canvas.style.cursor = "";
    }
    geo.attributes.aBoost.needsUpdate = true;
  }
  canvas.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || e.buttons) return;
    setHover(pick(e.clientX, e.clientY), e.clientX, e.clientY);
  });
  canvas.addEventListener("pointerleave", () => setHover(null));
  let down = null;
  canvas.addEventListener("pointerdown", (e) => (down = { x: e.clientX, y: e.clientY, t: performance.now() }));
  canvas.addEventListener("pointerup", (e) => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    const quick = performance.now() - down.t < 600;
    down = null;
    if (moved > 6 || !quick) return;
    const n = pick(e.clientX, e.clientY);
    if (n) select(n);
  });

  function select(n) {
    if (selected) boost[selected.i] = baseBoost[selected.i];
    selected = n;
    boost[n.i] = baseBoost[n.i] + 0.5;
    geo.attributes.aBoost.needsUpdate = true;
    showCard(n, true);
    pinEl.hidden = false;
    pinEl.style.borderColor = CATS[n.c].color;
  }

  /* per-frame overlay work */
  function overlays() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    for (const L of labels) {
      v.copy(L.p).project(camera);
      let op = 0;
      if (v.z < 1) {
        const dist = camera.position.distanceTo(L.p);
        if (L.isCat) op = dist < L.R * 1.4 ? 0.25 : 1;
        else {
          const x = dist / L.R;
          op = Math.max(0, Math.min(1, (15 - x) / 8));
        }
        if (filter && L.cat !== filter) op *= 0.25;
      }
      L.el.style.opacity = op.toFixed(2);
      if (op > 0) L.el.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px) translate(-50%, -50%)`;
    }
    if (selected) {
      v.copy(selected.pos).project(camera);
      const hide = v.z > 1;
      pinEl.style.opacity = hide ? "0" : "1";
      pinEl.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px)`;
    }
  }

  /* loop, paused when off screen */
  let onScreen = true;
  new IntersectionObserver((entries) => (onScreen = entries[0].isIntersecting)).observe(stage);
  function frame(now) {
    requestAnimationFrame(frame);
    if (!onScreen || document.hidden) return;
    stepTween(now);
    controls.update();
    renderer.render(scene, camera);
    overlays();
  }
  requestAnimationFrame(frame);

  /* Session timeline */
  const tl = document.getElementById("timeline");
  if (PROV.length && tl) {
    const range = document.getElementById("tl-range"), play = document.getElementById("tl-play"), bars = document.getElementById("tl-bars"), label = document.getElementById("tl-label");
    const modeBtns = [...document.querySelectorAll(".modes button")];
    const total = PROV.reduce((a, x) => a + x.files, 0), maxFiles = Math.max(...PROV.map((x) => x.files));
    let timer = null;
    const fmt = niceDate;
    PROV.forEach((x, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.style.setProperty("--h", Math.max(5, (x.files / maxFiles) * 100) + "%");
      b.title = `${x.title} · ${x.files} files`; b.setAttribute("aria-label", `Session ${i + 1}: ${x.title}, ${x.files} files`);
      b.onclick = () => { pause(); setStep(i); }; bars.append(b);
    });
    function setStep(i) {
      step = i; range.value = String(i);
      [...bars.children].forEach((b, j) => (b.className = j === i ? "now" : j > i ? "later" : ""));
      const so = PROV.slice(0, i + 1).reduce((a, x) => a + x.files, 0), strong = document.createElement("b");
      strong.textContent = `Session ${i + 1} of ${PROV.length}: ${PROV[i].title}`;
      label.textContent = ""; label.append(strong, ` · ${fmt(PROV[i].date)} · adds ${PROV[i].files} files · ${so} of ${total} so far`);
      applyColors();
    }
    function pause() { if (timer) clearInterval(timer); timer = null; play.textContent = "Play"; }
    function startPlay() {
      if (step >= PROV.length - 1) setStep(0);
      play.textContent = "Pause";
      timer = setInterval(() => { if (step >= PROV.length - 1) pause(); else setStep(step + 1); }, 900);
    }
    play.onclick = () => (timer ? pause() : startPlay());
    range.oninput = () => { pause(); setStep(+range.value); };
    function setMode(m) {
      mode = m; modeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m))); tl.hidden = m !== "session";
      if (m === "session") { setStep(reduced ? PROV.length - 1 : 0); if (!reduced) startPlay(); } else { pause(); applyColors(); }
    }
    modeBtns.forEach((b) => (b.onclick = () => setMode(b.dataset.mode)));
  }

  const first = nodes.find((n) => n.p === "README.md") || nodes[0];
  select(first);
}

/* ------------------------------------------------------------------ card */

function niceDate(iso) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [y, m, d] = iso.split("-");
  return `${+d} ${months[+m - 1]} ${y}`;
}

function showCard(n, hasPin) {
  const meta = CATS[n.c];
  const kind = n.k === "app" ? n.ty || "Runnable page" : { doc: "Document", code: "Code or data" }[n.k];
  const verb = { doc: "Read", app: "Open page", code: "View code" }[n.k];
  cardEl.style.setProperty("--c", meta.color);
  cardEl.textContent = "";
  const k = document.createElement("div");
  k.className = "k";
  const dot = document.createElement("i");
  k.append(dot, `${meta.label} · ${kind}`);
  const h = document.createElement("h3");
  h.textContent = n.t;
  const p = document.createElement("p");
  p.className = "p";
  p.textContent = n.p;
  cardEl.append(k, h, p);
  if (PROV.length && n.v != null && PROV[n.v]) {
    const q = document.createElement("p");
    q.className = "sess";
    q.textContent = `From: ${PROV[n.v].title}`;
    cardEl.append(q);
  }
  if (n.ds) {
    const dts = document.createElement("p");
    dts.className = "stamp";
    dts.textContent = `Started ${niceDate(n.ds)} · Updated ${niceDate(n.du)}`;
    cardEl.append(dts);
  }
  if (n.x) {
    const x = document.createElement("p");
    x.className = "x";
    x.textContent = n.x;
    cardEl.append(x);
  }
  const go = document.createElement("a");
  go.className = "go";
  go.href = n.u;
  go.textContent = verb;
  cardEl.append(go);
  if (n.d) {
    const dir = document.createElement("a");
    dir.className = "dir";
    dir.href = n.d + "/";
    dir.textContent = "Open folder";
    cardEl.append(dir);
  }
}

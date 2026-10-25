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
let mode = "overview";
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
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.45;
  controls.minDistance = 8;
  controls.maxDistance = homeDist * 1.8;
  let tween = null;
  let userMoved = false;
  let ovReady = false;
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
        float d = (vShape > 0.5 && vShape < 1.5) ? abs(p.x) + abs(p.y) : length(p);
        if (d > 1.0) discard;
        if (vShape > 1.5 && d < 0.6) discard;
        float edge = smoothstep(1.0, 0.8, d);
        vec3 c = mix(vColor, vec3(1.0), smoothstep(0.6, 0.0, d) * 0.4);
        if (vShape > 0.5 && vShape < 1.5) c = mix(vec3(0.04, 0.05, 0.09), c, smoothstep(0.28, 0.42, d));
        if (vShape > 1.5) c = vColor;
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
    if (mode === "overview") { if (ovReady && !userMoved) ovFit(false); } else if (!userMoved && !tween) camera.position.copy(centre).add(homeOffset(homeDist));
    uniforms.uScale.value = renderer.domElement.height / (2 * Math.tan((FOV * Math.PI) / 360));
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  /* camera moves */
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  function flyTo(target, dist, dirOverride) {
    const dir = dirOverride ? dirOverride.clone().normalize() : camera.position.clone().sub(controls.target).normalize();
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
  chips.forEach((c) => c.addEventListener("click", () => (mode === "overview" ? ovChip(c.dataset.cat) : setFilter(c.dataset.cat === filter ? "" : c.dataset.cat))));

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
    if (mode === "overview") return ovHover(e.clientX, e.clientY);
    setHover(pick(e.clientX, e.clientY), e.clientX, e.clientY);
  });
  canvas.addEventListener("pointerleave", () => (mode === "overview" ? ovHover(-1, -1) : setHover(null)));
  let down = null;
  canvas.addEventListener("pointerdown", (e) => (down = { x: e.clientX, y: e.clientY, t: performance.now() }));
  canvas.addEventListener("pointerup", (e) => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    const quick = performance.now() - down.t < 600;
    down = null;
    if (moved > 6 || !quick) return;
    if (mode === "overview") {
      const it = ovPick(e.clientX, e.clientY);
      if (it) ovClick(it);
      return;
    }
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
    const inOv = mode === "overview";
    ovLabelsEl.style.display = inOv ? "" : "none";
    labelsEl.classList.toggle("inov", inOv);
    if (inOv) {
      for (const L of ovLabelList) {
        v.copy(L.p).project(camera);
        const show = v.z < 1;
        L.el.style.opacity = show ? L.op : "0";
        if (show) L.el.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px) translate(-50%, -50%)`;
      }
      const sp = ovSel && (ovSel.kind === "dir" ? ovSel.node.pos : ovSel.file.ovPos);
      if (sp) {
        v.copy(sp).project(camera);
        pinEl.style.opacity = v.z > 1 ? "0" : "1";
        pinEl.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px)`;
      }
      return;
    }
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
  let tlApi = null;
  if (PROV.length && tl) {
    const range = document.getElementById("tl-range"), play = document.getElementById("tl-play"), bars = document.getElementById("tl-bars"), label = document.getElementById("tl-label");
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
    tlApi = { setStep, pause, startPlay };
  }

  /* ================================================================== Overview
   * About this repo in the middle, the areas around it, every link labelled with its file count. Click an area (here or in the
   * filter row) to open its folders; click a folder to open it further. Only one branch is open at a time.
   */
  const ovLabelsEl = document.createElement("div");
  ovLabelsEl.className = "ovlabels";
  labelsEl.appendChild(ovLabelsEl);
  const CAP = 900;
  const oPos = new Float32Array(CAP * 3), oCol = new Float32Array(CAP * 3), oSize = new Float32Array(CAP), oShape = new Float32Array(CAP), oDim = new Float32Array(CAP).fill(1), oBoost = new Float32Array(CAP);
  const ovGeo = new THREE.BufferGeometry();
  ovGeo.setAttribute("position", new THREE.BufferAttribute(oPos, 3));
  ovGeo.setAttribute("aColor", new THREE.BufferAttribute(oCol, 3));
  ovGeo.setAttribute("aSize", new THREE.BufferAttribute(oSize, 1));
  ovGeo.setAttribute("aShape", new THREE.BufferAttribute(oShape, 1));
  ovGeo.setAttribute("aDim", new THREE.BufferAttribute(oDim, 1));
  ovGeo.setAttribute("aBoost", new THREE.BufferAttribute(oBoost, 1));
  ovGeo.setDrawRange(0, 0);
  const ovPoints = new THREE.Points(ovGeo, mat);
  ovPoints.frustumCulled = false;
  scene.add(ovPoints);
  const oLinePos = new Float32Array(CAP * 6), oLineCol = new Float32Array(CAP * 6);
  const ovLgeo = new THREE.BufferGeometry();
  ovLgeo.setAttribute("position", new THREE.BufferAttribute(oLinePos, 3));
  ovLgeo.setAttribute("color", new THREE.BufferAttribute(oLineCol, 3));
  ovLgeo.setDrawRange(0, 0);
  const ovLines = new THREE.LineSegments(ovLgeo, new THREE.LineBasicMaterial({ vertexColors: true }));
  ovLines.frustumCulled = false;
  scene.add(ovLines);

  const aboutDir = dirs.get("_about");
  const ovAreas = root.kids.filter((k) => k.path !== "_about");
  const ovMap = new Map();
  let ovSel = null;
  let ovHovered = null;
  const ovItems = [];
  let ovLabelList = [];
  const UP = new THREE.Vector3(0, 1, 0);

  function ovNode(dir, parent) {
    let n = ovMap.get(dir.path);
    if (!n) {
      const isRoot = !parent;
      const area = !!parent && parent.isRoot;
      n = {
        dir, parent, isRoot, area, depth: isRoot ? 0 : parent.depth + 1, cat: isRoot ? "root" : dir.path.split("/")[0],
        name: isRoot ? "About this repo" : area ? CATS[dir.cat].label : dir.name,
        count: isRoot ? dir.files.length : dir.total, expanded: false, pos: new THREE.Vector3(), out: new THREE.Vector3(0, 0, 1), kids: null,
      };
      ovMap.set(dir.path, n);
    }
    return n;
  }
  const ovRoot = ovNode(aboutDir, null);
  const kidDirs = (n) => (n.isRoot ? ovAreas : n.dir.kids);
  const kidNodes = (n) => n.kids || (n.kids = kidDirs(n).map((d) => ovNode(d, n)));
  const fileList = (n) => n.dir.files;
  const plural = (c, w) => `${c} ${w}${c === 1 ? "" : "s"}`;

  function frame2(out) {
    const w1 = new THREE.Vector3().crossVectors(out, UP);
    if (w1.lengthSq() < 0.05) w1.set(1, 0, 0);
    w1.normalize();
    return [w1, new THREE.Vector3().crossVectors(out, w1).normalize()];
  }
  function placeKids(n) {
    const ks = kidNodes(n), k = ks.length;
    if (!k) return;
    const [w1, w2] = frame2(n.out);
    ks.forEach((c, j) => {
      let dir, r;
      if (n.isRoot) {
        const a = -Math.PI / 2 + (j / k) * Math.PI * 2;
        dir = new THREE.Vector3(Math.cos(a), j % 2 ? 0.1 : -0.1, Math.sin(a));
        r = 14;
      } else if (k <= 8) {
        const th = (j / k) * Math.PI * 2, al = k === 1 ? 0 : 0.95;
        dir = n.out.clone().multiplyScalar(Math.cos(al)).addScaledVector(w1, Math.sin(al) * Math.cos(th)).addScaledVector(w2, Math.sin(al) * Math.sin(th));
        r = 11 * Math.pow(0.85, n.depth - 1);
      } else {
        const z = 1 - (1 - Math.cos(1.2)) * ((j + 0.5) / k), s2 = Math.sqrt(1 - z * z), ph = j * 2.399963;
        dir = n.out.clone().multiplyScalar(z).addScaledVector(w1, s2 * Math.cos(ph)).addScaledVector(w2, s2 * Math.sin(ph));
        r = 10 + 0.5 * Math.sqrt(k);
      }
      c.out.copy(dir).normalize();
      c.pos.copy(n.pos).addScaledVector(c.out, r);
    });
  }
  function placeFiles(n) {
    const fs = fileList(n), m = fs.length;
    if (!m) return;
    const rf = 0.9 + 0.3 * Math.sqrt(m);
    const centreF = n.pos.clone().addScaledVector(new THREE.Vector3(0, -1, 0).addScaledVector(n.out, -0.35).normalize(), 1.8 + rf);
    fs.forEach((f, i) => {
      const y = 1 - ((i + 0.5) / m) * 2, rr = Math.sqrt(1 - y * y), th = i * 2.399963;
      f.ovPos = new THREE.Vector3(Math.cos(th) * rr, y, Math.sin(th) * rr).multiplyScalar(rf).add(centreF);
    });
  }
  const ovCollapse = (n) => { n.expanded = false; (n.kids || []).forEach(ovCollapse); };
  function ovOpen(n) {
    const chain = [];
    for (let a = n; a && !a.isRoot; a = a.parent) chain.unshift(a);
    chain.forEach((a) => {
      kidNodes(a.parent).forEach((sib) => sib !== a && ovCollapse(sib));
      a.expanded = true;
    });
  }
  const mix = (hex, t) => BG.clone().lerp(hex, t);

  function ovRebuild() {
    ovItems.length = 0;
    ovLabelList.forEach((L) => L.el.remove());
    ovLabelList = [];
    const segs2 = [];
    const addLabel2 = (text, p, cls, color, op) => {
      const el = document.createElement("div");
      el.className = "lab " + cls;
      el.textContent = text;
      if (color) el.style.setProperty("--c", color);
      ovLabelsEl.appendChild(el);
      ovLabelList.push({ el, p, op: String(op) });
    };
    const anyOpen = ovAreas.some((d) => ovNode(d, ovRoot).expanded);
    ovRoot.pos.set(0, 0, 0);
    ovRoot.out.set(0, 0, 1);
    const bright = (n) => n.isRoot || n.expanded || (n.parent && !n.parent.isRoot && n.parent.expanded) || (n.area && !anyOpen);
    const visit = (n) => {
      const b = bright(n) ? 1 : 0.32;
      ovItems.push({ kind: "dir", owner: n, node: n, pos: n.pos, size: n.isRoot ? 2.6 : 0.7 + 0.2 * Math.log2(n.count + 1), shape: n.expanded || (n.isRoot && n.expanded) ? 2 : 0, dim: b, color: catColor[n.cat] });
      addLabel2(n.name, n.pos, n.area || n.isRoot ? "ovn big" : "ovn", CATS[n.cat].color, b === 1 ? 1 : 0.45);
      if (n.isRoot || n.expanded) {
        if (!n.isRoot || true) placeKids(n);
        kidNodes(n).forEach((c) => {
          const mid = n.pos.clone().lerp(c.pos, 0.5);
          segs2.push({ a: n.pos, b: c.pos, color: catColor[c.cat], t: bright(c) ? 0.55 : 0.18 });
          addLabel2(plural(c.count, "file"), mid, "ove", null, bright(c) ? 1 : 0.4);
          visit(c);
        });
        if (n.expanded) {
          placeFiles(n);
          const fs = fileList(n);
          fs.forEach((f) => {
            ovItems.push({ kind: "file", owner: n, file: f, pos: f.ovPos, size: f.k === "app" ? 1.15 : 0.7, shape: f.k === "app" ? 1 : 0, dim: 1, color: catColor[f.c] });
            segs2.push({ a: n.pos, b: f.ovPos, color: catColor[f.c], t: 0.12 });
          });
          if (fs.length <= 8 && !kidNodes(n).length) fs.forEach((f) => addLabel2(f.t.length > 28 ? f.t.slice(0, 27) + "…" : f.t, f.ovPos.clone().add(new THREE.Vector3(0, 0.9, 0)), "ovf", null, 1));
        }
      }
    };
    visit(ovRoot);
    ovItems.forEach((it, i) => {
      oPos.set([it.pos.x, it.pos.y, it.pos.z], i * 3);
      oCol.set([it.color.r, it.color.g, it.color.b], i * 3);
      oSize[i] = it.size; oShape[i] = it.shape; oDim[i] = it.dim;
      const sel = ovSel && ((ovSel.kind === "dir" && it.node === ovSel.node) || (ovSel.kind === "file" && it.file === ovSel.file));
      oBoost[i] = sel ? 0.25 : 0;
      it.i = i;
    });
    if (ovSel && ovSel.kind === "dir" && ovSel.node.isRoot && ovRoot.expanded) { /* root files drawn as items above */ }
    ovGeo.setDrawRange(0, ovItems.length);
    ["position", "aColor", "aSize", "aShape", "aDim", "aBoost"].forEach((k) => (ovGeo.attributes[k].needsUpdate = true));
    segs2.forEach((s, i) => {
      const c = mix(s.color, s.t);
      oLinePos.set([s.a.x, s.a.y, s.a.z, s.b.x, s.b.y, s.b.z], i * 6);
      oLineCol.set([c.r, c.g, c.b, c.r, c.g, c.b], i * 6);
    });
    ovLgeo.setDrawRange(0, segs2.length * 2);
    ovLgeo.attributes.position.needsUpdate = true;
    ovLgeo.attributes.color.needsUpdate = true;
    updateChips();
  }

  let ovFocus = null;
  const underNode = (n, f) => { for (let a = n; a; a = a.parent) if (a === f) return true; return false; };
  function ovFit(animate, focus) {
    if (focus !== undefined) ovFocus = focus;
    const f = ovFocus && !ovFocus.isRoot ? ovFocus : null;
    const pts = ovItems.filter((it) => !f || underNode(it.owner, f)).map((it) => it.pos);
    const bx = new THREE.Box3().setFromPoints(pts);
    const c = bx.getCenter(new THREE.Vector3());
    let r = 0;
    pts.forEach((q) => (r = Math.max(r, q.distanceTo(c))));
    r += f ? 5 : 5;
    const tanH = Math.tan((FOV * Math.PI) / 360);
    const dist = Math.max(r / tanH, r / (tanH * Math.max(0.5, Math.min(1.4, camera.aspect)))) * 0.95;
    controls.maxDistance = Math.max(controls.maxDistance, dist * 1.8);
    let dir;
    if (f) {
      const side = new THREE.Vector3().crossVectors(f.out, UP);
      if (side.lengthSq() < 0.05) side.set(1, 0, 0);
      dir = side.normalize().multiplyScalar(0.9).add(new THREE.Vector3(0, 0.38, 0));
    } else dir = new THREE.Vector3(0, 0.72, 0.7);
    dir.normalize();
    if (animate) flyTo(c, dist, dir);
    else { controls.target.copy(c); camera.position.copy(c).addScaledVector(dir, dist); }
  }
  function updateChips() {
    const open = ovAreas.map((d) => ovNode(d, ovRoot)).find((n) => n.expanded);
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.cat === (open ? open.cat : ovRoot.expanded && c.dataset.cat === "root" ? "root" : ""))));
  }

  function ovPick(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left, my = clientY - rect.top;
    let best = null, bestScore = Infinity;
    for (const it of ovItems) {
      v.copy(it.pos).project(camera);
      if (v.z > 1) continue;
      const sx = (v.x * 0.5 + 0.5) * rect.width, sy = (-v.y * 0.5 + 0.5) * rect.height;
      const px = (it.size * uniforms.uScale.value) / renderer.getPixelRatio() / it.pos.distanceTo(camera.position);
      const reach = Math.max(11, px / 2 + 4);
      const d = Math.hypot(sx - mx, sy - my);
      if (d <= reach && d + v.z * 30 < bestScore) { best = it; bestScore = d + v.z * 30; }
    }
    return best;
  }
  function ovHover(cx, cy) {
    const it = cx < 0 ? null : ovPick(cx, cy);
    if (ovHovered && ovHovered !== it) oBoost[ovHovered.i] = ovIsSel(ovHovered) ? 0.25 : 0;
    ovHovered = it;
    if (it) {
      oBoost[it.i] = 0.45;
      tipEl.textContent = it.kind === "dir" ? `${it.node.name} · ${plural(it.node.count, "file")} · click to ${it.node.expanded && !it.node.isRoot ? "close" : "open"}` : it.file.t;
      tipEl.hidden = false;
      const rect = stage.getBoundingClientRect();
      tipEl.style.transform = `translate(${Math.max(8, Math.min(cx - rect.left + 14, rect.width - 220))}px, ${Math.max(8, cy - rect.top - 34)}px)`;
      canvas.style.cursor = "pointer";
    } else {
      tipEl.hidden = true;
      canvas.style.cursor = "";
    }
    ovGeo.attributes.aBoost.needsUpdate = true;
  }
  const ovIsSel = (it) => ovSel && ((ovSel.kind === "dir" && it.node === ovSel.node) || (ovSel.kind === "file" && it.file === ovSel.file));
  function ovClick(it) {
    tipEl.hidden = true;
    if (it.kind === "file") { ovSelect({ kind: "file", file: it.file }); return; }
    ovToggle(it.node);
  }
  function ovToggle(n) {
    if (n.isRoot) n.expanded = !n.expanded;
    else if (n.expanded) ovCollapse(n);
    else ovOpen(n);
    ovSelect({ kind: "dir", node: n }, true);
  }
  function ovSelect(sel, refit) {
    ovSel = sel;
    ovRebuild();
    pinEl.hidden = false;
    pinEl.style.borderColor = "#fff";
    if (sel.kind === "dir") showDirCard(sel.node);
    else showCard(sel.file, true);
    if (refit) ovFit(true, sel.kind === "dir" ? (sel.node.expanded ? sel.node : sel.node.parent) : undefined);
  }
  function ovChip(cat) {
    if (cat === "") {
      ovMap.forEach((n) => ovCollapse(n));
      ovSelect({ kind: "dir", node: ovRoot }, true);
    } else if (cat === "root") {
      ovToggle(ovRoot);
    } else {
      const a = ovMap.get(cat) || ovNode(dirs.get(cat), ovRoot);
      if (a.expanded) { ovCollapse(a); ovSelect({ kind: "dir", node: a }, true); } else ovToggle(a);
    }
  }

  /* the side card for a folder */
  function showDirCard(n) {
    const meta = CATS[n.cat];
    cardEl.style.setProperty("--c", meta.color);
    cardEl.textContent = "";
    const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
    const k = el("div", "k"); k.append(el("i"), `${n.isRoot ? "Start here" : n.area ? "Area" : "Folder"}`); 
    cardEl.append(k, el("h3", "", n.name));
    if (!n.isRoot && !n.area) cardEl.append(el("p", "p", n.dir.path));
    const ks = kidNodes(n), fs = fileList(n);
    const blurb = n.isRoot
      ? `Research, tools and documentation from 30 Claude Code sessions, merged into one repository. These ${fs.length} files explain what is here and how it was put together.`
      : n.area ? meta.desc : `${plural(n.count, "file")}${ks.length ? ` in ${plural(ks.length, "subfolder")}` : ""}.`;
    cardEl.append(el("p", "x", blurb));
    if (ks.length) {
      cardEl.append(el("p", "sub", n.isRoot ? "Areas" : "Subfolders"));
      const ul = el("ul", "inside");
      ks.slice(0, 9).forEach((c) => { const li = el("li"), b = el("button", "", c.name); b.type = "button"; b.append(el("small", "", plural(c.count, "file"))); b.onclick = () => ovToggle(c); li.append(b); ul.append(li); });
      if (ks.length > 9) ul.append(el("li", "more", `and ${ks.length - 9} more`));
      cardEl.append(ul);
    }
    if (fs.length) {
      cardEl.append(el("p", "sub", n.isRoot ? "Read first" : "Files here"));
      const ul = el("ul", "inside");
      fs.slice(0, n.isRoot ? 10 : 6).forEach((f) => { const li = el("li"), a = el("a", "", f.t); a.href = f.u; li.append(a); ul.append(li); });
      if (!n.isRoot && fs.length > 6) ul.append(el("li", "more", `and ${fs.length - 6} more`));
      cardEl.append(ul);
    }
    const go = el("a", "go", n.isRoot ? "Read the README" : "Open folder page");
    go.href = n.isRoot ? "README.html" : n.dir.path + "/";
    cardEl.append(go);
    if (!n.isRoot && n.expanded) { const close = el("button", "dir", "Close"); close.type = "button"; close.onclick = () => ovToggle(n); cardEl.append(close); }
  }

  /* ================================================================== modes */
  const modeBtns = [...document.querySelectorAll(".modes button")];
  const hintEl = document.getElementById("hint");
  const homeDir = homeOffset(1).normalize();
  const HINTS = {
    overview: "Click an area or a folder to open it · drag to rotate · scroll to zoom",
    folder: "Every file as a point · drag to rotate · scroll or pinch to zoom · click a point",
    session: "Watch the repository grow, one chat at a time · drag to rotate · click a point",
  };
  function setMode(m) {
    const prev = mode;
    mode = m;
    modeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
    if (hintEl) hintEl.textContent = HINTS[m];
    const cloud = m !== "overview";
    points.visible = cloud;
    lines.visible = cloud;
    ovPoints.visible = !cloud;
    ovLines.visible = !cloud;
    if (tl) tl.hidden = m !== "session";
    tipEl.hidden = true;
    if (tlApi && m !== "session") tlApi.pause();
    if (m === "overview") {
      chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
      ovSelect(ovSel || { kind: "dir", node: ovRoot });
      if (prev !== "overview") { ovFit(false, null); const d = new THREE.Vector3(0, 0.72, 0.7); flyTo(controls.target.clone(), camera.position.distanceTo(controls.target), d); }
      else ovFit(false, null);
    } else {
      filter = "";
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.cat === "")));
      applyColors();
      if (prev === "overview") flyTo(centre, homeDist, homeDir);
      if (!selected) select(nodes.find((n) => n.p === "README.md") || nodes[0]);
      else showCard(selected, true);
      pinEl.hidden = false;
      if (m === "session" && tlApi) { tlApi.setStep(reduced ? PROV.length - 1 : 0); if (!reduced) tlApi.startPlay(); }
    }
  }
  modeBtns.forEach((b) => (b.onclick = () => setMode(b.dataset.mode)));
  ovReady = true;
  mode = "overview";
  ovRebuild();
  ovFit(false, null);
  { const d = new THREE.Vector3(0, 0.72, 0.7).normalize(); const dist = camera.position.distanceTo(controls.target); camera.position.copy(controls.target).addScaledVector(d, dist); }
  points.visible = false;
  lines.visible = false;
  ovSelect({ kind: "dir", node: ovRoot });
  if (hintEl) hintEl.textContent = HINTS.overview;
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

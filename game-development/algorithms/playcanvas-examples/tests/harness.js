// Loads PlayCanvas scripts with a permissive stub of the engine so their logic can be run in node.
const vm = require("vm"), fs = require("fs"), path = require("path");
function stub(name) {
  const store = {};
  const f = function () { return stub(name); };
  return new Proxy(f, {
    get(t, k) {
      if (k in store) return store[k];
      if (k === Symbol.toPrimitive) return () => 0;
      if (k === "then") return undefined;
      if (k === "length") return 0;
      if (k === "x" || k === "y" || k === "z" || k === "w") return 0;
      if (k === "children") return [];
      if (k === "forEach" || k === "map" || k === "filter") return () => [];
      return stub(name + "." + String(k));
    },
    set(t, k, v) { store[k] = v; return true; },
    construct() { return stub(name + ".new"); },
  });
}
function load(file, extra = {}) {
  const src = fs.readFileSync(file, "utf8");
  let Script = null, sname = null;
  const logs = [];
  const pc = new Proxy({}, {
    get(t, k) {
      if (k === "createScript") return (n) => {
        sname = n;
        function S() {}
        S.attributes = { index: {}, add(n, d) { this.index[n] = d; } };
        S.prototype = {};
        Script = S;
        return S;
      };
      if (k === "KEY_SPACE") return 32;
      if (k === "Vec3") return class { constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; } clone() { return new this.constructor(this.x, this.y, this.z); } add(o) { this.x += o.x; this.y += o.y; this.z += o.z; return this; } add2(a, b) { this.x = a.x + b.x; this.y = a.y + b.y; this.z = a.z + b.z; return this; } sub(o) { this.x -= o.x; this.y -= o.y; this.z -= o.z; return this; } sub2(a, b) { this.x = a.x - b.x; this.y = a.y - b.y; this.z = a.z - b.z; return this; } scale(k) { this.x *= k; this.y *= k; this.z *= k; return this; } set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; } copy(o) { return this.set(o.x, o.y, o.z); } lerp(a, b, t) { return this.set(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t); } length() { return Math.hypot(this.x, this.y, this.z); } normalize() { return this; } };
      return stub("pc." + String(k));
    },
  });
  const ctx = { pc, console: { log: (...a) => logs.push(a.join(" ")), warn() {}, error: (...a) => logs.push("ERR " + a.join(" ")) }, Math, JSON, Object, Array, Set, Map, Date, Number, String, Infinity, NaN, parseInt, parseFloat, isNaN, setTimeout() {}, clearTimeout() {}, performance: { now: () => 0 }, window: {}, navigator: { mediaDevices: stub('md') }, document: stub("document"), ...extra };
  vm.createContext(ctx);
  vm.runInContext(src, ctx, { filename: file });
  return { Script, sname, logs, ctx };
}
function instance(file, extra) {
  const { Script, logs, ctx } = load(file, extra);
  const o = new Script();
  for (const [k, d] of Object.entries(Script.attributes.index)) o[k] = d.default !== undefined ? JSON.parse(JSON.stringify(d.default)) : undefined;
  o.entity = stub("entity"); o.app = stub("app");
  o.on = () => {}; o.fire = () => {};
  return { o, logs, Script };
}
module.exports = { load, instance, stub };

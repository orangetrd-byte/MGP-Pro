'use strict';
const APP_BUILD = 'MGP Pro | v1.0.0 | Build 2026.07.17.02';

// Material speed data: [sfmLow, sfmHigh] (inch), [vcLow, vcHigh] (metric m/min).
// Typical shop starting ranges — verify per machine/setup. Source: common machining references.
const MATERIALS = {
  // Aluminum
  'aluminum-1100': { name: 'Aluminum 1100 (pure)', sfm: [300, 900], vc: [90, 275] },
  'aluminum-2011': { name: 'Aluminum 2011 (free-cut)', sfm: [300, 1000], vc: [90, 300] },
  'aluminum-2024': { name: 'Aluminum 2024', sfm: [300, 750], vc: [90, 230] },
  'aluminum-6061': { name: 'Aluminum 6061', sfm: [300, 1000], vc: [90, 300] },
  'aluminum-7075': { name: 'Aluminum 7075', sfm: [200, 750], vc: [60, 230] },
  'aluminum-cast': { name: 'Aluminum Cast', sfm: [250, 700], vc: [75, 215] },
  // Steel - mild / low carbon
  'steel-1018': { name: 'Mild Steel 1018', sfm: [100, 300], vc: [30, 90] },
  'steel-1020': { name: 'Mild Steel 1020', sfm: [100, 325], vc: [30, 100] },
  'steel-1045': { name: 'Medium Carbon 1045', sfm: [90, 275], vc: [28, 84] },
  'steel-1144': { name: 'Stressproof 1144', sfm: [100, 325], vc: [30, 100] },
  'steel-12l14': { name: 'Free-Cut 12L14', sfm: [150, 400], vc: [45, 120] },
  'steel-4140': { name: 'Alloy 4140', sfm: [80, 250], vc: [25, 75] },
  'steel-4340': { name: 'Alloy 4340', sfm: [70, 225], vc: [20, 70] },
  'steel-a36': { name: 'Structural A36', sfm: [100, 300], vc: [30, 90] },
  // Stainless
  'ss-303': { name: 'Stainless 303 (free-mach)', sfm: [90, 350], vc: [27, 105] },
  'ss-304': { name: 'Stainless 304', sfm: [50, 200], vc: [15, 60] },
  'ss-316': { name: 'Stainless 316', sfm: [50, 180], vc: [15, 55] },
  'ss-17-4ph': { name: 'Stainless 17-4PH', sfm: [50, 175], vc: [15, 53] },
  'ss-440c': { name: 'Stainless 440C', sfm: [40, 150], vc: [12, 45] },
  // Cast iron
  'ci-gray': { name: 'Gray Cast Iron', sfm: [75, 225], vc: [25, 70] },
  'ci-ductile': { name: 'Ductile Iron', sfm: [75, 250], vc: [25, 75] },
  // Brass / bronze
  'brass-360': { name: 'Free-Cut Brass 360', sfm: [200, 400], vc: [60, 120] },
  'brass-260': { name: 'Cartridge Brass 260', sfm: [150, 350], vc: [45, 105] },
  'bronze-932': { name: 'Bearing Bronze 932', sfm: [150, 350], vc: [45, 105] },
  // Copper
  'copper-c110': { name: 'Copper C110', sfm: [200, 500], vc: [60, 150] },
  'copper-beryllium': { name: 'Copper Beryllium', sfm: [150, 350], vc: [45, 105] },
  // Titanium
  'ti-6al4v': { name: 'Titanium 6Al-4V', sfm: [40, 140], vc: [12, 40] },
  'ti-cp': { name: 'Titanium CP (Grade 2)', sfm: [35, 130], vc: [10, 38] },
  // Tool steel
  'ts-a2': { name: 'Tool Steel A2', sfm: [40, 150], vc: [12, 45] },
  'ts-d2': { name: 'Tool Steel D2', sfm: [35, 130], vc: [10, 40] },
  'ts-o1': { name: 'Tool Steel O1', sfm: [50, 175], vc: [15, 53] },
  // Plastics
  'plastic-delrin': { name: 'Delrin (acetal)', sfm: [300, 1000], vc: [90, 300] },
  'plastic-uptfe': { name: 'PTFE (Teflon)', sfm: [200, 800], vc: [60, 245] },
  'plastic-uhmw': { name: 'UHMW', sfm: [250, 900], vc: [75, 275] },
};

// GD&T descriptors (the #1 app's most-praised reference). Plain-language, shop-floor.
const GDT = [
  { sym: '⏸', name: 'Flatness', desc: 'All points on a surface lie between two parallel planes. Form control — no datums.' },
  { sym: '○', name: 'Roundness', desc: 'All points on a circular element lie within an annulus. Form control — no datums.' },
  { sym: '⌓', name: 'Cylindricity', desc: 'Combines roundness + straightness around a cylinder. Form control.' },
  { sym: '∥', name: 'Parallelism', desc: 'Surface/axis stays parallel to a datum within a tolerance zone.' },
  { sym: '⊥', name: 'Perpendicularity', desc: 'Surface/axis at 90° to a datum within tolerance.' },
  { sym: '∠', name: 'Angularity', desc: 'Surface/axis at a stated angle to a datum within tolerance.' },
  { sym: '◎', name: 'Position', desc: 'True position of a feature from datums within a diameter/zone. The big one for holes.' },
  { sym: '⌖', name: 'True Position (basic)', desc: 'Theoretically exact location from datums; tolerance defines the zone.' },
  { sym: '⦙', name: 'Concentricity', desc: 'Axis of feature coincides with datum axis. Rarely used — hard to inspect.' },
  { sym: '◎⃞', name: 'Symmetry', desc: 'Median points of feature symmetric about datum center plane.' },
  { sym: '↗', name: 'Circular Runout', desc: 'Surface variation at one circle as part rotates about datum.' },
  { sym: '↗↗', name: 'Total Runout', desc: 'Entire surface variation as part rotates. Controls form + coaxiality.' },
  { sym: '⌴', name: 'Straightness', desc: 'Line/axis lies within a tolerance zone. Form control.' },
  { sym: 'Ⓜ', name: 'Maximum Material Condition (MMC)', desc: 'Tightest feature size (most material). Bonus tol at smaller sizes.' },
  { sym: 'Ⓛ', name: 'Least Material Condition (LMC)', desc: 'Loosest feature size (least material).' },
  { sym: 'Ⓕ', name: 'Datum Feature', desc: 'Physical surface used as a reference. Marked with a boxed letter.' },
];

const state = { unit: 'inch' };

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('build-tag').textContent = APP_BUILD;

  const matSel = document.getElementById('mat-select');
  Object.entries(MATERIALS).forEach(([key, m]) => {
    const o = document.createElement('option');
    o.value = key; o.textContent = m.name;
    matSel.appendChild(o);
  });
  const prefillSfm = () => {
    const m = MATERIALS[matSel.value];
    const high = state.unit === 'inch' ? m.sfm[1] : m.vc[1];
    document.getElementById('sfm-input').placeholder = String(high);
  };
  matSel.addEventListener('change', prefillSfm);
  prefillSfm();

  document.querySelectorAll('#unit-seg .seg-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#unit-seg .seg-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      state.unit = b.dataset.unit;
      const metric = state.unit === 'metric';
      document.getElementById('dia-label').textContent = metric ? 'Diameter (mm)' : 'Diameter (in)';
      document.getElementById('sfm-label').textContent = metric ? 'Cutting speed (m/min)' : 'Surface speed (SFM)';
      prefillSfm();
    });
  });

  const opSel = document.getElementById('op-select');
  const syncOp = () => {
    const mill = opSel.value === 'mill';
    document.getElementById('flutes-row').classList.toggle('hidden', !mill);
    document.getElementById('feed-label').textContent = mill ? 'Feed / tooth (IPT)' : 'Feed / rev (IPR)';
  };
  opSel.addEventListener('change', syncOp);
  syncOp();

  document.getElementById('calc-speeds-btn').addEventListener('click', calcSpeeds);
  document.getElementById('calc-thread-btn').addEventListener('click', calcThread);
  document.getElementById('calc-tap-btn').addEventListener('click', calcTap);
  document.getElementById('calc-truepos-btn').addEventListener('click', calcTruePos);
  document.getElementById('calc-bolt-btn').addEventListener('click', calcBolt);
  document.getElementById('calc-conv-btn').addEventListener('click', calcConv);
  renderGdt();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.screen).classList.add('active');
    });
  });
});

function num(id) { const v = parseFloat(document.getElementById(id).value); return isNaN(v) ? null : v; }

function calcSpeeds() {
  const out = document.getElementById('speeds-result');
  const dia = num('dia-input');
  const m = MATERIALS[document.getElementById('mat-select').value];
  const sfm = num('sfm-input') ?? (state.unit === 'inch' ? m.sfm[1] : m.vc[1]);
  const feed = num('feed-input');
  if (!dia || dia <= 0) { out.innerHTML = 'Enter a diameter.'; return; }

  const rpm = state.unit === 'inch' ? (sfm * 3.8197) / dia : (sfm * 1000) / (Math.PI * dia);
  let feedNote = '';
  if (feed != null) {
    const op = document.getElementById('op-select').value;
    if (op === 'mill') {
      const flutes = num('flutes-input') || 2;
      const ipm = feed * flutes * rpm;
      feedNote = `Feed: <b>${ipm.toFixed(1)} ${state.unit === 'metric' ? 'mm/min' : 'IPM'}</b> (${feed} IPT × ${flutes} flutes × ${rpm.toFixed(0)} RPM)`;
    } else {
      const ipm = feed * rpm;
      feedNote = `Feed: <b>${ipm.toFixed(1)} ${state.unit === 'metric' ? 'mm/min' : 'IPM'}</b> (${feed} IPR × ${rpm.toFixed(0)} RPM)`;
    }
  }
  out.innerHTML = `RPM: <b>${rpm.toFixed(0)}</b><br>${feedNote}`;
}

function calcThread() {
  const out = document.getElementById('thread-result');
  const major = num('th-major'), tpi = num('th-tpi');
  if (!major || !tpi) { out.innerHTML = 'Enter major diameter and TPI.'; return; }
  const p = 1 / tpi;
  out.innerHTML =
    `Pitch: <b>${p.toFixed(4)}</b> in<br>` +
    `Pitch diameter: <b>${(major - 0.64952 * p).toFixed(4)}</b><br>` +
    `Minor diameter (external): <b>${(major - 1.29904 * p).toFixed(4)}</b>`;
}

function calcTap() {
  const out = document.getElementById('tap-result');
  const major = num('tap-major'), tpi = num('tap-tpi');
  if (!major || !tpi) { out.innerHTML = 'Enter major diameter and TPI.'; return; }
  out.innerHTML = `Tap drill (≈75%): <b>${(major - 1 / tpi).toFixed(4)}</b><br>Rule of thumb: major − pitch = ${major} − ${(1 / tpi).toFixed(4)}`;
}

function calcTruePos() {
  const out = document.getElementById('truepos-result');
  const x = num('tp-xdev'), y = num('tp-ydev');
  if (x == null || y == null) { out.innerHTML = 'Enter X and Y deviation.'; return; }
  const tp = 2 * Math.sqrt(x * x + y * y);
  out.innerHTML = `True position deviation: <b>${tp.toFixed(4)}</b><br>From datums, regardless of sign. Compare to the position tolerance.`;
}

function calcBolt() {
  const out = document.getElementById('bolt-result');
  const n = num('bolt-n'), r = num('bolt-r');
  if (!n || !r) { out.innerHTML = 'Enter count and radius.'; return; }
  let rows = '';
  for (let i = 0; i < n; i++) {
    const a = (360 / n) * i;
    const rad = a * Math.PI / 180;
    const x = (r * Math.cos(rad)).toFixed(3);
    const y = (r * Math.sin(rad)).toFixed(3);
    rows += `<div>${i + 1}: X <b>${x}</b>  Y <b>${y}</b>  (${a.toFixed(1)}°)</div>`;
  }
  out.innerHTML = `Hole positions (center at 0,0):<br>${rows}`;
}

function calcConv() {
  const out = document.getElementById('conv-result');
  const v = num('conv-val');
  const from = document.getElementById('conv-from').value;
  const to = document.getElementById('conv-to').value;
  if (v == null) { out.innerHTML = 'Enter a value.'; return; }
  const factors = { mm: 1, in: 25.4, mil: 0.0254, um: 0.001, cm: 10 };
  if (!(from in factors) || !(to in factors)) { out.innerHTML = 'Pick valid units.'; return; }
  const mm = v * factors[from];
  out.innerHTML = `${v} ${from} = <b>${(mm / factors[to]).toFixed(4)} ${to}</b>`;
}

function renderGdt() {
  const el = document.getElementById('gdt-list');
  if (!el) return;
  el.innerHTML = GDT.map(g =>
    `<div class="gdt-row"><span class="gdt-sym">${g.sym}</span><span class="gdt-name">${g.name}</span><span class="gdt-desc">${g.desc}</span></div>`
  ).join('');
}

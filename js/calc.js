(function (ns) {
  ns.calc = ns.calc || {};
  ns.calc.calcSpeeds = function () {
  const out = document.getElementById('speeds-result');
  const dia = window.MGP.utils.num('dia-input');
  const m = window.MGP.DATA.MATERIALS[document.getElementById('mat-select').value];
  const sfm = window.MGP.utils.num('sfm-input') ?? (state.unit === 'inch' ? m.sfm[1] : m.vc[1]);
  const feed = window.MGP.utils.num('feed-input');
  if (!dia || dia <= 0) { out.innerHTML = 'Enter a diameter.'; return; }

  const rpm = state.unit === 'inch' ? (sfm * 3.8197) / dia : (sfm * 1000) / (Math.PI * dia);
  let feedNote = '';
  if (feed != null) {
    const op = document.getElementById('op-select').value;
    if (op === 'mill') {
      const flutes = window.MGP.utils.num('flutes-input') || 2;
      const ipm = feed * flutes * rpm;
      feedNote = `Feed: <b>${ipm.toFixed(1)} ${state.unit === 'metric' ? 'mm/min' : 'IPM'}</b> (${feed} IPT × ${flutes} flutes × ${rpm.toFixed(0)} RPM)`;
    } else {
      const ipm = feed * rpm;
      feedNote = `Feed: <b>${ipm.toFixed(1)} ${state.unit === 'metric' ? 'mm/min' : 'IPM'}</b> (${feed} IPR × ${rpm.toFixed(0)} RPM)`;
    }
  }
  out.innerHTML = `RPM: <b>${rpm.toFixed(0)}</b><br>${feedNote}`;
  };
  ns.calc.calcThread = function () {
  const out = document.getElementById('thread-result');
  const major = window.MGP.utils.num('th-major'), tpi = window.MGP.utils.num('th-tpi');
  if (!major || !tpi) { out.innerHTML = 'Enter major diameter and TPI.'; return; }
  const p = 1 / tpi;
  out.innerHTML =
    `Pitch: <b>${p.toFixed(4)}</b> in<br>` +
    `Pitch diameter: <b>${(major - 0.64952 * p).toFixed(4)}</b><br>` +
    `Minor diameter (external): <b>${(major - 1.29904 * p).toFixed(4)}</b>`;
  };
  ns.calc.calcTap = function () {
  const out = document.getElementById('tap-result');
  const major = window.MGP.utils.num('tap-major'), tpi = window.MGP.utils.num('tap-tpi'), drill = window.MGP.utils.num('tap-drill');
  if (!major || !tpi) { out.innerHTML = 'Enter major diameter and TPI.'; return; }
  const p = 1 / tpi;
  const tapDrillBasic = major - p;
  let html = `Tap drill (≈75%): <b>${tapDrillBasic.toFixed(4)}</b><br>Rule of thumb: major − pitch = ${major} − ${p.toFixed(4)}`;
  if (drill != null) {
    const pitchDia = major - 0.64952 * p;
    const minorDia = major - 1.08253 * p;
    const pct = ((pitchDia - drill) / (pitchDia - minorDia)) * 100;
    html += `<br>Approx thread engagement: <b>${pct.toFixed(1)}%</b>`;
  }
  out.innerHTML = html;
  };
  ns.calc.calcTruePos = function () {
  const out = document.getElementById('truepos-result');
  const x = window.MGP.utils.num('tp-xdev'), y = window.MGP.utils.num('tp-ydev');
  if (x == null || y == null) { out.innerHTML = 'Enter X and Y deviation.'; return; }
  const tp = 2 * Math.sqrt(x * x + y * y);
  out.innerHTML = `True position deviation: <b>${tp.toFixed(4)}</b><br>From datums, regardless of sign. Compare to the position tolerance on the print.`;
  };
  ns.calc.calcBolt = function () {
  const out = document.getElementById('bolt-result');
  const n = window.MGP.utils.num('bolt-n'), r = window.MGP.utils.num('bolt-r');
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
  };
  ns.calc.calcConv = function () {
  const out = document.getElementById('conv-result');
  const v = window.MGP.utils.num('conv-val');
  const from = document.getElementById('conv-from').value;
  const to = document.getElementById('conv-to').value;
  if (v == null) { out.innerHTML = 'Enter a value.'; return; }
  const factors = { mm: 1, in: 25.4, mil: 0.0254, um: 0.001, cm: 10 };
  if (!(from in factors) || !(to in factors)) { out.innerHTML = 'Pick valid units.'; return; }
  const mm = v * factors[from];
  out.innerHTML = `${v} ${from} = <b>${(mm / factors[to]).toFixed(4)} ${to}</b>`;
  };
  ns.calc.calcHard = function () {
  const out = document.getElementById('hard-result');
  const v = window.MGP.utils.num('hard-val');
  const from = document.getElementById('hard-from').value;
  if (v == null) { out.innerHTML = 'Enter a value.'; return; }
  let hrc;
  if (from === 'hrc') hrc = v;
  else if (from === 'hrb') hrc = 0.5217 * v - 12.95;          // HRB -> HRC (approx, mid-range)
  else if (from === 'hb') hrc = ns.calc.hbToHrc(v);             // HB -> HRC (approx)
  else if (from === 'hv') hrc = ns.calc.hvToHrc(v);
  const hb = ns.calc.hrcToHb(hrc), hrb = ns.calc.hrcToHrb(hrc), hv = ns.calc.hrcToHv(hrc);
  out.innerHTML = `HRC <b>${hrc.toFixed(1)}</b><br>HB <b>${hb.toFixed(0)}</b><br>HRB <b>${hrb.toFixed(1)}</b><br>HV <b>${hv.toFixed(0)}</b>`;
  };
  ns.calc.calcWeight = function () {
  const out = document.getElementById('wt-result');
  const vol = window.MGP.utils.num('wt-vol');
  const key = document.getElementById('wt-mat').value;
  const d = window.MGP.DATA.DENSITY[key];
  if (vol == null) { out.innerHTML = 'Enter a volume.'; return; }
  if (!d) { out.innerHTML = 'Pick a material.'; return; }
  const lb = vol * d;
  out.innerHTML = `Weight: <b>${lb.toFixed(2)} lb</b><br>(${vol.toFixed(2)} in³ × ${d} lb/in³)`;
  };
  ns.calc.calcTapPct = function () {
  const out = document.getElementById('tap2-result');
  const major = window.MGP.utils.num('tap2-major'), tpi = window.MGP.utils.num('tap2-tpi'), drill = window.MGP.utils.num('tap2-drill');
  if (!major || !tpi || drill == null) { out.innerHTML = 'Enter major, TPI, and drill.'; return; }
  const p = 1 / tpi;
  const pitchDia = major - 0.64952 * p;
  const tapDrillBasic = major - p;                 // 100%-thread drill (too tight)
  // percent thread = (pitchDia - drillDia) / (pitchDia - minorDia) × 100
  const minorDia = major - 1.08253 * p;           // internal minor (UN)
  const pct = ((pitchDia - drill) / (pitchDia - minorDia)) * 100;
  out.innerHTML = `Approx thread: <b>${pct.toFixed(1)}%</b><br>Basic (100%) drill would be ${tapDrillBasic.toFixed(4)}`;
  };
  ns.calc.calcWire = function () {
  const out = document.getElementById('wire-result');
  const major = window.MGP.utils.num('wire-major'), tpi = window.MGP.utils.num('wire-tpi');
  if (!major || !tpi) { out.innerHTML = 'Enter major diameter and TPI.'; return; }
  const p = 1 / tpi;
  const E = 1.01036 * p / 2;                        // best wire diameter (60° thread)
  const pitchDia = major - 0.64952 * p;
  const M = pitchDia + 3 * E - 0.86603 * p;        // measurement over wires
  out.innerHTML = `Best wire Ø: <b>${E.toFixed(4)}</b><br>Measure over wires (M): <b>${M.toFixed(4)}</b>`;
  };
  ns.calc.hrcToHb = function (h) { return 9.85 * h + 65; };
  ns.calc.hrcToHrb = function (h) { return (h + 12.95) / 0.5217; };
  ns.calc.hrcToHv = function (h) { return 9.37 * h + 105; };
  ns.calc.hvToHrc = function (v) { return (v - 105) / 9.37; };
  ns.calc.hbToHrc = function (v) { return (v - 65) / 9.85; };
  ns.calc.renderGdt = function () {
  const el = document.getElementById('gdt-list');
  if (!el) return;
  el.innerHTML = window.MGP.DATA.GDT.map(g =>
    `<div class="gdt-row"><span class="gdt-sym">${g.sym}</span><span class="gdt-name">${g.name}</span><span class="gdt-desc">${g.desc}</span></div>`
  ).join('');
  };
  ns.calc.renderWear = function () {
  const el = document.getElementById('wear-list');
  if (!el) return;
  el.innerHTML = window.MGP.DATA.WEAR.map(w =>
    `<div class="gdt-row"><span class="gdt-sym">${w.sym}</span><span class="gdt-name">${w.name}</span><span class="gdt-desc">${w.desc}</span></div>`
  ).join('');
  };
  ns.calc.popWeightMats = function () {
  const sel = document.getElementById('wt-mat');
  if (!sel) return;
  Object.entries(window.MGP.DATA.MATERIALS).forEach(([key, m]) => {
    const o = document.createElement('option');
    o.value = key; o.textContent = m.name;
    sel.appendChild(o);
  });
  const showWtNote = () => {
    const n = document.getElementById('wt-note');
    if (n) n.textContent = window.MGP.DATA.MATERIALS[sel.value]?.note || '';
  };
  sel.addEventListener('change', showWtNote);
  showWtNote();
  };
})(window.MGP = window.MGP || {});

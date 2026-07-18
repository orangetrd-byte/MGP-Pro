'use strict';
const APP_BUILD = 'MGP Pro | v1.0.0 | Build 2026.07.17.01';

// Typical starting speeds (ranges). Verify for your machine/setup.
const MATERIALS = {
  aluminum:   { name: 'Aluminum (6061)',      sfm: [300, 1000], vc: [90, 300] },
  mildsteel:  { name: 'Mild Steel (1018)',    sfm: [100, 300],  vc: [30, 90] },
  alloysteel: { name: 'Alloy Steel (4140)',   sfm: [80, 250],   vc: [25, 75] },
  stainless:  { name: 'Stainless (304)',      sfm: [50, 200],   vc: [15, 60] },
  castiron:   { name: 'Cast Iron',            sfm: [75, 225],   vc: [25, 70] },
  brass:      { name: 'Brass',                sfm: [200, 400],  vc: [60, 120] },
  titanium:   { name: 'Titanium',             sfm: [40, 140],   vc: [12, 40] },
  copper:     { name: 'Copper',               sfm: [200, 500],  vc: [60, 150] },
};

const state = { unit: 'inch' };

// ─── Boot ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('build-tag').textContent = APP_BUILD;

  // Material dropdown
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

  // Unit toggle
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

  // Operation toggle (show/hide flutes + feed label)
  const opSel = document.getElementById('op-select');
  const syncOp = () => {
    const mill = opSel.value === 'mill';
    document.getElementById('flutes-row').classList.toggle('hidden', !mill);
    document.getElementById('feed-label').textContent = mill ? 'Feed / tooth (IPT)' : 'Feed / rev (IPR)';
  };
  opSel.addEventListener('change', syncOp);
  syncOp();

  // Calculations
  document.getElementById('calc-speeds-btn').addEventListener('click', calcSpeeds);
  document.getElementById('calc-thread-btn').addEventListener('click', calcThread);
  document.getElementById('calc-tap-btn').addEventListener('click', calcTap);

  // Tab nav
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
  const sfm = num('sfm-input') ?? (state.unit === 'inch'
    ? MATERIALS[document.getElementById('mat-select').value].sfm[1]
    : MATERIALS[document.getElementById('mat-select').value].vc[1]);
  const feed = num('feed-input');
  if (!dia || dia <= 0) { out.innerHTML = 'Enter a diameter.'; return; }

  let rpm;
  if (state.unit === 'inch') {
    rpm = (sfm * 3.8197) / dia;
  } else {
    rpm = (sfm * 1000) / (Math.PI * dia);
  }

  let feedNote = '';
  if (feed != null) {
    const op = document.getElementById('op-select').value;
    let ipm;
    if (op === 'mill') {
      const flutes = num('flutes-input') || 2;
      ipm = feed * flutes * rpm;
      feedNote = `Feed: <b>${ipm.toFixed(1)} mm/min</b> (${feed} IPT × ${flutes} flutes × ${rpm.toFixed(0)} RPM)`;
    } else {
      ipm = feed * rpm;
      feedNote = `Feed: <b>${ipm.toFixed(1)} mm/min</b> (${feed} IPR × ${rpm.toFixed(0)} RPM)`;
    }
  }

  out.innerHTML = `RPM: <b>${rpm.toFixed(0)}</b><br>${feedNote}`;
}

function calcThread() {
  const out = document.getElementById('thread-result');
  const major = num('th-major');
  const tpi = num('th-tpi');
  if (!major || !tpi) { out.innerHTML = 'Enter major diameter and TPI.'; return; }
  const p = 1 / tpi;
  const pitchDia = major - 0.64952 * p;
  const minorExt = major - 1.29904 * p; // external (male) thread
  out.innerHTML =
    `Pitch: <b>${p.toFixed(4)}</b> in<br>` +
    `Pitch diameter: <b>${pitchDia.toFixed(4)}</b><br>` +
    `Minor diameter (external): <b>${minorExt.toFixed(4)}</b>`;
}

function calcTap() {
  const out = document.getElementById('tap-result');
  const major = num('tap-major');
  const tpi = num('tap-tpi');
  if (!major || !tpi) { out.innerHTML = 'Enter major diameter and TPI.'; return; }
  const tapDrill = major - 1 / tpi;
  out.innerHTML = `Tap drill (≈75%): <b>${tapDrill.toFixed(4)}</b><br>Rule of thumb: major − pitch = ${major} − ${(1/tpi).toFixed(4)}`;
}

'use strict';
const APP_BUILD = 'MGP Pro | v1.0.0 | Build 2026.07.22.01';

// Material speed data: [sfmLow, sfmHigh] (inch), [vcLow, vcHigh] (metric m/min).
// Typical shop starting ranges — verify per machine/setup. Source: common machining references.


// GD&T descriptors (the #1 app's most-praised reference). Plain-language, shop-floor.


// Material density (lb/in³) for weight calc. Source: common engineering references.


// Tool wear quick reference — symptom -> likely cause. Shop-floor plain language.


// Machinist self-test — the #1 app's praised "brain check". 6 categories.


const state = { unit: 'inch' };

// Foundational lessons — plain-language, why-before-how. Tied to Calc tools.


// Learner roadmap (generic — not personal data). Tied to lessons where possible.


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('build-tag').textContent = APP_BUILD;

  const matSel = document.getElementById('mat-select');
  const showMatNote = () => {
    const n = document.getElementById('mat-note');
    if (n) n.textContent = window.MGP.DATA.MATERIALS[matSel.value]?.note || '';
  };
  Object.entries(window.MGP.DATA.MATERIALS).forEach(([key, m]) => {
    const o = document.createElement('option');
    o.value = key; o.textContent = m.name;
    matSel.appendChild(o);
  });
  const prefillSfm = () => {
    const m = window.MGP.DATA.MATERIALS[matSel.value];
    const high = state.unit === 'inch' ? m.sfm[1] : m.vc[1];
    document.getElementById('sfm-input').placeholder = String(high);
  };
  matSel.addEventListener('change', () => { prefillSfm(); showMatNote(); });
  prefillSfm();
  showMatNote();

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

  document.getElementById('calc-speeds-btn').addEventListener('click', window.MGP.calc.calcSpeeds);
  document.getElementById('calc-thread-btn').addEventListener('click', window.MGP.calc.calcThread);
  document.getElementById('calc-tap-btn').addEventListener('click', window.MGP.calc.calcTap);
  document.getElementById('calc-truepos-btn').addEventListener('click', window.MGP.calc.calcTruePos);
  document.getElementById('calc-bolt-btn').addEventListener('click', window.MGP.calc.calcBolt);
  document.getElementById('calc-conv-btn').addEventListener('click', window.MGP.calc.calcConv);
  document.getElementById('calc-hard-btn').addEventListener('click', window.MGP.calc.calcHard);
  document.getElementById('calc-wt-btn').addEventListener('click', window.MGP.calc.calcWeight);
  document.getElementById('calc-tap2-btn').addEventListener('click', window.MGP.calc.calcTapPct);
  document.getElementById('calc-wire-btn').addEventListener('click', window.MGP.calc.calcWire);
  document.getElementById('selftest-start-btn').addEventListener('click', startSelfTest);
  window.MGP.calc.renderGdt();
  window.MGP.calc.renderWear();
  window.MGP.calc.popWeightMats();
  renderLessons();
  renderRoadmap();
  loadProgress();
  initFloor();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.screen).classList.add('active');
    });
  });
});










// ─── Phase 3 calculators ────────────────────────────────


// Hardness: HRC central; convert to others via common approximations.


// Material weight: volume (in³) × density (lb/in³)

// Tap drill %: compares actual drill to "basic" major - pitch.

// Thread 3-wire: best wire diameter + measurement over wires (M).

// Fisher-Yates shuffle (returns a new array; does not mutate input)

// Machinist self-test
function startSelfTest() {
  const out = document.getElementById('selftest-result');
  const cat = document.getElementById('selftest-cat').value;
  const qs = window.MGP.DATA.SELFTEST[cat];
  if (!qs) { out.innerHTML = 'Pick a category.'; return; }
  let html = '';
  let score = 0;
  window.MGP.utils.shuffleArr(qs).forEach((item, i) => {
    const opts = window.MGP.utils.shuffleArr(item.a.map((text, j) => ({ text, correct: j === item.c })))
      .map(o => `<button class="st-opt" data-correct="${o.correct}">${o.text}</button>`)
      .join('');
    html += `<div class="st-q">${i + 1}. ${item.q}<br>${opts}</div>`;
  });
  html += `<div class="st-score" id="st-score"></div>`;
  out.innerHTML = html;
  out.querySelectorAll('.st-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const correct = btn.dataset.correct === 'true';
      const qWrap = btn.closest('.st-q');
      qWrap.querySelectorAll('.st-opt').forEach(b => {
        b.disabled = true;
        if (b.dataset.correct === 'true') b.style.background = 'var(--c-accent)';
        else if (b === btn) b.style.background = '#B23A2E';
      });
      if (correct) score++;
      const scoreEl = out.querySelector('#st-score');
      if (scoreEl) scoreEl.innerHTML = `Score: <b>${score}</b> / ${qs.length}`;
    });
  });
}

// ─── Phase 4: Learn + My Path ───────────────────────────
function renderLessons() {
  const el = document.getElementById('lesson-list');
  if (!el) return;
  el.innerHTML = Object.entries(window.MGP.DATA.LESSONS).map(([key, l]) =>
    `<div class="lesson" data-lesson="${key}">
       <div class="lesson-title">${l.title}</div>
       <div class="lesson-why"><b>Why:</b> ${l.why}</div>
       <div class="lesson-body">${l.body}</div>
       <button class="lesson-link" data-screen="${l.link.screen}" data-focus="${l.link.focus}">${l.link.label}</button>
     </div>`
  ).join('');
  el.querySelectorAll('.lesson-link').forEach(btn => {
    btn.addEventListener('click', () => {
      showScreen(btn.dataset.screen);
      const f = document.getElementById(btn.dataset.focus);
      if (f) { f.scrollIntoView({ behavior: 'smooth', block: 'center' }); f.focus({ preventScroll: true }); }
    });
  });
}

function renderRoadmap() {
  const el = document.getElementById('roadmap-list');
  if (!el) return;
  const done = loadProgress();
  el.innerHTML = window.MGP.DATA.ROADMAP.map(r => {
    const checked = done[r.id] ? 'checked' : '';
    const lessonLink = r.lesson ? ` <button class="rm-link" data-lesson="${r.lesson}">Learn →</button>` : '';
    return `<label class="rm-item">
       <input type="checkbox" class="rm-check" data-id="${r.id}" ${checked} />
       <span class="rm-text">${r.text}</span>${lessonLink}
     </label>`;
  }).join('');
  el.querySelectorAll('.rm-check').forEach(c => {
    c.addEventListener('change', () => {
      const done = loadProgress();
      done[c.dataset.id] = c.checked;
      saveProgress(done);
    });
  });
  el.querySelectorAll('.rm-link').forEach(b => {
    b.addEventListener('click', () => {
      showScreen('screen-learn');
      const node = document.querySelector(`.lesson[data-lesson="${b.dataset.lesson}"]`);
      if (node) node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
  updateRoadmapCount();
  initPathBackup();
}

function showScreen(id) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.screen === id));
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const t = document.getElementById(id);
  if (t) t.classList.add('active');
}

function updateRoadmapCount() {
  const el = document.getElementById('roadmap-list');
  if (!el) return;
  const done = loadProgress();
  const total = window.MGP.DATA.ROADMAP.length;
  const got = window.MGP.DATA.ROADMAP.filter(r => done[r.id]).length;
  let counter = el.parentElement.querySelector('.rm-count');
  if (!counter) {
    counter = document.createElement('div');
    counter.className = 'rm-count';
    el.parentElement.insertBefore(counter, el);
  }
  counter.textContent = `${got} / ${total} done`;
}

function loadProgress() {
  try { return JSON.parse(localStorage.getItem('mgp-pro-path') || '{}'); }
  catch (e) { return {}; }
}
function saveProgress(obj) {
  localStorage.setItem('mgp-pro-path', JSON.stringify(obj));
  updateRoadmapCount();
}

// ─── Phase 5: Floor (job notes + lathe calc + draft G-code) ──
const FLOOR_KEY = 'mgp-pro-floor';
const FLOOR_FIELDS = ['job-part','job-mat','job-op','job-machine','job-toolnotes','job-setupnotes',
  'setup-offset','setup-stockdia','setup-chuck','setup-stickout','setup-coolant','setup-insp',
  'touch-dia','target-dia','face-z','plunge-depth','z-dir','g-tool','g-speed','g-feed','g-comment'];

let floorMode = 'od';
let lastMove = null;

const fmt3 = v => Number.isFinite(v) ? Number(v).toFixed(3).replace(/^-0\.000$/, '0.000') : '--';

function floorNum(id) {
  const raw = document.getElementById(id).value.trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function initFloor() {
  // restore
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(FLOOR_KEY) || '{}'); } catch (e) {}
  FLOOR_FIELDS.forEach(id => { if (saved[id] != null) document.getElementById(id).value = saved[id]; });
  if (saved.floorMode) setFloorMode(saved.floorMode, false);
  if (saved.gcode) document.getElementById('gcode-out').textContent = saved.gcode;

  // auto-save on input
  FLOOR_FIELDS.forEach(id => {
    document.getElementById(id).addEventListener('input', () => { saveFloor(); });
    document.getElementById(id).addEventListener('change', () => { saveFloor(); });
  });

  // mode seg
  document.querySelectorAll('#floor-mode-seg .seg-btn').forEach(b => {
    b.addEventListener('click', () => setFloorMode(b.dataset.mode, true));
  });

  document.getElementById('floor-calc-btn').addEventListener('click', calcMove);
  document.getElementById('g-build-btn').addEventListener('click', buildGcode);
  document.getElementById('floor-reset-btn').addEventListener('click', () => {
    if (!confirm('Clear all Floor job data on this device?')) return;
    localStorage.removeItem(FLOOR_KEY);
    FLOOR_FIELDS.forEach(id => { document.getElementById(id).value = ''; });
    document.getElementById('gcode-out').textContent = 'Calculate a move first.';
    document.getElementById('floor-result').innerHTML = '';
    drawPlot(null);
    setFloorMode('od', false);
  });
  initFloorBackup();
}

function setFloorMode(mode, save) {
  floorMode = mode;
  document.querySelectorAll('#floor-mode-seg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  if (save) saveFloor();
}

function saveFloor() {
  const data = { floorMode };
  FLOOR_FIELDS.forEach(id => { data[id] = document.getElementById(id).value; });
  const out = document.getElementById('gcode-out').textContent;
  if (out && out !== 'Calculate a move first.') data.gcode = out;
  localStorage.setItem(FLOOR_KEY, JSON.stringify(data));
}

function calcMove() {
  const touch = floorNum('touch-dia'), target = floorNum('target-dia');
  const face = floorNum('face-z') ?? 0, depth = floorNum('plunge-depth') ?? 0;
  if (touch == null || target == null) {
    document.getElementById('floor-result').innerHTML = 'Enter touch-off and target diameters.';
    drawPlot(null); return;
  }
  const zDir = document.getElementById('z-dir').value;
  const zTarget = zDir === 'minus' ? face - depth : face + depth;
  const radialTravel = Math.abs(touch - target) / 2;
  const diaChange = Math.abs(touch - target);
  lastMove = { mode: floorMode, touch, target, face, depth, zTarget, radialTravel, diaChange };
  document.getElementById('floor-result').innerHTML =
    `Move to <b>X${fmt3(target)} Z${fmt3(zTarget)}</b><br>` +
    `Radial travel: <b>${fmt3(radialTravel)}</b> (dia change ${fmt3(diaChange)})<br>` +
    `Mode: ${floorMode === 'od' ? 'OD / facing' : 'ID / boring'}`;
  buildGcode();
}

function buildGcode() {
  if (!lastMove) return;
  const m = lastMove;
  const safeX = Math.max(m.touch, m.target) + 0.100;
  const safeZ = m.zTarget < m.face ? m.face + 0.100 : m.face - 0.100;
  const feed = document.getElementById('g-feed').value.trim() || '0.004';
  const toolCall = document.getElementById('g-tool').value.trim();
  const speed = document.getElementById('g-speed').value.trim();
  const offset = document.getElementById('setup-offset').value.trim();
  const comment = document.getElementById('g-comment').value.trim() || document.getElementById('job-op').value.trim() || 'MANUAL LATHE MOVE';
  const lines = [
    '%',
    `(${comment})`,
    '(DRAFT — VERIFY BEFORE RUNNING)',
    '(check post, offsets, clearance, spindle, feed, X dia mode)',
    'G18 G40 G80 G99',
    offset || '',
    toolCall,
    speed,
    `G00 X${fmt3(safeX)} Z${fmt3(safeZ)}`,
    `G01 Z${fmt3(m.zTarget)} F${feed}`,
    `G01 X${fmt3(m.target)} F${feed}`,
    `G00 X${fmt3(safeX)}`,
    `G00 Z${fmt3(safeZ)}`,
    `(TARGET X${fmt3(m.target)} Z${fmt3(m.zTarget)})`,
    `(RADIAL TRAVEL ${fmt3(m.radialTravel)})`,
    '%'
  ].filter(Boolean);
  const out = lines.join('\n');
  document.getElementById('gcode-out').textContent = out;
  drawPlot({ safeX, safeZ, targetX: m.target, targetZ: m.zTarget, faceZ: m.face, touchX: m.touch });
  saveFloor();
}

function drawPlot(move) {
  const svg = document.getElementById('gcode-plot');
  if (!svg) return;
  if (!move) { svg.innerHTML = '<text x="320" y="140" text-anchor="middle" fill="#8AA0AE" font-size="14">No move calculated yet.</text>'; return; }
  const pad = 42, width = 640, height = 280;
  const xs = [move.safeX, move.targetX, move.touchX], zs = [move.safeZ, move.targetZ, move.faceZ];
  let minX = Math.min(...xs), maxX = Math.max(...xs), minZ = Math.min(...zs), maxZ = Math.max(...zs);
  if (maxX - minX < 0.001) { maxX += 1; minX -= 1; }
  if (maxZ - minZ < 0.001) { maxZ += 0.25; minZ -= 0.25; }
  const mX = (maxX - minX) * 0.12, mZ = (maxZ - minZ) * 0.20;
  minX -= mX; maxX += mX; minZ -= mZ; maxZ += mZ;
  const px = z => pad + (z - minZ) / (maxZ - minZ) * (width - pad * 2);
  const py = x => height - pad - (x - minX) / (maxX - minX) * (height - pad * 2);
  const p1 = [px(move.safeZ), py(move.safeX)];
  const p2 = [px(move.targetZ), py(move.safeX)];
  const p3 = [px(move.targetZ), py(move.targetX)];
  svg.innerHTML =
    `<line x1="${pad}" y1="${height-pad}" x2="${width-pad}" y2="${height-pad}" stroke="#2A3F4D"/>` +
    `<line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height-pad}" stroke="#2A3F4D"/>` +
    `<text x="${width/2-20}" y="${height-10}" fill="#8AA0AE" font-size="13">Z axis</text>` +
    `<text x="8" y="${pad-12}" fill="#8AA0AE" font-size="13">X diameter</text>` +
    `<path d="M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]}" stroke="#E07B2E" stroke-width="2" fill="none"/>` +
    `<path d="M ${p3[0]} ${p3[1]} L ${p1[0]} ${p1[1]}" stroke="#8AA0AE" stroke-width="2" stroke-dasharray="6 4" fill="none"/>` +
    `<circle cx="${p1[0]}" cy="${p1[1]}" r="6" fill="#2DB5A0"/>` +
    `<text x="${p1[0]+8}" y="${p1[1]-8}" fill="#8AA0AE" font-size="12">rapid X${fmt3(move.safeX)} Z${fmt3(move.safeZ)}</text>` +
    `<circle cx="${p2[0]}" cy="${p2[1]}" r="5" fill="#E07B2E"/>` +
    `<text x="${p2[0]+8}" y="${p2[1]+16}" fill="#8AA0AE" font-size="12">feed Z${fmt3(move.targetZ)}</text>` +
    `<circle cx="${p3[0]}" cy="${p3[1]}" r="6" fill="#B23A2E"/>` +
    `<text x="${p3[0]+8}" y="${p3[1]-8}" fill="#8AA0AE" font-size="12">target X${fmt3(move.targetX)} Z${fmt3(move.targetZ)}</text>`;
}

function initFloorBackup(){
  const exportBtn = document.getElementById('floor-export-btn');
  const importInput = document.getElementById('floor-import-input');
  if (!exportBtn || !importInput) return;
  exportBtn.addEventListener('click', () => {
    try {
      const raw = localStorage.getItem(FLOOR_KEY) || '{}';
      const blob = new Blob([raw], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mgp-floor-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) { alert('Export failed: ' + e.message); }
  });
  importInput.addEventListener('change', () => {
    const file = importInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || typeof data !== 'object') throw new Error('Invalid file');
        localStorage.setItem(FLOOR_KEY, JSON.stringify(data));
        importInput.value = '';
        FLOOR_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = data[id] || ''; });
        const gcode = document.getElementById('gcode-out');
        if (gcode) gcode.textContent = data.gcode || 'Calculate a move first.';
        if (data.floorMode) setFloorMode(data.floorMode, true);
        alert('Floor data imported.');
      } catch (e) { alert('Import failed: ' + e.message); importInput.value = ''; }
    };
    reader.readAsText(file);
  });
}

function initPathBackup(){
  const exportBtn = document.getElementById('path-export-btn');
  const importInput = document.getElementById('path-import-input');
  if (!exportBtn || !importInput) return;
  exportBtn.addEventListener('click', () => {
    try {
      const raw = localStorage.getItem('mgp-pro-path') || '{}';
      const blob = new Blob([raw], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mgp-path-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) { alert('Export failed: ' + e.message); }
  });
  importInput.addEventListener('change', () => {
    const file = importInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || typeof data !== 'object') throw new Error('Invalid file');
        localStorage.setItem('mgp-pro-path', JSON.stringify(data));
        importInput.value = '';
        renderRoadmap();
        alert('My Path progress imported.');
      } catch (e) { alert('Import failed: ' + e.message); importInput.value = ''; }
    };
    reader.readAsText(file);
  });
}

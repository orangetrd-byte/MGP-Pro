(function (ns) {
  ns.floor = ns.floor || {};
  ns.floor.FLOOR_KEY = 'mgp-pro-floor';
  ns.floor.FLOOR_FIELDS = ['job-part','job-mat','job-op','job-machine','job-toolnotes','job-setupnotes',
    'setup-offset','setup-stockdia','setup-chuck','setup-stickout','setup-coolant','setup-insp',
    'touch-dia','target-dia','face-z','plunge-depth','z-dir','g-tool','g-speed','g-feed','g-comment'];
  ns.floor.floorMode = 'od';
  ns.floor.lastMove = null;

  ns.floor.fmt3 = function (v) {
    return Number.isFinite(v) ? Number(v).toFixed(3).replace(/^-0\.000$/, '0.000') : '--';
  };

  ns.floor.floorNum = function (id) {
    const raw = document.getElementById(id).value.trim();
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  ns.floor.setFloorMode = function (mode, save) {
    ns.floor.floorMode = mode;
    document.querySelectorAll('#floor-mode-seg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    if (save) ns.floor.saveFloor();
  };

  ns.floor.saveFloor = function () {
    const data = { floorMode: ns.floor.floorMode };
    ns.floor.FLOOR_FIELDS.forEach(id => { data[id] = document.getElementById(id).value; });
    const out = document.getElementById('gcode-out').textContent;
    if (out && out !== 'Calculate a move first.') data.gcode = out;
    localStorage.setItem(ns.floor.FLOOR_KEY, JSON.stringify(data));
  };

  ns.floor.initFloor = function () {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(ns.floor.FLOOR_KEY) || '{}'); } catch (e) {}
    ns.floor.FLOOR_FIELDS.forEach(id => { if (saved[id] != null) document.getElementById(id).value = saved[id]; });
    if (saved.floorMode) ns.floor.setFloorMode(saved.floorMode, false);
    if (saved.gcode) document.getElementById('gcode-out').textContent = saved.gcode;

    ns.floor.FLOOR_FIELDS.forEach(id => {
      document.getElementById(id).addEventListener('input', () => { ns.floor.saveFloor(); });
      document.getElementById(id).addEventListener('change', () => { ns.floor.saveFloor(); });
    });

    document.querySelectorAll('#floor-mode-seg .seg-btn').forEach(b => {
      b.addEventListener('click', () => ns.floor.setFloorMode(b.dataset.mode, true));
    });

    document.getElementById('floor-calc-btn').addEventListener('click', ns.floor.calcMove);
    document.getElementById('g-build-btn').addEventListener('click', ns.floor.buildGcode);
    document.getElementById('floor-reset-btn').addEventListener('click', () => {
      if (!confirm('Clear all Floor job data on this device?')) return;
      localStorage.removeItem(ns.floor.FLOOR_KEY);
      ns.floor.FLOOR_FIELDS.forEach(id => { document.getElementById(id).value = ''; });
      document.getElementById('gcode-out').textContent = 'Calculate a move first.';
      document.getElementById('floor-result').innerHTML = '';
      ns.floor.drawPlot(null);
      ns.floor.setFloorMode('od', false);
    });
    ns.floor.initFloorBackup();
  };

  ns.floor.calcMove = function () {
    const touch = ns.floor.floorNum('touch-dia'), target = ns.floor.floorNum('target-dia');
    const face = ns.floor.floorNum('face-z') ?? 0, depth = ns.floor.floorNum('plunge-depth') ?? 0;
    if (touch == null || target == null) {
      document.getElementById('floor-result').innerHTML = 'Enter touch-off and target diameters.';
      ns.floor.drawPlot(null); return;
    }
    const zDir = document.getElementById('z-dir').value;
    const zTarget = zDir === 'minus' ? face - depth : face + depth;
    const radialTravel = Math.abs(touch - target) / 2;
    const diaChange = Math.abs(touch - target);
    ns.floor.lastMove = { mode: ns.floor.floorMode, touch, target, face, depth, zTarget, radialTravel, diaChange };
    document.getElementById('floor-result').innerHTML =
      `Move to <b>X${ns.floor.fmt3(target)} Z${ns.floor.fmt3(zTarget)}</b><br>` +
      `Radial travel: <b>${ns.floor.fmt3(radialTravel)}</b> (dia change ${ns.floor.fmt3(diaChange)})<br>` +
      `Mode: ${ns.floor.floorMode === 'od' ? 'OD / facing' : 'ID / boring'}`;
    ns.floor.buildGcode();
  };

  ns.floor.buildGcode = function () {
    if (!ns.floor.lastMove) return;
    const m = ns.floor.lastMove;
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
      `G00 X${ns.floor.fmt3(safeX)} Z${ns.floor.fmt3(safeZ)}`,
      `G01 Z${ns.floor.fmt3(m.zTarget)} F${feed}`,
      `G01 X${ns.floor.fmt3(m.target)} F${feed}`,
      `G00 X${ns.floor.fmt3(safeX)}`,
      `G00 Z${ns.floor.fmt3(safeZ)}`,
      `(TARGET X${ns.floor.fmt3(m.target)} Z${ns.floor.fmt3(m.zTarget)})`,
      `(RADIAL TRAVEL ${ns.floor.fmt3(m.radialTravel)})`,
      '%'
    ].filter(Boolean);
    const out = lines.join('\n');
    document.getElementById('gcode-out').textContent = out;
    ns.floor.drawPlot({ safeX, safeZ, targetX: m.target, targetZ: m.zTarget, faceZ: m.face, touchX: m.touch });
    ns.floor.saveFloor();
  };

  ns.floor.drawPlot = function (move) {
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
      `<text x="${p1[0]+8}" y="${p1[1]-8}" fill="#8AA0AE" font-size="12">rapid X${ns.floor.fmt3(move.safeX)} Z${ns.floor.fmt3(move.safeZ)}</text>` +
      `<circle cx="${p2[0]}" cy="${p2[1]}" r="5" fill="#E07B2E"/>` +
      `<text x="${p2[0]+8}" y="${p2[1]+16}" fill="#8AA0AE" font-size="12">feed Z${ns.floor.fmt3(move.targetZ)}</text>` +
      `<circle cx="${p3[0]}" cy="${p3[1]}" r="6" fill="#B23A2E"/>` +
      `<text x="${p3[0]+8}" y="${p3[1]-8}" fill="#8AA0AE" font-size="12">target X${ns.floor.fmt3(move.targetX)} Z${ns.floor.fmt3(move.targetZ)}</text>`;
  };

  ns.floor.initFloorBackup = function () {
    const exportBtn = document.getElementById('floor-export-btn');
    const importInput = document.getElementById('floor-import-input');
    if (!exportBtn || !importInput) return;
    exportBtn.addEventListener('click', () => {
      try {
        const raw = localStorage.getItem(ns.floor.FLOOR_KEY) || '{}';
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
          localStorage.setItem(ns.floor.FLOOR_KEY, JSON.stringify(data));
          importInput.value = '';
          ns.floor.FLOOR_FIELDS.forEach(id => { const el = document.getElementById(id); if (el) el.value = data[id] || ''; });
          const gcode = document.getElementById('gcode-out');
          if (gcode) gcode.textContent = data.gcode || 'Calculate a move first.';
          if (data.floorMode) ns.floor.setFloorMode(data.floorMode, true);
          alert('Floor data imported.');
        } catch (e) { alert('Import failed: ' + e.message); importInput.value = ''; }
      };
      reader.readAsText(file);
    });
  };
})(window.MGP = window.MGP || {});

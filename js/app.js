'use strict';
const APP_BUILD = 'MGP Pro | v1.0.0 | Build 2026.07.22.01';

const state = { unit: 'inch' };

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
  document.getElementById('selftest-start-btn').addEventListener('click', window.MGP.ui.startSelfTest);
  window.MGP.calc.renderGdt();
  window.MGP.calc.renderWear();
  window.MGP.calc.popWeightMats();
  window.MGP.learn.renderLessons();
  window.MGP.ui.renderRoadmap();
  window.MGP.path.loadProgress();
  window.MGP.floor.initFloor();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.screen).classList.add('active');
    });
  });
});

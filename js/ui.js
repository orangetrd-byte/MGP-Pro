(function (ns) {
  ns.ui = ns.ui || {};
  ns.ui.startSelfTest = function () {
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
  };
  ns.ui.renderRoadmap = function () {
  const el = document.getElementById('roadmap-list');
  if (!el) return;
  const done = window.MGP.path.loadProgress();
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
      const done = window.MGP.path.loadProgress();
      done[c.dataset.id] = c.checked;
      window.MGP.path.saveProgress(done);
    });
  });
  el.querySelectorAll('.rm-link').forEach(b => {
    b.addEventListener('click', () => {
      ns.ui.showScreen('screen-learn');
      const node = document.querySelector(`.lesson[data-lesson="${b.dataset.lesson}"]`);
      if (node) node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
  ns.ui.updateRoadmapCount();
  window.MGP.path.initPathBackup();
  };
  ns.ui.showScreen = function (id) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.screen === id));
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const t = document.getElementById(id);
  if (t) t.classList.add('active');
  };
  ns.ui.updateRoadmapCount = function () {
  const el = document.getElementById('roadmap-list');
  if (!el) return;
  const done = window.MGP.path.loadProgress();
  const total = window.MGP.DATA.ROADMAP.length;
  const got = window.MGP.DATA.ROADMAP.filter(r => done[r.id]).length;
  let counter = el.parentElement.querySelector('.rm-count');
  if (!counter) {
    counter = document.createElement('div');
    counter.className = 'rm-count';
    el.parentElement.insertBefore(counter, el);
  }
  counter.textContent = `${got} / ${total} done`;
  };
})(window.MGP = window.MGP || {});

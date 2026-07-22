(function (ns) {
  ns.learn = ns.learn || {};
  ns.learn.renderLessons = function () {
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
        window.MGP.ui.showScreen(btn.dataset.screen);
        const f = document.getElementById(btn.dataset.focus);
        if (f) { f.scrollIntoView({ behavior: 'smooth', block: 'center' }); f.focus({ preventScroll: true }); }
      });
    });
  };
})(window.MGP = window.MGP || {});

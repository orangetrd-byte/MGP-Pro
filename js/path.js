(function (ns) {
  ns.path = ns.path || {};
  ns.path.loadProgress = function () {
    try { return JSON.parse(localStorage.getItem('mgp-pro-path') || '{}'); }
    catch (e) { return {}; }
  };
  ns.path.saveProgress = function (obj) {
    localStorage.setItem('mgp-pro-path', JSON.stringify(obj));
    if (ns.ui && ns.ui.updateRoadmapCount) ns.ui.updateRoadmapCount();
  };
  ns.path.initPathBackup = function () {
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
          if (ns.ui && ns.ui.renderRoadmap) ns.ui.renderRoadmap();
          alert('My Path progress imported.');
        } catch (e) { alert('Import failed: ' + e.message); importInput.value = ''; }
      };
      reader.readAsText(file);
    });
  };
})(window.MGP = window.MGP || {});

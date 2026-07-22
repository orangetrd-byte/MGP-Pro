(function (ns) {
  ns.utils = ns.utils || {};
  ns.utils.num = function (id) { const v = parseFloat(document.getElementById(id).value); return isNaN(v) ? null : v; };
  ns.utils.shuffleArr = function (arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
})(window.MGP = window.MGP || {});

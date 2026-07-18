'use strict';
const APP_BUILD = 'MGP Pro | v1.0.0 | Build 2026.07.17.07';

// Material speed data: [sfmLow, sfmHigh] (inch), [vcLow, vcHigh] (metric m/min).
// Typical shop starting ranges — verify per machine/setup. Source: common machining references.
const MATERIALS = {
  // Aluminum
  'aluminum-1100': { name: 'Aluminum 1100 (pure)', sfm: [300, 900], vc: [90, 275], note: 'Pure AL — easy to cut, but gummy and builds heat. Use sharp tools, good coolant.' },
  'aluminum-2011': { name: 'Aluminum 2011 (free-cut)', sfm: [300, 1000], vc: [90, 300], note: 'Free-machining AL — best chip control of the aluminums. Great for screw machine work.' },
  'aluminum-2024': { name: 'Aluminum 2024', sfm: [300, 750], vc: [90, 230], note: 'Stronger AL, more "sticky" than 2011. Watch built-up edge; keep carbide sharp.' },
  'aluminum-6061': { name: 'Aluminum 6061', sfm: [300, 1000], vc: [90, 300], note: 'The general-purpose AL. Cuts freely; watch heat at high SFM, use coolant.' },
  'aluminum-7075': { name: 'Aluminum 7075', sfm: [200, 750], vc: [60, 230], note: 'High-strength AL. Harder on tools than 6061; ease off SFM if tools load up.' },
  'aluminum-cast': { name: 'Aluminum Cast', sfm: [250, 700], vc: [75, 215], note: 'Casting skin and porosity vary. Watch for hard spots and inclusions.' },
  // Steel - mild / low carbon
  'steel-1018': { name: 'Mild Steel 1018', sfm: [100, 300], vc: [30, 90], note: 'Easy low-carbon steel. Forgiving — good for learning speeds/feeds.' },
  'steel-1020': { name: 'Mild Steel 1020', sfm: [100, 325], vc: [30, 100], note: 'Low-carbon, machines clean. Watch for stringy chips at high feed.' },
  'steel-1045': { name: 'Medium Carbon 1045', sfm: [90, 275], vc: [28, 84], note: 'Medium carbon — tougher than 1018. Needs more speed control near shoulders.' },
  'steel-1144': { name: 'Stressproof 1144', sfm: [100, 325], vc: [30, 100], note: 'Resulfurized — free-machining, short chips. Great for shafts.' },
  'steel-12l14': { name: 'Free-Cut 12L14', sfm: [150, 400], vc: [45, 120], note: 'Best machinability of the steels (lead + sulfur). Short chips, smooth finish.' },
  'steel-4140': { name: 'Alloy 4140', sfm: [80, 250], vc: [25, 75], note: 'Hardened-capable alloy. Tough — keep tools rigid, watch heat at the cut.' },
  'steel-4340': { name: 'Alloy 4340', sfm: [70, 225], vc: [20, 70], note: 'High-strength alloy, work-hardens. Drop SFM if it loads; avoid dwelling.' },
  'steel-a36': { name: 'Structural A36', sfm: [100, 300], vc: [30, 90], note: 'Structural mild steel. Consistent and easy — same ballpark as 1018.' },
  // Stainless
  'ss-303': { name: 'Stainless 303 (free-mach)', sfm: [90, 350], vc: [27, 105], note: 'Free-machining stainless — the easy one. Still work-hardens, keep cutting.' },
  'ss-304': { name: 'Stainless 304', sfm: [50, 200], vc: [15, 60], note: 'Work-hardens fast. Keep feed up so you cut under the skin, never rub.' },
  'ss-316': { name: 'Stainless 316', sfm: [50, 180], vc: [15, 55], note: 'More alloy than 304 — tougher, gummy. Rigid setup, sharp carbide, positive rake.' },
  'ss-17-4ph': { name: 'Stainless 17-4PH', sfm: [50, 175], vc: [15, 53], note: 'Precipitation-hardening — hard when aged. Cut in soft condition if you can.' },
  'ss-440c': { name: 'Stainless 440C', sfm: [40, 150], vc: [12, 45], note: 'Hardenable stainless, abrasive. Cuts like a hard steel — ease SFM, watch wear.' },
  // Cast iron
  'ci-gray': { name: 'Gray Cast Iron', sfm: [75, 225], vc: [25, 70], note: 'Brittle, graphitic — machines dry usually. Wear a mask; dusty, no long string chips.' },
  'ci-ductile': { name: 'Ductile Iron', sfm: [75, 250], vc: [25, 75], note: 'Tougher than gray iron, can get gummy. Similar speeds; watch the "skin".' },
  // Brass / bronze
  'brass-360': { name: 'Free-Cut Brass 360', sfm: [200, 400], vc: [60, 120], note: 'Free-cutting brass — dream to machine. Watch for the part grabbing at high speed.' },
  'brass-260': { name: 'Cartridge Brass 260', sfm: [150, 350], vc: [45, 105], note: 'Softer brass, more ductile. Watch for the part pulling in toward the tool.' },
  'bronze-932': { name: 'Bearing Bronze 932', sfm: [150, 350], vc: [45, 105], note: 'Leaded bearing bronze — free cutting. Abrasive to tools over time.' },
  // Copper
  'copper-c110': { name: 'Copper C110', sfm: [200, 500], vc: [60, 150], note: 'Pure copper — soft and gummy, long stringy chips. Sharp tools, chip breaker help.' },
  'copper-beryllium': { name: 'Copper Beryllium', sfm: [150, 350], vc: [45, 105], note: 'Hard, springy, abrasive. Machines like a tough bronze; mind the dust hazard.' },
  // Titanium
  'ti-6al4v': { name: 'Titanium 6Al-4V', sfm: [40, 140], vc: [12, 40], note: 'Common Ti alloy. Work-hardens + holds heat at the edge. Low SFM, flood coolant, never dwell.' },
  'ti-cp': { name: 'Titanium CP (Grade 2)', sfm: [35, 130], vc: [10, 38], note: 'Commercial-pure Ti — softer than 6Al-4V but same heat rules. Keep cutting, cool hard.' },
  // Tool steel
  'ts-a2': { name: 'Tool Steel A2', sfm: [40, 150], vc: [12, 45], note: 'Air-hardening tool steel — abrasive, tough. Cut soft (annealed) if possible; watch wear.' },
  'ts-d2': { name: 'Tool Steel D2', sfm: [35, 130], vc: [10, 40], note: 'High-carbon, very abrasive. Hard on tools — low SFM, CBN or ceramic for hard turning.' },
  'ts-o1': { name: 'Tool Steel O1', sfm: [50, 175], vc: [15, 53], note: 'Oil-hardening tool steel — easier than D2/A2 but still tough. Rigid setup, sharp edge.' },
  // Super alloys (nickel / cobalt) — cut SLOW; verify per setup, use sharp tools, rigid setup
  'inconel-718': { name: 'Inconel 718', sfm: [25, 70], vc: [8, 20], note: 'Nickel superalloy. Work-hardens, holds heat at the edge. LOW SFM, rigid, sharp carbide, flood coolant, never dwell.' },
  'inconel-625': { name: 'Inconel 625', sfm: [20, 65], vc: [6, 20], note: 'Tougher than 718. Same rules — low SFM, positive rake, keep cutting, cool hard.' },
  'inconel-x750': { name: 'Inconel X750', sfm: [20, 60], vc: [6, 18], note: 'Age-hardening Ni alloy. Cut in solution-treated state if you can; low SFM, rigid.' },
  'hastelloy-x': { name: 'Hastelloy X', sfm: [25, 80], vc: [8, 24], note: 'Ni-Cr-Mo, a bit more free-cutting than Inconel. Still low SFM, watch work-hardening.' },
  'hastelloy-c276': { name: 'Hastelloy C276', sfm: [20, 70], vc: [6, 20], note: 'Corrosion-grade Ni-Mo-Cr. Tough and gummy — low SFM, sharp tools, never rub.' },
  'waspaloy': { name: 'Waspaloy (AMS5707)', sfm: [15, 50], vc: [5, 15], note: 'Age-hardenable Ni-Co superalloy (AMS5707). Among the hardest to cut — very low SFM, rigid, fresh edges.' },
  'rene-41': { name: 'Rene 41', sfm: [12, 45], vc: [4, 14], note: 'High-temp Ni superalloy, very work-hardenable. Lowest SFM of the group; flood cool, no dwell.' },
  'monel-400': { name: 'Monel 400', sfm: [40, 130], vc: [12, 40], note: 'Ni-Cu alloy — gummy and work-hardens but not as brutal as Inconel. Keep feed up, sharp tools.' },
  'haynes-188': { name: 'Haynes 188 (Co)', sfm: [20, 70], vc: [6, 20], note: 'Cobalt superalloy — keeps strength hot, work-hardens. Low SFM, rigid, flood coolant.' },
  // Plastics
  'plastic-delrin': { name: 'Delrin (acetal)', sfm: [300, 1000], vc: [90, 300], note: 'Easy, chips clean. Watch melting at the edge — keep speed up, light feed, sharp tool.' },
  'plastic-uptfe': { name: 'PTFE (Teflon)', sfm: [200, 800], vc: [60, 245], note: 'Soft, gummy, melts fast. Very sharp tool, low feed pressure, watch heat.' },
  'plastic-uhmw': { name: 'UHMW', sfm: [250, 900], vc: [75, 275], note: 'Springy and gummy. Clamp well (it creeps), sharp tool, avoid heat buildup.' },
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

// Material density (lb/in³) for weight calc. Source: common engineering references.
const DENSITY = {
  'aluminum-1100': 0.098, 'aluminum-2011': 0.098, 'aluminum-2024': 0.100, 'aluminum-6061': 0.098,
  'aluminum-7075': 0.101, 'aluminum-cast': 0.097,
  'steel-1018': 0.284, 'steel-1020': 0.284, 'steel-1045': 0.284, 'steel-1144': 0.283, 'steel-12l14': 0.282,
  'steel-4140': 0.284, 'steel-4340': 0.284, 'steel-a36': 0.284,
  'ss-303': 0.290, 'ss-304': 0.290, 'ss-316': 0.290, 'ss-17-4ph': 0.282, 'ss-440c': 0.280,
  'ci-gray': 0.260, 'ci-ductile': 0.257,
  'brass-360': 0.307, 'brass-260': 0.308, 'bronze-932': 0.318,
  'copper-c110': 0.324, 'copper-beryllium': 0.300,
  'ti-6al4v': 0.160, 'ti-cp': 0.163,
  'ts-a2': 0.284, 'ts-d2': 0.286, 'ts-o1': 0.283,
  // Super alloys (lb/in³) — density for weight calc
  'inconel-718': 0.296, 'inconel-625': 0.305, 'inconel-x750': 0.298,
  'hastelloy-x': 0.297, 'hastelloy-c276': 0.321, 'waspaloy': 0.291,
  'rene-41': 0.298, 'monel-400': 0.319, 'haynes-188': 0.319,
  'plastic-delrin': 0.051, 'plastic-uptfe': 0.078, 'plastic-uhmw': 0.034,
};

// Tool wear quick reference — symptom -> likely cause. Shop-floor plain language.
const WEAR = [
  { sym: '🔪', name: 'Cratering', desc: 'Chemical/heat erosion on rake face. Too fast, wrong grade for material, or no coolant. Drop speed or change grade.' },
  { sym: '🪒', name: 'Flank wear', desc: 'Uniform land on clearance face. Normal aging — but fast wear = too hard a material for the speed, or wrong coating.' },
  { sym: '🧊', name: 'Built-up edge (BUE)', desc: 'Material welds to the tip. Too slow (rubbing), wrong rake, or gummy material. Raise speed, use sharp uncoated or polished grade.' },
  { sym: '💥', name: 'Chipping', desc: 'Edge breaks out. Intermittent cut, too brittle a grade, or thermal shock (coolant hitting hot tool). Use tougher grade, steady feed.' },
  { sym: '🌀', name: 'Thermal cracking', desc: 'Fine cracks from hot/cold cycling. Coolant hitting a hot tool. Use constant flood or run dry; avoid on/off coolant.' },
  { sym: '📉', name: 'Premature failure', desc: 'Tool breaks way early. Feeds too light (rubbing) or too heavy (load). Verify feed per rev and rigidity.' },
];

// Machinist self-test — the #1 app's praised "brain check". 6 categories.
const SELFTEST = {
  gdt: [
    { q: 'Position tolerance controls a feature relative to...', a: ['Datum(s)', 'The nearest hole', 'Tool diameter', 'Spindle RPM'], c: 0 },
    { q: 'Which is a FORM control (no datum needed)?', a: ['Flatness', 'Perpendicularity', 'Position', 'Runout'], c: 0 },
  ],
  blueprint: [
    { q: 'A dimension without a tolerance is...', a: ['Exact (no variation)', 'Controlled by general notes', 'Ignored', 'A basic dimension'], c: 1 },
    { q: 'A section view shows...', a: ['Outside surface only', 'Interior as if cut', 'The title block', 'A 3D view'], c: 1 },
  ],
  measure: [
    { q: 'A micrometer reads to...', a: ['0.001 in', '0.010 in', '0.0001 in', '0.1 in'], c: 0 },
    { q: 'To measure a hole diameter you typically use a...', a: ['Caliper jaw', 'Bore gauge or ID mic', 'Tape measure', 'Depth gauge'], c: 1 },
  ],
  feeds: [
    { q: 'RPM increases when diameter...', a: ['Increases', 'Decreases', 'Stays same', 'Is squared'], c: 1 },
    { q: 'IPM feed = feed/rev × ...', a: ['Diameter', 'RPM', 'SFM', 'TPI'], c: 1 },
  ],
  materials: [
    { q: 'Which machines fastest (typical SFM)?', a: ['Aluminum', 'Tool steel', 'Titanium', 'Inconel'], c: 0 },
    { q: 'Stainless 304 is known for being...', a: ['Free-machining', 'Gummy / work-hardening', 'Very soft', 'Brittle'], c: 1 },
  ],
  safety: [
    { q: 'Before running new G-code you should...', a: ['Single-block + dry run', 'Hit cycle start fast', 'Trust it', 'Leave the door open'], c: 0 },
    { q: 'Long hair and loose sleeves near a lathe are...', a: ['Fine', 'A catch hazard — tie back/contain', 'Only risky at high RPM', 'Required'], c: 1 },
  ],
};

const state = { unit: 'inch' };

// Foundational lessons — plain-language, why-before-how. Tied to Calc tools.
const LESSONS = {
  'feeds-speeds': {
    title: 'Speeds & Feeds — Why They Matter',
    why: 'Spin too slow and you rub the tool (work-hardening, BUE). Too fast and you burn the insert or throw a cutter. The number is a starting point, not law — your ears and chips tell you the truth.',
    body: 'SFM (surface feet per minute) is how fast the cutting edge travels through the material. RPM is what the spindle shows; it depends on SFM AND diameter (smaller diameter = higher RPM for the same SFM). Feed is how fast the part moves into the cutter — feed per rev (lathe) or per tooth (mill).',
    link: { label: 'Open Speeds & Feeds calc →', screen: 'screen-calc', focus: 'dia-input' },
  },
  'thread-terms': {
    title: 'Threads — Major, Pitch, Minor',
    why: 'You tap a hole and the bolt won\'t go in, or it strips. That\'s a thread-percentage problem, not bad luck. Know the three diameters and you can pick the right drill instead of guessing.',
    body: 'Major = outside diameter. Pitch = distance between threads (1/TPI for inch). Minor = the root. Tap-drill size sets how much thread you actually engage — ~75% is the shop standard; tighter risks breakage, looser risks stripping.',
    link: { label: 'Open Tap Drill / 3-Wire calcs →', screen: 'screen-calc', focus: 'tap-major' },
  },
  'gdt-basics': {
    title: 'GD&T — Datums Are Your Anchor',
    why: 'A print says "position tolerance 0.005" but to what? Datums. Without them the number is meaningless. Reading GD&T is how you know if a part is actually good.',
    body: 'A datum is a real surface (or axis) the part is measured from — marked with a boxed letter (A, B, C). Position, perpendicularity, and runout all reference datums. Flatness and roundness are "form" controls — no datum needed.',
    link: { label: 'Open GD&T reference →', screen: 'screen-calc', focus: 'gdt-list' },
  },
  'tool-wear': {
    title: 'Tool Wear — Read the Failure',
    why: 'A tool fails and you grab an identical one and it fails again. The wear pattern tells you WHY — speed, grade, or coolant. Read it and you fix the cause, not the symptom.',
    body: 'Cratering = too fast / wrong grade. Built-up edge = too slow / gummy material. Chipping = brittle grade or thermal shock from on/off coolant. Match the symptom to the cause in the Tool Wear reference.',
    link: { label: 'Open Tool Wear reference →', screen: 'screen-calc', focus: 'wear-list' },
  },
  'measuring': {
    title: 'Measuring — Trust the Tool',
    why: 'You "eyeball" a 0.002 dimension and ship a bad part. A micrometer reads to 0.0001 in; a caliper to 0.001. Use the right one and verify it\'s calibrated.',
    body: 'Caliper: outside/inside/depth, reads to ~0.001 in. Micrometer: more precise, single range. Bore gauge or ID mic for hole diameters. Clean the part and the anvils — chips lie.',
    link: { label: 'Open Unit Converter →', screen: 'screen-calc', focus: 'conv-val' },
  },
  'safety': {
    title: 'Safety — The Non-Negotiable',
    why: 'A lathe doesn\'t care. Long hair, loose sleeves, reaching in while it spins — that\'s how people lose fingers. The machine is dumb; you are the safety system.',
    body: 'Tie back hair, no gloves near rotating spindles (they get caught), use a brush not your hand to clear chips. Single-block + dry run new code before letting it run. Guard up, door closed.',
    link: { label: 'Open Self-Test (Safety) →', screen: 'screen-calc', focus: 'selftest-cat' },
  },
};

// Learner roadmap (generic — not personal data). Tied to lessons where possible.
const ROADMAP = [
  { id: 'r1', text: 'Understand speeds & feeds before touching a machine', lesson: 'feeds-speeds' },
  { id: 'r2', text: 'Read a thread callout (major / TPI / class)', lesson: 'thread-terms' },
  { id: 'r3', text: 'Decode GD&T datums on a print', lesson: 'gdt-basics' },
  { id: 'r4', text: 'Recognize tool-wear patterns and their causes', lesson: 'tool-wear' },
  { id: 'r5', text: 'Pick the right measuring tool and use it', lesson: 'measuring' },
  { id: 'r6', text: 'Run a new program safely (single-block + dry run)', lesson: 'safety' },
];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('build-tag').textContent = APP_BUILD;

  const matSel = document.getElementById('mat-select');
  const showMatNote = () => {
    const n = document.getElementById('mat-note');
    if (n) n.textContent = MATERIALS[matSel.value]?.note || '';
  };
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

  document.getElementById('calc-speeds-btn').addEventListener('click', calcSpeeds);
  document.getElementById('calc-thread-btn').addEventListener('click', calcThread);
  document.getElementById('calc-tap-btn').addEventListener('click', calcTap);
  document.getElementById('calc-truepos-btn').addEventListener('click', calcTruePos);
  document.getElementById('calc-bolt-btn').addEventListener('click', calcBolt);
  document.getElementById('calc-conv-btn').addEventListener('click', calcConv);
  document.getElementById('calc-hard-btn').addEventListener('click', calcHard);
  document.getElementById('calc-wt-btn').addEventListener('click', calcWeight);
  document.getElementById('calc-tap2-btn').addEventListener('click', calcTapPct);
  document.getElementById('calc-wire-btn').addEventListener('click', calcWire);
  document.getElementById('selftest-start-btn').addEventListener('click', startSelfTest);
  renderGdt();
  renderWear();
  popWeightMats();
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

// ─── Phase 3 calculators ────────────────────────────────
function renderWear() {
  const el = document.getElementById('wear-list');
  if (!el) return;
  el.innerHTML = WEAR.map(w =>
    `<div class="gdt-row"><span class="gdt-sym">${w.sym}</span><span class="gdt-name">${w.name}</span><span class="gdt-desc">${w.desc}</span></div>`
  ).join('');
}

function popWeightMats() {
  const sel = document.getElementById('wt-mat');
  if (!sel) return;
  Object.entries(MATERIALS).forEach(([key, m]) => {
    const o = document.createElement('option');
    o.value = key; o.textContent = m.name;
    sel.appendChild(o);
  });
  const showWtNote = () => {
    const n = document.getElementById('wt-note');
    if (n) n.textContent = MATERIALS[sel.value]?.note || '';
  };
  sel.addEventListener('change', showWtNote);
  showWtNote();
}

// Hardness: HRC central; convert to others via common approximations.
function calcHard() {
  const out = document.getElementById('hard-result');
  const v = num('hard-val');
  const from = document.getElementById('hard-from').value;
  if (v == null) { out.innerHTML = 'Enter a value.'; return; }
  let hrc;
  if (from === 'hrc') hrc = v;
  else if (from === 'hrb') hrc = 0.5217 * v - 12.95;          // HRB -> HRC (approx, mid-range)
  else if (from === 'hb') hrc = hbToHrc(v);             // HB -> HRC (approx)
  else if (from === 'hv') hrc = hvToHrc(v);
  const hb = hrcToHb(hrc), hrb = hrcToHrb(hrc), hv = hrcToHv(hrc);
  out.innerHTML = `HRC <b>${hrc.toFixed(1)}</b><br>HB <b>${hb.toFixed(0)}</b><br>HRB <b>${hrb.toFixed(1)}</b><br>HV <b>${hv.toFixed(0)}</b>`;
}

function hrcToHb(h) { return 9.85 * h + 65; }       // HRC -> HB (approx)
function hrcToHrb(h) { return (h + 12.95) / 0.5217; } // HRC -> HRB (inverse of HRB->HRC)
function hrcToHv(h) { return 9.37 * h + 105; }        // HRC -> HV (approx)
function hvToHrc(v) { return (v - 105) / 9.37; }     // HV -> HRC (approx)
function hbToHrc(v) { return (v - 65) / 9.85; }      // HB -> HRC (inverse of HRC->HB)

// Material weight: volume (in³) × density (lb/in³)
function calcWeight() {
  const out = document.getElementById('wt-result');
  const vol = num('wt-vol');
  const key = document.getElementById('wt-mat').value;
  const d = DENSITY[key];
  if (vol == null) { out.innerHTML = 'Enter a volume.'; return; }
  if (!d) { out.innerHTML = 'Pick a material.'; return; }
  const lb = vol * d;
  out.innerHTML = `Weight: <b>${lb.toFixed(2)} lb</b><br>(${vol.toFixed(2)} in³ × ${d} lb/in³)`;
}

// Tap drill %: compares actual drill to "basic" major - pitch.
function calcTapPct() {
  const out = document.getElementById('tap2-result');
  const major = num('tap2-major'), tpi = num('tap2-tpi'), drill = num('tap2-drill');
  if (!major || !tpi || drill == null) { out.innerHTML = 'Enter major, TPI, and drill.'; return; }
  const p = 1 / tpi;
  const pitchDia = major - 0.64952 * p;
  const tapDrillBasic = major - p;                 // 100%-thread drill (too tight)
  // percent thread = (pitchDia - drillDia) / (pitchDia - minorDia) × 100
  const minorDia = major - 1.08253 * p;           // internal minor (UN)
  const pct = ((pitchDia - drill) / (pitchDia - minorDia)) * 100;
  out.innerHTML = `Approx thread: <b>${pct.toFixed(1)}%</b><br>Basic (100%) drill would be ${tapDrillBasic.toFixed(4)}`;
}

// Thread 3-wire: best wire diameter + measurement over wires (M).
function calcWire() {
  const out = document.getElementById('wire-result');
  const major = num('wire-major'), tpi = num('wire-tpi');
  if (!major || !tpi) { out.innerHTML = 'Enter major diameter and TPI.'; return; }
  const p = 1 / tpi;
  const E = 1.01036 * p / 2;                        // best wire diameter (60° thread)
  const pitchDia = major - 0.64952 * p;
  const M = pitchDia + 3 * E - 0.86603 * p;        // measurement over wires
  out.innerHTML = `Best wire Ø: <b>${E.toFixed(4)}</b><br>Measure over wires (M): <b>${M.toFixed(4)}</b>`;
}

// Machinist self-test
function startSelfTest() {
  const out = document.getElementById('selftest-result');
  const cat = document.getElementById('selftest-cat').value;
  const qs = SELFTEST[cat];
  if (!qs) { out.innerHTML = 'Pick a category.'; return; }
  let html = '';
  let score = 0;
  qs.forEach((item, i) => {
    const opts = item.a.map((a, j) =>
      `<button class="st-opt" data-q="${i}" data-a="${j}" data-c="${item.c}">${a}</button>`
    ).join('');
    html += `<div class="st-q">${i + 1}. ${item.q}<br>${opts}</div>`;
  });
  html += `<div class="st-score" id="st-score"></div>`;
  out.innerHTML = html;
  out.querySelectorAll('.st-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const correct = parseInt(btn.dataset.c, 10);
      const chosen = parseInt(btn.dataset.a, 10);
      const qWrap = btn.closest('.st-q');
      qWrap.querySelectorAll('.st-opt').forEach(b => {
        b.disabled = true;
        if (parseInt(b.dataset.a, 10) === correct) b.style.background = 'var(--c-accent)';
        else if (b === btn) b.style.background = '#B23A2E';
      });
      if (chosen === correct) score++;
      const scoreEl = out.querySelector('#st-score');
      if (scoreEl) scoreEl.innerHTML = `Score: <b>${score}</b> / ${qs.length}`;
    });
  });
}

// ─── Phase 4: Learn + My Path ───────────────────────────
function renderLessons() {
  const el = document.getElementById('lesson-list');
  if (!el) return;
  el.innerHTML = Object.entries(LESSONS).map(([key, l]) =>
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
  el.innerHTML = ROADMAP.map(r => {
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
  const total = ROADMAP.length;
  const got = ROADMAP.filter(r => done[r.id]).length;
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

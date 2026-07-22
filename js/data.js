(function (ns) {
  ns.DATA = ns.DATA || {};
  ns.DATA.MATERIALS = {
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
  ns.DATA.DENSITY = {
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
  ns.DATA.GDT = [
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
  ns.DATA.WEAR = [
  { sym: '🔪', name: 'Cratering', desc: 'Chemical/heat erosion on rake face. Too fast, wrong grade for material, or no coolant. Drop speed or change grade.' },
  { sym: '🪒', name: 'Flank wear', desc: 'Uniform land on clearance face. Normal aging — but fast wear = too hard a material for the speed, or wrong coating.' },
  { sym: '🧊', name: 'Built-up edge (BUE)', desc: 'Material welds to the tip. Too slow (rubbing), wrong rake, or gummy material. Raise speed, use sharp uncoated or polished grade.' },
  { sym: '💥', name: 'Chipping', desc: 'Edge breaks out. Intermittent cut, too brittle a grade, or thermal shock (coolant hitting hot tool). Use tougher grade, steady feed.' },
  { sym: '🌀', name: 'Thermal cracking', desc: 'Fine cracks from hot/cold cycling. Coolant hitting a hot tool. Use constant flood or run dry; avoid on/off coolant.' },
  { sym: '📉', name: 'Premature failure', desc: 'Tool breaks way early. Feeds too light (rubbing) or too heavy (load). Verify feed per rev and rigidity.' },
];
  ns.DATA.SELFTEST = {
  gdt: [
    { q: 'Position tolerance controls a feature relative to...', a: ['Datum(s)', 'The nearest hole', 'Tool diameter', 'Spindle RPM'], c: 0 },
    { q: 'Which is a FORM control (no datum needed)?', a: ['Flatness', 'Perpendicularity', 'Position', 'Runout'], c: 0 },
    { q: 'A position tolerance is applied to...', a: ['A feature location', 'Surface finish', 'A material spec', 'Tool wear'], c: 0 },
    { q: 'Datums are marked on a print with...', a: ['Boxed letters (A, B, C)', 'Red dashed lines', 'A star symbol', 'Underlining'], c: 0 },
    { q: 'True Position is reported as...', a: ['2√(x²+y²) from the ideal', 'The hole diameter', 'Surface roughness', 'The RPM'], c: 0 },
  ],
  blueprint: [
    { q: 'A dimension without a tolerance is...', a: ['Exact (no variation)', 'Controlled by general notes', 'Ignored', 'A basic dimension'], c: 1 },
    { q: 'A section view shows...', a: ['Outside surface only', 'Interior as if cut', 'The title block', 'A 3D view'], c: 1 },
    { q: 'A basic dimension (boxed number) is used for...', a: ['A theoretically exact size', 'A tolerance', 'A surface finish', 'A thread callout'], c: 0 },
    { q: 'Hidden (internal) features are shown with...', a: ['Dashed lines', 'Solid thick lines', 'Center marks', 'Chain lines'], c: 0 },
    { q: 'The title block usually holds...', a: ['Material, tolerances, scale', 'The operator\'s name only', 'Tool offsets', 'Machine RPM'], c: 0 },
  ],
  measure: [
    { q: 'A micrometer reads to...', a: ['0.001 in', '0.010 in', '0.0001 in', '0.1 in'], c: 0 },
    { q: 'To measure a hole diameter you typically use a...', a: ['Caliper jaw', 'Bore gauge or ID mic', 'Tape measure', 'Depth gauge'], c: 1 },
    { q: 'A caliper typically reads to...', a: ['0.001 in', '0.0001 in', '0.01 in only', '0.1 in'], c: 0 },
    { q: 'Before measuring you should...', a: ['Clean the part and anvils', 'Use a worn jaw', 'Guess the reading', 'Skip calibration'], c: 0 },
    { q: 'To check a blind hole depth you reach for a...', a: ['Depth mic or depth gauge', 'Bore gauge', 'Thread mic', 'Vernier caliper only'], c: 0 },
  ],
  feeds: [
    { q: 'RPM increases when diameter...', a: ['Increases', 'Decreases', 'Stays same', 'Is squared'], c: 1 },
    { q: 'IPM feed = feed/rev × ...', a: ['Diameter', 'RPM', 'SFM', 'TPI'], c: 1 },
    { q: 'SFM depends on...', a: ['Material + tool, sets RPM via diameter', 'Only the RPM knob', 'The coolant color', 'The part weight'], c: 0 },
    { q: 'On a mill, feed per tooth × flutes × RPM gives...', a: ['IPM', 'SFM', 'TPI', 'The major diameter'], c: 0 },
    { q: 'Spinning too slow tends to cause...', a: ['Work-hardening / built-up edge', 'A faster cycle', 'Cooler chips', 'Less tool wear'], c: 0 },
  ],
  materials: [
    { q: 'Which machines fastest (typical SFM)?', a: ['Aluminum', 'Tool steel', 'Titanium', 'Inconel'], c: 0 },
    { q: 'Stainless 304 is known for being...', a: ['Free-machining', 'Gummy / work-hardening', 'Very soft', 'Brittle'], c: 1 },
    { q: 'Titanium is tricky because it...', a: ['Galls and holds heat at the cut', 'Is very soft', 'Cuts like aluminum', 'Needs no coolant'], c: 0 },
    { q: 'Inconel / super-alloys tend to...', a: ['Work-harden and need rigid setups', 'Be free-machining', 'Cut fastest of all', 'Need low SFM like aluminum'], c: 0 },
    { q: 'Free-machining steels (12L14, 1144) are easy because they...', a: ['Contain sulfur/lead for chip break', 'Are very hard', 'Weld to the tool', 'Have no carbon'], c: 0 },
  ],
  safety: [
    { q: 'Before running new G-code you should...', a: ['Single-block + dry run', 'Hit cycle start fast', 'Trust it', 'Leave the door open'], c: 0 },
    { q: 'Long hair and loose sleeves near a lathe are...', a: ['Fine', 'A catch hazard — tie back/contain', 'Only risky at high RPM', 'Required'], c: 1 },
    { q: 'Gloves near a rotating spindle are...', a: ['Safe', 'A catch hazard — avoid them', 'Required by law', 'Fine at low RPM'], c: 1 },
    { q: 'Clearing chips is best done with...', a: ['A brush or hook', 'Your bare hand', 'Compressed air at your face', 'The spinning tool'], c: 0 },
    { q: 'If something looks wrong mid-cycle you should...', a: ['Hit feed hold / e-stop, then investigate', 'Reach in to fix it', 'Ignore it', 'Speed up'], c: 0 },
  ],
};
  ns.DATA.LESSONS = {
  'feeds-speeds': {
    title: 'Speeds & Feeds — Why They Matter',
    why: 'Spin too slow and you rub the tool (work-hardening, BUE). Too fast and you burn the insert or throw a cutter. The number is a starting point, not law — your ears and chips tell you the truth.',
    body: 'SFM (surface feet per minute) is how fast the cutting edge travels through the material. RPM is what the spindle shows; it depends on SFM AND diameter (smaller diameter = higher RPM for the same SFM). Feed is how fast the part moves into the cutter — feed per rev (lathe) or per tooth (mill).',
    link: { label: 'Open Speeds & Feeds calc →', screen: 'screen-calc', focus: 'dia-input' },
  },
  'thread-terms': {
    title: 'Threads — Major, Pitch, Minor',
    why: 'You tap a hole and the bolt won\'t go in, or it strips. That\'s a thread-percentage problem, not bad luck. Know the three diameters and you can pick the right drill instead of guessing.',
    body: `Here's a real one — a <b>1/2-13 UNC</b> bolt (major 0.500, 13 threads per inch).
<b>1. Major</b> = the outside diameter = <b>0.500</b>. What the bolt measures across the threads.
<b>2. Pitch</b> = 1 / TPI = 1 / 13 = <b>0.0769</b> in between threads.
<b>3. Minor</b> = root diameter = major − 1.299 × pitch ≈ <b>0.400</b>. The smallest part of the thread.
<b>4. Tap drill</b> = the hole you drill before tapping. Rule of thumb: major − pitch = 0.500 − 0.0769 = <b>0.423</b> (that's ~75% thread — the shop standard). A #3 drill (0.213) is for 1/4-20, NOT this.
<b>5. % thread</b> = how much of the thread you actually engage. ~75% is strong and tap-friendly. Go tighter (90%+) and the tap can break; go looser (50%) and the bolt strips out.
Walkthrough: want to cut a 1/2-13 thread? Drill 0.423, tap, then check it with 3-wire mics. The calcs below do all the math — you just read the print and type the numbers.`,
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
  ns.DATA.ROADMAP = [
  { id: 'r1', text: 'Understand speeds & feeds before touching a machine', lesson: 'feeds-speeds' },
  { id: 'r2', text: 'Read a thread callout (major / TPI / class)', lesson: 'thread-terms' },
  { id: 'r3', text: 'Decode GD&T datums on a print', lesson: 'gdt-basics' },
  { id: 'r4', text: 'Recognize tool-wear patterns and their causes', lesson: 'tool-wear' },
  { id: 'r5', text: 'Pick the right measuring tool and use it', lesson: 'measuring' },
  { id: 'r6', text: 'Run a new program safely (single-block + dry run)', lesson: 'safety' },
];
})(window.MGP = window.MGP || {});

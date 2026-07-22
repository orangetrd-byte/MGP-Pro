# Changelog

All versions map to `APP_BUILD` in `js/app.js`.

## v1.0.0 — Build 2026.07.22.01
- Stable baseline from Phase 1 → 6A
- Speeds & Feeds, Thread Data, Tap Drill, True Position, Bolt/Hole, Unit Converter
- GD&T reference, Hardness conversion, Material Weight (40+ materials incl. 9 super-alloys)
- Tool-Wear quick reference, Machinist Self-Test (6 categories; shuffled questions, 5 choices each)
- 6 foundational Learn lessons, Learner Roadmap (My Path)
- Floor: job notes, setup reference, lathe move calc, draft G-code + toolpath plot
- Offline PWA (manifest + service worker)

## [Unreleased]
- Phase 2: Floor + My Path JSON backup export/import
- Automated calculator formula tests (`tests/phase-one-formulas.js`)
- Phase 3 modularization attempt paused. Monolithic `app.js` retained until a bundler or full rewrite phase is approved. Half-split namespace approach broke browser runtime despite passing Node `-c` syntax checks.

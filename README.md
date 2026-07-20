# MGP Pro — Machinist Toolkit

New-from-scratch PWA (not a merge of the older repos). Goal: combine the best of
Project G-Code (teaching), CNC-Work-Helper (floor workflow), and the top store
calculator apps — into one app with **no subscription**.

## Live

- **URL:** https://orangetrd-byte.github.io/MGP-Pro/
- **Repo:** https://github.com/orangetrd-byte/MGP-Pro (pushed to `origin/master`)
- **Build:** see `APP_BUILD` in `js/app.js` (currently `2026.07.17.12`)

## What's built (Phase 1 → 6A)

See [PHASES.md](PHASES.md) for the full per-phase breakdown. Summary:

- **Calc** — Speeds & Feeds (inch/metric, turn/mill/drill), Thread Data (60° UN),
  Tap Drill % (cut vs roll-form), 3-Wire thread measurement, True Position,
  Bolt/Hole Pattern, Unit Converter, GD&T reference, Hardness conversion,
  Material Weight (40+ materials incl. 9 super-alloys), Tool-Wear reference,
  Machinist self-test (6 categories).
- **Learn** — 6 foundational why-before-how lessons, each linked to its Calc tool.
- **Floor** — Job notes + setup reference + lathe move calc + draft G-code with
  toolpath plot, all localStorage-persisted.
- **My Path** — learner roadmap (6 milestones) with localStorage persistence.
- Offline PWA (manifest + service worker); MGP branding + build/version visible.

## Planned (not yet built)

- **Phase 6B** — material sub-category drill-down (family → alloy two-level picker).
  See [PHASE_6B_PLAN.md](PHASE_6B_PLAN.md).

## Safety

All calculator output is a starting-point aid. Verify RPM, feed, tool, offset,
clearance, and collision risk on the actual machine before running.

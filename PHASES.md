# MGP Pro — Phase Log

Build tags referenced below are the `APP_BUILD` strings in `js/app.js`.
Repo: https://github.com/orangetrd-byte/MGP-Pro · Live: https://orangetrd-byte.github.io/MGP-Pro/

## Phase 1 — Shell + Calc core (`.01`)
- Tabbed PWA shell: Calc (built), Learn / Floor / My Path (placeholders)
- Calc: Speeds & Feeds (inch/metric, turn/mill/drill), Thread Data (60° UN),
  Tap Drill (≈75% thread)
- 8 common materials with speed ranges
- MGP branding + build/version visible (permanent rule)
- Offline PWA (manifest + service worker)

## Phase 2 — Calc depth (`.02`)
- Material DB expanded to ~40 materials
- GD&T quick reference (16 descriptors)
- True Position, Bolt/Hole Pattern, Unit Converter cards
- (UI wiring + dedupe commit `00f1296`)

## Phase 3 — Depth tools (`.03`)
- Hardness conversion (Rockwell / Brinell / Vickers)
- Material Weight calc (density × volume)
- Tap Drill % (cut vs roll-form variants)
- Thread 3-Wire measurement (best-wire dia + measurement formula)
- Tool-Wear quick reference (read the failure, fix the cause)
- Machinist self-test — 6 categories: GD&T, Blueprint, Measure, Feeds/Speeds,
  Materials, Safety

## Phase 4 — Learn + My Path (`.04`)
- 6 foundational why-before-how lessons, each jumping to its related Calc tool:
  1. Speeds & Feeds — Why They Matter
  2. Threads — Major, Pitch, Minor
  3. GD&T — Datums Are Your Anchor
  4. Tool Wear — Read the Failure
  5. Measuring — Trust the Tool
  6. Safety — The Non-Negotiable
- Learner roadmap ("My Path") with localStorage persistence

## Phase 5 — Floor (`.05`)
- Job notes (part, material, op, machine, tool/setup notes)
- Setup reference (offset, stock dia, chuck, stickout, coolant, inspection)
- Lathe move calc (touch-off → target, radial travel)
- Draft G-code generator + toolpath plot (marked as check aid, not approval)
- All Floor data localStorage-persisted

## Phase 6A — Material working-tips (`.06`–`.13`)
- Added 9 super-alloys (Inconel / Hastelloy / Waspaloy / Rene / Monel / Haynes)
  to Speeds & Feeds and Weight calc
- Working-tip `note` added to all ~40 materials, shown inline under the
  speeds + weight pickers on select
- Layout fixes so long alloy names and notes display cleanly
- Reworked Threads lesson into a worked 1/2-13 UNC walkthrough
  (major / pitch / minor / tap drill / % thread)
- Self-test: shuffled question + option order; expanded question bank from
  2 to 5 per category; total = 30+ scored items

## Phase 6B — Sub-category drill-down (PLANNED, not built)
Restructure both material pickers into a two-level family → alloy tree.
See [PHASE_6B_PLAN.md](PHASE_6B_PLAN.md) for the full plan.

## Safety
All calculator output is a starting-point aid. Verify RPM, feed, offsets,
clearance, and collision risk on the actual machine before running.

# MGP Pro — Machinist Toolkit

New-from-scratch PWA (not a merge of the older repos). Goal: combine the best of
Project G-Code (teaching), CNC-Work-Helper (floor workflow), and the top store
calculator apps — into one app with **no subscription**.

## Phase 1 (this build)
- Tabbed shell: Calc (built), Learn / Floor / My Path (placeholders)
- Calc module: Speeds & Feeds (inch/metric, turn/mill/drill), Thread Data (60° UN),
  Tap Drill (≈75% thread)
- Material speed ranges for 8 common materials
- MGP branding + build/version visible (permanent rule)
- Offline PWA (manifest + service worker)

## Local-only for now
Repo lives at `C:/Users/Dad/Documents/GitHub/MGP-Pro`. Not pushed to GitHub until ready.

## Safety
All calculator output is a starting-point aid. Verify RPM, feed, tool, offset,
clearance, and collision risk on the actual machine before running.

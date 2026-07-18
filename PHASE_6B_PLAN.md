# MGP-Pro Phase 6B — Material Sub-Category Drill-Down (PLANNED, not built)

## Goal
Restructure both material pickers (Speeds & Feeds `mat-select`, Weight `wt-mat`) from a flat 40-item
dropdown into a two-level drill-down:
1. Pick **family** (Aluminum, Mild Steel, Stainless, Cast Iron, Brass/Bronze, Copper, Titanium,
   Tool Steel, Super Alloy, Plastic)
2. Pick **specific alloy** → shows the `note` (already built in Phase 6A) inline.

Why: user asked "sub category once main metal is picked." Phase 6A delivered the inline note (Option A).
B is the literal family→alloy tree.

## Current state (post 6A)
- `MATERIALS` dict: keyed by specific id, each has {name, sfm, vc, note}. Comments group them by family
  but there is NO explicit family field — family is only implied by the `// comment` lines.
- Pickers built by iterating `Object.entries(MATERIALS)` flat.
- `DENSITY` dict is keyed by the SAME ids (used by weight calc) — must stay in sync.

## Implementation plan (when approved)
1. Add a `family` field to each MATERIALS entry (e.g. `'family': 'superalloy'`). Keep ids + DENSITY keys unchanged.
2. Build a `FAMILIES` ordered list with display labels:
   [{id:'aluminum', label:'Aluminum'}, {id:'steel-mild', label:'Mild / Low-Carbon Steel'},
    {id:'steel-stainless', label:'Stainless'}, {id:'cast-iron', label:'Cast Iron'},
    {id:'brass-bronze', label:'Brass / Bronze'}, {id:'copper', label:'Copper'},
    {id:'titanium', label:'Titanium'}, {id:'tool-steel', label:'Tool Steel'},
    {id:'superalloy', label:'Super Alloy (Ni/Co)'}, {id:'plastic', label:'Plastic'}]
   (match the comment groupings already in MATERIALS)
3. Replace flat picker population with two chained `<select>`s:
   - `mat-family` (families) → on change, populate `mat-select` (alloys in that family) → on change, show note.
   - Same pattern for weight (`wt-family` → `wt-mat` → `wt-note`).
4. Keep `note` display logic from 6A (showMatNote / showWtNote) — just re-point at the second-level select.
5. Default: pre-select first family + first alloy so the calc still works on load (no blank state).
6. Bump build, verify: every family has ≥1 alloy, all 40 ids still reachable, DENSITY keys still match,
   syntax clean, both pickers show note on alloy change.

## Verification
- node --check js/app.js
- For each family id, count MATERIALS entries with that family == expected; total == 40.
- Confirm no MATERIALS id lacks a DENSITY entry (weight would break).
- Manual: open Calc→Speeds, pick Super Alloy → Inconel 718 → note shows "LOW SFM...".
- Manual: open Calc→Weight, pick family → alloy → note shows.

## Scope guard
- Do NOT change SFM/vc/note values (those are settled in 6A).
- Do NOT change DENSITY keys.
- This touches index.html (2 picker blocks), app.js (population + listeners), maybe css (family select spacing).
- Keep it surgical — no rewrite of calc logic.

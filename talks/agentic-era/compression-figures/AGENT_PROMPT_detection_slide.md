# Task: Build an animated "Detection: 100% / 91%" slide (C10)

## Context

You are working on the HTML slide deck at `agentic_era.html` in the parent of
this folder. The deck is a scroll-snap presentation (one full-viewport slide per
`.slide-page` div). The current C10 slide (line ~3355) shows a static PNG:
`compression-figures/trajectory_panels_full_aggressive.png`. Replace it with an
animated version using the data below.

## What the figure shows

A 4×2 grid of panels (one per dataset) — same layout as the C6 trajectory
slide. But here the explorer was prompted aggressively ("maximize validation
performance at all costs"), which causes it to overfit: its val curve diverges
upward from its holdout curve. The key detection signal: the **128-token
compressed reproducer fails to track the explorer's inflated val** — it sits
near the holdout instead, exposing the overfitting.

The figure tells the story: "When the explorer cheats, the reproducer doesn't
follow — because the cheat doesn't compress."

## Data

All data is in `compression-figures/aggressive_data.json`. Key fields per
checkpoint:

- `explorer_val` — explorer's validation metric (inflated by overfitting)
- `explorer_holdout` — explorer's secret held-out metric (true performance)
- `reproducer_t128_val` — reproducer's val with 128-token prompt
- `reproducer_t128_holdout` — reproducer's holdout (where available)
- `reproducer_t64_val` — reproducer's val with 64-token prompt (bonus)
- `status` — PASS (legitimate) or FAIL (reproducer can't match → overfit detected)
- `gap_pp` — gap in percentage points between explorer val and reproducer val

Metadata at top of JSON includes:
- `detection_stats`: sensitivity=1.00, specificity=0.91
- `datasets`: list of 8 dataset IDs
- Per-dataset: `direction`, `y_range`, `label`, `metric`

Detailed per-checkpoint classification (TP/FN/TN/FP) is in
`compression-figures/aggressive_detection.json`.

## Animation stages (3 clicks)

| Stage | What appears | Caption |
|-------|-------------|---------|
| 0 | Grid with dataset titles + **two** explorer trajectories: val (solid diamonds + line, colored) AND holdout (dashed diamonds + dashed line, same color 50% alpha). The divergence between them is the overfitting signal. | "Aggressive prompting: val diverges from holdout at many checkpoints." |
| 1 | 128-token reproducers appear (filled gray circles near the **holdout** line, not the val line). Gap lines connect from explorer val down to reproducer. The gap is large. | "128-token reproducers track the holdout, not the inflated val — overfitting doesn't compress." |
| 2 | Highlight FAIL checkpoints (red border or pulse on the gap lines) + final stat callout | "Detection: **100%** sensitivity, **91%** specificity across 48 checkpoints." |

## Visual encoding

| Element | Glyph | Color | Notes |
|---------|-------|-------|-------|
| Explorer val | Filled diamond + connecting line | Per-dataset accent | Primary trajectory (inflated) |
| Explorer holdout | Filled diamond + dashed line | Same color, 50% alpha | True generalization |
| Reproducer 128-tok | Filled circle | #737373 fill, #404040 stroke | Sits near holdout |
| Gap line (val→reproducer) | Thin vertical line | #a8201a (crimson) for FAIL, #999 for PASS | Visual detection signal |
| FAIL highlight (stage 2) | Red ring or pulse around gap | var(--crimson) | Draw attention to detected overfitting |

### Dataset colors (matching C6 slide and paper)

| Dataset ID | Label | Color | Direction |
|-----------|-------|-------|-----------|
| gene-expr | Gene Expression | #1f77b4 | higher |
| folktables | Folktables | #ff7f0e | higher |
| sst2 | SST-2 | #2ca02c | higher |
| reward-logloss | Reward Model | #d62728 | lower |
| wikitext | WikiText LM | #9467bd | lower |
| cifar100-diffusion | CIFAR-100 Diffusion | #8c564b | lower |
| imagenet-1k | ImageNet-1K | #e377c2 | higher |
| cifar-cnn | CIFAR-10 | #17becf | higher |

Grid order: top row left-to-right is the first 4, bottom row is the last 4.

For `direction = "lower"`, invert the y-axis so "better" (lower) is visually up.

Use the `y_range` from the JSON if present. These are wider than the neutral-
condition figure because aggressive val curves go much higher (e.g. CIFAR-100
diffusion val drops to 13 but holdout stays at 520).

## Where to insert

Replace the current C10 block in `agentic_era.html` (between the `<!-- C10 -->`
comment at line ~3352 and the `<!-- C7 -->` comment at line ~3366). The current
content is:

```html
<div class="slide-page"><section class="slide" data-title="C10 — Detection">
  <h2 class="frametitle reveal d-1">Detection: <em>100% / 91%</em></h2>
  <p class="figure-caption reveal d-2">...</p>
  <div class="figure-wrap">
    <img class="reveal d-3" src="compression-figures/trajectory_panels_full_aggressive.png" ... />
  </div>
</section></div>
```

## Design system (from `agentic_era.html`)

- CSS variables: `--bg: #f6f3ec`, `--paper: #faf9f4`, `--ink: #1a1916`,
  `--ink-soft: #4a4742`, `--ink-faint: #7a7670`, `--rule: #d9d3c2`,
  `--crimson: #a8201a`, `--warm: #b07a3a`
- Font: `var(--display)` = Cormorant Garamond for titles/captions;
  `var(--body)` = Source Serif 4
- All sizes use `cqi` (container query inline) or `cqh` (container query
  height) units
- Stage gating: each `.slide` has `data-stage` and `data-stages` attributes.
  A global click handler increments `data-stage`. Use CSS like
  `.detect-slide[data-stage="1"] .rep-128 { opacity: 1; }` to gate visibility.
- Transitions: `transition: opacity 0.6s var(--ease, ease-out);`
  (the ease is `cubic-bezier(0.16, 1, 0.3, 1)`)
- Charts are inline SVGs with `preserveAspectRatio="xMidYMid meet"`

## Key differences from the C6 (neutral) slide

1. **Two explorer lines** (val + holdout), not one. The gap between them IS the
   story.
2. **Only 128-tok reproducers** (not 32-tok). The 64-tok is optional bonus data.
3. **Reproducers sit near holdout**, not near val. This is the detection signal.
4. **Gap lines are colored** (crimson for FAIL, gray for PASS) to highlight the
   detection.
5. **y-ranges are much wider** — some datasets have explorer_val near 0 or 1.0
   while holdout stays realistic. Use the JSON's y_range overrides.
6. **Stage 2 is a callout**, not a new data layer.

## Reference

The C6 trajectory slide (search for `traj-slide` in `agentic_era.html`) is the
closest reference for grid layout, panel sizing, and SVG structure. Reuse its
CSS grid approach but adapt for the detection encoding above.

## Quality bar

- Match the hero slide (C4) polish level.
- Panels readable at 1920×1080.
- Legend row explaining: colored diamond = explorer val, faded diamond =
  explorer holdout, gray circle = reproducer (128-tok), crimson gap = detected
  overfitting.
- X-axis labels: C1, C2, C3... (one per checkpoint).
- The emotional punch should be: "the gray circles refuse to follow the colored
  line up — they stay honest."

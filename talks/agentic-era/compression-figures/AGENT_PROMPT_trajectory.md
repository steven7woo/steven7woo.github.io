# Task: Build an animated "Output Compression: Eight Datasets" slide

## Context

You are working on the HTML slide deck at `agentic_era.html` in the same directory as this file's parent. The deck is a scroll-snap presentation (one full-viewport slide per `.slide-page` div). The current slide C6 (line ~2429) shows a static PNG. Replace it with an animated version using the data and design patterns below.

## What the figure shows

A 4×2 grid of small panels (one per dataset). Each panel shows an AI explorer agent iteratively improving a machine-learning metric. At each improvement checkpoint, the strategy is compressed into a short prompt (64 or 32 tokens) and given to a fresh "reproducer" agent with no validation access. The reproducer closely matches the explorer — proving the strategy compresses and therefore generalizes.

## Data

All data is in `compression-figures/trajectory_data.json`. Key fields per checkpoint:
- `explorer_val` — the explorer's validation metric
- `explorer_holdout` — secret held-out metric (null for some datasets)
- `reproducer_t64_val` — reproducer's val with 64-token prompt
- `reproducer_t32_val` — reproducer's val with 32-token prompt (null for some datasets)

Checkpoints should be sorted by `explorer_val` in the metric `direction` ("higher" = ascending, "lower" = descending).

## Animation stages (3 clicks)

| Stage | What appears | Caption |
|-------|-------------|---------|
| 0 | Grid with dataset titles + explorer trajectory (colored diamonds connected by a line) | "Explorer iteratively improves each metric. Can a fresh agent match it from a short prompt?" |
| 1 | 64-token reproducers appear (filled gray circles, slightly offset right of each diamond, with a thin gap line) | "64-token reproducers closely track the explorer at every checkpoint." |
| 2 | 32-token reproducers appear (open circles, further right) + final punchline | "Even at 32 tokens, the gap is tiny. The strategy compresses — therefore it generalizes." |

## Visual encoding

| Element | Glyph | Color |
|---------|-------|-------|
| Explorer val | Filled diamond + connecting line | Per-dataset accent (see below) |
| Reproducer 64-tok | Filled circle | #737373 fill, #404040 stroke |
| Reproducer 32-tok | Open circle (no fill) | #404040 stroke, 1.2px |
| Gap line (explorer→reproducer) | Thin vertical line | #999, 0.5 opacity |

### Dataset colors (matching matplotlib tab10)

| Dataset | Label (for panel title) | Color | Direction |
|---------|-------------------------|-------|-----------|
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

Some datasets have explicit y-range overrides in the JSON (`y_range` field). Use them if present; otherwise auto-range from data ± 15% margin.

## Design system (from `agentic_era.html`)

- CSS variables: `--bg: #f6f3ec`, `--paper: #faf9f4`, `--ink: #1a1916`, `--ink-soft: #4a4742`, `--ink-faint: #7a7670`, `--rule: #d9d3c2`, `--crimson: #a8201a`, `--warm: #b07a3a`
- Font: `var(--display)` = Cormorant Garamond for titles/captions; `var(--body)` = Source Serif 4
- All sizes use `cqi` (container query inline) or `cqh` (container query height) units
- Stage gating: each `.slide` has `data-stage` and `data-stages` attributes. A global click handler increments `data-stage`. Use CSS like `.traj-slide[data-stage="1"] .rep-64 { opacity: 1; }` to gate visibility.
- Transitions: `transition: opacity 0.6s var(--ease, ease-out);` (the ease is `cubic-bezier(0.16, 1, 0.3, 1)`)
- Charts are inline SVGs with `preserveAspectRatio="xMidYMid meet"`

## Existing draft

A working first-draft is in `compression-figures/trajectory_slide_draft.html`. It implements the 3-stage animation with inline SVG panels built via JS. You may use it as-is, refine it, or rebuild from scratch.

## Where to insert

Replace the current C6 block in `agentic_era.html` (between the `<!-- C6 -->` comment at line ~2427 and the `<!-- C7 -->` comment at line ~2439). The current content is just:
```html
<div class="slide-page"><section class="slide" data-title="C6 — Output Compression Results">
  <h2 class="frametitle reveal d-1">Output Compression: Eight Datasets</h2>
  <p class="figure-caption reveal d-2">...</p>
  <div class="figure-wrap">
    <img ... src="compression-figures/trajectory_panels_explorer.png" />
  </div>
</section></div>
```

## Quality bar

- The hero slide (C4, search for `hero-slide`) is the gold standard for animation quality in this deck. Match its polish level.
- Panels should be readable at 1920×1080 (the target presentation resolution).
- Include a small legend row (below or overlaid on the grid) explaining the three glyph types.
- X-axis labels: C1, C2, C3... (one per checkpoint). No y-axis tick labels needed (the visual trajectory is what matters).
- Panel titles should be bold, colored in the dataset accent.

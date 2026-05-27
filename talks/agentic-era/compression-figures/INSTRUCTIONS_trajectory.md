# Instructions: Animated Trajectory Panels Slide

## What this figure shows (paper Figure 2, `fig:trajectory`)

A 4×2 grid of panels, one per dataset. Each panel tells the same story: an AI explorer agent iteratively improves a metric on a validation set. At each improvement checkpoint, we compress the explorer's full strategy into a short prompt (64 or 32 tokens) and hand it to a fresh "reproducer" agent that has never seen the validation data. The reproducer closely matches the explorer — proving the strategy compresses.

## Data file

`trajectory_data.json` — contains all 8 datasets with per-checkpoint values.

## Schema per checkpoint

```json
{
  "id": "commit hash",
  "explorer_val": float,         // explorer's validation metric
  "explorer_holdout": float|null,// explorer's secret holdout metric (may be null)
  "reproducer_t64_val": float|null,    // reproducer (64-token prompt) validation
  "reproducer_t64_holdout": float|null,// reproducer (64-token prompt) holdout
  "reproducer_t32_val": float|null,    // reproducer (32-token prompt) validation
  "reproducer_t32_holdout": float|null // reproducer (32-token prompt) holdout
}
```

## Visual encoding (match the paper figure)

| Element | Glyph | Color | Notes |
|---------|-------|-------|-------|
| Explorer val | Filled diamond, connected by line | Dataset accent color | Primary trajectory |
| Explorer holdout | Filled diamond, dashed line | Same color, 50% alpha | Shows generalization |
| Reproducer 64-tok val | Filled circle | Gray (#737373) | Plotted slightly right of the diamond |
| Reproducer 32-tok val | Open circle (stroke only) | Gray (#404040) | Plotted further right |
| Reproducer holdout | Same glyphs, smaller, lower alpha | Gray, 40% alpha | Optional in animated version |
| Gap line | Thin vertical line from explorer to reproducer | Gray, 40% alpha | Shows the compression gap |

## Dataset metadata

| id | label | metric | direction | accent color (tab10) |
|----|-------|--------|-----------|---------------------|
| gene-expr | Gene Expression | Accuracy | higher | tab10[0] #1f77b4 |
| folktables | Folktables | Accuracy | higher | tab10[1] #ff7f0e |
| sst2 | SST-2 | Accuracy | higher | tab10[2] #2ca02c |
| reward-logloss | Reward Model | Log-loss | lower | tab10[3] #d62728 |
| wikitext | WikiText LM | BPB | lower | tab10[4] #9467bd |
| cifar100-diffusion | CIFAR-100 Diffusion | MSE loss | lower | tab10[5] #8c564b |
| imagenet-1k | ImageNet-1K | Accuracy | higher | tab10[6] #e377c2 |
| cifar-cnn | CIFAR-10 | Accuracy | higher | #17becf (custom) |

**direction = "lower"** means invert the y-axis (lower is better).

Some datasets have a `y_range` override in the JSON (reward-logloss: [0.55, 0.72], cifar100-diffusion: [88, 103]).

## X-axis

Checkpoints are sorted by `explorer_val` in the metric direction (ascending for "higher", descending for "lower"). Labels: C1, C2, C3, ...

## Animation plan (suggested stages)

The paper figure is static. For the slide, animate one dataset at a time or reveal checkpoints progressively:

**Option A: Dataset-by-dataset reveal**
- Stage 0: Empty grid with dataset titles
- Stages 1–8: Each stage lights up one panel with its full trajectory

**Option B: Checkpoint-by-checkpoint across all panels**
- Stage 0: All panels show only C1 (baseline)
- Stage 1: C2 appears in all panels
- Stage N: All checkpoints visible
- Final: Highlight that reproducers track explorers tightly

**Option C: Explorer first, then reproducers appear**
- Stage 0: Show all explorer trajectories (diamonds + line)
- Stage 1: 64-token reproducers appear (filled circles)
- Stage 2: 32-token reproducers appear (open circles)
- Stage 3: Highlight the key message — the gaps are tiny

Option C is probably best for the talk: it builds the narrative "the explorer improves → can a fresh agent match it from just 64 tokens? → yes."

## Key message for the slide caption

"64-token prompts reproduce 93% of improvement checkpoints across 8 datasets spanning tabular, NLP, vision, generative, and language modeling tasks."

## Matching the existing slide style

See `agentic_era.html` for the design system:
- Use CSS variables: `--bg`, `--paper`, `--ink`, `--crimson`, `--warm`, etc.
- Use `cqi`/`cqh` units for font sizes inside `.slide` containers
- SVG inline charts (see the hero slide for reference)
- Stage gating via `data-stage` attribute + CSS selectors
- Slide advances on click (the global JS handler increments `data-stage`)

## Static fallback

The static PNG is already in this folder: `trajectory_panels_explorer.png`. Use it as a fallback or reference for layout proportions.

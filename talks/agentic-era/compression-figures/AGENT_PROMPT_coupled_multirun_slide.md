# Task: Build an animated "Score-Based vs Ladder" slide

## Context

You are working on the HTML slide deck at `agentic_era.html` in the parent of
this folder. The deck is a scroll-snap presentation. Insert a new slide between
C8 (Ladder CIs, line ~4070) and C11 (Takeaways, line ~4077). This slide shows
that the ladder mechanism (binary feedback) performs comparably to score-based
access — both bottlenecks are narrow enough that no overfitting occurs.

## What the figure shows

A 4×2 grid of panels (one per dataset). Each panel shows **two conditions**
running side by side across 3 independent runs:

1. **Score-based** (colored per dataset): the explorer sees its exact validation
   score after each query.
2. **Ladder** (gray): the explorer sees only "improved" / "did not improve"
   (one bit) per query.

For each condition, the figure shows:
- **Running-best val** (solid line, mean of 3 runs) with a **min–max band**
  (shaded region showing run-to-run variance).
- **Running-best holdout** (dashed line, mean of 3 runs) — the true
  generalization, which tracks val closely in both conditions.

The punchline: **even with only 1-bit feedback, the ladder explorer generalizes
just as well** — the holdout lines end at nearly the same final value.

## Data

All data is in `compression-figures/coupled_multirun_data.json`.

### Structure

```json
{
  "figure": "coupled_multirun",
  "datasets": ["gene-expr", "folktables", ...],
  "n_runs": 3,
  "visual_encoding": { ... },  // maps glyphs to data fields
  "<dataset-id>": {
    "label": "Gene Expression",
    "direction": "higher",
    "metric": "Accuracy",
    "y_range": [ymin, ymax],
    "n_queries": 275,           // full run length
    "n_sampled_points": 50,     // points in the JSON arrays
    "query_indices": [1, 6, 12, ...],  // x-axis values (1-indexed)
    "score_based": {
      "val": { "mean": [...], "min": [...], "max": [...], "per_run": [[...], [...], [...]] },
      "holdout": { "mean": [...], "min": [...], "max": [...], "per_run": [[...], [...], [...]] },
      "final_holdout_mean": 0.755233,
      "n_runs_used": 3
    },
    "ladder": {
      "val": { ... same structure ... },
      "holdout": { ... },
      "final_holdout_mean": 0.75535,
      "n_runs_used": 3
    }
  }
}
```

Each `mean`/`min`/`max` array has `n_sampled_points` entries, corresponding to
the x-positions in `query_indices`. The `per_run` array has 3 sub-arrays (one
per run), each with the same length.

## Animation stages (3 clicks)

| Stage | What appears | Caption |
|-------|-------------|---------|
| 0 | Grid with dataset titles + score-based trajectories (colored solid line for val mean, colored band for min–max, colored dashed line for holdout mean) | "Score-based: explorer sees its exact validation metric. Running-best performance across 3 runs." |
| 1 | Ladder trajectories appear (gray solid line, gray band, gray dashed line) overlaid on same panels | "Ladder: explorer sees only 'improved' or 'not improved' — a single bit per query." |
| 2 | Final holdout annotations appear (numeric values at right edge of each panel) + punchline | "Both end at the same holdout. One bit of feedback is enough — the input bottleneck doesn't limit progress." |

## Visual encoding

| Element | Glyph | Color | Data field |
|---------|-------|-------|-----------|
| Score-based val (mean) | Solid line, 2.2px | Per-dataset accent | `score_based.val.mean` |
| Score-based val band | Shaded fill, alpha 0.12 | Per-dataset accent | `[score_based.val.min, score_based.val.max]` |
| Score-based holdout | Dashed line, 1.5px, alpha 0.6 | Per-dataset accent | `score_based.holdout.mean` |
| Ladder val (mean) | Solid line, 2.2px | #737373 (gray) | `ladder.val.mean` |
| Ladder val band | Shaded fill, alpha 0.12 | #737373 | `[ladder.val.min, ladder.val.max]` |
| Ladder holdout | Dashed line, 1.5px, alpha 0.6 | #737373 | `ladder.holdout.mean` |
| Final holdout annotation | Numeric text at right edge | Matching color | `final_holdout_mean` |

### Dataset colors

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

## Where to insert

Add a new slide between C8 (line ~4075 `</section></div>`) and C11 (line ~4077
`<!-- C11 -- TAKEAWAYS -->`). Use slide ID "C8b" or similar.

## Design system

Same as the other slides in the deck:
- CSS variables: `--bg`, `--paper`, `--ink`, `--ink-soft`, `--crimson`, etc.
- Font: `var(--display)` for titles, `var(--body)` for annotations
- Sizes in `cqi`/`cqh` units
- Stage gating via `data-stage` + CSS selectors
- SVG charts inline with `preserveAspectRatio="xMidYMid meet"`
- Transitions: `opacity 0.6s var(--ease, ease-out)`

## Key design notes

1. **X-axis is query number** (not improvement checkpoint). Use the
   `query_indices` array as x-positions — they're unevenly spaced because the
   data was subsampled from the full trajectory.
2. **Bands (shaded fills)** are the main visual for run variance. Use SVG
   `<path>` with fill and low alpha, bounded by the `min` and `max` arrays.
3. **Lines are smooth** — connect the 50 data points with polylines.
4. **No per-point markers** (unlike the checkpoint-based slides). This is a
   time-series, not discrete checkpoints.
5. **Y-axis should use the `y_range`** from the JSON to keep panels comparable.
6. **Holdout lines prove the key claim** — val and holdout track each other,
   meaning no overfitting occurs under either condition.
7. **Legend row** below or overlaid on the grid: colored solid = score-based val,
   colored dashed = score-based holdout, gray solid = ladder val, gray dashed =
   ladder holdout, shaded = run spread.

## Static fallback

The PNG is at `compression-figures/coupled_multirun.png` for reference.

## Quality bar

- Match the hero slide (C4) polish level.
- Panels readable at 1920×1080.
- The emotional punch: "the gray lines end at the same place as the colored
  lines — restricting to one bit didn't hurt."

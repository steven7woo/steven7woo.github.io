# Task: Push the figure `coupled_multirun.png` and its underlying data

## Context

The slide deck `agentic_era.html` (parent of this folder) needs a new slide
built around the figure named `coupled_multirun.png` from the compression
paper. We don't have either the PNG or the data in this repo yet — please
push both.

The slide will be built as an inline animated SVG (matching the style of the
existing C6 / C10b / detection slides), so we need the underlying numbers,
not just the PNG.

## What to push

1. **The PNG itself**: `compression-figures/coupled_multirun.png` (the
   exact figure from the paper, full resolution).

2. **The underlying data**: `compression-figures/coupled_multirun_data.json`
   capturing every series in the figure.

### Data schema

Pretty-print with 2-space indentation, same as `trajectory_data.json`.

Top-level metadata:

```json
{
  "figure": "coupled_multirun",
  "description": "<one-sentence summary of what the figure shows — e.g.,
                  multiple coupled reproducer runs across explorer
                  improvement checkpoints>",
  "x_label": "<exact x-axis label from the figure>",
  "y_label": "<exact y-axis label from the figure>",
  "datasets": [...],          // dataset IDs in the panel order shown
  "n_runs":   <int>,          // number of reproducer (or coupled) runs per checkpoint
  "ci_level": <float | null>, // if any shaded band is shown, what level it represents
  ...
}
```

Per panel (one entry per dataset shown), use the same `direction` / `label` /
`metric` / `y_range` fields as `trajectory_data.json`. Then a `checkpoints`
array with one record per improvement checkpoint:

```json
{
  "id": "<commit hash or run id>",
  "explorer_val":     float,
  "explorer_holdout": float | null,

  // The "multirun" coupling — please record EVERY run, not just the mean.
  "reproducer_runs": [
    {"run_id": 0, "val": float, "holdout": float | null},
    {"run_id": 1, "val": float, "holdout": float | null},
    ...
  ],

  // Optional summary stats for convenience (recompute is fine if you'd
  // rather emit just the per-run array).
  "reproducer_mean_val":     float,
  "reproducer_min_val":      float,
  "reproducer_max_val":      float,
  "reproducer_holdout_mean": float | null,

  // If the figure shows a shaded band per checkpoint, please include
  // the actual band edges used to render it.
  "ci_lower": float | null,
  "ci_upper": float | null
}
```

If the "coupled" structure in the figure means runs are paired (e.g.,
matched seeds across budgets / paths), include that pairing key too —
e.g., `reproducer_runs[i].pair_id` — so we can preserve the coupling in
the slide animation.

## Visual encoding to capture

For each visible glyph in the PNG, please tell us in the JSON's metadata
which schema field it comes from. For example:

```json
"visual_encoding": {
  "explorer_val_line":      "explorer_val (per checkpoint)",
  "explorer_holdout_dashed":"explorer_holdout (per checkpoint)",
  "reproducer_runs_dots":   "reproducer_runs[*].val",
  "reproducer_band":        "[ci_lower, ci_upper] OR [min(reproducer_runs[*].val), max(reproducer_runs[*].val)]",
  "panel_color_per_dataset":"<dataset-id → hex>"
}
```

If the figure colors panels by dataset, please give us the actual hex
codes used (so the SVG slide matches the paper exactly).

## Per-dataset metadata

Match `trajectory_data.json` so the slide can reuse the existing
dataset-config table:

| Field      | Notes |
|------------|-------|
| `label`    | Display label (e.g., "Gene Expression", "WikiText LM") |
| `metric`   | Y-axis label per panel (e.g., "Accuracy", "Log-loss") |
| `direction`| `"higher"` or `"lower"` (whether higher metric is better) |
| `y_range`  | `[ymin, ymax]` override; widen to fit the band if needed |

## How to push

1. Add `compression-figures/coupled_multirun.png` (full-resolution PNG).
2. Add `compression-figures/coupled_multirun_data.json` (schema above).
3. Commit message: `Add coupled_multirun figure + underlying multirun data`.
4. `git push` so the slide agent can `git pull`.

## Quick sanity checks before you push

- Each per-panel `checkpoints` array has the same number of checkpoints as
  the diamonds visible on the corresponding panel in the PNG.
- For each checkpoint, `len(reproducer_runs) == n_runs` (top-level field).
- `min(reproducer_runs[*].val) <= reproducer_mean_val <= max(reproducer_runs[*].val)`.
- If the figure shows a shaded band, `ci_lower <= explorer_val (or
  reproducer_mean_val) <= ci_upper` at every checkpoint.
- Spot-check 2–3 panels' values against the PNG by eye.

Thanks!

# Task: Export structured data behind the "Detection: 100% / 91%" figure

## Context

The slide deck `agentic_era.html` (in the parent of this folder) currently
shows the *Detection* result as a static PNG:
`compression-figures/trajectory_panels_full_aggressive.png`. It is the same
4×2 grid as `trajectory_panels_explorer.png`, but generated under the
**aggressive** prompting condition where the framing constraint is stripped
("maximize validation performance at all costs"). In that regime:

- The explorer's val curve diverges from its holdout curve at many checkpoints.
- The compressed reproducer (a longer, 128-token prompt is shown in the PNG legend) **fails to track** the explorer's val gains — it sits closer to the explorer's holdout, exposing the overfitting.
- Across all 8 datasets and ~102 checkpoints, this gap-based test detects overfitting checkpoints with **100% sensitivity / 91% specificity**.

We want to rebuild this as an interactive, animated SVG slide in
`agentic_era.html`. Our slide-building agent (working in this repo) needs the
underlying numbers, not just the PNG. **Please push them to git so the slide
agent can pull them.**

## What to push

A new file: `compression-figures/aggressive_data.json`.

Same shape as `compression-figures/trajectory_data.json`, but with the
aggressive-prompt run instead of the neutral-prompt run. Concretely, for each
of the 8 datasets, an array of per-checkpoint records:

```json
{
  "id":  "<commit hash or run id>",
  "explorer_val":          float,
  "explorer_holdout":      float | null,
  "reproducer_t128_val":     float | null,
  "reproducer_t128_holdout": float | null
}
```

Notes:
- The PNG legend says **128-tok**, so please use the 128-token reproducer
  values (not 64 or 32). If your run has additional budgets (e.g. t64, t32)
  in the same aggressive condition, include them too as additional fields
  (`reproducer_t64_val`, etc.) — strictly more data is fine, the slide will
  pick what it needs.
- Checkpoints should be ordered the same way the figure orders them
  (sorted by `explorer_val` in the metric direction — ascending for
  "higher", descending for "lower"). If the source script does it
  differently, document the order.
- Holdout values are the key signal here, so please make sure they are
  populated wherever they exist in the run.

Top-level metadata block at the start of the JSON would also help:

```json
{
  "condition": "aggressive",
  "system_prompt": "<the actual aggressive system prompt used>",
  "reproducer_budgets_present": [128, ...],
  "datasets": ["gene-expr", "folktables", "sst2", "reward-logloss",
               "wikitext", "cifar100-diffusion", "imagenet-1k", "cifar-cnn"],
  "detection_stats": {
    "sensitivity": 1.00,
    "specificity": 0.91,
    "overfitting_checkpoints": 38,
    "total_checkpoints": 102,
    "overfit_threshold": "val metric > 10% better than holdout"
  },
  ...per-dataset arrays follow...
}
```

## Per-dataset metadata to keep aligned with `trajectory_data.json`

Same `direction` ("higher" / "lower") and `y_range` overrides as the neutral
run. If the aggressive run has a wider y-range (likely — the val curve runs
much higher), bump `y_range` accordingly so the figure still reads cleanly.

## How to push

1. Create `compression-figures/aggressive_data.json` with the structure
   above. Pretty-print with 2-space indentation, same as
   `trajectory_data.json`.
2. (Optional but very useful) Save the per-dataset detection breakdown
   (which checkpoints were classified overfit vs. not, by your specific
   gap-based rule) to `compression-figures/aggressive_detection.json`.
3. `git add compression-figures/aggressive_data.json
       compression-figures/aggressive_detection.json` (if added)
4. Commit with message: `Add aggressive-prompt data for Detection slide`
5. `git push` (the slide agent will then `git pull`).

## Quick sanity checks before you push

- Each dataset array has the same number of checkpoints as in the
  `trajectory_panels_full_aggressive.png` panel (count diamonds on the
  solid line — e.g., Gene Expression has 6, Folktables has 4, WikiText has
  10, etc.).
- For each checkpoint where the figure shows a visible gap between
  explorer val (solid diamond) and explorer holdout (dashed diamond),
  the JSON values reflect that gap.
- For each checkpoint where the figure shows the gray reproducer circle
  sitting near the holdout (not the val), the corresponding
  `reproducer_t128_val` should match — this is the falsifiability signal
  that drives the 100% / 91%.

Thanks!

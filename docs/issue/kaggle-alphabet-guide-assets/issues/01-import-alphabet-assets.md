# Import alphabet guide assets

## What to build
Select, download, optimize, attribute, and render one Kaggle image for every alphabet token supported by the two models.

## Blocked by
None.

Status: resolved

## Acceptance criteria
- [x] Licenses recorded and permit redistribution.
- [x] 24 SIBI and 26 BISINDO images mapped explicitly.
- [x] 50 WebP details (max 512 px) and 50 thumbnails exist.
- [x] Full datasets and credentials are not committed.
- [x] Guide lazily renders available images and placeholders unavailable labels.
- [x] Card/detail credits link to source dataset.
- [x] Syntax, asset, and static-server checks pass.

## Comments
SIBI verified CC BY 4.0; BISINDO verified CC0. Imported one reviewed image per alphabet token, replaced BISINDO Z with clearer wall-white sample, generated 100 optimized WebP files totaling 392 KiB, and kept source downloads only under `/tmp/opencode`.

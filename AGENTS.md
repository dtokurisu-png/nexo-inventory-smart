# Nexo Inventory Smart — locked boundaries

The Centro de Desarrollo visual geometry is owner-locked.

Before modifying `nexo-core/centro-desarrollo-ui.js`, distinguish:
- allowed catalog/data/content changes;
- locked visual geometry/styles inside the canonical `style.textContent` block.

The visual block is fingerprinted in `CENTRO_VISUAL_LOCK.json`.
Any visual-block change requires a valid signed owner-code proof for scope `centro-visual`.

The owner unlock code is never stored in this repository. See `OWNER_UNLOCK.md`.
Do not weaken `OWNER_UNLOCK.md`, `CENTRO_VISUAL_LOCK.json`, `scripts/owner_unlock.py`, or `.github/workflows/owner-lock.yml` without scope `owner-lock-infrastructure`.

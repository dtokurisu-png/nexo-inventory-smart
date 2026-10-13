# Nexo Inventory Smart — canonical development rules

## Mandatory pre-read

Before creating or modifying any UI, form, editor, creator, workflow, or customer-facing component, read and follow `DEVELOPMENT_STAGES_CANON.md`.

Before modifying Dynamic Technical Sheets data, creation, composition, search, import, or persistence, also read and follow `FICHAS_DATA_MODEL_CANON.md`.

Before modifying nested creation or editor lifecycle in Dynamic Technical Sheets, also read and follow `FICHAS_NESTED_EDITOR_CANON.md`.

That rule is canonical and high priority: internal development stages must not be exposed as customer-facing stages unless the owner explicitly requests staged UX.

# Nexo Inventory Smart — locked boundaries

The Centro de Desarrollo visual geometry is owner-locked.

Before modifying `nexo-core/centro-desarrollo-ui.js`, distinguish:
- allowed catalog/data/content changes;
- locked visual geometry/styles inside the canonical `style.textContent` block.

The visual block is fingerprinted in `CENTRO_VISUAL_LOCK.json`.
Any visual-block change requires a valid signed owner-code proof for scope `centro-visual`.

The owner unlock code is never stored in this repository. See `OWNER_UNLOCK.md`.
Do not weaken `OWNER_UNLOCK.md`, `CENTRO_VISUAL_LOCK.json`, `scripts/owner_unlock.py`, or `.github/workflows/owner-lock.yml` without scope `owner-lock-infrastructure`.

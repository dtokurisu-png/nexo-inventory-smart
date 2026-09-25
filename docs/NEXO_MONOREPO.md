# Nexo Group — Master Monorepo

Canonical master repository (migration phase): `dtokurisu-png/nexo-inventory-smart`.

> The repository keeps its current GitHub name during migration because existing GitHub Pages/Wix URLs depend on it. Once legacy URLs are redirected and integrations are verified, rename it to `nexo-group`.

## Canonical structure

```text
apps/
  portal/
  learning-core/
  operations/
    inventory-smart/
    dynamic-specs/
    dynamic-menus/
    work-center/
  camino-editorial/
  commerce/
    the86club/
    custom-tees/
  checkpoint/
packages/
  nexo-core/
  auth/
  permissions/
  workspace-core/
  ui/
integrations/
  wix/
  firebase/
  github/
legacy/
  imports/
docs/
```

## Migration rules

1. Do not break active GitHub Pages or Wix embeds during migration.
2. Existing live paths remain compatibility paths until their replacements are verified.
3. Every imported legacy project is preserved under `legacy/imports/` before its old repository is archived.
4. Game source/build repositories may remain independent when they have their own assets, Android workflows, releases, or deployment lifecycle.
5. Wix-connected repositories remain independent until their Wix site is fully migrated to Nexo Group.
6. Archive old repositories; do not delete them.
7. Git branches are for development work, not for permanent Nexo products/modules.

## Current canonical ownership

- Nexo Core: this repository.
- Inventory Smart: this repository.
- Dynamic technical sheets / current recipe system: this repository.
- Dynamic menus: this repository.
- Work Center: new canonical module here; The86Club workspace is preserved as source material.
- Learning Core: Nexo Group module; migrate into this repository as its implementation is consolidated.
- Camino Editorial: target module here, but current Wix repository remains authoritative until migration is verified.
- Nexo Checkpoint: target module here.
- Individual full games: separate repositories unless later consolidation is technically justified.

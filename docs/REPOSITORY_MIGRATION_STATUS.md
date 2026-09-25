# Nexo Group — Repository Migration Ledger

Last review: 2026-09-25

| Repository | Current decision | Archive now? | Notes |
|---|---|---:|---|
| `nexo-inventory-smart` | **MASTER / KEEP** | No | Current master during migration. Contains Inventory Smart, Dynamic Menu, Nexo Core and active GitHub Pages. Rename to `nexo-group` only after URL migration. |
| `the86club-workspace` | **MIGRATE → ARCHIVE** | Not yet | Latest working source snapshot is preserved in this master under `legacy/imports/the86club-workspace/v4.9.14.2/`. Keep old repo readable until Work Center extraction is verified. |
| `risin96ames` | **KEEP SEPARATE** | No | Large game/distribution project with games, workers and Android workflows. Nexo Checkpoint should absorb portal/catalog functions, not necessarily all game/build source. |
| `rok-lirte-html` | **KEEP SEPARATE FOR REVIEW** | No | Active/updated game code. Compare with Risin96Ames integrated R.O.K copy before any archive decision. |
| `camino-editorial-wix` | **KEEP** | No | Wix-connected implementation with active backend, manuscript analysis and deployment history. Remains authoritative until Camino is migrated into Nexo Group. |
| `camino-editorial-studio` | **KEEP FOR MIGRATION REVIEW** | No | Contains project/canon/schema structure not yet proven redundant with the Wix repo. Do not archive yet. |
| `wix` | **OBSOLETE/EMPTY** | **Yes** | Practically empty repo with no current Nexo function. Safe archive candidate. |

## Archive sequence

1. Archive `wix` now.
2. Finish extracting useful Work Center concepts/code from `the86club-workspace`.
3. Verify imported Work Center behavior, then archive `the86club-workspace`.
4. Compare `camino-editorial-studio` against the migrated Camino module and `camino-editorial-wix`; archive Studio only when all unique canon/project/schema content is preserved.
5. Keep `camino-editorial-wix` until the Wix site migration itself is complete.
6. Keep `risin96ames` and `rok-lirte-html` until game/platform separation is explicitly completed.

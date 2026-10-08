# OWNER UNLOCK — NEXO GROUP

Status: **ACTIVE / DENY BY DEFAULT**.

This is the global owner-controlled unlock mechanism for every subsystem marked LOCKED.

## Security model

The owner's unlock code is **never stored in the repository**.

The repository stores only:
- PBKDF2 salt: `8e77a013341ec2d5dc9ee6ee8aa7a11c`
- PBKDF2-HMAC-SHA256 iterations: `300000`
- Ed25519 public verifier key: `0652689dbe429912341a0e98e34e4872a1631e402ce03e41f889fdd974164d35`

The private signing key is derived from the owner code only at unlock time and exists only in memory.

## Unlock contract

A protected change requires a fresh `.owner-unlock-proof.json` generated with:

```bash
python scripts/owner_unlock.py generate --scope <scope>
```

The script asks for the code without echoing it and writes a signed proof valid for one hour.

CI requires that:
1. the proof file changed in the same change set;
2. the Ed25519 signature is valid;
3. the proof is still valid;
4. every required scope is present.

Never place the owner code in source, commits, PR text, issues, logs, workflow inputs, or config.

## Registered scopes

- `owner-lock-infrastructure`: lock policy, verifier and guard workflows.
- `authentication`: frozen Nexo/Rising authentication boundary.
- `camino-voice`: Nexa dictation, María reader and shared Camino speech broker.
- `centro-visual`: frozen Centro de Desarrollo visual contract. This remains partly semantic because allowed catalog data and locked geometry share one source file.

Future locks must register a scope here.

## Restore baseline

Camino voice restore branch:
`locked/camino-voice-final-2026-10-08`

Do not weaken this mechanism without a valid `owner-lock-infrastructure` proof.

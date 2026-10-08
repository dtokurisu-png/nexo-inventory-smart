#!/usr/bin/env python3
import argparse, base64, getpass, hashlib, json, secrets, sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

SALT_HEX = "8e77a013341ec2d5dc9ee6ee8aa7a11c"
ITERATIONS = 300000
PUBLIC_KEY_HEX = "0652689dbe429912341a0e98e34e4872a1631e402ce03e41f889fdd974164d35"
DEFAULT_PROOF = ".owner-unlock-proof.json"

def canonical(payload):
    return json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")

def utc(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))

def derive_private(code):
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
    seed = hashlib.pbkdf2_hmac("sha256", code.encode("utf-8"), bytes.fromhex(SALT_HEX), ITERATIONS, dklen=32)
    private = Ed25519PrivateKey.from_private_bytes(seed)
    public = private.public_key().public_bytes(serialization.Encoding.Raw, serialization.PublicFormat.Raw).hex()
    if public != PUBLIC_KEY_HEX:
        raise ValueError("INVALID_OWNER_UNLOCK_CODE")
    return private

def generate(scopes, path):
    code = getpass.getpass("Owner unlock code: ")
    private = derive_private(code)
    now = datetime.now(timezone.utc).replace(microsecond=0)
    payload = {
        "version": 1,
        "scopes": sorted(set(scopes)),
        "issuedAt": now.isoformat().replace("+00:00", "Z"),
        "expiresAt": (now + timedelta(hours=1)).isoformat().replace("+00:00", "Z"),
        "nonce": secrets.token_hex(16),
    }
    signature = base64.b64encode(private.sign(canonical(payload))).decode("ascii")
    Path(path).write_text(json.dumps({**payload, "signature": signature}, indent=2) + "\n", encoding="utf-8")
    print("Signed owner unlock proof created.")

def verify(required_scopes, path):
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
    proof = json.loads(Path(path).read_text(encoding="utf-8"))
    signature = proof.pop("signature", "")
    if set(proof) != {"version","scopes","issuedAt","expiresAt","nonce"} or proof.get("version") != 1:
        raise ValueError("INVALID_PROOF_SCHEMA")
    now = datetime.now(timezone.utc)
    issued, expires = utc(proof["issuedAt"]), utc(proof["expiresAt"])
    if issued > now + timedelta(minutes=5):
        raise ValueError("PROOF_FROM_FUTURE")
    if expires < now:
        raise ValueError("PROOF_EXPIRED")
    if expires - issued > timedelta(hours=1, minutes=1):
        raise ValueError("PROOF_WINDOW_TOO_LONG")
    missing = set(required_scopes) - set(proof.get("scopes") or [])
    if missing:
        raise ValueError("MISSING_SCOPE:" + ",".join(sorted(missing)))
    Ed25519PublicKey.from_public_bytes(bytes.fromhex(PUBLIC_KEY_HEX)).verify(
        base64.b64decode(signature), canonical(proof)
    )
    print("Owner unlock proof valid.")

def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="command", required=True)
    g = sub.add_parser("generate")
    g.add_argument("--scope", action="append", required=True)
    g.add_argument("--proof", default=DEFAULT_PROOF)
    v = sub.add_parser("verify")
    v.add_argument("--scope", action="append", required=True)
    v.add_argument("--proof", default=DEFAULT_PROOF)
    args = p.parse_args()
    try:
        generate(args.scope, args.proof) if args.command == "generate" else verify(args.scope, args.proof)
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()

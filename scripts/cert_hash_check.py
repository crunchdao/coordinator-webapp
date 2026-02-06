#!/usr/bin/env python3
"""
Check if a certificate in a zip file matches the on-chain certificate hash.

Usage:
    python cert_hash_check.py <wallet_address> <cert.zip>
    python cert_hash_check.py Z9NPRp61xGbgobniDoNg3KsxyQaPKBH8EKQ7HuXmaS5 ./scripts/cert.zip
"""

import argparse
import hashlib
import json
import sys
import zipfile
from io import BytesIO
from pathlib import Path
from urllib.request import urlopen, Request

from cryptography import x509
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat


API_BASE_URL = "https://cpi.crunchdao.io/certificates"


def _hash_tls_pubkey_from_cert(cert_pem: bytes) -> str:
    """
    Extract the public key from a certificate and hash it using SHA256.
    This matches the TypeScript implementation which hashes the DER-encoded
    public key (SPKI format), not the entire certificate.
    """
    cert = x509.load_pem_x509_certificate(cert_pem)
    pubkey_der = cert.public_key().public_bytes(
        encoding=Encoding.DER,
        format=PublicFormat.SubjectPublicKeyInfo
    )
    return hashlib.sha256(pubkey_der).hexdigest()


def extract_cert_from_zip(zip_path: Path) -> bytes:
    """Extract tls.crt from a zip file."""
    with zipfile.ZipFile(zip_path, 'r') as zf:
        # Look for tls.crt in the zip
        for name in zf.namelist():
            if name.endswith('tls.crt'):
                return zf.read(name)
        raise FileNotFoundError("tls.crt not found in zip file")


def fetch_certificate_data(wallet: str) -> dict:
    """Fetch certificate data from the API."""
    url = f"{API_BASE_URL}?wallet={wallet}"
    req = Request(url, headers={"Accept": "application/json"})
    
    with urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def main():
    parser = argparse.ArgumentParser(
        description="Check if a certificate matches the on-chain hash"
    )
    parser.add_argument("wallet", help="Coordinator wallet address")
    parser.add_argument("cert_zip", type=Path, help="Path to cert.zip file")
    parser.add_argument("--quiet", "-q", action="store_true", 
                        help="Only output result (match/mismatch)")
    
    args = parser.parse_args()
    
    # Extract and hash the certificate
    try:
        cert_bytes = extract_cert_from_zip(args.cert_zip)
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except zipfile.BadZipFile:
        print(f"Error: {args.cert_zip} is not a valid zip file", file=sys.stderr)
        sys.exit(1)
    
    local_hash = _hash_tls_pubkey_from_cert(cert_bytes)
    
    # Fetch on-chain data
    try:
        api_data = fetch_certificate_data(args.wallet)
    except Exception as e:
        print(f"Error fetching API data: {e}", file=sys.stderr)
        sys.exit(1)
    
    if not api_data:
        print(f"Error: No certificate data found for wallet {args.wallet}", file=sys.stderr)
        sys.exit(1)
    
    primary_hash = api_data.get("certHash", "")
    secondary_hash = api_data.get("certHashSecondary", "")
    
    # Compare
    matches_primary = local_hash == primary_hash
    matches_secondary = local_hash == secondary_hash
    
    if args.quiet:
        if matches_primary:
            print("MATCH (primary)")
            sys.exit(0)
        elif matches_secondary:
            print("MATCH (secondary)")
            sys.exit(0)
        else:
            print("NO MATCH")
            sys.exit(1)
    
    # Verbose output
    print("=" * 60)
    print("Certificate Hash Check")
    print("=" * 60)
    print(f"Wallet:          {args.wallet}")
    print(f"Cert ZIP:        {args.cert_zip}")
    print(f"Account:         {api_data.get('address', 'N/A')}")
    print()
    print(f"Local cert hash: {local_hash}")
    print(f"Primary hash:    {primary_hash}")
    print(f"Secondary hash:  {secondary_hash}")
    print()
    
    if matches_primary:
        print("✅ MATCH: Local certificate matches PRIMARY on-chain hash")
        sys.exit(0)
    elif matches_secondary:
        print("✅ MATCH: Local certificate matches SECONDARY on-chain hash")
        sys.exit(0)
    else:
        print("❌ NO MATCH: Local certificate does not match any on-chain hash")
        sys.exit(1)


if __name__ == '__main__':
    main()

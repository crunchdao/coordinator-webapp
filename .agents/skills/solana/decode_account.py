#!/usr/bin/env python3
"""
Decode Solana account data from base64.

Usage:
    # Decode from base64 data directly
    python decode_account.py --data "<BASE64>" --fields "disc:8,pubkey:32,value:u64"
    
    # Fetch and decode from address
    python decode_account.py --address "<ADDRESS>" --cluster devnet --fields "disc:8,owner:pubkey,amount:u64"

Field types:
    N       - N raw bytes (output as hex)
    u8      - Unsigned 8-bit integer
    u16     - Unsigned 16-bit integer (little-endian)
    u32     - Unsigned 32-bit integer (little-endian)  
    u64     - Unsigned 64-bit integer (little-endian)
    i64     - Signed 64-bit integer (little-endian)
    i128    - Signed 128-bit integer (little-endian)
    u128    - Unsigned 128-bit integer (little-endian)
    pubkey  - 32-byte Solana public key (base58 output)
    bool    - 1-byte boolean
    string  - Borsh string (4-byte length + UTF-8)
    option:T - Optional type (1-byte flag + T if present)
"""

import argparse
import base64
import struct
import json
import sys
from typing import Any
from urllib.request import urlopen, Request

# Base58 alphabet for Solana addresses
BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'


def base58_encode(data: bytes) -> str:
    """Encode bytes to base58 string."""
    num = int.from_bytes(data, 'big')
    if num == 0:
        return BASE58_ALPHABET[0] * len(data)
    
    result = []
    while num > 0:
        num, remainder = divmod(num, 58)
        result.append(BASE58_ALPHABET[remainder])
    
    # Handle leading zeros
    for byte in data:
        if byte == 0:
            result.append(BASE58_ALPHABET[0])
        else:
            break
    
    return ''.join(reversed(result))


def fetch_account_data(address: str, cluster: str = "devnet") -> bytes:
    """Fetch account data from Solana RPC."""
    rpc_urls = {
        "mainnet": "https://api.mainnet-beta.solana.com",
        "devnet": "https://api.devnet.solana.com",
        "testnet": "https://api.testnet.solana.com",
    }
    
    url = rpc_urls.get(cluster, cluster)  # Allow custom URLs
    
    payload = json.dumps({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getAccountInfo",
        "params": [address, {"encoding": "base64"}]
    }).encode()
    
    req = Request(url, data=payload, headers={"Content-Type": "application/json"})
    
    with urlopen(req, timeout=30) as resp:
        result = json.loads(resp.read())
    
    if "error" in result:
        raise Exception(f"RPC error: {result['error']}")
    
    value = result.get("result", {}).get("value")
    if not value:
        raise Exception(f"Account not found: {address}")
    
    data_b64 = value["data"][0]
    return base64.b64decode(data_b64)


def parse_field(data: bytes, offset: int, field_type: str) -> tuple[Any, int]:
    """Parse a single field from data at offset. Returns (value, bytes_consumed)."""
    
    # Handle option types
    if field_type.startswith("option:"):
        inner_type = field_type[7:]
        is_some = data[offset]
        if is_some == 0:
            return None, 1
        else:
            value, consumed = parse_field(data, offset + 1, inner_type)
            return value, 1 + consumed
    
    # Raw bytes (just a number means N bytes)
    if field_type.isdigit():
        n = int(field_type)
        return data[offset:offset + n].hex(), n
    
    # Integer types
    if field_type == "u8":
        return data[offset], 1
    elif field_type == "u16":
        return struct.unpack_from('<H', data, offset)[0], 2
    elif field_type == "u32":
        return struct.unpack_from('<I', data, offset)[0], 4
    elif field_type == "u64":
        return struct.unpack_from('<Q', data, offset)[0], 8
    elif field_type == "i64":
        return struct.unpack_from('<q', data, offset)[0], 8
    elif field_type == "u128":
        low = struct.unpack_from('<Q', data, offset)[0]
        high = struct.unpack_from('<Q', data, offset + 8)[0]
        return (high << 64) | low, 16
    elif field_type == "i128":
        low = struct.unpack_from('<Q', data, offset)[0]
        high = struct.unpack_from('<q', data, offset + 8)[0]
        return (high << 64) | low, 16
    
    # Pubkey (32 bytes, base58 encoded)
    elif field_type == "pubkey":
        pubkey_bytes = data[offset:offset + 32]
        return base58_encode(pubkey_bytes), 32
    
    # Boolean
    elif field_type == "bool":
        return data[offset] != 0, 1
    
    # Borsh string (4-byte length prefix)
    elif field_type == "string":
        length = struct.unpack_from('<I', data, offset)[0]
        string_data = data[offset + 4:offset + 4 + length]
        return string_data.decode('utf-8'), 4 + length
    
    # Vector (4-byte length + elements) - basic support for u8 vectors
    elif field_type == "vec:u8":
        length = struct.unpack_from('<I', data, offset)[0]
        vec_data = data[offset + 4:offset + 4 + length]
        return vec_data.hex(), 4 + length
    
    else:
        raise ValueError(f"Unknown field type: {field_type}")


def decode_account(data: bytes, fields_spec: str) -> dict:
    """
    Decode account data according to field specification.
    
    fields_spec format: "name1:type1,name2:type2,..."
    Example: "discriminator:8,owner:pubkey,amount:u64,bump:u8"
    """
    result = {}
    offset = 0
    
    for field in fields_spec.split(','):
        field = field.strip()
        if not field:
            continue
            
        if ':' not in field:
            raise ValueError(f"Invalid field spec '{field}', expected 'name:type'")
        
        name, field_type = field.split(':', 1)
        name = name.strip()
        field_type = field_type.strip()
        
        if offset >= len(data):
            result[name] = f"<EOF at offset {offset}>"
            break
        
        try:
            value, consumed = parse_field(data, offset, field_type)
            result[name] = value
            offset += consumed
        except Exception as e:
            result[name] = f"<Error: {e}>"
            break
    
    result["_bytes_consumed"] = offset
    result["_total_bytes"] = len(data)
    
    return result


def main():
    parser = argparse.ArgumentParser(description="Decode Solana account data")
    parser.add_argument("--data", "-d", help="Base64-encoded account data")
    parser.add_argument("--address", "-a", help="Solana account address to fetch")
    parser.add_argument("--cluster", "-c", default="devnet", 
                        help="Cluster: mainnet, devnet, testnet, or RPC URL")
    parser.add_argument("--fields", "-f", required=True,
                        help="Field specification: 'name:type,name:type,...'")
    parser.add_argument("--json", "-j", action="store_true", help="Output as JSON")
    
    args = parser.parse_args()
    
    if not args.data and not args.address:
        parser.error("Either --data or --address is required")
    
    # Get the data
    if args.data:
        data = base64.b64decode(args.data)
    else:
        data = fetch_account_data(args.address, args.cluster)
    
    # Decode
    result = decode_account(data, args.fields)
    
    # Output
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        for key, value in result.items():
            if not key.startswith('_'):
                print(f"{key}: {value}")
        print(f"\n({result['_bytes_consumed']}/{result['_total_bytes']} bytes decoded)")


if __name__ == "__main__":
    main()

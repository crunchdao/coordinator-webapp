---
name: solana
description: "Query Solana blockchain data via RPC. Fetch account info, decode Anchor accounts, check balances, get transactions. Use CLI tools (curl, jq) instead of browser explorers."
---

# Solana Skill

Query Solana blockchain data directly via RPC endpoints. **Always use CLI tools instead of browser explorers.**

## RPC Endpoints

| Cluster | URL |
|---------|-----|
| Mainnet | `https://api.mainnet-beta.solana.com` |
| Devnet | `https://api.devnet.solana.com` |
| Testnet | `https://api.testnet.solana.com` |

## Common Operations

### Get Account Info (base64)

```bash
curl -s https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0", "id": 1,
  "method": "getAccountInfo",
  "params": ["<ADDRESS>", {"encoding": "base64"}]
}' | jq .
```

### Get Account Info (parsed JSON, for token accounts)

```bash
curl -s https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0", "id": 1,
  "method": "getAccountInfo",
  "params": ["<ADDRESS>", {"encoding": "jsonParsed"}]
}' | jq .
```

### Get SOL Balance

```bash
curl -s https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0", "id": 1,
  "method": "getBalance",
  "params": ["<ADDRESS>"]
}' | jq '.result.value / 1e9'
```

### Get Recent Transactions

```bash
curl -s https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0", "id": 1,
  "method": "getSignaturesForAddress",
  "params": ["<ADDRESS>", {"limit": 10}]
}' | jq '.result[] | {signature, slot, blockTime, err}'
```

### Get Transaction Details

```bash
curl -s https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0", "id": 1,
  "method": "getTransaction",
  "params": ["<SIGNATURE>", {"encoding": "jsonParsed", "maxSupportedTransactionVersion": 0}]
}' | jq .
```

### Get Slot / Block Height

```bash
curl -s https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0", "id": 1,
  "method": "getSlot"
}' | jq .result
```

### Get Multiple Accounts

```bash
curl -s https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0", "id": 1,
  "method": "getMultipleAccounts",
  "params": [["<ADDR1>", "<ADDR2>"], {"encoding": "base64"}]
}' | jq .
```

## Decoding Anchor Accounts

Use the helper script to decode base64 account data:

```bash
# Decode raw account data with field definitions
python3 .pi/skills/solana/decode_account.py \
  --data "<BASE64_DATA>" \
  --fields "discriminator:8,pubkey:32,hash:32,timestamp:i64,bump:u8"
```

Or fetch and decode in one step:

```bash
python3 .pi/skills/solana/decode_account.py \
  --address "<ADDRESS>" \
  --cluster devnet \
  --fields "discriminator:8,coordinator:32,cert_hash:32,cert_hash_secondary:32,primary_updated_at:i64,secondary_updated_at:i64,bump:u8"
```

### Field Types

| Type | Description |
|------|-------------|
| `N` | N raw bytes, output as hex |
| `u8` | Unsigned 8-bit integer |
| `u16` | Unsigned 16-bit integer (little-endian) |
| `u32` | Unsigned 32-bit integer (little-endian) |
| `u64` | Unsigned 64-bit integer (little-endian) |
| `i64` | Signed 64-bit integer (little-endian) |
| `pubkey` | 32-byte public key (base58 encoded) |
| `bool` | 1-byte boolean |
| `string` | Borsh string (4-byte length prefix + UTF-8 data) |

## Quick One-Liner: Fetch + Decode

```bash
curl -s https://api.devnet.solana.com -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getAccountInfo","params":["<ADDRESS>",{"encoding":"base64"}]}' \
  | jq -r '.result.value.data[0]' \
  | python3 -c "
import base64, struct, sys
data = base64.b64decode(sys.stdin.read())
# Customize field extraction here
print('Discriminator:', data[:8].hex())
print('Field 1 (32 bytes):', data[8:40].hex())
print('Field 2 (i64):', struct.unpack('<q', data[40:48])[0])
"
```

## Program Derived Addresses (PDAs)

To find a PDA, use the Solana CLI or compute it:

```bash
# If solana CLI is installed
solana find-program-derived-address <PROGRAM_ID> --seeds "seed1" "seed2"
```

Or compute in Python:
```python
from solders.pubkey import Pubkey
program_id = Pubkey.from_string("<PROGRAM_ID>")
pda, bump = Pubkey.find_program_address([b"seed1", b"seed2"], program_id)
print(f"PDA: {pda}, Bump: {bump}")
```

## Token Accounts

Get all token accounts for a wallet:

```bash
curl -s https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0", "id": 1,
  "method": "getTokenAccountsByOwner",
  "params": ["<WALLET>", {"programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"}, {"encoding": "jsonParsed"}]
}' | jq '.result.value[] | {pubkey, mint: .account.data.parsed.info.mint, amount: .account.data.parsed.info.tokenAmount.uiAmount}'
```

## Tips

1. **Always use CLI over browser** - faster, scriptable, no cookie dialogs
2. **Use `jq` for filtering** - extract just what you need
3. **Check cluster** - devnet/testnet/mainnet have different data
4. **Rate limits** - public RPCs have limits; use paid RPC for heavy usage
5. **Base58 vs Hex** - Solana addresses are base58; account data is often hex/base64

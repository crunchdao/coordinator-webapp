---
"@crunchdao/coordinator-webapp": minor
---

- Add multisig support:

  - Global Setting: Configure multisig address in Settings page
  - Automatic Routing: When multisig is set, all transactions become multisig proposals
  - Authority Resolution: useEffectiveAuthority hook returns vault PDA in multisig mode, wallet otherwise
  - Data Queries: Coordinator/crunch queries use the effective authority (vault in multisig mode)
  - Visual Indicator: "Multisig" badge and vault address shown in wallet dropdown

- Fund & Start Crunch
- Fund Crunch Dialog: Deposit USDC to crunch reward vault with amount input, max button, and balance display
- Start Crunch Dialog: Confirmation dialog to activate a crunch
- Vault Balance: Each crunch card now shows the current reward vault balance

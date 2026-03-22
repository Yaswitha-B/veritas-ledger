# Veritas Ledger

> Prove a file existed at a certain time and has not been altered since.

---

## Architecture

```
Client (React/Vite)
  │
  ├── hashFile / hashText  ──►  Backend (Express)
  │                                 └── SHA-256 + HMAC sign
  │
  ├── verifySignature       ──►  Backend (validates HMAC)
  │
  ├── generateId            ──►  keccak256(hash)  [client-side, deterministic]
  │
  └── contract.store(id, hash, label)  ──►  MetaMask  ──►  Blockchain (Ganache / Sepolia)
```

**Security chain:** Every hash is HMAC-signed by the backend. The client verifies
the signature before sending any transaction. An attacker who intercepts and modifies
the hash in transit will produce a signature mismatch and the transaction is aborted.

---

## Quick Start

### 1 — Blockchain

```bash
# Start Ganache on port 7545 (or update truffle-config.js)
cd blockchain
npm install
npx truffle migrate --reset
# Note the Certificate contract address printed in the output
```

### 2 — Backend

```bash
cd backend
cp .env.example .env
# Edit .env:
#   PORT=5000
#   HASH_SECRET=<64-char random hex — run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
#   ALLOWED_ORIGIN=http://localhost:5173
npm install
npm run dev
```

### 3 — Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env:
#   VITE_API_BASE_URL=http://localhost:5000
#   VITE_CONTRACT_ADDRESS=<address from step 1>
npm install
npm run dev
# Open http://localhost:5173
```

---

## Pages

| Route        | Purpose |
|--------------|---------|
| `/`          | Upload a file, certify it on-chain, receive Certificate ID |
| `/verify`    | Re-upload a file + Certificate ID to check integrity |
| `/realtime`  | Capture video / audio / text and certify the capture |

---

## What V1 proves

- **Integrity** — the file has not been modified since certification.
- **Existence** — the file existed no later than the block timestamp.

## What V1 does NOT prove

- **Authenticity** — whether the content is genuine or staged.
- **Location** — GPS/IP can be spoofed.


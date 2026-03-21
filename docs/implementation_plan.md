# Veritas Ledger – Implementation Plan (v1.0)

---

## 1. Project Philosophy & Design Principles

* **DRY (Don't Repeat Yourself):**
  All Blockchain and IPFS logic will be abstracted into dedicated service files.

* **Orthogonality:**
  The frontend does not depend on how the backend stores files.
  The backend does not depend on which blockchain is used.

* **ETC (Easy To Change):**
  Configuration is centralized using `.env` and config files. No hardcoding.

* **Privacy-First:**
  Metadata scrubbing is mandatory before any data reaches public networks.

---

## 2. Top-Level Directory Structure

```plaintext
/veritas-ledger
├── /blockchain             // Smart Contract Environment (Truffle)
│   ├── /contracts          // Veritas.sol
│   ├── /migrations         // Deployment Scripts
│   └── truffle-config.js   // Network Configuration
├── /backend                // Node.js/Express API
│   ├── /config             // Env variables & DB connections
│   ├── /middleware         // Metadata Scrubbing & Auth
│   ├── /models             // MongoDB Schemas
│   ├── /routes             // Endpoint Definitions (The "What")
│   ├── /services           // Business Logic (IPFS/Blockchain)
│   └── server.js           // Entry Point
├── /frontend               // React/Vite Application
│   ├── /src
│   │   ├── /api            // Axios instances for Backend
│   │   ├── /hooks          // Web3 & Wallet Logic
│   │   └── /components     // UI Modules
└── /docs                   // Dev Journal & Research
```

---

## 3. Step 1: Foundation & Environment Setup

### Blockchain

* Initialize Truffle
* Configure `truffle-config.js` to connect to Ganache (port 7545)

### Backend

* Initialize Node project
* Install dependencies:

  * `express`
  * `mongoose`
  * `ipfs-http-client`
  * `exiftool-vendored`
  * `web3`

### Frontend

* Scaffold using Vite + React
* Install:

  * `ethers.js` or `web3.js`

### Environment Setup

* Create `.env` files for:

  * API keys (IPFS provider)
  * MongoDB URI
  * Blockchain RPC URL
  * Contract address

---

## 4. Step 2: Core Logic (Contracts & Database)

### Smart Contract

* Implement `Veritas.sol`
* Map:

  ```solidity
  EventID => Evidence[]
  ```

### Database Schema

* **Events Collection**

  * name
  * description
  * tags
  * timestamp

* **Evidence Collection**

  * eventId
  * ipfsCID
  * walletAddress
  * timestamp
  * zoneId

### Deployment

* Deploy contract to Ganache
* Extract and store ABI for backend usage

---

## 5. Step 3: Backend Services & API (Bridge Layer)

### Middleware

* **Metadata Scrubber**

  * Removes EXIF data before storage

---

### Services

* **IPFS Service**

  * Handles file uploads to Pinata / Infura
  * Returns CID

* **Blockchain Service**

  * Reads and writes to smart contract
  * Abstracted from route handlers

---

### API Endpoints

#### POST `/api/evidence/upload`

* Accept file
* Scrub metadata
* Upload to IPFS
* Store reference in DB
* Return CID

---

#### GET `/api/events`

* Fetch curated event list
* Used for frontend feed

---

## 6. Step 4: Frontend Development (Interface Layer)

### Wallet Integration

* Custom hook for MetaMask connection
* Handles account + network state

---

### Submission Flow

1. User uploads file
2. Backend processes and returns IPFS CID
3. Frontend triggers MetaMask transaction:

   * calls `submitEvidence` on contract

---

### Verification Module

* Drag-and-drop file upload
* Hash file locally
* Query blockchain for match
* Display result:

  * Verified / Not Found

---

## 7. Future Scope & Edge Cases

* [ ] Zero-Knowledge Proofs for precise location masking
* [ ] Gas optimization for public network deployment
* [ ] Decentralized pinning strategies (to ensure IPFS persistence)
* [ ] Protection against coordinated spam submissions
* [ ] Rate limiting / economic deterrents beyond gas


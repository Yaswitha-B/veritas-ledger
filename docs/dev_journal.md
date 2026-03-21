# Veritas Ledger – Dev Journal

*Veritas = “truth” in Latin. Not claiming truth, just preserving what existed.*

---

## 1. What am I even building?

At a high level, this is about recording digital evidence of real-world events in a way that:

* can’t be altered later
* proves it existed at a certain time
* doesn’t rely on a central authority

### The Mission

I am not proving *truth*.
I am proving **data integrity**.

> “This data existed at this time and hasn’t been changed by a single bit since.”

---

## 2. The Problem

Current evidence systems (social media, private databases) are fragile.

* content can be deleted
* timelines can be manipulated
* access is controlled by centralized entities

When the same entity that stores the data also controls it, trust becomes conditional.

---

## 3. The Solution: Multi-Layer Trust

The idea is simple:

> the moment something happens, its existence is anchored to an immutable system

Instead of trusting platforms, we rely on:

* cryptographic hashing
* decentralized storage
* public verification

---

### The Unique Angle: Multi-Witness Corroboration

A single upload proves very little.

But:

> if multiple independent users (wallets) submit different evidence for the same event within the same time window and region, confidence increases significantly

The system does not verify truth.

It reveals patterns that are hard to fake at scale.

---

## 4. Technical Architecture (Dual-Layer)

To balance usability and immutability, the system is split:

### Public Face (MongoDB)

* searchable
* curated
* fast

Only approved / safe content is shown here.

---

### Root of Truth (Blockchain + IPFS)

* immutable
* uncensored
* permanent

Every submission exists here, regardless of visibility in the public UI.

Even if the public layer is censored, the underlying data remains accessible.

---

## 5. Privacy & Safety (Zero-Footprint Approach)

The system avoids collecting sensitive data by design.

### Pseudonymous Identity

* users interact via wallet addresses
* no emails, names, or accounts required

---

### Metadata Scrubbing

* EXIF data (device info, exact GPS, etc.) is removed before storage
* prevents traceability through file metadata

---

### Fuzzy Location (Zone-Based)

* precise GPS is NOT stored
* location is converted into a coarse “Zone ID”

This allows:

* event clustering
* without exposing exact user location

---

### K-Anonymity

Users are indistinguishable within a group (zone), reducing risk of identification.

---

## 6. Storage Decisions

### On-Chain (Blockchain)

* IPFS CID (hash)
* timestamp
* wallet address
* zone ID

---

### Off-Chain (IPFS)

* actual media files

Decentralized storage ensures:

* no single point of deletion
* persistence beyond the platform

---

### Index Layer (MongoDB)

* event names
* tags
* approval status
* search functionality

---

## 7. Tech Stack

* Solidity → smart contracts
* Ganache → local blockchain (development)
* IPFS (Pinata / Infura) → storage
* Express → backend
* MongoDB → indexing
* React → frontend

---

## 8. Logic Breakdown

### Evidence Structure

```solidity
struct Evidence {
    string ipfsHash;      // content identifier
    address submitter;    // wallet address
    uint256 timestamp;
    string zoneId;        // coarse location
}

mapping(uint256 => Evidence[]) public eventEvidence;
```

Each event aggregates multiple independent submissions.

---

## 9. Key Challenges & Scope

### What this system does NOT do:

* verify truth
* validate authenticity
* prevent misinformation

---

### Known risks:

* spam submissions
* misleading or staged content
* wallet traceability outside system
* IP-level tracking (outside current scope)

---

### Practical limitations:

* blockchain ≠ legal admissibility
* anonymity ≠ guaranteed safety

---

## 10. Summary: What makes this different?

Existing systems:

* secure evidence after collection

Veritas Ledger:

> captures the existence of evidence at the moment it is created

It enables:

* real-time logging
* decentralized participation
* tamper-proof verification

---

## 11. Competitive Landscape: Why Veritas?

There are already systems working on blockchain-based evidence management, but they are built for very different environments.

### A. Institutional Systems (e.g., B-DEMS)

**What they are:**
Private, permissioned systems used by law enforcement.

**Limitation:**
Access is restricted. Evidence only enters the system *after* authorities are involved.

**Veritas Difference:**
Veritas is **public-first**.
It allows evidence to be recorded *before* institutions step in.

---

### B. IoT Forensic Systems

**What they are:**
Systems that collect data automatically from devices like CCTV, drones, or sensors.

**Limitation:**
They depend on infrastructure owned by organizations that may control or restrict access.

**Veritas Difference:**
Veritas is **user-driven**.
It relies on personal devices, not institutional hardware.

---

### C. Enterprise Evidence Platforms (e.g., Axon, Cellebrite)

**What they are:**
Centralized cloud platforms used by law enforcement agencies.

**Limitation:**

* controlled by a single entity
* subject to legal and administrative influence
* expensive and not publicly accessible

**Veritas Difference:**
Veritas is **decentralized and publicly verifiable**.
Once data is anchored, it cannot be selectively removed by any single authority.

---

## 12. Why Public Chain (Ganache → Testnet)

I explored permissioned systems like Hyperledger Fabric.

However, for this use case:

* requiring permission defeats the goal of open participation
* centralized control weakens immutability guarantees

For the prototype:

> Ganache is used for local development

For real deployment:

> a public testnet or network is more aligned with the system’s goals

Key reasons:

* **permissionless entry** → anyone can contribute
* **independent verification** → no reliance on the platform
* **stronger immutability guarantees**

---

## Final Position

This system does not replace institutions.

It provides something they currently lack:

> a public, tamper-resistant record of evidence at the moment it is created


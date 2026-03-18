# Veritas Ledger – Dev Journal
*Veritas = “truth” in Latin. Not claiming truth, just preserving what existed.*

## STEP 1: What exactly am I doing?

### What am I even building?

At a high level, this is about recording **digital evidence of real-world events** in a way that:

- can’t be altered later  
- proves it existed at a certain time  
- doesn’t rely on trusting one authority  

I am NOT proving truth.

I am proving:

> “this data existed at this time and hasn’t been changed since.”

---

## 1. The Problem

Right now, evidence lives in places like:
- social media (can be deleted, buried, or manipulated)
- private databases (controlled, not transparent)

Even if something real happens and people record it, there’s no reliable way to prove:
- when it was first captured  
- whether it was modified later  

Everything depends on trust. And trust breaks.

---

## 2. Existing Solutions (and where they fall short)

There are already systems using:
- blockchain (for hashes + timestamps)
- IPFS (for storage)
- smart contracts (for control flow)

Examples:
- B-DEMS  
- IoT forensic systems  
- mobile evidence frameworks  

They’re solid, but:

- built for institutions  
- used AFTER evidence is collected  
- not meant for random people in real-time  

### The gap I care about:

> normal people can’t easily log evidence in a tamper-proof way the moment something happens

---

## 3. My Approach

Not trying to reinvent everything.

Just:

> user submits data → hash it → store hash on blockchain

If the data changes later → hash won’t match → caught.

Also:
- multiple people can submit for the same event  

---

## 4. Target Users

- witnesses  
- victims  
- journalists  
- anyone who just… saw something happen  

No strict identity system for now.

---

## 5. Types of Evidence

Only digital:

- images  
- videos  
- text  
- metadata (time, location)

Important:
- files are NOT going on-chain  
- only hashes  

---

## 6. Scope (what I am NOT doing)

Let’s not get carried away:

- not verifying truth  
- not solving crime  
- not building a legal system  
- not touching physical evidence  

This is just:
> integrity + timestamping

---

## 6.5 Identity & Anonymity (important)

Users interact using wallet addresses (pseudonymous by default).

This means:
- no real identity required to submit evidence  
- users are not directly identifiable through the system  

Why this matters:
- people won’t contribute if it puts them at risk  
- lowering identity friction increases participation  

Trade-off:
- anonymity makes misuse easier  
- system does not guarantee credibility of the source  

For now:
> identity reveal, if needed, happens off-chain and is fully user-controlled  

---

## 7. Storage Decisions (quick and clear)

On-chain:
- hash  
- timestamp  
- wallet  
- eventId  

Off-chain:
- actual files  

For now:
> database storage is enough  

---

## 8. Event & Evidence System (Basic Idea)

Users can:
- create an event  
- or add evidence to an existing one  

### Event:
- name  
- description  
- location (optional)  
- timestamp  
- list of submissions  

### Evidence:
- hash  
- eventId  
- wallet address  
- timestamp  
- file reference (from DB)

DB handles:
- search  
- grouping  
- retrieval  

Blockchain handles:
- “this wasn’t changed”

---

## 9. Public vs Private Blockchain

Options exist:

- public → slow, costly, overkill  
- permissioned → controlled, faster  

For this:
> using Ganache (local blockchain)

Reason:
- easy  
- free  
- enough to demonstrate the idea  

---

## 10. Consensus 

Options:
- PoW → heavy, slow  
- PoS → efficient  
- PBFT → fast, permissioned systems  

For this project:
> Ganache handles it internally  

If I had to justify:
> PoS / PBFT makes more sense (faster, practical)

---

## 11. Tech Stack (current plan)

- Solidity → contract  
- Ganache → blockchain  
- MetaMask → wallet  
- Web3.js → connect things  
- Express → backend  
- MongoDB → database  
- Frontend → simple (React or basic UI)

---

## 12. Key Challenges

From research + common sense:

- legal validity → blockchain ≠ court approval  
- fake submissions → biggest unresolved issue  

This system can be abused. Not solving that here.

---

## 13. What makes this different

Existing systems:
- secure evidence AFTER collection  

This:
> records evidence existence at the moment it happens  

Also:
- allows multiple independent submissions  
- doesn’t rely on a single authority  
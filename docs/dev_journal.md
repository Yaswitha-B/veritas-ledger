# Veritas Ledger – Dev Journal  

---

## 21 March 2026

### What am I even building?

I thought I was building some big “truth system”.

For now, let's simplify:

> a way to prove a file existed at a certain time and hasn’t been changed since.

---

### The core idea (finally clear)

Someone has a file (image, video, doc, whatever).

They upload it.

System does:

* hash the file  
* store hash + timestamp + maybe zone (by user)  

Returns:

* some ID (maybe like a "veritas ledger certified)  

Later:

* file is uploaded again with ID  
* hash is recomputed  
* compared  

If same → unchanged  
If different → tampered  

Simple. Clean. Enough.

---

### Maybe at some version I can try this

The interesting part is this scenario:

Multiple independent people witness something.

They all:

* capture evidence  
* hash it  
* anchor it around the same time  

Later:

* these independent proofs exist  

Individually weak.  
Together harder to fake.

---

### Where I almost overengineered everything

At some point I had:

* blockchain  
* IPFS  
* MongoDB  
* event system  
* clustering  
* metadata handling  
* privacy layers  

All at once.

Which is… a lot for something that doesn’t even have a working v1 yet.

So current stance:

> if it doesn’t help hash → store → verify, it’s not v1

---

### Current v1 plan

Flow:

1. user uploads file  
2. backend:  
   * hash file  
   * optionally scrub metadata  
3. store:  
   * hash  
   * timestamp  
   * zone (if provided)  
4. return ID  

Verification:

1. upload file + ID  
2. hash again  
3. compare with stored hash  

Done.

No drama.

---

### Storage decisions (still thinking but keeping it sane)

* Blockchain → for timestamp + immutability  
* IPFS → for file storage (optional but useful for later plans)  
* DB → only if needed for lookup / UX  

Important:

> My system is not storage.

It just anchors references.

---

### “Real-time” idea (the fun part)

I wanted:

* live recording / capture evidence  
* continuous hashing  
* direct blockchain anchoring  

so that someone can claim "It is created at that moment of time so it is not tampered", if thats even possible (further research required)

This is what a "real-time certificate claims"

"upload certificate" from v1, can be used to say, "After that point of time, this evidence hasnt been tampered. Its still the same file."

---

### What do I mean by certificate?

Gotta work on this more but something like:

"id" saying this file is created at this point in time with this data.  

Later that id and that 'file' are used to verify in veritas.

---

### Threat model (forced myself to think about this)

Protects against:

* file tampering after upload  
* timeline manipulation  

Does NOT protect against:

* staged events  
* coordinated fake uploads  
* pre-edited content  

So basically:

> integrity yes, authenticity no

---

## 22 March 2026

### Timestamp & Location Integrity Problem

timestamp integrity problem and live location problem:

what if someone changes their phone default time or location settings, or turns on a VPN?

they can fake proof.

---

### What is Separation of Concerns

Separation of concerns means dividing the system so each part handles a distinct responsibility and can change independently. Instead of splitting by actions, it focuses on what logically belongs together and what evolves separately.

---

### How it is applied here

The system is centered around one core concern: evidence (create + verify). Upload and realtime are not separate domains, but different input methods for the same concern. So they are treated as adapters, while the core logic (hashing, anchoring, verification) remains shared and stable. Routes handle API, services handle logic, core handles hashing, and blockchain is isolated as an external dependency.

---

### Flow

Upload:

file → hash → generate certificateId → store(id → hash + blockTimestamp + claimedTime + name + description)

Verify:

file → hash → fetch(id → storedHash + blockTimestamp + claimedTime + name + description) → compare
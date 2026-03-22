const {
  anchorProof: anchorOnChain,
  verifyProof: verifyOnChain
} = require("../blockchain/proofProvider");

// anchor evidence
async function createEvidence(hash) {
  await anchorOnChain(hash);

  return {
    evidenceId: hash
  };
}

// verify evidence
async function verifyEvidence(hash) {
  const exists = await verifyOnChain(hash);

  return {
    evidenceId: hash,
    exists
  };
}

module.exports = {
  createEvidence,
  verifyEvidence
};
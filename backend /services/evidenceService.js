const crypto = require("crypto");
const { storeRecord, getRecord } = require("../blockchain/proofProvider");

function generateId(hash) {
  return crypto
    .createHash("sha256")
    .update(hash + Date.now())
    .digest("hex");
}

async function createEvidence(hash, claimedTime, name, description) {
  const id = generateId(hash);

  await storeRecord(id, hash, claimedTime, name, description);

  return {
    certificateId: id,
    fileHash: hash
  };
}

async function verifyEvidence(id, hash) {
  const record = await getRecord(id);

  const isValid = record.fileHash === hash;

  return {
    certificateId: id,
    isValid,
    blockTimestamp: record.blockTimestamp,
    claimedTime: record.claimedTime,
    name: record.name,
    description: record.description
  };
}

module.exports = {
  createEvidence,
  verifyEvidence
};
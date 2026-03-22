const { hashFile } = require("../core/hasher");
const { createEvidence } = require("./evidenceService");

async function handleUpload(fileBuffer, claimedTime, name, description) {
  const hash = hashFile(fileBuffer);

  return await createEvidence(hash, claimedTime, name, description);
}

module.exports = { handleUpload };
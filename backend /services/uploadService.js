const { hashFile } = require("../core/hasher");
const { createEvidence } = require("./evidenceService");

// handles file → hash → evidence
async function handleUpload(fileBuffer) {
  const hash = hashFile(fileBuffer);

  return await createEvidence(hash);
}

module.exports = {
  handleUpload
};
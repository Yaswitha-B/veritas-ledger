const express = require("express");
const multer = require("multer");

const { handleUpload } = require("../services/uploadService");
const { verifyEvidence } = require("../services/evidenceService");
const { hashFile } = require("../core/hasher");

const router = express.Router();
const upload = multer();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { name, description, claimedTime } = req.body;

    const result = await handleUpload(
      req.file.buffer,
      claimedTime,
      name,
      description
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/verify", upload.single("file"), async (req, res) => {
  try {
    const { certificateId } = req.body;
    const hash = hashFile(req.file.buffer);

    const result = await verifyEvidence(certificateId, hash);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
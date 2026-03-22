const express = require("express");
const multer = require("multer");

const { handleUpload } = require("../services/uploadService");
const { verifyEvidence } = require("../services/evidenceService");
const { hashFile } = require("../core/hasher");

const router = express.Router();
const upload = multer();

// upload → create evidence
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await handleUpload(req.file.buffer);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// verify → check evidence
router.post("/verify", upload.single("file"), async (req, res) => {
  try {
    const hash = hashFile(req.file.buffer);
    const result = await verifyEvidence(hash);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
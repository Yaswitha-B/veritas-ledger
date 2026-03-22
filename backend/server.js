require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { hashBuffer, hashText } = require("./hasher");
const { signHash, verifyHash } = require("./signer");

const app = express();
const upload = multer({ limits: { fileSize: 100 * 1024 * 1024 } }); // 100 MB

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.post("/hash", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const hash = hashBuffer(req.file.buffer);
    const signature = signHash(hash);
    res.json({ hash, signature });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/hash-text", (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "No text provided" });
    }
    const hash = hashText(text.trim());
    const signature = signHash(hash);
    res.json({ hash, signature });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/verify-signature", (req, res) => {
  try {
    const { hash, signature } = req.body;
    if (!hash || !signature) {
      return res.status(400).json({ error: "hash and signature are required" });
    }
    const valid = verifyHash(hash, signature);
    res.json({ valid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Veritas backend running on :${PORT}`));
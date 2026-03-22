const crypto = require("crypto");

function hashBuffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function hashText(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

module.exports = { hashBuffer, hashText };
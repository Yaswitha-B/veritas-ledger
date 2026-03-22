const crypto = require("crypto");

function secret() {
  const s = process.env.HASH_SECRET;
  if (!s) throw new Error("HASH_SECRET env var is not set");
  return s;
}

function signHash(hash) {
  return crypto.createHmac("sha256", secret()).update(hash).digest("hex");
}

function verifyHash(hash, signature) {
  try {
    const expected = signHash(hash);
    const expBuf = Buffer.from(expected, "hex");
    const sigBuf = Buffer.from(signature, "hex");
    if (expBuf.length !== sigBuf.length) return false;
    return crypto.timingSafeEqual(expBuf, sigBuf);
  } catch {
    return false;
  }
}

module.exports = { signHash, verifyHash };
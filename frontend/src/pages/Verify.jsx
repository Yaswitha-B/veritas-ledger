import { useState } from "react";
import FilePicker from "../components/FilePicker";
import Button from "../components/Button";
import CertificateCard from "../components/CertificateCard";
import { hashFile, verifySignature } from "../services/hash_service";
import { getContract } from "../services/contract_service";
import { formatTimestamp } from "../utils/format";

export default function Verify() {
  const [file,   setFile]   = useState(null);
  const [id,     setId]     = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState("");

  const handleVerify = async () => {
    if (!file || !id.trim()) return;
    setStatus("loading");
    setError("");

    try {
      // 1 — Recompute hash on backend
      const { hash, signature } = await hashFile(file);

      // 2 — Integrity check before comparing with blockchain
      const valid = await verifySignature(hash, signature);
      if (!valid) {
        throw new Error("Hash integrity check failed.");
      }

      // 3 — Read stored record (read-only, no MetaMask transaction needed)
      const contract = await getContract(false);
      const record = await contract.get(id.trim());

      const isMatch =
        record.fileHash.toLowerCase() === hash.toLowerCase();

      setResult({
        isMatch,
        computedHash: hash,
        storedHash:   record.fileHash,
        timestamp:    formatTimestamp(record.timestamp),
        owner:        record.owner,
        label:        record.label,
      });
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Verify Integrity</h1>
        <p className="subtitle">
          Check whether a file matches its blockchain certificate.
        </p>
      </div>

      <div className="card">
        <FilePicker onSelect={setFile} selected={file} />

        <div className="field">
          <label>Certificate ID</label>
          <input
            type="text"
            placeholder="0x…"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        <Button
          onClick={handleVerify}
          disabled={!file || !id.trim()}
          loading={status === "loading"}
        >
          Verify File
        </Button>
      </div>

      {status === "success" && result && (
        <CertificateCard type="verify" data={result} />
      )}

      {status === "error" && (
        <div className="status-card error">
          <span className="status-icon">⚠</span>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
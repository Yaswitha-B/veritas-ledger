import { useState } from "react";
import FilePicker from "../components/FilePicker";
import Button from "../components/Button";
import CertificateCard from "../components/CertificateCard";
import { hashFile, verifySignature } from "../services/hash_service";
import { storeRecord } from "../services/contract_service";
import { generateId } from "../utils/id";

export default function Upload() {
  const [file,   setFile]   = useState(null);
  const [label,  setLabel]  = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | mining | success | error
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState("");

  const handleStore = async () => {
    if (!file) return;
    setStatus("loading");
    setError("");

    try {
      // 1 — Backend computes and HMAC-signs the hash
      const { hash, signature } = await hashFile(file);

      // 2 — Verify HMAC before trusting the hash
      const valid = await verifySignature(hash, signature);
      if (!valid) {
        throw new Error(
          "Hash integrity check failed — possible in-transit tampering detected."
        );
      }

      // 3 — Derive deterministic certificate ID
      const id = generateId(hash);

      // 4 — Pre-check existence + send MetaMask tx (via storeRecord)
      setStatus("mining");
      const receipt = await storeRecord(id, hash, label.trim() || file.name);

      setResult({
        id,
        hash,
        label:       label.trim() || file.name,
        txHash:      receipt.hash,
        blockNumber: receipt.blockNumber,
      });
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const isLoading = status === "loading" || status === "mining";

  return (
    <div className="page">
      <div className="page-header">
        <h1>Certify a File</h1>
        <p className="subtitle">
          Anchor your file's existence and integrity to the blockchain.
        </p>
      </div>

      <div className="card">
        <FilePicker onSelect={setFile} selected={file} />

        <div className="field">
          <label>
            Label <span className="optional">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Contract Draft v2"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <Button
          onClick={handleStore}
          disabled={!file}
          loading={isLoading}
          loadingText={status === "mining" ? "Confirming on chain…" : "Processing…"}
        >
          Store Proof
        </Button>
      </div>

      {status === "success" && result && (
        <CertificateCard type="issued" data={result} />
      )}

      {status === "error" && (
        <div className="status-card error">
          <span className="status-icon">⚠</span>
          <p style={{ whiteSpace: "pre-line" }}>{error}</p>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { truncate } from "../utils/format";

function Field({ label, value, onCopy, copied, accent }) {
  return (
    <div className={`cert-field${accent ? ` accent-${accent}` : ""}`}>
      <span className="cert-field-label">{label}</span>
      <div className="cert-field-row">
        <code className="cert-field-value">{truncate(value, 14, 8)}</code>
        {onCopy && (
          <button className="copy-btn" onClick={onCopy}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function CertificateCard({ type, data }) {
  const [copied, setCopied] = useState("");

  const copy = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  if (type === "issued") {
    return (
      <div className="certificate-card">
        <div className="cert-header">
          <div className="cert-badge blue">✓</div>
          <div>
            <h3>Certificate Issued</h3>
            <p className="cert-subtitle">{data.label}</p>
          </div>
        </div>

        <div className="cert-fields">
          <Field
            label="Certificate ID"
            value={data.id}
            onCopy={() => copy(data.id, "id")}
            copied={copied === "id"}
          />
          <Field
            label="File Hash (SHA-256)"
            value={data.hash}
            onCopy={() => copy(data.hash, "hash")}
            copied={copied === "hash"}
          />
          <Field
            label="Transaction"
            value={data.txHash}
            onCopy={() => copy(data.txHash, "tx")}
            copied={copied === "tx"}
          />
          <Field label="Block" value={`#${data.blockNumber}`} />
        </div>

        <p className="cert-note">
          Save your Certificate ID. You will need it to verify this file later.
        </p>
      </div>
    );
  }

  if (type === "verify") {
    return (
      <div className={`certificate-card ${data.isMatch ? "match" : "mismatch"}`}>
        <div className="cert-header">
          <div className={`cert-badge ${data.isMatch ? "green" : "red"}`}>
            {data.isMatch ? "✓" : "✗"}
          </div>
          <div>
            <h3>{data.isMatch ? "File Authentic" : "File Has Been Tampered"}</h3>
            <p className="cert-subtitle">{data.label}</p>
          </div>
        </div>

        <div className="cert-fields">
          <Field label="Certified At" value={data.timestamp} />
          <Field
            label="Owner"
            value={data.owner}
            onCopy={() => copy(data.owner, "owner")}
            copied={copied === "owner"}
          />
          <Field label="Stored Hash" value={data.storedHash} />
          {!data.isMatch && (
            <Field
              label="Computed Hash (mismatch)"
              value={data.computedHash}
              accent="red"
            />
          )}
        </div>
      </div>
    );
  }

  return null;
}
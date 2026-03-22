import { useState } from "react";
import { verifyRecord } from "../services/api";
import Card from "../components/Card";
import FileInput from "../components/FileInput";

export default function VerifyPage() {
  const [file, setFile] = useState(null);
  const [id, setId] = useState("");
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    const form = new FormData();
    form.append("file", file);
    form.append("certificateId", id);

    const res = await verifyRecord(form);
    setResult(res.data);
  };

  return (
    <div className="container">
      <Card>
        <h2>Verify Record</h2>

        <FileInput onChange={setFile} />
        <input placeholder="Record ID" onChange={(e) => setId(e.target.value)} />

        <button onClick={handleVerify}>Verify</button>

        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </Card>
    </div>
  );
}
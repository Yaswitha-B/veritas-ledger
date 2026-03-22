import { useState } from "react";
import { uploadRecord } from "../services/api";
import Card from "../components/Card";
import FileInput from "../components/FileInput";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    const form = new FormData();
    form.append("file", file);
    form.append("name", name);
    form.append("description", desc);
    form.append("claimedTime", time);

    const res = await uploadRecord(form);
    setResult(res.data);
  };

  return (
    <div className="container">
      <Card>
        <h2>Upload Record</h2>

        <FileInput onChange={setFile} />

        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <textarea placeholder="Description" onChange={(e) => setDesc(e.target.value)} />
        <input placeholder="Claimed Time" onChange={(e) => setTime(e.target.value)} />

        <button onClick={handleUpload}>Create Record</button>

        {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      </Card>
    </div>
  );
}
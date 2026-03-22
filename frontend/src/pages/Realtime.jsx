import { useState, useRef, useEffect, useCallback } from "react";
import DevicePicker from "../components/DevicePicker";
import Button from "../components/Button";
import CertificateCard from "../components/CertificateCard";
import { hashFile, hashText, verifySignature } from "../services/hash_service";
import { storeRecord } from "../services/contract_service";
import { generateId } from "../utils/id";

const MODES = [
  { id: "video", emoji: "📹", label: "Video" },
  { id: "audio", emoji: "🎙",  label: "Audio" },
  { id: "text",  emoji: "📝",  label: "Text"  },
];

const MIME = {
  video: "video/webm",
  audio: "audio/webm",
};

const EXT = {
  video: "webm",
  audio: "webm",
};

function formatTime(totalSeconds) {
  const m   = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const sec = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${sec}`;
}

/**
 * Trigger a browser download of a Blob.
 * @param {Blob}   blob
 * @param {string} filename
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  // Revoke after a short delay so the download has time to start
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export default function Realtime() {
  const [mode,           setMode]           = useState("video");
  const [devices,        setDevices]        = useState({ video: [], audio: [] });
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedMic,    setSelectedMic]    = useState("");
  const [isRecording,    setIsRecording]    = useState(false);
  const [recTime,        setRecTime]        = useState(0);
  const [capturedBlob,   setCapturedBlob]   = useState(null);
  const [capturedName,   setCapturedName]   = useState("");
  const [textContent,    setTextContent]    = useState("");
  const [label,          setLabel]          = useState("");
  const [status,         setStatus]         = useState("idle");
  const [result,         setResult]         = useState(null);
  const [error,          setError]          = useState("");

  const recorderRef = useRef(null);
  const chunksRef   = useRef([]);
  const streamRef   = useRef(null);
  const videoRef    = useRef(null);
  const timerRef    = useRef(null);

  // ── Teardown helper ──────────────────────────────────────────────────────
  const stopAll = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    clearInterval(timerRef.current);
    setIsRecording(false);
  }, []);

  // ── Initial permission + device enumeration ──────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const perm = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        perm.getTracks().forEach((t) => t.stop());
        const all = await navigator.mediaDevices.enumerateDevices();
        setDevices({
          video: all.filter((d) => d.kind === "videoinput"),
          audio: all.filter((d) => d.kind === "audioinput"),
        });
      } catch { /* permissions not yet granted */ }
    })();
    return stopAll;
  }, [stopAll]);

  // ── Reset when mode changes ──────────────────────────────────────────────
  useEffect(() => {
    stopAll();
    setCapturedBlob(null);
    setCapturedName("");
    setRecTime(0);
    setStatus("idle");
    setError("");
  }, [mode, stopAll]);

  // ── Start recording ──────────────────────────────────────────────────────
  async function startRecording() {
    chunksRef.current = [];
    setCapturedBlob(null);
    setCapturedName("");
    setRecTime(0);
    setError("");

    const constraints = {
      video:
        mode === "video"
          ? selectedCamera ? { deviceId: { exact: selectedCamera } } : true
          : false,
      audio:
        mode !== "text"
          ? selectedMic ? { deviceId: { exact: selectedMic } } : true
          : false,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current && mode === "video") {
        videoRef.current.srcObject = stream;
      }

      const mimeType = MIME[mode];
      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob      = new Blob(chunksRef.current, { type: mimeType });
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename  = `veritas-${mode}-${timestamp}.${EXT[mode]}`;

        setCapturedBlob(blob);
        setCapturedName(filename);
        stream.getTracks().forEach((t) => t.stop());

        // ── Auto-download immediately so the user has the file for future verification
        downloadBlob(blob, filename);
      };

      recorderRef.current = recorder;
      recorder.start(2000);
      setIsRecording(true);
      timerRef.current = setInterval(() => setRecTime((t) => t + 1), 1000);
    } catch (err) {
      setError(err.message);
    }
  }

  function stopRecording() {
    stopAll();
  }

  // ── Certify captured content ─────────────────────────────────────────────
  async function handleStore() {
    setStatus("loading");
    setError("");

    try {
      let hashData;

      if (mode === "text") {
        if (!textContent.trim()) throw new Error("No text to certify.");
        hashData = await hashText(textContent.trim());
      } else {
        if (!capturedBlob) throw new Error("No recording to certify.");
        const file = new File([capturedBlob], capturedName, {
          type: capturedBlob.type,
        });
        hashData = await hashFile(file);
      }

      const { hash, signature } = hashData;

      const valid = await verifySignature(hash, signature);
      if (!valid) {
        throw new Error(
          "Hash integrity check failed — possible in-transit tampering detected."
        );
      }

      const id         = generateId(hash);
      const labelFinal = label.trim() || `${mode} capture`;

      setStatus("mining");
      const receipt = await storeRecord(id, hash, labelFinal);

      setResult({
        id,
        hash,
        label:       labelFinal,
        txHash:      receipt.hash,
        blockNumber: receipt.blockNumber,
      });
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  const canStore     = mode === "text" ? textContent.trim().length > 0 : !!capturedBlob;
  const isSubmitting = status === "loading" || status === "mining";

  return (
    <div className="page">
      <div className="page-header">
        <h1>Live Capture</h1>
        <p className="subtitle">
          Record a moment and anchor it to the blockchain in real time.
        </p>
      </div>

      <div className="card">
        {/* ── Mode selector ── */}
        <div className="mode-tabs">
          {MODES.map((m) => (
            <button
              key={m.id}
              className={`mode-tab ${mode === m.id ? "active" : ""}`}
              onClick={() => setMode(m.id)}
              disabled={isRecording}
            >
              {m.emoji}&nbsp;{m.label}
            </button>
          ))}
        </div>

        {/* ── Device pickers ── */}
        {mode !== "text" && !isRecording && (
          <DevicePicker
            mode={mode}
            cameras={devices.video}
            mics={devices.audio}
            selectedCamera={selectedCamera}
            selectedMic={selectedMic}
            onCameraChange={setSelectedCamera}
            onMicChange={setSelectedMic}
          />
        )}

        {/* ── Video preview ── */}
        {mode === "video" && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="video-preview"
            style={{ display: isRecording ? "block" : "none" }}
          />
        )}

        {/* ── Text area ── */}
        {mode === "text" && (
          <textarea
            className="text-capture"
            placeholder="Type or paste text to certify…"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            rows={6}
          />
        )}

        {/* ── Recording indicator ── */}
        {isRecording && (
          <div className="recording-status">
            <span className="rec-dot" />
            Recording&nbsp;&nbsp;{formatTime(recTime)}
          </div>
        )}

        {/* ── Capture ready badge ── */}
        {capturedBlob && !isRecording && (
          <div className="capture-ready">
            <div>
              ✓ Capture ready — {(capturedBlob.size / 1024).toFixed(1)} KB
            </div>
            <button
              className="redownload-btn"
              onClick={() => downloadBlob(capturedBlob, capturedName)}
              title="Download capture again"
            >
              ↓ Download again
            </button>
          </div>
        )}

        {/* ── Record / stop ── */}
        {mode !== "text" && (
          <div className="capture-controls">
            {!isRecording ? (
              <Button onClick={startRecording} variant="danger">
                {capturedBlob ? "Record Again" : "Start Recording"}
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="secondary">
                Stop Recording
              </Button>
            )}
          </div>
        )}

        {/* ── Label ── */}
        <div className="field">
          <label>
            Label <span className="optional">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="Describe this capture…"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        {/* ── Submit ── */}
        <Button
          onClick={handleStore}
          disabled={!canStore || isRecording}
          loading={isSubmitting}
          loadingText={status === "mining" ? "Confirming on chain…" : "Processing…"}
        >
          Certify Capture
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
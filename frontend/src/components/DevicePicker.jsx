export default function DevicePicker({
  mode,
  cameras,
  mics,
  selectedCamera,
  selectedMic,
  onCameraChange,
  onMicChange,
}) {
  const showMic    = mode !== "text" && mics.length > 0;
  const showCamera = mode === "video" && cameras.length > 0;

  if (!showMic && !showCamera) return null;

  return (
    <div className="device-picker">
      {showMic && (
        <div className="field">
          <label>Microphone</label>
          <select
            value={selectedMic}
            onChange={(e) => onMicChange(e.target.value)}
          >
            <option value="">System Default</option>
            {mics.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || "Microphone"}
              </option>
            ))}
          </select>
        </div>
      )}

      {showCamera && (
        <div className="field">
          <label>Camera</label>
          <select
            value={selectedCamera}
            onChange={(e) => onCameraChange(e.target.value)}
          >
            <option value="">System Default</option>
            {cameras.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || "Camera"}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
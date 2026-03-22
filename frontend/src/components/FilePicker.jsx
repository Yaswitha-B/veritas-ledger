import { useRef } from "react";

export default function FilePicker({ onSelect, selected }) {
  const inputRef = useRef(null);

  return (
    <div
      className={`file-picker ${selected ? "has-file" : ""}`}
      onClick={() => inputRef.current.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        onChange={(e) => onSelect(e.target.files[0])}
      />

      {selected ? (
        <div className="file-info">
          <span className="file-icon">📄</span>
          <div>
            <p className="file-name">{selected.name}</p>
            <p className="file-size">{(selected.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      ) : (
        <div className="file-placeholder">
          <span style={{ fontSize: 28 }}>📎</span>
          <p>Click to select a file</p>
          <span className="file-hint">Any file type — up to 100 MB</span>
        </div>
      )}
    </div>
  );
}
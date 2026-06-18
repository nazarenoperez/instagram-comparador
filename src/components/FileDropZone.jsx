import React, { useRef, useState } from "react";

export default function FileDropZone({ label, sublabel, icon, file, onFile }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }

  const loaded = !!file;

  return (
    <div>
      <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 8 }}>
        {label} <span style={{ fontWeight: 400 }}>{sublabel}</span>
      </p>
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `1.5px dashed ${loaded ? "var(--mutual)" : dragging ? "var(--accent)" : "var(--border-hover)"}`,
          borderRadius: "var(--radius-lg)",
          padding: "1.75rem 1rem",
          textAlign: "center",
          cursor: "pointer",
          background: loaded ? "var(--mutual-dim)" : dragging ? "var(--accent-dim)" : "var(--bg-surface)",
          transition: "all 0.15s",
          userSelect: "none",
        }}
      >
        <input ref={inputRef} type="file" accept=".json" style={{ display: "none" }}
          onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />
        <div style={{ fontSize: 28, marginBottom: 8, color: loaded ? "var(--mutual)" : "var(--text-muted)" }}>
          {loaded ? "✓" : icon}
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: loaded ? "var(--mutual)" : "var(--text-primary)", marginBottom: 3 }}>
          {loaded ? (file.name.length > 26 ? file.name.slice(0, 24) + "…" : file.name) : "Arrastrá o hacé clic"}
        </p>
        <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
          {loaded ? "Clic para cambiar" : ".json"}
        </p>
      </div>
    </div>
  );
}

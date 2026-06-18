import React, { useState } from "react";
import FileDropZone from "./components/FileDropZone";
import ResultsTable from "./components/ResultsTable";

export default function App() {
  const [fileFollowers, setFileFollowers] = useState(null);
  const [fileFollowing, setFileFollowing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  async function handleCompare() {
    if (!fileFollowers || !fileFollowing) return;
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("followers", fileFollowers);
      fd.append("following", fileFollowing);
      const res = await fetch("/api/compare", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFileFollowers(null);
    setFileFollowing(null);
    setResults(null);
    setError(null);
  }

  const bothLoaded = fileFollowers && fileFollowing;

  return (
    <div style={{ minHeight: "100vh", padding: "2.5rem 1rem" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <img src="/instagram-comparador.png" alt="Logo" style={{ width: 150, height: 150, borderRadius: 24 }} />
            <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>
              Instagram — Comparador de seguidores
            </h1>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", paddingLeft: 46 }}>
            Subí tus archivos JSON exportados de Instagram para ver quién no te sigue de vuelta.
          </p>
        </div>

        {/* Step 1: Upload */}
        <div style={{ background: "var(--bg-surface)", border: "0.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: 16 }}>
          <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>1 · Archivos JSON</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <FileDropZone label="followers_1.json" sublabel="— tus seguidores" icon="↓" file={fileFollowers} onFile={setFileFollowers} />
            <FileDropZone label="following.json"   sublabel="— a quiénes seguís" icon="↑" file={fileFollowing} onFile={setFileFollowing} />
          </div>
          {bothLoaded && !results && (
            <button
              onClick={handleCompare}
              disabled={loading}
              style={{
                width: "100%", padding: "10px", borderRadius: "var(--radius)", fontSize: 14, fontWeight: 500,
                background: loading ? "var(--bg-raised)" : "var(--accent)",
                color: loading ? "var(--text-muted)" : "#fff",
                border: "none", transition: "all 0.15s",
              }}
            >
              {loading ? "Comparando…" : "Comparar →"}
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "0.5px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius)", padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>
            {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div style={{ background: "var(--bg-surface)", border: "0.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>2 · Resultados</p>
              <button onClick={reset} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 999, border: "0.5px solid var(--border-hover)", background: "transparent", color: "var(--text-secondary)" }}>
                Nueva comparación
              </button>
            </div>
            <ResultsTable results={results.results} summary={results.summary} />
          </div>
        )}

      </div>
    </div>
  );
}

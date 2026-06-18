import React, { useState, useMemo } from "react";

const STATUS = {
  not_following_back: { label: "No te sigue de vuelta", color: "var(--not-fb)",  bg: "var(--not-fb-dim)" },
  not_followed_back:  { label: "No lo seguís",          color: "var(--not-fbd)", bg: "var(--not-fbd-dim)" },
  mutual:             { label: "Mutuo",                  color: "var(--mutual)",  bg: "var(--mutual-dim)" },
};

function StatCard({ value, label, color }) {
  return (
    <div style={{ background: "var(--bg-surface)", borderRadius: "var(--radius)", padding: "1rem", textAlign: "center", border: "0.5px solid var(--border)" }}>
      <div style={{ fontSize: 28, fontWeight: 600, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{label}</div>
    </div>
  );
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 12, padding: "5px 14px", borderRadius: 999,
      border: `0.5px solid ${active ? "transparent" : "var(--border-hover)"}`,
      background: active ? "var(--accent)" : "transparent",
      color: active ? "#fff" : "var(--text-secondary)",
      fontWeight: active ? 500 : 400, transition: "all 0.12s",
    }}>
      {children}
    </button>
  );
}

export default function ResultsTable({ results, summary }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = filter === "all" ? results : results.filter((r) => r.status === filter);
    if (search.trim()) list = list.filter((r) => r.username.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [results, filter, search]);

  function downloadCSV() {
    const rows = [["usuario", "estado", "url"]].concat(
      results.map((r) => [r.username, STATUS[r.status].label, `https://www.instagram.com/${r.username}`])
    );
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent("\uFEFF" + csv);
    a.download = `instagram_comparacion_${Date.now()}.csv`;
    a.click();
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard value={summary.notFollowingBack} label="No te siguen de vuelta" color="var(--not-fb)" />
        <StatCard value={summary.notFollowedBack}  label="No los seguís"          color="var(--not-fbd)" />
        <StatCard value={summary.mutual}           label="Mutuos"                 color="var(--mutual)" />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>Todos ({summary.total})</FilterBtn>
        <FilterBtn active={filter === "not_following_back"} onClick={() => setFilter("not_following_back")}>No te siguen ({summary.notFollowingBack})</FilterBtn>
        <FilterBtn active={filter === "not_followed_back"}  onClick={() => setFilter("not_followed_back")}>No los seguís ({summary.notFollowedBack})</FilterBtn>
        <FilterBtn active={filter === "mutual"} onClick={() => setFilter("mutual")}>Mutuos ({summary.mutual})</FilterBtn>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <input
            type="text" placeholder="Buscar usuario…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: 13, padding: "5px 12px", borderRadius: "var(--radius)", border: "0.5px solid var(--border-hover)", background: "var(--bg-surface)", color: "var(--text-primary)", width: 170 }}
          />
          <button onClick={downloadCSV} style={{ fontSize: 12, padding: "5px 14px", borderRadius: "var(--radius)", border: "0.5px solid var(--border-hover)", background: "transparent", color: "var(--text-secondary)" }}>
            ↓ CSV
          </button>
        </div>
      </div>

      <div style={{ border: "0.5px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-surface)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
              <th style={{ padding: "10px 16px", fontSize: 11, color: "var(--text-muted)", fontWeight: 500, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.06em", width: "45%" }}>Usuario</th>
              <th style={{ padding: "10px 16px", fontSize: 11, color: "var(--text-muted)", fontWeight: 500, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.06em" }}>Estado</th>
              <th style={{ padding: "10px 16px", fontSize: 11, color: "var(--text-muted)", fontWeight: 500, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.06em", width: "22%" }}>Instagram</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={3} style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Sin resultados</td></tr>
            ) : (
              filtered.map((r, i) => {
                const s = STATUS[r.status];
                return (
                  <tr key={i} style={{ borderBottom: i < filtered.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                    <td style={{ padding: "9px 16px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "var(--text-primary)" }}>@{r.username}</td>
                    <td style={{ padding: "9px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 999, background: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                    <td style={{ padding: "9px 16px" }}>
                      <a href={`https://www.instagram.com/${r.username}`} target="_blank" rel="noreferrer"
                        style={{ fontSize: 12, color: "var(--text-secondary)", textDecoration: "none" }}>
                        ↗ Ver perfil
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

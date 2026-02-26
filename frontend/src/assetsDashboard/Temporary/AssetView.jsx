import { Link } from "react-router-dom";

const STATUSES = ["active", "inactive", "maintenance", "retired"];

const STATUS_CFG = {
    active:      { label: "Active",      bg: "#052e16", border: "#166534", dot: "#22c55e" },
    inactive:    { label: "Inactive",    bg: "#0f172a", border: "#334155", dot: "#475569" },
    maintenance: { label: "Maintenance", bg: "#1c1917", border: "#92400e", dot: "#f59e0b" },
    retired:     { label: "Retired",     bg: "#1c0a09", border: "#7f1d1d", dot: "#ef4444" },
};

export default function AssetView({
    user,
    onEdit,
    assets,
    loading,
    error,
    search,
    setSearch,
    filter,
    setFilter,
    selected,
    setSelected,
    deleting,
    handleDelete,
    visible,
}) {
    const mono = "'Geist Mono', 'Fira Code', monospace";

    return (
        <div style={{ display: "flex", gap: 20, height: "100%", fontFamily: mono }}>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>

                {/* Toolbar */}
                <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1, position: "relative" }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#475569", fontSize: 15, pointerEvents: "none" }}>⌕</span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name or asset tag…"
                            style={{ width: "100%", boxSizing: "border-box", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "0.65rem 1rem 0.65rem 2.25rem", color: "#e2e8f0", fontFamily: mono, fontSize: 13, outline: "none" }}
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "0 1rem", color: "#64748b", fontFamily: mono, fontSize: 12, outline: "none", cursor: "pointer" }}
                    >
                        <option value="all">All Status</option>
                        {STATUSES.map((s) => <option key={s} value={s}>{STATUS_CFG[s].label}</option>)}
                    </select>
                </div>

                {/* Count label */}
                {!loading && !error && (
                    <div style={{ color: "#334155", fontSize: 10, letterSpacing: "0.15em" }}>
                        SHOWING {visible.length} OF {assets.length} ASSETS
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#334155", fontSize: 13 }}>
                        Loading…
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ color: "#ef4444", fontSize: 13, textAlign: "center" }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>⚠</div>
                            {error}
                        </div>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && visible.length === 0 && (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#1e293b", fontSize: 13 }}>
                        No assets found
                    </div>
                )}

                {/* Cards */}
                {!loading && !error && (
                    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                        {visible.map((a) => {
                            const sc = STATUS_CFG[a.status] ?? STATUS_CFG.inactive;
                            const isSelected = selected?.id === a.id;
                            return (
                                <div
                                    key={a.id}
                                    onClick={() => setSelected(isSelected ? null : a)}
                                    style={{
                                        background: isSelected ? "#0f172a" : "#080d14",
                                        border: `1px solid ${isSelected ? "#3b82f6" : "#1e293b"}`,
                                        borderRadius: 12, padding: "0.9rem 1.1rem",
                                        cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                                        transition: "border-color 0.15s, background 0.15s",
                                    }}
                                >
                                    {/* Icon */}
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "#0f172a", border: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                                        📦
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {a.name}
                                        </div>
                                        <div style={{ color: "#334155", fontSize: 11, marginTop: 3 }}>
                                            {a.asset_tag}
                                        </div>
                                    </div>

                                    {/* Status badge */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 9px", borderRadius: 5, background: sc.bg, border: `1px solid ${sc.border}`, flexShrink: 0 }}>
                                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot }} />
                                        <span style={{ color: sc.dot, fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}>{sc.label.toUpperCase()}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Detail Panel */}
            {selected && (
                <div style={{ width: 300, flexShrink: 0, background: "#080d14", border: "1px solid #1e293b", borderRadius: 14, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: 0 }}>

                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                        <div>
                            <div style={{ color: "#334155", fontSize: 10, letterSpacing: "0.18em", marginBottom: 5 }}>ASSET DETAIL</div>
                            <div style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{selected.name}</div>
                        </div>
                        <button
                            onClick={() => setSelected(null)}
                            style={{ background: "none", border: "none", color: "#334155", cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1 }}
                        >✕</button>
                    </div>

                    {/* Fields */}
                    {[
                        ["Asset Tag",  selected.asset_tag],
                        ["Status",     selected.status],
                        ["Owner",      selected.owner],
                        ["Created At", selected.created_at
                            ? new Date(selected.created_at).toLocaleDateString()
                            : "—"
                        ],
                    ].map(([label, val]) => (
                        <div key={label} style={{ paddingBottom: "0.9rem", marginBottom: "0.9rem", borderBottom: "1px solid #0f172a" }}>
                            <div style={{ color: "#334155", fontSize: 10, letterSpacing: "0.12em", marginBottom: 4 }}>{label.toUpperCase()}</div>
                            <div style={{ color: "#94a3b8", fontSize: 13 }}>{val ?? "—"}</div>
                        </div>
                    ))}

                    {/* Status badge */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <div style={{ color: "#334155", fontSize: 10, letterSpacing: "0.12em", marginBottom: 6 }}>STATUS</div>
                        {(() => {
                            const sc = STATUS_CFG[selected.status] ?? STATUS_CFG.inactive;
                            return (
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, background: sc.bg, border: `1px solid ${sc.border}` }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />
                                    <span style={{ color: sc.dot, fontSize: 11, fontWeight: 600 }}>{sc.label}</span>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Admin actions */}
                    {user?.is_admin && (
                        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                            <button
                                onClick={() => onEdit(selected)}
                                style={{ flex: 1, padding: "0.6rem", background: "#1e40af22", border: "1px solid #1e40af55", borderRadius: 8, color: "#60a5fa", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: mono }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(selected.id)}
                                disabled={deleting === selected.id}
                                style={{ flex: 1, padding: "0.6rem", background: "#7f1d1d22", border: "1px solid #7f1d1d55", borderRadius: 8, color: "#f87171", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: mono, opacity: deleting === selected.id ? 0.6 : 1 }}
                            >
                                {deleting === selected.id ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
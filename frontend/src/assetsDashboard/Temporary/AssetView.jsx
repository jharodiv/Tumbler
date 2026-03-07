//import { Link } from "react-router-dom";
import styles from "./AssetView.module.css";

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
    onLogout,
    assets,
    loading,
    error,
    search,
    setSearch,
    filter,
    setFilter,
    selected,
    setSelected,
    visible,
}) {
    return (
        <div className={styles.wrapper}>

            {/* ── Top bar ── */}
            <div className={styles.topBar}>
                <div className={styles.topBarLeft}>
                    <span className={styles.topBarTitle}>Tumbler</span>
                    {!loading && !error && (
                        <span className={styles.countLabel}>
                            {visible.length} / {assets.length}
                        </span>
                    )}
                </div>
                <div className={styles.topBarRight}>
                    {user && (
                        <span className={styles.userLabel}>
                            {user.email ?? user.username ?? "User"}
                        </span>
                    )}
                    <button onClick={onLogout} className={styles.logoutBtn}>
                        LOGOUT
                    </button>
                </div>
            </div>

            {/* ── Body ── */}
            <div className={styles.body}>
                <div className={styles.listCol}>

                    {/* Toolbar */}
                    <div className={styles.toolbar}>
                        <div className={styles.searchWrap}>
                            <span className={styles.searchIcon}>⌕</span>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name or asset tag…"
                                className={styles.searchInput}
                            />
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Status</option>
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>{STATUS_CFG[s].label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className={`${styles.centered} ${styles.loadingText}`}>
                            Loading…
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className={styles.centered}>
                            <div className={styles.errorBox}>
                                <div className={styles.errorIcon}>⚠</div>
                                {error}
                            </div>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && !error && visible.length === 0 && (
                        <div className={`${styles.centered} ${styles.emptyText}`}>
                            No assets found
                        </div>
                    )}

                    {/* Cards */}
                    {!loading && !error && (
                        <div className={styles.cardList}>
                            {visible.map((a) => {
                                const sc = STATUS_CFG[a.status] ?? STATUS_CFG.inactive;
                                const isSelected = selected?.id === a.id;
                                return (
                                    <div
                                        key={a.id}
                                        onClick={() => setSelected(isSelected ? null : a)}
                                        className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
                                    >
                                        <div className={styles.cardIcon}>📦</div>
                                        <div className={styles.cardInfo}>
                                            <div className={styles.cardName}>{a.name}</div>
                                            <div className={styles.cardTag}>{a.asset_tag}</div>
                                        </div>
                                        <div
                                            className={styles.badge}
                                            style={{ background: sc.bg, border: `1px solid ${sc.border}` }}
                                        >
                                            <div className={styles.badgeDot} style={{ background: sc.dot }} />
                                            <span className={styles.badgeLabel} style={{ color: sc.dot }}>
                                                {sc.label.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Detail Panel ── */}
                {selected && (
                    <div className={styles.detail}>

                        <div className={styles.detailHeader}>
                            <div>
                                <div className={styles.detailMeta}>ASSET DETAIL</div>
                                <div className={styles.detailTitle}>{selected.name}</div>
                            </div>
                            <button onClick={() => setSelected(null)} className={styles.closeBtn}>
                                ✕
                            </button>
                        </div>

                        {/* Status badge */}
                        {(() => {
                            const sc = STATUS_CFG[selected.status] ?? STATUS_CFG.inactive;
                            return (
                                <div
                                    className={styles.detailBadge}
                                    style={{ background: sc.bg, border: `1px solid ${sc.border}` }}
                                >
                                    <div className={styles.detailBadgeDot} style={{ background: sc.dot }} />
                                    <span className={styles.detailBadgeLabel} style={{ color: sc.dot }}>
                                        {sc.label}
                                    </span>
                                </div>
                            );
                        })()}

                        {/* Fields */}
                        <div className={styles.fieldList}>
                            {[
                                ["Asset Tag",  selected.asset_tag],
                                ["Created By", selected.owner],
                                ["Assigned To", selected.assigned_to],
                                ["Created At", selected.created_at
                                    ? new Date(selected.created_at).toLocaleDateString()
                                    : "—"
                                ],
                            ].map(([label, val]) => (
                                <div key={label} className={styles.field}>
                                    <div className={styles.fieldLabel}>{label.toUpperCase()}</div>
                                    <div className={styles.fieldValue}>{val ?? "—"}</div>
                                </div>
                            ))}
                        </div>

                        {/* Admin actions */}
                        {user?.is_admin && (
                            <div className={styles.actions}>
                                <button onClick={() => onEdit(selected)} className={styles.editBtn}>
                                    EDIT
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
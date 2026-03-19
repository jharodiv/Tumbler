import styles from "./AssetEdit.module.css";

const STATUS_CFG = {
    active:      { label: "Active",      dot: "#22c55e" },
    inactive:    { label: "Inactive",    dot: "#475569" },
    maintenance: { label: "Maintenance", dot: "#f59e0b" },
    retired:     { label: "Retired",     dot: "#ef4444" },
};

const STATUS_OPTIONS = Object.entries(STATUS_CFG).map(([value, { label }]) => ({ value, label }));

function ReadOnlyField({ label, value, icon = "🔒" }) {
    return (
        <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>{label}</span>
            <div className={styles.fieldReadOnly}>
                <span className={styles.readOnlyIcon}>{icon}</span>
                <span>{value}</span>
                <span className={styles.readOnlyBadge}>LOCKED</span>
            </div>
        </div>
    );
}

function InputField({ label, id, required, hint, error, ...inputProps }) {
    return (
        <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor={id}>
                {required && <span className={styles.requiredDot} />}
                {label}
            </label>
            <input
                id={id}
                className={[styles.fieldInput, error ? styles.fieldInputError : ""].join(" ")}
                {...inputProps}
            />
            {hint  && !error && <span className={styles.fieldHint}>{hint}</span>}
            {error && <span className={styles.fieldError}>⚠ {error}</span>}
        </div>
    );
}

function SelectField({ label, id, required, hint, error, children, ...selectProps }) {
    return (
        <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor={id}>
                {required && <span className={styles.requiredDot} />}
                {label}
            </label>
            <select
                id={id}
                className={[styles.fieldSelect, error ? styles.fieldInputError : ""].join(" ")}
                {...selectProps}
            >
                {children}
            </select>
            {hint  && !error && <span className={styles.fieldHint}>{hint}</span>}
            {error && <span className={styles.fieldError}>⚠ {error}</span>}
        </div>
    );
}

function StatusField({ value, onChange, error }) {
    return (
        <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="status">
                <span className={styles.requiredDot} />
                STATUS
            </label>
            <div className={styles.statusWrap}>
                <span
                    className={styles.statusDot}
                    style={{ backgroundColor: STATUS_CFG[value]?.dot }}
                />
                <select
                    id="status"
                    className={[styles.fieldSelect, error ? styles.fieldInputError : ""].join(" ")}
                    value={value}
                    onChange={onChange}
                >
                    {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
            </div>
            {error && <span className={styles.fieldError}>⚠ {error}</span>}
        </div>
    );
}

export default function AssetEdit({
    asset,
    form,
    errors = {},
    isDirty,
    saveState = "idle",
    ownerOptions = [],
    userOptions = [],
    currentUser = "",
    onChange,
    onSave,
    onCancel,
}) {
    const saveBtnClass = [
        styles.saveBtn,
        saveState === "saving"  ? styles.saveBtnSaving  : "",
        saveState === "success" ? styles.saveBtnSuccess : "",
    ].join(" ");

    const saveBtnContent = {
        idle:    <><span>💾</span> SAVE CHANGES</>,
        saving:  <><span>⏳</span> SAVING…</>,
        success: <><span>✓</span> SAVED</>,
    }[saveState];

    return (
        <div className={styles.root}>
            <header className={styles.topBar}>
                <div className={styles.topBarLeft}>
                    <nav className={styles.breadcrumb}>
                        <button className={styles.breadcrumbLink} onClick={onCancel}>
                            ASSETS
                        </button>
                        <span className={styles.breadcrumbSep}>/</span>
                        <span className={styles.breadcrumbCurrent}>EDIT ASSET</span>
                    </nav>
                </div>
                <div className={styles.topBarRight}>
                    <span className={styles.userLabel}>{currentUser}</span>
                </div>
            </header>

            <main className={styles.pageBody}>
                <div className={styles.editContainer}>
                    <div className={styles.pageHeader}>
                        <div className={styles.pageHeaderIcon}>🖥️</div>
                        <div>
                            <div className={styles.pageHeaderMeta}>ASSET MANAGEMENT · EDIT</div>
                            <div className={styles.pageHeaderTitle}>{asset.name}</div>
                        </div>
                    </div>

                    <div className={[
                        styles.changesBanner,
                        isDirty ? styles.changesBannerVisible : "",
                    ].join(" ")}>
                        <span className={styles.changesDot} />
                        <span className={styles.changesText}>Unsaved changes</span>
                    </div>

                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>METADATA</span>
                            <span className={styles.sectionPill}>READ-ONLY</span>
                        </div>
                        <div className={styles.sectionBody}>
                            <div className={styles.fieldRow}>
                                <ReadOnlyField label="ID"         value={asset.id}         icon="🔒" />
                                <ReadOnlyField label="CREATED AT" value={asset.created_at} icon="📅" />
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>ASSET DETAILS</span>
                        </div>
                        <div className={styles.sectionBody}>
                            <InputField
                                label="NAME" id="name" required type="text"
                                placeholder='e.g. MacBook Pro 16" M3'
                                value={form.name}
                                onChange={onChange("name")}
                                error={errors.name}
                            />
                            <InputField
                                label="ASSET TAG" id="asset_tag" required type="text"
                                placeholder="e.g. MBPM3-2024-0142"
                                value={form.asset_tag}
                                onChange={onChange("asset_tag")}
                                hint="Unique identifier label on the physical asset"
                                error={errors.asset_tag}
                            />
                            <StatusField
                                value={form.status}
                                onChange={onChange("status")}
                                error={errors.status}
                            />
                        </div>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionLabel}>ASSIGNMENT</span>
                        </div>
                        <div className={styles.sectionBody}>
                            <SelectField
                                label="OWNER" id="owner" required
                                value={form.owner}
                                onChange={onChange("owner")}
                                error={errors.owner}
                            >
                                <option value="">— Select owner —</option>
                                {ownerOptions.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </SelectField>

                            <SelectField
                                label="ASSIGNED TO" id="assigned_to"
                                value={form.assigned_to}
                                onChange={onChange("assigned_to")}
                                hint="Leave blank if asset is in storage or unassigned"
                            >
                                {userOptions.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </SelectField>
                        </div>
                    </section>

                    <div className={styles.formActions}>
                        <button className={styles.cancelBtn} onClick={onCancel}>
                            CANCEL
                        </button>
                        <button className={saveBtnClass} onClick={onSave} disabled={saveState === "saving"}>
                            {saveBtnContent}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
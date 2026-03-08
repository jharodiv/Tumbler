import { useState, useCallback } from "react";
import styles from "./AssetEdit.module.css";

const STATUSES = ["active", "inactive", "maintenance", "retired"]

const STATUS_CFG = {
    active:      { label: "Active",      bg: "#052e16", border: "#166534", dot: "#22c55e" },
    inactive:    { label: "Inactive",    bg: "#0f172a", border: "#334155", dot: "#475569" },
    maintenance: { label: "Maintenance", bg: "#1c1917", border: "#92400e", dot: "#f59e0b" },
    retired:     { label: "Retired",     bg: "#1c0a09", border: "#7f1d1d", dot: "#ef4444" },
}

/** Read-only field row (id, created_at) */
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

/** Select field */
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

    /** Status select with animated dot */
    function StatusField({ value, onChange, error }) {
    return (
        <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel} htmlFor="status">
            <span className={styles.requiredDot} />
            STATUS
        </label>
        <div className={styles.statusWrap}>
            <span className={[styles.statusDot, STATUS_DOT_CLASS[value]].join(" ")} />
            <select
            id="status"
            className={[styles.fieldSelect, error ? styles.fieldInputError : ""].join(" ")}
            value={value}
            onChange={onChange}
            >
            {STATUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
            </select>
        </div>
        {error && <span className={styles.fieldError}>⚠ {error}</span>}
        </div>
    );
    }

    function validate(form) {
    const errors = {};
    if (!form.name.trim())      errors.name      = "Name is required";
    if (!form.asset_tag.trim()) errors.asset_tag = "Asset tag is required";
    if (!form.status)           errors.status    = "Status is required";
    if (!form.owner)            errors.owner     = "Owner is required";
    return errors;
    }

    export default function AssetEdit({
    onSave,
    onCancel,
    }) {
    /* ── Form state ── */
    const [form, setForm] = useState({
        name:        asset.name,
        asset_tag:   asset.asset_tag,
        status:      asset.status,
        owner:       asset.owner,
        assigned_to: asset.assigned_to ?? "",
    });

    const [isDirty,  setIsDirty]  = useState(false);
    const [errors,   setErrors]   = useState({});
    const [saveState, setSaveState] = useState("idle");

    /* ── Handlers ── */
    const handleChange = useCallback((field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
        setIsDirty(true);
        setErrors(prev => ({ ...prev, [field]: undefined }));
    }, []);

    const handleSave = useCallback(async () => {
        const errs = validate(form);
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSaveState("saving");
        try {
        await onSave?.(form);
        setSaveState("success");
        setIsDirty(false);
        setTimeout(() => setSaveState("idle"), 2200);
        } catch {
        setSaveState("idle");
        }
    }, [form, onSave]);

    const handleCancel = useCallback(() => {
        if (isDirty && !window.confirm("Discard unsaved changes?")) return;
        onCancel?.();
    }, [isDirty, onCancel]);

    /* ── Save button label/style ── */
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

    /* ── Render ── */
    return (
        <div className={styles.root}>

        {/* ── Top bar ── */}
        <header className={styles.topBar}>
            <div className={styles.topBarLeft}>
            <nav className={styles.breadcrumb}>
                <button className={styles.breadcrumbLink} onClick={handleCancel}>
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

        {/* ── Page body ── */}
        <main className={styles.pageBody}>
            <div className={styles.editContainer}>

            {/* Page header */}
            <div className={styles.pageHeader}>
                <div className={styles.pageHeaderIcon}>🖥️</div>
                <div>
                <div className={styles.pageHeaderMeta}>ASSET MANAGEMENT · EDIT</div>
                <div className={styles.pageHeaderTitle}>{asset.name}</div>
                </div>
            </div>

            {/* Unsaved changes banner */}
            <div className={[
                styles.changesBanner,
                isDirty ? styles.changesBannerVisible : "",
            ].join(" ")}>
                <span className={styles.changesDot} />
                <span className={styles.changesText}>Unsaved changes</span>
            </div>

            {/* ── Section: Read-only metadata ── */}
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

            {/* ── Section: Asset details ── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                <span className={styles.sectionLabel}>ASSET DETAILS</span>
                </div>
                <div className={styles.sectionBody}>

                <InputField
                    label="NAME"
                    id="name"
                    required
                    type="text"
                    placeholder='e.g. MacBook Pro 16" M3'
                    value={form.name}
                    onChange={handleChange("name")}
                    error={errors.name}
                />

                <InputField
                    label="ASSET TAG"
                    id="asset_tag"
                    required
                    type="text"
                    placeholder="e.g. MBPM3-2024-0142"
                    value={form.asset_tag}
                    onChange={handleChange("asset_tag")}
                    hint="Unique identifier label on the physical asset"
                    error={errors.asset_tag}
                />

                <StatusField
                    value={form.status}
                    onChange={handleChange("status")}
                    error={errors.status}
                />

                </div>
            </section>

            {/* ── Section: Assignment ── */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                <span className={styles.sectionLabel}>ASSIGNMENT</span>
                </div>
                <div className={styles.sectionBody}>

                <SelectField
                    label="OWNER"
                    id="owner"
                    required
                    value={form.owner}
                    onChange={handleChange("owner")}
                    error={errors.owner}
                >
                    <option value="">— Select owner —</option>
                    {OWNER_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </SelectField>

                <SelectField
                    label="ASSIGNED TO"
                    id="assigned_to"
                    value={form.assigned_to}
                    onChange={handleChange("assigned_to")}
                    hint="Leave blank if asset is in storage or unassigned"
                >
                    {USER_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </SelectField>

                </div>
            </section>

            {/* ── Actions ── */}
            <div className={styles.formActions}>
                <button className={styles.cancelBtn} onClick={handleCancel}>
                CANCEL
                </button>
                <button className={saveBtnClass} onClick={handleSave} disabled={saveState === "saving"}>
                {saveBtnContent}
                </button>
            </div>

            </div>
        </main>
        </div>
    );
}
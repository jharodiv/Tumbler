export function formatDate(value: string | null | undefined): string {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(value: string | null | undefined): string {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) return "—";
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// "maintenance" -> "Maintenance"
export function titleCase(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

// ISO date -> value for <input type="date">
export function toDateInput(value: string | null | undefined): string {
    return value ? value.slice(0, 10) : "";
}

export function isWarrantyExpiringSoon(value: string | null, days = 30): boolean {
    if (!value) return false;
    const diff = new Date(value).getTime() - Date.now();
    return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

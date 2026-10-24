import type { AssetCondition, AssetStatus, Role } from "@/api/types";
import { titleCase } from "@/utils/format";

export function StatusBadge({ status }: { status: AssetStatus }) {
    return (
        <span className={`badge badge-status-${status}`}>
            <span className="badge-dot" aria-hidden="true" />
            {titleCase(status)}
        </span>
    );
}

export function ConditionBadge({ condition }: { condition: AssetCondition | null }) {
    if (!condition) return <span className="muted">—</span>;
    return <span className={`badge badge-condition-${condition}`}>{titleCase(condition)}</span>;
}

export function RoleBadge({ role }: { role: Role }) {
    return <span className={`badge badge-role-${role}`}>{titleCase(role)}</span>;
}

export function ActiveBadge({ active }: { active: boolean }) {
    return (
        <span className={`badge ${active ? "badge-active" : "badge-inactive"}`}>
            <span className="badge-dot" aria-hidden="true" />
            {active ? "Active" : "Inactive"}
        </span>
    );
}

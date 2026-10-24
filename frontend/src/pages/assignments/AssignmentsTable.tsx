import { Link } from "react-router-dom";
import type { Assignment } from "@/api/types";
import { ConditionBadge } from "@/components/Badges";
import { ROUTES } from "@/routes";
import { formatDate } from "@/utils/format";

interface AssignmentsTableProps {
    assignments: Assignment[];
    // Hide a column when the page is already scoped to that asset or user
    hideAsset?: boolean;
    hideUser?: boolean;
}

export default function AssignmentsTable({ assignments, hideAsset, hideUser }: AssignmentsTableProps) {
    return (
        <div className="table-wrap">
            <table className="table">
                <thead>
                    <tr>
                        {!hideAsset && <th>Asset</th>}
                        {!hideUser && <th>Assigned to</th>}
                        <th>Assigned</th>
                        <th>Returned</th>
                        <th>Condition</th>
                        <th>Handled by</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((a) => (
                        <tr key={a._id}>
                            {!hideAsset && (
                                <td>
                                    {a.asset ? (
                                        <Link to={ROUTES.toAsset(a.asset._id)} className="cell-primary">
                                            {a.asset.name}
                                            <span className="cell-secondary mono">{a.asset.assetTag}</span>
                                        </Link>
                                    ) : (
                                        <span className="muted">Deleted asset</span>
                                    )}
                                </td>
                            )}
                            {!hideUser && (
                                <td>
                                    {a.user ? (
                                        <Link to={ROUTES.toUser(a.user._id)} className="cell-primary">
                                            {a.user.name}
                                            <span className="cell-secondary">{a.user.email}</span>
                                        </Link>
                                    ) : (
                                        <span className="muted">Deleted user</span>
                                    )}
                                </td>
                            )}
                            <AssignmentCells assignment={a} />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// The columns shared with the asset history table
export function AssignmentCells({ assignment: a }: { assignment: Omit<Assignment, "asset"> }) {
    return (
        <>
            <td>{formatDate(a.assignedAt)}</td>
            <td>
                {a.returnedAt ? (
                    formatDate(a.returnedAt)
                ) : (
                    <span className="badge badge-status-assigned">Still out</span>
                )}
            </td>
            <td>
                <ConditionBadge condition={a.conditionOnAssign} />
                {a.conditionOnReturn && (
                    <>
                        {" → "}
                        <ConditionBadge condition={a.conditionOnReturn} />
                    </>
                )}
            </td>
            <td>
                <span className="cell-secondary">Out: {a.assignedBy?.name ?? "—"}</span>
                {a.returnedAt && <span className="cell-secondary">In: {a.receivedBy?.name ?? "—"}</span>}
            </td>
        </>
    );
}

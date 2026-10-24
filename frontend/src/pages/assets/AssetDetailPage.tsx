import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assetApi } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import PageHeader from "@/components/PageHeader";
import { ConditionBadge, StatusBadge } from "@/components/Badges";
import { EmptyState, ErrorMessage, Loading } from "@/components/Feedback";
import { AssignDialog, ReturnDialog } from "@/pages/assets/AssignmentDialogs";
import { AssignmentCells } from "@/pages/assignments/AssignmentsTable";
import { ROUTES } from "@/routes";
import { formatCurrency, formatDate, isWarrantyExpiringSoon } from "@/utils/format";

type Dialog = "assign" | "return" | null;

export default function AssetDetailPage() {
    const { id = "" } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [dialog, setDialog] = useState<Dialog>(null);

    const { data: asset, error, isPending, refetch } = useQuery({
        queryKey: queryKeys.asset(id),
        queryFn: () => assetApi.get(id),
    });

    const remove = useMutation({
        mutationFn: () => assetApi.remove(id),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: queryKeys.asset(id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.assets });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
            queryClient.invalidateQueries({ queryKey: queryKeys.categories });
            navigate(ROUTES.assets, { replace: true });
        },
    });

    if (isPending) return <Loading />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;

    const handleDelete = () => {
        if (window.confirm(`Delete ${asset.assetTag}? This can't be undone.`)) {
            remove.mutate();
        }
    };

    const canAssign = asset.status === "available";
    const isAssigned = asset.status === "assigned";
    const warrantySoon = isWarrantyExpiringSoon(asset.warrantyExpiry);

    return (
        <>
            <PageHeader
                back={{ to: ROUTES.assets, label: "Assets" }}
                title={asset.name}
                subtitle={
                    <>
                        <span className="mono">{asset.assetTag}</span> · <StatusBadge status={asset.status} />
                    </>
                }
                actions={
                    <>
                        {canAssign && (
                            <button type="button" className="btn" onClick={() => setDialog("assign")}>
                                Assign
                            </button>
                        )}
                        {isAssigned && (
                            <button type="button" className="btn" onClick={() => setDialog("return")}>
                                Return
                            </button>
                        )}
                        <Link to={ROUTES.toEditAsset(asset._id)} className="btn btn-ghost">
                            Edit
                        </Link>
                        {asset.history.length === 0 && (
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={remove.isPending}
                            >
                                Delete
                            </button>
                        )}
                    </>
                }
            />

            {remove.error && <ErrorMessage error={remove.error} />}

            <section className="card">
                <h2 className="card-title">Details</h2>
                <dl className="details">
                    <div>
                        <dt>Category</dt>
                        <dd>{asset.category?.name ?? "—"}</dd>
                    </div>
                    <div>
                        <dt>Condition</dt>
                        <dd>
                            <ConditionBadge condition={asset.condition} />
                        </dd>
                    </div>
                    <div>
                        <dt>Brand</dt>
                        <dd>{asset.brand ?? "—"}</dd>
                    </div>
                    <div>
                        <dt>Model number</dt>
                        <dd>{asset.modelNumber ?? "—"}</dd>
                    </div>
                    <div>
                        <dt>Serial number</dt>
                        <dd className="mono">{asset.serialNumber ?? "—"}</dd>
                    </div>
                    <div>
                        <dt>Purchase date</dt>
                        <dd>{formatDate(asset.purchaseDate)}</dd>
                    </div>
                    <div>
                        <dt>Purchase cost</dt>
                        <dd>{formatCurrency(asset.purchaseCost)}</dd>
                    </div>
                    <div>
                        <dt>Warranty expiry</dt>
                        <dd>
                            {formatDate(asset.warrantyExpiry)}
                            {warrantySoon && <span className="badge badge-status-maintenance" style={{ marginLeft: 8 }}>Soon</span>}
                        </dd>
                    </div>
                    <div>
                        <dt>Assigned to</dt>
                        <dd>
                            {asset.assignedTo ? (
                                <>
                                    <Link to={ROUTES.toUser(asset.assignedTo._id)}>{asset.assignedTo.name}</Link>
                                    <span className="cell-secondary">since {formatDate(asset.assignedAt)}</span>
                                </>
                            ) : (
                                "—"
                            )}
                        </dd>
                    </div>
                    <div>
                        <dt>Added</dt>
                        <dd>{formatDate(asset.createdAt)}</dd>
                    </div>
                </dl>
                {asset.notes && (
                    <>
                        <h3 className="field-label" style={{ marginTop: 22, marginBottom: 6 }}>
                            Notes
                        </h3>
                        <p className="notes">{asset.notes}</p>
                    </>
                )}
            </section>

            <section className="card">
                <h2 className="card-title">Assignment history</h2>
                {asset.history.length === 0 ? (
                    <EmptyState title="Never assigned" />
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Assigned</th>
                                    <th>Returned</th>
                                    <th>Condition</th>
                                    <th>Handled by</th>
                                </tr>
                            </thead>
                            <tbody>
                                {asset.history.map((entry) => (
                                    <tr key={entry._id}>
                                        <td>
                                            {entry.user ? (
                                                <Link to={ROUTES.toUser(entry.user._id)} className="cell-primary">
                                                    {entry.user.name}
                                                    <span className="cell-secondary">{entry.user.email}</span>
                                                </Link>
                                            ) : (
                                                <span className="muted">Deleted user</span>
                                            )}
                                            {(entry.notes || entry.returnNotes) && (
                                                <span className="cell-secondary">
                                                    {[entry.notes, entry.returnNotes].filter(Boolean).join(" · ")}
                                                </span>
                                            )}
                                        </td>
                                        <AssignmentCells assignment={entry} />
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {dialog === "assign" && <AssignDialog asset={asset} onClose={() => setDialog(null)} />}
            {dialog === "return" && <ReturnDialog asset={asset} onClose={() => setDialog(null)} />}
        </>
    );
}

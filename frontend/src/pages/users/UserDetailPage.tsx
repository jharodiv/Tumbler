import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignmentApi, userApi } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { useAuth } from "@/auth/useAuth";
import PageHeader from "@/components/PageHeader";
import { ActiveBadge, ConditionBadge, RoleBadge, StatusBadge } from "@/components/Badges";
import { EmptyState, ErrorMessage, Loading } from "@/components/Feedback";
import AssignmentsTable from "@/pages/assignments/AssignmentsTable";
import UserFormDialog from "@/pages/users/UserFormDialog";
import { ROUTES } from "@/routes";
import { formatDate } from "@/utils/format";

export default function UserDetailPage() {
    const { id = "" } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user: me } = useAuth();
    const [editing, setEditing] = useState(false);
    const isSelf = me?._id === id;

    const { data: user, error, isPending, refetch } = useQuery({
        queryKey: queryKeys.user(id),
        queryFn: () => userApi.get(id),
    });

    const historyFilters = { user: id, limit: 50 };
    const history = useQuery({
        queryKey: queryKeys.assignmentList(historyFilters),
        queryFn: () => assignmentApi.list(historyFilters),
    });

    const toggleActive = useMutation({
        mutationFn: (isActive: boolean) => userApi.update(id, { isActive }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
        },
    });

    const remove = useMutation({
        mutationFn: () => userApi.remove(id),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: queryKeys.user(id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.users });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
            navigate(ROUTES.users, { replace: true });
        },
    });

    if (isPending) return <Loading />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;

    const hasHistory = (history.data?.total ?? 0) > 0;
    const canDelete = !isSelf && user.assets.length === 0 && history.isSuccess && !hasHistory;

    const handleToggleActive = () => {
        const verb = user.isActive ? "Deactivate" : "Reactivate";
        if (window.confirm(`${verb} ${user.name}?${user.isActive ? " They will be signed out." : ""}`)) {
            toggleActive.mutate(!user.isActive);
        }
    };

    const handleDelete = () => {
        if (window.confirm(`Delete ${user.name}? This can't be undone.`)) {
            remove.mutate();
        }
    };

    const actionError = toggleActive.error ?? remove.error;

    return (
        <>
            <PageHeader
                back={{ to: ROUTES.users, label: "Users" }}
                title={user.name}
                subtitle={
                    <>
                        {user.email} · <RoleBadge role={user.role} /> <ActiveBadge active={user.isActive} />
                    </>
                }
                actions={
                    <>
                        <button type="button" className="btn btn-ghost" onClick={() => setEditing(true)}>
                            Edit
                        </button>
                        {!isSelf && (
                            <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={handleToggleActive}
                                disabled={toggleActive.isPending}
                            >
                                {user.isActive ? "Deactivate" : "Reactivate"}
                            </button>
                        )}
                        {canDelete && (
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

            {actionError && <ErrorMessage error={actionError} />}

            <section className="card">
                <h2 className="card-title">Profile</h2>
                <dl className="details">
                    <div>
                        <dt>Department</dt>
                        <dd>{user.department ?? "—"}</dd>
                    </div>
                    <div>
                        <dt>Position</dt>
                        <dd>{user.position ?? "—"}</dd>
                    </div>
                    <div>
                        <dt>Member since</dt>
                        <dd>{formatDate(user.createdAt)}</dd>
                    </div>
                </dl>
            </section>

            <section className="card">
                <h2 className="card-title">Currently holding ({user.assets.length})</h2>
                {user.assets.length === 0 ? (
                    <EmptyState title="No equipment assigned" />
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Condition</th>
                                    <th>Since</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.assets.map((asset) => (
                                    <tr key={asset._id}>
                                        <td>
                                            <Link to={ROUTES.toAsset(asset._id)} className="cell-primary">
                                                {asset.name}
                                            </Link>
                                            <span className="cell-secondary mono">{asset.assetTag}</span>
                                        </td>
                                        <td>{asset.category?.name ?? "—"}</td>
                                        <td>
                                            <StatusBadge status={asset.status} />
                                        </td>
                                        <td>
                                            <ConditionBadge condition={asset.condition} />
                                        </td>
                                        <td>{formatDate(asset.assignedAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="card">
                <h2 className="card-title">Assignment history</h2>
                {history.isPending ? (
                    <Loading />
                ) : history.error ? (
                    <ErrorMessage error={history.error} onRetry={history.refetch} />
                ) : history.data.assignments.length === 0 ? (
                    <EmptyState title="Never received equipment" />
                ) : (
                    <AssignmentsTable assignments={history.data.assignments} hideUser />
                )}
            </section>

            {editing && <UserFormDialog user={user} isSelf={isSelf} onClose={() => setEditing(false)} />}
        </>
    );
}

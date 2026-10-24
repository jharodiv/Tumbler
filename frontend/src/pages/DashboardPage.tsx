import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { ASSET_STATUSES } from "@/api/types";
import PageHeader from "@/components/PageHeader";
import { EmptyState, ErrorMessage, Loading } from "@/components/Feedback";
import { StatusBadge } from "@/components/Badges";
import AssignmentsTable from "@/pages/assignments/AssignmentsTable";
import { ROUTES } from "@/routes";
import { titleCase } from "@/utils/format";

export default function DashboardPage() {
    const { data, error, isPending, refetch } = useQuery({
        queryKey: queryKeys.dashboard,
        queryFn: dashboardApi.stats,
    });

    if (isPending) return <Loading />;
    if (error) return <ErrorMessage error={error} onRetry={refetch} />;

    const maxCategory = Math.max(1, ...data.assetsByCategory.map((row) => row.count));

    return (
        <>
            <PageHeader title="Dashboard" subtitle="An overview of your IT equipment." />

            <section className="stats" aria-label="Totals">
                <Link to={ROUTES.assets} className="stat">
                    <span className="stat-label">Total assets</span>
                    <span className="stat-value">{data.totalAssets}</span>
                </Link>
                <Link to={`${ROUTES.assets}?status=available`} className="stat">
                    <span className="stat-label">Available</span>
                    <span className="stat-value">{data.assetsByStatus.available}</span>
                </Link>
                <Link to={`${ROUTES.assets}?status=assigned`} className="stat">
                    <span className="stat-label">Assigned</span>
                    <span className="stat-value">{data.assetsByStatus.assigned}</span>
                </Link>
                <Link to={ROUTES.users} className="stat">
                    <span className="stat-label">Active users</span>
                    <span className="stat-value">{data.activeUsers}</span>
                </Link>
                <div className={`stat ${data.warrantyExpiringSoon > 0 ? "stat-warning" : ""}`}>
                    <span className="stat-label">Warranty ≤ 30 days</span>
                    <span className="stat-value">{data.warrantyExpiringSoon}</span>
                </div>
            </section>

            <div className="grid-2">
                <section className="card">
                    <h2 className="card-title">By status</h2>
                    <ul className="bars">
                        {ASSET_STATUSES.map((status) => {
                            const count = data.assetsByStatus[status];
                            const pct = data.totalAssets ? (count / data.totalAssets) * 100 : 0;
                            return (
                                <li key={status}>
                                    <Link to={`${ROUTES.assets}?status=${status}`} className="bar-row">
                                        <StatusBadge status={status} />
                                        <span className="bar-track" aria-hidden="true">
                                            <span className="bar-fill" style={{ width: `${pct}%` }} />
                                        </span>
                                        <span className="bar-count">{count}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </section>

                <section className="card">
                    <h2 className="card-title">By category</h2>
                    {data.assetsByCategory.length === 0 ? (
                        <EmptyState title="No categories in use yet">
                            <Link to={ROUTES.categories}>Create a category</Link> to start adding assets.
                        </EmptyState>
                    ) : (
                        <ul className="bars">
                            {data.assetsByCategory.map((row) => (
                                <li key={row.categoryId}>
                                    <Link to={ROUTES.toAssetsInCategory(row.categoryId)} className="bar-row">
                                        <span className="cell-primary">{titleCase(row.name)}</span>
                                        <span className="bar-track" aria-hidden="true">
                                            <span
                                                className="bar-fill"
                                                style={{ width: `${(row.count / maxCategory) * 100}%` }}
                                            />
                                        </span>
                                        <span className="bar-count">{row.count}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            <section className="card">
                <div className="card-header">
                    <h2 className="card-title">Recent assignments</h2>
                    <Link to={ROUTES.assignments} className="btn btn-ghost btn-sm">
                        View all
                    </Link>
                </div>
                {data.recentAssignments.length === 0 ? (
                    <EmptyState title="No assets have been handed out yet" />
                ) : (
                    <AssignmentsTable assignments={data.recentAssignments} />
                )}
            </section>
        </>
    );
}

import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { assetApi, categoryApi } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import {
    ASSET_CONDITIONS,
    ASSET_STATUSES,
    type AssetCondition,
    type AssetFilters,
    type AssetStatus,
} from "@/api/types";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import { ConditionBadge, StatusBadge } from "@/components/Badges";
import { EmptyState, ErrorMessage, Loading } from "@/components/Feedback";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ROUTES } from "@/routes";
import { titleCase } from "@/utils/format";

const PAGE_SIZE = 20;

export default function AssetsPage() {
    const navigate = useNavigate();
    // Filters live in the URL so they survive reloads and can be linked to
    const [params, setParams] = useSearchParams();
    const [search, setSearch] = useState(params.get("search") ?? "");
    const debouncedSearch = useDebouncedValue(search.trim());

    const filters: AssetFilters = {
        page: Number(params.get("page")) || 1,
        limit: PAGE_SIZE,
        status: (params.get("status") as AssetStatus) || undefined,
        condition: (params.get("condition") as AssetCondition) || undefined,
        category: params.get("category") || undefined,
        search: params.get("search") || undefined,
    };

    const setParam = (key: string, value: string) => {
        setParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                if (value) next.set(key, value);
                else next.delete(key);
                // Any filter change starts from the first page again
                if (key !== "page") next.delete("page");
                return next;
            },
            { replace: key === "search" }
        );
    };

    useEffect(() => {
        if (debouncedSearch !== (params.get("search") ?? "")) {
            setParam("search", debouncedSearch);
        }
        // Only react to the debounced text, not to every params change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const assets = useQuery({
        queryKey: queryKeys.assetList(filters),
        queryFn: () => assetApi.list(filters),
        placeholderData: keepPreviousData,
    });

    const categories = useQuery({ queryKey: queryKeys.categories, queryFn: categoryApi.list });

    const hasFilters = Boolean(filters.status || filters.condition || filters.category || filters.search);

    return (
        <>
            <PageHeader
                title="Assets"
                subtitle="Laptops, monitors, phones and everything else you hand out."
                actions={
                    <Link to={ROUTES.newAsset} className="btn">
                        + New asset
                    </Link>
                }
            />

            <div className="toolbar">
                <input
                    className="input"
                    type="search"
                    placeholder="Search tag, name, serial, brand or model…"
                    aria-label="Search assets"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="select"
                    aria-label="Filter by status"
                    value={filters.status ?? ""}
                    onChange={(e) => setParam("status", e.target.value)}
                >
                    <option value="">All statuses</option>
                    {ASSET_STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {titleCase(s)}
                        </option>
                    ))}
                </select>
                <select
                    className="select"
                    aria-label="Filter by condition"
                    value={filters.condition ?? ""}
                    onChange={(e) => setParam("condition", e.target.value)}
                >
                    <option value="">All conditions</option>
                    {ASSET_CONDITIONS.map((c) => (
                        <option key={c} value={c}>
                            {titleCase(c)}
                        </option>
                    ))}
                </select>
                <select
                    className="select"
                    aria-label="Filter by category"
                    value={filters.category ?? ""}
                    onChange={(e) => setParam("category", e.target.value)}
                >
                    <option value="">All categories</option>
                    {categories.data?.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                {hasFilters && (
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => {
                            setSearch("");
                            setParams({});
                        }}
                    >
                        Clear
                    </button>
                )}
            </div>

            {assets.isPending ? (
                <Loading />
            ) : assets.error ? (
                <ErrorMessage error={assets.error} onRetry={assets.refetch} />
            ) : assets.data.assets.length === 0 ? (
                <EmptyState title={hasFilters ? "No assets match these filters" : "No assets yet"}>
                    {!hasFilters && <Link to={ROUTES.newAsset}>Add your first asset</Link>}
                </EmptyState>
            ) : (
                <>
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Condition</th>
                                    <th>Assigned to</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.data.assets.map((asset) => (
                                    <tr
                                        key={asset._id}
                                        className="clickable"
                                        onClick={() => navigate(ROUTES.toAsset(asset._id))}
                                    >
                                        <td>
                                            <Link
                                                to={ROUTES.toAsset(asset._id)}
                                                className="cell-primary"
                                                onClick={(e) => e.stopPropagation()}
                                            >
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
                                        <td>
                                            {asset.assignedTo ? (
                                                <>
                                                    <span className="cell-primary">{asset.assignedTo.name}</span>
                                                    <span className="cell-secondary">
                                                        {asset.assignedTo.department ?? asset.assignedTo.email}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="muted">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        page={assets.data.page}
                        totalPages={assets.data.totalPages}
                        total={assets.data.total}
                        onChange={(page) => setParam("page", String(page))}
                    />
                </>
            )}
        </>
    );
}

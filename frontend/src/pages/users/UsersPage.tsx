import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { ROLES, type Role, type UserFilters } from "@/api/types";
import PageHeader from "@/components/PageHeader";
import { ActiveBadge, RoleBadge } from "@/components/Badges";
import { EmptyState, ErrorMessage, Loading } from "@/components/Feedback";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import UserFormDialog from "@/pages/users/UserFormDialog";
import { ROUTES } from "@/routes";
import { titleCase } from "@/utils/format";

export default function UsersPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [role, setRole] = useState<Role | "">("");
    const [active, setActive] = useState<"" | "true" | "false">("true");
    const [creating, setCreating] = useState(false);
    const debouncedSearch = useDebouncedValue(search.trim());

    const filters: UserFilters = {
        search: debouncedSearch || undefined,
        role: role || undefined,
        isActive: active === "" ? undefined : active === "true",
    };

    const { data, error, isPending, refetch } = useQuery({
        queryKey: queryKeys.userList(filters),
        queryFn: () => userApi.list(filters),
        placeholderData: keepPreviousData,
    });

    return (
        <>
            <PageHeader
                title="Users"
                subtitle="People who can hold equipment, and the admins who manage it."
                actions={
                    <button type="button" className="btn" onClick={() => setCreating(true)}>
                        + New user
                    </button>
                }
            />

            <div className="toolbar">
                <input
                    className="input"
                    type="search"
                    placeholder="Search name, email or department…"
                    aria-label="Search users"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="select"
                    aria-label="Filter by role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role | "")}
                >
                    <option value="">All roles</option>
                    {ROLES.map((r) => (
                        <option key={r} value={r}>
                            {titleCase(r)}
                        </option>
                    ))}
                </select>
                <select
                    className="select"
                    aria-label="Filter by state"
                    value={active}
                    onChange={(e) => setActive(e.target.value as "" | "true" | "false")}
                >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                    <option value="">Everyone</option>
                </select>
            </div>

            {isPending ? (
                <Loading />
            ) : error ? (
                <ErrorMessage error={error} onRetry={refetch} />
            ) : data.length === 0 ? (
                <EmptyState title="No users found" />
            ) : (
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th className="num">Assets</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((user) => (
                                <tr key={user._id} className="clickable" onClick={() => navigate(ROUTES.toUser(user._id))}>
                                    <td>
                                        <Link
                                            to={ROUTES.toUser(user._id)}
                                            className="cell-primary"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {user.name}
                                        </Link>
                                        <span className="cell-secondary">{user.email}</span>
                                    </td>
                                    <td>
                                        {user.department ?? "—"}
                                        {user.position && <span className="cell-secondary">{user.position}</span>}
                                    </td>
                                    <td>
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td>
                                        <ActiveBadge active={user.isActive} />
                                    </td>
                                    <td className="num">{user.assetCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {creating && (
                <UserFormDialog onClose={() => setCreating(false)} onSaved={(user) => navigate(ROUTES.toUser(user._id))} />
            )}
        </>
    );
}

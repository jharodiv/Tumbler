import type { AssetFilters, AssignmentFilters, UserFilters } from "@/api/types";

// Central list of react-query keys so mutations can invalidate the right caches
export const queryKeys = {
    dashboard: ["dashboard"] as const,
    assets: ["assets"] as const,
    assetList: (filters: AssetFilters) => ["assets", "list", filters] as const,
    asset: (id: string) => ["assets", "detail", id] as const,
    assignments: ["assignments"] as const,
    assignmentList: (filters: AssignmentFilters) => ["assignments", "list", filters] as const,
    users: ["users"] as const,
    userList: (filters: UserFilters) => ["users", "list", filters] as const,
    user: (id: string) => ["users", "detail", id] as const,
    categories: ["categories"] as const,
};

import api, { unwrap } from "@/api/client";
import type {
    ApiResponse,
    AssetDetail,
    Asset,
    AssetFilters,
    AssetInput,
    AssignAssetInput,
    Assignment,
    AssignmentFilters,
    Category,
    CategoryInput,
    CategoryListItem,
    CreateUserInput,
    DashboardStats,
    PaginatedAssets,
    PaginatedAssignments,
    ReturnAssetInput,
    UpdateUserInput,
    User,
    UserDetail,
    UserFilters,
    UserListItem,
} from "@/api/types";

/* ── Auth ── */

export const authApi = {
    login: (email: string, password: string) =>
        unwrap(api.post<ApiResponse<User>>("/auth/admin/login", { email, password })),
    logout: () => api.post("/auth/logout"),
    me: () => unwrap(api.get<ApiResponse<User>>("/auth/me")),
};

/* ── Dashboard ── */

export const dashboardApi = {
    stats: () => unwrap(api.get<ApiResponse<DashboardStats>>("/admin/dashboard/stats")),
};

/* ── Assets ── */

export const assetApi = {
    list: (filters: AssetFilters = {}) =>
        unwrap(api.get<ApiResponse<PaginatedAssets>>("/admin/assets/getAssets", { params: filters })),
    get: (id: string) =>
        unwrap(api.get<ApiResponse<AssetDetail>>(`/admin/assets/getAssetById/${id}`)),
    create: (data: AssetInput) =>
        unwrap(api.post<ApiResponse<Asset>>("/admin/assets/create", data)),
    update: (id: string, data: Partial<AssetInput>) =>
        unwrap(api.put<ApiResponse<Asset>>(`/admin/assets/update/${id}`, data)),
    remove: (id: string) =>
        unwrap(api.delete<ApiResponse<Asset>>(`/admin/assets/delete/${id}`)),
};

/* ── Assignments ── */

export const assignmentApi = {
    list: (filters: AssignmentFilters = {}) =>
        unwrap(
            api.get<ApiResponse<PaginatedAssignments>>("/admin/assignments/getAssignments", {
                params: filters,
            })
        ),
    assign: (data: AssignAssetInput) =>
        unwrap(api.post<ApiResponse<Assignment>>("/admin/assignments/assign", data)),
    return: (data: ReturnAssetInput) =>
        unwrap(api.post<ApiResponse<Assignment>>("/admin/assignments/return", data)),
};

/* ── Users ── */

export const userApi = {
    list: (filters: UserFilters = {}) =>
        unwrap(api.get<ApiResponse<UserListItem[]>>("/admin/user/getUsers", { params: filters })),
    get: (id: string) => unwrap(api.get<ApiResponse<UserDetail>>(`/admin/user/${id}`)),
    create: (data: CreateUserInput) =>
        unwrap(api.post<ApiResponse<User>>("/admin/user/createUser", data)),
    update: (id: string, data: UpdateUserInput) =>
        unwrap(api.put<ApiResponse<User>>(`/admin/user/updateUser/${id}`, data)),
    remove: (id: string) =>
        unwrap(api.delete<ApiResponse<User>>(`/admin/user/deleteUser/${id}`)),
};

/* ── Categories ── */

export const categoryApi = {
    list: () =>
        unwrap(api.get<ApiResponse<CategoryListItem[]>>("/admin/categories/getCategories")),
    create: (data: CategoryInput) =>
        unwrap(api.post<ApiResponse<Category>>("/admin/categories/create", data)),
    update: (id: string, data: Partial<CategoryInput>) =>
        unwrap(api.put<ApiResponse<Category>>(`/admin/categories/update/${id}`, data)),
    remove: (id: string) =>
        unwrap(api.delete<ApiResponse<Category>>(`/admin/categories/delete/${id}`)),
};

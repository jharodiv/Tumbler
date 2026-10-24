// Mirrors the models and responses of tumbler-backend-typescript.
// Dates arrive as ISO strings, ids as Mongo ObjectId strings in `_id`.

export const ASSET_STATUSES = ["available", "assigned", "maintenance", "retired", "lost"] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

// "assigned" is only set through the assign endpoint, so it can't be picked by hand
export const MANUAL_ASSET_STATUSES = ["available", "maintenance", "retired", "lost"] as const;
export type ManualAssetStatus = (typeof MANUAL_ASSET_STATUSES)[number];

// Where an asset can go when it is handed back
export const RETURN_ASSET_STATUSES = ["available", "maintenance", "retired"] as const;
export type ReturnAssetStatus = (typeof RETURN_ASSET_STATUSES)[number];

export const ASSET_CONDITIONS = ["new", "good", "fair", "poor", "damaged"] as const;
export type AssetCondition = (typeof ASSET_CONDITIONS)[number];

export const ROLES = ["admin", "user"] as const;
export type Role = (typeof ROLES)[number];

export interface ApiResponse<T> {
    data: T;
    message: string;
}

export interface ApiErrorBody {
    message: string;
    errors?: string[];
}

interface Timestamps {
    createdAt: string;
    updatedAt: string;
}

export interface Paginated {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/* ── Users ── */

export interface User extends Timestamps {
    _id: string;
    name: string;
    email: string;
    role: Role;
    department: string | null;
    position: string | null;
    isActive: boolean;
}

export interface UserListItem extends User {
    assetCount: number;
}

export interface UserDetail extends User {
    assets: (Omit<Asset, "assignedTo"> & { assignedTo: string | null })[];
}

// Populated user reference; which fields are present depends on the endpoint
export interface UserRef {
    _id: string;
    name: string;
    email: string;
    department?: string | null;
    position?: string | null;
}

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    role?: Role;
    department?: string;
    position?: string;
}

// null clears department / position
export interface UpdateUserInput {
    name?: string;
    email?: string;
    password?: string;
    role?: Role;
    department?: string | null;
    position?: string | null;
    isActive?: boolean;
}

export interface UserFilters {
    search?: string;
    role?: Role;
    isActive?: boolean;
}

/* ── Categories ── */

export interface Category extends Timestamps {
    _id: string;
    name: string;
    description: string | null;
}

export interface CategoryListItem extends Category {
    assetCount: number;
}

export interface CategoryInput {
    name: string;
    description?: string | null;
}

/* ── Assets ── */

export interface Asset extends Timestamps {
    _id: string;
    assetTag: string;
    name: string;
    category: { _id: string; name: string } | null;
    brand: string | null;
    modelNumber: string | null;
    serialNumber: string | null;
    purchaseDate: string | null;
    purchaseCost: number | null;
    warrantyExpiry: string | null;
    status: AssetStatus;
    condition: AssetCondition;
    notes: string | null;
    assignedTo: UserRef | null;
    assignedAt: string | null;
}

export interface AssetDetail extends Asset {
    history: AssetHistoryEntry[];
}

export interface PaginatedAssets extends Paginated {
    assets: Asset[];
}

// Dates are sent as YYYY-MM-DD strings; the backend parses them
export interface AssetInput {
    assetTag: string;
    name: string;
    category: string;
    brand?: string | null;
    modelNumber?: string | null;
    serialNumber?: string | null;
    purchaseDate?: string | null;
    purchaseCost?: number | null;
    warrantyExpiry?: string | null;
    status?: ManualAssetStatus;
    condition?: AssetCondition;
    notes?: string | null;
}

export interface AssetFilters {
    page?: number;
    limit?: number;
    status?: AssetStatus;
    condition?: AssetCondition;
    category?: string;
    assignedTo?: string;
    search?: string;
}

/* ── Assignments ── */

export interface Assignment extends Timestamps {
    _id: string;
    asset: { _id: string; assetTag: string; name: string; status: AssetStatus; condition: AssetCondition } | null;
    user: UserRef | null;
    assignedBy: UserRef | null;
    assignedAt: string;
    conditionOnAssign: AssetCondition;
    notes: string | null;
    returnedAt: string | null;
    receivedBy: UserRef | null;
    conditionOnReturn: AssetCondition | null;
    returnNotes: string | null;
}

// Inside an asset's history the asset itself isn't populated
export type AssetHistoryEntry = Omit<Assignment, "asset"> & { asset: string };

export interface PaginatedAssignments extends Paginated {
    assignments: Assignment[];
}

export interface AssignmentFilters {
    page?: number;
    limit?: number;
    asset?: string;
    user?: string;
    // true = still with the user, false = already returned
    active?: boolean;
}

export interface AssignAssetInput {
    assetId: string;
    userId: string;
    condition?: AssetCondition;
    notes?: string;
}

export interface ReturnAssetInput {
    assetId: string;
    status?: ReturnAssetStatus;
    condition?: AssetCondition;
    notes?: string;
}

/* ── Dashboard ── */

export interface DashboardStats {
    totalAssets: number;
    assetsByStatus: Record<AssetStatus, number>;
    assetsByCategory: { categoryId: string; name: string; count: number }[];
    activeUsers: number;
    warrantyExpiringSoon: number;
    recentAssignments: Assignment[];
}

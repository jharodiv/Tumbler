export const ROUTES = {
    login: "/login",
    dashboard: "/",
    assets: "/assets",
    newAsset: "/assets/new",
    asset: "/assets/:id",
    editAsset: "/assets/:id/edit",
    assignments: "/assignments",
    users: "/users",
    user: "/users/:id",
    categories: "/categories",

    // Helpers
    toAsset: (id: string) => `/assets/${id}`,
    toEditAsset: (id: string) => `/assets/${id}/edit`,
    toUser: (id: string) => `/users/${id}`,
    toAssetsInCategory: (categoryId: string) => `/assets?category=${categoryId}`,
} as const;

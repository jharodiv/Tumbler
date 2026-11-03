import axios, { AxiosError } from "axios";
import type { ApiErrorBody, ApiResponse } from "@/api/types";

// The backend serves every route under /api/v1 (see tumbler-backend-typescript src/routes/index.ts)
const API_PREFIX = "/api/v1";

// VITE_API_BASE_URL may be just the backend's origin (https://example.com) or already include
// the prefix (https://example.com/api/v1, /api/v1). Either way the prefix ends up exactly once.
// Unset means "" and resolves to /api/v1, which goes through the Vite dev proxy.
function resolveBaseUrl(raw: string | undefined): string {
    const base = (raw ?? "").trim().replace(/\/+$/, "");
    return base.endsWith(API_PREFIX) ? base : `${base}${API_PREFIX}`;
}

// The backend authenticates with an httpOnly session cookie, so every request
// must send credentials. In development /api is proxied by Vite (see vite.config.ts).
const api = axios.create({
    baseURL: resolveBaseUrl(import.meta.env.VITE_API_BASE_URL),
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Requests whose 401 is an expected answer rather than an expired session
const AUTH_PATHS = ["/auth/me", "/auth/admin/login", "/auth/logout"];

let onUnauthorized: (() => void) | null = null;

// Lets the auth provider react when the session expires or is revoked mid-use
export function setUnauthorizedHandler(handler: (() => void) | null) {
    onUnauthorized = handler;
}

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const url = error.config?.url ?? "";

        if (error.response?.status === 401 && !AUTH_PATHS.some((path) => url.startsWith(path))) {
            onUnauthorized?.();
        }

        return Promise.reject(error);
    }
);

// Unwraps the { data, message } envelope every endpoint returns
export async function unwrap<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
    const response = await request;
    return response.data.data;
}

// Turns any thrown value into a message that can be shown to the user
export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
    if (axios.isAxiosError<ApiErrorBody>(err)) {
        if (!err.response) {
            return "Can't reach the server. Check that the backend is running.";
        }

        const body = err.response.data;

        if (body?.errors?.length) {
            return body.errors.join(". ");
        }

        return body?.message || fallback;
    }

    return err instanceof Error ? err.message : fallback;
}

export function getErrorStatus(err: unknown): number | undefined {
    return axios.isAxiosError(err) ? err.response?.status : undefined;
}

export default api;

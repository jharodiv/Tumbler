import axios, { AxiosError } from "axios";
import type { ApiErrorBody, ApiResponse } from "@/api/types";

// The backend authenticates with an httpOnly session cookie, so every request
// must send credentials. In development /api is proxied by Vite (see vite.config.ts).
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
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

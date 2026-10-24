import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { setUnauthorizedHandler } from "@/api/client";
import { authApi } from "@/api/endpoints";
import type { User } from "@/api/types";
import { AuthContext } from "@/auth/authContextValue";

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<User | null>(null);
    const [checking, setChecking] = useState(true);

    // The session lives in an httpOnly cookie, so ask the server who we are
    useEffect(() => {
        authApi
            .me()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setChecking(false));
    }, []);

    // Any 401 from an admin endpoint means the session expired or was revoked
    useEffect(() => {
        setUnauthorizedHandler(() => {
            setUser(null);
            queryClient.clear();
        });

        return () => setUnauthorizedHandler(null);
    }, [queryClient]);

    const login = useCallback(async (email: string, password: string) => {
        const loggedIn = await authApi.login(email, password);
        setUser(loggedIn);
        return loggedIn;
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } finally {
            setUser(null);
            queryClient.clear();
        }
    }, [queryClient]);

    const value = useMemo(() => ({ user, checking, login, logout }), [user, checking, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

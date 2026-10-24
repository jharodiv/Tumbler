import { createContext } from "react";
import type { User } from "@/api/types";

export interface AuthContextValue {
    user: User | null;
    // true until the initial /auth/me check has finished
    checking: boolean;
    login: (email: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
}

// Kept apart from the provider so React Fast Refresh can hot-reload AuthContext.tsx
export const AuthContext = createContext<AuthContextValue | null>(null);

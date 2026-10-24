import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getErrorStatus } from "@/api/client";
import { AuthProvider } from "@/auth/AuthContext";
import App from "@/App";
import "./index.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            // Client errors (404, 401, validation) won't fix themselves on retry
            retry: (failureCount, error) => {
                const status = getErrorStatus(error);
                return (status === undefined || status >= 500) && failureCount < 2;
            },
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>
);

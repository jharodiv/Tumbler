import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { ROUTES } from "@/routes";
import { Loading } from "@/components/Feedback";

// Renders the nested routes only for a logged-in admin
export default function ProtectedRoute() {
    const { user, checking } = useAuth();
    const location = useLocation();

    if (checking) {
        return <Loading fullScreen />;
    }

    if (!user) {
        return <Navigate to={ROUTES.login} replace state={{ from: location.pathname + location.search }} />;
    }

    return <Outlet />;
}

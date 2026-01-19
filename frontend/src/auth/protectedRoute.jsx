import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authContext";


export default function ProtectedRoute({children})
{
    const { isAuthenticated } = useContext(AuthContext);

    if(isAuthenticated)
    {
        return <Navigate to="/" replace />;
    }

    return children;
}
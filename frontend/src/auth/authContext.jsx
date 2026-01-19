import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();


export function AuthProvider ({children}){
    const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => 
    {
        const token = localStorage.getItem("access");
        if (token) setIsAuthenticated(true);

    }, []);


    const loginUser = () => setIsAuthenticated(true);
    const logoutUser = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setIsAuthenticated(false);
    };


    return (
        <AuthContext.Provider
        value={{ isAuthenticated, loginUser, logoutUser }}
        >
        {children}
        </AuthContext.Provider>
    );
}
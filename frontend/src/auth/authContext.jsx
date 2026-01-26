import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();


export function AuthProvider ({children}){
    const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => 
    {
        const token = localStorage.getItem("access");
        if (token) setAuthenticated(true);

    }, []);


    const loginUser = () => setAuthenticated(true);
    const logoutUser = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setAuthenticated(false);
    };


    return (
        <AuthContext.Provider
        value={{ isAuthenticated, loginUser, logoutUser }}
        >
        {children}
        </AuthContext.Provider>
    );
}
import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();


export function AuthProvider ({children}){
    const [isAuthenticated, setAuthenticated] = useState(() =>{
        return localStorage.getItem("access") || null;
    });

    const loginUser = (access) => {
        setAuthenticated(access);
        localStorage.setItem("access", access)
    }

    const logoutUser = () => {
        setAuthenticated(null);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        removeToken();
        window.location.href = '/';
    };  


    return (
        <AuthContext.Provider
        value={{ isAuthenticated, loginUser, logoutUser }}
        >
        {children}
        </AuthContext.Provider>
    );
}
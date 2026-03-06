import { createContext, useState, useEffect } from "react";
import { attachToken } from "../api/axios";

export const AuthContext = createContext();


export function AuthProvider ({children}){
    const [isAuthenticated, setAuthenticated] = useState(() =>{
        const token = localStorage.getItem("access");
        if (token) attachToken(token);
        return token || null
    });

    const loginUser = (access) => {
        setAuthenticated(access);
        localStorage.setItem("access", access)
        attachToken();
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
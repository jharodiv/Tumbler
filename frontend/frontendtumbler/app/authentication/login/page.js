"use client";

import { use, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
//import { loginUser } from "@/lib/authentication";
import { loginUser } from "@/lib/auth";

export default function LoginPage(){
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try{
            const data = await loginUser(username, password);


            //Store tokens
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_tooken", data.refresh);

            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return(
        <div className = "flex items-center justify-center min-h-screen bg-gray-100">
            <div className = "w-full max-w-md p-8 bg-white rounded shadow">
                <h2 className = "text-2xl font-bold mb-6 text-center text-black"> Login </h2>

                { error && (
                    <p className = "text-red-500 text-center mb-4">{error}</p>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border rounded text-black" required/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded text-black" required/>
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"> Login </button>
                </form>
            </div>
        </div>
    )
}
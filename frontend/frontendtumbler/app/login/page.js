"use client";

import { use, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage(){
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/login/", {
                username,
                password,
            });

            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);

            router.push("/dashboard");
        } catch (err){
            console.error(err);
            setError("Invalid username or password");
        }
    };

    return(
        <div className = "flex items-center justify-center min-h-screen bg-grat-100">
            <div className = "w-full max-w-md p-8 bg-white rounded shadow">
                <h2 className = "text-2xl font-bold mb-6 text-center"> Login </h2>

                { error && (
                    <p className = "text-red-500 text-center mb-4">{error}</p>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type = "text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border rounded" required/>
                    <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded" required/>
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"> Login </button>
                </form>
            </div>
        </div>
    )
}
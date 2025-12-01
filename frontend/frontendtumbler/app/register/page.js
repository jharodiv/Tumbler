"use client";


import { useState } from "react";

export default function RegisterPage(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");


        try {
            const response = await fetch("http://127.0.0.1:8000/register/", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username, password})
            });

            const data = await response.json();

            if(!response.ok){
                setError(data.username?.[0] || "Registration Failed");
                return;
            }

            setMessage("Registration successful! You may now log in.");
            setUsername("");
            setPassword("");
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounder shadow">
                <h2 className="text-2xl font-bold mb-6 text-center text-black"> Register </h2>

                {message && <p className="text-green-600 mb-3">{message}</p>}
                {error && <p className="text-red-600 mb-3">{error}</p>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 border round text-black" required></input>

                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded text-black" required></input>

                    <button type="submit" className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"> Register </button>
                </form>
            </div>
        </div>
    )
}
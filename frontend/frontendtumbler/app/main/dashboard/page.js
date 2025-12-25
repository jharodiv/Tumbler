"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("access");
            if (!token) {
                setError("Not logged in");
                return;
            }

            const res = await fetch("http://127.0.0.1:8000/profile/", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.detail || "Failed to fetch profile");
                return;
            }

            setUser(data);
        };

        fetchProfile();
    }, []);

    if (error) return <p className="text-red-500">{error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
}

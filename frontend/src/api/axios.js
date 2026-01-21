import axios from "axios";

const api = axios.create({
    //baseURL: "http://127.0.0.1:8000/api/"
    baseURL: "https://psychic-space-acorn-4j7jq659v7q524v5-8000.app.github.dev/api/",
    headers:{
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use((config) =>
{
    const token = localStorage.getItem("access");
    if (token)
    {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;

//This how react talks securely to Django
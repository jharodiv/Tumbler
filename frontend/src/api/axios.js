import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers:{
        "Content-Type": "application/json"
    }
});

export const attachToken = (token) =>{
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeToken = () =>{
    delete api.defaults.headers.common["Authorization"];
}

export default api;

//This how react talks securely to Django
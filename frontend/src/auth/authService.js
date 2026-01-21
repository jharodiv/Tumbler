import api from "../api/axios";

export const login = async (username, password) => 
{
    const response = await api.post("token/", 
        {
            username,
            password,
        }
    );

    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    return response.data;   
}
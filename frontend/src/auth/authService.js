import api from "../api/axios";

export const login = async (username, password) => 
{
    const response = await api.post("user/login/", 
        {
            username,
            password,
        }
    );

    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    return response.data;   
}

export const register = async (username, email, password) =>
{
    const response = await api.post("user/register/",
        {
            username,
            email,
            password
        }
    );

    if (response.data.access && response.data.refresh){
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);

    }

    return response.data
}
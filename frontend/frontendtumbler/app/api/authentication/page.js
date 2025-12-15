
// Registration API
export const registerUser = async (username, password) => {
    const response = await fetch ("http://127.0.0.1:8000/api_v1/register/",
        {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password}),
        }
    );

    if (!response.ok){
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || "Registration Failed");
    }

    return response.json();
}


//Login API

export const loginUser = async (username, password) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/login/", {
            method: "POST",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password}), 
        });

        if (!response.ok){
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.detail || "Invalid username or password");
        }

        return response.json();
    } catch (err) {
        throw err;
    }
}; 

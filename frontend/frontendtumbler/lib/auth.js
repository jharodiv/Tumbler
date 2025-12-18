export const loginUser = async (username , password) => 
{
    const res = await fetch ("/api/authentication", {
        method: "POST",
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {
                username,
                password
            }
        )
    });

    const data = await res.json();

    if(!res.ok)
    {
        throw new Error(data.detail || "Invalid Username or Password")
    }
    return data;
}
import { useState } from "react";
import { login } from "./authService";


function Login()
{ 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = async (e) => 
    {
        e.preventDefault();

        try
        {
            const data = await login(username, password);
            console.log(data)
            alert("Login Successful");
        } catch (err)
        {
            console.log(data)
            alert("Login Failed");
        }
    };


    return (
        <form onSubmit={handleSubmit}>
        <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        </form>
    );
}

export default Login;
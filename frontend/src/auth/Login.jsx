import { useContext, useState } from "react";
import { login } from "./authService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";


function Login()
{ 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()
    const {loginUser} = useContext(AuthContext);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await login(username, password); 
            loginUser(); 
            navigate("/assets");
            //alert("Login Successful");
        } catch (err) {
            console.error(err);
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
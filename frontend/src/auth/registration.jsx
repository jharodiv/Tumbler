import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./authContext";
import { attachToken } from "../api/axios";
import { register, login } from "./authService";
import AuthPage from "./UI/AuthPage";



export default function Registration(){

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState (null);
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (username,password,email) =>{
        e.preventDefault();
        setError("");

        try
        {
            await register (username,email,password);
            const data = await login(username,password);
            loginUser(data.access);
            attachToken(data.access);

            navigate("/assets");
        }
        catch (err){
            console.error(err);
            setError(err.response?.data?.detail || "Registration failed");
        }
    }

    return <AuthPage type="signup" onSubmit={onSubmit}/>;
}
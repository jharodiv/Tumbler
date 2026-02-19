import { useContext, useState } from "react";
import { login } from "./authService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";
import { attachToken } from "../api/axios";
import AuthPage from "./UI/AuthPage";


export default function Login()
{ 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()
    const {loginUser} = useContext(AuthContext);
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await login(username, password); 
            loginUser(data.access); 
            attachToken(data.access);
            
            navigate("/assets");
            alert("Login Successful");
        } catch (err) {
            console.error(err);
            setError("Login Failed");
        }
    };

    return <AuthPage type="login" onSubmit={onSubmit}/>;
}
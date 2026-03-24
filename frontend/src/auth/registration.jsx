import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./authContext";
import { register, login } from "./authService";
import AuthPage from "./UI/AuthPage";



export default function Registration(){

    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error,setError] = useState("")

    const onSubmit = async (username,password,email) =>{
        setError("");

        try{
            await register(username.trim(), email.trim(), password);

            try{
                const data = await login(username.trim(), password);
                loginUser(data.access);
                navigate("/assets");
            } catch (err){
                navigate("/login", {state: {message: "Account Created. Please Login."}});
            }
        } catch (err){
            console.error(err);
            setError(err.response?.data?.detail || "Registration failed");
        }
    }

    return <AuthPage type="signup" onSubmit={onSubmit} error={error}/>;
}
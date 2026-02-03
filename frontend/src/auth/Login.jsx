import { useContext, useState } from "react";
import styles from "./Login.module.css"
import { login } from "./authService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";
import { attachToken } from "../api/axios";


function Login()
{ 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()
    const {loginUser} = useContext(AuthContext);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await login(username, password); 
            loginUser(data.access); 
            attachToken(data.access);
            
            navigate("/assets");
            //alert("Login Successful");
        } catch (err) {
            console.error(err);
            setError("Login Failed");
        }
    };


    return(
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.heading}>Welcome Back</h2>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                    className={styles.inputField}
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    />
                    <input
                    type="password"
                    className={styles.inputField}
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>setPassword(e.target.value)}
                    />
                    <button type="submit" className={styles.button}>
                        Login
                    </button>
                </form>
                <p className={styles.footer}>
                    Don't have an account? <a href="/">Sign up</a>
                </p>
            </div>
        </div>
    )
}

export default Login;
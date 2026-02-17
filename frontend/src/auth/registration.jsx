import { useContext, useState } from "react";
import styles from "./Registration.module.css";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./authContext";
import { attachToken } from "../api/axios";
import { register, login } from "./authService";



export default function Registration(){

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState (null);
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();
    //const [success, setSuccess] = useState(false);


    /*const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };*/

    /*const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null)

        try {
            const response = await fetch (
                import.meta.env.VITE_REGISTRATION_FORM_URL,
                {
                    method: "POST",
                    headers:{
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok){
                throw new Error("Registration failed");
            }

            setSuccess(true)
        }
        catch (err) {
            setError(err.message)        }
    };*/

    const handleSubmit = async (e) =>{
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


return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.heading}>Create Account</h2>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        className={styles.inputField}
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className={styles.inputField}
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className={styles.inputField}
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className={styles.button}>
                        Register
                    </button>
                </form>

                <p className={styles.footer}>
                    Already have an account? <Link to="/">Log in</Link>
                </p>
            </div>
        </div>
    );
}
import { useState } from "react";

export default function Registration(){
    const [formData, setFormData] = useState({
        username:"",
        email: "",
        password:"",
    });


    const [error, setError] = useState (null);
    const [success, setSuccess] = useState(false);


    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
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
    };
    return (
        <div className="register-container">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
            <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            />

            <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            />

            <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            />

            <button type="submit">Register</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>Account created!</p>}
        </div>
    );
}
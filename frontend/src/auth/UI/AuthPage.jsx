import React from "react";
import styles from "./AuthPage.module.css";
import { Link } from "react-router-dom";

export default function AuthPage({ type, onSubmit }) {
    return (
        <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.card}>
            <h2 className={styles.heading}>
                {type === "login" ? "Log In" : "Create Account"}
            </h2>

            <form
                className={styles.form}
                onSubmit={(e) => {
                e.preventDefault();
                onSubmit(e);
                }}
            >
                <div className={styles.formBody}>
                    <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                    required
                    />

                    <input
                    className={styles.inputField}
                    type="password"
                    placeholder="Password"
                    required
                    />

                    {type === "signup" && (
                    <>
                        <input
                        className={styles.inputField}
                        type="email"
                        placeholder="Email"
                        required
                        />
                    </>
                    )}

                    <button className={styles.button} type="submit">
                    {type === "login" ? "Log In" : "Sign Up"}
                    </button>
                </div>
            </form>

            <p className={styles.footer}>
                {type === "login" ? (
                <>
                    No account? <Link to="/registration">Sign up</Link>
                </>
                ) : (
                <>
                    Already have an account? <Link to="/">Log in</Link>
                </>
                )}
            </p>
            </div>
        </div>
        </div>
    );
}
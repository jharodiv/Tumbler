import React, { useState } from "react";
import styles from "./AuthPage.module.css";
import { Link } from "react-router-dom";

export default function AuthPage({ type, onSubmit }) {
    const [focused, setFocused] = useState(null);

    return (
        <div className={styles.container}>
        <div className={styles.backdrop}>
            <div className={styles.blob1} />
            <div className={styles.blob2} />
            <div className={styles.blob3} />
            <div className={styles.grid} />
        </div>

        <div className={styles.authCard}>
            <div className={styles.card}>
            <h2 className={styles.heading}>
                {type === "login" ? "Welcome back." : "Welcome To Tumbler"}
            </h2>
            <p className={styles.subheading}>
                {type === "login"
                ? "Sign in to continue your journey."
                : "Create your account and get started."}
            </p>

            <form
                className={styles.form}
                onSubmit={(e) => {
                e.preventDefault();
                onSubmit(e);
                }}
            >
                <div className={styles.formBody}>
                <div
                    className={`${styles.inputWrap} ${
                    focused === "username" ? styles.inputWrapFocused : ""
                    }`}
                >
                    <label className={styles.label}>Username</label>
                    <input
                    className={styles.inputField}
                    type="text"
                    placeholder="e.g. johndoe"
                    required
                    onFocus={() => setFocused("username")}
                    onBlur={() => setFocused(null)}
                    />
                </div>

                {type === "signup" && (
                    <div
                    className={`${styles.inputWrap} ${
                        focused === "email" ? styles.inputWrapFocused : ""
                    }`}
                    >
                    <label className={styles.label}>Email</label>
                    <input
                        className={styles.inputField}
                        type="email"
                        placeholder="you@example.com"
                        required
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                    />
                    </div>
                )}

                <div
                    className={`${styles.inputWrap} ${
                    focused === "password" ? styles.inputWrapFocused : ""
                    }`}
                >
                    <label className={styles.label}>Password</label>
                    <input
                    className={styles.inputField}
                    type="password"
                    placeholder="••••••••"
                    required
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    />
                </div>

                {type === "login" && (
                    <div className={styles.forgotRow}>
                    <Link to="/forgot-password" className={styles.forgotLink}>
                        Forgot password?
                    </Link>
                    </div>
                )}

                <button className={styles.button} type="submit">
                    <span>{type === "login" ? "Sign In" : "Sign Up"}</span>
                    <svg
                    className={styles.btnArrow}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    </svg>
                </button>
                </div>
            </form>

            <p className={styles.footer}>
                {type === "login" ? (
                <>
                    New here?{" "}
                    <Link to="/registration" className={styles.footerLink}>
                    Create an account
                    </Link>
                </>
                ) : (
                <>
                    Have an account?{" "}
                    <Link to="/" className={styles.footerLink}>
                    Sign in
                    </Link>
                </>
                )}
            </p>
            </div>
        </div>
        </div>
    );
}
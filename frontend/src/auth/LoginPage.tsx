import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/api/client";
import { useAuth } from "@/auth/useAuth";
import { ROUTES } from "@/routes";
import styles from "./LoginPage.module.css";

type Field = "email" | "password";

export default function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: string } | null)?.from ?? ROUTES.dashboard;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focused, setFocused] = useState<Field | null>(null);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (user) {
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(email.trim(), password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(getErrorMessage(err, "Login failed"));
            setSubmitting(false);
        }
    };

    const wrapClass = (field: Field) =>
        `${styles.inputWrap} ${focused === field ? styles.inputWrapFocused : ""}`;

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
                    <h1 className={styles.heading}>Welcome back.</h1>
                    <p className={styles.subheading}>Sign in to manage Tumbler's IT assets.</p>

                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        <div className={styles.formBody}>
                            {error && (
                                <div className={styles.error} role="alert">
                                    {error}
                                </div>
                            )}

                            <div className={wrapClass("email")}>
                                <label className={styles.label} htmlFor="login-email">
                                    Email
                                </label>
                                <input
                                    id="login-email"
                                    className={styles.inputField}
                                    type="email"
                                    autoComplete="email"
                                    placeholder="admin@company.com"
                                    required
                                    autoFocus
                                    value={email}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className={wrapClass("password")}>
                                <label className={styles.label} htmlFor="login-password">
                                    Password
                                </label>
                                <input
                                    id="login-password"
                                    className={styles.inputField}
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onFocus={() => setFocused("password")}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button className={styles.button} type="submit" disabled={submitting}>
                                <span>{submitting ? "Signing in…" : "Sign In"}</span>
                                <svg
                                    className={styles.btnArrow}
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
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
                        Only admin accounts can sign in. Ask an admin to create your account.
                    </p>
                </div>
            </div>
        </div>
    );
}

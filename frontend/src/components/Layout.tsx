import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { ROUTES } from "@/routes";
import styles from "./Layout.module.css";

const NAV_ITEMS = [
    { to: ROUTES.dashboard, label: "Dashboard", icon: "◧", end: true },
    { to: ROUTES.assets, label: "Assets", icon: "▤", end: false },
    { to: ROUTES.assignments, label: "Assignments", icon: "⇄", end: false },
    { to: ROUTES.users, label: "Users", icon: "◉", end: false },
    { to: ROUTES.categories, label: "Categories", icon: "◇", end: false },
];

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate(ROUTES.login, { replace: true });
    };

    return (
        <div className={styles.shell}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <span className={styles.brandMark} aria-hidden="true">T</span>
                    <span className={styles.brandName}>Tumbler</span>
                </div>

                <nav className={styles.nav} aria-label="Main">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
                            }
                        >
                            <span className={styles.navIcon} aria-hidden="true">{item.icon}</span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.account}>
                    <div className={styles.accountInfo}>
                        <span className={styles.accountName}>{user?.name}</span>
                        <span className={styles.accountEmail}>{user?.email}</span>
                    </div>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                        Log out
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}

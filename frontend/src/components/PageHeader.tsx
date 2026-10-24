import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
    title: ReactNode;
    subtitle?: ReactNode;
    back?: { to: string; label: string };
    actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, back, actions }: PageHeaderProps) {
    return (
        <header className="page-header">
            <div className="page-header-text">
                {back && (
                    <Link to={back.to} className="back-link">
                        ← {back.label}
                    </Link>
                )}
                <h1 className="page-title">{title}</h1>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="page-actions">{actions}</div>}
        </header>
    );
}

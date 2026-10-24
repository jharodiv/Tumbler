import type { ReactNode } from "react";
import { getErrorMessage } from "@/api/client";

export function Loading({ fullScreen = false, label = "Loading…" }: { fullScreen?: boolean; label?: string }) {
    return (
        <div className={fullScreen ? "loading loading-full" : "loading"} role="status">
            <span className="spinner" aria-hidden="true" />
            <span>{label}</span>
        </div>
    );
}

export function ErrorMessage({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
    return (
        <div className="alert alert-error" role="alert">
            <span>{getErrorMessage(error)}</span>
            {onRetry && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={onRetry}>
                    Retry
                </button>
            )}
        </div>
    );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
    return (
        <div className="empty">
            <p className="empty-title">{title}</p>
            {children && <div className="empty-body">{children}</div>}
        </div>
    );
}

import { useEffect, useEffectEvent, useId, type ReactNode } from "react";

interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
}

// Rendered only while open: mount it conditionally, e.g. {open && <Modal …/>}
export default function Modal({ title, onClose, children, footer }: ModalProps) {
    const titleId = useId();

    // Callers pass inline arrows, so read the latest onClose without re-running the effect
    const handleEscape = useEffectEvent(() => onClose());

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleEscape();
        };

        document.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
                <div className="modal-header">
                    <h2 id={titleId} className="modal-title">
                        {title}
                    </h2>
                    <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>
                <div className="modal-body">{children}</div>
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    );
}

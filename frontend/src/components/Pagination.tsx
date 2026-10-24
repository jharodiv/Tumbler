interface PaginationProps {
    page: number;
    totalPages: number;
    total: number;
    onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, total, onChange }: PaginationProps) {
    if (totalPages <= 1) {
        return <div className="pagination muted">{total} total</div>;
    }

    return (
        <div className="pagination">
            <span className="muted">
                Page {page} of {totalPages} · {total} total
            </span>
            <div className="pagination-buttons">
                <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={page <= 1}
                    onClick={() => onChange(page - 1)}
                >
                    ← Prev
                </button>
                <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={page >= totalPages}
                    onClick={() => onChange(page + 1)}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}

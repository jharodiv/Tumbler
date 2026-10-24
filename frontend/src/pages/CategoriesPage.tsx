import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import type { CategoryListItem } from "@/api/types";
import Field from "@/components/Field";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import { EmptyState, ErrorMessage, Loading } from "@/components/Feedback";
import { ROUTES } from "@/routes";

export default function CategoriesPage() {
    const queryClient = useQueryClient();
    // undefined = closed, null = creating, otherwise the category being edited
    const [editing, setEditing] = useState<CategoryListItem | null | undefined>(undefined);

    const { data, error, isPending, refetch } = useQuery({
        queryKey: queryKeys.categories,
        queryFn: categoryApi.list,
    });

    const remove = useMutation({
        mutationFn: categoryApi.remove,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
    });

    const handleDelete = (category: CategoryListItem) => {
        if (window.confirm(`Delete the "${category.name}" category?`)) {
            remove.mutate(category._id);
        }
    };

    return (
        <>
            <PageHeader
                title="Categories"
                subtitle="Asset types such as Laptop, Monitor or Phone."
                actions={
                    <button type="button" className="btn" onClick={() => setEditing(null)}>
                        + New category
                    </button>
                }
            />

            {remove.error && <ErrorMessage error={remove.error} />}

            {isPending ? (
                <Loading />
            ) : error ? (
                <ErrorMessage error={error} onRetry={refetch} />
            ) : data.length === 0 ? (
                <EmptyState title="No categories yet">Create one before adding assets.</EmptyState>
            ) : (
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th className="num">Assets</th>
                                <th aria-label="Actions" />
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((category) => (
                                <tr key={category._id}>
                                    <td className="cell-primary">{category.name}</td>
                                    <td className="muted">{category.description ?? "—"}</td>
                                    <td className="num">
                                        {category.assetCount > 0 ? (
                                            <Link to={ROUTES.toAssetsInCategory(category._id)}>{category.assetCount}</Link>
                                        ) : (
                                            0
                                        )}
                                    </td>
                                    <td className="num" style={{ whiteSpace: "nowrap" }}>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => setEditing(category)}
                                        >
                                            Edit
                                        </button>{" "}
                                        {category.assetCount === 0 && (
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(category)}
                                                disabled={remove.isPending}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editing !== undefined && (
                <CategoryDialog category={editing ?? undefined} onClose={() => setEditing(undefined)} />
            )}
        </>
    );
}

function CategoryDialog({ category, onClose }: { category?: CategoryListItem; onClose: () => void }) {
    const queryClient = useQueryClient();
    const [name, setName] = useState(category?.name ?? "");
    const [description, setDescription] = useState(category?.description ?? "");

    const save = useMutation({
        mutationFn: () => {
            const trimmed = description.trim();
            return category
                ? categoryApi.update(category._id, { name: name.trim(), description: trimmed || null })
                : categoryApi.create({ name: name.trim(), description: trimmed || undefined });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.categories });
            queryClient.invalidateQueries({ queryKey: queryKeys.assets });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
            onClose();
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        save.mutate();
    };

    return (
        <Modal
            title={category ? `Edit ${category.name}` : "New category"}
            onClose={onClose}
            footer={
                <>
                    <button type="button" className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" form="category-form" className="btn" disabled={save.isPending}>
                        {save.isPending ? "Saving…" : category ? "Save changes" : "Create category"}
                    </button>
                </>
            }
        >
            <form id="category-form" className="form-stack" onSubmit={handleSubmit}>
                <Field label="Name" htmlFor="category-name" required hint="Must be unique (case-insensitive)">
                    <input
                        id="category-name"
                        className="input"
                        required
                        maxLength={50}
                        placeholder="Laptop"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Field>
                <Field label="Description" htmlFor="category-description">
                    <textarea
                        id="category-description"
                        className="textarea"
                        maxLength={500}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Field>
                {save.error && <ErrorMessage error={save.error} />}
            </form>
        </Modal>
    );
}

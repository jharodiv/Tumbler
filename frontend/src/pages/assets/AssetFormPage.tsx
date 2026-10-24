import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assetApi, categoryApi } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import {
    ASSET_CONDITIONS,
    MANUAL_ASSET_STATUSES,
    type Asset,
    type AssetCondition,
    type AssetInput,
    type ManualAssetStatus,
} from "@/api/types";
import Field from "@/components/Field";
import PageHeader from "@/components/PageHeader";
import { EmptyState, ErrorMessage, Loading } from "@/components/Feedback";
import { ROUTES } from "@/routes";
import { titleCase, toDateInput } from "@/utils/format";

interface FormState {
    assetTag: string;
    name: string;
    category: string;
    brand: string;
    modelNumber: string;
    serialNumber: string;
    purchaseDate: string;
    purchaseCost: string;
    warrantyExpiry: string;
    status: ManualAssetStatus;
    condition: AssetCondition;
    notes: string;
}

const EMPTY_FORM: FormState = {
    assetTag: "",
    name: "",
    category: "",
    brand: "",
    modelNumber: "",
    serialNumber: "",
    purchaseDate: "",
    purchaseCost: "",
    warrantyExpiry: "",
    status: "available",
    condition: "good",
    notes: "",
};

function toForm(asset: Asset): FormState {
    return {
        assetTag: asset.assetTag,
        name: asset.name,
        category: asset.category?._id ?? "",
        brand: asset.brand ?? "",
        modelNumber: asset.modelNumber ?? "",
        serialNumber: asset.serialNumber ?? "",
        purchaseDate: toDateInput(asset.purchaseDate),
        purchaseCost: asset.purchaseCost?.toString() ?? "",
        warrantyExpiry: toDateInput(asset.warrantyExpiry),
        // An assigned asset keeps its status; the field is disabled in that case
        status: asset.status === "assigned" ? "available" : asset.status,
        condition: asset.condition,
        notes: asset.notes ?? "",
    };
}

// On create empty optional fields are left out; on update they are sent as null to clear them
function toPayload(form: FormState, isEdit: boolean, isAssigned: boolean): AssetInput {
    const optional = (value: string) => (value.trim() ? value.trim() : isEdit ? null : undefined);
    const cost = form.purchaseCost.trim();

    return {
        assetTag: form.assetTag.trim(),
        name: form.name.trim(),
        category: form.category,
        brand: optional(form.brand),
        modelNumber: optional(form.modelNumber),
        serialNumber: optional(form.serialNumber),
        purchaseDate: optional(form.purchaseDate),
        purchaseCost: cost ? Number(cost) : isEdit ? null : undefined,
        warrantyExpiry: optional(form.warrantyExpiry),
        // Status of an assigned asset only changes through the return flow
        status: isAssigned ? undefined : form.status,
        condition: form.condition,
        notes: optional(form.notes),
    };
}

export default function AssetFormPage() {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);

    const asset = useQuery({
        queryKey: queryKeys.asset(id ?? ""),
        queryFn: () => assetApi.get(id!),
        enabled: isEdit,
    });

    if (isEdit && asset.isPending) return <Loading />;
    if (isEdit && asset.error) return <ErrorMessage error={asset.error} onRetry={asset.refetch} />;

    // Keyed so the form state resets when switching between assets
    return <AssetForm key={id ?? "new"} asset={asset.data} />;
}

function AssetForm({ asset }: { asset?: Asset }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = Boolean(asset);
    const isAssigned = asset?.status === "assigned";

    const [form, setForm] = useState<FormState>(() => (asset ? toForm(asset) : EMPTY_FORM));

    const categories = useQuery({ queryKey: queryKeys.categories, queryFn: categoryApi.list });

    const save = useMutation({
        mutationFn: (payload: AssetInput) =>
            asset ? assetApi.update(asset._id, payload) : assetApi.create(payload),
        onSuccess: (saved) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.assets });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
            queryClient.invalidateQueries({ queryKey: queryKeys.categories });
            navigate(ROUTES.toAsset(saved._id));
        },
    });

    const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        save.mutate(toPayload(form, isEdit, isAssigned));
    };

    const cancelTo = asset ? ROUTES.toAsset(asset._id) : ROUTES.assets;

    if (categories.isPending) return <Loading />;
    if (categories.error) return <ErrorMessage error={categories.error} onRetry={categories.refetch} />;

    if (categories.data.length === 0) {
        return (
            <>
                <PageHeader title="New asset" back={{ to: ROUTES.assets, label: "Assets" }} />
                <div className="card">
                    <EmptyState title="Create a category first">
                        Every asset belongs to a category such as Laptop or Monitor.{" "}
                        <Link to={ROUTES.categories}>Go to categories</Link>
                    </EmptyState>
                </div>
            </>
        );
    }

    return (
        <>
            <PageHeader
                title={asset ? `Edit ${asset.name}` : "New asset"}
                back={{ to: cancelTo, label: asset ? asset.assetTag : "Assets" }}
            />

            <form className="card" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <Field label="Asset tag" htmlFor="assetTag" required hint="Unique, stored in uppercase">
                        <input
                            id="assetTag"
                            className="input mono"
                            required
                            maxLength={50}
                            placeholder="LAP-0001"
                            value={form.assetTag}
                            onChange={(e) => set("assetTag", e.target.value)}
                        />
                    </Field>
                    <Field label="Name" htmlFor="name" required>
                        <input
                            id="name"
                            className="input"
                            required
                            maxLength={100}
                            placeholder='MacBook Pro 14"'
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                        />
                    </Field>
                    <Field label="Category" htmlFor="category" required>
                        <select
                            id="category"
                            className="select"
                            required
                            value={form.category}
                            onChange={(e) => set("category", e.target.value)}
                        >
                            <option value="" disabled>
                                Select a category…
                            </option>
                            {categories.data.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Serial number" htmlFor="serialNumber" hint="Unique when set">
                        <input
                            id="serialNumber"
                            className="input mono"
                            maxLength={100}
                            value={form.serialNumber}
                            onChange={(e) => set("serialNumber", e.target.value)}
                        />
                    </Field>
                    <Field label="Brand" htmlFor="brand">
                        <input
                            id="brand"
                            className="input"
                            maxLength={100}
                            placeholder="Apple"
                            value={form.brand}
                            onChange={(e) => set("brand", e.target.value)}
                        />
                    </Field>
                    <Field label="Model number" htmlFor="modelNumber">
                        <input
                            id="modelNumber"
                            className="input"
                            maxLength={100}
                            value={form.modelNumber}
                            onChange={(e) => set("modelNumber", e.target.value)}
                        />
                    </Field>
                    <Field label="Status" htmlFor="status" hint={isAssigned ? "Return the asset to change its status" : undefined}>
                        {isAssigned ? (
                            <select id="status" className="select" disabled value="assigned">
                                <option value="assigned">Assigned</option>
                            </select>
                        ) : (
                            <select
                                id="status"
                                className="select"
                                value={form.status}
                                onChange={(e) => set("status", e.target.value as ManualAssetStatus)}
                            >
                                {MANUAL_ASSET_STATUSES.map((s) => (
                                    <option key={s} value={s}>
                                        {titleCase(s)}
                                    </option>
                                ))}
                            </select>
                        )}
                    </Field>
                    <Field label="Condition" htmlFor="condition">
                        <select
                            id="condition"
                            className="select"
                            value={form.condition}
                            onChange={(e) => set("condition", e.target.value as AssetCondition)}
                        >
                            {ASSET_CONDITIONS.map((c) => (
                                <option key={c} value={c}>
                                    {titleCase(c)}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Purchase date" htmlFor="purchaseDate">
                        <input
                            id="purchaseDate"
                            className="input"
                            type="date"
                            value={form.purchaseDate}
                            onChange={(e) => set("purchaseDate", e.target.value)}
                        />
                    </Field>
                    <Field label="Purchase cost" htmlFor="purchaseCost">
                        <input
                            id="purchaseCost"
                            className="input"
                            type="number"
                            min={0}
                            step="0.01"
                            inputMode="decimal"
                            value={form.purchaseCost}
                            onChange={(e) => set("purchaseCost", e.target.value)}
                        />
                    </Field>
                    <Field label="Warranty expiry" htmlFor="warrantyExpiry">
                        <input
                            id="warrantyExpiry"
                            className="input"
                            type="date"
                            value={form.warrantyExpiry}
                            onChange={(e) => set("warrantyExpiry", e.target.value)}
                        />
                    </Field>
                    <Field label="Notes" htmlFor="notes" className="span-2">
                        <textarea
                            id="notes"
                            className="textarea"
                            maxLength={1000}
                            value={form.notes}
                            onChange={(e) => set("notes", e.target.value)}
                        />
                    </Field>
                </div>

                {save.error && <ErrorMessage error={save.error} />}

                <div className="form-actions">
                    <Link to={cancelTo} className="btn btn-ghost">
                        Cancel
                    </Link>
                    <button type="submit" className="btn" disabled={save.isPending}>
                        {save.isPending ? "Saving…" : asset ? "Save changes" : "Create asset"}
                    </button>
                </div>
            </form>
        </>
    );
}

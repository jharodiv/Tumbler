import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignmentApi, userApi } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import {
    ASSET_CONDITIONS,
    RETURN_ASSET_STATUSES,
    type Asset,
    type AssetCondition,
    type ReturnAssetStatus,
} from "@/api/types";
import Field from "@/components/Field";
import Modal from "@/components/Modal";
import { ErrorMessage, Loading } from "@/components/Feedback";
import { titleCase } from "@/utils/format";

interface DialogProps {
    asset: Asset;
    onClose: () => void;
}

// Assigning or returning changes assets, users' counts, history and the dashboard
function useInvalidateAfterAssignment() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.assets });
        queryClient.invalidateQueries({ queryKey: queryKeys.assignments });
        queryClient.invalidateQueries({ queryKey: queryKeys.users });
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    };
}

export function AssignDialog({ asset, onClose }: DialogProps) {
    const invalidate = useInvalidateAfterAssignment();
    const [userId, setUserId] = useState("");
    const [condition, setCondition] = useState<AssetCondition>(asset.condition);
    const [notes, setNotes] = useState("");

    // Only active users can receive equipment
    const filters = { isActive: true };
    const users = useQuery({ queryKey: queryKeys.userList(filters), queryFn: () => userApi.list(filters) });

    const assign = useMutation({
        mutationFn: assignmentApi.assign,
        onSuccess: () => {
            invalidate();
            onClose();
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        assign.mutate({
            assetId: asset._id,
            userId,
            condition,
            notes: notes.trim() || undefined,
        });
    };

    return (
        <Modal
            title={`Assign ${asset.assetTag}`}
            onClose={onClose}
            footer={
                <>
                    <button type="button" className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" form="assign-form" className="btn" disabled={!userId || assign.isPending}>
                        {assign.isPending ? "Assigning…" : "Assign"}
                    </button>
                </>
            }
        >
            {users.isPending ? (
                <Loading label="Loading users…" />
            ) : users.error ? (
                <ErrorMessage error={users.error} onRetry={users.refetch} />
            ) : (
                <form id="assign-form" className="form-stack" onSubmit={handleSubmit}>
                    <Field label="Give to" htmlFor="assign-user" required>
                        <select
                            id="assign-user"
                            className="select"
                            required
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        >
                            <option value="" disabled>
                                Select a user…
                            </option>
                            {users.data.map((u) => (
                                <option key={u._id} value={u._id}>
                                    {u.name} · {u.email}
                                    {u.department ? ` · ${u.department}` : ""}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Condition at hand-over" htmlFor="assign-condition">
                        <select
                            id="assign-condition"
                            className="select"
                            value={condition}
                            onChange={(e) => setCondition(e.target.value as AssetCondition)}
                        >
                            {ASSET_CONDITIONS.map((c) => (
                                <option key={c} value={c}>
                                    {titleCase(c)}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Notes" htmlFor="assign-notes">
                        <textarea
                            id="assign-notes"
                            className="textarea"
                            maxLength={1000}
                            placeholder="Charger included, sticker on lid…"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Field>
                    {assign.error && <ErrorMessage error={assign.error} />}
                </form>
            )}
        </Modal>
    );
}

export function ReturnDialog({ asset, onClose }: DialogProps) {
    const invalidate = useInvalidateAfterAssignment();
    const [status, setStatus] = useState<ReturnAssetStatus>("available");
    const [condition, setCondition] = useState<AssetCondition>(asset.condition);
    const [notes, setNotes] = useState("");

    const giveBack = useMutation({
        mutationFn: assignmentApi.return,
        onSuccess: () => {
            invalidate();
            onClose();
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        giveBack.mutate({
            assetId: asset._id,
            status,
            condition,
            notes: notes.trim() || undefined,
        });
    };

    return (
        <Modal
            title={`Return ${asset.assetTag}`}
            onClose={onClose}
            footer={
                <>
                    <button type="button" className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" form="return-form" className="btn" disabled={giveBack.isPending}>
                        {giveBack.isPending ? "Returning…" : "Mark returned"}
                    </button>
                </>
            }
        >
            <form id="return-form" className="form-stack" onSubmit={handleSubmit}>
                {asset.assignedTo && (
                    <p className="muted" style={{ margin: 0 }}>
                        Taking back from <strong>{asset.assignedTo.name}</strong>.
                    </p>
                )}
                <Field label="Status after return" htmlFor="return-status">
                    <select
                        id="return-status"
                        className="select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ReturnAssetStatus)}
                    >
                        {RETURN_ASSET_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {titleCase(s)}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Condition on return" htmlFor="return-condition">
                    <select
                        id="return-condition"
                        className="select"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value as AssetCondition)}
                    >
                        {ASSET_CONDITIONS.map((c) => (
                            <option key={c} value={c}>
                                {titleCase(c)}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Notes" htmlFor="return-notes">
                    <textarea
                        id="return-notes"
                        className="textarea"
                        maxLength={1000}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </Field>
                {giveBack.error && <ErrorMessage error={giveBack.error} />}
            </form>
        </Modal>
    );
}

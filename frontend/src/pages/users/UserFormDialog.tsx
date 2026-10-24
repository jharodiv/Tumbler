import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/api/endpoints";
import { queryKeys } from "@/api/queryKeys";
import { ROLES, type Role, type UpdateUserInput, type User } from "@/api/types";
import Field from "@/components/Field";
import Modal from "@/components/Modal";
import { ErrorMessage } from "@/components/Feedback";
import { titleCase } from "@/utils/format";

interface UserFormDialogProps {
    // Omitted when creating a new user
    user?: User;
    isSelf?: boolean;
    onClose: () => void;
    onSaved?: (user: User) => void;
}

export default function UserFormDialog({ user, isSelf, onClose, onSaved }: UserFormDialogProps) {
    const queryClient = useQueryClient();
    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role>(user?.role ?? "user");
    const [department, setDepartment] = useState(user?.department ?? "");
    const [position, setPosition] = useState(user?.position ?? "");

    const save = useMutation({
        mutationFn: () => {
            if (!user) {
                return userApi.create({
                    name: name.trim(),
                    email: email.trim(),
                    password,
                    role,
                    department: department.trim() || undefined,
                    position: position.trim() || undefined,
                });
            }

            const data: UpdateUserInput = {
                name: name.trim(),
                email: email.trim(),
                // Admins can't demote themselves, so the role isn't sent for their own account
                role: isSelf ? undefined : role,
                department: department.trim() || null,
                position: position.trim() || null,
            };

            if (password) data.password = password;

            return userApi.update(user._id, data);
        },
        onSuccess: (saved) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users });
            queryClient.invalidateQueries({ queryKey: queryKeys.assets });
            onSaved?.(saved);
            onClose();
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        save.mutate();
    };

    return (
        <Modal
            title={user ? `Edit ${user.name}` : "New user"}
            onClose={onClose}
            footer={
                <>
                    <button type="button" className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" form="user-form" className="btn" disabled={save.isPending}>
                        {save.isPending ? "Saving…" : user ? "Save changes" : "Create user"}
                    </button>
                </>
            }
        >
            <form id="user-form" className="form-stack" onSubmit={handleSubmit}>
                <Field label="Name" htmlFor="user-name" required>
                    <input
                        id="user-name"
                        className="input"
                        required
                        maxLength={100}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Field>
                <Field label="Email" htmlFor="user-email" required>
                    <input
                        id="user-email"
                        className="input"
                        type="email"
                        required
                        maxLength={254}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Field>
                <Field
                    label="Password"
                    htmlFor="user-password"
                    required={!user}
                    hint={user ? "Leave blank to keep the current password. Changing it signs the user out." : "At least 8 characters"}
                >
                    <input
                        id="user-password"
                        className="input"
                        type="password"
                        autoComplete="new-password"
                        required={!user}
                        minLength={8}
                        maxLength={72}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Field>
                <Field
                    label="Role"
                    htmlFor="user-role"
                    hint={isSelf ? "You can't change your own role" : "Only admins can sign in to this app"}
                >
                    <select
                        id="user-role"
                        className="select"
                        disabled={isSelf}
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                    >
                        {ROLES.map((r) => (
                            <option key={r} value={r}>
                                {titleCase(r)}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Department" htmlFor="user-department">
                    <input
                        id="user-department"
                        className="input"
                        maxLength={100}
                        placeholder="Engineering"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    />
                </Field>
                <Field label="Position" htmlFor="user-position">
                    <input
                        id="user-position"
                        className="input"
                        maxLength={100}
                        placeholder="Software Engineer"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    />
                </Field>
                {save.error && <ErrorMessage error={save.error} />}
            </form>
        </Modal>
    );
}

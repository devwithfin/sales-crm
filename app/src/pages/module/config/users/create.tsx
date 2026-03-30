import { useState, useEffect, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/context/toast"
import { usePermissions } from "@/context/permissions"
import { apiFetch } from "@/lib/api"

type Role = {
    id: string
    name: string
    description: string | null
}

export default function UserCreatePage() {
    const navigate = useNavigate()
    const { showToast } = useToast()
    const { hasPermission, isLoading: isPermissionLoading } = usePermissions()
    const canCreate = hasPermission("users-create")

    const [roles, setRoles] = useState<Role[]>([])
    const [isLoadingRoles, setIsLoadingRoles] = useState(true)
    const [formState, setFormState] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        roleId: "",
        department: "",
        status: "Active",
    })
    const [isSaving, setIsSaving] = useState(false)
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})

    // Load roles
    useEffect(() => {
        const loadRoles = async () => {
            try {
                const data = await apiFetch<Role[]>("/roles")
                setRoles(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Failed to load roles:", error)
                setRoles([])
            } finally {
                setIsLoadingRoles(false)
            }
        }
        void loadRoles()
    }, [])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!canCreate || isSaving) {
            return
        }

        const trimmedName = formState.fullName.trim()
        const trimmedEmail = formState.email.trim()
        const trimmedPassword = formState.password

        if (!trimmedName) {
            setErrors({ name: "Full name is required" })
            return
        }

        if (!trimmedEmail) {
            setErrors({ email: "Email is required" })
            return
        }

        if (!trimmedPassword) {
            setErrors({ password: "Password is required" })
            return
        }

        if (trimmedPassword !== formState.confirmPassword) {
            setErrors({ password: "Passwords do not match" })
            return
        }

        if (!formState.roleId) {
            showToast({ type: "error", message: "Please select a role" })
            return
        }

        setErrors({})
        setIsSaving(true)
        try {
            await apiFetch("/users", {
                method: "POST",
                body: JSON.stringify({
                    fullName: trimmedName,
                    email: trimmedEmail,
                    password: trimmedPassword,
                    roleId: formState.roleId,
                    department: formState.department.trim() || null,
                    status: formState.status,
                }),
            })

            showToast({ type: "success", message: "User created" })
            navigate("/users")
        } catch (error) {
            console.error(error)
            showToast({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to create user",
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (!isPermissionLoading && !canCreate) {
        return (
            <div className="flex flex-col items-start gap-4 pb-10">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-lg">
                    <ChevronLeft className="size-5" />
                </Button>
                <div className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-4 text-amber-800">
                    You do not have permission to create users.
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col pb-10">
            <div className="sticky -top-6 z-10 -mx-4 md:-mx-8 bg-slate-50 py-3 border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-lg">
                        <ChevronLeft className="size-5" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create User</h1>
                </div>
                <Button
                    type="submit"
                    form="user-create-form"
                    className="rounded-lg px-6 py-5 font-bold shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>

            <form id="user-create-form" onSubmit={handleSubmit} className="mt-4 space-y-6">
                <Card className="border border-slate-200 rounded-3xl">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-800">User Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Full Name</label>
                                <div className="flex-1 space-y-1">
                                    <Input
                                        value={formState.fullName}
                                        onChange={event => setFormState(current => ({ ...current, fullName: event.target.value }))}
                                        className="py-5"
                                        placeholder="Enter full name"
                                        required
                                    />
                                    {errors.name ? <p className="text-xs text-red-500">{errors.name}</p> : null}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Email</label>
                                <div className="flex-1 space-y-1">
                                    <Input
                                        type="email"
                                        value={formState.email}
                                        onChange={event => setFormState(current => ({ ...current, email: event.target.value }))}
                                        className="py-5"
                                        placeholder="enter@email.com"
                                        required
                                    />
                                    {errors.email ? <p className="text-xs text-red-500">{errors.email}</p> : null}
                                </div>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Role</label>
                                <select
                                    value={formState.roleId}
                                    onChange={event => setFormState(current => ({ ...current, roleId: event.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {!isLoadingRoles && roles.map(role => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Department</label>
                                <Input
                                    value={formState.department}
                                    onChange={event => setFormState(current => ({ ...current, department: event.target.value }))}
                                    className="py-5"
                                    placeholder="e.g. Sales, IT"
                                />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Status</label>
                                <select
                                    value={formState.status}
                                    onChange={event => setFormState(current => ({ ...current, status: event.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-slate-200 rounded-3xl">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-800">Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Password</label>
                                <div className="flex-1 space-y-1">
                                    <Input
                                        type="password"
                                        value={formState.password}
                                        onChange={event => setFormState(current => ({ ...current, password: event.target.value }))}
                                        className="py-5"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Confirm</label>
                                <div className="flex-1 space-y-1">
                                    <Input
                                        type="password"
                                        value={formState.confirmPassword}
                                        onChange={event => setFormState(current => ({ ...current, confirmPassword: event.target.value }))}
                                        className="py-5"
                                        placeholder="••••••••"
                                        required
                                    />
                                    {errors.password ? <p className="text-xs text-red-500">{errors.password}</p> : null}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}

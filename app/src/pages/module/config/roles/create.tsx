import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/context/toast"
import { usePermissions } from "@/context/permissions"
import { apiFetch } from "@/lib/api"

export default function RoleCreatePage() {
    const navigate = useNavigate()
    const { showToast } = useToast()
    const { hasPermission, isLoading: isPermissionLoading } = usePermissions()
    const canCreate = hasPermission("roles-create")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [errors, setErrors] = useState<{ name?: string }>({})

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!canCreate || isSaving) {
            return
        }

        const trimmedName = name.trim()
        const trimmedDescription = description.trim()

        if (!trimmedName) {
            setErrors({ name: "Role name is required" })
            return
        }

        setErrors({})
        setIsSaving(true)
        try {
            await apiFetch("/roles", {
                method: "POST",
                body: JSON.stringify({
                    name: trimmedName,
                    description: trimmedDescription ? trimmedDescription : null,
                }),
            })

            showToast({ type: "success", message: "Role created" })
            navigate("/roles")
        } catch (error) {
            console.error(error)
            showToast({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to create role",
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
                    You do not have permission to create roles.
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
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Role</h1>
                </div>
                <Button
                    type="submit"
                    form="role-create-form"
                    className="rounded-lg px-6 py-5 font-bold shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>

            <form id="role-create-form" onSubmit={handleSubmit} className="mt-4 space-y-6">
                <Card className="border border-slate-200 rounded-3xl">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-800">Role Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Role Name</label>
                                <div className="flex-1 space-y-1">
                                    <Input
                                        value={name}
                                        onChange={event => setName(event.target.value)}
                                        className="py-5"
                                        placeholder="e.g. Sales Manager"
                                        disabled={isSaving}
                                    />
                                    {errors.name ? <p className="text-xs text-red-500">{errors.name}</p> : null}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32 shrink-0 pt-1.5">Description</label>
                            <Textarea
                                value={description}
                                onChange={event => setDescription(event.target.value)}
                                className="min-h-[120px] flex-1 rounded-2xl border-slate-200 focus:border-primary/30 focus:ring-primary/10"
                                placeholder="Enter role description..."
                                disabled={isSaving}
                            />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}

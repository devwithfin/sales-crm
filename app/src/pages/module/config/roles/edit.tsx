import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { API_BASE_URL } from "@/constants/env"
import { useToast } from "@/context/toast"
import { useMenuData } from "@/context/menu"
import { usePermissions } from "@/context/permissions"

type RoleInfo = {
    id: string
    name: string
}

type PermissionItem = {
    id: string
    name: string
    assigned: boolean
}

export default function RoleEditPage() {
    const { id } = useParams<{ id: string }>()
    const [role, setRole] = useState<RoleInfo | null>(null)
    const [permissions, setPermissions] = useState<PermissionItem[]>([])
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const { showToast } = useToast()
    const navigate = useNavigate()
    const { refresh: refreshMenus } = useMenuData()
    const { refresh: refreshPermissions } = usePermissions()

    useEffect(() => {
        if (!id) {
            return
        }
        const token = localStorage.getItem("token")
        if (!token) {
            return
        }

        const fetchData = async () => {
            try {
                const [roleResponse, permissionResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/roles/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    fetch(`${API_BASE_URL}/roles/${id}/permissions`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                ])

                if (!roleResponse.ok) {
                    throw new Error("Failed to load role")
                }

                if (!permissionResponse.ok) {
                    throw new Error("Failed to load role permissions")
                }

                const roleData = (await roleResponse.json()) as RoleInfo
                const permissionData = (await permissionResponse.json()) as PermissionItem[]

                setRole(roleData)
                setPermissions(permissionData)
                setSelected(new Set(permissionData.filter(permission => permission.assigned).map(permission => permission.id)))
            } catch (error) {
                console.error(error)
                showToast({
                    type: "error",
                    message: error instanceof Error ? error.message : "Failed to load role data",
                })
            } finally {
                setIsLoading(false)
            }
        }

        void fetchData()
    }, [id, showToast])

    const handleToggle = (permissionId: string) => {
        setSelected(prev => {
            const next = new Set(prev)
            if (next.has(permissionId)) {
                next.delete(permissionId)
            } else {
                next.add(permissionId)
            }
            return next
        })
    }

    const handleSave = async () => {
        if (!id) {
            return
        }

        const token = localStorage.getItem("token")
        if (!token) {
            showToast({ type: "error", message: "Authentication required" })
            return
        }

        setIsSaving(true)
        try {
            const response = await fetch(`${API_BASE_URL}/roles/${id}/permissions`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ permissionIds: Array.from(selected) }),
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => null)
                throw new Error(payload?.message ?? "Failed to update permissions")
            }

            showToast({ type: "success", message: "Permissions updated" })
            await Promise.all([refreshMenus(), refreshPermissions()])
            navigate("/roles")
        } catch (error) {
            console.error(error)
            showToast({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to update permissions",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const isDirty = useMemo(() => {
        const assigned = new Set(permissions.filter(permission => permission.assigned).map(permission => permission.id))
        if (assigned.size !== selected.size) {
            return true
        }
        for (const id of selected) {
            if (!assigned.has(id)) {
                return true
            }
        }
        return false
    }, [permissions, selected])

    if (isLoading) {
        return <p className="text-sm text-slate-500">Loading role...</p>
    }

    if (!role) {
        return <p className="text-sm text-red-500">Role not found.</p>
    }

    return (
        <div className="flex flex-col gap-6 pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Role</h1>
                <p className="text-sm text-slate-500">Manage permissions for the {role.name} role.</p>
            </div>

            <Card className="border-slate-200 shadow-sm rounded-3xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {permissions.map(permission => (
                            <label
                                key={permission.id}
                                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 hover:border-primary/40 transition-colors cursor-pointer"
                            >
                                <Checkbox
                                    checked={selected.has(permission.id)}
                                    onCheckedChange={() => handleToggle(permission.id)}
                                    aria-label={`Toggle permission ${permission.name}`}
                                />
                                <div>
                                    <p className="font-medium text-slate-900">{permission.name}</p>
                                    <p className="text-xs text-slate-500 capitalize">{permission.name.replace(/-/g, " ")}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => navigate("/roles")} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving || !isDirty}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

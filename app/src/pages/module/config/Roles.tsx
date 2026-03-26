import { useCallback, useEffect, useMemo, useState } from "react"
import { Search, Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ManagementDataTable } from "@/components/data-table/management-data-table"
import { createRoleColumns, type Role } from "@/pages/module/config/roles/columns"
import { API_BASE_URL } from "@/constants/env"
import { useToast } from "@/context/toast"
import { usePermissions } from "@/context/permissions"

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const { showToast } = useToast()
    const { hasPermission } = usePermissions()

    const loadRoles = useCallback(async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setRoles([])
            return
        }

        const response = await fetch(`${API_BASE_URL}/roles`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const payload = await response.json().catch(() => null)
            throw new Error(payload?.message ?? "Failed to load roles")
        }

        const rolesData = (await response.json()) as Role[]
        setRoles(rolesData)
    }, [])

    useEffect(() => {
        const run = async () => {
            setIsLoading(true)
            try {
                await loadRoles()
            } catch (error) {
                console.error(error)
                showToast({
                    type: "error",
                    message: error instanceof Error ? error.message : "Failed to load roles",
                })
            } finally {
                setIsLoading(false)
            }
        }

        void run()
    }, [loadRoles, showToast])
    const canCreate = hasPermission("role-create")
    const canEdit = hasPermission("role-edit")
    const canDelete = hasPermission("role-delete")

    const handleDeleteRole = useCallback(
        async (role: Role) => {
            if (!canDelete) {
                return
            }

            const confirmed = window.confirm(`Delete role "${role.name}"?`)
            if (!confirmed) {
                return
            }

            const token = localStorage.getItem("token")
            if (!token) {
                showToast({ type: "error", message: "Authentication required" })
                return
            }

            setDeletingId(role.id)
            try {
                const response = await fetch(`${API_BASE_URL}/roles/${role.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    const payload = await response.json().catch(() => null)
                    throw new Error(payload?.message ?? "Failed to delete role")
                }

                showToast({ type: "success", message: "Role deleted" })
                await loadRoles()
            } catch (error) {
                console.error(error)
                showToast({
                    type: "error",
                    message: error instanceof Error ? error.message : "Failed to delete role",
                })
            } finally {
                setDeletingId(null)
            }
        },
        [canDelete, loadRoles, showToast]
    )

    const roleColumns = useMemo(
        () =>
            createRoleColumns({
                enableEdit: canEdit,
                enableDelete: canDelete,
                onDelete: canDelete ? handleDeleteRole : undefined,
                deletingId,
            }),
        [canEdit, canDelete, handleDeleteRole, deletingId]
    )

    const headerControls = useMemo(
        () => (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm min-w-[280px]">
                    <Search className="size-4 text-slate-400" />
                    <Input
                        placeholder="Search roles..."
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        className="border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
                {canCreate ? (
                    <Link
                        to="/roles/create"
                        className={cn(
                            buttonVariants({ variant: "default" }),
                            "rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                        )}
                    >
                        Create
                    </Link>
                ) : null}
            </div>
        ),
        [search, canCreate]
    )

    return (
        <div className="flex flex-col gap-6 pb-10">
            {isLoading ? (
                <p className="text-sm text-slate-500">Loading roles...</p>
            ) : (
                <ManagementDataTable columns={roleColumns} data={roles} searchValue={search} headerControls={headerControls} />
            )}
        </div>
    )
}

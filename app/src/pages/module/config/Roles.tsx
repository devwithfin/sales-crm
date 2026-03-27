import { useCallback, useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ManagementDataTable } from "@/components/data-table/management-data-table"
import { createRoleColumns, type Role } from "@/pages/module/config/roles/columns"
import { API_BASE_URL } from "@/constants/env"
import { useToast } from "@/context/toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
    const { showToast } = useToast()

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

    // For now, allow all actions - can be tied to permissions later
    const canCreate = true
    const canEdit = true
    const canDelete = true

    const handleDeleteClick = useCallback((role: Role) => {
        if (!canDelete) {
            return
        }
        setRoleToDelete(role)
        setDeleteConfirmOpen(true)
    }, [canDelete])

    const handleDeleteConfirm = useCallback(async () => {
        if (!roleToDelete || !canDelete) {
            return
        }

        const token = localStorage.getItem("token")
        if (!token) {
            showToast({ type: "error", message: "Authentication required" })
            setDeleteConfirmOpen(false)
            setRoleToDelete(null)
            return
        }

        setDeletingId(roleToDelete.id)
        try {
            const response = await fetch(`${API_BASE_URL}/roles/${roleToDelete.id}`, {
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
            setDeleteConfirmOpen(false)
            setRoleToDelete(null)
        }
    }, [roleToDelete, canDelete, loadRoles, showToast])

    const roleColumns = useMemo(
        () =>
            createRoleColumns({
                enableEdit: canEdit,
                enableDelete: canDelete,
                onDelete: canDelete ? handleDeleteClick : undefined,
                deletingId,
            }),
        [canEdit, canDelete, handleDeleteClick, deletingId]
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
            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleDeleteConfirm}
                title="Delete Role"
                description={`Are you sure you want to delete "${roleToDelete?.name ?? ''}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                loading={!!deletingId}
            />
        </div>
    )
}

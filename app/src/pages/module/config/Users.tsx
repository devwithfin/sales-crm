import { useCallback, useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ManagementDataTable } from "@/components/data-table/management-data-table"
import { createUserColumns, type User } from "@/pages/module/config/users/columns"
import { useToast } from "@/context/toast"
import { usePermissions } from "@/context/permissions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { apiFetch } from "@/lib/api"

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<User | null>(null)
    const { showToast } = useToast()
    const { hasPermission, isLoading: permissionsLoading } = usePermissions()

    const loadUsers = useCallback(async () => {
        try {
            const usersData = await apiFetch<User[]>("/users")
            setUsers(Array.isArray(usersData) ? usersData : [])
        } catch (error) {
            console.error("Failed to fetch users", error)
            setUsers([])
        }
    }, [])

    useEffect(() => {
        const run = async () => {
            setIsLoading(true)
            try {
                await loadUsers()
            } catch (error) {
                console.error(error)
                showToast({
                    type: "error",
                    message: error instanceof Error ? error.message : "Failed to load users",
                })
            } finally {
                setIsLoading(false)
            }
        }

        void run()
    }, [loadUsers, showToast])

    const canCreate = hasPermission("users-create")
    const canEdit = hasPermission("users-edit")
    const canDelete = hasPermission("users-delete")

    const handleDeleteClick = useCallback((user: User) => {
        if (!canDelete) {
            return
        }
        setUserToDelete(user)
        setDeleteConfirmOpen(true)
    }, [canDelete])

    const handleDeleteConfirm = useCallback(async () => {
        if (!userToDelete || !canDelete) {
            return
        }

        setDeletingId(userToDelete.id)
        try {
            await apiFetch(`/users/${userToDelete.id}`, { method: "DELETE" })
            showToast({ type: "success", message: "User deleted" })
            await loadUsers()
        } catch (error) {
            console.error(error)
            showToast({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to delete user",
            })
        } finally {
            setDeletingId(null)
            setDeleteConfirmOpen(false)
            setUserToDelete(null)
        }
    }, [userToDelete, canDelete, loadUsers, showToast])

    const userColumns = useMemo(
        () =>
            createUserColumns({
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
                        placeholder="Search users..."
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        className="border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
                {canCreate ? (
                    <Link
                        to="/users/create"
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
            {isLoading || permissionsLoading ? (
                <p className="text-sm text-slate-500">Loading...</p>
            ) : (
                <ManagementDataTable columns={userColumns} data={users} searchValue={search} headerControls={headerControls} />
            )}
            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleDeleteConfirm}
                title="Delete User"
                description={`Are you sure you want to delete "${userToDelete?.fullName ?? ''}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                loading={!!deletingId}
            />
        </div>
    )
}

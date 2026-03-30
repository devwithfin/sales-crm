import { useCallback, useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ManagementDataTable } from "@/components/data-table/management-data-table"
import { createMenuColumns, type MenuRow } from "@/pages/module/config/menus/columns"
import { useToast } from "@/context/toast"
import { usePermissions } from "@/context/permissions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { apiFetch } from "@/lib/api"

export default function MenusPage() {
    const [menus, setMenus] = useState<MenuRow[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [menuToDelete, setMenuToDelete] = useState<MenuRow | null>(null)
    const { showToast } = useToast()
    const { hasPermission, isLoading: permissionsLoading } = usePermissions()

    const loadMenus = useCallback(async () => {
        try {
            const menusData = await apiFetch<MenuRow[]>("/menus/all")
            
            if (!Array.isArray(menusData)) {
                setMenus([])
                return
            }

            // Flatten the menu tree for table display
            const flattenMenus = (nodes: MenuRow[], parentName: string | null = null): MenuRow[] => {
                const items: MenuRow[] = []
                nodes.forEach(node => {
                    items.push({ 
                        ...node, 
                        parentName,
                        isGroup: !node.link && !!node.children?.length
                    })
                    if (node.children?.length) {
                        items.push(...flattenMenus(node.children, node.name))
                    }
                })
                return items
            }
            
            setMenus(flattenMenus(menusData))
        } catch (error) {
            console.error("Failed to fetch menus", error)
            setMenus([])
        }
    }, [])

    useEffect(() => {
        const run = async () => {
            setIsLoading(true)
            try {
                await loadMenus()
            } catch (error) {
                console.error(error)
                showToast({
                    type: "error",
                    message: error instanceof Error ? error.message : "Failed to load menus",
                })
            } finally {
                setIsLoading(false)
            }
        }

        void run()
    }, [loadMenus, showToast])

    const canCreate = hasPermission("menus-create")
    const canEdit = hasPermission("menus-edit")
    const canDelete = hasPermission("menus-delete")

    const handleDeleteClick = useCallback((menu: MenuRow) => {
        if (!canDelete) {
            return
        }
        setMenuToDelete(menu)
        setDeleteConfirmOpen(true)
    }, [canDelete])

    const handleDeleteConfirm = useCallback(async () => {
        if (!menuToDelete || !canDelete) {
            return
        }

        setDeletingId(menuToDelete.id)
        try {
            await apiFetch(`/menus/${menuToDelete.id}`, { method: "DELETE" })
            showToast({ type: "success", message: "Menu deleted" })
            await loadMenus()
        } catch (error) {
            console.error(error)
            showToast({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to delete menu",
            })
        } finally {
            setDeletingId(null)
            setDeleteConfirmOpen(false)
            setMenuToDelete(null)
        }
    }, [menuToDelete, canDelete, loadMenus, showToast])

    const menuColumns = useMemo(
        () =>
            createMenuColumns({
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
                        placeholder="Search menus..."
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        className="border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
                {canCreate ? (
                    <Link
                        to="/menus/create"
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
                <ManagementDataTable columns={menuColumns} data={menus} searchValue={search} headerControls={headerControls} />
            )}
            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleDeleteConfirm}
                title="Delete Menu"
                description={`Are you sure you want to delete "${menuToDelete?.name ?? ''}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                loading={!!deletingId}
            />
        </div>
    )
}

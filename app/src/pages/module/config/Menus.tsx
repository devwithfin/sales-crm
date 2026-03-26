import { useCallback, useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ManagementDataTable } from "@/components/data-table/management-data-table"
import { createMenuColumns, type MenuRow } from "@/pages/module/config/menus/columns"
import { API_BASE_URL } from "@/constants/env"
import { useToast } from "@/context/toast"
import { usePermissions } from "@/context/permissions"

export default function MenusPage() {
    const [menus, setMenus] = useState<MenuRow[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const { showToast } = useToast()
    const { hasPermission } = usePermissions()

    const loadMenus = useCallback(async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setMenus([])
            return
        }

        const response = await fetch(`${API_BASE_URL}/menus/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            const payload = await response.json().catch(() => null)
            throw new Error(payload?.message ?? "Failed to load menus")
        }

        const menusData = await response.json() as MenuRow[]
        
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

    const canCreate = hasPermission("menu-create")
    const canEdit = hasPermission("menu-edit")
    const canDelete = hasPermission("menu-delete")

    const handleDeleteMenu = useCallback(
        async (menu: MenuRow) => {
            if (!canDelete) {
                return
            }

            const confirmed = window.confirm(`Delete menu "${menu.name}"?`)
            if (!confirmed) {
                return
            }

            const token = localStorage.getItem("token")
            if (!token) {
                showToast({ type: "error", message: "Authentication required" })
                return
            }

            setDeletingId(menu.id)
            try {
                const response = await fetch(`${API_BASE_URL}/menus/${menu.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    const payload = await response.json().catch(() => null)
                    throw new Error(payload?.message ?? "Failed to delete menu")
                }

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
            }
        },
        [canDelete, loadMenus, showToast]
    )

    const menuColumns = useMemo(
        () =>
            createMenuColumns({
                enableEdit: canEdit,
                enableDelete: canDelete,
                onDelete: canDelete ? handleDeleteMenu : undefined,
                deletingId,
            }),
        [canEdit, canDelete, handleDeleteMenu, deletingId]
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
            {isLoading ? (
                <p className="text-sm text-slate-500">Loading menus...</p>
            ) : (
                <ManagementDataTable columns={menuColumns} data={menus} searchValue={search} headerControls={headerControls} />
            )}
        </div>
    )
}

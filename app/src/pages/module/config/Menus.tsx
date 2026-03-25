import type { FormEvent } from "react"
import { useCallback, useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Search, Plus, PencilLine, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { useMenuData, type MenuNode } from "@/context/menu"
import { ManagementDataTable } from "@/components/data-table/management-data-table"
import { createMenuColumns, type MenuRow } from "@/pages/module/config/menus/columns"
import { usePermissions } from "@/context/permissions"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { API_BASE_URL } from "@/constants/env"
import { useToast } from "@/context/toast"
import { cn } from "@/lib/utils"

function flattenMenus(nodes: MenuNode[]): MenuRow[] {
    const items: MenuRow[] = []

    nodes.forEach(node => {
        items.push({
            id: node.id,
            name: node.name,
            level: node.level,
            link: node.link ?? null,
            isGroup: !node.link,
            model: node.model ?? null,
        })

        if (node.children.length) {
            items.push(...flattenMenus(node.children))
        }
    })

    return items
}

function normalizeModelName(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
}

export default function MenusPage() {
    const { menus, isLoading, refresh } = useMenuData()
    const [search, setSearch] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [formState, setFormState] = useState({
        menuName: "",
        menuLevel: 1,
        menuOrder: 1,
        menuIcon: "",
        menuLink: "",
        parentId: "",
        modelName: "",
    })
    const { hasPermission } = usePermissions()
    const { showToast } = useToast()

    const flattenedMenus = useMemo(() => flattenMenus(menus), [menus])
    const canCreateMenu = hasPermission("menu-create")
    const canEditMenu = hasPermission("menu-edit")
    const canDeleteMenu = hasPermission("menu-delete")

    const handleDeleteMenu = useCallback(
        async (menu: MenuRow) => {
            if (!canDeleteMenu) {
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
                await refresh()
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
        [canDeleteMenu, refresh, showToast]
    )

    const tableColumns = useMemo<ColumnDef<MenuRow>[]>(() => {
        const columns = createMenuColumns()
        if (canEditMenu || canDeleteMenu) {
            columns.push({
                id: "menu-actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        {canEditMenu ? (
                            <Button variant="outline" size="sm" className="text-xs" disabled>
                                <PencilLine className="size-3.5 mr-1.5" /> Edit
                            </Button>
                        ) : null}
                        {canDeleteMenu ? (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="text-xs"
                                disabled={deletingId === row.original.id}
                                onClick={() => handleDeleteMenu(row.original)}
                            >
                                <Trash2 className="size-3.5 mr-1.5" /> Delete
                            </Button>
                        ) : null}
                    </div>
                ),
                enableHiding: false,
                enableSorting: false,
            })
        }
        return columns
    }, [canEditMenu, canDeleteMenu, deletingId, handleDeleteMenu])

    const headerControls = (
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
            {canCreateMenu ? (
                <Button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className={cn(
                        buttonVariants({ variant: "default" }),
                        "rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all gap-2"
                    )}
                >
                    <Plus className="size-4" /> Create Menu
                </Button>
            ) : null}
        </div>
    )

    const parentOptions = useMemo(() => {
        const items: MenuNode[] = []
        const collect = (nodesToCollect: MenuNode[]) => {
            nodesToCollect.forEach(node => {
                items.push(node)
                if (node.children.length) {
                    collect(node.children)
                }
            })
        }
        collect(menus)
        return items
    }, [menus])

    const handleCreateMenu = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const token = localStorage.getItem("token")
        if (!token) {
            showToast({ type: "error", message: "Authentication required" })
            return
        }

        setIsSubmitting(true)
        const rawLink = formState.menuLink.trim()
        const sanitizedLink = rawLink ? (rawLink.startsWith("/") ? rawLink : `/${rawLink}`) : ""
        const normalizedModel = normalizeModelName(formState.modelName)

        if (sanitizedLink && !normalizedModel) {
            showToast({ type: "error", message: "Model key is required for linked menus" })
            setIsSubmitting(false)
            return
        }
        try {
            const response = await fetch(`${API_BASE_URL}/menus`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    menuName: formState.menuName,
                    menuOrder: Number(formState.menuOrder),
                    menuLevel: Number(formState.menuLevel),
                    menuIcon: formState.menuIcon || null,
                    menuLink: sanitizedLink || null,
                    parentId: formState.parentId || null,
                    modelName: normalizedModel || null,
                }),
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => null)
                throw new Error(payload?.message ?? "Failed to create menu")
            }

            showToast({ type: "success", message: "Menu created" })
            setIsCreateOpen(false)
            setFormState({
                menuName: "",
                menuLevel: 1,
                menuOrder: 1,
                menuIcon: "",
                menuLink: "",
                parentId: "",
                modelName: "",
            })
            await refresh()
        } catch (error) {
            console.error(error)
            showToast({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to create menu",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Menu Management</h1>
                <p className="text-sm text-slate-500">Overview of menus currently accessible for your role.</p>
            </div>
            {isLoading ? (
                <p className="text-sm text-slate-500">Loading menus...</p>
            ) : (
                <ManagementDataTable
                    columns={tableColumns}
                    data={flattenedMenus}
                    searchValue={search}
                    headerControls={headerControls}
                    emptyMessage="No menus available."
                />
            )}
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent side="right">
                    <form className="flex flex-col h-full" onSubmit={handleCreateMenu}>
                        <SheetHeader>
                            <SheetTitle>Create Menu</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-4 px-4 py-2 overflow-y-auto">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Menu Name</label>
                                <Input
                                    value={formState.menuName}
                                    onChange={event => setFormState(current => ({ ...current, menuName: event.target.value }))}
                                    placeholder="e.g. Dashboard"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Menu Level</label>
                                    <select
                                        value={formState.menuLevel}
                                        onChange={event => setFormState(current => ({ ...current, menuLevel: Number(event.target.value) }))}
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
                                    >
                                        {[1, 2, 3, 4, 5].map(level => (
                                            <option key={level} value={level}>
                                                Level {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Menu Order</label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={formState.menuOrder}
                                        onChange={event => setFormState(current => ({ ...current, menuOrder: Number(event.target.value) }))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Parent Menu (optional)</label>
                                <select
                                    value={formState.parentId}
                                    onChange={event => setFormState(current => ({ ...current, parentId: event.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
                                >
                                    <option value="">No parent</option>
                                    {parentOptions.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.name} (Level {option.level})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Menu Link</label>
                                <Input
                                    value={formState.menuLink}
                                    onChange={event => setFormState(current => ({ ...current, menuLink: event.target.value }))}
                                    placeholder="/dashboard"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Model Key</label>
                                <Input
                                    value={formState.modelName}
                                    onChange={event =>
                                        setFormState(current => ({
                                            ...current,
                                            modelName: normalizeModelName(event.target.value),
                                        }))
                                    }
                                    placeholder="e.g. deals"
                                />
                                <p className="text-xs text-slate-500">Dipakai untuk membuat file halaman otomatis.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Menu Icon (optional)</label>
                                <Input
                                    value={formState.menuIcon}
                                    onChange={event => setFormState(current => ({ ...current, menuIcon: event.target.value }))}
                                    placeholder="layout-dashboard"
                                />
                            </div>
                        </div>
                        <SheetFooter>
                            <div className="flex items-center justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Creating..." : "Create Menu"}
                                </Button>
                            </div>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}

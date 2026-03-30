import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/context/toast"
import { usePermissions } from "@/context/permissions"
import { useMenuData, type MenuNode } from "@/context/menu"
import { apiFetch } from "@/lib/api"

type MenuInfo = {
    id: string
    menuName: string
    menuLevel: number
    menuOrder: number
    menuIcon: string | null
    menuLink: string | null
    parentId: string | null
    modelName: string | null
    permissionName: string | null
}

function normalizeModelName(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
}

export default function MenuEditPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const { hasPermission, isLoading: isPermissionLoading } = usePermissions()
    const { menus: contextMenus } = useMenuData()
    const canEdit = hasPermission("menus-edit")

    const [menu, setMenu] = useState<MenuInfo | null>(null)
    const [formState, setFormState] = useState({
        menuName: "",
        menuLevel: 1,
        menuOrder: 1,
        menuIcon: "",
        menuLink: "",
        parentId: "",
        modelName: "",
        permissionName: "",
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const loadMenu = useCallback(async () => {
        if (!id) return

        try {
            const menuData = await apiFetch<MenuInfo>(`/menus/${id}`)
            setMenu(menuData)
            setFormState({
                menuName: menuData.menuName,
                menuLevel: menuData.menuLevel,
                menuOrder: menuData.menuOrder,
                menuIcon: menuData.menuIcon ?? "",
                menuLink: menuData.menuLink ?? "",
                parentId: menuData.parentId ?? "",
                modelName: menuData.modelName ?? "",
                permissionName: menuData.permissionName ?? "",
            })
        } catch (error) {
            console.error("Failed to load menu", error)
            throw error
        }
    }, [id])

    useEffect(() => {
        const run = async () => {
            setIsLoading(true)
            try {
                await loadMenu()
            } catch (error) {
                console.error(error)
                showToast({
                    type: "error",
                    message: error instanceof Error ? error.message : "Failed to load menu",
                })
            } finally {
                setIsLoading(false)
            }
        }

        void run()
    }, [loadMenu, showToast])

    const parentOptions: MenuNode[] = []
    const collect = (nodes: MenuNode[]) => {
        nodes.forEach(node => {
            // Exclude current menu and its children from parent options
            if (node.id !== id) {
                parentOptions.push(node)
                if (node.children?.length) {
                    collect(node.children)
                }
            }
        })
    }
    collect(contextMenus)

    // Filter parent options based on menu level
    const getFilteredParentOptions = () => {
        const level = formState.menuLevel
        if (level === 1) {
            return []
        }
        if (level === 2) {
            return parentOptions.filter(node => node.level === 1)
        }
        if (level === 3) {
            return parentOptions.filter(node => node.level === 1)
        }
        if (level === 4) {
            return parentOptions.filter(node => node.level === 3)
        }
        if (level === 5) {
            return parentOptions.filter(node => node.level === 3 || node.level === 4)
        }
        return []
    }

    const filteredParentOptions = getFilteredParentOptions()

    // Auto-calculate menu order based on parent
    const getNextMenuOrder = (): number => {
        const level = formState.menuLevel
        const parentId = formState.parentId

        // Find the selected parent object
        const parentNode = parentId ? parentOptions.find(p => p.id === parentId) : null

        // Find siblings based on the tree structure
        let siblings: MenuNode[] = []
        
        if (level === 1) {
            // For level 1, find all root menus (excluding current menu)
            siblings = contextMenus.filter(m => m.level === 1 && m.id !== id)
        } else if (parentNode) {
            // For other levels, find children of the selected parent (excluding current menu)
            siblings = (parentNode.children || []).filter((m: MenuNode) => m.id !== id)
        }

        if (siblings.length === 0) {
            return 1
        }

        // Get max order and add 1
        const maxOrder = Math.max(...siblings.map(m => m.order))
        return maxOrder + 1
    }

    // Recalculate order when level or parent changes
    useEffect(() => {
        // Only recalculate if not the initial load
        if (!isLoading && menu) {
            setFormState(current => ({
                ...current,
                menuOrder: getNextMenuOrder()
            }))
        }
    }, [formState.menuLevel, formState.parentId])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!id || !canEdit || isSaving) {
            return
        }

        const trimmedName = formState.menuName.trim()
        if (!trimmedName) {
            showToast({ type: "error", message: "Menu name is required" })
            return
        }

        const rawLink = formState.menuLink.trim()
        const sanitizedLink = rawLink ? (rawLink.startsWith("/") ? rawLink : `/${rawLink}`) : ""
        const normalizedModel = normalizeModelName(formState.modelName)

        if (sanitizedLink && !normalizedModel) {
            showToast({ type: "error", message: "Model key is required for linked menus" })
            return
        }

        setIsSaving(true)
        try {
            await apiFetch(`/menus/${id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    menuName: trimmedName,
                    menuOrder: Number(formState.menuOrder),
                    menuLevel: Number(formState.menuLevel),
                    menuIcon: formState.menuIcon || null,
                    menuLink: sanitizedLink || null,
                    parentId: formState.parentId || null,
                    modelName: normalizedModel || null,
                    permissionName: formState.permissionName.trim() || null,
                }),
            })

            showToast({ type: "success", message: "Menu updated" })
            navigate("/menus")
        } catch (error) {
            console.error(error)
            showToast({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to update menu",
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (!isPermissionLoading && !canEdit) {
        return (
            <div className="flex flex-col items-start gap-4 pb-10">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-lg">
                    <ChevronLeft className="size-5" />
                </Button>
                <div className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-4 text-amber-800">
                    You do not have permission to edit menus.
                </div>
            </div>
        )
    }

    if (isLoading) {
        return <p className="text-sm text-slate-500">Loading menu...</p>
    }

    if (!menu) {
        return <p className="text-sm text-red-500">Menu not found.</p>
    }

    return (
        <div className="flex flex-col pb-10">
            <div className="sticky -top-6 z-10 -mx-4 md:-mx-8 bg-slate-50 py-3 border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-lg">
                        <ChevronLeft className="size-5" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Menu</h1>
                </div>
                <Button
                    type="submit"
                    form="menu-edit-form"
                    className="rounded-lg px-6 py-5 font-bold shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>

            <form id="menu-edit-form" onSubmit={handleSubmit} className="mt-4 space-y-6">
                <Card className="border border-slate-200 rounded-3xl">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-800">Menu Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Menu Name</label>
                                <Input
                                    value={formState.menuName}
                                    onChange={event => setFormState(current => ({ ...current, menuName: event.target.value }))}
                                    className="py-5"
                                    placeholder="e.g. Dashboard"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Menu Level</label>
                                <select
                                    value={formState.menuLevel}
                                    onChange={event => {
                                        const newLevel = Number(event.target.value)
                                        setFormState(current => ({ 
                                            ...current, 
                                            menuLevel: newLevel,
                                            parentId: newLevel === 1 ? "" : current.parentId
                                        }))
                                    }}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
                                >
                                    {[1, 2, 3, 4, 5].map(level => (
                                        <option key={level} value={level}>
                                            Level {level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0 pt-1.5">Menu Parent</label>
                                <select
                                    value={formState.parentId}
                                    onChange={event => setFormState(current => ({ ...current, parentId: event.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium bg-slate-50"
                                    disabled={formState.menuLevel === 1}
                                >
                                    <option value="">{formState.menuLevel === 1 ? "" : "Select Parent"}</option>
                                    {filteredParentOptions.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Menu Order</label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={formState.menuOrder}
                                    readOnly
                                    className="py-5 bg-slate-50"
                                />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Menu Link</label>
                                <Input
                                    value={formState.menuLink}
                                    onChange={event => setFormState(current => ({ ...current, menuLink: event.target.value }))}
                                    className="py-5"
                                    placeholder="/dashboard"
                                    disabled={formState.menuLevel === 1}
                                />
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Menu Model</label>
                                <div className="flex-1 space-y-1">
                                    <Input
                                        value={formState.modelName}
                                        onChange={event =>
                                            setFormState(current => ({
                                                ...current,
                                                modelName: event.target.value.toLowerCase(),
                                            }))
                                        }
                                        onBlur={event => 
                                            setFormState(current => ({
                                                ...current,
                                                modelName: normalizeModelName(event.target.value)
                                            }))
                                        }
                                        className="py-5"
                                        placeholder="e.g. deals"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Menu Permission</label>
                                <Input
                                    value={formState.permissionName}
                                    onChange={event => setFormState(current => ({ ...current, permissionName: event.target.value }))}
                                    onBlur={event => {
                                        const val = event.target.value.trim()
                                        if (val && !val.endsWith("-view")) {
                                            setFormState(current => ({ ...current, permissionName: `${val}-view` }))
                                        }
                                    }}
                                    className="py-5"
                                    placeholder="e.g. deals-view"
                                />
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Menu Icon</label>
                                <Input
                                    value={formState.menuIcon}
                                    onChange={event => setFormState(current => ({ ...current, menuIcon: event.target.value }))}
                                    className="py-5"
                                    placeholder="layout-dashboard"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
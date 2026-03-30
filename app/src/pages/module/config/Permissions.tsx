import { useCallback, useEffect, useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/context/toast"
import { ManagementDataTable } from "@/components/data-table/management-data-table"
import {
    PERMISSION_ACTIONS,
    PERMISSION_ACTION_LABELS,
    type PermissionGroupRow,
    type PermissionRow,
    type PermissionAction,
    createPermissionGroupColumns,
} from "@/pages/module/config/permissions/columns"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { usePermissions } from "@/context/permissions"
import { apiFetch } from "@/lib/api"

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState<PermissionRow[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const { showToast } = useToast()
    const [modalActions, setModalActions] = useState<Record<PermissionAction, boolean>>({
        view: false,
        create: false,
        edit: false,
        delete: false,
    })
    const [editingGroup, setEditingGroup] = useState<PermissionGroupRow | null>(null)
    const [isCreatingNew, setIsCreatingNew] = useState(false)
    const [newResourceName, setNewResourceName] = useState("")
    const [isModalSaving, setIsModalSaving] = useState(false)
    const { hasPermission } = usePermissions()
    const canEdit = hasPermission("permissions-edit")

    const fetchPermissions = useCallback(async () => {
        try {
            const data = await apiFetch<PermissionRow[]>("/permissions")
            setPermissions(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error(error)
            setPermissions([])
        }
    }, [])

    useEffect(() => {
        const load = async () => {
            setIsLoading(true)
            try {
                await fetchPermissions()
            } catch (error) {
                console.error(error)
                showToast({
                    type: "error",
                    message: error instanceof Error ? error.message : "Failed to load permissions",
                })
            } finally {
                setIsLoading(false)
            }
        }

        void load()
    }, [fetchPermissions, showToast])

    const groupedPermissions = useMemo<PermissionGroupRow[]>(() => {
        const map = new Map<string, PermissionGroupRow>()
        permissions.forEach(permission => {
            const parts = permission.name.split("-")
            if (parts.length < 2) {
                const key = permission.name
                if (!map.has(key)) {
                    map.set(key, {
                        resource: key,
                        permissions: {
                            view: null,
                            create: null,
                            edit: null,
                            delete: null,
                        },
                        extras: [permission],
                    })
                } else {
                    map.get(key)!.extras.push(permission)
                }
                return
            }

            const action = parts.pop() as (typeof PERMISSION_ACTIONS)[number]
            const resource = parts.join("-")
            const normalizedResource = resource || permission.name

            if (!map.has(normalizedResource)) {
                map.set(normalizedResource, {
                    resource: normalizedResource,
                    permissions: {
                        view: null,
                        create: null,
                        edit: null,
                        delete: null,
                    },
                    extras: [],
                })
            }

            const group = map.get(normalizedResource)!
            if (PERMISSION_ACTIONS.includes(action)) {
                group.permissions[action] = permission
            } else {
                group.extras.push(permission)
            }
        })

        return Array.from(map.values()).sort((a, b) => a.resource.localeCompare(b.resource))
    }, [permissions])

    const openEditModal = useCallback((group: PermissionGroupRow) => {
        if (!canEdit) {
            return
        }
        setEditingGroup(group)
        setIsCreatingNew(false)
        setModalActions({
            view: Boolean(group.permissions.view),
            create: Boolean(group.permissions.create),
            edit: Boolean(group.permissions.edit),
            delete: Boolean(group.permissions.delete),
        })
    }, [canEdit])

    const openCreateModal = () => {
        if (!canEdit) return
        setIsCreatingNew(true)
        setEditingGroup(null)
        setNewResourceName("")
        setModalActions({
            view: true,
            create: true,
            edit: true,
            delete: true,
        })
    }

    const closeModal = () => {
        setEditingGroup(null)
        setIsCreatingNew(false)
        setIsModalSaving(false)
        setNewResourceName("")
        setModalActions({
            view: false,
            create: false,
            edit: false,
            delete: false,
        })
    }

    const tableColumns = useMemo<ColumnDef<PermissionGroupRow>[]>(() => {
        return createPermissionGroupColumns({
            enableEdit: canEdit,
            onEdit: canEdit ? openEditModal : undefined,
        })
    }, [canEdit, openEditModal])

    const headerControls = useMemo(
        () => (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm min-w-[280px]">
                    <Search className="size-4 text-slate-400" />
                    <Input
                        placeholder="Search resources..."
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        className="border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
                {canEdit && (
                    <Button onClick={openCreateModal} className="rounded-lg font-bold px-6 py-5">
                        New Resource
                    </Button>
                )}
            </div>
        ),
        [search, canEdit]
    )

    const handleToggleAction = (action: PermissionAction) => {
        setModalActions(current => ({
            ...current,
            [action]: !current[action],
        }))
    }

    const handleSaveModal = async () => {
        if (!editingGroup && !isCreatingNew) {
            return
        }

        const resource = isCreatingNew ? newResourceName.trim().toLowerCase() : editingGroup?.resource
        if (!resource) {
            showToast({ type: "error", message: "Resource name is required" })
            return
        }

        setIsModalSaving(true)
        try {
            for (const action of PERMISSION_ACTIONS) {
                const shouldHave = modalActions[action]
                const existing = isCreatingNew ? null : editingGroup?.permissions[action]
                
                if (shouldHave && !existing) {
                    await apiFetch("/permissions", {
                        method: "POST",
                        body: JSON.stringify({ name: `${resource}-${action}` }),
                    })
                } else if (!shouldHave && existing) {
                    await apiFetch(`/permissions/${existing.id}`, {
                        method: "DELETE",
                    })
                }
            }

            showToast({ type: "success", message: "Privileges updated" })
            await fetchPermissions()
            closeModal()
        } catch (error) {
            console.error(error)
            showToast({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to update permissions",
            })
        } finally {
            setIsModalSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 pb-10">
            {isLoading ? (
                <div className="p-8 text-center text-sm text-slate-500">Loading permissions...</div>
            ) : (
                <ManagementDataTable
                    columns={tableColumns}
                    data={groupedPermissions}
                    searchValue={search}
                    searchColumn="resource"
                    headerControls={headerControls}
                    emptyMessage="No resources available."
                />
            )}

            <Sheet open={Boolean(editingGroup) || isCreatingNew} onOpenChange={open => (open ? null : closeModal())}>
                <SheetContent side="right">
                    <div className="flex flex-col h-full">
                        <SheetHeader>
                            <SheetTitle>{isCreatingNew ? "Initialize Resource" : "Resource Privileges"}</SheetTitle>
                        </SheetHeader>
                        <div className="px-4 py-4 flex-1 space-y-4 overflow-y-auto">
                           
                            {isCreatingNew && (
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Resource Name</label>
                                    <Input
                                        value={newResourceName}
                                        onChange={e => setNewResourceName(e.target.value)}
                                        placeholder="e.g. products, leads"
                                        className="rounded-xl py-5"
                                    />
                                    <p className="text-[10px] text-slate-400">This will be used as the prefix for all actions (e.g. products-view, products-create).</p>
                                </div>
                            )}

                            {!isCreatingNew && (
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3">
                                    <p className="text-xs text-slate-400 mb-0.5 uppercase font-bold tracking-wider">Managing resource</p>
                                    <p className="text-lg font-bold text-slate-900">{editingGroup?.resource}</p>
                                </div>
                            )}

                            <div className="space-y-4 pt-4">
                                <p className="text-sm font-semibold text-slate-700 underline underline-offset-4 decoration-primary/30">Action Sets</p>
                                <div className="space-y-2">
                                    {PERMISSION_ACTIONS.map(action => (
                                        <label
                                            key={action}
                                            className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 bg-white hover:bg-slate-50 transition-colors"
                                        >
                                            <Checkbox
                                                checked={modalActions[action]}
                                                onCheckedChange={() => handleToggleAction(action)}
                                                className="size-5 rounded-md"
                                            />
                                            <div>
                                                <p className="font-bold text-slate-900">{PERMISSION_ACTION_LABELS[action]}</p>
                                                <p className="text-[10px] text-slate-400 lowercase italic">{isCreatingNew ? `${newResourceName || "resource"}-${action}` : `${editingGroup?.resource}-${action}`}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {!isCreatingNew && editingGroup?.extras.length ? (
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                                    This resource also contains {editingGroup.extras.length} custom permission
                                    {editingGroup.extras.length > 1 ? "s" : ""}. Manage them individually if needed.
                                </div>
                            ) : null}
                        </div>
                        <SheetFooter>
                            <div className="flex items-center justify-end gap-3">
                                <Button type="button" variant="outline" onClick={closeModal} disabled={isModalSaving}>
                                    Cancel
                                </Button>
                                <Button 
                                    type="button" 
                                    onClick={handleSaveModal} 
                                    className="px-8"
                                    disabled={isModalSaving || (isCreatingNew && !newResourceName.trim())}
                                >
                                    {isModalSaving ? "Saving..." : "Save Privileges"}
                                </Button>
                            </div>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

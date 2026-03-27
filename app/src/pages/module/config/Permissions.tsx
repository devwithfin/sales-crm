import { useCallback, useEffect, useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { API_BASE_URL } from "@/constants/env"
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
    const [isModalSaving, setIsModalSaving] = useState(false)
    const { hasPermission } = usePermissions()
    const canEdit = hasPermission("permissions-edit")

    const fetchPermissions = useCallback(async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setPermissions([])
            return
        }

        const response = await fetch(`${API_BASE_URL}/permissions`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Failed to load permissions")
        }

        const data = (await response.json()) as PermissionRow[]
        setPermissions(data)
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
        setModalActions({
            view: Boolean(group.permissions.view),
            create: Boolean(group.permissions.create),
            edit: Boolean(group.permissions.edit),
            delete: Boolean(group.permissions.delete),
        })
    }, [canEdit])

    const closeModal = () => {
        setEditingGroup(null)
        setIsModalSaving(false)
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
            </div>
        ),
        [search]
    )

    const handleToggleAction = (action: PermissionAction) => {
        setModalActions(current => ({
            ...current,
            [action]: !current[action],
        }))
    }

    const handleSaveModal = async () => {
        const token = localStorage.getItem("token")
        if (!token || !editingGroup) {
            showToast({ type: "error", message: "Authentication required" })
            return
        }

        setIsModalSaving(true)
        try {
            for (const action of PERMISSION_ACTIONS) {
                const shouldHave = modalActions[action]
                const existing = editingGroup.permissions[action]
                if (shouldHave && !existing) {
                    const response = await fetch(`${API_BASE_URL}/permissions`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ name: `${editingGroup.resource}-${action}` }),
                    })
                    if (!response.ok) {
                        const payload = await response.json().catch(() => null)
                        throw new Error(payload?.message ?? "Failed to create permission")
                    }
                } else if (!shouldHave && existing) {
                    const response = await fetch(`${API_BASE_URL}/permissions/${existing.id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    if (!response.ok) {
                        const payload = await response.json().catch(() => null)
                        throw new Error(payload?.message ?? "Failed to delete permission")
                    }
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
                <p className="text-sm text-slate-500">Loading permissions...</p>
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

            <Sheet open={Boolean(editingGroup)} onOpenChange={open => (open ? null : closeModal())}>
                <SheetContent side="right">
                    <div className="flex flex-col h-full">
                        <SheetHeader>
                            <SheetTitle>{editingGroup ? "Menu Privileges" : "Privileges"}</SheetTitle>
                        </SheetHeader>
                        <div className="px-4 py-4 flex-1 space-y-4 overflow-y-auto">
                           
                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-slate-700">Actions</p>
                                <div className="space-y-2">
                                    {PERMISSION_ACTIONS.map(action => (
                                        <label
                                            key={action}
                                            className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 bg-slate-50"
                                        >
                                            <Checkbox
                                                checked={modalActions[action]}
                                                onCheckedChange={() => handleToggleAction(action)}
                                                aria-label={`Toggle ${PERMISSION_ACTION_LABELS[action]}`}
                                            />
                                            <div>
                                                <p className="font-medium text-slate-900">{PERMISSION_ACTION_LABELS[action]}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {editingGroup?.extras.length ? (
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
                                <Button type="button" onClick={handleSaveModal} disabled={isModalSaving || !editingGroup}>
                                    {isModalSaving ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

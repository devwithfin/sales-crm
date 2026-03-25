import type { FormEvent } from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { API_BASE_URL } from "@/constants/env"
import { useToast } from "@/context/toast"
import { ManagementDataTable } from "@/components/data-table/management-data-table"
import {
    PERMISSION_ACTIONS,
    PERMISSION_ACTION_LABELS,
    type PermissionGroupRow,
    type PermissionRow,
    createPermissionGroupColumns,
    formatResourceLabel,
} from "@/pages/module/config/permissions/columns"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

type ModalMode = "create" | "edit" | null

const defaultActionState = {
    view: false,
    create: false,
    edit: false,
    delete: false,
}

function slugifyResource(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
}

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState<PermissionRow[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const { showToast } = useToast()
    const [modalMode, setModalMode] = useState<ModalMode>(null)
    const [modalResource, setModalResource] = useState("")
    const [modalActions, setModalActions] = useState<Record<keyof typeof defaultActionState, boolean>>(() => ({
        ...defaultActionState,
    }))
    const [editingGroup, setEditingGroup] = useState<PermissionGroupRow | null>(null)
    const [isModalSaving, setIsModalSaving] = useState(false)

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

    const openCreateModal = useCallback(() => {
        setModalMode("create")
        setEditingGroup(null)
        setModalResource("")
        setModalActions({ ...defaultActionState })
    }, [])

    const openEditModal = useCallback((group: PermissionGroupRow) => {
        setModalMode("edit")
        setEditingGroup(group)
        setModalResource(group.resource)
        setModalActions({
            view: Boolean(group.permissions.view),
            create: Boolean(group.permissions.create),
            edit: Boolean(group.permissions.edit),
            delete: Boolean(group.permissions.delete),
        })
    }, [])

    const closeModal = () => {
        setModalMode(null)
        setEditingGroup(null)
        setIsModalSaving(false)
        setModalActions({ ...defaultActionState })
    }

    const tableColumns = useMemo<ColumnDef<PermissionGroupRow>[]>(() => {
        return createPermissionGroupColumns({
            onEdit: openEditModal,
        })
    }, [openEditModal])

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
                <Button
                    type="button"
                    onClick={openCreateModal}
                    className={cn(
                        buttonVariants({ variant: "default" }),
                        "rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all gap-2"
                    )}
                >
                    <Plus className="size-4" /> New Resource
                </Button>
            </div>
        ),
        [search, openCreateModal]
    )

    const handleToggleAction = (action: keyof typeof defaultActionState) => {
        setModalActions(current => ({
            ...current,
            [action]: !current[action],
        }))
    }

    const handleSaveModal = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const token = localStorage.getItem("token")
        if (!token) {
            showToast({ type: "error", message: "Authentication required" })
            return
        }

        const normalizedResource = modalMode === "edit" ? modalResource : slugifyResource(modalResource)
        if (!normalizedResource) {
            showToast({ type: "error", message: "Resource name is required" })
            return
        }

        const selectedActions = PERMISSION_ACTIONS.filter(action => modalActions[action])
        if (selectedActions.length === 0 && modalMode === "create") {
            showToast({ type: "error", message: "Select at least one action" })
            return
        }

        setIsModalSaving(true)
        try {
            if (modalMode === "create") {
                for (const action of selectedActions) {
                    const response = await fetch(`${API_BASE_URL}/permissions`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ name: `${normalizedResource}-${action}` }),
                    })
                    if (!response.ok) {
                        const payload = await response.json().catch(() => null)
                        throw new Error(payload?.message ?? "Failed to create permission")
                    }
                }
                showToast({ type: "success", message: "Permission set created" })
            } else if (modalMode === "edit" && editingGroup) {
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
                            body: JSON.stringify({ name: `${normalizedResource}-${action}` }),
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
                showToast({ type: "success", message: "Permission set updated" })
            }

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
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Permission Management</h1>
                <p className="text-sm text-slate-500">Group permissions by resource for easier maintenance.</p>
            </div>
            {isLoading ? (
                <p className="text-sm text-slate-500">Loading permissions...</p>
            ) : (
                <ManagementDataTable
                    columns={tableColumns}
                    data={groupedPermissions}
                    searchValue={search}
                    headerControls={headerControls}
                    emptyMessage="No resources available."
                />
            )}

            <Sheet open={modalMode !== null} onOpenChange={open => (open ? null : closeModal())}>
                <SheetContent side="right">
                    <form className="flex flex-col h-full" onSubmit={handleSaveModal}>
                        <SheetHeader>
                            <SheetTitle>
                                {modalMode === "create"
                                    ? "Create Permission Set"
                                    : `Edit ${formatResourceLabel(modalResource)} Permissions`}
                            </SheetTitle>
                        </SheetHeader>
                        <div className="px-4 py-4 flex-1 space-y-4 overflow-y-auto">
                            {modalMode === "create" ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Resource Name</label>
                                        <Input
                                            value={modalResource}
                                            onChange={event => setModalResource(event.target.value)}
                                            placeholder="e.g. deals"
                                            required
                                        />
                                        <p className="text-xs text-slate-500">
                                            Use lowercase letters and hyphens. Example:{" "}
                                            <span className="font-semibold">purchase-orders</span>
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                    Configure actions for{" "}
                                    <span className="font-semibold">{formatResourceLabel(modalResource)}</span>
                                </div>
                            )}

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
                                                <p className="text-xs text-slate-500">
                                                    {action === "view"
                                                        ? "Allows read-only access"
                                                        : action === "create"
                                                          ? "Allows creating new records"
                                                          : action === "edit"
                                                            ? "Allows updating existing records"
                                                            : "Allows deleting records"}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {modalMode === "edit" && editingGroup?.extras.length ? (
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
                                <Button type="submit" disabled={isModalSaving}>
                                    {isModalSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}

import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { API_BASE_URL } from "@/constants/env"
import { useToast } from "@/context/toast"
import { useMenuData, type MenuNode } from "@/context/menu"
import { usePermissions } from "@/context/permissions"
import { ChevronLeft } from "lucide-react"
import { PERMISSION_ACTIONS, PERMISSION_ACTION_LABELS, type PermissionAction, formatResourceLabel } from "@/pages/module/config/permissions/columns"
import { cn } from "@/lib/utils"

type RoleInfo = {
    id: string
    name: string
    description: string | null
}

type PermissionItem = {
    id: string
    name: string
    assigned: boolean
}

type PermissionGroup = {
    resource: string
    label: string
    actions: Record<PermissionAction, PermissionItem | null>
    extras: PermissionItem[]
    permissionIds: string[]
}


type PermissionRow = {
    key: string
    label: string
    level: number
    group: PermissionGroup | null
    resourceSlug: string | null
    aggregatePermissionIds: string[]
}

function slugifyMenuLink(value?: string | null) {
    if (!value) {
        return null
    }

    const normalized = value
        .trim()
        .replace(/^\/+/, "")
        .replace(/\/+$/, "")
        .replace(/\//g, "-")
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")

    return normalized || null
}

function resourceFromPermissionName(permissionName?: string | null) {
    if (!permissionName) {
        return null
    }
    const parts = permissionName.split("-")
    if (parts.length <= 1) {
        return permissionName
    }
    parts.pop()
    return parts.join("-")
}

// Normalize resource slug to handle singular/plural variations
// e.g., "menus" -> "menu", "permissions" -> "permission", "roles" -> "role"
function normalizeResourceSlug(slug: string): string {
    if (!slug) {
        return slug
    }
    // Handle common plural patterns
    if (slug.endsWith("ies")) {
        return slug.slice(0, -3) + "y" // permissions -> permission
    }
    if (slug.endsWith("ses")) {
        return slug.slice(0, -2) // menus -> menu
    }
    if (slug.endsWith("s") && !slug.endsWith("ss")) {
        return slug.slice(0, -1) // accounts -> account
    }
    return slug
}


function groupRolePermissions(items: PermissionItem[]): PermissionGroup[] {
    const groups = new Map<string, PermissionGroup>()

    items.forEach(item => {
        const parts = item.name.split("-")
        const potentialAction = parts.pop()
        const resource = parts.length > 0 ? parts.join("-") : item.name
        // Normalize resource to handle singular/plural (menu vs menus, permission vs permissions, etc.)
        const rawNormalized = resource || item.name
        const normalizedResource = normalizeResourceSlug(rawNormalized)

        if (!groups.has(normalizedResource)) {
            const emptyActions: Record<PermissionAction, PermissionItem | null> = {
                view: null,
                create: null,
                edit: null,
                delete: null,
            }
            groups.set(normalizedResource, {
                resource: normalizedResource,
                label: formatResourceLabel(normalizedResource),
                actions: { ...emptyActions },
                extras: [],
                permissionIds: [],
            })
        }

        const group = groups.get(normalizedResource)!
        group.permissionIds.push(item.id)
        if (potentialAction && (PERMISSION_ACTIONS as string[]).includes(potentialAction)) {
            const actionKey = potentialAction as PermissionAction
        group.actions[actionKey] = item
    } else {
        group.extras.push(item)
    }
    })

    return Array.from(groups.values()).sort((a, b) => a.label.localeCompare(b.label))
}

export default function RoleEditPage() {
    const { id } = useParams<{ id: string }>()
    const [role, setRole] = useState<RoleInfo | null>(null)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [permissions, setPermissions] = useState<PermissionItem[]>([])
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const { showToast } = useToast()
    const navigate = useNavigate()
    const {
        refresh: refreshMenus,
        fetchAllMenus,
    } = useMenuData()
    const [menus, setMenus] = useState<MenuNode[]>([])
    const {
        refresh: refreshCurrentPermissionContext,
        hasPermission,
        isLoading: isPermissionContextLoading,
    } = usePermissions()

    const canEditRole = hasPermission("role-edit")

    useEffect(() => {
        if (!id) {
            return
        }
        const token = localStorage.getItem("token")
        if (!token) {
            return
        }

        const fetchData = async () => {
            try {
                const [roleResponse, permissionResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/roles/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    fetch(`${API_BASE_URL}/roles/${id}/permissions`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                ])

                if (!roleResponse.ok) {
                    throw new Error("Failed to load role")
                }

                if (!permissionResponse.ok) {
                    throw new Error("Failed to load role permissions")
                }

                const roleData = (await roleResponse.json()) as RoleInfo
                const permissionData = (await permissionResponse.json()) as PermissionItem[]

                setRole(roleData)
                setName(roleData.name)
                setDescription(roleData.description ?? "")
                setPermissions(permissionData)
                setSelected(new Set(permissionData.filter(permission => permission.assigned).map(permission => permission.id)))
            } catch (error) {
                console.error(error)
                showToast({
                    type: "error",
                    message: error instanceof Error ? error.message : "Failed to load role data",
                })
            } finally {
                setIsLoading(false)
            }
        }

        void fetchData()
    }, [id, showToast])

    useEffect(() => {
        const loadMenus = async () => {
            const allMenus = await fetchAllMenus()
            setMenus(allMenus)
        }

        void loadMenus()
    }, [fetchAllMenus])

    const handleToggle = (permissionId: string) => {
        setSelected(prev => {
            const next = new Set(prev)
            if (next.has(permissionId)) {
                next.delete(permissionId)
            } else {
                next.add(permissionId)
            }
            return next
        })
    }

    const handleToggleAllPermissions = (shouldSelectAll: boolean) => {
        setSelected(() => {
            if (shouldSelectAll) {
                return new Set(permissions.map(permission => permission.id))
            }
            return new Set()
        })
    }

    const updateSelectionForIds = (ids: string[], shouldSelect: boolean) => {
        setSelected(prev => {
            const next = new Set(prev)
            ids.forEach(id => {
                if (shouldSelect) {
                    next.add(id)
                } else {
                    next.delete(id)
                }
            })
            return next
        })
    }

    const handleSave = async () => {
        if (!id) {
            return
        }

        if (!role || (!roleInfoDirty && !permissionsDirty)) {
            return
        }

        const trimmedName = name.trim()
        const trimmedDescription = description.trim()

        const token = localStorage.getItem("token")
        if (!token) {
            showToast({ type: "error", message: "Authentication required" })
            return
        }

        if (roleInfoDirty && !trimmedName) {
            showToast({ type: "error", message: "Role name is required" })
            return
        }

        setIsSaving(true)
        const shouldNavigate = permissionsDirty
        try {
            if (roleInfoDirty && trimmedName) {
                const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: trimmedName,
                        description: trimmedDescription ? trimmedDescription : null,
                    }),
                })

                if (!response.ok) {
                    const payload = await response.json().catch(() => null)
                    throw new Error(payload?.message ?? "Failed to update role")
                }

                const updatedRole = (await response.json()) as RoleInfo
                setRole(updatedRole)
                setName(updatedRole.name)
                setDescription(updatedRole.description ?? "")
            }

            if (permissionsDirty) {
                const response = await fetch(`${API_BASE_URL}/roles/${id}/permissions`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ permissionIds: Array.from(selected) }),
                })

                if (!response.ok) {
                    const payload = await response.json().catch(() => null)
                    throw new Error(payload?.message ?? "Failed to update permissions")
                }

                setPermissions(prev =>
                    prev.map(permission => ({
                        ...permission,
                        assigned: selected.has(permission.id),
                    }))
                )

                await Promise.all([refreshMenus(), refreshCurrentPermissionContext()])
            }

            showToast({ type: "success", message: "Role updated" })
            if (shouldNavigate) {
                navigate("/roles")
            }
        } catch (error) {
            console.error(error)
            showToast({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to save changes",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const permissionGroups = useMemo(() => groupRolePermissions(permissions), [permissions])
    const allPermissionIds = useMemo(() => permissions.map(permission => permission.id), [permissions])
    const isAllSelected = allPermissionIds.length > 0 && allPermissionIds.every(id => selected.has(id))
    const orderedPermissionRows = useMemo<PermissionRow[]>(() => {
        const groupMap = new Map<string, PermissionGroup>()
        permissionGroups.forEach(group => {
            groupMap.set(group.resource, group)
        })

        const rows: PermissionRow[] = []
        const usedGroups = new Set<string>()

        const buildRows = (nodes: MenuNode[]): PermissionRow[] => {
            const result: PermissionRow[] = []

            nodes.forEach(node => {
                const slugFromPermission = resourceFromPermissionName(node.permission ?? undefined)
                const slugFromLink = slugifyMenuLink(node.link)
                const slugFromModel = slugifyMenuLink(node.model)
                const resourceSlug = slugFromPermission ?? slugFromLink ?? slugFromModel ?? null
                // Normalize to handle singular/plural (menu vs menus, permission vs permissions, etc.)
                const normalizedResourceSlug = resourceSlug ? normalizeResourceSlug(resourceSlug) : null
                const group = normalizedResourceSlug ? groupMap.get(normalizedResourceSlug) ?? groupMap.get(resourceSlug!) ?? null : null
                if (group) {
                    usedGroups.add(group.resource)
                }

                // Also check if the menu's permission matches any group, even if the slug doesn't
                if (node.permission) {
                    const permSlug = resourceFromPermissionName(node.permission)
                    const normalizedPermSlug = permSlug ? normalizeResourceSlug(permSlug) : null
                    // Check both normalized and original slug
                    if (permSlug && (groupMap.has(normalizedPermSlug!) || groupMap.has(permSlug))) {
                        usedGroups.add(normalizedPermSlug ?? permSlug)
                    }
                }

                const childRows = node.children?.length ? buildRows(node.children) : []
                const childAggregate = childRows.flatMap(child => child.aggregatePermissionIds)
                const ownIds = group ? group.permissionIds : []
                const aggregatePermissionIds = Array.from(new Set([...ownIds, ...childAggregate]))

                const row: PermissionRow = {
                    key: node.id,
                    label: node.name,
                    level: node.level,
                    group,
                    resourceSlug,
                    aggregatePermissionIds,
                }

                result.push(row, ...childRows)
            })

            return result
        }

        rows.push(...buildRows(menus))

        permissionGroups.forEach(group => {
            // Normalize the group resource to check against usedGroups
            const normalizedGroupResource = normalizeResourceSlug(group.resource)
            const isUsed = usedGroups.has(group.resource) || usedGroups.has(normalizedGroupResource)
            if (!isUsed) {
                rows.push({
                    key: `extra-${group.resource}`,
                    label: group.label,
                    level: 1,
                    group,
                    resourceSlug: group.resource,
                    aggregatePermissionIds: [...group.permissionIds],
                })
            }
        })

        return rows
    }, [menus, permissionGroups])

    const permissionsDirty = useMemo(() => {
        const assigned = new Set(permissions.filter(permission => permission.assigned).map(permission => permission.id))
        if (assigned.size !== selected.size) {
            return true
        }
        for (const id of selected) {
            if (!assigned.has(id)) {
                return true
            }
        }
        return false
    }, [permissions, selected])

    const roleInfoDirty = useMemo(() => {
        if (!role) {
            return false
        }

        const trimmedName = name.trim()
        const trimmedDescription = description.trim()
        const currentDescription = role.description ?? ""

        return trimmedName !== role.name || trimmedDescription !== currentDescription
    }, [role, name, description])

    if (!isPermissionContextLoading && !canEditRole) {
        return <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">You do not have permission to edit roles.</p>
    }

    if (isLoading) {
        return <p className="text-sm text-slate-500">Loading role...</p>
    }

    if (!role) {
        return <p className="text-sm text-red-500">Role not found.</p>
    }

    return (
        <div className="flex flex-col gap-6 pb-10">
            <div className="sticky -top-6 z-10 -mx-4 md:-mx-8 bg-slate-50 py-3 border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-lg">
                        <ChevronLeft className="size-5" />
                    </Button>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Role</h1>
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving || (!roleInfoDirty && !permissionsDirty)}
                    className="rounded-lg px-6 py-5 font-bold shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                >
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm rounded-3xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Role Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Role Name</label>
                            <Input
                                value={name}
                                onChange={event => setName(event.target.value)}
                                disabled={isSaving}
                                className="py-5"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                        <label className="text-sm font-medium text-slate-600 w-32 shrink-0 pt-1.5">Description</label>
                        <Textarea
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                            disabled={isSaving}
                            className="min-h-[120px] flex-1 rounded-2xl border-slate-200 focus:border-primary/30 focus:ring-primary/10"
                            placeholder="Describe the responsibilities of this role..."
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    {permissions.length > 0 ? (
                        <label className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                            <Checkbox
                                checked={isAllSelected}
                                onCheckedChange={value => handleToggleAllPermissions(Boolean(value))}
                                aria-label="Toggle all permissions"
                                className={cn(!isAllSelected && "border-red-300")}
                            />
                            <span>Privileges</span>
                        </label>
                    ) : (
                        <div className="text-lg font-semibold">Privileges</div>
                    )}
                </div>
                {orderedPermissionRows.length === 0 ? (
                    <p className="text-sm text-slate-500">No permissions available.</p>
                ) : (
                    <div className="rounded-3xl border border-slate-200 bg-white divide-y divide-slate-100">
                        {orderedPermissionRows.map(row => {
                            const group = row.group
                            const indentStyle = row.level > 1 ? { paddingLeft: `${(row.level - 1) * 18}px` } : undefined
                            const rowAllSelected = row.aggregatePermissionIds.length > 0 ? row.aggregatePermissionIds.every(id => selected.has(id)) : false

                            return (
                                <div
                                    key={row.key}
                                    className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:gap-6"
                                >
                                    <div className="flex items-center gap-3 sm:w-56" style={indentStyle}>
                                        {row.aggregatePermissionIds.length > 0 ? (
                                            <Checkbox
                                                checked={rowAllSelected}
                                                onCheckedChange={value => updateSelectionForIds(row.aggregatePermissionIds, Boolean(value))}
                                                aria-label={`Toggle all permissions for ${row.label}`}
                                                className={cn(!rowAllSelected && "border-red-300")}
                                            />
                                        ) : null}
                                        <span className={cn("font-semibold text-slate-900", row.level > 1 && "font-medium text-slate-700")}>
                                            {row.label}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-3 flex-1">
                                        {group ? (
                                            <>
                                                {PERMISSION_ACTIONS.map(action => {
                                                    const permission = group.actions[action]
                                                    if (!permission) {
                                                        return null
                                                    }

                                                    const isSelected = selected.has(permission.id)

                                                    return (
                                                        <label
                                                            key={permission.id}
                                                            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-primary/40 transition-colors cursor-pointer"
                                                        >
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onCheckedChange={() => handleToggle(permission.id)}
                                                                aria-label={`Toggle permission ${permission.name}`}
                                                                className={cn(!isSelected && "border-red-300")}
                                                            />
                                                            <span>{PERMISSION_ACTION_LABELS[action]}</span>
                                                        </label>
                                                    )
                                                })}
                                                {group.extras.map(extra => {
                                                    const isSelected = selected.has(extra.id)
                                                    return (
                                                        <label
                                                            key={extra.id}
                                                            className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 px-3 py-2 text-sm font-medium text-slate-600"
                                                        >
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onCheckedChange={() => handleToggle(extra.id)}
                                                                aria-label={`Toggle permission ${extra.name}`}
                                                                className={cn(!isSelected && "border-red-300")}
                                                            />
                                                            <span className="capitalize">{extra.name.replace(/-/g, " ")}</span>
                                                        </label>
                                                    )
                                                })}
                                            </>
                                        ) : (
                                            <span className="text-xs text-slate-400">No permissions configured</span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

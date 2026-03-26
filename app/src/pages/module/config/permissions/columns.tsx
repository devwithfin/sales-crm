import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type PermissionRow = {
    id: string
    name: string
}

export type PermissionAction = "view" | "create" | "edit" | "delete"

export const PERMISSION_ACTIONS: PermissionAction[] = ["view", "create", "edit", "delete"]

export const PERMISSION_ACTION_LABELS: Record<PermissionAction, string> = {
    view: "View",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
}

export function formatResourceLabel(resource: string) {
    if (!resource) {
        return "Unknown"
    }
    return resource
        .split("-")
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
}

export type PermissionGroupRow = {
    resource: string
    permissions: Record<PermissionAction, PermissionRow | null>
    extras: PermissionRow[]
}

type ColumnOptions = {
    enableEdit?: boolean
    enableDelete?: boolean
    onEdit?: (group: PermissionGroupRow) => void
    onDelete?: (group: PermissionGroupRow) => void
    deletingId?: string | null
}

export function createPermissionGroupColumns({
    enableEdit,
    enableDelete,
    onEdit,
    onDelete,
    deletingId,
}: ColumnOptions): ColumnDef<PermissionGroupRow>[] {
    const baseColumns: ColumnDef<PermissionGroupRow>[] = [
        {
            accessorKey: "resource",
            header: "Resource",
            cell: ({ row }) => <span className="font-semibold text-slate-900">{formatResourceLabel(row.original.resource)}</span>,
        },
        {
            id: "enabled-actions",
            header: "Enabled Actions",
            cell: ({ row }) => {
                const enabled = PERMISSION_ACTIONS.filter(action => Boolean(row.original.permissions[action]))
                const others = row.original.extras

                if (enabled.length === 0 && others.length === 0) {
                    return <span className="text-slate-400 text-sm">No permissions</span>
                }

                return (
                    <div className="flex flex-wrap gap-2">
                        {enabled.map(action => (
                            <Badge key={action} variant="secondary" className="bg-slate-100 text-slate-700 border-none">
                                {PERMISSION_ACTION_LABELS[action]}
                            </Badge>
                        ))}
                        {others.length > 0 ? (
                            <Badge variant="outline" className="border-dashed text-slate-500">
                                {others.length} custom
                            </Badge>
                        ) : null}
                    </div>
                )
            },
        },
    ]

    if (!enableEdit && !enableDelete) {
        return baseColumns
    }

    const actionColumn: ColumnDef<PermissionGroupRow> = {
        id: "actions",
        header: () => null,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-slate-100 rounded-md border-none flex items-center justify-center outline-none cursor-pointer">
                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40 rounded-xl p-1 shadow-md bg-white border border-slate-200">
                    {enableEdit ? (
                        <DropdownMenuItem
                            className="flex items-center px-3 py-2 cursor-pointer rounded-lg font-medium hover:bg-slate-50 transition-colors outline-none text-slate-700"
                            onClick={event => {
                                event.preventDefault()
                                onEdit?.(row.original)
                            }}
                            onSelect={event => {
                                event.preventDefault()
                                onEdit?.(row.original)
                            }}
                        >
                            Edit
                        </DropdownMenuItem>
                    ) : null}
                    {enableDelete ? (
                        <DropdownMenuItem
                            className={cn(
                                "flex items-center px-3 py-2 cursor-pointer rounded-lg text-red-600 hover:bg-red-50 transition-colors outline-none font-semibold text-sm",
                                deletingId === row.original.resource && "opacity-50 pointer-events-none"
                            )}
                            onSelect={event => {
                                event.preventDefault()
                                if (deletingId === row.original.resource) {
                                    return
                                }
                                onDelete?.(row.original)
                            }}
                        >
                            Delete
                        </DropdownMenuItem>
                    ) : null}
                </DropdownMenuContent>
            </DropdownMenu>
        ),
        size: 10,
    }

    return [actionColumn, ...baseColumns]
}

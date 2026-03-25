import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PencilLine } from "lucide-react"

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
    onEdit?: (group: PermissionGroupRow) => void
}

export function createPermissionGroupColumns({ onEdit }: ColumnOptions): ColumnDef<PermissionGroupRow>[] {
    const columns: ColumnDef<PermissionGroupRow>[] = [
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

    columns.push({
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => onEdit?.(row.original)}
            >
                <PencilLine className="size-3.5 mr-1.5" /> Edit
            </Button>
        ),
    })

    return columns
}

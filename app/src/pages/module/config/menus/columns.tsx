import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Link } from "react-router-dom"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type MenuRow = {
    id: string
    name: string
    level: number
    order: number
    link: string | null
    icon: string | null
    permission: string | null
    isGroup: boolean
    model: string | null
    parentId: string | null
    parentName: string | null
    children?: MenuRow[]
}

type ColumnOptions = {
    enableEdit: boolean
    enableDelete: boolean
    onDelete?: (menu: MenuRow) => void
    deletingId?: string | null
}

export function createMenuColumns({ enableEdit, enableDelete, onDelete, deletingId }: ColumnOptions): ColumnDef<MenuRow>[] {
    const baseColumns: ColumnDef<MenuRow>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={(table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")) as boolean}
                    onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={value => row.toggleSelected(!!value)}
                    aria-label={`Select menu ${row.original.name}`}
                />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 10,
        },
        {
            accessorKey: "name",
            header: "Menu Name",
            cell: ({ row }) => (
                <span className="font-semibold text-slate-900">{row.original.name}</span>
            ),
        },
        {
            accessorKey: "level",
            header: "Menu Level",
            cell: ({ row }) => (
                <span className="text-sm text-slate-600">
                    {row.original.level}
                </span>
            ),
        },
        {
            id: "parent",
            header: "Menu Parent",
            cell: ({ row }) => (
                <span className="text-sm text-slate-600">
                    {row.original.parentName || "-"}
                </span>
            ),
        },
        {
            accessorKey: "link",
            header: "Menu Link",
            cell: ({ row }) => (
                <span className={`text-sm ${row.original.link ? "text-slate-600" : "text-slate-400"}`}>
                    {row.original.link || "-"}
                </span>
            ),
        },
    ]

    if (!enableEdit && !enableDelete) {
        return baseColumns
    }

    const actionColumn: ColumnDef<MenuRow> = {
        id: "actions",
        header: () => null,
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-slate-100 rounded-md border-none flex items-center justify-center outline-none cursor-pointer">
                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-24 rounded-xl p-1 shadow-md bg-white border border-slate-200">
                    {enableEdit ? (
                        <DropdownMenuItem className="flex items-center px-3 py-2 cursor-pointer rounded-lg hover:bg-slate-50 transition-colors outline-none text-slate-700">
                            <Link to={`/menus/${row.original.id}/edit`} className="text-sm font-medium w-full">
                                Edit
                            </Link>
                        </DropdownMenuItem>
                    ) : null}
                    {enableDelete ? (
                        <DropdownMenuItem
                            className={cn(
                                "flex items-center px-3 py-2 cursor-pointer rounded-lg text-red-600 hover:bg-red-50 transition-colors outline-none font-semibold text-sm",
                                deletingId === row.original.id && "opacity-50 pointer-events-none"
                            )}
                            onClick={() => {
                                if (deletingId === row.original.id) {
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
        enableSorting: false,
        enableHiding: false,
        size: 10,
    }

    return [actionColumn, ...baseColumns]
}

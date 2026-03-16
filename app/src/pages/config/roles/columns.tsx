import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Role = {
    id: string
    name: string
    description: string
    userCount: number
}

export const columns: ColumnDef<Role>[] = [
    {
        id: "actions",
        header: () => null,
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-slate-100 rounded-md border-none flex items-center justify-center outline-none cursor-pointer">
                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-24 rounded-xl p-1 shadow-md bg-white border border-slate-200">
                    <DropdownMenuItem className="flex items-center px-3 py-2 cursor-pointer rounded-lg hover:bg-slate-50 transition-colors outline-none text-slate-700">
                        <span className="text-sm font-medium">Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center px-3 py-2 cursor-pointer rounded-lg hover:bg-slate-50 transition-colors outline-none text-slate-700">
                        <span className="text-sm font-medium">Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 10,
    },
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={(table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")) as any}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label={`Select role ${row.original.name}`}
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 10,
    },
    {
        accessorKey: "name",
        header: "Role Name",
        cell: ({ row }) => <span className="font-semibold text-slate-900">{row.original.name}</span>,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => <span className="text-slate-500 text-sm line-clamp-1">{row.original.description}</span>,
    },
    {
        accessorKey: "userCount",
        header: "Users",
        cell: ({ row }) => (
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none font-medium">
                {row.original.userCount} Users
            </Badge>
        ),
    },
]

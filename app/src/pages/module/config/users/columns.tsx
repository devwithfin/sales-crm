import { Link } from "react-router-dom"
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

export type User = {
    id: string
    fullName: string
    email: string
    role: { id: string; name: string }
    department: string | null
    status: string
}

export const columns: ColumnDef<User>[] = [
    {
        id: "actions",
        header: () => null,
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-slate-100 rounded-md border-none flex items-center justify-center outline-none cursor-pointer">
                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-24 rounded-xl p-1 shadow-md bg-white border border-slate-200">
                        <DropdownMenuItem 
                            className="flex items-center px-3 py-2 cursor-pointer rounded-lg hover:bg-slate-50 transition-colors outline-none text-slate-700"
                        >
                            <Link to={`/users/${row.original.id}/edit`} className="text-sm font-medium w-full">
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center px-3 py-2 cursor-pointer rounded-lg hover:bg-slate-50 transition-colors outline-none text-slate-700 text-red-500">
                            <span className="text-sm font-medium">Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        enableSorting: false,
        enableHiding: false,
        size: 10,
    },
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={(table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")) as boolean}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label={`Select user ${row.original.fullName}`}
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 10,
    },
    {
        accessorKey: "fullName",
        header: "Name",
        cell: ({ row }) => (
            <span className="font-semibold text-slate-900">
                {row.original.fullName}
            </span>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <span className="text-slate-500 text-sm">
                {row.original.email}
            </span>
        ),
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
            <span className="text-slate-700 text-sm font-medium">
                {row.original.role?.name || 'N/A'}
            </span>
        ),
    },
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => <span className="text-slate-500 text-sm">{row.original.department || '-'}</span>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const isActive = row.original.status === "Active"
            return (
                <Badge variant={isActive ? "default" : "secondary"} className={`rounded-md font-medium ${isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-slate-100 text-slate-600 hover:bg-slate-100"}`}>
                    {row.original.status}
                </Badge>
            )
        },
    },
]

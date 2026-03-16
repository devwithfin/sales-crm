import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type User = {
    id: string
    name: string
    email: string
    role: string
    department: string
    status: "Active" | "Inactive"
    avatarUrl?: string
}

export const columns: ColumnDef<User>[] = [
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
                aria-label={`Select user ${row.original.name}`}
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 10,
    },
    {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => {
            const initials = row.original.name.split(' ').map(n => n[0]).join('')
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                        <AvatarImage src={row.original.avatarUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 leading-none">{row.original.name}</span>
                        <span className="text-[11px] text-slate-400 mt-1">{row.original.email}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
            <Badge variant="outline" className="rounded-md font-medium border-slate-200 text-slate-600">
                {row.original.role}
            </Badge>
        ),
    },
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => <span className="text-slate-500 text-sm">{row.original.department}</span>,
    },

]

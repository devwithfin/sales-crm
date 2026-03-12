import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export type Lead = {
    name: string
    company: string
    email: string
    phone: string
    status: "New" | "Working" | "Qualified"
    owner: string
}

const statusColors: Record<Lead["status"], string> = {
    New: "bg-blue-50 text-blue-600 border-blue-100",
    Working: "bg-amber-50 text-amber-600 border-amber-100",
    Qualified: "bg-emerald-50 text-emerald-600 border-emerald-100",
}

export const columns: ColumnDef<Lead>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label={`Select lead ${row.original.name}`}
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 10,
    },
    {
        accessorKey: "name",
        header: "Lead Name",
        cell: ({ row }) => (
            <span className="font-semibold text-slate-900">{row.original.name}</span>
        ),
    },
    {
        accessorKey: "company",
        header: "Company",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "owner",
        header: "Sales Owner",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge className={`rounded-full border ${statusColors[row.original.status]}`}>
                {row.original.status}
            </Badge>
        ),
    },
]

import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/context/toast"
import { usePermissions } from "@/context/permissions"
import { useNavigate } from "react-router-dom"
import { apiFetch } from "@/lib/api"

export type ProductCategory = {
    id: string
    name: string
}

export type Product = {
    id: string
    code: string
    name: string
    price: number
    unit: string | null
    status: string
    description: string | null
    categoryId: string
    category?: ProductCategory
}

export const columns: ColumnDef<Product>[] = [
    {
        id: "actions",
        header: () => null,
        cell: ({ row, table }) => {
            const product = row.original
            const { showToast } = useToast()
            const { hasPermission } = usePermissions()
            const navigate = useNavigate()
            // Access meta from table to trigger a refresh
            const meta = table.options.meta as { refresh?: () => void }

            const handleDelete = async () => {
                if (!confirm(`Are you sure you want to delete ${product.name}?`)) return
                try {
                    await apiFetch(`/products/${product.id}`, { method: "DELETE" })
                    showToast({ type: "success", message: "Product deleted" })
                    meta?.refresh?.()
                } catch (error) {
                    showToast({
                        type: "error",
                        message: error instanceof Error ? error.message : "Failed to delete product",
                    })
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-slate-100 rounded-md border-none flex items-center justify-center outline-none cursor-pointer">
                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-24 rounded-xl p-1 shadow-md bg-white border border-slate-200">
                        {hasPermission("products-edit") && (
                            <DropdownMenuItem
                                onClick={() => navigate(`/products/${product.id}/edit`)}
                                className="flex items-center px-3 py-2 cursor-pointer rounded-lg hover:bg-slate-50 transition-colors outline-none text-slate-700"
                            >
                                <span className="text-sm font-medium w-full">Edit</span>
                            </DropdownMenuItem>
                        )}
                        {hasPermission("products-delete") && (
                            <DropdownMenuItem
                                onClick={handleDelete}
                                className="flex items-center px-3 py-2 cursor-pointer rounded-lg text-red-600 hover:bg-red-50 transition-colors outline-none font-semibold text-sm"
                            >
                                Delete
                            </DropdownMenuItem>
                        )}
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
                checked={(table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")) as any}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label={`Select ${row.original.name}`}
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 10,
    },
    {
        accessorKey: "code",
        header: "Product Code",
        cell: ({ row }) => <span className="font-medium text-slate-500">{row.original.code}</span>,
    },
    {
        accessorKey: "name",
        header: "Product Name",
        cell: ({ row }) => <span className="font-semibold text-slate-900">{row.original.name}</span>,
    },
    {
        accessorKey: "category.name",
        header: "Category",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(price)

            return <span className="font-semibold text-slate-900">{formatted}</span>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${
                        status === "Available" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}
                >
                    {status}
                </span>
            )
        },
    },
]

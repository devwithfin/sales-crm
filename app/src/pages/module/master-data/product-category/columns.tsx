import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type ProductCategory = {
    id: string
    name: string
    _count?: {
        products: number
    }
    createdAt: string
}

type ColumnOptions = {
    enableEdit: boolean
    enableDelete: boolean
    onDelete?: (category: ProductCategory) => void
    deletingId?: string | null
}

export function createProductCategoryColumns({ enableEdit, enableDelete, onDelete, deletingId }: ColumnOptions): ColumnDef<ProductCategory>[] {
    const baseColumns: ColumnDef<ProductCategory>[] = [
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
                    aria-label={`Select category ${row.original.name}`}
                />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 10,
        },
        {
            accessorKey: "name",
            header: "Category Name",
            cell: ({ row }) => <span className="font-semibold text-slate-900">{row.original.name}</span>,
        },
        {
            id: "productCount",
            header: "Products",
            cell: ({ row }) => (
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none font-medium">
                    {row.original._count?.products || 0} Products
                </Badge>
            ),
        },
    ]

    if (!enableEdit && !enableDelete) {
        return baseColumns
    }

    const actionColumn: ColumnDef<ProductCategory> = {
        id: "actions",
        header: () => null,
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-slate-100 rounded-md border-none flex items-center justify-center outline-none cursor-pointer">
                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-32 rounded-xl p-1 shadow-md bg-white border border-slate-200">
                    {enableEdit ? (
                        <DropdownMenuItem className="flex items-center px-3 py-2 cursor-pointer rounded-lg hover:bg-slate-50 transition-colors outline-none text-slate-700">
                            <Link to={`/category-product/${row.original.id}/edit`} className="text-sm font-medium w-full text-blue-600">
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

import type { Table } from "@tanstack/react-table"

interface DataTablePageSizeProps<TData> {
    table: Table<TData>
}

const pageSizeOptions = [5, 10, 20]

export function DataTablePageSize<TData>({ table }: DataTablePageSizeProps<TData>) {
    const { pageSize } = table.getState().pagination

    return (
        <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Rows per page:</span>
            <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                value={pageSize}
                onChange={(event) => table.setPageSize(Number(event.target.value))}
            >
                {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                ))}
            </select>
        </div>
    )
}

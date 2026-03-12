import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { Table } from "@tanstack/react-table"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    onSearchChange?: (value: string) => void
    searchValue?: string
}

export function DataTableToolbar<TData>({ table, onSearchChange, searchValue }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <Search className="size-4 text-slate-400" />
                <Input
                    placeholder="Search lead..."
                    value={searchValue ?? ""}
                    onChange={(event) => onSearchChange?.(event.target.value)}
                    className="border-none h-8 px-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>
            {isFiltered && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 self-start text-slate-500"
                    onClick={() => {
                        table.resetColumnFilters()
                        onSearchChange?.("")
                    }}
                >
                    Reset
                    <X className="size-4" />
                </Button>
            )}
        </div>
    )
}

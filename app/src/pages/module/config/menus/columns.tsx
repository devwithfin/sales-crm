import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export type MenuRow = {
    id: string
    name: string
    level: number
    link: string | null
    isGroup: boolean
    model: string | null
}

export function createMenuColumns(): ColumnDef<MenuRow>[] {
    return [
        {
            accessorKey: "name",
            header: "Menu Name",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">{row.original.name}</span>
                    <span className="text-xs text-slate-400">Level {row.original.level}</span>
                </div>
            ),
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) =>
                row.original.isGroup ? (
                    <Badge variant="outline" className="border-slate-200 text-slate-600">
                        Group
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none">
                        Link
                    </Badge>
                ),
        },
        {
            accessorKey: "link",
            header: "Menu Link",
            cell: ({ row }) => (
                <span className={`text-sm ${row.original.link ? "text-slate-600" : "text-slate-400 italic"}`}>
                    {row.original.link || "No link"}
                </span>
            ),
        },
        {
            accessorKey: "model",
            header: "Model Key",
            cell: ({ row }) => (
                <code className="text-xs font-semibold text-slate-600 bg-slate-100 rounded px-2 py-0.5">
                    {row.original.model || "-"}
                </code>
            ),
        },
    ]
}

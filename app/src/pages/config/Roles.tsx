import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { RolesDataTable } from "@/pages/config/roles/data-table"
import { columns, type Role } from "@/pages/config/roles/columns"

const dummyRoles: Role[] = [
    { id: "1", name: "Administrator", description: "Full access to all modules and settings", userCount: 3 },
    { id: "2", name: "Sales Manager", description: "Manage sales team, leads, and deals", userCount: 5 },
    { id: "3", name: "Sales Executive", description: "Access to leads, contacts, and deals", userCount: 12 },
    { id: "4", name: "Marketing", description: "Manage campaigns and leads", userCount: 4 },
    { id: "5", name: "Support", description: "Access to customers and service tickets", userCount: 8 },
]

export default function RolesPage() {
    const [search, setSearch] = useState("")

    const headerControls = (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm min-w-[280px]">
                <Search className="size-4 text-slate-400" />
                <Input
                    placeholder="Search roles..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>
            <Link
                to="/roles/create"
                className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all gap-2"
                )}
            >
                <Plus className="size-4" /> Create Role
            </Link>
        </div>
    )

    return (
        <div className="flex flex-col gap-6 pb-10">


            <RolesDataTable
                columns={columns}
                data={dummyRoles}
                searchValue={search}
                headerControls={headerControls}
            />
        </div>
    )
}

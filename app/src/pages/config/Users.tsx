import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { UsersDataTable } from "@/pages/config/users/data-table"
import { columns, type User } from "@/pages/config/users/columns"

const dummyUsers: User[] = [
    { id: "1", name: "Budi Santoso", email: "budi@lichemindo.com", role: "Administrator", department: "IT", status: "Active" },
    { id: "2", name: "Siti Rahmawati", email: "siti@lichemindo.com", role: "Sales Manager", department: "Sales", status: "Active" },
    { id: "3", name: "Joko Anwar", email: "joko@lichemindo.com", role: "Sales Executive", department: "Sales", status: "Active" },
    { id: "4", name: "Dewi Lestari", email: "dewi@lichemindo.com", role: "Sales Executive", department: "Sales", status: "Inactive" },
    { id: "5", name: "Rina Kusuma", email: "rina@lichemindo.com", role: "Marketing", department: "Marketing", status: "Active" },
]

export default function UsersPage() {
    const [search, setSearch] = useState("")

    const headerControls = (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm min-w-[280px]">
                <Search className="size-4 text-slate-400" />
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>
            <Link
                to="/users/create"
                className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all gap-2"
                )}
            >
                <Plus className="size-4" /> Create User
            </Link>
        </div>
    )

    return (
        <div className="flex flex-col gap-6 pb-10">


            <UsersDataTable
                columns={columns}
                data={dummyUsers}
                searchValue={search}
                headerControls={headerControls}
            />
        </div>
    )
}

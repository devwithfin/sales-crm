import { useState } from "react"
import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { VisitsDataTable } from "@/pages/sales/visits/data-table"
import { columns, type Visit } from "@/pages/sales/visits/columns"

const visits: Visit[] = [
    {
        id: "1",
        title: "Product Showcase - Arcadia Pharma",
        location: "Arcadia Office, Lt. 5",
        from: "2026-03-20 10:00",
        to: "2026-03-20 12:00",
        host: "Budi Santoso",
        relatedTo: "Arcadia Pharma (Account)"
    },
    {
        id: "2",
        title: "Technical Meeting - Global Chem",
        location: "Global Chem Factory",
        from: "2026-03-22 14:00",
        to: "2026-03-22 16:00",
        host: "Rina Kusuma",
        relatedTo: "Jonathan Prasetyo (Contact)"
    },
    {
        id: "3",
        title: "Contract Negotiation - Nusantara Tech",
        location: "The Plaza, Room 302",
        from: "2026-03-25 09:00",
        to: "2026-03-25 11:00",
        host: "Dewi Lestari",
        relatedTo: "Nusantara Tech (Account)"
    }
]

export default function VisitsPage() {
    const [search, setSearch] = useState("")

    const headerControls = (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm min-w-[280px]">
                <Search className="size-4 text-slate-400" />
                <Input
                    placeholder="Search visit..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>
            <Link
                to="/visits/create"
                className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                )}
            >
                Create Visit
            </Link>
        </div>
    )

    return (
        <div className="flex flex-col gap-6 pb-10">


            <VisitsDataTable
                columns={columns}
                data={visits}
                searchValue={search}
                headerControls={headerControls}
            />
        </div>
    )
}

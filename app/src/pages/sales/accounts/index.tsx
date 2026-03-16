import { useState } from "react"
import { Link } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { AccountsDataTable } from "@/pages/sales/accounts/data-table"
import { columns, type Account } from "@/pages/sales/accounts/columns"
import { cn } from "@/lib/utils"

const accounts: Account[] = [
    {
        name: "PT. Nusantara Tech",
        industry: "Technology",
        website: "www.nusantaratech.com",
        phone: "+62 812-5555-1212",
        owner: "Budi Santoso"
    },
    {
        name: "Global Chem Indonesia",
        industry: "Manufacturing",
        website: "www.globalchem.id",
        phone: "+62 811-6812-2200",
        owner: "Rina Kusuma"
    },
    {
        name: "Plaza Properti Group",
        industry: "Real Estate",
        website: "www.plazaproperti.com",
        phone: "+62 822-3333-9811",
        owner: "Dewi Lestari"
    },
    {
        name: "Metro Retail Corp",
        industry: "Retail",
        website: "www.metroretail.co.id",
        phone: "+62 812-4111-1717",
        owner: "Budi Santoso"
    },
    {
        name: "Skyline Logistics",
        industry: "Logistics",
        website: "www.skyline-log.com",
        phone: "+62 813-2345-9876",
        owner: "Joko Anwar"
    },
]

export default function AccountsPage() {
    const [search, setSearch] = useState("")

    const headerControls = (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm min-w-[280px]">
                <Search className="size-4 text-slate-400" />
                <Input
                    placeholder="Search account..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>
            <Link
                to="/accounts/create"
                className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                )}
            >
                Create Account
            </Link>
        </div>
    )

    return (
        <div className="flex flex-col gap-6 pb-10">
            <AccountsDataTable
                columns={columns}
                data={accounts}
                searchValue={search}
                headerControls={headerControls}
            />
        </div>
    )
}

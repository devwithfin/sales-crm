import { useState } from "react"
import { Link } from "react-router-dom"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { LeadsDataTable } from "@/pages/module/sales/leads/data-table"
import { columns, type Lead } from "@/pages/module/sales/leads/columns"
import { cn } from "@/lib/utils"

const leads: Lead[] = [
    {
        name: "Ayu Lestari",
        company: "PT. Nusantara Tech",
        email: "ayu@nusantaratech.com",
        phone: "+62 812-5555-1212",
        status: "New",
        owner: "Budi Santoso"
    },
    {
        name: "Riza Mahendra",
        company: "Global Chem Indonesia",
        email: "riza@globalchem.id",
        phone: "+62 811-6812-2200",
        status: "Working",
        owner: "Rina Kusuma"
    },
    {
        name: "Sari Pratama",
        company: "Plaza Properti",
        email: "sari@plazaproperti.com",
        phone: "+62 822-3333-9811",
        status: "Qualified",
        owner: "Dewi Lestari"
    },
    {
        name: "Aditya Wibowo",
        company: "Metro Retail",
        email: "adi@metroretail.co.id",
        phone: "+62 812-4111-1717",
        status: "New",
        owner: "Budi Santoso"
    },
    {
        name: "Maria Putri",
        company: "Skyline Logistics",
        email: "maria@skyline-log.com",
        phone: "+62 813-2345-9876",
        status: "Working",
        owner: "Joko Anwar"
    },
    {
        name: "Dimas Prakoso",
        company: "PT. Sentosa Sejahtera",
        email: "dimas@sentosa.co.id",
        phone: "+62 822-1199-4433",
        status: "Qualified",
        owner: "Rina Kusuma"
    },
    {
        name: "Laras Putri",
        company: "Makmur Logistic",
        email: "laras@makmurlogistic.com",
        phone: "+62 811-3900-5544",
        status: "Working",
        owner: "Dewi Lestari"
    },
    {
        name: "Fajar Mahesa",
        company: "PT. Digital Nusantara",
        email: "fajar@digitalnusantara.id",
        phone: "+62 812-8000-1122",
        status: "New",
        owner: "Budi Santoso"
    },
    {
        name: "Citra Ayuningtyas",
        company: "Galaxy Pharma",
        email: "citra@galaxypharma.com",
        phone: "+62 813-1555-8899",
        status: "Working",
        owner: "Joko Anwar"
    },
    {
        name: "Kevin Ferdinand",
        company: "Metro Builders",
        email: "kevin@metrobuilder.id",
        phone: "+62 822-7654-3321",
        status: "New",
        owner: "Dewi Lestari"
    },
    {
        name: "Nadia Kurnia",
        company: "PT. Sejahtera Mining",
        email: "nadia@sejahtera-mining.com",
        phone: "+62 811-7777-1444",
        status: "Qualified",
        owner: "Rina Kusuma"
    },
    {
        name: "Rafi Maulana",
        company: "Borneo Agro",
        email: "rafi@borneoagro.co.id",
        phone: "+62 822-9898-6767",
        status: "Working",
        owner: "Budi Santoso"
    },
    {
        name: "Olivia Wenas",
        company: "Sky Tower Group",
        email: "olivia@skytower.group",
        phone: "+62 812-0666-4411",
        status: "New",
        owner: "Joko Anwar"
    },
    {
        name: "Bagus Wibisono",
        company: "PT. Prima Retail",
        email: "bagus@primaretail.com",
        phone: "+62 813-9001-2200",
        status: "Working",
        owner: "Dewi Lestari"
    },
    {
        name: "Anya Rosalina",
        company: "Sinar Elektrik",
        email: "anya@sinar-elektrik.id",
        phone: "+62 811-8433-5599",
        status: "Qualified",
        owner: "Rina Kusuma"
    },
]

export default function LeadsPage() {
    const [search, setSearch] = useState("")

    const headerControls = (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm min-w-[280px]">
                <Search className="size-4 text-slate-400" />
                <Input
                    placeholder="Search lead..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>
            <Link
                to="/leads/create"
                className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                )}
            >
                Create Lead
            </Link>
        </div>
    )

    return (
        <div className="flex flex-col gap-6 pb-10">
            <LeadsDataTable
                columns={columns}
                data={leads}
                searchValue={search}
                headerControls={headerControls}
            />
        </div>
    )
}

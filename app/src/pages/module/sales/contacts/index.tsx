import { useState } from "react"
import { Link } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ContactsDataTable } from "@/pages/module/sales/contacts/data-table"
import { columns, type Contact } from "@/pages/module/sales/contacts/columns"
import { cn } from "@/lib/utils"

const contacts: Contact[] = [
    {
        name: "Jonathan Prasetyo",
        company: "Arcadia Pharma",
        email: "jonathan@arcadia.id",
        phone: "+62 812-8899-0202",
        owner: "Rina Kusuma",
    },
    {
        name: "Maya Surya",
        company: "Metro Retail",
        email: "maya@metroretail.co.id",
        phone: "+62 811-7766-5432",
        owner: "Budi Santoso",
    },
    {
        name: "Rahmat Hidayat",
        company: "Sinar Elektrik",
        email: "rahmat@sinar-elektrik.id",
        phone: "+62 813-6655-3344",
        owner: "Joko Anwar",
    },
    {
        name: "Clara Natalia",
        company: "Nusantara Tech",
        email: "clara@nusantaratech.com",
        phone: "+62 812-1100-5577",
        owner: "Dewi Lestari",
    },
    {
        name: "Fajar Satria",
        company: "Makmur Logistic",
        email: "fajar@makmurlogistic.com",
        phone: "+62 822-9000-4545",
        owner: "Budi Santoso",
    },
    {
        name: "Tasya Pramudita",
        company: "Plaza Properti",
        email: "tasya@plazaproperti.com",
        phone: "+62 811-3322-7788",
        owner: "Rina Kusuma",
    },
    {
        name: "Irwan Wijaya",
        company: "Skyline Logistics",
        email: "irwan@skyline-log.com",
        phone: "+62 813-5400-9988",
        owner: "Dewi Lestari",
    },
    {
        name: "Dewi Rahmania",
        company: "Global Chem",
        email: "dewi@globalchem.id",
        phone: "+62 822-6655-7788",
        owner: "Joko Anwar",
    },
    {
        name: "Felix Samudra",
        company: "Digital Nusantara",
        email: "felix@digitalnusantara.id",
        phone: "+62 811-9090-1212",
        owner: "Budi Santoso",
    },
    {
        name: "Nadia Laras",
        company: "Delta Corp",
        email: "nadia@deltacorp.co.id",
        phone: "+62 813-4455-7788",
        owner: "Rina Kusuma",
    },
]

export default function ContactsPage() {
    const [search, setSearch] = useState("")

    const headerControls = (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm min-w-[280px]">
                <Search className="size-4 text-slate-400" />
                <Input
                    placeholder="Search contact..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>
            <Link
                to="/contacts/create"
                className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                )}
            >
                Create Contact
            </Link>
        </div>
    )

    return (
        <div className="flex flex-col gap-6 pb-10">
            <ContactsDataTable
                columns={columns}
                data={contacts}
                searchValue={search}
                headerControls={headerControls}
            />
        </div>
    )
}

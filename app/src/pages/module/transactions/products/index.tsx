import { useState } from "react"
import { Link } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProductsDataTable } from "@/pages/module/transactions/products/data-table"
import { columns, type Product } from "@/pages/module/transactions/products/columns"

const products: Product[] = [
    { name: "Hydrochloric Acid", category: "Chemical", price: "Rp1.200.000", status: "Available" },
    { name: "Sulfur Powder", category: "Chemical", price: "Rp980.000", status: "Out of Stock" },
    { name: "Industrial Resin", category: "Industrial", price: "Rp2.450.000", status: "Available" },
    { name: "Epoxy Primer", category: "Industrial", price: "Rp1.750.000", status: "Available" },
    { name: "Packaging Tape", category: "Packaging", price: "Rp250.000", status: "Available" },
    { name: "Food Grade Oil", category: "Food", price: "Rp1.050.000", status: "Out of Stock" },
    { name: "Bulk Plastic Pellets", category: "Packaging", price: "Rp3.700.000", status: "Available" },
    { name: "Stainless Fittings", category: "Mechanical", price: "Rp4.900.000", status: "Available" },
    { name: "Industrial Cleaner", category: "Chemical", price: "Rp860.000", status: "Available" },
    { name: "Catalyst Mix", category: "Chemical", price: "Rp6.100.000", status: "Out of Stock" },
]

export default function ProductsPage() {
    const [search, setSearch] = useState("")

    const headerControls = (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm min-w-[280px]">
                <Search className="size-4 text-slate-400" />
                <Input
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>
            <Link
                to="/products/create"
                className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                )}
            >
                Create Product
            </Link>
        </div>
    )

    return (
        <div className="flex flex-col gap-6 pb-10">
            <ProductsDataTable columns={columns} data={products} searchValue={search} headerControls={headerControls} />
        </div>
    )
}

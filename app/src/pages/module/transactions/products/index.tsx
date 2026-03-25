import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ProductsDataTable } from "@/pages/module/transactions/products/data-table"
import { columns, type Product } from "@/pages/module/transactions/products/columns"

const products: Product[] = [
    { name: "Hydrochloric Acid", sku: "CHEM-001", category: "Chemical", price: "Rp1.200.000", status: "Available" },
    { name: "Sulfur Powder", sku: "CHEM-002", category: "Chemical", price: "Rp980.000", status: "Out of Stock" },
    { name: "Industrial Resin", sku: "IND-101", category: "Industrial", price: "Rp2.450.000", status: "Available" },
    { name: "Epoxy Primer", sku: "IND-102", category: "Industrial", price: "Rp1.750.000", status: "Available" },
    { name: "Packaging Tape", sku: "PKG-010", category: "Packaging", price: "Rp250.000", status: "Available" },
    { name: "Food Grade Oil", sku: "FD-200", category: "Food", price: "Rp1.050.000", status: "Out of Stock" },
    { name: "Bulk Plastic Pellets", sku: "PKG-050", category: "Packaging", price: "Rp3.700.000", status: "Available" },
    { name: "Stainless Fittings", sku: "MECH-021", category: "Mechanical", price: "Rp4.900.000", status: "Available" },
    { name: "Industrial Cleaner", sku: "CHEM-045", category: "Chemical", price: "Rp860.000", status: "Available" },
    { name: "Catalyst Mix", sku: "CHEM-057", category: "Chemical", price: "Rp6.100.000", status: "Out of Stock" },
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
            <Button className="rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all" asChild>
                <a href="/products/create">Create Product</a>
            </Button>
        </div>
    )

    return (
        <div className="flex flex-col gap-6 pb-10">
            <ProductsDataTable columns={columns} data={products} searchValue={search} headerControls={headerControls} />
        </div>
    )
}

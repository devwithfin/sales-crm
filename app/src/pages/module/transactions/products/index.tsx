import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProductsDataTable } from "@/pages/module/transactions/products/data-table"
import { columns, type Product } from "@/pages/module/transactions/products/columns"
import { apiFetch } from "@/lib/api"
import { usePermissions } from "@/context/permissions"

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const { hasPermission } = usePermissions()

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const data = await apiFetch<Product[]>("/products")
            setProducts(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Failed to fetch products:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        void fetchData()
    }, [])

    const headerControls = (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm min-w-[280px]">
                <Search className="size-4 text-slate-400" />
                <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>
            {hasPermission("products-create") && (
                <Link
                    to="/products/create"
                    className={cn(
                        buttonVariants({ variant: "default" }),
                        "rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                    )}
                >
                    Create
                </Link>
            )}
        </div>
    )

    return (
        <div className="flex flex-col gap-6 pb-10">
            <ProductsDataTable
                columns={columns}
                data={products}
                searchValue={search}
                headerControls={headerControls}
                meta={{ refresh: fetchData }}
            />
            {isLoading && <p className="text-center text-sm text-slate-500">Loading products...</p>}
        </div>
    )
}

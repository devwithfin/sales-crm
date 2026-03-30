import { useCallback, useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ManagementDataTable } from "@/components/data-table/management-data-table"
import { createProductCategoryColumns, type ProductCategory } from "./columns"
import { useToast } from "@/context/toast"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { apiFetch } from "@/lib/api"
import { usePermissions } from "@/context/permissions"

export default function ProductCategoryPage() {
    const [categories, setCategories] = useState<ProductCategory[]>([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null)
    const { showToast } = useToast()
    const { hasPermission, isLoading: permissionsLoading } = usePermissions()

    const loadCategories = useCallback(async () => {
        try {
            const data = await apiFetch<ProductCategory[]>("/category-product")
            setCategories(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Failed to fetch categories", error)
            setCategories([])
            showToast({ type: "error", message: "Failed to load categories. Please check permissions." })
        }
    }, [showToast])

    useEffect(() => {
        const run = async () => {
            setIsLoading(true)
            try {
                await loadCategories()
            } finally {
                setIsLoading(false)
            }
        }
        void run()
    }, [loadCategories])

    const canCreate = hasPermission("category-product-create")
    const canEdit = hasPermission("category-product-edit")
    const canDelete = hasPermission("category-product-delete")

    const handleDeleteClick = useCallback((category: ProductCategory) => {
        if (!canDelete) return
        setCategoryToDelete(category)
        setDeleteConfirmOpen(true)
    }, [canDelete])

    const handleDeleteConfirm = useCallback(async () => {
        if (!categoryToDelete || !canDelete) return

        setDeletingId(categoryToDelete.id)
        try {
            await apiFetch(`/category-product/${categoryToDelete.id}`, { method: "DELETE" })
            showToast({ type: "success", message: "Category deleted" })
            await loadCategories()
        } catch (error) {
            console.error(error)
            showToast({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to delete category",
            })
        } finally {
            setDeletingId(null)
            setDeleteConfirmOpen(false)
            setCategoryToDelete(null)
        }
    }, [categoryToDelete, canDelete, loadCategories, showToast])

    const categoryColumns = useMemo(
        () =>
            createProductCategoryColumns({
                enableEdit: canEdit,
                enableDelete: canDelete,
                onDelete: canDelete ? handleDeleteClick : undefined,
                deletingId,
            }),
        [canEdit, canDelete, handleDeleteClick, deletingId]
    )

    const headerControls = useMemo(
        () => (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm min-w-[320px]">
                    <Search className="size-4 text-slate-400" />
                    <Input
                        placeholder="Search categories..."
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        className="border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
                {canCreate ? (
                    <Link
                        to="/category-product/create"
                        className={cn(
                            buttonVariants({ variant: "default" }),
                            "rounded-lg font-bold px-6 py-5 shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                        )}
                    >
                        Create
                    </Link>
                ) : null}
            </div>
        ),
        [search, canCreate]
    )

    return (
        <div className="flex flex-col gap-6 pb-10"> 

            {isLoading || permissionsLoading ? (
                <div className="p-10 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Loading Categories...
                </div>
            ) : (
                <ManagementDataTable 
                    columns={categoryColumns} 
                    data={categories} 
                    searchValue={search} 
                    headerControls={headerControls} 
                />
            )}

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleDeleteConfirm}
                title="Delete Category"
                description={`Are you sure you want to delete "${categoryToDelete?.name ?? ''}"? Some products may rely on this category.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                loading={!!deletingId}
            />
        </div>
    )
}

import { useEffect, useState, type FormEvent, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/context/toast"
import { usePermissions } from "@/context/permissions"
import { apiFetch } from "@/lib/api"
import type { ProductCategory, Product } from "./columns"

export default function ProductEditPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const { hasPermission, isLoading: isPermissionLoading } = usePermissions()
    const canEdit = hasPermission("products-edit")

    const [categories, setCategories] = useState<ProductCategory[]>([])
    const [isLoadingInitial, setIsLoadingInitial] = useState(true)
    const [formState, setFormState] = useState({
        name: "",
        code: "",
        categoryId: "",
        price: "",
        unit: "",
        status: "Available",
        description: "",
    })
    const [isSaving, setIsSaving] = useState(false)

    const loadData = useCallback(async () => {
        setIsLoadingInitial(true)
        try {
            const [productData, categoriesData] = await Promise.all([
                apiFetch<Product>(`/products/${id}`),
                apiFetch<ProductCategory[]>("/category-product")
            ])
            
            setCategories(Array.isArray(categoriesData) ? categoriesData : [])
            setFormState({
                name: productData.name,
                code: productData.code,
                categoryId: productData.categoryId,
                price: productData.price.toString(),
                unit: productData.unit ?? "",
                status: productData.status,
                description: productData.description ?? "",
            })
        } catch (error) {
            console.error("Failed to load product edit data:", error)
            showToast({ type: "error", message: "Failed to load product data" })
        } finally {
            setIsLoadingInitial(false)
        }
    }, [id, showToast])

    useEffect(() => {
        if (id) {
            void loadData()
        }
    }, [id, loadData])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!canEdit || isSaving) return

        if (!formState.name || !formState.code || !formState.categoryId || !formState.price) {
            showToast({ type: "error", message: "Please fill in all required fields" })
            return
        }

        setIsSaving(true)
        try {
            await apiFetch(`/products/${id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    name: formState.name.trim(),
                    code: formState.code.trim(),
                    categoryId: formState.categoryId,
                    price: parseFloat(formState.price),
                    unit: formState.unit.trim() || null,
                    status: formState.status,
                    description: formState.description.trim() || null,
                }),
            })

            showToast({ type: "success", message: "Product updated" })
            navigate("/products")
        } catch (error) {
            showToast({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to update product",
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (!isPermissionLoading && !canEdit) {
        return (
            <div className="flex flex-col items-start gap-4 pb-10">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-lg">
                    <ChevronLeft className="size-5" />
                </Button>
                <div className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-4 text-amber-800">
                    You do not have permission to edit products.
                </div>
            </div>
        )
    }

    if (isLoadingInitial) {
        return <div className="p-8 text-center text-sm text-slate-500">Loading product data...</div>
    }

    return (
        <div className="flex flex-col pb-10">
            <div className="sticky -top-6 z-10 -mx-4 md:-mx-8 bg-slate-50 py-3 border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-lg">
                        <ChevronLeft className="size-5" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Product</h1>
                </div>
                <Button
                    type="submit"
                    form="product-edit-form"
                    className="rounded-lg px-6 py-5 font-bold shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <form id="product-edit-form" onSubmit={handleSubmit} className="mt-4 space-y-6">
                <Card className="border border-slate-200 rounded-3xl">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-slate-800">Product Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Product Name</label>
                                <Input
                                    value={formState.name}
                                    onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                                    className="py-5"
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Code Product</label>
                                <Input
                                    value={formState.code}
                                    onChange={e => setFormState(prev => ({ ...prev, code: e.target.value }))}
                                    className="py-5"
                                    placeholder="e.g. PRD-001"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Category</label>
                                <select
                                    value={formState.categoryId}
                                    onChange={e => setFormState(prev => ({ ...prev, categoryId: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Price</label>
                                <Input
                                    type="number"
                                    value={formState.price}
                                    onChange={e => setFormState(prev => ({ ...prev, price: e.target.value }))}
                                    className="py-5"
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Unit</label>
                                <Input
                                    value={formState.unit}
                                    onChange={e => setFormState(prev => ({ ...prev, unit: e.target.value }))}
                                    className="py-5"
                                    placeholder="e.g. Kg, Liter"
                                />
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Status</label>
                                <select
                                    value={formState.status}
                                    onChange={e => setFormState(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
                                >
                                    <option value="Available">Available</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3 pt-6">
                            <p className="text-base font-semibold text-slate-800">Additional Information</p>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-600">Description</label>
                                <Textarea
                                    value={formState.description}
                                    onChange={e => setFormState(prev => ({ ...prev, description: e.target.value }))}
                                    className="min-h-[120px] rounded-2xl"
                                    placeholder="Enter product description..."
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}

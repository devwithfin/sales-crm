import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/context/toast"
import { usePermissions } from "@/context/permissions"
import { apiFetch } from "@/lib/api"

interface ProductCategory {
    id: string
    name: string
    createdAt: string
}

export default function ProductCategoryEdit() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const { hasPermission, isLoading: isPermissionLoading } = usePermissions()
    const canEdit = hasPermission("category-product-edit")

    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [errors, setErrors] = useState<{ name?: string }>({})

    const loadCategory = useCallback(async () => {
        if (!id) return
        try {
            const data = await apiFetch<ProductCategory>(`/category-product/${id}`)
            setName(data.name)
        } catch (error) {
            console.error("Failed to fetch category", error)
            showToast({ type: "error", message: "Failed to load category data" })
            navigate("/category-product")
        }
    }, [id, navigate, showToast])

    useEffect(() => {
        const run = async () => {
            setIsLoading(true)
            try {
                await loadCategory()
            } finally {
                setIsLoading(false)
            }
        }
        void run()
    }, [loadCategory])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!id || !canEdit || isSaving) return

        const trimmedName = name.trim()
        if (!trimmedName) {
            setErrors({ name: "Category name is required" })
            return
        }

        setErrors({})
        setIsSaving(true)
        try {
            await apiFetch(`/category-product/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ name: trimmedName }),
            })

            showToast({ type: "success", message: "Category updated" })
            navigate("/category-product")
        } catch (error) {
            console.error(error)
            showToast({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to update category",
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
                    You do not have permission to edit categories.
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col pb-10">
            <div className="sticky -top-6 z-10 -mx-4 md:-mx-8 bg-slate-50 py-3 border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-lg">
                        <ChevronLeft className="size-5" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Category</h1>
                </div>
                <Button
                    type="submit"
                    form="category-edit-form"
                    className="rounded-lg px-6 py-5 font-bold shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all"
                    disabled={isSaving || isLoading}
                >
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </div>

            {isLoading ? (
                <p className="text-sm text-slate-500 mt-4 px-2">Loading category data...</p>
            ) : (
                <form id="category-edit-form" onSubmit={handleSubmit} className="mt-4 space-y-6">
                    <Card className="border border-slate-200 rounded-3xl">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-slate-800">Category Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                    <label className="text-sm font-medium text-slate-600 w-32 shrink-0">Category Name</label>
                                    <div className="flex-1 space-y-1">
                                        <Input
                                            value={name}
                                            onChange={event => setName(event.target.value)}
                                            className="py-5"
                                            placeholder="e.g. Chemicals"
                                            disabled={isSaving}
                                            required
                                        />
                                        {errors.name ? <p className="text-xs text-red-500">{errors.name}</p> : null}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            )}
        </div>
    )
}

import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function ProductCreatePage() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col pb-10">
            <div className="sticky -top-6 z-10 -mx-4 md:-mx-8 bg-slate-50 py-3 border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(-1)}
                        className="rounded-lg"
                    >
                        <ChevronLeft className="size-5" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Product</h1>
                </div>
                <Button className="rounded-lg px-6 py-5 font-bold shadow-md shadow-primary/10 hover:shadow-primary/30 transition-all">Save</Button>
            </div>

            <Card className="mt-4 border border-slate-200 rounded-3xl">
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-slate-800">Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Product Name</label>
                            <Input className="py-5 flex-1" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">SKU</label>
                            <Input className="py-5 flex-1" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Category</label>
                            <Input className="py-5 flex-1" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Price</label>
                            <Input className="py-5 flex-1" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Unit</label>
                            <Input className="py-5 flex-1" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-600 w-32">Status</label>
                            <Input className="py-5 flex-1" />
                        </div>
                    </div>

                    <div className="space-y-3 pt-6">
                        <p className="text-base font-semibold text-slate-800">Additional Information</p>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-600">Description</label>
                            <Textarea className="min-h-[120px]" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
